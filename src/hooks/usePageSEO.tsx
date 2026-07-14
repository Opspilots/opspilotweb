import React from 'react';
import { Head } from 'vite-react-ssg';

interface PageSEOProps {
    title: string;
    description: string;
    canonical?: string;
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
export const PageSEO: React.FC<PageSEOProps> = ({ title, description, canonical }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

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
