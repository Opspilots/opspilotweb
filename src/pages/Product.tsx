import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import {
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

const STATUS_LABEL: Record<ProductStatus, string> = {
    production: 'En producción',
    beta: 'Beta privada',
    soon: 'Próximamente',
};

interface Product {
    id: string;
    name: string;
    sector: string;
    desc: string;
    features: Feature[];
    status: ProductStatus;
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
                'asistente IA fiscal y app móvil. Pensada para uso directo y para gestorías con múltiples clientes.',
            features: [
                { icon: <Receipt size={14} />, label: 'Facturación + cobros/pagos + contabilidad PGC' },
                { icon: <Landmark size={14} />, label: 'Modelos AEAT 303, 111, 115, 130, 190, 202, 347 y 390' },
                { icon: <FileSignature size={14} />, label: 'Envío SII y VeriFactu (XML firmado y encadenado)' },
                { icon: <Smartphone size={14} />, label: 'App móvil con biometría y captura de tickets OCR' },
                { icon: <BarChart3 size={14} />, label: 'Asistente IA fiscal y consolidación de grupos' },
            ],
            status: 'production',
            cta: 'Ver producto',
            href: 'https://fiscalidad.mcpopspilot.org',
            external: true,
        },
        {
            id: 'energydeal',
            name: 'EnergyDeal',
            sector: 'Sector energético — agentes y comercializadoras',
            desc:
                'CRM B2B vertical para agentes comerciales y comercializadoras energéticas. ' +
                'Comparador multi-proveedor con snapshots inmutables, gestión por CIF con CUPS, ' +
                'pipeline de carga masiva de tarifas y liquidación de comisiones con trazabilidad completa.',
            features: [
                { icon: <Banknote size={14} />, label: 'Comparador con snapshots históricos reproducibles' },
                { icon: <Building2 size={14} />, label: 'CRM B2B por CIF con CUPS y puntos de suministro' },
                { icon: <Workflow size={14} />, label: 'Pipeline carga masiva de tarifas (PDF → parseo → validación)' },
                { icon: <Users size={14} />, label: 'Comisiones con estados pending / validated / paid / reverted' },
                { icon: <FileText size={14} />, label: 'Exportes fiscales (IVA + pagos) y log de auditoría' },
            ],
            status: 'production',
            cta: 'Ver producto',
            href: 'https://energydeal.es',
            external: true,
        },
        {
            id: 'presupuestador',
            name: 'Presupuestador',
            sector: 'Construcción, reformas y arquitectura',
            desc:
                'SaaS para presupuestos y certificaciones de obra. Partidas estructuradas con descomposición ' +
                'en recursos, packs reutilizables, firma digital del cliente vía enlace público ' +
                'y control de coste real con OCR de albaranes. BC3/FIEBDC nativo.',
            features: [
                { icon: <Layers size={14} />, label: 'Importación y exportación BC3/FIEBDC nativa' },
                { icon: <HardHat size={14} />, label: 'Partidas + packs reutilizables + catálogo de recursos' },
                { icon: <PenLine size={14} />, label: 'Firma digital del cliente vía enlace público' },
                { icon: <FileSignature size={14} />, label: 'Certificaciones de obra con asistente y versionado' },
                { icon: <ScanLine size={14} />, label: 'Control de rentabilidad con OCR de albaranes' },
            ],
            status: 'beta',
            cta: 'Solicitar acceso',
            href: ROUTES.contacto,
            external: false,
        },
        {
            id: 'erp',
            name: 'ERP OpsPilot',
            sector: 'Agencias, consultoras y servicios profesionales',
            desc:
                'ERP/PSA todo-en-uno. Reemplaza Notion + Trello + HubSpot + Slack + Drive con un solo entorno. ' +
                'Project Hub, CRM, secuencias de prospección, portal cliente externo y capa MCP nativa ' +
                'con 31+ herramientas de agente IA.',
            features: [
                { icon: <Bot size={14} />, label: 'Capa MCP de agentes IA con 31+ herramientas nativas' },
                { icon: <KanbanSquare size={14} />, label: 'Project Hub con tareas jerárquicas y Kanban' },
                { icon: <Target size={14} />, label: 'Intelligence Platform: empresas, contactos, oportunidades' },
                { icon: <Workflow size={14} />, label: 'Outreach Engine con secuencias automatizadas' },
                { icon: <FileText size={14} />, label: 'Auditor con plantillas reutilizables (consultoría/compliance)' },
            ],
            status: 'production',
            cta: 'Ver producto',
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
                        <span className={sys.pageHeroEyebrow}>Productos verticales</span>
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
            <section className={styles.catalog}>
                <div className={sys.container} ref={productsRef}>
                    {products.map((p, index) => (
                        <article key={p.id} id={p.id} className={`${styles.productRow} reveal`}>
                            <div className={styles.productHeader}>
                                <span className={styles.productIndex}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className={styles.productMeta}>
                                    <span className={styles.productSector}>{p.sector}</span>
                                    <span className={`${styles.productStatus} ${styles['status_' + p.status]}`}>
                                        <span className={styles.statusDot} />
                                        {STATUS_LABEL[p.status]}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.productBody}>
                                <div className={styles.productLeft}>
                                    <h2 className={styles.productName}>{p.name}</h2>
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
                                <ul className={styles.featureList}>
                                    {p.features.map((f, i) => (
                                        <li key={i} className={styles.featureItem}>
                                            <span className={styles.featureIcon}>{f.icon}</span>
                                            <span>{f.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ═══ POR QUÉ ═══ */}
            <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                <div className={sys.container} ref={advantagesRef}>
                    <header className={`${sys.sectionHeader} reveal`}>
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
                            <Link to={ROUTES.contacto}>
                                <Button variant="primary" size="lg">Pedir desarrollo a medida</Button>
                            </Link>
                            <Link to={ROUTES.servicios}>
                                <Button variant="outline" size="lg">Ver servicios</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
