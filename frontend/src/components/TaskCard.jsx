import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Edit3, Trash2, Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue =
    !task.isCompleted &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  // Priority Styles with 3D glowing badge matching its color
  const priorityStyles = {
    High: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose',
      dot: 'bg-rose-400',
    },
    Medium: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber',
      dot: 'bg-amber-400',
    },
    Low: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald',
      dot: 'bg-emerald-400',
    },
  }[task.priority || 'Medium'];

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass-panel p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between ${
        task.isCompleted
          ? 'border-emerald-500/20 bg-slate-900/40 opacity-75'
          : isOverdue
          ? 'border-rose-500/30 bg-rose-950/10'
          : 'border-white/10 hover:border-indigo-500/40 hover:shadow-glass-hover'
      }`}
    >
      {/* Subtle top edge glow on hover */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Priority Badge & Status Toggle */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center space-x-1.5 backdrop-blur-md ${priorityStyles.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles.dot} animate-pulse`} />
            <span>{task.priority} Priority</span>
          </span>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onToggle(task._id)}
            className={`p-1.5 rounded-xl border transition-colors ${
              task.isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-indigo-500/20 hover:text-indigo-300'
            }`}
            title={task.isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Task Title */}
        <h3
          className={`text-lg font-bold tracking-tight mb-2 transition-all ${
            task.isCompleted
              ? 'line-through text-slate-500'
              : 'text-slate-100 group-hover:text-white'
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p
            className={`text-xs line-clamp-3 mb-4 leading-relaxed ${
              task.isCompleted ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Due Date & Action Buttons */}
      <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between">
        {/* Due Date Indicator */}
        <div className="flex items-center space-x-1.5 text-xs">
          {task.dueDate ? (
            <span
              className={`flex items-center space-x-1 font-medium ${
                task.isCompleted
                  ? 'text-slate-500'
                  : isOverdue
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {isOverdue && !task.isCompleted ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{formatDate(task.dueDate)}</span>
              {isOverdue && !task.isCompleted && (
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 uppercase">
                  Overdue
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-600 italic">No due date</span>
          )}
        </div>

        {/* Edit & Delete Actions */}
        <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500/30 transition-all"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task._id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
