import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ButtonLink } from '../components/ui/Button';
import { CaseMockPanel } from '../components/cases/CaseMockPanel';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { useDragScroll } from '../hooks/useDragScroll';
import { PageSEO } from '../hooks/usePageSEO';
import { buildBreadcrumb } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import { ROUTES } from '../lib/routes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import sys from '../styles/page-system.module.css';
import styles from './Cases.module.css';
import { CASES } from '../data';
import type { Case } from '../data';

// El bloque de 4 diferenciadores ("Software hecho para ti, no plantillas",
// "Entrega en semanas, no en meses", …) ya no vive aquí: se extrajo a
// src/components/marketing/Differentiators.tsx y se reubicó en Home, encima de
// la tabla comparativa. Esta página queda centrada solo en los casos.

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

                    {/* Una línea, no cuatro. El bloque anterior repetía cuatro
                        veces la misma idea y se leía como letra pequeña defensiva.
                        Se conservan los dos matices que SÍ importan y que el resto
                        del copy no puede afirmar de otro modo: (a) los nombres y
                        datos identificativos están omitidos —eso cubre también las
                        citas, que van firmadas solo por el cargo—, y (b) las cifras
                        son REPRESENTATIVAS de varios proyectos del mismo sector, no
                        auditadas ni atribuibles a un único cliente. Decir "cifras
                        reales" a secas sería una afirmación más fuerte de la que el
                        sitio puede respaldar. */}
                    <p className={styles.caseDisclaimer}>
                        Nombres omitidos por privacidad. Cifras representativas de
                        proyectos reales del mismo sector.
                    </p>
                </div>
            </div>
        </section>
    );
};

export const Cases: React.FC = () => {
    const seoProps = {
        title: 'Casos de éxito de software a medida · OpsPilot',
        description:
            'Resultados reales de pymes que dejaron el Excel: más obra, menos horas perdidas, seguimientos que ya no se escapan. Casos con cifras, no promesas.',
        canonical: 'https://opspilot.es/casos',
    };

    const breadcrumb = buildBreadcrumb([
        { name: 'Inicio', url: 'https://opspilot.es/' },
        { name: 'Casos', url: 'https://opspilot.es/casos' },
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

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock} ref={ctaRef}>
                        {/* Antes: "¿Tu empresa podría ser la siguiente?" — una
                            pregunta halagadora que no pide nada concreto. Ahora
                            apunta al problema operativo del visitante, igual que el
                            cierre de Home ("¿Qué es lo que más te está frenando
                            ahora mismo?") y el de Soluciones ("¿No encuentras tu
                            sector aquí?"): mismo patrón de pregunta en las tres
                            páginas, cada una anclada a lo que se acaba de leer. */}
                        <h2 className={sys.endCtaTitle}>¿Cuál de estos problemas se parece al tuyo?</h2>
                        <p className={sys.endCtaSub}>
                            Miramos tu operativa media hora y te decimos qué encajaría contigo.
                            Sin compromiso, sin letra pequeña.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <ButtonLink to={ROUTES.contacto} variant="primary" size="lg">
                                Reservar diagnóstico
                            </ButtonLink>
                            <ButtonLink to={ROUTES.soluciones} variant="outline" size="lg">
                                Ver soluciones
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
