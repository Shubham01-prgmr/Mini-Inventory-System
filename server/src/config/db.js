import mongoose from 'mongoose';

/**
 * Connect to MongoDB using MONGO_URI (falls back to a local db).
 * Exits the process if the connection fails so the server never
 * runs in a half-initialized state.
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

export default connectDB;
