import { Navbar, Container, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext.jsx';

/**
 * Responsive navbar with:
 *  - live search input (updates parent state on every keystroke)
 *  - category filter dropdown
 *  - cart button with a live badge showing total item count
 */
export default function AppNavbar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  onCartClick,
}) {
  const { totalItems } = useCart();

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          🛍️ ShopKart
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav" className="justify-content-between">
          <Nav className="d-flex align-items-center gap-2 my-2 my-lg-0">
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              style={{ maxWidth: 200 }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </Form.Select>
          </Nav>

          <Form className="d-flex my-2 my-lg-0" role="search" style={{ minWidth: 260 }}>
            <FormControl
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </Form>

          <Button
            variant="outline-light"
            onClick={onCartClick}
            className="position-relative my-2 my-lg-0"
          >
            🛒 Cart
            {totalItems > 0 && (
              <Badge
                pill
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
