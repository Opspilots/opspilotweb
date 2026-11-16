/* Réplicas de pantalla de los casos reales: cada una responde al tocarla. Las demos arrancan solas al verlas y se paran
   para siempre en cuanto el visitante toca algo. Con movimiento reducido no hay demos. Recuperado de f6cb705: ObraFácil y J.R. Rodríguez. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var espera = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };
  /* es-ES no agrupa los miles con 4 cifras (1790,42): se formatea a mano, como en una factura */
  var num2 = function (n, d) { var s = Math.abs(n).toFixed(d).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return (n < 0 ? '−' : '') + s.join(','); };
  var eur = function (n) { return num2(n, n % 1 ? 2 : 0) + ' €'; };

  /* ─── Demo: corre mientras se ve y se para para siempre al tocar ─── */
  function demo(raiz, pasos) {
    if (quieto || !raiz || !('IntersectionObserver' in window)) return;
    var parada = false, viva = false, visible = false;
    var parar = function () { parada = true; var c = $('.cursor', raiz); if (c) c.classList.remove('on'); };
    ['pointerdown', 'keydown', 'wheel'].forEach(function (ev) { raiz.addEventListener(ev, function (e) { if (e.isTrusted) parar(); }, { passive: true }); });
    var ctx = { vivo: function () { return !parada && visible; } };
    var bucle = async function () {
      if (viva) return; viva = true;
      while (!parada && visible) { try { await pasos(ctx); } catch (e) { break; } await espera(1200); }
      viva = false;
    };
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting && raiz.offsetParent !== null;
      if (visible && !parada) espera(900).then(bucle);
    }, { threshold: .55 }).observe(raiz);
  }
  function cursorA(ventana, el) {
    var c = $('.cursor', ventana); if (!c || !el) return Promise.resolve();
    var v = ventana.getBoundingClientRect(), r = el.getBoundingClientRect();
    c.classList.add('on');
    c.style.transform = 'translate(' + (r.left - v.left + r.width * .55) + 'px,' + (r.top - v.top + r.height * .55) + 'px)';
    return espera(750).then(function () { c.classList.remove('clic'); void c.offsetWidth; c.classList.add('clic'); return espera(260); });
  }
  async function teclear(input, texto, ctx) {
    input.value = '';
    for (var i = 0; i < texto.length; i++) {
      if (ctx && !ctx.vivo()) return;
      input.value += texto[i]; input.dispatchEvent(new Event('input', { bubbles: true })); await espera(110);
    }
  }

  /* ─── ObraFácil: su calculadora (MISMA lógica que calcPlates: columnas × filas con la placa
         real de 122 × 260 cm), su precio publicado (70 €/ud IVA incl.), su carrito y su mensaje de WhatsApp ─── */
  var of = $('[data-of]');
  if (of) (function () {
    var PW = 1.22, PH = 2.60, PRECIO = 70, EPS = 1e-9, NS = 'http://www.w3.org/2000/svg';
    var inA = $('[data-ancho]', of), inH = $('[data-alto]', of), svg = $('[data-croquis]', of);
    var outN = $('[data-piezas]', of), outD = $('[data-detalle]', of), outT = $('[data-total]', of);
    var anadir = $('[data-anadir]', of), anadirT = $('[data-anadir-t]', of), wa = $('[data-of-wa]', of);
    var carro = $('[data-carro]', of), carroN = $('[data-carro-n]', of), toast = $('[data-toast]', of);
    /* Topes: las medidas, las que su propio HTML declara (max del input); el carrito, lo que tiene sentido
       en una demo. Más allá, el pedido se prepara por WhatsApp. */
    var MAXW = +inA.max || 30, MAXH = +inH.max || 10, MAX_CARRO = 200;
    var n = 0, enCarro = 0, tt;
    var num = function (el) { return parseFloat(String(el.value).replace(',', '.')) || 0; };
    var el = function (tag, at) { var x = document.createElementNS(NS, tag); for (var k in at) x.setAttribute(k, at[k]); return x; };
    var dec = function (v) { return String(Math.round(v * 100) / 100).replace('.', ','); };
    function pintar() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var w = num(inA), h = num(inH);
      if (w <= 0 || h <= 0) { n = 0; outN.textContent = '—'; outD.textContent = 'Pon el ancho y el alto'; outT.textContent = '—'; anadir.disabled = true; return; }
      if (w > MAXW || h > MAXH) {
        n = 0; outN.textContent = '—'; outD.textContent = 'Hasta ' + MAXW + ' m de ancho y ' + MAXH + ' m de alto. Para más, te lo calculamos por WhatsApp.'; outT.textContent = '—'; anadir.disabled = true;
        wa.href = 'https://wa.me/?text=' + encodeURIComponent('Hola, quiero presupuesto de Calacatta Oro para una pared de ' + dec(w) + ' × ' + dec(h) + ' m.');
        return;
      }
      var cols = Math.ceil(w / PW - EPS), rows = Math.ceil(h / PH - EPS); n = cols * rows;
      var corte = Math.abs(cols * PW - w) > .005 || Math.abs(rows * PH - h) > .005;
      outN.textContent = n + (n === 1 ? ' placa' : ' placas');
      outD.textContent = cols + ' a lo ancho × ' + rows + ' a lo alto · ' + (corte ? 'recortes incluidos' : 'sin recortes');
      outT.textContent = eur(n * PRECIO); anadir.disabled = false;
      anadirT.textContent = 'Añadir ' + n + ' al carrito';
      wa.href = 'https://wa.me/?text=' + encodeURIComponent('Hola, quiero presupuesto: ' + n + ' ud de Calacatta Oro para ' + dec(w * h) + ' m² (aprox. ' + eur(n * PRECIO) + ').');
      if (n > 400) return;
      var s = Math.min(196 / w, 142 / h), W = w * s, H = h * s, ox = (204 - W) / 2, oy = (150 - H) / 2;
      var defs = el('defs', {}), pat = el('pattern', { id: 'marmol', patternUnits: 'userSpaceOnUse', width: PW * s, height: PH * s, x: ox, y: oy + H - PH * s });
      pat.appendChild(el('image', { href: '/img/calacatta-tex.webp', width: PW * s, height: PH * s, preserveAspectRatio: 'none' }));
      var ray = el('pattern', { id: 'raya', width: 4, height: 4, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
      ray.appendChild(el('line', { x1: 0, y1: 0, x2: 0, y2: 4, stroke: '#F5D800', 'stroke-width': 2.2 }));
      defs.appendChild(pat); defs.appendChild(ray); svg.appendChild(defs);
      svg.appendChild(el('rect', { x: ox, y: oy, width: W, height: H, fill: '#E7E5E0' }));
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var pw = Math.min(PW, w - c * PW), ph = Math.min(PH, h - r * PH), x = ox + c * PW * s, y = oy + H - (r * PH + ph) * s;
        svg.appendChild(el('rect', { x: x, y: y, width: pw * s, height: ph * s, fill: 'url(#marmol)', stroke: '#0d0d0d', 'stroke-width': .7 }));
        if (pw < PW - EPS || ph < PH - EPS) svg.appendChild(el('rect', { x: x, y: y, width: pw * s, height: ph * s, fill: 'url(#raya)', opacity: .32 }));
      }
      svg.appendChild(el('rect', { x: ox, y: oy, width: W, height: H, fill: 'none', stroke: '#0d0d0d', 'stroke-width': 1.6 }));
      svg.setAttribute('aria-label', 'Croquis: ' + cols + ' placas a lo ancho y ' + rows + ' a lo alto; las rayadas van cortadas');
    }
    function aviso(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('on'); }, 2200); }
    anadir.addEventListener('click', function () {
      if (!n) return;
      if (enCarro + n > MAX_CARRO) { aviso('Más de ' + MAX_CARRO + ' placas: te preparamos el pedido por WhatsApp'); return; }
      enCarro += n; carroN.textContent = enCarro;
      carro.classList.remove('bump'); void carro.offsetWidth; carro.classList.add('bump');
      aviso('Añadido: ' + n + ' × Calacatta Oro · ' + eur(n * PRECIO));
    });
    inA.addEventListener('input', pintar); inH.addEventListener('input', pintar);
    pintar();
    demo(of, async function (ctx) {
      await cursorA(of, inA); if (!ctx.vivo()) return;
      await teclear(inA, ['4.80', '6.10', '3.40'][Math.floor(Math.random() * 3)], ctx); await espera(500);
      await cursorA(of, inH); if (!ctx.vivo()) return;
      await teclear(inH, '2.50', ctx); await espera(700);
      await cursorA(of, anadir); if (!ctx.vivo()) return;
      anadir.click(); await espera(2600);
    });
  })();

  /* ─── J.R.: cada búsqueda aterriza en su página (títulos, descripciones y H1 reales, leídos el 25-sep) ─── */
  var jr = $('[data-jr]');
  if (jr) (function () {
    var RUT = [
      { q: 'reformas de baños en córdoba', u: 'reformas-banos-cordoba', m: 'Reformas de baños', t: 'Reformas de Baños en Córdoba: Precio y Cambio de Bañera | J.R. Rodríguez', d: 'Especialistas en reformas de baños en Córdoba. Cambia tu bañera por plato de ducha, renovamos fontanería y alicatados.', h: 'Reformas Baños Córdoba: Cambiamos tu bañera, renovamos fontanería y alicatados' },
      { q: 'reformas de cocinas en córdoba', u: 'reformas-cocinas-cordoba', m: 'Reformas de cocinas', t: 'Reformas Cocinas Córdoba: Precios y Diseño 3D | J.R. Rodríguez', d: 'Especialistas en reformas cocinas Córdoba. Renovación de instalaciones, mobiliario a medida y diseño 3D. Solicita tu presupuesto.', h: 'Reformas Cocinas Córdoba: Diseño 3D a Medida y Obra Integral' },
      { q: 'reforma integral piso córdoba', u: 'reformas-integrales-cordoba', m: 'Reformas integrales', t: 'Reformas Integrales en Córdoba: Pisos y Casas «Llave en Mano» | J.R. Rodríguez', d: 'Empresa experta en reformas integrales de viviendas en Córdoba. Gestionamos albañilería, instalaciones y diseño. Cumplimiento de plazos y presupuesto sin sorpresas.', h: 'Reformas integrales de viviendas en Córdoba: Diseño, Ejecución y Garantía.' },
      { q: 'reforma local comercial córdoba', u: 'reformas-locales-comerciales-cordoba', m: 'Locales comerciales', t: 'Reformas de Locales Comerciales en Córdoba - rodriguezreformas.es', d: 'Reformamos tu local comercial en Córdoba llave en mano. Bares, restaurantes, tiendas, clínicas y oficinas. Presupuesto sin compromiso.', h: 'Reformas de Locales Comerciales en Córdoba' }
    ];
    var bs = $$('.jr-mapa button', jr), q = $('[data-jr-q]', jr), res = $('[data-jr-res]', jr), hero = $('.jr-hero', jr), actual = 0;
    async function ir(i, ctx) {
      actual = i; var r = RUT[i];
      bs.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      res.classList.add('cambia'); hero.classList.add('cambia');
      if (quieto) q.textContent = r.q;
      else { q.textContent = ''; for (var c = 0; c < r.q.length; c++) { if (actual !== i) return; q.textContent += r.q[c]; await espera(38); } }
      $('[data-jr-url]', jr).textContent = r.u; $('[data-jr-t]', jr).textContent = r.t; $('[data-jr-d]', jr).textContent = r.d;
      $('[data-jr-barra]', jr).textContent = 'rodriguezreformas.es/' + r.u + '/';
      res.classList.remove('cambia'); await espera(quieto ? 0 : 350);
      $('[data-jr-h1]', jr).textContent = r.h; $('[data-jr-miga]', jr).textContent = r.m; hero.classList.remove('cambia');
    }
    bs.forEach(function (b, i) { b.addEventListener('click', function () { ir(i); }); });
    $('[data-jr-barra]', jr).textContent = 'rodriguezreformas.es/' + RUT[0].u + '/';
    demo(jr, async function (ctx) { await espera(1800); if (!ctx.vivo()) return; await ir((actual + 1) % RUT.length, ctx); await espera(2400); });
  })();

})();
