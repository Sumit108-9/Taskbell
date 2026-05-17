import { useState } from "react";

const theme = {
  light: {
    bg: "#F8FAFC",
    card: "#FFFFFF",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E2E8F0",
    inputBg: "#F1F5F9",
    navBg: "#FFFFFF",
    statCard: "#F1F5F9",
  },
  dark: {
    bg: "#0F172A",
    card: "#1E293B",
    text: "#F8FAFC",
    muted: "#94A3B8",
    border: "#334155",
    inputBg: "#334155",
    navBg: "#1E293B",
    statCard: "#273549",
  },
};

const BLUE = "#2563EB";
const GREEN = "#22C55E";
const ORANGE = "#F97316";
const RED = "#EF4444";
const PURPLE = "#8B5CF6";

const priorityColors = { High: RED, Medium: ORANGE, Low: GREEN };
const priorityBg = { High: "#FEF2F2", Medium: "#FFF7ED", Low: "#F0FDF4" };
const priorityBgDark = { High: "#3B0F0F", Medium: "#3B1F00", Low: "#052E16" };

const sampleTasks = [
  { id: 1, title: "Morning standup call", category: "Work", priority: "High", time: "9:00 AM", done: false, reminder: true, overdue: false },
  { id: 2, title: "Buy groceries", category: "Personal", priority: "Medium", time: "12:00 PM", done: false, reminder: true, overdue: false },
  { id: 3, title: "Read 30 pages", category: "Health", priority: "Low", time: "8:00 PM", done: true, reminder: false, overdue: false },
  { id: 4, title: "Submit project report", category: "Work", priority: "High", time: "Yesterday", done: false, reminder: false, overdue: true },
  { id: 5, title: "Call dentist", category: "Health", priority: "Medium", time: "2:30 PM", done: false, reminder: true, overdue: false },
];

const categoryColors = { Work: BLUE, Personal: PURPLE, Health: GREEN, Finance: ORANGE };

function Bell({ size = 20, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function Icon({ name, size = 20, color = "currentColor" }) {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    stats: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    bell: <Bell size={size} color={color} />,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    tag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    chevronLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    alarm: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3L2 6"/><path d="M22 6l-3-3"/></svg>,
    repeat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    backup: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    palette: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill={color}/><circle cx="17.5" cy="10.5" r=".5" fill={color}/><circle cx="8.5" cy="7.5" r=".5" fill={color}/><circle cx="6.5" cy="12.5" r=".5" fill={color}/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
    volume: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    task: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    flag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    notes: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  };
  return icons[name] || null;
}

function PhoneFrame({ children, dark }) {
  const t = dark ? theme.dark : theme.light;
  return (
    <div style={{
      width: 375,
      minHeight: 720,
      background: t.bg,
      borderRadius: 40,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxShadow: dark
        ? "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px #334155"
        : "0 30px 80px rgba(37,99,235,0.18), 0 0 0 1px #E2E8F0",
      fontFamily: "'DM Sans', 'Nunito', 'Poppins', sans-serif",
    }}>
      {/* Status bar */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>9:41</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{ width: 16, height: 8, border: `1.5px solid ${t.text}`, borderRadius: 2, position: "relative" }}>
            <div style={{ position: "absolute", top: 1, left: 1, bottom: 1, width: "70%", background: t.text, borderRadius: 1 }} />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function TaskCard({ task, dark }) {
  const t = dark ? theme.dark : theme.light;
  const [checked, setChecked] = useState(task.done);
  const pColor = priorityColors[task.priority];
  const pbg = dark ? priorityBgDark[task.priority] : priorityBg[task.priority];
  const catColor = categoryColors[task.category] || BLUE;

  return (
    <div style={{
      background: t.card,
      borderRadius: 16,
      padding: "14px 16px",
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.25)" : "0 2px 12px rgba(15,23,42,0.07)",
      border: `1px solid ${task.overdue ? RED + "44" : t.border}`,
      opacity: checked ? 0.65 : 1,
      transition: "all 0.2s",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Priority left bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: pColor, borderRadius: "0 2px 2px 0" }} />

      {/* Checkbox */}
      <button
        onClick={() => setChecked(!checked)}
        style={{
          width: 22, height: 22, borderRadius: 8, border: `2px solid ${checked ? GREEN : t.border}`,
          background: checked ? GREEN : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0, marginTop: 1,
          transition: "all 0.2s",
        }}>
        {checked && <Icon name="check" size={12} color="#fff" />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <p style={{
            margin: 0, fontWeight: 600, fontSize: 14.5, color: t.text,
            textDecoration: checked ? "line-through" : "none",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{task.title}</p>
          <span style={{
            fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
            background: pbg, color: pColor, flexShrink: 0, letterSpacing: 0.3,
          }}>{task.priority}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
          <span style={{ fontSize: 11, color: catColor, fontWeight: 600, background: catColor + "18", padding: "2px 8px", borderRadius: 99 }}>
            {task.category}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3, color: task.overdue ? RED : t.muted, fontSize: 11.5 }}>
            <Icon name="clock" size={11} color={task.overdue ? RED : t.muted} />
            {task.time}
          </span>
          {task.reminder && (
            <span style={{ color: BLUE, opacity: 0.8 }}>
              <Icon name="bell" size={12} color={BLUE} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onTab, dark }) {
  const t = dark ? theme.dark : theme.light;
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "calendar", icon: "calendar", label: "Calendar" },
    { id: "add", icon: "plus", label: "" },
    { id: "stats", icon: "stats", label: "Stats" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  return (
    <div style={{
      height: 72,
      background: t.navBg,
      borderTop: `1px solid ${t.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0 8px",
      boxShadow: dark ? "0 -4px 20px rgba(0,0,0,0.3)" : "0 -4px 20px rgba(15,23,42,0.06)",
      flexShrink: 0,
    }}>
      {tabs.map(tab => (
        tab.id === "add" ? (
          <button
            key="add"
            onClick={() => onTab("add")}
            style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(37,99,235,0.45)",
              transform: "translateY(-8px)",
              transition: "transform 0.15s",
            }}>
            <Icon name="plus" size={22} color="#fff" />
          </button>
        ) : (
          <button
            key={tab.id}
            onClick={() => onTab(tab.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, border: "none", background: "transparent", cursor: "pointer",
              padding: "8px 12px",
            }}>
            <Icon name={tab.icon} size={22} color={active === tab.id ? BLUE : t.muted} />
            {tab.label && (
              <span style={{ fontSize: 10, fontWeight: active === tab.id ? 700 : 500, color: active === tab.id ? BLUE : t.muted }}>
                {tab.label}
              </span>
            )}
          </button>
        )
      ))}
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function SplashScreen() {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `linear-gradient(160deg, #1d4ed8 0%, ${BLUE} 45%, #3b82f6 100%)`,
      gap: 0, padding: 32,
    }}>
      {/* Floating ring decoration */}
      <div style={{ position: "absolute", top: 60, right: 30, width: 120, height: 120, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" }} />
      <div style={{ position: "absolute", top: 40, right: 50, width: 80, height: 80, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", bottom: 100, left: 20, width: 90, height: 90, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.12)" }} />

      {/* Logo container */}
      <div style={{
        width: 100, height: 100, borderRadius: 28,
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 28,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}>
        <Bell size={48} color="white" />
      </div>

      <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>TaskBell</h1>
      <p style={{ margin: "10px 0 0", fontSize: 15, color: "rgba(255,255,255,0.78)", fontStyle: "italic", letterSpacing: 0.2 }}>
        "Plan it. Do it. Never miss it."
      </p>

      {/* Loading dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 64 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: i === 1 ? 20 : 8, height: 8, borderRadius: 99,
            background: "rgba(255,255,255,0.9)",
            transition: "width 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

function OnboardingScreen({ dark }) {
  const [slide, setSlide] = useState(0);
  const t = dark ? theme.dark : theme.light;

  const slides = [
    {
      icon: "task", color: BLUE,
      bg: dark ? "#1a2e4a" : "#EFF6FF",
      title: "Organize Your Tasks",
      desc: "Add tasks with categories, priorities, and deadlines. Keep everything in one place.",
      emoji: "📋",
    },
    {
      icon: "clock", color: ORANGE,
      bg: dark ? "#2d1f0e" : "#FFF7ED",
      title: "Never Miss a Deadline",
      desc: "Set deadlines and get smart reminders before your tasks are due. Stay on schedule always.",
      emoji: "⏰",
    },
    {
      icon: "alarm", color: RED,
      bg: dark ? "#2d1010" : "#FEF2F2",
      title: "Alarm Notifications",
      desc: "Powerful alarm alerts make sure you're notified right on time, even when your phone is on silent.",
      emoji: "🔔",
    },
  ];

  const current = slides[slide];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 28px 32px" }}>
      {/* Skip */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setSlide(2)} style={{ border: "none", background: "transparent", color: t.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {slide < 2 ? "Skip" : ""}
        </button>
      </div>

      {/* Illustration */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: 16,
      }}>
        <div style={{
          width: 220, height: 220, borderRadius: 60, background: current.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 20px 60px ${current.color}25`,
          flexDirection: "column", gap: 8,
        }}>
          <span style={{ fontSize: 72 }}>{current.emoji}</span>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{
            height: 8, width: slide === i ? 24 : 8, borderRadius: 99,
            background: slide === i ? BLUE : t.border, cursor: "pointer", transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Text */}
      <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 800, color: t.text, textAlign: "center", lineHeight: 1.2 }}>
        {current.title}
      </h2>
      <p style={{ margin: 0, fontSize: 14.5, color: t.muted, textAlign: "center", lineHeight: 1.6 }}>
        {current.desc}
      </p>

      {/* Button */}
      <button
        onClick={() => setSlide(s => Math.min(s + 1, 2))}
        style={{
          marginTop: 32, height: 52, borderRadius: 16, border: "none",
          background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
          color: "#fff", fontSize: 15.5, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
        {slide === 2 ? "Get Started" : "Next"}
        <Icon name="chevronRight" size={18} color="#fff" />
      </button>
    </div>
  );
}

function HomeScreen({ dark }) {
  const t = dark ? theme.dark : theme.light;
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Today", "Upcoming", "Completed", "Overdue"];
  const stats = [
    { label: "Today", count: 3, color: BLUE },
    { label: "Pending", count: 5, color: ORANGE },
    { label: "Done", count: 8, color: GREEN },
    { label: "Overdue", count: 1, color: RED },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "0 20px 16px", background: dark ? "linear-gradient(180deg, #1a2d4a 0%, transparent 100%)" : `linear-gradient(180deg, ${BLUE}12 0%, transparent 100%)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: t.muted, fontWeight: 500 }}>Good morning 👋</p>
            <h2 style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800, color: t.text }}>Alex Johnson</h2>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${BLUE}, #8B5CF6)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 18 }}>👤</span>
          </div>
        </div>
        <p style={{ margin: "4px 0 16px", fontSize: 12.5, color: t.muted }}>Saturday, May 16, 2026</p>

        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: t.inputBg, borderRadius: 14, padding: "11px 16px",
          border: `1px solid ${t.border}`,
        }}>
          <Icon name="search" size={16} color={t.muted} />
          <span style={{ color: t.muted, fontSize: 14 }}>Search tasks...</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: t.card, borderRadius: 14, padding: "12px 8px", textAlign: "center",
            boxShadow: dark ? "0 2px 10px rgba(0,0,0,0.2)" : "0 2px 10px rgba(15,23,42,0.06)",
            border: `1px solid ${t.border}`,
          }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</p>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: t.muted, fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ paddingLeft: 20, overflowX: "auto", display: "flex", gap: 8, marginBottom: 16, paddingBottom: 4 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 14px", borderRadius: 99, border: "none",
            background: filter === f ? BLUE : t.inputBg,
            color: filter === f ? "#fff" : t.muted,
            fontWeight: filter === f ? 700 : 500, fontSize: 12.5,
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
            boxShadow: filter === f ? "0 3px 10px rgba(37,99,235,0.3)" : "none",
          }}>{f}</button>
        ))}
        <div style={{ width: 12, flexShrink: 0 }} />
      </div>

      {/* Task list */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.text }}>Today's Tasks</p>
          <span style={{ fontSize: 12, color: t.muted }}>5 tasks</span>
        </div>
        {sampleTasks.map(task => (
          <TaskCard key={task.id} task={task} dark={dark} />
        ))}
      </div>
    </div>
  );
}

function AddTaskScreen({ dark }) {
  const t = dark ? theme.dark : theme.light;
  const [priority, setPriority] = useState("Medium");

  const inputStyle = {
    background: t.inputBg, border: `1px solid ${t.border}`,
    borderRadius: 14, padding: "13px 16px",
    color: t.text, fontSize: 14, width: "100%", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 12.5, fontWeight: 700, color: t.muted, marginBottom: 6, display: "block", letterSpacing: 0.3 };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="chevronLeft" size={20} color={t.muted} />
        </div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>Add New Task</h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Title */}
        <div>
          <label style={labelStyle}>TASK TITLE</label>
          <input placeholder="e.g. Team meeting at 10am" style={inputStyle} />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>DESCRIPTION</label>
          <textarea placeholder="Add notes or details..." rows={3} style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
        </div>

        {/* Category & Priority row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>CATEGORY</label>
            <div style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: t.text, fontSize: 13 }}>Work</span>
              <Icon name="chevronRight" size={14} color={t.muted} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>PRIORITY</label>
            <div style={{ display: "flex", gap: 5 }}>
              {["High", "Med", "Low"].map(p => {
                const full = p === "Med" ? "Medium" : p;
                const c = priorityColors[full];
                return (
                  <button key={p} onClick={() => setPriority(full)} style={{
                    flex: 1, padding: "10px 4px", borderRadius: 10, border: `2px solid ${priority === full ? c : t.border}`,
                    background: priority === full ? (dark ? priorityBgDark[full] : priorityBg[full]) : "transparent",
                    color: priority === full ? c : t.muted, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  }}>{p}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>DATE</label>
            <div style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="calendar" size={14} color={BLUE} />
              <span style={{ color: t.text, fontSize: 13 }}>May 17, 2026</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>TIME</label>
            <div style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="clock" size={14} color={BLUE} />
              <span style={{ color: t.text, fontSize: 13 }}>9:00 AM</span>
            </div>
          </div>
        </div>

        {/* Reminder */}
        <div>
          <label style={labelStyle}>REMINDER</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["5 min", "15 min", "30 min", "1 hr"].map((r, i) => (
              <button key={r} style={{
                flex: 1, padding: "9px 4px", borderRadius: 10,
                border: `2px solid ${i === 1 ? BLUE : t.border}`,
                background: i === 1 ? BLUE + "15" : "transparent",
                color: i === 1 ? BLUE : t.muted, fontSize: 11, fontWeight: i === 1 ? 700 : 500,
                cursor: "pointer",
              }}>{r}</button>
            ))}
          </div>
        </div>

        {/* Repeat */}
        <div>
          <label style={labelStyle}>REPEAT</label>
          <div style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="repeat" size={15} color={BLUE} />
              <span style={{ color: t.text, fontSize: 13 }}>Does not repeat</span>
            </div>
            <Icon name="chevronRight" size={14} color={t.muted} />
          </div>
        </div>

        {/* Save button */}
        <button style={{
          marginTop: 4, height: 54, borderRadius: 16, border: "none",
          background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
          color: "#fff", fontSize: 15.5, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <Icon name="check" size={18} color="#fff" />
          Save Task
        </button>
      </div>
    </div>
  );
}

function TaskDetailScreen({ dark }) {
  const t = dark ? theme.dark : theme.light;
  const [subtasks, setSubtasks] = useState([
    { id: 1, text: "Review Q1 data", done: true },
    { id: 2, text: "Prepare slides", done: true },
    { id: 3, text: "Send to manager", done: false },
  ]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="chevronLeft" size={20} color={t.muted} />
          </div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: t.text }}>Task Details</h2>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: t.inputBg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="edit" size={16} color={BLUE} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 24px" }}>
        {/* Priority badge + title */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: "#FEF2F2", color: RED }}>● High Priority</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: BLUE + "18", color: BLUE }}>Work</span>
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: t.text, lineHeight: 1.2 }}>Submit project report</h1>
          <p style={{ margin: 0, fontSize: 13.5, color: t.muted, lineHeight: 1.6 }}>Finalize and send the Q1 performance report to the management team before end of day.</p>
        </div>

        {/* Countdown card */}
        <div style={{
          background: `linear-gradient(135deg, ${RED}18, ${ORANGE}12)`,
          border: `1px solid ${RED}30`, borderRadius: 16, padding: 16, marginBottom: 16,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: RED + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="alarm" size={20} color={RED} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11.5, color: t.muted, fontWeight: 600 }}>DEADLINE</p>
            <p style={{ margin: "2px 0 0", fontSize: 15.5, fontWeight: 800, color: RED }}>OVERDUE by 1 day</p>
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { icon: "calendar", label: "Date", value: "May 15, 2026" },
            { icon: "clock", label: "Time", value: "5:00 PM" },
            { icon: "bell", label: "Reminder", value: "30 min before" },
            { icon: "repeat", label: "Repeat", value: "Never" },
          ].map(item => (
            <div key={item.label} style={{ background: t.inputBg, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Icon name={item.icon} size={13} color={BLUE} />
                <span style={{ fontSize: 10.5, color: t.muted, fontWeight: 600 }}>{item.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Subtasks */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: t.text }}>Subtasks ({subtasks.filter(s => s.done).length}/{subtasks.length})</p>
          {/* Progress bar */}
          <div style={{ height: 5, background: t.border, borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(subtasks.filter(s => s.done).length / subtasks.length) * 100}%`, background: GREEN, borderRadius: 99, transition: "width 0.3s" }} />
          </div>
          {subtasks.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <div
                onClick={() => setSubtasks(prev => prev.map(t => t.id === s.id ? { ...t, done: !t.done } : t))}
                style={{
                  width: 20, height: 20, borderRadius: 6, border: `2px solid ${s.done ? GREEN : t.border}`,
                  background: s.done ? GREEN : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}>
                {s.done && <Icon name="check" size={11} color="#fff" />}
              </div>
              <span style={{ fontSize: 13.5, color: s.done ? t.muted : t.text, textDecoration: s.done ? "line-through" : "none" }}>{s.text}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <button style={{
          width: "100%", height: 50, borderRadius: 14, border: "none", marginBottom: 10,
          background: `linear-gradient(135deg, ${GREEN}, #16a34a)`, color: "#fff",
          fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 6px 20px rgba(34,197,94,0.3)",
        }}>
          <Icon name="check" size={18} color="#fff" /> Mark as Done
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button style={{
            height: 46, borderRadius: 14, border: `2px solid ${BLUE}`,
            background: "transparent", color: BLUE, fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}>
            <Icon name="edit" size={15} color={BLUE} /> Edit Task
          </button>
          <button style={{
            height: 46, borderRadius: 14, border: `2px solid ${RED}`,
            background: "transparent", color: RED, fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}>
            <Icon name="trash" size={15} color={RED} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CalendarScreen({ dark }) {
  const t = dark ? theme.dark : theme.light;
  const [selectedDay, setSelectedDay] = useState(16);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const taskDays = [3, 7, 10, 12, 14, 16, 18, 21, 24, 27];
  const firstDayOffset = 5; // May 2026 starts on Friday

  const calDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "0 20px 16px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="chevronLeft" size={18} color={t.muted} />
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>May 2026</h2>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="chevronRight" size={18} color={t.muted} />
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {days.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, color: t.muted, padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e-${i}`} />)}
          {calDays.map(day => {
            const hasTasks = taskDays.includes(day);
            const isSelected = day === selectedDay;
            const isToday = day === 16;
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  aspectRatio: "1", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", borderRadius: 10,
                  cursor: "pointer", position: "relative",
                  background: isSelected ? BLUE : isToday ? BLUE + "18" : "transparent",
                  transition: "all 0.2s",
                }}>
                <span style={{ fontSize: 13.5, fontWeight: isSelected || isToday ? 700 : 500, color: isSelected ? "#fff" : t.text }}>
                  {day}
                </span>
                {hasTasks && !isSelected && (
                  <div style={{ position: "absolute", bottom: 3, width: 4, height: 4, borderRadius: "50%", background: BLUE }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto" }}>
        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: t.text }}>
          May {selectedDay} — 2 Tasks
        </p>
        {sampleTasks.slice(0, 2).map(task => (
          <div key={task.id} style={{ marginBottom: 10 }}>
            <TaskCard task={task} dark={dark} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsScreen({ dark }) {
  const t = dark ? theme.dark : theme.light;
  const weekData = [
    { day: "Mon", count: 4 }, { day: "Tue", count: 6 }, { day: "Wed", count: 3 },
    { day: "Thu", count: 7 }, { day: "Fri", count: 5 }, { day: "Sat", count: 2 }, { day: "Sun", count: 0 },
  ];
  const maxCount = 8;

  const summaryCards = [
    { label: "Completed", count: 24, color: GREEN, pct: "68%" },
    { label: "Pending", count: 8, color: ORANGE, pct: "23%" },
    { label: "Overdue", count: 3, color: RED, pct: "9%" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800, color: t.text }}>Your Stats</h2>

      {/* Productivity ring */}
      <div style={{
        background: t.card, borderRadius: 20, padding: 20, marginBottom: 16,
        boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(15,23,42,0.07)",
        border: `1px solid ${t.border}`,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 90, height: 90 }}>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={t.border} strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={BLUE} strokeWidth="3"
              strokeDasharray="68 32" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>68%</span>
          </div>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: t.text }}>Productivity</p>
          <p style={{ margin: "4px 0 10px", fontSize: 12.5, color: t.muted }}>This week • 35 tasks</p>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: GREEN + "20", color: GREEN, fontWeight: 700 }}>↑ 12% vs last week</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {summaryCards.map(s => (
          <div key={s.label} style={{
            background: t.card, borderRadius: 14, padding: "14px 10px", textAlign: "center",
            boxShadow: dark ? "0 2px 10px rgba(0,0,0,0.2)" : "0 2px 10px rgba(15,23,42,0.06)",
            border: `1px solid ${t.border}`,
          }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</p>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: t.muted, fontWeight: 600 }}>{s.label}</p>
            <p style={{ margin: "3px 0 0", fontSize: 10.5, fontWeight: 700, color: s.color }}>{s.pct}</p>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <div style={{
        background: t.card, borderRadius: 20, padding: "18px 16px",
        boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(15,23,42,0.07)",
        border: `1px solid ${t.border}`,
      }}>
        <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: t.text }}>Weekly Progress</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {weekData.map((d, i) => (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 10, color: t.muted, fontWeight: 700 }}>{d.count || ""}</span>
              <div style={{
                width: "100%", borderRadius: 8,
                height: d.count > 0 ? `${(d.count / maxCount) * 75}px` : 4,
                background: i === 4 ? `linear-gradient(180deg, ${BLUE}, #1d4ed8)` : t.inputBg,
                minHeight: 4, transition: "height 0.3s",
              }} />
              <span style={{ fontSize: 10, color: i === 4 ? BLUE : t.muted, fontWeight: i === 4 ? 700 : 500 }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ marginTop: 16, background: t.card, borderRadius: 20, padding: "18px 16px", boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(15,23,42,0.07)", border: `1px solid ${t.border}` }}>
        <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: t.text }}>By Category</p>
        {[{ label: "Work", pct: 55, color: BLUE }, { label: "Personal", pct: 25, color: PURPLE }, { label: "Health", pct: 20, color: GREEN }].map(c => (
          <div key={c.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text }}>{c.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.pct}%</span>
            </div>
            <div style={{ height: 6, background: t.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ dark, setDark }) {
  const t = dark ? theme.dark : theme.light;
  const [notif, setNotif] = useState(true);
  const [alarm, setAlarm] = useState(true);
  const [sound, setSound] = useState("Chime");

  function Toggle({ value, onChange }) {
    return (
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 99, cursor: "pointer",
          background: value ? BLUE : t.border, transition: "background 0.2s",
          display: "flex", alignItems: "center", padding: "0 3px",
        }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transform: value ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    );
  }

  function Row({ icon, label, right, color = BLUE }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", padding: "14px 16px", gap: 14,
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={16} color={color} />
        </div>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: t.text }}>{label}</span>
        {right}
      </div>
    );
  }

  function Section({ title, children }) {
    return (
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: "0 0 8px 4px", fontSize: 11.5, fontWeight: 700, color: t.muted, letterSpacing: 0.5 }}>{title}</p>
        <div style={{ background: t.card, borderRadius: 16, overflow: "hidden", boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(15,23,42,0.06)", border: `1px solid ${t.border}` }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "4px 0 20px", borderBottom: `1px solid ${t.border}`, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${BLUE}, ${PURPLE})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 24 }}>👤</span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.text }}>Alex Johnson</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: t.muted }}>alex@example.com</p>
        </div>
        <div style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 10, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="chevronRight" size={16} color={t.muted} />
        </div>
      </div>

      <Section title="NOTIFICATIONS">
        <Row icon="bell" label="Push Notifications" right={<Toggle value={notif} onChange={setNotif} />} />
        <Row icon="alarm" label="Alarm Reminders" color={ORANGE} right={<Toggle value={alarm} onChange={setAlarm} />} />
        <Row icon="volume" label="Reminder Sound" color={PURPLE} right={<span style={{ fontSize: 13, color: t.muted, fontWeight: 600 }}>{sound}</span>} />
      </Section>

      <Section title="APPEARANCE">
        <Row
          icon={dark ? "moon" : "sun"} label="Dark Mode"
          color={dark ? PURPLE : ORANGE}
          right={<Toggle value={dark} onChange={setDark} />}
        />
        <Row icon="palette" label="App Theme" color={BLUE}
          right={<div style={{ display: "flex", gap: 4 }}>
            {[BLUE, PURPLE, GREEN, ORANGE].map(c => (
              <div key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: c === BLUE ? `2px solid ${t.text}` : "none" }} />
            ))}
          </div>} />
      </Section>

      <Section title="DATA">
        <Row icon="backup" label="Backup & Restore" color={GREEN}
          right={<span style={{ fontSize: 11, color: GREEN, fontWeight: 700, background: GREEN + "18", padding: "3px 8px", borderRadius: 99 }}>Auto</span>} />
        <Row icon="shield" label="Privacy" color={t.muted} right={<Icon name="chevronRight" size={14} color={t.muted} />} />
      </Section>

      <Section title="ABOUT">
        <Row icon="info" label="App Version" color={t.muted} right={<span style={{ fontSize: 12.5, color: t.muted }}>v1.0.0</span>} />
      </Section>
    </div>
  );
}

function EmptyState({ dark, label }) {
  const t = dark ? theme.dark : theme.light;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: t.inputBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 36 }}>📭</span>
      </div>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>No tasks here!</p>
      <p style={{ margin: 0, fontSize: 13, color: t.muted, textAlign: "center" }}>{label}</p>
      <button style={{
        marginTop: 8, padding: "10px 24px", borderRadius: 12, border: "none",
        background: BLUE, color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
        boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
      }}>+ Add Task</button>
    </div>
  );
}

// ─── NOTIFICATION POPUP DEMO ──────────────────────────────────────────────────
function NotificationDemo({ dark }) {
  const t = dark ? theme.dark : theme.light;
  return (
    <div style={{
      background: dark ? "rgba(30,41,59,0.98)" : "rgba(248,250,252,0.98)",
      border: `1px solid ${t.border}`,
      borderRadius: 20, padding: "14px 16px",
      display: "flex", gap: 12, alignItems: "center",
      boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(15,23,42,0.15)",
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Bell size={20} color="white" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text }}>TaskBell</p>
          <p style={{ margin: 0, fontSize: 11, color: t.muted }}>now</p>
        </div>
        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: t.muted }}>⏰ "Submit project report" due in 15 minutes!</p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function TaskBellDesign() {
  const [darkAll, setDarkAll] = useState(false);
  const [activeScreen, setActiveScreen] = useState(null);

  const screens = [
    { id: "splash", label: "Splash", dark: false },
    { id: "onboarding", label: "Onboarding", dark: false },
    { id: "home", label: "Home", dark: false },
    { id: "home-dark", label: "Home Dark", dark: true },
    { id: "add", label: "Add Task", dark: false },
    { id: "detail", label: "Task Detail", dark: false },
    { id: "calendar", label: "Calendar", dark: true },
    { id: "stats", label: "Stats", dark: false },
    { id: "settings", label: "Settings", dark: true },
    { id: "empty", label: "Empty State", dark: false },
    { id: "notification", label: "Notification", dark: false },
  ];

  function renderScreen(id, dark) {
    const tabScreens = ["home", "home-dark", "calendar", "stats", "settings"];
    const tab = id === "home" || id === "home-dark" ? "home" : id;

    return (
      <PhoneFrame dark={dark}>
        {id === "splash" && <SplashScreen />}
        {id === "onboarding" && <OnboardingScreen dark={dark} />}
        {(id === "home" || id === "home-dark") && <HomeScreen dark={dark} />}
        {id === "add" && <AddTaskScreen dark={dark} />}
        {id === "detail" && <TaskDetailScreen dark={dark} />}
        {id === "calendar" && <CalendarScreen dark={dark} />}
        {id === "stats" && <StatsScreen dark={dark} />}
        {id === "settings" && <SettingsScreen dark={dark} setDark={() => {}} />}
        {id === "empty" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "0 20px 12px" }}><h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: dark ? theme.dark.text : theme.light.text }}>Overdue Tasks</h2></div>
            <EmptyState dark={dark} label="No overdue tasks. You're all caught up!" />
          </div>
        )}
        {id === "notification" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20, gap: 12 }}>
            <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: dark ? theme.dark.text : theme.light.text }}>Notification Types</p>
            <NotificationDemo dark={false} />
            <div style={{ height: 12 }} />
            <NotificationDemo dark={true} />
            <div style={{ marginTop: 16, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 30px rgba(15,23,42,0.15)" }}>
              <div style={{ background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Bell size={20} color="white" />
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Alarm Trigger</span>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Morning standup call</p>
                <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#64748B" }}>Starts in 5 minutes — Don't be late!</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, height: 38, borderRadius: 10, border: "none", background: "#F1F5F9", color: "#64748B", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Snooze 10m</button>
                  <button style={{ flex: 1, height: 38, borderRadius: 10, border: "none", background: BLUE, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {tabScreens.includes(id === "home-dark" ? "home" : id) && (
          <BottomNav active={id === "home-dark" ? "home" : id} onTab={() => {}} dark={dark} />
        )}
      </PhoneFrame>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0F1E",
      fontFamily: "'DM Sans', 'Nunito', sans-serif",
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(37,99,235,0.45)",
            }}>
              <Bell size={26} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>TaskBell</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>Complete UI Design System</p>
            </div>
          </div>
          {/* Color palette */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[BLUE, GREEN, ORANGE, RED, PURPLE, "#0F172A"].map(c => (
              <div key={c} style={{ width: 20, height: 20, borderRadius: 6, background: c, border: "1.5px solid rgba(255,255,255,0.15)" }} />
            ))}
          </div>
        </div>

        {/* Screen filter chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0 32px" }}>
          <button
            onClick={() => setActiveScreen(null)}
            style={{
              padding: "7px 14px", borderRadius: 99, border: "none",
              background: !activeScreen ? BLUE : "rgba(255,255,255,0.08)",
              color: !activeScreen ? "#fff" : "#94A3B8",
              fontWeight: !activeScreen ? 700 : 500, fontSize: 12.5,
              cursor: "pointer", transition: "all 0.2s",
            }}>All Screens</button>
          {screens.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveScreen(activeScreen === s.id ? null : s.id)}
              style={{
                padding: "7px 14px", borderRadius: 99, border: "none",
                background: activeScreen === s.id ? BLUE : "rgba(255,255,255,0.08)",
                color: activeScreen === s.id ? "#fff" : "#94A3B8",
                fontWeight: activeScreen === s.id ? 700 : 500, fontSize: 12.5,
                cursor: "pointer", transition: "all 0.2s",
              }}>{s.label}</button>
          ))}
        </div>

        {/* Screen grid */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "center",
        }}>
          {screens
            .filter(s => !activeScreen || s.id === activeScreen)
            .map(s => (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{
                  fontSize: 11.5, fontWeight: 700, color: "#64748B", letterSpacing: 0.5,
                  textTransform: "uppercase", display: "flex", gap: 6, alignItems: "center",
                }}>
                  {s.label}
                  {s.dark && <span style={{ padding: "1px 6px", borderRadius: 99, background: "rgba(139,92,246,0.2)", color: "#8B5CF6", fontSize: 10 }}>Dark</span>}
                </div>
                {renderScreen(s.id, s.dark)}
              </div>
            ))}
        </div>

        {/* Design tokens footer */}
        <div style={{ marginTop: 56, padding: "28px 32px", background: "rgba(255,255,255,0.04)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#fff" }}>Design Tokens — React Native Reference</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { group: "Typography", items: ["Title: DM Sans 800 26px", "Heading: DM Sans 700 18px", "Body: DM Sans 500 14px", "Caption: DM Sans 600 11px"] },
              { group: "Spacing", items: ["Screen padding: 20px", "Card padding: 16px", "Gap-sm: 8px", "Gap-md: 12px", "Gap-lg: 16px"] },
              { group: "Radius", items: ["Card: 16px", "Button: 14–16px", "Input: 14px", "Badge: 99px", "Icon container: 10–12px"] },
              { group: "Shadows", items: ["Card: 0 2px 12px 7%", "Button: 0 8px 24px 35%", "Nav: 0 -4px 20px 6%", "FAB: 0 4px 16px 45%"] },
            ].map(group => (
              <div key={group.group}>
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: 0.4 }}>{group.group.toUpperCase()}</p>
                {group.items.map(item => (
                  <p key={item} style={{ margin: "0 0 4px", fontSize: 12, color: "#94A3B8" }}>• {item}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
