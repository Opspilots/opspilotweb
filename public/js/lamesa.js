/* La mesa (cabecera de la home): la mesa llega revuelta, se recoge UNA vez cuando se ve, y se puede mover con el
   mando (input range) o arrastrando el dibujo. Sin librerías.
   Rendimiento: un solo requestAnimationFrame mientras dura la animación (~3,4 s); al acabar no queda nada
   corriendo. Solo se anima la composición que se ve (la otra está en display:none). Sin JS o con «reducir
   movimiento» no se mueve nada solo: la mesa ya viene recogida (ver public/css/lamesa.css).
   Si este script falla (no carga o lanza una excepción al arrancar), la mesa se queda recogida: clase «sin-script». */
(function () {
  var s = document.querySelector('[data-lm]');
  if (!s) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)');
  var ANCHO = matchMedia('(min-width: 1000px)');
  var ESPERA = 1100, DURA = 3400, UMBRAL = 8;
  var INI = { portatil: 0.34, taza: 0.42, pvs: 0.42 };  /* cuándo empieza cada objeto (0-1); el resto, por orden. ini + dur <= 1 */
  var CAMBIA = { cerco: 1, carp: 1, movil: 1 };        /* tienen cara «lío» (--fo) que se apaga */
  var t = RM.matches ? 1 : 0, raf = 0, espera = 0, empezada = false, visible = false, escenas = {};

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
              s: el.classList.contains('s'), ini: id in INI ? INI[id] : i * 0.022, dur: id === 'portatil' ? 0.5 : 0.56 };
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
        o.el.style.transform = 'translate(' + (o.a[0] + (o.b[0] - o.a[0]) * u).toFixed(1) + 'px,' + (o.a[1] + (o.b[1] - o.a[1]) * u).toFixed(1) + 'px) rotate(' +
          (o.a[2] + (o.b[2] - o.a[2]) * u).toFixed(2) + 'deg) scale(' + ((o.a[3] + (o.b[3] - o.a[3]) * u) * lev).toFixed(3) + ')';
        if (o.cambia) {
          o.el.style.setProperty('--fo', (1 - sm((u - 0.25) / 0.5)).toFixed(3));
          o.el.style.setProperty('--fi', sm((u - 0.55) / 0.4).toFixed(3));
        }
        if (o.s) o.el.style.opacity = (1 - sm((u - 0.72) / 0.26)).toFixed(3);
      });
      if (e.bis) { var ab = sm((t - 0.62) / 0.26); e.bis.style.transform = 'translate(0,' + (410 * (1 - ab)).toFixed(1) + 'px) scale(1,' + Math.max(0.02, ab).toFixed(3) + ')'; }
      if (e.lim) e.lim.style.opacity = sm((t - 0.78) / 0.2).toFixed(3);
    };

    var describe = function () {
      r.setAttribute('aria-valuetext', t < 0.08 ? 'Mesa revuelta' : t > 0.92 ? 'Mesa recogida' : 'Mesa recogida al ' + Math.round(t * 100) + ' %');
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
        else { raf = 0; describe(); }
      })(ant);
    };
    /* lo primero que haga la persona con el mando o arrastrando manda: se cancela la recogida automática */
    var manda = function () { empezada = true; para(); };

    /* ── arranque: revuelta (el CSS ya la ha pintado) o recogida, y el mando aparece ── */
    pinta(t); describe();
    s.classList.add('lista');

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
    RM.addEventListener('change', function () { if (RM.matches) { manda(); pinta(1); describe(); } });
  } catch (err) {
    /* algo falló al arrancar: se para todo, se quitan los estilos que haya puesto el script y la mesa queda recogida */
    if (raf) cancelAnimationFrame(raf);
    if (espera) clearTimeout(espera);
    s.classList.remove('lio', 'lista', 'en-vista');
    s.classList.add('sin-script');
    [].forEach.call(s.querySelectorAll('[data-o],[data-bisagra],[data-lim]'), function (el) {
      el.style.removeProperty('transform'); el.style.removeProperty('opacity'); el.style.removeProperty('--fo'); el.style.removeProperty('--fi');
    });
  }
})();
