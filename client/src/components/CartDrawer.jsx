import { Offcanvas, Button, ListGroup, Stack, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext.jsx';
import { FALLBACK_IMAGE } from '../constants.js';

/**
 * Slide-out cart (Offcanvas). Shows each line item with +/- quantity
 * controls, a remove button, and the live grand total.
 */
export default function CartDrawer({ open, onClose }) {
  const { items, totalAmount, totalItems, setQuantity, removeItem } = useCart();

  return (
    <Offcanvas
      show={open}
      onHide={onClose}
      placement="end"
      className="offcanvas-cart"
      aria-label="Shopping cart"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>🛒 Your Cart ({totalItems})</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {items.length === 0 ? (
          <Alert variant="light" className="text-center">
            Your cart is empty.
          </Alert>
        ) : (
          <>
            <ListGroup variant="flush">
              {items.map((item) => {
                const p = item.product;
                if (!p) return null;

                // Max units the user can hold = current in cart + remaining stock
                const maxQty = item.quantity + p.stockQuantity;

                return (
                  <ListGroup.Item key={p._id} className="d-flex gap-3 align-items-center py-3">
                    <img
                      src={p.imageUrl || FALLBACK_IMAGE}
                      alt={p.name}
                      width={64}
                      height={64}
                      className="cart-line-img"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div className="flex-grow-1">
                      <div className="fw-semibold">{p.name}</div>
                      <div className="text-muted small">${p.price.toFixed(2)} each</div>

                      <div className="mt-2 d-flex align-items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() =>
                            setQuantity(p._id, item.quantity - 1).catch((err) =>
                              alert(err.response?.data?.message || 'Update failed')
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </Button>
                        <span className="px-2 fw-semibold">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          disabled={item.quantity >= maxQty}
                          onClick={() =>
                            setQuantity(p._id, item.quantity + 1).catch((err) =>
                              alert(err.response?.data?.message || 'Update failed')
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="ms-2"
                          onClick={() =>
                            removeItem(p._id).catch((err) =>
                              alert(err.response?.data?.message || 'Remove failed')
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="fw-bold text-end">
                      ${(p.price * item.quantity).toFixed(2)}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>

            <hr />

            <Stack direction="horizontal" className="justify-content-between mb-3">
              <h5 className="mb-0">Grand Total</h5>
              <h4 className="mb-0 text-primary">${totalAmount.toFixed(2)}</h4>
            </Stack>

            <Button
              variant="success"
              className="w-100"
              onClick={() => alert('Checkout coming soon!')}
            >
              Checkout
            </Button>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
