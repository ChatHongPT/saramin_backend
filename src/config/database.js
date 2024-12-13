import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all models to ensure they are registered
import '../models/index.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};