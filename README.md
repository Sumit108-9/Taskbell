# TaskBell

A modern personal todo and reminder app built with React Native + Expo.

## Features

- Tasks with categories, priorities, deadlines, reminders & repeats
- Local-first persistence via AsyncStorage
- Push & alarm notifications (`expo-notifications`)
- Calendar view + per-day task list
- Productivity stats: ring chart, weekly bars, category breakdown
- Light / Dark mode + theme accent picker
- Subtasks with progress tracking
- Backup/export via system share sheet
- Smooth animations with `react-native-reanimated`

## Tech Stack

- Expo SDK 51 (TypeScript)
- expo-router (file-based navigation)
- AsyncStorage
- expo-notifications, expo-linear-gradient, expo-google-fonts
- react-native-reanimated, react-native-svg, react-native-safe-area-context
- date-fns

## Quick start

```bash
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS (macOS), or scan the QR with Expo Go.

> Push notifications require a development build or physical device. They are no-ops on web.

## Project structure

The codebase is split into a **frontend** (UI layer) and **backend** (data /
business logic) folder. The `app/` directory must stay at the root for
`expo-router` to discover screens.

```
app/                            # expo-router screens (UI entry points)
  _layout.tsx                   # Root layout: fonts, providers, error boundary
  index.tsx                     # Splash screen
  onboarding.tsx                # 3-slide onboarding
  (tabs)/                       # Bottom tab navigator
    _layout.tsx
    home.tsx
    calendar.tsx
    add.tsx
    stats.tsx
    settings.tsx
  task/[id].tsx                 # Task detail

frontend/                       # Pure UI layer (no business logic)
  components/                   # Reusable RN components (TaskCard, FilterChips, ...)
  constants/                    # Design tokens: Colors / Typography / Spacing

backend/                        # Data + business logic (no JSX, no styling)
  types/                        # TypeScript domain models (Task, Subtask, AppSettings)
  storage.ts                    # AsyncStorage wrappers
  notifications.ts              # expo-notifications scheduling / cancelling
  taskHelpers.ts                # Pure helpers: isOverdue, filters, formatters
  uuid.ts                       # ID generator
  hooks/                        # useTasks, useSettings, useTheme, useNotifications
  context/AppProviders.tsx      # Combined Task / Settings / Theme provider
```

Path aliases (defined in `tsconfig.json` via `@/*`):

- `@/backend/...` — anything from the data/logic layer
- `@/frontend/components/...`, `@/frontend/constants/...` — UI primitives

## Notes

- Add app icons / splash images to `./assets/` before producing a build (referenced in `app.json`).
- Notification permissions are requested on first launch and on toggling them on in Settings.
- The legacy `taskbell-ui.jsx` file is a web prototype and is not used by the Expo app.

## Scripts

- `npm start` — start Expo dev server
- `npm run android` / `npm run ios` / `npm run web`
