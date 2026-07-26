import type { Resource } from './resources';
import { BRAND_NAME, SITE_URL as COMPANY_SITE_URL } from './company';

/** URL base del sitio (sin barra final, sin www). Reexportada desde
 *  src/lib/company.ts —misma cadena, un solo sitio donde cambiarla— y no
 *  redeclarada aquí: el nombre `SITE_URL` tiene ~30 consumidores y renombrarlo
 *  no aporta nada. */
export const SITE_URL = COMPANY_SITE_URL;

/** @id de la Organization declarada en el @graph global de index.html. */
export const ORG_ID = `${SITE_URL}/#organization`;

/** Nombre público de la organización, reutilizable como publisher. */
export const ORG_NAME = BRAND_NAME;

/** Logo de la organización, reutilizable en publisher.logo. */
export const ORG_LOGO = `${SITE_URL}/favicon.svg`;

/**
 * BreadcrumbList JSON-LD a partir de una lista ordenada de migas.
 * Cada item necesita un `name` visible y una `url` absoluta.
 *
 * CONVENCIÓN: las `url` van CON barra final (`/casos/`, no `/casos`), igual
 * que los canonicals y el sitemap. Motivo: con `ssgOptions.dirStyle: 'nested'`
 * cada ruta se prerenderiza como carpeta, así que Apache ya responde 301 de
 * `/casos` a `/casos/` por su cuenta — declarar la forma sin barra hacía que
 * el breadcrumb apuntara a una URL que redirige, contradiciendo al canonical
 * de su propia página. La función NO normaliza: recibe la URL tal cual y la
 * emite tal cual, para no inventarse barras en URLs con fragmento o query.
 * La responsabilidad de pasar la forma canónica es de quien llama.
 */
export function buildBreadcrumb(items: { name: string; url: string }[]): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Article JSON-LD a partir de un `Resource` y su URL canónica absoluta.
 * Usa `cover` como imagen si existe; el publisher es la Organization OpsPilot
 * (enlazada por @id al @graph global).
 */
export function buildArticle(r: Resource, url: string): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: r.title,
        description: r.desc,
        inLanguage: 'es-ES',
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        ...(r.cover ? { image: `${SITE_URL}${r.cover}` } : {}),
        author: { '@type': 'Organization', name: ORG_NAME, '@id': ORG_ID },
        publisher: {
            '@type': 'Organization',
            '@id': ORG_ID,
            name: ORG_NAME,
            logo: { '@type': 'ImageObject', url: ORG_LOGO },
        },
    };
}

/**
 * FAQPage JSON-LD a partir de una lista de pares pregunta/respuesta.
 */
export function buildFAQ(qas: { q: string; a: string }[]): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: qas.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
        })),
    };
}
