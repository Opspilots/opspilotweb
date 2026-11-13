// Arranque de «La persiana». Pesa poco y no bloquea nada: el póster (una imagen de la propia escena) ya está pintado;
// three.js y la escena se piden después de la carga, cuando el navegador está libre, y el canvas se funde encima del
// póster cuando tiene su primer fotograma. Con «reducir movimiento» no se carga nada: se queda el póster con la persiana
// subida (lo elige el <picture>). Si no hay WebGL, o falla algo, también se queda el póster.
//
// Modo póster (para scripts/poster-persiana.mjs): ?poster=inicio|final pinta un único fotograma a pantalla completa.

const raiz = document.querySelector<HTMLElement>('[data-ps]');
const escena = raiz?.querySelector<HTMLElement>('[data-escena]');
const parametros = new URLSearchParams(location.search);
const modoPoster = parametros.get('poster');
const quieto = matchMedia('(prefers-reduced-motion: reduce)');

async function cargar() {
  if (!raiz || !escena) return;
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
    const p = new Persiana(canvas, { poster: true });
    await p.construir();
    p.medir(innerWidth, innerHeight);
    p.pintarYa(modoPoster === 'final' ? 1 : INICIO);
    // dos fotogramas más para que las sombras (que se calculan en el primero) ya estén en el que se captura
    requestAnimationFrame(() => { p.pintarYa(modoPoster === 'final' ? 1 : INICIO); requestAnimationFrame(() => { document.documentElement.dataset.posterListo = '1'; }); });
    return;
  }

  let p: InstanceType<typeof Persiana>;
  try {
    p = new Persiana(canvas, { movil });
  } catch {
    raiz.classList.add('ps-quieta'); // sin WebGL (o con WebGL por software): se queda el póster, y sin fijar la cabecera
    return;
  }
  await p.construir();

  // el objetivo de la persiana: la subida breve del arranque y, encima, lo que diga el scroll
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
  addEventListener('resize', medirRecorrido);
  const progreso = () => Math.min(1, Math.max(0, (scrollY - desde) / recorrido));
  const actualizar = () => {
    p.objetivo = intro === INICIO ? INICIO : INTRO + (1 - INTRO) * progreso();
    p.pedir();
  };

  const medir = () => {
    const r = escena.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) p.medir(r.width, r.height);
  };
  new ResizeObserver(medir).observe(escena);
  medir();

  // el primer fotograma, en el mismo estado que el póster; y entonces el fundido
  p.abierto = p.objetivo = INICIO;
  escena.append(canvas);
  p.onFrame = () => {
    p.onFrame = undefined;
    requestAnimationFrame(() => {
      raiz.classList.add('ps-viva');
      // la subida breve, cuando el fundido ya ha terminado
      setTimeout(() => { intro = INTRO; actualizar(); }, 650);
    });
  };
  p.pedir();

  addEventListener('scroll', () => { if (intro === INTRO) actualizar(); }, { passive: true });

  // el puntero mueve un poco la cámara (solo con ratón)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    escena.addEventListener('pointermove', (e) => {
      const r = escena.getBoundingClientRect();
      p.apuntar(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    });
    escena.addEventListener('pointerleave', () => p.apuntar(0, 0));
  }

  // fuera de pantalla o con la pestaña oculta, no se pinta
  let visible = true;
  const estado = () => {
    const activo = visible && !document.hidden;
    if (activo === p.activo) return;
    p.activo = activo;
    if (activo) p.pedir();
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; estado(); }).observe(escena);
  document.addEventListener('visibilitychange', estado);

  // si se pide «reducir movimiento» con la página abierta, fuera la escena: queda el póster
  quieto.addEventListener('change', () => {
    if (!quieto.matches) return;
    p.liberar();
    canvas.remove();
    raiz.classList.remove('ps-viva');
    raiz.classList.add('ps-quieta');
  });
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
else if (raiz && !quieto.matches) cuandoEsteLibre(() => { cargar().catch(() => { raiz.classList.remove('ps-viva'); raiz.classList.add('ps-quieta'); }); });
