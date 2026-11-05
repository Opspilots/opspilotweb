// Objetos de la cabecera de las subpáginas: el mismo mundo que «La mesa» de la home (src/lib/mesa.ts), pero cada
// página lleva UN objeto sobre la madera, estático (public/css/cabecera-pagina.css le da un único gesto al cargar).
// Todo se dibuja en la construcción. Reutiliza los helpers y los objetos de mesa.ts (que solo exporta, no cambia
// nada); lo que no existía allí (pantalla de la tiendita, portátil de pedidos, móvil «Sale solo», presupuesto de
// papel, libreta de guías…) se dibuja aquí con el mismo vocabulario: formas planas, sombra desplazada, tapete verde.
//
// Dos composiciones por página, como la home:
//   · «ancho» (≥ 1000 px): a la derecha del texto. viewBox 300 × 190.
//   · «bajo»  (< 1000 px): debajo del texto, más pequeña y distinta. viewBox 300 × 116.
// Los objetos asoman por el canto de la mesa (el borde inferior de la cabecera los recorta): así son compactos y
// los altos (móvil, calculadora, papel) caben. Cada texto mide ≥ 12,5 unidades y las composiciones se muestran a
// escala ≈ 1 (≥ 0,96), así que ninguna letra baja de 12 px. Sin nombres de personas, clientes ni cifras de resultados.
import { mesa, NAVY, PAPEL, TINTA, ROJO, rc, ci, pa, ln, tx, G, srect, tapete, calc, carpeta, ticket, movil, tiendita, mapa, taza, lapiz, boli } from './mesa';

/* ───────── qué objeto lleva cada ruta (tabla explícita) ───────── */
export type ClaveObjeto =
  | 'tapete' | 'pantalla-web' | 'portatil' | 'movil-sale-solo' | 'carpeta' | 'presupuesto'
  | 'libreta' | 'calculadora' | 'movil-contacto' | 'comanda'
  | 'ninguno'   // solo la tira de madera, sin dibujo
  | 'aro';      // el aro grande sobre horizonte de siempre (404)

export const OBJETO_POR_RUTA: Record<string, ClaveObjeto> = {
  '/soluciones/': 'tapete',
  '/soluciones/webs-y-tiendas/': 'pantalla-web',
  '/diseno-web-cordoba/': 'pantalla-web',
  '/soluciones/software-a-medida/': 'portatil',
  '/desarrollo-software-cordoba/': 'portatil',
  '/soluciones/automatizacion/': 'movil-sale-solo',
  '/casos/': 'carpeta',
  '/productos/': 'presupuesto',
  '/productos/presupuesya/': 'presupuesto',
  '/productos/erp-hosteleria/': 'comanda',
  '/recursos/': 'libreta',
  '/herramientas/': 'calculadora',
  // herramientas de números: calculadora. Las de Google, reseñas y WhatsApp no tienen nada que ver con una calculadora: solo la tira
  '/herramientas/calcular-iva-irpf-factura/': 'calculadora',
  '/herramientas/calcular-margen-y-precio/': 'calculadora',
  '/herramientas/plantilla-presupuesto-obra/': 'calculadora',
  '/herramientas/verifactu-me-afecta/': 'calculadora',
  '/herramientas/enlace-whatsapp/': 'ninguno',
  '/herramientas/negocio-no-sale-en-google-maps/': 'ninguno',
  '/herramientas/pedir-resenas-google/': 'ninguno',
  '/herramientas/poner-negocio-en-google-maps/': 'ninguno',
  '/herramientas/responder-resenas/': 'ninguno',
  '/contacto/': 'movil-contacto',
  '/aviso-legal/': 'ninguno',
  '/privacidad/': 'ninguno',
  '/cookies/': 'ninguno',
  '/404/': 'aro',
};
/** Todas las guías (/recursos/<slug>/) llevan la libreta. */
const PREFIJOS: [string, ClaveObjeto][] = [['/recursos/', 'libreta']];

/** Objeto de una ruta. Una ruta que no esté en la tabla rompe la construcción: nada de objetos por defecto sin querer. */
export function objetoDeRuta(ruta: string): ClaveObjeto {
  const r = ruta.endsWith('/') ? ruta : ruta + '/';
  if (OBJETO_POR_RUTA[r]) return OBJETO_POR_RUTA[r];
  const p = PREFIJOS.find(([pre]) => r.startsWith(pre));
  if (p) return p[1];
  throw new Error(`CabeceraPagina: la ruta ${r} no tiene objeto. Añádela a OBJETO_POR_RUTA (src/lib/objetos-pagina.ts).`);
}

/* ───────── veta de la tira (la misma de la home) ───────── */
let vetaCache = '';
export const veta = () => (vetaCache ||= mesa().veta);

/* ───────── objetos (centrados en su origen) ───────── */
const VERDE = '#51CB8A', VERDE_O = '#1F7A4A', AZUL = '#2F4E8C', GRIS = '#B8BDC4', GRIS_O = '#8F96A0';
const centro = 'text-anchor="middle"';
const tick = (x: number, y: number, r = 10) => ci(x, y, r, VERDE) + ln(`M${x - r * 0.45} ${y}l${r * 0.4} ${r * 0.42} ${r * 0.62}-${r * 0.72}`, NAVY, 2.4);
/** marca del aro (logo) pequeña, dentro de una pantalla */
const marca = (x: number, y: number, s: number) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 100 100"><use href="#aro"/></svg>`;

/* monitor con la tiendita y «Tu web» */
const pantallaWeb = () =>
  G(
    srect(-115, -88, 230, 150, 10, 7, 9) + pa('M-20 62h40l9 24h-58z', '#9EA7B1') + rc(-48, 84, 96, 8, '#7C8590', 4) +
      rc(-115, -88, 230, 150, NAVY, 10) + rc(-109, -82, 218, 138, '#fff', 5) +
      rc(-109, -82, 218, 24, '#DDE2E7', 5) + ci(-98, -70, 3.6, ROJO) + ci(-87, -70, 3.6, '#E7A93F') + ci(-76, -70, 3.6, VERDE) + tx(-58, -65.5, 13.5, 'Tu web', TINTA, 700) +
      rc(-109, -58, 92, 114, AZUL) + tiendita(-99, -48, 72) +
      tx(-8, -34, 17, 'Lo que', NAVY, 800) + tx(-8, -14, 17, 'ofreces', NAVY, 800) + rc(-8, -2, 100, 6, GRIS, 2) + rc(-8, 12, 76, 6, GRIS, 2) +
      rc(-8, 28, 100, 26, VERDE_O, 5) + tx(42, 46, 13.5, 'Presupuesto', '#fff', 700, centro),
  );

/* portátil con «Pedidos de hoy» */
const portatil = () => {
  const filas = [['Presupuesto', 'Enviado', VERDE_O], ['Factura', 'Cobrada', VERDE_O], ['Encargo', 'Por preparar', '#9A5F0E']];
  return G(
    srect(-125, -92, 250, 150, 10, 7, 9) + pa('M-142 60h284l-14 18h-256z', '#9EA7B1') + rc(-142, 60, 284, 4, '#7C8590') + rc(-28, 60, 56, 6, '#7C8590', 3) +
      rc(-125, -92, 250, 150, NAVY, 10) + rc(-119, -86, 238, 138, '#F4F4EF', 5) +
      rc(-119, -86, 238, 28, NAVY, 5) + marca(-113, -83, 22) + tx(-86, -66, 15, 'Pedidos de hoy', '#fff', 700) +
      filas.map((f, i) => rc(-111, -48 + i * 34, 222, 28, '#fff', 4) + tx(-102, -29 + i * 34, 13.5, f[0], TINTA, 500) + tx(102, -29 + i * 34, 13.5, f[1], f[2], 700, 'text-anchor="end"')).join(''),
  );
};

/* móvil con «Sale solo» y marcas */
const movilSaleSolo = () =>
  movil(
    160, 222,
    tx(0, -74, 19, 'Sale solo', '#fff', 800, centro) +
      ['Cita avisada', 'Pago recordado', 'Copia hecha'].map((t, i) => rc(-68, -56 + i * 48, 136, 40, '#2B3644', 8) + tick(-50, -36 + i * 48, 11) + tx(-34, -31 + i * 48, 13.5, t, '#E6EBF2', 600)).join(''),
  );

/* móvil de contacto: una conversación que se contesta */
const movilContacto = () =>
  movil(
    160, 222,
    rc(-70, -86, 140, 28, '#2B3644', 8) + ci(-54, -72, 8, VERDE) + tx(-38, -67, 13.5, 'Tu mensaje', '#E6EBF2', 600) +
      rc(-70, -50, 100, 30, '#E6EBF2', 12) + rc(-60, -41, 74, 6, GRIS_O, 2) + rc(-60, -30, 50, 6, GRIS_O, 2) +
      rc(-64, -12, 134, 36, VERDE, 12) + tx(3, 11.5, 14.5, 'Te contestamos', NAVY, 800, centro) +
      rc(-70, 44, 140, 30, '#16202B', 15) + ci(-44, 59, 3.6, GRIS_O) + ci(-33, 59, 3.6, GRIS_O) + ci(-22, 59, 3.6, GRIS_O),
  );

/* versiones para móvil: el marco recorta por abajo (el canto de la mesa), así que se dibujan con lo legible arriba.
   Origen en el centro de un móvil de 160 × 250: la parte alta del móvil es a = 0 y «a» crece hacia abajo. */
const T = -125;
const movilSaleSoloBajo = () =>
  movil(
    160, 250,
    tx(0, T + 40, 18, 'Sale solo', '#fff', 800, centro) +
      ['Cita avisada', 'Pago recordado'].map((t, i) => rc(-68, T + 48 + i * 32, 136, 26, '#2B3644', 8) + tick(-52, T + 61 + i * 32, 9) + tx(-37, T + 66 + i * 32, 13.5, t, '#E6EBF2', 600)).join('') +
      rc(-68, T + 114, 136, 26, '#2B3644', 8),
  );
const movilContactoBajo = () =>
  movil(
    160, 250,
    rc(-70, T + 30, 100, 26, '#E6EBF2', 12) + rc(-60, T + 37, 74, 5, GRIS_O, 2) + rc(-60, T + 46, 50, 5, GRIS_O, 2) +
      rc(-64, T + 64, 134, 34, VERDE, 12) + tx(3, T + 85, 14.5, 'Te contestamos', NAVY, 800, centro) +
      rc(-70, T + 106, 140, 30, '#16202B', 15) + ci(-44, T + 121, 3.6, GRIS_O) + ci(-33, T + 121, 3.6, GRIS_O) + ci(-22, T + 121, 3.6, GRIS_O),
  );
/* carpeta «Clientes y papeles» para móvil: papeles que asoman sin texto, para que ninguna letra quede en el borde */
const carpetaBaja = () =>
  G(
    G(rc(-132, -92, 110, 54, '#CFE2F5', 3) + rc(-120, -78, 70, 6, '#7B93AE', 2), 'transform="rotate(-9 -77 -65)"') +
      G(rc(-52, -98, 120, 58, PAPEL, 3) + rc(-38, -82, 80, 6, GRIS, 2) + rc(-38, -68, 56, 6, GRIS, 2), 'transform="rotate(5 8 -70)"') +
      G(rc(50, -86, 86, 52, '#F8DF76', 3) + rc(62, -72, 56, 6, '#BFA044', 2), 'transform="rotate(14 93 -60)"') +
      srect(-150, -52, 300, 162, 6) + pa('M-150 -52H-60L-44 -72H56L72 -52H150V110H-150Z', '#7E2C1B') + rc(-150, -46, 300, 156, '#B8452E', 6) + rc(-150, -46, 300, 5, '#D0634A') +
      rc(-84, -18, 168, 62, PAPEL, 3) + tx(0, 10, 22, 'Clientes', TINTA, 800, centro) + tx(0, 34, 20, 'y papeles', TINTA, 500, centro) +
      rc(-150, 70, 300, 9, '#1C2733'),
  );

/* presupuesto de papel: sin marca ni datos, solo la forma */
const presupuestoPapel = () =>
  G(
    srect(-95, -125, 190, 250, 3, 7, 9) + pa('M-95 -125H62L95 -92V125H-95Z', PAPEL) + pa('M62 -125L95 -92H62Z', '#D6D2C4') +
      tx(-76, -90, 22, 'Presupuesto', TINTA, 800) + rc(-76, -78, 152, 2.5, TINTA) +
      [0, 1, 2, 3].map((i) => rc(-76, -60 + i * 26, 70 + ((i * 29) % 46), 7, GRIS, 2) + rc(34, -60 + i * 26, 42, 7, GRIS_O, 2)).join('') +
      rc(-76, 50, 152, 2.5, TINTA) + tx(-76, 78, 17, 'Total', TINTA, 800) + rc(20, 64, 56, 14, GRIS_O, 3) +
      G(rc(-52, -17, 104, 34, PAPEL, 4, `stroke="${VERDE_O}" stroke-width="3.5"`) + tx(0, 7, 20, 'Enviado', VERDE_O, 800, centro), 'transform="translate(30 62) rotate(-11)"'),
  );

/* libreta de guías: amarilla, con anillas y una lista que se va marcando */
const libretaGuia = () =>
  G(
    srect(-100, -125, 200, 250, 6, 7, 9) + rc(-100, -125, 200, 250, '#F8DF76', 6) +
      [0, 1, 2, 3, 4, 5].map((i) => rc(-100, -50 + i * 32, 200, 1.6, '#D5B345')).join('') + rc(-72, -97, 1.8, 222, '#D66B52') +
      rc(-100, -125, 200, 34, '#B8452E', 6) + rc(-100, -103, 200, 12, '#B8452E') +
      [...Array(8)].map((_, i) => ci(-84 + i * 24, -110, 4, '#7E2C1B')).join('') +
      tx(-56, -66, 20, 'Guía rápida', TINTA, 800) +
      [0, 1, 2].map((i) => rc(-62, -38 + i * 32, 15, 15, 'none', 3, `stroke="${TINTA}" stroke-width="2"`) + (i < 2 ? ln(`M${-59} ${-30 + i * 32}l4 5 9-11`, ROJO, 3) : '') + rc(-36, -34 + i * 32, 90 - i * 18, 7, '#BFA044', 2)).join('') +
      pa('M100 125l-46 0 46-40z', '#E2C259'),
  );

/* calculadora de la home sobre un ticket de factura (el ticket es el de la home) */
const factura = () => ticket(104, 190, 'Factura', '');

/* pieza de la tiendita para el tapete: monitor pequeño */
const pantallaMini = () =>
  G(
    srect(-66, -48, 132, 96, 6, 5, 7) + rc(-66, -48, 132, 96, NAVY, 6) + rc(-61, -43, 122, 86, '#fff', 3) + rc(-61, -43, 122, 18, '#DDE2E7', 3) +
      ci(-52, -34, 3, ROJO) + ci(-43, -34, 3, '#E7A93F') + ci(-34, -34, 3, VERDE) + tx(-20, -30, 13, 'Tu web', TINTA, 700) +
      rc(-61, -25, 50, 68, AZUL) + tiendita(-55, -18, 38) + rc(-4, -20, 56, 6, GRIS, 2) + rc(-4, -8, 44, 6, GRIS, 2) + rc(-4, 8, 56, 20, VERDE_O, 4),
  );
const fichaMini = () =>
  G(
    srect(-54, -44, 108, 88, 5, 5, 7) + rc(-54, -44, 108, 88, '#fff', 5) + mapa(-54, -44, 108, 48) +
      tx(-46, 20, 14, 'Tu ficha', NAVY, 800) + tx(-46, 36, 13, 'Abierto ahora', VERDE_O, 700),
  );
const panelMini = () =>
  G(
    srect(-50, -34, 100, 68, 5, 5, 7) + rc(-50, -34, 100, 68, NAVY, 5) + tx(-40, -12, 15, 'Sale solo', '#fff', 800) +
      tick(-35, 5, 7) + rc(-22, 2, 56, 6, '#4A586A', 2) + tick(-35, 23, 7) + rc(-22, 20, 40, 6, '#4A586A', 2),
  );

/* ───────── composiciones ───────── */
const t = (x: number, y: number, giro = 0, esc = 1) => `translate(${x} ${y}) rotate(${giro}) scale(${esc})`;
const u = (id: string, x: number, y: number, giro = 0, esc = 1) => `<use href="#op-${id}" transform="${t(x, y, giro, esc)}"/>`;

export interface Escena {
  /** <defs> con cada pieza dibujada una vez (va en un SVG de 0 × 0 aparte: un <use> no encuentra su origen dentro de un SVG con display:none) */
  defs: string;
  /** contenido del SVG ancho (viewBox 0 0 300 190) */
  ancho: string;
  /** contenido del SVG bajo (viewBox 0 0 300 116) */
  bajo: string;
}

const piezas = (o: Record<string, string>) => Object.entries(o).map(([id, c]) => `<g id="op-${id}">${c}</g>`).join('');

export function escena(clave: ClaveObjeto): Escena | null {
  switch (clave) {
    case 'ninguno':
    case 'aro':
      return null;

    case 'tapete':
      return {
        defs: piezas({ tapete: tapete(300, 170), tapetem: tapete(290, 150), pan: pantallaMini(), ficha: fichaMini(), panel: panelMini() }),
        ancho: u('tapete', 150, 118) + u('pan', 88, 106, -3) + u('ficha', 224, 76, 4) + u('panel', 232, 168, -2),
        bajo: u('tapetem', 150, 80) + u('pan', 82, 82, -3) + u('ficha', 206, 66, 4),
      };

    case 'pantalla-web':
      return {
        defs: piezas({ obj: pantallaWeb(), lap: lapiz() }),
        ancho: u('obj', 150, 98, -2) + u('lap', 252, 168, -30, 0.5),
        bajo: u('obj', 188, 98, 3, 0.95) + u('lap', 30, 66, -62, 0.5),
      };

    case 'portatil':
      return {
        defs: piezas({ obj: portatil(), lap: lapiz() }),
        ancho: u('obj', 150, 92, 0) + u('lap', 52, 176, -20, 0.5),
        bajo: u('obj', 176, 96, 0, 0.95) + u('lap', 30, 66, -62, 0.5),
      };

    case 'movil-sale-solo':
      return {
        defs: piezas({ obj: movilSaleSolo(), objb: movilSaleSoloBajo(), bol: boli(), lap: lapiz() }),
        ancho: u('obj', 160, 114, 4, 0.94) + u('bol', 262, 150, -64, 0.6),
        bajo: u('objb', 186, 131, 0) + u('lap', 52, 98, -8, 0.42),
      };

    case 'movil-contacto':
      return {
        defs: piezas({ obj: movilContacto(), objb: movilContactoBajo(), bol: boli() }),
        ancho: u('obj', 170, 118, -4) + u('bol', 268, 150, -64, 0.6),
        bajo: u('objb', 186, 131, 0) + u('bol', 52, 98, -8, 0.42),
      };

    case 'carpeta':
      return {
        defs: piezas({ obj: carpeta(), objb: carpetaBaja() }),
        ancho: u('obj', 150, 138, -3, 0.64),
        bajo: u('objb', 150, 80, 0, 0.72),
      };

    case 'presupuesto':
      return {
        defs: piezas({ obj: presupuestoPapel(), bol: boli(), cerco: `<circle r="30" fill="none" stroke="#7A4A22" stroke-width="5" stroke-opacity=".38"/>` }),
        ancho: u('obj', 140, 108, -3, 0.86) + u('bol', 252, 168, -72, 0.6) + u('cerco', 262, 56),
        bajo: u('obj', 170, 102, 3, 0.8) + u('bol', 46, 100, -20, 0.4),
      };

    case 'libreta':
      return {
        defs: piezas({ obj: libretaGuia(), lap: lapiz() }),
        ancho: u('obj', 142, 124, -4, 0.9) + u('lap', 260, 168, -62, 0.6),
        bajo: u('obj', 168, 100, 3, 0.78) + u('lap', 48, 100, -24, 0.4),
      };

    case 'calculadora':
      return {
        defs: piezas({ obj: calc(), fac: factura(), lap: lapiz() }),
        ancho: u('fac', 92, 98, -8, 0.7) + u('obj', 176, 100, 5, 0.7) + u('lap', 268, 128, -62, 0.6),
        bajo: u('fac', 88, 80, -9, 0.7) + u('obj', 186, 91, 4, 0.74),
      };

    case 'comanda':
      return {
        defs: piezas({ obj: ticket(124, 230, 'Comanda', ''), taza: taza(), bol: boli() }),
        ancho: u('obj', 120, 104, 4, 0.85) + u('taza', 238, 124, 0, 0.58) + u('bol', 226, 178, -4, 0.5),
        bajo: u('obj', 180, 96, -3, 0.8) + u('bol', 56, 98, -8, 0.42),
      };
  }
}
