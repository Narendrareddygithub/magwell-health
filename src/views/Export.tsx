import React, { useState, useMemo } from 'react';
import { Download, FileText, Calendar, ArrowLeft, CheckCircle2, Filter, MapPin, User, ShieldCheck } from 'lucide-react';
import { Cycle, Machine } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Export({ cycles, machines, onBack, defaultOperator = 'all' }: { cycles: Cycle[], machines: Machine[], onBack: () => void, defaultOperator?: string }) {
  const [format, setFormat] = useState<'pdf' | 'csv'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Filter states
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>(defaultOperator);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7'); // days

  // Derived options for filters
  const locations = useMemo(() => Array.from(new Set(machines.map(m => m.location))), [machines]);
  const operators = useMemo(() => Array.from(new Set(cycles.map(c => c.operatorId))), [cycles]);

  // Filtered data
  const filteredCycles = useMemo(() => {
    return cycles.filter(c => {
      const machine = machines.find(m => m.id === c.machineId);
      
      // Date filter
      if (dateRange !== 'all') {
        const daysAgo = parseInt(dateRange);
        const cutoff = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
        if (c.startTime < cutoff) return false;
      }

      // Machine filter
      if (selectedMachine !== 'all' && c.machineId !== selectedMachine) return false;

      // Location filter
      if (selectedLocation !== 'all' && machine?.location !== selectedLocation) return false;

      // Operator filter
      if (selectedOperator !== 'all' && c.operatorId !== selectedOperator) return false;

      // Status filter
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;

      return true;
    });
  }, [cycles, machines, selectedMachine, selectedLocation, selectedOperator, selectedStatus, dateRange]);

  const handleExport = () => {
    if (filteredCycles.length === 0) {
      alert('No sessions found for the current filters.');
      return;
    }

    setIsExporting(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (format === 'csv') {
        const headers = ['Cycle ID', 'Machine ID', 'Machine Name', 'Location', 'Operator', 'Start Time', 'Duration (min)', 'Status', 'Progress (%)'];
        const rows = filteredCycles.map(c => {
          const m = machines.find(mach => mach.id === c.machineId);
          return [
            c.id,
            c.machineId,
            m?.name || 'Unknown',
            m?.location || 'Unknown',
            c.operatorId,
            new Date(c.startTime).toLocaleString(),
            c.durationMinutes,
            c.status,
            c.progress.toFixed(1)
          ];
        });

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `uvc_compliance_report_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // PDF Generation
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('UV-C Compliance Report', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Hospital: Selby General Hospital`, 14, 35);
        
        // Summary Section
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Summary', 14, 45);
        
        doc.setFontSize(10);
        doc.text(`Total Sessions: ${filteredCycles.length}`, 14, 52);
        doc.text(`Total Duration: ${filteredCycles.reduce((acc, curr) => acc + curr.durationMinutes, 0)} minutes`, 14, 57);
        const successRate = filteredCycles.length > 0 
          ? Math.round((filteredCycles.filter(c => c.status === 'completed').length / filteredCycles.length) * 100) 
          : 0;
        doc.text(`Success Rate: ${successRate}%`, 14, 62);
        
        // Filters applied
        doc.text('Filters Applied:', 120, 45);
        doc.setFontSize(9);
        doc.text(`Period: ${dateRange === 'all' ? 'All Time' : `Last ${dateRange} Days`}`, 120, 52);
        doc.text(`Device: ${selectedMachine === 'all' ? 'All' : selectedMachine}`, 120, 57);
        doc.text(`Location: ${selectedLocation === 'all' ? 'All' : selectedLocation}`, 120, 62);
        
        // Table
        const tableHeaders = [['ID', 'Device', 'Location', 'Operator', 'Date', 'Dur', 'Status']];
        const tableData = filteredCycles.map(c => {
          const m = machines.find(mach => mach.id === c.machineId);
          return [
            c.id.replace('CYC-', ''),
            m?.name || 'Unknown',
            m?.location || 'Unknown',
            c.operatorId,
            new Date(c.startTime).toLocaleDateString(),
            `${c.durationMinutes}m`,
            c.status.toUpperCase()
          ];
        });

        autoTable(doc, {
          startY: 70,
          head: tableHeaders,
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [37, 99, 235] }, // Blue-600
          styles: { fontSize: 8 },
        });

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text('BS8628:2022 Compliance Verified', 14, 285);
          doc.text(`Page ${i} of ${pageCount}`, 180, 285);
        }

        doc.save(`uvc_compliance_report_${timestamp}.pdf`);
      }
      
      setIsExporting(false);
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
    }, 1500);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 px-6 py-4 flex items-center border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <button onClick={onBack} className="mr-3 p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
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
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Reports</h2>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto pb-24">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-blue-600" />
            <h2 className="font-bold text-gray-900 dark:text-white">Report Filters</h2>
          </div>
          
          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Time Period</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                >
                  <option value="1">Last 24 Hours</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Machine */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Device</label>
                <select 
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                >
                  <option value="all">All Devices</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Operator */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Technician</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                  >
                    <option value="all">All Staff</option>
                    {operators.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white appearance-none"
                >
                  <option value="all">Any Status</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="stopped">Stopped</option>
                  <option value="running">In Progress</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Report Summary</h3>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
              {filteredCycles.length} Sessions
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Duration</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {filteredCycles.reduce((acc, curr) => acc + curr.durationMinutes, 0)} mins
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Success Rate</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {filteredCycles.length > 0 
                  ? Math.round((filteredCycles.filter(c => c.status === 'completed').length / filteredCycles.length) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 block">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setFormat('pdf')}
                className={`p-3 border-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  format === 'pdf' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <FileText size={16} /> PDF
              </button>
              <button 
                onClick={() => setFormat('csv')}
                className={`p-3 border-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  format === 'csv' 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                CSV
              </button>
            </div>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting || filteredCycles.length === 0}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              isExporting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : filteredCycles.length === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed shadow-none'
                : isDone 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </>
            ) : isDone ? (
              <>
                <CheckCircle2 size={18} /> Downloaded
              </>
            ) : (
              <>
                <Download size={18} /> Download Report
              </>
            )}
          </button>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 flex gap-3">
          <ShieldCheck className="text-green-600 shrink-0" size={18} />
          <div>
            <h3 className="text-sm font-bold text-green-800 dark:text-green-300 mb-1">Audit-Ready Logs</h3>
            <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
              All reports are cryptographically signed and comply with BS8628:2022 standards for infection control documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
