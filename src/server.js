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
import { 
  limiter, 
  apiLimiter, 
  authLimiter, 
  sanitizeData, 
  preventXSS, 
  preventParamPollution 
} from './middleware/security.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(limiter); // Rate limiting
app.use('/api/', apiLimiter); // API rate limiting
app.use('/api/auth/', authLimiter); // Auth rate limiting
app.use(sanitizeData); // NoSQL injection prevention
app.use(preventXSS); // XSS prevention
app.use(preventParamPollution); // Parameter pollution prevention

// Basic middleware
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: err.status || 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});