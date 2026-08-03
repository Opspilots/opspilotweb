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
const RESOURCES_SRC = join(ROOT, 'src', 'lib', 'resources.ts');

// Fecha del build (YYYY-MM-DD): fallback de lastmod para páginas estáticas
// (Home, Soluciones, Casos, Contacto, listado de Recursos) que no tienen una
// fecha real propia.
const LASTMOD = new Date().toISOString().slice(0, 10);

/**
 * Lastmod real por artículo de /recursos, leído desde `src/lib/resources.ts`.
 *
 * Node ejecuta este script directamente con `node` (sin paso de build/tsx), y
 * no puede hacer `import` de un módulo `.ts` sin un loader adicional. En vez
 * de meter tsx/ts-node solo para esto, leemos el archivo fuente como texto:
 * la forma de RESOURCES es lo bastante regular (un `slug` y un `date`/`updated`
 * por objeto, en ese orden) para extraerlos con una regex simple y segura.
 * Si el archivo cambia de forma y esto deja de encontrar coincidencias, el
 * fallback (LASTMOD de build) sigue aplicándose sin romper nada.
 * @returns {Map<string, string>} slug -> fecha ISO (updated ?? date)
 */
function loadResourceLastmods() {
    /** @type {Map<string, string>} */
    const map = new Map();
    if (!existsSync(RESOURCES_SRC)) return map;

    const src = readFileSync(RESOURCES_SRC, 'utf8');
    const slugMatches = [...src.matchAll(/slug:\s*'([^']+)'/g)];

    for (let i = 0; i < slugMatches.length; i++) {
        const slug = slugMatches[i][1];
        const start = slugMatches[i].index ?? 0;
        const end = i + 1 < slugMatches.length ? (slugMatches[i + 1].index ?? src.length) : src.length;
        const chunk = src.slice(start, end);

        // `updated` (dateModified) gana sobre `date` (datePublished), igual
        // que en ResourceDetail.tsx (`resource.updated ?? resource.date`).
        // \b evita que `\bdate:` case dentro de `updated:`.
        const updatedMatch = chunk.match(/updated:\s*'([^']+)'/);
        const dateMatch = chunk.match(/\bdate:\s*'([^']+)'/);
        const lastmod = updatedMatch?.[1] ?? dateMatch?.[1];
        if (lastmod) map.set(slug, lastmod);
    }

    return map;
}

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
    const resourceLastmods = loadResourceLastmods();

    /** @type {{ path: string, loc: string, priority: string, changefreq: string, lastmod: string }[]} */
    const entries = [];

    for (const file of files) {
        const html = readFileSync(file, 'utf8');
        if (isNoindex(html)) continue; // redirects + 404 se autoexcluyen

        const rel = relative(DIST_DIR, file).split(sep).join('/');
        const path = rel.replace(/\/?index\.html$/i, ''); // '' | 'soluciones' | 'recursos/slug'
        // Barra final SIEMPRE. No es cosmética: con `dirStyle: 'nested'` cada
        // ruta es una CARPETA en dist/, así que Apache (mod_dir) responde 301
        // de `/casos` a `/casos/` antes de servir su index.html. Mientras esto
        // emitía la forma sin barra, 21 de las 22 URLs del sitemap devolvían
        // 301 en vez de 200 — un sitemap entero apuntando a redirecciones.
        // La home es el único caso donde `path` es '' y la barra ya está.
        const loc = path === '' ? `${SITE_URL}/` : `${SITE_URL}/${path}/`;
        const { priority, changefreq } = metaForPath(path);

        // Artículos de /recursos/<slug>: lastmod real si lo tenemos, si no,
        // fecha de build (mismo fallback que el resto de páginas estáticas).
        const slug = path.startsWith('recursos/') ? path.slice('recursos/'.length) : null;
        const lastmod = (slug && resourceLastmods.get(slug)) || LASTMOD;

        entries.push({ path, loc, priority, changefreq, lastmod });
    }

    // Orden estable: prioridad descendente, luego alfabético por ruta.
    entries.sort((a, b) => {
        const p = Number(b.priority) - Number(a.priority);
        return p !== 0 ? p : a.path.localeCompare(b.path);
    });

    const urls = entries
        .map(({ loc, priority, changefreq, lastmod }) => {
            return [
                '  <url>',
                `    <loc>${loc}</loc>`,
                `    <lastmod>${lastmod}</lastmod>`,
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

    console.log(`[sitemap] ${entries.length} URLs escritas (fallback lastmod de build: ${LASTMOD}).`);
    for (const e of entries) console.log(`  ${e.priority}  ${e.lastmod}  ${e.loc}`);
}

main();
