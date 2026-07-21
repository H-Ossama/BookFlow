import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import passport from './config/passport';

const app: Application = express();

// Security Middlewares
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || 'bookinghub.com';
const isDev = process.env.NODE_ENV !== 'production';

app.use(helmet({
  contentSecurityPolicy: isDev ? false : {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", FRONTEND_URL],
      fontSrc: ["'self'", "data:"],
    },
  },
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === FRONTEND_URL) return callback(null, true);
    if (isDev && /\.localhost:\d+$/.test(origin)) return callback(null, true);
    if (ROOT_DOMAIN && new RegExp(`\\.${ROOT_DOMAIN.replace(/\./g, '\\.')}$`).test(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
}));

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { status: 'error', message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { status: 'error', message: 'Too many auth attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { status: 'error', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api', apiLimiter);

// Standard Middlewares
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(passport.initialize());


// Swagger Docs
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'BookingHub API', version: '1.0.0', description: 'Multi-tenant booking platform API' },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
}

// Routes
app.use('/api/v1', routes);

// 404 handler for unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
