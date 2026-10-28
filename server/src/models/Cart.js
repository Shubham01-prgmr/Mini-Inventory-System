import mongoose from 'mongoose';

/**
 * A cart line item references a Product and stores the chosen quantity.
 */
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    // For this demo we use a single active cart document.
    items: [cartItemSchema],
  },
  { timestamps: true }
);

/**
 * Total cost across all items. Requires `items.product` to be populated
 * (the controllers always populate before returning).
 */
cartSchema.virtual('totalAmount').get(function () {
  return this.items.reduce((sum, item) => {
    const price = item.product && item.product.price ? item.product.price : 0;
    return sum + price * item.quantity;
  }, 0);
});

/** Total number of units in the cart (sum of quantities). */
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Include virtuals when serializing to JSON / objects
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

export default mongoose.model('Cart', cartSchema);
