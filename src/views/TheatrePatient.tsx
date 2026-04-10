import React, { useState } from 'react';
import { ArrowLeft, User, ArrowRight } from 'lucide-react';
import { CycleProgress } from '../components/CycleProgress';

export function TheatrePatient({ onNext, onBack }: { onNext: (patientId: string) => void, onBack: () => void }) {
  const [patientId, setPatientId] = useState('');

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
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
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Step 1 of 4</h2>
      </div>

      <CycleProgress step={1} />

      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Patient Link</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the Patient ID or Case Number to link this decontamination cycle to a specific episode of care.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Patient ID / Case Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. PAT-88291"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
            Optional: Leave blank if not applicable.
          </p>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => onNext(patientId)}
            className="w-full py-5 bg-blue-600 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            Continue <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
