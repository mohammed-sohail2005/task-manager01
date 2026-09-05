import Task from '../models/Task.js';

// @desc    Get all tasks for logged in user with search, filter, and sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy } = req.query;

    const query = { user: req.user._id };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status (completed / pending)
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'pending') {
      query.isCompleted = false;
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // Default: newest first

    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'dueDate') {
      // Put tasks with due date first, sorted ascending
      sortOption = { dueDate: 1, createdAt: -1 };
    }

    let tasks = await Task.find(query).sort(sortOption);

    // Custom sorting for priority if requested (High > Medium > Low)
    if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, isCompleted } = req.body;

    if (!title || title.trim() === '') {
      res.status(400);
      throw new Error('Task title is required');
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      isCompleted: Boolean(isCompleted),
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const { title, description, priority, dueDate, isCompleted } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (isCompleted !== undefined) task.isCompleted = Boolean(isCompleted);

    const updatedTask = await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete all completed tasks for user
// @route   DELETE /api/tasks/completed/all
// @access  Private
export const deleteCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({
      user: req.user._id,
      isCompleted: true,
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} completed task(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle completed/pending status of a task
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
export const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task.isCompleted = !task.isCompleted;
    const updatedTask = await task.save();

    res.json({
      success: true,
      message: `Task marked as ${updatedTask.isCompleted ? 'completed' : 'pending'}`,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real-time statistics for user tasks
// @route   GET /api/tasks/stats/summary
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, isCompleted: true });
    const pendingTasks = await Task.countDocuments({ user: userId, isCompleted: false });
    const overdueTasks = await Task.countDocuments({
      user: userId,
      isCompleted: false,
      dueDate: { $ne: null, $lt: now },
    });

    res.json({
      success: true,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};
