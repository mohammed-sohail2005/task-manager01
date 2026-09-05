import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
  toggleTaskStatus,
  getTaskStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all task routes
router.use(protect);

// Special routes (must come before /:id)
router.get('/stats/summary', getTaskStats);
router.delete('/completed/all', deleteCompletedTasks);

// Standard CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTaskStatus);

export default router;
