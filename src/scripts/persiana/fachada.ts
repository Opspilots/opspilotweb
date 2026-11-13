// Pinturas de la fachada y del interior de «La persiana»: cada función devuelve un <canvas> que la escena convierte en
// CanvasTexture. Las medidas (en metros) de la fachada están en MED: la textura de la cal sabe dónde están el hueco,
// la ventana y el suelo, y así pinta la suciedad y la oclusión falsa (las esquinas y los contactos más oscuros) en su
// sitio, que es lo que más «realismo» da por menos coste.
import { azar, lienzo, ruido, grano, mancha, sombraBorde, difuso } from './texturas';

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
    ctx.fillStyle = '#D2C7B0';
    ctx.fillRect(x, y, b, b);
    ctx.fillStyle = '#9A6450';
    // un cuarto de flor por baldosa: cuatro juntas hacen el motivo
    const cx = i % 2 ? x : x + b, cy = j % 2 ? y : y + b;
    ctx.beginPath(); ctx.arc(cx, cy, b * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#D2C7B0';
    ctx.beginPath(); ctx.arc(cx, cy, b * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#56605C';
    ctx.beginPath(); ctx.arc(cx, cy, b * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#56605C';
    const ox = i % 2 ? x + b : x, oy = j % 2 ? y + b : y;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + (i % 2 ? -b * 0.3 : b * 0.3), oy); ctx.lineTo(ox, oy + (j % 2 ? -b * 0.3 : b * 0.3)); ctx.fill();
    ctx.strokeStyle = 'rgba(60,50,40,.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, b - 2, b - 2);
  }
  ruido(ctx, n, n, 20, 0.12, r, 'multiply');
  grano(ctx, n, n, 0.08, r);
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

/** La web del negocio en la pantalla del fondo. Texto de muestra, sin nombres de clientes. */
export function web() {
  const { c, ctx } = lienzo(1024, 576);
  ctx.fillStyle = PAPEL;
  ctx.fillRect(0, 0, 1024, 576);
  // barra del navegador
  ctx.fillStyle = '#DCDFE3';
  ctx.fillRect(0, 0, 1024, 52);
  for (const [i, col] of [['0', '#E0675E'], ['1', '#E8B04C'], ['2', '#5DBB63']] as const) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(28 + +i * 24, 26, 8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#fff';
  redondo(ctx, 120, 12, 560, 28, 14); ctx.fill();
  ctx.fillStyle = '#4A5260';
  ctx.font = '500 18px Bricolage, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('tunegocio.es', 140, 27);
  // cabecera de la web
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 52, 1024, 74);
  ctx.fillStyle = '#fff';
  ctx.font = '800 34px Bricolage, sans-serif';
  ctx.fillText('Tu negocio', 40, 90);
  ctx.font = '500 22px Bricolage, sans-serif';
  ctx.fillStyle = '#C9D1DC';
  ctx.fillText('Servicios', 600, 90);
  ctx.fillText('Horario', 730, 90);
  ctx.fillText('Contacto', 850, 90);
  // portada: titular grande y botón
  ctx.fillStyle = NAVY;
  ctx.font = '800 64px Bricolage, sans-serif';
  ctx.fillText('Pide cita', 40, 210);
  ctx.fillText('sin llamar.', 40, 280);
  ctx.font = '500 26px Bricolage, sans-serif';
  ctx.fillStyle = '#3A4350';
  ctx.fillText('Abierto hoy de 9:30 a 14:00 y de 17:30 a 20:30', 40, 345);
  ctx.fillStyle = VERDE;
  redondo(ctx, 40, 390, 250, 72, 10); ctx.fill();
  ctx.fillStyle = NAVY;
  ctx.font = '700 30px Bricolage, sans-serif';
  ctx.fillText('Reservar', 92, 427);
  ctx.strokeStyle = NAVY; ctx.lineWidth = 3;
  redondo(ctx, 310, 390, 230, 72, 10); ctx.stroke();
  ctx.fillText('Cómo llegar', 336, 427);
  // a la derecha, el mapa con el pin
  ctx.fillStyle = '#E4E7E1';
  ctx.fillRect(620, 160, 360, 330);
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.moveTo(620, 300); ctx.lineTo(980, 260); ctx.moveTo(760, 160); ctx.lineTo(820, 490); ctx.stroke();
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(620, 420); ctx.lineTo(980, 440); ctx.moveTo(900, 160); ctx.lineTo(940, 490); ctx.stroke();
  pin(ctx, 800, 300, 1.4, '#1F7A4A');
  return c;
}

/** El pin del mapa (genérico, no el logotipo de ninguna marca). */
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

/** El aviso de WhatsApp que entra en la pantalla cuando el negocio ya está abierto. */
export function aviso() {
  const { c, ctx } = lienzo(512, 150);
  ctx.fillStyle = '#FFFFFF';
  redondo(ctx, 4, 4, 504, 142, 22); ctx.fill();
  ctx.fillStyle = '#25D366';
  ctx.beginPath(); ctx.arc(62, 75, 38, 0, Math.PI * 2); ctx.fill();
  burbuja(ctx, 62, 75, 0.9, '#fff');
  ctx.fillStyle = '#5E6776';
  ctx.font = '600 24px Bricolage, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('WhatsApp · ahora', 122, 48);
  ctx.fillStyle = NAVY;
  ctx.font = '700 31px Bricolage, sans-serif';
  ctx.fillText('¿Os queda hueco el jueves?', 122, 96);
  return c;
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

/** El cartel colgado de la puerta: una cara «Abierto» y otra «Cerrado». */
export function cartel(abierto: boolean) {
  const { c, ctx } = lienzo(512, 224);
  ctx.fillStyle = abierto ? VERDE : '#E6E2D8';
  ctx.fillRect(0, 0, 512, 224);
  ctx.strokeStyle = abierto ? '#1F7A4A' : '#9A9384';
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 484, 196);
  ctx.fillStyle = NAVY;
  ctx.font = '800 112px Bricolage, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(abierto ? 'Abierto' : 'Cerrado', 256, 118);
  return c;
}

/** Los vinilos del escaparate: «Pide por WhatsApp» y «Cómo llegar». Fondo transparente. */
export function vinilos() {
  const { c, ctx } = lienzo(512, 476);
  ctx.textBaseline = 'middle';
  // WhatsApp: placa redonda verde
  ctx.fillStyle = '#25D366';
  redondo(ctx, 16, 16, 480, 200, 100); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(116, 116, 62, 0, Math.PI * 2); ctx.fill();
  burbuja(ctx, 116, 116, 1.6, '#25D366');
  ctx.fillStyle = NAVY;
  ctx.font = '700 44px Bricolage, sans-serif';
  ctx.fillText('Pide por', 200, 92);
  ctx.font = '800 50px Bricolage, sans-serif';
  ctx.fillText('WhatsApp', 200, 146);
  // Cómo llegar: placa blanca con el pin
  ctx.fillStyle = PAPEL;
  redondo(ctx, 16, 260, 480, 200, 100); ctx.fill();
  pin(ctx, 116, 368, 1.85, '#1F7A4A');
  ctx.fillStyle = NAVY;
  ctx.font = '700 44px Bricolage, sans-serif';
  ctx.fillText('Estamos en', 200, 336);
  ctx.font = '800 50px Bricolage, sans-serif';
  ctx.fillText('el mapa', 200, 390);
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

/** Madera (mostrador y baldas): vetas horizontales. */
export function madera(n = 256) {
  const r = azar(101);
  const { c, ctx } = lienzo(n, n);
  ctx.fillStyle = '#8A5A34';
  ctx.fillRect(0, 0, n, n);
  for (let y = 0; y < n; y += 2) {
    ctx.fillStyle = `rgba(${r() < 0.5 ? '60,35,18' : '170,120,80'},${0.05 + r() * 0.12})`;
    ctx.fillRect(0, y, n, 1 + r() * 2);
  }
  ruido(ctx, n, n, 32, 0.08, r, 'multiply', true);
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
