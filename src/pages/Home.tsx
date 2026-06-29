import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import {
    Code2,
    LayoutGrid,
    Sparkles,
    Plug,
    Workflow,
    Database,
    Rocket,
    MessagesSquare,
    Search,
    FileCheck,
    Wrench,
    Layers,
    PencilRuler,
    Check,
    ArrowRight,
    X,
} from 'lucide-react';
import styles from './Home.module.css';
import sys from '../styles/page-system.module.css';
import Aurora from '../components/common/Aurora';

gsap.registerPlugin(ScrollTrigger);

const CASES = [
    {
        eyebrow: 'Reformas',
        title: 'De la libreta al sistema que trabaja solo',
        summary:
            'Empresa familiar de reformas que triplicó su capacidad sin contratar a nadie más.',
        bullets: [
            'Marca, identidad y presupuestos con IA generando imágenes realistas de la reforma antes de empezar',
            'WhatsApp automatizado para citas y visitas — cero llamadas para confirmar',
            'Sistema a medida que centraliza clientes, obras y facturación en un solo lugar',
        ],
        stats: [
            { value: '3×', label: 'Capacidad de atención en tres meses' },
            { value: '−70%', label: 'Tiempo dedicado a gestión administrativa' },
            { value: '0 €', label: 'Inversión adicional en personal' },
        ],
        source: { initials: 'MR', name: 'Miguel R.', role: 'Gerente', company: 'Reformas Integral Madrid' },
    },
    {
        eyebrow: 'Asesoría fiscal',
        title: 'Una asesoría que cierra cuentas mientras duerme',
        summary:
            'Despacho con cientos de clientes que automatizó el cierre mensual sin perder calidad.',
        bullets: [
            'Conciliación bancaria automática y lectura inteligente de documentos',
            'Asistente IA que prepara los modelos antes de la revisión humana',
            'Portal de cliente para firmar documentos sin emails de ida y vuelta',
        ],
        stats: [
            { value: '80%', label: 'Cierre mensual automatizado' },
            { value: '−5h/día', label: 'En tareas repetitivas del equipo' },
            { value: '+45%', label: 'Más capacidad sin contratar' },
        ],
        source: { initials: 'CA', name: 'Carmen A.', role: 'Socia directora', company: 'Asesoría Aranda & Asociados' },
    },
    {
        eyebrow: 'Agencia de servicios',
        title: 'Una agencia que recupera 20 horas a la semana',
        summary:
            'Agencia que reemplazó cinco herramientas distintas por un solo sistema hecho a medida.',
        bullets: [
            'Sistema único que sustituyó CRM, gestión, facturación y comunicación interna',
            'Reporting en tiempo real para dirección, sin tener que pedir nada',
            'Asistente IA que responde dudas internas de proceso al instante',
        ],
        stats: [
            { value: '20h', label: 'Ahorradas a la semana en todo el equipo' },
            { value: '5 → 1', label: 'Apps reemplazadas por un solo sistema' },
            { value: '100%', label: 'Información centralizada y siempre al día' },
        ],
        source: { initials: 'PL', name: 'Pablo L.', role: 'CEO', company: 'Agencia Lince' },
    },
];

export const Home: React.FC = () => {
    usePageSEO({
        title: 'OpsPilot — Software a medida y productos verticales para PYMEs en España',
        description: 'Diseñamos y construimos contigo el software que tu empresa necesita. Trato cercano, presupuesto cerrado, respuesta en menos de 24h. Productos verticales (fiscalidad, energía, obra, ERP) y desarrollo a medida.',
        canonical: 'https://opspilot.es/',
    });

    const heroRef = useRef<HTMLDivElement>(null);

    const problemRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const methodScrollRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const caseRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const whyRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    const [activeCase, setActiveCase] = useState(0);
    const [carouselPaused, setCarouselPaused] = useState(false);

    useEffect(() => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (carouselPaused || reduce) return;
        const id = window.setInterval(() => {
            setActiveCase((i) => (i + 1) % CASES.length);
        }, 8000);
        return () => window.clearInterval(id);
    }, [carouselPaused]);

    useEffect(() => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            if (!reduce) {
                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                tl.from(`.${styles.heroTitle} .${styles.heroLine}`, {
                    opacity: 0, y: 32, duration: 0.95, stagger: 0.1,
                })
                    .from(`.${styles.heroSubtitle}`, { opacity: 0, y: 18, duration: 0.7 }, '-=0.55')
                    .from(`.${styles.ctaGroup} > *`, { opacity: 0, y: 14, duration: 0.55, stagger: 0.08 }, '-=0.45')
                    .from(`.${styles.heroVisual}`, { opacity: 0, x: 36, duration: 0.9 }, '-=0.6');

                // Stat reveal en casos
                ScrollTrigger.create({
                    trigger: `.${styles.caseCarousel}`,
                    start: 'top 78%',
                    once: true,
                    onEnter: () => {
                        gsap.from(`.${styles.caseStat}`, {
                            opacity: 0, y: 14, scale: 0.9,
                            duration: 0.55, stagger: 0.07, ease: 'power2.out',
                        });
                    },
                });
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (window.matchMedia?.('(hover: none)').matches) return;

        const cards = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.problemCard}`));
        const cleanups: (() => void)[] = [];

        cards.forEach((el) => {
            gsap.set(el, { transformPerspective: 900 });

            const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power3.out' });
            const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power3.out' });

            const onMove = (e: MouseEvent) => {
                const r = el.getBoundingClientRect();
                const xPct = ((e.clientX - r.left) / r.width - 0.5) * 2;
                const yPct = ((e.clientY - r.top) / r.height - 0.5) * 2;
                xTo(xPct * 7);
                yTo(-yPct * 5);
            };
            const onLeave = () => { xTo(0); yTo(0); };

            el.addEventListener('mousemove', onMove);
            el.addEventListener('mouseleave', onLeave);
            cleanups.push(() => {
                el.removeEventListener('mousemove', onMove);
                el.removeEventListener('mouseleave', onLeave);
                gsap.set(el, { rotationX: 0, rotationY: 0 });
            });
        });

        return () => cleanups.forEach(fn => fn());
    }, []);

    const getCasePosition = (i: number): 'current' | 'prev' | 'next' | 'far' => {
        const total = CASES.length;
        const diff = ((i - activeCase) % total + total) % total;
        if (diff === 0) return 'current';
        if (diff === 1) return 'next';
        if (diff === total - 1) return 'prev';
        return 'far';
    };

    return (
        <div className={styles.page}>
            {/* ═══ HERO ═══ */}
            <section className={styles.hero} ref={heroRef}>
                <div className={styles.auroraBackground}>
                    <Aurora colorStops={['#0a1118', '#1b998b', '#39ce86']} blend={0.5} amplitude={1.0} speed={0.6} />
                </div>
                <div className={styles.heroVeil} />
                <div className={styles.heroNoise} aria-hidden="true" />

                <div className={styles.heroInner}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroLine}>Software a medida</span>
                            <span className={styles.heroLine}>para PYMEs que ya no</span>
                            <span className={styles.heroLine}>caben en el Excel.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Diseñamos el sistema que tu negocio necesita —no el que te quieren vender.
                            Presupuesto cerrado, respuesta en menos de 24h.
                        </p>
                        <div className={styles.ctaGroup}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="primary" size="lg">Cuéntanos tu problema</Button>
                            </Link>
                            <Link to={ROUTES.soluciones} className={styles.ctaSecondary}>
                                Ver soluciones <ArrowRight size={16} strokeWidth={2} />
                            </Link>
                        </div>
                        <ul className={styles.trustList}>
                            <li><span className={styles.trustDot} />+10 PYMEs ya automatizadas</li>
                            <li><span className={styles.trustDot} />Respuesta en menos de 24h</li>
                            <li><span className={styles.trustDot} />Precio cerrado siempre</li>
                        </ul>

                        {/* Stat card — solo visible en móvil (<1024px) */}
                        <div className={styles.heroMobileStats} aria-hidden="true">
                            <div className={styles.heroMobileStat}>
                                <span className={styles.heroMobileStatNum}>80%</span>
                                <span className={styles.heroMobileStatLabel}>del proceso automatizado</span>
                            </div>
                            <div className={styles.heroMobileStat}>
                                <span className={styles.heroMobileStatNum}>−5h</span>
                                <span className={styles.heroMobileStatLabel}>ahorradas al día</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroVisual} aria-hidden="true">
                        <div className={styles.mockPanel}>
                            <div className={styles.mockPanelHeader}>
                                <div className={styles.mockDotRow}>
                                    <span className={styles.mockDotRed} />
                                    <span className={styles.mockDotYellow} />
                                    <span className={styles.mockDotGreen} />
                                </div>
                                <span className={styles.mockPanelUrl}>app.opspilot.es · Asesoría Aranda</span>
                                <span className={styles.mockPanelLive}>● activo</span>
                            </div>
                            <div className={styles.mockPanelStats}>
                                <div className={styles.mockStat}>
                                    <span className={styles.mockStatNum}>34</span>
                                    <span className={styles.mockStatLabel}>Modelos<br />preparados por IA</span>
                                </div>
                                <div className={styles.mockStat}>
                                    <span className={styles.mockStatNum}>12</span>
                                    <span className={styles.mockStatLabel}>Documentos<br />firmados hoy</span>
                                </div>
                                <div className={styles.mockStat}>
                                    <span className={styles.mockStatNum}>0</span>
                                    <span className={styles.mockStatLabel}>Tareas<br />manuales pendientes</span>
                                </div>
                            </div>
                            <div className={styles.mockPanelList}>
                                {[
                                    { name: 'García Pérez, L.', type: 'Modelo 303 · T2 2025', status: 'Listo' },
                                    { name: 'Torres Instalaciones', type: 'Modelo 130 · T2 2025', status: 'Firmado' },
                                    { name: 'Clínica Herrero S.L.', type: 'Modelo 111 · T2 2025', status: 'Revisando' },
                                    { name: 'Medina & Asociados', type: 'Modelo 390 · Anual', status: 'Listo' },
                                ].map((row) => (
                                    <div key={row.name} className={styles.mockRow}>
                                        <div className={styles.mockRowLeft}>
                                            <span className={styles.mockRowName}>{row.name}</span>
                                            <span className={styles.mockRowType}>{row.type}</span>
                                        </div>
                                        <span className={
                                            row.status === 'Listo' ? styles.mockStatusListo
                                            : row.status === 'Firmado' ? styles.mockStatusFirmado
                                            : styles.mockStatusRevisando
                                        }>{row.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.heroProofFloater}>
                            <Check size={13} strokeWidth={2.5} />
                            80% automatizado — activo desde hace 3 meses
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ MARQUESINA ═══ */}
            <aside className={styles.heroMarquee} aria-hidden="true">
                <div className={styles.heroMarqueeTrack}>
                    {[...Array(2)].map((_, i) => (
                        <div className={styles.heroMarqueeRow} key={i}>
                            <span className={styles.marqueeItem}><Code2 size={16} strokeWidth={1.5} /> Software a medida</span>
                            <span className={styles.marqueeItem}><LayoutGrid size={16} strokeWidth={1.5} /> Aplicaciones web y móvil</span>
                            <span className={styles.marqueeItem}><Sparkles size={16} strokeWidth={1.5} /> Asistentes inteligentes</span>
                            <span className={styles.marqueeItem}><Plug size={16} strokeWidth={1.5} /> Integraciones</span>
                            <span className={styles.marqueeItem}><Workflow size={16} strokeWidth={1.5} /> Automatización de procesos</span>
                            <span className={styles.marqueeItem}><Database size={16} strokeWidth={1.5} /> ERP y CRM a medida</span>
                            <span className={styles.marqueeItem}><Rocket size={16} strokeWidth={1.5} /> Modernización digital</span>
                        </div>
                    ))}
                </div>
            </aside>

            {/* ═══ TRUST BAR ═══ */}
            <section className={styles.clientBar} aria-label="Sectores atendidos">
                <div className={styles.container}>
                    <div className={styles.clientBarInner}>
                        <span className={styles.clientBarLabel}>Ya automatizando en:</span>
                        <ul className={styles.clientBarSectors}>
                            <li>Asesorías fiscales</li>
                            <li>Gestorías laborales</li>
                            <li>Energía y utilities</li>
                            <li>Reformas e instalaciones</li>
                            <li>Agencias de marketing</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ═══ MÉTRICAS — franja de números grandes ═══ */}
            <section className={styles.metricsStrip} aria-label="Resultados en cifras">
                <div className={styles.container}>
                    <div className={styles.metricsGrid}>
                        <div className={styles.metricItem}>
                            <span className={styles.metricNum}>12+</span>
                            <span className={styles.metricLabel}>proyectos entregados</span>
                        </div>
                        <div className={styles.metricDivider} aria-hidden="true" />
                        <div className={styles.metricItem}>
                            <span className={styles.metricNum}>200h+</span>
                            <span className={styles.metricLabel}>ahorradas por cliente</span>
                        </div>
                        <div className={styles.metricDivider} aria-hidden="true" />
                        <div className={styles.metricItem}>
                            <span className={styles.metricNum}>6 sem.</span>
                            <span className={styles.metricLabel}>tiempo medio de entrega</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PROBLEMA ═══ */}
            <section className={styles.problemSection}>
                <div className={styles.container} ref={problemRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>
                            Las herramientas que usas no fueron pensadas para ti.
                        </h2>
                    </header>
                    <div className={styles.problemGrid}>
                        <div className={`${styles.problemCard} reveal`}>
                            <div className={styles.problemIcon}>
                                <Layers size={22} strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <h3 className={styles.problemTitle}>Tu información vive en cuatro sitios</h3>
                            <p className={styles.problemText}>
                                Una app para esto, otra para aquello, el correo, la hoja de cálculo.
                                Los datos no cuadran y nadie sabe cuál es la versión buena.
                            </p>
                        </div>
                        <div className={`${styles.problemCard} reveal`}>
                            <div className={styles.problemIcon}>
                                <PencilRuler size={22} strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <h3 className={styles.problemTitle}>Lo importante lo llevas en hojas que se rompen</h3>
                            <p className={styles.problemText}>
                                Cosas que mueven dinero — presupuestos, comisiones, plazos —
                                viviendo en un Excel que se rompe al primer cambio.
                            </p>
                        </div>
                        <div className={`${styles.problemCard} reveal`}>
                            <div className={styles.problemIcon}>
                                <Workflow size={22} strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <h3 className={styles.problemTitle}>Tu equipo cambia de pestaña cada cinco minutos</h3>
                            <p className={styles.problemText}>
                                Cinco herramientas distintas para hacer un mismo trabajo. El tiempo
                                que se va en cambiar de contexto no lo recuperas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CASOS DE ÉXITO — carrusel ═══ */}
            <section className={styles.caseSection}>
                <div className={styles.container} ref={caseRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>
                            Lo que construimos ya está trabajando.
                        </h2>
                    </header>

                    <div
                        className={styles.caseCarousel}
                        onMouseEnter={() => setCarouselPaused(true)}
                        onMouseLeave={() => setCarouselPaused(false)}
                    >
                        {CASES.map((c, i) => {
                            const pos = getCasePosition(i);
                            return (
                                <article
                                    key={i}
                                    className={`${styles.caseCard} ${styles[`case_${pos}`]}`}
                                    onClick={() => pos !== 'current' && pos !== 'far' && setActiveCase(i)}
                                    aria-hidden={pos !== 'current'}
                                >
                                    <span className={styles.caseEyebrow}>{c.eyebrow}</span>
                                    <h3 className={styles.caseCardTitle}>{c.title}</h3>
                                    <p className={styles.caseCardSummary}>{c.summary}</p>
                                    <ul className={styles.caseCardBullets}>
                                        {c.bullets.map((b, j) => (
                                            <li key={j}>
                                                <span className={styles.caseCheck}><Check size={14} strokeWidth={2.2} /></span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.caseCardStats}>
                                        {c.stats.map((s, j) => (
                                            <div className={styles.caseStat} key={j}>
                                                <span className={styles.caseStatNumber}>{s.value}</span>
                                                <span className={styles.caseStatLabel}>{s.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.caseSource}>
                                        <div className={styles.caseSourceAvatar}>{c.source.initials}</div>
                                        <div className={styles.caseSourceInfo}>
                                            <p className={styles.caseSourceName}>{c.source.name} · {c.source.role}</p>
                                            <p className={styles.caseSourceCompany}>{c.source.company}</p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ POR QUÉ OPSPILOT ═══ */}
            <section className={styles.whySection}>
                <div className={styles.container} ref={whyRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>
                            Por qué no el software de catálogo.
                        </h2>
                    </header>
                    <div className={styles.whyGrid}>
                        <div className={`${styles.whyCol} ${styles.whyColGeneric} reveal`}>
                            <div className={styles.whyColHead}>
                                <span className={styles.whyColBadge}>Software genérico</span>
                            </div>
                            {[
                                'Te adaptas tú a la herramienta, no al revés',
                                'Pagas por funciones que nunca vas a usar',
                                'Soporte por tickets o foros en inglés',
                                '6–12 meses para ver resultados reales',
                                'Datos en silos sin conexión entre apps',
                                'Precio que sube cada año sin avisarte',
                            ].map((text, i) => (
                                <div className={styles.whyRow} key={i}>
                                    <span className={styles.whyIconNeg}><X size={13} strokeWidth={2.5} /></span>
                                    <span className={styles.whyRowText}>{text}</span>
                                </div>
                            ))}
                        </div>
                        <div className={`${styles.whyCol} ${styles.whyColOps} reveal`}>
                            <div className={styles.whyColHead}>
                                <span className={`${styles.whyColBadge} ${styles.whyColBadgeOps}`}>OpsPilot a medida</span>
                            </div>
                            {[
                                'El sistema se adapta exactamente a cómo trabajas',
                                'Solo pagas lo que tu negocio realmente necesita',
                                'Acceso directo al equipo que construyó tu sistema',
                                'Primeros resultados visibles en 4–6 semanas',
                                'Todo integrado en un solo sistema centralizado',
                                'Precio cerrado desde el día uno, sin sorpresas',
                            ].map((text, i) => (
                                <div className={styles.whyRow} key={i}>
                                    <span className={styles.whyIconPos}><Check size={13} strokeWidth={2.5} /></span>
                                    <span className={styles.whyRowText}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ MÉTODO ═══ */}
            <section className={styles.methodSection}>
                <div className={styles.container} ref={methodScrollRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>
                            Así trabajamos contigo.
                        </h2>
                    </header>
                    <div className={styles.processGrid}>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.processNumWrap}>
                                <span className={styles.processNumLabel}><MessagesSquare size={18} strokeWidth={1.6} /></span>
                            </div>
                            <h3 className={styles.stepTitle}>Te escuchamos</h3>
                            <p className={styles.stepText}>
                                Una llamada de 30 minutos para entender tu negocio y qué te
                                está frenando ahora mismo.
                            </p>
                        </div>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.processNumWrap}>
                                <span className={styles.processNumLabel}><Search size={18} strokeWidth={1.6} /></span>
                            </div>
                            <h3 className={styles.stepTitle}>Localizamos el problema</h3>
                            <p className={styles.stepText}>
                                Identificamos qué procesos te roban tiempo y qué pieza está
                                faltando en tu flujo.
                            </p>
                        </div>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.processNumWrap}>
                                <span className={styles.processNumLabel}><FileCheck size={18} strokeWidth={1.6} /></span>
                            </div>
                            <h3 className={styles.stepTitle}>Te proponemos algo concreto</h3>
                            <p className={styles.stepText}>
                                Plan claro con opciones reales, precio cerrado y plazos.
                                Tú decides si seguimos.
                            </p>
                        </div>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.processNumWrap}>
                                <span className={styles.processNumLabel}><Wrench size={18} strokeWidth={1.6} /></span>
                            </div>
                            <h3 className={styles.stepTitle}>Lo hacemos y nos quedamos</h3>
                            <p className={styles.stepText}>
                                Construimos, implementamos y seguimos contigo mientras
                                nos necesites.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={styles.container}>
                    <div className={sys.endCtaBlock} ref={ctaRef}>
                        <h2 className={sys.endCtaTitle}>¿Hablamos?</h2>
                        <p className={sys.endCtaSub}>
                            30 minutos. Sin compromiso. Te decimos qué tiene sentido
                            construir y qué no — sin venderte nada.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="primary" size="lg">Reservar diagnóstico</Button>
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
