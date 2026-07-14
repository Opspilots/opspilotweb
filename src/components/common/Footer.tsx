import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { ROUTES } from '../../lib/routes';

const WhatsAppIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.445L.15 24l6.849-1.795c1.196.65 2.748 1.026 4.341 1.026h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* ── Banda CTA ── */}
                <div className={styles.cta}>
                    <div className={styles.ctaText}>
                        <h2 className={styles.ctaTitle}>
                            ¿Hay un proceso que te está frenando?
                        </h2>
                        <p className={styles.ctaSub}>
                            Cuéntanoslo. En 24 horas te decimos si tiene solución y qué costaría.
                        </p>
                    </div>
                    <Link to={ROUTES.contacto} className={styles.ctaBtn}>
                        <Button variant="primary" size="lg">Reservar diagnóstico</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {/* Marca */}
                    <div className={styles.brand}>
                        <Link to={ROUTES.home} className={styles.logo}>
                            <Logo size={40} /> OpsPilot
                        </Link>
                        <p className={styles.tagline}>
                            Software a medida para PYMEs. Precio cerrado, trato directo
                            y cero humo.
                        </p>
                        <a
                            href="https://wa.me/34640756126"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappLink}
                        >
                            <Button variant="outline" size="sm" className={styles.whatsappBtn}>
                                <WhatsAppIcon />
                                Escríbenos por WhatsApp
                            </Button>
                        </a>
                    </div>

                    {/* Navegación */}
                    <nav className={styles.links} aria-label="Navegación del pie de página">
                        <h4 className={styles.heading}>Navegación</h4>
                        <Link to={ROUTES.home} className={styles.link}>Inicio</Link>
                        <Link to={ROUTES.soluciones} className={styles.link}>Soluciones</Link>
                        <Link to={ROUTES.casos} className={styles.link}>Casos de éxito</Link>
                        <Link to={ROUTES.recursos} className={styles.link}>Recursos</Link>
                        <Link to={ROUTES.contacto} className={styles.link}>Contacto</Link>
                    </nav>

                    {/* Contacto */}
                    <div className={styles.links}>
                        <h4 className={styles.heading}>Contacto</h4>
                        <a href="mailto:opspilot.contact@gmail.com" className={styles.link}>
                            opspilot.contact@gmail.com
                        </a>
                        <a href="https://wa.me/34640756126" className={styles.link} target="_blank" rel="noopener noreferrer">
                            WhatsApp · 640 75 61 26
                        </a>
                        <span className={styles.metaLocation}>Córdoba, España</span>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} OpsPilot. Todos los derechos reservados.</p>
                    <span className={styles.bottomBrand}>
                        <span className={styles.bottomBrandDot} />
                        Hecho con cuidado en Córdoba
                    </span>
                </div>
            </div>
        </footer>
    );
};
