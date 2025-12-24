# DarkLog - AI Assistant Context

This file provides context for AI assistants working on the DarkLog project.

## Project Overview

DarkLog is a Progressive Web App (PWA) designed for darkroom photographers to track printing sessions, exposure settings, and chemical processing times. The app is optimized for use in a darkroom environment with high contrast UI and minimal brightness.

**For complete product requirements and user workflow, see [docs/PRD.md](docs/PRD.md)**

## Key Documentation

**Always review these files before making changes:**

- **[docs/PRD.md](docs/PRD.md)** - Product requirements, user workflow, and feature specifications
- **[docs/SCHEMA.md](docs/SCHEMA.md)** - Complete data model, TypeScript interfaces, and database structure
- **[docs/UI_SPEC.md](docs/UI_SPEC.md)** - Visual design system, color palette, typography, and screen layouts
- **[docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)** - Technical architecture, code patterns, and implementation details

## Core Design Constraints

These principles guide all development decisions (detailed in [docs/PRD.md](docs/PRD.md)):

1. **Darkroom-safe UI**: All screens use dark backgrounds with red/amber text for safelight compatibility
2. **Offline-first**: No network dependencies, all data in IndexedDB
3. **Workflow-focused**: Minimize taps, maintain forward momentum through the printing process
4. **Sticky settings**: Session context persists, only change what changed between prints

## Technology Stack

- **Runtime**: Bun (not npm/yarn)
- **Framework**: React 19 with TypeScript
- **Build**: Vite
- **Storage**: IndexedDB via the `idb` library
- **PWA**: Workbox for service worker
- **State**: React Context (AppContext for state, NavigationContext for routing)

**For complete technical architecture, see [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)**

## Key Architectural Patterns

**Detailed architecture and code patterns are documented in [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)**

### State Management
- AppContext provides global state (currentSession, prints, testStrips, settings)
- NavigationContext handles screen routing and navigation stack
- No external state management library (no Redux, MobX, etc.)

### Database Operations
- All IndexedDB operations are in `src/db/`
- Use the `idb` wrapper library, never raw IndexedDB API
- Database is versioned (currently v1)
- **For complete schema details, see [docs/SCHEMA.md](docs/SCHEMA.md)**

### Component Structure
- Screens in `src/screens/` (e.g., Home, SessionSetup, NewPrint)
- Reusable components in `src/components/`
- Custom hooks in `src/hooks/` (useTimer, useDb, useAudio, useVibration)
- **For screen layouts and specs, see [docs/UI_SPEC.md](docs/UI_SPEC.md)**

### Timing and Audio
- Timer logic in `src/hooks/useTimer.ts`
- Audio feedback via Web Audio API
- Haptic feedback via Vibration API where supported

## Development Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server
bun run build        # Production build
bun run preview      # Preview production build
```

## Important Conventions

**See [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) for complete coding standards**

1. **IDs**: Use timestamp-based IDs (`Date.now().toString()`)
2. **Types**: All data models defined in `src/types/` - see [docs/SCHEMA.md](docs/SCHEMA.md)
3. **Navigation**: Use `navigateTo()` from NavigationContext, not direct screen setting
4. **Persistence**: Always save to IndexedDB after state changes
5. **Error handling**: User-facing errors should be minimally disruptive in darkroom workflow

## Common Tasks

### Adding a new screen
1. Create component in `src/screens/`
2. Add to NavigationContext screen list
3. Update navigation logic if needed
4. **Reference [docs/UI_SPEC.md](docs/UI_SPEC.md) for design specifications**

### Adding a new data type
1. Define interface in `src/types/`
2. Update database schema in `src/db/setup.ts`
3. Add CRUD operations in `src/db/`
4. Consider migration path if schema changes
5. **See [docs/SCHEMA.md](docs/SCHEMA.md) for data model standards**

### Modifying timer behavior
1. Review timer state machine in `src/hooks/useTimer.ts`
2. Check audio/vibration feedback in `src/hooks/useAudio.ts` and `useVibration.ts`
3. Test all timer states (running, paused, agitation, completion)
4. **Reference [docs/PRD.md](docs/PRD.md) for timing requirements**

## Testing in Development

- Test offline functionality by disabling network in DevTools
- Test PWA installation on mobile device
- Verify darkroom-safe colors in dim lighting
- Test timer accuracy over extended processing times (8-10 minutes)

## When Making Changes

1. **Read the specs first** - Check relevant files in [docs/](docs/) before implementing
2. **Preserve workflow** - Don't add friction to the printing process (see [docs/PRD.md](docs/PRD.md))
3. **Maintain visual consistency** - Follow [docs/UI_SPEC.md](docs/UI_SPEC.md) color and spacing guidelines
4. **Test offline** - Everything must work without network
5. **Consider the darkroom context** - UI changes should work in dim red/amber light
6. **Follow data patterns** - Respect the schema defined in [docs/SCHEMA.md](docs/SCHEMA.md)
7. **Use established patterns** - Follow code conventions in [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)
