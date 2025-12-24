# DarkLog

A darkroom printing assistant PWA. Records exposure settings, times chemical processing, captures notes.

## Documentation

- [PRD.md](docs/PRD.md) — Product requirements and workflow
- [SCHEMA.md](docs/SCHEMA.md) — Data model and TypeScript interfaces
- [UI_SPEC.md](docs/UI_SPEC.md) — Visual design and screen layouts
- [IMPLEMENTATION.md](docs/IMPLEMENTATION.md) — Technical architecture and code patterns

## Quick Start

```bash
bun install
bun run dev
```

## Build for Production

```bash
bun run build
bun run preview
```

## Core Features

- **Session management**: Set up lens, paper, chemistry once per session
- **Print recording**: Track exposure settings per frame
- **Test strips**: Log iterations with base time, interval, selected strip
- **Processing timer**: Step-by-step countdown with agitation reminders
- **Notes**: Capture observations, rate results
- **Offline-first**: All data stored locally in IndexedDB

## Design Principles

1. Darkroom-safe: High contrast, minimal brightness
2. Workflow-focused: Forward momentum, minimal taps
3. Sticky settings: Only change what changed
4. Offline-only: No network required, no sync

## Tech Stack

- React 19 + TypeScript
- Vite
- IndexedDB (via idb)
- PWA with Workbox
