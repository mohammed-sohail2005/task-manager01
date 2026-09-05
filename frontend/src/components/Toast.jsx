import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-start space-x-3 text-sm font-medium ${
                toast.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200 shadow-glow-emerald'
                  : toast.type === 'error'
                  ? 'bg-rose-950/80 border-rose-500/30 text-rose-200 shadow-glow-rose'
                  : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200 shadow-glow-purple'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
              </div>

              <div className="flex-1 pr-2 leading-snug">{toast.message}</div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
