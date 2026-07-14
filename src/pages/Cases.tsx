import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { useDragScroll } from '../hooks/useDragScroll';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import {
    ChevronLeft,
    ChevronRight,
    Code2,
    Clock,
    BadgeCheck,
    MessageCircle,
    Cpu,
} from 'lucide-react';
import sys from '../styles/page-system.module.css';
import styles from './Cases.module.css';

interface StatData {
    v: string;
    l: string;
}

interface CaseData {
    sector: string;
    title: string;
    text: string;
    stats: StatData[];
    quote: string;
    author: string;
}

const CASES: CaseData[] = [
    {
        sector: 'Reformas',
        title: 'De la libreta al sistema que trabaja solo',
        text: 'Empresa familiar de reformas que lo llevaba todo con Excel y llamadas. Diseñamos su marca, construimos un sistema a medida con presupuestos asistidos por IA y automatizamos las citas por WhatsApp. En tres meses triplicaron su capacidad sin incorporar a nadie más.',
        stats: [
            { v: '3×', l: 'Capacidad de atención' },
            { v: '−70%', l: 'Tiempo en gestión' },
            { v: '0 €', l: 'Personal extra' },
        ],
        quote: 'Pasamos de perder presupuestos por falta de seguimiento a tener un sistema que trabaja solo.',
        author: 'CEO',
    },
    {
        sector: 'Asesoría fiscal',
        title: 'Una asesoría que cierra cuentas mientras duerme',
        text: 'Despacho con cientos de clientes ahogado en tareas repetitivas. Implementamos lectura inteligente de documentos, conciliación bancaria automática y un asistente IA que prepara los modelos antes de la revisión humana. Cierre mensual al 80% en automático.',
        stats: [
            { v: '80%', l: 'Cierre automático' },
            { v: '−5h/día', l: 'En tareas repetitivas' },
            { v: '+45%', l: 'Más capacidad sin contratar' },
        ],
        quote: 'Antes era imposible escalar sin contratar; ahora podemos crecer sin que el equipo reviente.',
        author: 'Socio director',
    },
    {
        sector: 'Agencia de servicios',
        title: 'Una agencia que recupera 20 horas a la semana',
        text: 'Agencia de marketing con cinco herramientas distintas que no se hablaban entre sí. Construimos un sistema único que sustituyó CRM, gestión, facturación y comunicación interna, con reporting en tiempo real para dirección y un asistente IA para dudas internas.',
        stats: [
            { v: '20h', l: 'Ahorradas a la semana' },
            { v: '5→1', l: 'Apps en un solo sistema' },
            { v: '100%', l: 'Información centralizada' },
        ],
        quote: 'Dejamos de pagar cinco herramientas y ganamos visibilidad real de cada cliente.',
        author: 'Directora de operaciones',
    },
];

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
        Icon: MessageCircle,
        title: 'Soporte directo con quien lo construyó',
        text: 'Hablas con quien diseñó y programó tu sistema. Sin tickets, sin agentes de soporte que no conocen tu caso, sin tiempos de espera que no tiene ningún sentido.',
    },
    {
        Icon: Cpu,
        title: 'IA donde reduce trabajo real',
        text: 'No añadimos inteligencia artificial como reclamo de marketing. La integramos en tareas concretas donde ahorra horas reales: documentos, respuestas, clasificación, presupuestos.',
    },
];

// Pure card — no hooks
const CaseCard: React.FC<{ c: CaseData; index: number }> = ({ c, index }) => (
    <article className={styles.caseCard}>
        <div className={styles.cardHead}>
            <span className={styles.cardSector}>
                <span className={styles.sectorDot} aria-hidden="true" />
                {c.sector}
            </span>
            <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className={styles.cardStats}>
            {c.stats.map((s, j) => (
                <div key={j} className={styles.cardStat}>
                    <span className={`${styles.cardStatVal} ${sys.statAccent}`}>{s.v}</span>
                    <span className={styles.cardStatLabel}>{s.l}</span>
                </div>
            ))}
        </div>

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
                    {/* Case ledger — instrument strip mirroring the carousel state */}
                    <div className={styles.caseLedger}>
                        <div className={`${styles.ledgerRow} ${styles.ledgerHead}`} aria-hidden="true">
                            <span>Sector</span>
                            <span className={styles.ledgerResult}>Resultado</span>
                            <span className={styles.ledgerStatus}>Estado</span>
                        </div>
                        {CASES.map((c, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`${styles.ledgerRow} ${i === currentIndex ? styles.ledgerRowActive : ''}`}
                                onClick={() => scrollToIndex(i)}
                                aria-label={`Ver caso ${i + 1}: ${c.sector}`}
                                aria-current={i === currentIndex}
                            >
                                <span>{c.sector}</span>
                                <span className={styles.ledgerResult}>
                                    {c.stats[0].v} {c.stats[0].l}
                                </span>
                                <span className={styles.ledgerStatus}>
                                    <span className={styles.ledgerDot} aria-hidden="true" />
                                    Operativo
                                </span>
                            </button>
                        ))}
                    </div>

                    <div
                        ref={trackRef}
                        className={styles.carouselTrack}
                        onScroll={handleScroll}
                        aria-label="Casos de éxito"
                    >
                        {CASES.map((c, i) => (
                            <CaseCard key={i} c={c} index={i} />
                        ))}
                    </div>

                    <div className={styles.carouselFooter}>
                        <div className={styles.dots} role="tablist" aria-label="Navegar entre casos">
                            {CASES.map((_, i) => (
                                <button
                                    key={i}
                                    role="tab"
                                    aria-selected={i === currentIndex}
                                    className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                                    onClick={() => scrollToIndex(i)}
                                    aria-label={`Caso ${i + 1}`}
                                />
                            ))}
                        </div>
                        <div className={styles.navButtons}>
                            <button
                                className={styles.navBtn}
                                onClick={() => scrollToIndex(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                aria-label="Caso anterior"
                            >
                                <ChevronLeft size={18} strokeWidth={2} />
                            </button>
                            <button
                                className={styles.navBtn}
                                onClick={() => scrollToIndex(currentIndex + 1)}
                                disabled={currentIndex === CASES.length - 1}
                                aria-label="Caso siguiente"
                            >
                                <ChevronRight size={18} strokeWidth={2} />
                            </button>
                        </div>
                    </div>
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
                    <h2 className={styles.whyTitle}>Hacemos las cosas de otra manera</h2>
                    <p className={styles.whySub}>
                        No somos una agencia digital ni una consultora. Somos un equipo pequeño
                        que construye software a medida para empresas que quieren trabajar mejor,
                        sin depender de herramientas genéricas ni de procesos que no se adaptan a ellas.
                    </p>
                </div>

                <div className={styles.whyGrid}>
                    {DIFFERENTIATORS.map((d, i) => (
                        <div key={i} className={`${styles.whyItem} reveal`}>
                            <div className={styles.whyIconWrap} aria-hidden="true">
                                <d.Icon size={18} strokeWidth={1.75} />
                            </div>
                            <h3 className={styles.whyItemTitle}>{d.title}</h3>
                            <p className={styles.whyItemText}>{d.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const Cases: React.FC = () => {
    usePageSEO({
        title: 'Casos de éxito · Software a medida — OpsPilot',
        description:
            'Empresas reales que transformaron su operativa con software a medida, asistentes IA y automatización: reformas, asesorías fiscales y agencias de servicios.',
        canonical: 'https://opspilot.es/casos',
    });

    const heroRef = useHeroReveal<HTMLDivElement>();

    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={sys.page}>
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            Empresas reales,<br />
                            problemas <em className={sys.pageHeroAccent}>resueltos</em>.
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            No hace falta ser una gran empresa para necesitar buenos procesos.
                            Esto es lo que hemos construido para empresas como la tuya.
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
                            Analizamos tu situación en 30 minutos y te decimos qué podríamos
                            hacer por ti. Sin compromiso.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="secondary" size="lg">Reservar diagnóstico</Button>
                            </Link>
                            <Link to={ROUTES.servicios}>
                                <Button variant="outline" size="lg">Ver servicios</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
