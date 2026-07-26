import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { PageSEO } from '../hooks/usePageSEO';
import { buildBreadcrumb } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import sys from '../styles/page-system.module.css';
import styles from './Contact.module.css';
import { Mail, MessageSquare } from 'lucide-react';
// Datos de empresa desde su fuente única (ver src/lib/company.ts). El endpoint
// se toma del mismo sitio: lo que lo determina es a qué buzón entrega, y ese
// buzón es un dato de empresa, no una constante de esta página.
import { CONTACT_EMAIL, FORMSUBMIT_ENDPOINT, PHONE, WHATSAPP_URL } from '../lib/company';

const FORM_CONTACT_URL = FORMSUBMIT_ENDPOINT;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const Contact: React.FC = () => {
    const seoProps = {
        title: 'Contacto OpsPilot — Diagnóstico gratuito y presupuesto',
        description:
            'Cuéntanos tu caso. En 30 minutos te decimos si tiene solución, cómo sería y un presupuesto aproximado. Diagnóstico gratuito, respuesta en menos de 24h.',
        canonical: 'https://opspilot.es/contacto/',
    };

    const breadcrumb = buildBreadcrumb([
        { name: 'Inicio', url: 'https://opspilot.es/' },
        { name: 'Contacto', url: 'https://opspilot.es/contacto/' },
    ]);

    const heroRef = useHeroReveal<HTMLDivElement>();
    const contactRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Validación en cliente: orden de campos = orden de foco al primer error.
    const validate = (data: FormData): Record<string, string> => {
        const errs: Record<string, string> = {};
        const name = (data.get('name') as string ?? '').trim();
        const email = (data.get('email') as string ?? '').trim();
        const subject = (data.get('subject') as string ?? '').trim();
        const message = (data.get('message') as string ?? '').trim();

        if (!name) errs.name = 'Dinos cómo te llamas.';
        if (!email) errs.email = 'Déjanos un email para responderte.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Ese email no parece válido. Revísalo.';
        if (!subject) errs.subject = 'Elige en qué te ayudamos.';
        if (!message) errs.message = 'Cuéntanos qué quieres resolver.';
        return errs;
    };

    // Limpia el error de un campo en cuanto el usuario lo edita.
    const clearFieldError = (fieldName: string) => {
        setFieldErrors((prev) => {
            if (!prev[fieldName]) return prev;
            const next = { ...prev };
            delete next[fieldName];
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const errs = validate(data);
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            setStatus('idle');
            // Enfoca el primer campo con error para lectores de pantalla y teclado.
            const firstKey = ['name', 'email', 'subject', 'message'].find((k) => errs[k]);
            if (firstKey) {
                form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
            }
            return;
        }

        setFieldErrors({});
        setStatus('submitting');
        setErrorMsg('');
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
                setErrorMsg(json?.errors?.[0]?.message || 'No se pudo enviar. Vuelve a intentarlo en un momento.');
                setStatus('error');
            }
        } catch {
            setErrorMsg('Fallo de red. Revisa tu conexión y vuelve a intentarlo.');
            setStatus('error');
        }
    };

    return (
        <div className={sys.page}>
            <PageSEO {...seoProps} />
            <StructuredData data={breadcrumb} />
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            ¿Tienes algo que <em className={sys.pageHeroAccent}>resolver</em>?
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            Cuéntanoslo sin rodeos. En media hora sabrás si tiene solución,
                            qué cuesta y en qué plazo.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ FORM + INFO ═══ */}
            <section className={styles.formSection}>
                <div className={sys.container} ref={contactRef}>
                    <div className={styles.contactGrid}>
                        <div className={`${styles.formCard} glass reveal`}>
                            <h2 className={styles.formTitle}>Reserva tu diagnóstico gratuito</h2>
                            <p className={styles.formSub}>
                                Cuéntanos tu caso y te escribimos con los próximos pasos en
                                menos de 24 horas laborables.
                            </p>
                            {status === 'success' ? (
                                <div className={styles.formSuccess}>
                                    <p className={styles.formSuccessTitle}>Mensaje recibido</p>
                                    <p className={styles.formSuccessText}>
                                        Lo revisamos y te escribimos con los próximos pasos en
                                        menos de 24 horas laborables. Revisa también tu carpeta de spam.
                                    </p>
                                </div>
                            ) : (
                                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                                    {/* Honeypot antispam de FormSubmit: invisible para humanos, cebo para bots */}
                                    <input
                                        type="text"
                                        name="_honey"
                                        style={{ display: 'none' }}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                    />
                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label htmlFor="name">¿Cómo te llamas?</label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Tu nombre"
                                                autoComplete="name"
                                                aria-invalid={!!fieldErrors.name}
                                                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                                                onInput={() => clearFieldError('name')}
                                            />
                                            {fieldErrors.name && (
                                                <span id="name-error" className={styles.fieldError} role="alert">
                                                    {fieldErrors.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.field}>
                                            <label htmlFor="email">¿Dónde te respondemos?</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                autoComplete="email"
                                                inputMode="email"
                                                aria-invalid={!!fieldErrors.email}
                                                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                                onInput={() => clearFieldError('email')}
                                            />
                                            {fieldErrors.email && (
                                                <span id="email-error" className={styles.fieldError} role="alert">
                                                    {fieldErrors.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="company">Empresa o proyecto (opcional)</label>
                                        <input id="company" name="company" type="text" placeholder="¿En qué trabajas?" autoComplete="organization" />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="subject">¿En qué te ayudamos?</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            defaultValue=""
                                            aria-invalid={!!fieldErrors.subject}
                                            aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                                            onChange={() => clearFieldError('subject')}
                                        >
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
                                        {fieldErrors.subject && (
                                            <span id="subject-error" className={styles.fieldError} role="alert">
                                                {fieldErrors.subject}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="message">¿Qué problema quieres resolver?</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            placeholder="Describe el contexto: tipo de negocio, qué herramientas usas hoy y qué te gustaría conseguir. Cuanto más detalle, mejor podemos orientarte."
                                            aria-invalid={!!fieldErrors.message}
                                            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                                            onInput={() => clearFieldError('message')}
                                        ></textarea>
                                        {fieldErrors.message && (
                                            <span id="message-error" className={styles.fieldError} role="alert">
                                                {fieldErrors.message}
                                            </span>
                                        )}
                                    </div>
                                    {status === 'error' && (
                                        <p className={styles.formError} role="alert">{errorMsg}</p>
                                    )}
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        magnetic
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        aria-busy={status === 'submitting'}
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <span className={styles.submitSkeleton} aria-hidden="true" />
                                                <span className={styles.srOnly}>Enviando tu mensaje</span>
                                            </>
                                        ) : (
                                            'Reservar diagnóstico gratuito'
                                        )}
                                    </Button>
                                    <p className={styles.formMeta}>
                                        Respuesta &lt; 24h · Sin compromiso · Sin letra pequeña
                                    </p>
                                </form>
                            )}
                        </div>

                        <div className={styles.infoCol}>
                            <div className={`${sys.lightCard} ${styles.infoCard} reveal`}>
                                <h3 className={styles.infoTitle}>Contacto directo</h3>
                                <div className={styles.methods}>
                                    <div className={styles.method}>
                                        <span className={styles.methodIcon}><Mail size={20} strokeWidth={1.5} /></span>
                                        <div>
                                            <strong>Email</strong>
                                            <p><a href={`mailto:${CONTACT_EMAIL}`} className={styles.emailLink}>{CONTACT_EMAIL}</a></p>
                                        </div>
                                    </div>
                                    <div className={styles.method}>
                                        <span className={styles.methodIcon}><MessageSquare size={20} strokeWidth={1.5} /></span>
                                        <div>
                                            <strong>WhatsApp</strong>
                                            <p>{PHONE.display}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.waCard} reveal`}>
                                <h3 className={styles.infoTitle}>¿Prefieres hablar ahora?</h3>
                                <p>Escríbenos por WhatsApp y te contestamos en horario laboral. Sin formularios.</p>
                                <a
                                    href={`${WHATSAPP_URL}?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20vuestros%20servicios.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {/* CTA secundario: el envío del formulario es el único primario. */}
                                    <Button variant="secondary" fullWidth>
                                        <span className={styles.waButtonLabel}>
                                            <MessageSquare size={20} /> Escribir por WhatsApp
                                        </span>
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
