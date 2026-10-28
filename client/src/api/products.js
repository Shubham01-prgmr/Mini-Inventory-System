import axios from 'axios';
import { API_BASE } from '../constants.js';

/**
 * Fetch products with optional filters.
 * @param {{ category?: string, search?: string }} params
 */
export async function fetchProducts({ category, search } = {}) {
  const params = {};
  if (category && category !== 'All') params.category = category;
  if (search && search.trim()) params.search = search.trim();
  const { data } = await axios.get(`${API_BASE}/api/products`, { params });
  return data;
}

/** Fetch a single product by id. */
export async function fetchProductById(id) {
  const { data } = await axios.get(`${API_BASE}/api/products/${id}`);
  return data;
}
