/* ==========================================================================
   Datos ficticios + generadores visuales (portadas, banners, logos)
   ========================================================================== */

/* ---------- Color ---------- */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) { return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join(''); }
function mixHex(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
function luminance(hex) {
  return hexToRgb(hex).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); })
    .reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
}
function inkFor(hex) { return luminance(hex) > .42 ? '#16130D' : '#FFFFFF'; }
function validHex(h) { return /^#[0-9a-f]{6}$/i.test(h); }
function hsl(h, s, l) { return `hsl(${h} ${s}% ${l}%)`; }
const svgUri = s => `url('data:image/svg+xml;utf8,${encodeURIComponent(s).replace(/'/g, '%27')}')`;

/* ---------- Portadas de curso (arte generativo determinista) ---------- */
function coverArt(c) {
  const h = c.hue, base = hsl(h, 52, 40), deep = hsl(h, 58, 24), light = hsl(h, 70, 86), acc = hsl((h + 38) % 360, 88, 64);
  const m = c.motif;
  let shapes = '';
  if (m === 'orbit') shapes = `<circle cx="320" cy="40" r="130" fill="${light}" opacity=".9"/><circle cx="320" cy="40" r="80" fill="${base}"/><circle cx="96" cy="150" r="34" fill="${acc}"/><circle cx="320" cy="40" r="160" fill="none" stroke="${light}" stroke-width="2" opacity=".5"/>`;
  else if (m === 'stack') shapes = [0, 1, 2, 3].map(i => `<rect x="${200 + i * 42}" y="${150 - i * 34}" width="150" height="26" rx="13" fill="${i === 3 ? acc : light}" opacity="${.5 + i * .15}"/>`).join('') + `<circle cx="70" cy="60" r="22" fill="${acc}"/>`;
  else if (m === 'grid') { for (let x = 0; x < 9; x++) for (let y = 0; y < 5; y++) shapes += `<circle cx="${30 + x * 22}" cy="${30 + y * 22}" r="3" fill="${light}" opacity=".55"/>`; shapes += `<path d="M400 200 L400 30 A170 170 0 0 0 230 200Z" fill="${acc}"/><path d="M400 200 L400 100 A100 100 0 0 0 300 200Z" fill="${light}"/>`; }
  else if (m === 'wave') shapes = `<path d="M0 140 C 80 100, 150 180, 240 130 S 360 90, 400 120 L400 200 L0 200Z" fill="${light}" opacity=".85"/><path d="M0 170 C 90 140, 170 200, 260 165 S 360 140, 400 160 L400 200 L0 200Z" fill="${acc}"/><circle cx="320" cy="56" r="26" fill="${light}"/>`;
  else shapes = [[220, 30, light], [290, 30, acc], [220, 100, base], [290, 100, light], [150, 100, light], [290, 170, light]].map(([x, y, f]) => `<rect x="${x}" y="${y}" width="62" height="62" rx="14" fill="${f}" opacity=".9"/>`).join('') + `<rect x="150" y="30" width="62" height="62" rx="31" fill="${acc}"/>`;
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${base}"/><stop offset="1" stop-color="${deep}"/></linearGradient></defs><rect width="400" height="200" fill="url(#g)"/>${shapes}</svg>`);
}

/* ---------- Banners de la universidad ---------- */
const BANNERS = ['aurora', 'campus', 'lines', 'mosaic'];
function bannerArt(u, preset) {
  const p = preset || u.banner;
  if (p === 'upload' && u.bannerImg) return `url('${u.bannerImg}')`;
  const a = u.primary, b = u.accent, d = mixHex(a, '#0A0814', .45), l = mixHex(a, '#FFFFFF', .55);
  let body = '';
  if (p === 'campus') {
    body = `<rect width="1200" height="360" fill="${d}"/><circle cx="930" cy="120" r="70" fill="${b}"/>` +
      [[80, 200, 120, 160], [220, 140, 90, 220], [330, 230, 140, 130], [500, 170, 110, 190], [630, 110, 80, 250], [730, 210, 160, 150], [910, 180, 100, 180], [1030, 140, 140, 220]]
        .map(([x, y, w, hh], i) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="${i % 2 ? a : l}" opacity="${i % 2 ? .9 : .35}"/>`).join('') +
      `<path d="M0 330 H1200 V360 H0Z" fill="${a}"/>`;
  } else if (p === 'lines') {
    body = `<rect width="1200" height="360" fill="${a}"/>` + Array.from({ length: 16 }, (_, i) => `<path d="M${-200 + i * 90} 360 L${200 + i * 90} 0" stroke="${l}" stroke-width="${i % 4 === 0 ? 18 : 2}" opacity="${i % 4 === 0 ? .25 : .3}"/>`).join('') +
      `<circle cx="980" cy="260" r="150" fill="${b}" opacity=".95"/><circle cx="980" cy="260" r="210" fill="none" stroke="${b}" stroke-width="3" opacity=".6"/>`;
  } else if (p === 'mosaic') {
    for (let x = 0; x < 15; x++) for (let y = 0; y < 5; y++) {
      const k = (x * 7 + y * 13) % 9; const f = k < 4 ? a : k < 6 ? d : k < 8 ? l : b;
      body += k % 3 === 0 ? `<circle cx="${x * 80 + 40}" cy="${y * 80 + 40}" r="40" fill="${f}"/>` : `<rect x="${x * 80}" y="${y * 80}" width="80" height="80" fill="${f}"/>`;
    }
  } else {
    body = `<defs><radialGradient id="r1" cx=".8" cy=".1" r=".6"><stop offset="0" stop-color="${b}" stop-opacity=".95"/><stop offset="1" stop-color="${b}" stop-opacity="0"/></radialGradient><radialGradient id="r2" cx=".15" cy=".9" r=".7"><stop offset="0" stop-color="${l}" stop-opacity=".7"/><stop offset="1" stop-color="${l}" stop-opacity="0"/></radialGradient><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="${d}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs><rect width="1200" height="360" fill="url(#lg)"/><rect width="1200" height="360" fill="url(#r2)"/><rect width="1200" height="360" fill="url(#r1)"/>`;
  }
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice">${body}</svg>`);
}

/* ---------- Logo de la universidad ---------- */
function initials(name) {
  const w = (name || 'U').replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(x => x.length > 2 || /^[A-Z]/.test(x));
  return ((w[0] || 'U')[0] + (w[1] ? w[1][0] : '')).toUpperCase();
}
function logoMark(u, size = 36) {
  const r = Math.round(size * .28);
  if (u.logo) return `<img src="${u.logo}" alt="Logo ${esc(u.name)}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:${r}px;flex:none">`;
  const ink = inkFor(u.primary);
  let inner;
  if (u.logoStyle === 'spark') inner = `<path d="M50 14 C54 38 62 46 86 50 C62 54 54 62 50 86 C46 62 38 54 14 50 C38 46 46 38 50 14Z" fill="${ink}"/><circle cx="76" cy="24" r="8" fill="${u.accent}"/>`;
  else if (u.logoStyle === 'arc') inner = `<path d="M22 72 A28 28 0 0 1 78 72" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><path d="M38 72 A12 12 0 0 1 62 72" fill="none" stroke="${u.accent}" stroke-width="12" stroke-linecap="round"/>`;
  else inner = `<text x="50" y="63" text-anchor="middle" font-family="Bricolage Grotesque, Figtree, sans-serif" font-weight="700" font-size="40" fill="${ink}" letter-spacing="-1">${esc(initials(u.name))}</text><circle cx="80" cy="22" r="7" fill="${u.accent}"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="flex:none;border-radius:${r}px" role="img" aria-label="Logo ${esc(u.name)}"><rect width="100" height="100" rx="28" fill="${u.primary}"/>${inner}</svg>`;
}

/* ---------- Avatares ---------- */
const AV_COLORS = ['#0C7A64', '#2459C9', '#C2501A', '#9334B5', '#B7791F', '#0F7A8C', '#C42B4E', '#5B47C2', '#17804A', '#2F3A57'];
function avatar(name, cls = '') {
  const parts = name.split(' ');
  const ini = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `<span class="av ${cls}" style="background:${AV_COLORS[h % AV_COLORS.length]}">${ini}</span>`;
}

/* ---------- Semilla ---------- */
let _id = 1000;
const uid = (p = 'x') => p + (++_id).toString(36);

function L(type, title, dur, extra = {}) { return { id: uid('l'), type, title, dur: dur || TYPES[type].dur, ...extra }; }
function M(title, lessons) { return { id: uid('m'), title, lessons }; }

const SBI_BLOCKS = [
  { id: 'b1', kind: 'p', text: 'Dar feedback es una de las responsabilidades más importantes y, a la vez, más evitadas por los nuevos managers. El modelo SBI (Situación, Comportamiento, Impacto) ofrece una estructura sencilla para que tus conversaciones sean concretas, justas y orientadas al aprendizaje.' },
  { id: 'b2', kind: 'h2', text: '1. Situación: ancla el momento' },
  { id: 'b3', kind: 'p', text: 'Describe cuándo y dónde ocurrió lo que vas a comentar. Evita generalizaciones como "siempre" o "nunca". Cuanto más específico seas, más fácil será para la otra persona recordar el contexto y entender tu punto.' },
  { id: 'b4', kind: 'callout', text: 'Ejemplo: "En la reunión de seguimiento con el cliente del martes por la mañana…"' },
  { id: 'b5', kind: 'h2', text: '2. Comportamiento: lo observable' },
  { id: 'b6', kind: 'p', text: 'Nombra lo que la persona hizo o dijo, no lo que interpretas sobre sus intenciones. "Interrumpiste a Marta dos veces" es observable; "fuiste irrespetuoso" es un juicio.' },
  { id: 'b7', kind: 'h2', text: '3. Impacto: lo que provocó' },
  { id: 'b8', kind: 'p', text: 'Explica el efecto que tuvo ese comportamiento en ti, en el equipo o en el resultado. El impacto convierte la observación en algo relevante y abre la puerta a una conversación sobre cómo seguir.' },
  { id: 'b9', kind: 'callout', text: 'Cierra siempre con una pregunta abierta: "¿Cómo lo viste tú?" El feedback es una conversación, no un veredicto.' },
];

const FEEDBACK_QUIZ = [
  { q: '¿Qué significan las siglas del modelo SBI?', type: 'mc', options: ['Situación, Comportamiento, Impacto', 'Síntesis, Balance, Intención', 'Situación, Beneficio, Indicador', 'Señal, Comportamiento, Interés'], correct: 0 },
  { q: '¿Cuál de estas frases describe un comportamiento observable?', type: 'mc', options: ['"Fuiste poco profesional"', '"Llegaste 20 minutos tarde a la reunión con el cliente"', '"No te importa el equipo"', '"Siempre haces lo mismo"'], correct: 1 },
  { q: 'El feedback efectivo debe darse lo más cerca posible del momento en que ocurrió la situación.', type: 'tf', options: ['Verdadero', 'Falso'], correct: 0 },
  { q: '¿Qué conviene hacer después de explicar el impacto?', type: 'mc', options: ['Dar por cerrada la conversación', 'Enviar un correo con el resumen', 'Hacer una pregunta abierta para escuchar a la otra persona', 'Compararlo con otros miembros del equipo'], correct: 2 },
  { q: 'El modelo SBI solo sirve para dar feedback negativo.', type: 'tf', options: ['Verdadero', 'Falso'], correct: 1 },
];

function seedCourses() {
  return [
    {
      id: 'c1', title: 'Liderazgo para nuevos managers', category: 'Liderazgo', status: 'published', students: 142, progress: 68, completion: 41, updated: 'Hace 2 días', hue: 262, motif: 'orbit', hours: 6,
      certificate: true, description: 'Herramientas prácticas para pasar de contribuidor individual a líder de equipo: conversaciones 1:1, feedback, delegación y priorización.',
      modules: [
        M('Del rol individual al rol de líder', [
          L('video', 'Bienvenida al programa', 4),
          L('reading', 'Qué cambia cuando lideras personas', 8),
          L('slides', 'Los 5 roles del manager', 10),
          L('activity', 'Autodiagnóstico de estilo de liderazgo', 15),
        ]),
        M('Conversaciones que construyen equipo', [
          L('video', 'El arte de la reunión 1:1', 9),
          L('pdf', 'Guía práctica de reuniones 1:1', 12),
          L('reading', 'El modelo SBI para dar feedback', 8, { blocks: SBI_BLOCKS }),
          L('quiz', 'Quiz: Feedback efectivo', 10, { questions: FEEDBACK_QUIZ }),
          L('link', 'Recurso externo: Radical Candor en 5 minutos', 5),
        ]),
        M('Delegar y priorizar', [
          L('reading', 'La matriz de delegación', 10),
          L('file', 'Plantilla de plan de delegación (.xlsx)', 3),
          L('activity', 'Diseña el plan de delegación de tu equipo', 25),
        ]),
        M('Evaluación final', [
          L('exam', 'Evaluación final del programa', 25),
        ]),
      ],
    },
    mk('c2', 'Fundamentos de ventas consultivas', 'Ventas', 'published', 118, 54, 30, 'Hace 5 días', 18, 'stack', 5),
    mk('c3', 'Excel para análisis de datos', 'Habilidades digitales', 'published', 96, 72, 58, 'Hace 1 semana', 150, 'grid', 8),
    mk('c4', 'Onboarding corporativo Grupo Nova', 'Cultura', 'published', 284, 81, 74, 'Hace 3 semanas', 200, 'wave', 3),
    mk('c5', 'Comunicación efectiva y feedback', 'Habilidades blandas', 'published', 87, 43, 22, 'Ayer', 330, 'blocks', 4),
    mk('c6', 'Ciberseguridad para todos', 'Cumplimiento', 'draft', 0, 0, 0, 'Hace 3 horas', 215, 'grid', 2),
    mk('c7', 'Servicio al cliente omnicanal', 'Servicio', 'published', 64, 37, 15, 'Hace 4 días', 28, 'orbit', 4),
    mk('c8', 'Gestión de proyectos ágiles', 'Gestión', 'archived', 41, 92, 88, 'Hace 4 meses', 175, 'stack', 6),
  ];
}
const OUTLINES = {
  c2: [['El cliente en el centro', [['video', 'Qué es la venta consultiva'], ['reading', 'Del producto al problema del cliente'], ['quiz', 'Quiz de diagnóstico']]], ['Preguntas poderosas', [['slides', 'El método SPIN'], ['activity', 'Role play: primera reunión'], ['pdf', 'Banco de preguntas por industria']]], ['Cierre y seguimiento', [['reading', 'Manejo de objeciones'], ['exam', 'Evaluación final']]]],
  c3: [['Primeros pasos', [['video', 'Tour por la interfaz'], ['file', 'Datos de práctica (.xlsx)']]], ['Fórmulas esenciales', [['video', 'BUSCARX y SI.CONJUNTO'], ['activity', 'Ejercicio guiado de fórmulas'], ['quiz', 'Quiz de fórmulas']]], ['Tablas dinámicas', [['video', 'Tu primera tabla dinámica'], ['reading', 'Buenas prácticas de análisis'], ['exam', 'Caso práctico final']]]],
  c4: [['Bienvenida a Grupo Nova', [['video', 'Mensaje de la presidencia'], ['reading', 'Nuestra historia y propósito']]], ['Cómo trabajamos', [['slides', 'Valores y comportamientos'], ['pdf', 'Código de conducta'], ['quiz', 'Quiz de cultura']]], ['Tus primeros 30 días', [['link', 'Portal de beneficios'], ['activity', 'Checklist de incorporación']]]],
  c5: [['Fundamentos de la comunicación', [['video', 'Escucha activa'], ['reading', 'Comunicación asertiva']]], ['Feedback que transforma', [['slides', 'El modelo SBI'], ['activity', 'Practica con un caso real'], ['quiz', 'Quiz de feedback']]], ['Conversaciones difíciles', [['reading', 'Preparar una conversación difícil'], ['exam', 'Evaluación final']]]],
  c6: [['Amenazas comunes', [['video', 'Phishing: cómo reconocerlo'], ['reading', 'Contraseñas seguras']]]],
  c7: [['Experiencia omnicanal', [['video', 'El viaje del cliente'], ['reading', 'Principios de servicio Nova']]], ['Canales digitales', [['slides', 'WhatsApp, chat y redes'], ['activity', 'Responde a 3 casos reales'], ['quiz', 'Quiz de canales']]]],
  c8: [['Mentalidad ágil', [['video', 'Manifiesto ágil'], ['reading', 'Scrum en 10 minutos']]], ['Herramientas', [['slides', 'Tableros Kanban'], ['exam', 'Evaluación final']]]],
};
function mk(id, title, category, status, students, progress, completion, updated, hue, motif, hours) {
  return {
    id, title, category, status, students, progress, completion, updated, hue, motif, hours, certificate: status !== 'draft',
    description: `Curso de ${category.toLowerCase()} diseñado para los equipos de Grupo Nova, con casos y ejercicios aplicados al día a día.`,
    modules: (OUTLINES[id] || []).map(([mt, ls]) => M(mt, ls.map(([t, n]) => L(t, n)))),
  };
}

const FIRST = ['Camila', 'Andrés', 'María Fernanda', 'Santiago', 'Valentina', 'Juan Pablo', 'Daniela', 'Sebastián', 'Laura', 'Mateo', 'Isabella', 'Nicolás', 'Sofía', 'Felipe', 'Mariana', 'Alejandro', 'Gabriela', 'Diego', 'Paula', 'Tomás', 'Carolina', 'Esteban', 'Natalia', 'Julián'];
const LAST = ['Rojas', 'Gómez', 'López', 'Martínez', 'Herrera', 'Castro', 'Vargas', 'Moreno', 'Ortiz', 'Ramírez', 'Suárez', 'Jiménez', 'Torres', 'Díaz', 'Salazar', 'Mejía', 'Restrepo', 'Cárdenas', 'Pineda', 'Acosta', 'Ríos', 'Quintero', 'Navarro', 'Ospina'];
const AREAS = ['Comercial', 'Operaciones', 'Talento Humano', 'Finanzas', 'Tecnología', 'Servicio al cliente', 'Marketing'];
const SEEN = ['Hace 5 min', 'Hace 1 hora', 'Hoy, 9:12', 'Ayer', 'Hace 2 días', 'Hace 3 días', 'Hace 1 semana', 'Hace 2 semanas', 'Hace 1 mes'];
function seedStudents() {
  const sets = [['c1', 'c4', 'c5', 'c3'], ['c2', 'c4'], ['c1', 'c4'], ['c3'], ['c4', 'c7'], ['c1', 'c2', 'c4'], ['c5'], ['c4', 'c3', 'c8']];
  return FIRST.map((f, i) => {
    const name = `${f} ${LAST[i]}`;
    const email = (f.split(' ')[0] + '.' + LAST[i]).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '@gruponova.co';
    const status = i === 0 ? 'active' : i % 11 === 7 ? 'inactive' : i % 9 === 4 ? 'invited' : 'active';
    const courses = i === 0 ? sets[0] : sets[i % sets.length];
    const progress = status === 'invited' ? 0 : [45, 88, 62, 100, 31, 74, 12, 56, 93, 27, 68, 40][i % 12];
    return { id: 's' + (i + 1), name, email, status, courses, progress, lastSeen: status === 'invited' ? 'Sin acceso aún' : SEEN[i % SEEN.length], area: AREAS[i % AREAS.length], joined: ['12 ene 2026', '3 feb 2026', '18 mar 2026', '7 may 2026', '22 jul 2026'][i % 5], certs: status === 'invited' ? 0 : [2, 3, 1, 4, 0, 1, 0, 2][i % 8] };
  });
}

function seedEvents() {
  return [
    { id: 'e1', title: 'Kickoff Onboarding · Cohorte octubre', date: '2026-10-06', time: '09:00', end: '10:00', mode: 'virtual', place: 'Google Meet', link: 'meet.google.com/nov-akdf-221', course: 'c4', invited: 38, desc: 'Bienvenida a los nuevos colaboradores y recorrido por la Academia.', reminders: ['1 día antes', '1 hora antes'] },
    { id: 'e2', title: 'Sesión en vivo: Feedback que transforma', date: '2026-10-08', time: '10:00', end: '11:30', mode: 'virtual', place: 'Zoom', link: 'zoom.us/j/84213377610', course: 'c1', invited: 142, desc: 'Práctica guiada del modelo SBI con casos reales de los participantes.', reminders: ['1 día antes', '15 minutos antes'] },
    { id: 'e3', title: 'Taller presencial de negociación', date: '2026-10-14', time: '14:00', end: '17:00', mode: 'presencial', place: 'Sede Chicó · Sala Ágora, piso 4', link: '', course: 'c2', invited: 40, desc: 'Taller práctico con simulaciones de negociación en parejas.', reminders: ['2 días antes'] },
    { id: 'e4', title: 'Webinar: Tablas dinámicas sin miedo', date: '2026-10-16', time: '16:00', end: '17:00', mode: 'virtual', place: 'Microsoft Teams', link: 'teams.microsoft.com/l/meetup/nova-excel', course: 'c3', invited: 96, desc: 'Resolvemos dudas del módulo 3 en vivo.', reminders: ['1 hora antes'] },
    { id: 'e5', title: 'Office hours de ventas', date: '2026-10-21', time: '11:00', end: '12:00', mode: 'virtual', place: 'Zoom', link: 'zoom.us/j/99120044711', course: 'c2', invited: 118, desc: 'Espacio abierto con el equipo comercial senior.', reminders: ['1 día antes'] },
    { id: 'e6', title: 'Ceremonia de certificación · Cohorte 3', date: '2026-10-30', time: '17:30', end: '19:00', mode: 'presencial', place: 'Auditorio Grupo Nova, Bogotá', link: '', course: 'c1', invited: 64, desc: 'Entrega de certificados del programa de liderazgo.', reminders: ['1 semana antes', '1 día antes'] },
  ];
}

function seedState() {
  _id = 1000;
  const courses = seedCourses();
  const c1 = courses[0];
  const done1 = c1.modules[0].lessons.map(l => l.id).concat([c1.modules[1].lessons[0].id, c1.modules[1].lessons[1].id]);
  const allIds = c => c.modules.flatMap(m => m.lessons.map(l => l.id));
  const part = (c, f) => allIds(c).slice(0, Math.round(allIds(c).length * f));
  const byId = Object.fromEntries(courses.map(c => [c.id, c]));
  return {
    v: 3,
    route: 'login',
    onboarded: true,
    uni: {
      name: 'Academia Nova', tagline: 'Tu crecimiento, nuestra prioridad',
      primary: '#6D3FD8', accent: '#F5A524', logo: null, logoStyle: 'spark', banner: 'aurora', bannerImg: null,
      description: 'La academia corporativa de Grupo Nova. Formamos líderes, equipos comerciales y talento digital con programas prácticos y certificados.',
      institution: 'Grupo Nova S.A.S. · NIT 900.482.117-3',
      email: 'formacion@gruponova.co', phone: '+57 601 555 0182', web: 'academia.gruponova.co', city: 'Bogotá, Colombia',
      subdomain: 'academianova', hideProvider: false, signer: 'Laura Méndez', signerRole: 'Directora de Formación',
    },
    admin: { name: 'Laura Méndez', email: 'laura.mendez@gruponova.co', role: 'Directora de Formación' },
    plan: { name: 'Growth', seats: 500, used: 320, active: 247, storage: 38.4, storageMax: 100, credits: 1240, creditsMax: 2000, renew: '14 ene 2027', price: 'US$ 690 / mes' },
    courses,
    students: seedStudents(),
    events: seedEvents(),
    certs: { issued: 186, students: 142, courses: 5 },
    me: {
      name: 'Camila Rojas', email: 'camila.rojas@gruponova.co',
      enrolled: {
        c1: { done: done1 },
        c4: { done: allIds(byId.c4), completedOn: '28 ago 2026', code: 'AN-7Q4K-2026' },
        c3: { done: part(byId.c3, .7) },
        c5: { done: part(byId.c5, .2) },
        c8: { done: allIds(byId.c8), completedOn: '9 may 2026', code: 'AN-3MZP-2026' },
      },
      notifications: [
        { t: 'Nueva sesión en vivo: <b>Feedback que transforma</b> el jueves 8 de octubre.', when: 'Hace 2 horas', read: false },
        { t: 'Tienes una lección pendiente en <b>Liderazgo para nuevos managers</b>.', when: 'Ayer', read: false },
        { t: 'Obtuviste el certificado de <b>Onboarding corporativo Grupo Nova</b>.', when: '28 ago', read: true },
      ],
      quiz: {},
    },
    ai: { history: [
      { kind: 'quiz', title: 'Quiz · Código de conducta', when: 'Hace 2 días', credits: 15, course: 'Onboarding corporativo Grupo Nova' },
      { kind: 'reading', title: 'Lectura · Principios de servicio Nova', when: 'Hace 6 días', credits: 20, course: 'Servicio al cliente omnicanal' },
      { kind: 'slides', title: 'Presentación · Valores y comportamientos', when: 'Hace 2 semanas', credits: 40, course: 'Onboarding corporativo Grupo Nova' },
    ] },
    activity: [
      { ico: 'award', t: '<b>María Fernanda López</b> obtuvo el certificado de <b>Excel para análisis de datos</b>', when: 'Hace 12 min' },
      { ico: 'checkCircle', t: '<b>Andrés Gómez</b> completó el módulo <b>Preguntas poderosas</b>', when: 'Hace 40 min' },
      { ico: 'upload', t: 'Se importaron <b>12 estudiantes</b> desde <span class="mono">ingresos_octubre.csv</span>', when: 'Hace 2 horas' },
      { ico: 'sparkles', t: 'AI Course Studio generó un <b>quiz de 10 preguntas</b> para Onboarding', when: 'Ayer' },
      { ico: 'rocket', t: 'Publicaste <b>Comunicación efectiva y feedback</b>', when: 'Ayer' },
      { ico: 'calendar', t: 'Se creó el evento <b>Taller presencial de negociación</b>', when: 'Hace 2 días' },
    ],
  };
}
