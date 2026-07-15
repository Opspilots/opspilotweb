import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { PageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import { buildBreadcrumb } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import sys from '../styles/page-system.module.css';
import styles from './Soluciones.module.css';

import { SECTORS } from '../data';
import { ICONS } from '../components/icons/registry';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// CTA del panel de detalle: idéntico en los 6 sectores, así que es
// presentación (no dato) — se hardcodea aquí en vez de repetirse en src/data.
const SECTOR_CTA_LABEL = 'Cuéntanos tu caso';

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
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const trackRef = useRef<HTMLDivElement>(null);
    const active = SECTORS[selected];
    const ActiveIcon = ICONS[active.iconKey];

    // Efecto scroll (desktop + movimiento): el explorador se queda sticky y, al
    // bajar, la selección avanza por la lista de sectores (mapeo scroll→índice).
    // Mapea a índices ENTEROS, así que nunca se queda "a la mitad": cada tramo
    // de scroll corresponde a un sector completo. Táctil/móvil/reduced-motion se
    // navega haciendo clic en las filas.
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
            {/* Hero */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} ${styles.heroTitle} reveal`}>
                            ¿En qué sector{' '}
                            <em className={sys.pageHeroAccent}>opera tu negocio?</em>
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            Conocemos de cerca la operativa de estos sectores. Elige el tuyo y
                            te decimos exactamente qué podemos construir para ti.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sectores — explorador de dos paneles (tabla + detalle). En desktop
                el bloque se queda sticky y la selección avanza al hacer scroll. */}
            <section className={sys.section}>
                <div className={styles.solTrack} ref={trackRef}>
                    <div className={styles.solViewport}>
                        <div className={sys.container}>
                            <div className={styles.explorer} ref={listRef}>
                                {/* Columna izquierda — tabla de sectores seleccionables */}
                                <div
                                    className={`${styles.ledger} reveal`}
                                    role="tablist"
                                    aria-label="Sectores"
                                    aria-orientation="vertical"
                                >
                                    <div className={styles.ledgerHead} aria-hidden="true">
                                        <span>Elige tu sector</span>
                                    </div>
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
                                                    <RowIcon size={22} strokeWidth={1.6} />
                                                </span>
                                                <span className={styles.rowLabel}>{s.label}</span>
                                                <ArrowRight size={15} strokeWidth={2} className={styles.rowArrow} aria-hidden="true" />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Columna derecha — panel de detalle del sector activo */}
                                <div className={`${styles.panelWrap} reveal`}>
                                    <span className={styles.panelBar} aria-hidden="true" />
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={selected}
                                            id={`sector-panel-${selected}`}
                                            role="tabpanel"
                                            aria-labelledby={`sector-tab-${selected}`}
                                            tabIndex={0}
                                            className={styles.panel}
                                            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                                            transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.32, 0.72, 0, 1] }}
                                        >
                                            <div className={styles.panelIcon} aria-hidden="true">
                                                <ActiveIcon size={22} strokeWidth={1.6} />
                                            </div>

                                            <h2 className={styles.panelTitle}>{active.title}</h2>

                                            <p className={styles.panelWho}>
                                                <span className={styles.whoLabel}>Para</span> {active.who}
                                            </p>

                                            <p className={styles.panelSolution}>{active.solution}</p>

                                            <ul className={styles.benefitsList}>
                                                {active.benefits.map((b) => (
                                                    <li key={b}>
                                                        <span className={styles.check} aria-hidden="true">
                                                            <Check size={12} strokeWidth={2.5} />
                                                        </span>
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className={styles.panelCta}>
                                                <Link to={ROUTES.contacto}>
                                                    <Button variant="primary" size="lg">
                                                        {SECTOR_CTA_LABEL}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
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
                            Cuéntanoslo y te orientamos en 30 minutos. Sin compromiso, sin presión.
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
