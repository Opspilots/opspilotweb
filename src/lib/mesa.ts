// Dibujo de la cabecera de la home, «La mesa»: una mesa de trabajo vista desde arriba. Todo se genera en la
// construcción; en el navegador solo hay un SVG que se recoge (public/js/lamesa.js).
//
// Cada objeto se dibuja UNA vez (en <defs>) y las dos composiciones lo reutilizan con <use>:
//   · «ancho» (≥ 1000 px): portátil, carpeta, móvil y café sobre el tapete. viewBox 1440 × 654.
//   · «alto»  (< 1000 px): un móvil grande con la pantalla final, y a los lados (solo en tablet) carpeta, llaves y café. viewBox 360 × 544 (desde y = 16).
// El CSS enseña una y oculta la otra (display:none): la oculta ni se pinta ni se anima.
//
// Cada <use> lleva sus dos posiciones: `transform` = mesa recogida (lo que ve quien no tiene JS o pide menos
// movimiento), `data-a` y `--ta` = mesa revuelta (el CSS la aplica antes de que cargue el script, así que no
// hay salto de «orden» a «lío»). Posición: [x, y, giro en grados, escala].
//
// Regla de letra: lo que se lee a tamaño real va a ≥ 12 px. Cada texto mide, en unidades del dibujo, ≥ 12 / k,
// con k la escala del SVG (≥ 0,69 en «ancho», ≥ 0,88 en «alto»). Lo que no llega se dibuja sin texto.
// Sin nombres de personas, clientes ni cifras de resultados.

type Pos = [number, number, number, number];

export const NAVY = '#0F1620', PAPEL = '#F6F7F5', TINTA = '#27303B', ROJO = '#C2402B', SOMBRA = '#0A0E14';

export const N = (v: number) => Math.round(v * 10) / 10;
export const rng = (s: number) => () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
export const rc = (x: number, y: number, w: number, h: number, f: string, r = 0, e = '') =>
  `<rect x="${N(x)}" y="${N(y)}" width="${N(w)}" height="${N(h)}"${r ? ` rx="${r}"` : ''} fill="${f}"${e ? ' ' + e : ''}/>`;
export const ci = (x: number, y: number, r: number, f: string, e = '') =>
  `<circle cx="${N(x)}" cy="${N(y)}" r="${N(r)}" fill="${f}"${e ? ' ' + e : ''}/>`;
export const pa = (d: string, f: string, e = '') => `<path d="${d}" fill="${f}"${e ? ' ' + e : ''}/>`;
export const ln = (d: string, c: string, w = 2, e = '') =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${e ? ' ' + e : ''}/>`;
export const tx = (x: number, y: number, s: number, t: string, f = NAVY, w = 600, e = '') =>
  `<text x="${N(x)}" y="${N(y)}" font-size="${s}" font-weight="${w}" fill="${f}"${e ? ' ' + e : ''}>${t}</text>`;
export const G = (c: string, e = '') => `<g${e ? ' ' + e : ''}>${c}</g>`;
/* sombra plana: la misma forma, desplazada */
export const srect = (x: number, y: number, w: number, h: number, r = 0, dx = 7, dy = 9, o = 0.28) =>
  rc(x + dx, y + dy, w, h, SOMBRA, r, `opacity="${o}"`);
/* línea con pulso de mano */
export const mano = (x1: number, y1: number, x2: number, R: () => number, am = 2) => {
  let d = `M${N(x1)} ${N(y1)}`, x = x1;
  const paso = (x2 - x1) / 6;
  for (let i = 0; i < 6; i++) { x += paso; d += `Q${N(x - paso / 2)} ${N(y1 + (R() - 0.5) * am * 2)} ${N(x)} ${N(y1 + (R() - 0.5) * am)}`; }
  return d;
};

/* ───────── objetos (centrados en su origen) ───────── */
export const tapete = (w: number, h: number) => {
  let fina = '', gruesa = '';
  for (let x = 40; x < w; x += 40) (x % 200 === 0 ? (gruesa += `M${x} 0V${h}`) : (fina += `M${x} 0V${h}`));
  for (let y = 40; y < h; y += 40) (y % 200 === 0 ? (gruesa += `M0 ${y}H${w}`) : (fina += `M0 ${y}H${w}`));
  const trazo = (d: string, a: number) => `<path d="${d}" fill="none" stroke="#2E9E68" stroke-width="${a}"/>`;
  return G(
    srect(-w / 2, -h / 2, w, h, 16, 10, 12) +
      `<svg x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${rc(0, 0, w, h, '#51CB8A', 16)}${trazo(fina, 1.2)}${trazo(gruesa, 2.4)}${ln(`M${w - 22} ${h - 120}A98 98 0 0 0 ${w - 120} ${h - 22}`, '#2E9E68', 2)}${ln(`M${w - 22} ${h - 70}A48 48 0 0 0 ${w - 70} ${h - 22}`, '#2E9E68', 2)}</svg>` +
      rc(-w / 2, -h / 2, w, h, 'none', 16, 'stroke="#2C8A5C" stroke-width="3"'),
  );
};

const libreta = () => {
  const R = rng(11);
  return G(
    srect(-140, -170, 280, 340, 6) + rc(-140, -170, 280, 340, '#F8DF76', 6) +
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => rc(-140, -92 + i * 34, 280, 1.6, '#D5B345')).join('') +
      rc(-104, -138, 1.8, 308, '#D66B52') + rc(-140, -170, 280, 36, '#3D5F8A', 6) + rc(-140, -146, 280, 12, '#3D5F8A') +
      [...Array(11)].map((_, i) => ci(-122 + i * 24.4, -152, 4, '#2A4468')).join('') +
      tx(-94, -102, 21, 'Llamar al fontanero', TINTA, 600) + ln(mano(-96, -109, 108, R, 3), ROJO, 3) +
      tx(-94, -68, 21, 'Pedir material', TINTA, 600) +
      tx(-94, -34, 21, '¿Y la factura?', TINTA, 700) +
      tx(-94, 0, 21, 'Presupuesto cocina', TINTA, 600) + ln(mano(-96, -7, 100, R, 3), ROJO, 3) +
      tx(-94, 34, 21, 'Mirar lo del horario', TINTA, 600) +
      ln('M-92 62q18-26 30-2t26 2 28-4 30 6', '#27303B', 2.4) + ln('M-92 100q14-14 24 0t22 0 22 0', '#27303B', 2.4) +
      ln('M58 76c24-16 44 6 26 24s-46 4-30-16 56-14 50 16', '#2F4E8C', 2.6) + pa('M140 170l-46 0 46-40z', '#E2C259'),
  );
};

export const ticket = (w: number, h: number, t: string, sello: string) => {
  let z = `M${-w / 2} ${-h / 2}H${w / 2}V${h / 2}`;
  for (let x = w / 2; x > -w / 2 + 1; x -= 14) z += `L${N(x - 7)} ${h / 2 + 8}L${N(x - 14)} ${h / 2}`;
  z += 'Z';
  let l = '';
  const R = rng(w * 7 + h);
  for (let i = 0; i < (h - 90) / 22; i++) {
    const y = -h / 2 + 62 + i * 22;
    l += rc(-w / 2 + 14, y, (w - 68) * (0.55 + R() * 0.4), 6, '#B8BDC4', 2) + rc(w / 2 - 40, y, 26, 6, '#8F96A0', 2);
  }
  return G(
    pa(z, SOMBRA, 'opacity=".26" transform="translate(6 9)"') + pa(z, PAPEL) +
      tx(0, -h / 2 + 36, 18, t, TINTA, 700, 'text-anchor="middle"') + rc(-w / 2 + 14, -h / 2 + 46, w - 28, 2, TINTA) + l +
      (sello
        ? G(rc(-62, -18, 124, 36, PAPEL, 4, `stroke="${ROJO}" stroke-width="3"`) + tx(0, 7, 20, sello, ROJO, 800, 'text-anchor="middle"'), `transform="translate(0 ${h / 2 - 58}) rotate(-13)"`)
        : ''),
  );
};

const presupuesto = () =>
  G(
    srect(-120, -160, 240, 320, 3) + pa('M-120 -160H84L120 -124V160H-120Z', PAPEL) + pa('M84 -160L120 -124H84Z', '#D3D8DD') +
      tx(-98, -118, 21, 'Presupuesto', TINTA, 800) + tx(-98, -92, 18, 'de la cocina', TINTA, 500) + rc(-98, -78, 196, 2.5, TINTA) +
      [0, 1, 2, 3, 4].map((i) => rc(-98, -60 + i * 24, 90 + ((i * 37) % 50), 7, '#B8BDC4', 2) + rc(54, -60 + i * 24, 44, 7, '#8F96A0', 2)).join('') +
      rc(-98, 62, 196, 2.5, TINTA) + tx(-98, 96, 21, 'Sin enviar', ROJO, 800) + ln('M-98 104q50 8 104-2', ROJO, 2.6) +
      `<circle cx="66" cy="116" r="37" fill="none" stroke="#7C8590" stroke-width="5" opacity=".4"/>`,
  );

export const movil = (w: number, h: number, c: string) =>
  G(
    srect(-w / 2, -h / 2, w, h, 26, 8, 10) + rc(-w / 2, -h / 2, w, h, NAVY, 26) + rc(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, '#2B3644', 24) +
      rc(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, '#1C2733', 19) + rc(-16, -h / 2 + 15, 32, 7, NAVY, 4) + c,
  );

/* el móvil del lío: cuatro avisos sin atender y vibrando (la vibración solo corre durante el lío) */
const avisos = () =>
  rc(-73, -132, 146, 62, PAPEL, 10) + tx(-62, -108, 16.5, '¿Me das precio?', TINTA, 700) + tx(-62, -84, 16, 'Sin contestar', ROJO, 700) +
        rc(-73, -62, 146, 62, '#D6F7E4', 10) + tx(-62, -38, 16.5, '¿Abrís hoy?', TINTA, 700) + tx(-62, -14, 16, 'Sin contestar', ROJO, 700) +
        rc(-73, 8, 146, 62, '#FBE3DD', 10) + tx(-62, 32, 16.5, 'Llamada perdida', TINTA, 700) + tx(-62, 56, 16, 'Sin devolver', ROJO, 700) +
        rc(-73, 78, 146, 62, PAPEL, 10) + tx(-62, 102, 16.5, 'Foto de la obra', TINTA, 700) + tx(-62, 126, 16, 'Sin mirar', ROJO, 700);
const vibra = () => ln('M-98 -60q-12 22 0 44M-112 -74q-20 36 0 72', NAVY, 3.4) + ln('M98 16q12 22 0 44M112 2q20 36 0 72', NAVY, 3.4);

export const calc = () => {
  let k = '';
  const sim = ['', '', '', '×', '', '', '', '−', '', '', '', '+', '', '', '', '='];
  for (let f = 0; f < 4; f++)
    for (let c = 0; c < 4; c++) {
      const x = -72 + c * 38, y = -46 + f * 38, na = c === 3, i = f * 4 + c;
      k += rc(x, y + 4, 32, 30, '#16202B', 6) + rc(x, y, 32, 30, na ? '#E7A93F' : '#E6EBF2', 6) +
        (sim[i] ? tx(x + 16, y + 23, 22, sim[i], NAVY, 800, 'text-anchor="middle"') : ci(x + 16, y + 15, 3.2, '#9EA7B1'));
    }
  return G(
    srect(-88, -120, 176, 240, 14) + rc(-88, -120, 176, 240, '#2F4E8C', 14) + rc(-88, -120, 176, 8, '#4466AB', 4) + rc(-72, -100, 144, 40, '#C9D8B6', 5) +
      rc(-62, -84, 60, 5, '#5A6B4C') + rc(4, -84, 56, 5, '#5A6B4C') + k,
  );
};

export const taza = () =>
  G(
    ci(8, 10, 70, SOMBRA, 'opacity=".26"') + rc(52, -13, 52, 26, '#E6EBF2', 12) + rc(58, -7, 40, 14, '#C4CCD6', 7) + ci(0, 0, 68, '#F2F5F8') + ci(0, 0, 58, '#D8DFE7') +
      ci(0, 0, 50, '#251F1C') + ln('M-30 -24A40 40 0 0 1 8 -39', '#4A3F39', 5) + ci(16, 18, 5, '#3A302B'),
  );

/* la carpeta: los papeles sueltos (lm-fp) se encogen y se van al guardarla. Sus letras miden ≥ 18 u a escala .9 */
export const carpeta = () =>
  G(
    G(
      G(srect(-140, -170, 270, 190, 3) + rc(-140, -170, 270, 190, '#CFE2F5', 3) + rc(-122, -150, 150, 8, '#7B93AE', 2) + rc(-122, -130, 190, 8, '#7B93AE', 2), 'transform="rotate(-12)"') +
        G(srect(-110, -178, 260, 190, 3) + rc(-110, -178, 260, 190, PAPEL, 3) + tx(-88, -146, 19, 'Facturas', TINTA, 800) + rc(-88, -134, 180, 7, '#B8BDC4', 2) + rc(-88, -116, 120, 7, '#B8BDC4', 2), 'transform="rotate(9)"') +
        G(rc(-150, -140, 210, 130, '#FBD5CB', 3) + rc(-132, -124, 120, 7, '#C07F70', 2), 'transform="rotate(-27) translate(-40 30)"') +
        G(rc(60, -130, 150, 180, '#F8DF76', 3) + rc(76, -110, 100, 7, '#BFA044', 2) + rc(76, -92, 80, 7, '#BFA044', 2), 'transform="rotate(17)"'),
      'class="lm-fo lm-fp"',
    ) +
      srect(-170, -110, 340, 230, 6) + pa('M-170 -110H-60L-40 -132H70L90 -110H170V120H-170Z', '#2A4468') + rc(-170, -104, 340, 224, '#3D5F8A', 6) + rc(-170, -104, 340, 5, '#5A7EAB') +
      rc(-92, -50, 184, 70, PAPEL, 3) + tx(0, -20, 22, 'Clientes', TINTA, 800, 'text-anchor="middle"') + tx(0, 8, 20, 'y papeles', TINTA, 500, 'text-anchor="middle"') +
      rc(-170, 62, 340, 9, '#1C2733') + ln('M-150 108l14-4M-120 108l14-4M120 108l14-4M90 108l14-4', '#2A4468', 3),
  );

export const boli = () =>
  G(
    rc(-120, -5, 240, 14, SOMBRA, 6, 'opacity=".24" transform="translate(4 6)"') + rc(-120, -7, 214, 14, NAVY, 5) + rc(-120, -7, 214, 4, '#34465A', 3) +
      pa('M94 -7L122 0L94 7Z', '#E1E5EA') + pa('M114 -2L122 0L114 2Z', NAVY) + rc(-110, -12, 70, 5, '#9BA6B3', 2),
  );
export const lapiz = () =>
  G(
    rc(-110, -5, 220, 14, SOMBRA, 4, 'opacity=".24" transform="translate(4 6)"') + rc(-92, -8, 176, 16, '#F2B735') + rc(-92, -8, 176, 5, '#F8D26F') + rc(-92, 3, 176, 5, '#D09319') +
      rc(-112, -8, 20, 16, '#D66B52', 3) + rc(-96, -8, 8, 16, '#9EA7B1') + pa('M84 -8L112 0L84 8Z', '#EBC59A') + pa('M104 -2.3L112 0L104 2.3Z', TINTA),
  );
export const postit = (c: string, t1: string, t2: string) =>
  G(
    srect(-68, -66, 136, 132, 0, 5, 7) + rc(-68, -66, 136, 132, c) + pa('M68 66L34 66L68 34Z', SOMBRA, 'opacity=".14"') + rc(-68, -66, 136, 20, '#fff', 0, 'opacity=".22"') +
      tx(-54, -16, 21, t1, TINTA, 700) + tx(-54, 14, 21, t2, TINTA, 700),
  );
const llaves = () =>
  G(
    `<circle cx="0" cy="0" r="24" fill="none" stroke="#A9B0B8" stroke-width="5"/>` +
      G(rc(-8, 10, 16, 14, '#D4A73C', 4) + rc(-3, 24, 6, 52, '#D4A73C') + rc(3, 50, 9, 5, '#D4A73C') + rc(3, 62, 7, 5, '#D4A73C'), 'transform="rotate(-18)"') +
      G(rc(-8, 10, 16, 14, '#A9B0B8', 4) + rc(-3, 24, 6, 44, '#A9B0B8') + rc(3, 46, 9, 5, '#A9B0B8'), 'transform="rotate(32)"') +
      G(rc(-20, -68, 40, 44, '#51CB8A', 6), 'transform="rotate(10)"'),
  );
/* stroke-opacity y no opacity: .lm-fo gobierna la propiedad opacity y pisaría un opacity="…" del propio elemento */
const cerco = () => `<circle class="lm-fo" r="58" fill="none" stroke="#0F1620" stroke-width="6" stroke-opacity=".3"/>`;
const posavasos = () => G(ci(5, 6, 84, SOMBRA, 'opacity=".22"') + ci(0, 0, 84, '#1C2733') + `<circle r="70" fill="none" stroke="#51CB8A" stroke-width="3"/>`);

/* el móvil pequeño: un solo cuerpo, siempre opaco; lo que se cruza es el contenido de su pantalla, del lío (lm-fo) al «Al día» (lm-fi) */
const movilFinal = () =>
  G(
    movil(
      170, 330,
      G(avisos(), 'class="lm-fo"') +
        G(rc(-77, -152, 154, 304, '#16202B', 16) + ci(0, -10, 32, '#51CB8A') + ln('M-15 -10l11 11 20-22', NAVY, 6) + tx(0, 54, 20, 'Al día', '#fff', 700, 'text-anchor="middle"'), 'class="lm-fi"'),
    ) + G(vibra(), 'class="lm-fo"'),
    'class="lm-vib"',
  );

export const mapa = (x: number, y: number, w: number, h: number, pin = '#1F7A4A') =>
  `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">${rc(0, 0, 200, 150, '#E7ECE0')}${pa('M130 0H200V70Q150 60 130 0Z', '#BFE3C6')}${ln('M-5 96L205 58M50 -5L82 155M140 -5L118 155M-5 26L205 12', '#fff', 11)}${pa('M92 42c-14 0-24 10-24 23 0 17 24 40 24 40s24-23 24-40c0-13-10-23-24-23z', pin)}${ci(92, 65, 9, '#fff')}</svg>`;

export const tiendita = (x: number, y: number, w: number) => {
  const u = w / 10;
  let t = '';
  for (let i = 0; i < 5; i++) t += pa(`M${x + i * 2 * u} ${y + 2 * u}h${2 * u}v${1.6 * u}a${u} ${u} 0 0 1 ${-2 * u} 0z`, i % 2 ? PAPEL : '#1F7A4A');
  return rc(x + u * 0.4, y + u, w - u * 0.8, u * 11, '#E6EBF2') + rc(x, y + u * 0.3, w, u * 1.7, '#14502F') + t + rc(x + u, y + u * 5, u * 4.4, u * 7, '#BFDDEA') +
    rc(x + u * 1.3, y + u * 7.6, u * 3.8, u * 0.5, '#14502F') + rc(x + u * 6.2, y + u * 5, u * 2.8, u * 7, '#1F7A4A') + ci(x + u * 8.4, y + u * 8.4, u * 0.3, '#F2B735');
};

/* ───────── pantallas finales: una sola interfaz con los cuatro servicios ───────── */
const pantallaD = () =>
  G(
    rc(0, 0, 640, 48, NAVY) + `<svg x="14" y="10" width="28" height="28" viewBox="0 0 100 100"><use href="#aro"/></svg>` + tx(50, 32, 21, 'Hoy en tu negocio', '#fff', 700) + G(ci(456, 24, 10, '#51CB8A') + ln('M451 24l4 4 8-9', NAVY, 2.6) + tx(626, 32, 18, 'Todo en un sitio', '#51CB8A', 700, 'text-anchor="end"'), 'class="lm-sello"') +
      rc(0, 48, 640, 352, '#F2F4F6') +
      rc(16, 62, 300, 186, '#fff', 6) + rc(16, 62, 300, 26, '#DDE2E7', 6) + ci(30, 75, 4, '#C2402B') + ci(43, 75, 4, '#E7A93F') + ci(56, 75, 4, '#51CB8A') + tx(74, 81, 16, 'Tu web', TINTA, 700) +
      rc(16, 88, 120, 160, '#2F4E8C') + tiendita(26, 110, 100) + tx(150, 120, 21, 'Lo que', NAVY, 800) + tx(150, 145, 21, 'ofreces', NAVY, 800) + rc(150, 158, 150, 6, '#B8BDC4', 2) + rc(150, 172, 120, 6, '#B8BDC4', 2) +
      rc(150, 192, 150, 38, '#1F7A4A', 6) + tx(225, 217, 16, 'Pide presupuesto', '#fff', 700, 'text-anchor="middle"') +
      rc(328, 62, 296, 186, '#fff', 6) + mapa(328, 62, 132, 186) + tx(472, 92, 18, 'Tu ficha', NAVY, 800) + tx(472, 114, 18, 'en Google', NAVY, 800) + tx(472, 142, 16, 'Abierto ahora', '#1F7A4A', 700) +
      rc(472, 158, 136, 34, 'none', 6, 'stroke="#2F4E8C" stroke-width="2"') + tx(540, 181, 16, 'Llamar', '#2F4E8C', 700, 'text-anchor="middle"') +
      rc(472, 200, 136, 34, 'none', 6, 'stroke="#2F4E8C" stroke-width="2"') + tx(540, 223, 16, 'Cómo llegar', '#2F4E8C', 700, 'text-anchor="middle"') +
      rc(16, 260, 368, 128, '#fff', 6) + tx(32, 288, 18, 'Pedidos de hoy', NAVY, 800) +
      [['Presupuesto de la cocina', 'Enviado', '#1F7A4A'], ['Factura del fontanero', 'Cobrada', '#1F7A4A'], ['Encargo del taller', 'Por preparar', '#A86A10']]
        .map((r, i) => tx(32, 316 + i * 25, 16, r[0], TINTA, 500) + tx(370, 316 + i * 25, 16, r[1], r[2], 700, 'text-anchor="end"')).join('') +
      rc(396, 260, 228, 128, NAVY, 6) + tx(410, 288, 18, 'Sale solo', '#fff', 800) +
      [0, 1, 2].map((i) => ci(419, 312 + i * 28, 9, '#51CB8A') + ln(`M414 ${312 + i * 28}l4 4 7-8`, NAVY, 2.4)).join('') +
      tx(436, 318, 16, 'Aviso de la cita', '#E6EBF2', 500) + tx(436, 346, 16, 'Recordar la factura', '#E6EBF2', 500) + tx(436, 374, 16, 'Copia de seguridad', '#E6EBF2', 500),
  );

const portatil = () => {
  const teclas = `<pattern id="lm-teclas" x="-310" y="424" width="48" height="38" patternUnits="userSpaceOnUse">${rc(0, 0, 42, 32, '#1C2733', 5)}${rc(0, 0, 42, 5, '#34465A', 3)}</pattern>`;
  return G(
    `<defs>${teclas}</defs>` + srect(-350, 410, 700, 340, 14, 10, 12) + rc(-350, 410, 700, 340, '#9EA7B1', 14) + rc(-350, 410, 700, 8, '#7C8590') + rc(-340, 418, 680, 190, '#7C8590', 8) +
      rc(-310, 424, 624, 152, 'url(#lm-teclas)') + rc(-90, 620, 180, 100, '#B1B9C2', 8) +
      G(srect(-350, -30, 700, 450, 18, 10, 12) + rc(-350, -30, 700, 450, NAVY, 18) + rc(-340, -20, 680, 430, '#1C2733', 10) + G(G(pantallaD(), 'data-lim'), 'transform="translate(-320 0)"'), 'data-bisagra'),
  );
};

const pantallaM = () =>
  G(
    rc(-96, -188, 192, 40, NAVY) + `<svg x="-88" y="-180" width="24" height="24" viewBox="0 0 100 100"><use href="#aro"/></svg>` + tx(-58, -162, 14.5, 'Hoy en tu negocio', '#fff', 700) +
      rc(-96, -148, 192, 350, '#F2F4F6') +
      rc(-90, -142, 180, 92, '#fff', 5) + rc(-90, -142, 64, 92, '#2F4E8C', 5) + G(tiendita(0, 0, 100), 'transform="translate(-86 -122) scale(.56)"') + tx(-18, -122, 15, 'Tu web', NAVY, 800) +
      rc(-18, -112, 96, 5, '#B8BDC4', 2) + rc(-18, -102, 72, 5, '#B8BDC4', 2) + rc(-18, -90, 102, 34, '#1F7A4A', 5) + tx(33, -68, 13, 'Presupuesto', '#fff', 700, 'text-anchor="middle"') +
      rc(-90, -44, 180, 86, '#fff', 5) + mapa(-90, -44, 70, 86) + tx(-12, -22, 15, 'Tu ficha', NAVY, 800) + tx(-12, -4, 15, 'en Google', NAVY, 800) + tx(-12, 18, 13, 'Abierto ahora', '#1F7A4A', 700) +
      rc(-90, 48, 180, 86, '#fff', 5) + tx(-80, 68, 15, 'Pedidos de hoy', NAVY, 800) + tx(-80, 92, 13, 'Presupuesto', TINTA, 500) + tx(80, 92, 13, 'Enviado', '#1F7A4A', 700, 'text-anchor="end"') +
      tx(-80, 116, 13, 'Factura', TINTA, 500) + tx(80, 116, 13, 'Cobrada', '#1F7A4A', 700, 'text-anchor="end"') +
      rc(-90, 140, 180, 54, NAVY, 5) + tx(-80, 160, 15, 'Sale solo', '#fff', 800) + ci(-73, 178, 7, '#51CB8A') + tx(-60, 183, 13, 'Aviso de la cita', '#E6EBF2', 500),
  );
/* la pegatina de «hecho» en la esquina del móvil grande: es el gesto final (.lm-sello), fuera de la pantalla que se funde */
const pegatina = () => G(ci(72, -199, 15, '#51CB8A', `stroke="${NAVY}" stroke-width="3"`) + ln('M65 -199l5.5 5.5 10-11.5', NAVY, 3.4), 'class="lm-sello"');
const movilGrande = () =>
  G(
    srect(-110, -222, 220, 444, 30, 9, 11) + rc(-110, -222, 220, 444, NAVY, 30) + rc(-106, -218, 212, 436, '#34465A', 27) + rc(-101, -213, 202, 426, '#1C2733', 22) +
      G(pantallaM(), 'data-lim') + pegatina(),
  );

/* ───────── composiciones ───────── */
const pos = (id: string, a: Pos, b: Pos, clase = '') => {
  const t = (v: Pos) => `translate(${v[0]} ${v[1]}) rotate(${v[2]}) scale(${v[3]})`;
  const c = (v: Pos) => `translate(${v[0]}px, ${v[1]}px) rotate(${v[2]}deg) scale(${v[3]})`;
  return `data-o="${id}"${clase ? ` class="${clase}"` : ''} data-a="${a.join(' ')}" transform="${t(b)}" style="--ta:${c(a)}"`;
};
const uso = (id: string, a: Pos, b: Pos, clase = '') => `<use href="#lm-${id}" ${pos(id, a, b, clase)}/>`;
const dentro = (id: string, a: Pos, b: Pos, cont: string) => `<g ${pos(id, a, b)}>${cont}</g>`;

/* «s» = el objeto se funde al guardarse (opacidad 0 en la mesa recogida) */
const ANCHO = {
  tapete: [[760, 540, -2.2, 1], [800, 540, 0, 1]],
  cerco: [[1120, 712, 0, 1], [1120, 712, 0, 1]],
  pos: [[1072, 650, 6, 1], [210, 566, 0, 0.5]],
  calc: [[458, 650, 17, 0.92], [215, 600, -3, 0.56]],
  t1: [[1080, 470, 12, 1], [244, 590, 0, 0.6]],
  t2: [[706, 664, -16, 1], [192, 590, 0, 0.6]],
  presu: [[835, 430, -7, 1], [230, 560, 3, 0.62]],
  lib: [[572, 446, 7, 1], [208, 566, -3, 0.62]],
  pv: [[896, 690, -9, 1], [250, 540, 0, 0.5]],
  carp: [[212, 440, -9, 1], [214, 552, 0, 0.9]],
  llav: [[60, 700, 22, 1], [-90, 960, 0, 1]],
  portatil: [[3000, 268, 7, 1.08], [790, 250, 0, 1.08]],   // entra deslizando desde la derecha, siempre opaco; arranca fuera de la vista incluso en pantallas de 3840 px (x = 3000); misma escala: la letra de la pantalla no baja de 12 px
  lap: [[1324, 690, 62, 1], [1420, 560, 90, 0.7]],
  boli: [[632, 700, -30, 1], [1394, 560, 90, 0.74]],
  pvs: [[1282, 350, 0, 0], [1290, 330, 0, 0.8]],
  taza: [[1120, 712, 0, 1], [1290, 330, 0, 0.8]],
  movil: [[1280, 470, -9, 1.1], [1290, 590, 0, 0.9]],
} satisfies Record<string, [Pos, Pos]>;

const ALTO = {
  tapete: [[170, 300, -4, 0.7], [172, 290, 0, 0.62]],
  cerco: [[296, 396, 0, 0.7], [296, 396, 0, 0.7]],
  pos: [[70, 440, 8, 0.75], [40, 470, 0, 0.3]],
  calc: [[62, 318, -13, 0.7], [40, 470, 0, 0.3]],
  t1: [[305, 450, -8, 0.8], [40, 470, 0, 0.3]],
  presu: [[262, 205, 9, 0.78], [40, 470, 0, 0.3]],
  lib: [[108, 190, -7, 0.78], [40, 470, 0, 0.3]],
  pv: [[200, 470, -9, 0.75], [40, 470, 0, 0.3]],
  carp: [[110, 425, 6, 0.72], [40, 470, 0, 0.4]],
  portatil: [[172, 1000, 4, 1.15], [172, 286, 0, 1.15]],
  lap: [[320, 520, 70, 0.8], [338, 300, 90, 0.62]],
  boli: [[230, 540, -58, 0.8], [350, 300, 90, 0.64]],
  pvs: [[320, 90, 0, 0], [322, 70, 0, 0.4]],
  taza: [[296, 396, 0, 0.7], [322, 70, 0, 0.4]],
  movil: [[282, 300, 8, 0.95], [320, 470, 0, 0.5]],
} satisfies Record<string, [Pos, Pos]>;

/* los que se funden al final («s»): se guardan en la carpeta. En «alto» la carpeta y el móvil pequeño también,
   porque no hay sitio para ellos junto al móvil grande */
const SE_FUNDEN = {
  ancho: new Set(['pos', 'calc', 't1', 't2', 'presu', 'lib', 'pv']),
  alto: new Set(['pos', 'calc', 't1', 'presu', 'lib', 'pv', 'carp', 'movil']),
};
/* La franja de tablet (745-999 px): la mesa estrecha deja madera a los lados. Allí van una carpeta, unas llaves y un café, a escala
   pequeña y sin letra (la regla de 12 px se cumple dibujándolos sin texto). Están fuera de la mesa en el lío y entran por escala
   al final, cuando la carpeta del lío ya se ha ido: nunca se ven dos carpetas ni dos tazas. En móvil y por debajo de 745 px el CSS
   los oculta (.lm-lado); en tablet se oculta el café del móvil (.lm-solo-movil). Con 745 px el margen de madera (≥ 99 u a cada lado)
   deja sitio a la carpeta (123 u de ancho) sin pisar el móvil, que empieza en x = 46. */
const carpetaLado = () =>
  G(
    srect(-110, -130, 220, 280, 6) + pa('M-110 -130H-34L-18 -152H46L62 -130H110V150H-110Z', '#2A4468') + rc(-110, -124, 220, 274, '#3D5F8A', 6) + rc(-110, -124, 220, 5, '#5A7EAB') +
      rc(-72, -56, 144, 64, PAPEL, 3) + rc(-54, -38, 108, 8, '#B8BDC4', 2) + rc(-54, -18, 76, 8, '#B8BDC4', 2) + rc(-110, 96, 220, 9, '#1C2733'),
  );
/* [id del objeto, dibujo, posición con la mesa revuelta (escala 0 = aún no está), posición con la mesa recogida] */
const LADO: [string, string, Pos, Pos][] = [
  ['carpl', 'carpl', [-34, 432, -5, 0], [-34, 432, -5, 0.56]],
  ['llavl', 'llav', [-62, 190, 16, 0], [-62, 190, 16, 0.7]],
  ['pvsl', 'pvs', [405, 206, 0, 0], [405, 206, 0, 0.5]],
  ['tazal', 'taza', [405, 206, 0, 0], [405, 206, 0, 0.5]],
];
const lados = () => LADO.map(([id, def, a, b]) => `<use href="#lm-${def}" ${pos(id, a, b, 'lm-lado')}/>`).join('');
const objeto = (id: string, t: Record<string, [Pos, Pos]>, f: Set<string>) => uso(id, t[id][0], t[id][1], f.has(id) ? 's' : '');

/* la madera: un mosaico de cinco tablas de 165 px que se repite en horizontal y en vertical. Va en el HTML (un patrón SVG)
   y no como imagen de fondo para que el LCP siga siendo el titular: una imagen de fondo grande se lleva el LCP.
   Las vetas empiezan y acaban a la misma altura, así que el mosaico no deja costura. */
const MADERA_W = 1440, MADERA_TABLA = 165, MADERA_N = 5;
function madera(): string {
  const tonos = ['#1C2635', '#1A2330', '#1D2837', '#192230', '#1B2533'];
  const R = rng(91);
  let s = '';
  for (let i = 0; i < MADERA_N; i++) {
    const y = i * MADERA_TABLA;
    s += rc(0, y, MADERA_W, MADERA_TABLA + 1, tonos[i]);
    let d = '';
    for (let j = 0; j < 8; j++) {
      const yy = y + 6 + R() * (MADERA_TABLA - 12), am = 4 + R() * 8, st = MADERA_W / 5;
      d += `M0 ${N(yy)}`;
      for (let q = 0; q < 5; q++) d += `Q${N(q * st + st / 2)} ${N(yy + (R() - 0.5) * am * 2)} ${N((q + 1) * st)} ${N(q === 4 ? yy : yy + (R() - 0.5) * am)}`;
    }
    s += ln(d, '#2E3B4F', 1.4, 'opacity=".55"');
    if (i % 2 === 1) {
      const kx = R() * (MADERA_W - 60) + 30, ky = y + MADERA_TABLA * 0.3 + R() * MADERA_TABLA * 0.4;
      s += `<ellipse cx="${N(kx)}" cy="${N(ky)}" rx="26" ry="9" fill="none" stroke="#2E3B4F" stroke-width="2" opacity=".6"/><ellipse cx="${N(kx)}" cy="${N(ky)}" rx="13" ry="4" fill="#0F1620" opacity=".5"/>`;
    }
    /* canto entre tablas: línea oscura y reflejo claro */
    s += rc(0, y + MADERA_TABLA - 2, MADERA_W, 3, '#0A0E14', 0, 'opacity=".75"') + rc(0, y + MADERA_TABLA + 1, MADERA_W, 1.5, '#2E3B4F', 0, 'opacity=".6"');
  }
  return `<defs><pattern id="lm-madera" width="${MADERA_W}" height="${MADERA_TABLA * MADERA_N}" patternUnits="userSpaceOnUse">${s}</pattern></defs><rect width="100%" height="100%" fill="url(#lm-madera)"/>`;
}

export interface Mesa {
  /** la madera de la mesa (patrón SVG + rectángulo que lo extiende) */
  madera: string;
  /** <defs> con cada objeto dibujado una vez (SVG de 0 × 0) */
  defs: string;
  /** contenido del SVG ancho (viewBox 0 178 1440 654) */
  ancho: string;
  /** contenido del SVG alto (viewBox 0 16 360 544: sin el aire de arriba, para que se vea más mesa) */
  alto: string;
  /** veta de la tabla de arriba, detrás del texto (viewBox 0 0 1440 100, sin proporción) */
  veta: string;
}

export function mesa(): Mesa {
  const objetos: Record<string, string> = {
    tapete: tapete(880, 700),
    tapetem: tapete(540, 720),
    cerco: cerco(),
    pos: postit('#F2A4B1', '¡Llamar', 'ya!'),
    calc: calc(),
    t1: ticket(136, 300, 'Ticket', 'Sin cobrar'),
    t2: ticket(116, 210, 'Albarán', ''),
    presu: presupuesto(),
    lib: libreta(),
    pv: postit('#BDE6F2', '¿Pagó', 'o no?'),
    carp: carpeta(),
    carpl: carpetaLado(),
    llav: llaves(),
    lap: lapiz(),
    boli: boli(),
    pvs: posavasos(),
    taza: taza(),
    movil: movilFinal(),
  };
  const defs = Object.entries(objetos).map(([id, c]) => `<g id="lm-${id}">${c}</g>`).join('');

  const A = (id: keyof typeof ANCHO) => objeto(id, ANCHO, SE_FUNDEN.ancho);
  const ancho =
    A('tapete') + A('cerco') + A('pos') + A('calc') + A('t1') + A('t2') + A('presu') + A('lib') + A('pv') + A('carp') + A('llav') +
    dentro('portatil', ANCHO.portatil[0], ANCHO.portatil[1], portatil()) +
    A('lap') + A('boli') + A('pvs') + A('taza') + A('movil');

  const M = (id: keyof typeof ALTO) => objeto(id, ALTO, SE_FUNDEN.alto);
  const alto =
    uso('tapetem', ALTO.tapete[0], ALTO.tapete[1]) + lados() + uso('cerco', ALTO.cerco[0], ALTO.cerco[1], 'lm-solo-movil') + M('pos') + M('calc') + M('t1') + M('presu') + M('lib') + M('pv') + M('carp') +
    dentro('portatil', ALTO.portatil[0], ALTO.portatil[1], movilGrande()) +
    M('lap') + M('boli') + uso('pvs', ALTO.pvs[0], ALTO.pvs[1], 'lm-solo-movil') + uso('taza', ALTO.taza[0], ALTO.taza[1], 'lm-solo-movil') + M('movil');

  const R = rng(7);
  let d = '';
  for (let j = 0; j < 4; j++) {
    const yy = 14 + R() * 72, am = 3 + R() * 6;
    d += `M-20 ${N(yy)}`;
    let xx = -20;
    for (let q = 0; q < 5; q++) { xx += 296; d += `Q${N(xx - 148)} ${N(yy + (R() - 0.5) * am * 2)} ${N(xx)} ${N(yy + (R() - 0.5) * am)}`; }
  }
  const veta = `<path d="${d}" fill="none" stroke="#2E3B4F" stroke-width="1.4" stroke-linecap="round" opacity=".5" vector-effect="non-scaling-stroke"/>`;

  return { madera: madera(), defs, ancho, alto, veta };
}
