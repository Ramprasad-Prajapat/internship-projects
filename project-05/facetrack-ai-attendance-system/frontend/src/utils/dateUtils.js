// FaceTrack AI — Date/time helpers (frontend-only mode).

export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function daysAgoISO(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function dateKey(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

// "2026-06-19" -> "19 Jun 2026"
export function prettyDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(date);
}

export function nowHHMM() {
  return formatTime(new Date());
}

export function weekdayShort(iso) {
  const d = new Date(iso + 'T00:00:00');
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
}

export function monthLabel(iso = todayISO()) {
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(d);
}

// 95 -> "1h 35m"
export function formatMinutes(mins) {
  if (!mins || mins <= 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h}h` : null, m ? `${m}m` : null].filter(Boolean).join(' ');
}

export function currentMonthKey() {
  return todayISO().slice(0, 7);
}
