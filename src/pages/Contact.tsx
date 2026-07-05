import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import sys from '../styles/page-system.module.css';
import styles from './Contact.module.css';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

const FORM_CONTACT_URL = 'https://formsubmit.co/ajax/opspilot.contact@gmail.com';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const Contact: React.FC = () => {
    usePageSEO({
        title: 'Contacto — Diagnóstico gratuito · OpsPilot',
        description:
            'Cuéntanos tu caso. En 30 minutos te decimos si tenemos solución, cómo sería y un rango aproximado de coste y plazo. Sin compromiso, respuesta en menos de 24h.',
        canonical: 'https://opspilot.es/contacto',
    });

    const heroRef = useHeroReveal<HTMLDivElement>();
    const contactRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMsg('');
        const form = e.currentTarget;
        const data = new FormData(form);
        const body: Record<string, string> = {};
        data.forEach((v, k) => { body[k] = v as string; });
        try {
            const res = await fetch(FORM_CONTACT_URL, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                setStatus('success');
                form.reset();
            } else {
                const json = await res.json().catch(() => ({}));
                setErrorMsg(json?.errors?.[0]?.message || 'Error al enviar. Inténtalo de nuevo.');
                setStatus('error');
            }
        } catch {
            setErrorMsg('Error de red. Comprueba tu conexión e inténtalo de nuevo.');
            setStatus('error');
        }
    };

    return (
        <div className={sys.page}>
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            ¿Tienes algo que <em className={sys.pageHeroAccent}>resolver</em>?
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            Cuéntanoslo. En 30 minutos te decimos si tenemos solución,
                            cómo sería y un rango aproximado de coste y plazo. Sin compromiso.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ FORM + INFO ═══ */}
            <section className={styles.formSection}>
                <div className={sys.container} ref={contactRef}>
                    <div className={styles.contactGrid}>
                        <div className={`${styles.formCard} reveal`}>
                            <h2 className={styles.formTitle}>Reserva tu diagnóstico gratuito</h2>
                            <p className={styles.formSub}>
                                Rellena esto y te respondemos en menos de 24 horas laborables.
                            </p>
                            {status === 'success' ? (
                                <div className={styles.formSuccess}>
                                    <p className={styles.formSuccessTitle}>Mensaje enviado</p>
                                    <p className={styles.formSuccessText}>
                                        Te respondemos en menos de 24 horas laborables.
                                    </p>
                                </div>
                            ) : (
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label htmlFor="name">¿Cómo te llamas?</label>
                                            <input id="name" name="name" type="text" placeholder="Tu nombre" required />
                                        </div>
                                        <div className={styles.field}>
                                            <label htmlFor="email">¿Dónde te respondemos?</label>
                                            <input id="email" name="email" type="email" placeholder="tu@email.com" required />
                                        </div>
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="company">Empresa o proyecto (opcional)</label>
                                        <input id="company" name="company" type="text" placeholder="¿En qué trabajas?" />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="subject">¿En qué te ayudamos?</label>
                                        <select id="subject" name="subject" required defaultValue="">
                                            <option value="" disabled>Selecciona una opción</option>
                                            <option value="aplicacion">Una aplicación o sitio a medida</option>
                                            <option value="agente">Un asistente IA que opere tareas</option>
                                            <option value="integracion">Integraciones entre las apps que ya uso</option>
                                            <option value="automatizacion">Automatizar procesos repetitivos</option>
                                            <option value="erp-crm">Un ERP o CRM hecho a medida</option>
                                            <option value="modernizacion">Modernizar mi negocio (salir de Excel)</option>
                                            <option value="producto">Información sobre un producto vertical</option>
                                            <option value="otro">Otro caso, lo explico abajo</option>
                                        </select>
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="message">¿Qué problema quieres resolver?</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            placeholder="Describe el contexto: tipo de negocio, qué herramientas usas hoy y qué te gustaría conseguir. Cuanto más detalle, mejor podemos orientarte."
                                            required
                                        ></textarea>
                                    </div>
                                    {status === 'error' && (
                                        <p className={styles.formError}>{errorMsg}</p>
                                    )}
                                    <Button variant="primary" fullWidth type="submit" disabled={status === 'submitting'}>
                                        {status === 'submitting' ? 'Enviando...' : 'Reservar diagnóstico gratuito'}
                                    </Button>
                                    <p className={styles.formMeta}>
                                        Respuesta &lt; 24h · Sin compromiso · Sin letra pequeña
                                    </p>
                                </form>
                            )}
                        </div>

                        <div className={styles.infoCol}>
                            <div className={`${styles.infoCard} reveal`}>
                                <h3 className={styles.infoTitle}>Contacto directo</h3>
                                <div className={styles.methods}>
                                    <div className={styles.method}>
                                        <span className={styles.methodIcon}><Mail size={20} strokeWidth={1.5} /></span>
                                        <div>
                                            <strong>Email</strong>
                                            <p>opspilot.contact@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className={styles.method}>
                                        <span className={styles.methodIcon}><MessageSquare size={20} strokeWidth={1.5} /></span>
                                        <div>
                                            <strong>WhatsApp</strong>
                                            <p>+34 640 75 61 26</p>
                                        </div>
                                    </div>
                                    <div className={styles.method}>
                                        <span className={styles.methodIcon}><MapPin size={20} strokeWidth={1.5} /></span>
                                        <div>
                                            <strong>Ubicación</strong>
                                            <p>Trabajamos en remoto desde España. Atendemos todo el territorio.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.waCard} reveal`}>
                                <h3 className={styles.infoTitle}>¿Prefieres hablar ahora?</h3>
                                <p>Escríbenos por WhatsApp y te respondemos al momento. Sin formularios, sin esperas.</p>
                                <a
                                    href="https://wa.me/34640756126?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20vuestros%20servicios."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="primary" fullWidth>
                                        <MessageSquare size={20} style={{ marginRight: '8px' }} /> Escribir por WhatsApp
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
