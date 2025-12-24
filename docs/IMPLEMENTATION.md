# DarkLog — Technical Implementation Guide

## Tech Stack

### Core
- **Framework**: React 18+ with TypeScript
- **Build**: Vite
- **Styling**: CSS Modules or Tailwind (dark theme only)
- **Storage**: IndexedDB via idb library
- **PWA**: vite-plugin-pwa (Workbox)

### No External Dependencies For
- State management (React Context + useReducer is sufficient)
- Routing (simple enough for hash-based or single-page state machine)
- UI components (custom, minimal)

## Project Structure

```
darklog/
├── docs/
│   ├── PRD.md
│   ├── SCHEMA.md
│   ├── UI_SPEC.md
│   └── IMPLEMENTATION.md
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sounds/
│       ├── step-end.mp3
│       ├── final-end.mp3
│       └── agitate.mp3
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts          # All TypeScript interfaces
│   ├── db/
│   │   ├── index.ts          # IndexedDB setup
│   │   ├── sessions.ts       # Session CRUD
│   │   └── prints.ts         # Print CRUD
│   ├── hooks/
│   │   ├── useDB.ts          # Database access hook
│   │   ├── useTimer.ts       # Timer logic
│   │   ├── useVibration.ts   # Haptic feedback
│   │   └── useAudio.ts       # Sound playback
│   ├── context/
│   │   ├── AppContext.tsx    # Global state
│   │   └── TimerContext.tsx  # Timer state (isolated for performance)
│   ├── screens/
│   │   ├── Home.tsx
│   │   ├── SessionSetup.tsx
│   │   ├── PrintEditor.tsx
│   │   ├── Timer.tsx
│   │   ├── Notes.tsx
│   │   ├── Settings.tsx
│   │   └── History.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── RatingPicker.tsx
│   │   ├── ChemistryStepEditor.tsx
│   │   └── TestStripEntry.tsx
│   └── utils/
│       ├── id.ts             # UUID generation
│       ├── time.ts           # Time formatting
│       └── defaults.ts       # Default values
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## IndexedDB Setup

```typescript
// src/db/index.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Session, PrintRecord, AppSettings } from '../types';

interface DarkLogDB extends DBSchema {
  sessions: {
    key: string;
    value: Session;
    indexes: {
      'by-date': string;
      'by-created': string;
    };
  };
  prints: {
    key: string;
    value: PrintRecord;
    indexes: {
      'by-session': string;
      'by-roll': string;
      'by-created': string;
    };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

export async function initDB(): Promise<IDBPDatabase<DarkLogDB>> {
  return openDB<DarkLogDB>('darklog', 1, {
    upgrade(db) {
      // Sessions store
      const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
      sessionStore.createIndex('by-date', 'date');
      sessionStore.createIndex('by-created', 'createdAt');

      // Prints store
      const printStore = db.createObjectStore('prints', { keyPath: 'id' });
      printStore.createIndex('by-session', 'sessionId');
      printStore.createIndex('by-roll', 'rollId');
      printStore.createIndex('by-created', 'createdAt');

      // Settings store
      db.createObjectStore('settings', { keyPath: 'id' });
    },
  });
}
```

## Timer Implementation

```typescript
// src/hooks/useTimer.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { ProcessingStep } from '../types';
import { useAudio } from './useAudio';
import { useVibration } from './useVibration';

interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'transferring' | 'complete';
  currentStepIndex: number;
  remainingTime: number;        // seconds
  nextAgitationIn: number | null;
}

export function useTimer(
  steps: ProcessingStep[],
  transferDelay: number,
  onComplete: () => void
) {
  const [state, setState] = useState<TimerState>({
    status: 'idle',
    currentStepIndex: 0,
    remainingTime: steps[0]?.duration ?? 0,
    nextAgitationIn: steps[0]?.agitationInterval ?? null,
  });

  const intervalRef = useRef<number | null>(null);
  const { playStepEnd, playFinalEnd, playAgitate } = useAudio();
  const { vibrateStep, vibrateAgitate } = useVibration();

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'running') return prev;

      const newRemaining = prev.remainingTime - 1;
      let newAgitation = prev.nextAgitationIn !== null 
        ? prev.nextAgitationIn - 1 
        : null;

      // Agitation reminder
      if (newAgitation === 0) {
        playAgitate();
        vibrateAgitate();
        const interval = steps[prev.currentStepIndex].agitationInterval;
        newAgitation = interval ?? null;
      }

      // Step complete
      if (newRemaining <= 0) {
        const isLastStep = prev.currentStepIndex >= steps.length - 1;
        
        if (isLastStep) {
          playFinalEnd();
          vibrateStep();
          onComplete();
          return { ...prev, status: 'complete', remainingTime: 0 };
        }

        // Start transfer delay
        playStepEnd();
        vibrateStep();
        return {
          ...prev,
          status: 'transferring',
          remainingTime: transferDelay,
        };
      }

      return {
        ...prev,
        remainingTime: newRemaining,
        nextAgitationIn: newAgitation,
      };
    });
  }, [steps, transferDelay, onComplete]);

  // Handle transfer completion
  useEffect(() => {
    if (state.status === 'transferring' && state.remainingTime <= 0) {
      const nextIndex = state.currentStepIndex + 1;
      const nextStep = steps[nextIndex];
      setState({
        status: 'running',
        currentStepIndex: nextIndex,
        remainingTime: nextStep.duration,
        nextAgitationIn: nextStep.agitationInterval ?? null,
      });
    }
  }, [state.status, state.remainingTime, state.currentStepIndex, steps]);

  // Interval management
  useEffect(() => {
    if (state.status === 'running' || state.status === 'transferring') {
      intervalRef.current = window.setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.status, tick]);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'running' }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'running' }));
  }, []);

  return {
    state,
    currentStep: steps[state.currentStepIndex],
    nextStep: steps[state.currentStepIndex + 1] ?? null,
    start,
    pause,
    resume,
  };
}
```

## PWA Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'sounds/*.mp3'],
      manifest: {
        name: 'DarkLog',
        short_name: 'DarkLog',
        description: 'Darkroom printing assistant',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,mp3}'],
      },
    }),
  ],
});
```

## Key Implementation Notes

### State Machine for App Flow

```typescript
type Screen = 
  | { name: 'home' }
  | { name: 'sessionSetup'; sessionId?: string }
  | { name: 'printEditor'; sessionId: string; printId?: string }
  | { name: 'timer'; sessionId: string; printId: string }
  | { name: 'notes'; sessionId: string; printId: string }
  | { name: 'settings' }
  | { name: 'history' };
```

### Sticky Values

Persist last-used values in a separate "sticky" object in IndexedDB or localStorage:

```typescript
interface StickyValues {
  rollId: string;
  frameNumber: string;
  paperSize: string;
  contrast: ContrastSetting;
  aperture: number;
  baseTime: number;
  enlargerHeight: number | null;
}
```

Load these as defaults when creating a new print, update on save.

### Time Display Formatting

```typescript
// src/utils/time.ts
export function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function parseTimeInput(input: string): number | null {
  // Handle "90" as 90 seconds, "1:30" as 90 seconds
  if (input.includes(':')) {
    const [min, sec] = input.split(':').map(Number);
    if (isNaN(min) || isNaN(sec)) return null;
    return min * 60 + sec;
  }
  const seconds = parseInt(input, 10);
  return isNaN(seconds) ? null : seconds;
}
```

### Vibration API

```typescript
// src/hooks/useVibration.ts
export function useVibration() {
  const isSupported = 'vibrate' in navigator;

  const vibrateStep = () => {
    if (isSupported) navigator.vibrate([200, 100, 200]);
  };

  const vibrateAgitate = () => {
    if (isSupported) navigator.vibrate(100);
  };

  return { isSupported, vibrateStep, vibrateAgitate };
}
```

### Audio Handling

Keep audio files short (<1s) and use Web Audio API or simple `<audio>` elements. Pre-load on app init to avoid latency.

```typescript
// src/hooks/useAudio.ts
const audioCache: Record<string, HTMLAudioElement> = {};

function preload(src: string): HTMLAudioElement {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
    audioCache[src].load();
  }
  return audioCache[src];
}

export function useAudio() {
  useEffect(() => {
    preload('/sounds/step-end.mp3');
    preload('/sounds/final-end.mp3');
    preload('/sounds/agitate.mp3');
  }, []);

  const play = (src: string) => {
    const audio = preload(src);
    audio.currentTime = 0;
    audio.play().catch(() => {}); // Ignore autoplay restrictions
  };

  return {
    playStepEnd: () => play('/sounds/step-end.mp3'),
    playFinalEnd: () => play('/sounds/final-end.mp3'),
    playAgitate: () => play('/sounds/agitate.mp3'),
  };
}
```

## Testing Considerations

- Timer logic should be unit testable (extract pure functions)
- IndexedDB operations can use fake-indexeddb in tests
- E2E tests with Playwright for critical flows
- Test on actual mobile devices in dark conditions

## Performance

- Keep bundle small (<100KB gzipped)
- Timer interval must be precise — use `requestAnimationFrame` if drift is an issue
- Avoid re-renders during timer tick (isolate timer state)
- Lazy-load history/settings screens

## Offline Behavior

- All data in IndexedDB — no network required
- Service worker caches all assets
- App works immediately on install
- No sync logic (local-only by design)
