import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { SpotlightCard } from '../components/fx/SpotlightCard';
import { CaseMockPanel } from '../components/cases/CaseMockPanel';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { useDragScroll } from '../hooks/useDragScroll';
import { PageSEO } from '../hooks/usePageSEO';
import { buildBreadcrumb } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import { ROUTES } from '../lib/routes';
import {
    ChevronLeft,
    ChevronRight,
    Code2,
    Clock,
    BadgeCheck,
    Cpu,
} from 'lucide-react';
import sys from '../styles/page-system.module.css';
import styles from './Cases.module.css';
import { CASES } from '../data';
import type { Case } from '../data';

interface DiffItem {
    Icon: React.FC<{ size?: number; strokeWidth?: number }>;
    title: string;
    text: string;
}

const DIFFERENTIATORS: DiffItem[] = [
    {
        Icon: Code2,
        title: 'Software hecho para ti, no plantillas',
        text: 'Cada sistema se diseña desde cero para tu operativa concreta. No adaptamos plantillas de terceros ni te vendemos suscripciones que no controlas. Lo que construimos es tuyo.',
    },
    {
        Icon: Clock,
        title: 'Entrega en semanas, no en meses',
        text: 'Sin proyectos eternos ni fases de consultoría facturadas por horas. Defines el problema, construimos la solución y la entregamos lista para usar en 4 a 8 semanas.',
    },
    {
        Icon: BadgeCheck,
        title: 'Pagas una vez, es tuyo para siempre',
        text: 'Sin cuotas mensuales por el software. Pagas el desarrollo una sola vez y el sistema es completamente tuyo. Solo vuelves si quieres añadir más funcionalidades.',
    },
    {
        Icon: Cpu,
        title: 'IA donde reduce trabajo real',
        text: 'No añadimos inteligencia artificial como reclamo de marketing. La integramos en tareas concretas donde ahorra horas reales: documentos, respuestas, clasificación, presupuestos.',
    },
];

// Pure card — no hooks
const CaseCard: React.FC<{ c: Case; index: number }> = ({ c, index }) => (
    <article className={styles.caseCard}>
        <div className={styles.cardHead}>
            <span className={styles.cardSector}>
                <span className={styles.sectorDot} aria-hidden="true" />
                {c.label}
            </span>
            <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
        </div>

        <CaseMockPanel showcase={c.showcase} className={styles.cardTransition} />

        <div className={styles.cardContent}>
            <div className={styles.cardNarrative}>
                <h2 className={styles.cardTitle}>{c.title}</h2>
                <p className={styles.cardText}>{c.text}</p>
            </div>
            <blockquote className={styles.cardQuote}>
                <p>{c.quote}</p>
                <cite>{c.author}</cite>
            </blockquote>
        </div>
    </article>
);

const CarouselSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    useDragScroll(trackRef);

    const getScrollUnit = useCallback((): number => {
        if (!trackRef.current) return 0;
        const card = trackRef.current.children[0] as HTMLElement | null;
        if (!card) return 0;
        const gapStr = window.getComputedStyle(trackRef.current).gap;
        const gap = parseFloat(gapStr) || 20;
        return card.offsetWidth + gap;
    }, []);

    const handleScroll = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (!trackRef.current) return;
            const unit = getScrollUnit();
            if (!unit) return;
            const idx = Math.round(trackRef.current.scrollLeft / unit);
            setCurrentIndex(Math.max(0, Math.min(idx, CASES.length - 1)));
        });
    }, [getScrollUnit]);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    const scrollToIndex = useCallback(
        (index: number) => {
            if (!trackRef.current) return;
            const unit = getScrollUnit();
            trackRef.current.scrollTo({ left: index * unit, behavior: 'smooth' });
            setCurrentIndex(Math.max(0, Math.min(index, CASES.length - 1)));
        },
        [getScrollUnit],
    );

    return (
        <section className={styles.carouselSection}>
            <div className={`${sys.container} ${styles.carouselContentLayer}`}>
                <div className={styles.carouselWrapper}>
                    <div
                        ref={trackRef}
                        className={styles.carouselTrack}
                        onScroll={handleScroll}
                        aria-label="Casos de éxito"
                    >
                        {CASES.map((c, i) => (
                            <CaseCard key={c.id} c={c} index={i} />
                        ))}
                    </div>

                    <div className={styles.carouselFooter}>
                        {/* Botones simples: el carrusel es una región con scroll,
                            no un tablist con tabpanels — usamos aria-current como el ledger */}
                        <div className={styles.dots} role="group" aria-label="Navegar entre casos">
                            {CASES.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-current={i === currentIndex}
                                    className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                                    onClick={() => scrollToIndex(i)}
                                    aria-label={`Ir al caso ${i + 1}`}
                                />
                            ))}
                        </div>
                        <div className={styles.navButtons}>
                            <span className={styles.counter} aria-hidden="true">
                                <span className={styles.counterNow}>
                                    {String(currentIndex + 1).padStart(2, '0')}
                                </span>
                                /{String(CASES.length).padStart(2, '0')}
                            </span>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => scrollToIndex(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                aria-label="Caso anterior"
                            >
                                <ChevronLeft size={18} strokeWidth={2} />
                            </button>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => scrollToIndex(currentIndex + 1)}
                                disabled={currentIndex === CASES.length - 1}
                                aria-label="Caso siguiente"
                            >
                                <ChevronRight size={18} strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    <p className={styles.caseDisclaimer}>
                        Casos reales, cifras representativas. Cada caso resume varios
                        proyectos del mismo sector. Omitimos nombres y datos
                        identificativos por privacidad de cada cliente. Los testimonios
                        son de cargos reales, anonimizados; las métricas ilustran
                        resultados típicos, no una auditoría.
                    </p>
                </div>
            </div>
        </section>
    );
};

const WhySection: React.FC = () => {
    const whyRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <section className={styles.whySection}>
            <div className={sys.container} ref={whyRef}>
                <div className={`${styles.whyHeader} reveal`}>
                    <h2 className={styles.whyTitle}>Resultados que se ven. No promesas de folleto</h2>
                    <p className={styles.whySub}>
                        No somos una agencia digital ni una consultora. Somos un equipo pequeño
                        que construye software a medida para PYMEs que quieren trabajar mejor,
                        sin depender de herramientas genéricas ni de procesos que no se adaptan a ellas.
                    </p>
                </div>

                <div className={styles.whyGrid}>
                    {DIFFERENTIATORS.map((d, i) => (
                        <SpotlightCard
                            as="article"
                            key={i}
                            className={`${styles.whyItem} ${i === DIFFERENTIATORS.length - 1 ? styles.whyItemClosing : ''} reveal`}
                        >
                            <span className={styles.whyItemBar} aria-hidden="true" />
                            <div className={styles.whyIconWrap} aria-hidden="true">
                                <d.Icon size={20} strokeWidth={1.75} />
                            </div>
                            <h3 className={styles.whyItemTitle}>{d.title}</h3>
                            <p className={styles.whyItemText}>{d.text}</p>
                        </SpotlightCard>
                    ))}
                </div>
                {/* Indicador de scroll horizontal (solo móvil): avisa de que
                   la fila continúa fuera de pantalla. */}
                {DIFFERENTIATORS.length > 1 && (
                    <p className={styles.scrollHint} aria-hidden="true">
                        Desliza para ver más →
                    </p>
                )}
            </div>
        </section>
    );
};

export const Cases: React.FC = () => {
    const seoProps = {
        title: 'Casos de éxito de software a medida · OpsPilot',
        description:
            'Resultados reales de pymes que dejaron el Excel: más obra, menos horas perdidas, seguimientos que ya no se escapan. Casos con cifras, no promesas.',
        canonical: 'https://opspilot.es/casos/',
    };

    const breadcrumb = buildBreadcrumb([
        { name: 'Inicio', url: 'https://opspilot.es/' },
        { name: 'Casos', url: 'https://opspilot.es/casos/' },
    ]);

    const heroRef = useHeroReveal<HTMLDivElement>();

    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={sys.page}>
            <PageSEO {...seoProps} />
            <StructuredData data={breadcrumb} />
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            Empresas reales,<br />
                            problemas <em className={sys.pageHeroAccent}>resueltos</em>.
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            No hace falta ser una gran empresa para tener buenos procesos.
                            Esto es software a medida que hemos construido para PYMEs como la tuya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ CAROUSEL ═══ */}
            <CarouselSection />

            {/* ═══ DIFERENCIADORES ═══ */}
            <WhySection />

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock} ref={ctaRef}>
                        <h2 className={sys.endCtaTitle}>¿Tu empresa podría ser la siguiente?</h2>
                        <p className={sys.endCtaSub}>
                            Miramos tu operativa media hora y te decimos qué encajaría contigo.
                            Sin compromiso, sin letra pequeña.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="secondary" size="lg">Reservar diagnóstico</Button>
                            </Link>
                            <Link to={ROUTES.soluciones}>
                                <Button variant="outline" size="lg">Ver soluciones</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
