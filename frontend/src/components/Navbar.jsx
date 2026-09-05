import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layers, User, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-4 z-40 px-4 md:px-8 mb-8"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-4 shadow-glass flex items-center justify-between border border-white/10 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle top glow highlight line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70" />

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-glow-purple flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Task<span className="text-gradient">Flux</span>
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">3D Workspaces</p>
          </div>
        </div>

        {/* User Profile & Actions */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-semibold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all text-xs font-medium"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
