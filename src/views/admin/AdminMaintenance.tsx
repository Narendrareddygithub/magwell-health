import React, { useState } from 'react';
import { Users, Database, ArrowLeft, Plus, Save, Shield, HardDrive } from 'lucide-react';
import { User } from '../../types';

export function AdminMaintenance({ 
  users, 
  onBack,
  onUpdateUsers
}: { 
  users: User[], 
  onBack: () => void,
  onUpdateUsers: (users: User[]) => void
}) {
  const [activeTab, setActiveTab] = useState<'users' | 'instruments' | 'system'>('users');
  const [localUsers, setLocalUsers] = useState<User[]>(users);
  
  // New user form state
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPin, setNewUserPin] = useState('');
  const [newUserRole, setNewUserRole] = useState<'attender' | 'admin'>('attender');

  // New instrument form state
  const [showNewInstForm, setShowNewInstForm] = useState(false);
  const [newInstName, setNewInstName] = useState('');
  const [newInstCategory, setNewInstCategory] = useState('General');
  const [newInstImage, setNewInstImage] = useState('');

  const handleAddUser = () => {
    if (!newUserName || newUserPin.length !== 4) {
      alert('Please provide a name and a 4-digit PIN.');
      return;
    }
    const newUser: User = {
      id: `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: newUserName,
      role: newUserRole,
      pin: newUserPin
    };
    const updatedUsers = [...localUsers, newUser];
    setLocalUsers(updatedUsers);
    onUpdateUsers(updatedUsers);
    setShowNewUserForm(false);
    setNewUserName('');
    setNewUserPin('');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = localUsers.filter(u => u.id !== id);
      setLocalUsers(updatedUsers);
      onUpdateUsers(updatedUsers);
    }
  };

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
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Maintenance</h2>
      </div>

      <div className="p-6 flex-1 overflow-y-auto pb-24">
        {/* Tabs */}
        <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'users' 
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Users size={16} /> User Mgmt
          </button>
          <button 
            onClick={() => setActiveTab('instruments')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'instruments' 
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Plus size={16} /> Instruments
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'system' 
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Database size={16} /> System Data
          </button>
        </div>

        {activeTab === 'users' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Staff Accounts</h3>
              <button 
                onClick={() => setShowNewUserForm(!showNewUserForm)}
                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {showNewUserForm && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-[24px] shadow-sm border border-blue-200 dark:border-blue-900/50 space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white">Add New User</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
                  <input 
                    type="text" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">4-Digit PIN</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={newUserPin}
                      onChange={(e) => setNewUserPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Role</label>
                    <select 
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as 'attender' | 'admin')}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                    >
                      <option value="attender">Attender</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleAddUser}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Save User
                  </button>
                  <button 
                    onClick={() => setShowNewUserForm(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {localUsers.map(user => (
                <div key={user.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{user.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{user.role}</span>
                        <span className="text-[10px] text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">ID: {user.id}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'instruments' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Instrument Catalogue</h3>
              <button 
                onClick={() => setShowNewInstForm(!showNewInstForm)}
                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {showNewInstForm && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-[24px] shadow-sm border border-blue-200 dark:border-blue-900/50 space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white">Add New Instrument</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
                  <input 
                    type="text" 
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    placeholder="e.g. Scalpel Handle"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
                  <select 
                    value={newInstCategory}
                    onChange={(e) => setNewInstCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                  >
                    <option>General</option>
                    <option>Respiratory</option>
                    <option>Airway</option>
                    <option>Surgical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Image</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        // Simulate camera capture
                        setNewInstImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200&h=200');
                        alert('Camera opened. Image captured.');
                      }}
                      className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Capture Photo
                    </button>
                    {newInstImage && (
                      <img src={newInstImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      if (!newInstName) return;
                      alert('Instrument added to catalogue.');
                      setShowNewInstForm(false);
                      setNewInstName('');
                      setNewInstImage('');
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Save Instrument
                  </button>
                  <button 
                    onClick={() => setShowNewInstForm(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Instrument catalogue is managed here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[28px] shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Retention Policy</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Configure how long audit logs and video evidence are stored locally before being securely archived or deleted.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Log Retention</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none">
                    <option>7 Years (Standard Compliance)</option>
                    <option>10 Years</option>
                    <option>Indefinite</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Video Evidence Retention</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none">
                    <option>30 Days</option>
                    <option>90 Days</option>
                    <option>1 Year</option>
                  </select>
                </div>
                <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Save size={16} /> Save Policies
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-[28px] shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-xl">
                  <HardDrive size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Encrypted Backup</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Create a secure, encrypted backup of all system data, user accounts, and audit logs to external storage.
              </p>
              <button 
                onClick={() => {
                  alert('Initiating encrypted backup to external storage...');
                }}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
              >
                Start Backup Process
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
