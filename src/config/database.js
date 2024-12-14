import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_CONFIG } from './database.config.js';
import Logger from '../utils/logger.js';

// Import all models to ensure they are registered
import '../models/index.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, DB_CONFIG.OPTIONS);
    Logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      Logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      Logger.warn('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, DB_CONFIG.RETRY_DELAY);
    });
  } catch (error) {
    Logger.error('MongoDB connection failed:', error.message);
    Logger.info(`Retrying connection in ${DB_CONFIG.RETRY_DELAY}ms...`);
    setTimeout(connectDB, DB_CONFIG.RETRY_DELAY);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    Logger.info('MongoDB disconnected successfully');
  } catch (error) {
    Logger.error('Error disconnecting from MongoDB:', error.message);
  }
};
