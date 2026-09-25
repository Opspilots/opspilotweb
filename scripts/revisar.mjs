// Revisión del sitio construido (dist/). Uso: npm run build && npm run check
// Comprueba en TODAS las páginas: enlaces y recursos internos que existen, title ≤ 60,
// description ≤ 155, un solo h1, canonical con barra final, JSON-LD válido y títulos únicos.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const paginas = [];
(function recorrer(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) recorrer(p);
    else if (f.endsWith('.html')) paginas.push(p);
  }
})(DIST);

const errores = [];
const avisos = [];
const titulos = new Map();
const existe = (url) => {
  const [ruta] = url.split(/[?#]/);
  const p = join(DIST, decodeURIComponent(ruta));
  return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
};

for (const archivo of paginas) {
  const html = readFileSync(archivo, 'utf8');
  const ruta = '/' + relative(DIST, archivo).split(sep).join('/').replace(/index\.html$/, '');
  if (/http-equiv="refresh"/.test(html)) continue; // páginas de redirección de Astro
  const noindex = /name="robots" content="noindex/.test(html);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? '';
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] ?? '';
  const t = title.replace(/&amp;/g, '&');
  if (!t) errores.push(`${ruta}: sin <title>`);
  // Los artículos conservan el título con el que ya están indexados (igual que en la web anterior):
  // si pasa de 60, es un aviso, no un error.
  if (t.length > 60) (ruta.startsWith('/recursos/') ? avisos : errores).push(`${ruta}: title de ${t.length} caracteres (máx. 60): ${t}`);
  if (!desc) errores.push(`${ruta}: sin description`);
  if (desc.length > 160) (ruta.startsWith('/recursos/') ? avisos : errores).push(`${ruta}: description de ${desc.length} caracteres (máx. 155-160)`);
  if (h1 !== 1) errores.push(`${ruta}: ${h1} h1 (debe haber 1)`);
  if (!ruta.startsWith('/404') && canon !== `https://opspilot.es${ruta}`) errores.push(`${ruta}: canonical ${canon}`);
  if (!noindex && !ruta.startsWith('/404')) {
    if (titulos.has(t)) errores.push(`${ruta}: title repetido con ${titulos.get(t)}`);
    titulos.set(t, ruta);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { errores.push(`${ruta}: JSON-LD no válido`); }
  }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (url.startsWith('//')) continue;
    if (!existe(url)) errores.push(`${ruta}: enlace roto ${url}`);
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    const id = m[1];
    if (id.startsWith('i-') || id === 'aro') continue;
    if (!new RegExp(`id="${id}"`).test(html)) errores.push(`${ruta}: ancla sin destino #${id}`);
  }
}

console.log(`${paginas.length} páginas revisadas`);
if (avisos.length) console.log(`Avisos (${avisos.length}):\n` + avisos.join('\n'));
if (errores.length) { console.log(errores.join('\n')); process.exit(1); }
console.log('Sin errores.');
