import React, { useState } from 'react';
import { Machine } from '../types';
import { ArrowLeft, Clock, ShieldCheck, User } from 'lucide-react';

export function CycleSetup({ machineId, machines, onStart, onCancel }: { machineId: string, machines: Machine[], onStart: (id: string, duration: number) => void, onCancel: () => void }) {
  const machine = machines.find(m => m.id === machineId);
  const [duration, setDuration] = useState<number>(5);
  const [customDuration, setCustomDuration] = useState<string>('');

  if (!machine) return <div>Machine not found</div>;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 px-6 py-4 flex items-center border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <button onClick={onCancel} className="mr-3 p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <img 
            src="/mackwell logo.png" 
            alt="Mackewell Health" 
            className="h-5 w-auto object-contain dark:invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Setup</h2>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* Machine Image Mini */}
        <div className="w-full aspect-video rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative">
          <img 
            src="/MINIBOX-HD2 image.jpg" 
            alt="MINIBOX-HD2" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">
              {machine.model}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50 dark:border-gray-700">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              📦
            </div>
            <div>
              <div className="font-black text-gray-900 dark:text-white text-lg leading-tight">{machine.name}</div>
              <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{machine.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500">
              <User size={16} />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Operator</div>
              <div className="text-sm font-black text-gray-900 dark:text-white">Sarah Larkin</div>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Clock size={16} className="text-blue-600 dark:text-blue-400" /> Select Duration
        </h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[5, 10, 15].map(mins => (
            <button 
              key={mins}
              onClick={() => { setDuration(mins); setCustomDuration(''); }}
              className={`py-3 rounded-xl border-2 font-bold transition-all ${duration === mins ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            >
              {mins} min
            </button>
          ))}
        </div>
        
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Custom Time (minutes)</label>
          <input 
            type="number" 
            placeholder="e.g. 20" 
            value={customDuration}
            onChange={(e) => {
              setCustomDuration(e.target.value);
              if (e.target.value) setDuration(Number(e.target.value));
            }}
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
          />
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex gap-3 items-start border border-green-100 dark:border-green-800">
          <ShieldCheck className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">
            Ready to begin high-level UV-C disinfection to BS8628:2022 standard. Ensure the chamber is securely closed.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-24 transition-colors duration-300">
        <button 
          onClick={() => onStart(machine.id, duration)}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-transform"
        >
          Start Cycle
        </button>
      </div>
    </div>
  );
}
