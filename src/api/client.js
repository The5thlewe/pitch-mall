// Thin fetch wrapper around https://api.oluwasetemi.dev
//
// - Normalizes errors into ApiError so callers can branch on status codes
//   (401/403 -> auth problem, 404 -> not found, 422 -> validation, etc.)
// - Applies a timeout so a hung request doesn't freeze the UI forever
// - Centralizes the base URL and JSON handling in one place

export const API_BASE_URL = 'https://api.oluwasetemi.dev';
const DEFAULT_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(message, { status, issues } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.issues = issues;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export async function apiFetch(path, { method = 'GET', body, token, query, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const url = new URL(API_BASE_URL + path);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, value);
    });
  }

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new NetworkError('The request timed out. The Pitch Mall catalog service may be unreachable.');
    }
    throw new NetworkError('Could not reach the Pitch Mall catalog service. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }

  // 204 No Content (used by DELETE) has no body to parse.
  if (response.status === 204) return null;

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error?.issues?.[0]?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, { status: response.status, issues: payload?.error?.issues });
  }

  return payload;
}
