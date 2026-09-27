import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap foot-inner">
        <span>© {new Date().getFullYear()} Pitch Mall</span>
        <span>Fresh goods, delivered across ENUGU</span>
        <Link to="/admin" className="footer-admin-link">
          Admin
        </Link>
      </div>
    </footer>
  );
}
