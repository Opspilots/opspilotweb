import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ROUTES } from '../lib/routes';
import sys from '../styles/page-system.module.css';
import styles from './Soluciones.module.css';

import { ClipboardList, Zap, Building2, Target, Globe, Settings, Check, ArrowRight } from 'lucide-react';

const sectores = [
    {
        icon: <ClipboardList size={26} strokeWidth={1.6} />,
        title: 'Asesorías y despachos profesionales',
        who: 'Gestorías, asesorías fiscales, laborales y legales',
        solution: 'Automatización documental — flujos de firma, comunicación y archivo digital sin fricciones',
        benefits: ['Documentos sin papel', 'Seguimiento en tiempo real', 'Clientes siempre informados'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Zap size={26} strokeWidth={1.6} />,
        title: 'Empresas de energía y comercializadoras',
        who: 'Comerciales y back-office de energía eléctrica y gas',
        solution: 'Análisis de tarifas y onboarding digital — propuesta instantánea, cartera centralizada y gestión automatizada',
        benefits: ['Análisis en segundos', 'Propuestas sin errores', 'Pipeline de clientes claro'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Building2 size={26} strokeWidth={1.6} />,
        title: 'Reformas, instalaciones y oficios',
        who: 'Empresas de construcción, fontanería, electricidad y climatización',
        solution: 'Presupuestación y seguimiento de obra — de la visita al cobro sin llamadas innecesarias',
        benefits: ['Presupuestos en 2 minutos', 'Clientes sin llamadas extras', 'Cobros sin perseguir'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Target size={26} strokeWidth={1.6} />,
        title: 'Agencias y negocios de servicios',
        who: 'Agencias de marketing, consultoras y equipos de servicios recurrentes',
        solution: 'CRM y gestión de proyectos — pipeline visual, seguimientos automáticos y cero leads perdidos',
        benefits: ['Nada se pierde', 'Pipeline siempre actualizado', 'Menos tiempo administrativo'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Globe size={26} strokeWidth={1.6} />,
        title: 'PYMEs con operativa dispersa',
        who: 'Empresas que gestionan con Excel, llamadas y WhatsApp',
        solution: 'Centralización operativa — una sola herramienta para empleados, tareas, proveedores y analítica',
        benefits: ['Control total en un sitio', 'Decisiones con datos reales', 'Menos caos operativo'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
    {
        icon: <Settings size={26} strokeWidth={1.6} />,
        title: 'Procesos únicos sin solución estándar',
        who: 'Cualquier empresa con un flujo específico que el software del mercado no resuelve',
        solution: 'Desarrollo a medida — analizamos tu caso, lo construimos para ti y lo mantenemos vivo',
        benefits: ['100% adaptado a ti', 'Integrado con lo que ya tienes', 'Escalable sin límites'],
        cta: 'Cuéntanos tu caso',
        href: ROUTES.contacto,
    },
];

export const Soluciones: React.FC = () => {
    const gridRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <div className={sys.page}>
            {/* Hero */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <span className={sys.pageHeroEyebrow}>Soluciones</span>
                        <h1 className={sys.pageHeroTitle}>
                            ¿En qué sector{' '}
                            <em className={sys.pageHeroAccent}>opera tu negocio?</em>
                        </h1>
                        <p className={sys.pageHeroSubtitle}>
                            Conocemos de cerca la operativa de estos sectores. Cuéntanos dónde
                            estás y te decimos exactamente qué podemos hacer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sectores grid */}
            <section className={sys.section}>
                <div className={sys.container}>
                    <div className={styles.grid} ref={gridRef}>
                        {sectores.map((s) => (
                            <article key={s.title} className={`${styles.card} reveal`}>
                                <div className={styles.cardIcon}>{s.icon}</div>
                                <h2 className={styles.cardTitle}>{s.title}</h2>
                                <p className={styles.cardWho}>
                                    <span className={styles.whoLabel}>Para</span> {s.who}
                                </p>
                                <p className={styles.cardSolution}>{s.solution}</p>
                                <ul className={styles.benefitsList}>
                                    {s.benefits.map(b => (
                                        <li key={b}>
                                            <span className={styles.check}>
                                                <Check size={12} strokeWidth={2.4} />
                                            </span>
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                                <Link className={styles.cardLink} to={s.href}>
                                    {s.cta}
                                    <ArrowRight size={16} strokeWidth={2} />
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bloque de cierre */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
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
