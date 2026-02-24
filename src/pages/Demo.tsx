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
                        30 minutos que pueden{' '}
                        <span className="text-gradient">cambiar tu negocio.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Una llamada donde analizamos qué procesos te están costando tiempo y dinero
                        y te proponemos un plan concreto para resolverlo.
                        Sin PowerPoints, sin presión de ventas.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className={styles.section}>
                <div className={styles.container} ref={contentRef}>
                    <div className={styles.demoGrid}>
                        {/* Form */}
                        <div className={`${styles.formCard} reveal`}>
                            <h2 className={styles.formTitle}>Reserva tu sesión de diagnóstico</h2>
                            <p className={styles.formSub}>Rellena esto y te contactamos para confirmar día y hora.</p>
                            <form className={styles.form}>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label htmlFor="demoName">Tu nombre</label>
                                        <input id="demoName" type="text" placeholder="¿Cómo te llamas?" required />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="demoEmail">Tu email</label>
                                        <input id="demoEmail" type="email" placeholder="tu@email.com" required />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="demoCompany">Tu empresa o proyecto</label>
                                    <input id="demoCompany" type="text" placeholder="¿En qué trabajas?" />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="demoInterest">¿Cuál es tu mayor problema ahora mismo?</label>
                                    <select id="demoInterest" required>
                                        <option value="">Selecciona una opción</option>
                                        <option value="presupuestos">Crear presupuestos me lleva demasiado tiempo</option>
                                        <option value="energia">Analizo tarifas eléctricas manualmente</option>
                                        <option value="erp">Gestiono mi empresa con Excel y se me escapa todo</option>
                                        <option value="crm">Pierdo clientes por falta de seguimiento</option>
                                        <option value="web">No tengo web o la que tengo no genera nada</option>
                                        <option value="custom">Necesito una app o automatización a medida</option>
                                        <option value="orientacion">No sé por dónde empezar, necesito orientación</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="demoNotes">Cuéntanos más (opcional)</label>
                                    <textarea id="demoNotes" rows={4} placeholder="Cualquier detalle que nos ayude a preparar mejor la sesión..."></textarea>
                                </div>
                                <Button variant="primary" fullWidth size="lg" type="submit">
                                    Reservar mi diagnóstico gratuito
                                </Button>
                            </form>
                        </div>

                        {/* Benefits */}
                        <div className={styles.benefits}>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>🎯</span>
                                <h4>Análisis real, no una charla de ventas</h4>
                                <p>Miramos tu negocio con ojos frescos y te decimos qué procesos te están costando dinero o tiempo.</p>
                            </div>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>⚡</span>
                                <h4>Un plan concreto, no genérico</h4>
                                <p>Al terminar sabes exactamente qué pasos dar, en qué orden y cuánto costaría cada uno.</p>
                            </div>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>🤝</span>
                                <h4>Sin compromiso de contratar</h4>
                                <p>Si no podemos ayudarte, te lo decimos. Si podemos, decides tú si seguimos adelante.</p>
                            </div>
                            <div className={`${styles.benefitCard} reveal`}>
                                <span className={styles.benefitIcon}>💰</span>
                                <h4>100% gratuito</h4>
                                <p>El diagnóstico no tiene coste. Nos importa que salgas de la llamada con claridad, contrates o no.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
