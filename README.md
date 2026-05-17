Copy-paste this directly into your `README.md` file:

````markdown
# 🔔 TaskBell

**TaskBell** is a modern personal **Todo & Reminder App** built with **React Native + Expo**.  
It helps users manage daily tasks, deadlines, reminders, categories, productivity stats, and more — all in a clean mobile-first interface.

---

## ✨ Features

- ✅ Create, edit, delete, and complete tasks
- 📂 Organize tasks with categories
- 🚩 Set task priority levels
- ⏰ Add deadlines, reminders, and repeat schedules
- 🔔 Local push/alarm notifications using `expo-notifications`
- 📅 Calendar view with per-day task list
- 📊 Productivity stats with:
  - Ring chart
  - Weekly progress bars
  - Category breakdown
- 🌙 Light mode / Dark mode support
- 🎨 Theme accent color picker
- 🧩 Subtasks with progress tracking
- 💾 Local-first storage using AsyncStorage
- 📤 Backup/export support through system share sheet
- ⚡ Smooth animations using `react-native-reanimated`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Expo SDK 51** | React Native app framework |
| **TypeScript** | Type-safe development |
| **expo-router** | File-based navigation |
| **AsyncStorage** | Local data persistence |
| **expo-notifications** | Reminder and alarm notifications |
| **expo-linear-gradient** | Beautiful gradient UI |
| **expo-google-fonts** | Custom fonts |
| **react-native-reanimated** | Smooth animations |
| **react-native-svg** | Charts and vector graphics |
| **react-native-safe-area-context** | Safe screen layout |
| **date-fns** | Date and time formatting |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Sumit108-9/Taskbell.git
cd Taskbell
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Expo development server

```bash
npx expo start
```

### 4. Run the app

After the Expo server starts:

```text
Press a → Run on Android Emulator
Press i → Run on iOS Simulator
Press w → Run on Web
```

Or scan the QR code using the **Expo Go** app on your phone.

> **Note:** Push notifications require a physical device or a development build. They may not work properly on web.

---

## 📁 Project Structure

The project is divided into a clean **frontend** and **backend logic** structure.

```text
TaskBell/
│
├── app/                         # Expo Router screens
│   ├── _layout.tsx              # Root layout, fonts, providers, error boundary
│   ├── index.tsx                # Splash screen
│   ├── onboarding.tsx           # 3-slide onboarding screen
│   │
│   ├── (tabs)/                  # Bottom tab navigation
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── calendar.tsx
│   │   ├── add.tsx
│   │   ├── stats.tsx
│   │   └── settings.tsx
│   │
│   └── task/
│       └── [id].tsx             # Task detail screen
│
├── frontend/                    # UI layer
│   ├── components/              # Reusable components
│   │   ├── TaskCard.tsx
│   │   ├── FilterChips.tsx
│   │   └── ...
│   │
│   └── constants/               # Design system
│       ├── Colors.ts
│       ├── Typography.ts
│       └── Spacing.ts
│
├── backend/                     # Data and business logic
│   ├── types/                   # TypeScript models
│   │   ├── Task.ts
│   │   ├── Subtask.ts
│   │   └── AppSettings.ts
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useTasks.ts
│   │   ├── useSettings.ts
│   │   ├── useTheme.ts
│   │   └── useNotifications.ts
│   │
│   ├── context/
│   │   └── AppProviders.tsx     # Global app providers
│   │
│   ├── storage.ts               # AsyncStorage helpers
│   ├── notifications.ts         # Notification scheduling/canceling
│   ├── taskHelpers.ts           # Task filters and formatters
│   └── uuid.ts                  # ID generator
│
├── assets/                      # App icons, splash images, fonts
├── app.json                     # Expo app configuration
├── package.json                 # Project scripts and dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md
```

---

## 🔗 Path Aliases

The project uses path aliases from `tsconfig.json`.

```ts
@/backend/...
@/frontend/components/...
@/frontend/constants/...
```

Example:

```ts
import { TaskCard } from "@/frontend/components/TaskCard";
import { useTasks } from "@/backend/hooks/useTasks";
```

---

## 📌 Important Notes

* Add app icons and splash images inside the `assets/` folder before creating a production build.
* Notification permission is requested when the app launches or when notifications are enabled from Settings.
* The `app/` directory must stay at the root because `expo-router` uses it to detect screens.
* The file `taskbell-ui.jsx` is only a web prototype and is not used in the Expo app.
* Data is stored locally using AsyncStorage, so no external database is required for the basic version.

---

## 📜 Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm start`       | Start Expo development server  |
| `npm run android` | Run on Android emulator/device |
| `npm run ios`     | Run on iOS simulator           |
| `npm run web`     | Run on browser                 |

---

## 📱 App Screens

TaskBell includes the following main screens:

* Splash Screen
* Onboarding Screen
* Home / Today Tasks
* Calendar View
* Add Task
* Task Details
* Productivity Stats
* Settings

---

## 🧠 Future Improvements

* Cloud backup and sync
* User login system
* Firebase integration
* Advanced recurring reminders
* Widget support
* Voice task input
* Smart AI task suggestions

---

## 👨‍💻 Author

Developed by **Sumit Kamat**

GitHub: [Sumit108-9](https://github.com/Sumit108-9)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.

```
```
