// opspilot.es · Astro, HTML estático. Misma convención de URL que la web anterior:
// CON barra final (/casos/), cada ruta es un directorio con su index.html en dist/.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// Páginas que se publican en noindex y por tanto NO van al sitemap:
// las legales mientras falten razón social, NIF o domicilio (src/lib/company.ts).
const company = readFileSync(new URL('./src/lib/company.ts', import.meta.url), 'utf8');
const vacio = (re) => { const m = company.match(re); return !m || m[1] === ''; };
const legalIncompleto = vacio(/LEGAL_NAME = '([^']*)'/) || vacio(/TAX_ID = '([^']*)'/) || vacio(/street: '([^']*)'/);
const fueraDelSitemap = legalIncompleto ? ['/aviso-legal/', '/privacidad/', '/cookies/'] : [];

// Redirecciones. Astro genera, por cada una, una página estática con meta refresh y canonical al destino: NO es un 301.
// El 301 real lo da nginx (ver «Reenfoque» en DEPLOY.md): cada línea de aquí tiene su equivalente en public/.htaccess y en el
// bloque de nginx de DEPLOY.md. Si añades una, añádela también allí. Los destinos son siempre el destino FINAL (sin cadenas).
const redirects = {
  // Direcciones antiguas que la web anterior redirigía en el cliente
  '/servicios/': '/contacto/',
  '/precios/': '/contacto/',
  '/diagnostico/': '/contacto/',
  '/services/': '/contacto/',
  '/cases/': '/',
  '/pricing/': '/contacto/',
  '/resources/': '/recursos/',
  '/contact/': '/contacto/',
  '/demo/': '/contacto/',
  '/product/': '/recursos/',
  // 11-nov-2026, reenfoque: webs y soluciones a medida; fuera los casos de clientes y los productos
  '/productos/': '/soluciones/',
  '/productos/erp-hosteleria/': '/soluciones/',
  '/productos/presupuesya/': '/soluciones/',
  '/casos/': '/',
  '/soluciones/webs-y-tiendas/': '/webs/',
  '/diseno-web-cordoba/': '/webs/',
  '/soluciones/software-a-medida/': '/soluciones/',
  '/soluciones/automatizacion/': '/soluciones/',
  '/desarrollo-software-cordoba/': '/soluciones/',
  // 11-nov-2026: fuera las guías de producto de /recursos (a /soluciones/) y los casos «ilustrativos» de octubre
  '/recursos/energydeal-crm-energetico/': '/soluciones/',
  '/recursos/presupuestador-obra-bc3/': '/soluciones/',
  '/recursos/erp-hosteleria-tpv-restaurantes/': '/soluciones/',
  '/recursos/fiscalidad-plataforma-fiscal-contable/': '/soluciones/',
  '/recursos/caso-reformas-de-excel-a-sistema/': '/soluciones/',
  '/recursos/caso-energydeal-comercializadora-excel/': '/soluciones/',
  '/recursos/caso-asesoria-archivo-digital-cliente-web/': '/soluciones/',
  '/recursos/caso-hosteleria-tpv-inteligente-margen/': '/soluciones/',
  '/recursos/caso-agencia-servicios-pipeline-automatizado/': '/recursos/gestion-leads-agencia-sin-crm/',
  // 19-oct-2026: retirada la herramienta de precio de una web (decisión del fundador)
  '/herramientas/cuanto-cuesta-una-pagina-web/': '/webs/',
};

export default defineConfig({
  site: 'https://opspilot.es',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  redirects,
  integrations: [
    sitemap({
      // Fuera del sitemap: las páginas de redirección, el 404 y lo que va en noindex
      filter: (page) => {
        const ruta = new URL(page).pathname;
        return !(ruta in redirects) && !ruta.includes('/404') && !fueraDelSitemap.some((p) => ruta.endsWith(p));
      },
    }),
  ],
});
