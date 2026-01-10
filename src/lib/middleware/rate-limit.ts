import { LRUCache } from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: async (limit: number, token: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const count = tokenCache.get(token) || [0];
        if (count[0] === 0) {
          tokenCache.set(token, count);
        }
        count[0] += 1;

        const currentUsage = count[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited
          ? reject(new Error('Rate limit exceeded'))
          : resolve();
      }),
  };
}

const limiter = rateLimit({
  interval: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  uniqueTokenPerInterval: 500,
});

export async function checkRateLimit(
  req: NextRequest,
  limit: number = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
): Promise<{ success: boolean; response?: NextResponse }> {
  const identifier = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

  try {
    await limiter.check(limit, identifier);
    return { success: true };
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      ),
    };
  }
}
