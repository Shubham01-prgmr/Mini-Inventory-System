import { Card, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext.jsx';
import { FALLBACK_IMAGE } from '../constants.js';

export default function ProductCard({ product, onSelect }) {
  const { addToCart, items } = useCart();

  const inCart = items.find((i) => i.product?._id === product._id)?.quantity || 0;
  const remaining = product.stockQuantity; // remaining unreserved stock
  const canAdd = remaining > 0;

  const handleAdd = () => {
    addToCart(product._id, inCart).catch((err) =>
      alert(err.response?.data?.message || 'Could not add to cart')
    );
  };

  return (
    <Card className="h-100 shadow-sm product-card">
      <div style={{ cursor: 'pointer' }} onClick={() => onSelect(product)}>
        <Card.Img
          variant="top"
          src={product.imageUrl || FALLBACK_IMAGE}
          alt={product.name}
          style={{ height: 200, objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary">{product.category}</Badge>
        </div>

        <Card.Title
          className="mb-1"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(product)}
        >
          {product.name}
        </Card.Title>

        <Card.Text className="text-muted small flex-grow-1">
          {product.description
            ? product.description.slice(0, 80) +
              (product.description.length > 80 ? '…' : '')
            : 'No description available.'}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="fw-bold fs-5">${product.price.toFixed(2)}</span>
          <span className={canAdd ? 'text-success small' : 'text-danger small'}>
            {canAdd ? `In stock: ${remaining}` : 'Out of stock'}
          </span>
        </div>

        {inCart > 0 && (
          <div className="text-muted small mt-1">In cart: {inCart}</div>
        )}

        <Button
          variant="primary"
          className="mt-3 w-100"
          disabled={!canAdd}
          onClick={handleAdd}
        >
          {canAdd ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </Card.Body>
    </Card>
  );
}
