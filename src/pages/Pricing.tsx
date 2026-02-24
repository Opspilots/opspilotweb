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
                        Precios claros.{' '}
                        <span className="text-gradient">Sin letra pequeña.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Nuestros productos SaaS tienen suscripción mensual fija.
                        Para servicios a medida, el precio lo cerramos antes de empezar. Siempre.
                    </p>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className={styles.section}>
                <div className={styles.container} ref={pricingRef}>
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--color-dark-text-muted)',
                        fontSize: 'var(--font-size-sm)',
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-10)'
                    }}>
                        Estos planes aplican a nuestros productos SaaS (ERP, CRM, Presupuestador Pro y TarifaOCR).
                        Para servicios a medida (webs, apps, automatizaciones),{' '}
                        <Link to="/contact" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                            cuéntanos tu caso y cerramos precio
                        </Link>.
                    </p>
                    <div className={styles.grid}>
                        {/* Starter */}
                        <div className={`${styles.card} reveal`}>
                            <span className={styles.planName}>Starter</span>
                            <p className={styles.planDesc}>Para autónomos y negocios que empiezan a ordenarse.</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>29€</span>
                                <span className={styles.period}>/mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}>✓</span>1 usuario</li>
                                <li><span className={styles.check}>✓</span>Acceso a 1 producto a elegir (ERP o CRM)</li>
                                <li><span className={styles.check}>✓</span>Soporte por email</li>
                                <li><span className={styles.check}>✓</span>Actualizaciones incluidas</li>
                                <li><span className={styles.check}>✓</span>Sin permanencia, cancela cuando quieras</li>
                            </ul>
                            <Link to="/demo"><Button variant="outline" fullWidth>Probar gratis</Button></Link>
                        </div>

                        {/* Pro */}
                        <div className={`${styles.card} ${styles.cardPro} reveal`}>
                            <div className={styles.badge}>Más Popular</div>
                            <span className={styles.planName}>Pro</span>
                            <p className={styles.planDesc}>Para PYMEs que necesitan más usuarios y más automatización.</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>69€</span>
                                <span className={styles.period}>/mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}>✓</span>Hasta 5 usuarios</li>
                                <li><span className={styles.check}>✓</span>Acceso a todos los productos</li>
                                <li><span className={styles.check}>✓</span>Automatizaciones y WhatsApp integrado</li>
                                <li><span className={styles.check}>✓</span>Panel de analítica</li>
                                <li><span className={styles.check}>✓</span>Soporte prioritario</li>
                                <li><span className={styles.check}>✓</span>Onboarding incluido</li>
                            </ul>
                            <Link to="/demo"><Button variant="primary" fullWidth>Empezar ahora</Button></Link>
                        </div>

                        {/* Business */}
                        <div className={`${styles.card} reveal`}>
                            <span className={styles.planName}>Business</span>
                            <p className={styles.planDesc}>Para empresas con procesos específicos o equipos grandes.</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>149€</span>
                                <span className={styles.period}>/mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}>✓</span>Usuarios ilimitados</li>
                                <li><span className={styles.check}>✓</span>Todo lo del plan Pro</li>
                                <li><span className={styles.check}>✓</span>API e integraciones personalizadas</li>
                                <li><span className={styles.check}>✓</span>Personalización avanzada del producto</li>
                                <li><span className={styles.check}>✓</span>Account manager dedicado</li>
                                <li><span className={styles.check}>✓</span>SLA garantizado</li>
                            </ul>
                            <Link to="/contact"><Button variant="outline" fullWidth>Hablar con nosotros</Button></Link>
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
                            <h2 className={styles.customTitle}>¿Necesitas algo totalmente a medida?</h2>
                            <p className={styles.customText}>
                                Si nuestros productos no encajan al 100% con tu negocio, lo construimos desde cero.
                                Web, app, CRM personalizado, automatización, integraciones.
                                Con presupuesto cerrado y sin sorpresas al final.
                            </p>
                            <div className={styles.customPrices}>
                                <div className={styles.customPrice}>
                                    <span className={styles.customPriceLabel}>Web corporativa</span>
                                    <span className={styles.customPriceValue}>Desde 200€</span>
                                </div>
                                <div className={styles.customPrice}>
                                    <span className={styles.customPriceLabel}>App o CRM a medida</span>
                                    <span className={styles.customPriceValue}>Desde 500€</span>
                                </div>
                                <div className={styles.customPrice}>
                                    <span className={styles.customPriceLabel}>Mantenimiento mensual</span>
                                    <span className={styles.customPriceValue}>Desde 10€/mes</span>
                                </div>
                            </div>
                            <Link to="/contact"><Button variant="primary">Pedir presupuesto cerrado</Button></Link>
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
                            { q: '¿Puedo cambiar de plan cuando quiera?', a: 'Sí, sin penalizaciones. Los cambios se aplican en el siguiente ciclo mensual.' },
                            { q: '¿Hay permanencia mínima?', a: 'No. Todos los planes son mensuales. Si no te convence, cancelas y punto. Sin trampa.' },
                            { q: '¿Qué pasa si necesito algo que no está en los planes?', a: 'Nos lo cuentas y hacemos un presupuesto a medida. Es lo más habitual en clientes nuevos.' },
                            { q: '¿El onboarding está incluido?', a: 'En los planes Pro y Business, sí. Te acompañamos en la configuración inicial para que empieces a sacarle partido desde el día uno.' },
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
