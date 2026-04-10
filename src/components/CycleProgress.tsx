import React from 'react';
import { User, Stethoscope, Activity, CheckCircle2 } from 'lucide-react';

export function CycleProgress({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = [
    { num: 1, label: 'Patient', icon: User },
    { num: 2, label: 'Instruments', icon: Stethoscope },
    { num: 3, label: 'Cycle', icon: Activity },
    { num: 4, label: 'Sign-off', icon: CheckCircle2 },
  ];

  return (
    <div className="relative px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
      <div className="flex items-center justify-between relative z-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isPast = step > s.num;
          return (
            <div key={s.num} className="flex flex-col items-center bg-white dark:bg-gray-900 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors ${
                isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 
                isPast ? 'bg-green-500 text-white' : 
                'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                <Icon size={14} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 
                isPast ? 'text-green-600 dark:text-green-400' : 
                'text-gray-400'
              }`}>{s.label}</span>
            </div>
          );
        })}
      </div>
      {/* Connecting lines */}
      <div className="absolute top-8 left-12 right-12 h-0.5 bg-gray-100 dark:bg-gray-800 z-0">
        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
      </div>
    </div>
  );
}
