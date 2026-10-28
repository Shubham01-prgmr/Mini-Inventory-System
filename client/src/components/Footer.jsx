import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container className="text-center">
        <p className="mb-1 fw-semibold">ShopKart — Mini E-Commerce Demo</p>
        <p className="mb-0 text-secondary small">
          Built with React, Bootstrap, Node.js, Express &amp; MongoDB.
        </p>
      </Container>
    </footer>
  );
}
