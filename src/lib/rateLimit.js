const store = new Map();
const WINDOW_MS = 60 * 1000;
const MAX = 5;

export function checkRateLimit(identifier) {
  const now = Date.now();
  const key = identifier;
  let record = store.get(key);
  if (!record) {
    record = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, record);
    return { limited: false };
  }
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + WINDOW_MS;
    return { limited: false };
  }
  record.count += 1;
  if (record.count > MAX) {
    return { limited: true };
  }
  return { limited: false };
}
