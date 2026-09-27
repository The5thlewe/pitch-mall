import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as productsApi from '../api/products.js';
import { ApiError, NetworkError } from '../api/client.js';
import { FALLBACK_PRODUCTS } from '../data/goods.js';
import { useNotifications } from './NotificationContext.jsx';
import { useAdminAuth } from './AdminAuthContext.jsx';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const { notify } = useNotifications();
  const { accessToken, refreshSession } = useAdminAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.fetchProducts();
      const list = Array.isArray(res) ? res : res?.data || [];
      setProducts(list);
      setOffline(false);
    } catch (err) {
      // The live catalog is unreachable (network down, API offline, etc).
      // Fall back to a bundled product list so the storefront still works,
      // and say so clearly rather than showing a blank page.
      setProducts(FALLBACK_PRODUCTS);
      setOffline(true);
      setError(err instanceof NetworkError ? err.message : 'The live product catalog is unavailable right now.');
      notify({
        type: 'warning',
        title: 'Showing saved catalog',
        message: 'Pitch Mall\u2019s live inventory is unavailable — showing a saved copy instead.'
      });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  // Runs a mutation with the current admin token; if the API says the token
  // expired (401), refreshes once and retries before giving up.
  const withAuthRetry = useCallback(
    async (fn) => {
      try {
        return await fn(accessToken);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401 && accessToken) {
          const newToken = await refreshSession();
          return fn(newToken);
        }
        throw err;
      }
    },
    [accessToken, refreshSession]
  );

  const createProduct = useCallback(
    async (data) => {
      try {
        const created = await withAuthRetry((token) => productsApi.createProduct(data, token));
        setProducts((prev) => [created, ...prev]);
        notify({ type: 'success', title: 'Product created', message: `${created.name} was added to Pitch Mall.` });
        return { ok: true, product: created };
      } catch (err) {
        const message = describeMutationError(err, 'create');
        notify({ type: 'error', title: 'Could not create product', message });
        return { ok: false, error: message };
      }
    },
    [withAuthRetry, notify]
  );

  const updateProduct = useCallback(
    async (id, data) => {
      try {
        const updated = await withAuthRetry((token) => productsApi.updateProduct(id, data, token));
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        notify({ type: 'success', title: 'Product updated', message: `${updated.name} was updated.` });
        return { ok: true, product: updated };
      } catch (err) {
        const message = describeMutationError(err, 'update');
        notify({ type: 'error', title: 'Could not update product', message });
        return { ok: false, error: message };
      }
    },
    [withAuthRetry, notify]
  );

  const deleteProduct = useCallback(
    async (id) => {
      const existing = products.find((p) => p.id === id);
      try {
        await withAuthRetry((token) => productsApi.deleteProduct(id, token));
        setProducts((prev) => prev.filter((p) => p.id !== id));
        notify({ type: 'success', title: 'Product deleted', message: existing ? `${existing.name} was removed.` : 'Product removed.' });
        return { ok: true };
      } catch (err) {
        const message = describeMutationError(err, 'delete');
        notify({ type: 'error', title: 'Could not delete product', message });
        return { ok: false, error: message };
      }
    },
    [withAuthRetry, notify, products]
  );

  const value = { products, loading, offline, error, reload: load, createProduct, updateProduct, deleteProduct };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

function describeMutationError(err, action) {
  if (err instanceof NetworkError) return err.message;
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Your admin session has expired — please sign in again.';
    if (err.status === 403) return 'You can only manage products you created.';
    if (err.status === 404) return 'That product no longer exists.';
    if (err.status === 422) return err.issues?.[0]?.message || 'Check the product details and try again.';
    return err.message;
  }
  return `Could not ${action} the product. Please try again.`;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used inside <ProductsProvider>');
  return ctx;
}
