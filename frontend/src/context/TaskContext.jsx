import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '../components/Toast';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(false);

  // Filters & Controls
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch Stats Summary
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await API.get('/tasks/stats/summary');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [isAuthenticated]);

  // Fetch Tasks with query parameters
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortBy) params.sortBy = sortBy;

      const res = await API.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      addToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filterStatus, searchQuery, sortBy, addToast]);

  // Refresh tasks and stats whenever dependencies change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchStats();
    } else {
      setTasks([]);
      setStats({ total: 0, completed: 0, pending: 0, overdue: 0 });
    }
  }, [isAuthenticated, filterStatus, searchQuery, sortBy, fetchTasks, fetchStats]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await API.post('/tasks', taskData);
      if (res.data.success) {
        addToast('Task created successfully!', 'success');
        fetchTasks();
        fetchStats();
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create task';
      addToast(msg, 'error');
      return false;
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const res = await API.put(`/tasks/${id}`, taskData);
      if (res.data.success) {
        addToast('Task updated successfully!', 'success');
        fetchTasks();
        fetchStats();
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task';
      addToast(msg, 'error');
      return false;
    }
  };

  // Toggle Completion
  const toggleTaskStatus = async (id) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isCompleted: !t.isCompleted } : t))
      );

      const res = await API.patch(`/tasks/${id}/toggle`);
      if (res.data.success) {
        const isDone = res.data.task.isCompleted;
        addToast(isDone ? 'Marked as completed 🎉' : 'Marked as pending ⏳', 'info');
        fetchStats();
      }
    } catch (error) {
      addToast('Failed to toggle status', 'error');
      fetchTasks(); // rollback on error
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      const res = await API.delete(`/tasks/${id}`);
      if (res.data.success) {
        addToast('Task deleted', 'info');
        fetchStats();
      }
    } catch (error) {
      addToast('Failed to delete task', 'error');
      fetchTasks();
    }
  };

  // Bulk Delete Completed Tasks
  const deleteCompletedTasks = async () => {
    try {
      const res = await API.delete('/tasks/completed/all');
      if (res.data.success) {
        addToast(`Cleared ${res.data.deletedCount} completed task(s)!`, 'success');
        fetchTasks();
        fetchStats();
      }
    } catch (error) {
      addToast('Failed to clear completed tasks', 'error');
    }
  };

  // Modal Control
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        isModalOpen,
        editingTask,
        openCreateModal,
        openEditModal,
        closeModal,
        createTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        deleteCompletedTasks,
        refreshTasks: fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};
