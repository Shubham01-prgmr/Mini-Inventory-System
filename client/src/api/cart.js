import axios from 'axios';
import { API_BASE } from '../constants.js';

/** Get the current cart (populated with products, includes totals). */
export async function fetchCart() {
  const { data } = await axios.get(`${API_BASE}/api/cart`);
  return data;
}

/**
 * Set the desired total quantity of a product in the cart.
 * @param {string} productId
 * @param {number} quantity desired total quantity (0 removes the line)
 */
export async function updateCartItem(productId, quantity) {
  const { data } = await axios.post(`${API_BASE}/api/cart`, {
    productId,
    quantity,
  });
  return data;
}

/** Remove a product line from the cart (:id = product id). */
export async function removeCartItem(productId) {
  const { data } = await axios.delete(`${API_BASE}/api/cart/${productId}`);
  return data;
}
