// Fuente única de verdad de los datos de empresa.
//
// POR QUÉ EXISTE: hasta ahora el email de contacto vivía escrito a mano en
// cinco sitios (Footer, Contact, el endpoint de FormSubmit en lib/forms.ts, el
// FORM_CONTACT_URL propio de Contact y el @graph de index.html), el teléfono
// en cuatro formatos distintos y la URL canónica en lib/seo.ts. Cambiar el
// correo de contacto obligaba a un grep y a acertar en todos. Peor: el
// formulario envía datos personales a un tercero (FormSubmit) y la web no
// declara en ningún sitio QUIÉN los trata — sin razón social ni NIF no se
// puede escribir una cláusula informativa honesta. Este módulo es donde esos
// datos deben vivir, y donde se ve de un vistazo cuáles faltan.
//
// LÍMITE DELIBERADO: el @graph de Schema.org de index.html NO consume este
// módulo. index.html es HTML estático que se sirve tal cual en el prerender de
// vite-react-ssg: no pasa por el bundler, así que no puede importar un módulo
// TypeScript. Migrarlo exigiría mover el JSON-LD a un componente React
// (<StructuredData>) y quitarlo del HTML, lo que toca el prerender de TODAS
// las rutas. Fuera de alcance: queda anotado aquí y en el informe.
//
// Los valores que hoy NO conocemos se dejan como cadena vacía con su
// TODO(negocio) al lado. Cadena vacía y no un placeholder inventado a
// propósito: un `''` se ve en pantalla como un hueco y obliga a rellenarlo;
// un "Calle Ejemplo 123" se cuela en producción sin que nadie lo note.

/** Nombre comercial. Es el que se ve en toda la web. */
export const BRAND_NAME = 'OpsPilot';

/** Razón social completa (la que firma contratos y aparece en el aviso legal). */
// TODO(negocio): rellenar — razón social completa con forma jurídica (S.L., autónomo, etc.)
export const LEGAL_NAME = '';

/** NIF/CIF. Obligatorio en el aviso legal (art. 10 LSSI). */
// TODO(negocio): rellenar — NIF/CIF del responsable del tratamiento
export const TAX_ID = '';

/** Domicilio fiscal. `locality` y `region` ya son públicos en la web
 *  (Footer: "Córdoba, España"); calle y CP faltan. */
export const ADDRESS = {
    // TODO(negocio): rellenar — vía, número y planta/puerta
    street: '',
    // TODO(negocio): rellenar — código postal
    postalCode: '',
    locality: 'Córdoba',
    region: 'Andalucía',
    country: 'España',
    countryCode: 'ES',
} as const;

/** Email de contacto público. Es TAMBIÉN el buzón al que FormSubmit entrega
 *  los formularios (ver lib/forms.ts) y el canal de ejercicio de derechos
 *  RGPD que se cita en la cláusula de consentimiento del embudo. */
export const CONTACT_EMAIL = 'opspilot.contact@gmail.com';

/** Teléfono en sus tres formas. Se guardan las tres porque cada consumidor
 *  necesita una distinta y derivar unas de otras con `replace` es más frágil
 *  y menos legible que declararlas: `wa.me` exige el internacional sin `+`
 *  ni espacios, `tel:`/Schema.org exige E.164, y la web muestra la agrupada. */
export const PHONE = {
    /** Como se lee en pantalla. */
    display: '+34 640 75 61 26',
    /** E.164 — para `tel:` y para el JSON-LD. */
    e164: '+34640756126',
    /** Sin `+` ni separadores — lo que exige la URL de wa.me. */
    wa: '34640756126',
} as const;

/** Enlace base de WhatsApp. Quien necesite mensaje predefinido le añade
 *  `?text=` (ver Contact.tsx) — no se mete aquí porque el texto es distinto
 *  según desde dónde se abra. */
export const WHATSAPP_URL = `https://wa.me/${PHONE.wa}`;

/** URL canónica del sitio, sin barra final y sin www (misma convención que
 *  ya seguía SITE_URL en lib/seo.ts, que ahora deriva de aquí). */
export const SITE_URL = 'https://opspilot.es';

/** Endpoint de FormSubmit. Vive aquí y no en lib/forms.ts porque lo que
 *  determina la URL es a QUÉ buzón entrega, es decir un dato de empresa: si
 *  mañana cambia CONTACT_EMAIL, el endpoint cambia con él sin tocar nada más. */
export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

/**
 * Encargado del tratamiento al que salen los datos del formulario.
 * Se declara explícito porque la cláusula informativa DEBE nombrarlo: los
 * datos no se quedan en un servidor nuestro, viajan a un tercero.
 */
export const FORM_PROCESSOR = {
    name: 'FormSubmit',
    url: 'https://formsubmit.co',
} as const;
