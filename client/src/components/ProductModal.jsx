import { Modal, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext.jsx';
import { FALLBACK_IMAGE } from '../constants.js';

export default function ProductModal({ product, onClose }) {
  const { addToCart, items } = useCart();
  const show = !!product;

  const inCart = product
    ? items.find((i) => i.product?._id === product._id)?.quantity || 0
    : 0;

  const handleAdd = () => {
    addToCart(product._id, inCart).catch((err) =>
      alert(err.response?.data?.message || 'Could not add to cart')
    );
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      {product && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>{product.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-md-5">
                <img
                  src={product.imageUrl || FALLBACK_IMAGE}
                  alt={product.name}
                  className="img-fluid rounded w-100"
                  style={{ maxHeight: 360, objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="col-md-7">
                <Badge bg="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h3 className="text-primary mb-2">${product.price.toFixed(2)}</h3>
                <p className={product.stockQuantity > 0 ? 'text-success' : 'text-danger'}>
                  {product.stockQuantity > 0
                    ? `In stock: ${product.stockQuantity}`
                    : 'Out of stock'}
                </p>
                <hr />
                <p className="text-muted">{product.description || 'No description available.'}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={product.stockQuantity <= 0}
              onClick={handleAdd}
            >
              {product.stockQuantity <= 0 ? 'Unavailable' : 'Add to Cart'}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
