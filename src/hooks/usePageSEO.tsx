import React from 'react';
import { Head } from 'vite-react-ssg';

/** Valor de `<meta name="robots">` para una página que SÍ debe indexarse. Es
 *  el que emitían las 5 páginas existentes cuando este literal estaba
 *  incrustado en el JSX, y sigue siendo el valor por defecto: extraerlo a una
 *  constante no cambia ni un carácter del HTML que generan. */
const ROBOTS_INDEXABLE = 'index, follow, max-image-preview:large, max-snippet:-1';

/** Y este es el de una página que NO debe entrar en el índice. `follow` y no
 *  `nofollow` a propósito: queremos que el rastreador SIGA los enlaces de
 *  salida (a /soluciones, a /recursos, al producto en producción) para que esas
 *  páginas sí reciban la señal — lo que no queremos es que ESTA salga en
 *  resultados todavía. Mismo par exacto que ya emiten RedirectTo.tsx y
 *  NotFound.tsx, para no inventar un tercer dialecto de robots en el repo. */
const ROBOTS_NOINDEX = 'noindex, follow';

interface PageSEOProps {
    title: string;
    description: string;
    canonical?: string;
    /** ¿Esta ruta debe quedarse FUERA del índice de Google?
     *
     *  Por qué existe. Hasta ahora este componente emitía `index, follow` como
     *  literal fijo, sin forma de pedir otra cosa: toda ruta nueva nacía
     *  indexable y no había manera de publicar una página "en pruebas" sin que
     *  entrara al índice el mismo día. Era una trampa señalada en la auditoría
     *  de SEO, y la primera que la pisa es este bloque — las páginas de
     *  /productos duplican a propósito el contenido de dos artículos de
     *  /recursos que HOY están publicados e indexables, así que hasta que se
     *  activen las 301 (§4 de .seo/01-rutas-y-metadatos.md) no pueden competir
     *  con ellos en el índice.
     *
     *  OPCIONAL Y CON DEFAULT INDEXABLE, y esto es lo importante: las 5 páginas
     *  que ya existían (Home, Soluciones, Casos, Recursos, ResourceDetail,
     *  Contacto) no pasan la prop y por tanto emiten EXACTAMENTE el mismo
     *  `content` de antes. Un default al revés —noindex salvo que digas lo
     *  contrario— habría sacado el sitio entero del índice con una prop
     *  olvidada, que es un fallo mucho más caro que el que esto arregla.
     *
     *  BONUS QUE NO HAY QUE CABLEAR: scripts/generate-sitemap.mjs construye el
     *  sitemap escaneando el HTML prerenderizado y descarta cualquier fichero
     *  cuyo meta robots contenga `noindex` (ver `isNoindex`, líneas ~115-118).
     *  O sea que pasar `noindex` aquí saca la ruta del índice Y del sitemap a
     *  la vez, sin listas manuales que mantener. */
    noindex?: boolean;
}

/**
 * Cabecera SEO por ruta renderizada en server-side (SSG).
 *
 * Sustituye al antiguo hook `usePageSEO` que manipulaba el DOM en un efecto
 * (solo cliente). `<Head>` de vite-react-ssg (wrapper de react-helmet-async)
 * emite estas etiquetas dentro del HTML estático generado en build, y en
 * cliente las sincroniza durante la navegación. Sobrescribe por dedupe los
 * valores por defecto declarados en `index.html` (title, description, og:*,
 * twitter:*, canonical).
 */
export const PageSEO: React.FC<PageSEOProps> = ({ title, description, canonical, noindex = false }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={noindex ? ROBOTS_NOINDEX : ROBOTS_INDEXABLE} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {/* Canonical + alternates (solo cuando la ruta define canonical) */}
            {canonical && <meta property="og:url" content={canonical} />}
            {canonical && <link rel="canonical" href={canonical} />}
            {canonical && <link rel="alternate" hrefLang="es-ES" href={canonical} />}
            {canonical && <link rel="alternate" hrefLang="x-default" href={canonical} />}
        </Head>
    );
};
