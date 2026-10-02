/* ==========================================================================
   Núcleo: estado, persistencia, router, eventos, modales, toasts, gráficos
   ========================================================================== */
const STORE_KEY = 'aulora-proto-v3';
let S = load() || seedState();
const UI = { modal: null, menu: null, navOpen: false, tmp: {} };

function load() {
  try { const raw = localStorage.getItem(STORE_KEY); if (!raw) return null; const s = JSON.parse(raw); if (s.v !== 3) return null; _id = 5000 + Math.floor(Math.random() * 1000); return s; } catch (e) { return null; }
}
let _saveT;
function save() { clearTimeout(_saveT); _saveT = setTimeout(() => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* almacenamiento no disponible */ } }, 120); }
function resetDemo() { try { localStorage.removeItem(STORE_KEY); } catch (e) {} S = seedState(); S.route = 'admin/home'; UI.tmp = {}; closeModal(); render(); toast('Datos de demostración restablecidos'); }

/* ---------- Utilidades ---------- */
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const fmt = n => n.toLocaleString('es-CO');
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DOW = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const TODAY = new Date(2026, 9, 2);
function pdate(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }
function longDate(iso) { const d = pdate(iso); return `${DOW[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`; }
function daysUntil(iso) { return Math.round((pdate(iso) - TODAY) / 86400000); }
function when(iso) { const n = daysUntil(iso); return n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : n < 0 ? 'Finalizado' : `En ${n} días`; }
function datebox(iso) { const d = pdate(iso); return `<div class="datebox"><span>${MON[d.getMonth()]}</span><b>${d.getDate()}</b></div>`; }
const course = id => S.courses.find(c => c.id === id);
const student = id => S.students.find(s => s.id === id);
const lessonCount = c => c.modules.reduce((n, m) => n + m.lessons.length, 0);
const courseMinutes = c => c.modules.reduce((n, m) => n + m.lessons.reduce((k, l) => k + (l.dur || 0), 0), 0);
function findLesson(c, lid) { for (const m of c.modules) { const l = m.lessons.find(x => x.id === lid); if (l) return { m, l }; } return null; }
const STATUS = { published: ['ok', 'Publicado'], draft: ['warn', 'Borrador'], archived: ['plain', 'Archivado'] };
const statusBadge = s => `<span class="badge ${STATUS[s][0]}">${STATUS[s][1]}</span>`;
const SSTATUS = { active: ['ok', 'Activo'], invited: ['info', 'Invitado'], inactive: ['plain', 'Inactivo'] };
const sBadge = s => `<span class="badge ${SSTATUS[s][0]}">${SSTATUS[s][1]}</span>`;
const bar = (p, cls = '') => `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></div>`;
function brandVars(u) {
  return `--brand:${u.primary};--brand-ink:${inkFor(u.primary)};--brand-accent:${u.accent};--accent-ink:${inkFor(u.accent)};`;
}

/* ---------- Router ---------- */
let _lastRoute = null;
function go(route, opts = {}) {
  closeMenus();
  UI.navOpen = false;
  S.route = route;
  save();
  render();
  if (!opts.keepScroll) window.scrollTo(0, 0);
  const token = route.replace(/\//g, '.');
  try { if (location.hash.slice(1) !== token) history.replaceState(null, '', '#' + token); } catch (e) {}
}
function render() {
  const root = document.getElementById('app');
  const parts = S.route.split('/');
  let html;
  try { html = VIEW(parts); } catch (err) { console.error(err); html = `<div class="page"><div class="alert warn">${icon('alert')}<div>No se pudo mostrar esta pantalla. <button class="link" data-go="admin/home">Volver al inicio</button></div></div></div>`; }
  root.innerHTML = html;
  document.body.classList.toggle('lift-fab', /^(student\/course|onboarding\/[1-4])/.test(S.route));
  document.title = titleFor(parts);
  AFTER.forEach(fn => fn()); AFTER.length = 0;
  _lastRoute = S.route;
  renderModal();
  if (typeof scalePreviews === 'function') scalePreviews();
}
const AFTER = [];
function after(fn) { AFTER.push(fn); }
function titleFor(p) {
  if (p[0] === 'student') return `${S.uni.name}`;
  return 'Aulora · ' + (S.uni.name || 'Universidad digital');
}

/* ---------- Regiones (re-render parcial) ---------- */
const REG = {};
function refresh(...names) {
  names.forEach(n => $$(`[data-region="${n}"]`).forEach(el => { el.innerHTML = REG[n](el); }));
  AFTER.forEach(fn => fn()); AFTER.length = 0;
  if (typeof scalePreviews === 'function') scalePreviews();
}
const region = (name, tag = 'div', attrs = '') => `<${tag} data-region="${name}" ${attrs}>${REG[name]()}</${tag}>`;

/* ---------- Modales ---------- */
function openModal(fn, cls = '') { UI.modal = { fn, cls }; renderModal(); }
function closeModal() { UI.modal = null; renderModal(); }
function renderModal() {
  const root = document.getElementById('modal-root');
  if (!UI.modal) { root.innerHTML = ''; return; }
  const drawer = UI.modal.cls.includes('drawer');
  root.innerHTML = `<div class="overlay ${drawer ? 'drawer' : ''}" data-act="overlayClose"><div class="modal ${UI.modal.cls}" role="dialog" aria-modal="true">${UI.modal.fn()}</div></div>`;
  AFTER.forEach(fn => fn()); AFTER.length = 0;
  const f = root.querySelector('[autofocus]'); if (f) f.focus();
}
const modalHead = (title, sub = '') => `<div class="modal-h"><div class="stack s4"><h2>${title}</h2>${sub ? `<p class="muted">${sub}</p>` : ''}</div><button class="btn ghost icon sm" data-act="closeModal" aria-label="Cerrar">${icon('x')}</button></div>`;

/* ---------- Menús desplegables ---------- */
function closeMenus() { if (UI.menu) { UI.menu = null; $$('.menu[data-menu]').forEach(m => m.remove()); } }
function toggleMenu(btn, items) {
  const id = btn.dataset.menuId || (btn.dataset.menuId = uid('mn'));
  const open = UI.menu === id; closeMenus(); if (open) return;
  UI.menu = id;
  const wrap = btn.closest('.menu-wrap');
  const m = document.createElement('div'); m.className = 'menu' + (btn.dataset.menuLeft ? ' left' : ''); m.dataset.menu = id;
  m.innerHTML = items.map(it => it === '-' ? '<div class="menu-sep"></div>' : `<button class="${it.danger ? 'danger' : ''}" ${it.go ? `data-go="${it.go}"` : ''} ${it.act ? `data-act="${it.act}"` : ''} ${it.arg !== undefined ? `data-arg="${esc(it.arg)}"` : ''}>${icon(it.icon)}${it.label}</button>`).join('');
  wrap.appendChild(m);
}

/* ---------- Toasts ---------- */
function toast(msg, kind = '') {
  const box = document.getElementById('toasts');
  const t = document.createElement('div'); t.className = 'toast ' + kind; t.setAttribute('role', 'status');
  t.innerHTML = icon(kind === 'ai' ? 'sparkles' : kind === 'warn' ? 'info' : 'checkCircle') + `<span>${msg}</span>`;
  box.appendChild(t); setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 3200); setTimeout(() => t.remove(), 3600);
}

/* ---------- Gráficos SVG ---------- */
function areaChart(vals, labels, { w = 640, h = 200, color = 'var(--sys)', max } = {}) {
  const pad = { l: 34, r: 12, t: 12, b: 26 };
  const top = max || Math.ceil(Math.max(...vals) / 50) * 50;
  const X = i => pad.l + i * (w - pad.l - pad.r) / (vals.length - 1);
  const Y = v => pad.t + (1 - v / top) * (h - pad.t - pad.b);
  const pts = vals.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  const ticks = [0, top / 2, top];
  const gid = uid('g');
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Estudiantes activos por semana">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${color};stop-opacity:.22"/><stop offset="1" style="stop-color:${color};stop-opacity:0"/></linearGradient></defs>
    ${ticks.map(t => `<line x1="${pad.l}" x2="${w - pad.r}" y1="${Y(t)}" y2="${Y(t)}" style="stroke:var(--line)" stroke-dasharray="${t ? '3 4' : ''}"/><text x="${pad.l - 8}" y="${Y(t) + 4}" text-anchor="end">${t}</text>`).join('')}
    <path d="M${pts.join(' L')} L${X(vals.length - 1)},${Y(0)} L${X(0)},${Y(0)}Z" fill="url(#${gid})"/>
    <path d="M${pts.join(' L')}" fill="none" style="stroke:${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
    ${labels.map((l, i) => l ? `<text x="${X(i)}" y="${h - 6}" text-anchor="middle">${l}</text>` : '').join('')}
    <circle cx="${X(vals.length - 1)}" cy="${Y(vals[vals.length - 1])}" r="5" style="fill:var(--surface);stroke:${color}" stroke-width="2.5"/>
  </svg>`;
}
function ring(p, size = 64, sw = 7, color = 'var(--sys)', label) {
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:var(--surface-3)" stroke-width="${sw}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}"/></svg><b style="font-size:${Math.round(size / ((label ?? p + '%').length > 3 ? 5.2 : 4.2))}px">${label ?? p + '%'}</b></div>`;
}
function hbars(rows, color = 'var(--sys)') {
  const max = Math.max(...rows.map(r => r[1]));
  return `<div class="stack s8">${rows.map(([l, v, extra]) => `<div class="stack s4"><div class="row between small"><span class="muted">${l}</span><span class="num" style="font-weight:600">${extra ?? v}</span></div><div class="bar"><i style="width:${v / max * 100}%;background:${color}"></i></div></div>`).join('')}</div>`;
}

/* ---------- Eventos globales ---------- */
const ACT = {}, IN = {}, CH = {};
document.addEventListener('click', e => {
  const tEl = e.target;
  if (!tEl.closest('.menu-wrap')) closeMenus();
  const goEl = tEl.closest('[data-go]');
  const actEl = tEl.closest('[data-act]');
  // la acción más interna gana
  if (actEl && (!goEl || goEl.contains(actEl))) {
    const name = actEl.dataset.act;
    if (name === 'overlayClose') { if (tEl === actEl) closeModal(); return; }
    if (name === 'noop') return;
    if (ACT[name]) { e.preventDefault(); ACT[name](actEl, e); }
    return;
  }
  if (goEl) { e.preventDefault(); if (UI.modal && !goEl.dataset.keepModal) UI.modal = null; go(goEl.dataset.go); }
});
document.addEventListener('input', e => { const el = e.target.closest('[data-in]'); if (el && IN[el.dataset.in]) IN[el.dataset.in](el, e); });
document.addEventListener('change', e => { const el = e.target.closest('[data-ch]'); if (el && CH[el.dataset.ch]) CH[el.dataset.ch](el, e); });
document.addEventListener('submit', e => { e.preventDefault(); const f = e.target; if (f.dataset.submit && ACT[f.dataset.submit]) ACT[f.dataset.submit](f, e); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (UI.modal) closeModal(); closeMenus(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-go]:not(button):not(a), [data-act]:not(button):not(a):not(form):not(.overlay)')) { e.preventDefault(); e.target.click(); }
});

ACT.closeModal = () => closeModal();
ACT.toggleNav = () => { UI.navOpen = !UI.navOpen; $('.app')?.classList.toggle('nav-open', UI.navOpen); };
ACT.toast = el => toast(el.dataset.arg);
ACT.theme = () => {
  const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark'; render();
};
ACT.reset = () => resetDemo();

/* Lector de archivos (logo, banner, CSV…) */
function pickFile(accept, cb) {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept;
  inp.onchange = () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => cb(f, r.result); if (/image/.test(f.type)) r.readAsDataURL(f); else r.readAsText(f.slice(0, 200000)); };
  inp.click();
}
function dropzoneBind(sel, onFile) {
  after(() => $$(sel).forEach(dz => {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('over'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) onFile(f, dz); });
  }));
}
