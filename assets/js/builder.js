/* ==========================================================================
   Constructor de cursos: Curso → Módulos → Lecciones (bloques tipo Notion)
   ========================================================================== */

function viewBuilder(id) {
  const c = course(id); if (!c) return viewCourses();
  const all = c.modules.flatMap(m => m.lessons);
  if (!UI.tmp.sel || !findLesson(c, UI.tmp.sel)) UI.tmp.sel = all[0]?.id || null;
  if (UI.tmp.builderCourse !== id) { UI.tmp.builderCourse = id; UI.tmp.itab = 'lesson'; }
  return `<div class="builder-wrap">
    <header class="builder-top">
      <button class="btn ghost icon" data-go="admin/course/${c.id}" aria-label="Volver al curso">${icon('arrowL')}</button>
      <span class="thumb" style="background-image:${coverArt(c)};width:40px;height:28px"></span>
      <input class="title-input" id="b-title" value="${esc(c.title)}" data-in="bTitle" aria-label="Nombre del curso">
      ${region('bStatus', 'span', 'class="row" style="gap:10px"')}
      <div class="grow"></div>
      <button class="btn ghost sm" data-go="admin/ai" data-tip="Generar contenido con IA">${icon('sparkles')}<span>IA</span></button>
      <button class="btn sm" data-act="previewCourse" data-arg="${c.id}">${icon('eye')}<span>Vista previa</span></button>
      ${c.status === 'published' ? `<button class="btn sm" data-act="enroll" data-arg="${c.id}">${icon('userPlus')}<span>Matricular</span></button>` : `<button class="btn primary sm" data-act="publishCheck">${icon('rocket')}Publicar curso</button>`}
    </header>
    <div class="builder">
      <aside class="outline" aria-label="Estructura del curso">${region('outline', 'div', 'class="stack s8"')}</aside>
      <main class="canvas" id="canvas">${region('canvas', 'div', 'class="canvas-inner"')}</main>
      <aside class="inspector" aria-label="Ajustes">${region('inspector', 'div', 'class="stack s16"')}</aside>
    </div>
  </div>`;
}
const bc = () => course(UI.tmp.builderCourse);
function touch() { const c = bc(); c.updated = 'Justo ahora'; save(); UI.tmp.savedAt = Date.now(); refresh('bStatus'); }
REG.bStatus = () => { const c = bc(); return `${statusBadge(c.status)}<span class="saved">${icon('checkCircle')}Guardado automáticamente</span>`; };
IN.bTitle = el => { bc().title = el.value; touch(); };

/* ---------- Estructura (outline) ---------- */
REG.outline = () => {
  const c = bc();
  return `<div class="row between" style="padding:0 4px"><span class="eyebrow">Estructura</span><span class="xs subtle">${c.modules.length} módulos · ${lessonCount(c)} lecciones</span></div>
  ${c.modules.map((m, mi) => `<section class="mod" data-dnd="mod" data-mid="${m.id}">
    <div class="mod-h"><span class="handle" data-handle="mod" title="Arrastra para reordenar" aria-hidden="true">${icon('grip')}</span><span class="mod-n">M${mi + 1}</span>
      <input class="mod-title" value="${esc(m.title)}" data-in="modTitle" data-arg="${m.id}" aria-label="Nombre del módulo">
      <div class="menu-wrap"><button class="btn ghost icon sm" style="width:26px;height:26px" data-act="modMenu" data-arg="${m.id}" aria-label="Opciones del módulo">${icon('more')}</button></div></div>
    <div class="lessons" data-drop-mid="${m.id}">
      ${m.lessons.map(l => `<div class="les ${UI.tmp.sel === l.id ? 'on' : ''} ${UI.tmp.flash === l.id ? 'new-flash' : ''}" draggable="true" data-dnd="les" data-lid="${l.id}" data-act="selLesson" data-arg="${l.id}" tabindex="0" role="button" aria-label="${esc(l.title)}">
        <span class="handle" aria-hidden="true">${icon('grip')}</span>${tico(l.type)}<span class="les-t">${esc(l.title)}</span>
        <div class="menu-wrap"><button class="btn ghost icon sm" style="width:24px;height:24px" data-act="lesMenu" data-arg="${l.id}" aria-label="Opciones de la lección">${icon('more')}</button></div></div>`).join('')}
    </div>
    <button class="add-les" data-act="addContent" data-arg="${m.id}">${icon('plus')}Añadir contenido</button>
  </section>`).join('')}
  <button class="btn block" style="border-style:dashed" data-act="addModule">${icon('plus')}Añadir módulo</button>
  <div class="ai-promo compact" style="margin-top:6px;flex-direction:column;align-items:flex-start"><span class="spark" style="width:34px;height:34px;border-radius:10px">${icon('sparkles')}</span><div class="grow"><h3>¿Todavía no tienes el contenido?</h3><p>Créalo más rápido con IA a partir de tus documentos.</p></div><button class="btn sm" data-go="admin/ai">Probar</button></div>`;
};
IN.modTitle = el => { bc().modules.find(m => m.id === el.dataset.arg).title = el.value; touch(); };
ACT.selLesson = el => { UI.tmp.sel = el.dataset.arg; UI.tmp.flash = null; refresh('outline', 'canvas', 'inspector'); $('#canvas').scrollTop = 0; };
ACT.addModule = () => { const c = bc(); c.modules.push(M(`Módulo ${c.modules.length + 1}`, [])); touch(); refresh('outline'); setTimeout(() => { const ins = $$('.mod-title'); ins[ins.length - 1].select(); }, 0); };
ACT.modMenu = btn => { const id = btn.dataset.arg; toggleMenu(btn, [
  { icon: 'plus', label: 'Añadir contenido', act: 'addContent', arg: id },
  { icon: 'copy', label: 'Duplicar módulo', act: 'dupModule', arg: id },
  { icon: 'moveUp', label: 'Mover arriba', act: 'moveModule', arg: id + ':-1' },
  { icon: 'moveDown', label: 'Mover abajo', act: 'moveModule', arg: id + ':1' }, '-',
  { icon: 'trash', label: 'Eliminar módulo', act: 'delModule', arg: id, danger: true },
]); };
ACT.dupModule = el => { const c = bc(); const i = c.modules.findIndex(m => m.id === el.dataset.arg); const cp = JSON.parse(JSON.stringify(c.modules[i])); cp.id = uid('m'); cp.title += ' (copia)'; cp.lessons.forEach(l => l.id = uid('l')); c.modules.splice(i + 1, 0, cp); touch(); closeMenus(); refresh('outline'); toast('Módulo duplicado'); };
ACT.moveModule = el => { const [id, d] = el.dataset.arg.split(':'); const c = bc(); const i = c.modules.findIndex(m => m.id === id); const j = i + +d; if (j < 0 || j >= c.modules.length) return; [c.modules[i], c.modules[j]] = [c.modules[j], c.modules[i]]; touch(); closeMenus(); refresh('outline'); };
ACT.delModule = el => { const c = bc(); const m = c.modules.find(x => x.id === el.dataset.arg); closeMenus();
  confirmModal('¿Eliminar este módulo?', `Se eliminarán “${esc(m.title)}” y sus ${m.lessons.length} lecciones. Esta acción no se puede deshacer.`, 'Eliminar módulo', () => { c.modules = c.modules.filter(x => x !== m); touch(); refresh('outline', 'canvas', 'inspector'); toast('Módulo eliminado'); }); };
ACT.lesMenu = btn => { const id = btn.dataset.arg; toggleMenu(btn, [
  { icon: 'edit', label: 'Editar', act: 'selLesson', arg: id },
  { icon: 'eye', label: 'Previsualizar', act: 'previewLesson', arg: id },
  { icon: 'copy', label: 'Duplicar', act: 'dupLesson', arg: id },
  { icon: 'moveUp', label: 'Mover arriba', act: 'moveLesson', arg: id + ':-1' },
  { icon: 'moveDown', label: 'Mover abajo', act: 'moveLesson', arg: id + ':1' }, '-',
  { icon: 'trash', label: 'Eliminar', act: 'delLesson', arg: id, danger: true },
]); };
ACT.dupLesson = el => { const c = bc(); const { m, l } = findLesson(c, el.dataset.arg); const cp = JSON.parse(JSON.stringify(l)); cp.id = uid('l'); cp.title += ' (copia)'; m.lessons.splice(m.lessons.indexOf(l) + 1, 0, cp); UI.tmp.sel = cp.id; touch(); closeMenus(); refresh('outline', 'canvas', 'inspector'); toast('Lección duplicada'); };
ACT.moveLesson = el => { const [id, d] = el.dataset.arg.split(':'); const { m, l } = findLesson(bc(), id); const i = m.lessons.indexOf(l), j = i + +d; if (j < 0 || j >= m.lessons.length) return; m.lessons.splice(i, 1); m.lessons.splice(j, 0, l); touch(); closeMenus(); refresh('outline'); };
ACT.delLesson = el => { const c = bc(); const { m, l } = findLesson(c, el.dataset.arg); closeMenus();
  confirmModal('¿Eliminar esta lección?', `“${esc(l.title)}” se eliminará del curso.`, 'Eliminar', () => { m.lessons = m.lessons.filter(x => x !== l); if (UI.tmp.sel === l.id) UI.tmp.sel = null; touch(); refresh('outline', 'canvas', 'inspector'); toast('Lección eliminada'); }); };
ACT.previewLesson = el => { const c = bc(); S.previewFrom = S.route; ensureEnrolled(c.id); go(`student/course/${c.id}/${el.dataset.arg}`); };
function confirmModal(title, text, cta, fn) {
  UI.tmp.confirmFn = fn;
  openModal(() => `${modalHead(title)}<div class="modal-b"><p class="muted">${text}</p></div><div class="modal-f"><button class="btn" data-act="closeModal">Cancelar</button><button class="btn danger solid" data-act="confirmDo">${cta}</button></div>`);
}
ACT.confirmDo = () => { const fn = UI.tmp.confirmFn; closeModal(); fn && fn(); };

/* ---------- Añadir contenido (selector de tipo) ---------- */
ACT.addContent = el => { UI.tmp.addTo = el.dataset.arg; closeMenus(); openModal(() => `${modalHead('Añadir contenido', 'Elige qué tipo de lección quieres agregar a este módulo.')}
  <div class="modal-b stack s16"><div class="inserter">${Object.entries(TYPES).map(([k, t]) => `<button data-act="insertType" data-arg="${k}">${tico(k)}<span>${t.label}</span></button>`).join('')}</div>
  <div class="ai-promo compact"><span class="spark" style="width:36px;height:36px;border-radius:10px">${icon('sparkles')}</span><div class="grow"><h3>Convierte un documento en contenido educativo con IA</h3><p>Lectura, presentación o quiz a partir de tu PDF o Word · desde 15 créditos.</p></div><button class="btn sm" data-go="admin/ai">Usar IA</button></div></div>`, 'wide'); };
ACT.insertType = el => {
  const type = el.dataset.arg, c = bc(); const m = c.modules.find(x => x.id === UI.tmp.addTo) || c.modules[c.modules.length - 1];
  const l = L(type, `Nueva lección: ${TYPES[type].label.toLowerCase()}`);
  if (type === 'quiz' || type === 'exam') l.questions = [{ q: 'Escribe aquí tu primera pregunta', type: 'mc', options: ['Opción A', 'Opción B', 'Opción C'], correct: 0 }];
  if (type === 'text' || type === 'reading') l.blocks = [{ id: uid('b'), kind: 'p', text: '' }];
  m.lessons.push(l); UI.tmp.sel = l.id; UI.tmp.flash = l.id; touch(); closeModal(); refresh('outline', 'canvas', 'inspector');
  setTimeout(() => { const t = $('#les-title'); if (t) { t.focus(); t.select(); } }, 30);
};

/* ---------- Lienzo (editor de la lección) ---------- */
REG.canvas = () => {
  const c = bc();
  if (!UI.tmp.sel) {
    const m = c.modules[0];
    return `<div class="doc" style="padding:40px"><div class="empty"><span class="empty-ico">${icon('layers')}</span><h2>Empieza a construir tu curso</h2><p class="muted" style="max-width:46ch">Agrega lecciones al módulo <b>${esc(m ? m.title : '')}</b>. Puedes combinar videos, lecturas, PDF, actividades y quizzes, y reordenarlos arrastrando.</p></div>
      ${m ? `<div class="inserter">${Object.entries(TYPES).map(([k, t]) => `<button data-act="quickInsert" data-arg="${m.id}:${k}">${tico(k)}<span>${t.label}</span></button>`).join('')}</div>` : `<button class="btn primary" data-act="addModule">${icon('plus')}Añadir módulo</button>`}</div>
      ${aiPromo(true, '¿Todavía no tienes tus cursos listos? Créalos más rápido con IA.')}`;
  }
  const { m, l } = findLesson(c, UI.tmp.sel); const t = TYPES[l.type];
  return `<div class="row between wrap"><nav class="crumbs" style="margin:0"><span>${esc(m.title)}</span>${icon('chevR')}<span>${t.label}</span></nav>
    <div class="row"><button class="btn ghost sm" data-act="dupLesson" data-arg="${l.id}">${icon('copy')}Duplicar</button><button class="btn ghost sm danger" data-act="delLesson" data-arg="${l.id}">${icon('trash')}Eliminar</button><button class="btn sm" data-act="previewLesson" data-arg="${l.id}">${icon('eye')}Previsualizar</button></div></div>
  <article class="doc">
    <div class="row">${tico(l.type)}<span class="eyebrow">${t.label}</span><span class="xs subtle">· ${l.dur} min</span></div>
    <input class="doc-title" id="les-title" value="${esc(l.title)}" data-in="lesTitle" aria-label="Título de la lección">
    <div style="height:8px"></div>
    ${lessonEditor(l, c)}
  </article>`;
};
ACT.quickInsert = el => { const [mid, type] = el.dataset.arg.split(':'); UI.tmp.addTo = mid; el.dataset.arg = type; ACT.insertType(el); };
IN.lesTitle = el => { findLesson(bc(), UI.tmp.sel).l.title = el.value; touch(); const o = $(`.les[data-lid="${UI.tmp.sel}"] .les-t`); if (o) o.textContent = el.value; };

function defaultBlocks(l) {
  return [{ id: uid('b'), kind: 'p', text: `En esta lección revisaremos los conceptos centrales de “${l.title}” y cómo aplicarlos en tu trabajo diario.` }, { id: uid('b'), kind: 'h2', text: 'Ideas clave' }, { id: uid('b'), kind: 'p', text: 'Desarrolla aquí el contenido principal. Usa subtítulos para dividir las ideas y destacados para los mensajes que no deben olvidarse.' }, { id: uid('b'), kind: 'callout', text: 'Consejo: cierra cada sección con una pregunta que conecte el contenido con la realidad del estudiante.' }];
}
function lessonEditor(l, c) {
  if (l.html) return `<div class="alert ai" style="margin-bottom:8px">${icon('sparkles')}<span class="small">Creada con AI Course Studio. Puedes editar el texto directamente.</span></div><div class="prose editable" contenteditable="true" data-in="lesHtml" style="${brandVars(S.uni)}">${l.html}</div>`;
  if (l.type === 'text' || l.type === 'reading') {
    if (!l.blocks) l.blocks = defaultBlocks(l);
    return `<div class="stack s4" id="blocks">${l.blocks.map(b => blockHtml(b)).join('')}</div>
      <div class="row wrap" style="margin-top:8px"><button class="btn ghost sm" data-act="addBlock" data-arg="p">${icon('type')}Texto</button><button class="btn ghost sm" data-act="addBlock" data-arg="h2">${icon('hash')}Subtítulo</button><button class="btn ghost sm" data-act="addBlock" data-arg="callout">${icon('bulb')}Destacado</button><button class="btn ghost sm" data-act="addBlock" data-arg="image">${icon('image')}Imagen</button><div class="grow"></div><button class="btn ai-soft sm" data-go="admin/ai/reading">${icon('sparkles')}Mejorar con IA</button></div>`;
  }
  if (l.type === 'video') return `<div class="media-card"><div class="media-ph" style="background-image:${coverArt(c)}"><span class="play">${icon('play')}</span></div><div class="mc-body">${tico('video')}<div class="grow small"><b>${esc(slug(l.title))}.mp4</b><br><span class="subtle">${l.dur}:12 min · 1080p · subtítulos en español generados</span></div><button class="btn sm" data-act="toast" data-arg="Selecciona un nuevo video (simulado)">${icon('refresh')}Reemplazar</button></div></div>
    ${descBlock(l, 'Describe brevemente qué verá el estudiante en este video.')}
    <div class="row wrap"><label class="check"><input type="checkbox" checked>Exigir ver el 90% para completar</label><label class="check"><input type="checkbox" checked>Mostrar transcripción</label></div>`;
  if (l.type === 'pdf' || l.type === 'file') return `<div class="media-card"><div class="mc-body">${tico(l.type)}<div class="grow small"><b>${esc(slug(l.title))}.${l.type === 'pdf' ? 'pdf' : 'xlsx'}</b><br><span class="subtle">${l.type === 'pdf' ? '18 páginas · 2,4 MB' : '84 KB'}</span></div><button class="btn sm" data-act="toast" data-arg="Archivo reemplazado (simulado)">${icon('upload')}Reemplazar</button></div></div>
    ${l.type === 'pdf' ? `<div class="alert ai">${icon('sparkles')}<div class="small grow"><b>Convierte este documento en contenido educativo con IA.</b> Genera una lectura, una presentación o un quiz a partir de este PDF.</div><button class="btn ai sm" data-go="admin/ai/reading">Convertir</button></div>` : ''}
    ${descBlock(l, 'Indica para qué sirve este archivo.')}<label class="check"><input type="checkbox" checked>Permitir descarga</label>`;
  if (l.type === 'slides') return `<div class="slides-wrap" style="grid-template-columns:1fr"><div style="${brandVars(S.uni)}">${slideHtml((l.slides || SAMPLE_SLIDES)[0], 0, (l.slides || SAMPLE_SLIDES).length)}</div></div>
    <div class="row wrap"><span class="small muted grow">presentacion_${esc(slug(l.title))}.pptx · ${(l.slides || SAMPLE_SLIDES).length} diapositivas</span><button class="btn sm" data-act="toast" data-arg="Selecciona un archivo .pptx o .pdf (simulado)">${icon('upload')}Reemplazar</button><button class="btn ai-soft sm" data-go="admin/ai/slides">${icon('sparkles')}Editar con IA</button></div>`;
  if (l.type === 'link') return `<div class="field"><label for="lk">Enlace</label><div class="input-icon">${icon('link')}<input class="input" id="lk" value="https://www.radicalcandor.com/our-approach/"></div></div>
    <div class="media-card"><div class="mc-body"><span class="tico t-link" style="width:56px;height:56px;border-radius:12px">${icon('globe')}</span><div class="small grow"><b>Radical Candor · Our approach</b><br><span class="subtle">radicalcandor.com · se abrirá en una pestaña nueva</span></div></div></div>${descBlock(l, '¿Qué debe buscar el estudiante en este recurso?')}`;
  if (l.type === 'activity') return `${descBlock(l, 'Escribe las instrucciones de la actividad.', 'Piensa en una persona de tu equipo y describe una tarea que hoy haces tú y podrías delegarle. Usa la matriz de delegación para definir el nivel de autonomía y cómo harás el seguimiento.')}
    <div class="grid2"><div class="field"><label for="act-del">Tipo de entrega</label><select class="select" id="act-del"><option>Texto en la plataforma</option><option>Subir archivo</option><option>Sin entrega (reflexión)</option></select></div><div class="field"><label for="act-rev">Revisión</label><select class="select" id="act-rev"><option>Revisa un administrador</option><option>Autocompletada</option></select></div></div>`;
  if (l.type === 'quiz' || l.type === 'exam') {
    if (!l.questions) l.questions = [];
    return `<div class="row wrap"><span class="badge plain">${l.questions.length} preguntas</span><span class="badge plain">Nota mínima 70</span><span class="badge plain">${l.type === 'exam' ? '1 intento' : 'Intentos ilimitados'}</span><div class="grow"></div><button class="btn ai-soft sm" data-go="admin/ai/quiz">${icon('sparkles')}Generar preguntas con IA</button></div>
    <div class="stack s16" style="margin-top:8px">${l.questions.map((q, qi) => `<div class="q-edit"><div class="row between"><span class="mono xs subtle">PREGUNTA ${qi + 1} · ${q.type === 'tf' ? 'VERDADERO / FALSO' : 'SELECCIÓN MÚLTIPLE'}</span><button class="btn ghost icon sm" data-act="delQ" data-arg="${qi}" aria-label="Eliminar pregunta">${icon('trash')}</button></div>
      <div class="editable" contenteditable="true" style="font-weight:600;font-size:15px" data-in="qText" data-arg="${qi}">${esc(q.q)}</div>
      ${q.options.map((o, oi) => `<div class="opt ${q.correct === oi ? 'correct' : ''}"><button class="mark" data-act="setCorrect" data-arg="${qi}:${oi}" aria-label="Marcar como correcta">${q.correct === oi ? icon('check') : ''}</button><div class="editable" contenteditable="true" data-in="optText" data-arg="${qi}:${oi}">${esc(o)}</div></div>`).join('')}
    </div>`).join('')}<button class="add-block" data-act="addQ">${icon('plus')}Añadir pregunta</button></div>`;
  }
  return '';
}
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 32);
function descBlock(l, ph, def = '') { if (l.desc === undefined) l.desc = def; return `<div class="editable b-p" contenteditable="true" data-ph="${ph}" data-in="lesDesc" style="padding:4px 0">${esc(l.desc)}</div>`; }
IN.lesHtml = el => { findLesson(bc(), UI.tmp.sel).l.html = el.innerHTML; touch(); };
IN.lesDesc = el => { findLesson(bc(), UI.tmp.sel).l.desc = el.innerText; touch(); };
function blockHtml(b) {
  const body = b.kind === 'h2' ? `<div class="editable b-h2" contenteditable="true" data-ph="Subtítulo" data-in="blk" data-arg="${b.id}">${esc(b.text)}</div>`
    : b.kind === 'callout' ? `<div class="b-callout">${icon('bulb')}<div class="editable grow" contenteditable="true" data-ph="Escribe un mensaje destacado" data-in="blk" data-arg="${b.id}">${esc(b.text)}</div></div>`
    : b.kind === 'image' ? `<div class="media-ph" style="border-radius:12px;background-image:${coverArt({ motif: 'wave', hue: 262 })}"></div><div class="editable xs subtle" contenteditable="true" data-ph="Pie de imagen" data-in="blk" data-arg="${b.id}" style="margin-top:6px">${esc(b.text)}</div>`
    : `<div class="editable b-p" contenteditable="true" data-ph="Escribe algo, o usa los botones de abajo para añadir bloques…" data-in="blk" data-arg="${b.id}">${esc(b.text)}</div>`;
  return `<div class="blk" data-dnd="blk" data-bid="${b.id}"><div class="b-tools"><span class="handle" data-handle="blk" title="Arrastra para mover">${icon('grip')}</span></div><div class="b-body">${body}</div><div class="b-acts"><button data-act="dupBlock" data-arg="${b.id}" aria-label="Duplicar bloque" data-tip="Duplicar">${icon('copy')}</button><button data-act="delBlock" data-arg="${b.id}" aria-label="Eliminar bloque" data-tip="Eliminar">${icon('trash')}</button></div></div>`;
}
const curLesson = () => findLesson(bc(), UI.tmp.sel).l;
IN.blk = el => { const b = curLesson().blocks.find(x => x.id === el.dataset.arg); b.text = el.innerText; touch(); };
ACT.addBlock = el => { const l = curLesson(); const b = { id: uid('b'), kind: el.dataset.arg, text: el.dataset.arg === 'image' ? 'Ilustración del concepto' : '' }; l.blocks.push(b); touch(); refresh('canvas'); setTimeout(() => $(`[data-bid="${b.id}"] .editable`)?.focus(), 0); };
ACT.dupBlock = el => { const l = curLesson(); const i = l.blocks.findIndex(x => x.id === el.dataset.arg); l.blocks.splice(i + 1, 0, { ...l.blocks[i], id: uid('b') }); touch(); refresh('canvas'); };
ACT.delBlock = el => { const l = curLesson(); l.blocks = l.blocks.filter(x => x.id !== el.dataset.arg); touch(); refresh('canvas'); };
IN.qText = el => { curLesson().questions[+el.dataset.arg].q = el.innerText; touch(); };
IN.optText = el => { const [q, o] = el.dataset.arg.split(':').map(Number); curLesson().questions[q].options[o] = el.innerText; touch(); };
ACT.setCorrect = el => { const [q, o] = el.dataset.arg.split(':').map(Number); curLesson().questions[q].correct = o; touch(); refresh('canvas'); };
ACT.delQ = el => { curLesson().questions.splice(+el.dataset.arg, 1); touch(); refresh('canvas'); };
ACT.addQ = () => { curLesson().questions.push({ q: 'Nueva pregunta', type: 'mc', options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correct: 0 }); touch(); refresh('canvas'); };

/* ---------- Inspector ---------- */
REG.inspector = () => {
  const c = bc(); const tab = UI.tmp.itab || 'lesson';
  const l = UI.tmp.sel ? findLesson(c, UI.tmp.sel)?.l : null;
  const tabs = `<div class="seg" style="align-self:flex-start"><button class="${tab === 'lesson' ? 'on' : ''}" data-act="itab" data-arg="lesson">Lección</button><button class="${tab === 'course' ? 'on' : ''}" data-act="itab" data-arg="course">Curso</button></div>`;
  if (tab === 'course' || !l) return `${tabs}
    <div class="insp-sec"><h4>Portada</h4><div class="cover" style="background-image:${coverArt(c)};border-radius:12px"></div><button class="btn sm" data-act="toast" data-arg="Sube una imagen JPG o PNG de 1600×800 (simulado)">${icon('image')}Cambiar imagen</button></div>
    <div class="insp-sec"><h4>Descripción</h4><textarea class="textarea" id="ic-desc" data-in="cDesc">${esc(c.description)}</textarea></div>
    <div class="insp-sec"><h4>Finalización</h4><label class="set-row"><span>Emitir certificado</span><span class="switch"><input type="checkbox" ${c.certificate ? 'checked' : ''} data-ch="cCert"><span></span></span></label><label class="set-row"><span>Orden secuencial</span><span class="switch"><input type="checkbox"><span></span></span></label></div>
    <div class="insp-sec"><h4>Acceso</h4><div class="small muted">${c.students} estudiantes matriculados</div><button class="btn sm" data-act="enroll" data-arg="${c.id}">${icon('userPlus')}Matricular estudiantes</button></div>`;
  return `${tabs}
    <div class="insp-sec"><h4>Tipo de contenido</h4><div class="row">${tico(l.type)}<b class="small">${TYPES[l.type].label}</b></div></div>
    <div class="insp-sec"><h4>Configuración</h4>
      <div class="field"><label for="i-dur">Duración estimada (min)</label><input class="input" type="number" min="1" id="i-dur" value="${l.dur}" data-in="lDur"></div>
      <label class="set-row"><span>Obligatoria para completar</span><span class="switch"><input type="checkbox" checked><span></span></span></label>
      <label class="set-row"><span>Permitir comentarios</span><span class="switch"><input type="checkbox"><span></span></span></label>
      <div class="field"><label for="i-av">Disponible</label><select class="select" id="i-av"><option>Inmediatamente</option><option>En una fecha</option><option>Al completar la lección anterior</option></select></div>
    </div>
    <div class="ai-promo compact" style="flex-direction:column;align-items:flex-start"><span class="spark" style="width:34px;height:34px;border-radius:10px">${icon('sparkles')}</span><div><h3>Convierte este documento en contenido educativo con IA</h3><p>Sube un PDF o Word y genera lecturas, presentaciones o quizzes editables.</p></div><button class="btn sm" data-go="admin/ai">${icon('wand')}Abrir AI Course Studio</button></div>
    <div class="panel stack s8"><b class="small">${icon('gem')} ¿Quieres este curso con producción profesional?</b><span class="xs muted">Video, animaciones y diseño instruccional por nuestro equipo.</span><button class="link xs" data-act="customCourse">Solicitar curso personalizado ${icon('arrowR')}</button></div>`;
};
ACT.itab = el => { UI.tmp.itab = el.dataset.arg; refresh('inspector'); };
IN.cDesc = el => { bc().description = el.value; touch(); };
CH.cCert = el => { bc().certificate = el.checked; touch(); };
IN.lDur = el => { curLesson().dur = Math.max(1, +el.value || 1); touch(); };

/* ---------- Publicar ---------- */
ACT.publishCheck = () => {
  const c = bc(); const n = lessonCount(c);
  const items = [[true, 'Portada e información básica'], [n > 0, `${n} lecciones en ${c.modules.length} módulos`], [c.description.length > 20, 'Descripción del curso'], [c.certificate, 'Certificado al finalizar']];
  openModal(() => `${modalHead('Publicar curso', 'Revisamos que todo esté listo para tus estudiantes.')}
    <div class="modal-b stack s8">${items.map(([ok, t]) => `<div class="row" style="padding:10px 12px;border:1px solid var(--line);border-radius:12px"><span class="badge ${ok ? 'ok' : 'warn'} plain">${icon(ok ? 'check' : 'alert')}</span><span class="grow small">${t}</span>${ok ? '' : '<span class="xs subtle">Recomendado</span>'}</div>`).join('')}
    ${n ? '' : `<div class="alert warn">${icon('alert')}<div class="small">Añade al menos una lección para poder publicar.</div></div>`}</div>
    <div class="modal-f"><button class="btn" data-act="closeModal">Seguir editando</button><button class="btn primary" data-act="publishDo" ${n ? '' : 'disabled'}>${icon('rocket')}Publicar ahora</button></div>`);
};
ACT.publishDo = () => {
  const c = bc(); c.status = 'published'; c.updated = 'Justo ahora'; S.activity.unshift({ ico: 'rocket', t: `Publicaste <b>${esc(c.title)}</b>`, when: 'Justo ahora' }); save(); render();
  openModal(() => `<div class="modal-b stack s16" style="text-align:center;align-items:center;padding:32px 28px 8px"><span class="db-ico" style="width:56px;height:56px;border-radius:50%;background:var(--ok);color:#fff;display:grid;place-items:center">${icon('rocket')}</span><h2>¡${esc(c.title)} está publicado!</h2><p class="muted" style="max-width:44ch">Ya aparece en ${esc(S.uni.name)}. El siguiente paso es darle acceso a tus estudiantes.</p></div>
    <div class="modal-f" style="justify-content:center"><button class="btn" data-act="previewCourse" data-arg="${c.id}">${icon('eye')}Ver como estudiante</button><button class="btn primary" data-act="enroll" data-arg="${c.id}">${icon('userPlus')}Matricular estudiantes</button></div>`);
};

/* ---------- Drag & drop ---------- */
document.addEventListener('mousedown', e => {
  const h = e.target.closest('[data-handle]');
  if (h) { const el = h.closest(h.dataset.handle === 'mod' ? '[data-dnd="mod"]' : '[data-dnd="blk"]'); if (el) el.draggable = true; }
});
document.addEventListener('dragstart', e => {
  const el = e.target.closest?.('[data-dnd]'); if (!el) return;
  UI.drag = { kind: el.dataset.dnd, id: el.dataset.lid || el.dataset.mid || el.dataset.bid || el.dataset.sid };
  e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', UI.drag.id); } catch (err) {}
  setTimeout(() => el.classList.add('dragging'), 0);
  e.stopPropagation();
});
function clearDrop() { $$('.drop-before,.drop-after,.drag-over').forEach(x => x.classList.remove('drop-before', 'drop-after', 'drag-over')); }
document.addEventListener('dragover', e => {
  const d = UI.drag; if (!d) return;
  let t = e.target.closest(`[data-dnd="${d.kind}"]`);
  if (d.kind === 'les' && !t) { const zone = e.target.closest('[data-drop-mid]') || e.target.closest('[data-dnd="mod"]'); if (zone) { e.preventDefault(); clearDrop(); (zone.closest('.mod') || zone).classList.add('drag-over'); } return; }
  if (!t) return; e.preventDefault(); clearDrop();
  const r = t.getBoundingClientRect(); t.classList.add(e.clientY < r.top + r.height / 2 ? 'drop-before' : 'drop-after');
});
document.addEventListener('drop', e => {
  const d = UI.drag; if (!d || d.kind === 'sld') return; e.preventDefault();
  const before = $('.drop-before'), afterEl = $('.drop-after'), over = $('.drag-over');
  const c = bc();
  if (d.kind === 'les') {
    const src = findLesson(c, d.id); if (!src) return;
    src.m.lessons.splice(src.m.lessons.indexOf(src.l), 1);
    const ref = before || afterEl;
    if (ref) { const dst = findLesson(c, ref.dataset.lid); const i = dst.m.lessons.indexOf(dst.l); dst.m.lessons.splice(before ? i : i + 1, 0, src.l); }
    else if (over) { c.modules.find(m => m.id === (over.dataset.mid || over.dataset.dropMid)).lessons.push(src.l); }
    else src.m.lessons.push(src.l);
    touch(); refresh('outline'); toast('Lección reordenada');
  } else if (d.kind === 'mod') {
    const ref = before || afterEl; if (!ref || ref.dataset.mid === d.id) return endDrag();
    const m = c.modules.find(x => x.id === d.id); c.modules.splice(c.modules.indexOf(m), 1);
    const i = c.modules.findIndex(x => x.id === ref.dataset.mid); c.modules.splice(before ? i : i + 1, 0, m); touch(); refresh('outline'); toast('Módulo reordenado');
  } else if (d.kind === 'blk') {
    const ref = before || afterEl; const l = curLesson(); if (!ref || ref.dataset.bid === d.id) return endDrag();
    const b = l.blocks.find(x => x.id === d.id); l.blocks.splice(l.blocks.indexOf(b), 1);
    const i = l.blocks.findIndex(x => x.id === ref.dataset.bid); l.blocks.splice(before ? i : i + 1, 0, b); touch(); refresh('canvas');
  }
  endDrag();
});
function endDrag() { UI.drag = null; clearDrop(); $$('.dragging').forEach(x => x.classList.remove('dragging')); $$('[data-dnd="mod"],[data-dnd="blk"]').forEach(x => x.draggable = false); }
document.addEventListener('dragend', endDrag);
