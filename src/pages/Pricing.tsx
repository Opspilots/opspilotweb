import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Pricing.module.css';

export const Pricing: React.FC = () => {
    const pricingRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const customRef = useScrollReveal<HTMLDivElement>();
    const faqRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>Precios</span>
                    <h1 className={styles.heroTitle}>
                        Precios de nuestros{' '}
                        <span className="text-gradient">Productos SaaS.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Para servicios a medida (web, apps, branding), el precio se define tras el diagnóstico gratuito. Lo que ves aquí aplica a nuestras herramientas listas para usar.
                    </p>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className={styles.section}>
                <div className={styles.container} ref={pricingRef}>
                    <div className={`${styles.sectionHeader} reveal`} style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
                        <p style={{ color: 'var(--color-dark-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                            Nota: Los siguientes planes son un esquema general. Cada producto (ReformaPilot, CRM, etc.) tiene su propio precio base.
                        </p>
                    </div>
                    <div className={styles.grid}>
                        {/* Starter */}
                        <div className={`${styles.card} reveal`}>
                            <span className={styles.planName}>Starter</span>
                            <p className={styles.planDesc}>Para probar y validar.</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>29€</span>
                                <span className={styles.period}>/mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}>✓</span>1 usuario</li>
                                <li><span className={styles.check}>✓</span>Acceso completo a funciones core</li>
                                <li><span className={styles.check}>✓</span>Soporte por email</li>
                                <li><span className={styles.check}>✓</span>Actualizaciones incluidas</li>
                            </ul>
                            <Link to="/contact"><Button variant="outline" fullWidth>Ver en acción</Button></Link>
                        </div>

                        {/* Pro */}
                        <div className={`${styles.card} ${styles.cardPro} reveal`}>
                            <div className={styles.badge}>Más Popular</div>
                            <span className={styles.planName}>Pro</span>
                            <p className={styles.planDesc}>Para equipos en crecimiento.</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>69€</span>
                                <span className={styles.period}>/mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}>✓</span>Hasta 5 usuarios</li>
                                <li><span className={styles.check}>✓</span>WhatsApp integrado</li>
                                <li><span className={styles.check}>✓</span>Automatizaciones de flujos</li>
                                <li><span className={styles.check}>✓</span>Analítica avanzada</li>
                                <li><span className={styles.check}>✓</span>Soporte prioritario</li>
                            </ul>
                            <Link to="/contact"><Button variant="primary" fullWidth>Empezar ahora</Button></Link>
                        </div>

                        {/* Business */}
                        <div className={`${styles.card} reveal`}>
                            <span className={styles.planName}>Business</span>
                            <p className={styles.planDesc}>Para empresas con necesidades específicas.</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>149€</span>
                                <span className={styles.period}>/mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}>✓</span>Usuarios ilimitados</li>
                                <li><span className={styles.check}>✓</span>Integraciones a medida</li>
                                <li><span className={styles.check}>✓</span>Account manager dedicado</li>
                                <li><span className={styles.check}>✓</span>Soporte prioritario 24/7</li>
                                <li><span className={styles.check}>✓</span>SLA garantizado</li>
                            </ul>
                            <Link to="/contact"><Button variant="outline" fullWidth>Hablar con ventas</Button></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={`${styles.customBlock} reveal`} ref={customRef}>
                        <div className={styles.customContent}>
                            <span className={styles.tag}>Servicios a medida</span>
                            <h2 className={styles.customTitle}>¿La herramienta existe pero no como tú quieres?</h2>
                            <p className={styles.customText}>
                                Si nuestros productos SaaS no encajan al 100%, diseñamos tu solución desde cero o adaptamos una existente para ti.
                                Descubre nuestro enfoque de trabajo.
                            </p>
                            <div className={styles.customPrices}>
                                <Link to="/contact"><Button variant="primary">Agendar diagnóstico</Button></Link>
                                <Link to="/services" style={{ marginLeft: '1rem' }}><Button variant="outline">Ver portfolio de servicios</Button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.section}>
                <div className={styles.container} ref={faqRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>Preguntas frecuentes</h2>
                    </div>
                    <div className={styles.faqGrid}>
                        {[
                            { q: '¿Hay coste de instalación inicial?', a: 'Depende del producto. Algunos son plug-and-play y otros requieren configuración de nuestra parte. Te lo dejamos claro en el diagnóstico.' },
                            { q: '¿Qué pasa si mi equipo crece?', a: 'Puedes pasar del plan Starter al Pro en cualquier momento. Nos avisas y ampliamos tus licencias en el día.' },
                            { q: '¿El pago es mensual o anual?', a: 'Ofrecemos ambas opciones. El pago anual suele llevar un descuento equivalente a dos meses gratis.' },
                            { q: '¿Me ayudáis a migrar mis Excels actuales?', a: 'Sí. Dentro del onboarding de los planes Pro y Business, incluimos la importación de tu base de datos actual.' },
                        ].map((f) => (
                            <div key={f.q} className={`${styles.faqCard} reveal`}>
                                <h4>{f.q}</h4>
                                <p>{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
