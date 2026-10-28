import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();

/* ------------------------------------------------------------------ */
/* Middleware                                                          */
/* ------------------------------------------------------------------ */
// CORS: allow the configured frontend origin (defaults to Vite dev port)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
// JSON body parser
app.use(express.json());

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

/* ------------------------------------------------------------------ */
/* 404 + Error handling                                                */
/* ------------------------------------------------------------------ */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handler (must have 4 args for Express to treat it as error middleware)
app.use((err, req, res, next) => {
  console.error(err);
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id format' });
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

/* ------------------------------------------------------------------ */
/* Start                                                               */
/* ------------------------------------------------------------------ */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   API base: http://localhost:${PORT}/api`);
  });
});
