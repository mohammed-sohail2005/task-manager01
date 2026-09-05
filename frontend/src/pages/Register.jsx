import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Layers, User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields');
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      triggerShake();
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      addToast('Account created successfully! Welcome to TaskFlux 🎉', 'success');
      navigate('/dashboard');
    } else {
      setErrorMessage(result.message);
      triggerShake();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className={`w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-2xl ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-glow-purple flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center">
              <Layers className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            Create <span className="text-gradient">Account</span>
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Join TaskFlux 3D Task Manager today</p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Password (Min 6 chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-extrabold text-sm shadow-glow-purple transition-all flex items-center justify-center space-x-2 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer link */}
        <div className="mt-8 text-center pt-6 border-t border-white/10">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
