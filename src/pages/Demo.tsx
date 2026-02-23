import React from 'react';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Demo.module.css';

export const Demo: React.FC = () => {
    const contentRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>Diagnóstico gratuito</span>
                    <h1 className={styles.heroTitle}>
                        ¿No sabes por dónde empezar?<br />
                        <span className="text-gradient">Te ayudamos a decidir.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Reserva 30 minutos con nosotros. Analizamos cómo trabajas hoy, qué te está frenando y te damos una ruta clara. Cero compromiso, cero coste.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className={styles.section}>
                <div className={styles.container} ref={contentRef}>
                    <div className={styles.demoGrid}>
                        {/* Form */}
                        <div className={`${styles.formCard} reveal`}>
                            <h2 className={styles.formTitle}>Agenda tu diagnóstico</h2>
                            <p className={styles.formSub}>Déjanos tus datos y te contactamos hoy mismo para fijar la llamada.</p>
                            <form className={styles.form}>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label htmlFor="demoName">Nombre</label>
                                        <input id="demoName" type="text" placeholder="Tu nombre" required />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="demoEmail">Email</label>
                                        <input id="demoEmail" type="email" placeholder="tu@email.com" required />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="demoCompany">Empresa</label>
                                    <input id="demoCompany" type="text" placeholder="¿Cómo se llama tu negocio?" />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="demoInterest">¿Cuál es tu mayor cuello de botella ahora mismo?</label>
                                    <select id="demoInterest" required>
                                        <option value="">Selecciona una opción</option>
                                        <option value="manual_tasks">Pierdo mucho tiempo en tareas manuales</option>
                                        <option value="disconnected_tools">Mis herramientas actuales no se conectan</option>
                                        <option value="dont_know">No sé qué tecnología necesito</option>
                                        <option value="automation">Quiero automatizar mi captación de clientes</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="demoNotes">Notas (opcional)</label>
                                    <textarea id="demoNotes" rows={4} placeholder="Cuéntanos un poco más sobre el problema (opcional pero ayuda)"></textarea>
                                </div>
                                <Button variant="primary" fullWidth size="lg" type="submit">
                                    Reservar mis 30 minutos
                                </Button>
                            </form>
                        </div>

                        {/* Benefits */}
                        <div className={styles.benefits}>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>🎯</span>
                                <h4>Análisis Real</h4>
                                <p>Miramos tus procesos actuales, no te hacemos una presentación de ventas.</p>
                            </div>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>🗺️</span>
                                <h4>Ruta Clara</h4>
                                <p>Sales de la llamada sabiendo exactamente qué herramientas o cambios necesitas.</p>
                            </div>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>💰</span>
                                <h4>Precio Transparente</h4>
                                <p>Si podemos ayudarte, te decimos cuánto cuesta. Sin asteriscos.</p>
                            </div>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>🤝</span>
                                <h4>100% Sin Compromiso</h4>
                                <p>Nos enfocamos en aportar valor. Tú decides los siguientes pasos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
