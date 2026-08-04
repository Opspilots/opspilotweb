// Recoloca <meta charset> al principio del <head> en todo el dist.
//
// Por que: vite-react-ssg inyecta los tags de react-helmet (title, metas OG,
// canonical...) ANTES del contenido de la plantilla index.html, asi que el
// <meta charset="UTF-8"> acaba en el byte ~1400 del documento. La spec HTML
// exige que la declaracion de charset aparezca en los primeros 1024 bytes;
// Lighthouse lo audita (charset) y los navegadores pueden re-parsear el
// documento si adivinan mal la codificacion.
//
// Se ejecuta tras el build (ver package.json), igual que generate-sitemap.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const CHARSET_RE = /\s*<meta charset="[^"]+"\s*\/?>/i;

function htmlFiles(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = join(dir, e.name);
        if (e.isDirectory()) return htmlFiles(p);
        return e.name.endsWith('.html') ? [p] : [];
    });
}

let fixed = 0;
for (const file of htmlFiles(DIST)) {
    const html = readFileSync(file, 'utf8');
    const m = html.match(CHARSET_RE);
    if (!m) continue;
    const tag = m[0].trim();
    const without = html.replace(CHARSET_RE, '');
    const patched = without.replace(/<head>/i, `<head>${tag}`);
    if (patched === without) continue; // no <head>: no tocar
    writeFileSync(file, patched);
    fixed++;
}
console.log(`fix-charset: ${fixed} HTML con charset recolocado al inicio de <head>`);
