import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../backend/config/db.js';
import authRoutes from '../backend/routes/authRoutes.js';
import taskRoutes from '../backend/routes/taskRoutes.js';
import { notFound, errorHandler } from '../backend/middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Ensure MongoDB is connected before handling any API requests
app.use(async (req, res, next) => {
  if (req.path.includes('/health') || req.path.includes('/test')) return next();
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Database Connection Error: ${error.message}`,
    });
  }
});

// API Health Check & Debug Endpoint
app.get(['/api/health', '/health', '/api/test', '/test'], (req, res) => {
  res.json({
    status: 'OK',
    message: 'Task Manager API is running smoothly on Vercel',
    url: req.url,
    originalUrl: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Mount routes for both local (/api/...) and Vercel serverless rewrites (/...)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

// Fallback mounts so any Vercel URL rewrite (/login, /register, etc.) is caught
app.use('/', authRoutes);
app.use('/', taskRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
