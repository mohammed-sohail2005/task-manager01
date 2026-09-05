import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import Navbar from '../components/Navbar';
import StatsDashboard from '../components/StatsDashboard';
import TaskFilterBar from '../components/TaskFilterBar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import SkeletonCard from '../components/SkeletonCard';
import { CheckCircle, Inbox, Plus } from 'lucide-react';

const Dashboard = () => {
  const {
    tasks,
    loading,
    filterStatus,
    searchQuery,
    toggleTaskStatus,
    openEditModal,
    deleteTask,
    openCreateModal,
  } = useTasks();

  return (
    <div className="min-h-screen pb-16 relative z-10">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Statistics Dashboard Section */}
        <StatsDashboard />

        {/* Search, Filter & Control Bar */}
        <TaskFilterBar />

        {/* Task Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <SkeletonCard key={key} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-12 rounded-3xl border border-white/10 text-center max-w-md mx-auto my-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              {searchQuery ? (
                <Inbox className="w-8 h-8 text-slate-400" />
              ) : filterStatus === 'completed' ? (
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              ) : (
                <Plus className="w-8 h-8 text-indigo-400" />
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery
                ? 'No matching tasks found'
                : filterStatus === 'completed'
                ? 'No completed tasks yet'
                : filterStatus === 'pending'
                ? 'No pending tasks! All caught up 🎉'
                : 'Your task list is empty'}
            </h3>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {searchQuery
                ? `No tasks matched "${searchQuery}". Try clearing search keywords or changing filters.`
                : 'Organize your work, set priority badges, and track real-time progress.'}
            </p>

            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCreateModal}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-glow-purple transition-all inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Task</span>
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={toggleTaskStatus}
                  onEdit={openEditModal}
                  onDelete={deleteTask}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Animated Task Creation & Editing Modal */}
      <TaskModal />
    </div>
  );
};

export default Dashboard;
