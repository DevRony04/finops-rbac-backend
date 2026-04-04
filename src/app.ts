import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { sendError } from './utils/response.util';
import { setupSwagger } from './config/swagger';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});
app.use('/api', limiter);

// Routes
app.use('/api', apiRoutes);

// Swagger Documentation
setupSwagger(app);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Finance Access Control API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404
app.use((req: Request, res: Response, next: NextFunction) => {
  sendError(res, 404, 'Route not found', 'ROUTE_NOT_FOUND');
});

// Global Error Handler
app.use(errorHandler);

export default app;
