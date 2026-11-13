// Pinta las texturas de «La persiana» (cal, suelo, chapa, interior) en el hilo principal, una por tarea, cediendo el
// hilo entre una y otra para que ninguna sea una tarea larga.
//
// Antes se pintaban en un worker con OffscreenCanvas, pero en Chrome (Windows, GPU real) recoger los ImageBitmap y cerrar
// el worker dejaba el hilo principal bloqueado ~575 ms sin ejecutar JS (medido con long-animation-frame): bastante peor
// que pintarlas aquí a trozos.
// Cada pedido es una función que devuelve el lienzo ya pintado (así los argumentos los comprueba TypeScript en el sitio
// de la llamada, sin tipos de índice ni conversiones).
export type Pedidos = Record<string, () => HTMLCanvasElement>;

const MEDIR = typeof location !== 'undefined' && new URLSearchParams(location.search).has('persiana-medir');
const pausa = () => new Promise<void>((r) => setTimeout(r, 0));

export async function pintar(pedidos: Pedidos): Promise<Record<string, HTMLCanvasElement>> {
  const fuera: Record<string, HTMLCanvasElement> = {};
  for (const [id, fabrica] of Object.entries(pedidos)) {
    const t = performance.now();
    fuera[id] = fabrica();
    if (MEDIR) console.log(`[persiana] textura ${id}: ${Math.round(performance.now() - t)} ms`);
    await pausa();
  }
  return fuera;
}
