// Genera public/images/og-horizonte.png (1200×630), la imagen para compartir.
// Composición del manual de marca: fondo verde partido por el horizonte (−17,41°, sube a la derecha),
// el aro centrado sobre la línea (la línea pasa por su hueco, al 47,33 % de su alto) y el titular
// en navy, Bricolage Grotesque 800, en la parte verde. Sin antetítulo.
//
// Uso:  npm i --no-save playwright   (una vez)   ·   node scripts/og-imagen.mjs
// Si Chromium no está instalado:  CHROME_PATH=/ruta/a/chrome node scripts/og-imagen.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const fuente = readFileSync(join(raiz, 'public/fonts/bricolage-var-latin.woff2')).toString('base64');

// Paleta del manual
const NAVY = '#0F1620';
const VERDE = '#51CB8A';

// Geometría. Lienzo 1200×630. El aro (viewBox 100) se dibuja a 4,708 px por unidad:
// 96 unidades de ancho = 452 px.
const W = 1200, H = 630;
const ESCALA = 4.708;
const AR_X = 894;                         // centro horizontal del aro
const AR_Y_TOP = 129;                     // arriba del aro (viewBox y=2)
const AR_ALTO = 96 * ESCALA;              // alto del aro
const Y_HORIZONTE = AR_Y_TOP + AR_ALTO * 0.4733; // la línea pasa por el hueco
const TAN = Math.tan((17.41 * Math.PI) / 180);
const yEn = (x) => Y_HORIZONTE + (AR_X - x) * TAN; // y de la línea en cada x
const svgX = AR_X - 50 * ESCALA;
const svgY = AR_Y_TOP - 2 * ESCALA;

// Paths reales del símbolo #aro (src/layouts/Base.astro y public/favicon.svg)
const ARCO_ALTO = 'M2.69 58.09A48.0 48.0 0 0 1 93.54 29.79L76.92 35.01A30.81 30.81 0 0 0 19.35 53.17Z';
const ARCO_BAJO = 'M96.14 36.77A48.0 48.0 0 0 1 4.59 65.55L20.97 60.34A30.81 30.81 0 0 0 79.74 41.92Z';

const html = `<!doctype html><html lang="es"><meta charset="utf-8"><style>
@font-face{font-family:Bricolage;src:url(data:font/woff2;base64,${fuente}) format('woff2');font-weight:200 800}
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:${VERDE};position:relative;overflow:hidden;font-family:Bricolage,sans-serif;color:${NAVY}}
svg.fondo{position:absolute;inset:0}
svg.aro{position:absolute;left:${svgX}px;top:${svgY}px;width:${100 * ESCALA}px;height:${100 * ESCALA}px}
h1{position:absolute;left:72px;top:150px;width:600px;font-weight:800;font-size:82px;line-height:.98;letter-spacing:-.035em;font-variation-settings:'opsz' 96}
p{position:absolute;left:72px;top:${Math.round(yEn(72 + 560)) - 84}px;font-weight:600;font-size:30px;letter-spacing:-.01em;font-variation-settings:'opsz' 30}
</style><body>
<svg class="fondo" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="0,${yEn(0).toFixed(2)} ${W},${yEn(W).toFixed(2)} ${W},${H} 0,${H}" fill="${NAVY}"/></svg>
<svg class="aro" viewBox="0 0 100 100"><path fill="#fff" d="${ARCO_ALTO}"/><path fill="${VERDE}" d="${ARCO_BAJO}"/></svg>
<h1>Todo tu negocio,<br>en un solo sitio.</h1>
<p>OpsPilot · opspilot.es</p>
</body></html>`;

const rutaHtml = join(raiz, 'scripts', '.og-imagen.html');
writeFileSync(rutaHtml, html);

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Falta playwright. Instálalo sin guardarlo:  npm i --no-save playwright');
  process.exit(1);
}
const navegador = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await pagina.goto('file:///' + rutaHtml.replace(/\\/g, '/'));
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: join(raiz, 'public/images/og-horizonte.png'), type: 'png' });
await navegador.close();
import('node:fs').then(({ unlinkSync }) => unlinkSync(rutaHtml));
console.log('OK public/images/og-horizonte.png');
