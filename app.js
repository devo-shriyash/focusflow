const state = {
  tasks: JSON.parse(localStorage.getItem('ff_tasks') || '[]'),
  sessions: JSON.parse(localStorage.getItem('ff_sessions') || '[]'),
  settings: JSON.parse(localStorage.getItem('ff_settings') || '{}'),
  timer: { running: false, mode: 'pomodoro', remaining: 1500, duration: 1500, linkedTaskId: null, interval: null }
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function save() {
  localStorage.setItem('ff_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('ff_sessions', JSON.stringify(state.sessions));
  localStorage.setItem('ff_settings', JSON.stringify(state.settings));
}

function switchSection(id) {
  $$('.section').forEach(s => s.classList.toggle('active', s.id === id));
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.section === id));
}

$$('.nav-item').forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.section)));

function fmt(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateRing() {
  const c = $('.ring-progress');
  const r = 96;
  const len = 2 * Math.PI * r;
  c.style.strokeDasharray = `${len}`;
  const p = 1 - state.timer.remaining / state.timer.duration;
  c.style.strokeDashoffset = `${len * (1 - p)}`;
}

function renderTaskSelects() {
  const opts = state.tasks.map(t => `<option value="${t.id}">${t.title}</option>`).join('');
  $('#linkedTaskSelect').innerHTML = opts || '<option value="">No tasks yet</option>';
  $('#sessionTaskSelect').innerHTML = opts || '<option value="">No tasks yet</option>';
  if (!state.timer.linkedTaskId && state.tasks[0]) state.timer.linkedTaskId = state.tasks[0].id;
  $('#linkedTaskSelect').value = state.timer.linkedTaskId || '';
}

function renderTasks() {
  const list = $('#taskList');
  list.innerHTML = state.tasks.map(t => `<article class="task-card"><strong>${t.title}</strong><p>${t.description || ''}</p><p class="meta">${t.priority} • ${t.estimate}m • ${t.done ? 'Done' : 'Open'}</p><button data-id="${t.id}" class="btn">${t.done ? 'Reopen':'Mark Done'}</button></article>`).join('') || '<p class="meta">No tasks yet.</p>';
  list.querySelectorAll('button').forEach(btn => btn.onclick = () => {
    const task = state.tasks.find(t => t.id === btn.dataset.id);
    task.done = !task.done; save(); renderAll();
  });
}

function renderSessions() {
  const list = $('#sessionList');
  list.innerHTML = state.sessions.map(s => {
    const task = state.tasks.find(t => t.id === s.taskId);
    return `<article class="session-card"><strong>${s.minutes} min</strong> <span class="meta">${s.date}</span><p>${task ? task.title : 'Unlinked task'}</p><button class="btn ghost" data-id="${s.id}">Delete</button></article>`;
  }).join('') || '<p class="meta">No sessions logged.</p>';
  list.querySelectorAll('button').forEach(btn => btn.onclick = () => {
    state.sessions = state.sessions.filter(s => s.id !== btn.dataset.id);
    save(); renderAll();
  });
}

function renderAnalytics() {
  const total = state.sessions.reduce((a, b) => a + b.minutes, 0);
  $('#aTotalTime').textContent = `${(total / 60).toFixed(1)}h`;
  $('#aSessions').textContent = state.sessions.length;
  $('#aCompleted').textContent = state.tasks.filter(t => t.done).length;
  $('#aAverage').textContent = `${state.sessions.length ? Math.round(total / state.sessions.length) : 0}m`;

  const byTask = {};
  state.sessions.forEach(s => byTask[s.taskId] = (byTask[s.taskId] || 0) + s.minutes);
  $('#topTasks').innerHTML = Object.entries(byTask)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([id, minutes]) => `<li>${(state.tasks.find(t => t.id === id) || { title: 'Unknown' }).title} — ${minutes}m</li>`).join('') || '<li>No data yet.</li>';

  const canvas = $('#focusChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0,10);
    return { key, minutes: state.sessions.filter(s => s.date === key).reduce((a,b)=>a+b.minutes,0) };
  });
  const max = Math.max(...days.map(d => d.minutes), 60);
  const w = canvas.width / days.length;
  ctx.strokeStyle = '#4de7ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  days.forEach((d,i) => {
    const x = i * w + w / 2;
    const y = 230 - (d.minutes / max) * 190;
    i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    ctx.fillStyle = '#adb2d6';
    ctx.fillText(d.key.slice(5), x - 13, 250);
  });
  ctx.stroke();
}

function applySettings() {
  if (state.settings.glow === false) document.body.classList.add('no-glow');
  else document.body.classList.remove('no-glow');
  const palette = {
    violet: ['#9b7bff', '#4de7ff'],
    ocean: ['#00a7ff', '#41ffd9'],
    sunset: ['#ff6b8a', '#ffb36b']
  }[state.settings.accent || 'violet'];
  document.documentElement.style.setProperty('--accent', palette[0]);
  document.documentElement.style.setProperty('--accent-2', palette[1]);
  $('#glowToggle').checked = state.settings.glow !== false;
  $('#accentSelect').value = state.settings.accent || 'violet';
  $('#pomodoroLength').value = state.settings.pomodoroLength || 25;
}

function renderTimer() {
  $('#timerDisplay').textContent = fmt(state.timer.remaining);
  updateRing();
}

function startTimer() {
  if (state.timer.running) return;
  state.timer.running = true;
  state.timer.interval = setInterval(() => {
    state.timer.remaining--;
    renderTimer();
    if (state.timer.remaining <= 0) {
      clearInterval(state.timer.interval);
      state.timer.running = false;
      if (state.timer.linkedTaskId) {
        state.sessions.unshift({ id: crypto.randomUUID(), taskId: state.timer.linkedTaskId, minutes: Math.round(state.timer.duration / 60), date: new Date().toISOString().slice(0,10) });
        save(); renderAll();
      }
    }
  }, 1000);
}
function pauseTimer(){ if(state.timer.interval) clearInterval(state.timer.interval); state.timer.running=false; }
function resetTimer(){
  pauseTimer();
  state.timer.duration = state.timer.mode === 'pomodoro' ? Number(state.settings.pomodoroLength || 25) * 60 : 60 * 60;
  state.timer.remaining = state.timer.duration;
  renderTimer();
}

function renderAll(){ renderTaskSelects(); renderTasks(); renderSessions(); renderAnalytics(); renderTimer(); applySettings(); save(); }

$('#taskForm').onsubmit = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  state.tasks.unshift({
    id: crypto.randomUUID(),
    title: fd.get('title'),
    description: fd.get('description'),
    priority: fd.get('priority'),
    estimate: Number(fd.get('estimate')), done: false
  });
  e.target.reset(); renderAll();
};
$('#sessionForm').onsubmit = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  state.sessions.unshift({ id: crypto.randomUUID(), taskId: $('#sessionTaskSelect').value, minutes: Number(fd.get('minutes')), date: fd.get('date') });
  renderAll();
};

$('#linkedTaskSelect').onchange = (e) => state.timer.linkedTaskId = e.target.value;
$('#modeToggle').onclick = (e) => {
  if (!e.target.matches('.mode')) return;
  $$('.mode').forEach(m => m.classList.toggle('active', m === e.target));
  state.timer.mode = e.target.dataset.mode;
  resetTimer();
};
$('#startBtn').onclick = startTimer;
$('#pauseBtn').onclick = pauseTimer;
$('#resetBtn').onclick = resetTimer;
$('#exportBtn').onclick = () => {
  const data = JSON.stringify({ tasks: state.tasks, sessions: state.sessions }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `focusflow-export-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
};
$('#glowToggle').onchange = (e) => { state.settings.glow = e.target.checked; renderAll(); };
$('#accentSelect').onchange = (e) => { state.settings.accent = e.target.value; renderAll(); };
$('#pomodoroLength').onchange = (e) => { state.settings.pomodoroLength = Number(e.target.value); save(); };

if (state.tasks.length === 0) {
  state.tasks = [
    { id: crypto.randomUUID(), title: 'Deep Work Sprint', description: 'Finish chapter summary and flashcards', priority: 'High', estimate: 50, done: false },
    { id: crypto.randomUUID(), title: 'Review Notes', description: 'Refine tough concepts', priority: 'Medium', estimate: 30, done: false }
  ];
}
resetTimer();
renderAll();
