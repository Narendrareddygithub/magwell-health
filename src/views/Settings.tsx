import React from 'react';
import { ArrowLeft, User as UserIcon, Shield, Bell, LogOut, Info, ChevronRight, Moon, Sun } from 'lucide-react';
import { User } from '../types';

export function Settings({ currentUser, onLogout, onBack, isDarkMode, toggleDarkMode }: { currentUser: User, onLogout: () => void, onBack: () => void, isDarkMode: boolean, toggleDarkMode: () => void }) {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <img 
            src="/mackwell-logo.png" 
            alt="Mackewell Health" 
            className="h-5 w-auto object-contain dark:invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{currentUser.name}</h3>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{currentUser.role === 'admin' ? 'Administrator' : 'Technician'}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Selby General Hospital • ID: {currentUser.id}</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Preferences</h4>
          <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button 
              onClick={toggleDarkMode}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Current: {isDarkMode ? 'ON' : 'OFF'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
              </div>
            </button>

            <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Bell size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 dark:text-white">Notifications</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Alerts & Compliance Updates</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>

          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mt-6">Compliance & Security</h4>
          <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Shield size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 dark:text-white">Security Standards</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">BS8628:2022 Verified</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Info size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 dark:text-white">About Platform</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Version 2.4.0 (Stable)</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-[32px] font-black text-sm flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/20 active:scale-95 transition-all"
        >
          <LogOut size={18} /> LOG OUT
        </button>

        <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest pt-4">
          Mackewell Health • UV-C Compliance Platform
        </p>
      </div>
    </div>
  );
}
