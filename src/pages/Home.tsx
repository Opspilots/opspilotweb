import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCountUp } from '../hooks/useCountUp';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import {
    LayoutGrid,
    Sparkles,
    Plug,
    Workflow,
    Database,
    Rocket,
    Code2,
    MessagesSquare,
    Search,
    FileCheck,
    Wrench,
    Layers,
    PencilRuler,
    Check,
    ArrowRight,
    ClipboardList,
    Zap,
    Building2,
    Target,
    ArrowUpRight,
} from 'lucide-react';
import styles from './Home.module.css';
import sys from '../styles/page-system.module.css';
import Aurora from '../components/common/Aurora';

gsap.registerPlugin(ScrollTrigger);

const ROTATING_WORDS = [
    'PYMEs españolas',
    'tu fiscalidad',
    'tu sector energético',
    'tus obras',
    'tus agencias',
    'lo que necesites',
];
const ROTATOR_SPACER = ROTATING_WORDS.reduce((a, b) => (a.length >= b.length ? a : b));

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
    },
];

const VERTICALS = [
    {
        icon: <ClipboardList size={22} strokeWidth={1.6} />,
        label: 'Asesorías fiscales',
        claim: 'Cierra el mes sin carreras — tu equipo revisa, la IA prepara.',
        color: 'mint',
        href: ROUTES.soluciones,
    },
    {
        icon: <Zap size={22} strokeWidth={1.6} />,
        label: 'Sector energético',
        claim: 'Analiza tarifas y onboarding en segundos, no en días.',
        color: 'warm',
        href: ROUTES.soluciones,
    },
    {
        icon: <Building2 size={22} strokeWidth={1.6} />,
        label: 'Empresas de obra',
        claim: 'De la visita al cobro sin una sola llamada de seguimiento.',
        color: 'blue',
        href: ROUTES.soluciones,
    },
    {
        icon: <Target size={22} strokeWidth={1.6} />,
        label: 'Agencias y servicios',
        claim: 'Un sistema que sustituye cinco herramientas y no pierde nada.',
        color: 'violet',
        href: ROUTES.soluciones,
    },
];

/* Simple terminal component — CSS-only typewriter feel */
const TerminalDemo: React.FC = () => (
    <div className={styles.terminal} aria-hidden="true">
        <div className={styles.terminalBar}>
            <span className={`${styles.terminalDot} ${styles.terminalRed}`} />
            <span className={`${styles.terminalDot} ${styles.terminalYellow}`} />
            <span className={`${styles.terminalDot} ${styles.terminalGreen}`} />
            <span className={styles.terminalTitle}>agente.opspilot</span>
        </div>
        <div className={styles.terminalBody}>
            <p className={`${styles.terminalLine} ${styles.terminalCmd}`}>
                <span className={styles.terminalPrompt}>›</span> agenda --confirm mañana 10:00
            </p>
            <p className={`${styles.terminalLine} ${styles.terminalOk} ${styles.terminalDelay1}`}>
                <span className={styles.terminalCheck}>✓</span> Reunión confirmada · López &amp; Asociados
            </p>
            <p className={`${styles.terminalLine} ${styles.terminalCmd} ${styles.terminalDelay2}`}>
                <span className={styles.terminalPrompt}>›</span> informe --mes mayo --pdf
            </p>
            <p className={`${styles.terminalLine} ${styles.terminalOk} ${styles.terminalDelay3}`}>
                <span className={styles.terminalCheck}>✓</span> Informe generado y enviado por email
            </p>
            <p className={`${styles.terminalLine} ${styles.terminalCmd} ${styles.terminalDelay4}`}>
                <span className={styles.terminalPrompt}>›</span> presupuesto --auto --cliente nuevo
            </p>
            <p className={`${styles.terminalLine} ${styles.terminalOk} ${styles.terminalDelay5}`}>
                <span className={styles.terminalCheck}>✓</span> 3 presupuestos enviados automáticamente
            </p>
            <p className={`${styles.terminalLine} ${styles.terminalCursor} ${styles.terminalDelay6}`}>
                <span className={styles.terminalPrompt}>›</span>
                <span className={styles.terminalBlink}>▌</span>
            </p>
        </div>
    </div>
);

export const Home: React.FC = () => {
    usePageSEO({
        title: 'OpsPilot — Software a medida y productos verticales para PYMEs en España',
        description: 'Diseñamos y construimos contigo el software que tu empresa necesita. Trato cercano, presupuesto cerrado, respuesta en menos de 24h. Productos verticales (fiscalidad, energía, obra, ERP) y desarrollo a medida.',
        canonical: 'https://opspilot.es/',
    });

    const heroRef = useRef<HTMLDivElement>(null);
    const rotatorRef = useRef<HTMLSpanElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);

    const problemRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const buildRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const verticalsRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const methodScrollRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const caseRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    const [activeCase, setActiveCase] = useState(0);
    const [carouselPaused, setCarouselPaused] = useState(false);

    /* Count-up refs for stats strip */
    const statProjects = useCountUp<HTMLSpanElement>({ end: 20, duration: 1.6, format: n => `${Math.round(n)}+` });
    const statResp = useCountUp<HTMLSpanElement>({ end: 24, duration: 1.2, format: n => `<${Math.round(n)}h` });
    const statBudget = useCountUp<HTMLSpanElement>({ end: 100, duration: 1.8, format: n => `${Math.round(n)}%` });

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
                tl.from(`.${styles.heroBadge}`, { opacity: 0, y: -14, duration: 0.6 })
                    .from(`.${styles.heroTitle} .${styles.heroLine}`, {
                        opacity: 0, y: 32, duration: 0.95, stagger: 0.1,
                    }, '-=0.3')
                    .from(`.${styles.heroSubtitle}`, { opacity: 0, y: 18, duration: 0.7 }, '-=0.55')
                    .from(`.${styles.ctaGroup} > *`, { opacity: 0, y: 14, duration: 0.55, stagger: 0.08 }, '-=0.45')
                    .from(`.${styles.trustList} li`, { opacity: 0, y: 10, duration: 0.5, stagger: 0.06 }, '-=0.35');
            }

            if (rotatorRef.current && !reduce) {
                const el = rotatorRef.current;
                el.textContent = ROTATING_WORDS[0];
                gsap.set(el, { yPercent: 0, opacity: 1 });
                const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' }, delay: 2.6 });
                ROTATING_WORDS.forEach((_, i) => {
                    const next = ROTATING_WORDS[(i + 1) % ROTATING_WORDS.length];
                    tl.to(el, { yPercent: -100, opacity: 0, duration: 0.5 })
                        .set(el, { textContent: next, yPercent: 100 })
                        .to(el, { yPercent: 0, opacity: 1, duration: 0.5 })
                        .to({}, { duration: 2.6 });
                });
            } else if (rotatorRef.current) {
                rotatorRef.current.textContent = ROTATING_WORDS[0];
            }

            if (!reduce && !window.matchMedia?.('(hover: none)').matches && heroRef.current && spotlightRef.current) {
                const xTo = gsap.quickTo(spotlightRef.current, '--mx' as any, { duration: 0.4, ease: 'power3.out' });
                const yTo = gsap.quickTo(spotlightRef.current, '--my' as any, { duration: 0.4, ease: 'power3.out' });
                const onMove = (e: MouseEvent) => {
                    if (!heroRef.current) return;
                    const r = heroRef.current.getBoundingClientRect();
                    xTo(((e.clientX - r.left) / r.width) * 100);
                    yTo(((e.clientY - r.top) / r.height) * 100);
                };
                heroRef.current.addEventListener('mousemove', onMove);
                return () => heroRef.current?.removeEventListener('mousemove', onMove);
            }

        }, heroRef);

        return () => ctx.revert();
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
                <div className={styles.heroSpotlight} ref={spotlightRef} aria-hidden="true" />

                <div className={styles.heroInner}>
                    <div className={styles.heroContentCentered}>
                        {/* Announcement badge */}
                        <a href={ROUTES.soluciones} className={styles.heroBadge}>
                            <span className={styles.heroBadgeDot} aria-hidden="true" />
                            Soluciones por sector — fiscal, energía, obra, agencias
                            <ArrowRight size={13} strokeWidth={2} />
                        </a>

                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroLine}>Construimos software</span>
                            <span className={styles.heroLine}>
                                a medida para{' '}
                                <span className={styles.rotator}>
                                    <span className={styles.rotatorSpacer} aria-hidden="true">{ROTATOR_SPACER}</span>
                                    <span className={styles.rotatorWord} ref={rotatorRef}>{ROTATING_WORDS[0]}</span>
                                </span>
                            </span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Empresa de desarrollo de software en España. Diseñamos, construimos y
                            mantenemos las herramientas digitales que tu negocio necesita —
                            no las que te quieren vender.
                        </p>
                        <div className={styles.ctaGroup}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="primary" size="lg">Reservar diagnóstico</Button>
                            </Link>
                            <Link to={ROUTES.servicios} className={styles.ctaSecondary}>
                                Cómo trabajamos <ArrowRight size={16} strokeWidth={2} />
                            </Link>
                        </div>
                        <ul className={styles.trustList} aria-label="Garantías">
                            <li>
                                <span className={styles.trustDot} aria-hidden="true" />
                                Diagnóstico gratuito
                            </li>
                            <li>
                                <span className={styles.trustDot} aria-hidden="true" />
                                Respuesta &lt; 24h laborables
                            </li>
                            <li>
                                <span className={styles.trustDot} aria-hidden="true" />
                                Equipo en España
                            </li>
                            <li>
                                <span className={styles.trustDot} aria-hidden="true" />
                                Sin compromiso
                            </li>
                        </ul>
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

            {/* ═══ STATS STRIP ═══ */}
            <section className={styles.statsStrip} aria-label="En números">
                <div className={styles.container}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statNum} ref={statProjects}>20+</span>
                            <span className={styles.statDesc}>proyectos entregados</span>
                        </div>
                        <div className={styles.statDivider} aria-hidden="true" />
                        <div className={styles.statItem}>
                            <span className={styles.statNum} ref={statResp}>&lt;24h</span>
                            <span className={styles.statDesc}>tiempo de respuesta garantizado</span>
                        </div>
                        <div className={styles.statDivider} aria-hidden="true" />
                        <div className={styles.statItem}>
                            <span className={styles.statNum} ref={statBudget}>100%</span>
                            <span className={styles.statDesc}>presupuestos cerrados respetados</span>
                        </div>
                        <div className={styles.statDivider} aria-hidden="true" />
                        <div className={styles.statItem}>
                            <span className={styles.statNum}>🇪🇸</span>
                            <span className={styles.statDesc}>equipo 100% en España</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PROBLEMA ═══ */}
            <section className={styles.problemSection}>
                <div className={styles.container} ref={problemRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.eyebrow}>
                            <span className={styles.eyebrowDot} />
                            Por qué nos eligen
                        </span>
                        <h2 className={styles.sectionTitle}>
                            Las herramientas que usas no fueron pensadas para ti.
                        </h2>
                    </header>
                    <div className={styles.problemGrid}>
                        <div className={`${styles.problemCard} reveal`}>
                            <div className={styles.problemNum} aria-hidden="true">01</div>
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
                            <div className={styles.problemNum} aria-hidden="true">02</div>
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
                            <div className={styles.problemNum} aria-hidden="true">03</div>
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

            {/* ═══ QUÉ HACEMOS — BENTO ═══ */}
            <section className={styles.buildSection}>
                <div className={styles.container} ref={buildRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.eyebrow}>
                            <span className={styles.eyebrowDot} />
                            Qué hacemos
                        </span>
                        <h2 className={styles.sectionTitle}>
                            Construimos lo que tu negocio necesita.
                        </h2>
                    </header>
                    <div className={styles.buildBento}>
                        {/* Featured: IA card (2/3 ancho) con terminal */}
                        <article className={`${styles.buildCardFeatured} reveal`}>
                            <div className={styles.buildCardFeaturedContent}>
                                <div className={styles.buildIcon}><Sparkles size={22} strokeWidth={1.5} /></div>
                                <h3 className={styles.buildCardTitle}>Asistentes que trabajan por ti</h3>
                                <p className={styles.buildCardText}>
                                    IA que opera tu negocio, no que solo te responde preguntas.
                                    Cierra agendas, prepara informes y avisa cuando hace falta.
                                </p>
                            </div>
                            <TerminalDemo />
                        </article>

                        {/* Secondary: apps card (1/3 ancho) */}
                        <article className={`${styles.buildCard} reveal`}>
                            <div className={styles.buildIcon}><LayoutGrid size={22} strokeWidth={1.5} /></div>
                            <h3 className={styles.buildCardTitle}>Apps y sitios para tu equipo</h3>
                            <p className={styles.buildCardText}>
                                La herramienta donde tu equipo trabaja todos los días — fácil de usar,
                                rápida y pensada para cómo trabajáis vosotros.
                            </p>
                        </article>

                        {/* Row 2: 4 cards iguales */}
                        <article className={`${styles.buildCard} reveal`}>
                            <div className={styles.buildIcon}><Plug size={22} strokeWidth={1.5} /></div>
                            <h3 className={styles.buildCardTitle}>Conectamos tus herramientas</h3>
                            <p className={styles.buildCardText}>
                                Que el banco, el correo y las apps que ya usas hablen entre sí
                                para que los datos no se pierdan ni se dupliquen.
                            </p>
                        </article>
                        <article className={`${styles.buildCard} reveal`}>
                            <div className={styles.buildIcon}><Workflow size={22} strokeWidth={1.5} /></div>
                            <h3 className={styles.buildCardTitle}>Automatizamos lo aburrido</h3>
                            <p className={styles.buildCardText}>
                                Las tareas repetitivas que nadie quiere hacer — gestionadas solas,
                                sin errores ni horas perdidas.
                            </p>
                        </article>
                        <article className={`${styles.buildCard} reveal`}>
                            <div className={styles.buildIcon}><Database size={22} strokeWidth={1.5} /></div>
                            <h3 className={styles.buildCardTitle}>Tu sistema de gestión a medida</h3>
                            <p className={styles.buildCardText}>
                                Cuando lo estándar es excesivo o demasiado genérico, construimos
                                el sistema que encaja con cómo funciona tu empresa.
                            </p>
                        </article>
                        <article className={`${styles.buildCard} reveal`}>
                            <div className={styles.buildIcon}><Rocket size={22} strokeWidth={1.5} /></div>
                            <h3 className={styles.buildCardTitle}>Migrar al siguiente nivel</h3>
                            <p className={styles.buildCardText}>
                                Sacar tu negocio de hojas de cálculo y suscripciones sueltas
                                sin perder un dato y sin parar la operativa.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ═══ VERTICALES ═══ */}
            <section className={styles.verticalsSection}>
                <div className={styles.container} ref={verticalsRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.eyebrow}>
                            <span className={styles.eyebrowDot} />
                            Soluciones por sector
                        </span>
                        <h2 className={styles.sectionTitle}>
                            Conocemos tu sector. Ya lo hemos resuelto antes.
                        </h2>
                    </header>
                    <div className={styles.verticalsGrid}>
                        {VERTICALS.map((v, i) => (
                            <Link
                                key={i}
                                to={v.href}
                                className={`${styles.verticalCard} ${styles[`verticalCard_${v.color}`]} reveal`}
                            >
                                <div className={styles.verticalIconWrap}>
                                    {v.icon}
                                </div>
                                <h3 className={styles.verticalLabel}>{v.label}</h3>
                                <p className={styles.verticalClaim}>{v.claim}</p>
                                <span className={styles.verticalArrow} aria-hidden="true">
                                    <ArrowUpRight size={16} strokeWidth={2} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ MÉTODO ═══ */}
            <section className={styles.methodSection}>
                <div className={styles.container} ref={methodScrollRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.eyebrow}>
                            <span className={styles.eyebrowDot} />
                            Cómo trabajamos
                        </span>
                        <h2 className={styles.sectionTitle}>
                            Así trabajamos contigo.
                        </h2>
                    </header>
                    <div className={styles.processGrid}>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.processNumWrap}>
                                <span className={styles.processNumBg} aria-hidden="true">01</span>
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
                                <span className={styles.processNumBg} aria-hidden="true">02</span>
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
                                <span className={styles.processNumBg} aria-hidden="true">03</span>
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
                                <span className={styles.processNumBg} aria-hidden="true">04</span>
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

            {/* ═══ CASOS DE ÉXITO — carrusel ═══ */}
            <section className={styles.caseSection}>
                <div className={styles.container} ref={caseRef}>
                    <header className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.eyebrow}>
                            <span className={styles.eyebrowDot} />
                            Casos de éxito
                        </span>
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
                                </article>
                            );
                        })}
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
                            <Link to={ROUTES.servicios}>
                                <Button variant="outline" size="lg">Ver cómo trabajamos</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
