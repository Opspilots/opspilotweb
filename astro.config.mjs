// opspilot.es · Astro, HTML estático. Misma convención de URL que la web anterior:
// CON barra final (/casos/), cada ruta es un directorio con su index.html en dist/.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// Páginas que se publican en noindex y por tanto NO van al sitemap:
// las legales mientras falten razón social, NIF o domicilio (src/lib/company.ts),
// y las fichas de producto marcadas noindex en src/data/productPages.ts.
const company = readFileSync(new URL('./src/lib/company.ts', import.meta.url), 'utf8');
const vacio = (re) => { const m = company.match(re); return !m || m[1] === ''; };
const legalIncompleto = vacio(/LEGAL_NAME = '([^']*)'/) || vacio(/TAX_ID = '([^']*)'/) || vacio(/street: '([^']*)'/);
const paginasProducto = readFileSync(new URL('./src/data/productPages.ts', import.meta.url), 'utf8');
const productosNoindex = [...paginasProducto.matchAll(/slug: '([^']+)'[\s\S]*?noindex: true/g)].map((m) => `/productos/${m[1]}/`);
const fueraDelSitemap = [...(legalIncompleto ? ['/aviso-legal/', '/privacidad/', '/cookies/'] : []), ...productosNoindex];

export default defineConfig({
  site: 'https://opspilot.es',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  // Direcciones antiguas que la web anterior redirigía en el cliente (src/lib/routes.ts).
  // Astro genera una página con redirección inmediata y canonical al destino.
  // En nginx conviene además un 301 de verdad (ver DEPLOY.md).
  redirects: {
    '/servicios/': '/contacto/',
    '/precios/': '/contacto/',
    '/diagnostico/': '/contacto/',
    '/services/': '/contacto/',
    '/cases/': '/casos/',
    '/pricing/': '/contacto/',
    '/resources/': '/recursos/',
    '/contact/': '/contacto/',
    '/demo/': '/contacto/',
    '/product/': '/recursos/',
    // 19-oct-2026: fuera los casos «ilustrativos» (inventados); cada uno a lo real más cercano
    '/recursos/caso-reformas-de-excel-a-sistema/': '/productos/presupuesya/',
    '/recursos/caso-energydeal-comercializadora-excel/': '/recursos/energydeal-crm-energetico/',
    '/recursos/caso-asesoria-archivo-digital-cliente-web/': '/soluciones/software-a-medida/',
    '/recursos/caso-hosteleria-tpv-inteligente-margen/': '/recursos/erp-hosteleria-tpv-restaurantes/',
    '/recursos/caso-agencia-servicios-pipeline-automatizado/': '/recursos/gestion-leads-agencia-sin-crm/',
    // 19-oct-2026: retirada la herramienta de precio de una web (decisión del fundador)
    '/herramientas/cuanto-cuesta-una-pagina-web/': '/soluciones/webs-y-tiendas/',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(servicios|precios|diagnostico|services|cases|pricing|resources|contact|demo|product)\/$/.test(page) && !page.includes('/recursos/caso-') && !page.includes('/cuanto-cuesta-una-pagina-web/') && !page.includes('/404') && !fueraDelSitemap.some((p) => page.endsWith(p)),
    }),
  ],
});
