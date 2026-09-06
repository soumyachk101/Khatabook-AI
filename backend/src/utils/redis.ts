import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
 console.warn("REDIS_URL not configured. Set it in .env for queue and cache support.");
}

export const redis = new Redis(redisUrl || "redis://localhost:6379", {
 maxRetriesPerRequest: 3,
 enableReadyCheck: true,
 retryStrategy: (times) => {
 const delay = Math.min(times * 50, 2000);
 return delay;
 },
});

redis.on("connect", () => {
 console.log("Redis connected");
});

redis.on("error", (err) => {
 console.error("Redis error:", err);
});

redis.on("ready", () => {
 console.log("Redis ready");
});

export default redis;
