import React from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

const CircularProgressRing = ({ percentage, colorClass, strokeColor }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background Track */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
          fill="transparent"
        />
        {/* Animated Progress Fill */}
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke={strokeColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <span className={`absolute text-xs font-bold ${colorClass}`}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

const StatsDashboard = () => {
  const { stats } = useTasks();

  const total = stats.total || 0;
  const completed = stats.completed || 0;
  const pending = stats.pending || 0;
  const overdue = stats.overdue || 0;

  const completedPct = total > 0 ? (completed / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;
  const overduePct = total > 0 ? (overdue / total) * 100 : 0;

  const statCards = [
    {
      title: 'Total Tasks',
      value: total,
      icon: Layers,
      color: 'indigo',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      strokeColor: '#6366f1',
      percentage: 100,
      glow: 'hover:shadow-glow-purple',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'emerald',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      strokeColor: '#10b981',
      percentage: completedPct,
      glow: 'hover:shadow-glow-emerald',
    },
    {
      title: 'Pending',
      value: pending,
      icon: Clock,
      color: 'amber',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      strokeColor: '#f59e0b',
      percentage: pendingPct,
      glow: 'hover:shadow-glow-amber',
    },
    {
      title: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      color: 'rose',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      strokeColor: '#f43f5e',
      percentage: overduePct,
      glow: 'hover:shadow-glow-rose',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between transition-all duration-300 ${card.glow}`}
          >
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`p-2 rounded-xl border ${card.badgeBg}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
              </div>
              <motion.span
                key={card.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-3xl font-extrabold text-white tracking-tight"
              >
                {card.value}
              </motion.span>
            </div>

            <CircularProgressRing
              percentage={card.percentage}
              colorClass={`text-${card.color}-400`}
              strokeColor={card.strokeColor}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsDashboard;
