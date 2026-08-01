/**
 * In-memory sliding-window rate limiter, keyed by client IP + a route
 * bucket name. Suitable for a single-instance app of this scale (a
 * demo/small-to-mid traffic job board). It resets on server restart and
 * does not coordinate across multiple server instances — for horizontal
 * scaling, swap the Map below for a shared store (e.g. Redis `INCR` +
 * `EXPIRE`, or Upstash's serverless rate-limit primitive) behind the same
 * `checkRateLimit` interface.
 */

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

// Periodically sweep expired buckets so memory doesn't grow unbounded.
const MAX_BUCKET_AGE_MS = 60 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > MAX_BUCKET_AGE_MS) buckets.delete(key);
  }
}, 10 * 60 * 1000).unref?.();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(
  request: Request,
  bucketName: string,
  options: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(request);
  const key = `${bucketName}:${ip}`;
  const now = Date.now();

  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= options.windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= options.limit) {
    const retryAfterSeconds = Math.ceil(
      (options.windowMs - (now - existing.windowStart)) / 1000
    );
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, remaining: options.limit - existing.count, retryAfterSeconds: 0 };
}

// Preset limits tuned for a job-board app of this scale.
export const RATE_LIMITS = {
  authLogin: { limit: 5, windowMs: 60_000 }, // 5 attempts / min / IP
  authSignup: { limit: 5, windowMs: 60 * 60_000 }, // 5 signups / hour / IP
  authVerifyResend: { limit: 3, windowMs: 60 * 60_000 },
  resumeUpload: { limit: 10, windowMs: 60 * 60_000 },
  jobMutation: { limit: 30, windowMs: 60_000 }, // admin create/edit/archive
  externalSync: { limit: 10, windowMs: 60_000 },
  general: { limit: 120, windowMs: 60_000 }, // generic API read fallback
} as const satisfies Record<string, RateLimitOptions>;
