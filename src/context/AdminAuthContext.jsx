import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { adminLogin, adminRegister, adminRefresh } from '../api/auth.js';
import { ApiError, NetworkError } from '../api/client.js';
import { safeGet, safeSet, safeRemove } from '../utils/storage.js';
import { useNotifications } from './NotificationContext.jsx';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const { notify } = useNotifications();
  const [session, setSession] = useState(() => safeGet('pm_admin_session', null));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) safeSet('pm_admin_session', session);
    else safeRemove('pm_admin_session');
  }, [session]);

  const register = useCallback(
    async (form) => {
      setBusy(true);
      try {
        const res = await adminRegister(form);
        setSession({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken });
        notify({ type: 'success', title: 'Admin account created', message: `Welcome, ${res.user.name}.` });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: describeAuthError(err) };
      } finally {
        setBusy(false);
      }
    },
    [notify]
  );

  const login = useCallback(
    async (form) => {
      setBusy(true);
      try {
        const res = await adminLogin(form);
        setSession({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken });
        notify({ type: 'success', title: 'Signed in', message: `Welcome back, ${res.user.name}.` });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: describeAuthError(err) };
      } finally {
        setBusy(false);
      }
    },
    [notify]
  );

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  // Tries the current access token first. If a call reports 401, refreshes
  // once using the refresh token and hands back the new token so the caller
  // can retry the request. Throws (and logs the admin out) if refresh fails.
  const refreshSession = useCallback(async () => {
    if (!session?.refreshToken) {
      setSession(null);
      throw new ApiError('Session expired', { status: 401 });
    }
    try {
      const res = await adminRefresh(session.refreshToken);
      const next = { ...session, accessToken: res.accessToken, refreshToken: res.refreshToken };
      setSession(next);
      return next.accessToken;
    } catch (err) {
      setSession(null);
      notify({ type: 'warning', title: 'Session expired', message: 'Sign in again to keep managing products.' });
      throw err;
    }
  }, [session, notify]);

  const value = {
    admin: session?.user || null,
    accessToken: session?.accessToken || null,
    isAdmin: Boolean(session?.accessToken),
    busy,
    register,
    login,
    logout,
    refreshSession
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

function describeAuthError(err) {
  if (err instanceof NetworkError) return err.message;
  if (err instanceof ApiError) {
    if (err.status === 409) return 'An account with that email already exists — try signing in instead.';
    if (err.status === 401) return 'Incorrect email or password.';
    if (err.status === 422) return err.issues?.[0]?.message || 'Check the details you entered and try again.';
    return err.message;
  }
  return 'Something went wrong. Please try again.';
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}
