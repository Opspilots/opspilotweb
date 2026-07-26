import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronLeft, Monitor, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLeadForm, validateEmail } from '../../lib/forms';
import { CONTACT_EMAIL, BRAND_NAME, FORM_PROCESSOR } from '../../lib/company';
import { ROUTES } from '../../lib/routes';
import { MockPreview, MOCK_ACCENT_VARS } from '../marketing/MockPreview';
import { toMockBlock } from '../marketing/toMockBlock';
import {
  NECESIDAD_LABEL,
  OBJETIVO_LABEL,
  STEP1_OPTIONS,
  STEP1_QUESTION,
  STEP2_CONFIG,
  STEP3_OPTIONS,
  STEP3_QUESTION,
  SUBMIT_LABEL,
  getFunnelTemplate,
  resolveCombo,
  type Necesidad,
  type Objetivo,
  type Sub,
} from '../../data/leadFunnel';
import styles from './HeroLeadWidget.module.css';

/**
 * HeroLeadWidget — micro-formulario de 3 preguntas ENCADENADAS + vista previa
 * de la propuesta + diagnóstico completo + email.
 *
 * Paso 1: qué necesita el visitante (4 ramas).
 * Paso 2: pregunta DISTINTA según la rama del Paso 1 (ver STEP2_CONFIG en
 *   src/data/leadFunnel.ts). La rama "No lo sé, que me guíen" remapea
 *   internamente su respuesta a una de las combinaciones de las otras 3
 *   ramas (ver GUIA_REMAP) para poder generar la misma maqueta.
 * Paso 3: objetivo principal (mismo set de 4 chips para las 3 ramas).
 * Paso 4: RESULTADO COMPLETO — diagnóstico en lenguaje natural, maqueta de la
 *   interfaz que construiríamos y la lista concreta de qué incluiría. Solo
 *   DESPUÉS de todo eso viene el email.
 *
 * ─── QUÉ CAMBIÓ Y POR QUÉ ───
 *
 * 1. EL CONTENIDO EDITORIAL SE FUE A src/data/leadFunnel.ts. Este fichero
 *    mezclaba doce tablas de copy, la lógica de dominio, la máquina de estados
 *    y la coreografía GSAP en 909 líneas, y el síntoma era que añadir variedad
 *    obligaba a tocar ~10 sitios repartidos. Mismo movimiento que en su día se
 *    hizo con sectors.ts y cases.ts. Aquí queda la MÁQUINA: estados,
 *    transiciones, accesibilidad y envío.
 *
 * 2. EL EMAIL DEJÓ DE SER UN PEAJE. Antes, tras contestar tres preguntas, lo
 *    único que ocurría era que se pedía el correo: el "diagnóstico" era una
 *    frase y una maqueta decorativa, y el valor real estaba prometido detrás
 *    del formulario. Ahora el resultado está entero en pantalla —qué
 *    construiríamos, en puntos concretos derivados de las tres respuestas— y
 *    el correo solo sirve para llevárselo por escrito.
 *
 * 3. CONSENTIMIENTO EXPLÍCITO. El formulario envía datos personales a un
 *    tercero (FormSubmit, ver src/lib/forms.ts) y lo hacía sin casilla ni
 *    información de tratamiento. Ahora no se puede enviar sin marcarla, y la
 *    cláusula dice quién trata los datos, para qué y cómo ejercer derechos.
 *
 * Transiciones: opacity/transform vía GSAP, gated tras prefers-reduced-motion
 * (igual que el resto del proyecto). Sin scroll-jacking, sin popups.
 */

const TOTAL_STEPS = 4;

// Toggle escritorio/móvil del Paso 4 — recupera la idea del antiguo
// HeroDashboard (eliminado en una iteración anterior), que tenía un switch
// similar. Vive como prop simple del preview: no reinicia ni retriggerea el
// ensamblado (eso solo pasa cuando cambia la combinación resuelta, ver
// `comboKey`), solo cambia cómo se lee visualmente la MISMA maqueta.
type Device = 'desktop' | 'mobile';

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
  // Consentimiento RGPD. Estado propio y error propio: no se puede colar
  // dentro de la validación del email porque son dos fallos distintos y el
  // usuario tiene que saber cuál de los dos le está bloqueando el envío.
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState('');
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
  const consentId = useId();
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
    // bloquearía cualquier click futuro (su guard anti-doble-click). OJO: no
    // confundir con `data-chosen`, que sí persiste (ver `chosenValue`): uno
    // es el pulso de un click que acaba de ocurrir, el otro es la memoria de
    // lo que se eligió en ese paso.
    setSelectedChip(null);
    const el = stepBodyRef.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // El Paso 4 es el remate del flujo (el diagnóstico completo), así
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
  // reduced-motion se salta por completo: el resultado se ensambla al
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
    () => (resolvedCombo && objetivo ? getFunnelTemplate(resolvedCombo, objetivo) : null),
    [resolvedCombo, objetivo],
  );
  const comboKey = resolvedCombo && objetivo
    ? `${resolvedCombo.necesidad}:${resolvedCombo.sub}:${objetivo}`
    : 'none';

  const selectNecesidad = useCallback((value: Necesidad) => {
    setNecesidad(value);
    // Solo se borra la respuesta del Paso 2 si la rama CAMBIA de verdad. Antes
    // se borraba siempre, así que volver atrás y reconfirmar la misma opción
    // vaciaba la respuesta siguiente sin motivo. Cuando la rama sí cambia hay
    // que borrarla: las opciones del Paso 2 son distintas por rama y un `sub`
    // heredado no existiría en el nuevo set.
    setSub((prev) => (value === necesidad ? prev : null));
    setStep(2);
  }, [necesidad]);

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

  const handleConsentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConsent(e.target.checked);
      if (e.target.checked) setConsentError('');
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const err = validateEmail(email);
      // Se validan AMBOS antes de salir, no en cascada: si faltan las dos
      // cosas, quien rellena el formulario debería verlas de una vez y no
      // descubrir la segunda después de arreglar la primera.
      const missingConsent = !consent;
      setEmailError(err ?? '');
      setConsentError(missingConsent ? 'Necesitamos tu permiso para poder escribirte.' : '');
      if (err || missingConsent) return;

      const step2Label = necesidad
        ? STEP2_CONFIG[necesidad].options.find((o) => o.value === sub)?.label ?? ''
        : '';
      await submit({
        email: email.trim(),
        necesidad: necesidad ? NECESIDAD_LABEL[necesidad] : '',
        detalle: step2Label,
        objetivo: objetivo ? OBJETIVO_LABEL[objetivo] : '',
        // El consentimiento viaja con el envío a propósito: si algún día hay
        // que demostrar que se recabó, la prueba tiene que estar en el mismo
        // registro que el dato, no en la palabra de nadie.
        consentimiento: 'Sí — casilla marcada en el widget del hero',
        _subject: 'Nuevo lead — widget hero OpsPilot',
        _honey: honeyRef.current?.value ?? '',
      });
    },
    [email, consent, necesidad, sub, objetivo, submit],
  );

  const stepLabel = `Paso ${Math.min(step, TOTAL_STEPS)} de ${TOTAL_STEPS}`;
  const step2 = necesidad ? STEP2_CONFIG[necesidad] : null;

  // Pregunta del paso actual, en un solo sitio: la usan el <legend> visible y
  // el anuncio para lectores de pantalla, y tienen que decir lo mismo.
  const stepQuestion =
    step === 1 ? STEP1_QUESTION : step === 2 ? step2?.question ?? '' : step === 3 ? STEP3_QUESTION : '';

  // Respuesta ya elegida en el paso actual, para repintar el chip al volver
  // atrás. Antes el paso anterior aparecía virgen: `selectedChip` se limpiaba
  // en cada cambio de paso y los chips no miraban el estado real, así que
  // "Volver" borraba visualmente una decisión que el componente seguía
  // recordando por dentro.
  const chosenValue: string | null =
    step === 1 ? necesidad : step === 2 ? sub : step === 3 ? objetivo : null;

  // ─── Anuncio único para lectores de pantalla ───
  // Antes el `aria-live` colgaba SOLO de la etiqueta "Paso X de N", así que a
  // un lector de pantalla le llegaba "paso 3 de 4" sin la menor idea de qué se
  // le estaba preguntando. Se mueve a una región propia que compone paso +
  // pregunta en una frase. La etiqueta visible se queda SIN aria-live: como
  // texto estático no se reanuncia al cambiar, así que no hay doble aviso.
  const liveAnnouncement =
    step === 4
      ? `${stepLabel}. Listo: esto es lo que construiríamos para ti.`
      : `${stepLabel}. ${stepQuestion}`;

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
                {/* TODO(negocio): confirmar — el plazo se ha alineado con el que
                    ya promete Contacto ("menos de 24 horas laborables"), pero
                    hay que validar que se puede sostener también desde aquí. */}
                <p className={styles.successText}>
                  Te enviamos este resumen por escrito, con los siguientes pasos, en menos de
                  24 horas laborables.
                </p>
              </div>
            ) : (
              <>
                {/* Región de anuncio: invisible, y la única con aria-live en
                    todo el widget (ver `liveAnnouncement`). */}
                <p className={styles.srOnly} role="status">
                  {liveAnnouncement}
                </p>

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
                  <span ref={progressLabelRef} className={styles.progressLabel}>
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
                      <legend className={styles.stepQuestion}>{STEP1_QUESTION}</legend>
                      <div className={styles.chipGrid}>
                        {STEP1_OPTIONS.map((opt) => (
                          <Chip
                            key={opt.value}
                            label={opt.label}
                            selected={selectedChip === opt.value}
                            chosen={chosenValue === opt.value}
                            onSelect={() =>
                              chooseWithFeedback(opt.value, () => selectNecesidad(opt.value))
                            }
                          />
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {step === 2 && step2 && (
                    <fieldset className={styles.stepFieldset}>
                      <legend className={styles.stepQuestion}>{step2.question}</legend>
                      <div className={styles.chipGrid}>
                        {step2.options.map((opt) => (
                          <Chip
                            key={opt.value}
                            label={opt.label}
                            selected={selectedChip === opt.value}
                            chosen={chosenValue === opt.value}
                            onSelect={() => chooseWithFeedback(opt.value, () => selectSub(opt.value))}
                          />
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {step === 3 && (
                    <fieldset className={styles.stepFieldset}>
                      <legend className={styles.stepQuestion}>{STEP3_QUESTION}</legend>
                      <div className={styles.chipGrid}>
                        {STEP3_OPTIONS.map((opt) => (
                          <Chip
                            key={opt.value}
                            label={opt.label}
                            selected={selectedChip === opt.value}
                            chosen={chosenValue === opt.value}
                            onSelect={() =>
                              chooseWithFeedback(opt.value, () => selectObjetivo(opt.value))
                            }
                          />
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
                      // El acento de la rama tiñe TODO el resultado, no solo la
                      // maqueta: los números de la lista, el raíl y el foco del
                      // input leen `var(--tpl-accent)` desde aquí. Se reusa la
                      // misma tabla que aplica MockPreview por dentro (ver
                      // MOCK_ACCENT_VARS) para no tener dos listas de colores
                      // que mantener sincronizadas.
                      <div className={styles.result} style={MOCK_ACCENT_VARS[template.accent]}>
                        <p className={styles.diagnostic}>{template.diagnostic}</p>

                        <div className={styles.previewMeta}>
                          <span className={styles.previewLabel}>Vista previa</span>
                          <div
                            className={styles.deviceToggle}
                            role="group"
                            aria-label="Ver la maqueta como escritorio o móvil"
                          >
                            <button
                              type="button"
                              className={styles.deviceBtn}
                              aria-pressed={device === 'desktop'}
                              onClick={() => setDevice('desktop')}
                            >
                              <Monitor size={15} strokeWidth={2} />
                              <span className={styles.srOnly}>Escritorio</span>
                            </button>
                            <button
                              type="button"
                              className={styles.deviceBtn}
                              aria-pressed={device === 'mobile'}
                              onClick={() => setDevice('mobile')}
                            >
                              <Smartphone size={15} strokeWidth={2} />
                              <span className={styles.srOnly}>Móvil</span>
                            </button>
                          </div>
                        </div>

                        <MockPreview
                          key={comboKey}
                          className={styles.mockPreviewSlot}
                          accent={template.accent}
                          layout={template.layout}
                          device={device}
                          navLinks={template.navLinks}
                          navCta={template.navCta}
                          kicker={template.kicker}
                          title={template.title}
                          sub={template.sub}
                          block={toMockBlock(template.block)}
                        />

                        {/* EL VALOR, ANTES DE PEDIR NADA. La maqueta enseña la
                            forma; esta lista dice el contenido, en puntos que
                            salen de las tres respuestas (tres del sector/foco y
                            uno del objetivo, ver getFunnelTemplate). Es lo que
                            antes solo se prometía a cambio del correo. */}
                        <div className={styles.build}>
                          <h3 className={styles.buildTitle}>Qué incluiría</h3>
                          <ul className={styles.buildList}>
                            {template.entregables.map((item) => (
                              <li key={item} className={styles.buildItem}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

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
                          <p className={styles.formIntro}>
                            ¿Te lo enviamos por escrito para que puedas verlo con calma?
                          </p>
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
                              aria-describedby={
                                emailError ? 'hero-lead-email-error hero-lead-delivery' : 'hero-lead-delivery'
                              }
                            />
                            {emailError && (
                              <span id="hero-lead-email-error" className={styles.fieldError} role="alert">
                                {emailError}
                              </span>
                            )}
                            {/* TODO(negocio): confirmar — qué se envía, en qué
                                formato y en cuánto tiempo. El plazo copia el que
                                Contacto ya promete ("menos de 24 horas
                                laborables") y el formato se deja deliberadamente
                                vago ("por email") porque no hay hoy ningún
                                entregable definido; si va a ser un PDF, un
                                documento o un correo largo, hay que decirlo aquí
                                y dejar de ser vago. */}
                            <span id="hero-lead-delivery" className={styles.deliveryNote}>
                              Te llega por email este mismo resumen, con los siguientes pasos, en
                              menos de 24 horas laborables. Sin llamadas si no las pides.
                            </span>
                          </div>

                          {/* ─── Consentimiento (bloqueante) ───
                              La etiqueta envuelve la casilla, así que toda la
                              cláusula es zona pulsable: no hace falta acertar en
                              un cuadrado de 16px. */}
                          <div className={styles.consent}>
                            <label className={styles.consentLabel} htmlFor={consentId}>
                              <input
                                id={consentId}
                                className={styles.consentBox}
                                type="checkbox"
                                name="consentimiento"
                                checked={consent}
                                onChange={handleConsentChange}
                                aria-invalid={!!consentError}
                                aria-describedby={consentError ? `${consentId}-error` : undefined}
                              />
                              <span className={styles.consentText}>
                                Acepto que {BRAND_NAME} trate mi email para responderme a esta
                                solicitud. El envío se procesa a través de {FORM_PROCESSOR.name}.
                                No se cede a nadie más ni se usa para newsletters. Puedo pedir
                                acceso o borrado en{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`} className={styles.consentLink}>
                                  {CONTACT_EMAIL}
                                </a>
                                . Más detalle en la{' '}
                                <Link to={ROUTES.privacidad} className={styles.consentLink}>
                                  política de privacidad
                                </Link>
                                .
                              </span>
                            </label>
                            {consentError && (
                              <span id={`${consentId}-error`} className={styles.fieldError} role="alert">
                                {consentError}
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
                            {status === 'submitting' ? 'Enviando…' : SUBMIT_LABEL}
                          </Button>
                        </form>
                      </div>
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

/**
 * Chip de respuesta. Extraído porque los tres pasos de preguntas repetían el
 * mismo bloque de ocho líneas y cada arreglo (el `data-chosen` de "Volver",
 * por ejemplo) había que hacerlo tres veces y acertar las tres.
 *
 * Dos estados visuales que NO son el mismo y por eso son dos atributos:
 *   data-selected → transitorio, el pulso de "click aceptado" de los ~240ms
 *                   que tarda el paso en cambiar.
 *   data-chosen   → persistente, "esto fue lo que elegiste aquí". Es lo que
 *                   se ve al pulsar "Volver".
 */
const Chip: React.FC<{
  label: string;
  selected: boolean;
  chosen: boolean;
  onSelect: () => void;
}> = ({ label, selected, chosen, onSelect }) => (
  <button
    type="button"
    data-chip="true"
    data-selected={selected || undefined}
    data-chosen={chosen || undefined}
    // Sin esto un lector de pantalla no distingue el chip recordado del resto:
    // el borde de acento es información que solo existe para quien la ve.
    aria-pressed={chosen}
    className={styles.chip}
    onClick={onSelect}
  >
    {label}
    {chosen && <Check className={styles.chipCheck} size={15} strokeWidth={2.4} aria-hidden="true" />}
  </button>
);
