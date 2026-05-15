import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  AlarmClock,
  ArrowDownToLine,
  BarChart3,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Command,
  Flame,
  Focus,
  Gauge,
  Layers3,
  ListChecks,
  Moon,
  MoreHorizontal,
  Palette,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Square,
  Target,
  TimerReset,
  Trash2,
  Trophy,
  Wand2,
  Zap,
} from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Focus },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "sessions", label: "Sessions", icon: CalendarClock },
  { id: "settings", label: "Settings", icon: Settings },
];

const ranges = ["Today", "Week", "Month", "All Time"];

const taskSeed = [
  {
    id: 1,
    title: "Revise Linear Algebra",
    course: "Mathematics",
    status: "In Progress",
    priority: "High",
    estimate: 180,
    spent: 126,
    due: "Tonight",
    streak: 4,
    color: "from-violet-500 to-fuchsia-500",
    notes: "Eigenvalues, diagonalization, and orthogonal projections.",
  },
  {
    id: 2,
    title: "Physics PYQ Set",
    course: "Mechanics",
    status: "Queued",
    priority: "Medium",
    estimate: 120,
    spent: 48,
    due: "Tomorrow",
    streak: 2,
    color: "from-cyan-400 to-blue-500",
    notes: "Solve last 3 years of rotational motion questions.",
  },
  {
    id: 3,
    title: "Organic Chemistry Mechanisms",
    course: "Chemistry",
    status: "In Progress",
    priority: "High",
    estimate: 150,
    spent: 92,
    due: "May 18",
    streak: 7,
    color: "from-emerald-400 to-teal-500",
    notes: "SN1/SN2/E1/E2 comparison map and named reactions.",
  },
  {
    id: 4,
    title: "DSA Dynamic Programming",
    course: "Computer Science",
    status: "Done",
    priority: "Low",
    estimate: 210,
    spent: 226,
    due: "Done",
    streak: 9,
    color: "from-amber-400 to-orange-500",
    notes: "Knapsack, LIS, matrix chain multiplication.",
  },
];

const sessionSeed = [
  { id: 101, taskId: 1, mode: "Pomodoro", date: "Today", start: "08:10", duration: 25, focus: 96, breaks: 5, mood: "Locked in" },
  { id: 102, taskId: 3, mode: "Regular", date: "Today", start: "10:00", duration: 52, focus: 89, breaks: 8, mood: "Calm" },
  { id: 103, taskId: 2, mode: "Pomodoro", date: "Today", start: "12:35", duration: 25, focus: 91, breaks: 5, mood: "Sharp" },
  { id: 104, taskId: 1, mode: "Regular", date: "Yesterday", start: "19:20", duration: 74, focus: 84, breaks: 10, mood: "Deep" },
  { id: 105, taskId: 4, mode: "Regular", date: "This Week", start: "17:05", duration: 88, focus: 93, breaks: 12, mood: "Flow" },
  { id: 106, taskId: 3, mode: "Pomodoro", date: "This Week", start: "06:40", duration: 25, focus: 88, breaks: 5, mood: "Steady" },
  { id: 107, taskId: 2, mode: "Regular", date: "This Month", start: "21:15", duration: 65, focus: 82, breaks: 9, mood: "Tired" },
  { id: 108, taskId: 1, mode: "Pomodoro", date: "This Month", start: "14:25", duration: 25, focus: 97, breaks: 5, mood: "Peak" },
];

const dailyChart = [
  { label: "Mon", focus: 94, sessions: 3, minutes: 128 },
  { label: "Tue", focus: 88, sessions: 4, minutes: 164 },
  { label: "Wed", focus: 91, sessions: 2, minutes: 96 },
  { label: "Thu", focus: 84, sessions: 5, minutes: 190 },
  { label: "Fri", focus: 96, sessions: 3, minutes: 142 },
  { label: "Sat", focus: 89, sessions: 6, minutes: 220 },
  { label: "Sun", focus: 93, sessions: 4, minutes: 176 },
];

const heatData = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  value: [0, 1, 2, 3, 4][Math.floor(Math.abs(Math.sin(i * 1.73) * 5))],
}));

const prettyMinutes = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}m`;
  return `${h}h ${m}m`;
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function GlassCard({ children, className = "", intense = false }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 backdrop-blur-2xl",
        intense && "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.12] before:to-transparent before:pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, glow = "from-violet-500/30" }) {
  return (
    <GlassCard className="p-5" intense>
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{detail}</p>
        </div>
        <div className={cn("grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br to-white/5", glow)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="hidden w-[286px] shrink-0 flex-col border-r border-white/10 bg-black/20 px-5 py-6 backdrop-blur-2xl lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-violet-500/30">
          <Sparkles className="h-6 w-6 text-white" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.9)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">FocusFlow</h1>
          <p className="text-xs text-slate-400">Study operating system</p>
        </div>
      </div>

      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active ? "bg-white text-slate-950 shadow-xl shadow-violet-500/20" : "text-slate-400 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
              {active && <ChevronRight className="ml-auto h-4 w-4" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.75rem] border border-violet-300/20 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10 p-5">
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
          <Trophy className="h-5 w-5 text-amber-200" />
        </div>
        <p className="text-sm font-semibold text-white">Elite streak active</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">You are 3 focused sessions away from your strongest week.</p>
      </div>
    </aside>
  );
}

function TopBar({ range, setRange }) {
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[#050713]/70 px-4 py-4 backdrop-blur-2xl md:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-200/70">
            <Command className="h-3.5 w-3.5" /> Focus Command Center
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">Design your deepest study day.</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-2xl border border-white/10 bg-white/[0.06] p-1">
            {ranges.map((item) => (
              <button
                key={item}
                onClick={() => setRange(item)}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold transition-all md:px-4",
                  range === item ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-white"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 hover:bg-white/10 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-[1.5rem] border border-white/10 bg-[#080b18]/85 p-2 shadow-2xl backdrop-blur-2xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn("grid place-items-center rounded-2xl py-3 transition-all", active ? "bg-white text-slate-950" : "text-slate-400")}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Dashboard({ tasks, addSession }) {
  const [mode, setMode] = useState("Pomodoro");
  const [running, setRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id);
  const selectedTask = tasks.find((task) => task.id === Number(selectedTaskId));
  const totalSeconds = mode === "Pomodoro" ? 25 * 60 : 62 * 60;
  const [elapsed, setElapsed] = useState(mode === "Pomodoro" ? 7 * 60 + 18 : 17 * 60 + 42);
  const progress = Math.min(elapsed / totalSeconds, 1);
  const remaining = Math.max(totalSeconds - elapsed, 0);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  function completeSession() {
    addSession({ taskId: selectedTask.id, mode, duration: Math.max(1, Math.round(elapsed / 60)), focus: 94, breaks: mode === "Pomodoro" ? 5 : 8, mood: "Manual" });
    setRunning(false);
  }

  return (
    <div className="grid min-h-[calc(100vh-120px)] place-items-center p-4 md:p-8">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl">
        <GlassCard className="p-5 md:p-8 lg:p-10" intense>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-8 flex rounded-3xl border border-white/10 bg-black/20 p-1.5">
              {['Regular', 'Pomodoro'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setMode(item);
                    setElapsed(item === "Pomodoro" ? 7 * 60 + 18 : 17 * 60 + 42);
                  }}
                  className={cn(
                    "rounded-2xl px-6 py-3 text-sm font-semibold transition-all",
                    mode === item ? "bg-white text-slate-950 shadow-xl" : "text-slate-400 hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="relative grid h-[330px] w-[330px] place-items-center md:h-[430px] md:w-[430px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/25 via-fuchsia-500/10 to-cyan-400/25 blur-3xl" />
              <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="130" cy="130" r="112" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                <circle
                  cx="130"
                  cy="130"
                  r="112"
                  stroke="url(#timerGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 112}`}
                  strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress)}`}
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="relative z-10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{mode} Focus</p>
                <div className="font-mono text-7xl font-semibold tracking-[-0.08em] text-white md:text-8xl">{mm}:{ss}</div>
                <p className="mt-5 text-sm text-slate-400">{running ? "Session in progress" : "Ready when you are"}</p>
              </div>
            </div>

            <GlassCard className="mt-8 w-full max-w-2xl p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 text-left">
                  <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br", selectedTask.color)} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Linked task</p>
                    <h3 className="mt-1 font-semibold text-white">{selectedTask.title}</h3>
                    <p className="text-sm text-slate-400">{selectedTask.course} · {prettyMinutes(selectedTask.spent)} logged</p>
                  </div>
                </div>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none"
                >
                  {tasks.map((task) => <option className="bg-slate-950" key={task.id} value={task.id}>{task.title}</option>)}
                </select>
              </div>
            </GlassCard>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={() => setRunning(!running)} className="group flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950 shadow-2xl shadow-white/10 transition hover:scale-[1.02]">
                {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />} {running ? "Pause" : "Start"}
              </button>
              <button onClick={completeSession} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-4 font-semibold text-white transition hover:bg-white/10">
                <Square className="h-5 w-5" /> Finish & Save
              </button>
              <button onClick={() => setElapsed(0)} className="grid h-[56px] w-[56px] place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/10">
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function Analytics({ tasks, sessions }) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgFocus = Math.round(sessions.reduce((sum, s) => sum + s.focus, 0) / sessions.length);
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const pieData = tasks.map((task) => ({ name: task.course, value: sessions.filter((s) => s.taskId === task.id).reduce((sum, s) => sum + s.duration, 0) || task.spent }));
  const colors = ["#8b5cf6", "#22d3ee", "#34d399", "#f59e0b"];

  return (
    <div className="p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Clock3} label="Focused time" value={prettyMinutes(totalMinutes)} detail="+18% from previous range" glow="from-cyan-400/30" />
        <MetricCard icon={Gauge} label="Average focus" value={`${avgFocus}%`} detail="High-performance concentration" glow="from-violet-500/30" />
        <MetricCard icon={Flame} label="Current streak" value="12 days" detail="Top 7% consistency tier" glow="from-orange-400/30" />
        <MetricCard icon={CheckCircle2} label="Tasks completed" value={`${completedTasks}/${tasks.length}`} detail="Completion velocity is rising" glow="from-emerald-400/30" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <GlassCard className="p-5 md:p-6" intense>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Focus intensity curve</h3>
              <p className="mt-1 text-sm text-slate-400">Minutes, session count, and focus quality by day.</p>
            </div>
            <Activity className="h-5 w-5 text-cyan-200" />
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyChart}>
                <defs>
                  <linearGradient id="areaFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#080b18", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, color: "white" }} />
                <Area type="monotone" dataKey="minutes" stroke="#a78bfa" strokeWidth={3} fill="url(#areaFocus)" />
                <Line type="monotone" dataKey="focus" stroke="#22d3ee" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-6" intense>
          <h3 className="text-xl font-semibold text-white">Subject distribution</h3>
          <p className="mt-1 text-sm text-slate-400">Time allocation across your linked tasks.</p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={102} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#080b18", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, color: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white/[0.045] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: colors[index % colors.length] }} />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{prettyMinutes(item.value)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-5 md:p-6 xl:col-span-2" intense>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Session volume</h3>
              <p className="mt-1 text-sm text-slate-400">Raw execution count reveals rhythm and fatigue windows.</p>
            </div>
            <Layers3 className="h-5 w-5 text-violet-200" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChart}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#080b18", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, color: "white" }} />
                <Bar dataKey="sessions" radius={[14, 14, 6, 6]} fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-6" intense>
          <h3 className="text-xl font-semibold text-white">Consistency heatmap</h3>
          <p className="mt-1 text-sm text-slate-400">42-day study density map.</p>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {heatData.map((d) => (
              <div
                key={d.id}
                className={cn(
                  "aspect-square rounded-xl border border-white/5",
                  d.value === 0 && "bg-white/[0.035]",
                  d.value === 1 && "bg-cyan-400/20",
                  d.value === 2 && "bg-cyan-400/35",
                  d.value === 3 && "bg-violet-400/50",
                  d.value === 4 && "bg-fuchsia-400/70 shadow-lg shadow-fuchsia-500/20"
                )}
              />
            ))}
          </div>
          <div className="mt-6 rounded-3xl bg-white/[0.045] p-4">
            <p className="text-sm font-medium text-white">Best focus window</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-100">08:00–10:30</p>
            <p className="mt-2 text-sm text-slate-400">Sessions started here average 94% focus.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Tasks({ tasks }) {
  const [query, setQuery] = useState("");
  const filtered = tasks.filter((task) => `${task.title} ${task.course} ${task.status}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="p-4 md:p-8">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">Task intelligence</h3>
          <p className="mt-1 text-slate-400">Every detail: progress, estimates, deadlines, notes, and execution quality.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-slate-300">
            <Search className="h-5 w-5" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-500" />
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"><Plus className="h-4 w-4" /> New Task</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((task) => {
          const pct = Math.min(Math.round((task.spent / task.estimate) * 100), 100);
          return (
            <motion.div key={task.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-5 md:p-6" intense>
                <div className="flex items-start justify-between gap-5">
                  <div className="flex gap-4">
                    <div className={cn("h-16 w-16 rounded-[1.35rem] bg-gradient-to-br shadow-xl", task.color)} />
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-medium text-slate-300">{task.course}</span>
                        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", task.priority === "High" ? "bg-rose-400/15 text-rose-200" : task.priority === "Medium" ? "bg-amber-400/15 text-amber-200" : "bg-emerald-400/15 text-emerald-200")}>{task.priority}</span>
                      </div>
                      <h4 className="text-xl font-semibold text-white">{task.title}</h4>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{task.notes}</p>
                    </div>
                  </div>
                  <button className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-slate-300"><MoreHorizontal className="h-5 w-5" /></button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-white/[0.045] p-4"><p className="text-xs text-slate-500">Status</p><p className="mt-1 font-semibold text-white">{task.status}</p></div>
                  <div className="rounded-2xl bg-white/[0.045] p-4"><p className="text-xs text-slate-500">Due</p><p className="mt-1 font-semibold text-white">{task.due}</p></div>
                  <div className="rounded-2xl bg-white/[0.045] p-4"><p className="text-xs text-slate-500">Spent</p><p className="mt-1 font-semibold text-white">{prettyMinutes(task.spent)}</p></div>
                  <div className="rounded-2xl bg-white/[0.045] p-4"><p className="text-xs text-slate-500">Streak</p><p className="mt-1 font-semibold text-white">{task.streak} days</p></div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Progress against estimate</span><span className="font-semibold text-white">{pct}%</span></div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]"><div className={cn("h-full rounded-full bg-gradient-to-r", task.color)} style={{ width: `${pct}%` }} /></div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Sessions({ tasks, sessions, addSession, removeSession }) {
  const total = sessions.reduce((sum, session) => sum + session.duration, 0);
  return (
    <div className="p-4 md:p-8">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">Session ledger</h3>
          <p className="mt-1 text-slate-400">A precise archive of focus blocks, linked tasks, breaks, and quality.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => addSession({ taskId: tasks[0].id, mode: "Regular", duration: 45, focus: 90, breaks: 7, mood: "Added" })} className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"><Plus className="h-4 w-4" /> Add Session</button>
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"><ArrowDownToLine className="h-4 w-4" /> Export CSV</button>
        </div>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <MetricCard icon={TimerReset} label="Total session time" value={prettyMinutes(total)} detail="Across visible range" glow="from-cyan-400/30" />
        <MetricCard icon={Target} label="Sessions logged" value={sessions.length} detail="Manual and timer-created" glow="from-violet-500/30" />
        <MetricCard icon={Zap} label="Best session" value="97%" detail="Peak recorded focus" glow="from-fuchsia-400/30" />
      </div>

      <GlassCard className="overflow-hidden" intense>
        <div className="hidden grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.7fr_0.2fr] border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
          <span>Task</span><span>Mode</span><span>Date</span><span>Duration</span><span>Focus</span><span />
        </div>
        <div className="divide-y divide-white/10">
          {sessions.map((session) => {
            const task = tasks.find((t) => t.id === session.taskId) || tasks[0];
            return (
              <div key={session.id} className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.7fr_0.2fr] md:items-center md:px-6">
                <div className="flex items-center gap-4">
                  <div className={cn("h-12 w-12 rounded-2xl bg-gradient-to-br", task.color)} />
                  <div><p className="font-semibold text-white">{task.title}</p><p className="text-sm text-slate-400">{session.start} · {session.mood}</p></div>
                </div>
                <span className="w-fit rounded-full bg-white/[0.07] px-3 py-1 text-sm text-slate-300">{session.mode}</span>
                <span className="text-sm text-slate-300">{session.date}</span>
                <span className="font-semibold text-white">{prettyMinutes(session.duration)}</span>
                <span className="font-semibold text-cyan-100">{session.focus}%</span>
                <button onClick={() => removeSession(session.id)} className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

function SettingsPanel() {
  const [theme, setTheme] = useState("Nebula Dark");
  const settings = [
    { icon: Palette, title: "Appearance", desc: "Nebula Dark, Glass Aurora, Frosted Light, and AMOLED modes.", control: theme },
    { icon: AlarmClock, title: "Timer behavior", desc: "Auto-start breaks, long break cadence, warning sounds, and session recovery.", control: "Smart Pomodoro" },
    { icon: Wand2, title: "AI study tuning", desc: "Detects fatigue, suggests task order, and protects peak focus windows.", control: "Enabled" },
    { icon: Bell, title: "Notifications", desc: "Gentle reminders, streak nudges, deadline alerts, and daily summaries.", control: "Quiet" },
    { icon: Moon, title: "Sleep-aware planning", desc: "Avoids late heavy tasks and flags sessions that may reduce recovery.", control: "On" },
  ];
  return (
    <div className="p-4 md:p-8">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold tracking-tight text-white">Settings</h3>
        <p className="mt-1 text-slate-400">Personalize FocusFlow into a calm, beautiful, high-performance study cockpit.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6" intense>
          <div className="rounded-[1.8rem] bg-gradient-to-br from-violet-500/25 via-fuchsia-500/15 to-cyan-400/20 p-6">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15"><Sparkles className="h-6 w-6 text-white" /></div>
            <h4 className="mt-8 text-3xl font-semibold tracking-tight text-white">Nebula Dark</h4>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">High-contrast glass interface with luminous gradients and soft celestial depth.</p>
            <div className="mt-6 flex gap-2">
              {['#8b5cf6', '#22d3ee', '#f472b6', '#34d399'].map((c) => <span key={c} className="h-9 w-9 rounded-full border border-white/20" style={{ background: c }} />)}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {['Nebula Dark', 'Aurora Glass', 'Frost Light', 'AMOLED'].map((item) => (
              <button key={item} onClick={() => setTheme(item)} className={cn("rounded-2xl border px-4 py-3 text-sm font-semibold transition", theme === item ? "border-white bg-white text-slate-950" : "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10")}>{item}</button>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <GlassCard key={item.title} className="p-5" intense>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.07]"><Icon className="h-5 w-5 text-cyan-100" /></div>
                    <div><h4 className="font-semibold text-white">{item.title}</h4><p className="mt-1 text-sm leading-5 text-slate-400">{item.desc}</p></div>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-white/[0.07] px-4 py-2 text-sm font-semibold text-white md:block">{item.control}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FocusFlow() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [range, setRange] = useState("Today");
  const [tasks] = useState(taskSeed);
  const [sessions, setSessions] = useState(sessionSeed);

  const visibleSessions = useMemo(() => {
    if (range === "All Time") return sessions;
    if (range === "Today") return sessions.filter((s) => s.date === "Today");
    if (range === "Week") return sessions.filter((s) => ["Today", "Yesterday", "This Week"].includes(s.date));
    return sessions.filter((s) => ["Today", "Yesterday", "This Week", "This Month"].includes(s.date));
  }, [range, sessions]);

  function addSession(data) {
    setSessions((prev) => [
      { id: Date.now(), date: "Today", start: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), ...data },
      ...prev,
    ]);
  }

  function removeSession(id) {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  }

  const page = {
    dashboard: <Dashboard tasks={tasks} addSession={addSession} />,
    analytics: <Analytics tasks={tasks} sessions={visibleSessions} />,
    tasks: <Tasks tasks={tasks} />,
    sessions: <Sessions tasks={tasks} sessions={visibleSessions} addSession={addSession} removeSession={removeSession} />,
    settings: <SettingsPanel />,
  }[activeTab];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050713] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute right-[-10%] top-[18%] h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-[-18%] left-[30%] h-[620px] w-[620px] rounded-full bg-fuchsia-500/15 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),transparent_32%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <TopBar range={range} setRange={setRange} />
          <AnimatePresence mode="wait">
            <motion.div key={`${activeTab}-${range}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}>
              {page}
            </motion.div>
          </AnimatePresence>
        </main>
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
