import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Return the single active cart document, creating it if it does not exist.
 * NOTE: this demo uses one shared cart. For multi-user, switch to per-user
 * carts keyed by an authenticated user id.
 */
async function getActiveCart() {
  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ items: [] });
  return cart;
}

/** Send the cart with products populated and virtuals (totalAmount/totalItems) included. */
async function sendCart(res, cart) {
  await cart.populate('items.product');
  res.json(cart);
}

/**
 * GET /api/cart
 * Returns the current cart with populated products and computed totals.
 */
export async function getCart(req, res, next) {
  try {
    const cart = await getActiveCart();
    await sendCart(res, cart);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/cart   body: { productId, quantity }
 *
 * `quantity` is the DESIRED TOTAL quantity of that product in the cart
 * (absolute, not a delta). The controller computes the delta against the
 * current cart line and adjusts product stock accordingly:
 *   - adding units  -> decrement product.stockQuantity
 *   - removing units -> increment product.stockQuantity
 *   - desiredQty = 0 -> remove the line and restore all stock
 *
 * Stock check uses (product.stockQuantity + currentCartQty) as the max
 * available, because stockQuantity already excludes units reserved in cart.
 */
export async function updateCart(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res
        .status(400)
        .json({ message: 'productId and quantity are required' });
    }

    const desiredQty = Number(quantity);
    if (Number.isNaN(desiredQty) || desiredQty < 0) {
      return res
        .status(400)
        .json({ message: 'quantity must be a non-negative number' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await getActiveCart();
    const line = cart.items.find((i) => i.product.equals(product._id));
    const currentQty = line ? line.quantity : 0;
    const available = product.stockQuantity + currentQty;

    if (desiredQty > available) {
      return res.status(400).json({
        message: `Insufficient stock for "${product.name}". Only ${available} available.`,
      });
    }

    // Adjust product stock by the delta
    const delta = desiredQty - currentQty; // >0 add, <0 remove
    product.stockQuantity = product.stockQuantity - delta;
    await product.save();

    // Update the cart line
    if (desiredQty === 0) {
      cart.items = cart.items.filter((i) => !i.product.equals(product._id));
    } else if (line) {
      line.quantity = desiredQty;
    } else {
      cart.items.push({ product: product._id, quantity: desiredQty });
    }
    await cart.save();

    await sendCart(res, cart);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cart/:id   (:id = product _id)
 * Removes the whole line item and restores its quantity to product stock.
 */
export async function removeFromCart(req, res, next) {
  try {
    const cart = await getActiveCart();
    const line = cart.items.find((i) => i.product.equals(req.params.id));
    if (!line) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Restore stock
    const product = await Product.findById(line.product);
    if (product) {
      product.stockQuantity += line.quantity;
      await product.save();
    }

    cart.items = cart.items.filter((i) => !i.product.equals(req.params.id));
    await cart.save();

    await sendCart(res, cart);
  } catch (err) {
    next(err);
  }
}
