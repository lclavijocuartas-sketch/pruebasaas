/* ==========================================================================
   Vista Administrador: shell, dashboard, cursos, estudiantes, eventos,
   certificados, analítica, plan y facturación, configuración
   ========================================================================== */

const NAV = [
  ['home', 'Inicio', 'home'], ['courses', 'Cursos', 'book'], ['students', 'Estudiantes', 'users'], ['events', 'Eventos', 'calendar'],
  ['certificates', 'Certificados', 'award'], ['ai', 'AI Course Studio', 'sparkles', 'IA'], ['university', 'Mi Universidad', 'palette'],
  ['analytics', 'Analítica', 'chart'], ['billing', 'Plan y facturación', 'card'], ['settings', 'Configuración', 'sliders'],
];

function adminShell(active, content, { bare = false } = {}) {
  const u = S.uni, p = S.plan;
  const pct = Math.round(p.used / p.seats * 100);
  return `<div class="app ${UI.navOpen ? 'nav-open' : ''}">
    <aside class="side" aria-label="Navegación principal">
      <div class="uni">${logoMark(u, 36)}<div class="grow"><div class="uni-name">${esc(u.name)}</div><div class="uni-plan">Plan ${p.name} · ${esc(u.subdomain)}.aulora.app</div></div></div>
      <nav class="nav">${NAV.map(([k, l, ic, tag]) => `<a href="#admin.${k}" data-go="admin/${k}" class="${active === k ? 'on' : ''}" ${active === k ? 'aria-current="page"' : ''}>${icon(ic)}<span>${l}</span>${tag ? `<span class="tag">${tag}</span>` : ''}</a>`).join('')}</nav>
      <div class="capacity">
        <div class="row between xs"><span class="muted" style="font-weight:600">Capacidad</span><span class="num" style="font-weight:700">${p.used} / ${p.seats}</span></div>
        ${bar(pct)}
        <button class="link xs" data-go="admin/billing">${p.seats - p.used} cupos disponibles ${icon('arrowR')}</button>
      </div>
      <div style="margin-top:auto" class="stack s4">
        <div class="nav-sep"></div>
        <nav class="nav">
          <button data-act="profileMenu">${avatar(S.admin.name, 'sm')}<span class="grow" style="overflow:hidden;text-overflow:ellipsis">${esc(S.admin.name)}</span></button>
          <button data-act="help">${icon('help')}<span>Ayuda</span></button>
        </nav>
        <button class="student-switch" data-act="viewAsStudent"><span class="sw-ico">${icon('eye')}</span><span class="grow">Ver como estudiante<br><span class="xs" style="opacity:.7;font-weight:500">Experiencia de ${esc(u.name)}</span></span>${icon('arrowR')}</button>
        <div class="powered">${icon('zap')} Funciona con Aulora</div>
      </div>
    </aside>
    <div class="main">
      ${bare ? '' : topbar()}
      ${content}
    </div>
  </div>`;
}
function topbar() {
  return `<header class="topbar">
    <button class="btn ghost icon burger" data-act="toggleNav" aria-label="Abrir menú">${icon('menu')}</button>
    <div class="search input-icon">${icon('search')}<input class="input" id="global-search" placeholder="Buscar cursos, estudiantes, eventos…" aria-label="Buscar"></div>
    <div class="grow"></div>
    <button class="credits-chip" data-go="admin/ai" data-tip="Créditos de IA disponibles este mes">${icon('sparkles')}<b class="num">${fmt(S.plan.credits)}</b><span>créditos IA</span></button>
    <button class="btn ghost icon" data-act="theme" aria-label="Cambiar tema">${icon(isDark() ? 'sun' : 'moon')}</button>
    <div class="menu-wrap"><button class="btn ghost icon" data-act="notifMenu" aria-label="Notificaciones" style="position:relative">${icon('bell')}<span style="position:absolute;top:8px;right:9px;width:7px;height:7px;border-radius:50%;background:var(--bad)"></span></button></div>
    <button class="btn sm" data-act="viewAsStudent">${icon('eye')}<span>Ver como estudiante</span></button>
  </header>`;
}
function isDark() { const r = document.documentElement; return r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }

ACT.notifMenu = btn => toggleMenu(btn, [
  { icon: 'upload', label: '12 estudiantes importados', go: 'admin/students' },
  { icon: 'award', label: '3 certificados emitidos hoy', go: 'admin/certificates' },
  { icon: 'calendar', label: 'Kickoff Onboarding en 4 días', go: 'admin/events' },
  { icon: 'alert', label: 'Capacidad al 64%', go: 'admin/billing' },
]);
ACT.profileMenu = btn => { btn.closest('.nav').classList.add('menu-wrap'); btn.dataset.menuLeft = 1; toggleMenu(btn, [
  { icon: 'user', label: 'Mi perfil', act: 'toast', arg: 'Perfil de Laura Méndez (vista conceptual)' },
  { icon: 'sliders', label: 'Configuración', go: 'admin/settings' },
  { icon: 'map', label: 'Mapa del prototipo', act: 'protoMap' }, '-',
  { icon: 'logout', label: 'Cerrar sesión', go: 'login' },
]); const m = btn.parentElement.querySelector('.menu'); if (m) { m.style.top = 'auto'; m.style.bottom = 'calc(100% + 6px)'; } };
ACT.help = () => openModal(() => `${modalHead('Centro de ayuda', 'Guías rápidas para poner en marcha tu universidad.')}
  <div class="modal-b stack">
    ${[['rocket', 'Publicar tu primer curso', 'Crea un curso, añade módulos y publícalo en minutos.', 'admin/courses'], ['users', 'Importar estudiantes desde Excel', 'Usa nuestra plantilla CSV y asigna cursos en un paso.', 'admin/students'], ['sparkles', 'Crear contenido con IA', 'Convierte un PDF en lectura, presentación o quiz.', 'admin/ai'], ['palette', 'Personalizar tu marca', 'Logo, colores y portada aplicados a toda la experiencia.', 'admin/university']]
      .map(([ic, t, d, r]) => `<button class="method" data-go="${r}"><span class="m-ico">${icon(ic)}</span><span><b>${t}</b><span>${d}</span></span></button>`).join('')}
    <div class="alert">${icon('message')}<div>¿Necesitas a una persona? Escríbenos a <span class="mono">soporte@aulora.app</span>. Respondemos en menos de 4 horas hábiles.</div></div>
  </div><div class="modal-f"><button class="btn" data-act="closeModal">Cerrar</button></div>`);
ACT.viewAsStudent = () => { S.previewFrom = S.route.startsWith('student') ? 'admin/home' : S.route; go('student/home'); toast(`Estás viendo ${esc(S.uni.name)} como estudiante`); };

function pageHead(title, sub, actions = '', crumbs = '') {
  return `<div class="page-h"><div class="grow">${crumbs}<h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div><div class="row wrap">${actions}</div></div>`;
}
const crumbs = items => `<nav class="crumbs" aria-label="Ruta">${items.map(([l, r], i) => (r ? `<button data-go="${r}">${l}</button>` : `<span>${l}</span>`) + (i < items.length - 1 ? icon('chevR') : '')).join('')}</nav>`;

/* ==========================================================================
   DASHBOARD
   ========================================================================== */
function viewDashboard() {
  const p = S.plan, cs = S.courses;
  const active = cs.filter(c => c.status === 'published');
  const avg = Math.round(active.reduce((s, c) => s + c.progress, 0) / active.length);
  const compl = Math.round(active.reduce((s, c) => s + c.completion * c.students, 0) / active.reduce((s, c) => s + c.students, 0));
  const upcoming = S.events.filter(e => daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
  const pct = Math.round(p.used / p.seats * 100);
  const seats = Array.from({ length: p.seats }, (_, i) => `<i class="${i < p.active ? 'u' : i < p.used ? 'a' : ''}"></i>`).join('');
  const weeks = [168, 172, 181, 176, 190, 204, 199, 213, 221, 229, 238, p.active];
  const wl = ['jul', '', '', '', 'ago', '', '', '', 'sep', '', '', 'oct'];
  const d = TODAY;
  return adminShell('home', `<div class="page">
    ${pageHead(`Buenos días, ${esc(S.admin.name.split(' ')[0])}`, `Así va ${esc(S.uni.name)} hoy, ${DOW[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}.`,
      `<button class="btn" data-act="viewAsStudent">${icon('eye')}Ver como estudiante</button><button class="btn primary" data-act="newCourse">${icon('plus')}Crear curso</button>`)}

    <section class="card capacity-hero" aria-label="Capacidad contratada">
      <div class="ch-main">
        <div class="row between wrap"><span class="eyebrow">Capacidad contratada · Plan ${p.name}</span><span class="badge ${pct > 85 ? 'warn' : 'sys'}">${pct}% utilizado</span></div>
        <div class="row wrap" style="align-items:flex-end;gap:18px">
          <div class="cap-big num">${p.used}<span> / ${p.seats}</span></div>
          <div class="stack s4" style="padding-bottom:4px"><b>estudiantes matriculados</b><span class="muted small">${p.seats - p.used} cupos disponibles para nuevas matrículas</span></div>
        </div>
        <div class="seats" aria-hidden="true">${seats}</div>
        <div class="row between wrap">
          <div class="legend"><span><i style="background:var(--sys)"></i>Activos (${p.active})</span><span><i style="background:color-mix(in srgb, var(--sys) 45%, var(--surface-3))"></i>Invitados o inactivos (${p.used - p.active})</span><span><i style="background:var(--surface-3)"></i>Disponibles (${p.seats - p.used})</span></div>
          <button class="link small" data-act="expandSeats">Ampliar capacidad ${icon('arrowR')}</button>
        </div>
      </div>
      <div class="ch-side">
        <div class="row between"><span class="eyebrow">Estudiantes activos</span><span class="delta">${icon('trending')}+12%</span></div>
        <div class="row" style="gap:14px">${ring(Math.round(p.active / p.used * 100), 72, 8)}<div class="stack s4"><b class="num" style="font-size:22px;font-family:var(--f-display)">${p.active} de ${p.used}</b><span class="muted small">se conectaron en los últimos 30 días</span></div></div>
        <hr class="sep">
        <div class="alert" style="background:var(--surface)">${icon('info')}<div class="small">Al ritmo actual de matrículas (≈ 22 por mes) alcanzarás tu capacidad en <b>8 meses</b>.</div></div>
      </div>
    </section>

    <section class="kpis" aria-label="Indicadores">
      ${kpi('book', 'Cursos', cs.filter(c => c.status !== 'archived').length, `<span>${active.length} activos · ${cs.filter(c => c.status === 'draft').length} borrador</span>`, 'admin/courses')}
      ${kpi('calendar', 'Eventos próximos', upcoming.length, `<span>Siguiente: ${when(upcoming[0].date).toLowerCase()}</span>`, 'admin/events')}
      ${kpi('award', 'Certificados emitidos', S.certs.issued, `<span class="delta">${icon('trending')}+18</span><span>este mes</span>`, 'admin/certificates')}
      ${kpi('trending', 'Progreso promedio', avg + '<small>%</small>', `<div class="grow">${bar(avg)}</div>`, 'admin/analytics')}
    </section>

    <section aria-label="Accesos rápidos" class="stack s8">
      <div class="quick">
        <button data-act="newCourse"><span class="q-ico">${icon('book')}</span><div><b>Crear curso</b><br><span>Desde cero o con material existente</span></div></button>
        <button data-act="addStudent"><span class="q-ico">${icon('userPlus')}</span><div><b>Añadir estudiantes</b><br><span>Manual o importando Excel / CSV</span></div></button>
        <button data-act="newEvent"><span class="q-ico">${icon('calendar')}</span><div><b>Crear evento</b><br><span>Sesión virtual o presencial</span></div></button>
        <button data-go="admin/ai"><span class="q-ico ai">${icon('sparkles')}</span><div><b>Crear contenido con IA</b><br><span>Lecturas, presentaciones y quizzes</span></div></button>
      </div>
    </section>

    ${aiPromo()}

    <div class="dash-grid">
      <div class="stack s16">
        <section class="card">
          <div class="card-h"><div><h3>Estudiantes activos por semana</h3><p class="muted small">Últimas 12 semanas</p></div><div class="seg"><button class="on">Activos</button><button data-act="toast" data-arg="Vista de lecciones completadas (conceptual)">Lecciones</button></div></div>
          <div class="card-b">${areaChart(weeks, wl)}</div>
        </section>
        <section class="card">
          <div class="card-h"><h3>Rendimiento por curso</h3><button class="link small" data-go="admin/courses">Ver todos ${icon('arrowR')}</button></div>
          <div class="card-b table-wrap"><table class="t"><thead><tr><th>Curso</th><th>Estudiantes</th><th style="min-width:140px">Progreso promedio</th><th>Finalización</th></tr></thead><tbody>
            ${active.slice(0, 5).map(c => `<tr class="click" data-go="admin/course/${c.id}"><td><div class="row"><span class="thumb" style="background-image:${coverArt(c)};width:44px;height:30px"></span><b style="font-weight:600">${esc(c.title)}</b></div></td><td class="num">${c.students}</td><td><div class="row">${bar(c.progress).replace('class="bar ', 'class="bar grow ')}<span class="num small" style="width:34px">${c.progress}%</span></div></td><td class="num">${c.completion}%</td></tr>`).join('')}
          </tbody></table></div>
        </section>
      </div>
      <div class="stack s16">
        <section class="card">
          <div class="card-h"><h3>Finalización de cursos</h3><span class="badge sys">${compl}%</span></div>
          <div class="card-b row" style="gap:18px">${ring(compl, 96, 10, 'var(--sys)')}<div class="stack s8 small grow">
            <div class="row between"><span class="muted">Completaron</span><b class="num">${Math.round(p.used * compl / 100)}</b></div>
            <div class="row between"><span class="muted">En progreso</span><b class="num">${Math.round(p.used * .48)}</b></div>
            <div class="row between"><span class="muted">Sin iniciar</span><b class="num">${p.used - Math.round(p.used * compl / 100) - Math.round(p.used * .48)}</b></div>
          </div></div>
        </section>
        <section class="card">
          <div class="card-h"><h3>Próximos eventos</h3><button class="link small" data-go="admin/events">Calendario ${icon('arrowR')}</button></div>
          <div class="card-b" style="padding-top:6px">${upcoming.slice(0, 3).map(e => `<div class="ev-mini">${datebox(e.date)}<div class="grow"><b style="font-weight:600;display:block" class="small">${esc(e.title)}</b><span class="xs subtle">${e.time} · ${e.mode === 'virtual' ? 'Virtual' : 'Presencial'} · ${e.invited} invitados</span></div></div>`).join('')}</div>
        </section>
        <section class="card">
          <div class="card-h"><h3>Actividad reciente</h3></div>
          <div class="card-b activity" style="padding-top:4px">${S.activity.slice(0, 6).map(a => `<div class="a-item"><span class="a-ico">${icon(a.ico)}</span><div class="grow small"><div>${a.t}</div><div class="xs subtle">${a.when}</div></div></div>`).join('')}</div>
        </section>
      </div>
    </div>
  </div>`);
}
function kpi(ic, label, val, foot, go) {
  return `<button class="card kpi hover" style="text-align:left" data-go="${go}"><div class="k-top"><span>${label}</span><span class="k-ico">${icon(ic)}</span></div><div class="k-val num">${val}</div><div class="k-foot">${foot}</div></button>`;
}
function aiPromo(compact = false, text) {
  return `<section class="ai-promo ${compact ? 'compact' : ''}">
    <span class="spark">${icon('sparkles')}</span>
    <div class="grow"><h3>${text || '¿Todavía no tienes tus cursos listos? Créalos más rápido con IA.'}</h3><p>Sube un PDF, Word o presentación y obtén una lectura, una presentación o un quiz listos para editar. Tienes <b>${fmt(S.plan.credits)} créditos</b> disponibles.</p></div>
    <button class="btn ${compact ? 'sm' : ''}" data-go="admin/ai">${icon('wand')}Abrir AI Course Studio</button>
  </section>`;
}

/* ==========================================================================
   CURSOS
   ========================================================================== */
function viewCourses() {
  const f = UI.tmp.cf || 'all', q = (UI.tmp.cq || '').toLowerCase(), mode = UI.tmp.cview || 'grid';
  const counts = { all: S.courses.length, published: 0, draft: 0, archived: 0 };
  S.courses.forEach(c => counts[c.status]++);
  return adminShell('courses', `<div class="page">
    ${pageHead('Cursos', 'Crea, organiza y publica los programas de tu universidad. Todo lo que subas aquí está incluido en tu licencia.',
      `<button class="btn" data-go="admin/import">${icon('upload')}Añadir curso existente</button><button class="btn primary" data-act="newCourse">${icon('plus')}Crear curso</button>`)}
    <div class="stack s16">
      <div class="tabs" role="tablist">${[['all', 'Todos'], ['published', 'Publicados'], ['draft', 'Borradores'], ['archived', 'Archivados']].map(([k, l]) => `<button role="tab" class="${f === k ? 'on' : ''}" data-act="cfilter" data-arg="${k}">${l}<span class="count">${counts[k]}</span></button>`).join('')}</div>
      <div class="toolbar"><div class="input-icon grow" style="max-width:360px">${icon('search')}<input class="input" id="course-search" placeholder="Buscar curso" value="${esc(UI.tmp.cq || '')}" data-in="csearch"></div><div class="grow"></div>
        <div class="seg" role="group" aria-label="Vista"><button class="${mode === 'grid' ? 'on' : ''}" data-act="cview" data-arg="grid">${icon('grid')}Tarjetas</button><button class="${mode === 'list' ? 'on' : ''}" data-act="cview" data-arg="list">${icon('list')}Lista</button></div></div>
      ${region('courseList')}
    </div>
    <div class="grid2">
      ${aiPromo(true, 'Convierte tus documentos en cursos con IA')}
      <section class="card pad row wrap" style="gap:16px"><span class="m-ico" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--fg);color:var(--bg)">${icon('gem')}</span><div class="grow"><h3>¿Necesitas un curso hecho a la medida?</h3><p class="muted small">Nuestro equipo diseña, produce y entrega el curso completo con tu marca.</p></div><button class="btn dark sm" data-act="customCourse">Solicitar curso personalizado</button></section>
    </div>
  </div>`);
}
REG.courseList = () => {
  const f = UI.tmp.cf || 'all', q = (UI.tmp.cq || '').toLowerCase(), mode = UI.tmp.cview || 'grid';
  const list = S.courses.filter(c => (f === 'all' || c.status === f) && c.title.toLowerCase().includes(q));
  if (!list.length) return `<div class="card empty"><span class="empty-ico">${icon('book')}</span><h3>No hay cursos aquí todavía</h3><p class="small">Crea tu primer curso o cambia los filtros de búsqueda.</p><button class="btn primary sm" data-act="newCourse">${icon('plus')}Crear curso</button></div>`;
  if (mode === 'list') return `<div class="card table-wrap"><table class="t"><thead><tr><th>Curso</th><th>Estado</th><th>Estudiantes</th><th style="min-width:150px">Progreso promedio</th><th>Actualizado</th><th></th></tr></thead><tbody>
    ${list.map(c => `<tr class="click" data-go="admin/course/${c.id}"><td><div class="row"><span class="thumb" style="background-image:${coverArt(c)}"></span><div><b style="font-weight:600">${esc(c.title)}</b><div class="xs subtle">${c.modules.length} módulos · ${lessonCount(c)} lecciones</div></div></div></td><td>${statusBadge(c.status)}</td><td class="num">${c.students}</td><td><div class="row">${bar(c.progress).replace('class="bar ', 'class="bar grow ')}<span class="num small">${c.progress}%</span></div></td><td class="small muted">${c.updated}</td><td>${courseMenu(c)}</td></tr>`).join('')}
  </tbody></table></div>`;
  return `<div class="course-grid">${list.map(c => `<article class="card ccard hover" data-go="admin/course/${c.id}" tabindex="0">
    <div class="cover" style="background-image:${coverArt(c)}"><div class="cover-badge">${statusBadge(c.status)}</div></div>
    <div class="c-body">
      <div class="xs subtle" style="font-weight:600">${esc(c.category)}</div>
      <div class="c-title">${esc(c.title)}</div>
      <div class="c-meta"><span>${icon('users')}${c.students}</span><span>${icon('layers')}${lessonCount(c)} lecciones</span><span>${icon('clock')}${c.updated}</span></div>
      ${c.status === 'draft' ? `<div class="alert warn" style="padding:8px 10px">${icon('edit')}<span class="small">Sin publicar · los estudiantes aún no lo ven</span></div>` : `<div class="stack s4"><div class="row between xs"><span class="subtle">Progreso promedio</span><b class="num">${c.progress}%</b></div>${bar(c.progress)}</div>`}
      <div class="c-foot"><button class="btn sm" data-act="editCourse" data-arg="${c.id}">${icon('edit')}Editar</button>${courseMenu(c)}</div>
    </div></article>`).join('')}</div>`;
};
function courseMenu(c) { return `<div class="menu-wrap"><button class="btn ghost icon sm" data-act="courseMenu" data-arg="${c.id}" aria-label="Más acciones">${icon('more')}</button></div>`; }
ACT.courseMenu = btn => { const c = course(btn.dataset.arg); toggleMenu(btn, [
  { icon: 'eye', label: 'Ver detalle', go: `admin/course/${c.id}` },
  { icon: 'edit', label: 'Editar contenido', go: `admin/builder/${c.id}` },
  c.status === 'published' ? { icon: 'archive', label: 'Despublicar', act: 'setStatus', arg: c.id + ':draft' } : { icon: 'rocket', label: 'Publicar', act: 'setStatus', arg: c.id + ':published' },
  { icon: 'copy', label: 'Duplicar', act: 'dupCourse', arg: c.id },
  { icon: 'users', label: 'Ver estudiantes', act: 'courseTabGo', arg: c.id + ':students' },
  { icon: 'chart', label: 'Estadísticas', act: 'courseTabGo', arg: c.id + ':stats' }, '-',
  { icon: 'archive', label: 'Archivar', act: 'setStatus', arg: c.id + ':archived', danger: true },
]); };
ACT.cfilter = el => { UI.tmp.cf = el.dataset.arg; render(); };
ACT.cview = el => { UI.tmp.cview = el.dataset.arg; render(); };
IN.csearch = el => { UI.tmp.cq = el.value; refresh('courseList'); };
ACT.editCourse = el => go(`admin/builder/${el.dataset.arg}`);
ACT.courseTabGo = el => { const [id, t] = el.dataset.arg.split(':'); UI.tmp.ctab = t; go(`admin/course/${id}`); };
ACT.setStatus = el => {
  const [id, st] = el.dataset.arg.split(':'); const c = course(id);
  if (st === 'published' && !lessonCount(c)) { toast('Añade al menos una lección antes de publicar', 'warn'); return; }
  c.status = st; c.updated = 'Justo ahora'; save(); closeMenus(); render();
  toast(st === 'published' ? `“${esc(c.title)}” publicado` : st === 'archived' ? 'Curso archivado' : 'Curso despublicado');
};
ACT.dupCourse = el => {
  const c = course(el.dataset.arg); const copy = JSON.parse(JSON.stringify(c));
  copy.id = uid('c'); copy.title = c.title + ' (copia)'; copy.status = 'draft'; copy.students = 0; copy.progress = 0; copy.completion = 0; copy.updated = 'Justo ahora';
  copy.modules.forEach(m => { m.id = uid('m'); m.lessons.forEach(l => l.id = uid('l')); });
  S.courses.splice(S.courses.indexOf(c) + 1, 0, copy); save(); closeMenus(); render(); toast('Curso duplicado como borrador');
};

/* ---------- Crear curso (selector de método + formulario) ---------- */
ACT.newCourse = () => { UI.tmp.nc = { step: 'method', method: 'scratch', title: '', category: 'Liderazgo', desc: '', motif: 'orbit', hue: 262, cert: true }; openModal(newCourseModal, 'wide'); };
function newCourseModal() {
  const n = UI.tmp.nc;
  if (n.step === 'method') {
    const M = [
      ['scratch', 'plus', 'Crear desde cero', 'Empieza con un curso vacío y organízalo en módulos y lecciones.'],
      ['existing', 'link', 'Añadir curso existente', 'Vincula enlaces, videos o materiales que ya tienes publicados.'],
      ['lms', 'plug', 'Integrar desde otro LMS', 'Importa paquetes SCORM o exportaciones de Moodle, Canvas o Blackboard.'],
      ['upload', 'upload', 'Subir documentos y archivos', 'Videos, PDF, presentaciones o lecturas para armar el curso.'],
    ];
    return `${modalHead('¿Cómo quieres empezar?', 'Elige el punto de partida. Podrás combinar opciones después.')}
      <div class="modal-b"><div class="methods">
        ${M.map(([k, ic, t, d]) => `<button class="method ${n.method === k ? 'on' : ''}" data-act="ncMethod" data-arg="${k}"><span class="m-ico">${icon(ic)}</span><span><b>${t}</b><span>${d}</span></span></button>`).join('')}
        <button class="method ai span2 ${n.method === 'ai' ? 'on' : ''}" data-act="ncMethod" data-arg="ai"><span class="m-ico">${icon('sparkles')}</span><span class="grow"><b>Crear contenido rápido con IA <span class="badge ai plain" style="margin-left:6px">Servicio adicional</span></b><span>Sube un documento y la IA propone lecturas, presentaciones y quizzes editables. Disponibles: ${fmt(S.plan.credits)} créditos.</span></span></button>
      </div></div>
      <div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button><button class="btn primary" data-act="ncNext">Continuar ${icon('arrowR')}</button></div>`;
  }
  const cats = ['Liderazgo', 'Ventas', 'Habilidades digitales', 'Cultura', 'Habilidades blandas', 'Cumplimiento', 'Servicio', 'Gestión'];
  const motifs = [['orbit', 262], ['stack', 18], ['grid', 150], ['wave', 200], ['blocks', 330], ['orbit', 28]];
  return `${modalHead('Nuevo curso', 'Datos básicos. Todo se puede cambiar después.')}
    <div class="modal-b stack s16">
      <div class="field"><label for="nc-title">Nombre del curso</label><input class="input" id="nc-title" autofocus placeholder="Ej. Negociación para equipos comerciales" value="${esc(n.title)}" data-in="ncTitle"></div>
      <div class="grid2">
        <div class="field"><label for="nc-cat">Categoría</label><select class="select" id="nc-cat" data-ch="ncCat">${cats.map(c => `<option ${c === n.category ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div class="field"><label>Certificado al finalizar</label><label class="row" style="height:40px"><span class="switch"><input type="checkbox" id="nc-cert" ${n.cert ? 'checked' : ''} data-ch="ncCert"><span></span></span><span class="small muted">Emitir certificado automáticamente</span></label></div>
      </div>
      <div class="field"><label for="nc-desc">Descripción corta</label><textarea class="textarea" id="nc-desc" placeholder="¿Qué aprenderán los estudiantes?" data-in="ncDesc">${esc(n.desc)}</textarea></div>
      <div class="field"><span class="label">Portada</span><div class="banners" style="grid-template-columns:repeat(6,minmax(0,1fr))">${motifs.map(([m, h]) => `<button class="${n.motif === m && n.hue === h ? 'on' : ''}" style="background-image:${coverArt({ motif: m, hue: h })}" data-act="ncCover" data-arg="${m}:${h}" aria-label="Portada ${m}"></button>`).join('')}</div><span class="hint">También puedes subir tu propia imagen desde el editor.</span></div>
    </div>
    <div class="modal-f"><button class="btn ghost" data-act="ncBack">${icon('arrowL')}Atrás</button><div class="grow"></div><button class="btn primary" data-act="ncCreate">Crear y abrir el editor ${icon('arrowR')}</button></div>`;
}
ACT.ncMethod = el => { UI.tmp.nc.method = el.dataset.arg; renderModal(); };
ACT.ncBack = () => { UI.tmp.nc.step = 'method'; renderModal(); };
ACT.ncNext = () => {
  const m = UI.tmp.nc.method;
  if (m === 'scratch') { UI.tmp.nc.step = 'form'; renderModal(); return; }
  closeModal();
  if (m === 'ai') go('admin/ai');
  else { UI.tmp.imp = { tab: m === 'lms' ? 'lms' : m === 'upload' ? 'upload' : 'link', stage: 'start' }; go('admin/import'); }
};
IN.ncTitle = el => UI.tmp.nc.title = el.value;
IN.ncDesc = el => UI.tmp.nc.desc = el.value;
CH.ncCat = el => UI.tmp.nc.category = el.value;
CH.ncCert = el => UI.tmp.nc.cert = el.checked;
ACT.ncCover = el => { const [m, h] = el.dataset.arg.split(':'); UI.tmp.nc.motif = m; UI.tmp.nc.hue = +h; renderModal(); };
ACT.ncCreate = () => {
  const n = UI.tmp.nc; const title = n.title.trim() || 'Curso sin título';
  const c = { id: uid('c'), title, category: n.category, status: 'draft', students: 0, progress: 0, completion: 0, updated: 'Justo ahora', hue: n.hue, motif: n.motif, hours: 0, certificate: n.cert,
    description: n.desc || 'Describe aquí qué aprenderán tus estudiantes.', modules: [M('Módulo 1 · Introducción', [])] };
  S.courses.unshift(c); save(); closeModal(); UI.tmp.sel = null; go(`admin/builder/${c.id}`); toast('Curso creado como borrador');
};

/* ---------- Añadir curso existente / importar ---------- */
function viewImport() {
  const im = UI.tmp.imp || (UI.tmp.imp = { tab: 'lms', stage: 'start' });
  const tabs = [['link', 'link', 'Vincular contenido externo'], ['upload', 'upload', 'Subir archivos'], ['lms', 'plug', 'Importar desde otro LMS']];
  return adminShell('courses', `<div class="page" style="max-width:1040px">
    ${pageHead('Añadir curso existente', 'Trae a tu universidad los cursos que ya tienes. Conservamos la estructura cuando es técnicamente posible y puedes ajustar todo antes de publicar.', '', crumbs([['Cursos', 'admin/courses'], ['Añadir curso existente']]))}
    <div class="tabs">${tabs.map(([k, ic, l]) => `<button class="${im.tab === k ? 'on' : ''}" data-act="impTab" data-arg="${k}">${icon(ic)}${l}</button>`).join('')}</div>
    ${im.tab === 'link' ? importLink() : im.tab === 'upload' ? importUpload() : importLms()}
  </div>`);
}
ACT.impTab = el => { UI.tmp.imp = { tab: el.dataset.arg, stage: 'start' }; render(); };
function importLink() {
  const links = UI.tmp.links || (UI.tmp.links = [
    { url: 'https://www.youtube.com/watch?v=Rk3S8l0-pAg', kind: 'video', title: 'Negociación: el método Harvard' },
    { url: 'https://drive.google.com/file/d/1n0vA…/view', kind: 'pdf', title: 'Manual de negociación Grupo Nova.pdf' },
  ]);
  return `<div class="grid2" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start">
    <section class="card pad stack s16">
      <h3>Enlaces y materiales</h3>
      <form class="row" data-submit="addLink"><div class="input-icon grow">${icon('link')}<input class="input" id="link-url" placeholder="Pega un enlace de YouTube, Vimeo, Drive, OneDrive, Genially…"></div><button class="btn">Añadir</button></form>
      <div class="stack s8">${links.map((l, i) => `<div class="row" style="padding:10px;border:1px solid var(--line);border-radius:12px">${tico(l.kind)}<div class="grow"><b class="small" style="display:block">${esc(l.title)}</b><span class="xs subtle mono" style="word-break:break-all">${esc(l.url)}</span></div><button class="btn ghost icon sm" data-act="rmLink" data-arg="${i}" aria-label="Quitar">${icon('x')}</button></div>`).join('')}</div>
      <div class="alert">${icon('info')}<div class="small">Detectamos el tipo de contenido automáticamente. Los videos se reproducen dentro de tu universidad, con tu marca.</div></div>
    </section>
    <section class="card pad stack s16">
      <h3>Organizar como curso</h3>
      <div class="field"><label for="imp-title">Nombre del curso</label><input class="input" id="imp-title" value="Negociación efectiva"></div>
      <div class="field"><label for="imp-mode">Estructura</label><select class="select" id="imp-mode"><option>Un módulo por cada enlace</option><option>Todo en un único módulo</option></select></div>
      <button class="btn primary block" data-act="impCreate" data-arg="Negociación efectiva">${icon('arrowR')}Crear curso con ${links.length} materiales</button>
    </section></div>`;
}
ACT.addLink = f => { const v = f.querySelector('input').value.trim(); if (!v) return; const kind = /youtu|vimeo/.test(v) ? 'video' : /\.pdf|drive/.test(v) ? 'pdf' : /genial|slides|ppt/.test(v) ? 'slides' : 'link'; UI.tmp.links.push({ url: v, kind, title: kind === 'video' ? 'Video vinculado' : 'Recurso vinculado' }); render(); toast('Enlace añadido'); };
ACT.rmLink = el => { UI.tmp.links.splice(+el.dataset.arg, 1); render(); };
function importUpload() {
  const files = UI.tmp.upFiles || (UI.tmp.upFiles = [
    { name: 'Bienvenida_negociacion.mp4', size: '184 MB', kind: 'video', p: 100 },
    { name: 'Modulo1_Fundamentos.pdf', size: '2,4 MB', kind: 'pdf', p: 100 },
    { name: 'Tacticas_de_negociacion.pptx', size: '8,1 MB', kind: 'slides', p: 100 },
    { name: 'Caso_practico_proveedores.docx', size: '640 KB', kind: 'reading', p: 100 },
  ]);
  return `<div class="grid2" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start">
    <section class="card pad stack s16">
      <div class="dropzone" data-act="upMore" id="dz-up"><span class="dz-ico">${icon('upload')}</span><b>Arrastra archivos aquí o haz clic para elegir</b><span class="small subtle">Video (MP4, MOV), PDF, PowerPoint, Word, Excel, imágenes · hasta 2 GB por archivo</span></div>
      <div class="stack s8">${files.map(f => `<div class="row" style="padding:10px;border:1px solid var(--line);border-radius:12px">${tico(f.kind)}<div class="grow"><div class="row between"><b class="small">${esc(f.name)}</b><span class="xs subtle">${f.size}</span></div>${bar(f.p)}</div><span class="badge ok plain">${icon('check')}Listo</span></div>`).join('')}</div>
    </section>
    <section class="card pad stack s16">
      <h3>Propuesta de estructura</h3>
      <p class="small muted">Ordenamos tus archivos en un módulo inicial. Podrás reorganizarlos con arrastrar y soltar.</p>
      <div class="panel stack s8 small">${files.map(f => `<div class="row">${tico(f.kind)}<span>${esc(f.name.replace(/_/g, ' ').replace(/\.\w+$/, ''))}</span></div>`).join('')}</div>
      <div class="alert ai">${icon('sparkles')}<div class="small">¿Quieres convertir el PDF en una lectura y un quiz? <button class="link" data-go="admin/ai/reading">Hazlo con IA</button></div></div>
      <button class="btn primary block" data-act="impCreate" data-arg="Negociación para equipos comerciales">Crear curso ${icon('arrowR')}</button>
    </section></div>`;
}
ACT.upMore = () => pickFile('*/*', f => { UI.tmp.upFiles.push({ name: f.name, size: (f.size / 1048576).toFixed(1).replace('.', ',') + ' MB', kind: /video/.test(f.type) ? 'video' : /pdf/.test(f.type) ? 'pdf' : /presentation|ppt/.test(f.name) ? 'slides' : 'file', p: 100 }); render(); toast('Archivo subido'); });
function importLms() {
  const im = UI.tmp.imp;
  const L = [['moodle', 'Moodle', 'Copia de seguridad .mbz'], ['canvas', 'Canvas', 'Exportación IMS Common Cartridge'], ['scorm', 'Paquete SCORM', 'SCORM 1.2 / 2004 (.zip)'], ['bb', 'Blackboard', 'Paquete de curso .zip'], ['gc', 'Google Classroom', 'Conexión con tu cuenta'], ['other', 'Otro LMS', 'xAPI, cmi5 o archivos sueltos']];
  if (im.stage === 'analyzing') return `<section class="card pad-lg stack s16" style="max-width:560px;margin:0 auto;width:100%;text-align:center;align-items:center">${ring(im.p || 10, 88, 8, 'var(--sys)')}<h3>Analizando curso_liderazgo_2025.mbz</h3><p class="muted small">Detectando secciones, recursos, actividades y cuestionarios…</p></section>`;
  if (im.stage === 'review') {
    const tree = [['Unidad 1 · Fundamentos de la negociación', [['video', 'Video introductorio', 1], ['pdf', 'Lectura: Los 4 principios', 1], ['quiz', 'Cuestionario unidad 1 (8 preguntas)', 1]]], ['Unidad 2 · Preparación', [['reading', 'Página: Matriz de preparación', 1], ['file', 'Plantilla BATNA.docx', 1], ['activity', 'Tarea: Prepara tu negociación', 1]]], ['Unidad 3 · En la mesa', [['slides', 'Presentación: Tácticas', 1], ['link', 'Foro de discusión', 0], ['exam', 'Examen final (20 preguntas)', 1]]]];
    return `<div class="grid2" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start">
      <section class="card pad stack s16"><div class="row between"><h3>Estructura detectada</h3><span class="badge ok">3 módulos · 9 elementos</span></div>
      ${tree.map(([m, ls]) => `<div class="panel stack s8"><b class="small">${m}</b>${ls.map(([t, n, ok]) => `<label class="row small" style="padding:6px 8px;background:var(--surface);border-radius:9px"><input type="checkbox" ${ok ? 'checked' : ''} style="accent-color:var(--sys)">${tico(t)}<span class="grow">${n}</span>${ok ? '' : '<span class="badge warn plain">No compatible</span>'}</label>`).join('')}</div>`).join('')}</section>
      <section class="card pad stack s16"><h3>Resumen de importación</h3>
        <div class="stack s8 small"><div class="row between"><span class="muted">Contenido compatible</span><b>8 de 9</b></div><div class="row between"><span class="muted">Preguntas importadas</span><b>28</b></div><div class="row between"><span class="muted">Archivos</span><b>412 MB</b></div></div>
        <div class="alert warn">${icon('alert')}<div class="small">Los foros no se importan. Puedes reemplazarlos por un evento en vivo o una actividad.</div></div>
        <div class="field"><label class="check"><input type="checkbox" checked>Importar como borrador para revisar antes de publicar</label></div>
        <button class="btn primary block" data-act="impCreate" data-arg="Negociación estratégica (importado)">Importar curso ${icon('arrowR')}</button></section></div>`;
  }
  return `<section class="stack s16"><div class="methods" style="grid-template-columns:repeat(3,minmax(0,1fr))">${L.map(([k, t, d]) => `<button class="method ${im.src === k ? 'on' : ''}" data-act="lmsPick" data-arg="${k}"><span class="m-ico">${icon(k === 'gc' ? 'globe' : k === 'scorm' ? 'archive' : 'plug')}</span><span><b>${t}</b><span>${d}</span></span></button>`).join('')}</div>
    ${im.src ? `<div class="card pad stack s16"><div class="dropzone" data-act="lmsAnalyze"><span class="dz-ico">${icon('upload')}</span><b>Sube el archivo exportado desde ${L.find(x => x[0] === im.src)[1]}</b><span class="small subtle">Haz clic para usar el archivo de ejemplo <span class="mono">curso_liderazgo_2025.mbz</span></span></div></div>` : `<div class="alert">${icon('info')}<div class="small">Elige la plataforma de origen. Te guiaremos para exportar el curso y lo analizaremos antes de importarlo.</div></div>`}
  </section>`;
}
ACT.lmsPick = el => { UI.tmp.imp.src = el.dataset.arg; render(); };
ACT.lmsAnalyze = () => {
  const im = UI.tmp.imp; im.stage = 'analyzing'; im.p = 8; render();
  const t = setInterval(() => { im.p = Math.min(100, im.p + 23); if (S.route === 'admin/import') render(); if (im.p >= 100) { clearInterval(t); im.stage = 'review'; if (S.route === 'admin/import') render(); } }, 380);
};
ACT.impCreate = el => {
  const title = el.dataset.arg;
  const c = { id: uid('c'), title, category: 'Ventas', status: 'draft', students: 0, progress: 0, completion: 0, updated: 'Justo ahora', hue: 18, motif: 'blocks', hours: 3, certificate: true,
    description: 'Curso importado desde material existente.', modules: [
      M('Fundamentos de la negociación', [L('video', 'Video introductorio', 6), L('pdf', 'Los 4 principios de la negociación', 12), L('quiz', 'Cuestionario de la unidad', 10)]),
      M('Preparación', [L('reading', 'Matriz de preparación', 8), L('file', 'Plantilla BATNA', 3), L('activity', 'Prepara tu próxima negociación', 20)]),
      M('En la mesa', [L('slides', 'Tácticas de negociación', 12), L('exam', 'Examen final', 25)])] };
  S.courses.unshift(c); save(); UI.tmp.imp = null; go(`admin/builder/${c.id}`); toast('Curso importado como borrador. Revísalo antes de publicar.');
};

/* ---------- Detalle de curso ---------- */
function viewCourse(id) {
  const c = course(id); if (!c) return viewCourses();
  const tab = UI.tmp.ctab || 'overview';
  const enrolled = S.students.filter(s => s.courses.includes(c.id));
  return adminShell('courses', `<div class="page">
    ${crumbs([['Cursos', 'admin/courses'], [esc(c.title)]])}
    <section class="card" style="overflow:hidden"><div class="row top wrap" style="gap:0">
      <div class="cover" style="background-image:${coverArt(c)};width:min(320px,100%);aspect-ratio:16/10"></div>
      <div class="grow stack s16" style="padding:22px 24px;min-width:260px">
        <div class="row wrap">${statusBadge(c.status)}<span class="badge plain">${esc(c.category)}</span>${c.certificate ? `<span class="badge plain">${icon('award')}Certificado</span>` : ''}</div>
        <h1>${esc(c.title)}</h1><p class="muted" style="max-width:70ch">${esc(c.description)}</p>
        <div class="row wrap"><button class="btn primary" data-go="admin/builder/${c.id}">${icon('edit')}Editar contenido</button><button class="btn" data-act="enroll" data-arg="${c.id}">${icon('userPlus')}Matricular estudiantes</button><button class="btn" data-act="previewCourse" data-arg="${c.id}">${icon('eye')}Ver como estudiante</button>${courseMenu(c)}</div>
      </div></div></section>
    <div class="tabs">${[['overview', 'Resumen'], ['students', 'Estudiantes', enrolled.length], ['stats', 'Estadísticas']].map(([k, l, n]) => `<button class="${tab === k ? 'on' : ''}" data-act="ctab" data-arg="${k}">${l}${n !== undefined ? `<span class="count">${c.students}</span>` : ''}</button>`).join('')}</div>
    ${tab === 'overview' ? courseOverview(c) : tab === 'students' ? courseStudents(c, enrolled) : courseStats(c)}
  </div>`);
}
ACT.ctab = el => { UI.tmp.ctab = el.dataset.arg; render(); };
ACT.previewCourse = el => { S.previewFrom = S.route; const c = course(el.dataset.arg); ensureEnrolled(c.id); go(`student/course/${c.id}`); };
function courseOverview(c) {
  return `<div class="kpis">${kpi('users', 'Estudiantes', c.students, '<span>matriculados</span>', `admin/course/${c.id}`)}${kpi('trending', 'Progreso promedio', c.progress + '<small>%</small>', `<div class="grow">${bar(c.progress)}</div>`, `admin/course/${c.id}`)}${kpi('checkCircle', 'Finalización', c.completion + '<small>%</small>', `<span>${Math.round(c.students * c.completion / 100)} completaron</span>`, `admin/course/${c.id}`)}${kpi('clock', 'Duración', Math.round(courseMinutes(c) / 6) / 10 + '<small>h</small>', `<span>${lessonCount(c)} lecciones</span>`, `admin/course/${c.id}`)}</div>
  <div class="dash-grid"><section class="card"><div class="card-h"><h3>Contenido</h3><button class="link small" data-go="admin/builder/${c.id}">Abrir editor ${icon('arrowR')}</button></div><div class="card-b stack s16">
    ${c.modules.map((m, i) => `<div class="stack s8"><div class="row between"><b>${i + 1}. ${esc(m.title)}</b><span class="xs subtle">${m.lessons.length} lecciones</span></div>${m.lessons.map(l => `<div class="row small" style="padding-left:6px">${tico(l.type)}<span class="grow">${esc(l.title)}</span><span class="xs subtle">${l.dur} min</span></div>`).join('')}</div>`).join('') || `<div class="empty"><span class="empty-ico">${icon('layers')}</span><p>Este curso aún no tiene contenido.</p></div>`}
  </div></section>
  <section class="card"><div class="card-h"><h3>Avance por módulo</h3></div><div class="card-b">${c.modules.length ? hbars(c.modules.map((m, i) => [m.title, Math.max(8, c.progress + 18 - i * 16), Math.max(8, c.progress + 18 - i * 16) + '%'])) : '<p class="muted small">Sin datos todavía.</p>'}</div></section></div>`;
}
function courseStudents(c, list) {
  return `<section class="card"><div class="card-h"><div><h3>Estudiantes matriculados</h3><p class="small muted">${c.students} en total · mostrando ${list.length}</p></div><button class="btn primary sm" data-act="enroll" data-arg="${c.id}">${icon('userPlus')}Matricular</button></div>
  <div class="card-b table-wrap">${list.length ? `<table class="t"><thead><tr><th>Estudiante</th><th>Estado</th><th style="min-width:150px">Avance en el curso</th><th>Última conexión</th></tr></thead><tbody>${list.map(s => { const p = s.id === 's1' && S.me.enrolled[c.id] ? myProgress(c.id) : Math.max(0, Math.min(100, s.progress + (c.id.charCodeAt(1) % 5) * 7 - 14)); return `<tr class="click" data-go="admin/student/${s.id}"><td><div class="row">${avatar(s.name, 'sm')}<div><b style="font-weight:600">${esc(s.name)}</b><div class="xs subtle">${esc(s.email)}</div></div></div></td><td>${sBadge(s.status)}</td><td><div class="row">${bar(p).replace('class="bar ', 'class="bar grow ')}<span class="num small">${p}%</span></div></td><td class="small muted">${s.lastSeen}</td></tr>`; }).join('')}</tbody></table>` : `<div class="empty"><span class="empty-ico">${icon('users')}</span><h3>Aún no hay estudiantes</h3><p class="small">Matricula estudiantes para que reciban acceso por correo.</p><button class="btn primary sm" data-act="enroll" data-arg="${c.id}">Matricular estudiantes</button></div>`}</div></section>`;
}
function courseStats(c) {
  const ls = c.modules.flatMap(m => m.lessons);
  return `<div class="dash-grid"><section class="card"><div class="card-h"><h3>Lecciones completadas por semana</h3></div><div class="card-b">${areaChart([12, 18, 26, 22, 35, 41, 38, 52, 47, 58, 61, 66], ['jul', '', '', '', 'ago', '', '', '', 'sep', '', '', 'oct'], { max: 80 })}</div></section>
  <section class="card"><div class="card-h"><h3>Retención por lección</h3></div><div class="card-b">${ls.length ? hbars(ls.slice(0, 8).map((l, i) => [l.title, Math.round(100 - i * (55 / Math.max(1, ls.length))), Math.round(100 - i * (55 / Math.max(1, ls.length))) + '%'])) : '<p class="muted small">Sin datos.</p>'}</div></section></div>
  <section class="card pad row wrap" style="gap:24px"><div class="stack s4"><span class="eyebrow">Tiempo promedio</span><b style="font-size:22px;font-family:var(--f-display)">3 h 42 min</b></div><div class="stack s4"><span class="eyebrow">Nota promedio en quizzes</span><b style="font-size:22px;font-family:var(--f-display)">82 / 100</b></div><div class="stack s4"><span class="eyebrow">Satisfacción</span><b style="font-size:22px;font-family:var(--f-display)">4,7 ★</b></div></section>`;
}

/* ==========================================================================
   ESTUDIANTES
   ========================================================================== */
function viewStudents() {
  const p = S.plan;
  return adminShell('students', `<div class="page">
    ${pageHead('Estudiantes', 'Matricula, organiza y haz seguimiento a las personas que aprenden en tu universidad.',
      `<button class="btn" data-act="importCsv">${icon('table')}Importar Excel o CSV</button><button class="btn primary" data-act="addStudent">${icon('userPlus')}Añadir estudiante</button>`)}
    <section class="card pad row wrap" style="gap:20px">
      <div class="stack s4" style="min-width:170px"><span class="eyebrow">Cupos utilizados</span><b class="num" style="font-family:var(--f-display);font-size:24px">${p.used} <span class="subtle" style="font-size:16px">/ ${p.seats}</span></b></div>
      <div class="grow stack s8" style="min-width:220px">${bar(p.used / p.seats * 100, 'thick')}<div class="row between xs subtle"><span>${p.active} activos · ${S.students.filter(s => s.status === 'invited').length * 6} invitaciones pendientes</span><span>${p.seats - p.used} disponibles</span></div></div>
      <button class="btn sm" data-act="expandSeats">${icon('plus')}Ampliar capacidad</button>
    </section>
    <div class="toolbar">
      <div class="input-icon grow" style="max-width:340px">${icon('search')}<input class="input" id="st-search" placeholder="Buscar por nombre o correo" data-in="ssearch" value="${esc(UI.tmp.sq || '')}"></div>
      <select class="select" style="width:auto" id="st-status" data-ch="sstatus" aria-label="Estado"><option value="">Todos los estados</option>${Object.entries(SSTATUS).map(([k, v]) => `<option value="${k}" ${UI.tmp.ss === k ? 'selected' : ''}>${v[1]}</option>`).join('')}</select>
      <select class="select" style="width:auto;max-width:240px" id="st-course" data-ch="scourse" aria-label="Curso"><option value="">Todos los cursos</option>${S.courses.filter(c => c.status !== 'draft').map(c => `<option value="${c.id}" ${UI.tmp.sc === c.id ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</select>
    </div>
    ${region('studentTable')}
  </div>`);
}
REG.studentTable = () => {
  const q = (UI.tmp.sq || '').toLowerCase(); const sel = UI.tmp.ssel || (UI.tmp.ssel = []);
  const list = S.students.filter(s => (s.name + s.email).toLowerCase().includes(q) && (!UI.tmp.ss || s.status === UI.tmp.ss) && (!UI.tmp.sc || s.courses.includes(UI.tmp.sc)));
  return `${sel.length ? `<div class="card row wrap" style="padding:10px 14px;background:var(--fg);color:var(--bg);border-color:var(--fg)"><b>${sel.length} seleccionados</b><div class="grow"></div><button class="btn sm" data-act="enrollSel">${icon('book')}Matricular en curso</button><button class="btn sm" data-act="deactivateSel">${icon('userX')}Desactivar</button><button class="btn sm ghost" style="color:var(--bg)" data-act="clearSel">Cancelar</button></div>` : ''}
  <div class="card table-wrap">${list.length ? `<table class="t"><thead><tr><th style="width:36px"><input type="checkbox" aria-label="Seleccionar todos" data-ch="selAll" ${sel.length === list.length ? 'checked' : ''}></th><th>Estudiante</th><th>Estado</th><th>Cursos</th><th style="min-width:150px">Avance</th><th>Última conexión</th><th></th></tr></thead><tbody>
    ${list.map(s => `<tr class="click" data-go="admin/student/${s.id}"><td data-act="noop"><input type="checkbox" aria-label="Seleccionar ${esc(s.name)}" data-ch="selOne" value="${s.id}" ${sel.includes(s.id) ? 'checked' : ''}></td>
      <td><div class="row">${avatar(s.name, 'sm')}<div><b style="font-weight:600">${esc(s.name)}</b><div class="xs subtle">${esc(s.email)}</div></div></div></td>
      <td>${sBadge(s.status)}</td>
      <td><span class="small" title="${esc(s.courses.map(id => course(id)?.title).join(', '))}"><b class="num">${s.courses.length}</b> <span class="muted">${s.courses.length === 1 ? 'curso' : 'cursos'}</span></span></td>
      <td><div class="row">${bar(s.progress).replace('class="bar ', 'class="bar grow ')}<span class="num small" style="width:34px">${s.progress}%</span></div></td>
      <td class="small muted">${s.lastSeen}</td>
      <td data-act="noop"><div class="menu-wrap"><button class="btn ghost icon sm" data-act="studentMenu" data-arg="${s.id}" aria-label="Acciones">${icon('more')}</button></div></td></tr>`).join('')}
  </tbody></table>` : `<div class="empty"><span class="empty-ico">${icon('search')}</span><h3>Sin resultados</h3><p class="small">Prueba con otro nombre o quita los filtros.</p></div>`}</div>
  <div class="row between small subtle"><span>Mostrando ${list.length} de ${S.plan.used} estudiantes</span><div class="row"><button class="btn sm" disabled>${icon('chevL')}</button><span class="num">1 / ${Math.ceil(S.plan.used / 25)}</span><button class="btn sm" data-act="toast" data-arg="Paginación simulada en el prototipo">${icon('chevR')}</button></div></div>`;
};
ACT.noop = () => {};
IN.ssearch = el => { UI.tmp.sq = el.value; refresh('studentTable'); };
CH.sstatus = el => { UI.tmp.ss = el.value; refresh('studentTable'); };
CH.scourse = el => { UI.tmp.sc = el.value; refresh('studentTable'); };
CH.selOne = el => { const s = UI.tmp.ssel; el.checked ? s.push(el.value) : s.splice(s.indexOf(el.value), 1); refresh('studentTable'); };
CH.selAll = el => { UI.tmp.ssel = el.checked ? $$('[data-ch="selOne"]').map(x => x.value) : []; refresh('studentTable'); };
ACT.clearSel = () => { UI.tmp.ssel = []; refresh('studentTable'); };
ACT.deactivateSel = () => { UI.tmp.ssel.forEach(id => student(id).status = 'inactive'); toast(`${UI.tmp.ssel.length} estudiantes desactivados`); UI.tmp.ssel = []; save(); refresh('studentTable'); };
ACT.enrollSel = () => { UI.tmp.en = { course: S.courses.find(c => c.status === 'published').id, students: [...UI.tmp.ssel], step: 'pick', invite: true }; openModal(enrollModal, 'wide'); };
ACT.studentMenu = btn => { const s = student(btn.dataset.arg); toggleMenu(btn, [
  { icon: 'user', label: 'Ver perfil', go: `admin/student/${s.id}` },
  { icon: 'book', label: 'Matricular en curso', act: 'enrollOne', arg: s.id },
  { icon: 'award', label: 'Ver certificados', go: `admin/student/${s.id}` },
  { icon: 'mail', label: 'Reenviar invitación', act: 'toast', arg: `Invitación reenviada a ${s.email}` }, '-',
  s.status === 'inactive' ? { icon: 'refresh', label: 'Reactivar', act: 'toggleActive', arg: s.id } : { icon: 'userX', label: 'Desactivar', act: 'toggleActive', arg: s.id, danger: true },
]); };
ACT.toggleActive = el => { const s = student(el.dataset.arg); s.status = s.status === 'inactive' ? 'active' : 'inactive'; save(); closeMenus(); render(); toast(s.status === 'inactive' ? `${esc(s.name)} desactivado. Su cupo queda libre.` : `${esc(s.name)} reactivado`); };
ACT.enrollOne = el => { UI.tmp.en = { course: S.courses.find(c => c.status === 'published').id, students: [el.dataset.arg], step: 'pick', invite: true }; openModal(enrollModal, 'wide'); };

/* Añadir estudiante (drawer) */
ACT.addStudent = () => { UI.tmp.ns = { name: '', email: '', area: 'Comercial', courses: ['c4'], invite: true }; openModal(addStudentModal, 'drawer'); };
function addStudentModal() {
  const n = UI.tmp.ns;
  return `${modalHead('Añadir estudiante', `Ocupará 1 de tus ${S.plan.seats - S.plan.used} cupos disponibles.`)}
  <form class="modal-b stack s16" data-submit="saveStudent" id="ns-form">
    <div class="field"><label for="ns-name">Nombre completo</label><input class="input" id="ns-name" autofocus required placeholder="Ej. Paula Andrea Gil" data-in="nsName" value="${esc(n.name)}"></div>
    <div class="field"><label for="ns-email">Correo electrónico</label><input class="input" id="ns-email" type="email" required placeholder="nombre@empresa.com" data-in="nsEmail" value="${esc(n.email)}"></div>
    <div class="field"><label for="ns-area">Área o grupo</label><select class="select" id="ns-area">${AREAS.map(a => `<option>${a}</option>`).join('')}</select></div>
    <div class="field"><span class="label">Matricular en</span><div class="stack s8">${S.courses.filter(c => c.status === 'published').map(c => `<label class="row" style="padding:8px 10px;border:1px solid var(--line);border-radius:10px;cursor:pointer"><input type="checkbox" value="${c.id}" data-ch="nsCourse" ${n.courses.includes(c.id) ? 'checked' : ''} style="accent-color:var(--sys)"><span class="thumb" style="background-image:${coverArt(c)};width:36px;height:24px"></span><span class="small grow">${esc(c.title)}</span></label>`).join('')}</div></div>
    <label class="set-row"><span><b class="small">Enviar invitación por correo</b><br><span class="xs subtle">Con tu logo, colores y enlace de acceso</span></span><span class="switch"><input type="checkbox" checked id="ns-invite"><span></span></span></label>
  </form>
  <div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button><button class="btn primary" type="submit" form="ns-form">${icon('userPlus')}Añadir y enviar acceso</button></div>`;
}
IN.nsName = el => UI.tmp.ns.name = el.value; IN.nsEmail = el => UI.tmp.ns.email = el.value;
CH.nsCourse = el => { const a = UI.tmp.ns.courses; el.checked ? a.push(el.value) : a.splice(a.indexOf(el.value), 1); };
ACT.saveStudent = () => {
  const n = UI.tmp.ns; const s = { id: uid('s'), name: n.name.trim(), email: n.email.trim(), status: 'invited', courses: [...n.courses], progress: 0, lastSeen: 'Sin acceso aún', area: $('#ns-area').value, joined: '2 oct 2026', certs: 0 };
  S.students.unshift(s); S.plan.used++; S.activity.unshift({ ico: 'userPlus', t: `Se matriculó a <b>${esc(s.name)}</b>`, when: 'Justo ahora' }); save();
  UI.tmp.en = { course: s.courses[0] || 'c4', students: [s.id], step: 'done', invite: true }; openModal(enrollModal, 'wide'); if (S.route === 'admin/students') render();
};

/* Matricular (Flujo 4) */
ACT.enroll = el => { const c = course(el.dataset.arg); UI.tmp.en = { course: c.id, students: S.students.filter(s => !s.courses.includes(c.id)).slice(0, 4).map(s => s.id), step: 'pick', invite: true }; openModal(enrollModal, 'wide'); };
function enrollModal() {
  const e = UI.tmp.en, c = course(e.course);
  if (e.step === 'done') {
    const s = student(e.students[0]);
    return `${modalHead(`${icon('checkCircle')} Acceso enviado`, `${e.students.length === 1 ? esc(s.name) + ' ya puede' : e.students.length + ' estudiantes ya pueden'} entrar a <b>${esc(c.title)}</b>.`)}
      <div class="modal-b stack s16"><span class="eyebrow">Así se ve el correo que reciben</span>${inviteEmail(s, c)}</div>
      <div class="modal-f"><button class="btn" data-act="closeModal">Listo</button><button class="btn primary" data-act="openInvite" data-arg="${c.id}">${icon('eye')}Ver lo que recibe el estudiante</button></div>`;
  }
  const pool = S.students.filter(s => s.status !== 'inactive');
  return `${modalHead('Matricular estudiantes', 'Elige el curso y las personas. Cada estudiante nuevo ocupa un cupo de tu plan.')}
    <div class="modal-b stack s16">
      <div class="field"><label for="en-course">Curso</label><select class="select" id="en-course" data-ch="enCourse">${S.courses.filter(c => c.status !== 'archived').map(x => `<option value="${x.id}" ${x.id === e.course ? 'selected' : ''}>${esc(x.title)}${x.status === 'draft' ? ' (borrador)' : ''}</option>`).join('')}</select>${c.status === 'draft' ? `<span class="hint" style="color:var(--warn)">Este curso es un borrador. Los estudiantes recibirán acceso cuando lo publiques.</span>` : ''}</div>
      <div class="row wrap"><button class="chip on">${icon('users')}Seleccionar personas</button><button class="chip" data-act="enGroup">${icon('building')}Por área: Comercial (42)</button><button class="chip" data-act="importCsv">${icon('table')}Desde CSV</button></div>
      <div class="stack s4" style="max-height:280px;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:6px">${pool.map(s => `<label class="row" style="padding:7px 8px;border-radius:8px;cursor:pointer"><input type="checkbox" value="${s.id}" data-ch="enStudent" ${e.students.includes(s.id) ? 'checked' : ''} style="accent-color:var(--sys)">${avatar(s.name, 'sm')}<span class="small grow"><b style="font-weight:600">${esc(s.name)}</b> <span class="subtle">· ${esc(s.area)}</span></span>${s.courses.includes(c.id) ? '<span class="badge plain">Ya matriculado</span>' : ''}</label>`).join('')}</div>
      <label class="set-row"><span><b class="small">Enviar invitación por correo</b><br><span class="xs subtle">Desde ${esc(S.uni.email)} con la marca de ${esc(S.uni.name)}</span></span><span class="switch"><input type="checkbox" ${e.invite ? 'checked' : ''} data-ch="enInvite"><span></span></span></label>
    </div>
    <div class="modal-f"><span class="small muted grow" style="align-self:center">${e.students.length} seleccionados</span><button class="btn" data-act="closeModal">Cancelar</button><button class="btn primary" data-act="enDo" ${e.students.length ? '' : 'disabled'}>${icon('send')}Matricular y enviar acceso</button></div>`;
}
CH.enCourse = el => { UI.tmp.en.course = el.value; renderModal(); };
CH.enStudent = el => { const a = UI.tmp.en.students; el.checked ? a.push(el.value) : a.splice(a.indexOf(el.value), 1); renderModal(); };
CH.enInvite = el => UI.tmp.en.invite = el.checked;
ACT.enGroup = () => { UI.tmp.en.students = S.students.filter(s => s.area === 'Comercial' && s.status !== 'inactive').map(s => s.id); renderModal(); toast('Se seleccionaron las personas del área Comercial'); };
ACT.enDo = () => {
  const e = UI.tmp.en, c = course(e.course); let added = 0;
  e.students.forEach(id => { const s = student(id); if (!s.courses.includes(c.id)) { s.courses.push(c.id); added++; } });
  c.students += added; S.activity.unshift({ ico: 'userPlus', t: `<b>${e.students.length} estudiantes</b> matriculados en <b>${esc(c.title)}</b>`, when: 'Justo ahora' });
  e.step = 'done'; save(); renderModal(); if (!S.route.startsWith('student')) render();
};
ACT.openInvite = el => { closeModal(); S.previewFrom = S.route; ensureEnrolled(el.dataset.arg); UI.tmp.loginCourse = el.dataset.arg; go('student/login'); };
function inviteEmail(s, c) {
  const u = S.uni;
  return `<div class="email" style="${brandVars(u)}"><div class="em-head"><span><b>De:</b> ${esc(u.name)} &lt;${esc(u.email)}&gt;</span><span><b>Para:</b> ${esc(s ? s.email : 'estudiante@empresa.com')}</span><span><b>Asunto:</b> Ya tienes acceso a ${esc(c.title)}</span></div>
    <div class="em-body"><div class="em-card"><div class="em-top">${logoMark(u, 30)}${esc(u.name)}</div><div class="em-in">
      <b style="font-family:var(--f-display);font-size:18px">Hola ${esc(s ? s.name.split(' ')[0] : 'Camila')}, te damos la bienvenida</b>
      <p class="muted">${esc(u.name)} te inscribió en <b>${esc(c.title)}</b>. Puedes empezar cuando quieras, desde el computador o el celular.</p>
      <div class="row" style="padding:10px;border:1px solid var(--line);border-radius:10px"><span class="thumb" style="background-image:${coverArt(c)}"></span><div class="small"><b>${esc(c.title)}</b><br><span class="subtle">${lessonCount(c)} lecciones · ${Math.max(1, Math.round(courseMinutes(c) / 60))} h aprox.</span></div></div>
      <span class="btn brand" style="align-self:flex-start">Activar mi acceso</span>
      <span class="xs subtle">Tu usuario es tu correo. El enlace vence en 7 días · ${esc(u.subdomain)}.aulora.app</span>
    </div></div></div></div>`;
}

/* Importar CSV */
ACT.importCsv = () => { UI.tmp.csv = { step: 'upload' }; openModal(csvModal, 'wide'); };
function csvModal() {
  const c = UI.tmp.csv;
  const steps = ['Subir archivo', 'Revisar datos', 'Asignar cursos'];
  const idx = { upload: 0, review: 1, assign: 2 }[c.step];
  const head = `<div class="row" style="gap:6px;padding:0 24px">${steps.map((s, i) => `<span class="badge ${i < idx ? 'ok' : i === idx ? 'sys' : 'plain'}">${i + 1}. ${s}</span>`).join(icon('chevR'))}</div>`;
  if (c.step === 'upload') return `${modalHead('Importar estudiantes', 'Sube un Excel (.xlsx) o CSV con nombre y correo. Nosotros hacemos el resto.')}${head}
    <div class="modal-b stack s16"><div class="dropzone" id="dz-csv" data-act="csvPick"><span class="dz-ico">${icon('table')}</span><b>Arrastra tu archivo aquí</b><span class="small subtle">o haz clic para usar el ejemplo <span class="mono">ingresos_octubre.csv</span> (48 filas)</span></div>
    <div class="row between small"><span class="muted">Columnas: nombre, correo, área (opcional), curso (opcional)</span><button class="link" data-act="toast" data-arg="Plantilla descargada: plantilla_estudiantes.xlsx">${icon('download')}Descargar plantilla</button></div></div>
    <div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button></div>`;
  if (c.step === 'review') {
    const rows = [['Paula Gil', 'paula.gil@gruponova.co', 'Comercial', 1], ['Ricardo Peña', 'ricardo.pena@gruponova.co', 'Operaciones', 1], ['Ana María Duque', 'ana.duque@gruponova.co', 'Finanzas', 1], ['Óscar Lemus', 'oscar.lemus@gruponova', 'Tecnología', 0], ['Lucía Arango', 'lucia.arango@gruponova.co', 'Marketing', 1], ['Camila Rojas', 'camila.rojas@gruponova.co', 'Comercial', 2]];
    return `${modalHead('Revisa los datos', `<span class="mono">${esc(c.file || 'ingresos_octubre.csv')}</span> · 48 filas detectadas`)}${head}
    <div class="modal-b stack s16"><div class="row wrap"><span class="badge ok">46 listos para importar</span><span class="badge bad">1 correo inválido</span><span class="badge warn">1 ya existe</span></div>
    <div class="table-wrap" style="border:1px solid var(--line);border-radius:12px"><table class="t"><thead><tr><th>Nombre <span class="badge plain">nombre</span></th><th>Correo <span class="badge plain">correo</span></th><th>Área <span class="badge plain">área</span></th><th></th></tr></thead><tbody>
    ${rows.map(([n, e, a, ok]) => `<tr><td>${n}</td><td class="mono small">${e}</td><td>${a}</td><td>${ok === 1 ? `<span class="badge ok plain">${icon('check')}OK</span>` : ok === 0 ? '<span class="badge bad">Correo inválido</span>' : '<span class="badge warn">Duplicado · se omitirá</span>'}</td></tr>`).join('')}
    <tr><td colspan="4" class="small subtle">+ 42 filas más</td></tr></tbody></table></div>
    <div class="alert">${icon('info')}<div class="small">Después de importar te quedarán <b>${S.plan.seats - S.plan.used - 46} cupos</b> disponibles.</div></div></div>
    <div class="modal-f"><button class="btn ghost" data-act="csvStep" data-arg="upload">${icon('arrowL')}Atrás</button><div class="grow"></div><button class="btn primary" data-act="csvStep" data-arg="assign">Continuar ${icon('arrowR')}</button></div>`;
  }
  return `${modalHead('Asigna cursos', '¿En qué cursos matriculamos a estas 46 personas?')}${head}
    <div class="modal-b stack s8">${S.courses.filter(x => x.status === 'published').map((x, i) => `<label class="row" style="padding:9px 10px;border:1px solid var(--line);border-radius:10px;cursor:pointer"><input type="checkbox" ${i === 3 ? 'checked' : ''} style="accent-color:var(--sys)"><span class="thumb" style="background-image:${coverArt(x)};width:36px;height:24px"></span><span class="small grow">${esc(x.title)}</span></label>`).join('')}
    <label class="set-row" style="margin-top:8px"><span class="small"><b>Enviar invitaciones ahora</b></span><span class="switch"><input type="checkbox" checked><span></span></span></label></div>
    <div class="modal-f"><button class="btn ghost" data-act="csvStep" data-arg="review">${icon('arrowL')}Atrás</button><div class="grow"></div><button class="btn primary" data-act="csvDo">${icon('upload')}Importar 46 estudiantes</button></div>`;
}
ACT.csvPick = () => { UI.tmp.csv.step = 'review'; renderModal(); };
dropzoneBindGlobal('#dz-csv', f => { UI.tmp.csv.file = f.name; UI.tmp.csv.step = 'review'; renderModal(); });
ACT.csvStep = el => { UI.tmp.csv.step = el.dataset.arg; renderModal(); };
ACT.csvDo = () => { S.plan.used += 46; S.plan.active += 0; S.courses.find(c => c.id === 'c4').students += 46; S.activity.unshift({ ico: 'upload', t: 'Se importaron <b>46 estudiantes</b> desde CSV', when: 'Justo ahora' }); save(); closeModal(); render(); toast('46 estudiantes importados. Las invitaciones están en camino.'); };
function dropzoneBindGlobal(sel, fn) {
  document.addEventListener('dragover', e => { if (e.target.closest(sel)) { e.preventDefault(); e.target.closest(sel).classList.add('over'); } });
  document.addEventListener('drop', e => { const dz = e.target.closest(sel); if (dz) { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) fn(f); } });
}

/* Perfil del estudiante */
function viewStudent(id) {
  const s = student(id); if (!s) return viewStudents();
  const isMe = s.id === 's1';
  const cs = s.courses.map(cid => course(cid)).filter(Boolean);
  const prog = c => isMe && S.me.enrolled[c.id] ? myProgress(c.id) : Math.max(0, Math.min(100, s.progress + (c.id.charCodeAt(1) % 5) * 9 - 18));
  const evs = S.events.filter(e => s.courses.includes(e.course));
  const certs = cs.filter(c => prog(c) === 100);
  return adminShell('students', `<div class="page">
    ${crumbs([['Estudiantes', 'admin/students'], [esc(s.name)]])}
    <section class="card pad-lg row wrap" style="gap:20px">${avatar(s.name, 'lg')}<div class="grow stack s8" style="min-width:220px"><div class="row wrap"><h1>${esc(s.name)}</h1>${sBadge(s.status)}</div>
      <div class="row wrap small muted" style="gap:16px"><span class="row" style="gap:6px">${icon('mail')}${esc(s.email)}</span><span class="row" style="gap:6px">${icon('building')}${esc(s.area)}</span><span class="row" style="gap:6px">${icon('calendar')}Desde ${s.joined}</span><span class="row" style="gap:6px">${icon('clock')}Última conexión: ${s.lastSeen}</span></div></div>
      <div class="row wrap"><button class="btn" data-act="toast" data-arg="Mensaje enviado a ${esc(s.name)}">${icon('message')}Enviar mensaje</button><button class="btn" data-act="enrollOne" data-arg="${s.id}">${icon('book')}Matricular</button><div class="menu-wrap"><button class="btn icon" data-act="studentMenu" data-arg="${s.id}" aria-label="Más">${icon('more')}</button></div></div></section>
    <div class="kpis">${kpi('book', 'Cursos matriculados', cs.length, `<span>${certs.length} completados</span>`, `admin/student/${s.id}`)}${kpi('trending', 'Avance promedio', Math.round(cs.reduce((a, c) => a + prog(c), 0) / Math.max(1, cs.length)) + '<small>%</small>', '<span>en todos sus cursos</span>', `admin/student/${s.id}`)}${kpi('listChecks', 'Actividades completadas', 23 + s.progress % 17, '<span>de 41 asignadas</span>', `admin/student/${s.id}`)}${kpi('award', 'Certificados', certs.length, '<span>emitidos</span>', `admin/student/${s.id}`)}</div>
    <div class="dash-grid"><div class="stack s16">
      <section class="card"><div class="card-h"><h3>Avance por curso</h3></div><div class="card-b stack s16">${cs.map(c => `<div class="row">${`<span class="thumb" style="background-image:${coverArt(c)}"></span>`}<div class="grow stack s4"><div class="row between"><b class="small">${esc(c.title)}</b><span class="num small">${prog(c)}%</span></div>${bar(prog(c))}</div></div>`).join('')}</div></section>
      <section class="card"><div class="card-h"><h3>Evaluaciones</h3></div><div class="card-b table-wrap"><table class="t"><thead><tr><th>Evaluación</th><th>Curso</th><th>Nota</th><th>Fecha</th></tr></thead><tbody>
        ${[['Quiz: Feedback efectivo', 'c1', isMe && S.me.quiz.score != null ? S.me.quiz.score : 80], ['Quiz de cultura', 'c4', 100], ['Quiz de fórmulas', 'c3', 70], ['Evaluación final', 'c8', 92]].filter(([, c]) => s.courses.includes(c)).map(([t, c, n], i) => `<tr><td>${t}</td><td class="small muted">${esc(course(c).title)}</td><td><span class="badge ${n >= 70 ? 'ok' : 'bad'}">${n} / 100</span></td><td class="small muted">${['28 sep', '21 ago', '12 sep', '2 may'][i]}</td></tr>`).join('') || '<tr><td colspan="4" class="muted small">Sin evaluaciones presentadas.</td></tr>'}</tbody></table></div></section>
    </div><div class="stack s16">
      <section class="card"><div class="card-h"><h3>Certificados</h3></div><div class="card-b stack s8">${certs.length ? certs.map(c => `<div class="row small">${icon('award')}<span class="grow">${esc(c.title)}</span><button class="link xs" data-act="viewCert" data-arg="${c.id}:${s.id}">Ver</button></div>`).join('') : '<p class="small muted">Aún no tiene certificados.</p>'}</div></section>
      <section class="card"><div class="card-h"><h3>Eventos asignados</h3></div><div class="card-b" style="padding-top:4px">${evs.map(e => `<div class="ev-mini">${datebox(e.date)}<div class="small"><b style="font-weight:600">${esc(e.title)}</b><br><span class="xs subtle">${e.time} · ${e.mode === 'virtual' ? 'Virtual' : 'Presencial'}</span></div></div>`).join('') || '<p class="small muted">Sin eventos.</p>'}</div></section>
      <section class="card"><div class="card-h"><h3>Actividad reciente</h3></div><div class="card-b activity" style="padding-top:4px">${[['checkCircle', 'Completó “El arte de la reunión 1:1”', 'Hace 2 días'], ['listChecks', 'Presentó el Quiz de fórmulas', 'Hace 3 semanas'], ['login', 'Inició sesión desde el celular', s.lastSeen]].map(([i, t, w]) => `<div class="a-item"><span class="a-ico">${icon(i)}</span><div class="small"><div>${t}</div><div class="xs subtle">${w}</div></div></div>`).join('')}</div></section>
    </div></div>
  </div>`);
}

/* ==========================================================================
   EVENTOS
   ========================================================================== */
function viewEvents() {
  const mode = UI.tmp.evview || 'cal';
  const up = S.events.filter(e => daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
  return adminShell('events', `<div class="page">
    ${pageHead('Eventos', 'Sesiones en vivo, talleres y encuentros presenciales vinculados a tus cursos.', `<div class="seg"><button class="${mode === 'cal' ? 'on' : ''}" data-act="evview" data-arg="cal">${icon('calendar')}Calendario</button><button class="${mode === 'list' ? 'on' : ''}" data-act="evview" data-arg="list">${icon('list')}Lista</button></div><button class="btn primary" data-act="newEvent">${icon('plus')}Crear evento</button>`)}
    <div class="dash-grid" style="grid-template-columns:minmax(0,2.4fr) minmax(0,1fr)">
      ${mode === 'cal' ? calendar() : `<section class="card table-wrap"><table class="t"><thead><tr><th>Evento</th><th>Fecha y hora</th><th>Modalidad</th><th>Curso</th><th>Invitados</th></tr></thead><tbody>${S.events.slice().sort((a, b) => a.date.localeCompare(b.date)).map(e => `<tr class="click" data-act="eventDetail" data-arg="${e.id}"><td><b style="font-weight:600">${esc(e.title)}</b></td><td class="small">${longDate(e.date)}<br><span class="subtle">${e.time} – ${e.end}</span></td><td>${modeBadge(e)}</td><td class="small muted">${esc(course(e.course)?.title || '—')}</td><td class="num">${e.invited}</td></tr>`).join('')}</tbody></table></section>`}
      <section class="card"><div class="card-h"><h3>Próximos eventos</h3></div><div class="card-b" style="padding-top:4px">${up.map(e => `<button class="ev-mini" style="width:100%;text-align:left" data-act="eventDetail" data-arg="${e.id}">${datebox(e.date)}<div class="grow"><b class="small" style="font-weight:600;display:block">${esc(e.title)}</b><span class="xs subtle">${when(e.date)} · ${e.time}</span></div>${modeBadge(e)}</button>`).join('')}</div></section>
    </div></div>`);
}
const modeBadge = e => e.mode === 'virtual' ? `<span class="badge info plain">${icon('monitor')}Virtual</span>` : `<span class="badge warn plain">${icon('pin')}Presencial</span>`;
ACT.evview = el => { UI.tmp.evview = el.dataset.arg; render(); };
function calendar() {
  const first = new Date(2026, 9, 1); const start = (first.getDay() + 6) % 7; const cells = [];
  for (let i = 0; i < 35; i++) { const d = new Date(2026, 9, 1 - start + i); cells.push(d); }
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `<section class="card" style="overflow:hidden"><div class="card-h" style="padding-bottom:14px"><div class="row"><button class="btn ghost icon sm" aria-label="Mes anterior" data-act="toast" data-arg="Navegación de meses simulada">${icon('chevL')}</button><h3>Octubre 2026</h3><button class="btn ghost icon sm" aria-label="Mes siguiente" data-act="toast" data-arg="Navegación de meses simulada">${icon('chevR')}</button></div><div class="legend"><span><i style="background:var(--info)"></i>Virtual</span><span><i style="background:var(--warn)"></i>Presencial</span></div></div>
  <div class="cal">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => `<div class="dow">${d}</div>`).join('')}${cells.map(d => { const evs = S.events.filter(e => e.date === iso(d)); return `<div class="day ${d.getMonth() !== 9 ? 'out' : ''} ${d.getTime() === TODAY.getTime() ? 'today' : ''}"><span class="dn">${d.getDate()}</span>${evs.map(e => `<button class="evp ${e.mode}" data-act="eventDetail" data-arg="${e.id}" title="${esc(e.title)}">${e.time} ${esc(e.title)}</button>`).join('')}</div>`; }).join('')}</div></section>`;
}
ACT.eventDetail = el => { const e = S.events.find(x => x.id === el.dataset.arg); openModal(() => `${modalHead(esc(e.title), `${longDate(e.date)} · ${e.time} – ${e.end}`)}
  <div class="modal-b stack s16"><div class="row wrap">${modeBadge(e)}<span class="badge plain">${icon('users')}${e.invited} invitados</span><span class="badge ok plain">${Math.round(e.invited * .64)} confirmados</span></div>
  <p>${esc(e.desc)}</p>
  <div class="panel stack s8 small"><div class="row">${icon(e.mode === 'virtual' ? 'link' : 'pin')}<span class="${e.mode === 'virtual' ? 'mono' : ''}">${esc(e.mode === 'virtual' ? e.link : e.place)}</span></div><div class="row">${icon('book')}${esc(course(e.course)?.title || 'Sin curso asociado')}</div><div class="row">${icon('bell')}Recordatorios: ${e.reminders.join(', ')}</div></div>
  <div class="stack s8"><span class="label">Asistentes confirmados</span><div class="av-stack">${S.students.slice(0, 7).map(s => avatar(s.name, 'sm')).join('')}<span class="small muted" style="margin-left:8px;align-self:center">y ${Math.round(e.invited * .64) - 7} más</span></div></div></div>
  <div class="modal-f"><button class="btn danger" data-act="toast" data-arg="Evento cancelado y asistentes notificados (simulado)">Cancelar evento</button><div class="grow"></div><button class="btn" data-act="toast" data-arg="Recordatorio enviado a ${e.invited} invitados">${icon('send')}Enviar recordatorio</button><button class="btn primary" data-act="closeModal">Listo</button></div>`, 'drawer'); };
ACT.newEvent = () => { UI.tmp.ne = { mode: 'virtual' }; openModal(newEventModal, 'drawer'); };
function newEventModal() {
  const n = UI.tmp.ne;
  return `${modalHead('Crear evento', 'Los invitados lo verán en “Mis eventos” y recibirán recordatorios.')}
  <form class="modal-b stack s16" id="ne-form" data-submit="saveEvent">
    <div class="field"><label for="ne-title">Nombre del evento</label><input class="input" id="ne-title" required autofocus placeholder="Ej. Sesión de preguntas: módulo 2"></div>
    <div class="field"><span class="label">Modalidad</span><div class="seg" style="align-self:flex-start"><button type="button" class="${n.mode === 'virtual' ? 'on' : ''}" data-act="neMode" data-arg="virtual">${icon('monitor')}Virtual</button><button type="button" class="${n.mode === 'presencial' ? 'on' : ''}" data-act="neMode" data-arg="presencial">${icon('pin')}Presencial</button></div></div>
    <div class="grid3"><div class="field"><label for="ne-date">Fecha</label><input class="input" type="date" id="ne-date" value="2026-10-22" required></div><div class="field"><label for="ne-time">Inicio</label><input class="input" type="time" id="ne-time" value="10:00"></div><div class="field"><label for="ne-end">Fin</label><input class="input" type="time" id="ne-end" value="11:00"></div></div>
    ${n.mode === 'virtual' ? `<div class="field"><label for="ne-link">Enlace de la sesión</label><input class="input" id="ne-link" placeholder="https://zoom.us/j/…" value="https://meet.google.com/nov-qrt-118"><span class="hint">Compatible con Zoom, Google Meet y Microsoft Teams.</span></div>` : `<div class="field"><label for="ne-place">Ubicación</label><input class="input" id="ne-place" placeholder="Dirección o sala" value="Sede Chicó · Sala Ágora, piso 4"></div>`}
    <div class="field"><label for="ne-desc">Descripción</label><textarea class="textarea" id="ne-desc" placeholder="¿Qué pasará en este evento?"></textarea></div>
    <div class="field"><label for="ne-course">Curso asociado</label><select class="select" id="ne-course"><option value="">Ninguno</option>${S.courses.filter(c => c.status === 'published').map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></div>
    <div class="field"><label for="ne-inv">Invitar</label><select class="select" id="ne-inv"><option>Todos los matriculados del curso</option><option>Un área específica</option><option>Seleccionar personas</option><option>Toda la universidad (${S.plan.used})</option></select></div>
    <div class="field"><span class="label">Recordatorios</span><div class="row wrap">${['1 semana antes', '1 día antes', '1 hora antes', '15 minutos antes'].map((r, i) => `<label class="check"><input type="checkbox" name="rem" value="${r}" ${i === 1 || i === 2 ? 'checked' : ''}>${r}</label>`).join('')}</div></div>
  </form>
  <div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button><button class="btn primary" type="submit" form="ne-form">${icon('calendar')}Crear y enviar invitaciones</button></div>`;
}
ACT.neMode = el => { UI.tmp.ne.mode = el.dataset.arg; const t = $('#ne-title').value; renderModal(); $('#ne-title').value = t; };
ACT.saveEvent = () => {
  const c = $('#ne-course').value; const mode = UI.tmp.ne.mode;
  const e = { id: uid('e'), title: $('#ne-title').value, date: $('#ne-date').value, time: $('#ne-time').value, end: $('#ne-end').value, mode, place: mode === 'virtual' ? 'Google Meet' : $('#ne-place').value, link: mode === 'virtual' ? $('#ne-link').value.replace(/^https?:\/\//, '') : '', course: c, invited: c ? course(c).students : S.plan.used, desc: $('#ne-desc').value || 'Evento de la universidad.', reminders: $$('[name=rem]:checked').map(x => x.value) };
  S.events.push(e); S.activity.unshift({ ico: 'calendar', t: `Se creó el evento <b>${esc(e.title)}</b>`, when: 'Justo ahora' }); save(); closeModal(); UI.tmp.evview = 'cal'; go('admin/events'); toast(`Evento creado. ${e.invited} invitaciones enviadas.`);
};

/* ==========================================================================
   CERTIFICADOS
   ========================================================================== */
function certificate(u, { student = 'Camila Rojas', courseTitle = 'Liderazgo para nuevos managers', date = '2 de octubre de 2026', code = 'AN-8F2C-2026', showCode = true } = {}) {
  return `<div class="cert" style="${brandVars(u)}"><div class="c-in">
    ${logoMark(u, 44)}<div class="c-k">${esc(u.name)} · Certificado de finalización</div>
    <div class="c-small">Se otorga el presente certificado a</div><div class="c-name">${esc(student)}</div>
    <div class="c-small">por haber completado satisfactoriamente el programa</div><div class="c-course">${esc(courseTitle)}</div>
    <div class="c-foot"><div class="c-sign" style="text-align:left"><div class="c-sig">${esc(u.signer)}</div>${esc(u.signer)}<br>${esc(u.signerRole)}</div><div class="c-seal">${esc(initials(u.name))}<br>✓</div><div style="text-align:right">${esc(date)}${showCode ? `<br><span class="c-code">Código ${code}</span><br>Verifica en ${esc(u.subdomain)}.aulora.app/v` : ''}</div></div>
  </div></div>`;
}
function viewCertificates() {
  const u = S.uni; const t = UI.tmp.cert || (UI.tmp.cert = { showCode: true, logo: true });
  const issued = [['Camila Rojas', 'c4', '28 ago 2026', 'AN-7Q4K-2026'], ['María Fernanda López', 'c3', '2 oct 2026', 'AN-9TR2-2026'], ['Juan Pablo Castro', 'c1', '30 sep 2026', 'AN-5KD8-2026'], ['Laura Ortiz', 'c4', '27 sep 2026', 'AN-2PL0-2026'], ['Santiago Martínez', 'c8', '18 sep 2026', 'AN-4WX1-2026']];
  return adminShell('certificates', `<div class="page">
    ${pageHead('Certificados', 'Se emiten automáticamente cuando un estudiante cumple los criterios del curso. Cada uno tiene un código de validación público.', `<button class="btn primary" data-act="toast" data-arg="Plantilla guardada y aplicada a nuevos certificados">${icon('check')}Guardar plantilla</button>`)}
    <div class="kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">${kpi('award', 'Certificados emitidos', S.certs.issued, `<span class="delta">${icon('trending')}+18</span><span>este mes</span>`, 'admin/certificates')}${kpi('users', 'Estudiantes certificados', S.certs.students, `<span>${Math.round(S.certs.students / S.plan.used * 100)}% de tus estudiantes</span>`, 'admin/certificates')}${kpi('book', 'Cursos que certifican', S.certs.courses, `<span>de ${S.courses.filter(c => c.status === 'published').length} publicados</span>`, 'admin/certificates')}</div>
    <div class="dash-grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);align-items:start">
      <section class="card pad stack s16"><h3>Plantilla</h3>
        <div class="set-row"><span class="small">Mostrar logo</span><span class="switch"><input type="checkbox" checked disabled><span></span></span></div>
        <div class="field"><label for="ct-inst">Nombre de la institución</label><input class="input" id="ct-inst" value="${esc(u.name)}" data-in="uniField" data-arg="name" data-region-refresh="certPreview"></div>
        <div class="grid2"><div class="field"><label for="ct-signer">Firma</label><input class="input" id="ct-signer" value="${esc(u.signer)}" data-in="uniField" data-arg="signer"></div><div class="field"><label for="ct-role">Cargo</label><input class="input" id="ct-role" value="${esc(u.signerRole)}" data-in="uniField" data-arg="signerRole"></div></div>
        <div class="field"><span class="label">Firma digital</span><div class="dropzone" style="padding:14px" data-act="toast" data-arg="Firma cargada (simulado)"><span class="small">${icon('pen')} Subir imagen de firma (PNG)</span></div></div>
        <div class="set-row"><span class="small">Código de validación QR</span><span class="switch"><input type="checkbox" ${t.showCode ? 'checked' : ''} data-ch="certCode"><span></span></span></div>
        <div class="field"><span class="label">Criterio de emisión</span><select class="select" id="ct-rule"><option>Completar el 100% y aprobar la evaluación (≥ 70)</option><option>Completar el 100% de las lecciones</option><option>Emisión manual</option></select></div>
        <div class="alert">${icon('palette')}<div class="small">Los colores y el logo vienen de <button class="link" data-go="admin/university">Mi Universidad</button>.</div></div>
      </section>
      <section class="stack s8"><span class="eyebrow">Vista previa</span>${region('certPreview')}</section>
    </div>
    <section class="card"><div class="card-h"><h3>Emitidos recientemente</h3><div class="input-icon" style="width:240px">${icon('search')}<input class="input" style="height:34px" id="cert-search" placeholder="Buscar por código o nombre"></div></div><div class="card-b table-wrap"><table class="t"><thead><tr><th>Estudiante</th><th>Curso</th><th>Fecha</th><th>Código</th><th></th></tr></thead><tbody>
      ${issued.map(([n, c, d, code]) => `<tr><td><div class="row">${avatar(n, 'sm')}${n}</div></td><td class="small">${esc(course(c).title)}</td><td class="small muted">${d}</td><td class="mono small">${code}</td><td><div class="row" style="justify-content:flex-end"><button class="btn ghost sm" data-act="viewCertN" data-arg="${n}|${c}|${d}|${code}">${icon('eye')}Ver</button><button class="btn ghost sm icon" aria-label="Descargar" data-act="toast" data-arg="Certificado descargado en PDF (simulado)">${icon('download')}</button></div></td></tr>`).join('')}
    </tbody></table></div></section>
  </div>`);
}
REG.certPreview = () => certificate(S.uni, { showCode: UI.tmp.cert?.showCode !== false });
CH.certCode = el => { UI.tmp.cert.showCode = el.checked; refresh('certPreview'); };
ACT.viewCertN = el => { const [n, c, d, code] = el.dataset.arg.split('|'); openModal(() => `${modalHead('Certificado', esc(n))}<div class="modal-b">${certificate(S.uni, { student: n, courseTitle: course(c).title, date: d, code })}</div><div class="modal-f"><button class="btn" data-act="toast" data-arg="Enlace de verificación copiado">${icon('link')}Copiar enlace</button><button class="btn primary" data-act="toast" data-arg="Descargado en PDF (simulado)">${icon('download')}Descargar PDF</button></div>`, 'wide'); };
ACT.viewCert = el => { const [c, sid] = el.dataset.arg.split(':'); const s = student(sid); openModal(() => `${modalHead('Certificado', esc(s.name))}<div class="modal-b">${certificate(S.uni, { student: s.name, courseTitle: course(c).title, date: '28 de agosto de 2026', code: 'AN-7Q4K-2026' })}</div><div class="modal-f"><button class="btn primary" data-act="closeModal">Cerrar</button></div>`, 'wide'); };

/* ==========================================================================
   ANALÍTICA
   ========================================================================== */
function viewAnalytics() {
  const pub = S.courses.filter(c => c.status === 'published');
  return adminShell('analytics', `<div class="page">
    ${pageHead('Analítica', 'Cómo aprenden tus estudiantes y qué cursos generan más impacto.', `<select class="select" style="width:auto" aria-label="Periodo"><option>Últimos 90 días</option><option>Últimos 30 días</option><option>Este año</option></select><button class="btn" data-act="toast" data-arg="Reporte exportado a Excel (simulado)">${icon('download')}Exportar</button>`)}
    <div class="kpis">${kpi('users', 'Estudiantes activos', S.plan.active, `<span class="delta">${icon('trending')}+12%</span><span>vs. trimestre anterior</span>`, 'admin/analytics')}${kpi('clock', 'Horas de aprendizaje', '1.284', '<span>5,2 h por estudiante</span>', 'admin/analytics')}${kpi('checkCircle', 'Lecciones completadas', '6.912', `<span class="delta">${icon('trending')}+21%</span>`, 'admin/analytics')}${kpi('star', 'Satisfacción', '4,6<small>/5</small>', '<span>412 valoraciones</span>', 'admin/analytics')}</div>
    <div class="dash-grid"><section class="card"><div class="card-h"><h3>Estudiantes activos por semana</h3></div><div class="card-b">${areaChart([168, 172, 181, 176, 190, 204, 199, 213, 221, 229, 238, S.plan.active], ['jul', '', '', '', 'ago', '', '', '', 'sep', '', '', 'oct'])}</div></section>
    <section class="card"><div class="card-h"><h3>Participación por área</h3></div><div class="card-b">${hbars([['Comercial', 92, '92%'], ['Servicio al cliente', 84, '84%'], ['Operaciones', 71, '71%'], ['Talento Humano', 66, '66%'], ['Tecnología', 58, '58%'], ['Finanzas', 49, '49%']])}</div></section></div>
    <div class="grid2"><section class="card"><div class="card-h"><h3>Finalización por curso</h3></div><div class="card-b">${hbars(pub.map(c => [c.title, c.completion, c.completion + '%']))}</div></section>
    <section class="card"><div class="card-h"><h3>Lecciones donde más se detienen</h3></div><div class="card-b stack s8">${[['Diseña el plan de delegación de tu equipo', 'Liderazgo para nuevos managers', 38], ['Tu primera tabla dinámica', 'Excel para análisis de datos', 31], ['Role play: primera reunión', 'Fundamentos de ventas consultivas', 27]].map(([l, c, p]) => `<div class="row" style="padding:10px;border:1px solid var(--line);border-radius:12px"><span class="badge warn">${p}% abandono</span><div class="grow small"><b>${l}</b><br><span class="subtle">${c}</span></div></div>`).join('')}<div class="alert ai">${icon('sparkles')}<div class="small">Sugerencia: divide las actividades largas en pasos más cortos o añade un quiz de repaso generado con IA.</div></div></div></section></div>
  </div>`);
}

/* ==========================================================================
   PLAN Y FACTURACIÓN
   ========================================================================== */
function viewBilling() {
  const p = S.plan;
  const meter = (label, used, max, unit, cls = '', extra = '') => `<div class="stack s8"><div class="row between"><span class="small" style="font-weight:600">${label}</span><span class="num small"><b>${used}</b> <span class="subtle">/ ${max} ${unit}</span></span></div>${bar(used / max * 100, 'thick ' + cls)}${extra}</div>`;
  return adminShell('billing', `<div class="page">
    ${pageHead('Plan y facturación', 'Tu licencia, lo que estás usando y cómo crecer cuando lo necesites.')}
    <div class="dash-grid" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)">
      <section class="card pad-lg stack s24">
        <div class="row between wrap"><div class="stack s4"><span class="eyebrow">Plan actual</span><h2 style="font-size:28px">Plan ${p.name}</h2><span class="muted small">${p.price} · facturación anual · renueva el ${p.renew}</span></div><div class="row wrap"><button class="btn" data-act="expandSeats">${icon('users')}Ampliar capacidad</button><button class="btn primary" data-act="upgradePlan">${icon('rocket')}Mejorar plan</button></div></div>
        <div class="grid3">
          <div class="panel stack s4"><span class="eyebrow">Capacidad</span><b class="num" style="font-family:var(--f-display);font-size:26px">${p.seats}</b><span class="xs subtle">estudiantes</span></div>
          <div class="panel stack s4"><span class="eyebrow">Utilizados</span><b class="num" style="font-family:var(--f-display);font-size:26px">${p.used}</b><span class="xs subtle">${Math.round(p.used / p.seats * 100)}% del plan</span></div>
          <div class="panel stack s4"><span class="eyebrow">Disponibles</span><b class="num" style="font-family:var(--f-display);font-size:26px;color:var(--sys)">${p.seats - p.used}</b><span class="xs subtle">cupos libres</span></div>
        </div>
        ${meter('Estudiantes', p.used, p.seats, 'cupos')}
        ${meter('Almacenamiento', String(p.storage).replace('.', ','), p.storageMax, 'GB', '', '<span class="xs subtle">Videos 31,2 GB · Documentos 5,9 GB · Otros 1,3 GB</span>')}
        ${meter('Créditos de IA este mes', fmt(p.credits), fmt(p.creditsMax), 'disponibles', 'ai', '<span class="xs subtle">Se renuevan el 1 de noviembre · 760 usados en octubre</span>')}
      </section>
      <section class="card pad stack s16"><h3>Incluido en tu plan</h3>
        <ul class="stack s8" style="list-style:none;margin:0;padding:0">${['Hasta 500 estudiantes', 'Cursos y contenido ilimitados', 'Marca propia: logo, colores y portada', 'Subdominio academianova.aulora.app', 'Certificados con código de validación', 'Eventos virtuales y presenciales', 'Analítica de aprendizaje', '2.000 créditos de IA al mes', 'Soporte por correo y chat'].map(f => `<li class="row small">${icon('check')}<span>${f}</span></li>`).join('')}
        ${['Dominio propio (academia.gruponova.co)', 'Ocultar la marca Aulora', 'SSO y API'].map(f => `<li class="row small subtle">${icon('lock')}<span>${f} · <button class="link xs" data-act="upgradePlan">Plan Scale</button></span></li>`).join('')}</ul>
      </section>
    </div>
    <section class="stack s16"><div><h2>Servicios de contenido</h2><p class="muted small" style="margin-top:4px">Tres formas de tener tus cursos listos, según el tiempo y el nivel de personalización que necesites.</p></div>${tiers()}</section>
    <section class="card"><div class="card-h"><h3>Facturas</h3></div><div class="card-b table-wrap"><table class="t"><thead><tr><th>Fecha</th><th>Concepto</th><th>Valor</th><th>Estado</th><th></th></tr></thead><tbody>
      ${[['14 ene 2026', 'Plan Growth · anual', 'US$ 8.280'], ['3 jun 2026', 'Paquete 1.000 créditos IA', 'US$ 90'], ['14 ene 2025', 'Plan Starter · anual', 'US$ 3.480']].map(([d, c, v]) => `<tr><td class="small">${d}</td><td>${c}</td><td class="num">${v}</td><td><span class="badge ok">Pagada</span></td><td><button class="btn ghost sm" data-act="toast" data-arg="Factura descargada (simulado)">${icon('download')}PDF</button></td></tr>`).join('')}
    </tbody></table></div></section>
  </div>`);
}
function tiers() {
  return `<div class="tiers">
    <div class="card tier"><span class="t-level">NIVEL 1 · INCLUIDO EN TU LICENCIA</span><h3>Contenido propio</h3><p class="small muted">Carga y organiza lo que ya tienes, sin costo adicional.</p><ul>${['Cursos, módulos y lecciones', 'Documentos y PDF', 'Videos y presentaciones', 'Actividades y evaluaciones'].map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul><button class="btn" style="margin-top:auto" data-act="newCourse">${icon('plus')}Crear curso</button></div>
    <div class="card tier ai-t"><span class="t-level" style="color:var(--ai)">NIVEL 2 · SERVICIO ADICIONAL</span><h3>Creación rápida con IA</h3><p class="small muted">Convierte documentos en material educativo en minutos.</p><ul>${['Lecturas estructuradas', 'Presentaciones editables', 'Quizzes con respuestas', 'Siempre editable antes de publicar'].map(x => `<li>${icon('sparkles')}${x}</li>`).join('')}</ul><div class="stack s4"><div class="row between xs"><span class="subtle">Créditos disponibles</span><b class="num">${fmt(S.plan.credits)} / ${fmt(S.plan.creditsMax)}</b></div>${bar(S.plan.credits / S.plan.creditsMax * 100, 'ai')}</div><button class="btn ai" style="margin-top:auto" data-go="admin/ai">${icon('wand')}Abrir AI Course Studio</button></div>
    <div class="card tier premium"><span class="t-level">NIVEL 3 · PREMIUM</span><h3>Curso personalizado</h3><p class="small">Nuestro equipo crea tu curso de principio a fin, con tu marca.</p><ul>${['Diseño instruccional', 'Diseño gráfico y animaciones', 'Producción de video', 'Actividades interactivas', 'Desarrollo integral del curso'].map(x => `<li>${icon('gem')}${x}</li>`).join('')}</ul><button class="btn" style="margin-top:auto;background:var(--bg);color:var(--fg);border:0" data-act="customCourse">Solicitar curso personalizado ${icon('arrowR')}</button></div>
  </div>`;
}
ACT.expandSeats = () => { UI.tmp.seat = 250; openModal(seatsModal); };
function seatsModal() {
  const opts = [[100, 'US$ 120'], [250, 'US$ 270'], [500, 'US$ 480']];
  return `${modalHead('Ampliar capacidad', `Hoy tienes ${S.plan.seats} cupos y usas ${S.plan.used}.`)}<div class="modal-b stack s8">${opts.map(([n, v]) => `<button class="method ${UI.tmp.seat === n ? 'on' : ''}" data-act="seatPick" data-arg="${n}"><span class="m-ico">${icon('users')}</span><span class="grow"><b>+${n} estudiantes</b><span>Total ${S.plan.seats + n} cupos</span></span><b class="num">${v}<span class="xs subtle"> / mes</span></b></button>`).join('')}<p class="xs subtle">El cobro se prorratea hasta tu próxima renovación (${S.plan.renew}).</p></div><div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button><button class="btn primary" data-act="seatDo">Ampliar a ${S.plan.seats + UI.tmp.seat} cupos</button></div>`;
}
ACT.seatPick = el => { UI.tmp.seat = +el.dataset.arg; renderModal(); };
ACT.seatDo = () => { S.plan.seats += UI.tmp.seat; save(); closeModal(); render(); toast(`Capacidad ampliada a ${S.plan.seats} estudiantes`); };
ACT.upgradePlan = () => openModal(() => `${modalHead('Mejorar plan', 'Cambia cuando quieras. Prorrateamos lo que ya pagaste.')}<div class="modal-b"><div class="plans">${[['Growth', '690', '500 estudiantes', ['Marca propia', '2.000 créditos IA / mes', 'Subdominio'], true], ['Scale', '1.490', '2.000 estudiantes', ['Dominio propio', 'Ocultar marca Aulora', '6.000 créditos IA / mes', 'SSO y API'], false], ['Enterprise', 'A medida', 'Estudiantes ilimitados', ['Múltiples universidades', 'Gerente de cuenta', 'SLA 99,9%'], false]].map(([n, pr, s, f, cur]) => `<div class="card plan ${cur ? 'on' : ''}"><div class="row between"><h3>${n}</h3>${cur ? '<span class="badge sys">Actual</span>' : ''}</div><div class="price">${pr === 'A medida' ? pr : 'US$ ' + pr + '<small> / mes</small>'}</div><b class="small">${s}</b><ul>${f.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul>${cur ? '' : `<button class="btn ${n === 'Scale' ? 'primary' : ''}" data-act="toast" data-arg="Solicitud enviada. Un asesor te contactará hoy.">${n === 'Enterprise' ? 'Hablar con ventas' : 'Cambiar a ' + n}</button>`}</div>`).join('')}</div></div>`, 'xwide');

/* Curso personalizado (Nivel 3) */
ACT.customCourse = () => { UI.tmp.cc = { sent: false }; openModal(customModal, 'wide'); };
function customModal() {
  if (UI.tmp.cc.sent) return `${modalHead('Solicitud enviada', 'Gracias. Ya estamos revisando tu proyecto.')}<div class="modal-b stack s16"><div class="done-banner"><span class="db-ico">${icon('check')}</span><div><b>Solicitud #CP-2026-0418</b><br><span class="small muted">Un asesor de diseño instruccional te contactará en menos de 24 horas hábiles para agendar una sesión de diagnóstico.</span></div></div>
    <div class="stack s8 small">${[['1', 'Sesión de diagnóstico (45 min)'], ['2', 'Propuesta y cotización en 3 días hábiles'], ['3', 'Producción con entregas por módulo'], ['4', 'Publicación en tu universidad']].map(([n, t]) => `<div class="row"><span class="badge plain mono">${n}</span>${t}</div>`).join('')}</div></div><div class="modal-f"><button class="btn primary" data-act="closeModal">Entendido</button></div>`;
  const svc = ['Diseño instruccional', 'Diseño gráfico', 'Producción multimedia', 'Videos', 'Animaciones', 'Actividades interactivas', 'Desarrollo integral del curso'];
  return `${modalHead('Solicitar curso personalizado', 'Cuéntanos qué necesitas y te enviaremos una propuesta con alcance, tiempos y cotización.')}
  <form class="modal-b stack s16" id="cc-form" data-submit="ccSend"><div class="grid2"><div class="field"><label for="cc-name">Tema o nombre del curso</label><input class="input" id="cc-name" required placeholder="Ej. Seguridad industrial en planta"></div><div class="field"><label for="cc-aud">Número de participantes</label><select class="select" id="cc-aud"><option>Menos de 100</option><option selected>100 a 500</option><option>Más de 500</option></select></div></div>
  <div class="field"><label for="cc-obj">Objetivo de aprendizaje</label><textarea class="textarea" id="cc-obj" placeholder="¿Qué deben saber hacer las personas al terminar?"></textarea></div>
  <div class="field"><span class="label">Servicios que te interesan</span><div class="row wrap">${svc.map((s, i) => `<label class="chip" style="cursor:pointer"><input type="checkbox" ${i < 2 || i === 3 ? 'checked' : ''} style="accent-color:var(--sys)">${s}</label>`).join('')}</div></div>
  <div class="grid2"><div class="field"><label for="cc-date">Fecha deseada de lanzamiento</label><input class="input" type="date" id="cc-date" value="2027-02-01"></div><div class="field"><label for="cc-mat">Material de referencia</label><button type="button" class="btn" id="cc-mat" data-act="toast" data-arg="Material adjuntado (simulado)">${icon('upload')}Adjuntar archivos</button></div></div></form>
  <div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button><button class="btn dark" type="submit" form="cc-form">${icon('send')}Enviar solicitud</button></div>`;
}
ACT.ccSend = () => { UI.tmp.cc.sent = true; renderModal(); };

/* ==========================================================================
   CONFIGURACIÓN
   ========================================================================== */
function viewSettings() {
  const u = S.uni;
  const row = (t, d, ctrl) => `<div class="row between wrap" style="padding:16px 0;border-bottom:1px solid var(--line)"><div class="stack s4" style="max-width:520px"><b>${t}</b><span class="small muted">${d}</span></div>${ctrl}</div>`;
  return adminShell('settings', `<div class="page" style="max-width:920px">
    ${pageHead('Configuración', 'Ajustes generales de tu universidad digital.')}
    <section class="card pad"><h3>Acceso y dominio</h3>
      ${row('Dirección de tu universidad', 'Tus estudiantes entran desde aquí.', `<span class="mono small" style="padding:8px 12px;background:var(--surface-2);border-radius:8px">${esc(u.subdomain)}.aulora.app</span>`)}
      ${row('Dominio propio', 'Usa una dirección como academia.gruponova.co.', `<button class="btn sm" data-act="upgradePlan">${icon('lock')}Disponible en Scale</button>`)}
      ${row('Registro de estudiantes', 'Quién puede crear una cuenta.', `<select class="select" style="width:auto"><option>Solo por invitación</option><option>Cualquiera con correo @gruponova.co</option></select>`)}
      ${row('Marca del proveedor', 'Muestra “Funciona con Aulora” en el pie de página del estudiante.', `<span class="row small"><span class="switch"><input type="checkbox" checked disabled><span></span></span><span class="subtle">Ocultar en plan Scale</span></span>`)}
    </section>
    <section class="card pad"><h3>Administradores</h3>
      ${[['Laura Méndez', 'Propietaria'], ['Felipe Díaz', 'Editor de contenido'], ['Natalia Ríos', 'Gestión de estudiantes']].map(([n, r]) => row(`<span class="row">${avatar(n, 'sm')}${n}</span>`, r, `<button class="btn ghost sm">${icon('more')}</button>`)).join('')}
      <div style="padding-top:14px"><button class="btn sm" data-act="toast" data-arg="Invitación enviada">${icon('userPlus')}Invitar administrador</button></div>
    </section>
    <section class="card pad"><h3>Idioma y notificaciones</h3>
      ${row('Idioma de la plataforma', 'Para administradores y estudiantes.', `<select class="select" style="width:auto"><option>Español (Latinoamérica)</option><option>English</option><option>Português</option></select>`)}
      ${row('Resumen semanal por correo', 'Indicadores clave cada lunes a las 8:00.', `<span class="switch"><input type="checkbox" checked><span></span></span>`)}
    </section>
    <section class="card pad row between wrap"><div class="stack s4"><b>Datos de demostración</b><span class="small muted">Restablece cursos, estudiantes, marca y progreso al estado inicial del prototipo.</span></div><button class="btn danger" data-act="reset">${icon('refresh')}Restablecer prototipo</button></section>
  </div>`);
}
