// @ts-check
/**
 * Generador de sitemap postbuild.
 *
 * Escanea `dist/**\/index.html` tras el build y construye el sitemap desde la
 * realidad del prerender, en lugar de mantener una lista estática y frágil.
 *
 * Regla de inclusión: una ruta entra en el sitemap solo si su HTML NO lleva
 * `<meta name="robots" ... noindex ...>`. Los redirects (servicios, precios,
 * productos, services, cases, pricing, resources, contact, demo, product,
 * diagnostico) y la 404 emiten `noindex, follow`, así que se autoexcluyen sin
 * necesidad de listas manuales.
 *
 * Escribe el resultado en `dist/sitemap.xml` (lo sirve el build) y en
 * `public/sitemap.xml` (fuente de verdad versionada en el repo).
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://opspilot.es';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST_DIR = join(ROOT, 'dist');
const PUBLIC_SITEMAP = join(ROOT, 'public', 'sitemap.xml');
const DIST_SITEMAP = join(DIST_DIR, 'sitemap.xml');

// Fecha del build (YYYY-MM-DD) usada como lastmod de todas las URLs.
const LASTMOD = new Date().toISOString().slice(0, 10);

/**
 * Prioridad y frecuencia de cambio por ruta indexable.
 * `path` es la ruta relativa sin barra inicial ('' = home).
 * @param {string} path
 * @returns {{ priority: string, changefreq: string }}
 */
function metaForPath(path) {
    if (path === '') return { priority: '1.0', changefreq: 'weekly' };
    if (path === 'soluciones') return { priority: '0.9', changefreq: 'monthly' };
    if (path === 'casos') return { priority: '0.8', changefreq: 'monthly' };
    if (path === 'recursos') return { priority: '0.7', changefreq: 'monthly' };
    if (path === 'contacto') return { priority: '0.6', changefreq: 'yearly' };
    if (path.startsWith('recursos/')) return { priority: '0.6', changefreq: 'monthly' };
    // Fallback conservador para cualquier ruta indexable nueva no contemplada.
    return { priority: '0.5', changefreq: 'monthly' };
}

/**
 * Recorre un directorio recursivamente y devuelve la ruta de cada index.html.
 * @param {string} dir
 * @returns {string[]}
 */
function findIndexHtml(dir) {
    /** @type {string[]} */
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...findIndexHtml(full));
        } else if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
            out.push(full);
        }
    }
    return out;
}

/**
 * Detecta si un HTML está marcado como noindex en su meta robots.
 * @param {string} html
 * @returns {boolean}
 */
function isNoindex(html) {
    const robotsMetas = html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/gi) || [];
    return robotsMetas.some((m) => /noindex/i.test(m));
}

function main() {
    if (!existsSync(DIST_DIR)) {
        console.error(`[sitemap] No existe ${DIST_DIR}. Ejecuta el build antes.`);
        process.exit(1);
    }

    const files = findIndexHtml(DIST_DIR);

    /** @type {{ path: string, loc: string, priority: string, changefreq: string }[]} */
    const entries = [];

    for (const file of files) {
        const html = readFileSync(file, 'utf8');
        if (isNoindex(html)) continue; // redirects + 404 se autoexcluyen

        const rel = relative(DIST_DIR, file).split(sep).join('/');
        const path = rel.replace(/\/?index\.html$/i, ''); // '' | 'soluciones' | 'recursos/slug'
        const loc = path === '' ? `${SITE_URL}/` : `${SITE_URL}/${path}`;
        const { priority, changefreq } = metaForPath(path);
        entries.push({ path, loc, priority, changefreq });
    }

    // Orden estable: prioridad descendente, luego alfabético por ruta.
    entries.sort((a, b) => {
        const p = Number(b.priority) - Number(a.priority);
        return p !== 0 ? p : a.path.localeCompare(b.path);
    });

    const urls = entries
        .map(({ loc, priority, changefreq }) => {
            return [
                '  <url>',
                `    <loc>${loc}</loc>`,
                `    <lastmod>${LASTMOD}</lastmod>`,
                `    <changefreq>${changefreq}</changefreq>`,
                `    <priority>${priority}</priority>`,
                `    <xhtml:link rel="alternate" hreflang="es-ES" href="${loc}" />`,
                `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`,
                '  </url>',
            ].join('\n');
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

    writeFileSync(DIST_SITEMAP, xml, 'utf8');
    writeFileSync(PUBLIC_SITEMAP, xml, 'utf8');

    console.log(`[sitemap] ${entries.length} URLs escritas (lastmod ${LASTMOD}).`);
    for (const e of entries) console.log(`  ${e.priority}  ${e.loc}`);
}

main();
