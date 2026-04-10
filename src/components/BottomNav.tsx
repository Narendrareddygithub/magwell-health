import React from 'react';
import { Home, List, Barcode, Settings as SettingsIcon, FileText, Search, ShieldAlert, Wrench } from 'lucide-react';
import { ViewState, User } from '../types';

export default function BottomNav({ currentView, setCurrentView, currentUser }: { currentView: ViewState, setCurrentView: (v: ViewState) => void, currentUser: User | null }) {
  if (currentUser?.role === 'admin') {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 px-2 pb-2 z-50 transition-colors duration-300">
        <button onClick={() => setCurrentView('admin_dashboard')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'admin_dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>
        <button onClick={() => setCurrentView('admin_export')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'admin_export' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <FileText size={20} />
          <span className="text-[10px] mt-1 font-medium">Reporting</span>
        </button>
        <button onClick={() => setCurrentView('admin_audit')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'admin_audit' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <Search size={20} />
          <span className="text-[10px] mt-1 font-medium text-center leading-tight">Audit &<br/>Search</span>
        </button>
        <button onClick={() => setCurrentView('admin_anomalies')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'admin_anomalies' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <ShieldAlert size={20} />
          <span className="text-[10px] mt-1 font-medium text-center leading-tight">Safety<br/>Oversights</span>
        </button>
        <button onClick={() => setCurrentView('admin_maintenance')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'admin_maintenance' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <Wrench size={20} />
          <span className="text-[10px] mt-1 font-medium">Maintenance</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 px-2 pb-2 z-50 transition-colors duration-300">
      <button onClick={() => setCurrentView('theatre_home')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'theatre_home' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        <Home size={20} />
        <span className="text-[10px] mt-1 font-medium">Home</span>
      </button>
      <button onClick={() => setCurrentView('export')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'export' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        <List size={20} />
        <span className="text-[10px] mt-1 font-medium">Logs</span>
      </button>
      
      {/* PhonePe Style Scan Button */}
      <div className="relative -top-5">
        <button 
          onClick={() => setCurrentView('simulation')}
          className="w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-gray-800 transform transition active:scale-95"
        >
          <Barcode size={24} />
        </button>
      </div>

      <button onClick={() => setCurrentView('simulation')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'simulation' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        <Barcode size={20} />
        <span className="text-[10px] mt-1 font-medium">Barcodes</span>
      </button>
      <button onClick={() => setCurrentView('admin_dashboard')} className={`flex flex-col items-center justify-center w-16 transition-colors ${currentView === 'admin_dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        <SettingsIcon size={20} />
        <span className="text-[10px] mt-1 font-medium">Admin</span>
      </button>
    </div>
  );
}
