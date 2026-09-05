import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { X, Sparkles, AlertCircle, Calendar, Flag, AlignLeft, CheckSquare } from 'lucide-react';

const TaskModal = () => {
  const { isModalOpen, editingTask, closeModal, createTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(
        editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : ''
      );
      setIsCompleted(Boolean(editingTask.isCompleted));
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setIsCompleted(false);
    }
    setErrors({});
  }, [editingTask, isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? dueDate : null,
      isCompleted,
    };

    let success = false;
    if (editingTask) {
      success = await updateTask(editingTask._id, payload);
    } else {
      success = await createTask(payload);
    }

    setIsSubmitting(false);
    if (success) {
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Task Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({});
                  }}
                  placeholder="e.g. Design 3D Dashboard UI"
                  className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${
                    errors.title ? 'border-rose-500 animate-shake' : ''
                  }`}
                />
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title}
                  </motion.p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details or notes about this task..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium resize-none"
                />
              </div>

              {/* Priority & Due Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-slate-900/90 text-slate-200"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                {/* Due Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium text-slate-200"
                  />
                </div>
              </div>

              {/* Completion Status Checkbox */}
              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    Mark as completed immediately
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-glow-purple transition-all flex items-center space-x-2"
                >
                  <span>{isSubmitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
