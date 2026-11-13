// Pinturas de la fachada y del interior de «La persiana»: cada función devuelve un <canvas> que la escena convierte en
// CanvasTexture. Las medidas (en metros) de la fachada están en MED: la textura de la cal sabe dónde están el hueco,
// la ventana y el suelo, y así pinta la suciedad y la oclusión falsa (las esquinas y los contactos más oscuros) en su
// sitio, que es lo que más «realismo» da por menos coste.
import { azar, lienzo, ruido, grano, mancha, sombraBorde, difuso, type Rnd } from './texturas';

/** Medidas de la fachada, en metros. x hacia la derecha, y hacia arriba, la cara del muro en z = 0. */
export const MED = {
  muro: { x0: -4.6, x1: 4.6, alto: 7.4, grosor: 0.45 },
  hueco: { x0: -0.55, x1: 1.95, y1: 2.62 },          // el hueco de la tienda, con la persiana
  ventana: { x0: -2.3, x1: -1.2, y0: 0.98, y1: 2.42 }, // la ventana con reja
  zocalo: 0.82,
  acera: 2.2,                                          // fondo de la acera (z); después, el bordillo y el empedrado
} as const;

const W = MED.muro.x1 - MED.muro.x0;
const AL = MED.muro.alto;

/** De metros de la fachada a píxeles de su textura. */
const px = (cw: number, x: number) => ((x - MED.muro.x0) / W) * cw;
const py = (ch: number, y: number) => ((AL - y) / AL) * ch;

/** La cal: color con manchas, repasos de brocha, churretones bajo la ventana y oclusión en los bordes del hueco. */
export function calColor(cw = 1024) {
  const ch = Math.round((cw * AL) / W);
  const r = azar(11);
  const { c, ctx } = lienzo(cw, ch);
  ctx.fillStyle = '#ECE8DF';
  ctx.fillRect(0, 0, cw, ch);
  // manchas grandes y medianas: la cal nunca es un blanco uniforme
  ruido(ctx, cw, ch, 160, 0.10, r, 'multiply');
  ruido(ctx, cw, ch, 48, 0.08, r, 'multiply');
  ruido(ctx, cw, ch, 12, 0.05, r, 'multiply');
  // repasos de cal más nueva, más blancos y fríos
  for (let i = 0; i < 9; i++) {
    const x = r() * cw, y = r() * ch * 0.8;
    mancha(ctx, x, y, 60 + r() * 140, 30 + r() * 90, '#FAFAF7', 0.55);
  }
  // suciedad que sube del suelo (salpicaduras de lluvia) y el polvo que se pega encima del zócalo
  const z = py(ch, MED.zocalo);
  sombraBorde(ctx, 0, z - 10, cw, 40, 14, '#8C7B66', 0.22);
  ruido(ctx, cw, 60, 6, 0.0, r);
  // churretones: bajo las esquinas del alféizar y del farol
  const v = MED.ventana;
  difuso(ctx, 2, (p) => {
    for (const xr of [v.x0 - 0.05, v.x1 + 0.05, v.x0 + 0.3, v.x1 - 0.25]) {
      const x = px(cw, xr);
      const y0 = py(ch, v.y0 - 0.06);
      p.globalAlpha = 0.16 + r() * 0.1;
      p.fillStyle = '#7C6E5C';
      p.beginPath();
      p.moveTo(x - 5, y0);
      p.quadraticCurveTo(x - 3 + r() * 6, y0 + 40, x - 1 + r() * 4, y0 + 70 + r() * 70);
      p.lineTo(x + 2, y0 + 60);
      p.quadraticCurveTo(x + 4, y0 + 30, x + 6, y0);
      p.fill();
    }
  });
  // oclusión falsa: el borde de los huecos, bajo el alféizar y donde el muro toca el zócalo
  const h = MED.hueco;
  difuso(ctx, 8, (p) => {
    p.fillStyle = '#FFFFFF';
    p.fillRect(-40, -40, cw + 80, ch + 80);
    p.strokeStyle = '#B7AE9F';
    p.lineWidth = 16;
    p.strokeRect(px(cw, h.x0), py(ch, h.y1), px(cw, h.x1) - px(cw, h.x0), py(ch, 0) - py(ch, h.y1));
    p.strokeRect(px(cw, v.x0), py(ch, v.y1), px(cw, v.x1) - px(cw, v.x0), py(ch, v.y0) - py(ch, v.y1));
    p.fillStyle = '#A99F8F';
    p.fillRect(px(cw, v.x0 - 0.12), py(ch, v.y0 - 0.06), px(cw, v.x1 + 0.12) - px(cw, v.x0 - 0.12), 10);
  }, 1, 'multiply');
  // alguna grieta fina y un desconchón con la piedra a la vista
  ctx.save();
  ctx.strokeStyle = 'rgba(90,80,68,.35)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    let x = r() * cw, y = ch * (0.15 + r() * 0.5);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 14; y += 6 + r() * 10; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  ctx.restore();
  for (const [xr, yr] of [[3.1, 1.25], [-3.4, 3.6]]) {
    const x = px(cw, xr), y = py(ch, yr);
    mancha(ctx, x, y, 22, 14, '#B9A98F', 0.7);
    mancha(ctx, x + 2, y + 1, 12, 7, '#9C8A70', 0.6);
  }
  grano(ctx, cw, ch, 0.05, r);
  return c;
}

/** Relieve de la cal (se repite): grano de arena, la mano de la brocha y bultos de capas viejas. Solo canal de gris. */
export function calRelieve(n = 512) {
  const r = azar(23);
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, n, n);
  ruido(ctx, n, n, 64, 0.45, r, 'source-over', true);
  ruido(ctx, n, n, 16, 0.35, r, 'source-over', true);
  ruido(ctx, n, n, 4, 0.30, r, 'source-over', true);
  grano(ctx, n, n, 0.55, r, 'source-over');
  return c;
}

/** El zócalo pintado de albero, con desconchones donde asoma la cal y suciedad abajo. Mapa de [x0, x1] × [0, zócalo]. */
export function zocalo(cw = 1024) {
  const ch = 96;
  const r = azar(37);
  const { c, ctx } = lienzo(cw, ch);
  ctx.fillStyle = '#AE8046';
  ctx.fillRect(0, 0, cw, ch);
  ruido(ctx, cw, ch, 40, 0.14, r, 'multiply');
  ruido(ctx, cw, ch, 8, 0.08, r, 'multiply');
  sombraBorde(ctx, 0, ch - 18, cw, 30, 8, '#5E4528', 0.35);
  // desconchones: más en el canto de arriba
  for (let i = 0; i < 18; i++) {
    const x = r() * cw;
    const y = r() < 0.7 ? r() * 6 : ch - r() * 14;
    // contorno irregular: un polígono con radios al azar, con un filo más oscuro debajo (el grosor de la pintura)
    const rx = 1.5 + r() * 5, ry = 1 + r() * 3;
    ctx.beginPath();
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2, f = 0.55 + r() * 0.6;
      ctx[k ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rx * f, y + Math.sin(a) * ry * f);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(70,50,28,.35)';
    ctx.save(); ctx.translate(0.6, 0.8); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#D9D1C0';
    ctx.fill();
  }
  grano(ctx, cw, ch, 0.06, r);
  return c;
}

/** El suelo: losas de granito de la acera hasta z = acera; el empedrado de canto rodado va en otra textura. */
export function acera(cw = 1024) {
  const largo = MED.acera;
  const ch = Math.round((cw * largo) / W);
  const r = azar(41);
  const { c, ctx } = lienzo(cw, ch);
  ctx.fillStyle = '#77736C';
  ctx.fillRect(0, 0, cw, ch);
  // losas de 60 × 40 cm, a matajunta
  const lx = (0.6 / W) * cw, lz = (0.4 / largo) * ch;
  for (let fila = 0; fila * lz < ch; fila++) {
    const off = fila % 2 ? lx / 2 : 0;
    for (let x = -off; x < cw; x += lx) {
      const t = 128 + Math.round(r() * 34);
      ctx.fillStyle = `rgb(${t},${t - 2},${t - 6})`;
      ctx.fillRect(x + 1, fila * lz + 1, lx - 2, lz - 2);
    }
  }
  ruido(ctx, cw, ch, 24, 0.12, r, 'multiply');
  ruido(ctx, cw, ch, 6, 0.10, r, 'overlay');
  grano(ctx, cw, ch, 0.18, r);
  // suciedad junto al muro
  sombraBorde(ctx, 0, -10, cw, 26, 12, '#3A342C', 0.55);
  return c;
}

/** Empedrado cordobés de canto rodado (se repite). */
export function empedrado(n = 512) {
  const r = azar(53);
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#5C574F';
  ctx.fillRect(0, 0, n, n);
  const paso = 13;
  for (let y = 0; y < n + paso; y += paso * 0.82) {
    for (let x = ((y / paso) % 2) * paso * 0.5; x < n + paso; x += paso) {
      const cx = x + (r() - 0.5) * 4, cy = y + (r() - 0.5) * 4;
      const rx = 5 + r() * 2.5, ry = 3.8 + r() * 2;
      const t = 120 + Math.round(r() * 60);
      const tono = r() < 0.3 ? [t + 12, t, t - 18] : [t, t - 2, t - 6];
      const giro = r() * 0.6;
      // copias solo para las piedras que tocan un borde (así la textura se repite sin costura)
      const copias = [[0, 0], [n, 0], [0, n], [n, n], [-n, 0], [0, -n]].filter(([dx, dy]) => (dx === 0 || Math.abs(cx + dx - n / 2) < n / 2 + 8) && (dy === 0 || Math.abs(cy + dy - n / 2) < n / 2 + 8));
      for (const [dx, dy] of copias) {
        ctx.fillStyle = `rgb(${tono[0]},${tono[1]},${tono[2]})`;
        ctx.beginPath();
        ctx.ellipse(cx + dx, cy + dy, rx, ry, giro, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.18)';
        ctx.beginPath();
        ctx.ellipse(cx + dx - 1, cy + dy - 1.2, rx * 0.55, ry * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  grano(ctx, n, n, 0.12, r);
  return c;
}

/** Chapa galvanizada de la persiana: churretones verticales de lluvia y algo de óxido abajo. */
export function chapa(n = 512) {
  const r = azar(61);
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#B4B8BA';
  ctx.fillRect(0, 0, n, n);
  for (let i = 0; i < 70; i++) {
    const x = r() * n, w = 1 + r() * 5, y0 = r() * n * 0.6, h = 40 + r() * 260;
    ctx.fillStyle = r() < 0.5 ? 'rgba(70,72,74,.05)' : 'rgba(235,238,240,.05)';
    ctx.fillRect(x, y0, w, h);
  }
  ruido(ctx, n, n, 30, 0.06, r, 'multiply');
  // óxido y barro en la parte de abajo (v bajo = abajo de la persiana)
  for (let i = 0; i < 14; i++) mancha(ctx, r() * n, n - r() * 40, 10 + r() * 30, 6 + r() * 14, '#7A5434', 0.35);
  sombraBorde(ctx, 0, n - 22, n, 30, 8, '#4B4237', 0.3);
  grano(ctx, n, n, 0.06, r);
  return c;
}

/** Baldosa hidráulica del suelo de la tienda (se repite cada 4 baldosas). */
export function hidraulica(n = 512) {
  const r = azar(71);
  const { c, ctx } = lienzo(n, n);
  const b = n / 4;
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
    const x = i * b, y = j * b;
    ctx.fillStyle = '#CBC2AE';
    ctx.fillRect(x, y, b, b);
    ctx.fillStyle = '#8F7360';
    // un cuarto de flor por baldosa: cuatro juntas hacen el motivo
    const cx = i % 2 ? x : x + b, cy = j % 2 ? y : y + b;
    ctx.beginPath(); ctx.arc(cx, cy, b * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#CBC2AE';
    ctx.beginPath(); ctx.arc(cx, cy, b * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#626660';
    ctx.beginPath(); ctx.arc(cx, cy, b * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#626660';
    const ox = i % 2 ? x + b : x, oy = j % 2 ? y + b : y;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + (i % 2 ? -b * 0.3 : b * 0.3), oy); ctx.lineTo(ox, oy + (j % 2 ? -b * 0.3 : b * 0.3)); ctx.fill();
    ctx.strokeStyle = 'rgba(60,50,40,.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, b - 2, b - 2);
  }
  // el desgaste de décadas: manchas, la pátina que apaga el dibujo y el grano del cemento
  ruido(ctx, n, n, 64, 0.16, r, 'multiply', true);
  ruido(ctx, n, n, 20, 0.12, r, 'multiply', true);
  ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = '#B8AE98'; ctx.fillRect(0, 0, n, n); ctx.restore();
  grano(ctx, n, n, 0.1, r);
  return c;
}

/** Azulejo de la placa del número: cenefa en azul cobalto y albero, y el número. */
export function azulejo() {
  const r = azar(83);
  const { c, ctx } = lienzo(512, 256);
  ctx.fillStyle = '#F1ECDF';
  ctx.fillRect(0, 0, 512, 256);
  for (let t = 0; t < 2; t++) {
    const x = t * 256;
    ctx.save();
    ctx.translate(x + 128, 128);
    ctx.strokeStyle = '#1F4E8C';
    ctx.lineWidth = 10;
    ctx.strokeRect(-116, -116, 232, 232);
    if (t === 0) {
      ctx.fillStyle = '#1F4E8C';
      for (let k = 0; k < 8; k++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath(); ctx.ellipse(0, -52, 16, 46, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#D29A3A';
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1F4E8C';
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#1F4E8C';
      ctx.font = '700 170px Bricolage, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('7', 0, 10);
    }
    // esquinas en albero
    ctx.fillStyle = '#D29A3A';
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.beginPath(); ctx.arc(sx * 116, sy * 116, 22, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // la cerámica: craquelado suave y la junta entre las dos piezas
  ctx.fillStyle = 'rgba(80,70,60,.6)';
  ctx.fillRect(254, 0, 4, 256);
  grano(ctx, 512, 256, 0.05, r);
  return c;
}

const VERDE = '#51CB8A', NAVY = '#0F1620', PAPEL = '#F3F4F2';

function redondo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rr: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, rr);
}


/** Ajusta el tamaño de la letra para que `texto` no pase de `ancho` px (como mucho, `max` px). */
function letraQueCabe(ctx: CanvasRenderingContext2D, texto: string, peso: number, max: number, ancho: number) {
  ctx.font = `${peso} ${max}px Bricolage, sans-serif`;
  const w = ctx.measureText(texto).width;
  const t = w > ancho ? Math.floor((max * ancho) / w) : max;
  ctx.font = `${peso} ${t}px Bricolage, sans-serif`;
  return t;
}

/**
 * La web del negocio en la pantalla del fondo, a 2× (2048 × 1152): solo lo que se lee en un móvil de 390 px con la
 * persiana subida, que es el titular «Pide cita», el botón de reservar y el mapa con el pin. La barra del navegador y la
 * cabecera de la web van sin texto (no se leerían): solo sus formas. Texto de muestra, sin nombres de clientes.
 */
export function web() {
  const W = 2048, H = 1152;
  const { c, ctx } = lienzo(W, H);
  ctx.fillStyle = PAPEL;
  ctx.fillRect(0, 0, W, H);
  // barra del navegador: los tres botones y la caja de la dirección
  ctx.fillStyle = '#DADDE2';
  ctx.fillRect(0, 0, W, 84);
  ['#E0675E', '#E8B04C', '#5DBB63'].forEach((col, i) => {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(48 + i * 40, 42, 13, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#FFFFFF';
  redondo(ctx, 220, 20, 900, 44, 22); ctx.fill();
  // cabecera de la web: la marca (un aro) y el menú
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 84, W, 150);
  ctx.strokeStyle = VERDE; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.arc(140, 159, 36, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#E6EBF2';
  for (let i = 0; i < 3; i++) { redondo(ctx, W - 170, 124 + i * 28, 80, 12, 6); ctx.fill(); }
  // portada: el titular, tan grande como quepa, y el botón
  ctx.fillStyle = NAVY;
  ctx.textBaseline = 'alphabetic';
  letraQueCabe(ctx, 'Pide cita', 800, 250, 1080);
  ctx.fillText('Pide cita', 104, 540);
  ctx.fillStyle = VERDE;
  redondo(ctx, 110, 660, 820, 220, 28); ctx.fill();
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  letraQueCabe(ctx, 'Reservar', 800, 140, 700);
  ctx.fillText('Reservar', 520, 774);
  ctx.textAlign = 'left';
  // a la derecha, el mapa con el pin
  ctx.save();
  redondo(ctx, 1300, 300, 660, 760, 30);
  ctx.clip();
  ctx.fillStyle = '#E3E6DF';
  ctx.fillRect(1300, 300, 660, 760);
  ctx.fillStyle = '#CFDCC1';
  redondo(ctx, 1700, 360, 200, 170, 20); ctx.fill();
  ctx.strokeStyle = '#B7CBD2'; ctx.lineWidth = 60;
  ctx.beginPath(); ctx.moveTo(1280, 980); ctx.bezierCurveTo(1500, 900, 1700, 1080, 1990, 940); ctx.stroke();
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 34;
  ctx.beginPath(); ctx.moveTo(1300, 620); ctx.lineTo(1960, 540); ctx.moveTo(1520, 300); ctx.lineTo(1600, 1060); ctx.stroke();
  ctx.lineWidth = 18;
  ctx.beginPath(); ctx.moveTo(1300, 800); ctx.lineTo(1960, 840); ctx.moveTo(1820, 300); ctx.lineTo(1870, 1060); ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(1650, 722, 60, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  pin(ctx, 1650, 590, 3.3, '#1F7A4A');
  return c;
}

/** El pin del mapa (genérico, no el logotipo de ninguna marca). La punta queda en (x, y + 40·s). */
export function pin(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.bezierCurveTo(-8, 26, -28, 8, -28, -12);
  ctx.arc(0, -12, 28, Math.PI, 0);
  ctx.bezierCurveTo(28, 8, 8, 26, 0, 40);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(0, -12, 11, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/** Bocadillo de chat (genérico). */
function burbuja(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -2, 22, Math.PI * 0.75, Math.PI * 2.55);
  ctx.lineTo(-20, 22);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Estrella de cinco puntas (la valoración de la reseña). */
function estrella(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * La pantalla de la tableta del mostrador (a 2×, 448 × 640): la pantalla de bloqueo con el aviso de WhatsApp de un
 * cliente que pide cita y, debajo, el de una reseña nueva en el mapa. De lejos no se lee: se reconoce por las formas
 * (la tarjeta clara, el círculo verde y el pin).
 */
export function pantallaMovil(k = 1) {
  const w = 448, h = 640;
  const { c, ctx } = lienzo(Math.round(w * k), Math.round(h * k));
  ctx.scale(k, k);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#22344A');
  g.addColorStop(1, '#0B1118');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '300 104px Bricolage, sans-serif';
  ctx.fillText('19:42', w / 2, 150);
  ctx.textAlign = 'left';
  // el aviso de WhatsApp
  ctx.fillStyle = 'rgba(246,248,249,.97)';
  redondo(ctx, 18, 196, w - 36, 150, 28); ctx.fill();
  ctx.fillStyle = '#25D366';
  ctx.beginPath(); ctx.arc(80, 271, 38, 0, Math.PI * 2); ctx.fill();
  burbuja(ctx, 80, 271, 0.92, '#fff');
  ctx.fillStyle = '#5E6776';
  ctx.font = '600 28px Bricolage, sans-serif';
  ctx.fillText('WhatsApp', 140, 246);
  ctx.fillStyle = NAVY;
  letraQueCabe(ctx, '¿Cita el jueves?', 700, 40, w - 140 - 34);
  ctx.fillText('¿Cita el jueves?', 140, 298);
  // la reseña nueva
  ctx.fillStyle = 'rgba(246,248,249,.9)';
  redondo(ctx, 18, 364, w - 36, 130, 28); ctx.fill();
  pin(ctx, 80, 424, 0.9, '#1F7A4A');
  ctx.fillStyle = '#5E6776';
  ctx.font = '600 28px Bricolage, sans-serif';
  ctx.fillText('Nueva reseña', 140, 414);
  ctx.fillStyle = '#E8A93A';
  for (let i = 0; i < 5; i++) estrella(ctx, 156 + i * 40, 456, 16);
  // la barra de abajo
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  redondo(ctx, w / 2 - 70, h - 28, 140, 8, 4); ctx.fill();
  return c;
}

/**
 * El plano impreso pegado con celo por dentro del cristal del escaparate (a 2×): calles del casco antiguo, el río, un
 * parque, el recorrido punteado y el pin verde de la tienda. Sin texto: a 390 px no se leería.
 */
export function plano() {
  const w = 512, h = 720;
  const r = azar(149);
  const { c, ctx } = lienzo(w, h);
  ctx.fillStyle = '#F4F0E7';
  ctx.fillRect(0, 0, w, h);
  const m = 30;
  ctx.save();
  ctx.beginPath(); ctx.rect(m, m, w - 2 * m, h - 2 * m); ctx.clip();
  ctx.fillStyle = '#E6E0D3';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#CDDBBE';
  redondo(ctx, 318, 80, 150, 120, 18); ctx.fill();
  // calles: las del casco antiguo se tuercen
  ctx.strokeStyle = '#FCFBF7'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < 7; i++) {
    ctx.lineWidth = 7 + r() * 11;
    let x = 40 + r() * (w - 80), y = -20;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 80; y += 150; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  for (let i = 0; i < 7; i++) {
    ctx.lineWidth = 6 + r() * 10;
    let x = -20, y = 60 + r() * (h - 260);
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 5; k++) { x += 140; y += (r() - 0.5) * 70; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  // el río, abajo
  ctx.strokeStyle = '#B5CAD1'; ctx.lineWidth = 50;
  ctx.beginPath(); ctx.moveTo(-30, h - 110); ctx.bezierCurveTo(w * 0.3, h - 30, w * 0.62, h - 200, w + 30, h - 120); ctx.stroke();
  // el recorrido hasta la tienda
  ctx.setLineDash([12, 11]); ctx.strokeStyle = NAVY; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(86, h - 210); ctx.bezierCurveTo(120, 470, 230, 470, 256, 372); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  // el pin, con su sombra: la punta en (256, 372)
  mancha(ctx, 256, 376, 52, 15, '#000000', 0.28);
  pin(ctx, 256, 372 - 40 * 2.7, 2.7, VERDE);
  ctx.fillStyle = NAVY;
  ctx.beginPath(); ctx.arc(256, 372 - 40 * 2.7 - 12 * 2.7, 12, 0, Math.PI * 2); ctx.fill();
  // el papel: algo más oscuro en los bordes y el celo en las esquinas de arriba
  sombraBorde(ctx, -20, -20, w + 40, 40, 14, '#8C826E', 0.18);
  for (const [x, y, a] of [[40, 22, -0.55], [w - 40, 22, 0.55]] as const) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(a);
    ctx.fillStyle = 'rgba(236,226,196,.62)';
    ctx.fillRect(-56, -17, 112, 34);
    ctx.restore();
  }
  grano(ctx, w, h, 0.05, r);
  return c;
}

/**
 * El reflejo del cristal del monitor (se suma a la imagen, así que el negro no cambia nada): la luz de la calle en
 * una banda ancha y blanda en diagonal, otra más fina al lado, y el borde de arriba algo más claro.
 */
export function reflejo() {
  const w = 512, h = 288;
  const { c, ctx } = lienzo(w, h);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, w, h * 1.4);
  g.addColorStop(0, '#000');
  g.addColorStop(0.3, '#000');
  g.addColorStop(0.4, '#262626');
  g.addColorStop(0.47, '#0C0C0C');
  g.addColorStop(0.53, '#000');
  g.addColorStop(0.58, '#141414');
  g.addColorStop(0.62, '#000');
  g.addColorStop(1, '#000');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const v = ctx.createLinearGradient(0, 0, 0, h);
  v.addColorStop(0, 'rgba(255,236,210,.12)');
  v.addColorStop(0.35, 'rgba(255,236,210,0)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
  return c;
}

/** El cartel colgado de la puerta (a 2×): una cara «Abierto» y otra «Cerrado». */
export function cartel(abierto: boolean, w = 1024) {
  const k = w / 1024, h = Math.round(448 * k);
  const r = azar(abierto ? 157 : 163);
  const { c, ctx } = lienzo(w, h);
  ctx.fillStyle = abierto ? VERDE : '#E6E2D8';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = abierto ? '#1F7A4A' : '#9A9384';
  ctx.lineWidth = 18 * k;
  ctx.strokeRect(28 * k, 28 * k, w - 56 * k, h - 56 * k);
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  letraQueCabe(ctx, abierto ? 'Abierto' : 'Cerrado', 800, 230 * k, w - 150 * k);
  ctx.fillText(abierto ? 'Abierto' : 'Cerrado', w / 2, h / 2 + 12 * k);
  // el cartel es de plástico impreso: algo de suciedad en los bordes
  sombraBorde(ctx, -20, -20, w + 40, 40 * k, 12 * k, '#3A3A30', 0.12);
  grano(ctx, w, h, 0.04, r);
  return c;
}

/** Pared del fondo de la tienda: estuco cálido. */
export function estuco(n = 256) {
  const r = azar(97);
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#C9AE86';
  ctx.fillRect(0, 0, n, n);
  ruido(ctx, n, n, 40, 0.10, r, 'multiply', true);
  ruido(ctx, n, n, 8, 0.06, r, 'multiply', true);
  return c;
}

/**
 * Vetas de madera: los anillos de crecimiento cortados a lo largo, líneas casi paralelas que se ondulan y se abren
 * alrededor de los nudos. Son periódicas en x (las baldas repiten la textura). Llevan su propia semilla: el mapa de color
 * (vetas oscuras) y el de rugosidad (vetas más ásperas) las llaman con la misma y así coinciden.
 */
function vetas(ctx: CanvasRenderingContext2D, w: number, h: number, semilla: number, color: string, alfa: number, paso: number) {
  const r = azar(semilla);
  const nudos = Array.from({ length: 2 }, () => ({ x: w * (0.2 + r() * 0.6), y: h * (0.15 + r() * 0.7), rr: 5 + r() * 9 }));
  const tramos = Math.ceil(w / 6);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  for (let y0 = -paso * 2; y0 < h + paso * 2; y0 += paso * (0.5 + r())) {
    ctx.globalAlpha = alfa * (0.25 + r() * 0.75);
    ctx.lineWidth = 0.5 + r() * r() * 3;
    const k = 1 + Math.floor(r() * 3), fase = r() * Math.PI * 2, amp = 0.5 + r() * 3;
    ctx.beginPath();
    for (let i = 0; i <= tramos; i++) {
      const x = (i * w) / tramos;
      let y = y0 + Math.sin((x / w) * Math.PI * 2 * k + fase) * amp;
      for (const n of nudos) {
        const dx = x - n.x, dy = y - n.y, R = n.rr * 3.2, d = Math.hypot(dx, dy);
        if (d < R) y += (dy >= 0 ? 1 : -1) * n.rr * 1.4 * (1 - d / R) ** 2;
      }
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (const n of nudos) {
    ctx.lineWidth = 1;
    ctx.globalAlpha = alfa * 0.45;
    for (let k = 3; k > 0; k--) {
      ctx.beginPath(); ctx.ellipse(n.x, n.y, (n.rr * 0.55 * k) / 3 + 1.5, (n.rr * 0.28 * k) / 3 + 1, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = alfa * 0.85;
    ctx.beginPath(); ctx.ellipse(n.x, n.y, n.rr * 0.2, n.rr * 0.11, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/** Fibra: rayas horizontales finas de intensidad variable (ruido que cambia rápido en y y despacio en x, periódico en x). */
function fibras(ctx: CanvasRenderingContext2D, w: number, h: number, rnd: Rnd, alfa: number, op: GlobalCompositeOperation = 'overlay') {
  const nx = 4, ny = Math.max(2, Math.round(h / 2));
  const { c, ctx: p } = lienzo(nx + 1, ny);
  const img = p.createImageData(nx + 1, ny);
  for (let y = 0; y < ny; y++) {
    const fila: number[] = [];
    for (let x = 0; x < nx; x++) fila.push(rnd());
    fila.push(fila[0]);
    for (let x = 0; x <= nx; x++) {
      const o = (y * (nx + 1) + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = Math.round(fila[x] * 255);
      img.data[o + 3] = 255;
    }
  }
  p.putImageData(img, 0, 0);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.globalAlpha = alfa;
  ctx.globalCompositeOperation = op;
  // el centro de la primera columna en x = 0 y el de la última (la copia de la primera) en x = w
  ctx.drawImage(c, -w / (2 * nx), 0, ((nx + 1) * w) / nx, h);
  ctx.restore();
}

/** Madera de las baldas y los costados del mostrador (se repite en x): fibra, vetas oscuras y claras, y algún nudo. */
export function madera(n = 512) {
  const r = azar(101);
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#86593A';
  ctx.fillRect(0, 0, n, n);
  ruido(ctx, n, n, 96, 0.14, r, 'multiply', true);
  fibras(ctx, n, n, r, 0.32);
  vetas(ctx, n, n, 211, '#3A2312', 0.6, 9 * (n / 512));
  vetas(ctx, n, n, 223, '#C99B6A', 0.22, 14 * (n / 512));
  grano(ctx, n, n, 0.05, r);
  return c;
}

/** Rugosidad de la madera (canal gris, se multiplica por roughness): las vetas, más porosas, son más ásperas. */
export function maderaRugosidad(n = 256) {
  const r = azar(103);
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#9E9E9E';
  ctx.fillRect(0, 0, n, n);
  fibras(ctx, n, n, r, 0.45);
  vetas(ctx, n, n, 211, '#E6E6E6', 0.75, 9 * (n / 512));
  ruido(ctx, n, n, 40, 0.18, r, 'source-over', true);
  return c;
}

/**
 * La encimera del mostrador (cara de arriba: abajo en el lienzo es el canto de delante): tres tablas, el barniz gastado
 * donde se apoyan las manos, un cerco de taza, arañazos y suciedad en las juntas.
 */
export function encimera(w = 1024) {
  const h = w / 2;
  const r = azar(113);
  const { c, ctx } = lienzo(w, h);
  ctx.fillStyle = '#9A6A43';
  ctx.fillRect(0, 0, w, h);
  ruido(ctx, w, h, 140, 0.1, r, 'multiply');
  fibras(ctx, w, h, r, 0.3);
  vetas(ctx, w, h, 229, '#47290F', 0.5, 12);
  vetas(ctx, w, h, 233, '#D1A06A', 0.2, 17);
  for (const f of [1 / 3, 2 / 3]) {
    ctx.fillStyle = 'rgba(38,22,10,.6)'; ctx.fillRect(0, h * f - 1.5, w, 3);
    ctx.fillStyle = 'rgba(230,190,140,.16)'; ctx.fillRect(0, h * f + 1.5, w, 1.5);
  }
  // el barniz gastado de delante (más claro y mate) y la suciedad de los extremos
  mancha(ctx, w * 0.42, h * 0.95, w * 0.34, h * 0.3, '#D9AE7E', 0.32);
  mancha(ctx, w * 0.7, h * 0.9, w * 0.16, h * 0.2, '#D9AE7E', 0.2);
  sombraBorde(ctx, -30, -30, 60, h + 60, 16, '#2A1A0C', 0.3);
  sombraBorde(ctx, w - 30, -30, 60, h + 60, 16, '#2A1A0C', 0.3);
  // un cerco de taza y arañazos finos
  ctx.save();
  ctx.strokeStyle = 'rgba(52,30,14,.28)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(w * 0.82, h * 0.42, 26, 0.3, Math.PI * 1.85); ctx.stroke();
  ctx.lineWidth = 1;
  for (let i = 0; i < 26; i++) {
    const x = r() * w, y = h * (0.45 + r() * 0.55), l = 10 + r() * 50, a = (r() - 0.5) * 0.6;
    ctx.strokeStyle = r() < 0.6 ? 'rgba(235,205,165,.22)' : 'rgba(40,24,10,.2)';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  ctx.restore();
  grano(ctx, w, h, 0.05, r);
  return c;
}

/**
 * El frente del mostrador: tablillas verticales de tonos distintos, con su veta, el bisel de cada una (luz a un lado,
 * sombra al otro), la sombra que hace el vuelo de la encimera arriba y las rozaduras de los pies abajo.
 */
export function frenteMostrador(ancho: number, alto: number, cw = 512) {
  const ch = Math.round((cw * alto) / ancho);
  const r = azar(127);
  const { c, ctx } = lienzo(cw, ch);
  ctx.fillStyle = '#24170D';
  ctx.fillRect(0, 0, cw, ch);
  const n = Math.round(ancho / 0.11);
  const tw = cw / n;
  const tonos = ['#6B4325', '#7A4D2B', '#83552F', '#704628', '#8B5B34', '#765030'];
  for (let i = 0; i < n; i++) {
    const x = i * tw;
    ctx.save();
    ctx.beginPath(); ctx.rect(x + 1.5, 0, tw - 3, ch); ctx.clip();
    ctx.fillStyle = tonos[Math.floor(r() * tonos.length)];
    ctx.fillRect(x, 0, tw, ch);
    // la veta, a lo largo de la tablilla (vertical): se pinta girada
    ctx.translate(x + tw, 0);
    ctx.rotate(Math.PI / 2);
    fibras(ctx, ch, tw, r, 0.3);
    vetas(ctx, ch, tw, 300 + i, '#2E1A0B', 0.55, 5 * (cw / 512));
    ctx.restore();
    ctx.fillStyle = 'rgba(255,222,176,.12)'; ctx.fillRect(x + 1.5, 0, 1.5, ch);
    ctx.fillStyle = 'rgba(18,9,3,.4)'; ctx.fillRect(x + tw - 3.5, 0, 2, ch);
  }
  // oclusión bajo la encimera, y abajo, rozaduras y polvo
  sombraBorde(ctx, -10, -24, cw + 20, 38, 10, '#100803', 0.75);
  sombraBorde(ctx, -10, ch - 24, cw + 20, 40, 10, '#160E07', 0.5);
  for (let i = 0; i < 16; i++) mancha(ctx, cw * (0.08 + r() * 0.84), ch - 12 - r() * 60, 6 + r() * 18, 2 + r() * 5, '#1E140B', 0.3);
  // los cantos de los extremos, gastados (más claros)
  sombraBorde(ctx, -6, 0, 10, ch, 4, '#A57A50', 0.35);
  sombraBorde(ctx, cw - 4, 0, 10, ch, 4, '#A57A50', 0.35);
  grano(ctx, cw, ch, 0.06, r);
  return c;
}

/**
 * Etiquetas de los productos de la estantería: un atlas de 4 × 2 (cada producto usa una celda). Sin texto: bandas,
 * sellos y líneas, que es lo que se distingue a esa distancia.
 */
export function etiquetas() {
  const r = azar(139);
  const { c, ctx } = lienzo(512, 256);
  const celdas: [string, string, string][] = [
    ['#C9A87A', '#3B2A1A', '#3B2A1A'],
    ['#F2EEE4', NAVY, '#A6452F'],
    ['#EFE8D6', '#2F3A44', '#B8862F'],
    ['#1E2228', '#D8C08A', '#D8C08A'],
    ['#F5F2EA', '#3C4A3A', '#7D8F6A'],
    ['#E3D5BC', '#5B3A26', '#A6452F'],
    ['#FBFAF7', '#5B6B7A', '#5B6B7A'],
    ['#D9CDB4', '#7D4A3E', '#2F3A44'],
  ];
  celdas.forEach(([fondo, tinta, acento], i) => {
    const x = (i % 4) * 128, y = Math.floor(i / 4) * 128;
    ctx.fillStyle = fondo; ctx.fillRect(x, y, 128, 128);
    ctx.fillStyle = acento;
    if (i % 3 === 0) ctx.fillRect(x, y + 16, 128, 16);
    else { ctx.beginPath(); ctx.arc(x + 64, y + 44, 21, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = tinta;
    ctx.fillRect(x + 22, y + 76, 84, 10);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x + 32, y + 95, 64, 4);
    ctx.fillRect(x + 38, y + 105, 52, 4);
    ctx.globalAlpha = 1;
  });
  grano(ctx, 512, 256, 0.06, r);
  return c;
}

/** Sombra de contacto blanda (para alphaMap: blanco = sombra): un óvalo que se estira a la planta de cada objeto. */
export function contactoBlando(n = 64) {
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, n, n);
  const g = ctx.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(0.5, '#9A9A9A');
  g.addColorStop(1, '#000000');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, n, n);
  return c;
}

/** Degradado vertical para alphaMap (blanco arriba): la oclusión de las baldas contra la pared. */
export function degradado(n = 64) {
  const { c, ctx } = lienzo(4, n);
  const g = ctx.createLinearGradient(0, 0, 0, n);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(0.35, '#5A5A5A');
  g.addColorStop(1, '#000000');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, n);
  return c;
}


/**
 * Pared del fondo de la tienda, sin repetir: estuco cálido con la luz y la oclusión pintadas en su sitio (más oscura
 * arriba y en las esquinas, la sombra blanda bajo cada balda y bajo la pantalla, el halo de la pantalla y el de la
 * lámpara). Es lo que quita el aspecto de maqueta al interior sin pagar sombras de verdad.
 */
export function paredFondo(x0: number, x1: number, alto: number, baldas: { x0: number; x1: number; ys: number[] },
  pant: { x: number; y: number; w: number; h: number }, lampX: number) {
  const cw = 1024, ch = Math.round((cw * alto) / (x1 - x0));
  const r = azar(131);
  const { c, ctx } = lienzo(cw, ch);
  const X = (x: number) => ((x - x0) / (x1 - x0)) * cw;
  const Y = (y: number) => ((alto - y) / alto) * ch;
  ctx.fillStyle = '#CDB48C';
  ctx.fillRect(0, 0, cw, ch);
  ruido(ctx, cw, ch, 60, 0.1, r, 'multiply');
  ruido(ctx, cw, ch, 10, 0.06, r, 'multiply');
  // el zócalo pintado (más oscuro y algo más verde, como en las tiendas antiguas) con un filete arriba
  ctx.fillStyle = 'rgba(74,70,52,.42)';
  ctx.fillRect(0, Y(0.86), cw, ch - Y(0.86));
  ctx.fillStyle = 'rgba(40,32,22,.45)';
  ctx.fillRect(0, Y(0.86) - 2, cw, 3);
  ctx.fillStyle = 'rgba(255,240,215,.18)';
  ctx.fillRect(0, Y(0.86) - 4, cw, 2);
  // luz: el halo de la lámpara y el de la pantalla
  mancha(ctx, X(lampX), Y(2.1), cw * 0.32, ch * 0.32, '#FFF1D6', 0.5);
  mancha(ctx, X(pant.x), Y(pant.y), (pant.w / (x1 - x0)) * cw * 0.85, (pant.h / alto) * ch * 1.1, '#FFFFFF', 0.28);
  // oclusión: techo y esquinas
  sombraBorde(ctx, -40, -40, cw + 80, Y(2.75) + 40, 40, '#5A4630', 0.45);
  sombraBorde(ctx, -60, 0, 80, ch, 40, '#5A4630', 0.45);
  sombraBorde(ctx, cw - 20, 0, 80, ch, 40, '#5A4630', 0.45);
  sombraBorde(ctx, 0, Y(0.12), cw, 60, 18, '#4A3826', 0.4);
  // rodapié
  ctx.fillStyle = '#6E5238';
  ctx.fillRect(0, Y(0.1), cw, ch - Y(0.1));
  // sombras blandas bajo las baldas y la pantalla
  for (const y of baldas.ys) sombraBorde(ctx, X(baldas.x0) + 6, Y(y - 0.02), X(baldas.x1) - X(baldas.x0) - 12, 26, 9, '#3E2C1C', 0.45);
  sombraBorde(ctx, X(pant.x - pant.w / 2) + 8, Y(pant.y - pant.h / 2) - 4, (pant.w / (x1 - x0)) * cw - 16, 30, 10, '#2E2216', 0.5);
  grano(ctx, cw, ch, 0.05, r);
  return c;
}

/** Sombras de contacto del suelo de la tienda (negro con alfa): pegadas a las paredes y bajo el mostrador. */
export function contactoSuelo(x0: number, x1: number, fondo: number, mostrador: { x0: number; x1: number; z0: number; z1: number }) {
  const cw = 512, ch = Math.round((cw * -fondo) / (x1 - x0));
  const { c, ctx } = lienzo(cw, ch);
  const X = (x: number) => ((x - x0) / (x1 - x0)) * cw;
  const Z = (z: number) => (z / fondo) * ch;          // 0 en el escaparate, ch en la pared del fondo
  sombraBorde(ctx, 0, ch - 14, cw, 40, 12, '#000', 0.55);
  sombraBorde(ctx, -30, 0, 44, ch, 12, '#000', 0.5);
  sombraBorde(ctx, cw - 14, 0, 44, ch, 12, '#000', 0.5);
  sombraBorde(ctx, X(mostrador.x0) - 6, Z(mostrador.z1) - 6, X(mostrador.x1) - X(mostrador.x0) + 12, Z(mostrador.z0) - Z(mostrador.z1) + 14, 10, '#000', 0.6);
  return c;
}
