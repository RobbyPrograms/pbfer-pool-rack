type Bucket = { hits: number; reset: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now > current.reset) {
    buckets.set(key, { hits: 1, reset: now + windowMs });
    return true;
  }
  if (current.hits >= limit) return false;
  current.hits += 1;
  return true;
}

export function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
