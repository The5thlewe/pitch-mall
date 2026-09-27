import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext.jsx';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  compareAtPrice: '',
  sku: '',
  quantity: '',
  category: '',
  tags: '',
  images: '',
  featured: false,
  published: true
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { products, createProduct, updateProduct, offline } = useProducts();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const existing = products.find((p) => p.id === id);
    if (!existing) {
      setNotFound(true);
      return;
    }
    setForm({
      name: existing.name || '',
      description: existing.description || '',
      price: existing.price ?? '',
      compareAtPrice: existing.compareAtPrice ?? '',
      sku: existing.sku || '',
      quantity: existing.quantity ?? '',
      category: existing.category || '',
      tags: existing.tags || '',
      images: existing.images || '',
      featured: Boolean(existing.featured),
      published: existing.published !== false
    });
  }, [id, isNew, products]);

  if (notFound) {
    return (
      <div className="wrap dash">
        <div className="panel">
          <h3>Product not found</h3>
          <p style={{ color: 'var(--text-soft)' }}>It may have been deleted already.</p>
          <Link className="btn btn-primary" to="/admin">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter a product name.';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price.';
    if (form.quantity !== '' && Number(form.quantity) < 0) next.quantity = 'Stock cannot be negative.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
      sku: form.sku.trim() || null,
      quantity: form.quantity === '' ? 0 : Number(form.quantity),
      category: form.category.trim() || null,
      tags: form.tags.trim() || null,
      images: form.images.trim(),
      featured: form.featured,
      published: form.published
    };

    const result = isNew ? await createProduct(payload) : await updateProduct(id, payload);
    setSubmitting(false);
    if (result.ok) navigate('/admin');
  }

  return (
    <div className="wrap dash">
      <div className="section-head">
        <h2>{isNew ? 'New product' : 'Edit product'}</h2>
        <Link className="btn btn-ghost btn-sm" to="/admin">
          ← Back to catalog
        </Link>
      </div>

      {offline && (
        <div className="banner banner-warning">
          The live catalog API is unreachable, so this can't be saved right now.
        </div>
      )}

      <form className="panel" onSubmit={handleSubmit} noValidate style={{ maxWidth: 640 }}>
        <div className="field">
          <label htmlFor="p-name">Name</label>
          <input
            id="p-name"
            type="text"
            value={form.name}
            className={errors.name ? 'err' : ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Vine Tomatoes"
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>

        <div className="field">
          <label htmlFor="p-desc">Description</label>
          <textarea
            id="p-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="1 kg basket, farm-picked"
          />
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label htmlFor="p-price">Price (₦)</label>
            <input
              id="p-price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              className={errors.price ? 'err' : ''}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="1200"
            />
            {errors.price && <div className="field-error">{errors.price}</div>}
          </div>
          <div className="field">
            <label htmlFor="p-compare">Compare-at price (₦)</label>
            <input
              id="p-compare"
              type="number"
              min="0"
              step="1"
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label htmlFor="p-qty">Stock quantity</label>
            <input
              id="p-qty"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              className={errors.quantity ? 'err' : ''}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="0 means not available"
            />
            {errors.quantity && <div className="field-error">{errors.quantity}</div>}
          </div>
          <div className="field">
            <label htmlFor="p-category">Category</label>
            <input
              id="p-category"
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Produce"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label htmlFor="p-sku">SKU</label>
            <input
              id="p-sku"
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div className="field">
            <label htmlFor="p-tags">Tags</label>
            <input
              id="p-tags"
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="comma, separated"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="p-images">Image URL</label>
          <input
            id="p-images"
            type="text"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="https://…  (leave blank to use a category icon)"
          />
        </div>

        <div className="field-toggles">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Feature on homepage
          </label>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible in the shop)
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 10 }} disabled={submitting || offline}>
          {submitting ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
