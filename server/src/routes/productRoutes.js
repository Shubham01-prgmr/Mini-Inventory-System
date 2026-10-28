import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = Router();

// GET /api/products        -> list (optional ?category=&search=)
// GET /api/products/:id     -> single product
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

export default router;
