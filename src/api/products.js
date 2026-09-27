import { apiFetch } from './client.js';

// GET /products is public. Create/update/delete work without a token too,
// but pass one when we have it (the admin session) so mutations are
// attributed to that account rather than left ownerless.

export function fetchProducts(query = {}) {
  return apiFetch('/products', { query: { all: true, ...query } });
}

export function fetchProduct(id) {
  return apiFetch(`/products/${id}`);
}

export function createProduct(data, token) {
  return apiFetch('/products', { method: 'POST', body: data, token });
}

export function updateProduct(id, data, token) {
  return apiFetch(`/products/${id}`, { method: 'PATCH', body: data, token });
}

export function deleteProduct(id, token) {
  return apiFetch(`/products/${id}`, { method: 'DELETE', token });
}
