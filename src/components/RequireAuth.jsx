import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

// Gates the whole app behind sign up / sign in. Anyone without an active
// session is bounced to /signup (with the page they wanted attached, so we
// can send them onward after they sign in) rather than shown a broken or
// half-loaded page.
export default function RequireAuth({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }
  return children;
}
