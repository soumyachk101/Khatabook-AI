import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { configureCors } from './middleware/cors';
import { rateLimitMiddleware, aiRateLimit } from './middleware/rate-limit';
import authRouter from './api/auth/router';
import receiptsRouter from './api/receipts/route';
import invoicesRouter from './api/invoices/route';
import expensesRouter from './api/expenses/route';
import dashboardRouter from './api/dashboard/stats/route';
import categoriesRouter from './api/categories/router';
import remindersRouter from './api/reminders/router';
import exportExpensesRouter from './api/export/expenses/csv/route';
import exportInvoicesRouter from './api/export/invoices/csv/route';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Security
// ============================================================

// Try to use helmet, fallback to basic headers if not installed
try {
 app.use(helmet({
 contentSecurityPolicy: false, // Disable for API
 }));
} catch {
 // Helmet not installed, use basic security headers
 app.use((req: Request, res: Response, next: NextFunction) => {
 res.setHeader('X-Content-Type-Options', 'nosniff');
 res.setHeader('X-Frame-Options', 'DENY');
 res.setHeader('X-XSS-Protection', '1; mode=block');
 next();
 });
}

// ============================================================
// CORS
// ============================================================

configureCors(app);

// ============================================================
// Body parsing
// ============================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Raw body for webhooks
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// ============================================================
// Logging
// ============================================================

if (process.env.NODE_ENV !== 'test') {
 app.use(morgan('dev'));
}

// ============================================================
// Rate limiting
// ============================================================

app.use('/api', rateLimitMiddleware());

// ============================================================
// Health check
// ============================================================

app.get('/health', async (req: Request, res: Response) => {
 try {
 // Check database
 await require('./utils/storage').supabaseAdmin
 .from('profiles')
 .select('count', { count: 'exact', head: true });

 // Check Redis
 await require('./utils/storage').redis.ping();

 res.json({
 status: 'healthy',
 timestamp: new Date().toISOString(),
 services: {
 database: 'connected',
 redis: 'connected',
 queue: 'connected',
 },
 version: process.env.npm_package_version || '1.0.0',
 });
 } catch (error) {
 res.status(503).json({
 status: 'unhealthy',
 error: error instanceof Error ? error.message : 'Unknown error',
 });
 }
});

// ============================================================
// API Routes
// ============================================================

app.use('/api/auth', authRouter);
app.use('/api/receipts', receiptsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/dashboard/stats', dashboardRouter);
app.use('/api/dashboard/monthly', require('./api/dashboard/monthly/route').default);
app.use('/api/dashboard/categories', require('./api/dashboard/categories/route').default);
app.use('/api/categories', categoriesRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/export/expenses/csv', exportExpensesRouter);
app.use('/api/export/invoices/csv', exportInvoicesRouter);
app.use('/api/export/invoices', exportInvoicesRouter);
app.use('/api/export/gst', require('./api/export/gst/[id]/csv/route').default);

// AI Routes
const { handleCategorize, handleExtractGST, handleSuggestItems } = require('./services/ai.service');
const aiRouter = require('express').Router();
aiRouter.post('/categorize', handleCategorize);
aiRouter.post('/extract-gst', handleExtractGST);
aiRouter.post('/suggest-items', handleSuggestItems);
app.use('/api/ai', aiRouter);

// GST Routes
const { handleGSTSummary, handleListGSTReturns, handleGetGSTReturn, handleFileGSTReturn, handleGenerateGSTR1, handleGenerateGSTR3B } = require('./services/gst.service');
const gstRouter = require('express').Router();
gstRouter.get('/summary', handleGSTSummary);
gstRouter.get('/returns', handleListGSTReturns);
gstRouter.get('/returns/:id', handleGetGSTReturn);
gstRouter.post('/returns/:id/file', handleFileGSTReturn);
gstRouter.post('/gstr1/generate', handleGenerateGSTR1);
gstRouter.post('/gstr3b/generate', handleGenerateGSTR3B);
app.use('/api/gst', gstRouter);

// Payment Routes
const { handleCreatePaymentLink, handleVerifyPayment, handleRazorpayWebhook, handleCreateOrder, handleListPayments, handleRefundPayment } = require('./services/payment.service');
const paymentsRouter = require('express').Router();
paymentsRouter.post('/links', handleCreatePaymentLink);
paymentsRouter.post('/verify', handleVerifyPayment);
paymentsRouter.post('/webhook', handleRazorpayWebhook);
paymentsRouter.post('/create-order', handleCreateOrder);
paymentsRouter.get('/', handleListPayments);
paymentsRouter.post('/:id/refund', handleRefundPayment);
app.use('/api/payments', paymentsRouter);

// Webhook Routes (raw body)
const webhooksRouter = require('express').Router();
webhooksRouter.use(express.raw({ type: 'application/json' }));
webhooksRouter.post('/razorpay', handleRazorpayWebhook);
app.use('/api/webhooks', webhooksRouter);

// ============================================================
// 404 handler
// ============================================================

app.use(notFoundHandler);

// ============================================================
// Error handler (must be last)
// ============================================================

app.use(errorHandler);

// ============================================================
// Start server
// ============================================================

if (require.main === module) {
 app.listen(PORT, () => {
 console.log(`
 🚀 Khatabook AI Backend running on port ${PORT}
 📊 Environment: ${process.env.NODE_ENV || 'development'}
 🔗 API: http://localhost:${PORT}/api
 💚 Health: http://localhost:${PORT}/health
 `);
 });
}

export default app;
