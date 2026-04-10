import React, { useState, useEffect } from 'react';
import { MessageSquare, BookOpen } from 'lucide-react';
import { Home, Scanner, CycleSetup, ActiveCycle, Sessions, DigitalManual, Simulation, Export, MachineDetails, Settings, Login, TheatrePatient, TheatreInstruments, TheatreCycle, TheatreEvidence, AdminDashboard, AdminAudit, AdminAnomalies, AdminMaintenance } from './views';
import BottomNav from './components/BottomNav';
import { ViewState, Machine, Cycle, User, Instrument, CycleInstrument } from './types';

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'USR-001', name: 'ADMIN', role: 'admin', pin: '8080' },
  { id: 'USR-002', name: 'ATTENDER', role: 'attender', pin: '8080' },
];

const MOCK_INSTRUMENTS: Instrument[] = [
  { id: 'INST-001', name: 'Anaesthetic Mask', category: 'Respiratory', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'INST-002', name: 'Video Laryngoscope Blade', category: 'Airway', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'INST-003', name: 'Surgical Scissors', category: 'General', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'INST-004', name: 'Forceps', category: 'General', image: 'https://images.unsplash.com/photo-1583947581924-860bda6a5a00?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'INST-OTHER', name: 'Others', category: 'Miscellaneous' },
];

const MOCK_MACHINES: Machine[] = [
  { id: 'DEV-001', name: 'UV-C Unit Alpha', model: 'MINIBOX-HD2', location: 'Ward A', status: 'idle', configuredDuration: 5 },
];

const MOCK_CYCLES: Cycle[] = [
  {
    id: 'CYC-101',
    machineId: 'DEV-001',
    operatorId: 'USR-001',
    patientId: 'PAT-8829',
    instruments: [{ instrumentId: 'INST-001', quantity: 2 }],
    startTime: Date.now() - 1000 * 60 * 5,
    durationMinutes: 5,
    status: 'completed',
    progress: 100,
    elapsedTimeMs: 1000 * 60 * 5,
    hasVideoEvidence: false,
    manualConfirmation: true,
  },
  {
    id: 'CYC-102',
    machineId: 'DEV-002',
    operatorId: 'USR-002',
    patientId: 'PAT-1122',
    instruments: [{ instrumentId: 'INST-002', quantity: 1 }],
    startTime: Date.now() - 1000 * 60 * 60 * 2,
    durationMinutes: 10,
    status: 'completed',
    progress: 100,
    hasVideoEvidence: true,
    manualConfirmation: true,
    signature: 'sig_abc123',
  },
  {
    id: 'CYC-103',
    machineId: 'DEV-003',
    operatorId: 'USR-002',
    patientId: 'PAT-9999',
    instruments: [{ instrumentId: 'INST-003', quantity: 3 }],
    startTime: Date.now() - 1000 * 60 * 60 * 24,
    durationMinutes: 2, // Short cycle anomaly
    status: 'completed',
    progress: 100,
    hasVideoEvidence: false, // Missing video anomaly
    manualConfirmation: true,
    signature: 'sig_xyz789',
    anomalyFlags: ['short_cycle', 'missing_video']
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [previousView, setPreviousView] = useState<ViewState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigateTo = (view: ViewState) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES);
  const [cycles, setCycles] = useState<Cycle[]>(MOCK_CYCLES);
  const [instrumentsList, setInstrumentsList] = useState<Instrument[]>(MOCK_INSTRUMENTS);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Temporary state for the cycle creation flow
  const [tempPatientId, setTempPatientId] = useState<string>('');
  const [tempInstruments, setTempInstruments] = useState<CycleInstrument[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Timer to update cycle progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCycles(prev => prev.map(cycle => {
        if (cycle.status === 'running') {
          const currentElapsed = cycle.elapsedTimeMs || 0;
          const newElapsed = currentElapsed + 100; // Increment by interval
          
          // Speed up for demo: 1 minute = 2 seconds
          const totalMs = cycle.durationMinutes * 2000;
          const progress = Math.min(100, (newElapsed / totalMs) * 100);
          
          if (progress >= 100) {
            // Wait for manual confirmation, don't auto-complete
            return { ...cycle, progress: 100, elapsedTimeMs: newElapsed };
          }
          return { ...cycle, progress, elapsedTimeMs: newElapsed };
        }
        return cycle;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Update machine status based on cycles
  useEffect(() => {
    setMachines(prev => prev.map(m => {
      const active = cycles.find(c => c.machineId === m.id && (c.status === 'running' || c.status === 'paused'));
      return { ...m, status: active ? 'running' : 'idle' };
    }));
  }, [cycles]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'attender') {
      setSelectedMachineId(machines[0].id);
      setCurrentView('machine_details');
    } else if (user.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('theatre_home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleScan = (machineId: string) => {
    setSelectedMachineId(machineId);
    setCurrentView('theatre_patient');
  };

  const handlePatientNext = (patientId: string) => {
    setTempPatientId(patientId);
    setCurrentView('theatre_instruments');
  };

  const handleInstrumentsNext = (instruments: CycleInstrument[]) => {
    setTempInstruments(instruments);
    
    // Create pending cycle
    const machine = machines.find(m => m.id === selectedMachineId);
    const durationMinutes = machine?.configuredDuration || 5;

    const newCycle: Cycle = {
      id: `CYC-${Date.now()}`,
      machineId: selectedMachineId!,
      operatorId: currentUser?.id || 'unknown',
      patientId: tempPatientId,
      instruments: instruments,
      startTime: Date.now(),
      durationMinutes,
      status: 'pending',
      progress: 0,
      elapsedTimeMs: 0,
      hasVideoEvidence: false,
      manualConfirmation: false,
    };
    setCycles([newCycle, ...cycles]);
    setActiveCycleId(newCycle.id);
    setCurrentView('theatre_cycle');
  };

  const startSimulation = (cycleId: string) => {
    setCycles(prev => prev.map(c => 
      c.id === cycleId ? { ...c, status: 'running', startTime: Date.now() } : c
    ));
  };

  const stopCycle = (cycleId: string) => {
    setCycles(prev => prev.map(c => 
      c.id === cycleId ? { ...c, status: 'stopped' } : c
    ));
    setCurrentView('theatre_home');
  };

  const pauseCycle = (cycleId: string) => {
    setCycles(prev => prev.map(c => {
      if (c.id === cycleId) {
        const newStatus = c.status === 'paused' ? 'running' : 'paused';
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const completeCycle = (hasVideo: boolean) => {
    if (!activeCycleId) return;
    setCycles(prev => prev.map(c => 
      c.id === activeCycleId ? { 
        ...c, 
        status: 'completed', 
        hasVideoEvidence: hasVideo, 
        manualConfirmation: true,
        signature: `sig_${Date.now()}` 
      } : c
    ));
    if (currentUser?.role === 'attender') {
      setCurrentView('machine_details');
    } else {
      setCurrentView('theatre_home');
    }
  };

  const renderView = () => {
    if (currentView === 'login') {
      return <Login users={users} onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'theatre_home': return (
        <Home 
          currentUser={currentUser!}
          cycles={cycles} 
          machines={machines} 
          onNavigate={(v) => setCurrentView(v as ViewState)} 
          onViewMachine={(id) => {
            const active = cycles.find(c => c.machineId === id && (c.status === 'running' || c.status === 'paused'));
            if (active) {
              setActiveCycleId(active.id);
              navigateTo('active_cycle');
            } else {
              setSelectedMachineId(id);
              navigateTo('machine_details');
            }
          }}
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
      );
      case 'theatre_patient': return (
        <TheatrePatient 
          onNext={handlePatientNext} 
          onBack={() => currentUser?.role === 'attender' ? setCurrentView('machine_details') : setCurrentView('theatre_home')} 
        />
      );
      case 'theatre_instruments': return (
        <TheatreInstruments 
          instruments={instrumentsList} 
          onNext={handleInstrumentsNext} 
          onBack={() => setCurrentView('theatre_patient')} 
        />
      );
      case 'theatre_cycle': return (
        <TheatreCycle 
          cycleId={activeCycleId!} 
          cycles={cycles} 
          machines={machines} 
          instruments={instrumentsList}
          onComplete={() => setCurrentView('theatre_evidence')} 
          onStop={() => stopCycle(activeCycleId!)} 
          onStartSimulation={startSimulation}
        />
      );
      case 'theatre_evidence': return (
        <TheatreEvidence 
          onComplete={completeCycle} 
        />
      );
      case 'digital_manual': return (
        <DigitalManual onBack={() => setCurrentView('theatre_home')} />
      );
      case 'export': return (
        <Export 
          cycles={cycles} 
          machines={machines} 
          onBack={() => setCurrentView('theatre_home')} 
          defaultOperator={currentUser?.id}
        />
      );
      case 'active_cycle': return (
        <ActiveCycle 
          cycleId={activeCycleId!} 
          cycles={cycles} 
          machines={machines} 
          onBack={() => setCurrentView(previousView)} 
          onPause={() => pauseCycle(activeCycleId!)} 
          onStop={() => stopCycle(activeCycleId!)} 
        />
      );
      case 'admin_reports': return (
        <Sessions 
          cycles={cycles} 
          machines={machines} 
          onNavigate={(v) => setCurrentView(v as ViewState)}
          onViewCycle={(id) => {
            setActiveCycleId(id);
            setCurrentView('active_cycle');
          }}
        />
      );
      case 'machine_details': return (
        <MachineDetails 
          machineId={selectedMachineId!} 
          machines={machines} 
          cycles={cycles} 
          onBack={() => currentUser?.role === 'attender' ? setCurrentView('login') : setCurrentView('theatre_home')} 
          onStartCycle={(id) => {
            setSelectedMachineId(id);
            setCurrentView('theatre_patient');
          }}
          onViewActiveCycle={(id) => {
            const cycle = cycles.find(c => c.id === id);
            setActiveCycleId(id);
            if (cycle?.status === 'running' || cycle?.status === 'pending') {
              navigateTo('theatre_cycle');
            } else {
              navigateTo('active_cycle');
            }
          }}
          currentUser={currentUser}
        />
      );
      case 'settings': return (
        <Settings 
          currentUser={currentUser!} 
          onLogout={handleLogout} 
          onBack={() => setCurrentView('theatre_home')} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      );
      case 'simulation': return <Simulation machines={machines} onSimulateScan={handleScan} onBack={() => setCurrentView('theatre_home')} />;
      case 'admin_dashboard': return (
        <AdminDashboard 
          machines={machines}
          cycles={cycles}
          onNavigate={(v) => setCurrentView(v)}
          onLogout={handleLogout}
          onViewActiveCycle={(id) => {
            const cycle = cycles.find(c => c.id === id);
            setActiveCycleId(id);
            if (cycle?.status === 'running' || cycle?.status === 'pending') {
              navigateTo('theatre_cycle');
            } else {
              navigateTo('active_cycle');
            }
          }}
        />
      );
      case 'admin_audit': return (
        <AdminAudit 
          cycles={cycles}
          machines={machines}
          onBack={() => setCurrentView('admin_dashboard')}
          onViewCycle={(id) => {
            setActiveCycleId(id);
            setCurrentView('active_cycle');
          }}
        />
      );
      case 'admin_export': return (
        <Export 
          cycles={cycles}
          machines={machines}
          onBack={() => setCurrentView('admin_dashboard')}
          defaultOperator="all"
        />
      );
      case 'admin_anomalies': return (
        <AdminAnomalies 
          cycles={cycles}
          machines={machines}
          onBack={() => setCurrentView('admin_dashboard')}
          onViewCycle={(id) => {
            setActiveCycleId(id);
            setCurrentView('active_cycle');
          }}
        />
      );
      case 'admin_maintenance': return (
        <AdminMaintenance 
          users={users}
          onBack={() => setCurrentView('admin_dashboard')}
          onUpdateUsers={(newUsers) => {
            setUsers(newUsers);
          }}
        />
      );
      default: return (
        <div className="p-6 text-center mt-20">
          <h2 className="text-xl font-bold">View under construction: {currentView}</h2>
          <button onClick={() => setCurrentView('theatre_home')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Home</button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center font-sans transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-screen flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-300">
        <div className="flex-1 overflow-y-auto pb-20">
          {renderView()}
        </div>

        {currentUser?.role === 'admin' && currentView !== 'login' && currentView !== 'simulation' && currentView !== 'theatre_patient' && currentView !== 'theatre_instruments' && currentView !== 'theatre_cycle' && currentView !== 'theatre_evidence' && (
          <BottomNav currentView={currentView as any} setCurrentView={(v) => setCurrentView(v as ViewState)} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}
