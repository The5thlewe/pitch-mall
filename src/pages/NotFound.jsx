import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="wrap confirm">
      <div className="confirm-badge" style={{ background: 'var(--pm-danger)' }}>
        ?
      </div>
      <h1>Page not found</h1>
      <p className="lede" style={{ margin: '10px auto 0' }}>
        That page doesn't exist. Let's get you back to the shop.
      </p>
      <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>
        Back to shop
      </button>
    </div>
  );
}
