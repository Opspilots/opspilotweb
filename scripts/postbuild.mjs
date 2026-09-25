// Tras astro build. nginx (VPS de opspilot.es) tiene «error_page 404 /404/index.html», heredado de la
// web anterior; Astro genera dist/404.html. Se deja también en /404/index.html para que sirva la misma.
import { copyFileSync, mkdirSync } from 'node:fs';
const dist = new URL('../dist/', import.meta.url);
mkdirSync(new URL('404/', dist), { recursive: true });
copyFileSync(new URL('404.html', dist), new URL('404/index.html', dist));
console.log('postbuild: dist/404/index.html listo');
