/* ==========================================================================
   Login, compra de licencia, onboarding y Mi Universidad (editor de marca)
   ========================================================================== */
const PRIMARY_SWATCHES = ['#6D3FD8', '#2F5BD3', '#0C7A64', '#C2410C', '#BE185D', '#0E7490', '#1F2937', '#B45309'];
const ACCENT_SWATCHES = ['#F5A524', '#22C55E', '#38BDF8', '#F472B6', '#FACC15', '#FB7185', '#A3E635', '#FFFFFF'];
const LOGO_STYLES = [['spark', 'Destello'], ['monogram', 'Iniciales'], ['arc', 'Arco']];
const auloraLogo = () => `<span class="logo-aulora"><span class="mk">${icon('cap')}</span>Aulora</span>`;

/* ---------- Login administrador ---------- */
function viewLogin() {
  const tenants = [
    { name: 'Academia Nova', primary: '#6D3FD8', accent: '#F5A524', logoStyle: 'spark' },
    { name: 'Instituto Andino', primary: '#0E7490', accent: '#FACC15', logoStyle: 'arc' },
    { name: 'Escuela Rumbo', primary: '#C2410C', accent: '#38BDF8', logoStyle: 'monogram' },
  ];
  return `<div class="auth">
    <div class="auth-form">
      ${auloraLogo()}
      <form data-submit="adminLogin">
        <div class="stack s8"><h1>Entra a tu panel</h1><p class="muted">Administra tu universidad digital: cursos, estudiantes y marca.</p></div>
        <div class="field"><label for="lg-email">Correo</label><input class="input" id="lg-email" type="email" value="${esc(S.admin.email)}" autocomplete="username"></div>
        <div class="field"><div class="row between"><label for="lg-pass">Contraseña</label><button type="button" class="link xs" data-act="toast" data-arg="Te enviamos un enlace para restablecer tu contraseña">¿La olvidaste?</button></div><input class="input" id="lg-pass" type="password" value="demo-aulora" autocomplete="current-password"></div>
        <button class="btn primary lg block">Ingresar ${icon('arrowR')}</button>
        <button type="button" class="btn lg block" data-act="toast" data-arg="Inicio de sesión con Google (simulado)">${icon('globe')}Continuar con Google</button>
        <div class="panel stack s8 small"><b>¿Aún no tienes tu universidad?</b><span class="muted">Compra una licencia y tenla lista hoy mismo.</span><button type="button" class="link" data-go="checkout">Ver planes y comprar licencia ${icon('arrowR')}</button></div>
      </form>
      <div class="row between xs subtle wrap"><span>© 2026 Aulora</span><button class="link xs" data-go="student/login">${icon('cap')}Soy estudiante</button></div>
    </div>
    <div class="auth-art">
      <div class="layers-demo" aria-hidden="true">
        <div class="ld" style="left:0;top:10px;width:250px;background:#E8F6F1;color:#0B2A23"><span class="xs" style="font-weight:700;letter-spacing:.08em">1 · SAAS BASE</span><b>Infraestructura Aulora</b><span class="xs" style="opacity:.7">Cursos, estudiantes, certificados, IA</span></div>
        ${tenants.map((t, i) => `<div class="ld" style="left:${140 + i * 36}px;top:${70 + i * 34}px;width:250px;background:#fff;color:#16141F;border-top:4px solid ${t.primary}"><span class="row" style="gap:8px">${logoMark(t, 26)}<b>${t.name}</b></span><span class="xs" style="opacity:.6">${t.name.toLowerCase().replace(/\s/g, '')}.aulora.app</span></div>`).join('')}
        <div class="ld" style="right:0;bottom:0;width:210px;background:${'#6D3FD8'};color:#fff"><span class="xs" style="font-weight:700;letter-spacing:.08em;opacity:.8">3 · ESTUDIANTE</span><b>Hola, Camila</b><div style="height:6px;border-radius:9px;background:rgba(255,255,255,.25)"><div style="width:45%;height:100%;border-radius:9px;background:#F5A524"></div></div><span class="xs" style="opacity:.8">Liderazgo · 45%</span></div>
      </div>
      <h2>Tu universidad, con tu marca, lista para formar a tus estudiantes.</h2>
      <p>Una sola plataforma, tantas universidades como clientes. Cada una con su nombre, logo, colores y contenidos.</p>
    </div>
  </div>`;
}
ACT.adminLogin = () => go(S.onboarded ? 'admin/home' : 'onboarding/1');

/* ---------- Compra de licencia ---------- */
function viewCheckout() {
  const sel = UI.tmp.plan || 'Growth';
  const plans = [['Starter', '290', 150, ['Marca propia', '500 créditos IA / mes', 'Certificados y eventos']], ['Growth', '690', 500, ['Todo lo de Starter', '2.000 créditos IA / mes', 'Analítica avanzada', 'Importación desde otros LMS']], ['Scale', '1.490', 2000, ['Todo lo de Growth', 'Dominio propio', 'Ocultar marca Aulora', 'SSO y API']]];
  return `<div class="page" style="max-width:1080px;padding-block:32px">
    <div class="row between">${auloraLogo()}<button class="btn ghost sm" data-go="login">${icon('arrowL')}Volver</button></div>
    <div class="stack s8" style="text-align:center;align-items:center;margin-top:12px"><span class="badge sys plain">Paso 1 de 2 · Licencia</span><h1 style="font-size:34px">Elige la capacidad de tu universidad</h1><p class="muted" style="max-width:56ch">Pagas por estudiantes activos en tu universidad. Cursos, contenido y personalización de marca incluidos en todos los planes.</p></div>
    <div class="plans">${plans.map(([n, pr, seats, f]) => `<div class="card plan ${sel === n ? 'on' : ''}" data-act="pickPlan" data-arg="${n}" tabindex="0" role="button" aria-pressed="${sel === n}">
      <div class="row between"><h3>${n}</h3>${n === 'Growth' ? '<span class="badge sys">Más elegido</span>' : ''}</div>
      <div class="price">US$ ${pr}<small> / mes</small></div><b>${fmt(seats)} estudiantes</b>
      <ul>${f.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul></div>`).join('')}</div>
    <form class="card pad-lg grid2" data-submit="buy" style="align-items:end">
      <div class="field"><label for="co-org">Nombre de tu organización</label><input class="input" id="co-org" value="Grupo Nova S.A.S." required></div>
      <div class="field"><label for="co-mail">Correo del administrador</label><input class="input" id="co-mail" type="email" value="${esc(S.admin.email)}" required></div>
      <div class="field"><label for="co-card">Tarjeta</label><div class="input-icon">${icon('card')}<input class="input" id="co-card" value="Tarjeta de prueba •••• 4242" readonly></div><span class="hint">Pago simulado: no se realiza ningún cobro.</span></div>
      <button class="btn primary lg">${icon('lock')}Comprar ${sel} y configurar mi universidad</button>
    </form>
  </div>`;
}
ACT.pickPlan = el => { UI.tmp.plan = el.dataset.arg; render(); };
ACT.buy = () => {
  const n = UI.tmp.plan || 'Growth'; const seats = { Starter: 150, Growth: 500, Scale: 2000 }[n];
  S.plan.name = n; S.plan.seats = seats;
  Object.assign(S.uni, { primary: '#2F5BD3', accent: '#F5A524', logo: null, logoStyle: 'monogram', banner: 'aurora', bannerImg: null });
  S.onboarded = false; UI.tmp.onb = { methods: ['existing', 'ai'], manual: [], csv: false, picked: ['c1', 'c4', 'c3'] }; save();
  go('onboarding/1'); toast(`Licencia ${n} activada · ${seats} estudiantes`);
};

/* ---------- Onboarding ---------- */
const ONB_STEPS = [['Dale identidad a tu universidad', 'Nombre, logo y colores'], ['Añade tus cursos', 'Existentes, nuevos o con IA'], ['Matricula tus estudiantes', 'Manual o con Excel / CSV'], ['Publica tu universidad', 'Revisa y lanza']];
function viewOnboarding(step) {
  const o = UI.tmp.onb || (UI.tmp.onb = { methods: ['existing', 'ai'], manual: [], csv: false, picked: ['c1', 'c4', 'c3'] });
  if (step === 'done') return onbDone();
  const n = Math.max(1, Math.min(4, +step || 1));
  const body = n === 1 ? onbIdentity() : n === 2 ? onbCourses(o) : n === 3 ? onbStudents(o) : onbPublish();
  return `<div class="onb">
    <aside class="onb-side">
      <div class="os-head">${`<span class="logo-aulora" style="color:var(--bg)"><span class="mk">${icon('cap')}</span>Aulora</span>`}</div>
      <div class="stack s16">${ONB_STEPS.map(([t, d], i) => `<button class="os-step ${i + 1 === n ? 'on' : i + 1 < n ? 'done' : ''}" style="text-align:left;color:inherit" data-go="onboarding/${i + 1}"><span class="os-n">${i + 1 < n ? icon('check') : i + 1}</span><span><b>${t}</b><span>${d}</span></span></button>`).join('')}</div>
      <div class="os-head" style="margin-top:auto;font-size:12.5px;opacity:.7">Licencia ${S.plan.name} · ${fmt(S.plan.seats)} estudiantes<br>Puedes cambiar todo esto después.</div>
    </aside>
    <main class="onb-main">
      <div class="stack s8"><span class="eyebrow">Paso ${n} de 4</span><h1>${ONB_STEPS[n - 1][0]}</h1></div>
      ${body}
      <div class="onb-foot">${n > 1 ? `<button class="btn" data-go="onboarding/${n - 1}">${icon('arrowL')}Atrás</button>` : `<span></span>`}
        <div class="row">${n < 4 ? `<button class="btn ghost" data-go="onboarding/${n + 1}">Omitir por ahora</button><button class="btn primary" data-go="onboarding/${n + 1}">Continuar ${icon('arrowR')}</button>` : `<button class="btn primary lg" data-act="publishUni">${icon('rocket')}Publicar universidad</button>`}</div></div>
    </main>
  </div>`;
}
function onbIdentity() {
  return `<div class="onb-cols">
    <div class="stack s16">${identityFields()}${colorFields()}${bannerFields()}</div>
    <div class="stack s8" style="position:sticky;top:24px"><div class="row between"><span class="eyebrow">Previsualización</span><span class="xs subtle mono">${esc(S.uni.subdomain)}.aulora.app</span></div>${region('onbPreview')}</div>
  </div>`;
}
REG.onbPreview = () => devicePreview(S.uni, 'login', 'desktop', 'onb');
function onbCourses(o) {
  const opts = [['existing', 'link', 'Añadir cursos existentes', 'Enlaces y materiales que ya tienes'], ['scratch', 'plus', 'Crear un curso desde cero', 'Organiza módulos y lecciones'], ['lms', 'plug', 'Integrar desde otro LMS', 'Moodle, Canvas, SCORM…'], ['upload', 'upload', 'Subir documentos y videos', 'PDF, Word, PPT, MP4'], ['ai', 'sparkles', 'Crear contenido rápido con IA', 'Lecturas, presentaciones y quizzes']];
  return `<div class="stack s24" style="max-width:920px">
    <p class="muted">Elige cómo quieres empezar. Puedes combinar varias opciones.</p>
    <div class="methods" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${opts.map(([k, ic, t, d]) => `<button class="method ${k === 'ai' ? 'ai' : ''} ${o.methods.includes(k) ? 'on' : ''}" data-act="onbMethod" data-arg="${k}" aria-pressed="${o.methods.includes(k)}"><span class="m-ico">${icon(ic)}</span><span class="grow"><b>${t}</b><span>${d}</span></span>${o.methods.includes(k) ? `<span class="badge sys plain">${icon('check')}</span>` : ''}</button>`).join('')}</div>
    ${o.methods.includes('upload') ? `<div class="dropzone" data-act="toast" data-arg="Archivos añadidos a la biblioteca (simulado)"><span class="dz-ico">${icon('upload')}</span><b>Arrastra tus documentos, presentaciones o videos</b><span class="small subtle">Los organizaremos en un curso que podrás editar</span></div>` : ''}
    ${o.methods.includes('ai') ? `<div class="alert ai">${icon('sparkles')}<div class="small grow">Tu plan incluye <b>${fmt(S.plan.creditsMax)} créditos de IA al mes</b>. Después del lanzamiento, abre AI Course Studio para convertir tus documentos en lecturas, presentaciones y quizzes.</div></div>` : ''}
  </div>`;
}
ACT.onbMethod = el => { const m = UI.tmp.onb.methods; const k = el.dataset.arg; m.includes(k) ? m.splice(m.indexOf(k), 1) : m.push(k); render(); };
function onbStudents(o) {
  const total = o.manual.length + (o.csv ? 48 : 0);
  return `<div class="onb-cols" style="grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)">
    <div class="stack s16">
      <section class="card pad stack s16"><h3>${icon('userPlus')} Añadir manualmente</h3>
        <form class="grid2" data-submit="onbAdd" style="align-items:end"><div class="field"><label for="ob-name">Nombre</label><input class="input" id="ob-name" placeholder="Paula Gil" required></div><div class="field"><label for="ob-mail">Correo</label><input class="input" id="ob-mail" type="email" placeholder="paula.gil@gruponova.co" required></div><button class="btn" style="grid-column:span 2">${icon('plus')}Añadir a la lista</button></form>
        ${o.manual.length ? `<div class="stack s4">${o.manual.map(s => `<div class="row small">${avatar(s.name, 'sm')}<b>${esc(s.name)}</b><span class="subtle">${esc(s.email)}</span></div>`).join('')}</div>` : ''}
      </section>
      <section class="card pad stack s16"><h3>${icon('table')} Importar desde Excel o CSV</h3>
        ${o.csv ? `<div class="source-file"><span class="f-ico" style="background:#1E7B45">CSV</span><div class="grow small"><b>ingresos_octubre.csv</b><br><span class="subtle">48 estudiantes detectados · 0 errores</span></div><span class="badge ok">${icon('check')}Listo</span></div>` : `<div class="dropzone" data-act="onbCsv"><span class="dz-ico">${icon('upload')}</span><b>Arrastra tu archivo o haz clic para usar el ejemplo</b><span class="small subtle">Columnas: nombre, correo, área (opcional)</span></div>`}
      </section>
    </div>
    <div class="stack s16">
      <section class="card pad stack s16"><h3>Asignar a cursos</h3>
        <div class="stack s8">${o.picked.map(id => course(id)).map(c => `<label class="check"><input type="checkbox" checked>${esc(c.title)}</label>`).join('') || '<p class="small muted">No elegiste cursos en el paso anterior.</p>'}</div>
        <label class="set-row"><span class="small">Enviar invitaciones al publicar</span><span class="switch"><input type="checkbox" checked><span></span></span></label></section>
      <section class="card pad stack s8"><span class="eyebrow">Capacidad</span><b class="num" style="font-family:var(--f-display);font-size:24px">${total} <span class="subtle" style="font-size:15px">/ ${fmt(S.plan.seats)} cupos</span></b>${bar(total / S.plan.seats * 100)}<span class="xs subtle">Te quedarán ${fmt(S.plan.seats - total)} cupos disponibles.</span></section>
    </div></div>`;
}
ACT.onbAdd = f => { UI.tmp.onb.manual.push({ name: $('#ob-name').value, email: $('#ob-mail').value }); render(); toast('Estudiante añadido'); };
ACT.onbCsv = () => { UI.tmp.onb.csv = true; render(); toast('48 estudiantes listos para importar'); };
function onbPublish() {
  const o = UI.tmp.onb, u = S.uni; const v = UI.tmp.onbView || 'home';
  return `<div class="onb-cols" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)">
    <div class="stack s8"><div class="row between wrap"><span class="eyebrow">Así la verán tus estudiantes</span><div class="seg">${[['login', 'Ingreso'], ['home', 'Inicio'], ['course', 'Curso']].map(([k, l]) => `<button class="${v === k ? 'on' : ''}" data-act="onbView" data-arg="${k}">${l}</button>`).join('')}</div></div>${devicePreview(u, v, 'desktop', 'pub')}</div>
    <div class="stack s16"><section class="card pad stack s16"><h3>Resumen</h3>
      ${[['palette', 'Identidad', `${esc(u.name)} · <span class="swatch" style="display:inline-block;width:12px;height:12px;background:${u.primary};vertical-align:-1px"></span> <span class="swatch" style="display:inline-block;width:12px;height:12px;background:${u.accent};vertical-align:-1px"></span>`, 1], ['book', 'Cursos', `${o.picked.length} cursos listos`, 2], ['users', 'Estudiantes', `${o.manual.length + (o.csv ? 48 : 0)} se invitarán`, 3]].map(([ic, t, d, s]) => `<div class="row"><span class="badge ok plain">${icon('check')}</span><div class="grow small"><b>${t}</b><br><span class="muted">${d}</span></div><button class="link xs" data-go="onboarding/${s}">Editar</button></div>`).join('')}</section>
      <section class="card pad stack s8"><span class="eyebrow">Dirección de tu universidad</span><span class="mono" style="font-size:15px">${esc(u.subdomain)}.aulora.app</span><span class="xs subtle">Con el plan Scale puedes usar tu propio dominio.</span></section></div>
  </div>`;
}
ACT.onbView = el => { UI.tmp.onbView = el.dataset.arg; render(); };
ACT.publishUni = () => {
  const o = UI.tmp.onb; S.onboarded = true;
  const added = o.manual.length + (o.csv ? 48 : 0); if (added) S.plan.used = Math.min(S.plan.seats, S.plan.used + added);
  S.activity.unshift({ ico: 'rocket', t: `Publicaste <b>${esc(S.uni.name)}</b>`, when: 'Justo ahora' }); save(); go('onboarding/done');
};
function onbDone() {
  const u = S.uni;
  return `<div class="celebrate" style="${brandVars(u)}"><div class="stack s24" style="align-items:center;text-align:center;max-width:620px">
    ${logoMark(u, 84)}<span class="badge ok">${icon('rocket')}Universidad publicada</span>
    <h1 style="font-size:40px">${esc(u.name)} ya está en línea</h1>
    <p class="muted" style="font-size:16px">Tus estudiantes recibirán su invitación y podrán entrar desde <span class="mono">${esc(u.subdomain)}.aulora.app</span>, con tu marca en cada pantalla.</p>
    <div class="card" style="width:100%;overflow:hidden"><div style="height:140px;background-image:${bannerArt(u)};background-size:cover"></div><div class="row wrap" style="padding:16px;gap:16px;justify-content:center"><span class="small"><b>${S.courses.filter(c => c.status === 'published').length}</b> cursos</span><span class="small"><b>${S.plan.used}</b> estudiantes</span><span class="small"><b>${fmt(S.plan.credits)}</b> créditos IA</span></div></div>
    <div class="row wrap" style="justify-content:center"><button class="btn lg" data-act="viewAsStudent">${icon('eye')}Ver como estudiante</button><button class="btn primary lg" data-go="admin/home">Ir a mi panel ${icon('arrowR')}</button></div>
  </div></div>`;
}

/* ---------- Campos de marca compartidos ---------- */
function brandTarget() { return S.route === 'admin/university' ? UI.tmp.draft : S.uni; }
function identityFields() {
  const u = brandTarget();
  return `<div class="field"><label for="u-name">Nombre de la universidad</label><input class="input" id="u-name" value="${esc(u.name)}" data-in="uniField" data-arg="name" placeholder="Ej. Academia Nova"></div>
  <div class="field"><span class="label">Logo</span>${region('logoField')}</div>`;
}
REG.logoField = () => { const u = brandTarget(); return `<div class="logo-up"><div class="logo-box">${logoMark(u, 52)}</div><div class="stack s8 grow"><div class="row wrap"><button class="btn sm" data-act="uniLogo">${icon('upload')}Subir logo</button>${u.logo ? `<button class="btn ghost sm" data-act="uniLogoRm">Quitar</button>` : ''}</div><span class="hint">PNG o SVG con fondo transparente. ${u.logo ? '' : 'Mientras tanto, usa un logo generado:'}</span>${u.logo ? '' : `<div class="seg" style="align-self:flex-start">${LOGO_STYLES.map(([k, l]) => `<button class="${u.logoStyle === k ? 'on' : ''}" data-act="uniLogoStyle" data-arg="${k}">${l}</button>`).join('')}</div>`}</div></div>`; };
function colorFields() { return `<div class="field"><span class="label">Colores</span>${region('colorField')}</div>`; }
REG.colorField = () => {
  const u = brandTarget();
  const row = (key, label, sw) => `<div class="stack s8"><span class="small" style="font-weight:600">${label}</span><div class="color-row"><input type="color" value="${u[key]}" data-in="uniColor" data-arg="${key}" aria-label="${label}"><input class="input mono" style="width:120px" value="${u[key].toUpperCase()}" data-in="uniHex" data-arg="${key}" aria-label="${label} en hexadecimal" maxlength="7"><div class="swatches">${sw.map(c => `<button class="swatch ${u[key].toLowerCase() === c.toLowerCase() ? 'on' : ''}" style="background:${c}" data-act="uniSwatch" data-arg="${key}:${c}" aria-label="Usar ${c}"></button>`).join('')}</div></div></div>`;
  const lum = luminance(u.primary);
  return `<div class="stack s16">${row('primary', 'Color principal', PRIMARY_SWATCHES)}${row('accent', 'Color secundario o de acento', ACCENT_SWATCHES)}${lum > .6 ? `<div class="alert warn">${icon('alert')}<span class="small">Este color principal es muy claro. Los botones usarán texto oscuro para que sigan siendo legibles.</span></div>` : ''}</div>`;
};
function bannerFields() { return `<div class="field"><span class="label">Imagen de portada</span>${region('bannerField')}</div>`; }
REG.bannerField = () => { const u = brandTarget(); return `<div class="banners">${BANNERS.map(b => `<button class="${u.banner === b ? 'on' : ''}" style="background-image:${bannerArt(u, b)}" data-act="uniBanner" data-arg="${b}" aria-label="Portada ${b}"></button>`).join('')}${u.bannerImg ? `<button class="${u.banner === 'upload' ? 'on' : ''}" style="background-image:url('${u.bannerImg}')" data-act="uniBanner" data-arg="upload" aria-label="Tu imagen"></button>` : ''}<button class="upload" data-act="uniBannerUp" aria-label="Subir imagen">${icon('upload')}</button></div><span class="hint">Las portadas generadas usan tus colores. Recomendado para tu imagen: 1600 × 480 px.</span>`; };
function brandChanged(...extra) {
  if (S.route === 'admin/university') { UI.tmp.dirty = true; refresh('brandPreview', 'dirty', ...extra); }
  else { save(); refresh('onbPreview', 'certPreview', ...extra); }
}
IN.uniField = el => { brandTarget()[el.dataset.arg] = el.value; brandChanged(el.dataset.arg === 'name' ? 'logoField' : 'x'); };
IN.uniColor = el => { brandTarget()[el.dataset.arg] = el.value; const hex = $(`[data-in="uniHex"][data-arg="${el.dataset.arg}"]`); if (hex) hex.value = el.value.toUpperCase(); brandChanged('logoField', 'bannerField'); };
IN.uniHex = el => { let v = el.value.trim(); if (!v.startsWith('#')) v = '#' + v; if (validHex(v)) { brandTarget()[el.dataset.arg] = v; const c = $(`[data-in="uniColor"][data-arg="${el.dataset.arg}"]`); if (c) c.value = v; brandChanged('logoField', 'bannerField'); } };
ACT.uniSwatch = el => { const [k, c] = el.dataset.arg.split(':'); brandTarget()[k] = c; brandChanged('colorField', 'logoField', 'bannerField'); };
ACT.uniLogo = () => pickFile('image/*', (f, data) => { brandTarget().logo = data; brandChanged('logoField'); toast('Logo cargado'); });
ACT.uniLogoRm = () => { brandTarget().logo = null; brandChanged('logoField'); };
ACT.uniLogoStyle = el => { brandTarget().logoStyle = el.dataset.arg; brandChanged('logoField'); };
ACT.uniBanner = el => { brandTarget().banner = el.dataset.arg; brandChanged('bannerField'); };
ACT.uniBannerUp = () => pickFile('image/*', (f, data) => { const u = brandTarget(); u.bannerImg = data; u.banner = 'upload'; brandChanged('bannerField'); toast('Portada cargada'); });
REG.x = () => '';

/* ---------- Mi Universidad ---------- */
function viewUniversity() {
  if (!UI.tmp.draft || UI.tmp.draftFrom !== 'uni') { UI.tmp.draft = JSON.parse(JSON.stringify(S.uni)); UI.tmp.draftFrom = 'uni'; UI.tmp.dirty = false; }
  const d = UI.tmp.draft;
  return adminShell('university', `<div class="brand-editor">
    <div class="be-left">
      <div class="stack s8" style="padding-bottom:6px"><h1>Mi Universidad</h1><p class="muted small">Tu identidad se aplica automáticamente al ingreso, el inicio, los cursos, los eventos y los certificados de tus estudiantes.</p></div>
      <section class="be-sec"><h3>${icon('building')}Identidad</h3>${identityFields()}</section>
      <section class="be-sec"><h3>${icon('palette')}Colores</h3>${region('colorField')}</section>
      <section class="be-sec"><h3>${icon('image')}Portada</h3>${region('bannerField')}</section>
      <section class="be-sec"><h3>${icon('info')}Información</h3>
        <div class="field"><label for="u-tag">Frase de bienvenida</label><input class="input" id="u-tag" value="${esc(d.tagline)}" data-in="uniField" data-arg="tagline"></div>
        <div class="field"><label for="u-desc">Descripción de la universidad</label><textarea class="textarea" id="u-desc" data-in="uniField" data-arg="description">${esc(d.description)}</textarea></div>
        <div class="field"><label for="u-inst">Información institucional</label><input class="input" id="u-inst" value="${esc(d.institution)}" data-in="uniField" data-arg="institution"></div>
        <div class="grid2"><div class="field"><label for="u-mail">Correo de contacto</label><input class="input" id="u-mail" value="${esc(d.email)}" data-in="uniField" data-arg="email"></div><div class="field"><label for="u-phone">Teléfono</label><input class="input" id="u-phone" value="${esc(d.phone)}" data-in="uniField" data-arg="phone"></div></div>
        <div class="field"><label for="u-city">Ciudad</label><input class="input" id="u-city" value="${esc(d.city)}" data-in="uniField" data-arg="city"></div>
      </section>
      <section class="be-sec"><h3>${icon('zap')}Marca del proveedor</h3><label class="set-row"><span class="small">Mostrar “Funciona con Aulora” en el pie de página</span><span class="switch"><input type="checkbox" checked disabled><span></span></span></label><span class="hint">Puedes ocultarla con el <button class="link xs" data-act="upgradePlan">plan Scale</button>.</span></section>
    </div>
    <div class="be-right">
      <div class="row between wrap"><div class="row wrap"><div class="seg">${[['login', 'Ingreso'], ['home', 'Inicio'], ['course', 'Curso']].map(([k, l]) => `<button class="${(UI.tmp.pv || 'home') === k ? 'on' : ''}" data-act="pvTab" data-arg="${k}">${l}</button>`).join('')}</div><div class="seg">${[['desktop', 'monitor'], ['mobile', 'phone']].map(([k, ic]) => `<button class="${(UI.tmp.pd || 'desktop') === k ? 'on' : ''}" data-act="pvDev" data-arg="${k}" aria-label="${k === 'desktop' ? 'Escritorio' : 'Celular'}">${icon(ic)}</button>`).join('')}</div></div>
        <div class="row wrap">${region('dirty', 'span')}<button class="btn" data-act="saveUniAndView">${icon('eye')}Ver como estudiante</button><button class="btn primary" data-act="saveUni">${icon('check')}Guardar cambios</button></div></div>
      <div class="row small subtle" style="gap:6px">${icon('eye')}Previsualización en tiempo real</div>
      ${region('brandPreview')}
    </div>
  </div>`);
}
REG.dirty = () => UI.tmp.dirty ? `<span class="badge warn">Cambios sin guardar</span>` : `<span class="badge ok plain">${icon('check')}Publicado</span>`;
REG.brandPreview = () => devicePreview(UI.tmp.draft, UI.tmp.pv || 'home', UI.tmp.pd || 'desktop', 'be');
ACT.pvTab = el => { UI.tmp.pv = el.dataset.arg; render(); };
ACT.pvDev = el => { UI.tmp.pd = el.dataset.arg; render(); };
ACT.saveUni = () => { S.uni = JSON.parse(JSON.stringify(UI.tmp.draft)); UI.tmp.dirty = false; save(); render(); toast('Cambios publicados en toda tu universidad'); };
ACT.saveUniAndView = () => { if (UI.tmp.dirty) { S.uni = JSON.parse(JSON.stringify(UI.tmp.draft)); UI.tmp.dirty = false; save(); } ACT.viewAsStudent(); };

/* ---------- Dispositivo de previsualización (escala la vista real del estudiante) ---------- */
function devicePreview(u, view, device, key) {
  const W = device === 'mobile' ? 390 : 1280;
  const inner = view === 'login' ? studentLoginHtml(u, true) : view === 'course' ? studentPlayerPreview(u) : `${studentHeader(u, 'home', true)}<div class="st-main">${studentHomeBody(u, true)}</div>`;
  return `<div class="device ${device}"><div class="device-bar"><i></i><i></i><i></i><span class="url">${icon('lock')}${esc(u.subdomain)}.aulora.app${view === 'login' ? '/ingreso' : view === 'course' ? '/curso/liderazgo' : ''}</span></div>
    <div class="device-body"><div class="preview-scale" data-w="${W}"><div class="mini st no-banner ${device === 'mobile' ? 'mobile-mini' : ''}" style="width:${W}px;${brandVars(u)}" aria-hidden="true" inert>${inner}</div></div></div></div>`;
}
function scalePreviews() {
  $$('.preview-scale').forEach(el => { const w = +el.dataset.w; const s = el.clientWidth / w; const m = el.firstElementChild; if (m) { m.style.transform = `scale(${s})`; m.style.height = (el.clientHeight / s) + 'px'; } });
}
window.addEventListener('resize', scalePreviews);
