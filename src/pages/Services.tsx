import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ROUTES } from '../lib/routes';
import sys from '../styles/page-system.module.css';
import styles from './Services.module.css';
import {
    Zap,
    Handshake,
    TrendingUp,
    MessageSquare,
    Settings,
    BarChart3,
    Plug,
    Sparkles,
    Check,
} from 'lucide-react';

const SERVICES = [
    {
        icon: <Zap size={24} strokeWidth={1.6} />,
        title: 'Automatización de procesos',
        text: 'Convertimos tareas manuales y repetitivas en flujos automáticos. Si tu equipo gasta tiempo copiando datos, enviando emails o rellenando formularios, lo resolvemos.',
        features: [
            'Mapeo de procesos actuales',
            'Automatizaciones que trabajan mientras tú no',
            'Integraciones entre herramientas existentes',
            'Seguimiento y mantenimiento continuos',
        ],
    },
    {
        icon: <Settings size={24} strokeWidth={1.6} />,
        title: 'Software de gestión a medida',
        text: 'Cuando el software del mercado no encaja con tu forma de operar, lo construimos nosotros. Desde un CRM configurado a tu flujo hasta herramientas específicas de tu sector.',
        features: [
            'CRM adaptado a tu ciclo de venta',
            'Paneles con tus indicadores reales',
            'Comunicación con clientes centralizada',
            'Escalable conforme crece tu negocio',
        ],
        highlight: true,
    },
    {
        icon: <Sparkles size={24} strokeWidth={1.6} />,
        title: 'Asistentes IA que operan',
        text: 'No chatbots que solo responden. Asistentes que ejecutan: cierran agendas, preparan informes, leen documentos y avisan cuando algo necesita tu atención.',
        features: [
            'Lectura inteligente de documentos',
            'Acciones reales sobre tus sistemas',
            'Conectados a tu correo y agenda',
            'Supervisados por humanos cuando importa',
        ],
    },
    {
        icon: <Plug size={24} strokeWidth={1.6} />,
        title: 'Integraciones entre herramientas',
        text: 'Que el banco, el correo, las apps que ya usas y tu sistema de gestión hablen entre sí. Sin duplicar datos ni copiar a mano de un sitio a otro.',
        features: [
            'Conexión con APIs y bancos',
            'Sincronización en tiempo real',
            'Datos siempre cuadrados',
            'Sin perder histórico al migrar',
        ],
    },
];

const VALUES = [
    {
        icon: <BarChart3 size={22} strokeWidth={1.6} />,
        title: 'Sin sorpresas al final',
        text: 'Te decimos exactamente qué vamos a construir antes de empezar. Sin horas extra que no pediste, sin cambios de alcance inesperados.',
    },
    {
        icon: <Handshake size={22} strokeWidth={1.6} />,
        title: 'Somos tu equipo, no un proveedor',
        text: 'No desaparecemos cuando entregamos. Nos quedamos contigo mientras nos necesites — mantenimiento, mejoras y soporte real.',
    },
    {
        icon: <TrendingUp size={22} strokeWidth={1.6} />,
        title: 'Empezamos donde estás tú',
        text: 'No hace falta un presupuesto enorme para empezar. Empezamos pequeño con lo que más duele y crecemos juntos.',
    },
];

export const Services: React.FC = () => {
    const servicesRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const valueRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <div className={sys.page}>
            {/* Hero */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <span className={sys.pageHeroEyebrow}>Servicios</span>
                        <h1 className={sys.pageHeroTitle}>
                            Resolvemos problemas operativos{' '}
                            <em className={sys.pageHeroAccent}>con software que funciona.</em>
                        </h1>
                        <p className={sys.pageHeroSubtitle}>
                            Analizamos cómo opera tu negocio y construimos las herramientas
                            exactas que necesitas. Trato directo, entrega real y sin desaparecer
                            cuando terminamos.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className={sys.section}>
                <div className={sys.container}>
                    <header className={`${sys.sectionHeader} reveal`}>
                        <span className={sys.eyebrow}>
                            <span className={sys.eyebrowDot} />
                            Qué hacemos
                        </span>
                        <h2 className={sys.sectionTitle}>
                            ¿Qué podemos hacer por ti?
                        </h2>
                    </header>
                    <div className={styles.servicesGrid} ref={servicesRef}>
                        {SERVICES.map((s) => (
                            <article
                                key={s.title}
                                className={`${styles.serviceCard} ${s.highlight ? styles.serviceCardHighlight : ''} reveal`}
                            >
                                <div className={styles.cardIcon}>{s.icon}</div>
                                <h3 className={styles.cardTitle}>{s.title}</h3>
                                <p className={styles.cardText}>{s.text}</p>
                                <ul className={styles.cardFeatures}>
                                    {s.features.map(f => (
                                        <li key={f}>
                                            <span className={styles.featureCheck}>
                                                <Check size={12} strokeWidth={2.4} />
                                            </span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className={`${sys.section} ${sys.sectionAlt}`}>
                <div className={sys.container}>
                    <header className={`${sys.sectionHeader} reveal`}>
                        <span className={sys.eyebrow}>
                            <span className={sys.eyebrowDot} />
                            Por qué OpsPilot
                        </span>
                        <h2 className={sys.sectionTitle}>Lo que nos diferencia.</h2>
                    </header>
                    <div className={styles.valueGrid} ref={valueRef}>
                        {VALUES.map((v) => (
                            <div key={v.title} className={`${styles.valueCard} reveal`}>
                                <div className={styles.valueIcon}>{v.icon}</div>
                                <h4 className={styles.valueTitle}>{v.title}</h4>
                                <p className={styles.valueText}>{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Por dónde empezamos?</h2>
                        <p className={sys.endCtaSub}>
                            Cuéntanos tu caso. En 30 minutos te decimos si tenemos solución,
                            cómo sería y cuánto tiempo llevaría.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="primary" size="lg">Reservar diagnóstico gratuito</Button>
                            </Link>
                            <a href="https://wa.me/34640756126" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg">
                                    <MessageSquare size={18} style={{ marginRight: 8 }} /> WhatsApp directo
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
