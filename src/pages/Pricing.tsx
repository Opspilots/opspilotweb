import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { Check } from 'lucide-react';
import { ROUTES } from '../lib/routes';
import sys from '../styles/page-system.module.css';
import styles from './Pricing.module.css';

export const Pricing: React.FC = () => {
    usePageSEO({
        title: 'Precios — Software a medida y productos · OpsPilot',
        description:
            'Presupuesto cerrado para desarrollo de software a medida y suscripción mensual fija para productos verticales. Sin permanencia, sin sorpresas.',
        canonical: 'https://opspilot.es/precios',
    });

    const customRef = useScrollReveal<HTMLDivElement>();
    const pricingRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const faqRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <div className={sys.page}>
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <span className={sys.pageHeroEyebrow}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-mint)', boxShadow: '0 0 8px rgba(57, 206, 134, 0.6)' }} />
                            Precios
                        </span>
                        <h1 className={sys.pageHeroTitle}>
                            Presupuesto <em className={sys.pageHeroAccent}>cerrado</em>.<br />
                            Sin sorpresas al final.
                        </h1>
                        <p className={sys.pageHeroSubtitle}>
                            Para desarrollo a medida cerramos el precio antes de empezar.
                            Para productos verticales, suscripción mensual fija y sin permanencia.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ SERVICIOS A MEDIDA ═══ */}
            <section className={styles.customSection}>
                <div className={sys.container}>
                    <header className={`${sys.sectionHeader}`}>
                        <span className={sys.eyebrow}>
                            <span className={sys.eyebrowDot} />
                            Servicios a medida
                        </span>
                        <h2 className={sys.sectionTitle}>
                            Cada proyecto es único. Por eso lo presupuestamos individualmente.
                        </h2>
                    </header>
                    <div className={`${styles.customBlock} reveal`} ref={customRef}>
                        <div className={styles.customGrid}>
                            <div className={styles.customRange}>
                                <span className={styles.customLabel}>Página o landing</span>
                                <span className={styles.customValue}>Desde 200&nbsp;€</span>
                                <p className={styles.customHint}>
                                    Sitio sencillo orientado a convertir, con SEO técnico y mantenimiento.
                                </p>
                            </div>
                            <div className={styles.customRange}>
                                <span className={styles.customLabel}>Aplicación a medida</span>
                                <span className={styles.customValue}>Desde 500&nbsp;€</span>
                                <p className={styles.customHint}>
                                    Apps web o móvil, integraciones, automatizaciones, asistentes IA.
                                </p>
                            </div>
                            <div className={styles.customRange}>
                                <span className={styles.customLabel}>Sistema completo</span>
                                <span className={styles.customValue}>Cerramos contigo</span>
                                <p className={styles.customHint}>
                                    ERP/CRM a medida, plataformas multi-tenant, modernización integral.
                                </p>
                            </div>
                        </div>
                        <div className={styles.customFooter}>
                            <p className={styles.customFooterText}>
                                Mantenimiento mensual desde <strong>10&nbsp;€/mes</strong> — opcional según el caso.
                            </p>
                            <Link to={ROUTES.contacto}>
                                <Button variant="primary" size="lg">Pedir presupuesto cerrado</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PRODUCTOS — PLANES SAAS ═══ */}
            <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                <div className={sys.container} ref={pricingRef}>
                    <header className={`${sys.sectionHeader} reveal`}>
                        <span className={sys.eyebrow}>
                            <span className={sys.eyebrowDot} />
                            Productos verticales
                        </span>
                        <h2 className={sys.sectionTitle}>
                            Suscripción mensual fija. Sin permanencia.
                        </h2>
                    </header>
                    <div className={styles.grid}>
                        <div className={`${styles.card} reveal`}>
                            <span className={styles.planName}>Starter</span>
                            <p className={styles.planDesc}>
                                Para autónomos y negocios que empiezan a ordenarse.
                            </p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>29&nbsp;€</span>
                                <span className={styles.period}>/ mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>1 usuario</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Acceso a 1 producto vertical</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Soporte por email</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Actualizaciones incluidas</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Sin permanencia</li>
                            </ul>
                            <Link to={ROUTES.contacto}><Button variant="outline" fullWidth>Probar gratis</Button></Link>
                        </div>

                        <div className={`${styles.card} ${styles.cardPro} reveal`}>
                            <div className={styles.badge}>Más popular</div>
                            <span className={styles.planName}>Pro</span>
                            <p className={styles.planDesc}>
                                Para PYMEs que necesitan más usuarios y más automatización.
                            </p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>69&nbsp;€</span>
                                <span className={styles.period}>/ mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Hasta 5 usuarios</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Acceso a todos los productos</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Automatizaciones e integraciones</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Panel de analítica avanzado</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Soporte prioritario</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Onboarding incluido</li>
                            </ul>
                            <Link to={ROUTES.contacto}><Button variant="primary" fullWidth>Empezar ahora</Button></Link>
                        </div>

                        <div className={`${styles.card} reveal`}>
                            <span className={styles.planName}>Business</span>
                            <p className={styles.planDesc}>
                                Para empresas con procesos específicos o equipos grandes.
                            </p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>149&nbsp;€</span>
                                <span className={styles.period}>/ mes</span>
                            </div>
                            <ul className={styles.features}>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Usuarios ilimitados</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Todo lo del plan Pro</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>API e integraciones personalizadas</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>Account manager dedicado</li>
                                <li><span className={styles.check}><Check size={16} strokeWidth={2} /></span>SLA garantizado</li>
                            </ul>
                            <Link to={ROUTES.contacto}><Button variant="outline" fullWidth>Hablar con nosotros</Button></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FAQ ═══ */}
            <section className={styles.faqSection}>
                <div className={sys.container} ref={faqRef}>
                    <header className={`${sys.sectionHeader} reveal`}>
                        <span className={sys.eyebrow}>
                            <span className={sys.eyebrowDot} />
                            Preguntas frecuentes
                        </span>
                        <h2 className={sys.sectionTitle}>Lo que la gente nos pregunta.</h2>
                    </header>
                    <div className={styles.faqGrid}>
                        {[
                            { q: '¿Cómo funciona el presupuesto cerrado?', a: 'Antes de empezar te enviamos un documento con alcance, plazos y precio. Si lo aprobamos, ese precio no cambia salvo que tú quieras añadir cosas.' },
                            { q: '¿Hay permanencia mínima en los productos?', a: 'No. Las suscripciones mensuales se cancelan cuando quieras y los cambios de plan se aplican en el siguiente ciclo.' },
                            { q: '¿Qué pasa si necesito algo que no está en los planes?', a: 'Lo construimos a medida con presupuesto cerrado. Es lo más habitual cuando hay procesos específicos del negocio.' },
                            { q: '¿Está incluido el onboarding?', a: 'En los planes Pro y Business, sí. Te acompañamos en la configuración inicial y migración de datos.' },
                            { q: '¿Os encargáis del mantenimiento posterior?', a: 'Sí. Tenemos planes mensuales desde 10€ que cubren bugs, pequeñas mejoras y actualizaciones.' },
                            { q: '¿Aceptáis facturación trimestral o anual?', a: 'Sí. Trimestral con 5% de descuento, anual con 12%. Lo acordamos al firmar.' },
                        ].map((f) => (
                            <div key={f.q} className={`${styles.faqCard} reveal`}>
                                <h3 className={styles.faqQuestion}>{f.q}</h3>
                                <p className={styles.faqAnswer}>{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Cuánto te costaría a ti?</h2>
                        <p className={sys.endCtaSub}>
                            Cuéntanos lo que necesitas. En 30 minutos te decimos un rango realista
                            con plazo y alcance.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}><Button variant="primary" size="lg">Pedir presupuesto</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
