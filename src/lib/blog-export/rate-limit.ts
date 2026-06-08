import "server-only";

import type { ExportKind } from "./types";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

const WINDOW_MS = 10 * 60 * 1000;
const LIMITS: Record<ExportKind, number> = {
  markdown: 20,
  pdf: 5,
};

const globalStore = globalThis as typeof globalThis & {
  __blogExportRateLimit?: Map<string, RateLimitEntry>;
};

function getStore() {
  if (!globalStore.__blogExportRateLimit) {
    globalStore.__blogExportRateLimit = new Map<string, RateLimitEntry>();
  }

  return globalStore.__blogExportRateLimit;
}

export function checkBlogExportRateLimit(
  userId: string,
  kind: ExportKind,
): RateLimitResult {
  const store = getStore();
  const now = Date.now();
  const key = `${userId}:${kind}`;
  const limit = LIMITS[kind];
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return { allowed: true };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      ),
    };
  }

  store.set(key, {
    count: existing.count + 1,
    resetAt: existing.resetAt,
  });

  return { allowed: true };
}
