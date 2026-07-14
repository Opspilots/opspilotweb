import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { Button } from "../components/ui/Button";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useDragScroll } from "../hooks/useDragScroll";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCountUp } from "../hooks/useCountUp";
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
import { HeroDashboard } from "../components/home/HeroDashboard";
import { TextLink } from "../components/common/TextLink";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

const CASES = [
  {
    eyebrow: "Reformas",
    title: "De la libreta al sistema que trabaja solo",
    summary:
      "Empresa familiar de reformas que triplicó su capacidad sin contratar a nadie más.",
    bullets: [
      "Marca, identidad y presupuestos con IA generando imágenes realistas de la reforma antes de empezar",
      "WhatsApp automatizado para citas y visitas — cero llamadas para confirmar",
      "Sistema a medida que centraliza clientes, obras y facturación en un solo lugar",
    ],
    stats: [
      { value: "3×", label: "Capacidad de atención en tres meses" },
      { value: "−70%", label: "Tiempo dedicado a gestión administrativa" },
      { value: "0 €", label: "Inversión adicional en personal" },
    ],
  },
  {
    eyebrow: "Asesoría fiscal",
    title: "Una asesoría que cierra cuentas mientras duerme",
    summary:
      "Despacho con cientos de clientes que automatizó el cierre mensual sin perder calidad.",
    bullets: [
      "Conciliación bancaria automática y lectura inteligente de documentos",
      "Asistente IA que prepara los modelos antes de la revisión humana",
      "Portal de cliente para firmar documentos sin emails de ida y vuelta",
    ],
    stats: [
      { value: "80%", label: "Cierre mensual automatizado" },
      { value: "−5h/día", label: "En tareas repetitivas del equipo" },
      { value: "+45%", label: "Más capacidad sin contratar" },
    ],
  },
  {
    eyebrow: "Agencia de servicios",
    title: "Una agencia que recupera 20 horas a la semana",
    summary:
      "Agencia que reemplazó cinco herramientas distintas por un solo sistema hecho a medida.",
    bullets: [
      "Sistema único que sustituyó CRM, gestión, facturación y comunicación interna",
      "Reporting en tiempo real para dirección, sin tener que pedir nada",
      "Asistente IA que responde dudas internas de proceso al instante",
    ],
    stats: [
      { value: "20h", label: "Ahorradas a la semana en todo el equipo" },
      { value: "5 → 1", label: "Apps reemplazadas por un solo sistema" },
      { value: "100%", label: "Información centralizada y siempre al día" },
    ],
  },
];

function AnimatedStat({ value }: { value: string }) {
  const match = value.match(/^([−\-]?)(\d+(?:\.\d+)?)(.*)/);
  const numericEnd = match ? parseFloat(match[2]) : 0;
  const ref = useCountUp<HTMLSpanElement>({ end: numericEnd, duration: 1.4 });

  if (!match) return <span>{value}</span>;
  const [, prefix, , suffix] = match;
  return (
    <span>
      {prefix}
      <span ref={ref}>{Math.round(numericEnd)}</span>
      {suffix}
    </span>
  );
}

export const Home: React.FC = () => {
  usePageSEO({
    title:
      "OpsPilot — Software a medida y productos verticales para PYMEs en España",
    description:
      "Diseñamos y construimos contigo el software que tu empresa necesita. Trato cercano, presupuesto cerrado, respuesta en menos de 24h. Productos verticales (fiscalidad, energía, obra, ERP) y desarrollo a medida.",
    canonical: "https://opspilot.es/",
  });

  const heroRef = useRef<HTMLDivElement>(null);

  const problemRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const methodScrollRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const caseRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const whyRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const ctaRef = useScrollReveal<HTMLDivElement>();

  // Case carousel — scroll-snap track (same pattern as Cases.tsx' carousel):
  // native horizontal scroll/drag, dot indicators and prev/next buttons.
  // No auto-rotation: unlike the previous bespoke implementation, this
  // carousel only advances on explicit user action, which sidesteps the
  // WCAG 2.2.2 (pause/stop/hide) concern entirely instead of requiring a
  // visible pause control.
  const [activeCase, setActiveCase] = useState(0);
  const caseTrackRef = useRef<HTMLDivElement>(null);
  const caseScrollRaf = useRef(0);

  // Mouse drag-to-scroll on every horizontal track that shows cursor:grab
  const whyTrackRef = useRef<HTMLDivElement>(null);
  const processTrackRef = useRef<HTMLDivElement>(null);
  useDragScroll(caseTrackRef);
  useDragScroll(whyTrackRef);
  useDragScroll(processTrackRef);

  const getCaseScrollUnit = useCallback((): number => {
    const track = caseTrackRef.current;
    if (!track) return 0;
    const card = track.children[0] as HTMLElement | null;
    if (!card) return 0;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
    return card.offsetWidth + gap;
  }, []);

  const handleCaseScroll = useCallback(() => {
    cancelAnimationFrame(caseScrollRaf.current);
    caseScrollRaf.current = requestAnimationFrame(() => {
      const track = caseTrackRef.current;
      const unit = getCaseScrollUnit();
      if (!track || !unit) return;
      const idx = Math.round(track.scrollLeft / unit);
      setActiveCase(Math.max(0, Math.min(idx, CASES.length - 1)));
    });
  }, [getCaseScrollUnit]);

  useEffect(() => () => cancelAnimationFrame(caseScrollRaf.current), []);

  const scrollToCase = useCallback(
    (index: number) => {
      const track = caseTrackRef.current;
      const unit = getCaseScrollUnit();
      const clamped = Math.max(0, Math.min(index, CASES.length - 1));
      if (track && unit) {
        track.scrollTo({ left: clamped * unit, behavior: "smooth" });
      }
      setActiveCase(clamped);
    },
    [getCaseScrollUnit],
  );

  const handleCaseTrackKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToCase(activeCase + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToCase(activeCase - 1);
      }
    },
    [activeCase, scrollToCase],
  );

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

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    // Scoped to caseRef (the case-section container that actually wraps
    // .caseCarouselWrapper / .caseStat) — NOT heroRef, which only contains
    // the hero section and is an unrelated DOM subtree. gsap.context() scopes
    // string-selector lookups to descendants of its scope element, so
    // using heroRef here meant `.caseCarouselWrapper`/`.caseStat` could
    // never resolve, regardless of the (correctly hashed) CSS Modules class
    // names.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: `.${styles.caseCarouselWrapper}`,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.from(`.${styles.caseStat}`, {
            opacity: 0,
            y: 10,
            duration: 0.2,
            stagger: 0.05,
            ease: "power2.out",
          });
        },
      });
    }, caseRef);

    return () => ctx.revert();
  }, []);

  // Section-level scroll choreography (Problema / Método / CTA).
  // All motion-gated via gsap.matchMedia; desktop-only pieces additionally
  // gated on min-width so they never fight the mobile scroll-snap tracks.
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctxs: gsap.Context[] = [];

      // ── PROBLEMA: vertical progress line draws with scroll, markers
      //    light up as their row crosses the viewport.
      ctxs.push(
        gsap.context(() => {
          gsap.fromTo(
            `.${styles.problemProgress}`,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: `.${styles.problemList}`,
                start: "top 72%",
                end: "bottom 58%",
                scrub: 0.5,
              },
            },
          );
          gsap.utils
            .toArray<HTMLElement>(`.${styles.problemRow}`)
            .forEach((row) => {
              ScrollTrigger.create({
                trigger: row,
                start: "top 66%",
                onEnter: () => row.classList.add(styles.problemRowActive),
                onLeaveBack: () =>
                  row.classList.remove(styles.problemRowActive),
              });
            });
        }, problemRef),
      );

      // ── MÉTODO: step numbers scramble into place (terminal voice,
      //    same family as the hero dashboard instrument aesthetic).
      ctxs.push(
        gsap.context(() => {
          ScrollTrigger.create({
            trigger: `.${styles.processGrid}`,
            start: "top 78%",
            once: true,
            onEnter: () => {
              gsap.utils
                .toArray<HTMLElement>(`.${styles.processStepNum}`)
                .forEach((num, i) => {
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
            },
          });
        }, methodScrollRef),
      );

      // ── CTA: "¿Hablamos?" rises char by char from a built-in
      //    SplitText mask (v3.13+).
      const title = ctaRef.current?.querySelector<HTMLElement>(
        `.${sys.endCtaTitle}`,
      );
      let split: SplitText | null = null;
      let charsTween: gsap.core.Tween | null = null;
      if (title) {
        split = SplitText.create(title, { type: "chars", mask: "chars" });
        charsTween = gsap.from(split.chars, {
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
      }

      return () => {
        ctxs.forEach((c) => c.revert());
        charsTween?.scrollTrigger?.kill();
        charsTween?.kill();
        split?.revert();
      };
    });

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctxs: gsap.Context[] = [];

        // ── MÉTODO: sequential scrub activation — steps 01→04 light up
        //    one after another as the section crosses the viewport.
        ctxs.push(
          gsap.context(() => {
            const steps = gsap.utils.toArray<HTMLElement>(
              `.${styles.processStep}`,
            );
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: `.${styles.processGrid}`,
                start: "top 70%",
                end: "bottom 40%",
                scrub: 0.6,
              },
            });
            steps.forEach((step) => {
              const num = step.querySelector(`.${styles.processStepNum}`);
              const badge = step.querySelector(`.${styles.processNumLabel}`);
              if (!num || !badge) return;
              tl.to(num, { color: "rgba(57, 206, 134, 0.95)", duration: 1 }).to(
                badge,
                {
                  backgroundColor: "rgba(57, 206, 134, 0.24)",
                  duration: 1,
                },
                "<",
              );
            });
          }, methodScrollRef),
        );

        return () => ctxs.forEach((c) => c.revert());
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div className={styles.page}>
      {/* ═══ HERO ═══ */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>Software a medida</span>
              </span>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>
                  para PYMEs que ya no
                </span>
              </span>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>
                  caben en el <span className={styles.heroAccent}>Excel.</span>
                </span>
              </span>
            </h1>
            <p className={styles.heroSubtitle}>
              Diseñamos el sistema que tu negocio necesita, no el que te quieren
              vender. Presupuesto cerrado, respuesta en menos de 24h.
            </p>
            <div className={styles.ctaGroup}>
              <Link to={ROUTES.contacto}>
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
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* ═══ PROBLEMA ═══ */}
      <section className={styles.problemSection}>
        <div className={sys.container} ref={problemRef}>
          <div className={styles.problemSplit}>
            <div className={`${styles.problemIntro} reveal`}>
              <h2 className={sys.sectionTitle}>
                Las herramientas que usas no fueron pensadas para ti.
              </h2>
              <p className={styles.problemIntroText}>
                Construimos sistemas pensados en cómo trabajas tú, no al
                revés.
              </p>
            </div>
            <div className={styles.problemList}>
              <span className={styles.problemProgress} aria-hidden="true" />
              <div className={`${styles.problemRow} reveal`}>
                <span className={styles.problemMarker} aria-hidden="true">
                  1
                </span>
                <div className={styles.problemRowBody}>
                  <h3 className={styles.problemTitle}>
                    Tu información vive en cuatro sitios
                  </h3>
                  <p className={styles.problemText}>
                    Datos repartidos en cuatro apps que nunca cuadran entre
                    sí.
                  </p>
                </div>
              </div>
              <div className={`${styles.problemRow} reveal`}>
                <span className={styles.problemMarker} aria-hidden="true">
                  2
                </span>
                <div className={styles.problemRowBody}>
                  <h3 className={styles.problemTitle}>
                    Lo importante lo llevas en hojas que se rompen
                  </h3>
                  <p className={styles.problemText}>
                    Presupuestos y comisiones viven en un Excel que se rompe
                    fácilmente.
                  </p>
                </div>
              </div>
              <div className={`${styles.problemRow} reveal`}>
                <span className={styles.problemMarker} aria-hidden="true">
                  3
                </span>
                <div className={styles.problemRowBody}>
                  <h3 className={styles.problemTitle}>
                    Tu equipo cambia de pestaña cada cinco minutos
                  </h3>
                  <p className={styles.problemText}>
                    Tu equipo salta entre cinco herramientas para hacer el
                    mismo trabajo.
                  </p>
                </div>
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
              ref={caseTrackRef}
              className={styles.caseCarouselTrack}
              onScroll={handleCaseScroll}
              onKeyDown={handleCaseTrackKeyDown}
              tabIndex={0}
              aria-label="Casos de éxito"
            >
              {CASES.map((c, i) => (
                <article className={styles.caseCard} key={i}>
                  <span className={styles.caseEyebrow}>{c.eyebrow}</span>
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
                  <div className={styles.caseCardStats}>
                    {c.stats.map((s, j) => (
                      <div className={styles.caseStat} key={j}>
                        <span
                          className={`${styles.caseStatNumber} ${sys.statAccent}`}
                        >
                          <AnimatedStat value={s.value} />
                        </span>
                        <span className={styles.caseStatLabel}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.caseCarouselFooter}>
              <div
                className={styles.caseDots}
                role="tablist"
                aria-label="Navegar entre casos"
              >
                {CASES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeCase}
                    className={`${styles.caseDot} ${i === activeCase ? styles.caseDotActive : ""}`}
                    onClick={() => scrollToCase(i)}
                    aria-label={`Caso ${i + 1}`}
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
          <div className={styles.whyGrid} ref={whyTrackRef}>
            <div className={`${styles.whyCol} ${styles.whyColGeneric} reveal`}>
              <div className={styles.whyColHead}>
                <span className={styles.whyColBadge}>Software genérico</span>
              </div>
              {[
                "Te adaptas tú a la herramienta, no al revés",
                "Pagas por funciones que nunca vas a usar",
                "Soporte por tickets o foros en inglés",
                "6–12 meses para ver resultados reales",
                "Datos en silos sin conexión entre apps",
                "Precio que sube cada año sin avisarte",
              ].map((text, i) => (
                <div className={styles.whyRow} key={i}>
                  <span className={styles.whyIconNeg}>
                    <X size={13} strokeWidth={2.5} />
                  </span>
                  <span className={styles.whyRowText}>{text}</span>
                </div>
              ))}
            </div>
            <div className={`${styles.whyCol} ${styles.whyColOps} reveal`}>
              <div className={styles.whyColHead}>
                <span
                  className={`${styles.whyColBadge} ${styles.whyColBadgeOps}`}
                >
                  OpsPilot a medida
                </span>
              </div>
              {[
                "El sistema se adapta exactamente a cómo trabajas",
                "Solo pagas lo que tu negocio realmente necesita",
                "Acceso directo al equipo que construyó tu sistema",
                "Primeros resultados visibles en 4–6 semanas",
                "Todo integrado en un solo sistema centralizado",
                "Precio cerrado desde el día uno, sin sorpresas",
              ].map((text, i) => (
                <div className={styles.whyRow} key={i}>
                  <span className={styles.whyIconPos}>
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span className={styles.whyRowText}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MÉTODO ═══ */}
      <section className={styles.methodSection}>
        <div className={sys.container} ref={methodScrollRef}>
          <header className={`${sys.sectionHeader} reveal`}>
            <h2 className={sys.sectionTitle}>Así trabajamos contigo.</h2>
          </header>
          <div className={styles.processGrid} ref={processTrackRef}>
            <div className={`${styles.processStep} reveal`}>
              <div className={styles.processNumWrap}>
                <span className={styles.processNumLabel}>
                  <MessagesSquare size={24} strokeWidth={1.6} />
                </span>
                <span className={styles.processStepNum}>01</span>
              </div>
              <h3 className={styles.stepTitle}>Te escuchamos</h3>
              <p className={styles.stepText}>
                30 minutos para entender tu negocio a fondo.
              </p>
            </div>
            <div className={`${styles.processStep} reveal`}>
              <div className={styles.processNumWrap}>
                <span className={styles.processNumLabel}>
                  <Search size={24} strokeWidth={1.6} />
                </span>
                <span className={styles.processStepNum}>02</span>
              </div>
              <h3 className={styles.stepTitle}>Localizamos el problema</h3>
              <p className={styles.stepText}>
                Detectamos qué procesos te están frenando de verdad.
              </p>
            </div>
            <div className={`${styles.processStep} reveal`}>
              <div className={styles.processNumWrap}>
                <span className={styles.processNumLabel}>
                  <FileCheck size={24} strokeWidth={1.6} />
                </span>
                <span className={styles.processStepNum}>03</span>
              </div>
              <h3 className={styles.stepTitle}>Te proponemos algo concreto</h3>
              <p className={styles.stepText}>
                Plan claro, precio cerrado, plazos definidos desde el día uno.
              </p>
            </div>
            <div className={`${styles.processStep} reveal`}>
              <div className={styles.processNumWrap}>
                <span className={styles.processNumLabel}>
                  <Wrench size={24} strokeWidth={1.6} />
                </span>
                <span className={styles.processStepNum}>04</span>
              </div>
              <h3 className={styles.stepTitle}>Lo hacemos y nos quedamos</h3>
              <p className={styles.stepText}>
                Construimos contigo y seguimos ahí cuando nos necesites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className={sys.endCta}>
        <div className={sys.container}>
          <div className={sys.endCtaBlock} ref={ctaRef}>
            <h2 className={sys.endCtaTitle}>¿Hablamos?</h2>
            <p className={sys.endCtaSub}>
              30 minutos. Sin compromiso. Te decimos qué tiene sentido construir
              y qué no — sin venderte nada.
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
