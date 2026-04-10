import React, { useState, useEffect } from 'react';
import { Cycle, Machine, Instrument } from '../types';
import { motion } from 'motion/react';
import { AlertTriangle, StopCircle, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { CycleProgress } from '../components/CycleProgress';

export function TheatreCycle({ 
  cycleId, 
  cycles, 
  machines,
  instruments,
  onComplete,
  onStop,
  onStartSimulation
}: { 
  cycleId: string, 
  cycles: Cycle[], 
  machines: Machine[], 
  instruments: Instrument[],
  onComplete: () => void,
  onStop: () => void,
  onStartSimulation: (cycleId: string) => void
}) {
  const cycle = cycles.find(c => c.id === cycleId);
  const machine = machines.find(m => m.id === cycle?.machineId);

  if (!cycle || !machine) return null;

  const isPending = cycle.status === 'pending';
  const isComplete = cycle.progress >= 100;
  
  // Calculate remaining time
  const totalMs = cycle.durationMinutes * 60 * 1000;
  const elapsedMs = cycle.elapsedTimeMs || 0;
  const remainingMs = Math.max(0, totalMs * (1 - cycle.progress / 100));
  
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);

  return (
    <div className="h-full flex flex-col bg-gray-950 transition-colors duration-300">
      <div className="px-6 py-4 flex items-center border-b border-gray-800 sticky top-0 z-20 bg-gray-900">
        <div className="flex-1">
          <img 
            src="/mackwell logo.png" 
            alt="Mackewell Health" 
            className="h-5 w-auto object-contain invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-sm font-black text-white uppercase tracking-widest">Step 3 of 4</h2>
      </div>

      <div className="bg-white">
        <CycleProgress step={3} />
      </div>

      <div className="flex-1 p-6 flex flex-col relative overflow-y-auto">
        {isPending ? (
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white mb-2">Ready to Decontaminate</h1>
              <p className="text-gray-400">Review selected instruments before starting.</p>
            </div>
            
            <div className="space-y-3 mb-8 flex-1 overflow-y-auto">
              {cycle.instruments.map(ci => {
                const inst = instruments.find(i => i.id === ci.instrumentId);
                if (!inst) return null;
                return (
                  <div key={ci.instrumentId} className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                      {inst.image ? (
                        <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold text-xs">{inst.category[0]}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{inst.name}</h3>
                      <p className="text-xs text-gray-500">{inst.category}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-black text-white">
                      {ci.quantity}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onStartSimulation(cycle.id)}
              className="w-full py-5 bg-blue-600 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all mt-auto"
            >
              <Play size={20} /> Start Decontamination
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative z-10 text-center w-full flex flex-col items-center">
              <h1 className="text-3xl font-black text-white mb-2">{machine.name}</h1>
              <div className="flex items-center gap-2 mb-12">
                {!isComplete && (
                  <motion.div 
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  />
                )}
                {isComplete && (
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
                <p className="text-blue-400 font-bold tracking-widest uppercase text-sm">
                  {isComplete ? 'Cycle Complete' : 'Decontamination in Progress'}
                </p>
              </div>

              <div className="relative w-72 h-72 mx-auto mb-12">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={isComplete ? "#10B981" : "#3B82F6"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * cycle.progress) / 100}
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * cycle.progress) / 100 }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isComplete ? (
                    <CheckCircle2 size={80} className="text-emerald-500" />
                  ) : (
                    <>
                      <span className="text-6xl font-black text-white tracking-tighter font-mono">
                        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Remaining</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto w-full space-y-4 relative z-10">
              {isComplete ? (
                <button
                  onClick={onComplete}
                  className="w-full py-5 bg-emerald-500 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Proceed to Evidence <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={onStop}
                  className="w-full py-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[32px] font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <StopCircle size={20} /> Emergency Stop
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
