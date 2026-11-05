/* La mesa (cabecera de la home): la mesa llega revuelta, se recoge UNA vez cuando se ve, y se puede mover con el
   mando (input range) o arrastrando el dibujo. Sin librerías.
   Rendimiento: un solo requestAnimationFrame mientras dura la animación (~3,4 s); al acabar no queda nada
   corriendo. Solo se anima la composición que se ve (la otra está en display:none). Sin JS o con «reducir
   movimiento» no se mueve nada solo: la mesa ya viene recogida (lo decide el CSS de la cabecera).
   Si este script falla (no carga o lanza una excepción al arrancar), la mesa se queda recogida: clase «sin-script». */
(function () {
  var s = document.querySelector('[data-lm]');
  if (!s) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)');
  var ANCHO = matchMedia('(min-width: 1000px)');
  var ESPERA = 1100, DURA = 3400, UMBRAL = 8;
  var INI = { portatil: 0.06, taza: 0.12, pvs: 0.12, movil: 0.2, carpl: 0.76, llavl: 0.78, pvsl: 0.8, tazal: 0.82 };  /* cuándo empieza cada objeto (0-1); el resto, por orden. ini + dur <= 1.
     El portátil entra pronto, desde fuera de la mesa y siempre opaco: hacia la mitad del recorrido, cuando los papeles ya se han guardado, el centro no queda vacío. */
  var DUR = { portatil: 0.44, carpl: 0.18, llavl: 0.18, pvsl: 0.18, tazal: 0.18 };   /* cuánto dura cada uno (el resto, 0,56) */
  var CAMBIA = { cerco: 1, carp: 1, movil: 1 };        /* tienen cara «lío» (--fo) que se apaga */
  var t = RM.matches ? 1 : 0, raf = 0, espera = 0, empezada = false, visible = false, escenas = {};
  var premiada = false, usado = false, pistaT = 0;   /* el gesto final se hace una vez; la pista se va al primer uso */

  try {
    var esc = s.querySelector('[data-escena]');
    var r = s.querySelector('input[type=range]');
    if (!esc || !r) throw new Error('lamesa: falta el marcado');

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
      r.value = Math.round(t * 100);
      s.classList.toggle('lio', t < 0.08 && !RM.matches);
      var e = escena();
      e.obs.forEach(function (o) {
        var u = sm((t - o.ini) / o.dur), lev = 1 + 0.07 * Math.sin(Math.PI * u);
        /* los que se guardan se encogen hasta desaparecer (nada se vuelve transparente sobre otro objeto) */
        if (o.s) lev *= 1 - sm((u - 0.72) / 0.26);
        o.el.style.transform = 'translate(' + (o.a[0] + (o.b[0] - o.a[0]) * u).toFixed(1) + 'px,' + (o.a[1] + (o.b[1] - o.a[1]) * u).toFixed(1) + 'px) rotate(' +
          (o.a[2] + (o.b[2] - o.a[2]) * u).toFixed(2) + 'deg) scale(' + ((o.a[3] + (o.b[3] - o.a[3]) * u) * lev).toFixed(3) + ')';
        if (o.cambia) {
          /* el cambio de cara es corto (0,25 de recorrido, casi sin solaparse): un móvil medio transparente sobre la mesa se ve peor que un salto breve */
          o.el.style.setProperty('--fo', (1 - sm((u - 0.3) / 0.25)).toFixed(3));
          o.el.style.setProperty('--fi', sm((u - 0.5) / 0.25).toFixed(3));
        }
      });
      if (e.bis) { var ab = sm((t - 0.16) / 0.34); e.bis.style.transform = 'translate(0,' + (410 * (1 - ab)).toFixed(1) + 'px) scale(1,' + Math.max(0.02, ab).toFixed(3) + ')'; }
      if (e.lim) e.lim.style.opacity = sm((t - 0.5) / 0.28).toFixed(3);
      /* al llegar por primera vez al final: un gesto breve (la marca rebota; el CSS lo anima solo con movimiento permitido) */
      if (t > 0.999 && !premiada && !RM.matches) { premiada = true; s.classList.add('premio'); }
    };

    var describe = function () {
      /* mismas palabras que las etiquetas visibles del mando (Lío / Orden) */
      r.setAttribute('aria-valuetext', t < 0.08 ? 'Lío' : t > 0.92 ? 'Orden' : 'Poniendo orden, al ' + Math.round(t * 100) + ' %');
    };
    var para = function () {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (espera) { clearTimeout(espera); espera = 0; }
    };
    /* el tiempo se acumula fotograma a fotograma (con tope): si la pestaña se queda en segundo plano y vuelve, sigue por
       donde iba en vez de saltar al final */
    var recoge = function () {
      var acum = 0, ant = performance.now();
      (function paso(n) {
        acum += Math.min(n - ant, 64); ant = n;
        var x = acum / DURA;
        pinta(sm(x));
        if (x < 1) raf = requestAnimationFrame(paso);
        else { raf = 0; describe(); pideProbar(900); }
      })(ant);
    };
    /* lo primero que haga la persona con el mando o arrastrando manda: se cancela la recogida automática */
    var manda = function () { empezada = true; para(); apagaPista(); };

    /* la pista «Prueba a moverlo»: sale cuando la mesa ya está recogida y se va al primer uso (o a los 9 s). Sin animación. */
    var pista = s.querySelector('.lm-pista');
    var apagaPista = function () {
      usado = true;
      if (pistaT) { clearTimeout(pistaT); pistaT = 0; }
      if (pista) pista.classList.remove('ver');
    };
    var pideProbar = function (ms) {
      if (usado || !pista) return;
      pistaT = setTimeout(function () {
        pista.classList.add('ver');
        pistaT = setTimeout(apagaPista, 9000);
      }, ms);
    };

    /* ── arranque: revuelta (el CSS ya la ha pintado) o recogida, y el mando aparece ── */
    pinta(t); describe();
    s.classList.add('lista');
    if (RM.matches) pideProbar(1500);   /* con «reducir movimiento» no hay recogida: la pista sale sola */

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

    /* ── el mando ── */
    r.addEventListener('input', function () { manda(); pinta(r.value / 100); describe(); });
    r.addEventListener('keydown', function (ev) {
      var d = ev.key === 'ArrowRight' || ev.key === 'ArrowUp' ? 5 : ev.key === 'ArrowLeft' || ev.key === 'ArrowDown' ? -5 : 0;
      if (!d) return;
      ev.preventDefault(); manda(); pinta(t + d / 100); describe();
    });

    /* ── arrastrar el dibujo. El scroll vertical es del navegador (touch-action: pan-y). Un toque o un clic no cuentan:
       solo es arrastre al pasar de 8 px en horizontal (y más en horizontal que en vertical). Hasta entonces no se toca
       la recogida automática. ── */
    var ori = null;
    var suelta = function () { ori = null; esc.classList.remove('arrastra'); };
    esc.addEventListener('pointerdown', function (ev) {
      if ((ev.pointerType === 'mouse' && ev.button !== 0) || ev.target.closest('.lm-mando')) return;
      ori = { x: ev.clientX, y: ev.clientY, t: 0, w: 0, id: ev.pointerId, activo: false };
    });
    esc.addEventListener('pointermove', function (ev) {
      if (!ori || ev.pointerId !== ori.id) return;
      /* se soltó el botón fuera del dibujo (sin captura no llega el pointerup): el arrastre se da por terminado */
      if (ev.pointerType === 'mouse' && !ev.buttons) { suelta(); return; }
      if (!ori.activo) {
        var dx = Math.abs(ev.clientX - ori.x), dy = Math.abs(ev.clientY - ori.y);
        if (dx <= UMBRAL || dx <= dy) return;
        manda();
        ori.activo = true; ori.x = ev.clientX; ori.t = t; ori.w = Math.min(esc.getBoundingClientRect().width, 1000);
        try { esc.setPointerCapture(ev.pointerId); } catch (_) { /* sin captura también funciona */ }
        esc.classList.add('arrastra');
      }
      pinta(ori.t + (ev.clientX - ori.x) / (ori.w * 0.7)); describe();
    });
    esc.addEventListener('pointerup', suelta);
    esc.addEventListener('pointercancel', suelta);

    /* ── cambios en caliente ── */
    ANCHO.addEventListener('change', function () { pinta(t); });
    RM.addEventListener('change', function () {
      if (RM.matches) { manda(); pinta(1); describe(); }
      /* se quita «reducir movimiento» con la mesa ya recogida: el CSS vuelve a esconder el sello hasta que lleve .premio */
      else if (t > 0.999 && !premiada) { premiada = true; s.classList.add('premio'); }
    });
  } catch (err) {
    /* algo falló al arrancar: se para todo, se quitan los estilos que haya puesto el script y la mesa queda recogida */
    if (raf) cancelAnimationFrame(raf);
    if (espera) clearTimeout(espera);
    if (pistaT) clearTimeout(pistaT);
    s.classList.remove('lio', 'lista', 'en-vista', 'premio');
    s.classList.add('sin-script');
    [].forEach.call(s.querySelectorAll('[data-o],[data-bisagra],[data-lim]'), function (el) {
      el.style.removeProperty('transform'); el.style.removeProperty('opacity'); el.style.removeProperty('--fo'); el.style.removeProperty('--fi');
    });
  }
})();
