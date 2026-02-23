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
                        ¿Hablamos?<br />
                        <span className="text-gradient">Sin compromisos.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Si tienes claro lo que quieres, genial. Si no, lo descubrimos juntos. Escríbenos o agenda una llamada directa.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className={styles.section}>
                <div className={styles.container} ref={contactRef}>
                    <div className={styles.contactGrid}>
                        {/* Form */}
                        <div className={`${styles.formCard} reveal`}>
                            <h2 className={styles.formTitle}>Envíanos un mensaje (respondemos nosotros, no un bot)</h2>
                            <p className={styles.formSub}>
                                Respondemos en menos de 24 horas laborables.
                            </p>
                            <form className={styles.form}>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label htmlFor="name">Nombre</label>
                                        <input id="name" type="text" placeholder="Tu nombre" required />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="email" placeholder="tu@email.com" required />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="company">Empresa</label>
                                    <input id="company" type="text" placeholder="Tu empresa o proyecto" />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="subject">¿De qué quieres hablar?</label>
                                    <select id="subject" required>
                                        <option value="">Selecciona una opción</option>
                                        <option value="clear_idea">Tengo claro lo que quiero</option>
                                        <option value="not_sure">No sé qué necesito exactamente</option>
                                        <option value="diagnostic">Quiero agendar un diagnóstico</option>
                                        <option value="other">Solo curiosidad / Otro</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="message">Mensaje</label>
                                    <textarea id="message" rows={5} placeholder="Cuéntanos un poco más..." required></textarea>
                                </div>
                                <Button variant="primary" fullWidth type="submit">
                                    Enviar mensaje
                                </Button>
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
                                <h3>¿Es urgente o prefieres un audio?</h3>
                                <p>Escríbenos al WhatsApp y vamos directos al grano.</p>
                                <a
                                    href="https://wa.me/34640756126?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20vuestros%20servicios."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="primary" fullWidth>
                                        💬 Abrir WhatsApp
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
