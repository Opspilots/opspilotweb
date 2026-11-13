// Texturas de «La persiana», generadas en <canvas> en el navegador (la CSP no deja blob: ni WASM, y así no se
// descarga ninguna imagen). Todo sale de un generador con semilla: el póster (scripts/poster-persiana.mjs) y la
// escena en vivo pintan exactamente lo mismo.
//
// El ruido se hace barato: una rejilla pequeña de valores al azar que el propio canvas amplía con suavizado
// bilineal (drawImage). Varias escalas superpuestas dan el grano de la cal, las manchas y la suciedad sin recorrer
// millones de píxeles en JavaScript (importa en móvil con la CPU lenta: nada de tareas largas).

export type Rnd = () => number;

/** Generador con semilla (mulberry32). */
export function azar(semilla: number): Rnd {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un lienzo 2D (un <canvas> fuera del documento). */
export function lienzo(w: number, h: number) {
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = c.getContext('2d')!;
  return { c, ctx };
}

/**
 * Una capa de ruido de valor: celdas de `celda` px, amplitud `alfa`, con modo de mezcla.
 * `periodico`: la capa se repite sin costura (para texturas que se repiten, como el grano de la cal).
 */
export function ruido(ctx: CanvasRenderingContext2D, w: number, h: number, celda: number, alfa: number, rnd: Rnd,
  op: GlobalCompositeOperation = 'source-over', periodico = false, tinte?: [number, number, number]) {
  const nx = Math.max(1, Math.round(w / celda));
  const ny = Math.max(1, Math.round(h / celda));
  const { c, ctx: p } = lienzo(nx + 2, ny + 2);
  const img = p.createImageData(nx + 2, ny + 2);
  const base: number[] = [];
  for (let i = 0; i < nx * ny; i++) base.push(rnd());
  for (let y = 0; y < ny + 2; y++) {
    for (let x = 0; x < nx + 2; x++) {
      // con periodo: el borde repite la fila/columna del otro lado; sin periodo, otro valor al azar
      const v = periodico ? base[((y - 1 + ny) % ny) * nx + ((x - 1 + nx) % nx)] : (x > 0 && y > 0 && x <= nx && y <= ny ? base[(y - 1) * nx + (x - 1)] : rnd());
      const o = (y * (nx + 2) + x) * 4;
      const g = Math.round(v * 255);
      if (tinte) {
        img.data[o] = tinte[0]; img.data[o + 1] = tinte[1]; img.data[o + 2] = tinte[2]; img.data[o + 3] = g;
      } else {
        img.data[o] = img.data[o + 1] = img.data[o + 2] = g; img.data[o + 3] = 255;
      }
    }
  }
  p.putImageData(img, 0, 0);
  const sx = w / nx;
  const sy = h / ny;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.globalAlpha = alfa;
  ctx.globalCompositeOperation = op;
  ctx.drawImage(c, -sx, -sy, (nx + 2) * sx, (ny + 2) * sy);
  ctx.restore();
}

/** Grano fino: una tesela de 256 px de ruido por píxel, repetida con createPattern (es periódica por naturaleza).
 *  Antes se generaba un ImageData del tamaño de cada textura: con la CPU lenta del móvil eran cientos de ms. */
let tesela: HTMLCanvasElement | undefined;
export function grano(ctx: CanvasRenderingContext2D, w: number, h: number, alfa: number, rnd: Rnd, op: GlobalCompositeOperation = 'overlay') {
  if (!tesela) {
    const n = 256;
    const { c, ctx: p } = lienzo(n, n);
    const img = p.createImageData(n, n);
    const d = img.data;
    const r = azar(7);
    for (let i = 0; i < d.length; i += 4) {
      const g = (r() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = g;
      d[i + 3] = 255;
    }
    p.putImageData(img, 0, 0);
    tesela = c;
  }
  // un desplazamiento distinto por textura, para que no coincidan las repeticiones
  const ox = Math.floor(rnd() * 256), oy = Math.floor(rnd() * 256);
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.globalCompositeOperation = op;
  ctx.translate(-ox, -oy);
  ctx.fillStyle = ctx.createPattern(tesela, 'repeat')!;
  ctx.fillRect(0, 0, w + ox, h + oy);
  ctx.restore();
}

/** Mancha blanda (para suciedad, oclusión falsa o luz): un radial pintado con sombra del canvas, sin borde. */
export function mancha(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string, alfa: number) {
  ctx.save();
  ctx.globalAlpha = alfa;
  // el borde, del MISMO color con alfa 0: si fuera negro transparente, el canvas mezcla hacia gris y sale un aro oscuro
  const n = parseInt(color.slice(1), 16);
  const rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Dibujo desenfocado barato: se pinta en un lienzo k veces más pequeño y se amplía con suavizado bilineal, que deja
 * bordes difusos de unos k px. Sustituye a ctx.filter = 'blur()', que con la CPU lenta del móvil (canvas por software)
 * costaba cientos de ms por textura. `dibujar` usa las coordenadas del lienzo grande.
 */
export function difuso(ctx: CanvasRenderingContext2D, k: number, dibujar: (p: CanvasRenderingContext2D) => void,
  alfa = 1, op: GlobalCompositeOperation = 'source-over') {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const { c, ctx: p } = lienzo(Math.ceil(w / k) + 2, Math.ceil(h / k) + 2);
  p.scale(1 / k, 1 / k);
  p.translate(k, k);
  dibujar(p);
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.globalCompositeOperation = op;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(c, -k, -k, c.width * k, c.height * k);
  ctx.restore();
}

/** Banda difuminada a lo largo de un rectángulo (oclusión en esquinas y contactos). */
export function sombraBorde(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, desenfoque: number, color: string, alfa: number) {
  difuso(ctx, Math.max(1, desenfoque), (p) => { p.fillStyle = color; p.fillRect(x, y, w, h); }, alfa);
}
