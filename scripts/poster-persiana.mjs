// Genera los pósteres de «La persiana» (la cabecera de la home) renderizando la propia escena y capturando el canvas.
// Uso:
//   npm run build && npx astro preview --port 4417     (en otra terminal)
//   node scripts/poster-persiana.mjs [http://localhost:4417/]
// Variables: PLAYWRIGHT = ruta a un paquete playwright (no es dependencia del repo), CHROME = ejecutable de Chromium.
// Escribe public/images/persiana/{inicio,final}-{ancho,alto}-<versión>-<ancho>.{avif,webp}: un juego por encuadre
// (escritorio y móvil), cada uno con su proporción (la misma que ASPECTOS en src/scripts/persiana/escena.ts).
// Las imágenes se sirven inmutables: si cambia la escena, sube POSTER_V aquí Y en src/components/CabeceraPersiana.astro
// (nombre nuevo, no sobrescribir).
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const POSTER_V = 'v3';
// Sobremuestreo: se renderiza un 25 % más grande que el póster mayor y se reduce (bordes más limpios que el antialias
// del canvas solo). Peso: cada póster tiene un tope en KB (AVIF; el WebP, 1,7 veces más): se codifica con la calidad
// de partida y, si se pasa, se baja de 4 en 4 hasta que cabe. El grano de la cal y del empedrado es lo que más pesa.
// El de móvil (el LCP en un 4G) se queda por debajo de 60 KB.
const FORMATOS = {
  ancho: { aspecto: 0.82, anchos: [810, 1080, 1620], tope: { 810: 60, 1080: 100, 1620: 190 } },
  alto: { aspecto: 0.7, anchos: [540, 810, 1080], tope: { 540: 30, 810: 45, 1080: 58 } },
};
const CALIDAD = { avif: 52, webp: 76 };
const MINIMA = { avif: 30, webp: 50 };

/** Codifica con la mayor calidad (de 4 en 4) que no pasa de `kb`. Devuelve [bytes, calidad]. */
async function codificar(img, fmt, kb, destino) {
  let q = CALIDAD[fmt], buf;
  for (;;) {
    buf = fmt === 'avif'
      ? await img.clone().avif({ quality: q, effort: 6, chromaSubsampling: '4:2:0' }).toBuffer()
      : await img.clone().webp({ quality: q, effort: 6 }).toBuffer();
    if (buf.length <= kb * 1024 || q <= MINIMA[fmt]) break;
    q -= 4;
  }
  writeFileSync(destino, buf);
  return [buf.length, q];
}
const BASE = process.argv[2] || 'http://localhost:4417/';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const salida = new URL('../public/images/persiana/', import.meta.url);
mkdirSync(salida, { recursive: true });
const ruta = (nombre) => new URL(nombre, salida).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const navegador = await chromium.launch({
  executablePath: process.env.CHROME || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
for (const [encuadre, f] of Object.entries(FORMATOS)) {
  const W = Math.round(Math.max(...f.anchos) * 1.25), H = Math.round(W / f.aspecto);
  for (const estado of ['inicio', 'final']) {
    const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    pagina.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${encuadre}/${estado}] ${m.text()}`); });
    await pagina.goto(`${BASE}?poster=${estado}&encuadre=${encuadre}`, { waitUntil: 'load' });
    await pagina.waitForFunction(() => document.documentElement.dataset.posterListo === '1', null, { timeout: 300_000 });
    const png = await pagina.screenshot({ type: 'png' });
    for (const w of f.anchos) {
      const h = Math.round(w / f.aspecto);
      const img = sharp(png).resize(w, h, { kernel: 'lanczos3' });
      const nombre = `${estado}-${encuadre}-${POSTER_V}-${w}`;
      const [ba, qa] = await codificar(img, 'avif', f.tope[w], ruta(`${nombre}.avif`));
      const [bw, qw] = await codificar(img, 'webp', f.tope[w] * 1.7, ruta(`${nombre}.webp`));
      console.log(`  ${nombre}: avif ${Math.round(ba / 1024)} KB (q${qa}) · webp ${Math.round(bw / 1024)} KB (q${qw})`);
    }
    await pagina.close();
    console.log(`póster «${encuadre}/${estado}» listo`);
  }
}
await navegador.close();
