import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Product.module.css';

export const Product: React.FC = () => {
    const productsRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const advantagesRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>Productos</span>
                    <h1 className={styles.heroTitle}>
                        Software que soluciona problemas concretos.{' '}
                        <span className="text-gradient">Hoy mismo.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Ni desarrollos interminables ni herramientas que hacen de todo pero nada bien. Elige tu problema, suscríbete y empieza a trabajar mejor.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className={styles.section}>
                <div className={styles.container} ref={productsRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>Nuestros Productos</h2>
                        <p className={styles.sectionSub}>Sistemas propios, probados y listos para integrarse en tu día a día.</p>
                    </div>
                    <div className={styles.grid}>
                        {[
                            { emoji: '🏢', name: 'ERP OpsPilot', desc: 'Control total de tu empresa. Finanzas, ventas, compras e inventario en un solo lugar. Adiós a los Excel inconexos.', price: 'Desde 150€/mes', sector: 'Gestión Integral' },
                            { emoji: '🤝', name: 'CRM OpsPilot', desc: 'Gestiona tus clientes sin perder una sola oportunidad. Simple, visual y conectado con tu WhatsApp.', price: 'Desde 80€/mes', sector: 'Ventas y Clientes' },
                            { emoji: '🏗️', name: 'Presupuestador Pro', desc: 'Calcula presupuestos de reformas en minutos y genera renders con IA para que el cliente diga "sí" más rápido.', price: 'Desde 60€/mes', sector: 'Reformas' },
                            { emoji: '⚡', name: 'TarifaOCR', desc: 'Para comerciales de energía. Escanea la factura de la competencia, compara y genera tu propuesta en segundos.', price: 'Consultar precio', sector: 'Sector Energético' },
                        ].map((p) => (
                            <div key={p.name} className={`${styles.productCard} reveal`}>
                                <span className={styles.productIcon}>{p.emoji}</span>
                                <span className={styles.productSector}>{p.sector}</span>
                                <h3 className={styles.productName}>{p.name}</h3>
                                <p className={styles.productDesc}>{p.desc}</p>
                                <div className={styles.productPrice}>{p.price}</div>
                                <Link to="/contact"><Button variant="outline" size="sm" fullWidth>Saber más</Button></Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className={styles.section}>
                <div className={styles.container} ref={advantagesRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>¿Por qué usar nuestras soluciones?</h2>
                    </div>
                    <div className={styles.whyGrid}>
                        {[
                            { icon: '⏳', title: 'Tiempo de reacción 0', desc: 'El sistema ya existe. Te damos acceso, lo configuramos a tus datos reales y empiezas a trabajar en días, no meses.' },
                            { icon: '💰', title: 'Sin grandes inversiones', desc: 'Una suscripción mensual clara. Sin sorpresas, gastos ocultos ni ataduras de por vida.' },
                            { icon: '🔄', title: 'Mejora continua', desc: 'Actualizamos el sistema basándonos en el feedback de todos los usuarios. Siempre tendrás la mejor versión.' },
                            { icon: '🛡️', title: 'Tú te enfocas en tu negocio', desc: 'Nosotros nos encargamos de que el software funcione, sea seguro y no se caiga. Soporte real incluido.' },
                        ].map((a) => (
                            <div key={a.title} className={`${styles.whyCard} reveal`}>
                                <span className={styles.whyEmoji}>{a.icon}</span>
                                <h4>{a.title}</h4>
                                <p>{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={`${styles.ctaBlock} reveal`} ref={ctaRef}>
                        <h2 className={styles.ctaTitle}>¿Tu problema es tan específico que no encaja aquí?</h2>
                        <p className={styles.ctaSub}>Para eso está nuestra línea de Servicios a Medida. Analizamos tu caso y construimos tu propia herramienta.</p>
                        <div className={styles.ctaRow}>
                            <Link to="/contact"><Button variant="primary" size="lg">Cuéntanos qué necesitas</Button></Link>
                            <Link to="/services"><Button variant="outline" size="lg">Ver Servicios a Medida</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
