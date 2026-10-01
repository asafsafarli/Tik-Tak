interface Entry {
  expires: number;
  promise: Promise<unknown>;
  value?: unknown;
  settled: boolean;
}

const store = new Map<string, Entry>();

export function cachedRequest<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && (!hit.settled || hit.expires > Date.now())) return hit.promise as Promise<T>;

  const entry: Entry = { expires: Infinity, promise: load(), settled: false };
  store.set(key, entry);
  entry.promise.then(
    (value) => {
      entry.value = value;
      entry.settled = true;
      entry.expires = Date.now() + ttlMs;
    },
    () => {
      if (store.get(key) === entry) store.delete(key);
    },
  );
  return entry.promise as Promise<T>;
}

export function peekCached<T>(key: string): T | undefined {
  const hit = store.get(key);
  return hit?.settled ? (hit.value as T) : undefined;
}

export function invalidateCache(prefix = "") {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
