import { Request, Response, NextFunction } from 'express';
import { Ratelimit } from 'bullmq'; // Using Redis-based rate limiting
import { redis } from '../utils/storage';

// Rate limit tiers based on subscription plan
const TIER_LIMITS: Record<string, { windowMs: number; max: number; burstMax: number }> = {
 free: { windowMs: 60000, max: 100, burstMax: 20 },
 starter: { windowMs: 60000, max: 300, burstMax: 50 },
 pro: { windowMs: 60000, max: 500, burstMax: 100 },
 enterprise: { windowMs: 60000, max: 2000, burstMax: 500 },
};

// AI endpoints get stricter limits
const AI_LIMITS = { windowMs: 60000, max: 10, burstMax: 3 };

interface RateLimitConfig {
 windowMs: number;
 max: number;
 burstMax: number;
}

async function checkRateLimit(
 key: string,
 config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
 try {
 const { Redis } = await import('ioredis');
 const rateLimiter = new Ratelimit({
 connection: { host: 'localhost', port: 6379 } as any,
 limiter: Ratelimit.slidingWindow(config.max, `${config.windowMs / 1000} s`),
 });

 const { remaining, reset } = await rateLimiter.limit(key);

 return {
 allowed: remaining > 0,
 remaining,
 reset,
 };
 } catch {
 // If Redis is unavailable, allow the request
 return { allowed: true, remaining: config.max, reset: Date.now() + config.windowMs };
 }
}

export function rateLimitMiddleware(
 config: RateLimitConfig = { windowMs: 60000, max: 100, burstMax: 20 }
) {
 return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 const ip = req.ip || req.connection.remoteAddress || 'unknown';

 // Burst check (10-second window)
 const burstKey = `burst:${ip}`;
 const burstResult = await checkRateLimit(burstKey, {
 windowMs: 10000,
 max: config.burstMax,
 burstMax: config.burstMax,
 });

 if (!burstResult.allowed) {
 res.set({
 'X-RateLimit-Limit': config.burstMax.toString(),
 'X-RateLimit-Remaining': '0',
 'X-RateLimit-Reset': burstResult.reset.toString(),
 });

 res.status(429).json({
 success: false,
 error: {
 code: 'RATE_LIMIT_EXCEEDED',
 message: 'Too many requests. Please slow down.',
 },
 });
 return;
 }

 // Regular rate limit
 const rateLimitKey = `ratelimit:${ip}`;
 const result = await checkRateLimit(rateLimitKey, config);

 res.set({
 'X-RateLimit-Limit': config.max.toString(),
 'X-RateLimit-Remaining': result.remaining.toString(),
 'X-RateLimit-Reset': result.reset.toString(),
 });

 if (!result.allowed) {
 res.status(429).json({
 success: false,
 error: {
 code: 'RATE_LIMIT_EXCEEDED',
 message: 'Too many requests. Please try again later.',
 },
 });
 return;
 }

 next();
 };
}

export function aiRateLimit() {
 return rateLimitMiddleware(AI_LIMITS);
}

export function getRateLimitForUser(
 subscriptionPlan: string
): RateLimitConfig {
 return TIER_LIMITS[subscriptionPlan] || TIER_LIMITS.free;
}
