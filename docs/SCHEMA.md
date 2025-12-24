# DarkLog — Data Schema

## TypeScript Definitions

```typescript
// ============================================
// CORE ENTITIES
// ============================================

interface Session {
  id: string;
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
  date: string;             // YYYY-MM-DD
  defaults: SessionDefaults;
  notes: string;
}

interface SessionDefaults {
  lens: string;                              // e.g., "50mm El-Nikkor"
  paper: PaperDefaults;
  processing: ProcessingRecord;
}

interface PaperDefaults {
  manufacturer: string;     // e.g., "Ilford"
  name: string;             // e.g., "Multigrade RC Deluxe"
  surface: string;          // e.g., "glossy", "pearl", "matte"
}

// ============================================
// PRINT RECORD
// ============================================

interface PrintRecord {
  id: string;
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
  sessionId: string;        // FK to Session
  
  // Frame identification
  rollId: string;           // e.g., "HP5 2024-12-01" or "Roll 12"
  frameNumber: string;      // e.g., "24" or "24a" (string for flexibility)
  
  // Settings
  paper: PaperSettings;
  exposure: ExposureSettings;
  processing: ProcessingRecord;
  
  // Test strips (embedded, belong to this print)
  testStrips: TestStrip[];
  
  // Notes and evaluation
  notes: string;
  rating: number | null;    // 1-5 or null if not rated
}

// ============================================
// PAPER
// ============================================

interface PaperSettings {
  manufacturer: string;
  name: string;
  surface: string;
  size: string;             // e.g., "8x10", "5x7"
  contrast: ContrastSetting;
}

interface ContrastSetting {
  type: 'graded' | 'multigrade';
  grade?: number;           // 0-5 for graded paper
  filterValue?: number;     // 00-5 for multigrade, allows half grades (2.5)
}

// ============================================
// EXPOSURE
// ============================================

interface ExposureSettings {
  aperture: number;         // f-stop value, e.g., 8, 11, 16
  baseTime: number;         // seconds
  enlargerHeight: number | null;  // mm or arbitrary units
  lens: string;             // e.g., "50mm El-Nikkor"
}

// ============================================
// TEST STRIPS
// ============================================

interface TestStrip {
  id: string;
  createdAt: string;        // ISO timestamp
  baseTime: number;         // starting exposure in seconds
  interval: number;         // seconds per strip
  stripCount: number;       // number of strips
  selectedStrip: number | null;  // 1-indexed, which strip was chosen
  notes: string;
}

// ============================================
// PROCESSING
// ============================================

interface ProcessingRecord {
  steps: ProcessingStep[];
  temperature: number | null;  // degrees Celsius
  notes: string;
}

interface ProcessingStep {
  chemical: string;         // e.g., "Ilford Multigrade Dev"
  dilution: string;         // e.g., "1+9", "stock", "1+4"
  duration: number;         // planned duration in seconds
  agitationInterval: number | null;  // seconds between agitation, null = continuous
}

// ============================================
// APP SETTINGS
// ============================================

interface AppSettings {
  transferDelay: number;    // seconds between processing steps (default: 2)
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  defaultAgitationInterval: number;  // seconds, can override per step
}
```

## Storage Keys (IndexedDB)

| Store Name | Key | Description |
|------------|-----|-------------|
| `sessions` | `id` | All session records |
| `prints` | `id` | All print records |
| `settings` | `'app'` | Single app settings object |

## Relationships

```
Session (1) ──────< (many) PrintRecord
                         │
                         └── testStrips[] (embedded)
```

- PrintRecord.sessionId → Session.id
- TestStrip is embedded in PrintRecord (not a separate store)

## ID Generation

Use `crypto.randomUUID()` for all IDs.

## Timestamps

All timestamps are ISO 8601 format: `2024-12-23T14:30:00.000Z`

Use `new Date().toISOString()` for generation.

## Indexes for Querying

On `prints` store:
- `sessionId` — fetch all prints for a session
- `rollId` — search by roll
- `[rollId, frameNumber]` — compound index for specific frame lookup
- `createdAt` — chronological ordering

On `sessions` store:
- `date` — browse by date
- `createdAt` — chronological ordering

## Migration Notes

- `rollId` is a string for now; may evolve to FK to a `rolls` table in future version
- If we add Roll entity later, migration should:
  1. Extract unique rollId values
  2. Create Roll records
  3. Update PrintRecord to use rollId as FK
  4. Preserve original string as Roll.name
