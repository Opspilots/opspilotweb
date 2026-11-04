// Versión de un fichero de /public para la URL (?v=...). nginx sirve .css y .js con
// «Cache-Control: public, immutable» 30 días y estos ficheros no llevan hash en el nombre,
// así que la versión va en la URL: cambia sola cuando cambia el contenido (ver DEPLOY.md).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const version = (ruta: string) =>
  createHash('sha256').update(readFileSync(new URL(`../../public${ruta}`, import.meta.url))).digest('hex').slice(0, 10);
