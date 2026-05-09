import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import {
    FileSpreadsheet,
    Zap,
    Calculator,
    Network,
    FileText,
    Receipt,
    Landmark,
    Smartphone,
    BarChart3,
    Users,
    FileSignature,
    Banknote,
    HardHat,
    Layers,
    PenLine,
    ScanLine,
    Bot,
    KanbanSquare,
    Target,
    Workflow,
    Rocket,
    RefreshCw,
    ShieldCheck,
    Building2,
} from 'lucide-react';
import sys from '../styles/page-system.module.css';
import styles from './Product.module.css';

type ProductStatus = 'production' | 'beta' | 'soon';

interface Feature {
    icon: React.ReactNode;
    label: string;
}

interface ProductCardProps {
    icon: React.ReactNode;
    differentiator: string;
    features: Feature[];
    status: ProductStatus;
}

const statusLabel: Record<ProductStatus, string> = {
    production: 'En producción',
    beta: 'En beta privada',
    soon: 'Próximamente',
};

const ProductVisual: React.FC<ProductCardProps> = ({ icon, differentiator, features, status }) => (
    <div className={styles.productVisual}>
        <div className={styles.productVisualHeader}>
            <div className={styles.productVisualIcon}>{icon}</div>
            <span className={`${styles.productStatus} ${styles['status_' + status]}`}>
                <span className={styles.productStatusDot}></span>
                {statusLabel[status]}
            </span>
        </div>
        <p className={styles.productVisualDifferentiator}>{differentiator}</p>
        <ul className={styles.productVisualFeatures}>
            {features.map((f, i) => (
                <li key={i}>
                    <span className={styles.productVisualFeatureIcon}>{f.icon}</span>
                    <span>{f.label}</span>
                </li>
            ))}
        </ul>
    </div>
);

interface Product {
    id: string;
    name: string;
    sector: string;
    desc: string;
    differentiator: string;
    features: Feature[];
    status: ProductStatus;
    icon: React.ReactNode;
    cta: string;
    href: string;
    external?: boolean;
}

export const Product: React.FC = () => {
    usePageSEO({
        title: 'Productos verticales · Software para sectores concretos — OpsPilot',
        description:
            'Cuatro productos verticales para PYMEs españolas: fiscalidad (AEAT, SII, VeriFactu), CRM energético, presupuestos de obra (BC3/FIEBDC) y ERP con agentes IA.',
        canonical: 'https://opspilot.es/productos',
    });

    const productsRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const advantagesRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    const products: Product[] = [
        {
            id: 'fiscalidad',
            name: 'Fiscalidad',
            sector: 'Autónomos, PYMEs y asesorías',
            desc:
                'Plataforma fiscal y contable española completa. Facturación, asientos automáticos según el PGC, ' +
                'modelos AEAT, envío SII y VeriFactu nativos, conciliación bancaria con OCR de tickets, ' +
                'asistente IA fiscal y app móvil. Pensada para uso directo y para gestorías que llevan múltiples clientes.',
            differentiator:
                'Cobertura completa del stack fiscal español, no solo facturación. Compite con Holded, Quipu y A3 Suite con SII, VeriFactu y consolidación de grupos incluidos.',
            features: [
                { icon: <Receipt size={16} />, label: 'Facturación + cobros/pagos + contabilidad PGC' },
                { icon: <Landmark size={16} />, label: 'Modelos AEAT 303, 111, 115, 130, 190, 202, 347 y 390' },
                { icon: <FileSignature size={16} />, label: 'Envío SII y VeriFactu (XML firmado y encadenado)' },
                { icon: <Smartphone size={16} />, label: 'App móvil con biometría y captura de tickets' },
                { icon: <BarChart3 size={16} />, label: 'Asistente IA fiscal y consolidación de grupos' },
            ],
            status: 'production',
            icon: <FileSpreadsheet size={32} />,
            cta: 'Ver web del producto',
            href: 'https://fiscalidad.mcpopspilot.org',
            external: true,
        },
        {
            id: 'energydeal',
            name: 'EnergyDeal',
            sector: 'Sector energético — agentes y comercializadoras',
            desc:
                'CRM B2B vertical para agentes comerciales y comercializadoras energéticas en España. ' +
                'Comparador multi-proveedor, gestión por CIF con CUPS, pipeline de carga masiva de tarifas, ' +
                'liquidación de comisiones y centro de mensajería con campañas Email + WhatsApp.',
            differentiator:
                'Reproducibilidad y auditoría: cada comparativa es un snapshot inmutable, las tarifas se versionan en lugar de sobrescribirse y los conflictos de interés se marcan explícitamente.',
            features: [
                { icon: <Banknote size={16} />, label: 'Comparador con snapshots históricos reproducibles' },
                { icon: <Building2 size={16} />, label: 'CRM B2B por CIF con CUPS y puntos de suministro' },
                { icon: <Workflow size={16} />, label: 'Pipeline carga masiva de tarifas (PDF → parseo → validación)' },
                { icon: <Users size={16} />, label: 'Comisiones con estados pending / validated / paid / reverted' },
                { icon: <FileText size={16} />, label: 'Exportes fiscales (IVA + pagos) y log de auditoría' },
            ],
            status: 'production',
            icon: <Zap size={32} />,
            cta: 'Ver web del producto',
            href: 'https://energydeal.es',
            external: true,
        },
        {
            id: 'presupuestador',
            name: 'Presupuestador',
            sector: 'Construcción, reformas y arquitectura',
            desc:
                'SaaS para presupuestos y certificaciones de obra. Partidas estructuradas con descomposición ' +
                'en recursos (materiales, mano de obra, maquinaria) y rendimientos, packs reutilizables, ' +
                'firma digital del cliente vía enlace público y control de coste real con OCR de albaranes.',
            differentiator:
                'BC3/FIEBDC nativo (estándar español del sector) más descomposición real de partidas en recursos. No es un presupuestador genérico: está hecho para cómo se presupuesta obra en España.',
            features: [
                { icon: <Layers size={16} />, label: 'Importación y exportación BC3/FIEBDC nativa' },
                { icon: <HardHat size={16} />, label: 'Partidas + packs reutilizables + catálogo de recursos' },
                { icon: <PenLine size={16} />, label: 'Firma digital del cliente vía enlace público' },
                { icon: <FileSignature size={16} />, label: 'Certificaciones de obra con asistente y versionado' },
                { icon: <ScanLine size={16} />, label: 'Control de rentabilidad con OCR de albaranes' },
            ],
            status: 'beta',
            icon: <Calculator size={32} />,
            cta: 'Solicitar acceso anticipado',
            href: '/contacto',
            external: false,
        },
        {
            id: 'erp',
            name: 'ERP OpsPilot',
            sector: 'Agencias, consultoras y servicios profesionales',
            desc:
                'ERP/PSA todo-en-uno para reemplazar la combinación Notion + Trello + HubSpot + Slack + Drive. ' +
                'Project Hub con tareas jerárquicas, CRM con empresas y oportunidades, secuencias de prospección, ' +
                'auditorías con plantillas reutilizables, portal cliente externo y multi-tenant.',
            differentiator:
                'Capa MCP nativa con 31+ herramientas: un agente IA conversacional ejecuta acciones reales del ERP. Un Odoo es excesivo para una agencia, esto es modular y pensado para servicios profesionales.',
            features: [
                { icon: <Bot size={16} />, label: 'Capa MCP de agentes IA con 31+ herramientas nativas' },
                { icon: <KanbanSquare size={16} />, label: 'Project Hub con tareas jerárquicas y Kanban' },
                { icon: <Target size={16} />, label: 'Intelligence Platform: empresas, contactos, oportunidades' },
                { icon: <Workflow size={16} />, label: 'Outreach Engine con secuencias automatizadas' },
                { icon: <FileText size={16} />, label: 'Auditor con plantillas reutilizables (consultoría/compliance)' },
            ],
            status: 'production',
            icon: <Network size={32} />,
            cta: 'Ver web del producto',
            href: 'https://notionpilot.mcpopspilot.org',
            external: true,
        },
    ];

    return (
        <div className={sys.page}>
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <span className={sys.pageHeroEyebrow}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-mint)', boxShadow: '0 0 8px rgba(57, 206, 134, 0.6)' }} />
                            Productos verticales
                        </span>
                        <h1 className={sys.pageHeroTitle}>
                            Cuatro productos para PYMEs <em className={sys.pageHeroAccent}>españolas</em>.
                        </h1>
                        <p className={sys.pageHeroSubtitle}>
                            Fiscalidad, energía, construcción y agencias. Cada producto resuelve un
                            dominio concreto con sus estándares (PGC, AEAT, SII, VeriFactu, BC3/FIEBDC)
                            en lugar de ofrecer un genérico que no conoce el contexto español.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ CATÁLOGO ═══ */}
            <section className={styles.section}>
                <div className={sys.container} ref={productsRef}>
                    <header className={`${sys.sectionHeader} reveal`}>
                        <span className={sys.eyebrow}>
                            <span className={sys.eyebrowDot} />
                            Catálogo
                        </span>
                        <h2 className={sys.sectionTitle}>Nuestros productos.</h2>
                    </header>
                    <div className={styles.productsList}>
                        {products.map((p, index) => (
                            <div
                                key={p.id}
                                id={p.id}
                                className={`${styles.productRow} ${index % 2 !== 0 ? styles.rowReverse : ''} reveal`}
                            >
                                <div className={styles.productInfo}>
                                    <span className={styles.productSector}>{p.sector}</span>
                                    <h3 className={styles.productName}>{p.name}</h3>
                                    <p className={styles.productDesc}>{p.desc}</p>
                                    {p.external ? (
                                        <a href={p.href} target="_blank" rel="noopener noreferrer">
                                            <Button variant="primary" size="lg">{p.cta}</Button>
                                        </a>
                                    ) : (
                                        <Link to={p.href}>
                                            <Button variant="primary" size="lg">{p.cta}</Button>
                                        </Link>
                                    )}
                                </div>
                                <div className={styles.productVisualContainer}>
                                    <ProductVisual
                                        icon={p.icon}
                                        differentiator={p.differentiator}
                                        features={p.features}
                                        status={p.status}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ POR QUÉ ═══ */}
            <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                <div className={sys.container} ref={advantagesRef}>
                    <header className={`${sys.sectionHeader} reveal`}>
                        <span className={sys.eyebrow}>
                            <span className={sys.eyebrowDot} />
                            Por qué
                        </span>
                        <h2 className={sys.sectionTitle}>Diseñados para España.</h2>
                    </header>
                    <div className={styles.whyGrid}>
                        {[
                            {
                                icon: <Rocket size={24} />,
                                title: 'Verticales, no genéricos',
                                desc: 'Cada producto incorpora los estándares del dominio: PGC, AEAT, SII, VeriFactu, BC3/FIEBDC, CUPS. No tienes que adaptar tu negocio al software.',
                            },
                            {
                                icon: <Banknote size={24} />,
                                title: 'Suscripción mensual fija',
                                desc: 'Precio cerrado por producto. Sin coste por documento, sin penalización por crecer. La factura de fin de mes es la que esperas.',
                            },
                            {
                                icon: <RefreshCw size={24} />,
                                title: 'Actualizaciones continuas',
                                desc: 'Las normas fiscales y técnicas cambian (VeriFactu, nuevas versiones BC3, modelos AEAT). Nosotros nos encargamos.',
                            },
                            {
                                icon: <ShieldCheck size={24} />,
                                title: 'Soporte humano incluido',
                                desc: 'Equipo accesible en español. Resolvemos dudas de uso y de dominio (fiscal, energético, construcción) con personas reales.',
                            },
                        ].map((a) => (
                            <div key={a.title} className={`${styles.whyCard} reveal`}>
                                <span className={styles.whyIcon}>{a.icon}</span>
                                <h3 className={styles.whyTitle}>{a.title}</h3>
                                <p className={styles.whyText}>{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Tu caso necesita algo a medida?</h2>
                        <p className={sys.endCtaSub}>
                            Si los productos no encajan con tu flujo, lo construimos desde cero
                            con presupuesto cerrado.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}><Button variant="primary" size="lg">Pedir desarrollo a medida</Button></Link>
                            <Link to={ROUTES.servicios}><Button variant="outline" size="lg">Ver servicios</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
