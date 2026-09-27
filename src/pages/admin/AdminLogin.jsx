import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

export default function AdminLogin() {
  const { login, register, busy, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/admin';

  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  if (isAdmin) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  function validate() {
    const next = {};
    if (mode === 'register' && !form.name.trim()) next.name = 'Enter an admin name.';
    if (!form.email.trim()) next.email = 'Enter an email address.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'That email address looks incomplete.';
    if (!form.password || form.password.length < 6) next.password = 'Use at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const result = mode === 'register' ? await register(form) : await login(form);
    if (result.ok) navigate(redirectTo, { replace: true });
    else setServerError(result.error);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>{mode === 'register' ? 'Create admin account' : 'Admin sign in'}</h1>
        <p className="sub">
          {mode === 'register'
            ? 'Register against the Pitch Mall products API to manage the catalog.'
            : 'Sign in to create, edit, and delete products from the live catalog.'}
        </p>

        {serverError && <div className="banner banner-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="admin-name">Name</label>
              <input
                id="admin-name"
                type="text"
                value={form.name}
                className={errors.name ? 'err' : ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Store admin"
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>
          )}

          <div className="field">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              value={form.email}
              className={errors.email ? 'err' : ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@pitchmall.dev"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={form.password}
              className={errors.password ? 'err' : ''}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'register' ? 'Create admin account' : 'Sign in'}
          </button>
        </form>

        <div className="switch-line">
          {mode === 'register' ? (
            <>
              Already an admin?{' '}
              <button className="link-btn" onClick={() => setMode('signin')}>
                Sign in
              </button>
            </>
          ) : (
            <>
              Need an admin account?{' '}
              <button className="link-btn" onClick={() => setMode('register')}>
                Register
              </button>
            </>
          )}
        </div>
        <div className="switch-line">
          <Link to="/">← Back to storefront</Link>
        </div>
      </div>
    </div>
  );
}
