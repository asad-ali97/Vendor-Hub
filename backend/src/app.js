const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/error.middleware');

const authRoutes      = require('./routes/auth.routes');
const vendorRoutes    = require('./routes/vendor.routes');
const quotationRoutes = require('./routes/quotation.routes');
const { dashRouter }  = require('./routes/dashboard.routes');
const activityRoutes  = require('./routes/activity.routes');
const emailRoutes     = require('./routes/email.routes');

const app = express();

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'VendorHub backend is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/vendors',    vendorRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/dashboard',  dashRouter);
app.use('/api/activities', activityRoutes);
app.use('/api/email',      emailRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
