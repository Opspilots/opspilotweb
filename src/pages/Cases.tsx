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
                        Historias reales,{' '}
                        <span className="text-gradient">resultados medibles.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        No te pedimos un acto de fe. Te enseñamos qué problemas tenían otras empresas y cómo los resolvimos con datos y rentabilidad.
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
                                Empresa familiar de reformas en Madrid. Gestionaban todo con Excel, llamadas y libretas.
                                Con OpsPilot implementamos un CRM a medida, presupuestador con IA y sistema de citas
                                automatizado vía WhatsApp. En 3 meses triplicaron su capacidad de atención sin contratar personal.
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
                        <h2 className={styles.sectionTitle}>Más historias en proceso</h2>
                        <p className={styles.sectionSub}>Estamos trabajando en nuevos casos de éxito. Pronto compartiremos más resultados reales.</p>
                    </div>
                    <div className={styles.grid}>
                        <div className={`${styles.caseCard} reveal`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gridColumn: '1 / -1', border: '1px dashed rgba(255,255,255,0.1)', background: 'transparent' }}>
                            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</span>
                            <h3 className={styles.caseTitle}>Construyendo nuevos casos</h3>
                            <p className={styles.caseDesc} style={{ textAlign: 'center', color: 'var(--color-dark-text-muted)' }}>Nuestros clientes están consiguiendo resultados en este mismo momento. Muy pronto los publicaremos aquí con datos reales y medibles.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={`${styles.ctaBlock} reveal`} ref={ctaRef}>
                        <h2 className={styles.ctaTitle}>¿Tú también quieres que tu negocio trabaje solo?</h2>
                        <p className={styles.ctaSub}>Cuéntanos tu caso y te proponemos un plan de acción sin compromiso.</p>
                        <div className={styles.ctaRow}>
                            <Link to="/contact"><Button variant="primary" size="lg">Empezar diagnóstico gratuito</Button></Link>
                            <Link to="/services"><Button variant="outline" size="lg">Ver servicios</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
