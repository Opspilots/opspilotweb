import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { Button } from "../components/ui/Button";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useDragScroll } from "../hooks/useDragScroll";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCountUp } from "../hooks/useCountUp";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
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
import Aurora from "../components/common/Aurora";
import { TextLink } from "../components/common/TextLink";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, ScrambleTextPlugin, SplitText);

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
  const whyOpsRef = useRef<HTMLDivElement>(null);

  const problemRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const methodScrollRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const caseRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const whyRef = useScrollReveal<HTMLDivElement>({ stagger: true });
  const ctaRef = useScrollReveal<HTMLDivElement>();

  const prefersReducedMotion = usePrefersReducedMotion();

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
        // rises from below the mask (premium alternative to a plain fade).
        tl.from(`.${styles.heroTitle} .${styles.heroLineInner}`, {
          yPercent: 112,
          duration: 1.05,
          stagger: 0.11,
          ease: "power4.out",
        })
          .from(
            `.${styles.heroSubtitle}`,
            { opacity: 0, y: 18, duration: 0.7 },
            "-=0.65",
          )
          .from(
            `.${styles.ctaGroup} > *`,
            { opacity: 0, y: 14, duration: 0.55, stagger: 0.08 },
            "-=0.45",
          )
          // Radar mark: solid strokes (brackets, axes, ticks, plain rings)
          // draw themselves in via DrawSVG…
          .from(
            `.${styles.heroMark} line, .${styles.heroMark} path, .${styles.heroMark} [data-draw], .${styles.markCoreRing}`,
            {
              drawSVG: "0%",
              duration: 1.1,
              stagger: 0.035,
              ease: "power2.inOut",
            },
            "-=0.9",
          )
          // …while dashed rings fade in (DrawSVG would overwrite their
          // decorative dasharray) and the SMIL-animated groups fade only
          // (an inline GSAP transform would freeze <animateTransform>).
          .from(
            `.${styles.markRing1}, .${styles.markRing2}, .${styles.heroMark} [data-ring]`,
            {
              opacity: 0,
              duration: 1.2,
              stagger: 0.12,
              ease: "power2.out",
            },
            "<",
          )
          .from(
            `.${styles.heroMark} g, .${styles.heroMark} [data-fade]`,
            { opacity: 0, duration: 1.0, stagger: 0.1, ease: "power2.out" },
            "<+0.3",
          )
          .from(
            `.${styles.markCenterDot}`,
            { scale: 0, transformOrigin: "50% 50%", duration: 0.5 },
            "-=0.7",
          );

        // Scroll-out: hero content sinks and dims as the section leaves,
        // giving the page a depth "curtain" feel on the way to Problema.
        gsap.to(`.${styles.heroContent}`, {
          yPercent: 14,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "42% top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
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
            y: 14,
            scale: 0.9,
            duration: 0.55,
            stagger: 0.07,
            ease: "power2.out",
          });
        },
      });
    }, caseRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = whyOpsRef.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  // Section-level scroll choreography (Problema / Por qué / Método / CTA).
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

      // ── MÉTODO: step numbers scramble into place (terminal feel,
      //    same family as the hero radar aesthetic).
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

        // ── POR QUÉ: scrub narrative — as you scroll through, the
        //    generic column recedes while the OpsPilot column's glow
        //    intensifies. Starts well after the reveal animation is done.
        ctxs.push(
          gsap.context(() => {
            const scrubBase = {
              trigger: `.${styles.whyGrid}`,
              start: "top 42%",
              end: "bottom 72%",
              scrub: 0.6,
            };
            gsap.to(`.${styles.whyColGeneric}`, {
              opacity: 0.55,
              scale: 0.985,
              transformOrigin: "50% 0%",
              ease: "none",
              scrollTrigger: { ...scrubBase },
            });
            gsap.to(`.${styles.whyColOps}`, {
              boxShadow: "0 0 84px -12px rgba(57, 206, 134, 0.3)",
              borderColor: "rgba(57, 206, 134, 0.55)",
              ease: "none",
              scrollTrigger: { ...scrubBase },
            });
          }, whyRef),
        );

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
                  backgroundColor: "rgba(57, 206, 134, 0.3)",
                  boxShadow: "0 8px 28px -8px rgba(57, 206, 134, 0.35)",
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
        <div className={styles.auroraBackground}>
          <Aurora
            colorStops={["#0a1118", "#1b998b", "#39ce86"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.6}
          />
        </div>
        <div className={styles.heroVeil} />
        <div className={styles.heroNoise} aria-hidden="true" />

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
            {/* Anotación inline — solo visible en móvil (<1024px) */}
            <p className={styles.heroMobileAnnotation} aria-hidden="true">
              <span className={styles.heroMobileAnnotationNum}>80%</span>
              del proceso automatizado, sin tocar una hoja de cálculo.
            </p>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <svg
              className={styles.heroMark}
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner brackets */}
              <path
                d="M 28 10 L 10 10 L 10 28"
                stroke="rgba(57,206,134,0.2)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <path
                d="M 372 10 L 390 10 L 390 28"
                stroke="rgba(57,206,134,0.2)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <path
                d="M 10 372 L 10 390 L 28 390"
                stroke="rgba(57,206,134,0.2)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <path
                d="M 390 372 L 390 390 L 372 390"
                stroke="rgba(57,206,134,0.2)"
                strokeWidth="1"
                className={styles.markDecor}
              />

              {/* Outer sparse ring */}
              <circle
                cx="200"
                cy="200"
                r="175"
                stroke="rgba(57,206,134,0.09)"
                strokeWidth="1"
                strokeDasharray="1 13"
                className={`${styles.markRing1} ${styles.markDecor}`}
              />

              {/* Structural ring */}
              <circle
                cx="200"
                cy="200"
                r="140"
                stroke="rgba(57,206,134,0.18)"
                strokeWidth="1"
                strokeDasharray="26 14 6 14"
                className={`${styles.markRing2} ${styles.markDecor}`}
              />

              {/* Main precision ring */}
              <circle
                data-ring
                cx="200"
                cy="200"
                r="102"
                stroke="rgba(57,206,134,0.28)"
                strokeWidth="1.5"
                strokeDasharray="50 10"
              />

              {/* Inner ring */}
              <circle
                data-draw
                cx="200"
                cy="200"
                r="58"
                stroke="rgba(57,206,134,0.18)"
                strokeWidth="1"
              />

              {/* Core ring */}
              <circle
                cx="200"
                cy="200"
                r="20"
                stroke="rgba(57,206,134,0.44)"
                strokeWidth="1.5"
                className={styles.markCoreRing}
              />

              {/* Sonar pulse */}
              <circle
                data-fade
                cx="200"
                cy="200"
                r="20"
                stroke="rgba(57,206,134,0.28)"
                strokeWidth="1"
                fill="none"
                className={styles.markDecor}
              >
                {!prefersReducedMotion && (
                  <>
                    <animate
                      attributeName="r"
                      from="20"
                      to="42"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      from="0.28"
                      to="0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>

              {/* N/S/E/W axis lines */}
              <line
                x1="200"
                y1="180"
                x2="200"
                y2="142"
                stroke="rgba(57,206,134,0.28)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <line
                x1="200"
                y1="220"
                x2="200"
                y2="258"
                stroke="rgba(57,206,134,0.28)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <line
                x1="180"
                y1="200"
                x2="142"
                y2="200"
                stroke="rgba(57,206,134,0.28)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <line
                x1="220"
                y1="200"
                x2="258"
                y2="200"
                stroke="rgba(57,206,134,0.28)"
                strokeWidth="1"
                className={styles.markDecor}
              />

              {/* 45° diagonal spokes */}
              <line
                x1="241"
                y1="159"
                x2="272"
                y2="128"
                stroke="rgba(57,206,134,0.14)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <line
                x1="159"
                y1="159"
                x2="128"
                y2="128"
                stroke="rgba(57,206,134,0.14)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <line
                x1="241"
                y1="241"
                x2="272"
                y2="272"
                stroke="rgba(57,206,134,0.14)"
                strokeWidth="1"
                className={styles.markDecor}
              />
              <line
                x1="159"
                y1="241"
                x2="128"
                y2="272"
                stroke="rgba(57,206,134,0.14)"
                strokeWidth="1"
                className={styles.markDecor}
              />

              {/* Cardinal ticks on r=140 ring */}
              <line
                x1="200"
                y1="62"
                x2="200"
                y2="50"
                stroke="rgba(57,206,134,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                className={styles.markDecor}
              />
              <line
                x1="200"
                y1="338"
                x2="200"
                y2="350"
                stroke="rgba(57,206,134,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                className={styles.markDecor}
              />
              <line
                x1="62"
                y1="200"
                x2="50"
                y2="200"
                stroke="rgba(57,206,134,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                className={styles.markDecor}
              />
              <line
                x1="338"
                y1="200"
                x2="350"
                y2="200"
                stroke="rgba(57,206,134,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                className={styles.markDecor}
              />

              {/* 45° ticks on r=140 ring */}
              <line
                x1="293"
                y1="107"
                x2="299"
                y2="101"
                stroke="rgba(57,206,134,0.22)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={styles.markDecor}
              />
              <line
                x1="107"
                y1="107"
                x2="101"
                y2="101"
                stroke="rgba(57,206,134,0.22)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={styles.markDecor}
              />
              <line
                x1="293"
                y1="293"
                x2="299"
                y2="299"
                stroke="rgba(57,206,134,0.22)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={styles.markDecor}
              />
              <line
                x1="107"
                y1="293"
                x2="101"
                y2="299"
                stroke="rgba(57,206,134,0.22)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={styles.markDecor}
              />

              {/* Scanner line — rotates */}
              <g className={styles.markDecor}>
                {!prefersReducedMotion && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 200 200"
                    to="360 200 200"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                )}
                <line
                  x1="200"
                  y1="200"
                  x2="200"
                  y2="30"
                  stroke="rgba(57,206,134,0.38)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="200"
                  cy="30"
                  r="3"
                  fill="none"
                  stroke="rgba(57,206,134,0.65)"
                  strokeWidth="1.5"
                />
              </g>

              {/* Orbiting element at r=102 — CW */}
              <g className={styles.markDecor}>
                {!prefersReducedMotion && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="60 200 200"
                    to="420 200 200"
                    dur="11s"
                    repeatCount="indefinite"
                  />
                )}
                <circle
                  cx="302"
                  cy="200"
                  r="5.5"
                  fill="none"
                  stroke="rgba(57,206,134,0.6)"
                  strokeWidth="1.5"
                />
                <circle cx="302" cy="200" r="2" fill="rgba(57,206,134,0.5)" />
              </g>

              {/* Orbiting dot at r=140 — CCW */}
              <g className={styles.markDecor}>
                {!prefersReducedMotion && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="200 200 200"
                    to="-160 200 200"
                    dur="19s"
                    repeatCount="indefinite"
                  />
                )}
                <circle
                  cx="340"
                  cy="200"
                  r="3.5"
                  fill="rgba(57,206,134,0.42)"
                />
              </g>

              {/* Orbiting dot at r=175 — slow CW */}
              <g className={styles.markDecor}>
                {!prefersReducedMotion && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="290 200 200"
                    to="650 200 200"
                    dur="32s"
                    repeatCount="indefinite"
                  />
                )}
                <circle cx="375" cy="200" r="2.5" fill="rgba(57,206,134,0.3)" />
              </g>

              {/* Center dot */}
              <circle
                cx="200"
                cy="200"
                r="4"
                fill="rgba(57,206,134,0.88)"
                className={styles.markCenterDot}
              />
            </svg>
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
            <div
              className={`${styles.whyCol} ${styles.whyColOps} reveal`}
              ref={whyOpsRef}
            >
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
