import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { Button } from "../components/ui/Button";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useDragScroll } from "../hooks/useDragScroll";
import { useCarousel } from "../hooks/useCarousel";
import { PageSEO } from "../hooks/usePageSEO";
import { useMagnetic } from "../hooks/useMagnetic";
import { useSpotlight } from "../hooks/useSpotlight";
import { ROUTES } from "../lib/routes";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  MessagesSquare,
  Search,
  FileCheck,
  Wrench,
} from "lucide-react";
import styles from "./Home.module.css";
import sys from "../styles/page-system.module.css";
import { HeroLeadWidget } from "../components/home/HeroLeadWidget";
import { SpotlightCard } from "../components/fx/SpotlightCard";
import { CaseMockPanel } from "../components/cases/CaseMockPanel";
import { CasesDisclaimer } from "../components/cases/CasesDisclaimer";
import { TextLink } from "../components/common/TextLink";
import { CASES } from "../data";
import { ICONS } from "../components/icons/registry";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

const PROBLEMS = [
  {
    title: "Tu información vive en cuatro sitios",
    text: "Cuatro apps que nunca cuadran entre sí. Buscas el mismo dato tres veces al día.",
    tag: "4 apps",
  },
  {
    title: "Lo que factura lo llevas en un Excel que se rompe",
    text: "Presupuestos y comisiones en una hoja que peta al primer descuido. Un clic y adiós.",
    tag: "Excel",
  },
  {
    title: "Tu equipo cambia de pestaña cada cinco minutos",
    text: "Cinco herramientas para un solo trabajo. Y ninguna se habla con la otra.",
    tag: "5 apps",
  },
];

const STEPS = [
  {
    icon: MessagesSquare,
    title: "Te escuchamos",
    text: "30 minutos para entender tu negocio a fondo. Sin tecnicismos.",
  },
  {
    icon: Search,
    title: "Encontramos el cuello de botella",
    text: "Detectamos qué procesos te frenan de verdad y cuáles ni tocar.",
  },
  {
    icon: FileCheck,
    title: "Te proponemos algo concreto",
    text: "Plan claro, precio cerrado y plazos definidos desde el día uno.",
  },
  {
    icon: Wrench,
    title: "Lo construimos y nos quedamos",
    text: "Montamos tu sistema y seguimos ahí cuando nos necesites.",
  },
];

// Comparativa "Por qué no el software de catálogo" — un único dataset que
// alimenta DOS vistas responsive: la tabla compacta en móvil (<768px, ver
// .compareTable) y las dos SpotlightCard de escritorio (≥768px, ver
// .whyGrid). Cada fila empareja el mismo argumento en su versión genérica
// y en su versión OpsPilot, más una etiqueta corta de característica para
// la columna de fila de la tabla.
const WHY_COMPARISON = [
  {
    feature: "Adaptación",
    generic: "Te adaptas tú a la herramienta, no al revés",
    ops: "El sistema se adapta exactamente a cómo trabajas",
  },
  {
    feature: "Coste",
    generic: "Pagas por funciones que nunca vas a usar",
    ops: "Solo pagas lo que tu negocio realmente necesita",
  },
  {
    feature: "Soporte",
    generic: "Un ticket, un foro en inglés, y a esperar",
    ops: "Escribes al equipo que lo construyó. Te responde esa misma persona",
  },
  {
    feature: "Plazos",
    generic: "6–12 meses para ver resultados reales",
    ops: "Primeros resultados visibles en 4–6 semanas",
  },
  {
    feature: "Integración",
    generic: "Cada app en su silo, sin hablarse entre ellas",
    ops: "Un sistema. Todo conectado, todo a la vista",
  },
  {
    feature: "Estabilidad",
    generic: "Y el precio sube cada año. Sin avisarte",
    ops: "Precio cerrado desde el día uno. Así de simple",
  },
];

export const Home: React.FC = () => {
  const seoProps = {
    title: "Software a medida para PYMEs en España | OpsPilot",
    description:
      "Software a medida para pymes de toda España, hecho en Córdoba. Presupuesto cerrado, respuesta en menos de 24h. Cuéntanos tu problema.",
    canonical: "https://opspilot.es/",
  };

  const heroRef = useRef<HTMLDivElement>(null);

  const problemRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const methodScrollRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const caseRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const whyRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const ctaRef = useScrollReveal<HTMLDivElement>();

  // Cinematic FX: magnetic pull on the primary hero CTA, spotlight that
  // tracks the pointer across the hero dashboard frame.
  const heroCtaRef = useMagnetic<HTMLAnchorElement>({
    strength: 0.12,
    radius: 18,
  });
  const heroPanelRef = useSpotlight<HTMLDivElement>();

  // Case carousel — scroll-snap track. La mecánica (medida de la unidad de
  // scroll, índice activo, arrastre con ratón, foco y flechas) vive en
  // src/hooks/useCarousel.ts y es LA MISMA que consume /casos: antes estaba
  // reescrita en las dos páginas y sólo esta tenía teclado.
  // Sin auto-rotación: el carrusel sólo avanza por acción explícita del
  // usuario, lo que esquiva por completo el criterio WCAG 2.2.2
  // (pausar/parar/ocultar) en vez de obligar a un botón de pausa visible.
  const {
    index: activeCase,
    scrollTo: scrollToCase,
    trackProps: caseTrackProps,
  } = useCarousel<HTMLDivElement>(CASES.length);

  // Mouse drag-to-scroll on every horizontal track that shows cursor:grab.
  // El track de casos NO aparece aquí: useCarousel ya llama a useDragScroll
  // por dentro, y engancharlo dos veces duplicaría los listeners de puntero.
  const whyTrackRef = useRef<HTMLDivElement>(null);
  const processTrackRef = useRef<HTMLDivElement>(null);
  useDragScroll(whyTrackRef);
  useDragScroll(processTrackRef);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Masked line reveal — each heroLine clips its inner span, which
        // rises from below the mask. Mechanical timing (Factory).
        tl.from(`.${styles.heroTitle} .${styles.heroLineInner}`, {
          yPercent: 112,
          duration: 0.45,
          stagger: 0.06,
          ease: "power3.out",
        })
          .from(
            `.${styles.heroSubtitle}`,
            { opacity: 0, y: 10, duration: 0.3 },
            "-=0.2",
          )
          .from(
            `.${styles.ctaGroup} > *`,
            { opacity: 0, y: 8, duration: 0.25, stagger: 0.05 },
            "-=0.15",
          );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Nota: el antiguo stagger reveal de los stats/panel de casos (.caseStat →
  // [data-pcp-block]) se eliminó junto con esos campos. CaseMockPanel (la
  // mini-interfaz fija que ahora vive en el panel de casos) es autocontenido:
  // gestiona su propio ScrollTrigger de entrada en viewport internamente,
  // así que no necesita cableado desde aquí.

  // Section-level scroll choreography (Problema / Método / CTA).
  // Gated con gsap.matchMedia: el pin a pantalla completa solo en desktop con
  // movimiento permitido; móvil y reduced-motion reciben versiones estáticas.
  useEffect(() => {
    const mm = gsap.matchMedia();
    const MINT = "rgba(57, 206, 134, 0.95)";

    // Escribe (scramble) los números de los pasos del método al entrar.
    const scrambleSteps = (steps: HTMLElement[]) =>
      steps.forEach((step, i) => {
        const num = step.querySelector<HTMLElement>(`.${styles.methodStepNum}`);
        if (!num) return;
        gsap.to(num, {
          duration: 0.9,
          delay: i * 0.12,
          scrambleText: {
            text: num.textContent ?? "",
            chars: "0123456789",
            speed: 0.4,
          },
        });
      });

    // Ilumina cada paso: número a mint + barra inferior que se dibuja.
    const lightSteps = (steps: HTMLElement[]) =>
      steps.forEach((step, i) => {
        const num = step.querySelector<HTMLElement>(`.${styles.methodStepNum}`);
        const bar = step.querySelector<HTMLElement>(`.${styles.methodStepBar}`);
        if (num) gsap.to(num, { color: MINT, duration: 0.4, delay: i * 0.12 });
        if (bar)
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, delay: i * 0.12, ease: "power2.out" },
          );
      });

    // ─── PROBLEMA (cualquier anchura con movimiento): layout en dos columnas
    //     (título sticky a la izquierda, tarjetas a la derecha). Cada tarjeta
    //     entra UNA vez al scrollear y se queda fija. Antes esto era un relevo
    //     scroll-jacked (scrub) que mapeaba el scroll a la transición: al parar
    //     a mitad de scroll las tarjetas se quedaban "a la mitad". Con reveal
    //     `once` no hay estados intermedios ni scroll-jacking. ───
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = problemRef.current;
      const cards = track
        ? gsap.utils.toArray<HTMLElement>(`.${styles.problemCard}`, track)
        : [];
      if (!cards.length) return;

      const triggers: ScrollTrigger[] = [];
      cards.forEach((card) => {
        const tween = gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
      return () => triggers.forEach((t) => t.kill());
    });

    // ─── MÉTODO — entrada propia (cualquier anchura con movimiento): las
    //     tarjetas suben en cascada, los números se escriben (scramble) y se
    //     iluminan a mint, y la barra inferior de cada una se dibuja. ───
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const grid = methodScrollRef.current?.querySelector<HTMLElement>(
        `.${styles.methodGrid}`,
      );
      const steps = grid
        ? gsap.utils.toArray<HTMLElement>(`.${styles.methodStep}`, grid)
        : [];
      if (!grid || !steps.length) return;

      gsap.set(steps, { opacity: 0, y: 30 });
      const st = ScrollTrigger.create({
        trigger: grid,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(steps, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: "power3.out",
          });
          scrambleSteps(steps);
          lightSteps(steps);
        },
      });
      return () => {
        st.kill();
        gsap.set(steps, { clearProps: "all" });
      };
    });

    // ─── CTA "¿Hablamos?" — char por char desde una máscara SplitText ───
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const title = ctaRef.current?.querySelector<HTMLElement>(
        `.${sys.endCtaTitle}`,
      );
      if (!title) return;
      const split = SplitText.create(title, { type: "chars", mask: "chars" });
      const tween = gsap.from(split.chars, {
        yPercent: 120,
        duration: 0.8,
        stagger: 0.04,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 78%",
          once: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    });

    // ─── Reduced motion: estados finales estáticos, sin scroll-jacking ───
    mm.add("(prefers-reduced-motion: reduce)", () => {
      methodScrollRef.current
        ?.querySelectorAll<HTMLElement>(`.${styles.methodStepNum}`)
        .forEach((n) => (n.style.color = MINT));
      methodScrollRef.current
        ?.querySelectorAll<HTMLElement>(`.${styles.methodStepBar}`)
        .forEach((b) => (b.style.transform = "scaleX(1)"));
    });

    // Primer scroll: en SSG el layout se estabiliza tras cargar fuentes e
    // imágenes; sin un refresh ScrollTrigger midió el pin antes de tiempo y el
    // efecto "no arrancaba" la primera vez. Forzamos recálculo cuando todo
    // asienta (load, fuentes listas y un tick de seguridad).
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const rid = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(rid);
      mm.revert();
    };
  }, []);

  return (
    <div className={styles.page}>
      <PageSEO {...seoProps} />

      {/* ═══ HERO ═══ */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>Software a medida</span>
              </span>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>para tu PYME.</span>
              </span>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>
                  Sin plantillas. Sin{" "}
                  <span className={styles.heroAccent}>sorpresas.</span>
                </span>
              </span>
            </h1>
            <p className={styles.heroSubtitle}>
              Construimos el sistema que tu PYME necesita, no el que te quieren
              vender. Precio cerrado y respuesta en menos de 24 horas.
            </p>
            <div className={styles.ctaGroup}>
              <Link to={ROUTES.contacto} ref={heroCtaRef}>
                <Button variant="primary" size="lg">
                  Cuéntanos tu problema
                </Button>
              </Link>
              <TextLink
                to={ROUTES.soluciones}
                tone="strong"
                size="md"
                className={styles.ctaSecondary}
              >
                Ver soluciones
              </TextLink>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.heroPanelFrame} ref={heroPanelRef}>
              <HeroLeadWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROBLEMA — sticky + relevo a pantalla completa ═══ */}
      <section className={styles.problemSection}>
        <div className={styles.problemTrack} ref={problemRef}>
          <div className={styles.problemViewport}>
            <div className={`${sys.container} ${styles.problemLayout}`}>
              <div className={`${styles.problemHead} reveal`}>
                <h2 className={sys.sectionTitle}>
                  Las herramientas que usas no fueron pensadas para ti.
                </h2>
              </div>
              <div className={styles.problemDeck}>
                {PROBLEMS.map((p, i) => (
                  <article className={styles.problemCard} key={i}>
                    <span className={styles.problemNum} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.problemCardBody}>
                      <span className={styles.problemTag}>{p.tag}</span>
                      <h3 className={styles.problemTitle}>{p.title}</h3>
                      <p className={styles.problemText}>{p.text}</p>
                    </div>
                    <span className={styles.problemCount} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                      <span className={styles.problemCountTotal}>
                        / {String(PROBLEMS.length).padStart(2, "0")}
                      </span>
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CASOS DE ÉXITO — carrusel ═══ */}
      <section className={styles.caseSection}>
        <div className={sys.container} ref={caseRef}>
          <header className={`${sys.sectionHeader} reveal`}>
            <h2 className={sys.sectionTitle}>
              Lo que construimos ya está trabajando.
            </h2>
          </header>
          <div className={styles.caseCarouselWrapper}>
            <div
              {...caseTrackProps}
              className={styles.caseCarouselTrack}
              aria-label="Casos de éxito"
            >
              {CASES.map((c) => {
                const CaseIcon = ICONS[c.iconKey];
                return (
                  <SpotlightCard
                    as="article"
                    className={styles.caseCard}
                    key={c.id}
                  >
                    <div className={styles.caseCardMain}>
                      <div className={styles.caseCardHead}>
                        <span
                          className={styles.caseIconTile}
                          aria-hidden="true"
                        >
                          <CaseIcon size={20} strokeWidth={1.6} />
                        </span>
                        <span className={styles.caseSector}>{c.label}</span>
                      </div>
                      {/* h3 y no h2: aquí los casos cuelgan del h2 de la
                          sección ("Lo que construimos ya está trabajando.").
                          En /casos el MISMO dato va como h2 porque allí los
                          casos son el contenido de la página y cuelgan
                          directos del h1 — el nivel lo fija el documento,
                          no el dato. Ver la nota en Cases.tsx. */}
                      <h3 className={styles.caseCardTitle}>{c.title}</h3>
                      <p className={styles.caseCardSummary}>{c.summary}</p>
                      <ul className={styles.caseCardBullets}>
                        {c.bullets.map((b, j) => (
                          <li key={j}>
                            <span className={styles.caseCheck}>
                              <Check size={14} strokeWidth={2.2} />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <aside className={styles.caseCardPanel}>
                      <CaseMockPanel showcase={c.showcase} />
                    </aside>
                  </SpotlightCard>
                );
              })}
            </div>

            <div className={styles.caseCarouselFooter}>
              {/* Botones simples, mismo patrón que los puntos de /casos.
                  Esto era un role="tablist" con role="tab" y aria-selected
                  SIN un solo tabpanel asociado, que es un patrón ARIA mal
                  formado: un `tab` promete controlar un panel (vía
                  aria-controls) y aquí no hay panel ninguno, sólo un track
                  con scroll. Encima obliga al patrón de teclado de las
                  pestañas (una parada de tabulador para todo el grupo,
                  flechas para moverse entre ellas), que nadie implementaba.
                  Un `group` de botones con aria-current dice la verdad: son
                  atajos a una posición del track. */}
              <div
                className={styles.caseDots}
                role="group"
                aria-label="Navegar entre casos"
              >
                {CASES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-current={i === activeCase}
                    className={`${styles.caseDot} ${i === activeCase ? styles.caseDotActive : ""}`}
                    onClick={() => scrollToCase(i)}
                    aria-label={`Ir al caso ${i + 1}`}
                  />
                ))}
              </div>
              <div className={styles.caseNavButtons}>
                <button
                  type="button"
                  className={styles.caseNavBtn}
                  onClick={() => scrollToCase(activeCase - 1)}
                  disabled={activeCase === 0}
                  aria-label="Caso anterior"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className={styles.caseNavBtn}
                  onClick={() => scrollToCase(activeCase + 1)}
                  disabled={activeCase === CASES.length - 1}
                  aria-label="Caso siguiente"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
          {/* Mismo texto que /casos, escrito una sola vez en
              CasesDisclaimer. Aquí se pinta en sm/muted (ver
              .caseDisclaimer en Home.module.css) porque en la portada no
              tiene encima la fila de navegación con la que competir. */}
          <CasesDisclaimer className={styles.caseDisclaimer} />
        </div>
      </section>

      {/* ═══ POR QUÉ OPSPILOT ═══ */}
      <section className={styles.whySection}>
        <div className={sys.container} ref={whyRef}>
          <header className={`${sys.sectionHeader} reveal`}>
            <h2 className={sys.sectionTitle}>
              Por qué no el software de catálogo.
            </h2>
          </header>
          {/* Móvil (<768px): una sola tabla compacta — fila por característica,
              columnas Genérico/OpsPilot. Sustituye al carrusel horizontal que
              ya se probó antes en esta sección y se descartó por ilegibilidad
              (ver comentario en Home.module.css junto a .compareTableWrap). */}
          <div className={styles.compareTableWrap}>
            <table className={styles.compareTable}>
              <caption className={styles.srOnly}>
                Comparativa entre software genérico y OpsPilot a medida
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={styles.compareTableFeatureCol}>
                    <span className={styles.srOnly}>Característica</span>
                  </th>
                  <th scope="col" className={styles.compareTableGenericCol}>
                    Genérico
                  </th>
                  <th scope="col" className={styles.compareTableOpsCol}>
                    OpsPilot
                  </th>
                </tr>
              </thead>
              <tbody>
                {WHY_COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className={styles.compareTableFeatureCol}>
                      {row.feature}
                    </th>
                    <td className={styles.compareTableGenericCol}>
                      <X
                        size={12}
                        strokeWidth={2.5}
                        className={styles.compareIconNeg}
                        aria-hidden="true"
                      />
                      {row.generic}
                    </td>
                    <td className={styles.compareTableOpsCol}>
                      <Check
                        size={12}
                        strokeWidth={2.5}
                        className={styles.compareIconPos}
                        aria-hidden="true"
                      />
                      {row.ops}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Escritorio (≥768px): dos SpotlightCard lado a lado, mismo
              dataset que la tabla móvil. */}
          <div className={styles.whyGrid} ref={whyTrackRef}>
            <SpotlightCard
              className={`${styles.whyCol} ${styles.whyColGeneric} reveal`}
            >
              <div className={styles.whyColHead}>
                <span className={styles.whyColBadge}>Software genérico</span>
              </div>
              {WHY_COMPARISON.map((row) => (
                <div className={styles.whyRow} key={row.feature}>
                  <span className={styles.whyIconNeg}>
                    <X size={13} strokeWidth={2.5} />
                  </span>
                  <span className={styles.whyRowText}>{row.generic}</span>
                </div>
              ))}
            </SpotlightCard>
            <SpotlightCard
              className={`${styles.whyCol} ${styles.whyColOps} reveal`}
            >
              <div className={styles.whyColHead}>
                <span
                  className={`${styles.whyColBadge} ${styles.whyColBadgeOps}`}
                >
                  OpsPilot a medida
                </span>
                <span className={styles.whyRecommended}>Recomendado</span>
              </div>
              {WHY_COMPARISON.map((row) => (
                <div className={styles.whyRow} key={row.feature}>
                  <span className={styles.whyIconPos}>
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span className={styles.whyRowText}>{row.ops}</span>
                </div>
              ))}
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ═══ MÉTODO ═══ */}
      <section className={styles.methodSection}>
        <div className={sys.container} ref={methodScrollRef}>
          <header className={`${sys.sectionHeader} reveal`}>
            <h2 className={sys.sectionTitle}>Así trabajamos contigo.</h2>
          </header>
          <div className={styles.methodGrid} ref={processTrackRef}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <article className={styles.methodStep} key={i}>
                  <div className={styles.methodStepTop}>
                    <span className={styles.methodStepIcon}>
                      <Icon size={22} strokeWidth={1.6} />
                    </span>
                    <span className={styles.methodStepNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className={styles.methodStepTitle}>{step.title}</h3>
                  <p className={styles.methodStepText}>{step.text}</p>
                  <span className={styles.methodStepBar} aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className={sys.endCta}>
        <div className={sys.container}>
          <div className={sys.endCtaBlock} ref={ctaRef}>
            <h2 className={sys.endCtaTitle}>¿Hablamos?</h2>
            <p className={sys.endCtaSub}>
              Treinta minutos que te ahorran meses de dudas. Te decimos qué
              construir y qué no, sin venderte de más.
            </p>
            <div className={sys.endCtaButtons}>
              <Link to={ROUTES.contacto}>
                <Button variant="secondary" size="lg">
                  Reservar diagnóstico
                </Button>
              </Link>
              <Link to={ROUTES.soluciones}>
                <Button variant="outline" size="lg">
                  Ver soluciones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
