import cors from 'cors';
import { Express } from 'express';

export function configureCors(app: Express): void {
 const corsOptions: cors.CorsOptions = {
 origin: (origin, callback) => {
 // Allow requests with no origin (mobile apps, curl, etc.)
 if (!origin) return callback(null, true);

 const allowedOrigins = [
 process.env.APP_URL || 'http://localhost:3000',
 process.env.API_URL || 'http://localhost:3000',
 'https://khatabookai.com',
 'https://app.khatabookai.com',
 'https://api.khatabookai.com',
 'http://localhost:3001',
 'http://localhost:5173',
 ];

 if (process.env.NODE_ENV === 'development') {
 allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
 }

 if (allowedOrigins.includes(origin)) {
 callback(null, true);
 } else {
 callback(new Error(`Origin ${origin} not allowed by CORS`));
 }
 },
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
 exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'X-Total-Count'],
 maxAge: 86400, // 24 hours
 };

 app.use(cors(corsOptions));

 // Handle preflight requests
 app.options('*', cors(corsOptions));
}
