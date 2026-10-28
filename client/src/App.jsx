import { useState, useEffect, useMemo } from 'react';
import { CartProvider } from './context/CartContext.jsx';
import AppNavbar from './components/Navbar.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';
import { fetchProducts } from './api/products.js';
import { CATEGORIES } from './constants.js';

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const categories = useMemo(() => CATEGORIES, []);

  // Fetch products whenever search/category changes (debounced 300ms)
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await fetchProducts({ category, search });
        if (active) setProducts(data);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load products');
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [category, search]);

  return (
    <CartProvider>
      <AppNavbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Products</h2>
          <span className="text-muted small">{products.length} item(s)</span>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <ProductGrid
          products={products}
          loading={loading}
          onSelect={setSelectedProduct}
        />
      </main>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Footer />
    </CartProvider>
  );
}

export default function App() {
  return <Store />;
}
