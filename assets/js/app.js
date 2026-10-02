/* ==========================================================================
   Enrutador de vistas, mapa del prototipo e inicio
   ========================================================================== */
function VIEW(p) {
  const [area, a, b, c] = p;
  if (area === 'login') return viewLogin();
  if (area === 'checkout') return viewCheckout();
  if (area === 'onboarding') return viewOnboarding(a);
  if (area === 'student') {
    if (a === 'login') return viewStudentLogin();
    if (a === 'courses') return viewStudentCourses();
    if (a === 'course') return viewPlayer(b, c);
    if (a === 'events') return viewStudentEvents();
    if (a === 'certificates') return viewStudentCerts();
    return viewStudentHome();
  }
  switch (a) {
    case 'courses': return viewCourses();
    case 'import': return viewImport();
    case 'course': return viewCourse(b);
    case 'builder': return viewBuilder(b);
    case 'students': return viewStudents();
    case 'student': return viewStudent(b);
    case 'events': return viewEvents();
    case 'certificates': return viewCertificates();
    case 'ai': return b === 'reading' ? viewAIReading() : b === 'slides' ? viewAISlides() : b === 'quiz' ? viewAIQuiz() : viewAI();
    case 'university': return viewUniversity();
    case 'analytics': return viewAnalytics();
    case 'billing': return viewBilling();
    case 'settings': return viewSettings();
    default: return viewDashboard();
  }
}

/* ---------- Mapa del prototipo ---------- */
function quizLessonId() { const c = course('c1'); return c ? (c.modules.flatMap(m => m.lessons).find(l => l.type === 'quiz') || {}).id : ''; }
function protoMap() {
  const q = quizLessonId();
  const FLOWS = [
    ['Flujo 1 · Comprar licencia y crear la universidad', [['Comprar licencia', 'checkout'], ['Identidad: logo y colores', 'onboarding/1'], ['Añadir cursos', 'onboarding/2'], ['Matricular estudiantes', 'onboarding/3'], ['Publicar universidad', 'onboarding/4']]],
    ['Flujo 2 · Crear y publicar un curso', [['Dashboard', 'admin/home'], ['Crear curso', 'act:newCourse'], ['Añadir módulos y contenido', 'admin/builder/c6'], ['Publicar curso', 'admin/builder/c6']]],
    ['Flujo 3 · Crear contenido con IA', [['Dashboard', 'admin/home'], ['AI Course Studio', 'admin/ai'], ['Lectura con IA', 'admin/ai/reading'], ['Presentación con IA', 'admin/ai/slides'], ['Quiz con IA', 'admin/ai/quiz']]],
    ['Flujo 4 · Matricular y dar acceso', [['Detalle del curso', 'admin/course/c1'], ['Matricular estudiantes', 'act:enroll:c1'], ['Ingreso del estudiante', 'student/login']]],
    ['Flujo 5 · Ver como estudiante y completar una lección', [['Ver como estudiante', 'act:viewAsStudent'], ['Dashboard estudiante', 'student/home'], ['Entrar al curso', 'student/course/c1'], ['Quiz del estudiante', `student/course/c1/${q}`]]],
  ];
  const SCREENS = [['Login', 'login'], ['Onboarding · compra de licencia', 'checkout'], ['Configuración inicial de universidad', 'onboarding/1'], ['Dashboard administrador', 'admin/home'], ['Cursos', 'admin/courses'], ['Crear curso', 'act:newCourse'], ['Editor de curso', 'admin/builder/c1'], ['Vista detalle de curso', 'admin/course/c1'], ['Estudiantes', 'admin/students'], ['Perfil de estudiante', 'admin/student/s1'], ['Eventos', 'admin/events'], ['Certificados', 'admin/certificates'], ['AI Course Studio', 'admin/ai'], ['Generador de lectura con IA', 'admin/ai/reading'], ['Generador de presentación con IA', 'admin/ai/slides'], ['Generador de quiz con IA', 'admin/ai/quiz'], ['Mi Universidad', 'admin/university'], ['Editor de branding (vista de ingreso)', 'brand:login'], ['Plan y facturación', 'admin/billing'], ['Vista estudiante · ingreso', 'student/login'], ['Dashboard estudiante', 'student/home'], ['Mis cursos', 'student/courses'], ['Interior de un curso', 'student/course/c1'], ['Quiz del estudiante', `student/course/c1/${q}`], ['Mis eventos', 'student/events'], ['Mis certificados', 'student/certificates'], ['Añadir curso existente', 'admin/import'], ['Analítica', 'admin/analytics'], ['Configuración', 'admin/settings']];
  return `${modalHead('Mapa del prototipo', 'Salta a cualquier flujo o pantalla. Los datos son ficticios y los cambios se guardan en este navegador.')}
  <div class="modal-b stack s16">
    <div class="tabs" style="margin-bottom:-4px"><button class="${UI.tmp.mapTab !== 'screens' ? 'on' : ''}" data-act="mapTab" data-arg="flows">Flujos prioritarios</button><button class="${UI.tmp.mapTab === 'screens' ? 'on' : ''}" data-act="mapTab" data-arg="screens">Todas las pantallas</button></div>
    ${UI.tmp.mapTab === 'screens' ? `<div class="screen-list">${SCREENS.map(([t, r], i) => `<button data-act="protoStep" data-arg="${r}"><span class="sn">${String(i + 1).padStart(2, '0')}</span><span>${t}</span></button>`).join('')}</div>`
      : `<div>${FLOWS.map(([t, steps]) => `<div class="flow"><b>${t}</b><div class="flow-steps">${steps.map(([l, r], i) => `<button data-act="protoStep" data-arg="${r}">${l}</button>${i < steps.length - 1 ? icon('chevR') : ''}`).join('')}</div></div>`).join('')}</div>`}
    <div class="row between wrap small"><span class="muted">Marca actual: <b>${esc(S.uni.name)}</b></span><button class="link small" data-act="reset">${icon('refresh')}Restablecer datos de demostración</button></div>
  </div>`;
}
ACT.protoMap = () => openModal(protoMap, 'wide');
ACT.mapTab = el => { UI.tmp.mapTab = el.dataset.arg; renderModal(); };
ACT.protoStep = el => {
  const r = el.dataset.arg; closeModal();
  if (r.startsWith('act:')) { const [, name, arg] = r.split(':'); if (!S.route.startsWith('admin') && name !== 'viewAsStudent') go('admin/home'); if (name === 'viewAsStudent' && S.route.startsWith('student')) S.route = 'admin/home'; ACT[name]({ dataset: { arg } }); return; }
  if (r.startsWith('brand:')) { UI.tmp.pv = r.split(':')[1]; go('admin/university'); return; }
  if (r.startsWith('student') && r !== 'student/login' && !S.previewFrom) S.previewFrom = 'admin/home';
  if (r.startsWith('onboarding') && !UI.tmp.onb) UI.tmp.onb = { methods: ['existing', 'ai'], manual: [], csv: false, picked: ['c1', 'c4', 'c3'] };
  if (r.startsWith('admin/builder')) UI.tmp.sel = null;
  go(r);
};

/* ---------- Inicio ---------- */
(function init() {
  const fab = document.createElement('button'); fab.className = 'proto-fab'; fab.dataset.act = 'protoMap'; fab.innerHTML = icon('map') + '<span>Mapa del prototipo</span>';
  document.body.appendChild(fab);
  const h = location.hash.slice(1);
  if (h && /^[a-z]+(\.[\w-]+)*$/i.test(h)) {
    const r = h.replace(/\./g, '/');
    if (r.startsWith('student') && r !== 'student/login' && !S.previewFrom) S.previewFrom = 'admin/home';
    S.route = r;
  }
  render();
})();
