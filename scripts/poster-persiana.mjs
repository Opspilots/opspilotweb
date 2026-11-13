// Genera los pósteres de «La persiana» (la cabecera de la home) renderizando la propia escena y capturando el canvas.
// Uso:
//   npm run build && npx astro preview --port 4417     (en otra terminal)
//   node scripts/poster-persiana.mjs [http://localhost:4417/]
// Variables: PLAYWRIGHT = ruta a un paquete playwright (no es dependencia del repo), CHROME = ejecutable de Chromium.
// Escribe public/images/persiana/{inicio,final}-<versión>-<ancho>.{avif,webp}. Las imágenes se sirven inmutables:
// si cambia la escena, sube POSTER_V aquí Y en src/components/CabeceraPersiana.astro (nombre nuevo, no sobrescribir).
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const POSTER_V = 'v1';
const ANCHOS = [540, 810, 1080];
const ASPECTO = 0.9; // el mismo que ASPECTO en src/scripts/persiana/escena.ts
const BASE = process.argv[2] || 'http://localhost:4417/';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const salida = new URL('../public/images/persiana/', import.meta.url);
mkdirSync(salida, { recursive: true });

const navegador = await chromium.launch({
  executablePath: process.env.CHROME || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const W = 1440, H = Math.round(W / ASPECTO);
for (const estado of ['inicio', 'final']) {
  const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  pagina.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${estado}] ${m.text()}`); });
  await pagina.goto(`${BASE}?poster=${estado}`, { waitUntil: 'load' });
  await pagina.waitForFunction(() => document.documentElement.dataset.posterListo === '1', null, { timeout: 180_000 });
  const png = await pagina.screenshot({ type: 'png' });
  for (const w of ANCHOS) {
    const h = Math.round(w / ASPECTO);
    const img = sharp(png).resize(w, h, { kernel: 'lanczos3' });
    await img.clone().avif({ quality: 48, effort: 6, chromaSubsampling: '4:2:0' }).toFile(new URL(`${estado}-${POSTER_V}-${w}.avif`, salida).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
    await img.clone().webp({ quality: 74, effort: 6 }).toFile(new URL(`${estado}-${POSTER_V}-${w}.webp`, salida).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  }
  await pagina.close();
  console.log(`póster «${estado}» listo`);
}
await navegador.close();
