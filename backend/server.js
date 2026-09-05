import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

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
  if (req.path === '/api/health' || req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Database Connection Error: ${error.message}`,
    });
  }
});

// API Health Check
const healthCheckHandler = (req, res) => {
  res.json({
    status: 'OK',
    message: 'Task Manager API is running smoothly',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', healthCheckHandler);
app.get('/health', healthCheckHandler);

// Mount routes for both local (/api/...) and Vercel serverless rewrites (/...)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 [Server Running]: http://localhost:${PORT}`);
  });
}

export default app;
