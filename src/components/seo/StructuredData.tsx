import React from 'react';
import { Head } from 'vite-react-ssg';

interface StructuredDataProps {
    /** Objeto JS con el JSON-LD (schema.org). Se serializa a `application/ld+json`. */
    data: object;
}

/**
 * Inyecta un bloque JSON-LD (schema.org) renderizado server-side (SSG).
 *
 * Usa `<Head>` de vite-react-ssg (mismo patrón que `PageSEO`), por lo que el
 * `<script type="application/ld+json">` aparece en el HTML prerenderizado en
 * build y se sincroniza en cliente durante la navegación. Cada página puede
 * montar tantos `<StructuredData>` como necesite (Article, BreadcrumbList,
 * FAQPage, etc.) sin colisionar con el `@graph` global de `index.html`.
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
    return (
        <Head>
            <script type="application/ld+json">{JSON.stringify(data)}</script>
        </Head>
    );
};
