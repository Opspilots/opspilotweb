/* Recorridos (casos y tramos): cada sección [data-recorrido] pasa con una transición suave al color del tramo
   que está en el centro de la pantalla, y la web del cliente se desplaza dentro de su ventana con el scroll.
   Solo se anima el color del contenedor (una vez por tramo) y transform en las imágenes. Con movimiento
   reducido no se desplaza nada; sin JS, cada tramo lleva su propio color. Vale para varios en la misma página. */
(function () {
  if (window.__recorrido || !('IntersectionObserver' in window)) return;
  window.__recorrido = true;
  var reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vistas = [];
  Array.prototype.forEach.call(document.querySelectorAll('[data-recorrido]'), function (r) {
    var casos = Array.prototype.slice.call(r.querySelectorAll('[data-rc]'));
    r.classList.add('rc-vivo');
    var limpiar = function () { ['--rc-bg', '--rc-fg', '--rc-ac'].forEach(function (v) { r.style.removeProperty(v); }); casos.forEach(function (x) { x.classList.remove('activo'); }); };
    var poner = function (c) {
      var cs = getComputedStyle(c);
      r.style.setProperty('--rc-bg', cs.getPropertyValue('--bg').trim());
      r.style.setProperty('--rc-fg', cs.getPropertyValue('--fg').trim());
      r.style.setProperty('--rc-ac', cs.getPropertyValue('--ac').trim());
      casos.forEach(function (x) { x.classList.toggle('activo', x === c); });
    };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) poner(e.target); }); }, { rootMargin: '-45% 0px -45% 0px' });
    casos.forEach(function (c) { io.observe(c); });
    var cab = r.querySelector('.recorrido-cab');
    if (cab) new IntersectionObserver(function (es) { if (es[0].isIntersecting) limpiar(); }, { rootMargin: '-45% 0px -45% 0px' }).observe(cab);
    casos.forEach(function (c) {
      var v = c.querySelector('.rc-vista'), img = v && v.querySelector('img');
      if (img) vistas.push({ v: v, img: img });
    });
  });
  if (reducido || !vistas.length) return;
  var pend = false;
  function cuadro() {
    pend = false;
    var vh = innerHeight;
    vistas.forEach(function (o) {
      var b = o.v.getBoundingClientRect();
      if (b.bottom < -50 || b.top > vh + 50) return;
      /* la web se queda en su portada hasta que la ventana está bien dentro de la pantalla (su arriba al 45 %);
         a partir de ahí baja, y termina cuando la ventana sale por arriba */
      var p = Math.min(1, Math.max(0, (vh * .45 - b.top) / (vh * .45 + b.height * .6)));
      var sobra = o.img.offsetHeight - o.v.clientHeight;
      if (sobra > 0) o.img.style.transform = 'translate3d(0,' + (-p * sobra).toFixed(1) + 'px,0)';
    });
  }
  addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(cuadro); } }, { passive: true });
  cuadro();
})();
