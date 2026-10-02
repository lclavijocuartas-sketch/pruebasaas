/* ==========================================================================
   AI Course Studio: inicio + generadores de lectura, presentación y quiz.
   Toda salida de la IA es una propuesta editable antes de añadirse al curso.
   ========================================================================== */
const AI_COST = { reading: 20, slides: 40, quiz: 15 };
const AI_META = {
  reading: { label: 'Lectura', icon: 'bookOpen', cls: 't-reading', route: 'admin/ai/reading', desc: 'Texto estructurado con secciones, conceptos clave, ejemplos y preguntas de reflexión.', bullets: ['Introducción y secciones', 'Conceptos clave y ejemplos', 'Resumen y preguntas de reflexión'] },
  slides: { label: 'Presentación', icon: 'presentation', cls: 't-slides', route: 'admin/ai/slides', desc: 'Diapositivas con tu marca: portada, objetivos, contenido, ejemplos y conclusiones.', bullets: ['Portada y objetivos', 'Diapositivas editables', 'Exportable a PowerPoint'] },
  quiz: { label: 'Quiz', icon: 'listChecks', cls: 't-quiz', route: 'admin/ai/quiz', desc: 'Preguntas con respuestas correctas a partir de un documento, lectura o curso.', bullets: ['Selección múltiple', 'Verdadero / falso', 'Respuesta corta'] },
};
const DEFAULT_SOURCE = { name: 'Manual de servicio al cliente Nova 2026.pdf', ext: 'pdf', pages: 24, size: '3,1 MB' };
function aiState() { return UI.tmp.ai || (UI.tmp.ai = { source: { ...DEFAULT_SOURCE } }); }

/* ---------- Inicio del estudio ---------- */
function viewAI() {
  const p = S.plan, a = aiState();
  return adminShell('ai', `<div class="page">
    <div class="ai-hero">
      <section class="ai-head">
        <span class="ai-tag" style="color:#fff;opacity:.85">${icon('sparkles')}AI COURSE STUDIO · SERVICIO ADICIONAL</span>
        <h1>Convierte lo que ya sabes en material de curso</h1>
        <p>Sube un documento y la IA te propone una lectura, una presentación o un quiz. Tú revisas, editas y decides qué se publica.</p>
        <div class="dropzone" id="dz-ai" data-act="aiPickFile"><span class="dz-ico">${icon('upload')}</span><div class="grow"><b>Sube un PDF, Word, texto o presentación</b><br><span class="small" style="opacity:.8">o arrastra aquí tu archivo · máx. 50 MB</span></div><span class="btn sm" style="background:#fff;color:#2C2580;border:0">Elegir archivo</span></div>
        <div class="row wrap small" style="opacity:.85"><span>Último archivo:</span><span class="mono">${esc(a.source.name)}</span></div>
      </section>
      <section class="card pad stack s16">
        <div class="row between"><h3>Créditos de IA</h3><span class="badge ai">Plan ${p.name}</span></div>
        <div class="stack s8"><div class="row" style="align-items:baseline;gap:6px"><b class="num" style="font-family:var(--f-display);font-size:34px">${fmt(p.credits)}</b><span class="muted">/ ${fmt(p.creditsMax)} este mes</span></div>${bar(p.credits / p.creditsMax * 100, 'thick ai')}<span class="xs subtle">Se renuevan el 1 de noviembre</span></div>
        <div class="stack s8 small">${Object.entries(AI_META).map(([k, m]) => `<div class="row between"><span class="row">${tico(k === 'slides' ? 'slides' : k === 'quiz' ? 'quiz' : 'reading')}${m.label}</span><span class="num muted">${AI_COST[k]} créditos</span></div>`).join('')}</div>
        <button class="btn" data-act="buyCredits">${icon('plus')}Comprar más créditos</button>
      </section>
    </div>
    <section class="stack s16"><h2>¿Qué quieres crear?</h2><div class="gen-cards">${Object.entries(AI_META).map(([k, m]) => `<article class="card gen-card hover" data-go="${m.route}" tabindex="0"><span class="g-ico ${m.cls}">${icon(m.icon)}</span><h3>${m.label}</h3><p class="small muted">${m.desc}</p><ul>${m.bullets.map(b => `<li>${icon('check')}${b}</li>`).join('')}</ul><div class="row between" style="margin-top:auto"><span class="xs subtle">${AI_COST[k]} créditos</span><span class="btn ai sm">Crear ${m.label.toLowerCase()} ${icon('arrowR')}</span></div></article>`).join('')}</div></section>
    <section class="card pad"><h3 style="margin-bottom:14px">Cómo funciona</h3><div class="grid3" style="grid-template-columns:repeat(4,minmax(0,1fr))">${[['upload', 'Sube tu material', 'PDF, Word, texto o presentación.'], ['wand', 'La IA propone', 'Estructura el contenido en segundos.'], ['edit', 'Tú revisas y editas', 'Nada se publica sin tu aprobación.'], ['book', 'Añádelo al curso', 'Elige el curso y el módulo.']].map(([ic, t, d], i) => `<div class="stack s8"><span class="row"><span class="badge ai plain mono">${i + 1}</span>${icon(ic)}</span><b>${t}</b><span class="small muted">${d}</span></div>`).join('')}</div></section>
    <div class="dash-grid">
      <section class="card"><div class="card-h"><h3>Creado recientemente</h3></div><div class="card-b">${S.ai.history.length ? S.ai.history.map(h => `<div class="ev-mini">${tico(h.kind === 'slides' ? 'slides' : h.kind === 'quiz' ? 'quiz' : 'reading')}<div class="grow small"><b style="font-weight:600">${esc(h.title)}</b><br><span class="subtle">${esc(h.course)} · ${h.when}</span></div><span class="xs subtle num">−${h.credits}</span></div>`).join('') : `<div class="empty"><p class="small">Todavía no has creado contenido con IA.</p></div>`}</div></section>
      <section class="card pad stack s16" style="background:var(--fg);color:var(--bg);border-color:var(--fg)"><span class="eyebrow" style="color:color-mix(in srgb,var(--bg) 70%,transparent)">Nivel 3 · Premium</span><h3 style="color:var(--bg)">¿Prefieres que lo hagamos por ti?</h3><p class="small" style="opacity:.8">Diseño instruccional, producción de video, animaciones y actividades interactivas, con tu marca.</p><button class="btn" style="align-self:flex-start;background:var(--bg);color:var(--fg);border:0" data-act="customCourse">Solicitar curso personalizado ${icon('arrowR')}</button></section>
    </div>
  </div>`);
}
ACT.aiPickFile = () => pickFile('.pdf,.doc,.docx,.txt,.ppt,.pptx', f => aiSetSource(f));
dropzoneBindGlobal('#dz-ai, #dz-ai2', f => aiSetSource(f));
function aiSetSource(f) {
  const ext = (f.name.split('.').pop() || 'pdf').toLowerCase();
  aiState().source = { name: f.name, ext: ext.startsWith('doc') ? 'docx' : ext.startsWith('ppt') ? 'pptx' : ext === 'txt' ? 'txt' : 'pdf', pages: 12, size: (f.size / 1048576).toFixed(1).replace('.', ',') + ' MB' };
  toast('Documento cargado. Elige qué quieres crear.', 'ai');
  if (S.route === 'admin/ai') openModal(() => `${modalHead('¿Qué quieres crear con este documento?', esc(f.name))}<div class="modal-b stack s8">${Object.entries(AI_META).map(([k, m]) => `<button class="method" data-go="${m.route}"><span class="m-ico ${m.cls}">${icon(m.icon)}</span><span class="grow"><b>${m.label}</b><span>${m.desc}</span></span><span class="xs subtle num">${AI_COST[k]} créditos</span></button>`).join('')}</div>`);
  else refresh('aiLeft');
}
ACT.buyCredits = () => openModal(() => `${modalHead('Comprar créditos de IA', 'Los créditos adicionales no vencen mientras tu licencia esté activa.')}<div class="modal-b stack s8">${[[500, 'US$ 50'], [1000, 'US$ 90'], [5000, 'US$ 400']].map(([n, v], i) => `<button class="method ${i === 1 ? 'on' : ''}" data-act="creditsDo" data-arg="${n}"><span class="m-ico" style="background:var(--ai-soft);color:var(--ai)">${icon('sparkles')}</span><span class="grow"><b>${fmt(n)} créditos</b><span>≈ ${Math.round(n / 20)} lecturas o ${Math.round(n / 15)} quizzes</span></span><b>${v}</b></button>`).join('')}</div>`);
ACT.creditsDo = el => { S.plan.credits += +el.dataset.arg; save(); closeModal(); render(); toast(`${fmt(+el.dataset.arg)} créditos añadidos`, 'ai'); };

/* ---------- Shell de generador ---------- */
function genShell(kind, left) {
  const m = AI_META[kind];
  return adminShell('ai', `<div class="split">
    <aside class="s-left">${crumbs([['AI Course Studio', 'admin/ai'], [`Crear ${m.label.toLowerCase()}`]])}
      <div class="row">${`<span class="tico ${m.cls}" style="width:36px;height:36px;border-radius:10px;display:grid;place-items:center">${icon(m.icon)}</span>`}<div><h2>Crear ${m.label.toLowerCase()} con IA</h2></div></div>
      ${region('aiLeft', 'div', 'class="stack s16"')}
    </aside>
    <section class="s-right">${region('aiRight', 'div', 'class="stack s16"')}</section>
  </div>`);
}
function sourceCard() {
  const s = aiState().source;
  return `<div class="field"><span class="label">Documento fuente</span><div class="source-file"><span class="f-ico ${s.ext}">${s.ext.toUpperCase()}</span><div class="grow small" style="min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.name)}</b><span class="subtle">${s.pages} páginas · ${s.size}</span></div><button class="btn ghost sm" data-act="aiPickFile">Cambiar</button></div></div>`;
}
function genButton(kind) {
  const a = aiState(); const busy = a.stage === 'gen';
  return `<div class="stack s8" style="margin-top:4px"><button class="btn ai lg block" data-act="aiGenerate" data-arg="${kind}" ${busy ? 'disabled' : ''}>${icon('sparkles')}${a.stage === 'done' ? 'Generar de nuevo' : 'Generar ' + AI_META[kind].label.toLowerCase()}</button><div class="row between xs subtle"><span>Costo: ${AI_COST[kind]} créditos</span><span>Disponibles: ${fmt(S.plan.credits)}</span></div></div>`;
}
const STEPS = {
  reading: ['Leyendo el documento (24 páginas)', 'Identificando conceptos clave', 'Estructurando secciones', 'Redactando ejemplos y preguntas'],
  slides: ['Analizando el contenido', 'Definiendo la narrativa', 'Diseñando diapositivas con tu marca', 'Seleccionando imágenes'],
  quiz: ['Leyendo la fuente', 'Detectando conceptos evaluables', 'Redactando preguntas', 'Verificando respuestas correctas'],
};
function genEmpty(kind) {
  const m = AI_META[kind];
  return `<div class="card empty" style="padding:56px 24px"><span class="empty-ico" style="background:var(--ai-soft);color:var(--ai)">${icon('wand')}</span><h2>Tu ${m.label.toLowerCase()} aparecerá aquí</h2><p class="muted" style="max-width:48ch">Ajusta las opciones de la izquierda y pulsa <b>Generar</b>. Recibirás una propuesta que puedes editar antes de añadirla a un curso.</p></div>`;
}
function genProgress(kind) {
  const a = aiState();
  return `<div class="card"><div class="gen-steps"><span class="ai-tag">${icon('sparkles')}GENERANDO PROPUESTA</span>${STEPS[kind].map((s, i) => `<div class="gen-step ${i < a.step ? 'done' : i === a.step ? 'now' : ''}"><span class="gs-dot">${i < a.step ? icon('check') : ''}</span>${s}</div>`).join('')}</div>
    <div class="stack s8" style="padding:0 24px 24px"><div class="skeleton" style="width:60%;height:22px"></div><div class="skeleton"></div><div class="skeleton" style="width:92%"></div><div class="skeleton" style="width:80%"></div></div></div>`;
}
ACT.aiGenerate = el => {
  const kind = el.dataset.arg, a = aiState(); const cost = AI_COST[kind];
  if (S.plan.credits < cost) { toast('No tienes créditos suficientes', 'warn'); return; }
  a.kind = kind; a.stage = 'gen'; a.step = 0; a.editing = false;
  if (kind === 'reading') a.variant = a.variant === undefined ? 0 : (a.variant + 1) % 2;
  refresh('aiLeft', 'aiRight');
  const t = setInterval(() => {
    a.step++;
    if (a.step >= STEPS[kind].length) {
      clearInterval(t); a.stage = 'done'; S.plan.credits -= cost; save();
      if (kind === 'slides') a.slides = JSON.parse(JSON.stringify(SAMPLE_SLIDES)), a.cur = 0;
      if (kind === 'quiz') a.questions = buildQuiz();
      if (kind === 'reading') a.html = READINGS[a.variant];
      toast(`Propuesta lista · −${cost} créditos`, 'ai');
    }
    if (S.route === AI_META[kind].route) refresh('aiLeft', 'aiRight');
  }, 620);
};
function resultBar(kind, extra = '') {
  const a = aiState();
  return `<div class="result-bar"><span class="badge ai">${icon('sparkles')}Propuesta de IA · revisa antes de publicar</span><div class="grow"></div>${extra}
    <button class="btn sm" data-act="aiGenerate" data-arg="${kind}">${icon('refresh')}Regenerar</button>
    ${kind === 'reading' ? `<button class="btn sm ${a.editing ? 'dark' : ''}" data-act="aiEdit">${icon(a.editing ? 'check' : 'edit')}${a.editing ? 'Terminar edición' : 'Editar'}</button>` : ''}
    <button class="btn primary sm" data-act="aiAddToCourse" data-arg="${kind}">${icon('plus')}Añadir al curso</button></div>`;
}

/* ---------- Lectura ---------- */
function viewAIReading() { const a = aiState(); if (a.kind !== 'reading') { a.kind = 'reading'; a.stage = 'idle'; } return genShell('reading'); }
REG.aiLeft = () => {
  const kind = aiState().kind;
  if (kind === 'reading') return `${sourceCard()}
    <div class="field"><label for="r-aud">Audiencia</label><select class="select" id="r-aud"><option>Asesores de servicio al cliente</option><option>Líderes de equipo</option><option>Público general</option></select></div>
    <div class="field"><span class="label">Tono</span><div class="seg"><button class="on">Cercano</button><button>Formal</button><button>Técnico</button></div></div>
    <div class="field"><span class="label">Extensión</span><div class="seg"><button>Breve</button><button class="on">Media · 8 min</button><button>Completa</button></div></div>
    <div class="field"><span class="label">Incluir</span><div class="stack s8">${['Conceptos clave', 'Ejemplos prácticos', 'Resumen y conclusiones', 'Preguntas de reflexión'].map(x => `<label class="check"><input type="checkbox" checked>${x}</label>`).join('')}</div></div>
    <div class="field"><label for="r-ins">Instrucciones adicionales (opcional)</label><textarea class="textarea" id="r-ins" placeholder="Ej. Usa ejemplos de WhatsApp y del punto de venta">Usa ejemplos de WhatsApp y del punto de venta.</textarea></div>
    ${genButton('reading')}`;
  if (kind === 'slides') { const a = aiState(); return `<div class="field"><span class="label">Fuente</span><div class="seg" style="align-self:flex-start"><button class="${a.slideSrc !== 'topic' ? 'on' : ''}" data-act="slideSrc" data-arg="doc">${icon('fileText')}Documento</button><button class="${a.slideSrc === 'topic' ? 'on' : ''}" data-act="slideSrc" data-arg="topic">${icon('edit')}Escribir un tema</button></div></div>
    ${a.slideSrc === 'topic' ? `<div class="field"><label for="s-topic">Tema</label><textarea class="textarea" id="s-topic">Servicio al cliente omnicanal para asesores de Grupo Nova: principios, canales digitales y buenas prácticas.</textarea></div>` : sourceCard()}
    <div class="field"><label for="s-n">Número de diapositivas</label><select class="select" id="s-n"><option>6 a 8</option><option selected>8 a 10</option><option>12 a 15</option></select></div>
    <div class="field"><span class="label">Estilo visual</span><div class="row" style="gap:8px;padding:10px;border:1px solid var(--line);border-radius:12px">${logoMark(S.uni, 28)}<div class="small grow"><b>Marca ${esc(S.uni.name)}</b><br><span class="subtle">Colores y logo de Mi Universidad</span></div><span class="swatch" style="background:${S.uni.primary};width:20px;height:20px"></span><span class="swatch" style="background:${S.uni.accent};width:20px;height:20px"></span></div></div>
    <div class="field"><span class="label">Incluir</span><div class="stack s8">${['Portada y objetivos', 'Conceptos clave', 'Ejemplos', 'Conclusiones', 'Notas del orador'].map((x, i) => `<label class="check"><input type="checkbox" ${i < 4 ? 'checked' : ''}>${x}</label>`).join('')}</div></div>
    ${genButton('slides')}`; }
  const a = aiState(); const q = a.qcfg || (a.qcfg = { src: 'doc', n: 10, diff: 'Intermedio', types: ['mc', 'tf', 'short'] });
  return `<div class="field"><label for="q-src">Generar a partir de</label><select class="select" id="q-src" data-ch="qSrc"><option value="doc" ${q.src === 'doc' ? 'selected' : ''}>Un documento</option><option value="reading" ${q.src === 'reading' ? 'selected' : ''}>Una lectura del curso</option><option value="slides" ${q.src === 'slides' ? 'selected' : ''}>Una presentación</option><option value="course" ${q.src === 'course' ? 'selected' : ''}>Un curso existente</option></select></div>
    ${q.src === 'doc' ? sourceCard() : q.src === 'course' ? `<div class="field"><label for="q-course">Curso</label><select class="select" id="q-course">${S.courses.filter(c => c.status !== 'archived').map(c => `<option ${c.id === 'c7' ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</select></div>` : `<div class="field"><label for="q-les">${q.src === 'reading' ? 'Lectura' : 'Presentación'}</label><select class="select" id="q-les"><option>${q.src === 'reading' ? 'Principios de servicio Nova' : 'WhatsApp, chat y redes'}</option></select></div>`}
    <div class="field"><span class="label">Número de preguntas</span><div class="seg" style="align-self:flex-start">${[5, 10, 15].map(n => `<button class="${q.n === n ? 'on' : ''}" data-act="qN" data-arg="${n}">${n}</button>`).join('')}</div></div>
    <div class="field"><span class="label">Dificultad</span><div class="seg" style="align-self:flex-start">${['Básico', 'Intermedio', 'Avanzado'].map(n => `<button class="${q.diff === n ? 'on' : ''}" data-act="qDiff" data-arg="${n}">${n}</button>`).join('')}</div></div>
    <div class="field"><span class="label">Tipos de pregunta</span><div class="stack s8">${[['mc', 'Selección múltiple'], ['tf', 'Verdadero / falso'], ['short', 'Respuesta corta']].map(([k, l]) => `<label class="check"><input type="checkbox" value="${k}" data-ch="qType" ${q.types.includes(k) ? 'checked' : ''}>${l}</label>`).join('')}</div></div>
    ${genButton('quiz')}`;
};
REG.aiRight = () => {
  const a = aiState(), kind = a.kind;
  if (a.stage === 'gen') return genProgress(kind);
  if (a.stage !== 'done') return genEmpty(kind);
  if (kind === 'reading') return `${resultBar('reading', `<span class="xs subtle">${a.editing ? 'Haz clic en cualquier texto para editarlo' : '≈ 8 min de lectura'}</span>`)}
    <article class="reading ${a.editing ? 'editing' : ''}" style="${brandVars(S.uni)}"><div class="prose" id="reading-doc" ${a.editing ? 'contenteditable="true"' : ''} data-in="readingEdit">${a.html}</div></article>`;
  if (kind === 'slides') return slidesEditor();
  return quizEditor();
};
ACT.aiEdit = () => { const a = aiState(); a.editing = !a.editing; refresh('aiRight'); if (a.editing) setTimeout(() => $('#reading-doc')?.focus(), 0); else toast('Cambios guardados en la propuesta'); };
IN.readingEdit = el => { aiState().html = el.innerHTML; };

const READINGS = [
  `<span class="ai-tag">${icon('sparkles')}LECTURA GENERADA · FUENTE: MANUAL DE SERVICIO AL CLIENTE NOVA 2026</span>
  <h1>Servicio al cliente omnicanal: una sola conversación en todos los canales</h1>
  <p class="lead">Los clientes no piensan en canales; piensan en resolver lo que necesitan. Un servicio omnicanal logra que la conversación continúe sin importar si empezó en WhatsApp, siguió por teléfono y terminó en el punto de venta.</p>
  <h2>1. Qué significa ser omnicanal</h2>
  <p>Ser omnicanal no es estar en todos los canales, sino que todos los canales compartan el mismo contexto. Cuando un cliente escribe por chat, el asesor que lo atiende por teléfono debería conocer el historial sin pedirle que repita su caso.</p>
  <h3>Multicanal no es lo mismo que omnicanal</h3>
  <p>En un modelo multicanal cada canal funciona por separado. En un modelo omnicanal los canales se conectan: el cliente cambia de canal y su historia lo acompaña.</p>
  <h2>Conceptos clave</h2>
  <div class="concepts"><div class="concept"><b>Viaje del cliente</b>Secuencia de momentos en los que el cliente interactúa con la marca, antes, durante y después de la compra.</div><div class="concept"><b>Contexto compartido</b>Información del caso disponible para cualquier asesor, en cualquier canal.</div><div class="concept"><b>Resolución en el primer contacto</b>Porcentaje de casos resueltos sin que el cliente tenga que volver a escribir o llamar.</div><div class="concept"><b>Tono de marca</b>Forma de hablar que hace reconocible a Nova: cercana, clara y resolutiva.</div></div>
  <h2>2. Los cuatro principios del servicio Nova</h2>
  <ol><li><b>Escuchar antes de responder.</b> Confirma que entendiste la necesidad antes de ofrecer una solución.</li><li><b>Resolver, no remitir.</b> Si puedes solucionarlo, hazlo; si no, acompaña el traspaso.</li><li><b>Ser consistentes.</b> La misma respuesta, con el mismo tono, en todos los canales.</li><li><b>Cerrar el ciclo.</b> Confirma que el cliente quedó satisfecho y registra el caso.</li></ol>
  <div class="example"><b>Ejemplo.</b> Una clienta escribe por WhatsApp a las 9:40 p. m. porque su pedido no llegó. El asesor del turno siguiente la llama a las 8:00 a. m., ya conoce el número de pedido y le confirma la nueva fecha de entrega sin hacerle repetir la historia.</div>
  <h2>3. Cómo responder en canales digitales</h2>
  <p>En canales escritos, la claridad pesa más que la extensión. Usa frases cortas, confirma datos importantes y evita los tecnicismos. Responde en menos de 15 minutos en horario hábil y, si necesitas más tiempo, informa cuándo volverás con una respuesta.</p>
  <h2>Resumen</h2>
  <div class="summary"><ul><li>Omnicanal significa contexto compartido, no presencia en todos los canales.</li><li>Los cuatro principios: escuchar, resolver, ser consistentes y cerrar el ciclo.</li><li>En canales digitales, la claridad y el tiempo de respuesta definen la experiencia.</li></ul></div>
  <h2>Conclusiones</h2>
  <p>Una experiencia omnicanal se construye con pequeñas decisiones diarias: registrar bien un caso, no pedir información que ya tenemos y mantener el mismo tono en cada respuesta. Cada asesor es responsable de que la conversación continúe.</p>
  <h2>Preguntas de reflexión</h2>
  <div class="reflect"><ol><li>¿En qué momento del viaje del cliente se pierde hoy más información en tu equipo?</li><li>Piensa en un caso reciente que se remitió a otra área. ¿Qué habrías necesitado para resolverlo tú?</li><li>¿Cómo describirías el tono de Nova a un compañero que acaba de ingresar?</li></ol></div>`,
  `<span class="ai-tag">${icon('sparkles')}LECTURA GENERADA · VERSIÓN 2</span>
  <h1>Una experiencia, muchos canales: guía de servicio omnicanal para asesores</h1>
  <p class="lead">Hoy un mismo cliente puede escribirnos, llamarnos y visitarnos en la misma semana. Esta lectura te ayudará a que, para él, todo se sienta como una sola conversación con Nova.</p>
  <h2>1. Del canal al cliente</h2>
  <p>Durante años organizamos el servicio por canales: el equipo de teléfono, el de redes, el de tiendas. El enfoque omnicanal pone al cliente en el centro y conecta a todos los equipos alrededor de su caso.</p>
  <h3>La prueba de la repetición</h3>
  <p>Si un cliente tiene que contar su problema dos veces, el servicio no es omnicanal. Usa esta prueba sencilla para evaluar tus propios procesos.</p>
  <h2>Conceptos clave</h2>
  <div class="concepts"><div class="concept"><b>Historial unificado</b>Registro único de todas las interacciones del cliente.</div><div class="concept"><b>Traspaso acompañado</b>Cambio de canal o de área en el que el asesor presenta el caso al siguiente responsable.</div><div class="concept"><b>Tiempo de primera respuesta</b>Minutos que pasan entre el mensaje del cliente y la primera respuesta útil.</div><div class="concept"><b>Satisfacción (CSAT)</b>Calificación que el cliente da al terminar la atención.</div></div>
  <h2>2. Cuatro hábitos que marcan la diferencia</h2>
  <ol><li><b>Revisa el historial</b> antes de saludar.</li><li><b>Confirma la necesidad</b> con tus palabras.</li><li><b>Ofrece una solución o una fecha</b>, nunca un “ya le avisamos”.</li><li><b>Registra el cierre</b> para que el siguiente asesor tenga contexto.</li></ol>
  <div class="example"><b>Ejemplo.</b> Un cliente comenta en Instagram que su tarjeta de regalo no funciona. El asesor responde en público con empatía, pasa la conversación a mensaje privado, resuelve el caso y deja la nota en el historial.</div>
  <h2>Resumen</h2>
  <div class="summary"><ul><li>El cliente no debería repetir su historia.</li><li>Cuatro hábitos: historial, confirmación, solución con fecha y registro.</li></ul></div>
  <h2>Conclusiones</h2>
  <p>La tecnología ayuda, pero la experiencia la construyen las personas. Tu forma de atender define cómo los clientes recuerdan a Nova.</p>
  <h2>Preguntas de reflexión</h2>
  <div class="reflect"><ol><li>¿Qué información sueles pedir que ya podrías encontrar en el historial?</li><li>¿Cómo harías un traspaso acompañado en tu canal?</li></ol></div>`,
];

/* ---------- Presentación ---------- */
const SAMPLE_SLIDES = [
  { layout: 'cover', k: 'Servicio al cliente omnicanal', t: 'Una sola conversación en todos los canales', s: 'Módulo 2 · Formación para asesores' },
  { layout: 'list', k: 'Objetivos', t: 'Al terminar esta sesión podrás', items: ['Explicar la diferencia entre multicanal y omnicanal', 'Aplicar los cuatro principios del servicio Nova', 'Responder con claridad en canales digitales'] },
  { layout: 'image', k: 'Contexto', t: 'El cliente no piensa en canales', s: 'Empieza en WhatsApp, sigue por teléfono y termina en la tienda. Para él es una sola conversación.', img: ['wave', 262] },
  { layout: 'concepts', k: 'Conceptos clave', t: 'Lo que hace posible la experiencia', items: ['Viaje del cliente|Los momentos en que interactúa con la marca', 'Contexto compartido|El historial disponible en todos los canales', 'Primer contacto|Resolver sin que tenga que volver'] },
  { layout: 'list', k: 'Principios', t: 'Los cuatro principios del servicio Nova', items: ['Escuchar antes de responder', 'Resolver, no remitir', 'Ser consistentes en todos los canales', 'Cerrar el ciclo y registrar el caso'] },
  { layout: 'quote', k: 'Ejemplo', t: '“Ya tengo tu número de pedido. Tu entrega llega mañana antes de las 12.”', s: 'Respuesta del asesor que conoce el historial y no pide repetir la historia.' },
  { layout: 'image', k: 'Canales digitales', t: 'Claridad antes que extensión', s: 'Frases cortas, datos confirmados y respuesta en menos de 15 minutos en horario hábil.', img: ['blocks', 18] },
  { layout: 'list', k: 'Conclusiones', t: 'Para llevar a tu próximo turno', items: ['Revisa el historial antes de saludar', 'Ofrece una solución o una fecha concreta', 'Deja contexto para el siguiente asesor'] },
];
const SLIDE_ALTS = [
  { t: 'Un cliente, una historia, todos los canales', s: 'Así se ve el servicio cuando los equipos comparten el contexto.' },
  { t: 'Por qué el contexto lo cambia todo', s: 'Sin historial, el cliente repite; con historial, el asesor resuelve.' },
];
function slideHtml(sl, i, total, editable = false, idx = i) {
  const ce = f => editable ? `contenteditable="true" data-in="slideField" data-arg="${idx}:${f}"` : '';
  const foot = `<div class="sl-foot"><span>${esc(S.uni.name)}</span><span>${i + 1} / ${total}</span></div>`;
  let body;
  if (sl.layout === 'cover') body = `<div class="sl sl-cover" style="background-image:${bannerArt(S.uni, 'lines')};background-size:cover"><div class="sl-logo">${logoMark(S.uni, 40)}</div><div class="sl-k" ${ce('k')}>${esc(sl.k)}</div><div class="sl-t" ${ce('t')}>${esc(sl.t)}</div><div class="sl-s" ${ce('s')}>${esc(sl.s)}</div><div style="height:4cqw"></div>${foot}</div>`;
  else if (sl.layout === 'image') body = `<div class="sl"><div class="sl-cols"><div class="stack" style="gap:2cqw;justify-content:center"><div class="sl-k" ${ce('k')}>${esc(sl.k)}</div><div class="sl-t" ${ce('t')}>${esc(sl.t)}</div><div class="sl-s" ${ce('s')}>${esc(sl.s)}</div></div><div class="sl-img" style="background-image:${coverArt({ motif: sl.img[0], hue: sl.img[1] })}"></div></div>${foot}</div>`;
  else if (sl.layout === 'concepts') body = `<div class="sl"><div class="sl-k" ${ce('k')}>${esc(sl.k)}</div><div class="sl-t" ${ce('t')}>${esc(sl.t)}</div><div style="flex:1"></div><div class="sl-grid">${sl.items.map((it, j) => { const [a, b] = it.split('|'); return `<div><b ${ce('i' + j + 'a')}>${esc(a)}</b><span ${ce('i' + j + 'b')}>${esc(b)}</span></div>`; }).join('')}</div><div style="height:4cqw"></div>${foot}</div>`;
  else if (sl.layout === 'quote') body = `<div class="sl" style="justify-content:center"><div class="sl-k" ${ce('k')}>${esc(sl.k)}</div><div class="sl-quote" ${ce('t')}>${esc(sl.t)}</div><div class="sl-s" ${ce('s')}>${esc(sl.s)}</div>${foot}</div>`;
  else body = `<div class="sl"><div class="sl-k" ${ce('k')}>${esc(sl.k)}</div><div class="sl-t" ${ce('t')}>${esc(sl.t)}</div><ul class="sl-list" style="margin-top:2cqw">${(sl.items || []).map((it, j) => `<li><span ${ce('i' + j)}>${esc(it)}</span></li>`).join('')}</ul>${foot}</div>`;
  return `<div class="slide">${body}</div>`;
}
function viewAISlides() { const a = aiState(); if (a.kind !== 'slides') { a.kind = 'slides'; a.stage = 'idle'; } return genShell('slides'); }
ACT.slideSrc = el => { aiState().slideSrc = el.dataset.arg; refresh('aiLeft'); };
function slidesEditor() {
  const a = aiState(), sl = a.slides, cur = Math.min(a.cur || 0, sl.length - 1);
  return `${resultBar('slides', `<button class="btn sm" data-act="exportPptx">${icon('download')}Exportar a PowerPoint</button>`)}
  <div class="slides-wrap" style="${brandVars(S.uni)}">
    <div class="thumbs" aria-label="Diapositivas">${sl.map((s, i) => `<button class="th ${i === cur ? 'on' : ''}" draggable="true" data-dnd="sld" data-sid="${i}" data-act="slidePick" data-arg="${i}" aria-label="Diapositiva ${i + 1}"><span class="n">${i + 1}</span>${slideHtml(s, i, sl.length)}</button>`).join('')}
      <button class="add-block" data-act="slideAdd" style="padding:10px;font-size:12.5px">${icon('plus')}Añadir</button></div>
    <div class="stack s16" style="min-width:0">
      <div class="row wrap"><span class="small muted grow">Diapositiva ${cur + 1} de ${sl.length} · haz clic en un texto para editarlo · arrastra las miniaturas para reordenar</span>
        <button class="btn ghost sm" data-act="slideMove" data-arg="-1" aria-label="Mover arriba">${icon('moveUp')}</button><button class="btn ghost sm" data-act="slideMove" data-arg="1" aria-label="Mover abajo">${icon('moveDown')}</button>
        ${sl[cur].layout === 'image' ? `<button class="btn sm" data-act="slideImg">${icon('image')}Cambiar imagen</button>` : ''}
        <button class="btn sm" data-act="slideRegen">${icon('sparkles')}Regenerar diapositiva</button>
        <button class="btn ghost sm danger" data-act="slideDel" aria-label="Eliminar diapositiva">${icon('trash')}</button></div>
      <div id="stage">${slideHtml(sl[cur], cur, sl.length, true)}</div>
      ${sl[cur].regen ? `<div class="alert ai">${icon('sparkles')}<span class="small">Diapositiva regenerada. Puedes seguir editándola o regenerarla otra vez.</span></div>` : ''}
      <div class="panel stack s4"><span class="label">Notas del orador</span><div class="editable small" contenteditable="true" data-ph="Añade notas para quien presenta">Inicia con una pregunta al grupo: ¿cuántos canales usaste esta semana para hablar con una marca?</div></div>
    </div></div>`;
}
ACT.slidePick = el => { aiState().cur = +el.dataset.arg; refresh('aiRight'); };
IN.slideField = el => {
  const [i, f] = el.dataset.arg.split(':'); const s = aiState().slides[+i]; const v = el.innerText;
  if (/^i\d+[ab]$/.test(f)) { const j = +f.slice(1, -1); const parts = s.items[j].split('|'); parts[f.endsWith('a') ? 0 : 1] = v; s.items[j] = parts.join('|'); }
  else if (/^i\d+$/.test(f)) s.items[+f.slice(1)] = v; else s[f] = v;
  const th = $$('.thumbs .th')[+i]; if (th) th.innerHTML = `<span class="n">${+i + 1}</span>` + slideHtml(s, +i, aiState().slides.length);
};
ACT.slideMove = el => { const a = aiState(); const i = a.cur, j = i + +el.dataset.arg; if (j < 0 || j >= a.slides.length) return; [a.slides[i], a.slides[j]] = [a.slides[j], a.slides[i]]; a.cur = j; refresh('aiRight'); };
ACT.slideDel = () => { const a = aiState(); if (a.slides.length <= 1) return; a.slides.splice(a.cur, 1); a.cur = Math.max(0, a.cur - 1); refresh('aiRight'); toast('Diapositiva eliminada'); };
ACT.slideAdd = () => { const a = aiState(); a.slides.splice(a.cur + 1, 0, { layout: 'list', k: 'Nueva sección', t: 'Escribe el título de la diapositiva', items: ['Primera idea', 'Segunda idea', 'Tercera idea'] }); a.cur++; refresh('aiRight'); };
ACT.slideRegen = () => { const a = aiState(); const s = a.slides[a.cur]; const alt = SLIDE_ALTS[(a.regenN = (a.regenN || 0) + 1) % 2]; s.t = alt.t; if (s.s !== undefined) s.s = alt.s; s.regen = true; S.plan.credits -= 5; save(); refresh('aiRight'); toast('Diapositiva regenerada · −5 créditos', 'ai'); };
ACT.slideImg = () => openModal(() => `${modalHead('Cambiar imagen', 'Elige una ilustración o sube la tuya.')}<div class="modal-b"><div class="banners" style="grid-template-columns:repeat(3,minmax(0,1fr))">${[['wave', 262], ['blocks', 18], ['orbit', 200], ['grid', 150], ['stack', 330], ['orbit', 28]].map(([m, h]) => `<button style="background-image:${coverArt({ motif: m, hue: h })}" data-act="slideImgDo" data-arg="${m}:${h}" aria-label="Imagen ${m}"></button>`).join('')}<button class="upload" data-act="toast" data-arg="Sube una imagen JPG o PNG (simulado)">${icon('upload')}</button></div></div>`);
ACT.slideImgDo = el => { const [m, h] = el.dataset.arg.split(':'); const a = aiState(); a.slides[a.cur].img = [m, +h]; closeModal(); refresh('aiRight'); };
ACT.exportPptx = () => toast('servicio_omnicanal.pptx listo para descargar (exportación simulada)');
document.addEventListener('drop', e => {
  if (!UI.drag || UI.drag.kind !== 'sld') return; e.preventDefault();
  const ref = $('.th.drop-before, .th.drop-after'); const a = aiState(); const from = +UI.drag.id;
  if (ref) { const to = +ref.dataset.sid; const [s] = a.slides.splice(from, 1); let idx = to + (ref.classList.contains('drop-after') ? 1 : 0); if (from < idx) idx--; a.slides.splice(idx, 0, s); a.cur = idx; }
  endDrag(); refresh('aiRight'); toast('Diapositiva reordenada');
});

/* ---------- Quiz ---------- */
function viewAIQuiz() { const a = aiState(); if (a.kind !== 'quiz') { a.kind = 'quiz'; a.stage = 'idle'; } return genShell('quiz'); }
ACT.qN = el => { aiState().qcfg.n = +el.dataset.arg; refresh('aiLeft'); };
ACT.qDiff = el => { aiState().qcfg.diff = el.dataset.arg; refresh('aiLeft'); };
CH.qSrc = el => { aiState().qcfg.src = el.value; refresh('aiLeft'); };
CH.qType = el => { const t = aiState().qcfg.types; el.checked ? t.push(el.value) : t.splice(t.indexOf(el.value), 1); };
const QPOOL = [
  { type: 'mc', q: '¿Qué caracteriza a un servicio omnicanal?', options: ['Estar presente en la mayor cantidad de canales', 'Que todos los canales compartan el contexto del cliente', 'Atender solo por canales digitales', 'Tener un equipo distinto por canal'], correct: 1, why: 'Omnicanal significa contexto compartido entre canales, no cantidad de canales.' },
  { type: 'tf', q: 'En un modelo multicanal, el historial del cliente acompaña cada cambio de canal.', options: ['Verdadero', 'Falso'], correct: 1, why: 'Eso describe al modelo omnicanal; en el multicanal los canales funcionan por separado.' },
  { type: 'mc', q: '¿Cuál es el tiempo máximo de primera respuesta en canales digitales según el manual?', options: ['5 minutos', '15 minutos', '1 hora', '24 horas'], correct: 1, why: 'El manual establece 15 minutos en horario hábil.' },
  { type: 'short', q: 'Nombra los cuatro principios del servicio Nova.', answer: 'Escuchar antes de responder, resolver sin remitir, ser consistentes y cerrar el ciclo.', why: 'Se aceptan sinónimos cercanos de cada principio.' },
  { type: 'mc', q: '¿Qué significa “resolver, no remitir”?', options: ['Enviar todos los casos al área experta', 'Solucionar el caso si está a tu alcance y acompañar el traspaso si no', 'Cerrar el caso aunque no esté resuelto', 'Pedir al cliente que llame a otra línea'], correct: 1, why: 'El asesor resuelve o acompaña el traspaso para que el cliente no repita su historia.' },
  { type: 'tf', q: 'Pedirle al cliente que repita información que ya está en el historial es una señal de un servicio poco omnicanal.', options: ['Verdadero', 'Falso'], correct: 0, why: 'Es la “prueba de la repetición” descrita en la lectura.' },
  { type: 'mc', q: '¿Qué debe hacer el asesor antes de saludar a un cliente que vuelve a escribir?', options: ['Pedir su número de documento', 'Revisar el historial del caso', 'Transferirlo a un supervisor', 'Enviar una encuesta de satisfacción'], correct: 1, why: 'Revisar el historial evita pedir información repetida.' },
  { type: 'short', q: '¿Qué es la resolución en el primer contacto?', answer: 'El porcentaje de casos resueltos sin que el cliente tenga que volver a escribir o llamar.', why: '' },
  { type: 'mc', q: 'En canales escritos, ¿qué pesa más en la experiencia del cliente?', options: ['La extensión de la respuesta', 'El uso de términos técnicos', 'La claridad y los datos confirmados', 'El número de emojis'], correct: 2, why: 'Frases cortas y claras con datos confirmados.' },
  { type: 'tf', q: 'Si necesitas más tiempo para resolver, lo mejor es no responder hasta tener la solución.', options: ['Verdadero', 'Falso'], correct: 1, why: 'Debes informar cuándo volverás con una respuesta.' },
  { type: 'mc', q: '¿Cuál de estos es un ejemplo de traspaso acompañado?', options: ['Dar al cliente otro número de teléfono', 'Presentar el caso al siguiente responsable y avisar al cliente', 'Cerrar el chat y abrir un ticket nuevo', 'Pedir al cliente que escriba un correo'], correct: 1, why: '' },
  { type: 'short', q: 'Describe en una frase el tono de marca de Nova.', answer: 'Cercano, claro y resolutivo.', why: '' },
  { type: 'mc', q: '¿Qué indicador mide la calificación del cliente al terminar la atención?', options: ['NPS', 'CSAT', 'FCR', 'AHT'], correct: 1, why: '' },
  { type: 'tf', q: 'Registrar el cierre del caso ayuda al siguiente asesor a tener contexto.', options: ['Verdadero', 'Falso'], correct: 0, why: '' },
  { type: 'mc', q: 'Un cliente se queja en público en Instagram. ¿Qué es lo más recomendable?', options: ['Ignorar el comentario', 'Responder con empatía y pasar a mensaje privado', 'Borrar el comentario', 'Responder con un mensaje automático'], correct: 1, why: '' },
];
function buildQuiz() {
  const q = aiState().qcfg; const pool = QPOOL.filter(x => q.types.includes(x.type));
  return JSON.parse(JSON.stringify((pool.length ? pool : QPOOL).slice(0, q.n)));
}
function quizEditor() {
  const a = aiState(), qs = a.questions, q = a.qcfg;
  const T = { mc: 'Selección múltiple', tf: 'Verdadero / falso', short: 'Respuesta corta' };
  return `${resultBar('quiz', `<span class="xs subtle">${qs.length} preguntas · ${q.diff}</span>`)}
  <div class="stack s16" style="max-width:820px">${qs.map((x, i) => `<div class="card qcard">
    <div class="row between"><span class="q-n">PREGUNTA ${i + 1} · ${T[x.type].toUpperCase()}</span><div class="row" style="gap:2px"><button class="btn ghost sm" data-act="qRegen" data-arg="${i}">${icon('refresh')}Regenerar</button><button class="btn ghost icon sm" data-act="qDel" data-arg="${i}" aria-label="Eliminar">${icon('trash')}</button></div></div>
    <div class="q-text editable" contenteditable="true" data-in="aqText" data-arg="${i}">${esc(x.q)}</div>
    ${x.type === 'short' ? `<div class="opt correct"><span class="mark">${icon('check')}</span><div class="grow"><span class="xs subtle">Respuesta esperada</span><div class="editable" contenteditable="true" data-in="aqAns" data-arg="${i}">${esc(x.answer)}</div></div></div>`
      : x.options.map((o, oi) => `<div class="opt ${x.correct === oi ? 'correct' : ''}"><button class="mark" data-act="aqCorrect" data-arg="${i}:${oi}" aria-label="Marcar como correcta">${x.correct === oi ? icon('check') : ''}</button><div class="editable" contenteditable="true" data-in="aqOpt" data-arg="${i}:${oi}">${esc(o)}</div>${x.correct === oi ? '<span class="badge ok plain">Correcta</span>' : ''}</div>`).join('')}
    ${x.why ? `<div class="xs muted row" style="gap:6px">${icon('info')}<span>Retroalimentación: ${esc(x.why)}</span></div>` : ''}
  </div>`).join('')}<button class="add-block" data-act="aqAdd">${icon('plus')}Añadir pregunta</button></div>`;
}
IN.aqText = el => { aiState().questions[+el.dataset.arg].q = el.innerText; };
IN.aqAns = el => { aiState().questions[+el.dataset.arg].answer = el.innerText; };
IN.aqOpt = el => { const [i, o] = el.dataset.arg.split(':').map(Number); aiState().questions[i].options[o] = el.innerText; };
ACT.aqCorrect = el => { const [i, o] = el.dataset.arg.split(':').map(Number); aiState().questions[i].correct = o; refresh('aiRight'); };
ACT.qDel = el => { aiState().questions.splice(+el.dataset.arg, 1); refresh('aiRight'); };
ACT.qRegen = el => { const a = aiState(); const i = +el.dataset.arg; const used = a.questions.map(x => x.q); const alt = QPOOL.find(x => !used.includes(x.q) && x.type === a.questions[i].type) || QPOOL.find(x => !used.includes(x.q)); if (alt) a.questions[i] = JSON.parse(JSON.stringify(alt)); refresh('aiRight'); toast('Pregunta regenerada', 'ai'); };
ACT.aqAdd = () => { aiState().questions.push({ type: 'mc', q: 'Nueva pregunta', options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correct: 0, why: '' }); refresh('aiRight'); };

/* ---------- Añadir al curso ---------- */
ACT.aiAddToCourse = el => {
  const kind = el.dataset.arg; const a = aiState();
  const def = { reading: 'Servicio al cliente omnicanal: una sola conversación', slides: 'Presentación: servicio omnicanal', quiz: 'Quiz: servicio omnicanal' }[kind];
  a.add = { kind, course: 'c7', module: null, title: a.html && kind === 'reading' ? (a.html.match(/<h1>(.*?)<\/h1>/) || [, def])[1] : def, done: false };
  openModal(addToCourseModal);
};
function addToCourseModal() {
  const ad = aiState().add, c = course(ad.course);
  if (!ad.module || !c.modules.find(m => m.id === ad.module)) ad.module = c.modules[c.modules.length - 1]?.id;
  if (ad.done) return `<div class="modal-b stack s16" style="text-align:center;align-items:center;padding:32px 28px 8px"><span style="width:56px;height:56px;border-radius:50%;background:var(--ok);color:#fff;display:grid;place-items:center">${icon('check')}</span><h2>Añadido a tu curso</h2><p class="muted">“${esc(ad.title)}” ahora está en <b>${esc(c.title)}</b> › ${esc(c.modules.find(m => m.id === ad.module).title)}.</p></div>
    <div class="modal-f" style="justify-content:center"><button class="btn" data-go="admin/ai">Seguir creando</button><button class="btn primary" data-act="openAdded">${icon('edit')}Abrir en el editor</button></div>`;
  return `${modalHead('Añadir al curso', 'Se añadirá como una lección nueva que puedes seguir editando.')}
  <div class="modal-b stack s16">
    <div class="field"><label for="ad-title">Nombre de la lección</label><input class="input" id="ad-title" value="${esc(ad.title)}" data-in="adTitle"></div>
    <div class="field"><label for="ad-course">Curso</label><select class="select" id="ad-course" data-ch="adCourse">${S.courses.filter(x => x.status !== 'archived').map(x => `<option value="${x.id}" ${x.id === ad.course ? 'selected' : ''}>${esc(x.title)}${x.status === 'draft' ? ' · borrador' : ''}</option>`).join('')}</select></div>
    <div class="field"><span class="label">Módulo</span><div class="stack s8">${c.modules.map(m => `<label class="row" style="padding:9px 12px;border:1px solid ${ad.module === m.id ? 'var(--sys)' : 'var(--line)'};border-radius:10px;cursor:pointer"><input type="radio" name="ad-mod" value="${m.id}" ${ad.module === m.id ? 'checked' : ''} data-ch="adModule" style="accent-color:var(--sys)"><span class="small grow">${esc(m.title)}</span><span class="xs subtle">${m.lessons.length} lecciones</span></label>`).join('')}</div></div>
    <div class="alert">${icon('info')}<div class="small">Si el curso está publicado, la lección se añadirá como borrador hasta que la revises.</div></div>
  </div>
  <div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button><button class="btn primary" data-act="adDo">${icon('plus')}Añadir al curso</button></div>`;
}
IN.adTitle = el => aiState().add.title = el.value;
CH.adCourse = el => { const ad = aiState().add; ad.course = el.value; ad.module = null; renderModal(); };
CH.adModule = el => { aiState().add.module = el.value; renderModal(); };
ACT.adDo = () => {
  const a = aiState(), ad = a.add, c = course(ad.course), m = c.modules.find(x => x.id === ad.module);
  const type = ad.kind === 'reading' ? 'reading' : ad.kind === 'slides' ? 'slides' : 'quiz';
  const l = L(type, ad.title, ad.kind === 'reading' ? 8 : 10, { ai: true });
  if (ad.kind === 'reading') l.html = a.html;
  if (ad.kind === 'slides') l.slides = JSON.parse(JSON.stringify(a.slides));
  if (ad.kind === 'quiz') l.questions = a.questions.filter(q => q.type !== 'short').map(q => ({ q: q.q, type: q.type, options: q.options, correct: q.correct }));
  m.lessons.push(l); c.updated = 'Justo ahora';
  S.ai.history.unshift({ kind: ad.kind, title: `${AI_META[ad.kind].label} · ${ad.title}`, when: 'Justo ahora', credits: AI_COST[ad.kind], course: c.title });
  S.activity.unshift({ ico: 'sparkles', t: `AI Course Studio añadió <b>${esc(ad.title)}</b> a <b>${esc(c.title)}</b>`, when: 'Justo ahora' });
  ad.done = true; ad.lid = l.id; save(); renderModal();
};
ACT.openAdded = () => { const ad = aiState().add; UI.tmp.sel = ad.lid; UI.tmp.flash = ad.lid; closeModal(); go(`admin/builder/${ad.course}`); };
