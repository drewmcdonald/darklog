import type {
  AppSettings,
  SessionDefaults,
  PaperSettings,
  ExposureSettings,
  ProcessingRecord,
  StickyValues,
  ContrastSetting,
} from '../types';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  id: 'app',
  transferDelay: 2,
  soundEnabled: true,
  vibrationEnabled: true,
  defaultAgitationInterval: 30,
};

export const DEFAULT_SESSION_DEFAULTS: SessionDefaults = {
  lens: '50mm',
  paper: {
    manufacturer: 'Ilford',
    name: 'Multigrade RC Deluxe',
    surface: 'Pearl',
  },
  processing: {
    steps: [
      {
        chemical: 'Developer',
        dilution: '1+9',
        duration: 90,
        agitationInterval: 30,
      },
      {
        chemical: 'Stop Bath',
        dilution: 'stock',
        duration: 30,
        agitationInterval: null,
      },
      {
        chemical: 'Fixer',
        dilution: '1+4',
        duration: 180,
        agitationInterval: 30,
      },
    ],
    temperature: 20,
    notes: '',
  },
};

export const DEFAULT_CONTRAST: ContrastSetting = {
  type: 'multigrade',
  filterValue: 2.5,
};

export const DEFAULT_PAPER_SETTINGS: PaperSettings = {
  manufacturer: 'Ilford',
  name: 'Multigrade RC Deluxe',
  surface: 'Pearl',
  size: '8x10',
  contrast: DEFAULT_CONTRAST,
};

export const DEFAULT_EXPOSURE_SETTINGS: ExposureSettings = {
  aperture: 8,
  baseTime: 10,
  enlargerHeight: null,
  lens: '50mm',
};

export const DEFAULT_PROCESSING: ProcessingRecord = {
  steps: [
    {
      chemical: 'Developer',
      dilution: '1+9',
      duration: 90,
      agitationInterval: 30,
    },
    {
      chemical: 'Stop Bath',
      dilution: 'stock',
      duration: 30,
      agitationInterval: null,
    },
    {
      chemical: 'Fixer',
      dilution: '1+4',
      duration: 180,
      agitationInterval: 30,
    },
  ],
  temperature: 20,
  notes: '',
};

export const DEFAULT_STICKY_VALUES: StickyValues = {
  rollId: '',
  frameNumber: '',
  paperSize: '8x10',
  contrast: DEFAULT_CONTRAST,
  aperture: 8,
  baseTime: 10,
  enlargerHeight: null,
};

export const PAPER_SIZES = ['4x5', '5x7', '8x10', '11x14', '16x20'];

export const APERTURES = [2.8, 4, 5.6, 8, 11, 16, 22];

export const CONTRAST_GRADES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const SURFACES = ['Glossy', 'Pearl', 'Matte', 'Satin'];
