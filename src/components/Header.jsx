import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import NotificationBell from './NotificationBell.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Header() {
  const { user, signOut, cartItems, theme, setTheme } = useApp();
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  function handleSignOut() {
    signOut();
    navigate('/signup');
  }

  return (
    <header className="site">
      <div className="header-inner">
        <button className="brand-mark" onClick={() => navigate(user ? '/' : '/signup')} aria-label="Pitch Mall home">
          <Logo size={34} />
          <span>
            <span className="brand-word">Pitch Mall</span>
            <span className="brand-sub">FRESH GOODS · FAST DELIVERY</span>
          </span>
        </button>

        <nav className="top-nav">
          {user && (
            <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Shop
            </NavLink>
          )}
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Dashboard
            </NavLink>
          )}

          <button
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <NotificationBell />

          {user && (
            <button className="icon-btn" aria-label="Basket" onClick={() => navigate('/dashboard')}>
              🧺
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          )}

          {user ? (
            <button className="btn btn-ghost btn-sm hide-sm" onClick={handleSignOut}>
              Sign out
            </button>
          ) : (
            <>
              <NavLink to="/signin" className="nav-link hide-sm">
                Sign in
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-sm">
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
