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
                        Software propio para problemas{' '}
                        <span className="text-gradient">que el mercado ignora.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Desarrollamos nuestras propias herramientas para nichos donde el software genérico no llega.
                        Listos para usar, con soporte incluido y sin configuraciones de meses.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className={styles.section}>
                <div className={styles.container} ref={productsRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>Nuestros productos</h2>
                        <p className={styles.sectionSub}>Cuatro herramientas construidas para problemas reales que encontramos en nuestros clientes.</p>
                    </div>
                    <div className={styles.grid}>
                        {[
                            {
                                id: 'erp',
                                emoji: '🏢',
                                name: 'ERP OpsPilot',
                                desc: 'Gestión completa de tu empresa en un solo lugar: empleados, horarios, calendario, reservas, inventario, proveedores, facturación y analítica básica. El control que tienen las grandes empresas, al alcance de cualquier PYME.',
                                price: 'Desde 29€/mes',
                                sector: 'Pequeña y mediana empresa',
                                cta: 'Solicitar acceso',
                                href: '/contact'
                            },
                            {
                                id: 'crm',
                                emoji: '🎯',
                                name: 'CRM OpsPilot',
                                desc: 'Gestión de clientes, seguimientos, pipeline de ventas y comunicaciones en un solo lugar. Adaptable a cómo trabaja tu equipo, no al revés. Porque cada negocio tiene su propia forma de vender.',
                                price: 'Desde 19€/mes',
                                sector: 'Cualquier sector',
                                cta: 'Solicitar acceso',
                                href: '/contact'
                            },
                            {
                                id: 'presupuestador',
                                emoji: '📋',
                                name: 'Presupuestador Pro',
                                desc: 'Crea presupuestos profesionales en minutos. Añade partidas, asigna precios, crea packs reutilizables y envía propuestas que cierran ventas. Diseñado junto a reformistas, para reformistas.',
                                price: 'Desde 25€/mes',
                                sector: 'Reformas, construcción y oficios',
                                cta: 'Solicitar acceso',
                                href: '/contact'
                            },
                            {
                                id: 'tarifaocr',
                                emoji: '⚡',
                                name: 'TarifaOCR',
                                desc: 'Sube la factura de tu cliente y en segundos tienes la mejor propuesta de tarifa disponible, optimizada por precio final o por tu comisión. Gestiona toda tu cartera desde un solo panel. Adiós al análisis manual.',
                                price: 'Consultar precio',
                                sector: 'Comerciales de energía eléctrica',
                                cta: 'Solicitar información',
                                href: '/contact'
                            },
                        ].map((p) => (
                            <div key={p.name} id={p.id} className={`${styles.productCard} reveal`}>
                                <span className={styles.productIcon}>{p.emoji}</span>
                                <span className={styles.productSector}>{p.sector}</span>
                                <h3 className={styles.productName}>{p.name}</h3>
                                <p className={styles.productDesc}>{p.desc}</p>
                                <div className={styles.productPrice}>{p.price}</div>
                                <Link to={p.href}><Button variant="outline" size="sm" fullWidth>{p.cta}</Button></Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className={styles.section}>
                <div className={styles.container} ref={advantagesRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>Por qué nuestros productos</h2>
                    </div>
                    <div className={styles.whyGrid}>
                        {[
                            { icon: '🚀', title: 'Funciona desde el primer día', desc: 'Sin meses de desarrollo ni configuraciones infinitas. En 48 horas estás gestionando con él.' },
                            { icon: '💰', title: 'Coste fijo y predecible', desc: 'Sabes exactamente lo que pagas cada mes. Sin sorpresas, sin costes ocultos, sin letra pequeña.' },
                            { icon: '🔄', title: 'Siempre actualizado', desc: 'Mejoramos en base a lo que piden los usuarios. Las actualizaciones llegan solas, incluidas en tu suscripción.' },
                            { icon: '🛡️', title: 'Soporte real incluido', desc: 'Personas reales que responden. No un chatbot, no un PDF de preguntas frecuentes.' },
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
                        <h2 className={styles.ctaTitle}>¿Tu caso necesita algo diferente?</h2>
                        <p className={styles.ctaSub}>Si ninguno de nuestros productos encaja exactamente, lo construimos a medida. Cuéntanos qué necesitas.</p>
                        <div className={styles.ctaRow}>
                            <Link to="/contact"><Button variant="primary" size="lg">Pedir desarrollo a medida</Button></Link>
                            <Link to="/services"><Button variant="outline" size="lg">Ver servicios</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
