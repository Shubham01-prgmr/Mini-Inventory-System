import { Router } from 'express';
import { getCart, updateCart, removeFromCart } from '../controllers/cartController.js';

const router = Router();

// GET    /api/cart        -> current cart (populated, with totals)
// POST   /api/cart        -> add or update a line item  { productId, quantity }
// DELETE /api/cart/:id    -> remove a line item (:id = product id); restores stock
router.route('/').get(getCart).post(updateCart);
router.route('/:id').delete(removeFromCart);

export default router;
