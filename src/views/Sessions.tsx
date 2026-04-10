import React, { useState } from 'react';
import { Activity, Clock, Filter, Download } from 'lucide-react';
import { Cycle, Machine, ViewState } from '../types';

export function Sessions({ cycles, machines, onViewCycle, onNavigate }: { cycles: Cycle[], machines: Machine[], onViewCycle: (id: string) => void, onNavigate: (v: ViewState) => void }) {
  const [filterMachine, setFilterMachine] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const activeCycles = cycles.filter(c => c.status === 'running' || c.status === 'paused');
  
  const pastCycles = cycles.filter(c => {
    if (c.status === 'running' || c.status === 'paused') return false;
    if (filterMachine !== 'all' && c.machineId !== filterMachine) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
      <div className="mb-6">
        <img 
          src="/mackwell-logo.png" 
          alt="Mackewell Health" 
          className="h-6 w-auto object-contain dark:invert mb-4 opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('export')}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 shadow-sm active:bg-gray-50 dark:active:bg-gray-700"
              title="Export Data"
            >
              <Download size={16} />
            </button>
            <div className="flex gap-2">
              <select 
                value={filterMachine} 
                onChange={(e) => setFilterMachine(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              >
                <option value="all">All Machines</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id}>{m.id}</option>
                ))}
              </select>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="stopped">Stopped</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {activeCycles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity size={14} className="text-blue-500" /> Active Now
          </h2>
          <div className="space-y-3">
            {activeCycles.map(cycle => {
              const machine = machines.find(m => m.id === cycle.machineId);
              return (
                <div 
                  key={cycle.id} 
                  onClick={() => onViewCycle(cycle.id)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/50 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 h-1 bg-blue-500" style={{ width: `${cycle.progress}%` }}></div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-gray-900 dark:text-white">{machine?.name}</div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-sm">{Math.floor(cycle.progress)}%</div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>{cycle.durationMinutes} min cycle</span>
                    <span className={cycle.status === 'paused' ? 'text-orange-500 font-bold' : ''}>
                      {cycle.status === 'paused' ? 'Paused' : 'Running...'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} /> Past Sessions
          </h2>
        </div>

        <div className="space-y-3">
          {pastCycles.map(cycle => {
            const machine = machines.find(m => m.id === cycle.machineId);
            return (
              <div key={cycle.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{machine?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(cycle.startTime).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  {cycle.status === 'completed' && <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md inline-block mb-1">COMPLETED</div>}
                  {cycle.status === 'failed' && <div className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md inline-block mb-1">FAILED</div>}
                  {cycle.status === 'stopped' && <div className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md inline-block mb-1">STOPPED</div>}
                  <div className="text-[10px] text-gray-400 dark:text-gray-500">{cycle.durationMinutes} mins</div>
                </div>
              </div>
            );
          })}
          {pastCycles.length === 0 && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">No past sessions match your filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
