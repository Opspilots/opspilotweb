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
import { buildBreadcrumb } from '../lib/seo';
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

// Variantes del slide horizontal entre páginas (Framer Motion, patrón
// "swipeable carousel" oficial: `custom` en AnimatePresence Y en el hijo
// entrante). `dir === 0` es el caso especial del RESET por cambio de sector
// (ver useEffect de `page` más abajo): ahí no debe verse ningún slide —
// el cambio de sector ya tiene su propia transición (crossfade de icono +
// opacity/y del panel) y un segundo movimiento simultáneo se leería como
// ruido, no como una señal. Con dir=0 entrada/salida quedan en opacity:1,
// x:0 en todo momento, así que la página nueva del sector nuevo aparece
// "ya puesta" sin animar por su cuenta.
const pageVariants = {
    enter: (dir: number) => ({
        opacity: dir === 0 ? 1 : 0,
        x: dir === 0 ? 0 : dir * 24,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
        opacity: dir === 0 ? 1 : 0,
        x: dir === 0 ? 0 : dir * -24,
    }),
};

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
        canonical: 'https://opspilot.es/soluciones',
    };

    const heroRef = useHeroReveal<HTMLDivElement>();
    const listRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    const prefersReducedMotion = usePrefersReducedMotion();
    const [selected, setSelected] = useState(0);
    // Sector activo — leído tanto por el hero (titular reactivo, ver más
    // abajo) como por el explorador. Un solo `const` en vez de `SECTORS[selected]`
    // repetido evita desincronías si algún día cambia la fuente de `selected`.
    const activeSector = SECTORS[selected];
    // Página activa DENTRO del panel del sector seleccionado (0 overview / 1
    // cómo funciona / 2 FAQ) — completamente independiente de `selected`
    // salvo por el reset de abajo. `pageDirection` alimenta las variants del
    // slide (1 = avanza a la derecha, -1 = retrocede, 0 = sentinel "sin
    // slide", solo usado en el reset por cambio de sector).
    const [page, setPage] = useState(0);
    const [pageDirection, setPageDirection] = useState(0);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const ledgerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const ledgerScrollRaf = useRef(0);

    // Cambiar de sector (clic/tap/teclado en las filas O scroll-jack, ambos
    // pasan por `setSelected`) siempre vuelve el panel a su página 1 — nunca
    // se hereda la página en la que se había quedado el sector anterior (ver
    // instrucción explícita: aterrizar en la FAQ de un sector nuevo sin
    // contexto confunde). `pageDirection` a 0 en el mismo tick evita que este
    // reset dispare el slide horizontal de página (ver `pageVariants`).
    useEffect(() => {
        setPageDirection(0);
        setPage(0);
    }, [selected]);

    // Navegación entre páginas del panel — clamp a [0, N-1], no-op si ya
    // estás en el destino (evita un re-render y una dirección espuria).
    const goToPage = (target: number) => {
        const next = Math.max(0, Math.min(PANEL_PAGE_COUNT - 1, target));
        if (next === page) return;
        setPageDirection(next > page ? 1 : -1);
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
    // esto no desplaza nada perceptible.
    useEffect(() => {
        tabRefs.current[selected]?.scrollIntoView({
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
                    { name: 'Soluciones', url: 'https://opspilot.es/soluciones' },
                ])}
            />
            {/* Sectores — explorador de dos paneles (lista + detalle). Selección
                por clic/tap/teclado en todos los breakpoints, más scroll-jack
                en desktop sin reduced-motion (ver comentario junto a
                `selected`/al useEffect de ScrollTrigger más arriba).
                `.solTrack`/`.solViewport` son la pareja track alto + sticky
                que hace posible el scroll-jack (ver Soluciones.module.css);
                fuera de ese matchMedia (móvil/tablet/reduced-motion) ambos
                colapsan a su alto de contenido normal, sin efecto visible.
                El hero vive AHORA dentro de `.solViewport`, antes del
                explorador — así queda pineado junto a la lista/panel durante
                todo el scroll-jack en vez de scrollear fuera de vista antes
                de que el pin arranque (ver comentario en Soluciones.module.css
                junto a `.solHero`). Sigue siendo un `<div>`, no un `<section>`:
                ya no aportaba un landmark propio (un `<section>` sin
                aria-label no se expone como región) y anidarlo dentro de
                `explorerSection` como `<section>` habría sido una sección
                dentro de otra sección sin necesidad. */}
            <section className={`${sys.section} ${styles.explorerSection}`}>
                <div className={styles.solTrack} ref={trackRef}>
                    <div className={styles.solViewport}>
                        <div className={`${sys.pageHero} ${styles.solHero}`}>
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
                        </div>

                        <div className={sys.container}>
                            <div className={styles.explorer} ref={listRef} data-lenis-prevent>
                                {/* Columna izquierda — lista de sectores seleccionables (nav,
                                    no tabla: sin fila de cabecera, ver Soluciones.module.css) */}
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
                                                {/* rowDesc (s.who) solo se ve en el carrusel de ≤767px
                                                    (ver Soluciones.module.css) — en desktop/tablet queda
                                                    oculto vía display:none, sin duplicar markup por breakpoint. */}
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
                                    navegación adicional legítima, no decoración pura — por eso NO
                                    llevan role="tab"/"tablist" (ya existe uno real en `.ledger`;
                                    duplicarlo confundiría a lectores de pantalla con dos tablists
                                    controlando el mismo panel). En desktop/tablet quedan en el DOM
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

                                {/* Columna derecha — panel de detalle del sector activo */}
                                <div className={`${styles.panelWrap} reveal`}>
                                    <span className={styles.panelBar} aria-hidden="true" />
                                    {/* Los 7 paneles se montan siempre (SEO: el copy de who/solution/
                                        benefits de cada sector debe existir en el HTML prerenderizado,
                                        no solo el del sector activo). Solo el activo queda en flujo
                                        normal — determina el alto de `.panelWrap` —; el resto se
                                        superpone absoluto (`.panelHidden`), invisible y con `inert`
                                        para que no sea alcanzable por teclado ni lectores de pantalla.
                                        La transición opacity/y de abajo cubre TANTO el cambio de
                                        sector por clic como por scroll-jack — ambos pasan por el
                                        mismo `setSelected`, así que `isActive` cambia igual en los
                                        dos casos y motion anima la misma transición en ambos. */}
                                    {SECTORS.map((s, i) => {
                                        const isActive = i === selected;
                                        const PanelIcon = ICONS[s.iconKey];
                                        return (
                                            <motion.div
                                                key={s.id}
                                                id={`sector-panel-${i}`}
                                                role="tabpanel"
                                                aria-labelledby={`sector-tab-${i}`}
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

                                                {/* Páginas del panel (overview / cómo funciona / FAQ) — solo
                                                    se anima con slide en el sector ACTIVO; en los 6 paneles
                                                    inactivos `page`/`pageDirection` son el mismo estado
                                                    compartido pero da igual: están invisibles/`inert`, así
                                                    que el slide de fondo no se ve ni consume interacción. */}
                                                {prefersReducedMotion ? (
                                                    <div className={styles.pageContent}>
                                                        <SectorPageContent sector={s} page={page} />
                                                    </div>
                                                ) : (
                                                    <AnimatePresence mode="wait" initial={false} custom={pageDirection}>
                                                        <motion.div
                                                            key={page}
                                                            custom={pageDirection}
                                                            variants={pageVariants}
                                                            initial="enter"
                                                            animate="center"
                                                            exit="exit"
                                                            transition={{
                                                                duration: pageDirection === 0 ? 0 : 0.22,
                                                                ease: [0.16, 1, 0.3, 1],
                                                            }}
                                                            className={styles.pageContent}
                                                        >
                                                            <SectorPageContent sector={s} page={page} />
                                                        </motion.div>
                                                    </AnimatePresence>
                                                )}

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
