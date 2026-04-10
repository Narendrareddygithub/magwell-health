import React, { useMemo } from 'react';
import { Search, FileText, AlertTriangle, Settings, ArrowLeft, LogOut, Activity, History, ShieldCheck, MapPin, User, Clock, Info } from 'lucide-react';
import { ViewState, Machine, Cycle } from '../../types';
import { motion } from 'motion/react';

export function AdminDashboard({ 
  machines,
  cycles,
  onNavigate,
  onLogout,
  onViewActiveCycle
}: { 
  machines: Machine[],
  cycles: Cycle[],
  onNavigate: (view: ViewState) => void,
  onLogout: () => void,
  onViewActiveCycle: (id: string) => void
}) {
  // Admin only sees the first machine for now
  const machine = machines[0];
  const machineCycles = useMemo(() => 
    cycles.filter(c => c.machineId === machine?.id).sort((a, b) => b.startTime - a.startTime),
    [cycles, machine?.id]
  );

  if (!machine) return null;

  const activeCycle = machineCycles.find(c => c.status === 'running');

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <img 
            src="/mackwell-logo.png" 
            alt="Mackewell Health" 
            className="h-6 w-auto object-contain dark:invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-full transition-colors font-bold text-sm"
        >
          <LogOut size={16} /> Exit Admin
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System status and recent logs.</p>
        </div>

        {/* Machine Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-video bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <img 
            src="/minibox-hd2-image.jpg" 
            alt="MINIBOX-HD2" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
              {machine.name}
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

          {activeCycle && (
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
                onClick={() => onViewActiveCycle(activeCycle.id)}
                className="w-full py-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-2xl font-black text-sm transition-all active:scale-95"
              >
                VIEW ACTIVE SESSION
              </button>
            </div>
          )}
        </motion.div>

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
              <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wide text-sm">Recent Logs</h3>
            </div>
            <ShieldCheck size={18} className="text-green-600" />
          </div>
          
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {machineCycles.slice(0, 5).map((cycle) => (
              <button 
                key={cycle.id} 
                onClick={() => onViewActiveCycle(cycle.id)}
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
            ))}
            {machineCycles.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-sm text-gray-400 font-bold">No logs found for this device</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Audit & Search Card */}
        <button 
          onClick={() => onNavigate('admin_audit')}
          className="w-full bg-white dark:bg-gray-900 p-6 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Search size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Audit & Search</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Advanced Filtering & Search. View Digital Audit Trail.</p>
        </button>
      </div>
    </div>
  );
}
