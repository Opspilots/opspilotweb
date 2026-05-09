import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import sys from '../styles/page-system.module.css';
import styles from './Resources.module.css';

const FORM_NEWSLETTER_URL = 'https://formsubmit.co/ajax/opspilot.contact@gmail.com';

type NLStatus = 'idle' | 'submitting' | 'success' | 'error';

const RESOURCES = [
    {
        cat: 'Guía',
        title: 'Cómo automatizar tu negocio sin saber de tecnología',
        desc: 'Paso a paso para identificar qué procesos te roban tiempo y convertirlos en flujos automáticos. Sin código, sin complicaciones.',
        time: '8 min lectura',
    },
    {
        cat: 'Artículo',
        title: '5 señales de que tu PYME necesita un sistema de gestión',
        desc: 'Si pierdes clientes por falta de seguimiento o tus datos viven en hojas sueltas, sigue leyendo.',
        time: '5 min lectura',
    },
    {
        cat: 'Caso práctico',
        title: 'De Excel a sistema: cómo una empresa de reformas triplicó su capacidad',
        desc: 'El caso real de una empresa familiar que pasó de libretas a un sistema que trabaja solo.',
        time: '6 min lectura',
    },
    {
        cat: 'Checklist',
        title: '¿Tu web trabaja para ti o contra ti? 10 puntos para saberlo',
        desc: 'Una auditoría rápida y gratuita para saber si tu web está generando clientes o espantándolos.',
        time: '3 min lectura',
    },
    {
        cat: 'Artículo',
        title: 'Asistentes IA productivos: lo que nadie te cuenta antes de implementar uno',
        desc: 'Ventajas reales, limitaciones y cuándo tiene sentido invertir en agentes inteligentes.',
        time: '7 min lectura',
    },
    {
        cat: 'Guía',
        title: 'Cómo pedir un presupuesto de software sin que te timen',
        desc: 'Todo lo que debes preguntar antes de contratar el desarrollo de tu app, sistema o web.',
        time: '10 min lectura',
    },
];

export const Resources: React.FC = () => {
    usePageSEO({
        title: 'Recursos · Guías y artículos prácticos — OpsPilot',
        description:
            'Guías, artículos y herramientas gratuitas sobre automatización, software a medida y digitalización para PYMEs. Escritas para personas de negocio.',
        canonical: 'https://opspilot.es/recursos',
    });

    const gridRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const nlRef = useScrollReveal<HTMLDivElement>();
    const [nlStatus, setNlStatus] = useState<NLStatus>('idle');
    const [nlEmail, setNlEmail] = useState('');

    const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNlStatus('submitting');
        try {
            const res = await fetch(FORM_NEWSLETTER_URL, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: nlEmail, _subject: 'Nueva suscripción newsletter OpsPilot', tipo: 'newsletter' }),
            });
            if (res.ok) {
                setNlStatus('success');
                setNlEmail('');
            } else {
                setNlStatus('error');
            }
        } catch {
            setNlStatus('error');
        }
    };

    return (
        <div className={sys.page}>
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <span className={sys.pageHeroEyebrow}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-mint)', boxShadow: '0 0 8px rgba(57, 206, 134, 0.6)' }} />
                            Recursos
                        </span>
                        <h1 className={sys.pageHeroTitle}>
                            Aprende a hacer más con <em className={sys.pageHeroAccent}>menos</em>.
                        </h1>
                        <p className={sys.pageHeroSubtitle}>
                            Guías prácticas, artículos y herramientas gratuitas sobre automatización
                            y digitalización. Escritas para personas de negocio, no para técnicos.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ GRID ═══ */}
            <section className={styles.gridSection}>
                <div className={sys.container} ref={gridRef}>
                    <div className={styles.grid}>
                        {RESOURCES.map((r) => (
                            <article key={r.title} className={`${styles.card} reveal`}>
                                <span className={styles.cardCat}>{r.cat}</span>
                                <h2 className={styles.cardTitle}>{r.title}</h2>
                                <p className={styles.cardDesc}>{r.desc}</p>
                                <span className={styles.cardTime}>{r.time}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ NEWSLETTER ═══ */}
            <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                <div className={sys.container}>
                    <div className={`${styles.newsletter} reveal`} ref={nlRef}>
                        <div className={styles.nlContent}>
                            <span className={sys.eyebrow}>
                                <span className={sys.eyebrowDot} />
                                Newsletter
                            </span>
                            <h2 className={styles.nlTitle}>Una idea útil cada semana.</h2>
                            <p className={styles.nlText}>
                                Un email semanal con automatizaciones prácticas, herramientas y casos
                                reales. Sin relleno, sin spam. Solo cosas que puedes aplicar.
                            </p>
                        </div>
                        {nlStatus === 'success' ? (
                            <p className={styles.nlSuccess}>
                                ¡Suscrito! Te llegará el próximo email esta semana.
                            </p>
                        ) : (
                            <form className={styles.nlForm} onSubmit={handleNewsletter}>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className={styles.nlInput}
                                    required
                                    value={nlEmail}
                                    onChange={(e) => setNlEmail(e.target.value)}
                                />
                                <Button variant="primary" type="submit" disabled={nlStatus === 'submitting'}>
                                    {nlStatus === 'submitting' ? 'Enviando...' : 'Suscribirme gratis'}
                                </Button>
                                {nlStatus === 'error' && (
                                    <p className={styles.nlError}>
                                        Error al suscribirse. Inténtalo de nuevo.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Quieres ayuda personalizada?</h2>
                        <p className={sys.endCtaSub}>
                            Diagnóstico gratuito de 30 minutos. Sin compromiso.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="primary" size="lg">Reservar diagnóstico</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
