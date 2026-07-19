import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Bell,
  CalendarCheck2,
  ChevronDown,
  ChevronLeft,
  FileText,
  Keyboard,
  LayoutGrid,
  MessageSquare,
  Monitor,
  Receipt,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useLeadForm, validateEmail } from '../../lib/forms';
import { MockPreview, type MockBlock } from '../marketing/MockPreview';
import styles from './HeroLeadWidget.module.css';

/**
 * HeroLeadWidget — reemplaza el mockup decorativo HeroDashboard por un
 * micro-formulario de 3 preguntas ENCADENADAS + preview de plantilla + email.
 *
 * Paso 1: qué necesita el visitante (4 ramas).
 * Paso 2: pregunta DISTINTA según la rama del Paso 1 (ver STEP2_CONFIG) — no
 *   es un set fijo de chips, cada rama tiene su propia pregunta y opciones.
 *   La rama "No lo sé, que me guíen" remapea internamente su respuesta a una
 *   de las combinaciones de las otras 3 ramas (ver GUIA_REMAP) para poder
 *   generar la misma plantilla.
 * Paso 3: objetivo principal (mismo set de 4 chips para las 3 ramas — no
 *   hacía falta multiplicar combinaciones, ver OBJETIVO_LABEL). Alimenta el
 *   subtítulo de la plantilla (ver OBJETIVO_SUB), mientras que el titular
 *   sigue viniendo de la combinación resuelta de Pasos 1+2 — títulos y
 *   objetivo no se pisan: uno dice el QUÉ, el otro el PARA QUÉ.
 * Paso 4: plantilla de página generada (nav + titular + bloque de contenido
 *   destacado + CTA), con toggle escritorio/móvil, precedida de una frase de
 *   diagnóstico en lenguaje natural que combina Pasos 1+2+3 (ver
 *   getDiagnostic) y seguida del campo de email con CTA personalizado según
 *   el objetivo elegido (ver CTA_LABEL). Al llegar por primera vez a este
 *   paso hay un breve latido de anticipación ("montando tu propuesta…", ver
 *   `isAssembling`) antes de que arranque la cascada de ensamblado — no se
 *   repite en visitas posteriores al paso ni al cambiar de combinación.
 *
 * Envía a FormSubmit.co (mismo endpoint/honeypot que Contact.tsx/Resources.tsx)
 * vía el hook compartido `useLeadForm` (src/lib/forms.ts). Solo captura lead:
 * no dispara ninguna plantilla automática, solo confirma recepción.
 *
 * Transiciones: opacity/transform vía GSAP, gated tras prefers-reduced-motion
 * (igual que el resto del proyecto). Sin scroll-jacking, sin popups.
 *
 * Nota: ya no vive dentro de un marco "panel de navegador" (barra de
 * ventana + URL falsa) — el usuario lo pidió fuera porque "sobra". El panel
 * es ahora una superficie propia (mismo borde interno + sombra tintada de
 * siempre), y el único contexto de "esto es una web" que hacía falta vive
 * en el Paso 4, pegado a la propia plantilla generada (ver `.previewMeta`).
 */

// ─── Paso 1 ───
type Necesidad = 'web' | 'sistema' | 'automatizar' | 'guia';

const NECESIDAD_LABEL: Record<Necesidad, string> = {
  web: 'Una web nueva',
  sistema: 'Un sistema interno',
  automatizar: 'Automatizar tareas repetitivas',
  guia: 'No lo sé, que me guíen',
};

const STEP1_OPTIONS = (Object.keys(NECESIDAD_LABEL) as Necesidad[]).map((value) => ({
  value,
  label: NECESIDAD_LABEL[value],
}));

// ─── Paso 2 — una pregunta y un set de chips distinto por rama ───
type WebSector = 'reformas' | 'servicios' | 'comercio' | 'otro';
type SistemaFoco = 'clientes' | 'citas' | 'facturacion' | 'todo';
type AutomatizarTarea = 'whatsapp' | 'presupuestos' | 'datos' | 'recordatorios';
type GuiaFreno = 'manual' | 'visibilidad' | 'webDebil' | 'empezar';
type Sub = WebSector | SistemaFoco | AutomatizarTarea | GuiaFreno;

interface Step2Config {
  question: string;
  options: { value: Sub; label: string }[];
}

const STEP2_CONFIG: Record<Necesidad, Step2Config> = {
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

// La rama "guía" no genera su propia plantilla: cada respuesta remapea a una
// combinación de una de las otras 3 ramas, para poder reusar exactamente la
// misma lógica de plantilla (ver getTemplate). No todas las combinaciones
// resultantes son únicas entre sí — no hace falta, solo que reflejen lo que
// la persona contestó.
type ResolvedNecesidad = Exclude<Necesidad, 'guia'>;
type ResolvedSub = WebSector | SistemaFoco | AutomatizarTarea;
interface ResolvedCombo {
  necesidad: ResolvedNecesidad;
  sub: ResolvedSub;
}

const GUIA_REMAP: Record<GuiaFreno, ResolvedCombo> = {
  manual: { necesidad: 'automatizar', sub: 'datos' },
  visibilidad: { necesidad: 'sistema', sub: 'todo' },
  webDebil: { necesidad: 'web', sub: 'otro' },
  empezar: { necesidad: 'sistema', sub: 'clientes' },
};

function resolveCombo(necesidad: Necesidad, sub: Sub): ResolvedCombo {
  if (necesidad === 'guia') return GUIA_REMAP[sub as GuiaFreno];
  return { necesidad, sub: sub as ResolvedSub };
}

// ─── Paso 3 — objetivo principal ───
// Un único set de 4 chips para las 3 ramas resueltas: multiplicar el
// objetivo por rama habría añadido ~12 combinaciones sin aportar nada que
// una sola pregunta genérica no cubra ya bien.
type Objetivo = 'vender' | 'ahorrar' | 'imagen' | 'controlar';

const OBJETIVO_LABEL: Record<Objetivo, string> = {
  vender: 'Vender más',
  ahorrar: 'Ahorrar tiempo',
  imagen: 'Dar mejor imagen',
  controlar: 'Tener todo controlado',
};

const STEP3_QUESTION = '¿Cuál es tu objetivo principal?';
const STEP3_OPTIONS = (Object.keys(OBJETIVO_LABEL) as Objetivo[]).map((value) => ({
  value,
  label: OBJETIVO_LABEL[value],
}));

// ─── Paso 4 — plantilla generada ───
const WEB_TITLES: Record<WebSector, string> = {
  reformas: 'Tu web de reformas, lista para vender',
  servicios: 'Tu web de servicios, que genera confianza',
  comercio: 'Tu tienda online, lista para vender',
  otro: 'Tu web, lista para vender',
};

const SISTEMA_TITLES: Record<SistemaFoco, string> = {
  clientes: 'Tus clientes y presupuestos, en un solo sitio',
  citas: 'Tu agenda, siempre al día',
  facturacion: 'Tu facturación, sin perseguir a nadie',
  todo: 'Todo tu negocio, en un sitio',
};

const AUTOMATIZAR_TITLES: Record<AutomatizarTarea, string> = {
  whatsapp: 'Tu WhatsApp, respondiendo solo',
  presupuestos: 'Tus presupuestos, generados solos',
  datos: 'Esos datos, metidos solos',
  recordatorios: 'Tus recordatorios, enviados solos',
};

// El subtítulo de la plantilla ahora viene del objetivo del Paso 3, no de la
// rama — el titular (WEB_TITLES/SISTEMA_TITLES/AUTOMATIZAR_TITLES) ya dice el
// QUÉ (sector/foco/tarea concretos); el subtítulo dice el PARA QUÉ que el
// propio visitante eligió, así el resultado se siente hablado a su objetivo
// en vez de repetir información que el titular ya cubre.
const OBJETIVO_SUB: Record<Objetivo, string> = {
  vender: 'Pensada para convertir visitas en clientes, no solo para lucir bien.',
  ahorrar: 'Con lo repetitivo resuelto, para que recuperes horas cada semana.',
  imagen: 'Con la imagen profesional que tu negocio ya merece.',
  controlar: 'Con todo tu negocio a la vista, sin sorpresas de última hora.',
};

// ─── Frase de diagnóstico (Paso 4) ───
// Combina en una sola frase natural el QUÉ/sector de Pasos 1+2 con el PARA
// QUÉ del Paso 3 — no es una lista de tags, es una frase compuesta a partir
// de fragmentos ya con sentido de por sí. Dos patrones según la rama: "web"
// habla de un tipo de negocio ("Para un negocio de X que quiere Y..."), las
// otras dos hablan de una acción concreta ("Si lo que buscas es Y, así
// Z..."), porque no tiene sentido decir "un negocio de centralizar clientes".
const OBJETIVO_PHRASE: Record<Objetivo, string> = {
  vender: 'vender más',
  ahorrar: 'ahorrar tiempo',
  imagen: 'dar mejor imagen',
  controlar: 'tener todo controlado',
};

const WEB_BUSINESS_DESC: Record<WebSector, string> = {
  reformas: 'un negocio de reformas',
  servicios: 'un negocio de servicios profesionales',
  comercio: 'una tienda online',
  otro: 'tu negocio',
};

const SISTEMA_ACCION_DESC: Record<SistemaFoco, string> = {
  clientes: 'centralizaríamos tus clientes y presupuestos',
  citas: 'organizaríamos tu agenda y tus citas',
  facturacion: 'pondríamos en orden tu facturación',
  todo: 'centralizaríamos tu día a día',
};

const AUTOMATIZAR_ACCION_DESC: Record<AutomatizarTarea, string> = {
  whatsapp: 'dejaríamos que tu WhatsApp se responda solo',
  presupuestos: 'generaríamos tus presupuestos automáticamente',
  datos: 'dejaríamos de meter esos datos a mano',
  recordatorios: 'automatizaríamos tus recordatorios y seguimientos',
};

function getDiagnostic(combo: ResolvedCombo, objetivo: Objetivo): string {
  const objetivoPhrase = OBJETIVO_PHRASE[objetivo];
  if (combo.necesidad === 'web') {
    return `Para ${WEB_BUSINESS_DESC[combo.sub as WebSector]} que quiere ${objetivoPhrase}, esto es lo que construiríamos:`;
  }
  const accion = combo.necesidad === 'sistema'
    ? SISTEMA_ACCION_DESC[combo.sub as SistemaFoco]
    : AUTOMATIZAR_ACCION_DESC[combo.sub as AutomatizarTarea];
  return `Si lo que buscas es ${objetivoPhrase}, así ${accion}:`;
}

// CTA del email personalizado con el objetivo elegido — mismas 4 frases
// cortas para las 3 ramas (igual que OBJETIVO_SUB, el objetivo ya es
// suficiente diferenciador aquí, no hace falta cruzarlo con el sector).
const CTA_LABEL: Record<Objetivo, string> = {
  vender: 'Quiero esto para vender más',
  ahorrar: 'Quiero esto para ahorrar tiempo',
  imagen: 'Quiero esto para dar mejor imagen',
  controlar: 'Quiero esto para tener todo controlado',
};

// Solo hay dos acentos en el sistema de diseño (mint/warm, ver variables.css)
// — "warm" para sistema porque ya es el acento de "dato/métrica" en el resto
// de la web (stats de casos), lo que encaja con un contexto de panel/gestión.
const BRANCH_ACCENT: Record<ResolvedNecesidad, 'mint' | 'warm'> = {
  web: 'mint',
  sistema: 'warm',
  automatizar: 'mint',
};

type TemplateBlock =
  | { type: 'testimonial' }
  | { type: 'modules'; active: SistemaFoco }
  | { type: 'sequence'; before: AutomatizarTarea };

interface Template {
  title: string;
  sub: string;
  diagnostic: string;
  accent: 'mint' | 'warm';
  block: TemplateBlock;
}

function getTemplate(combo: ResolvedCombo, objetivo: Objetivo): Template {
  const diagnostic = getDiagnostic(combo, objetivo);
  if (combo.necesidad === 'web') {
    return {
      title: WEB_TITLES[combo.sub as WebSector],
      sub: OBJETIVO_SUB[objetivo],
      diagnostic,
      accent: BRANCH_ACCENT.web,
      block: { type: 'testimonial' },
    };
  }
  if (combo.necesidad === 'sistema') {
    return {
      title: SISTEMA_TITLES[combo.sub as SistemaFoco],
      sub: OBJETIVO_SUB[objetivo],
      diagnostic,
      accent: BRANCH_ACCENT.sistema,
      block: { type: 'modules', active: combo.sub as SistemaFoco },
    };
  }
  return {
    title: AUTOMATIZAR_TITLES[combo.sub as AutomatizarTarea],
    sub: OBJETIVO_SUB[objetivo],
    diagnostic,
    accent: BRANCH_ACCENT.automatizar,
    block: { type: 'sequence', before: combo.sub as AutomatizarTarea },
  };
}

const MODULE_ICONS: Record<SistemaFoco, React.FC<{ size?: number; strokeWidth?: number }>> = {
  clientes: Users,
  citas: CalendarCheck2,
  facturacion: Receipt,
  todo: LayoutGrid,
};

const MODULE_LABELS: Record<SistemaFoco, string> = {
  clientes: 'Clientes',
  citas: 'Citas',
  facturacion: 'Facturas',
  todo: 'Todo',
};

const SEQUENCE_BEFORE_ICONS: Record<AutomatizarTarea, React.FC<{ size?: number; strokeWidth?: number }>> = {
  whatsapp: MessageSquare,
  presupuestos: FileText,
  datos: Keyboard,
  recordatorios: Bell,
};

// Etiqueta corta bajo el icono "antes" del bloque sequence — sin ella el
// icono queda suelto, sin decir qué tarea representa (ver SequenceBlock en
// MockPreview.tsx). El "después" es siempre el mismo Zap/"Automático": las
// cuatro tareas convergen en la misma idea de "ya no lo haces tú".
const SEQUENCE_BEFORE_LABELS: Record<AutomatizarTarea, string> = {
  whatsapp: 'WhatsApp',
  presupuestos: 'Presupuestos',
  datos: 'Datos',
  recordatorios: 'Recordatorios',
};

const SEQUENCE_AFTER_LABEL = 'Automático';

const TOTAL_STEPS = 4;

// Toggle escritorio/móvil del Paso 4 — recupera la idea del antiguo
// HeroDashboard (eliminado en una iteración anterior), que tenía un switch
// similar. Vive como prop simple del preview: no reinicia ni retriggerea el
// ensamblado (eso solo pasa cuando cambia la combinación resuelta, ver
// `comboKey`), solo cambia cómo se lee visualmente la MISMA plantilla.
type Device = 'desktop' | 'mobile';

// Convierte el `TemplateBlock` (dominio propio del hero: qué rama/foco/tarea
// se resolvió) al `MockBlock` genérico que consume MockPreview (componente
// compartido con CaseMockPanel, ver src/components/marketing/MockPreview.tsx)
// — así MockPreview no necesita conocer nada de Necesidad/SistemaFoco/etc.,
// solo iconos + labels ya resueltos.
function toMockBlock(block: TemplateBlock): MockBlock {
  if (block.type === 'testimonial') return { type: 'testimonial' };
  if (block.type === 'modules') {
    const keys = Object.keys(MODULE_ICONS) as SistemaFoco[];
    return {
      type: 'modules',
      items: keys.map((key) => ({
        key,
        icon: MODULE_ICONS[key],
        label: MODULE_LABELS[key],
        active: key === block.active,
      })),
    };
  }
  return {
    type: 'sequence',
    beforeIcon: SEQUENCE_BEFORE_ICONS[block.before],
    afterIcon: Zap,
    beforeLabel: SEQUENCE_BEFORE_LABELS[block.before],
    afterLabel: SEQUENCE_AFTER_LABEL,
  };
}

export const HeroLeadWidget: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [necesidad, setNecesidad] = useState<Necesidad | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  // Toggle escritorio/móvil del Paso 4 — persiste aunque el usuario vuelva
  // atrás y cambie de rama/objetivo (preferencia de vista, no parte de la
  // combinación que dispara el reensamblado).
  const [device, setDevice] = useState<Device>('desktop');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  // Latido de anticipación del Paso 4 — solo la PRIMERA vez que se llega a
  // él (no en visitas posteriores ni al cambiar de combinación), para que el
  // remate se sienta "construido en el momento" sin alargar la espera en
  // cada iteración de respuestas. `hasEnteredStep4` es un ref (no state):
  // solo nos importa la primera transición, no queremos re-render por esto.
  const [isAssembling, setIsAssembling] = useState(false);
  const hasEnteredStep4 = useRef(false);

  // ─── Colapso en móvil (≤767px, TÁCTIL — ver variables.css) ───
  // Arranca colapsado (`expanded = false`) DETRÁS de un teaser compacto para
  // no empujar el resto de la home bajo el pliegue en un móvil real; en
  // escritorio el widget sigue siempre visible — eso lo fuerza el CSS
  // (`.collapseOuter` en HeroLeadWidget.module.css, gated tras
  // `@media (max-width: 767px)`), NO este estado, así que `expanded=false`
  // por defecto es seguro también en desktop antes de que el CSS aplique.
  // Justo por eso el valor inicial puede ser una constante fija en vez de
  // depender de `window.matchMedia` (indisponible durante el SSR de
  // vite-react-ssg): con un valor fijo el primer render del cliente coincide
  // siempre con el HTML del servidor — cero riesgo de mismatch de hidratación
  // (la home ya tuvo bugs de hidratación reales, ver commits recientes).
  // Al ser un booleano que solo cambia por click del usuario (nunca por un
  // efecto automático), tampoco hace falta lógica extra para "no
  // recolapsar": no hay nada que lo reponga a `false` una vez en `true`.
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();
  const collapsibleBodyRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = useCallback(() => {
    setExpanded((v) => !v);
  }, []);

  // Foco al desplegar: mueve el foco al cuerpo recién visible (contenedor
  // con tabIndex=-1) para que un usuario de teclado/lector de pantalla no se
  // quede "atrás" en el botón. Al colapsar no hace falta gestión extra: el
  // foco ya sigue en el propio botón que originó el click.
  useEffect(() => {
    if (expanded) collapsibleBodyRef.current?.focus();
  }, [expanded]);

  // Solo para accesibilidad (inert): saber si estamos realmente en viewport
  // TÁCTIL. Es intencionalmente un estado aparte del `expanded` de arriba
  // — si lo mezcláramos, `expanded=false` por defecto marcaría el contenido
  // como `inert` también en ESCRITORIO (donde el CSS lo muestra siempre),
  // dejando inputs/botones inaccesibles ahí. Se recalcula tras el montado
  // (nunca durante SSR) y en cada cambio de viewport, así que no afecta a la
  // hidratación: solo actualiza un atributo después de que el DOM ya coincide.
  const [isTouchViewport, setIsTouchViewport] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsTouchViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  // Con el widget colapsado en móvil el cuerpo sigue en el DOM (la animación
  // de despliegue lo necesita) pero queda oculto visualmente a 0 de alto —
  // sin `inert` sus inputs/chips seguirían siendo alcanzables con Tab aunque
  // invisibles, una trampa de foco real. `inert` los saca del árbol de
  // accesibilidad y del orden de tabulación mientras están colapsados.
  const hiddenFromA11y = isTouchViewport && !expanded;

  const { status, errorMsg, submit } = useLeadForm();

  const stepBodyRef = useRef<HTMLDivElement>(null);
  const honeyRef = useRef<HTMLInputElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Feedback de selección: al pulsar un chip, se marca `data-selected` un
  // instante ANTES de cambiar de paso (relleno de acento real, no solo un
  // hover), para que el chip elegido se sienta "aceptado" en vez de
  // desaparecer sin más. Gated tras reduced-motion (ahí se avanza al
  // instante, sin el pulso intermedio).
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const selectionTimeout = useRef<number>(0);
  // Tween de salida del paso actual (fade + slide-up breve) antes de
  // confirmar el cambio real — comparte referencia entre chooseWithFeedback
  // y goBack para poder matarlo si el usuario dispara ambos casi a la vez o
  // el componente se desmonta a mitad de la transición.
  const exitTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(
    () => () => {
      window.clearTimeout(selectionTimeout.current);
      exitTweenRef.current?.kill();
    },
    [],
  );

  const chooseWithFeedback = useCallback(
    (value: string, commit: () => void) => {
      if (selectedChip) return; // ya hay una selección en curso — ignora el doble click
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        commit();
        return;
      }
      setSelectedChip(value);
      const el = stepBodyRef.current;
      if (!el) {
        selectionTimeout.current = window.setTimeout(commit, 160);
        return;
      }
      // Mantiene el chip "aceptado" visible ~80ms (el pulso de selección de
      // siempre) y encadena una salida breve (fade + slide-up, ~160ms) del
      // paso completo antes de confirmar — el paso anterior ya no
      // desaparece en seco, sale con la misma ventana de tiempo que ya
      // reservaba esta función (sin latencia extra perceptible).
      exitTweenRef.current = gsap.to(el, {
        opacity: 0,
        y: -8,
        duration: 0.16,
        delay: 0.08,
        ease: 'power2.in',
        onComplete: commit,
      });
    },
    [selectedChip],
  );

  // Transición entre pasos: fade + rise con más peso (power3.out, no el
  // power2.out genérico anterior), gated tras reduced-motion. No se anima
  // el primer render (evita un parpadeo al montar el hero). Además, dentro
  // del mismo timeline: los chips del paso nuevo entran en cascada (stagger
  // por posición, solo desplazamiento — el opacity ya lo cubre el bloque
  // padre, así se evita un doble fade multiplicativo), el dot de progreso
  // recién activado hace un pequeño pop elástico y la label "Paso X de Y"
  // entra con un fade+slide en vez de saltar seca.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    // Limpia el estado transitorio de "chip seleccionado" al llegar el nuevo
    // paso — si no, `chooseWithFeedback` seguiría viendo un valor truthy y
    // bloquearía cualquier click futuro (su guard anti-doble-click).
    setSelectedChip(null);
    const el = stepBodyRef.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // El Paso 4 es el remate del flujo (la plantilla + diagnóstico), así
      // que entra con más recorrido y algo de escala — power3.out pero con
      // más peso — en vez de la misma entrada discreta de los pasos de
      // preguntas (1-3).
      tl.fromTo(
        el,
        step === 4 ? { opacity: 0, y: 22, scale: 0.96 } : { opacity: 0, y: 14 },
        step === 4
          ? { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
          : { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' },
        0,
      );

      const chips = el.querySelectorAll('[data-chip]');
      if (chips.length) {
        tl.fromTo(
          chips,
          { y: 10 },
          { y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.05 },
          '-=0.3',
        );
      }

      const activeDot = dotRefs.current[step - 1];
      if (activeDot) {
        tl.fromTo(activeDot, { scale: 0.5 }, { scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, 0);
      }

      if (progressLabelRef.current) {
        tl.fromTo(
          progressLabelRef.current,
          { opacity: 0, y: -4 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          0,
        );
      }
    }, el);
    return () => ctx.revert();
  }, [step]);

  // Latido de anticipación — dispara solo al llegar por primera vez al Paso
  // 4 (ver comentario en la declaración de `hasEnteredStep4`). Bajo
  // reduced-motion se salta por completo: la plantilla se ensambla al
  // instante, sin el estado intermedio "montando tu propuesta…".
  useEffect(() => {
    if (step !== 4 || hasEnteredStep4.current) return;
    hasEnteredStep4.current = true;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    setIsAssembling(true);
    const timeout = window.setTimeout(() => setIsAssembling(false), 480);
    return () => window.clearTimeout(timeout);
  }, [step]);

  const resolvedCombo = useMemo(
    () => (necesidad && sub ? resolveCombo(necesidad, sub) : null),
    [necesidad, sub],
  );
  const template = useMemo(
    () => (resolvedCombo && objetivo ? getTemplate(resolvedCombo, objetivo) : null),
    [resolvedCombo, objetivo],
  );
  const comboKey = resolvedCombo && objetivo
    ? `${resolvedCombo.necesidad}:${resolvedCombo.sub}:${objetivo}`
    : 'none';

  const selectNecesidad = useCallback((value: Necesidad) => {
    setNecesidad(value);
    setSub(null);
    setStep(2);
  }, []);

  const selectSub = useCallback((value: Sub) => {
    setSub(value);
    setStep(3);
  }, []);

  const selectObjetivo = useCallback((value: Objetivo) => {
    setObjetivo(value);
    setStep(4);
  }, []);

  const goBack = useCallback(() => {
    window.clearTimeout(selectionTimeout.current);
    exitTweenRef.current?.kill();
    setSelectedChip(null);
    const commit = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));
    const el = stepBodyRef.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce) {
      commit();
      return;
    }
    // Misma salida breve que chooseWithFeedback, sin el hold de selección
    // (aquí no hay chip que "aceptar") — el paso anterior sale con un fade +
    // slide-up corto en vez de desaparecer en seco al volver atrás.
    exitTweenRef.current = gsap.to(el, {
      opacity: 0,
      y: -8,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: commit,
    });
  }, []);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (emailError) setEmailError('');
    },
    [emailError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const err = validateEmail(email);
      if (err) {
        setEmailError(err);
        return;
      }
      setEmailError('');
      const step2Label = necesidad
        ? STEP2_CONFIG[necesidad].options.find((o) => o.value === sub)?.label ?? ''
        : '';
      await submit({
        email: email.trim(),
        necesidad: necesidad ? NECESIDAD_LABEL[necesidad] : '',
        detalle: step2Label,
        objetivo: objetivo ? OBJETIVO_LABEL[objetivo] : '',
        _subject: 'Nuevo lead — widget hero OpsPilot',
        _honey: honeyRef.current?.value ?? '',
      });
    },
    [email, necesidad, sub, objetivo, submit],
  );

  const stepLabel = `Paso ${Math.min(step, TOTAL_STEPS)} de ${TOTAL_STEPS}`;
  const step2 = necesidad ? STEP2_CONFIG[necesidad] : null;

  return (
    <div className={styles.panel} data-expanded={expanded ? 'true' : 'false'}>
      {/* Solo visible ≤767px (ver .mobileToggle) — en escritorio el CSS lo
         oculta y el widget completo permanece siempre visible como hoy. */}
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={toggleExpanded}
        aria-expanded={expanded}
        aria-controls={bodyId}
      >
        <span>Configura tu proyecto</span>
        <ChevronDown className={styles.mobileToggleIcon} size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <div className={styles.collapseOuter}>
        <div className={styles.collapseInner}>
          <div
            className={styles.body}
            id={bodyId}
            ref={collapsibleBodyRef}
            tabIndex={-1}
            inert={hiddenFromA11y}
          >
            {status === 'success' ? (
          <div className={styles.success} role="status">
            <span className={styles.successDot} aria-hidden="true" />
            <p className={styles.successTitle}>Recibido.</p>
            <p className={styles.successText}>Te escribimos en menos de 24h.</p>
          </div>
        ) : (
          <>
            <div className={styles.progress}>
              <span className={styles.progressDots} aria-hidden="true">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <span
                    key={i}
                    ref={(node) => {
                      dotRefs.current[i] = node;
                    }}
                    className={`${styles.progressDot} ${i < step ? styles.progressDotActive : ''}`}
                  />
                ))}
              </span>
              <span ref={progressLabelRef} className={styles.progressLabel} aria-live="polite">
                {stepLabel}
              </span>
            </div>

            <div ref={stepBodyRef}>
              {step > 1 && (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={goBack}
                  aria-label="Volver al paso anterior"
                >
                  <ChevronLeft size={15} strokeWidth={2.2} />
                  Volver
                </button>
              )}

              {step === 1 && (
                <fieldset className={styles.stepFieldset}>
                  <legend className={styles.stepQuestion}>¿Qué necesitas?</legend>
                  <div className={styles.chipGrid}>
                    {STEP1_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        data-chip="true"
                        data-selected={selectedChip === opt.value || undefined}
                        className={styles.chip}
                        onClick={() => chooseWithFeedback(opt.value, () => selectNecesidad(opt.value))}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 2 && step2 && (
                <fieldset className={styles.stepFieldset}>
                  <legend className={styles.stepQuestion}>{step2.question}</legend>
                  <div className={styles.chipGrid}>
                    {step2.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        data-chip="true"
                        data-selected={selectedChip === opt.value || undefined}
                        className={styles.chip}
                        onClick={() => chooseWithFeedback(opt.value, () => selectSub(opt.value))}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <fieldset className={styles.stepFieldset}>
                  <legend className={styles.stepQuestion}>{STEP3_QUESTION}</legend>
                  <div className={styles.chipGrid}>
                    {STEP3_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        data-chip="true"
                        data-selected={selectedChip === opt.value || undefined}
                        className={styles.chip}
                        onClick={() => chooseWithFeedback(opt.value, () => selectObjetivo(opt.value))}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 4 && template && (
                isAssembling ? (
                  // Latido de anticipación (~480ms, solo primera llegada al
                  // paso) — reusa la utilidad global `.shimmer` (barrido de
                  // luz para skeletons, ya gateada tras reduced-motion en
                  // index.css) en vez de inventar una nueva.
                  <div className={`${styles.assembling} shimmer`} aria-hidden="true">
                    <span className={styles.assemblingLabel}>Montando tu propuesta…</span>
                  </div>
                ) : (
                  <>
                    <p className={styles.diagnostic}>{template.diagnostic}</p>

                    <div className={styles.previewMeta}>
                      <span className={styles.previewLabel}>Vista previa</span>
                      <div
                        className={styles.deviceToggle}
                        role="group"
                        aria-label="Ver la plantilla como escritorio o móvil"
                      >
                        <button
                          type="button"
                          className={styles.deviceBtn}
                          aria-pressed={device === 'desktop'}
                          onClick={() => setDevice('desktop')}
                        >
                          <Monitor size={13} strokeWidth={2} />
                          <span className={styles.srOnly}>Escritorio</span>
                        </button>
                        <button
                          type="button"
                          className={styles.deviceBtn}
                          aria-pressed={device === 'mobile'}
                          onClick={() => setDevice('mobile')}
                        >
                          <Smartphone size={13} strokeWidth={2} />
                          <span className={styles.srOnly}>Móvil</span>
                        </button>
                      </div>
                    </div>

                    <MockPreview
                      key={comboKey}
                      className={styles.mockPreviewSlot}
                      accent={template.accent}
                      device={device}
                      title={template.title}
                      sub={template.sub}
                      block={toMockBlock(template.block)}
                    />

                    <form className={styles.emailForm} onSubmit={handleSubmit} noValidate>
                      {/* Honeypot antispam de FormSubmit — mismo patrón que Contact.tsx */}
                      <input
                        ref={honeyRef}
                        type="text"
                        name="_honey"
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                      />
                      <div className={styles.field}>
                        <label htmlFor="hero-lead-email">Tu email</label>
                        <input
                          id="hero-lead-email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="tu@email.com"
                          autoComplete="email"
                          inputMode="email"
                          aria-invalid={!!emailError}
                          aria-describedby={emailError ? 'hero-lead-email-error' : undefined}
                        />
                        {emailError && (
                          <span id="hero-lead-email-error" className={styles.fieldError} role="alert">
                            {emailError}
                          </span>
                        )}
                      </div>
                      {status === 'error' && (
                        <p className={styles.formError} role="alert">
                          {errorMsg}
                        </p>
                      )}
                      <Button
                        variant="primary"
                        fullWidth
                        type="submit"
                        disabled={status === 'submitting'}
                        aria-busy={status === 'submitting'}
                      >
                        {status === 'submitting'
                          ? 'Enviando…'
                          : objetivo
                            ? CTA_LABEL[objetivo]
                            : 'Quiero ver esto en mi negocio'}
                      </Button>
                    </form>
                  </>
                )
              )}
            </div>
          </>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};
