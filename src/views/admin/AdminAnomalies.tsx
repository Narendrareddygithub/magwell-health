import React, { useMemo } from 'react';
import { AlertTriangle, ArrowLeft, Hash, Clock, VideoOff, CheckCircle2 } from 'lucide-react';
import { Cycle, Machine } from '../../types';

export function AdminAnomalies({ 
  cycles, 
  machines, 
  onBack,
  onViewCycle
}: { 
  cycles: Cycle[], 
  machines: Machine[], 
  onBack: () => void,
  onViewCycle: (id: string) => void
}) {
  const anomalousCycles = useMemo(() => {
    return cycles.filter(c => c.anomalyFlags && c.anomalyFlags.length > 0).sort((a, b) => b.startTime - a.startTime);
  }, [cycles]);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
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
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Anomalies</h2>
      </div>

      <div className="p-6 flex-1 overflow-y-auto pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-orange-500" /> Safety Oversight
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review cycles flagged for potential issues.</p>
        </div>

        <div className="space-y-4">
          {anomalousCycles.length === 0 ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-[28px] border border-green-100 dark:border-green-800 text-center">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-black text-green-900 dark:text-green-100 mb-2">All Clear</h3>
              <p className="text-sm text-green-700 dark:text-green-300">No anomalies detected in recent cycles.</p>
            </div>
          ) : (
            anomalousCycles.map(cycle => {
              const machine = machines.find(m => m.id === cycle.machineId);
              return (
                <div 
                  key={cycle.id}
                  onClick={() => onViewCycle(cycle.id)}
                  className="bg-white dark:bg-gray-900 p-5 rounded-[24px] shadow-sm border border-orange-200 dark:border-orange-900/50 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Hash size={14} className="text-gray-400" />
                        <span className="font-black text-gray-900 dark:text-white">{cycle.id}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(cycle.startTime).toLocaleString()} • {machine?.name}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <AlertTriangle size={12} /> Flagged
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cycle.anomalyFlags?.includes('short_cycle') && (
                      <div className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-100 dark:border-red-900/50">
                        <Clock size={14} /> Short Cycle ({cycle.durationMinutes}m)
                      </div>
                    )}
                    {cycle.anomalyFlags?.includes('missing_video') && (
                      <div className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-yellow-100 dark:border-yellow-900/50">
                        <VideoOff size={14} /> Missing Video Evidence
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-3 border-t border-gray-50 dark:border-gray-800/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Operator: {cycle.operatorId}</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">Review Details &rarr;</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
