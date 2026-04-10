import React, { useState, useEffect } from 'react';
import { Cycle, ViewState, Machine, User } from '../types';
import { Activity, CheckCircle, Barcode, Download, Monitor, Moon, Sun, User as UserIcon } from 'lucide-react';

export function Home({ currentUser, cycles, machines, onNavigate, onViewMachine, isDarkMode, toggleDarkMode }: { currentUser: User, cycles: Cycle[], machines: Machine[], onNavigate: (v: ViewState) => void, onViewMachine: (id: string) => void, isDarkMode: boolean, toggleDarkMode: () => void }) {
  const completed = cycles.filter(c => c.status === 'completed').length;
  const running = cycles.filter(c => c.status === 'running').length;

  const getStatusColor = (status: Machine['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'idle': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
      {/* Top Bar with Logo and Actions */}
      <div className="flex justify-between items-center mb-8">
        <img 
          src="/mackwell-logo.png" 
          alt="Mackewell Health" 
          className="h-8 w-auto object-contain dark:invert transition-all"
          referrerPolicy="no-referrer"
        />
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => onNavigate('export')}
            aria-label="Export Sessions"
            className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm transition-all active:scale-95 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download size={18} />
          </button>
          <button 
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm transition-all active:scale-95 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-4 text-left group transition-all active:scale-95"
        >
          <div className="relative">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 dark:shadow-none group-hover:bg-blue-700 transition-colors">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{currentUser.name}</h1>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{currentUser.role === 'admin' ? 'Ward Manager' : 'Attender'}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">ID: {currentUser.id}</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
            <Activity size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{running}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Cycles</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{completed}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Completed Today</div>
        </div>
      </div>

      <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-5 text-white shadow-md mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-1">Ready to scan?</h2>
          <p className="text-sm text-blue-100 mb-4 opacity-90">Tap the Barcode button below to start a new decontamination cycle.</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Barcode size={120} />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Monitor size={16} className="text-gray-400 dark:text-gray-500" /> Machine Status
        </h3>
        <div className="space-y-3">
          {machines.map(machine => {
            const activeCycle = cycles.find(c => c.machineId === machine.id && c.status === 'running');
            const lastCycle = cycles.find(c => c.machineId === machine.id && c.status === 'completed');
            const status = activeCycle ? 'running' : machine.status;
            
            return (
              <button 
                key={machine.id} 
                onClick={() => onViewMachine(machine.id)}
                className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all active:scale-[0.98] hover:border-blue-200 dark:hover:border-blue-800 flex gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex-shrink-0">
                  <img 
                    src="/minibox-hd2-image.jpg" 
                    alt="MINIBOX-HD2" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-3 w-3 items-center justify-center">
                        <span className={`absolute inline-flex h-full w-full rounded-full ${getStatusColor(status)} opacity-50 animate-pulse`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor(status)}`}></span>
                      </div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{machine.name}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{status}</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-medium">Location:</span> {machine.location}
                      </div>
                      {activeCycle ? (
                        <div className="text-blue-600 dark:text-blue-400 font-medium">
                          Cycle in progress ({Math.floor(activeCycle.progress)}%)
                        </div>
                      ) : lastCycle ? (
                        <div>
                          <span className="font-medium">Last active:</span> {new Date(lastCycle.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ) : (
                        <div className="italic">No recent activity</div>
                      )}
                    </div>
                    
                    {activeCycle && (
                      <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500" 
                          style={{ width: `${activeCycle.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {cycles.slice(0, 3).map(cycle => (
          <div key={cycle.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">{cycle.machineId}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(cycle.startTime).toLocaleTimeString()}</div>
            </div>
            <div>
              {cycle.status === 'completed' && <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full">COMPLETED</span>}
              {cycle.status === 'running' && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-full">RUNNING</span>}
            </div>
          </div>
        ))}
        {cycles.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">No recent activity</div>
        )}
      </div>
    </div>
  );
}
