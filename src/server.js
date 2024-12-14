import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { router as apiRouter } from './routes/api.js';
import { swaggerDocs } from './docs/swagger.js';
import { connectDB } from './config/database.js';
import {
  limiter,
  apiLimiter,
  authLimiter,
  sanitizeData,
  preventXSS,
  preventParamPollution,
} from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import Logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000; // 기본 포트를 로컬용으로 설정

// Security middleware
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventParamPollution);

// Basic middleware
app.use(requestLogger); // Add request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const server = app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
  Logger.info(
    `API Documentation available at ${
      process.env.PORT === '13085'
        ? `http://113.198.66.75:${PORT}/api-docs`
        : `http://localhost:${PORT}/api-docs`
    }`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  Logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
