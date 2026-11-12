/* La mesa (cabecera de la home): la mesa llega revuelta y se recoge sola UNA vez cuando se ve, con un gesto final. No hay mando ni
   arrastre: lo único que cambia la animación es la propia página (verse, ocultarse la pestaña, pedir menos movimiento). Sin librerías.
   Rendimiento: un solo requestAnimationFrame mientras dura la animación (~3,4 s); al acabar no queda nada
   corriendo. En cada fotograma solo se escribe lo que ha cambiado (un objeto que aún no ha salido, o que ya llegó, no se toca): cada escritura
   en un objeto del SVG cuesta un layout. Solo se anima la composición que se ve (la otra está en display:none). Sin JS o con «reducir
   movimiento» no se mueve nada solo: la mesa ya viene recogida (lo decide el CSS de la cabecera).
   Si este script falla (no carga o lanza una excepción al arrancar), la mesa se queda recogida: clase «sin-script». */
(function () {
  var s = document.querySelector('[data-lm]');
  if (!s) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)');
  var ANCHO = matchMedia('(min-width: 1000px)');
  var ESPERA = 1100, DURA = 3400;
  var INI = { portatil: 0.06, taza: 0.12, pvs: 0.12, movil: 0.2, carpl: 0.76, llavl: 0.78, pvsl: 0.8, tazal: 0.82 };  /* cuándo empieza cada objeto (0-1); el resto, por orden. ini + dur <= 1.
     El portátil entra pronto, desde fuera de la mesa y siempre opaco: hacia la mitad del recorrido, cuando los papeles ya se han guardado, el centro no queda vacío. */
  var DUR = { portatil: 0.44, carpl: 0.18, llavl: 0.18, pvsl: 0.18, tazal: 0.18 };   /* cuánto dura cada uno (el resto, 0,56) */
  var CAMBIA = { cerco: 1, carp: 1, movil: 1 };        /* tienen cara «lío» (--fo) que se apaga */
  var t = RM.matches ? 1 : 0, raf = 0, espera = 0, empezada = false, visible = false, escenas = {};
  var premiada = false;   /* el gesto final se hace una vez */

  try {
    var esc = s.querySelector('[data-escena]');
    if (!esc) throw new Error('lamesa: falta el marcado');

    var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
    var sm = function (x) { x = cl(x); return x * x * (3 - 2 * x); };
    var nums = function (v) { return v.match(/-?\d*\.?\d+/g).map(Number); };

    /* la composición visible: lista de objetos con su posición de lío (a) y de orden (b) */
    var escena = function () {
      var k = ANCHO.matches ? 'ancho' : 'alto';
      if (!escenas[k]) {
        var svg = s.querySelector(k === 'ancho' ? '.lm-ancho' : '.lm-alto');
        escenas[k] = {
          obs: [].slice.call(svg.querySelectorAll('[data-o]')).map(function (el, i) {
            var id = el.getAttribute('data-o');
            return { el: el, id: id, a: nums(el.getAttribute('data-a')), b: nums(el.getAttribute('transform')), cambia: !!CAMBIA[id],
              s: el.classList.contains('s'), ini: id in INI ? INI[id] : i * 0.022, dur: id in DUR ? DUR[id] : 0.56 };
          }),
          bis: svg.querySelector('[data-bisagra]'),
          lim: svg.querySelector('[data-lim]')
        };
      }
      return escenas[k];
    };

    var pinta = function (v) {
      t = cl(v);
      s.classList.toggle('lio', t < 0.08 && !RM.matches);
      var e = escena();
      e.obs.forEach(function (o) {
        var u = sm((t - o.ini) / o.dur), lev = 1 + 0.07 * Math.sin(Math.PI * u);
        /* los que se guardan se encogen hasta desaparecer (nada se vuelve transparente sobre otro objeto) */
        if (o.s) lev *= 1 - sm((u - 0.72) / 0.26);
        var tr = 'translate(' + (o.a[0] + (o.b[0] - o.a[0]) * u).toFixed(1) + 'px,' + (o.a[1] + (o.b[1] - o.a[1]) * u).toFixed(1) + 'px) rotate(' +
          (o.a[2] + (o.b[2] - o.a[2]) * u).toFixed(2) + 'deg) scale(' + ((o.a[3] + (o.b[3] - o.a[3]) * u) * lev).toFixed(3) + ')';
        if (tr !== o.tr) { o.tr = tr; o.el.style.transform = tr; }
        if (o.cambia) {
          /* el cambio de cara es corto (0,25 de recorrido, casi sin solaparse): un móvil medio transparente sobre la mesa se ve peor que un salto breve */
          var fo = (1 - sm((u - 0.3) / 0.25)).toFixed(3), fi = sm((u - 0.5) / 0.25).toFixed(3);
          if (fo !== o.fo) { o.fo = fo; o.el.style.setProperty('--fo', fo); }
          if (fi !== o.fi) { o.fi = fi; o.el.style.setProperty('--fi', fi); }
        }
      });
      if (e.bis) { var ab = sm((t - 0.16) / 0.34), bt = 'translate(0,' + (410 * (1 - ab)).toFixed(1) + 'px) scale(1,' + Math.max(0.02, ab).toFixed(3) + ')'; if (bt !== e.bt) { e.bt = bt; e.bis.style.transform = bt; } }
      if (e.lim) { var lo = sm((t - 0.5) / 0.28).toFixed(3); if (lo !== e.lo) { e.lo = lo; e.lim.style.opacity = lo; } }
      /* al llegar por primera vez al final: un gesto breve (la marca rebota; el CSS lo anima solo con movimiento permitido) */
      if (t > 0.999 && !premiada && !RM.matches) { premiada = true; s.classList.add('premio'); }
    };

    var para = function () {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (espera) { clearTimeout(espera); espera = 0; }
    };
    /* el tiempo se acumula fotograma a fotograma (con tope de 250 ms: 64 alargaba la recogida en dispositivos lentos): si la pestaña se queda en segundo plano y vuelve, sigue por
       donde iba en vez de saltar al final */
    var recoge = function () {
      var acum = 0, ant = performance.now();
      (function paso(n) {
        acum += Math.min(n - ant, 250); ant = n;
        var x = acum / DURA;
        pinta(sm(x));
        if (x < 1) raf = requestAnimationFrame(paso);
        else raf = 0;
      })(ant);
    };
    /* ── arranque: revuelta (el CSS ya la ha pintado) o recogida ── */
    pinta(t);

    /* ── la recoge cuando la mesa está a la vista y la pestaña también ── */
    var puede = function () { return visible && document.visibilityState === 'visible' && !RM.matches; };
    var arranca = function () {
      if (empezada || !puede()) return;
      empezada = true;
      espera = setTimeout(function () {
        espera = 0;
        if (puede()) recoge();
        else empezada = false;   /* se fue la vista o la pestaña durante la espera: se reintenta al volver */
      }, ESPERA);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[es.length - 1].isIntersecting;
        s.classList.toggle('en-vista', visible);
        arranca();
      }, { threshold: 0.3 }).observe(esc);
    } else { visible = true; s.classList.add('en-vista'); arranca(); }
    document.addEventListener('visibilitychange', arranca);

    /* ── cambios en caliente ── */
    ANCHO.addEventListener('change', function () { pinta(t); });
    RM.addEventListener('change', function () {
      if (RM.matches) { para(); pinta(1); }
      /* se quita «reducir movimiento» con la mesa ya recogida: el CSS vuelve a esconder el sello hasta que lleve .premio */
      else if (t > 0.999 && !premiada) { premiada = true; s.classList.add('premio'); }
    });
  } catch (err) {
    /* algo falló al arrancar: se para todo, se quitan los estilos que haya puesto el script y la mesa queda recogida */
    if (raf) cancelAnimationFrame(raf);
    if (espera) clearTimeout(espera);
    s.classList.remove('lio', 'en-vista', 'premio');
    s.classList.add('sin-script');
    [].forEach.call(s.querySelectorAll('[data-o],[data-bisagra],[data-lim]'), function (el) {
      el.style.removeProperty('transform'); el.style.removeProperty('opacity'); el.style.removeProperty('--fo'); el.style.removeProperty('--fi');
    });
  }
})();
