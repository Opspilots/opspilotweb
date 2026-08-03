import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextLink } from '../components/common/TextLink';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useDragScroll } from '../hooks/useDragScroll';
import { PageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import { buildBreadcrumb, buildFAQ } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import sys from '../styles/page-system.module.css';
import styles from './Soluciones.module.css';

import type { Sector } from '../data';
import { SECTORS } from '../data';
import { ICONS } from '../components/icons/registry';

// Guard SSR: en build (node) no hay `window`; registrar el plugin a nivel de
// módulo reventaría el prerender. En cliente se registra con normalidad —
// mismo guard que useLenis.ts, que también registra este plugin (registrar
// dos veces es un no-op seguro en GSAP).
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// CTA del panel de detalle: idéntico en los 6 sectores, así que es
// presentación (no dato) — se hardcodea aquí en vez de repetirse en src/data.
const SECTOR_CTA_LABEL = 'Cuéntanos tu caso';

// Carrusel de páginas DENTRO del panel de detalle — independiente de la
// selección de sector (ver comentario junto a `page`/`selected` más abajo).
// 3 páginas fijas por sector: overview (ya existía) + processSteps + faq,
// ambos nuevos en el dato (ver src/data/types.ts, Sector.processSteps/faq).
const PANEL_PAGE_COUNT = 3;
const PANEL_PAGE_LABELS = ['Resumen', 'Cómo funciona', 'Preguntas frecuentes'] as const;

// FAQPage único para /soluciones, agregando los 21 pares (7 sectores × 3) de
// `Sector.faq`. Vive a nivel de módulo, no dentro del componente: se deriva
// EXCLUSIVAMENTE de `SECTORS`, que es un dato estático e inmutable, así que
// recalcularlo en cada render sería trabajo puro a cambio de nada.
//
// Contexto: hasta ahora esta página solo emitía `BreadcrumbList`. No podía
// emitir FAQPage aunque quisiéramos, porque el copy de la FAQ NO llegaba al
// HTML prerenderizado — en el SSG `page` siempre vale 0 y AnimatePresence solo
// montaba esa página, así que las 21 preguntas existían en el dato pero no en
// el documento. Google exige que el marcado FAQPage se corresponda con
// contenido VISIBLE en la página; marcar lo que no está es motivo de acción
// manual. El deck de 3 páginas (ver `.pageDeck` en el JSX más abajo) es lo que
// hace legítimo este bloque: ahora las 3 páginas de los 7 sectores están en el
// HTML y son alcanzables con las flechas/dots de `.pageNav`.
//
// Las 21 preguntas son literalmente únicas entre sí (verificado sobre
// src/data/sectors.ts), así que no hace falta desambiguar anteponiendo el
// sector — y de hecho NO debe hacerse: alteraría el texto respecto al que se
// pinta en el `<dt>`, que es justo lo que Google contrasta.
const SECTOR_FAQ_SCHEMA = buildFAQ(
    SECTORS.flatMap((s) => s.faq.map(({ question, answer }) => ({ q: question, a: answer }))),
);

/** Contenido de una de las 3 páginas del panel — extraído a parte para que el
 * `SECTORS.map` de más abajo no crezca un nivel más de anidación. Recibe el
 * sector activo y el índice de página (0 overview / 1 cómo funciona / 2 FAQ). */
const SectorPageContent: React.FC<{ sector: Sector; page: number }> = ({ sector, page }) => {
    if (page === 1) {
        return (
            <div className={styles.pageBody}>
                <h3 className={styles.pageHeading}>Cómo funciona</h3>
                <ol className={styles.stepsList}>
                    {sector.processSteps.map((step, idx) => (
                        <li key={step.title} className={styles.stepItem}>
                            <span className={styles.stepNumber} aria-hidden="true">{idx + 1}</span>
                            <div className={styles.stepText}>
                                <p className={styles.stepTitle}>{step.title}</p>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        );
    }

    if (page === 2) {
        return (
            <div className={styles.pageBody}>
                <h3 className={styles.pageHeading}>Preguntas frecuentes</h3>
                <dl className={styles.faqList}>
                    {sector.faq.map((item) => (
                        <div key={item.question} className={styles.faqItem}>
                            <dt className={styles.faqQuestion}>{item.question}</dt>
                            <dd className={styles.faqAnswer}>{item.answer}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        );
    }

    return (
        <div className={styles.pageBody}>
            <h2 className={styles.panelTitle}>{sector.title}</h2>

            <p className={styles.panelWho}>
                <span className={styles.whoLabel}>Para</span> {sector.who}
            </p>

            <p className={styles.panelSolution}>{sector.solution}</p>

            <ul className={styles.benefitsList}>
                {sector.benefits.map((b) => (
                    <li key={b}>
                        <span className={styles.check} aria-hidden="true">
                            <Check size={12} strokeWidth={2.5} />
                        </span>
                        {b}
                    </li>
                ))}
            </ul>

            {sector.relatedResource && (
                <TextLink
                    to={`${ROUTES.recursos}/${sector.relatedResource.slug}`}
                    tone="muted"
                    size="sm"
                    className={styles.panelRelated}
                >
                    {sector.relatedResource.label}
                </TextLink>
            )}
        </div>
    );
};

export const Soluciones: React.FC = () => {
    const seoProps = {
        title: 'Software por sector: asesorías, energía y obra · OpsPilot',
        description: 'Software para asesorías, CRM para comercializadoras de energía, gestión para reformas y agencias, y digitalización de PYMEs. Encaja con cómo trabajas.',
        canonical: 'https://opspilot.es/soluciones/',
    };

    const heroRef = useHeroReveal<HTMLDivElement>();
    const listRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    const prefersReducedMotion = usePrefersReducedMotion();
    // Deep-link de ENTRADA por sector vía hash de URL (p. ej. `/soluciones#agencias`
    // desde un cross-link de /recursos) — solo lee el hash al MONTAR, nunca lo
    // escribe de vuelta cuando el usuario cambia de sector a mano (no es
    // bidireccional, ver instrucción explícita). `window` no existe en el
    // prerender SSG (node): ahí el inicializador devuelve 0 sin más, así que el
    // HTML estático siempre muestra el sector 0 — el ajuste al hash ocurre en
    // cliente, tras hidratar, igual que cualquier otro `useState` derivado de
    // `window`. Lazy initializer (función a `useState`, no `useState(getInitial())`)
    // para no recalcular el hash en cada render, solo en el mount.
    const [selected, setSelected] = useState(() => {
        if (typeof window === 'undefined') return 0;
        const hash = window.location.hash.slice(1);
        if (!hash) return 0;
        const idx = SECTORS.findIndex((s) => s.id === hash);
        return idx === -1 ? 0 : idx;
    });
    // Sector activo — leído tanto por el hero (titular reactivo, ver más
    // abajo) como por el explorador. Un solo `const` en vez de `SECTORS[selected]`
    // repetido evita desincronías si algún día cambia la fuente de `selected`.
    const activeSector = SECTORS[selected];
    // Página activa DENTRO del panel del sector seleccionado (0 overview / 1
    // cómo funciona / 2 FAQ) — completamente independiente de `selected`
    // salvo por el reset de abajo.
    //
    // Aquí vivía también un `pageDirection` (1 avanza / -1 retrocede / 0
    // sentinel "sin slide") que alimentaba las variants de AnimatePresence:
    // con solo la página activa montada, la única forma de saber hacia qué
    // lado deslizar era recordar el sentido del último salto. El deck de 3
    // páginas (ver JSX) ya no lo necesita — las 3 están montadas a la vez, así
    // que la posición de cada una se deduce de su DISTANCIA a `page`
    // (`idx - page`), que es un dato geométrico y no un historial. Estado
    // menos, y una fuente de desincronía menos.
    const [page, setPage] = useState(0);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const ledgerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const ledgerScrollRaf = useRef(0);
    // ≤767px: `.ledger` (fila compacta) y `.panelWrap` (detalle completo) se
    // fusionan en UNA sola superficie tipo hoja/modal que ES el carrusel —
    // ver comentario junto a `.panelWrap` en Soluciones.module.css. `panelRefs`
    // (uno por sector, igual que `tabRefs`) y `panelWrapScrollRaf` son el
    // equivalente de `tabRefs`/`ledgerScrollRaf` pero para ese carrusel fusionado.
    const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
    const panelWrapRef = useRef<HTMLDivElement>(null);
    const panelWrapScrollRaf = useRef(0);
    // Los dos efectos de "scrollIntoView de la fila/tarjeta activa" (uno para
    // `.ledger`, uno para `.panelWrap`, ver más abajo) no deben ejecutar su
    // scrollIntoView en el MOUNT inicial — con el hero ahora a tamaño
    // completo (ver Task A / `.solHero`), el explorador arranca por debajo
    // del pliegue en mobile, así que un `scrollIntoView` disparado en el
    // primer render (selected=0, sin interacción del usuario todavía) hacía
    // que la PÁGINA ENTERA saltara hacia abajo al cargar, saltándose el hero
    // por completo — regresión real, verificada con Playwright. Cada efecto
    // usa su propio flag (no uno compartido): comparten el mismo commit de
    // React, así que un flag único quedaría "consumido" por el primero de
    // los dos y el segundo igual dispararía el salto.
    const ledgerSyncMounted = useRef(false);
    const panelSyncMounted = useRef(false);

    // Cambiar de sector (clic/tap/teclado en las filas O scroll-jack, ambos
    // pasan por `setSelected`) siempre vuelve el panel a su página 1 — nunca
    // se hereda la página en la que se había quedado el sector anterior (ver
    // instrucción explícita: aterrizar en la FAQ de un sector nuevo sin
    // contexto confunde).
    useEffect(() => {
        setPage(0);
    }, [selected]);

    // Navegación entre páginas del panel — clamp a [0, N-1], no-op si ya
    // estás en el destino (evita un re-render inútil).
    const goToPage = (target: number) => {
        const next = Math.max(0, Math.min(PANEL_PAGE_COUNT - 1, target));
        if (next === page) return;
        setPage(next);
    };

    // Flechas de teclado mientras el panel de detalle tiene foco (tabIndex=0
    // solo en el panel activo — los otros 6 son `inert` y nunca reciben este
    // evento). Distinto del ArrowLeft/Right de `handleTabKeyDown`: ese vive en
    // los botones de fila (`role="tab"`) y mueve `selected`; este vive en el
    // panel y mueve `page` — focos distintos, sin colisión.
    const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToPage(page + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPage(page - 1);
        }
    };

    // Mouse drag-to-scroll en el carril de sectores (mismo patrón que los
    // carriles horizontales de Home.tsx). Solo actúa sobre puntero tipo
    // mouse — no interfiere con el swipe táctil nativo del carrusel móvil.
    useDragScroll(ledgerRef);

    // Sincroniza `selected` (y por tanto el hero, "Software para X") con la
    // tarjeta que queda snapeada al centro tras un swipe en el carrusel
    // ≤767px (ver Soluciones.module.css) — mismo patrón que
    // `handleCaseScroll`/`getCaseScrollUnit` del carrusel de casos en
    // Home.tsx. Sin esto, `selected` solo cambiaba por tap (`onClick` de
    // cada fila) y el hero se quedaba mostrando el sector anterior mientras
    // el usuario ya había swipeado a otra tarjeta — hero y carrusel se leían
    // como dos tracks independientes en vez de una sola unidad. Gateado a
    // ≤767px vía matchMedia: por encima de ese ancho `.ledger` es el carril
    // de pills de ancho variable (768–1023px) o la lista vertical de
    // desktop, donde no hay tarjetas de ancho uniforme y este cálculo de
    // índice por `scrollLeft / unit` no aplicaría.
    const handleLedgerScroll = useCallback(() => {
        cancelAnimationFrame(ledgerScrollRaf.current);
        ledgerScrollRaf.current = requestAnimationFrame(() => {
            if (!window.matchMedia('(max-width: 767px)').matches) return;
            const ledger = ledgerRef.current;
            if (!ledger) return;
            const card = ledger.children[0] as HTMLElement | null;
            if (!card) return;
            const gap = parseFloat(window.getComputedStyle(ledger).gap) || 0;
            const unit = card.offsetWidth + gap;
            if (!unit) return;
            const idx = Math.round(ledger.scrollLeft / unit);
            const clamped = Math.max(0, Math.min(idx, SECTORS.length - 1));
            setSelected((prev) => (prev === clamped ? prev : clamped));
        });
    }, []);

    useEffect(() => () => cancelAnimationFrame(ledgerScrollRaf.current), []);

    // Mismo mecanismo que `handleLedgerScroll` de arriba, pero para el
    // carrusel fusionado ≤767px (`.panelWrap` como carril scroll-snap de
    // sectores, ver Soluciones.module.css) — a esos anchos `.ledger` está
    // oculto (`display: none`) y es `.panelWrap` quien hace de carril
    // horizontal, así que necesita su propio listener de scroll→`selected`
    // en vez de reutilizar `ledgerRef` (que ya no existe visualmente en el
    // DOM en ese rango). Gateado igual, ≤767px vía matchMedia: por encima de
    // ese ancho `.panelWrap` vuelve a ser el panel de detalle absoluto de
    // siempre (768–1023/desktop), donde este cálculo de índice por
    // `scrollLeft / unit` no aplicaría.
    //
    // `panelRefs.current[0]` en vez de `wrap.children[0]` (que sí funciona
    // en `handleLedgerScroll`): el primer hijo REAL de `.panelWrap` es
    // `.panelBar` (el `<span>` decorativo del hairline, ver JSX más abajo),
    // no una tarjeta — con `wrap.children[0]` la unidad de ancho se calculaba
    // sobre ese span (0px en ≤767px, donde `.panelBar` es `display: none`),
    // dando un `unit` erróneo (solo el gap) y un índice sistemáticamente mal
    // calculado. `panelRefs` (uno por sector, ver más arriba) apunta siempre
    // a una tarjeta real.
    const handlePanelWrapScroll = useCallback(() => {
        cancelAnimationFrame(panelWrapScrollRaf.current);
        panelWrapScrollRaf.current = requestAnimationFrame(() => {
            if (!window.matchMedia('(max-width: 767px)').matches) return;
            const wrap = panelWrapRef.current;
            if (!wrap) return;
            const card = panelRefs.current[0];
            if (!card) return;
            const gap = parseFloat(window.getComputedStyle(wrap).gap) || 0;
            const unit = card.offsetWidth + gap;
            if (!unit) return;
            const idx = Math.round(wrap.scrollLeft / unit);
            const clamped = Math.max(0, Math.min(idx, SECTORS.length - 1));
            setSelected((prev) => (prev === clamped ? prev : clamped));
        });
    }, []);

    useEffect(() => () => cancelAnimationFrame(panelWrapScrollRaf.current), []);

    // Selección de sector — dos mecanismos que conviven:
    // 1. Clic/tap/teclado en las filas (ver onClick/onKeyDown más abajo) —
    //    funciona en TODOS los breakpoints, es el único mecanismo en
    //    <1024px y también el fallback en desktop con reduced-motion.
    // 2. Scroll-jack en desktop (≥1024px) sin reduced-motion (ver useEffect
    //    justo abajo): el explorador se queda sticky (`.solViewport`) dentro
    //    de un track alto (`.solTrack`) y el scroll de página avanza
    //    `selected` por los 7 sectores. Gated en el propio matchMedia de
    //    GSAP a `prefers-reduced-motion: no-preference` — quien pide reduced
    //    motion nunca activa el pin/scroll-jack, solo clic/tap/teclado.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const track = trackRef.current;
            if (!track) return;
            const st = ScrollTrigger.create({
                trigger: track,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    const idx = Math.min(
                        SECTORS.length - 1,
                        Math.floor(self.progress * SECTORS.length),
                    );
                    setSelected((prev) => (prev === idx ? prev : idx));
                },
            });
            return () => st.kill();
        });

        // El alto real del track depende de fuentes/imágenes que pueden
        // terminar de cargar después del primer cálculo de ScrollTrigger —
        // sin este refresh, `end: 'bottom bottom'` puede quedar corto y el
        // último tramo de scroll no llega a seleccionar el último sector.
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh);
        const rid = window.setTimeout(refresh, 400);

        return () => {
            window.removeEventListener('load', refresh);
            window.clearTimeout(rid);
            mm.revert();
        };
    }, []);

    const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const count = SECTORS.length;
        let nextIndex: number | null = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIndex = (index + 1) % count;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nextIndex = (index - 1 + count) % count;
        else if (e.key === 'Home') nextIndex = 0;
        else if (e.key === 'End') nextIndex = count - 1;

        if (nextIndex !== null) {
            e.preventDefault();
            setSelected(nextIndex);
            tabRefs.current[nextIndex]?.focus();
        }
    };

    // Mantiene la fila activa a la vista dentro del carril de tabs que scrollea
    // en horizontal en <1024px (móvil/tablet). En desktop la lista es vertical y
    // esto no desplaza nada perceptible. Se salta el MOUNT inicial (ver
    // `ledgerSyncMounted` más arriba): con el hero a tamaño completo el
    // carril puede arrancar por debajo del pliegue en mobile/tablet
    // estrechos, y un `scrollIntoView` en el primer render (sin interacción
    // del usuario) desplazaría la PÁGINA para traerlo a la vista, saltándose
    // el hero — el carril ya está correctamente en `scrollLeft: 0` por
    // defecto, así que en el mount no hace falta ningún ajuste.
    useEffect(() => {
        if (!ledgerSyncMounted.current) {
            ledgerSyncMounted.current = true;
            return;
        }
        tabRefs.current[selected]?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    }, [selected, prefersReducedMotion]);

    // Mismo patrón que el efecto de arriba, pero para el slide activo del
    // carrusel fusionado ≤767px (`.panelWrap`): cuando `selected` cambia por
    // un mecanismo que NO es el propio swipe (tap en un `.sectorDot`, p. ej.
    // — el swipe ya deja el carril en la posición correcta por sí mismo vía
    // `handlePanelWrapScroll`), hay que desplazar `.panelWrap` para que el
    // panel del sector nuevo quede snapeado y visible. Gateado a ≤767px:
    // por encima de ese ancho `.panelWrap` no es un carril con scroll propio
    // (es el panel de detalle absoluto de siempre) y `scrollIntoView` ahí
    // podría desplazar la PÁGINA en vez de un contenedor interno. Mismo
    // salto de MOUNT inicial que el efecto de `.ledger` de arriba, y por el
    // mismo motivo (regresión verificada con Playwright: sin este guard, la
    // página cargaba con el hero ya scrolleado fuera de vista).
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.matchMedia('(max-width: 767px)').matches) return;
        if (!panelSyncMounted.current) {
            panelSyncMounted.current = true;
            return;
        }
        panelRefs.current[selected]?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    }, [selected, prefersReducedMotion]);

    return (
        <div className={sys.page}>
            <PageSEO {...seoProps} />
            <StructuredData
                data={buildBreadcrumb([
                    { name: 'Inicio', url: 'https://opspilot.es/' },
                    { name: 'Soluciones', url: 'https://opspilot.es/soluciones/' },
                ])}
            />
            {/* FAQPage con las 21 preguntas de los 7 sectores (ver
                `SECTOR_FAQ_SCHEMA` arriba). Va en un `<StructuredData>` aparte
                del breadcrumb a propósito: cada bloque es un JSON-LD
                independiente, no un @graph, así que añadir tipos nuevos no
                obliga a tocar los que ya funcionan. */}
            <StructuredData data={SECTOR_FAQ_SCHEMA} />
            {/* Hero — flujo normal, FUERA de `.solViewport`/`.solTrack`. Antes
                vivía pineado dentro del scroll-jack junto al explorador (ver
                decisión archivada en Soluciones.module.css junto a
                `.solHero`); el usuario pidió explícitamente que el
                scroll-jack (ver useEffect de ScrollTrigger más abajo) siga
                aplicando SOLO al explorador de sectores, no al hero. Vuelve a
                ser un `<section>` propio (era un `<div>` mientras vivía
                dentro del viewport pineado, sin aportar landmark) — mismo
                patrón que el hero de Casos/Contacto/Recursos. */}
            <section className={`${sys.pageHero} ${styles.solHero}`}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        {/* Titular reactivo al sector activo — el lead-in ("Software
                            para") queda fijo, solo el nombre del sector (`activeSector.label`)
                            cambia, con el mismo crossfade+slide (opacity/y, mismo timing/
                            easing que el crossfade de icono `.rowIconMotion`/
                            `.panelIconMotion` y la transición de panel) al cambiar
                            `selected` — por clic o por scroll-jack, da igual, ambos pasan
                            por el mismo `setSelected`. Gated tras `prefersReducedMotion`
                            como el resto del componente: con reduced motion el nombre
                            también cambia, solo que sin animar. */}
                        <h1 className={`${sys.pageHeroTitle} ${styles.heroTitle} reveal`}>
                            Software para{' '}
                            {prefersReducedMotion ? (
                                <em className={sys.pageHeroAccent}>{activeSector.label}</em>
                            ) : (
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.em
                                        key={activeSector.id}
                                        className={sys.pageHeroAccent}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        {activeSector.label}
                                    </motion.em>
                                </AnimatePresence>
                            )}
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} ${styles.heroSubtitle} reveal`}>
                            Conocemos de cerca la operativa de estos sectores. Elige el tuyo y
                            te decimos exactamente qué podemos construir para ti.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sectores — explorador de dos paneles (lista + detalle). Selección
                por clic/tap/teclado en todos los breakpoints, más scroll-jack
                en desktop sin reduced-motion (ver comentario junto a
                `selected`/al useEffect de ScrollTrigger más arriba).
                `.solTrack`/`.solViewport` son la pareja track alto + sticky
                que hace posible el scroll-jack (ver Soluciones.module.css);
                el hero YA NO vive aquí dentro (ver arriba), así que el pin
                ahora afecta únicamente al explorador. Fuera de ese matchMedia
                (móvil/tablet/reduced-motion) ambos colapsan a su alto de
                contenido normal, sin efecto visible. */}
            <section className={`${sys.section} ${styles.explorerSection}`}>
                <div className={styles.solTrack} ref={trackRef}>
                    <div className={styles.solViewport}>
                        <div className={sys.container}>
                            <div className={styles.explorer} ref={listRef} data-lenis-prevent>
                                {/* Columna izquierda — lista de sectores seleccionables (nav,
                                    no tabla: sin fila de cabecera, ver Soluciones.module.css).
                                    Oculta (`display: none`) en ≤767px: ahí su trabajo de
                                    "carrusel de sectores" lo hace `.panelWrap` de más abajo,
                                    fusionado con el detalle en una sola superficie — ver
                                    comentario junto a `.panelWrap`. Se deja montada (no
                                    condicionada en JS) porque sigue siendo la lista/carril real
                                    en 768–1023px y desktop, sin cambios ahí. */}
                                <div
                                    className={`${styles.ledger} reveal`}
                                    role="tablist"
                                    aria-label="Sectores"
                                    aria-orientation="vertical"
                                    ref={ledgerRef}
                                    onScroll={handleLedgerScroll}
                                >
                                    {SECTORS.map((s, i) => {
                                        const RowIcon = ICONS[s.iconKey];
                                        return (
                                            <button
                                                key={s.id}
                                                ref={(el) => { tabRefs.current[i] = el; }}
                                                type="button"
                                                role="tab"
                                                id={`sector-tab-${i}`}
                                                aria-selected={i === selected}
                                                aria-controls={`sector-panel-${i}`}
                                                tabIndex={i === selected ? 0 : -1}
                                                className={`${styles.row} ${i === selected ? styles.rowActive : ''}`}
                                                onClick={() => setSelected(i)}
                                                onKeyDown={(e) => handleTabKeyDown(e, i)}
                                            >
                                                <span className={styles.rowIcon} aria-hidden="true">
                                                    {prefersReducedMotion ? (
                                                        <RowIcon size={22} strokeWidth={1.6} />
                                                    ) : (
                                                        // Crossfade+scale al activarse/desactivarse la fila — la
                                                        // key cambia con el estado activo (no con iconKey, que es
                                                        // fijo por fila) para que AnimatePresence anime el "pop"
                                                        // justo cuando esta fila pasa a ser la seleccionada.
                                                        <AnimatePresence mode="wait" initial={false}>
                                                            <motion.span
                                                                key={i === selected ? 'active' : 'inactive'}
                                                                className={styles.rowIconMotion}
                                                                initial={{ opacity: 0, scale: 0.85 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.85 }}
                                                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                                            >
                                                                <RowIcon size={22} strokeWidth={1.6} />
                                                            </motion.span>
                                                        </AnimatePresence>
                                                    )}
                                                </span>
                                                {/* rowDesc (s.who) — hoy no se pinta en ningún breakpoint
                                                    (queda `display: none` también en ≤767px, ver
                                                    Soluciones.module.css: ahí ahora manda `.panelWrap`, no
                                                    `.ledger`). Se deja el markup/dato en vez de borrarlo: es
                                                    barato de mantener y sirve de fallback textual si `.row`
                                                    volviera a mostrarse en algún breakpoint futuro. */}
                                                <span className={styles.rowText}>
                                                    <span className={styles.rowLabel}>{s.label}</span>
                                                    <span className={styles.rowDesc}>{s.who}</span>
                                                </span>
                                                <ArrowRight size={15} strokeWidth={2} className={styles.rowArrow} aria-hidden="true" />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Indicadores de posición del carrusel de sectores en móvil
                                    (≤767px, ver .sectorDots en Soluciones.module.css) — mismo
                                    patrón que .caseDots del carrusel de casos en Home.tsx.
                                    Resuelven el gap de affordance que hizo abandonar el carril
                                    horizontal anterior: de un vistazo se ve CUÁNTOS sectores hay
                                    y CUÁL está activo, algo que ni el "peek" del borde ni el fade
                                    comunican por sí solos. Son botones reales (no aria-hidden):
                                    navegación adicional legítima, no decoración pura. Viven en el
                                    DOM entre `.ledger` y `.panelWrap` (así son hermanos directos de
                                    ambos, sin envoltorio extra) pero en ≤767px la posición VISUAL
                                    queda por debajo del carrusel fusionado vía `order` en CSS (ver
                                    Soluciones.module.css): ahora que `.ledger` está oculto ahí, ya
                                    no hace falta un role="tab"/"tablist" propio para no duplicar
                                    el de `.ledger` — a esos anchos `.ledger` no expone ningún
                                    tablist (display:none lo saca del árbol de accesibilidad), así
                                    que estos dots son la única superficie de "ir directo a X sector"
                                    además del propio swipe. En 768–1023px/desktop quedan en el DOM
                                    pero display:none, así que no ocupan layout ni orden de tab. */}
                                <div className={styles.sectorDots}>
                                    {SECTORS.map((s, i) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            className={`${styles.sectorDot} ${i === selected ? styles.sectorDotActive : ''}`}
                                            aria-label={`Ir a ${s.label}`}
                                            aria-current={i === selected ? 'true' : undefined}
                                            onClick={() => setSelected(i)}
                                        />
                                    ))}
                                </div>

                                {/* Columna derecha — panel de detalle del sector activo.
                                    ≥768px: comportamiento sin cambios — los 7 paneles se
                                    superponen absolutos (`.panelHidden`), solo el activo en
                                    flujo, tal como antes.
                                    ≤767px: `.panelWrap` deja de ser un panel único y pasa a SER
                                    el carrusel de sectores (fusión pedida de `.ledger` + panel de
                                    detalle en una sola superficie tipo hoja/modal — ver
                                    Soluciones.module.css): los 7 `.panel` quedan en flujo,
                                    unos junto a otros, en un carril horizontal con scroll-snap
                                    (mismo mecanismo que tenía `.ledger`, adaptado aquí vía
                                    `panelWrapRef`/`handlePanelWrapScroll` en vez de
                                    `ledgerRef`/`handleLedgerScroll`). `.ledger` en sí queda oculto
                                    a ese ancho (ver comentario junto a `.ledger` más arriba); el
                                    fallback de selección por tap sigue siendo el mismo patrón
                                    (`onClick`/`.sectorDots`), solo que ahora el swipe actúa
                                    directamente sobre la tarjeta de detalle en vez de sobre una
                                    fila compacta separada. */}
                                <div
                                    className={`${styles.panelWrap} reveal`}
                                    ref={panelWrapRef}
                                    onScroll={handlePanelWrapScroll}
                                >
                                    <span className={styles.panelBar} aria-hidden="true" />
                                    {/* Los 7 paneles se montan siempre (SEO: el copy de who/solution/
                                        benefits de cada sector debe existir en el HTML prerenderizado,
                                        no solo el del sector activo). ≥768px: solo el activo queda en
                                        flujo normal — determina el alto de `.panelWrap` —; el resto se
                                        superpone absoluto (`.panelHidden`), invisible y con `inert`
                                        para que no sea alcanzable por teclado ni lectores de pantalla.
                                        ≤767px: los 7 quedan en flujo horizontal (ver comentario de
                                        `.panelWrap` arriba) pero `inert`/`aria-hidden` en los inactivos
                                        se mantienen igual — solo la tarjeta centrada/snapeada es
                                        alcanzable por teclado o lector de pantalla, el resto es
                                        "visible pero no interactivo" mientras se desliza hacia ella.
                                        La transición opacity/y de abajo cubre TANTO el cambio de
                                        sector por clic/dot como por scroll-jack o swipe — todos pasan
                                        por el mismo `setSelected`, así que `isActive` cambia igual en
                                        todos los casos y motion anima la misma transición. */}
                                    {SECTORS.map((s, i) => {
                                        const isActive = i === selected;
                                        const PanelIcon = ICONS[s.iconKey];
                                        return (
                                            <motion.div
                                                key={s.id}
                                                id={`sector-panel-${i}`}
                                                ref={(el) => { panelRefs.current[i] = el; }}
                                                role="tabpanel"
                                                aria-labelledby={`sector-tab-${i}`}
                                                // Fallback si `aria-labelledby` no resuelve — en ≤767px
                                                // `#sector-tab-${i}` vive dentro de `.ledger`, que ahí está
                                                // `display: none` (fuera del árbol de accesibilidad); según
                                                // el algoritmo de accessible-name, si la referencia no
                                                // resuelve se cae a `aria-label`. En ≥768px `aria-labelledby`
                                                // sigue ganando (el tab SÍ es visible ahí), así que este
                                                // `aria-label` es puro seguro sin efecto visible/funcional.
                                                aria-label={s.label}
                                                aria-hidden={!isActive}
                                                tabIndex={isActive ? 0 : -1}
                                                inert={!isActive}
                                                className={`${styles.panel} ${isActive ? '' : styles.panelHidden}`}
                                                onKeyDown={handlePanelKeyDown}
                                                initial={false}
                                                animate={{
                                                    opacity: isActive ? 1 : 0,
                                                    y: prefersReducedMotion ? 0 : (isActive ? 0 : 12),
                                                }}
                                                transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <div className={styles.panelIcon} aria-hidden="true">
                                                    {prefersReducedMotion ? (
                                                        <PanelIcon size={22} strokeWidth={1.6} />
                                                    ) : (
                                                        // Mismo patrón que .rowIcon: crossfade+scale cuando este
                                                        // panel pasa a ser el activo (o deja de serlo).
                                                        <AnimatePresence mode="wait" initial={false}>
                                                            <motion.span
                                                                key={isActive ? 'active' : 'inactive'}
                                                                className={styles.panelIconMotion}
                                                                initial={{ opacity: 0, scale: 0.85 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.85 }}
                                                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                                            >
                                                                <PanelIcon size={22} strokeWidth={1.6} />
                                                            </motion.span>
                                                        </AnimatePresence>
                                                    )}
                                                </div>

                                                {/* Kicker con el nombre del sector — solo pintado ≤767px
                                                    (ver .panelKicker en Soluciones.module.css). El icono de
                                                    arriba ya es persistente en las 3 páginas internas, pero
                                                    no lleva texto: sin este kicker, un usuario que hubiera
                                                    avanzado a "Cómo funciona"/FAQ y luego deslizara al
                                                    sector siguiente perdería el nombre del sector hasta
                                                    volver a "Resumen" (la única página con `panelTitle`).
                                                    En ≥768px no hace falta — el usuario nunca pierde de
                                                    vista qué sector está viendo. */}
                                                <span className={styles.panelKicker}>{s.label}</span>

                                                {/* Deck de las 3 páginas del panel (resumen / cómo funciona /
                                                    FAQ). Las TRES se montan siempre, exactamente por el mismo
                                                    motivo que los 7 paneles de sector de arriba y un nivel más
                                                    adentro: el copy tiene que existir en el HTML
                                                    prerenderizado.

                                                    Contexto histórico — esto antes era un `AnimatePresence
                                                    mode="wait"` que montaba ÚNICAMENTE la página `page`. En
                                                    cliente funcionaba de maravilla; en el prerender SSG no,
                                                    porque ahí `page` vale 0 siempre (es el valor inicial del
                                                    useState y en node no hay interacción que lo mueva). O sea:
                                                    `sector.processSteps` y `sector.faq` de los 7 sectores —677
                                                    palabras y 21 pares pregunta/respuesta, medido— existían en
                                                    src/data pero NUNCA llegaban al HTML estático. Se arregló
                                                    igual que se arregló el nivel de los paneles: montar todo y
                                                    mostrar solo lo activo.

                                                    No se usa AnimatePresence: su contrato es precisamente
                                                    desmontar el hijo saliente, que es justo lo que no
                                                    queremos. El slide de 24px se reproduce con la DISTANCIA a
                                                    la página activa (`idx - page`), que además sale gratis en
                                                    las dos direcciones sin llevar un `pageDirection` a mano.

                                                    Las dos páginas inactivas van `aria-hidden` + `inert`,
                                                    mismo tratamiento que los paneles de sector inactivos: el
                                                    lector de pantalla solo anuncia la visible y el tabulador no
                                                    entra en las otras. NO están escondidas para el rastreador:
                                                    siguen siendo alcanzables con las flechas y los dots de
                                                    `.pageNav` de más abajo, que es el patrón de pestañas que
                                                    Google soporta explícitamente. */}
                                                <div className={styles.pageDeck}>
                                                    {PANEL_PAGE_LABELS.map((label, idx) => {
                                                        const isPageActive = idx === page;
                                                        // Negativo si la página queda a la izquierda de la
                                                        // activa, positivo si a la derecha, 0 la activa.
                                                        const offset = idx - page;
                                                        return (
                                                            <motion.div
                                                                key={label}
                                                                className={isPageActive ? undefined : styles.pageSlideHidden}
                                                                aria-hidden={!isPageActive}
                                                                inert={!isPageActive}
                                                                initial={false}
                                                                animate={{
                                                                    opacity: isPageActive ? 1 : 0,
                                                                    x: prefersReducedMotion ? 0 : offset * 24,
                                                                }}
                                                                transition={{
                                                                    duration: prefersReducedMotion ? 0 : 0.22,
                                                                    ease: [0.16, 1, 0.3, 1],
                                                                }}
                                                            >
                                                                <SectorPageContent sector={s} page={idx} />
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Flechas + dots — navegan `page` (0-2) dentro del sector
                                                    activo, foco/teclado gestionados en `handlePanelKeyDown`
                                                    (arriba, en el propio `motion.div` del panel). */}
                                                <div className={styles.pageNav}>
                                                    <button
                                                        type="button"
                                                        className={styles.pageArrow}
                                                        aria-label="Página anterior"
                                                        disabled={page === 0}
                                                        onClick={() => goToPage(page - 1)}
                                                    >
                                                        <ChevronLeft size={18} strokeWidth={2} />
                                                    </button>
                                                    <div className={styles.pageDots}>
                                                        {PANEL_PAGE_LABELS.map((label, idx) => (
                                                            <button
                                                                key={label}
                                                                type="button"
                                                                className={`${styles.pageDot} ${idx === page ? styles.pageDotActive : ''}`}
                                                                aria-label={`Ir a ${label}`}
                                                                aria-current={idx === page ? 'true' : undefined}
                                                                onClick={() => goToPage(idx)}
                                                            />
                                                        ))}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className={styles.pageArrow}
                                                        aria-label="Página siguiente"
                                                        disabled={page === PANEL_PAGE_COUNT - 1}
                                                        onClick={() => goToPage(page + 1)}
                                                    >
                                                        <ChevronRight size={18} strokeWidth={2} />
                                                    </button>
                                                </div>

                                                <div className={styles.panelCta}>
                                                    <Link to={ROUTES.contacto}>
                                                        <Button variant="primary" size="lg">
                                                            {SECTOR_CTA_LABEL}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bloque de cierre */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock} ref={ctaRef}>
                        <h2 className={sys.endCtaTitle}>¿No encuentras tu sector aquí?</h2>
                        <p className={sys.endCtaSub}>
                            Cuéntanoslo. Te orientamos en 30 minutos — sin compromiso ni presión
                            por vender.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="secondary" size="lg">Reservar diagnóstico gratuito</Button>
                            </Link>
                            <Link to={ROUTES.casos}>
                                <Button variant="outline" size="lg">Ver casos</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
