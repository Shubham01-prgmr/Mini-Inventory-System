import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, loading, onSelect }) {
  // First load with no products yet -> spinner
  if (loading && products.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <div className="text-muted mt-2">Loading products…</div>
      </div>
    );
  }

  // No matches -> friendly empty state
  if (products.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        No products found. Try a different search or category.
      </Alert>
    );
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {products.map((p) => (
        <Col key={p._id} className="d-flex">
          <ProductCard product={p} onSelect={onSelect} />
        </Col>
      ))}
    </Row>
  );
}
