import React, { useState } from 'react';
import { User, Role } from '../types';
import { Lock, Delete, Shield, User as UserIcon } from 'lucide-react';

export function Login({ users, onLogin }: { users: User[], onLogin: (user: User) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumber = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleSubmit = () => {
    if (!selectedRole) return;
    const user = users.find(u => u.role === selectedRole && u.pin === pin);
    if (user) {
      onLogin(user);
    } else {
      setError(true);
      setPin('');
    }
  };

  // Auto-submit when 4 digits are entered
  React.useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <img 
          src="/mackwell-logo.png" 
          alt="Mackewell Health" 
          className="h-10 w-auto object-contain dark:invert mb-12 opacity-90"
          referrerPolicy="no-referrer"
        />
        
        <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Secure Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Select your role and enter PIN</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => { setSelectedRole('attender'); setPin(''); setError(false); }}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'attender'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <UserIcon size={24} />
              <span className="font-bold text-sm">Attender</span>
            </button>
            <button
              onClick={() => { setSelectedRole('admin'); setPin(''); setError(false); }}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'admin'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <Shield size={24} />
              <span className="font-bold text-sm">Admin</span>
            </button>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  pin.length > i 
                    ? 'bg-blue-600 dark:bg-blue-400 scale-110' 
                    : error 
                      ? 'bg-red-200 dark:bg-red-900/50' 
                      : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-center text-sm font-bold mb-4 animate-pulse">Incorrect PIN. Try again.</p>}

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button 
                key={num}
                onClick={() => handleNumber(num.toString())}
                disabled={!selectedRole}
                className="h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl text-2xl font-black text-gray-900 dark:text-white active:scale-95 transition-transform disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <div className="h-16"></div>
            <button 
              onClick={() => handleNumber('0')}
              disabled={!selectedRole}
              className="h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl text-2xl font-black text-gray-900 dark:text-white active:scale-95 transition-transform disabled:opacity-50"
            >
              0
            </button>
            <button 
              onClick={handleDelete}
              disabled={!selectedRole || pin.length === 0}
              className="h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-600 dark:text-gray-400 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Delete size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
