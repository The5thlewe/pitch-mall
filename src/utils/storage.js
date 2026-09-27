// Small wrapper around localStorage so a storage failure (private browsing,
// quota exceeded, disabled storage) never crashes the app — it just falls
// back to in-memory state for that session.

export function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Could not read "${key}" from storage:`, err);
    return fallback;
  }
}

export function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Could not persist "${key}" to storage:`, err);
    return false;
  }
}

export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Could not clear "${key}" from storage:`, err);
  }
}
