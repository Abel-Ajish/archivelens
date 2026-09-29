const cache = new Map<string, { data: unknown; expires: number }>();
const inflight = new Map<string, Promise<unknown>>();

export const CACHE_TTL = {
  summary: 5 * 60 * 1000,
  timeline: 5 * 60 * 1000,
  captures: 60 * 1000,
  collinfo: 60 * 60 * 1000,
};

function cacheKey(prefix: string, params: Record<string, string>): string {
  const sorted = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return `${prefix}:${sorted}`;
}

export async function cached<T>(
  prefix: string,
  params: Record<string, string>,
  ttl: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const key = cacheKey(prefix, params);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }
  const existing = inflight.get(key);
  if (existing) {
    return existing as Promise<T>;
  }
  const promise = fetcher()
    .then((data) => {
      cache.set(key, { data, expires: Date.now() + ttl });
      inflight.delete(key);
      return data;
    })
    .catch((error) => {
      inflight.delete(key);
      throw error;
    });
  inflight.set(key, promise);
  return promise;
}

export function clearCache(): void {
  cache.clear();
}
