// ============================================
// CORE ENTITIES
// ============================================

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  defaults: SessionDefaults;
  notes: string;
}

export interface SessionDefaults {
  lens: string;
  paper: PaperDefaults;
  processing: ProcessingRecord;
}

export interface PaperDefaults {
  manufacturer: string;
  name: string;
  surface: string;
}

// ============================================
// PRINT RECORD
// ============================================

export interface PrintRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
  rollId: string;
  frameNumber: string;
  paper: PaperSettings;
  exposure: ExposureSettings;
  processing: ProcessingRecord;
  testStrips: TestStrip[];
  notes: string;
  rating: number | null;
}

// ============================================
// PAPER
// ============================================

export interface PaperSettings {
  manufacturer: string;
  name: string;
  surface: string;
  size: string;
  contrast: ContrastSetting;
}

export interface ContrastSetting {
  type: 'graded' | 'multigrade';
  grade?: number;
  filterValue?: number;
}

// ============================================
// EXPOSURE
// ============================================

export interface ExposureSettings {
  aperture: number;
  baseTime: number;
  enlargerHeight: number | null;
  lens: string;
}

// ============================================
// TEST STRIPS
// ============================================

export interface TestStrip {
  id: string;
  createdAt: string;
  baseTime: number;
  interval: number;
  stripCount: number;
  selectedStrip: number | null;
  notes: string;
}

// ============================================
// PROCESSING
// ============================================

export interface ProcessingRecord {
  steps: ProcessingStep[];
  temperature: number | null;
  notes: string;
}

export interface ProcessingStep {
  chemical: string;
  dilution: string;
  duration: number;
  agitationInterval: number | null;
}

// ============================================
// APP SETTINGS
// ============================================

export interface AppSettings {
  id: string;
  transferDelay: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  defaultAgitationInterval: number;
}

// ============================================
// STICKY VALUES
// ============================================

export interface StickyValues {
  rollId: string;
  frameNumber: string;
  paperSize: string;
  contrast: ContrastSetting;
  aperture: number;
  baseTime: number;
  enlargerHeight: number | null;
}

// ============================================
// NAVIGATION
// ============================================

export type Screen =
  | { name: 'home' }
  | { name: 'sessionSetup'; sessionId?: string }
  | { name: 'printEditor'; sessionId: string; printId?: string }
  | { name: 'timer'; sessionId: string; printId: string }
  | { name: 'notes'; sessionId: string; printId: string }
  | { name: 'settings' }
  | { name: 'history' };
