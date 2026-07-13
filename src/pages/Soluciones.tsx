import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ROUTES } from '../lib/routes';
import sys from '../styles/page-system.module.css';
import styles from './Soluciones.module.css';
import { TextLink } from '../components/common/TextLink';

import { ClipboardList, Zap, Building2, Target, Globe, Settings, Check } from 'lucide-react';

const sectores = [
    {
        icon: <ClipboardList size={20} strokeWidth={1.6} />,
        title: 'Asesorías y despachos profesionales',
        who: 'Gestorías, asesorías fiscales, laborales y legales',
        solution: 'Automatización documental — flujos de firma, comunicación y archivo digital sin fricciones',
        benefits: ['Documentos sin papel', 'Seguimiento en tiempo real', 'Clientes siempre informados'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Zap size={20} strokeWidth={1.6} />,
        title: 'Empresas de energía y comercializadoras',
        who: 'Comerciales y back-office de energía eléctrica y gas',
        solution: 'Análisis de tarifas y onboarding digital — propuesta instantánea, cartera centralizada y gestión automatizada',
        benefits: ['Análisis en segundos', 'Propuestas sin errores', 'Pipeline de clientes claro'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Building2 size={20} strokeWidth={1.6} />,
        title: 'Reformas, instalaciones y oficios',
        who: 'Empresas de construcción, fontanería, electricidad y climatización',
        solution: 'Presupuestación y seguimiento de obra — de la visita al cobro sin llamadas innecesarias',
        benefits: ['Presupuestos en 2 minutos', 'Clientes sin llamadas extras', 'Cobros sin perseguir'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Target size={20} strokeWidth={1.6} />,
        title: 'Agencias y negocios de servicios',
        who: 'Agencias de marketing, consultoras y equipos de servicios recurrentes',
        solution: 'CRM y gestión de proyectos — pipeline visual, seguimientos automáticos y cero leads perdidos',
        benefits: ['Nada se pierde', 'Pipeline siempre actualizado', 'Menos tiempo administrativo'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Globe size={20} strokeWidth={1.6} />,
        title: 'PYMEs con operativa dispersa',
        who: 'Empresas que gestionan con Excel, llamadas y WhatsApp',
        solution: 'Centralización operativa — una sola herramienta para empleados, tareas, proveedores y analítica',
        benefits: ['Control total en un sitio', 'Decisiones con datos reales', 'Menos caos operativo'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Settings size={20} strokeWidth={1.6} />,
        title: 'Procesos únicos sin solución estándar',
        who: 'Cualquier empresa con un flujo específico que el software del mercado no resuelve',
        solution: 'Desarrollo a medida — analizamos tu caso, lo construimos para ti y lo mantenemos vivo',
        benefits: ['100% adaptado a ti', 'Integrado con lo que ya tienes', 'Escalable sin límites'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
];

export const Soluciones: React.FC = () => {
    usePageSEO({
        title: 'Soluciones por sector — Asesorías, energía, obra y agencias · OpsPilot',
        description: 'Soluciones digitales adaptadas a tu sector: asesorías y despachos, comercializadoras de energía, reformas e instalaciones, agencias y PYMEs. Tecnología que encaja con cómo trabajas.',
        canonical: 'https://opspilot.es/soluciones',
    });

    const heroRef = useHeroReveal<HTMLDivElement>();

    const listRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    const prefersReducedMotion = usePrefersReducedMotion();
    const [selected, setSelected] = useState(0);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const active = sectores[selected];

    const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const count = sectores.length;
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

    // Keep the active pill fully visible inside the horizontally-scrolling
    // tab row on sub-1024px layouts (mobile/tablet). `inline: 'center'`
    // scrolls the tabList's own scroll container; `block: 'nearest'` keeps
    // vertical page scroll untouched since the tab is already in the
    // vertical viewport.
    useEffect(() => {
        tabRefs.current[selected]?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    }, [selected, prefersReducedMotion]);

    return (
        <div className={sys.page}>
            {/* Hero */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} ${styles.heroTitle} reveal`}>
                            ¿En qué sector{' '}
                            <em className={sys.pageHeroAccent}>opera tu negocio?</em>
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            Conocemos de cerca la operativa de estos sectores. Cuéntanos dónde
                            estás y te decimos exactamente qué podemos hacer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sectores — pill selector + detail panel */}
            <section className={sys.section}>
                <div className={sys.container}>
                    <div className={styles.switcher} ref={listRef}>
                        <div
                            className={styles.tabList}
                            role="tablist"
                            aria-label="Sectores"
                            aria-orientation="vertical"
                        >
                            {sectores.map((s, i) => (
                                <button
                                    key={s.title}
                                    ref={(el) => { tabRefs.current[i] = el; }}
                                    type="button"
                                    role="tab"
                                    id={`sector-tab-${i}`}
                                    aria-selected={i === selected}
                                    aria-controls={`sector-panel-${i}`}
                                    tabIndex={i === selected ? 0 : -1}
                                    className={`${styles.tab} ${i === selected ? styles.tabActive : ''} reveal`}
                                    onClick={() => setSelected(i)}
                                    onKeyDown={(e) => handleTabKeyDown(e, i)}
                                >
                                    <span className={styles.tabIndex}>{String(i + 1).padStart(2, '0')}</span>
                                    <span className={styles.tabTitle}>{s.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className={styles.panelWrap}>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={selected}
                                    id={`sector-panel-${selected}`}
                                    role="tabpanel"
                                    aria-labelledby={`sector-tab-${selected}`}
                                    tabIndex={0}
                                    className={styles.panel}
                                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                                    transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.32, 0.72, 0, 1] }}
                                >
                                    <div className={styles.panelHead}>
                                        <div className={styles.panelIcon}>{active.icon}</div>
                                        <div>
                                            <span className={styles.panelIndex}>{String(selected + 1).padStart(2, '0')}</span>
                                            <h2 className={styles.panelTitle}>{active.title}</h2>
                                        </div>
                                    </div>

                                    <p className={styles.panelWho}>
                                        <span className={styles.whoLabel}>Para</span> {active.who}
                                    </p>

                                    <p className={styles.panelSolution}>{active.solution}</p>

                                    <ul className={styles.benefitsList}>
                                        {active.benefits.map(b => (
                                            <li key={b}>
                                                <span className={styles.check}>
                                                    <Check size={11} strokeWidth={2.5} />
                                                </span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>

                                    <TextLink to={active.href} tone="muted" size="sm">
                                        {active.cta}
                                    </TextLink>
                                </motion.div>
                            </AnimatePresence>
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
