/* «Cuatro cosas que vemos cada semana». Con JS, la sección es interactiva: un problema cada vez, como antes (lista a la izquierda y ventana a
   la derecha; en móvil, pestañas y un problema). El modo lo decide el script en línea del componente (el pin, con la svh pequeña medida con
   una sonda); este fichero gobierna lo que se ve y solo recalcula el modo al cambiar el ancho, la svh, la fuente o «reducir movimiento».
   En modo fijo, el scroll nativo recorre los cuatro problemas: el bloque es sticky dentro de una pista alta y aquí solo se lee cuánto se ha
   avanzado por ella y se marca el activo. Sin wheel, sin touch, sin preventDefault sobre el scroll ni saltos: el único bucle es un
   requestAnimationFrame por cada scroll (listener pasivo) y solo mientras la pista se ve. Solo se escriben clases y transform/opacity.
   Ningún temporizador avanza nada. Fuera del modo fijo se cambia de problema al tocarlo (y al pasar el ratón por la lista).
   Al cambiar de modo se conserva lo que se veía: el problema, si se estaba dentro de la pista, o lo que había en pantalla, si se estaba debajo.
   Si este script falla, el componente retira todo y los cuatro problemas se apilan completos. */
(function () {
  'use strict';
  var sec = document.querySelector('[data-pb]');
  if (!sec || !sec.classList.contains('pb-int')) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var RM = matchMedia('(prefers-reduced-motion: reduce)');
  var PUNTO = 0.06;   /* por dónde de su tramo cae el scroll al ir a un problema: un poco dentro, para que no lo empuje al anterior */
  var NAV_Q = ['¿dónde apunté lo del cliente de ayer?', '¿pagó el segundo plazo?', '¿qué día empezaba el alicatado?', '¿qué me dijo por WhatsApp?', '¿eran 12 o 14 placas?'];
  var cl = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var raf = 0;

  try {
    var pista = $('[data-pb-pista]', sec), esc = $('[data-pb-escena]', sec), cont = $('[data-pb-tabs]', sec);
    var pares = $$('[data-par]', sec), N = pares.length;
    var probs = pares.map(function (p) { return $('.problema', p); });
    var chips = $$('button', cont);
    var pvs = pares.map(function (p) { return $('[data-pv]', p); });
    if (!pista || !esc || !N || chips.length !== N || typeof sec.pbDecide !== 'function' || typeof sec.pbAncla !== 'function') throw new Error('problemas: falta el marcado');

    var fijo = false, activo = -1, top = 0, rango = 1, manual = [], hoverOk = true;
    var nav = $('[data-pestanas]', sec), navTabs = nav ? $$('.nav-tabs span', nav) : [], navPs = nav ? $$('.np', nav) : [];
    var navN = nav ? $('[data-nav-n]', nav) : null, navUrl = nav ? $('[data-nav-url]', nav) : null, navI = -1;
    var padSup = function () { return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0; };
    var conChips = function () { return getComputedStyle(cont).display !== 'none'; };
    var urlConHash = function (id) { return location.pathname + location.search + (id ? '#' + id : ''); };

    /* ── las dos caras de cada réplica: «Hoy» y la misma con un sistema. Qué nota se ve lo decide el CSS según la clase .sis ── */
    var poner = function (pv, cara) {
      var t = $('[data-nota-t]', pv);
      pv.classList.toggle('sis', cara === 'sis');
      $$('.seg button', pv).forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.cara === cara ? 'true' : 'false'); });
      t.textContent = cara === 'sis' ? (pv.id === 'w-google' ? 'Con OpsPilot' : 'Con un sistema') : 'Ejemplo · hoy';
    };
    pvs.forEach(function (pv, k) {
      $$('.seg button', pv).forEach(function (b) {
        b.addEventListener('click', function () { manual[k] = true; poner(pv, b.dataset.cara); });
      });
    });

    /* ── medidas: se leen al cargar, al cambiar el modo o el tamaño (nunca en cada scroll) ── */
    var medir = function () {
      fijo = sec.classList.contains('pb-fijo');
      if (fijo) { top = parseFloat(getComputedStyle(esc).top) || 0; rango = Math.max(1, pista.offsetHeight - esc.offsetHeight); }
      /* con pestañas y en modo fijo, el título del problema no es un control: se saca del orden de tabulación */
      var sinTitulo = fijo && conChips();
      probs.forEach(function (b) { if (sinTitulo) b.tabIndex = -1; else b.removeAttribute('tabindex'); });
    };

    /* ── el activo: clases, aria-current y, si el foco estaba en una ventana que se oculta, el foco a la pestaña o al título ── */
    var marca = function (i) {
      var foco = document.activeElement, enOculta = !!(foco && foco !== document.body && foco.closest && foco.closest('[data-pv]') && !pares[i].contains(foco));
      activo = i; manual = [];
      pares.forEach(function (p, k) {
        p.classList.toggle('activo', k === i);
        if (k === i) { probs[k].setAttribute('aria-current', 'true'); chips[k].setAttribute('aria-current', 'true'); }
        else { probs[k].removeAttribute('aria-current'); chips[k].removeAttribute('aria-current'); }
      });
      if (enOculta) (conChips() ? chips[i] : probs[i]).focus({ preventScroll: true });
    };

    /* ── un fotograma (modo fijo): dónde va la pista → problema activo y cuánto lleva de su tramo ── */
    var estado = function (rp) {
      var x = cl((top - rp.top) / rango, 0, 1) * N;
      var i = Math.min(N - 1, Math.floor(x));
      return { i: i, loc: x >= N ? 1 : x - i };
    };
    /* lo último que se veía: se anota en cada fotograma de scroll (y al arrancar) porque, al girar o redimensionar, el navegador recoloca la
       página ANTES de que llegue el evento resize y ya no se puede saber dónde se estaba */
    var ult = { zona: 'encima' };
    var anota = function (rp) {
      if (fijo) {
        /* x: cuánto de la pista se lleva recorrido. Pasado el 1 (la escena ya se va con el final de la pista) cuenta como «debajo» */
        var x = (top - rp.top) / rango;
        if (x >= 1) ult = { zona: 'debajo', comp: sec.pbAncla() };
        else if (x >= 0) { var e = estado(rp); ult = { zona: 'pista', i: e.i, loc: e.loc }; }
        else ult = { zona: 'encima' };
      } else if (rp.bottom <= sec.pbArriba() + 1) ult = { zona: 'debajo', comp: sec.pbAncla() };
      else { var re = esc.getBoundingClientRect(); ult = re.top <= window.innerHeight * 0.6 ? { zona: 'dentro', i: Math.max(0, activo), escTop: re.top } : { zona: 'encima' }; }
    };
    var dim = window.innerWidth + 'x' + window.innerHeight;
    var frame = function () {
      raf = 0;
      /* algunos navegadores recolocan la página (y avisan del scroll) antes de avisar del resize: si ya es otro tamaño, primero se atiende
         el cambio con lo que se anotó antes, y solo después se vuelve a anotar */
      var d = window.innerWidth + 'x' + window.innerHeight;
      if (d !== dim) { dim = d; recalcula(); }
      /* una sola lectura de geometría por fotograma (antes eran tres): la comparten anota y estado */
      var rp = pista.getBoundingClientRect();
      anota(rp);
      if (!fijo) return;
      var e = estado(rp), i = e.i, loc = e.loc;
      if (i !== activo) marca(i);
      /* la réplica pasa de «Hoy» a la solución a mitad de su tramo, salvo que la persona haya elegido cara */
      if (!manual[i]) { var cara = loc < 0.5 ? 'hoy' : 'sis'; if (pvs[i].classList.contains('sis') !== (cara === 'sis')) poner(pvs[i], cara); }
      /* las cinco pestañas del cuarto problema avanzan con el scroll, no con un reloj */
      if (nav && i === N - 1) {
        var n = Math.min(navTabs.length - 1, Math.floor(cl(loc / 0.5, 0, 0.999) * navTabs.length));
        if (n !== navI) {
          navI = n;
          navTabs.forEach(function (t, j) { t.classList.toggle('on', j === n); });
          navPs.forEach(function (q, j) { q.classList.toggle('on', j === n); });
          navN.textContent = n + 1; navUrl.textContent = NAV_Q[n];
        }
      }
    };
    var pide = function () { if (!raf) raf = requestAnimationFrame(frame); };

    /* ── ir a un problema: en modo fijo, scroll nativo hasta su tramo; si no, se activa (y, desde un enlace, se lleva a la vista) ── */
    var yDe = function (k, loc) { return Math.round(pista.getBoundingClientRect().top + window.pageYOffset - top + (k + loc) * (rango / N)); };
    var irA = function (k, desdeEnlace, instante) {
      var suave = instante || RM.matches ? 'auto' : 'smooth';
      if (fijo) { window.scrollTo({ top: yDe(k, PUNTO), behavior: suave }); return; }
      marca(k);
      if (desdeEnlace) window.scrollTo({ top: Math.round(esc.getBoundingClientRect().top + window.pageYOffset - padSup()), behavior: suave });
    };
    var foco = function (k) { (conChips() ? chips[k] : probs[k]).focus({ preventScroll: true }); };
    probs.forEach(function (b, k) {
      b.addEventListener('click', function () { irA(k); });
      /* el ratón sobre la lista cambia de problema como antes, salvo en modo fijo (ahí manda el scroll) y salvo que el ratón no se haya movido
         (un cambio de modo recoloca la lista bajo un puntero quieto y no debe cambiar de problema) */
      b.addEventListener('mouseenter', function () { if (!fijo && hoverOk && matchMedia('(hover:hover) and (min-width:768px)').matches) marca(k); });
    });
    document.addEventListener('mousemove', function (ev) { if (ev.movementX || ev.movementY) hoverOk = true; }, { passive: true });
    chips.forEach(function (b, k) {
      b.addEventListener('click', function () { irA(k); });
      /* teclado: ←/→ mueven el foco entre las pestañas; el resto de teclas (↓, ↑, Inicio, Fin…) son del navegador */
      b.addEventListener('keydown', function (ev) {
        var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!d || ev.altKey || ev.ctrlKey || ev.metaKey) return;
        ev.preventDefault(); chips[cl(k + d, 0, N - 1)].focus();
      });
    });

    /* ── enlaces a un problema: #p-google, #p-sitios… (o el id de su réplica, #w-google…) ── */
    var indiceDeHash = function (h) {
      var id = (h || '').replace(/^#/, '');
      for (var k = 0; k < N; k++) if (pares[k].id === id || pvs[k].id === id) return k;
      return -1;
    };
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href^="#"]');
      if (!a || ev.defaultPrevented || ev.button || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      var k = indiceDeHash(a.getAttribute('href'));
      if (k < 0) return;
      ev.preventDefault();
      /* una entrada nueva en el historial (salvo que ya se esté en ese ancla): Atrás vuelve a donde se estaba (el configurador) */
      if (location.hash !== a.getAttribute('href')) { try { history.pushState(null, '', a.getAttribute('href')); } catch (e) { /* sin historial también funciona */ } }
      irA(k, true); foco(k);
    });
    window.addEventListener('hashchange', function () { var k = indiceDeHash(location.hash); if (k >= 0) irA(k, true); });

    /* ── el configurador: marca el problema que más se parece al de la persona (sin activarlo: así no cambia el alto de lo que hay encima) ── */
    document.addEventListener('opspilot:ruta', function (ev) {
      var i = ev.detail && typeof ev.detail.problema === 'number' ? ev.detail.problema : -1;
      [probs, chips].forEach(function (grupo) {
        grupo.forEach(function (b, k) {
          b.classList.toggle('para-ti', k === i);
          var sr = $('.sr', b);
          if (k === i && !sr) { sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = ', para ti'; b.appendChild(sr); }
          else if (k !== i && sr) sr.parentNode.removeChild(sr);
        });
      });
    });

    /* ── cambia el modo o la geometría (ancho, svh, fuente o «reducir movimiento»): se conserva lo que se veía.
       · dentro de la pista: el problema (y cuánto llevaba de su tramo)
       · debajo de la sección: el elemento que había en pantalla (se compensa todo lo que cambia de alto por encima)
       · en la escena de un modo sin pista fija: la escena donde estaba
       · encima de la sección: no se mueve a nadie ── */
    var recalcula = function () {
      var antes = ult;
      if (!sec.pbDecide()) return;
      hoverOk = false;
      medir();
      if (antes.zona === 'debajo') antes.comp();
      else if (antes.zona === 'pista') {
        if (fijo) window.scrollTo({ top: yDe(antes.i, antes.loc), behavior: 'auto' });
        else { marca(antes.i); window.scrollTo({ top: Math.round(esc.getBoundingClientRect().top + window.pageYOffset - padSup()), behavior: 'auto' }); }
      } else if (antes.zona === 'dentro') {
        var k = Math.max(0, activo);
        marca(k);
        /* al fijarse, el activo lo marca el scroll: si no es el primero, se va a su tramo para no cambiar de problema */
        if (fijo && (k > 0 || antes.escTop <= top)) window.scrollTo({ top: yDe(k, PUNTO), behavior: 'auto' });
        else window.scrollTo({ top: Math.round(pista.getBoundingClientRect().top + window.pageYOffset - antes.escTop), behavior: 'auto' });
      }
      frame();
    };
    /* el evento resize se atiende en el acto (no en el siguiente fotograma): así corre antes que el fotograma de scroll que provoca el reajuste del
       navegador y lo que se anotó es lo de antes del cambio */
    window.addEventListener('resize', recalcula, { passive: true });
    RM.addEventListener('change', recalcula);
    matchMedia('(min-width: 768px)').addEventListener('change', recalcula);
    /* si cambia la fuente raíz sin que cambie la ventana (ajustes del navegador), o la svh cuando el navegador la asienta tarde, también se recalcula */
    if ('ResizeObserver' in window) {
      var remSonda = document.createElement('div');
      remSonda.setAttribute('aria-hidden', 'true');
      remSonda.style.cssText = 'position:absolute;left:0;top:0;width:1rem;height:0;visibility:hidden;pointer-events:none';
      sec.appendChild(remSonda);
      var ro = new ResizeObserver(function () { recalcula(); });
      ro.observe(remSonda);
      if (sec.pbSonda) ro.observe(sec.pbSonda);
    }
    window.addEventListener('scroll', pide, { passive: true });
    /* las animaciones infinitas de las réplicas (el latido de los choques, el temblor del diálogo, los puntos de «escribiendo») solo corren con la
       sección a la vista: fuera, el CSS las pausa con .pb-fuera. Con un IntersectionObserver, sin leer geometría en el scroll */
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { sec.classList.toggle('pb-fuera', !es[es.length - 1].isIntersecting); }, { rootMargin: '100px 0px' }).observe(sec);
    /* ── arranque ── */
    medir();
    marca(0);
    /* la primera colocación (por ejemplo, al recargar a mitad de la pista) va sin transiciones */
    sec.classList.add('pb-quieto');
    frame();
    requestAnimationFrame(function () { requestAnimationFrame(function () { sec.classList.remove('pb-quieto'); }); });
    var colocado = false;
    var coloca = function () {
      if (colocado) return;
      colocado = true;
      medir(); frame();
      /* el ancla de la URL (#p-… / #w-…) la guardó el script en línea y la quitó de la URL para que el salto nativo al fragmento no pisara este:
         aquí se salta, de golpe y ya con todo colocado, y se devuelve el ancla a la URL. Al recargar o volver con Atrás, el navegador restaura el
         scroll y no se toca. */
      var id = sec.pbHash;
      if (!id) return;
      sec.pbHash = null;
      try { history.replaceState(history.state, '', urlConHash(id)); } catch (e) { /* sin historial también funciona */ }
      var n = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
      var k = indiceDeHash(id);
      if (k >= 0 && (!n || (n.type !== 'reload' && n.type !== 'back_forward'))) irA(k, true, true);
    };
    if (document.readyState === 'complete') coloca();
    else { window.addEventListener('load', coloca); setTimeout(coloca, 1200); }
    sec.pbListo = true;
  } catch (err) {
    if (raf) cancelAnimationFrame(raf);
    sec.classList.remove('pb-quieto');
    if (sec.pbRetira) sec.pbRetira(); else sec.classList.add('sin-pin');
  }
})();
