// Contenido editorial del embudo de diagnóstico del hero (HeroLeadWidget).
//
// POR QUÉ EXISTE ESTE FICHERO: HeroLeadWidget.tsx mezclaba cuatro
// responsabilidades en 909 líneas — doce tablas de copy, la lógica de dominio
// que las combina, la máquina de estados de los pasos y la coreografía GSAP.
// El síntoma era medible: añadir una rama obligaba a tocar ~10 sitios
// repartidos por el fichero, así que "dar más variedad al embudo" salía caro
// por diseño y la variedad nunca se añadía. Es exactamente el motivo por el
// que en su día se extrajeron sectors.ts y cases.ts; esto es lo mismo
// aplicado al embudo.
//
// LÍMITE: aquí vive el QUÉ (copy, recetas de maqueta, tablas de mapeo) y las
// funciones PURAS que las combinan. No vive aquí el CÓMO se pinta ni cuándo:
// eso sigue en el componente. Como todo src/data, este módulo no importa
// React ni lucide — los iconos van por clave (`ShowcaseIconKey`) y los
// resuelve el componente vía src/components/marketing/mockIcons.ts.
//
// SOBRE EL CONTENIDO: ninguna frase de aquí promete plazos, precios, cifras
// ni resultados. Describen ALCANCE ("qué construiríamos"), que es lo único
// que se puede afirmar honestamente antes de hablar con la persona. Las
// frases que sí comprometen al negocio (plazo y formato de la entrega) viven
// en el componente, marcadas con TODO(negocio).
import type { MockAccentKey, ShowcaseBlock } from './types';

// ═══════════════════════════════════════════
// PASO 1 — ¿Qué necesitas?
// ═══════════════════════════════════════════

export type Necesidad = 'web' | 'sistema' | 'automatizar' | 'guia';

export const STEP1_QUESTION = '¿Qué necesitas?';

export const NECESIDAD_LABEL: Record<Necesidad, string> = {
    web: 'Una web nueva',
    sistema: 'Un sistema interno',
    automatizar: 'Automatizar tareas repetitivas',
    guia: 'No lo sé, que me guíen',
};

export interface FunnelOption<V extends string = string> {
    value: V;
    label: string;
}

export const STEP1_OPTIONS: readonly FunnelOption<Necesidad>[] = (
    Object.keys(NECESIDAD_LABEL) as Necesidad[]
).map((value) => ({ value, label: NECESIDAD_LABEL[value] }));

// ═══════════════════════════════════════════
// PASO 2 — una pregunta y un set de chips distinto por rama
// ═══════════════════════════════════════════

export type WebSector = 'reformas' | 'servicios' | 'comercio' | 'otro';
export type SistemaFoco = 'clientes' | 'citas' | 'facturacion' | 'todo';
export type AutomatizarTarea = 'whatsapp' | 'presupuestos' | 'datos' | 'recordatorios';
export type GuiaFreno = 'manual' | 'visibilidad' | 'webDebil' | 'empezar';
export type Sub = WebSector | SistemaFoco | AutomatizarTarea | GuiaFreno;

export interface Step2Config {
    question: string;
    options: readonly FunnelOption<Sub>[];
}

export const STEP2_CONFIG: Record<Necesidad, Step2Config> = {
    web: {
        question: '¿A qué se dedica tu negocio?',
        options: [
            { value: 'reformas', label: 'Reformas/obra' },
            { value: 'servicios', label: 'Servicios profesionales' },
            { value: 'comercio', label: 'Comercio/tienda' },
            { value: 'otro', label: 'Otro' },
        ],
    },
    sistema: {
        question: '¿Qué quieres centralizar primero?',
        options: [
            { value: 'clientes', label: 'Clientes y presupuestos' },
            { value: 'citas', label: 'Citas y agenda' },
            { value: 'facturacion', label: 'Facturación' },
            { value: 'todo', label: 'Todo junto' },
        ],
    },
    automatizar: {
        question: '¿Cuál se repite más?',
        options: [
            { value: 'whatsapp', label: 'Responder WhatsApp/consultas' },
            { value: 'presupuestos', label: 'Generar presupuestos' },
            { value: 'datos', label: 'Meter datos a mano' },
            { value: 'recordatorios', label: 'Recordatorios y seguimiento' },
        ],
    },
    guia: {
        question: '¿Qué es lo que más te frena?',
        options: [
            { value: 'manual', label: 'Pierdo tiempo en tareas manuales' },
            { value: 'visibilidad', label: 'No tengo visibilidad de mi negocio' },
            { value: 'webDebil', label: 'Mi web no representa lo que hago' },
            { value: 'empezar', label: 'No sé por dónde empezar' },
        ],
    },
};

// La rama "guía" no genera su propia maqueta: cada respuesta remapea a una
// combinación de una de las otras 3 ramas, para reusar exactamente la misma
// lógica (ver getFunnelTemplate). No todas las combinaciones resultantes son
// únicas entre sí — no hace falta, solo que reflejen lo que la persona
// contestó.
export type ResolvedNecesidad = Exclude<Necesidad, 'guia'>;
export type ResolvedSub = WebSector | SistemaFoco | AutomatizarTarea;

export interface ResolvedCombo {
    necesidad: ResolvedNecesidad;
    sub: ResolvedSub;
}

export const GUIA_REMAP: Record<GuiaFreno, ResolvedCombo> = {
    manual: { necesidad: 'automatizar', sub: 'datos' },
    visibilidad: { necesidad: 'sistema', sub: 'todo' },
    webDebil: { necesidad: 'web', sub: 'otro' },
    empezar: { necesidad: 'sistema', sub: 'clientes' },
};

export function resolveCombo(necesidad: Necesidad, sub: Sub): ResolvedCombo {
    if (necesidad === 'guia') return GUIA_REMAP[sub as GuiaFreno];
    return { necesidad, sub: sub as ResolvedSub };
}

// ═══════════════════════════════════════════
// PASO 3 — objetivo principal
// ═══════════════════════════════════════════
// Un único set de 4 chips para las 3 ramas resueltas: multiplicar el objetivo
// por rama habría añadido ~12 combinaciones sin aportar nada que una sola
// pregunta genérica no cubra ya bien.

export type Objetivo = 'vender' | 'ahorrar' | 'imagen' | 'controlar';

export const STEP3_QUESTION = '¿Cuál es tu objetivo principal?';

export const OBJETIVO_LABEL: Record<Objetivo, string> = {
    vender: 'Vender más',
    ahorrar: 'Ahorrar tiempo',
    imagen: 'Dar mejor imagen',
    controlar: 'Tener todo controlado',
};

export const STEP3_OPTIONS: readonly FunnelOption<Objetivo>[] = (
    Object.keys(OBJETIVO_LABEL) as Objetivo[]
).map((value) => ({ value, label: OBJETIVO_LABEL[value] }));

/**
 * Disposición de la maqueta según el objetivo (Paso 3). ESTE es el punto que
 * arregla el problema de fondo del embudo: hasta ahora el Paso 3 no movía ni
 * un píxel, solo cambiaba tres frases, así que las cuatro respuestas
 * producían la misma imagen y la pregunta se leía como relleno.
 *
 * Cada valor reordena y re-jerarquiza la MISMA maqueta (ver `data-layout` en
 * MockPreview.module.css), no añade contenido inventado:
 *   accion  → la llamada a la acción manda: CTA de nav en relleno sólido y
 *             barra de acción a pie de maqueta. Es lo que pide "vender más".
 *   flujo   → el bloque sube POR ENCIMA del titular: lo primero que se ve es
 *             el mecanismo, no el discurso. Es lo que pide "ahorrar tiempo".
 *   portada → aparece una banda de portada y el titular sube un escalón de
 *             tamaño; la CTA se apaga. Es lo que pide "dar mejor imagen".
 *   panel   → los enlaces de nav pasan a pestañas con una activa y todos los
 *             módulos se pintan en estado vivo. Es lo que pide "tener todo
 *             controlado": verlo todo a la vez.
 */
export type FunnelLayout = 'accion' | 'flujo' | 'portada' | 'panel';

export const OBJETIVO_LAYOUT: Record<Objetivo, FunnelLayout> = {
    vender: 'accion',
    ahorrar: 'flujo',
    imagen: 'portada',
    controlar: 'panel',
};

// Etiqueta mono sobre el titular de la maqueta. Antes era la constante "Con
// esto en mente" en las 48 combinaciones — un adorno que no decía nada. Ahora
// nombra el ENFOQUE elegido, que es justo lo que la disposición está
// aplicando: el texto y la forma cuentan lo mismo.
export const OBJETIVO_KICKER: Record<Objetivo, string> = {
    vender: 'Captar clientes',
    ahorrar: 'Ahorrar tiempo',
    imagen: 'Dar imagen',
    controlar: 'Todo a la vista',
};

// Subtítulo de la maqueta. El titular (ver COMBO_RECIPES) ya dice el QUÉ
// (sector/foco/tarea concretos); el subtítulo dice el PARA QUÉ que el propio
// visitante eligió, así el resultado se siente hablado a su objetivo en vez de
// repetir información que el titular ya cubre.
export const OBJETIVO_SUB: Record<Objetivo, string> = {
    vender: 'Pensada para convertir visitas en clientes, no solo para lucir bien.',
    ahorrar: 'Con lo repetitivo resuelto, para que recuperes horas cada semana.',
    imagen: 'Con la imagen profesional que tu negocio ya merece.',
    controlar: 'Con todo tu negocio a la vista, sin sorpresas de última hora.',
};

// Fragmento del objetivo dentro de la frase de diagnóstico (ver
// buildDiagnostic): va en medio de una frase, por eso va en infinitivo y en
// minúscula, no como etiqueta suelta.
export const OBJETIVO_PHRASE: Record<Objetivo, string> = {
    vender: 'vender más',
    ahorrar: 'ahorrar tiempo',
    imagen: 'dar mejor imagen',
    controlar: 'tener todo controlado',
};

// Cuarto punto de la lista "qué construiríamos". Los tres primeros salen de
// la combinación Pasos 1+2 (ver ComboRecipe.entregables); este cierra con el
// criterio del Paso 3, de forma que la lista completa depende de las TRES
// respuestas y no de dos.
export const OBJETIVO_ENTREGABLE: Record<Objetivo, string> = {
    vender: 'Y todo montado alrededor de la acción que te interesa: que te pidan presupuesto o te escriban.',
    ahorrar: 'Y todo montado para quitarte pasos: lo que hoy haces a mano, lo hace el sistema.',
    imagen: 'Y todo montado cuidando cómo se ve: tipografía, fotos y orden, no una plantilla más.',
    controlar: 'Y todo montado para que veas el estado real de cada cosa sin preguntar a nadie.',
};

// Etiqueta del botón de envío. DEJÓ de depender del objetivo a propósito.
// Antes decía "Quiero esto para vender más" porque el email era el peaje: el
// botón tenía que vender el premio que había detrás. Ahora el diagnóstico ya
// está entero en pantalla antes de pedir nada, así que el botón no vende, solo
// describe el trámite — y un botón que promete lo que ya has recibido suena a
// truco. Se queda como constante: si mañana vuelve a variar, que sea porque
// hay una razón, no por inercia.
export const SUBMIT_LABEL = 'Enviádmelo por escrito';

// ═══════════════════════════════════════════
// RECETAS DE MAQUETA — una por combinación real de Pasos 1+2
// ═══════════════════════════════════════════

/**
 * Todo lo que la combinación Pasos 1+2 aporta a la pantalla de resultado.
 *
 * El criterio de A1 está aquí: la maqueta se reconoce POR EL CONTENIDO. No hay
 * imágenes de sector en el repo y no se van a inventar, así que la señal de
 * "esta es la mía" tiene que venir de los nombres que ese oficio usa a diario
 * (`navLinks`, `block`) y de la acción que ese negocio pide de verdad
 * (`navCta`: un instalador no pone "Comprar", pone "Pedir presupuesto").
 *
 * Sigue siendo una MAQUETA, no una web: etiquetas cortas en mono, tres
 * enlaces, un bloque. El objetivo es que se lea como el boceto de una
 * interfaz, no como una página terminada.
 */
export interface ComboRecipe {
    /** Titular de la maqueta — dice el QUÉ (el PARA QUÉ lo pone OBJETIVO_SUB). */
    title: string;
    /** Tres secciones de navegación. En disposición `panel` se repintan como
     *  pestañas con la primera activa, así que el orden importa: la primera
     *  debe ser la sección "de inicio" de esa interfaz. */
    navLinks: readonly [string, string, string];
    /** Acción principal, la que va dentro del botón de la navegación (y de la
     *  barra de acción en disposición `accion`). */
    navCta: string;
    /** Bloque destacado, con los iconos por clave (ver mockIcons.ts). */
    block: ShowcaseBlock;
    /** Los tres primeros puntos de "esto es lo que construiríamos". Describen
     *  ALCANCE, nunca plazo ni precio ni resultado. */
    entregables: readonly [string, string, string];
    /** Fragmento que este combo aporta a la frase de diagnóstico. Su forma
     *  gramatical depende de la rama (ver buildDiagnostic). */
    diagnosticFragment: string;
}

const WEB_RECIPES: Record<WebSector, ComboRecipe> = {
    reformas: {
        title: 'Tu web de reformas, lista para vender',
        navLinks: ['Reformas', 'Proyectos', 'Contacto'],
        navCta: 'Pedir presupuesto',
        block: {
            type: 'services',
            items: [
                { key: 'banos', icon: 'wrench', label: 'Baños y cocinas' },
                { key: 'obra', icon: 'hammer', label: 'Obra y albañilería' },
                { key: 'integral', icon: 'building', label: 'Reforma integral' },
            ],
        },
        entregables: [
            'Una página por tipo de reforma, con fotos de obras tuyas y el detalle de qué incluye cada una.',
            'Un formulario de presupuesto que te llega ya ordenado: tipo de obra, superficie y datos de contacto.',
            'Fichas de proyecto reutilizables, para publicar una obra nueva sin rehacer la página.',
        ],
        diagnosticFragment: 'un negocio de reformas',
    },
    servicios: {
        title: 'Tu web de servicios, que genera confianza',
        navLinks: ['Servicios', 'Cómo trabajo', 'Contacto'],
        navCta: 'Pedir cita',
        block: {
            type: 'services',
            items: [
                { key: 'consulta', icon: 'chatMessage', label: 'Primera consulta' },
                { key: 'asesoria', icon: 'clipboard', label: 'Asesoramiento' },
                { key: 'tramites', icon: 'fileText', label: 'Gestión y trámites' },
            ],
        },
        entregables: [
            'Una página por servicio, explicando qué resuelve y para quién, sin jerga.',
            'Reserva de primera consulta desde la propia web, con los datos que necesitas antes de la llamada.',
            'Una sección de "cómo trabajo" que responde por escrito las dudas que hoy contestas por teléfono.',
        ],
        diagnosticFragment: 'un negocio de servicios profesionales',
    },
    comercio: {
        title: 'Tu tienda online, lista para vender',
        navLinks: ['Catálogo', 'Ofertas', 'Mi pedido'],
        navCta: 'Hacer pedido',
        block: {
            type: 'services',
            items: [
                { key: 'catalogo', icon: 'layoutGrid', label: 'Catálogo' },
                { key: 'pedidos', icon: 'clipboard', label: 'Pedidos' },
                { key: 'envios', icon: 'truck', label: 'Envío y recogida' },
            ],
        },
        entregables: [
            'Catálogo con categorías, fichas de producto y disponibilidad, editable por ti sin tocar código.',
            'Pedido online con envío o recogida en tienda, y confirmación automática al cliente.',
            'Una página de ofertas y novedades que puedes cambiar tú cuando quieras.',
        ],
        diagnosticFragment: 'una tienda online',
    },
    otro: {
        title: 'Tu web, lista para vender',
        navLinks: ['Qué hacemos', 'Cómo trabajamos', 'Contacto'],
        navCta: 'Pedir información',
        block: {
            type: 'services',
            items: [
                { key: 'que', icon: 'layoutGrid', label: 'Qué ofreces' },
                { key: 'como', icon: 'settings', label: 'Cómo trabajas' },
                { key: 'contacto', icon: 'chatMessage', label: 'Contacto' },
            ],
        },
        entregables: [
            'Una portada que deja claro en diez segundos qué haces y para quién.',
            'Una sección por cada servicio, con el detalle que hoy explicas a mano una y otra vez.',
            'Un formulario de contacto que te llega ordenado y con contexto, no un "hola" suelto.',
        ],
        diagnosticFragment: 'tu negocio',
    },
};

// Rama "sistema": cada foco cambia el SET COMPLETO de módulos, no solo cuál
// está activo. Antes las cuatro respuestas daban la misma rejilla
// Clientes/Citas/Facturas/Todo con un tile distinto encendido — un cambio que
// nadie percibía como consecuencia de su respuesta.
const SISTEMA_RECIPES: Record<SistemaFoco, ComboRecipe> = {
    clientes: {
        title: 'Tus clientes y presupuestos, en un solo sitio',
        navLinks: ['Clientes', 'Presupuestos', 'Seguimiento'],
        navCta: 'Nuevo cliente',
        block: {
            type: 'modules',
            items: [
                { key: 'clientes', icon: 'users', label: 'Clientes', active: true },
                { key: 'presupuestos', icon: 'fileText', label: 'Presupuestos', active: true },
                { key: 'seguimiento', icon: 'clipboard', label: 'Seguimiento' },
                { key: 'avisos', icon: 'bell', label: 'Avisos' },
            ],
        },
        entregables: [
            'Ficha de cliente con su historial completo: presupuestos, notas y estado actual.',
            'Presupuestos a partir de plantillas, duplicables de un cliente a otro sin reescribir.',
            'Un tablero con qué presupuestos están pendientes de respuesta y desde cuándo.',
        ],
        diagnosticFragment: 'centralizaríamos tus clientes y presupuestos',
    },
    citas: {
        title: 'Tu agenda, siempre al día',
        navLinks: ['Agenda', 'Citas', 'Equipo'],
        navCta: 'Nueva cita',
        block: {
            type: 'modules',
            items: [
                { key: 'agenda', icon: 'calendarCheck', label: 'Agenda', active: true },
                { key: 'huecos', icon: 'clock', label: 'Huecos', active: true },
                { key: 'avisos', icon: 'bell', label: 'Recordatorios' },
                { key: 'equipo', icon: 'users', label: 'Equipo' },
            ],
        },
        entregables: [
            'Agenda compartida por persona y por recurso, sin dobles reservas posibles.',
            'Alta de cita en dos pasos, pidiendo solo los datos que de verdad necesitas.',
            'Recordatorio automático al cliente antes de la cita, con tu texto.',
        ],
        diagnosticFragment: 'organizaríamos tu agenda y tus citas',
    },
    facturacion: {
        title: 'Tu facturación, sin perseguir a nadie',
        navLinks: ['Facturas', 'Cobros', 'Impuestos'],
        navCta: 'Nueva factura',
        block: {
            type: 'modules',
            items: [
                { key: 'facturas', icon: 'receipt', label: 'Facturas', active: true },
                { key: 'cobros', icon: 'badgeCheck', label: 'Cobros', active: true },
                { key: 'vencimientos', icon: 'clock', label: 'Vencimientos' },
                { key: 'impuestos', icon: 'calculator', label: 'Impuestos' },
            ],
        },
        entregables: [
            'Facturas generadas a partir del presupuesto aceptado, sin reescribir nada.',
            'Listado de cobros con estado y vencimiento, para ver de un vistazo qué falta por entrar.',
            'Exportación de lo que tu asesoría te pida, en el formato que ya esté usando.',
        ],
        diagnosticFragment: 'pondríamos en orden tu facturación',
    },
    todo: {
        title: 'Todo tu negocio, en un sitio',
        navLinks: ['Resumen', 'Clientes', 'Facturas'],
        navCta: 'Ver resumen',
        block: {
            type: 'modules',
            items: [
                { key: 'clientes', icon: 'users', label: 'Clientes', active: true },
                { key: 'agenda', icon: 'calendarCheck', label: 'Agenda', active: true },
                { key: 'facturas', icon: 'receipt', label: 'Facturas', active: true },
                { key: 'tareas', icon: 'clipboard', label: 'Tareas', active: true },
            ],
        },
        entregables: [
            'Un único sitio con clientes, agenda, facturación y tareas, conectados entre sí.',
            'Una pantalla de resumen con lo que hay que atender hoy, sin abrir cuatro programas.',
            'Permisos por persona, para que cada uno vea y toque solo lo suyo.',
        ],
        diagnosticFragment: 'centralizaríamos tu día a día',
    },
};

// Rama "automatizar": cambian el ANTES y el DESPUÉS. Antes el "después" era
// siempre el mismo icono Zap con la etiqueta "Automático", así que las cuatro
// respuestas convergían literalmente en la misma imagen. Nombrar el resultado
// concreto ("Cita en agenda", "Ficha creada") es además más honesto:
// "Automático" no dice qué pasa, dice que pasa solo.
const AUTOMATIZAR_RECIPES: Record<AutomatizarTarea, ComboRecipe> = {
    whatsapp: {
        title: 'Tu WhatsApp, respondiendo solo',
        navLinks: ['Conversaciones', 'Respuestas', 'Agenda'],
        navCta: 'Ver conversaciones',
        block: {
            type: 'sequence',
            beforeIcon: 'chatMessage',
            afterIcon: 'calendarCheck',
            beforeLabel: 'Consulta',
            afterLabel: 'Cita en agenda',
        },
        entregables: [
            'Respuestas automáticas a las preguntas que se repiten, escritas con tu tono.',
            'Paso a persona en cuanto la conversación se sale del guion, sin que el cliente lo note.',
            'Las citas que se cierran por chat entran solas en la agenda.',
        ],
        diagnosticFragment: 'dejaríamos que tu WhatsApp se responda solo',
    },
    presupuestos: {
        title: 'Tus presupuestos, generados solos',
        navLinks: ['Solicitudes', 'Plantillas', 'Enviados'],
        navCta: 'Generar presupuesto',
        block: {
            type: 'sequence',
            beforeIcon: 'messages',
            afterIcon: 'documentCheck',
            beforeLabel: 'Petición',
            afterLabel: 'Presupuesto enviado',
        },
        entregables: [
            'Plantillas de presupuesto por tipo de trabajo, con partidas reutilizables.',
            'Generación del documento y envío al cliente en un clic, con tu marca.',
            'Aviso cuando un presupuesto lleva días sin respuesta, para que no se enfríe.',
        ],
        diagnosticFragment: 'generaríamos tus presupuestos automáticamente',
    },
    datos: {
        title: 'Esos datos, metidos solos',
        navLinks: ['Entradas', 'Reglas', 'Registro'],
        navCta: 'Ver registro',
        block: {
            type: 'sequence',
            beforeIcon: 'keyboard',
            afterIcon: 'badgeCheck',
            beforeLabel: 'A mano',
            afterLabel: 'Ficha creada',
        },
        entregables: [
            'Los datos entran una sola vez y viajan solos entre las herramientas que ya usas.',
            'Lectura automática de los documentos que hoy tecleas a mano.',
            'Un registro de qué se ha creado y cuándo, para poder revisarlo si algo falla.',
        ],
        diagnosticFragment: 'dejaríamos de meter esos datos a mano',
    },
    recordatorios: {
        title: 'Tus recordatorios, enviados solos',
        navLinks: ['Avisos', 'Plantillas', 'Historial'],
        navCta: 'Ver avisos',
        block: {
            type: 'sequence',
            beforeIcon: 'clock',
            afterIcon: 'bell',
            beforeLabel: 'Sin seguimiento',
            afterLabel: 'Aviso enviado',
        },
        entregables: [
            'Avisos automáticos por email o WhatsApp según el momento de cada cliente.',
            'Plantillas de mensaje editables, para no reescribir lo mismo cada vez.',
            'Historial de qué se ha enviado a quién, sin tener que buscarlo en el móvil.',
        ],
        diagnosticFragment: 'automatizaríamos tus recordatorios y seguimientos',
    },
};

/** Acento por rama. Antes "web" y "automatizar" compartían mint, así que dos
 *  de las tres ramas producían maquetas del mismo color y el Paso 1 solo se
 *  notaba en el tipo de bloque. Cada rama tiene ahora el suyo, y ninguno es
 *  un color inventado: los tres salen de variables.css.
 *    web         → mint, el acento de marca: es la cara pública del negocio.
 *    sistema     → warm, que ya es el acento de dato/métrica en el resto de la
 *                  web (stats de casos) y encaja con un contexto de panel.
 *    automatizar → info (#6189c4), el azul de señal: proceso y mecánica, no
 *                  marca ni dato. */
export const BRANCH_ACCENT: Record<ResolvedNecesidad, MockAccentKey> = {
    web: 'mint',
    sistema: 'warm',
    automatizar: 'info',
};

const RECIPES: {
    web: Record<WebSector, ComboRecipe>;
    sistema: Record<SistemaFoco, ComboRecipe>;
    automatizar: Record<AutomatizarTarea, ComboRecipe>;
} = {
    web: WEB_RECIPES,
    sistema: SISTEMA_RECIPES,
    automatizar: AUTOMATIZAR_RECIPES,
};

export function getRecipe(combo: ResolvedCombo): ComboRecipe {
    if (combo.necesidad === 'web') return RECIPES.web[combo.sub as WebSector];
    if (combo.necesidad === 'sistema') return RECIPES.sistema[combo.sub as SistemaFoco];
    return RECIPES.automatizar[combo.sub as AutomatizarTarea];
}

// ═══════════════════════════════════════════
// COMPOSICIÓN
// ═══════════════════════════════════════════

/**
 * Frase de diagnóstico. Combina en una sola frase natural el QUÉ/sector de
 * Pasos 1+2 con el PARA QUÉ del Paso 3 — no es una lista de etiquetas, es una
 * frase compuesta a partir de fragmentos que ya tienen sentido por sí solos.
 *
 * Dos patrones según la rama: "web" habla de un TIPO DE NEGOCIO ("Para un
 * negocio de X que quiere Y…"), las otras dos de una ACCIÓN concreta ("Si lo
 * que buscas es Y, así Z…"), porque no tiene sentido decir "un negocio de
 * centralizar clientes". Por eso `diagnosticFragment` no es intercambiable
 * entre ramas: su forma gramatical la fija la rama a la que pertenece.
 */
export function buildDiagnostic(combo: ResolvedCombo, objetivo: Objetivo): string {
    const fragment = getRecipe(combo).diagnosticFragment;
    const meta = OBJETIVO_PHRASE[objetivo];
    if (combo.necesidad === 'web') {
        return `Para ${fragment} que quiere ${meta}, esto es lo que construiríamos:`;
    }
    return `Si lo que buscas es ${meta}, así ${fragment}:`;
}

/** Todo lo que la pantalla de resultado necesita, ya resuelto. El componente
 *  solo tiene que resolver los iconos por clave y pintar. */
export interface FunnelTemplate {
    accent: MockAccentKey;
    layout: FunnelLayout;
    kicker: string;
    title: string;
    sub: string;
    navLinks: readonly string[];
    navCta: string;
    block: ShowcaseBlock;
    diagnostic: string;
    /** Cuatro puntos: tres del combo (Pasos 1+2) y uno del objetivo (Paso 3),
     *  para que la lista dependa de las tres respuestas. */
    entregables: readonly string[];
}

export function getFunnelTemplate(combo: ResolvedCombo, objetivo: Objetivo): FunnelTemplate {
    const recipe = getRecipe(combo);
    return {
        accent: BRANCH_ACCENT[combo.necesidad],
        layout: OBJETIVO_LAYOUT[objetivo],
        kicker: OBJETIVO_KICKER[objetivo],
        title: recipe.title,
        sub: OBJETIVO_SUB[objetivo],
        navLinks: recipe.navLinks,
        navCta: recipe.navCta,
        block: recipe.block,
        diagnostic: buildDiagnostic(combo, objetivo),
        entregables: [...recipe.entregables, OBJETIVO_ENTREGABLE[objetivo]],
    };
}
