import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swagger.js'; // Swagger 설정 파일
import { connectDB } from './config/database.js'; // MongoDB 연결 함수
import { router as apiRouter } from './routes/api.js';
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

// 환경에 따라 다른 포트 설정
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 13085 : 3000);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

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
app.listen(PORT, '0.0.0.0', () => {
  Logger.info(`Server is running on http://0.0.0.0:${PORT}`);
  Logger.info(
    `API Documentation available at http://${process.env.HOST || 'localhost'}:${PORT}/api-docs`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  Logger.error('Uncaught Exception:', err);
  process.exit(1);
});
