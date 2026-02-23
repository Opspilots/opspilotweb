import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Resources.module.css';

export const Resources: React.FC = () => {
    const gridRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const nlRef = useScrollReveal<HTMLDivElement>();
    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>Recursos</span>
                    <h1 className={styles.heroTitle}>
                        Conocimiento abierto para{' '}
                        <span className="text-gradient">empresas que quieren más.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Ni humo ni teoría. Compartimos lo que aprendemos conectando herramientas y automatizando negocios reales.
                    </p>
                </div>
            </section>

            {/* Resources Grid */}
            <section className={styles.section}>
                <div className={styles.container} ref={gridRef}>
                    <div className={styles.grid}>
                        {[
                            { cat: 'Guía', title: 'Cómo automatizar tu negocio sin ser técnico', desc: 'Un paso a paso para identificar procesos manuales y convertirlos en flujos automáticos.', time: '8 min lectura' },
                            { cat: 'Artículo', title: '5 señales de que tu empresa necesita un CRM', desc: 'Si pierdes clientes por falta de seguimiento, es hora de actuar.', time: '5 min lectura' },
                            { cat: 'Caso práctico', title: 'De Excel a sistema: la historia de J.R. Rodríguez', desc: 'Cómo una empresa de reformas triplicó su capacidad con tecnología.', time: '6 min lectura' },
                            { cat: 'Checklist', title: '¿Tu web genera negocio? Audítala en 10 puntos', desc: 'Un checklist gratuito para evaluar si tu web está trabajando para ti o contra ti.', time: '3 min lectura' },
                            { cat: 'Artículo', title: 'WhatsApp Business API: lo que nadie te cuenta', desc: 'Ventajas, limitaciones y cuándo tiene sentido invertir en la API oficial.', time: '7 min lectura' },
                            { cat: 'Guía', title: 'Presupuestar proyectos digitales sin morir en el intento', desc: 'Cómo calcular costes reales y evitar sorpresas en proyectos de software.', time: '10 min lectura' },
                        ].map((r) => (
                            <article key={r.title} className={`${styles.card} reveal`}>
                                <span className={styles.cardCat}>{r.cat}</span>
                                <h3 className={styles.cardTitle}>{r.title}</h3>
                                <p className={styles.cardDesc}>{r.desc}</p>
                                <span className={styles.cardTime}>{r.time}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={`${styles.newsletter} reveal`} ref={nlRef}>
                        <div className={styles.nlContent}>
                            <h2 className={styles.nlTitle}>Documentamos lo que construimos</h2>
                            <p className={styles.nlText}>
                                Apúntate a nuestra lista. Mandamos un email (muy de vez en cuando) con casos de uso reales, herramientas que descubrimos y errores que hemos cometido para que no los cometas tú.
                            </p>
                        </div>
                        <form className={styles.nlForm}>
                            <input type="email" placeholder="tu@email.com" className={styles.nlInput} required />
                            <Button variant="primary" type="submit">Unirme a la lista</Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={`${styles.ctaBlock} reveal`} ref={ctaRef}>
                        <h2 className={styles.ctaTitle}>¿Prefieres que lo hagamos nosotros?</h2>
                        <p className={styles.ctaSub}>Leer está muy bien, pero delegar es más rápido.</p>
                        <Link to="/contact"><Button variant="primary" size="lg">Agendar diagnóstico gratuito</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
