# Aulora · Prototipo de Universidad Digital (SaaS LMS B2B)

Prototipo navegable de alta fidelidad de un SaaS en el que empresas, universidades, consultores o marcas compran una licencia para tener **su propia universidad digital**, con su nombre, logo, colores y contenidos.

```
SaaS base (Aulora) → Universidad personalizada del cliente (Academia Nova) → Experiencia del estudiante
```

## Cómo verlo

No necesita build ni dependencias. Abre `index.html` en un navegador moderno o sírvelo como sitio estático:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

- El botón **Mapa del prototipo** (esquina inferior derecha) lleva a cualquiera de los 5 flujos prioritarios o a cualquiera de las 26 pantallas.
- Los cambios (marca, cursos, matrículas, progreso del estudiante) se guardan en `localStorage`. Para empezar de cero: *Configuración → Restablecer prototipo* o el enlace del mapa.
- Se puede abrir una pantalla directamente con un ancla, por ejemplo `index.html#admin.builder.c1` o `index.html#student.home`.

## Flujos prioritarios

| Flujo | Recorrido |
|---|---|
| 1 | Login → *Ver planes* → Comprar licencia → Onboarding (identidad con vista previa en vivo → cursos → estudiantes → publicar) → Universidad publicada |
| 2 | Dashboard → *Crear curso* → elegir método → datos básicos → Constructor (módulos, lecciones, bloques, drag & drop) → *Publicar curso* (checklist) |
| 3 | Dashboard → AI Course Studio → subir documento → generar lectura / presentación / quiz → editar la propuesta → *Añadir al curso* → abrir en el editor |
| 4 | Detalle del curso o curso recién publicado → *Matricular estudiantes* → vista del correo de invitación con la marca → ingreso del estudiante |
| 5 | *Ver como estudiante* → dashboard del estudiante → *Continuar* → completar lección → quiz → certificado al terminar el curso |

## Pantallas

**Administrador:** Login · Compra de licencia · Onboarding (4 pasos) · Dashboard · Cursos (tarjetas/lista, filtros, acciones) · Crear curso · Añadir curso existente (enlaces, archivos, importación desde Moodle/Canvas/SCORM) · Detalle de curso (resumen, estudiantes, estadísticas) · Constructor de cursos · Estudiantes (búsqueda, filtros, selección masiva, importar CSV, añadir) · Perfil de estudiante · Eventos (calendario y lista, crear evento) · Certificados (plantilla + emitidos) · AI Course Studio · Generador de lectura · Generador de presentación · Generador de quiz · Mi Universidad (editor de marca con previsualización en tiempo real en ingreso / inicio / curso, escritorio y celular) · Analítica · Plan y facturación · Configuración.

**Estudiante (con la marca del cliente):** Ingreso · Inicio · Mis cursos · Interior del curso (video, lectura, PDF, presentación, enlace, archivo, actividad, quiz) · Quiz · Mis eventos · Mis certificados.

## Modelo de negocio representado

- **Capacidad contratada** visible en dashboard, sidebar, estudiantes y facturación (p. ej. *320 / 500 estudiantes*), con *Ampliar capacidad* y *Mejorar plan*.
- **Nivel 1 · Contenido propio:** incluido en la licencia (cursos, documentos, videos, presentaciones, actividades).
- **Nivel 2 · Creación rápida con IA:** servicio adicional con créditos (consumo visible, costo por generación, compra de paquetes) y promociones contextuales en dashboard, cursos y editor.
- **Nivel 3 · Curso personalizado:** CTA *Solicitar curso personalizado* que abre una solicitud de cotización.
- **Marca blanca:** la marca del proveedor solo aparece como “Funciona con Aulora” en el pie del estudiante; ocultarla es una función del plan Scale.

## Estructura del código

```
index.html            Punto de entrada
assets/styles.css     Sistema visual: tokens (claro/oscuro), componentes y layouts
assets/js/icons.js    Set de iconos y tipos de contenido
assets/js/data.js     Datos ficticios + generadores de portadas, banners y logos (SVG)
assets/js/core.js     Estado, persistencia, router, eventos, modales, toasts, gráficos
assets/js/admin.js    Shell y pantallas del administrador
assets/js/builder.js  Constructor de cursos (outline, bloques, drag & drop, publicar)
assets/js/ai.js       AI Course Studio y generadores
assets/js/brand.js    Login, compra, onboarding y Mi Universidad
assets/js/student.js  Experiencia del estudiante
assets/js/app.js      Enrutado de vistas, mapa del prototipo e inicio
```

La marca del cliente se aplica con variables CSS (`--brand`, `--brand-accent`, …) en el contenedor del estudiante, de modo que el ingreso, el inicio, los cursos, los eventos, los certificados, los correos y las presentaciones generadas con IA cambian al instante cuando se edita *Mi Universidad*.

No hay backend: la IA, las importaciones, los pagos y los correos están simulados para mostrar cómo funcionaría la experiencia.
