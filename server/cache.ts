import Redis from "ioredis";
import { createHash } from "crypto";
import "dotenv/config";

// Initialize Redis client
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
let redis: Redis | null = null;
let redisConnected = false;

try {
  redis = new Redis(redisUrl, {
    retryStrategy: (times) => {
      // Retry with exponential backoff, max 3 attempts
      if (times > 3) {
        console.warn("⚠️ Redis connection failed after 3 attempts. Continuing without cache.");
        return null; // Stop retrying
      }
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: true,
  });

  redis.on("connect", () => {
    redisConnected = true;
    console.log("✅ Redis connected");
  });

  redis.on("ready", () => {
    redisConnected = true;
    console.log("✅ Redis ready");
  });

  redis.on("error", (err) => {
    redisConnected = false;
    console.warn("⚠️ Redis error:", err.message);
  });

  redis.on("close", () => {
    redisConnected = false;
    console.warn("⚠️ Redis connection closed");
  });

  // Connection will happen lazily on first command
} catch (err) {
  console.warn("⚠️ Failed to initialize Redis:", err);
  redis = null;
}

/**
 * Normalizes CV text for consistent hashing
 * - Trims whitespace
 * - Removes extra whitespace
 */
function normalizeCvText(cvText: string): string {
  return cvText.trim().replace(/\s+/g, " ");
}

/**
 * Generates a cache key from CV text and role
 * Format: cv:analysis:{hash}
 */
export function getCacheKey(cvText: string, role: string): string {
  const normalized = normalizeCvText(cvText);
  const combined = `${normalized}|${role}`;
  const hash = createHash("sha256").update(combined).digest("hex");
  // v2 prefix to invalidate older cache entries that didn't include
  // the professional_summary heuristic
  return `cv:analysis:v2:${hash}`;
}

/**
 * Retrieves cached analysis result from Redis
 * Returns null if cache miss or Redis unavailable
 */
export async function getCachedResult(key: string): Promise<any | null> {
  if (!redis) {
    return null;
  }

  try {
    // Check connection status
    if (redis.status !== "ready" && redis.status !== "connect") {
      return null;
    }

    const cached = await redis.get(key);
    if (cached) {
      console.log("✅ Cache hit:", key);
      return JSON.parse(cached);
    }
    console.log("❌ Cache miss:", key);
    return null;
  } catch (err) {
    console.error("❌ Cache read error:", err);
    return null;
  }
}

/**
 * Stores analysis result in Redis with TTL
 * TTL: 7 days (604,800 seconds)
 */
export async function setCachedResult(
  key: string,
  result: object,
  ttlSeconds: number = 604800
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    // Check connection status
    if (redis.status !== "ready" && redis.status !== "connect") {
      return;
    }

    const serialized = JSON.stringify(result);
    await redis.setex(key, ttlSeconds, serialized);
    console.log("✅ Cached result:", key, `(TTL: ${ttlSeconds}s)`);
  } catch (err) {
    console.error("❌ Cache write error:", err);
    // Don't throw - cache write failure shouldn't break the request
  }
}

/**
 * Checks if Redis is available
 */
export function isRedisAvailable(): boolean {
  return redisConnected && redis !== null;
}

