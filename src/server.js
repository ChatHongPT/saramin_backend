import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { router as apiRouter } from './routes/api.js';
import { swaggerDocs } from './docs/swagger.js';
import { connectDB } from './config/database.js';
import { serverConfig } from './config/server.config.js';
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

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(limiter);
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventParamPollution);

// Basic middleware
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger documentation
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Saramin API Documentation",
  swaggerOptions: {
    urls: [
      {
        url: `${serverConfig.getApiUrl()}/swagger.json`,
        name: 'Saramin API'
      }
    ]
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));

// Serve Swagger JSON
app.get('/api/swagger.json', (req, res) => {
  res.json(swaggerDocs);
});

// Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    docs: serverConfig.getSwaggerUrl()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const server = app.listen(serverConfig.port, '0.0.0.0', () => {
  Logger.info(`Server is running on port ${serverConfig.port}`);
  Logger.info(`API Documentation available at ${serverConfig.getSwaggerUrl()}`);
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