import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { formatNaira } from '../../utils/format.js';

export default function AdminDashboard() {
  const { products, loading, offline, error, reload, deleteProduct } = useProducts();
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function handleDelete(id) {
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
    setConfirmId(null);
  }

  function handleSignOut() {
    logout();
    navigate('/');
  }

  return (
    <div className="wrap dash">
      <div className="dash-hero">
        <div>
          <h1>Admin · Product catalog</h1>
          <p>Signed in as {admin?.name || admin?.email}. Create, edit, and remove products live on Pitch Mall.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={handleSignOut}>
            Sign out
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/products/new')} disabled={offline}>
            + New product
          </button>
        </div>
      </div>

      {offline && (
        <div className="banner banner-warning">
          {error || 'The live catalog API is unreachable.'} Creating, editing and deleting are disabled until it's back.{' '}
          <button className="link-btn" onClick={reload}>
            Retry
          </button>
        </div>
      )}

      <div className="panel">
        <h3>All products ({products.length})</h3>

        {loading ? (
          <div className="empty-state">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="e-ico">🗃️</div>
            No products yet — create your first one.
          </div>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      {p.featured && <span className="chip-mini">Featured</span>}
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>{formatNaira(p.price)}</td>
                    <td>{typeof p.quantity === 'number' ? p.quantity : '—'}</td>
                    <td>
                      <span className={'chip-mini ' + (p.published === false ? 'chip-muted' : 'chip-live')}>
                        {p.published === false ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Link className="btn btn-ghost btn-sm" to={`/admin/products/${p.id}/edit`}>
                          Edit
                        </Link>
                        {confirmId === p.id ? (
                          <>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'var(--pm-danger)', color: '#fff' }}
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                            >
                              {deletingId === p.id ? 'Deleting…' : 'Confirm'}
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmId(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmId(p.id)} disabled={offline}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
