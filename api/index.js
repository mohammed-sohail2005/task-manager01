import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../backend/config/db.js';
import { registerUser, loginUser, getMe } from '../backend/controllers/authController.js';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
  toggleTaskStatus,
  getTaskStats,
} from '../backend/controllers/taskController.js';
import { protect } from '../backend/middleware/authMiddleware.js';
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

// Auth Routes (Explicit endpoints to ensure match regardless of Vercel path rewrites)
app.post(['/api/auth/register', '/auth/register', '*/register'], registerUser);
app.post(['/api/auth/login', '/auth/login', '*/login'], loginUser);
app.get(['/api/auth/me', '/auth/me', '*/me'], protect, getMe);

// Task Routes (Explicit endpoints)
app.get(['/api/tasks/stats/summary', '/tasks/stats/summary', '*/stats/summary'], protect, getTaskStats);
app.delete(['/api/tasks/completed/all', '/tasks/completed/all', '*/completed/all'], protect, deleteCompletedTasks);

app.get(['/api/tasks', '/tasks', '*/tasks'], protect, getTasks);
app.post(['/api/tasks', '/tasks', '*/tasks'], protect, createTask);

app.get(['/api/tasks/:id', '/tasks/:id', '*/tasks/:id'], protect, getTaskById);
app.put(['/api/tasks/:id', '/tasks/:id', '*/tasks/:id'], protect, updateTask);
app.delete(['/api/tasks/:id', '/tasks/:id', '*/tasks/:id'], protect, deleteTask);
app.patch(['/api/tasks/:id/toggle', '/tasks/:id/toggle', '*/tasks/:id/toggle'], protect, toggleTaskStatus);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
