# DarkLog — Product Requirements Document

## Overview

DarkLog is a Progressive Web App for darkroom photographers to record exposure settings, time chemical processing, and take notes during enlarging sessions. It runs on any device, works offline, and stores all data locally.

## Design Principles

1. **Darkroom-safe UI**: High contrast, minimal brightness, large touch targets. Assumes user has device display tinted red via OS accessibility settings.
2. **KISS**: Minimal screens, minimal taps. Forward momentum through the printing workflow.
3. **Sticky settings**: Most values persist between prints. Only change what changed.
4. **Offline-first**: Full functionality without network. LocalStorage/IndexedDB only.

---

## Core Workflow

### 1. Start Session
- Create or resume a session
- Set session-level defaults (lens, paper stock, chemistry sequence, temperature)
- These persist and are "tucked away" — rarely touched mid-session

### 2. Test Strip
- Record: base time, interval, strip count
- After evaluation: mark which strip was selected
- Test strips belong to a print record (array)
- Multiple test strips per print allowed (iterative refinement)

### 3. Print Setup
- Per-print settings (sticky but accessible):
  - Roll ID
  - Frame number
  - Paper size
  - Contrast grade/filter
  - Aperture
  - Exposure time
  - Enlarger height
- Inherit session defaults for lens, paper stock, chemistry

### 4. Expose
- User exposes print on enlarger (outside app)
- App just records settings

### 5. Timer / Processing
- Manual tap to start developer
- Countdown with large, readable display
- Agitation interval reminders (vibration/sound pulse)
- At step completion: alert (sound/vibration)
- Configurable transfer delay (default 2s) then auto-advance to next step
- Pause/resume allowed
- No skipping steps
- Records actual completion (timestamp) for each step

### 6. Notes & Finish
- After timer completes, show notes screen
- Free-form text (dodging/burning notes, observations)
- Optional rating (1-5)
- Two actions:
  - **Reprint**: Duplicate settings, stay on same roll/frame, back to print setup to tweak
  - **New Frame**: Clear frame-specific data, keep sticky settings, ready for next negative

### 7. End Session
- Data persists in local storage
- Can resume session later or start fresh

---

## Post-Session Features (Lower Priority)

- Browse past sessions
- View prints and test strips within a session
- Search/filter by roll, date, rating
- Edit notes retroactively
- Export/backup as JSON

---

## Timer Behavior (Detailed)

| Event | Behavior |
|-------|----------|
| Start | Manual tap to begin first step (developer) |
| During step | Countdown displayed large; agitation reminders at interval |
| Step end | Alert (sound + vibration); pause for transfer delay |
| Transfer delay | Configurable (default 2s); shows "Transfer to [next step]" |
| Next step | Auto-starts after transfer delay |
| Pause | Allowed anytime; resumes where left off |
| Final step end | Alert; transition to notes screen |

---

## App Settings

- Transfer delay duration (seconds)
- Sound on/off
- Vibration on/off
- Default agitation interval (can override per chemistry step)

---

## Screen Inventory

1. **Home**: List sessions, create new
2. **Session Setup**: Configure session defaults
3. **Print Editor**: Per-print settings, test strip list
4. **Test Strip Entry**: Quick modal/inline form
5. **Timer**: Full-screen countdown, step info, pause button
6. **Notes**: Post-print notes and rating, reprint/new frame actions
7. **Settings**: App-wide config
8. **History Browser** (post-session): Past sessions and prints

---

## PWA Requirements

- Service worker for offline functionality
- Web app manifest for installability
- IndexedDB for structured data persistence
- Works on iOS Safari, Android Chrome, desktop browsers

---

## UI/UX Guidelines

- **Colors**: Dark background, high-contrast text/elements. No bright whites.
- **Typography**: Large, readable. Timer digits especially prominent.
- **Touch targets**: Minimum 48px, prefer larger for gloved/dark use
- **Feedback**: Haptic and audio cues for timer events
- **Navigation**: Minimal depth. One-tap access to primary actions.
- **No decorative elements**: Every pixel earns its place

---

## Out of Scope (v1)

- Cloud sync
- Multi-user / sharing
- Image attachments
- Scanning/OCR of test strips
- Print sales/inventory tracking
- Detailed roll/film stock database (rollId is just a string for now)
