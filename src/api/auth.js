import { apiFetch } from './client.js';

// These hit the real api.oluwasetemi.dev JWT auth endpoints and are used
// only for the Pitch Mall *admin* area — separate from the storefront's
// local customer sign up, which never needs a real backend session.

export function adminRegister({ name, email, password }) {
  return apiFetch('/auth/register', { method: 'POST', body: { name, email, password } });
}

export function adminLogin({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } });
}

export function adminRefresh(refreshToken) {
  return apiFetch('/auth/refresh', { method: 'POST', body: { refreshToken } });
}

export function adminMe(token) {
  return apiFetch('/auth/me', { token });
}
