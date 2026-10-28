import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Apparel', 'Groceries', 'Home', 'Books'],
    },
    // stockQuantity reflects REMAINING available stock (excludes items already in carts)
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Stock quantity cannot be negative'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
