import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function SignUp() {
  const { signUp, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  if (user) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your full name.';
    if (!form.email.trim()) next.email = 'Enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'That email address looks incomplete.';
    if (!form.password || form.password.length < 4) next.password = 'Use at least 4 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    signUp(form);
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="sub">Sign up to start ordering from Pitch Mall — you'll need an account before you can browse the store.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              className={errors.name ? 'err' : ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Amaka Chukwu"
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={form.email}
              className={errors.email ? 'err' : ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              className={errors.password ? 'err' : ''}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Create account
          </button>
        </form>

        <div className="switch-line">
          Already have an account? <Link to="/signin">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
