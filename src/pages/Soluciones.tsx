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

import { ClipboardList, Zap, Building2, Target, Globe, Settings } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Sector {
    icon: React.ReactNode;
    label: string;
    title: string;
    who: string;
    solution: string;
    benefits: string[];
    cta: string;
    href: string;
}

const sectores: Sector[] = [
    {
        icon: <ClipboardList size={22} strokeWidth={1.6} />,
        label: 'Asesorías y despachos',
        title: 'Asesorías y despachos profesionales',
        who: 'Gestorías, asesorías fiscales, laborales y legales',
        solution: 'Software para asesorías y despachos que automatiza firma, comunicación y archivo documental. Adiós al papeleo.',
        benefits: ['Documentos sin papel', 'Seguimiento en tiempo real', 'Clientes siempre informados'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Zap size={22} strokeWidth={1.6} />,
        label: 'Energía y comercializadoras',
        title: 'Empresas de energía y comercializadoras',
        who: 'Comerciales y back-office de energía eléctrica y gas',
        solution: 'CRM para comercializadoras de energía: comparas tarifas al instante, digitalizas el alta y centralizas la cartera.',
        benefits: ['Análisis en segundos', 'Propuestas sin errores', 'Pipeline de clientes claro'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Building2 size={22} strokeWidth={1.6} />,
        label: 'Reformas e instalaciones',
        title: 'Reformas, instalaciones y oficios',
        who: 'Empresas de construcción, fontanería, electricidad y climatización',
        solution: 'Software para reformas e instalaciones: presupuestas en la visita y sigues la obra hasta el cobro. Sin llamadas de más.',
        benefits: ['Presupuestos en 2 minutos', 'Clientes sin llamadas extras', 'Cobros sin perseguir'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Target size={22} strokeWidth={1.6} />,
        label: 'Agencias y servicios',
        title: 'Agencias y negocios de servicios',
        who: 'Agencias de marketing, consultoras y equipos de servicios recurrentes',
        solution: 'Software de gestión para agencias de servicios: pipeline visual, seguimientos automáticos y cero leads perdidos.',
        benefits: ['Nada se pierde', 'Pipeline siempre actualizado', 'Menos tiempo administrativo'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Globe size={22} strokeWidth={1.6} />,
        label: 'PYMEs con operativa dispersa',
        title: 'PYMEs con operativa dispersa',
        who: 'Empresas que gestionan con Excel, llamadas y WhatsApp',
        solution: 'Digitalización de PYMEs en una sola herramienta: empleados, tareas, proveedores y analítica, todo junto.',
        benefits: ['Control total en un sitio', 'Decisiones con datos reales', 'Menos caos operativo'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Settings size={22} strokeWidth={1.6} />,
        label: 'Procesos únicos a medida',
        title: 'Procesos únicos sin solución estándar',
        who: 'Cualquier empresa con un flujo específico que el software del mercado no resuelve',
        solution: 'Software a medida: analizamos tu flujo, lo construimos para ti y lo mantenemos vivo con tu negocio.',
        benefits: ['100% adaptado a ti', 'Integrado con lo que ya tienes', 'Escalable sin límites'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
];

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
    const active = sectores[selected];

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
                        sectores.length - 1,
                        Math.floor(self.progress * sectores.length),
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
                                            className={`${styles.row} ${i === selected ? styles.rowActive : ''}`}
                                            onClick={() => setSelected(i)}
                                            onKeyDown={(e) => handleTabKeyDown(e, i)}
                                        >
                                            <span className={styles.rowIcon} aria-hidden="true">{s.icon}</span>
                                            <span className={styles.rowLabel}>{s.label}</span>
                                            <ArrowRight size={15} strokeWidth={2} className={styles.rowArrow} aria-hidden="true" />
                                        </button>
                                    ))}
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
                                            <div className={styles.panelIcon} aria-hidden="true">{active.icon}</div>

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
                                                <Link to={active.href}>
                                                    <Button variant="primary" size="lg">
                                                        {active.cta}
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
