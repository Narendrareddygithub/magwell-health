import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Minus, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Instrument, CycleInstrument } from '../types';
import { CycleProgress } from '../components/CycleProgress';

export function TheatreInstruments({ 
  instruments, 
  onNext, 
  onBack,
}: { 
  instruments: Instrument[], 
  onNext: (selected: CycleInstrument[]) => void, 
  onBack: () => void,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<CycleInstrument[]>([]);

  const filteredInstruments = instruments.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (id: string) => {
    setSelected(prev => {
      const existing = prev.find(p => p.instrumentId === id);
      if (existing) {
        return prev.map(p => p.instrumentId === id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { instrumentId: id, quantity: 1 }];
    });
  };

  const handleRemove = (id: string) => {
    setSelected(prev => {
      const existing = prev.find(p => p.instrumentId === id);
      if (existing && existing.quantity > 1) {
        return prev.map(p => p.instrumentId === id ? { ...p, quantity: p.quantity - 1 } : p);
      }
      return prev.filter(p => p.instrumentId !== id);
    });
  };

  const getQuantity = (id: string) => {
    return selected.find(p => p.instrumentId === id)?.quantity || 0;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative">
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
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Step 2 of 4</h2>
      </div>

      <CycleProgress step={2} />

      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Instruments</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the instruments and quantities.
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalogue..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-3 mb-24">
          {filteredInstruments.map(inst => {
            const qty = getQuantity(inst.id);
            return (
              <div key={inst.id} className={`bg-white dark:bg-gray-900 p-3 rounded-2xl border transition-all flex items-center gap-4 ${qty > 0 ? 'border-blue-500 shadow-md' : 'border-gray-100 dark:border-gray-800 shadow-sm'}`}>
                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {inst.image ? (
                    <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="text-gray-400" size={24} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white truncate">{inst.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{inst.category}</div>
                </div>
                
                <div className="flex-shrink-0">
                  {qty === 0 ? (
                    <button 
                      onClick={() => handleAdd(inst.id)}
                      className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-full p-1 border border-blue-100 dark:border-blue-800">
                      <button 
                        onClick={() => handleRemove(inst.id)}
                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-black text-blue-900 dark:text-blue-100 w-4 text-center">{qty}</span>
                      <button 
                        onClick={() => handleAdd(inst.id)}
                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className="w-full py-5 bg-blue-600 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
        >
          {selected.length === 0 ? 'Select Instruments' : `Continue with ${selected.reduce((a, b) => a + b.quantity, 0)} Items`} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
