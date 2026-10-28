import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

dotenv.config();

/**
 * Sample catalog. imageUrl uses Unsplash; the frontend also has an
 * onError fallback, so missing images degrade gracefully.
 */
const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Over-ear headphones with active noise cancellation, Bluetooth 5.3, and 30 hours of battery life. Plush memory-foam earcups for all-day comfort.',
    price: 129.99,
    category: 'Electronics',
    stockQuantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    name: 'Smart Watch Series 6',
    description:
      'Fitness and health tracking with heart-rate sensor, GPS, sleep tracking, and a bright always-on AMOLED display. Water resistant to 50m.',
    price: 199.5,
    category: 'Electronics',
    stockQuantity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
  {
    name: 'UltraBook Pro 14" Laptop',
    description:
      'Thin and light 14" laptop with 16GB RAM, 512GB SSD, and an all-day battery. Perfect for work, study, and streaming.',
    price: 1099.0,
    category: 'Electronics',
    stockQuantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b38a084?w=600&q=80',
  },
  {
    name: 'Classic Running Sneakers',
    description:
      'Lightweight running shoes with cushioned midsoles and breathable mesh uppers. Great for daily runs and casual wear.',
    price: 79.99,
    category: 'Apparel',
    stockQuantity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    name: 'Cotton Crew T-Shirt',
    description:
      '100% organic cotton crew-neck tee in a relaxed fit. Soft, durable, and available in multiple sizes.',
    price: 19.99,
    category: 'Apparel',
    stockQuantity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  },
  {
    name: 'Leather Travel Backpack',
    description:
      'Water-resistant backpack with a padded 15" laptop sleeve, USB charging port, and anti-theft pockets.',
    price: 89.0,
    category: 'Apparel',
    stockQuantity: 22,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  },
  {
    name: 'Polarized Sunglasses',
    description:
      'UV400 polarized lenses with a lightweight acetate frame. Includes a hard case and microfiber pouch.',
    price: 49.99,
    category: 'Apparel',
    stockQuantity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-7311d20b4a2a?w=600&q=80',
  },
  {
    name: 'Arabica Coffee Beans 1kg',
    description:
      'Single-origin medium-dark roast Arabica beans with notes of chocolate and citrus. Whole bean, freshly roasted.',
    price: 24.5,
    category: 'Groceries',
    stockQuantity: 75,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  },
  {
    name: 'Organic Avocados (6 pack)',
    description:
      'Six ripe, organic Hass avocados. Perfect for toast, salads, and guacamole. Ripen at room temperature.',
    price: 12.0,
    category: 'Groceries',
    stockQuantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1601039641847-7857b9bef5a4?w=600&q=80',
  },
  {
    name: 'The Pragmatic Programmer',
    description:
      'Classic software engineering book by Hunt and Thomas. Practical, timeless advice on craftsmanship and career.',
    price: 39.99,
    category: 'Books',
    stockQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
  },
];

async function run() {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Product.insertMany(products);
    console.log(`🌱 Seeded ${products.length} products and cleared carts.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

run();
