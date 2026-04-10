import React, { useMemo } from 'react';
import { Machine, Cycle } from '../types';
import { ArrowLeft, Activity, History, Info, ShieldCheck, MapPin, User, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function MachineDetails({ 
  machineId, 
  machines, 
  cycles, 
  onBack,
  onStartCycle,
  onViewActiveCycle,
  currentUser
}: { 
  machineId: string, 
  machines: Machine[], 
  cycles: Cycle[], 
  onBack: () => void,
  onStartCycle: (id: string) => void,
  onViewActiveCycle?: (cycleId: string) => void,
  currentUser?: any
}) {
  const machine = machines.find(m => m.id === machineId);
  const machineCycles = useMemo(() => 
    cycles.filter(c => c.machineId === machineId).sort((a, b) => b.startTime - a.startTime),
    [cycles, machineId]
  );

  if (!machine) return null;

  const activeCycle = machineCycles.find(c => c.status === 'running');

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      {/* Header */}
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
        <div className="text-right">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Device</h2>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{machine.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        {/* Machine Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-video bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <img 
            src="/MINIBOX-HD2 image.jpg" 
            alt="MINIBOX-HD2" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
              Premium Hardware
            </span>
          </div>
        </motion.div>

        {/* Live Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${activeCycle ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
                <Activity size={24} className={activeCycle ? 'animate-pulse' : ''} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 dark:text-white">Live Status</h3>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {activeCycle ? 'Disinfection in progress' : 'Ready for session'}
                </p>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              activeCycle 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {activeCycle ? 'Active' : 'Idle'}
            </span>
          </div>

          {activeCycle ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-3xl font-black text-gray-900 dark:text-white">{Math.round(activeCycle.progress)}%</span>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 ml-2">COMPLETED</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {Math.ceil(activeCycle.durationMinutes * (1 - activeCycle.progress / 100))} min
                  </span>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Remaining</p>
                </div>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${activeCycle.progress}%` }}
                />
              </div>
              <button 
                onClick={() => {
                  if (activeCycle.progress >= 100) {
                    // If it's 100%, we should route to theatre_evidence
                    // But for now, we'll just route to active_cycle or theatre_cycle
                    onViewActiveCycle?.(activeCycle.id);
                  } else {
                    onViewActiveCycle?.(activeCycle.id);
                  }
                }}
                className="w-full py-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-2xl font-black text-sm transition-all active:scale-95"
              >
                {activeCycle.progress >= 100 ? 'SIGN OFF SESSION' : 'VIEW ACTIVE SESSION'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onStartCycle(machine.id)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              START NEW SESSION
            </button>
          )}
        </motion.div>

        {/* Machine Info */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 p-5 rounded-[28px] border border-gray-100 dark:border-gray-800"
          >
            <Info size={18} className="text-gray-400 mb-3" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Model</p>
            <h4 className="font-black text-gray-900 dark:text-white">{machine.model}</h4>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 p-5 rounded-[28px] border border-gray-100 dark:border-gray-800"
          >
            <MapPin size={18} className="text-gray-400 mb-3" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Location</p>
            <h4 className="font-black text-gray-900 dark:text-white">{machine.location}</h4>
          </motion.div>
        </div>

        {/* Audit Logs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={18} className="text-blue-600" />
              <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wide text-sm">Cycle History</h3>
            </div>
            <ShieldCheck size={18} className="text-green-600" />
          </div>
          
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {machineCycles.length > 0 ? (
              machineCycles.map((cycle) => (
                <button 
                  key={cycle.id} 
                  onClick={() => onViewActiveCycle?.(cycle.id)}
                  className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors block"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        cycle.status === 'completed' ? 'bg-green-500' : 
                        cycle.status === 'failed' ? 'bg-red-500' : 
                        cycle.status === 'stopped' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{cycle.status}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                      {new Date(cycle.startTime).toLocaleDateString()} • {new Date(cycle.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white">{cycle.operatorId}</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Technician</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-900 dark:text-white font-black text-xs">
                        <Clock size={12} className="text-gray-400" />
                        {cycle.durationMinutes}m
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Duration</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-10 text-center">
                <p className="text-sm text-gray-400 font-bold">No logs found for this device</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
