import React from 'react';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
    const contactRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>Contacto</span>
                    <h1 className={styles.heroTitle}>
                        ¿Tienes un problema{' '}
                        <span className="text-gradient">que resolver?</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Cuéntanoslo. En 30 minutos te decimos si podemos ayudarte, cómo lo haríamos
                        y cuánto costaría aproximadamente. Sin compromiso, sin presión.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className={styles.section}>
                <div className={styles.container} ref={contactRef}>
                    <div className={styles.contactGrid}>
                        {/* Form */}
                        <div className={`${styles.formCard} reveal`}>
                            <h2 className={styles.formTitle}>Reserva tu diagnóstico gratuito</h2>
                            <p className={styles.formSub}>
                                Rellena esto y te respondemos en menos de 24 horas laborables.
                            </p>
                            <form className={styles.form}>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label htmlFor="name">¿Cómo te llamas?</label>
                                        <input id="name" type="text" placeholder="Tu nombre" required />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="email">¿Dónde te respondemos?</label>
                                        <input id="email" type="email" placeholder="tu@email.com" required />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="company">Empresa o proyecto (opcional)</label>
                                    <input id="company" type="text" placeholder="¿En qué trabajas?" />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="subject">¿Qué necesitas?</label>
                                    <select id="subject" required>
                                        <option value="">Selecciona una opción</option>
                                        <option value="web">Una web que funcione de verdad</option>
                                        <option value="app">App o automatización a medida</option>
                                        <option value="erp">ERP para gestionar mi empresa</option>
                                        <option value="crm">CRM para gestionar mis clientes</option>
                                        <option value="presupuesto">Presupuestador para mi empresa de reformas</option>
                                        <option value="energia">Herramienta para comerciales de energía</option>
                                        <option value="otro">Otra cosa, te lo explico en el mensaje</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="message">¿Qué problema quieres resolver?</label>
                                    <textarea id="message" rows={5} placeholder="Cuéntanoslo como si hablaras con un amigo. Cuanto más detalle, mejor te podremos orientar." required></textarea>
                                </div>
                                <Button variant="primary" fullWidth type="submit">
                                    Reservar diagnóstico gratuito
                                </Button>
                                <p style={{
                                    textAlign: 'center',
                                    fontSize: 'var(--font-size-xs)',
                                    color: 'var(--color-dark-text-muted)',
                                    marginTop: 'var(--spacing-3)'
                                }}>
                                    ✓ Respuesta en menos de 24h &nbsp;·&nbsp; ✓ Sin compromiso &nbsp;·&nbsp; ✓ Sin letra pequeña
                                </p>
                            </form>
                        </div>

                        {/* Info */}
                        <div className={styles.infoCol}>
                            <div className={`${styles.infoCard} reveal`}>
                                <h3>Contacto directo</h3>
                                <div className={styles.methods}>
                                    <div className={styles.method}>
                                        <span>📧</span>
                                        <div>
                                            <strong>Email</strong>
                                            <p>opspilot.contact@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className={styles.method}>
                                        <span>💬</span>
                                        <div>
                                            <strong>WhatsApp</strong>
                                            <p>+34 640 75 61 26</p>
                                        </div>
                                    </div>
                                    <div className={styles.method}>
                                        <span>📍</span>
                                        <div>
                                            <strong>Ubicación</strong>
                                            <p>Teletrabajamos desde España para todo el mundo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.waCard} reveal anim-border-glow`}>
                                <h3>¿Prefieres hablar ahora?</h3>
                                <p>Escríbenos por WhatsApp y te respondemos en el momento. Sin formularios, sin esperas.</p>
                                <a
                                    href="https://wa.me/34640756126?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20vuestros%20servicios."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="primary" fullWidth>
                                        💬 Escribir por WhatsApp
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
