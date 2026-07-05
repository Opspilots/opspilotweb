import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import { SceneCanvas } from '../components/three/SceneCanvas';
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

    return (
        <div className={sys.page}>
            {/* Hero */}
            <section className={sys.pageHero}>
                <SceneCanvas
                    loader={() => import('../components/three/scenes/PrimitiveHeroScene')}
                    sceneProps={{
                        color: '#39ce86',
                        shapes: [
                            {
                                kind: 'icosahedron',
                                position: [1.6, 0.4, -0.4],
                                radius: 0.62,
                                spinSpeed: [0.07, 0.05],
                                driftAmp: 0.12,
                                driftSpeed: 0.18,
                                phase: 0,
                            },
                            {
                                kind: 'octahedron',
                                position: [-1.5, -0.5, -1],
                                radius: 0.4,
                                spinSpeed: [-0.05, 0.08],
                                driftAmp: 0.16,
                                driftSpeed: 0.14,
                                phase: 2.1,
                            },
                        ],
                    }}
                    fallback={<div className={styles.sceneFallback} />}
                    className={styles.heroScene}
                />
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

            {/* Sectores — editorial list */}
            <section className={sys.section}>
                <div className={sys.container}>
                    <div className={styles.list} ref={listRef}>
                        {sectores.map((s) => (
                            <article key={s.title} className={`${styles.row} reveal`}>
                                <div className={styles.rowMain}>
                                    <div className={styles.rowIcon}>{s.icon}</div>
                                    <h2 className={styles.rowTitle}>{s.title}</h2>
                                    <p className={styles.rowWho}>
                                        <span className={styles.whoLabel}>Para</span> {s.who}
                                    </p>
                                </div>

                                <div className={styles.rowSolutionWrap}>
                                    <p className={styles.rowSolution}>{s.solution}</p>
                                </div>

                                <div className={styles.rowActions}>
                                    <ul className={styles.benefitsList}>
                                        {s.benefits.map(b => (
                                            <li key={b}>
                                                <span className={styles.check}>
                                                    <Check size={11} strokeWidth={2.5} />
                                                </span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                    <TextLink to={s.href} tone="muted" size="sm">
                                        {s.cta}
                                    </TextLink>
                                </div>
                            </article>
                        ))}
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
                                <Button variant="primary" size="lg">Reservar diagnóstico gratuito</Button>
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
