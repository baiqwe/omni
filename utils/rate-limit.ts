type RateLimitState = {
  count: number;
  resetAt: number;
};

const stores = new Map<string, Map<string, RateLimitState>>();

function getStore(name: string) {
  let store = stores.get(name);
  if (!store) {
    store = new Map<string, RateLimitState>();
    stores.set(name, store);
  }
  return store;
}

async function consumeInMemoryRateLimit(opts: {
  scope: string;
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const store = getStore(opts.scope);
  const current = store.get(opts.key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + opts.windowMs };
    store.set(opts.key, next);
    return {
      allowed: true,
      remaining: Math.max(opts.limit - 1, 0),
      resetAt: next.resetAt,
    };
  }

  if (current.count >= opts.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  store.set(opts.key, current);

  return {
    allowed: true,
    remaining: Math.max(opts.limit - current.count, 0),
    resetAt: current.resetAt,
  };
}

export async function consumeRateLimit(opts: {
  scope: string;
  key: string;
  limit: number;
  windowMs: number;
}) {
  const { isCloudflareDataBackend } = await import("@/utils/backend/runtime");

  if (isCloudflareDataBackend()) {
    try {
      const { getOptionalCloudflareEnv } = await import("@/utils/cloudflare/context");
      const env = getOptionalCloudflareEnv();
      const kv = env?.RATE_LIMIT_KV;

      if (kv) {
        const now = Date.now();
        const bucketStart = Math.floor(now / opts.windowMs) * opts.windowMs;
        const resetAt = bucketStart + opts.windowMs;
        const kvKey = `rl:${opts.scope}:${opts.key}:${bucketStart}`;
        const existing = await kv.get(kvKey);
        const currentCount = Number.parseInt(existing || "0", 10);
        const nextCount = Number.isFinite(currentCount) ? currentCount + 1 : 1;

        await kv.put(kvKey, String(nextCount), {
          expirationTtl: Math.max(Math.ceil((resetAt - now) / 1000) + 30, 30),
        });

        if (nextCount > opts.limit) {
          return {
            allowed: false,
            remaining: 0,
            resetAt,
          };
        }

        return {
          allowed: true,
          remaining: Math.max(opts.limit - nextCount, 0),
          resetAt,
        };
      }
    } catch {
      // Fall through to in-memory mode for local/dev fallback.
    }
  }

  return consumeInMemoryRateLimit(opts);
}
