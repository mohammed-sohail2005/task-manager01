import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-20 h-6 bg-slate-800/80 rounded-full" />
        <div className="w-16 h-4 bg-slate-800/80 rounded-md" />
      </div>

      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-slate-800/80 rounded-md" />
        <div className="w-full h-4 bg-slate-800/50 rounded-md" />
        <div className="w-2/3 h-4 bg-slate-800/50 rounded-md" />
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="w-28 h-4 bg-slate-800/60 rounded-md" />
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-slate-800/80 rounded-lg" />
          <div className="w-8 h-8 bg-slate-800/80 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
