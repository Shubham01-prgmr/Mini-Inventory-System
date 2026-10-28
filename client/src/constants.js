// Inline SVG placeholder used when a product image fails to load.
export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='22' fill='%236c757d' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export const CATEGORIES = [
  'All',
  'Electronics',
  'Apparel',
  'Groceries',
  'Home',
  'Books',
];

// Backend base URL. In dev this is empty so requests use the Vite proxy (/api).
export const API_BASE = import.meta.env.VITE_API_URL || '';
