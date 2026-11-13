// Versión de un fichero de /public para la URL (?v=...). nginx sirve .css y .js con
// «Cache-Control: public, immutable» 30 días y estos ficheros no llevan hash en el nombre,
// así que la versión va en la URL: cambia sola cuando cambia el contenido (ver DEPLOY.md).
// La ruta se resuelve desde la raíz del proyecto (process.cwd()): desde Astro 6/7 el código de las
// páginas se empaqueta en dist/.prerender/, así que import.meta.url ya no apunta a src/lib/.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const version = (ruta: string) =>
  createHash('sha256').update(readFileSync(join(process.cwd(), 'public', ruta))).digest('hex').slice(0, 10);
