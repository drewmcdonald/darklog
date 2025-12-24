# DarkLog — UI/UX Specification

## Design Philosophy

The app is used in a darkroom under safelight conditions. Every design decision optimizes for:
1. **Minimal light emission** — dark backgrounds, no bright elements
2. **Readability** — high contrast, large text
3. **Fumble-proof interaction** — large touch targets, simple navigation
4. **Forward momentum** — workflow-oriented, minimal backtracking

## Color Palette

User is expected to enable red tint via OS accessibility settings. App provides high-contrast dark theme.

```css
:root {
  --bg-primary: #0a0a0a;       /* Near black */
  --bg-secondary: #1a1a1a;     /* Slightly lighter for cards/sections */
  --bg-elevated: #2a2a2a;      /* Modals, dropdowns */
  
  --text-primary: #e0e0e0;     /* Main text */
  --text-secondary: #888888;   /* Labels, hints */
  --text-muted: #555555;       /* Disabled, inactive */
  
  --accent: #cc4444;           /* Buttons, active states — red-ish, visible under safelight */
  --accent-dim: #662222;       /* Subtle accent */
  
  --success: #44aa44;          /* Completion states */
  --warning: #aaaa44;          /* Alerts */
  --error: #aa4444;            /* Errors */
  
  --border: #333333;           /* Subtle borders */
}
```

## Typography

```css
:root {
  --font-family: system-ui, -apple-system, sans-serif;
  
  --text-xs: 0.75rem;    /* 12px - fine print */
  --text-sm: 0.875rem;   /* 14px - secondary */
  --text-base: 1rem;     /* 16px - body */
  --text-lg: 1.25rem;    /* 20px - emphasis */
  --text-xl: 1.5rem;     /* 24px - headings */
  --text-2xl: 2rem;      /* 32px - large headings */
  --text-timer: 4rem;    /* 64px - timer display */
}
```

## Touch Targets

- **Minimum**: 48x48px for all interactive elements
- **Preferred**: 56x56px or larger for primary actions
- **Spacing**: Minimum 8px between touch targets

## Component Patterns

### Buttons

```
Primary:   bg-accent, text-primary, full-width on mobile
Secondary: bg-transparent, border, text-secondary
Danger:    bg-error (only for destructive actions)
```

Large, full-width buttons for primary actions. No small inline buttons for critical functions.

### Input Fields

- Dark background (`--bg-secondary`)
- Light border on focus
- Large font size (`--text-lg` minimum)
- Generous padding (16px)
- Clear labels above, not placeholder text

### Cards / Sections

- Subtle background differentiation (`--bg-secondary`)
- Rounded corners (8px)
- No shadows (keeps UI flat, reduces visual noise)

### Timer Display

```
┌─────────────────────────────────────┐
│                                     │
│            DEVELOPER                │  ← Step name (--text-xl)
│                                     │
│             1:24                    │  ← Time remaining (--text-timer)
│                                     │
│        ●  Agitate in 8s             │  ← Agitation reminder
│                                     │
│     ┌─────────────────────┐         │
│     │       PAUSE         │         │  ← Large button
│     └─────────────────────┘         │
│                                     │
│     ──●────────────────────         │  ← Progress bar
│                                     │
│     Next: Stop Bath                 │  ← Preview next step
│                                     │
└─────────────────────────────────────┘
```

## Screen Layouts

### Home / Session List

```
┌─────────────────────────────────────┐
│  DarkLog                    ⚙️  │  ← Header with settings
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Today, Dec 23                 │  │  ← Active session (if exists)
│  │ 4 prints · HP5 Roll 12        │  │
│  │                    [Continue] │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        + NEW SESSION           ││  ← Primary action
│  └─────────────────────────────────┘│
│                                     │
│  ─── Past Sessions ───              │
│                                     │
│  Dec 21 · 8 prints                  │
│  Dec 18 · 3 prints                  │
│  Dec 15 · 12 prints                 │
│                                     │
└─────────────────────────────────────┘
```

### Session Setup

```
┌─────────────────────────────────────┐
│  ← Back         SESSION SETUP       │
├─────────────────────────────────────┤
│                                     │
│  Lens                               │
│  ┌─────────────────────────────────┐│
│  │ 50mm El-Nikkor                  ││
│  └─────────────────────────────────┘│
│                                     │
│  Paper                              │
│  ┌─────────────────────────────────┐│
│  │ Ilford                          ││ ← Manufacturer
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Multigrade RC Deluxe            ││ ← Name
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Pearl                      ▼    ││ ← Surface (dropdown)
│  └─────────────────────────────────┘│
│                                     │
│  Chemistry Sequence                 │
│  ┌───────────────────────────────┐  │
│  │ Developer · 1+9 · 1:30 · 30s  │  │
│  │ Stop · stock · 0:30           │  │
│  │ Fixer · 1+4 · 3:00 · 30s      │  │
│  │ [+ Add Step]                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  Temperature                        │
│  ┌────────────┐                     │
│  │ 20 °C      │                     │
│  └────────────┘                     │
│                                     │
│  ┌─────────────────────────────────┐│
│  │           START SESSION         ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Print Editor

```
┌─────────────────────────────────────┐
│  ←           NEW PRINT          ... │
├─────────────────────────────────────┤
│                                     │
│  Roll          Frame                │
│  ┌────────────┐ ┌──────────────────┐│
│  │ HP5 R12    │ │ 24               ││
│  └────────────┘ └──────────────────┘│
│                                     │
│  ─── Exposure ───                   │
│                                     │
│  Aperture      Time                 │
│  ┌────────────┐ ┌──────────────────┐│
│  │ f/8    ▼   │ │ 12s              ││
│  └────────────┘ └──────────────────┘│
│                                     │
│  Height        Contrast             │
│  ┌────────────┐ ┌──────────────────┐│
│  │ 45cm       │ │ MG 2.5      ▼   ││
│  └────────────┘ └──────────────────┘│
│                                     │
│  Paper Size                         │
│  ┌─────────────────────────────────┐│
│  │ 8x10                       ▼    ││
│  └─────────────────────────────────┘│
│                                     │
│  ─── Test Strips (2) ───            │
│  ┌───────────────────────────────┐  │
│  │ 8s base · 2s int · ✓ strip 3  │  │
│  │ 10s base · 1s int · ✓ strip 2 │  │
│  │ [+ Add Test Strip]            │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │         START TIMER             ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Post-Print Notes

```
┌─────────────────────────────────────┐
│            PRINT COMPLETE           │
├─────────────────────────────────────┤
│                                     │
│  HP5 R12 · Frame 24                 │
│  f/8 · 12s · MG 2.5                 │
│                                     │
│  Notes                              │
│  ┌─────────────────────────────────┐│
│  │ Burned sky +3s                  ││
│  │ Dodged face -2s                 ││
│  │ Slight magenta cast?            ││
│  │                                 ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  Rating                             │
│  ○ ○ ○ ○ ○                          │
│  1 2 3 4 5                          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │          REPRINT                ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │          NEW FRAME              ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

## Interaction Patterns

### Sticky Fields
- Most fields retain their value between prints
- Per-print fields (roll, frame, size, contrast, aperture, time, height) are "accessible" — visible on main print editor screen
- Session fields (lens, paper stock, chemistry) are "tucked away" — in session setup, accessed via header menu

### Timer Alerts
- **Sound**: Short beep at step end, different tone for final step
- **Vibration**: Pulse pattern — short burst for agitation reminder, longer for step end
- Both can be toggled in settings

### Navigation Flow
```
Home → Session Setup → Print Editor → Timer → Notes
                            ↑                    │
                            └────── Reprint ─────┘
                            └────── New Frame ───┘
```

### Gestures
- Keep it simple: taps only
- No swipes required for core functionality
- Scroll for long lists/forms

## Accessibility

- Respect system font size preferences
- High contrast meets WCAG AA minimum (4.5:1 for text)
- Timer display exceeds AA Large (3:1 minimum)
- Audio cues paired with visual feedback
- No reliance on color alone for state indication

## Responsive Behavior

- Mobile-first design
- Single column layout up to 600px
- Tablet/desktop: max-width container (500px), centered
- Timer screen always full-viewport
