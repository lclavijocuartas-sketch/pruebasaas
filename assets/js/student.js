/* ==========================================================================
   Experiencia del estudiante (marca del cliente). Más simple, enfocada en aprender.
   ========================================================================== */
function ensureEnrolled(cid) { if (!S.me.enrolled[cid]) { S.me.enrolled[cid] = { done: [] }; save(); } }
function myProgress(cid) { const c = course(cid), e = S.me.enrolled[cid]; if (!c || !e) return 0; const n = lessonCount(c); return n ? Math.round(e.done.filter(id => findLesson(c, id)).length / n * 100) : 0; }
function nextLesson(cid) { const c = course(cid), e = S.me.enrolled[cid] || { done: [] }; const all = c.modules.flatMap(m => m.lessons); return all.find(l => !e.done.includes(l.id)) || all[all.length - 1]; }
function myCourses() { return Object.keys(S.me.enrolled).map(course).filter(c => c && (c.status !== 'draft' || S.previewFrom)); }
const firstName = () => S.me.name.split(' ')[0];

/* ---------- Shell ---------- */
function stShell(active, content, { bare = false } = {}) {
  const u = S.uni;
  return `<div class="st ${S.previewFrom ? '' : 'no-banner'}" style="${brandVars(u)}">
    ${previewBanner()}
    ${bare ? content : `${studentHeader(u, active)}<main class="st-main">${content}</main>${studentFooter(u)}`}
  </div>`;
}
function previewBanner() {
  if (!S.previewFrom) return '';
  return `<div class="preview-banner" role="status">${icon('eye')}<span class="pb-long">Estás viendo la experiencia del estudiante como <b>${esc(S.me.name)}</b> (cuenta de vista previa)</span><span class="pb-short">Vista de estudiante</span><button class="btn sm" data-act="exitStudent">${icon('arrowL')}<span class="pb-long">Volver al panel de administrador</span><span class="pb-short">Volver al panel</span></button></div>`;
}
ACT.exitStudent = () => { const back = S.previewFrom || 'admin/home'; S.previewFrom = null; go(back); };
function studentHeader(u, active, preview = false) {
  const items = [['home', 'Inicio', 'home'], ['courses', 'Mis cursos', 'book'], ['events', 'Mis eventos', 'calendar'], ['certificates', 'Mis certificados', 'award']];
  const unread = S.me.notifications.filter(n => !n.read).length;
  return `<header class="st-head"><div class="st-head-in">
    <button class="st-brand" ${preview ? '' : 'data-go="student/home"'}>${logoMark(u, 34)}<span>${esc(u.name)}</span></button>
    <nav class="st-nav" aria-label="Navegación del estudiante">${items.map(([k, l, ic]) => `<button class="${active === k ? 'on' : ''}" ${preview ? '' : `data-go="student/${k}"`}>${icon(ic)}<span>${l}</span></button>`).join('')}</nav>
    <div class="grow"></div>
    <div class="menu-wrap"><button class="btn ghost icon" ${preview ? '' : 'data-act="stNotif"'} aria-label="Notificaciones" style="position:relative">${icon('bell')}${unread ? `<span style="position:absolute;top:7px;right:8px;width:8px;height:8px;border-radius:50%;background:var(--brand-accent);box-shadow:0 0 0 2px var(--surface)"></span>` : ''}</button></div>
    <div class="menu-wrap"><button class="row" style="gap:8px" ${preview ? '' : 'data-act="stMe"'} aria-label="Mi cuenta">${avatar(S.me.name, 'sm')}</button></div>
  </div></header>`;
}
function studentFooter(u) {
  return `<footer class="st-foot"><span>© 2026 ${esc(u.name)}</span><span>${esc(u.email)}</span><span>${esc(u.phone)}</span>${u.hideProvider ? '' : `<span class="row" style="gap:4px">${icon('zap')}Funciona con Aulora</span>`}</footer>`;
}
ACT.stNotif = btn => { S.me.notifications.forEach(n => n.read = true); save(); toggleMenu(btn, S.me.notifications.map(n => ({ icon: 'bell', label: n.t.replace(/<[^>]+>/g, ''), go: 'student/home' }))); const m = btn.parentElement.querySelector('.menu'); if (m) m.style.width = '320px'; };
ACT.stMe = btn => toggleMenu(btn, [{ icon: 'user', label: esc(S.me.name), act: 'noop' }, { icon: 'award', label: 'Mis certificados', go: 'student/certificates' }, '-', { icon: 'logout', label: 'Cerrar sesión', go: 'student/login' }]);

/* ---------- Ingreso del estudiante ---------- */
function studentLoginHtml(u, preview = false) {
  return `<div class="auth" style="min-height:${preview ? '820px' : '100vh'}">
    <div class="auth-form" style="justify-content:center;gap:28px">
      <form ${preview ? '' : 'data-submit="studentLogin"'} style="gap:16px">
        ${logoMark(u, 56)}
        <div class="stack s8"><h1>Te damos la bienvenida a ${esc(u.name)}</h1><p class="muted">${esc(u.tagline)}. Ingresa con el correo con el que te invitaron.</p></div>
        <div class="field"><label for="sl-email">Correo</label><input class="input" id="sl-email" type="email" value="${esc(S.me.email)}"></div>
        <div class="field"><label for="sl-pass">Contraseña</label><input class="input" id="sl-pass" type="password" value="contraseña"></div>
        <button class="btn brand lg block">Ingresar</button>
        <div class="row between small"><button type="button" class="link small" ${preview ? '' : 'data-act="toast" data-arg="Te enviamos un enlace de acceso a tu correo"'}>Entrar con un enlace a mi correo</button></div>
        <p class="xs subtle">¿Problemas para entrar? Escribe a ${esc(u.email)}</p>
      </form>
      ${u.hideProvider ? '' : `<span class="xs subtle row" style="gap:4px;justify-content:center">${icon('zap')}Funciona con Aulora</span>`}
    </div>
    <div class="auth-art" style="background:${bannerArt(u)} center/cover;justify-content:flex-end">
      <div style="position:absolute;inset:0;background:linear-gradient(0deg, rgba(10,8,20,.7), rgba(10,8,20,.05) 60%)"></div>
      <div class="stack s16" style="position:relative">${logoMark(u, 44)}<h2>${esc(u.name)}</h2><p style="color:rgba(255,255,255,.85)">${esc(u.description)}</p></div>
    </div>
  </div>`;
}
function viewStudentLogin() { return `<div class="st ${S.previewFrom ? '' : 'no-banner'}" style="${brandVars(S.uni)}">${previewBanner()}${studentLoginHtml(S.uni)}</div>`; }
ACT.studentLogin = () => { const c = UI.tmp.loginCourse; UI.tmp.loginCourse = null; go(c ? `student/course/${c}` : 'student/home'); toast(`Hola, ${firstName()}`); };

/* ---------- Inicio ---------- */
function studentHomeBody(u, preview = false) {
  const mine = myCourses();
  const inProg = mine.filter(c => myProgress(c.id) < 100).sort((a, b) => (b.id === 'c1') - (a.id === 'c1'));
  const done = mine.filter(c => myProgress(c.id) === 100);
  const cur = inProg[0];
  const nl = cur && nextLesson(cur.id);
  const ev = S.events.filter(e => daysUntil(e.date) >= 0 && Object.keys(S.me.enrolled).includes(e.course)).sort((a, b) => a.date.localeCompare(b.date));
  const go_ = r => preview ? '' : `data-go="${r}"`;
  return `<section class="st-hero" style="background-image:${bannerArt(u)}"><div><h1>Hola, ${esc(firstName())}</h1><p>${esc(u.tagline)}. Tienes ${inProg.length} cursos en progreso y ${ev.length} eventos próximos.</p></div></section>
  ${cur ? `<section class="card continue"><div class="cover" style="background-image:${coverArt(cur)}"></div><div class="cn-body">
    <span class="eyebrow" style="color:var(--brand-text)">Continúa donde lo dejaste</span><h2>${esc(cur.title)}</h2>
    <div class="row">${bar(myProgress(cur.id)).replace('class="bar ', 'class="bar thick grow ')}<b class="num">${myProgress(cur.id)}%</b></div>
    <div class="row small muted">${tico(nl.type)}<span>Siguiente: <b style="color:var(--fg)">${esc(nl.title)}</b> · ${TYPES[nl.type].label} · ${nl.dur} min</span></div>
    <div><button class="btn brand" ${go_(`student/course/${cur.id}`)}>${icon('play')}Continuar</button></div></div></section>` : ''}
  <section class="st-stats">${[['book', inProg.length, 'Cursos en progreso'], ['checkCircle', done.length, 'Cursos completados'], ['award', done.length, 'Certificados'], ['clock', '14 h', 'De aprendizaje']].map(([ic, v, l]) => `<div class="card st-stat"><span class="ss-ico">${icon(ic)}</span><div><b class="num">${v}</b><span>${l}</span></div></div>`).join('')}</section>
  <div class="st-cols">
    <section class="stack s16"><div class="row between"><h2>Mis cursos</h2><button class="link small" ${go_('student/courses')}>Ver todos ${icon('arrowR')}</button></div>
      <div class="course-grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">${inProg.slice(0, 3).map(c => stCourseCard(c, u, preview)).join('')}</div></section>
    <aside class="stack s16">
      <section class="card pad stack s8"><span class="eyebrow">Próxima actividad</span>${cur ? `<div class="row">${tico('quiz')}<div class="small grow"><b>Quiz: Feedback efectivo</b><br><span class="subtle">${esc(cur.title)} · recomendado antes del 8 oct</span></div></div>` : '<p class="small muted">Sin actividades pendientes.</p>'}</section>
      <section class="card pad"><div class="row between" style="margin-bottom:4px"><h3>Próximos eventos</h3><button class="link xs" ${go_('student/events')}>Ver</button></div>${ev.slice(0, 2).map(e => `<div class="ev-mini">${datebox(e.date)}<div class="small grow"><b style="font-weight:600">${esc(e.title)}</b><br><span class="subtle">${when(e.date)} · ${e.time} · ${e.mode === 'virtual' ? 'Virtual' : 'Presencial'}</span></div></div>`).join('')}</section>
      <section class="card pad"><h3 style="margin-bottom:4px">Notificaciones</h3>${S.me.notifications.map(n => `<div class="notif ${n.read ? 'read' : ''}"><span class="dot"></span><div class="grow"><div>${n.t}</div><div class="xs subtle">${n.when}</div></div></div>`).join('')}</section>
      ${done.length ? `<section class="card pad row" style="gap:12px"><span class="ss-ico" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--brand-soft);color:var(--brand-text)">${icon('award')}</span><div class="small grow"><b>${done.length} certificados obtenidos</b><br><span class="subtle">Último: ${esc(done[0].title)}</span></div><button class="btn brand-soft sm" ${go_('student/certificates')}>Ver</button></section>` : ''}
    </aside>
  </div>`;
}
function stCourseCard(c, u, preview = false) {
  const p = myProgress(c.id), nl = nextLesson(c.id);
  return `<article class="card ccard ${preview ? '' : 'hover'}" ${preview ? '' : `data-go="student/course/${c.id}"`} tabindex="0">
    <div class="cover" style="background-image:${coverArt(c)}">${p === 100 ? `<div class="cover-badge"><span class="badge ok">Completado</span></div>` : c.status === 'draft' ? `<div class="cover-badge"><span class="badge warn">Vista previa</span></div>` : ''}</div>
    <div class="c-body"><span class="row xs subtle" style="gap:6px">${logoMark(u, 16)}${esc(u.name)}</span><div class="c-title">${esc(c.title)}</div>
      <div class="stack s4"><div class="row between xs"><span class="subtle">${p === 100 ? 'Completado' : p === 0 ? 'Sin empezar' : 'Tu avance'}</span><b class="num">${p}%</b></div>${bar(p)}</div>
      ${p < 100 ? `<div class="xs muted row" style="gap:6px">${icon('arrowR')}<span>Próxima lección: ${esc(nl.title)}</span></div>` : `<div class="xs muted row" style="gap:6px">${icon('award')}<span>Certificado disponible</span></div>`}
      <div class="c-foot" style="border:0;padding-top:4px">${p === 100 ? `<button class="btn brand-soft sm block" ${preview ? '' : 'data-go="student/certificates"'}>Ver certificado</button>` : `<button class="btn brand sm block">${p === 0 ? 'Empezar' : 'Continuar'}</button>`}</div></div></article>`;
}
function viewStudentHome() { return stShell('home', studentHomeBody(S.uni)); }

/* ---------- Mis cursos ---------- */
function viewStudentCourses() {
  const f = UI.tmp.scf || 'progress'; const mine = myCourses();
  const sets = { progress: mine.filter(c => myProgress(c.id) < 100), done: mine.filter(c => myProgress(c.id) === 100), all: mine };
  return stShell('courses', `<div class="stack s8"><h1>Mis cursos</h1><p class="muted">Todos los programas a los que ${esc(S.uni.name)} te ha inscrito.</p></div>
    <div class="tabs">${[['progress', 'En progreso'], ['done', 'Completados'], ['all', 'Todos']].map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-act="scf" data-arg="${k}">${l}<span class="count">${sets[k].length}</span></button>`).join('')}</div>
    ${sets[f].length ? `<div class="course-grid">${sets[f].map(c => stCourseCard(c, S.uni)).join('')}</div>` : `<div class="card empty"><span class="empty-ico">${icon('book')}</span><h3>Nada por aquí todavía</h3><p class="small">Cuando termines un curso aparecerá en esta pestaña.</p></div>`}`);
}
ACT.scf = el => { UI.tmp.scf = el.dataset.arg; render(); };

/* ---------- Interior del curso ---------- */
function viewPlayer(cid, lid) {
  const c = course(cid); if (!c) return viewStudentCourses();
  ensureEnrolled(cid);
  const all = c.modules.flatMap(m => m.lessons);
  if (!all.length) return stShell('courses', `<div class="card empty"><span class="empty-ico">${icon('layers')}</span><h3>Este curso aún no tiene lecciones</h3><p class="small">Vuelve al editor para añadir contenido.</p>${S.previewFrom ? `<button class="btn brand sm" data-act="exitStudent">Volver al editor</button>` : ''}</div>`);
  const l = (lid && all.find(x => x.id === lid)) || nextLesson(cid);
  if (lid !== l.id) S.route = `student/course/${cid}/${l.id}`;
  return stShell('courses', playerHtml(c, l), { bare: true });
}
function playerHtml(c, l, preview = false) {
  const e = S.me.enrolled[c.id] || { done: [] }; const all = c.modules.flatMap(m => m.lessons);
  const i = all.indexOf(l), prev = all[i - 1], next = all[i + 1]; const done = e.done.includes(l.id);
  const { m } = findLesson(c, l.id); const mi = c.modules.indexOf(m);
  const p = preview ? 45 : myProgress(c.id); const nDone = e.done.filter(id => findLesson(c, id)).length;
  const go_ = r => preview ? '' : `data-go="${r}"`;
  return `<div class="player-top">
      <button class="btn ghost sm" ${go_('student/courses')}>${icon('arrowL')}<span>Mis cursos</span></button>
      <div class="grow" style="min-width:0"><b style="font-family:var(--f-display);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.title)}</b><span class="xs subtle">${esc(S.uni.name)}</span></div>
      <div class="pt-prog"><div class="grow">${bar(p, 'thick')}</div><span class="small num" style="white-space:nowrap"><b>${p}%</b> · ${nDone} de ${all.length}</span></div>
    </div>
    <div class="player">
      <aside class="player-side" aria-label="Contenido del curso">${c.modules.map((mod, k) => `<div class="ps-mod"><div class="ps-mod-h"><b>${k + 1}. ${esc(mod.title)}</b><span class="xs subtle num">${mod.lessons.filter(x => e.done.includes(x.id)).length}/${mod.lessons.length}</span></div>
        ${mod.lessons.map(x => `<button class="ps-les ${e.done.includes(x.id) ? 'done' : ''} ${x.id === l.id ? 'on' : ''}" ${go_(`student/course/${c.id}/${x.id}`)}><span class="st-ico">${e.done.includes(x.id) ? icon('check') : ''}</span><span class="grow"><span style="display:block">${esc(x.title)}</span><span class="ps-meta">${icon(TYPES[x.type].icon)}${TYPES[x.type].label} · ${x.dur} min</span></span></button>`).join('')}</div>`).join('')}</aside>
      <div class="player-main">
        <div class="player-content"><div class="pc-in">
          <div class="stack s8"><span class="eyebrow" style="color:var(--brand-text)">Módulo ${mi + 1} · Lección ${m.lessons.indexOf(l) + 1} de ${m.lessons.length}</span><h1>${esc(l.title)}</h1><div class="row small muted">${tico(l.type)}${TYPES[l.type].label} · ${l.dur} min${done ? ` · <span class="badge ok">Completada</span>` : ''}</div></div>
          ${lessonContent(c, l, preview)}
          ${next ? `<div class="panel row" style="gap:12px"><span class="eyebrow">Lo que sigue</span>${tico(next.type)}<span class="small grow"><b>${esc(next.title)}</b> · ${next.dur} min</span></div>` : `<div class="panel row" style="gap:12px">${icon('flag')}<span class="small">Esta es la última lección del curso.</span></div>`}
        </div></div>
        <nav class="player-nav" aria-label="Navegación entre lecciones">
          <button class="btn" ${prev ? go_(`student/course/${c.id}/${prev.id}`) : 'disabled'}>${icon('arrowL')}<span>Anterior</span></button>
          <span class="next-hint">${done ? 'Lección completada' : 'Cuando termines, márcala como completada'}</span>
          ${l.type === 'quiz' || l.type === 'exam' ? (done ? `<button class="btn" disabled>${icon('check')}Aprobado</button>` : `<button class="btn" disabled>Aprueba el quiz para completar</button>`) : done ? `<button class="btn" ${preview ? '' : `data-act="toggleDone" data-arg="${c.id}:${l.id}"`}>${icon('check')}<span>Completada</span></button>` : `<button class="btn brand-soft" ${preview ? '' : `data-act="toggleDone" data-arg="${c.id}:${l.id}"`}>${icon('checkCircle')}<span>Marcar como completado</span></button>`}
          <button class="btn brand" ${next ? go_(`student/course/${c.id}/${next.id}`) : (preview ? '' : `data-act="finishCourse" data-arg="${c.id}"`)}><span>${next ? 'Siguiente' : 'Finalizar'}</span>${icon('arrowR')}</button>
        </nav>
      </div>
    </div>`;
}
function studentPlayerPreview(u) { const c = course('c1'); const l = c.modules[1].lessons[2]; return `<div class="no-sticky">${playerHtml(c, l, true)}</div>`; }

function lessonContent(c, l, preview) {
  const u = S.uni;
  if (l.html) return `<article class="prose">${l.html}</article>`;
  if (l.type === 'reading' || l.type === 'text') {
    const blocks = l.blocks || defaultBlocks(l);
    return `<article class="prose">${blocks.map(b => b.kind === 'h2' ? `<h2>${esc(b.text)}</h2>` : b.kind === 'callout' ? `<div class="summary">${esc(b.text)}</div>` : b.kind === 'image' ? `<div class="media-ph" style="border-radius:14px;background-image:${coverArt({ motif: 'wave', hue: 262 })};margin-bottom:14px"></div>` : `<p>${esc(b.text)}</p>`).join('')}</article>`;
  }
  if (l.type === 'video') {
    const playing = UI.tmp.playing === l.id;
    return `<div class="media-card"><div class="media-ph" style="background-image:${coverArt(c)}">${playing ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,.35)"></div><div style="position:absolute;left:16px;right:16px;bottom:14px;display:flex;align-items:center;gap:10px;color:#fff;font-size:12px"><span>${icon('play')}</span><div class="bar grow" style="background:rgba(255,255,255,.3)"><i style="width:0;background:var(--brand-accent);animation:vid 20s linear forwards"></i></div><span class="num">${l.dur}:12</span></div><style>@keyframes vid{to{width:100%}}</style>` : `<button class="play" ${preview ? '' : `data-act="playVideo" data-arg="${l.id}"`} aria-label="Reproducir video">${icon('play')}</button>`}</div>
      <div class="mc-body small"><span class="grow muted">${l.desc || 'Mira el video completo. Puedes activar los subtítulos y ajustar la velocidad.'}</span><span class="badge plain">CC Español</span><span class="badge plain">1x</span></div></div>
      <details class="card pad"><summary style="cursor:pointer;font-weight:600">Transcripción</summary><p class="small muted" style="margin-top:10px">Hola y bienvenido. En los próximos minutos vamos a recorrer las ideas principales de esta lección y cómo llevarlas a tu día a día…</p></details>`;
  }
  if (l.type === 'pdf') return `<div class="pdf-view"><div class="pv-bar"><span class="row">${icon('fileText')}<b>${esc(slug(l.title))}.pdf</b></span><span class="row subtle"><span>Página 1 de 18</span><button class="btn ghost icon sm" aria-label="Pantalla completa">${icon('maximize')}</button><button class="btn ghost icon sm" ${preview ? '' : 'data-act="toast" data-arg="Descarga iniciada (simulado)"'} aria-label="Descargar">${icon('download')}</button></span></div>
    <div class="pv-page"><div class="pv-sheet"><div class="row" style="gap:8px">${logoMark(u, 22)}<b style="font-size:11px">${esc(u.name)}</b></div><b style="font-size:16px;font-family:var(--f-display);margin-top:8px">${esc(l.title)}</b>${[90, 100, 96, 70, 0, 100, 88, 94, 60, 0, 100, 82].map(w => w ? `<span class="ln" style="width:${w}%"></span>` : '<span style="height:6px"></span>').join('')}</div></div></div>`;
  if (l.type === 'slides') {
    const sl = l.slides || SAMPLE_SLIDES; const k = Math.min(UI.tmp.slideIdx?.[l.id] || 0, sl.length - 1);
    return `<div class="stack s8">${slideHtml(sl[k], k, sl.length)}<div class="row between"><button class="btn sm" ${preview || k === 0 ? 'disabled' : `data-act="stSlide" data-arg="${l.id}:${k - 1}"`}>${icon('chevL')}Anterior</button><span class="small muted num">${k + 1} / ${sl.length}</span><button class="btn sm" ${preview || k === sl.length - 1 ? 'disabled' : `data-act="stSlide" data-arg="${l.id}:${k + 1}"`}>Siguiente${icon('chevR')}</button></div></div>`;
  }
  if (l.type === 'link') return `<div class="card pad row wrap" style="gap:16px"><span class="tico t-link" style="width:56px;height:56px;border-radius:14px">${icon('globe')}</span><div class="grow"><b>Radical Candor · Our approach</b><br><span class="small muted">${l.desc || 'Lee el artículo y anota una idea que quieras aplicar esta semana.'}</span></div><a class="btn brand" href="https://www.radicalcandor.com/our-approach/" target="_blank" rel="noopener">${icon('external')}Abrir recurso</a></div>`;
  if (l.type === 'file') return `<div class="card pad row wrap" style="gap:16px"><span class="tico t-file" style="width:56px;height:56px;border-radius:14px">${icon('fileDown')}</span><div class="grow"><b>${esc(slug(l.title))}.xlsx</b><br><span class="small muted">84 KB · ${l.desc || 'Descarga la plantilla y complétala durante la actividad.'}</span></div><button class="btn brand" ${preview ? '' : 'data-act="toast" data-arg="Archivo descargado (simulado)"'}>${icon('download')}Descargar</button></div>`;
  if (l.type === 'activity') {
    const e = S.me.enrolled[c.id]; const sent = e.done.includes(l.id);
    return `<div class="card pad stack s16"><div class="row">${icon('target')}<b>Instrucciones</b></div><p>${esc(l.desc || 'Piensa en una situación real de tu trabajo y aplica lo aprendido en este módulo. Describe qué harías, con quién y en qué plazo.')}</p>
      ${sent ? `<div class="done-banner"><span class="db-ico">${icon('check')}</span><div><b>Entrega enviada</b><br><span class="small muted">Tu líder de formación la revisará esta semana.</span></div></div>` : `<div class="field"><label for="act-ans">Tu respuesta</label><textarea class="textarea" id="act-ans" style="min-height:140px" placeholder="Escribe aquí tu respuesta…"></textarea></div><div class="row"><button class="btn" ${preview ? '' : 'data-act="toast" data-arg="Borrador guardado"'}>Guardar borrador</button><button class="btn brand" ${preview ? '' : `data-act="sendActivity" data-arg="${c.id}:${l.id}"`}>${icon('send')}Enviar entrega</button></div>`}</div>`;
  }
  if (l.type === 'quiz' || l.type === 'exam') return quizHtml(c, l, preview);
  return '';
}
ACT.playVideo = el => { UI.tmp.playing = el.dataset.arg; render(); };
ACT.stSlide = el => { const [lid, k] = el.dataset.arg.split(':'); UI.tmp.slideIdx = UI.tmp.slideIdx || {}; UI.tmp.slideIdx[lid] = +k; render(); };
ACT.sendActivity = el => { const [cid, lid] = el.dataset.arg.split(':'); markDone(cid, lid, true); toast('Entrega enviada. Lección completada.'); };
ACT.toggleDone = el => { const [cid, lid] = el.dataset.arg.split(':'); const e = S.me.enrolled[cid]; if (e.done.includes(lid)) { e.done = e.done.filter(x => x !== lid); save(); render(); toast('Lección marcada como pendiente'); } else { markDone(cid, lid); } };
function markDone(cid, lid, quiet) {
  const e = S.me.enrolled[cid]; if (!e.done.includes(lid)) e.done.push(lid);
  save(); render(); window.scrollTo(0, 0);
  if (myProgress(cid) === 100 && !e.completedOn) return courseCompleted(cid);
  if (!quiet) { const nl = nextLesson(cid); toast(`¡Bien hecho! Llevas ${myProgress(cid)}% del curso`); }
}
ACT.finishCourse = el => { const cid = el.dataset.arg; if (myProgress(cid) === 100) courseCompleted(cid); else { const nl = nextLesson(cid); toast(`Te falta completar “${esc(nl.title)}”`, 'warn'); go(`student/course/${cid}/${nl.id}`); } };
function courseCompleted(cid) {
  const e = S.me.enrolled[cid], c = course(cid);
  e.completedOn = e.completedOn || `${TODAY.getDate()} ${MON[TODAY.getMonth()]} 2026`; e.code = e.code || 'AN-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-2026';
  S.me.notifications.unshift({ t: `Obtuviste el certificado de <b>${esc(c.title)}</b>.`, when: 'Justo ahora', read: false }); S.certs.issued++; save();
  openModal(() => `<div class="st" style="${brandVars(S.uni)};background:transparent"><div class="modal-b stack s16" style="text-align:center;align-items:center;padding-top:28px"><span class="badge ok">${icon('award')}Curso completado</span><h2>¡Felicitaciones, ${esc(firstName())}!</h2><p class="muted">Terminaste <b>${esc(c.title)}</b>. Tu certificado ya está disponible.</p>${certificate(S.uni, { student: S.me.name, courseTitle: c.title, date: 'Hoy', code: e.code })}</div>
    <div class="modal-f" style="justify-content:center"><button class="btn" data-act="closeModal">Seguir aquí</button><button class="btn brand" data-go="student/certificates">${icon('award')}Ver mis certificados</button></div></div>`, 'wide');
}

/* ---------- Quiz del estudiante ---------- */
function quizHtml(c, l, preview) {
  const qs = (l.questions && l.questions.length ? l.questions : FEEDBACK_QUIZ);
  const st = (S.me.quiz[l.id] = S.me.quiz[l.id] || { answers: {}, submitted: false });
  const answered = Object.keys(st.answers).length;
  const L = 'ABCDE';
  return `<div class="stack s16">
    ${st.submitted ? `<div class="card pad row wrap" style="gap:18px">${ring(st.score, 84, 8, st.score >= 70 ? 'var(--ok)' : 'var(--bad)')}<div class="grow stack s4"><h3>${st.score >= 70 ? '¡Aprobaste el quiz!' : 'Aún no alcanzas la nota mínima'}</h3><span class="small muted">${st.correct} de ${qs.length} respuestas correctas · nota mínima 70</span></div>${st.score >= 70 ? '' : `<button class="btn brand" data-act="quizRetry" data-arg="${l.id}">${icon('refresh')}Intentar de nuevo</button>`}</div>` : `<div class="row between small"><span class="muted">${qs.length} preguntas · nota mínima 70 · intentos ilimitados</span><span class="num"><b>${answered}</b> / ${qs.length} respondidas</span></div>${bar(answered / qs.length * 100)}`}
    ${qs.map((q, qi) => `<section class="card qcard"><span class="q-n">PREGUNTA ${qi + 1} DE ${qs.length}</span><div class="q-text">${esc(q.q)}</div>
      <div class="stack s8">${q.options.map((o, oi) => { const sel = st.answers[qi] === oi; let cls = sel ? 'sel' : ''; if (st.submitted) cls = oi === q.correct && sel ? 'right' : sel ? 'wrong' : oi === q.correct ? 'right' : ''; return `<button class="answer ${cls}" ${preview || st.submitted ? '' : `data-act="quizAns" data-arg="${l.id}:${qi}:${oi}"`} aria-pressed="${sel}"><span class="letter">${L[oi]}</span><span class="grow">${esc(o)}</span>${st.submitted && oi === q.correct ? icon('check') : ''}</button>`; }).join('')}</div></section>`).join('')}
    ${st.submitted ? '' : `<button class="btn brand lg" ${preview || answered < qs.length ? 'disabled' : `data-act="quizSubmit" data-arg="${c.id}:${l.id}"`}>${answered < qs.length ? `Responde las ${qs.length} preguntas para enviar` : 'Enviar respuestas'}</button>`}
  </div>`;
}
ACT.quizAns = el => { const [lid, qi, oi] = el.dataset.arg.split(':'); S.me.quiz[lid].answers[qi] = +oi; save(); const y = window.scrollY; render(); window.scrollTo(0, y); };
ACT.quizSubmit = el => {
  const [cid, lid] = el.dataset.arg.split(':'); const l = findLesson(course(cid), lid).l; const qs = l.questions && l.questions.length ? l.questions : FEEDBACK_QUIZ;
  const st = S.me.quiz[lid]; st.correct = qs.filter((q, i) => st.answers[i] === q.correct).length; st.score = Math.round(st.correct / qs.length * 100); st.submitted = true;
  if (cid === 'c1') S.me.quiz.score = st.score;
  if (st.score >= 70) markDone(cid, lid, true); else { save(); render(); }
  toast(st.score >= 70 ? `Aprobaste con ${st.score}/100` : `Obtuviste ${st.score}/100. Revisa las respuestas e inténtalo de nuevo.`, st.score >= 70 ? '' : 'warn');
};
ACT.quizRetry = el => { S.me.quiz[el.dataset.arg] = { answers: {}, submitted: false }; save(); render(); };

/* ---------- Mis eventos ---------- */
function viewStudentEvents() {
  const f = UI.tmp.sef || 'up';
  const mine = S.events.filter(e => Object.keys(S.me.enrolled).includes(e.course)).sort((a, b) => a.date.localeCompare(b.date));
  const list = f === 'up' ? mine.filter(e => daysUntil(e.date) >= 0) : [{ id: 'p1', title: 'Bienvenida Cohorte 3', date: '2026-09-02', time: '09:00', end: '10:00', mode: 'virtual', course: 'c1', place: 'Zoom' }];
  return stShell('events', `<div class="stack s8"><h1>Mis eventos</h1><p class="muted">Sesiones en vivo y encuentros de tus cursos.</p></div>
    <div class="tabs">${[['up', 'Próximos'], ['past', 'Anteriores']].map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-act="sef" data-arg="${k}">${l}</button>`).join('')}</div>
    <div class="stack s16">${list.map(e => `<article class="card pad row wrap" style="gap:18px">${datebox(e.date)}<div class="grow stack s4" style="min-width:220px"><div class="row wrap">${modeBadge(e)}${f === 'up' && daysUntil(e.date) <= 7 ? `<span class="badge brand">${when(e.date)}</span>` : ''}</div><h3>${esc(e.title)}</h3>
      <div class="row wrap small muted" style="gap:14px"><span class="row" style="gap:6px">${icon('calendar')}${longDate(e.date)}</span><span class="row" style="gap:6px">${icon('clock')}${e.time} – ${e.end}</span><span class="row" style="gap:6px">${icon('book')}${esc(course(e.course)?.title || '')}</span></div></div>
      <div class="row">${f === 'past' ? `<button class="btn sm" data-act="toast" data-arg="Grabación disponible próximamente">${icon('play')}Ver grabación</button>` : e.mode === 'virtual' ? `<button class="btn sm" data-act="stEventInfo" data-arg="${e.id}">Ver información</button><button class="btn brand sm" data-act="joinEvent" data-arg="${e.id}">${icon('video')}Ingresar al evento</button>` : `<button class="btn sm" data-act="toast" data-arg="Evento añadido a tu calendario">${icon('calendar')}Añadir a mi calendario</button><button class="btn brand sm" data-act="stEventInfo" data-arg="${e.id}">Ver información</button>`}</div></article>`).join('') || `<div class="card empty"><span class="empty-ico">${icon('calendar')}</span><h3>No tienes eventos</h3></div>`}</div>`);
}
ACT.sef = el => { UI.tmp.sef = el.dataset.arg; render(); };
ACT.joinEvent = el => { const e = S.events.find(x => x.id === el.dataset.arg); toast(daysUntil(e.date) > 0 ? `La sala se abre 10 minutos antes (${longDate(e.date)}, ${e.time})` : `Abriendo ${e.place}…`); };
ACT.stEventInfo = el => { const e = S.events.find(x => x.id === el.dataset.arg); openModal(() => `<div class="st" style="${brandVars(S.uni)};background:transparent">${modalHead(esc(e.title), `${longDate(e.date)} · ${e.time} – ${e.end}`)}<div class="modal-b stack s16">${modeBadge(e)}<p>${esc(e.desc)}</p><div class="panel stack s8 small"><div class="row">${icon(e.mode === 'virtual' ? 'link' : 'pin')}<span class="${e.mode === 'virtual' ? 'mono' : ''}">${esc(e.mode === 'virtual' ? e.link : e.place)}</span></div><div class="row">${icon('book')}${esc(course(e.course)?.title || '')}</div><div class="row">${icon('bell')}Te recordaremos ${e.reminders.join(' y ')}</div></div>${e.mode === 'presencial' ? `<div class="media-ph" style="border-radius:12px;background-image:${bannerArt(S.uni, 'campus')}"><span class="badge" style="background:var(--surface)">${icon('pin')}${esc(e.place)}</span></div>` : ''}</div><div class="modal-f"><button class="btn" data-act="toast" data-arg="Añadido a tu calendario">${icon('calendar')}Añadir a mi calendario</button>${e.mode === 'virtual' ? `<button class="btn brand" data-act="joinEvent" data-arg="${e.id}">Ingresar al evento</button>` : `<button class="btn brand" data-act="toast" data-arg="Asistencia confirmada">${icon('check')}Confirmar asistencia</button>`}</div></div>`); };

/* ---------- Mis certificados ---------- */
function viewStudentCerts() {
  const mine = myCourses().filter(c => myProgress(c.id) === 100);
  const next = myCourses().filter(c => myProgress(c.id) < 100 && c.certificate);
  return stShell('certificates', `<div class="stack s8"><h1>Mis certificados</h1><p class="muted">Certificados emitidos por ${esc(S.uni.name)}. Cada uno tiene un código de validación público.</p></div>
    ${mine.length ? `<div class="course-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${mine.map(c => { const e = S.me.enrolled[c.id]; return `<article class="card" style="overflow:hidden"><div style="padding:16px;background:var(--surface-2)">${certificate(S.uni, { student: S.me.name, courseTitle: c.title, date: e.completedOn || '', code: e.code || 'AN-0000-2026' })}</div><div class="c-body stack s8" style="padding:16px"><b style="font-family:var(--f-display)">${esc(c.title)}</b><span class="xs subtle">Emitido el ${e.completedOn} · <span class="mono">${e.code}</span></span>
      <div class="row wrap"><button class="btn sm" data-act="stCertView" data-arg="${c.id}">${icon('eye')}Ver</button><button class="btn sm" data-act="toast" data-arg="Certificado descargado en PDF (simulado)">${icon('download')}Descargar</button><button class="btn brand sm" data-act="stCertShare" data-arg="${c.id}">${icon('share')}Compartir</button></div></div></article>`; }).join('')}</div>` : `<div class="card empty"><span class="empty-ico">${icon('award')}</span><h3>Aún no tienes certificados</h3><p class="small">Completa un curso para obtener tu primer certificado.</p></div>`}
    ${next.length ? `<section class="stack s16"><h2>Próximos certificados</h2><div class="stack s8">${next.map(c => `<div class="card pad row wrap" style="gap:14px"><span class="thumb" style="background-image:${coverArt(c)}"></span><div class="grow stack s4" style="min-width:200px"><b class="small">${esc(c.title)}</b>${bar(myProgress(c.id))}</div><span class="small num muted">${myProgress(c.id)}%</span><button class="btn brand-soft sm" data-go="student/course/${c.id}">Continuar</button></div>`).join('')}</div></section>` : ''}`);
}
ACT.stCertView = el => { const c = course(el.dataset.arg), e = S.me.enrolled[c.id]; openModal(() => `<div style="${brandVars(S.uni)}">${modalHead(esc(c.title))}<div class="modal-b">${certificate(S.uni, { student: S.me.name, courseTitle: c.title, date: e.completedOn, code: e.code })}</div><div class="modal-f"><button class="btn" data-act="toast" data-arg="Descargado en PDF (simulado)">${icon('download')}Descargar PDF</button><button class="btn brand" data-act="stCertShare" data-arg="${c.id}">${icon('share')}Compartir</button></div></div>`, 'wide'); };
ACT.stCertShare = el => { const c = course(el.dataset.arg), e = S.me.enrolled[c.id]; const url = `https://${S.uni.subdomain}.aulora.app/v/${e.code}`; openModal(() => `<div style="${brandVars(S.uni)}">${modalHead('Compartir certificado', esc(c.title))}<div class="modal-b stack s16"><div class="field"><label for="sh-url">Enlace de verificación</label><div class="row"><input class="input mono" id="sh-url" readonly value="${url}"><button class="btn" data-act="copyUrl">${icon('copy')}Copiar</button></div></div><div class="row wrap"><a class="btn" href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(c.title)}&organizationName=${encodeURIComponent(S.uni.name)}" target="_blank" rel="noopener">${icon('external')}Añadir a LinkedIn</a><button class="btn" data-act="toast" data-arg="Imagen del certificado lista para compartir (simulado)">${icon('image')}Descargar imagen</button></div></div></div>`); };
ACT.copyUrl = () => { const inp = $('#sh-url'); navigator.clipboard?.writeText(inp.value).then(() => toast('Enlace copiado'), () => { inp.select(); toast('Selecciona y copia el enlace'); }); };
