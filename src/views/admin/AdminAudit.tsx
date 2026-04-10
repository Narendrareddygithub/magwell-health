import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowLeft, Calendar, User, Hash } from 'lucide-react';
import { Cycle, Machine, ViewState } from '../../types';

export function AdminAudit({ 
  cycles, 
  machines, 
  onBack,
  onViewCycle
}: { 
  cycles: Cycle[], 
  machines: Machine[], 
  onBack: () => void,
  onViewCycle: (id: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperator, setFilterOperator] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const operators = useMemo(() => Array.from(new Set(cycles.map(c => c.operatorId))), [cycles]);

  const filteredCycles = useMemo(() => {
    return cycles.filter(c => {
      // Search by Patient ID or Cycle ID
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesPatient = c.patientId?.toLowerCase().includes(term);
        const matchesCycle = c.id.toLowerCase().includes(term);
        if (!matchesPatient && !matchesCycle) return false;
      }

      // Filter by Operator
      if (filterOperator !== 'all' && c.operatorId !== filterOperator) return false;

      // Filter by Date
      if (dateRange !== 'all') {
        const daysAgo = parseInt(dateRange);
        const cutoff = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
        if (c.startTime < cutoff) return false;
      }

      return true;
    }).sort((a, b) => b.startTime - a.startTime);
  }, [cycles, searchTerm, filterOperator, dateRange]);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
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
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Audit Trail</h2>
      </div>

      <div className="p-6 flex-1 overflow-y-auto pb-24">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-[28px] shadow-sm border border-gray-100 dark:border-gray-800 mb-6 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search Patient ID or Cycle ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Technician</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                >
                  <option value="all">All Staff</option>
                  {operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Time Period</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="1">Last 24 Hours</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
            {filteredCycles.length} Records Found
          </h3>
          {filteredCycles.map(cycle => {
            const machine = machines.find(m => m.id === cycle.machineId);
            return (
              <div 
                key={cycle.id}
                onClick={() => onViewCycle(cycle.id)}
                className="bg-white dark:bg-gray-900 p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Hash size={14} className="text-gray-400" />
                      <span className="font-black text-gray-900 dark:text-white">{cycle.id}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(cycle.startTime).toLocaleString()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    cycle.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    cycle.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    cycle.status === 'stopped' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {cycle.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Patient ID</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{cycle.patientId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Technician</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{cycle.operatorId}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredCycles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 dark:text-gray-500 font-bold">No records match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
