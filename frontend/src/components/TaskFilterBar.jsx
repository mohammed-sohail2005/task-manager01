import React from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { Search, Plus, Trash2, ArrowUpDown, X } from 'lucide-react';

const TaskFilterBar = () => {
  const {
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    openCreateModal,
    deleteCompletedTasks,
    stats,
  } = useTasks();

  const filterTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="glass-panel p-4 md:p-5 rounded-2xl border border-white/10 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4 backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl glass-input text-xs font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Sorting */}
      <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
        {/* Status Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-white/10">
          {filterTabs.map((tab) => {
            const isActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-glow-purple"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 bg-slate-950/60 border border-white/10 px-3 py-1.5 rounded-xl">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-slate-900 text-slate-200">Sort: Newest</option>
            <option value="oldest" className="bg-slate-900 text-slate-200">Sort: Oldest</option>
            <option value="priority" className="bg-slate-900 text-slate-200">Sort: Priority</option>
            <option value="dueDate" className="bg-slate-900 text-slate-200">Sort: Due Date</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {stats.completed > 0 && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={deleteCompletedTasks}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title="Clear completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Done</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-[10px]">
                {stats.completed}
              </span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-extrabold shadow-glow-purple flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterBar;
