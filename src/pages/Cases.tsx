import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import sys from '../styles/page-system.module.css';
import styles from './Cases.module.css';

const CASES = [
    {
        sector: 'Reformas',
        title: 'De la libreta al sistema que trabaja solo',
        text: 'Empresa familiar de reformas que lo llevaba todo con Excel y llamadas. Diseñamos su marca, construimos un sistema a medida con presupuestos asistidos por IA y automatizamos las citas por WhatsApp. En tres meses triplicaron su capacidad sin incorporar a nadie más.',
        stats: [
            { v: '3×', l: 'Capacidad de atención' },
            { v: '−70%', l: 'Tiempo en gestión' },
            { v: '0 €', l: 'Personal extra' },
        ],
        quote: 'Pasamos de perder presupuestos por falta de seguimiento a tener un sistema que trabaja solo.',
        author: 'J.R. Rodríguez · CEO',
    },
    {
        sector: 'Asesoría fiscal',
        title: 'Una asesoría que cierra cuentas mientras duerme',
        text: 'Despacho con cientos de clientes ahogado en tareas repetitivas. Implementamos lectura inteligente de documentos, conciliación bancaria automática y un asistente IA que prepara los modelos antes de la revisión humana. Cierre mensual al 80% en automático.',
        stats: [
            { v: '80%', l: 'Cierre automático' },
            { v: '−5h/día', l: 'En tareas repetitivas' },
            { v: '+45%', l: 'Más capacidad sin contratar' },
        ],
        quote: 'Antes era imposible escalar sin contratar; ahora podemos crecer sin que el equipo reviente.',
        author: 'Socio director',
    },
    {
        sector: 'Agencia de servicios',
        title: 'Una agencia que recupera 20 horas a la semana',
        text: 'Agencia de marketing con cinco herramientas distintas que no se hablaban entre sí. Construimos un sistema único que sustituyó CRM, gestión, facturación y comunicación interna, con reporting en tiempo real para dirección y un asistente IA para dudas internas.',
        stats: [
            { v: '20h', l: 'Ahorradas a la semana' },
            { v: '5 → 1', l: 'Apps en un solo sistema' },
            { v: '100%', l: 'Información centralizada' },
        ],
        quote: 'Dejamos de pagar cinco herramientas y ganamos visibilidad real de cada cliente.',
        author: 'Directora de operaciones',
    },
];

export const Cases: React.FC = () => {
    usePageSEO({
        title: 'Casos de éxito · Software a medida — OpsPilot',
        description:
            'Empresas reales que transformaron su operativa con software a medida, asistentes IA y automatización: reformas, asesorías fiscales y agencias de servicios.',
        canonical: 'https://opspilot.es/casos',
    });

    const listRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <div className={sys.page}>
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <span className={sys.pageHeroEyebrow}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-mint)', boxShadow: '0 0 8px rgba(57, 206, 134, 0.6)' }} />
                            Casos de éxito
                        </span>
                        <h1 className={sys.pageHeroTitle}>
                            Empresas reales,<br />problemas <em className={sys.pageHeroAccent}>resueltos</em>.
                        </h1>
                        <p className={sys.pageHeroSubtitle}>
                            No hace falta ser una gran empresa para necesitar buenos procesos.
                            Esto es lo que hemos construido para empresas como la tuya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ CASOS ═══ */}
            <section className={styles.casesSection}>
                <div className={sys.container} ref={listRef}>
                    <div className={styles.casesList}>
                        {CASES.map((c, i) => (
                            <article key={i} className={`${styles.caseCard} reveal`}>
                                <div className={styles.caseHead}>
                                    <span className={styles.caseSector}>{c.sector}</span>
                                    <span className={styles.caseIndex}>
                                        {String(i + 1).padStart(2, '0')} / {String(CASES.length).padStart(2, '0')}
                                    </span>
                                </div>
                                <h2 className={styles.caseTitle}>{c.title}</h2>
                                <p className={styles.caseText}>{c.text}</p>
                                <div className={styles.statsRow}>
                                    {c.stats.map((s, j) => (
                                        <div key={j} className={styles.stat}>
                                            <span className={styles.statNum}>{s.v}</span>
                                            <span className={styles.statLabel}>{s.l}</span>
                                        </div>
                                    ))}
                                </div>
                                <blockquote className={styles.quote}>
                                    <p>{c.quote}</p>
                                    <span>{c.author}</span>
                                </blockquote>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Tu empresa podría ser la siguiente?</h2>
                        <p className={sys.endCtaSub}>
                            Analizamos tu situación en 30 minutos y te decimos qué podríamos hacer
                            por ti. Sin compromiso.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}><Button variant="primary" size="lg">Reservar diagnóstico</Button></Link>
                            <Link to={ROUTES.servicios}><Button variant="outline" size="lg">Ver servicios</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
