import { env } from "./env";

/**
 * Redis connection options for BullMQ.
 * We pass the URL string directly instead of an IORedis instance
 * to avoid version conflicts between ioredis and bullmq's bundled ioredis.
 */
export const redisConnectionOptions = {
  host: new URL(env.REDIS_URL).hostname || "localhost",
  port: parseInt(new URL(env.REDIS_URL).port || "6379", 10),
  maxRetriesPerRequest: null as null, // Required by BullMQ
};

/**
 * Log Redis connection status
 */
export const logRedisConfig = (): void => {
  console.log(
    `✅ Redis configured: ${redisConnectionOptions.host}:${redisConnectionOptions.port}`
  );
};
