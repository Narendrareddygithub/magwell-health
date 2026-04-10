import React from 'react';
import { Cycle, Machine } from '../types';
import { ArrowLeft, CheckCircle2, Pause, Play, AlertOctagon, User, MapPin, Clock, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ActiveCycle({ 
  cycleId, 
  cycles, 
  machines, 
  onBack, 
  onPause, 
  onStop 
}: { 
  cycleId: string, 
  cycles: Cycle[], 
  machines: Machine[], 
  onBack: () => void,
  onPause: () => void,
  onStop: () => void
}) {
  const cycle = cycles.find(c => c.id === cycleId);
  if (!cycle) return <div>Cycle not found</div>;
  
  const machine = machines.find(m => m.id === cycle.machineId);
  const isComplete = cycle.status === 'completed';
  const isPaused = cycle.status === 'paused';
  const isStopped = cycle.status === 'stopped';

  // Calculate remaining time
  const totalMs = cycle.durationMinutes * 60 * 1000;
  const remainingMs = Math.max(0, totalMs * (1 - cycle.progress / 100));
  
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);

  const getStatusColor = () => {
    if (isComplete) return 'text-green-500';
    if (isStopped) return 'text-red-500';
    if (isPaused) return 'text-orange-500';
    return 'text-blue-500';
  };

  const getStatusBg = () => {
    if (isComplete) return 'bg-green-500';
    if (isStopped) return 'bg-red-500';
    if (isPaused) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 px-4">
          <img 
            src="/mackwell-logo.png" 
            alt="Mackewell Health" 
            className="h-5 w-auto object-contain dark:invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-right">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Live</h2>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{cycle.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Machine Image Mini */}
        <div className="flex justify-center">
          <div className="w-full max-w-[200px] aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative">
            <img 
              src="/minibox-hd2-image.jpg" 
              alt="MINIBOX-HD2" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 opacity-20 ${isPaused ? 'bg-orange-500' : isStopped ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></div>
          </div>
        </div>

        {/* Status Animation & Timer */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-800" />
              <motion.circle 
                cx="96" cy="96" r="88" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 88}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - cycle.progress / 100) }}
                transition={{ duration: 1, ease: "linear" }}
                className={`transition-colors duration-500 ${getStatusColor()}`} 
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Animation */}
            <AnimatePresence mode="wait">
              {cycle.status === 'running' && (
                <motion.div 
                  key="running"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center"
                  >
                    <Zap size={32} className="text-blue-500" />
                  </motion.div>
                </motion.div>
              )}

              {isPaused && (
                <motion.div 
                  key="paused"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <Pause size={32} className="text-orange-500" />
                  </div>
                </motion.div>
              )}

              {isStopped && (
                <motion.div 
                  key="stopped"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertOctagon size={32} className="text-red-500" />
                  </div>
                </motion.div>
              )}

              {isComplete && (
                <motion.div 
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                  >
                    <CheckCircle2 size={48} className="text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center z-10 flex flex-col items-center">
              {!isComplete && !isStopped && (
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter font-mono">
                    {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1">Remaining</span>
                  
                  <div className="mt-4">
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none">{Math.floor(cycle.progress)}%</div>
                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 text-center">Progress</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{machine?.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{machine?.model}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${getStatusBg()}`}>
              {cycle.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50 dark:border-gray-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                <User size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Technician</span>
              </div>
              <p className="text-sm font-black text-gray-900 dark:text-white">{cycle.operatorId}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                <MapPin size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
              </div>
              <p className="text-sm font-black text-gray-900 dark:text-white">{machine?.location}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                <Clock size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
              </div>
              <p className="text-sm font-black text-gray-900 dark:text-white">{cycle.durationMinutes} Minutes</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                <Zap size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Started</span>
              </div>
              <p className="text-sm font-black text-gray-900 dark:text-white">{new Date(cycle.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-24 transition-colors duration-300">
        <div className="flex gap-4">
          {isComplete || isStopped ? (
            <button 
              onClick={onBack} 
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-95 ${
                isComplete ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              }`}
            >
              {isComplete ? 'ACKNOWLEDGE & CLOSE' : 'RETURN TO SESSIONS'}
            </button>
          ) : (
            <>
              <button 
                onClick={onPause}
                className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isPaused ? (
                  <><Play size={18} fill="currentColor" /> RESUME</>
                ) : (
                  <><Pause size={18} fill="currentColor" /> PAUSE</>
                )}
              </button>
              <button 
                onClick={onStop}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                <AlertOctagon size={18} /> STOP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
