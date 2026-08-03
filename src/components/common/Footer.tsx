import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import styles from './Footer.module.css';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { ROUTES } from '../../lib/routes';
// Datos de empresa desde su fuente única (ver src/lib/company.ts) — estaban
// escritos a mano aquí, en Contact.tsx, en lib/forms.ts y en el @graph de
// index.html, con el teléfono en tres formatos distintos.
import { ADDRESS, CONTACT_EMAIL, PHONE, WHATSAPP_URL } from '../../lib/company';

// Páginas que ya renderizan su propio panel de cierre (sys.endCtaBlock en
// page-system.module.css: Home "¿Hablamos?", Soluciones, Casos, Recursos y
// ResourceDetail). En esas rutas, la banda .cta de aquí duplicaba el mismo
// mensaje ("Reservar diagnóstico") justo debajo — dos paneles casi idénticos
// seguidos, puro scroll extra sin aportar nada. Contacto (la página ES el
// formulario) y 404 no tienen endCta propio, así que ahí sí se muestra.
// Lista mantenida a mano — si se añade un endCtaBlock a una página nueva,
// añadir su ruta aquí también.
const ROUTES_WITH_OWN_END_CTA: readonly string[] = [
    ROUTES.home,
    ROUTES.soluciones,
    ROUTES.casos,
    ROUTES.recursos,
];

const hasOwnEndCta = (pathname: string): boolean =>
    ROUTES_WITH_OWN_END_CTA.includes(pathname) ||
    // ResourceDetail vive en /recursos/:slug — mismo endCtaBlock que Recursos.
    pathname.startsWith(`${ROUTES.recursos}/`);

const WhatsAppIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.445L.15 24l6.849-1.795c1.196.65 2.748 1.026 4.341 1.026h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export const Footer: React.FC = () => {
    const { pathname } = useLocation();
    const showEndCta = !hasOwnEndCta(pathname);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
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
                            href={WHATSAPP_URL}
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

                    {/* Navegación.

                        Los dos rótulos del pie ("Navegación" y "Contacto") eran `<h4>`, y
                        eso metía un SALTO DE NIVEL en todas y cada una de las páginas del
                        sitio: el último encabezado del contenido es un `<h2>`, así que la
                        secuencia quedaba h2 → h4. Quien navega por encabezados con un
                        lector de pantalla lo lee como "aquí falta un nivel, ¿me he perdido
                        una sección?".

                        No se arregla subiéndolos a `<h2>`: serían dos encabezados de
                        página más, en TODAS las rutas, compitiendo con los de contenido
                        real y sin aportar nada al esquema del documento. Un rótulo de
                        columna de pie no es una sección del documento.

                        La solución correcta es que dejen de ser encabezados. Sin heading no
                        hay salto que arreglar, y no se pierde nada de navegación: el pie ya
                        es un landmark `contentinfo` y cada grupo tiene su propio nombre
                        accesible — este por el `aria-label` del `<nav>`, y el de contacto
                        por el `role="group"` + `aria-labelledby` de más abajo. */}
                    <nav className={styles.links} aria-label="Navegación del pie de página">
                        <p className={styles.heading}>Navegación</p>
                        <Link to={ROUTES.home} className={styles.link}>Inicio</Link>
                        <Link to={ROUTES.soluciones} className={styles.link}>Soluciones</Link>
                        <Link to={ROUTES.casos} className={styles.link}>Casos de éxito</Link>
                        <Link to={ROUTES.recursos} className={styles.link}>Recursos</Link>
                        <Link to={ROUTES.contacto} className={styles.link}>Contacto</Link>
                    </nav>

                    {/* Contacto — mismo criterio que el bloque de navegación de arriba:
                        el rótulo deja de ser `<h4>` para no meter un salto de nivel. Como
                        este grupo no es un `<nav>` y por tanto no tiene landmark propio que
                        lo nombre, se le da nombre accesible explícito con `role="group"` +
                        `aria-labelledby` apuntando al propio rótulo. Así un lector de
                        pantalla sigue anunciando "grupo Contacto" al entrar. */}
                    <div className={styles.links} role="group" aria-labelledby="footer-contacto">
                        <p className={styles.heading} id="footer-contacto">Contacto</p>
                        <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
                            {CONTACT_EMAIL}
                        </a>
                        <a href={WHATSAPP_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
                            WhatsApp · {PHONE.display}
                        </a>
                        {/* Ubicación del negocio, y ahora se lee como tal.

                            Antes era un `<span>` suelto con "Córdoba, España":
                            cierto, pero indistinguible de un pie de página
                            cualquiera. `<address>` es el elemento que HTML
                            tiene para exactamente esto —los datos de contacto
                            de quien firma el documento— y aquí está dentro del
                            landmark `contentinfo`, que es el único sitio donde
                            la especificación permite que se refiera al
                            documento entero y no a un artículo suelto. Los
                            navegadores lo pintan en cursiva por defecto: lo
                            neutraliza `font-style: normal` en .metaLocation.

                            SIN DIRECCIÓN POSTAL INVENTADA, y con el hueco ya
                            montado. `street` y `postalCode` están vacíos en
                            company.ts con su TODO(negocio); las líneas se
                            componen en el orden postal español (vía → CP +
                            localidad → comunidad, país) y las vacías se caen
                            solas con el `.filter(Boolean)`. Hoy salen dos
                            líneas; el día que alguien rellene la calle en
                            company.ts salen tres, sin volver a tocar este
                            componente. Un hueco dejado como comentario "para
                            cuando llegue el dato" es justo el que nadie
                            encuentra el día que el dato llega.

                            OJO CON `region`: en company.ts es "Andalucía", o
                            sea la COMUNIDAD, no la provincia — no hay campo de
                            provincia y no se inventa uno. Para Córdoba capital
                            coinciden nombre de ciudad y de provincia, así que
                            no se pierde nada; si algún día la sede se mueve a
                            otro municipio, el campo que falta hay que añadirlo
                            allí y no parchearlo aquí. */}
                        <address className={styles.metaLocation}>
                            <MapPin size={14} strokeWidth={1.8} className={styles.metaLocationIcon} aria-hidden="true" />
                            <span className={styles.metaLocationLines}>
                                {[
                                    ADDRESS.street,
                                    [ADDRESS.postalCode, ADDRESS.locality].filter(Boolean).join(' '),
                                    `${ADDRESS.region}, ${ADDRESS.country}`,
                                ]
                                    .filter(Boolean)
                                    .map((line) => <span key={line}>{line}</span>)}
                            </span>
                        </address>
                    </div>
                </div>

                {/* ── Banda CTA — bajo los menús del pie. Solo en páginas sin
                    endCtaBlock propio (ver ROUTES_WITH_OWN_END_CTA arriba). ── */}
                {showEndCta && (
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
                )}

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
