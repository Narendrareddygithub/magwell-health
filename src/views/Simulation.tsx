import React from 'react';
import { Machine } from '../types';
import Barcode from 'react-barcode';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export function Simulation({ machines, onSimulateScan, onBack }: { machines: Machine[], onSimulateScan: (id: string) => void, onBack: () => void }) {
  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-950 min-h-full transition-colors duration-300">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <img 
          src="/mackwell-logo.png" 
          alt="Mackewell Health" 
          className="h-6 w-auto object-contain dark:invert opacity-80"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Facility Devices</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Scan these barcodes with the tablet or tap them to simulate a scan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {machines.map((machine, index) => (
          <motion.div 
            key={machine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-6 group hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
                <img 
                  src="/minibox-hd2-image.jpg" 
                  alt="MINIBOX-HD2" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-2 h-2 rounded-full ${machine.status === 'idle' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></span>
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{machine.status}</span>
                </div>
                <div className="font-black text-gray-900 dark:text-white text-lg leading-tight">{machine.name}</div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500">{machine.model} • {machine.location}</div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(50);
                onSimulateScan(machine.id);
              }}
              className="relative p-4 bg-white dark:bg-white rounded-2xl shadow-inner border border-gray-100 group-hover:scale-[1.02] transition-transform w-full overflow-hidden flex flex-col items-center justify-center"
            >
              <div className="scale-75 sm:scale-100 origin-center">
                <Barcode 
                  value={machine.id} 
                  format="CODE128"
                  width={2}
                  height={60}
                  displayValue={true}
                  background="transparent"
                  lineColor="#000000"
                  margin={0}
                />
              </div>
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-blue-600 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm absolute">
                  TAP TO SCAN
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[32px] border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-black text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wide">Simulation Mode</h3>
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          These 1D barcodes are generated dynamically for each machine in the facility. 
          In a real-world scenario, these would be printed and affixed to the <span className="font-bold">MINIBOX-HD2</span> hardware.
        </p>
      </div>
    </div>
  );
}
