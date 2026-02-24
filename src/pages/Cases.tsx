import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Cases.module.css';

export const Cases: React.FC = () => {
    const featuredRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const gridRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>Casos de Éxito</span>
                    <h1 className={styles.heroTitle}>
                        Empresas reales,{' '}
                        <span className="text-gradient">problemas resueltos.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        No hace falta ser una gran empresa para necesitar buenos procesos.
                        Aquí tienes lo que hemos hecho por empresas como la tuya.
                    </p>
                </div>
            </section>

            {/* Featured: J.R. Rodríguez */}
            <section className={styles.section}>
                <div className={styles.container} ref={featuredRef}>
                    <div className={styles.featured}>
                        <div className={`${styles.featuredContent} reveal`}>
                            <span className={styles.tag}>Caso destacado</span>
                            <span className={styles.sector}>Reformas</span>
                            <h2 className={styles.featuredTitle}>J.R. Rodríguez: De la libreta al sistema inteligente</h2>
                            <p className={styles.featuredText}>
                                Empresa familiar de reformas en Madrid. Lo gestionaban todo con Excel, llamadas y una libreta.
                                Diseñamos su marca desde cero, implementamos un CRM a medida, un presupuestador con IA
                                que genera imágenes realistas de reformas y citas automáticas vía WhatsApp.
                                En 3 meses triplicaron su capacidad de atención sin contratar a nadie más.
                            </p>
                            <div className={styles.statsRow}>
                                <div className={styles.stat}>
                                    <span className={styles.statNum}>-70%</span>
                                    <span className={styles.statLabel}>Tiempo en gestión</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statNum}>+3x</span>
                                    <span className={styles.statLabel}>Clientes atendidos</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statNum}>0€</span>
                                    <span className={styles.statLabel}>Inversión en personal</span>
                                </div>
                            </div>
                            <div className={styles.quote}>
                                <p>"Pasamos de perder presupuestos por falta de seguimiento a tener un sistema que trabaja solo."</p>
                                <span>— J.R. Rodríguez, CEO</span>
                            </div>
                        </div>
                        <div className={`${styles.featuredVisual} reveal`}>
                            <div className={`${styles.mockupPhone} anim-float-slow`}>
                                <div className={styles.mockupScreen}>
                                    <div className={styles.mockupBar}>
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div className={styles.mockupContent}>
                                        <div className={styles.mockupRow}><span>📋</span> Reforma cocina integral</div>
                                        <div className={styles.mockupRow}><span>🔧</span> Baño completo 12m²</div>
                                        <div className={styles.mockupRow}><span>🏠</span> Reforma integral piso</div>
                                    </div>
                                    <div className={`${styles.mockupBadge} anim-border-glow`}>💬 WhatsApp integrado</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* More cases */}
            <section className={styles.section}>
                <div className={styles.container} ref={gridRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>Más casos</h2>
                        <p className={styles.sectionSub}>Diferentes problemas, mismo compromiso.</p>
                    </div>
                    <div className={styles.grid}>
                        {[
                            {
                                sector: 'Sector energético',
                                title: 'Comercial de energía eléctrica',
                                desc: 'Le ayudamos a automatizar el análisis de facturas y la comparativa de tarifas. Lo que antes tardaba media hora por cliente, ahora lo hace en segundos.',
                                s1: '↓ 90%',
                                l1: 'Tiempo por análisis',
                                s2: '+2x',
                                l2: 'Cierre de contratos',
                            },
                            {
                                sector: '¿El siguiente eres tú?',
                                title: 'Cuéntanos tu caso',
                                desc: 'Analizamos tu negocio en 30 minutos y te proponemos un plan. El primer paso es gratis y sin compromiso.',
                                s1: '30',
                                l1: 'minutos',
                                s2: '0€',
                                l2: 'sin compromiso',
                            },
                        ].map((c) => (
                            <div key={c.title} className={`${styles.caseCard} reveal`}>
                                <span className={styles.caseSector}>{c.sector}</span>
                                <h3 className={styles.caseTitle}>{c.title}</h3>
                                <p className={styles.caseDesc}>{c.desc}</p>
                                <div className={styles.caseStats}>
                                    <div className={styles.caseStat}>
                                        <span className={styles.caseStatNum}>{c.s1}</span>
                                        <span className={styles.caseStatLabel}>{c.l1}</span>
                                    </div>
                                    <div className={styles.caseStat}>
                                        <span className={styles.caseStatNum}>{c.s2}</span>
                                        <span className={styles.caseStatLabel}>{c.l2}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={`${styles.ctaBlock} reveal`} ref={ctaRef}>
                        <h2 className={styles.ctaTitle}>¿Tu empresa podría ser la siguiente?</h2>
                        <p className={styles.ctaSub}>Analizamos tu situación en 30 minutos y te decimos qué podríamos hacer por ti. Sin compromiso.</p>
                        <div className={styles.ctaRow}>
                            <Link to="/contact"><Button variant="primary" size="lg">Empezar mi diagnóstico gratuito</Button></Link>
                            <Link to="/services"><Button variant="outline" size="lg">Ver servicios</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
