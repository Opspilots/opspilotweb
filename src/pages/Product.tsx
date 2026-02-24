import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TrendingUp, Target, Home, Bath, Zap, ArrowDown, CircleDollarSign, Building2, ClipboardList, Rocket, Banknote, RefreshCw, ShieldCheck } from 'lucide-react';
import styles from './Product.module.css';

// Mockup Components for each product

const ERPMockup = () => (
    <div className={`${styles.dashboardMock} anim-float`}>
        <div className={styles.mockHeader}>
            <div className={styles.mockDots}>
                <span></span><span></span><span></span>
            </div>
        </div>
        <div className={styles.mockBody}>
            <div className={styles.mockSidebar}>
                <div className={styles.mockNav}></div>
                <div className={styles.mockNav}></div>
                <div className={styles.mockNav}></div>
                <div className={styles.mockNav}></div>
            </div>
            <div className={styles.mockContent}>
                <div className={styles.mockCards}>
                    <div className={styles.mockCard}>
                        <div className={styles.mockLabel}>Ingresos Mes</div>
                        <div className={styles.mockValue}>€14.250</div>
                    </div>
                    <div className={styles.mockCard}>
                        <div className={styles.mockLabel}>Empleados Activos</div>
                        <div className={styles.mockValue}>12</div>
                    </div>
                </div>
                <div className={styles.mockChart}>
                    <div className={styles.chartLine}></div>
                </div>
            </div>
        </div>
        <div className={`${styles.floatingBadge} ${styles.badgeERP}`}>
            <TrendingUp size={16} /> Control total
        </div>
    </div>
);

const CRMMockup = () => (
    <div className={`${styles.kanbanMock} anim-float-slow`}>
        <div className={styles.kanbanHeader}>Pipeline de Ventas</div>
        <div className={styles.kanbanBoard}>
            <div className={styles.kanbanColumn}>
                <div className={styles.colTitle}>Nuevos</div>
                <div className={styles.kanbanCard}>Lead: Empresa S.L.</div>
                <div className={styles.kanbanCard}>Lead: Autonómos Unidos</div>
            </div>
            <div className={styles.kanbanColumn}>
                <div className={styles.colTitle}>En Negociación</div>
                <div className={styles.kanbanCard}>Juan Pérez - Presupuesto enviado</div>
            </div>
            <div className={styles.kanbanColumn}>
                <div className={styles.colTitle}>Cerrados</div>
                <div className={`${styles.kanbanCard} ${styles.cardSuccess}`}>Proyecto Reforma Integral</div>
            </div>
        </div>
        <div className={`${styles.floatingBadge} ${styles.badgeCRM}`}>
            <Target size={16} /> +30% Conversión
        </div>
    </div>
);

const PresupuestadorMockup = () => (
    <div className={`${styles.phoneMockup} anim-float`}>
        <div className={styles.phoneScreen}>
            <div className={styles.phoneNotch}></div>
            <div className={styles.phoneContent}>
                <div className={styles.quoteHeader}>PRESUPUESTO #0042</div>
                <div className={styles.quoteCard}>
                    <div className={styles.quoteImage}><Home size={20} /></div>
                    <div className={styles.quoteInfo}>
                        <div className={styles.quoteTitle}>Reforma Cocina</div>
                        <div className={styles.quotePrice}>€4.200</div>
                    </div>
                </div>
                <div className={styles.quoteCard}>
                    <div className={styles.quoteImage}><Bath size={20} /></div>
                    <div className={styles.quoteInfo}>
                        <div className={styles.quoteTitle}>Reforma Baño</div>
                        <div className={styles.quotePrice}>€2.800</div>
                    </div>
                </div>
                <div className={styles.quoteTotal}>
                    <span>Total:</span>
                    <span className={styles.quoteTotalAmount}>€7.000</span>
                </div>
                <div className={`${styles.floatingBadge} ${styles.badgePresupuesto}`}>
                    <Zap size={16} /> Enviado en 2 min
                </div>
            </div>
        </div>
    </div>
);

const TarifaOCRMockup = () => (
    <div className={`${styles.scannerMock} anim-float-slow`}>
        <div className={styles.scannerHeader}>Análisis de Factura</div>
        <div className={styles.scannerBody}>
            <div className={styles.scanLine}></div>
            <div className={styles.facturaVieja}>
                <div className={styles.facturaTitle}>Factura Actual (Iberdrola)</div>
                <div className={styles.facturaPrice}>150 €/mes</div>
            </div>
            <div className={styles.scanArrow}><ArrowDown size={24} /></div>
            <div className={styles.facturaNueva}>
                <div className={styles.facturaTitle}>Propuesta Óptima (Endesa)</div>
                <div className={styles.facturaPriceSuccess}>120 €/mes</div>
            </div>
        </div>
        <div className={`${styles.floatingBadge} ${styles.badgeTarifa}`}>
            <CircleDollarSign size={16} /> Ahorro del 20%
        </div>
    </div>
);


export const Product: React.FC = () => {
    const productsRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const advantagesRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    const products = [
        {
            id: 'erp',
            emoji: <Building2 className="icon-md" />,
            name: 'ERP OpsPilot',
            desc: 'Gestión completa de tu empresa en un solo lugar: empleados, horarios, calendario, reservas, inventario, proveedores, facturación y analítica básica. El control que tienen las grandes empresas, al alcance de cualquier PYME.',
            price: 'Desde 29€/mes',
            sector: 'Pequeña y mediana empresa',
            cta: 'Solicitar acceso',
            href: '/contact',
            mockup: <ERPMockup />
        },
        {
            id: 'crm',
            emoji: <Target className="icon-md" />,
            name: 'CRM OpsPilot',
            desc: 'Gestión de clientes, seguimientos, pipeline de ventas y comunicaciones en un solo lugar. Adaptable a cómo trabaja tu equipo, no al revés. Porque cada negocio tiene su propia forma de vender.',
            price: 'Desde 19€/mes',
            sector: 'Cualquier sector',
            cta: 'Solicitar acceso',
            href: '/contact',
            mockup: <CRMMockup />
        },
        {
            id: 'presupuestador',
            emoji: <ClipboardList className="icon-md" />,
            name: 'Presupuestador Pro',
            desc: 'Crea presupuestos profesionales en minutos. Añade partidas, asigna precios, crea packs reutilizables y envía propuestas que cierran ventas. Diseñado junto a reformistas, para reformistas.',
            price: 'Desde 25€/mes',
            sector: 'Reformas, construcción y oficios',
            cta: 'Solicitar acceso',
            href: '/contact',
            mockup: <PresupuestadorMockup />
        },
        {
            id: 'tarifaocr',
            emoji: <Zap className="icon-md" />,
            name: 'TarifaOCR',
            desc: 'Sube la factura de tu cliente y en segundos tienes la mejor propuesta de tarifa disponible, optimizada por precio final o por tu comisión. Gestiona toda tu cartera desde un solo panel. Adiós al análisis manual.',
            price: 'Consultar precio',
            sector: 'Comerciales de energía eléctrica',
            cta: 'Solicitar información',
            href: '/contact',
            mockup: <TarifaOCRMockup />
        },
    ];

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

            {/* Products Layout (Alternating Rows) */}
            <section className={styles.section}>
                <div className={styles.container} ref={productsRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <h2 className={styles.sectionTitle}>Nuestros productos</h2>
                        <p className={styles.sectionSub}>Cuatro herramientas construidas para problemas reales que encontramos en nuestros clientes.</p>
                    </div>
                    <div className={styles.productsList}>
                        {products.map((p, index) => (
                            <div key={p.name} id={p.id} className={`${styles.productRow} ${index % 2 !== 0 ? styles.rowReverse : ''} reveal`}>
                                <div className={styles.productInfo}>
                                    <span className={styles.productIcon}>{p.emoji}</span>
                                    <span className={styles.productSector}>{p.sector}</span>
                                    <h3 className={styles.productName}>{p.name}</h3>
                                    <p className={styles.productDesc}>{p.desc}</p>
                                    <div className={styles.productPrice}>{p.price}</div>
                                    <Link to={p.href}><Button variant="primary" size="lg">{p.cta} →</Button></Link>
                                </div>
                                <div className={styles.productVisualContainer}>
                                    {p.mockup}
                                </div>
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
                            { icon: <Rocket size={24} />, title: 'Funciona desde el primer día', desc: 'Sin meses de desarrollo ni configuraciones infinitas. En 48 horas estás gestionando con él.' },
                            { icon: <Banknote size={24} />, title: 'Coste fijo y predecible', desc: 'Sabes exactamente lo que pagas cada mes. Sin sorpresas, sin costes ocultos, sin letra pequeña.' },
                            { icon: <RefreshCw size={24} />, title: 'Siempre actualizado', desc: 'Mejoramos en base a lo que piden los usuarios. Las actualizaciones llegan solas, incluidas en tu suscripción.' },
                            { icon: <ShieldCheck size={24} />, title: 'Soporte real incluido', desc: 'Personas reales que responden. No un chatbot, no un PDF de preguntas frecuentes.' },
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
