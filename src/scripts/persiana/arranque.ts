// Arranque de «La persiana». Pesa poco y no bloquea nada: el póster (una imagen de la propia escena) ya está pintado;
// three.js y la escena se piden después de la carga, cuando el navegador está libre, y el canvas se funde encima del
// póster cuando tiene su primer fotograma. Con «reducir movimiento» no se carga nada: se queda el póster con la persiana
// subida (lo elige el <picture>). Si no hay WebGL, o falla algo, también se queda el póster.
//
// Modo póster (para scripts/poster-persiana.mjs): ?poster=inicio|final pinta un único fotograma a pantalla completa,
// con el encuadre de ?encuadre=ancho|alto (escritorio o móvil; por defecto, ancho). Ese script trabaja contra el build
// de producción (astro preview), así que no se puede limitar a import.meta.env.DEV: se aceptan solo esos valores
// exactos; cualquier otro se ignora (y la página sale normal, o con el encuadre por defecto).

const raiz = document.querySelector<HTMLElement>('[data-ps]');
const escena = raiz?.querySelector<HTMLElement>('[data-escena]');
const parametros = new URLSearchParams(location.search);
const pedidoPoster = parametros.get('poster');
const modoPoster = pedidoPoster === 'inicio' || pedidoPoster === 'final' ? pedidoPoster : null;
const encuadrePoster = parametros.get('encuadre') === 'alto' ? 'alto' : 'ancho';
const quieto = matchMedia('(prefers-reduced-motion: reduce)');
// el mismo corte que el CSS (persiana.css) y que los <source> del póster: escritorio y apaisado ancho, o móvil
const anchoMQ = matchMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)');

/** Pasa la cabecera a «quieta»: sin escena en vivo ni fijación. Se queda el póster de la persiana bajada con el titular
 *  pintado (16-nov-2026: antes cambiaba al póster con la persiana subida, pero entonces el titular no tendría dónde ir). */
function ponerQuieta() {
  if (!raiz) return;
  raiz.classList.remove('ps-viva', 'ps-fija');
  raiz.classList.add('ps-quieta');
}

/** ¿Se puede crear un contexto WebGL2 de verdad (sin el modo por software)? Se comprueba antes de bajar three.js y sin
 *  que three escriba su «Error creating WebGL context» en la consola. */
function hayWebGL(): boolean {
  if (parametros.has('persiana-forzar')) return true;
  try {
    const prueba = document.createElement('canvas');
    const gl = prueba.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// La fijación se decide YA, al cargar el script y con la página arriba, no cuando termina de llegar la escena: en el
// móvil three.js tarda varios segundos y, si para entonces ya se había bajado un poco, la cabecera no se fijaba y la
// persiana subía mientras la página se iba hacia arriba, sin que se viera el efecto (17-nov-2026, Pelayo). Mientras
// llega la escena, lo fijo es el póster; si al final no hay escena (error o «reducir movimiento»), ponerQuieta() la suelta.
const webgl = !modoPoster && !!raiz && !quieto.matches && hayWebGL();
if (webgl && scrollY < 8) raiz!.classList.add('ps-fija');

async function cargar() {
  if (!raiz || !escena) return;
  if (!modoPoster && !webgl) { ponerQuieta(); return; }
  const fuentes = document.fonts?.load ? Promise.all([
    document.fonts.load('800 64px Bricolage'), document.fonts.load('500 24px Bricolage'),
  ]).catch(() => undefined) : Promise.resolve();
  const conTiempos = parametros.has('persiana-medir');
  const t0 = performance.now();
  const [{ Persiana, INICIO, INTRO }] = await Promise.all([import('./escena'), fuentes]);
  if (conTiempos) console.log(`[persiana] import de three y la escena: ${Math.round(performance.now() - t0)} ms (desde ${Math.round(t0)})`);

  const canvas = document.createElement('canvas');
  canvas.className = 'ps-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const movil = matchMedia('(max-width: 899px), (pointer: coarse)').matches;

  if (modoPoster) {
    // a pantalla completa, sin nada encima, con la proporción que diga la ventana del script
    document.body.replaceChildren(canvas);
    document.body.style.margin = '0';
    canvas.style.cssText = 'display:block;width:100vw;height:100vh';
    const p = new Persiana(canvas, { poster: true, encuadre: encuadrePoster, movil: encuadrePoster === 'alto' });
    await p.construir();
    p.medir(innerWidth, innerHeight);
    p.pintarYa(modoPoster === 'final' ? 1 : INICIO);
    // dos fotogramas más para que las sombras (que se calculan en el primero) ya estén en el que se captura
    requestAnimationFrame(() => {
      p.pintarYa(modoPoster === 'final' ? 1 : INICIO);
      // la caja del rótulo en reposo, en fracciones del encuadre de referencia: va a persiana.css (--rx, --ry, --rw, --rh)
      const r = p.rotulo();
      document.documentElement.dataset.rotulo = JSON.stringify({ x: r.b0.x / r.ancho, y: r.b0.y / r.alto, w: r.b0.w / r.ancho, h: r.b0.h / r.alto });
      requestAnimationFrame(() => { document.documentElement.dataset.posterListo = '1'; });
    });
    return;
  }

  let p: InstanceType<typeof Persiana>;
  try {
    p = new Persiana(canvas, { movil, encuadre: anchoMQ.matches ? 'ancho' : 'alto' });
  } catch {
    ponerQuieta(); // sin WebGL (o con WebGL por software): se queda el póster, y sin fijar la cabecera
    return;
  }
  try {
    await p.construir();
  } catch (e) {
    try { p.liberar(); } catch { /* ya no hay nada que liberar */ }
    throw e;
  }
  if (quieto.matches) { p.liberar(); ponerQuieta(); return; } // se pidió «reducir movimiento» mientras se construía

  // la fijación ya se puso al cargar el script (arriba, «webgl»); esto solo la pone si entonces aún no se podía saber.
  // Si no hay fijación, la persiana sube en los primeros ~380 px. El recorrido fijo es ~1 pantalla (ver persiana.css).
  if (scrollY < 8) raiz.classList.add('ps-fija');

  // el objetivo de la persiana: lo que diga el scroll (16-nov-2026: sin la subida breve del arranque, que se llevaba media
  // frase del titular pintado detrás del dintel nada más cargar). Hasta que termina el fundido, quieta en INICIO.
  let intro = INICIO;
  // la primera pantalla de la cabecera está fija (sticky) mientras dura la subida: el recorrido es lo que le sobra a la
  // sección por encima del alto de la parte fija (ver persiana.css). Si no está fija, sube en los primeros ~380 px.
  const pin = raiz.querySelector<HTMLElement>('[data-pin]')!;
  let desde = 0, recorrido = 1;
  const medirRecorrido = () => {
    const fija = getComputedStyle(pin).position === 'sticky';
    const sobra = raiz.offsetHeight - pin.offsetHeight;
    if (fija && sobra > 40) {
      desde = raiz.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(pin).top) || 0);
      recorrido = sobra * 0.92;   // termina un poco antes de soltarse: se ve la persiana arriba del todo
    } else {
      desde = 0;
      recorrido = Math.min(innerHeight * 0.42, 380);
    }
  };
  medirRecorrido();
  // todos los listeners cuelgan de esta señal: al liberar la escena se quitan de una vez
  const fin = new AbortController();
  const senal = { signal: fin.signal };
  addEventListener('resize', medirRecorrido, senal);
  anchoMQ.addEventListener('change', () => { p.ponerEncuadre(anchoMQ.matches ? 'ancho' : 'alto'); medirRecorrido(); }, senal);
  const progreso = () => Math.min(1, Math.max(0, (scrollY - desde) / recorrido));
  const actualizar = () => {
    p.objetivo = intro === INICIO ? INICIO : INICIO + (1 - INICIO) * progreso();
    // «Baja para abrir» sobra con la tienda ya abierta
    raiz.classList.toggle('ps-abierta', intro !== INICIO && progreso() > 0.85);
    p.pedir();
  };

  const medir = () => {
    const r = escena.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) p.medir(r.width, r.height);
  };
  const tamano = new ResizeObserver(medir);
  tamano.observe(escena);
  medir();

  let liberada = false;

  // el titular pintado sigue a la persiana: solo transform (sin relayout) y el recorte por el hueco de la tienda (lo que
  // pasa por encima del dintel deja de verse, como la chapa)
  const marco = raiz.querySelector<HTMLElement>('[data-rotulo-marco]');
  const rotulo = raiz.querySelector<HTMLElement>('[data-rotulo]');
  if (marco && rotulo) {
    p.alPintar = () => {
      const r = p.rotulo();
      const s = r.b0.w ? r.b.w / r.b0.w : 1;
      rotulo.style.transform = `translate(${(r.b.x - r.b0.x).toFixed(1)}px,${(r.b.y - r.b0.y).toFixed(1)}px) scale(${s.toFixed(4)})`;
      marco.style.clipPath = `polygon(${r.hueco.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
    };
  }

  // el primer fotograma, en el mismo estado que el póster; y entonces el fundido
  p.abierto = p.objetivo = INICIO;
  escena.append(canvas);
  p.onFrame = () => {
    p.onFrame = undefined;
    requestAnimationFrame(() => {
      if (liberada) return;
      raiz.classList.add('ps-viva');
      // desde aquí manda el scroll, cuando el fundido ya ha terminado
      setTimeout(() => { if (!liberada) { intro = INTRO; actualizar(); } }, 650);
    });
  };
  p.pedir();

  addEventListener('scroll', () => { if (intro === INTRO) actualizar(); }, { passive: true, signal: fin.signal });

  // el puntero mueve un poco la cámara (solo con ratón)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    escena.addEventListener('pointermove', (e) => {
      // solo el ratón: en un portátil táctil, tocar la escena no debe mover la cámara
      if (e.pointerType !== 'mouse') return;
      const r = escena.getBoundingClientRect();
      p.apuntar(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    }, senal);
    escena.addEventListener('pointerleave', () => p.apuntar(0, 0), senal);
  }

  // fuera de pantalla o con la pestaña oculta, no se pinta
  let visible = true;
  const estado = () => {
    const activo = visible && !document.hidden;
    if (activo === p.activo) return;
    p.activo = activo;
    if (activo) p.pedir();
  };
  const enPantalla = new IntersectionObserver(([e]) => { visible = e.isIntersecting; estado(); });
  enPantalla.observe(escena);
  document.addEventListener('visibilitychange', estado, senal);

  // si se pide «reducir movimiento» con la página abierta, fuera la escena: queda el póster.
  // Antes de liberar el renderer se desconecta todo lo que podría volver a pedir fotogramas. Es idempotente.
  const soltar = () => {
    if (liberada) return;
    liberada = true;
    fin.abort();
    enPantalla.disconnect();
    tamano.disconnect();
    p.onFrame = undefined;
    p.alPintar = undefined;
    if (rotulo) rotulo.style.transform = '';
    if (marco) marco.style.clipPath = '';
    p.liberar();
    canvas.remove();
    ponerQuieta();
  };
  quieto.addEventListener('change', () => { if (quieto.matches) soltar(); }, senal);
}

function cuandoEsteLibre(f: () => void) {
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  let hecho = false;
  const luego = () => { if (hecho) return; hecho = true; if (ric) ric(f, { timeout: 2000 }); else setTimeout(f, 200); };
  if (document.readyState === 'complete') luego();
  else {
    // después de la carga (el póster ya pintado); pero sin esperar indefinidamente a un script de terceros lento
    // (la estadística): como mucho, 3 s después de que el documento esté listo
    addEventListener('load', luego, { once: true });
    const tope = () => setTimeout(luego, 3000);
    if (document.readyState === 'interactive') tope(); else document.addEventListener('DOMContentLoaded', tope, { once: true });
  }
}

if (modoPoster) cargar();
else if (raiz && quieto.matches) ponerQuieta();
else if (raiz) cuandoEsteLibre(() => { cargar().catch(ponerQuieta); });
