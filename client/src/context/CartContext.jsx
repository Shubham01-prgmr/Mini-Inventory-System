import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as cartApi from '../api/cart.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Load cart once on mount
  const refresh = useCallback(async () => {
    try {
      const data = await cartApi.fetchCart();
      setCart(data);
    } catch (err) {
      // Backend may be down; keep an empty cart so the UI still renders.
      console.error('Failed to fetch cart:', err.message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Set the absolute quantity for a product in the cart (0 removes it). */
  const setQuantity = useCallback(async (productId, quantity) => {
    setLoading(true);
    try {
      const data = await cartApi.updateCartItem(productId, quantity);
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Convenience: add one unit to whatever is already in the cart. */
  const addToCart = useCallback(
    async (productId, currentQty = 0) => {
      return setQuantity(productId, (currentQty || 0) + 1);
    },
    [setQuantity]
  );

  /** Remove a product line entirely. */
  const removeItem = useCallback(async (productId) => {
    setLoading(true);
    try {
      const data = await cartApi.removeCartItem(productId);
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const items = cart.items || [];

  // Compute totals client-side (robust even if backend virtuals change)
  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * (i.quantity || 0),
    0
  );

  const value = {
    items,
    totalItems,
    totalAmount,
    loading,
    refresh,
    addToCart,
    setQuantity,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
