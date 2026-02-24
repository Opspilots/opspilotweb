import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Services.module.css';
import { Palette, Zap, BarChart3, Handshake, TrendingUp, MessageSquare } from 'lucide-react';

export const Services: React.FC = () => {
    const servicesRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const valueRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const caseRef = useScrollReveal<HTMLDivElement>();
    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>Servicios</span>
                    <h1 className={styles.heroTitle}>
                        Construimos lo que tu negocio necesita.{' '}
                        <span className="text-gradient">Tú nos dices qué.</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Desde una web que transmite lo que eres hasta el software que no existe en el mercado.<br />
                        Precio cerrado, trato directo y sin desaparecer cuando acabamos.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className={styles.servicesSection}>
                <div className={styles.container} ref={servicesRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>¿Qué podemos hacer por ti?</h2>
                        <p className={styles.sectionSubtitle}>No vendemos tecnología. Resolvemos problemas con ella.</p>
                    </div>
                    <div className={styles.servicesGrid}>
                        <div className={`${styles.serviceCard} reveal`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Palette size={24} />
                                </div>
                                <h3 className={styles.cardTitle}>Branding &amp; Web</h3>
                            </div>
                            <p className={styles.cardText}>Tu web es tu primer comercial. Si no transmite lo que eres o no convierte visitas en clientes, está trabajando en tu contra. Lo arreglamos.</p>
                            <ul className={styles.cardFeatures}>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> Logo + manual de marca que dura en el tiempo
                                </li>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> Web responsive optimizada para buscadores
                                </li>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> Diseño centrado en convertir, no en decorar
                                </li>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> Textos que conectan, no que rellenan
                                </li>
                            </ul>
                            <div className={styles.cardFooter}>
                                <div className={styles.cardPrice}>
                                    <span className={styles.priceFrom}>Desde</span>
                                    <span className={styles.priceAmount}>200€</span>
                                </div>
                                <span className={styles.priceFrom}>Proyecto cerrado o mantenimiento mensual</span>
                            </div>
                        </div>
                        <div className={`${styles.serviceCard} ${styles.serviceCardHighlight} reveal`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Zap size={24} />
                                </div>
                                <h3 className={styles.cardTitle}>Apps &amp; Automatización</h3>
                            </div>
                            <p className={styles.cardText}>¿Tu negocio necesita algo que no existe en el mercado? Lo construimos. Apps, automatizaciones, integraciones o cualquier proceso específico que el software estándar no puede resolver.</p>
                            <ul className={styles.cardFeatures}>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> Apps web y móvil a medida
                                </li>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> CRM configurado para tu forma de trabajar
                                </li>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> WhatsApp Business integrado en tu flujo
                                </li>
                                <li>
                                    <span className={styles.featureCheck}>✓</span> Automatizaciones que trabajan mientras tú no
                                </li>
                            </ul>
                            <div className={styles.cardFooter}>
                                <div className={styles.cardPrice}>
                                    <span className={styles.priceFrom}>Desde</span>
                                    <span className={styles.priceAmount}>500€</span>
                                </div>
                                <span className={styles.priceFrom}>+ mantenimiento mensual desde 10€/mes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className={styles.valueSection}>
                <div className={styles.container} ref={valueRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>¿Por qué OpsPilot?</h2>
                    </div>
                    <div className={styles.valueGrid}>
                        <div className={`${styles.valueCard} reveal`}>
                            <div className={styles.valueIcon}>
                                <BarChart3 className="icon-md" />
                            </div>
                            <h4 className={styles.valueTitle}>Precio cerrado siempre</h4>
                            <p className={styles.valueText}>
                                Te decimos cuánto cuesta antes de empezar.<br />
                                Sin sorpresas al final, sin horas extra que no pediste.
                            </p>
                        </div>
                        <div className={`${styles.valueCard} reveal`}>
                            <div className={styles.valueIcon}>
                                <Handshake className="icon-md" />
                            </div>
                            <h4 className={styles.valueTitle}>Somos tu equipo, no un proveedor</h4>
                            <p className={styles.valueText}>
                                No desaparecemos cuando entregamos.<br />
                                Nos quedamos contigo mientras nos necesites.
                            </p>
                        </div>
                        <div className={`${styles.valueCard} reveal`}>
                            <div className={styles.valueIcon}>
                                <TrendingUp className="icon-md" />
                            </div>
                            <h4 className={styles.valueTitle}>Empezamos donde estás tú</h4>
                            <p className={styles.valueText}>
                                No hace falta un presupuesto enorme para empezar.<br />
                                Empezamos pequeño y crecemos juntos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Study Proof */}
            <section className={styles.proofSection}>
                <div className={styles.container}>
                    <div className={`${styles.proofCard} reveal`} ref={caseRef}>
                        <div className={styles.proofContent}>
                            <span className={styles.tag}>Caso real</span>
                            <h3 className={styles.proofTitle}>J.R. Rodríguez — De la libreta al sistema inteligente</h3>
                            <p className={styles.proofText}>
                                Empresa familiar de reformas en Madrid. Lo gestionaban todo con Excel, llamadas y libretas.<br />
                                Implementamos marca, CRM a medida, presupuestador con IA y citas automáticas por WhatsApp.<br />
                                En 3 meses triplicaron su capacidad de atención sin incorporar nuevo personal.
                            </p>
                            <Link to="/cases"><Button variant="outline" size="md">Leer el caso completo →</Button></Link>
                        </div>
                        <div className={styles.proofStats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>-70%</span>
                                <span className={styles.statLabel}>Tiempo gestión</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>+3x</span>
                                <span className={styles.statLabel}>Clientes</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>0€</span>
                                <span className={styles.statLabel}>Personal extra</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={`${styles.ctaBlock} reveal`} ref={ctaRef}>
                        <h2 className={styles.ctaTitle}>¿Por dónde empezamos?</h2>
                        <p className={styles.ctaSubtitle}>Cuéntanos tu caso. En 30 minutos te decimos si tenemos solución, cómo sería y cuánto costaría aproximadamente.</p>
                        <div className={styles.ctaButtons}>
                            <Link to="/contact"><Button variant="primary" size="lg">Reservar diagnóstico gratuito</Button></Link>
                            <a href="https://wa.me/34640756126" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg"><MessageSquare size={20} style={{ marginRight: '8px' }} /> WhatsApp directo</Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
