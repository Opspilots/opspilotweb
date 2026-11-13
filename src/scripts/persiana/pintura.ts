// Pinta las texturas de «La persiana» (cal, suelo, chapa, interior) en el hilo principal, una por tarea, cediendo el
// hilo entre una y otra para que ninguna sea una tarea larga.
//
// Antes se pintaban en un worker con OffscreenCanvas, pero en Chrome (Windows, GPU real) recoger los ImageBitmap y cerrar
// el worker dejaba el hilo principal bloqueado ~575 ms sin ejecutar JS (medido con long-animation-frame): bastante peor
// que pintarlas aquí a trozos.
import * as P from './fachada';

export type Pedidos = Record<string, [fn: keyof typeof P, args: unknown[]]>;

const MEDIR = typeof location !== 'undefined' && new URLSearchParams(location.search).has('persiana-medir');
const pausa = () => new Promise<void>((r) => setTimeout(r, 0));

export async function pintar(pedidos: Pedidos): Promise<Record<string, HTMLCanvasElement>> {
  const fuera: Record<string, HTMLCanvasElement> = {};
  for (const [id, [fn, args]] of Object.entries(pedidos)) {
    const t = performance.now();
    fuera[id] = (P[fn] as (...a: unknown[]) => HTMLCanvasElement)(...args);
    if (MEDIR) console.log(`[persiana] textura ${id}: ${Math.round(performance.now() - t)} ms`);
    await pausa();
  }
  return fuera;
}
