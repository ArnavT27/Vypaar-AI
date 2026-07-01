import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDatabase from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

// Connect to database
connectDatabase();

// Route files
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import billRoutes from './routes/billRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

import storeRoutes from './routes/storeRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import insightsRoutes from './routes/insightsRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import trendingRoutes from './routes/trendingRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
const allowedOrigins = [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'http://localhost:5173',
    process.env.CLIENT_URL
].filter(Boolean);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/customers', customerRoutes);

app.use('/api/ai-insights', insightsRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Retail Store Management API Server                  ║
║                                                           ║
║   📡 Server running on port: ${PORT}                        ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                      ║
║   🔗 API Base URL: http://localhost:${PORT}/api            ║
║   💚 Health Check: http://localhost:${PORT}/api/health     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

export default app;
