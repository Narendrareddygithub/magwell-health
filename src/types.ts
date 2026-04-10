export type Role = 'attender' | 'admin';

export type User = {
  id: string;
  name: string;
  role: Role;
  pin: string;
};

export type Instrument = {
  id: string;
  name: string;
  category: string;
  image?: string;
};

export type CycleInstrument = {
  instrumentId: string;
  quantity: number;
};

export type Machine = {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'idle' | 'running' | 'offline';
  configuredDuration: number; // 5 or 10
};

export type Cycle = {
  id: string;
  machineId: string;
  operatorId: string;
  patientId?: string;
  instruments: CycleInstrument[];
  startTime: number;
  durationMinutes: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped' | 'paused';
  progress: number;
  elapsedTimeMs?: number;
  hasVideoEvidence: boolean;
  manualConfirmation: boolean;
  signature?: string;
  anomalyFlags?: string[];
};

export type ViewState = 
  | 'provisioning' 
  | 'login' 
  | 'theatre_home'
  | 'theatre_patient' 
  | 'theatre_instruments' 
  | 'theatre_cycle' 
  | 'theatre_evidence' 
  | 'admin_dashboard' 
  | 'admin_audit'
  | 'admin_export'
  | 'admin_anomalies'
  | 'admin_maintenance'
  | 'digital_manual' 
  | 'simulation'
  | 'settings'
  | 'machine_details'
  | 'active_cycle'
  | 'export';
