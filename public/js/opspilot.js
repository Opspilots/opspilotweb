/* OpsPilot v3 · las pantallas que explican.
   Sin JS todo se lee; con JS cada pantalla responde. Las demos arrancan solas al
   verlas y se paran para siempre en cuanto el visitante toca algo. Con movimiento
   reducido no hay demos: todo queda quieto y usable. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var espera = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };
  /* es-ES no agrupa los miles con 4 cifras (1790,42): se formatea a mano, como en una factura */
  var num2 = function (n, d) { var s = Math.abs(n).toFixed(d).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return (n < 0 ? '−' : '') + s.join(','); };
  var eur = function (n) { return num2(n, n % 1 ? 2 : 0) + ' €'; };
  var hora = function () { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };
  var ico = function (id) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; };
  /* lo que el configurador decide, las secciones de abajo lo aplican cuando existan */
  var pagina = { problema: null, caso: null, ruta: null };
  /* deslizar con el dedo entre pantallas (móvil) */
  function deslizar(el, fn) {
    var x0 = null, y0 = null;
    el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) fn(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

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

  /* ═══ 1 · CONFIGURADOR: el embudo real de su portada (src/data/leadFunnel.ts) ═══ */
  var P2 = {
    web: { q: '¿A qué se dedica tu negocio?', o: [['reformas', 'Reformas/obra', 'hammer'], ['servicios', 'Servicios profesionales', 'badge-check'], ['comercio', 'Comercio/tienda', 'shopping-cart'], ['otro', 'Otro', 'layout-grid']] },
    sistema: { q: '¿Qué quieres centralizar primero?', o: [['clientes', 'Clientes y presupuestos', 'users'], ['citas', 'Citas y agenda', 'calendar-check'], ['facturacion', 'Facturación', 'receipt'], ['todo', 'Todo junto', 'layout-dashboard']] },
    automatizar: { q: '¿Cuál se repite más?', o: [['whatsapp', 'Responder WhatsApp/consultas', 'message-circle'], ['presupuestos', 'Generar presupuestos', 'file-text'], ['datos', 'Meter datos a mano', 'keyboard'], ['recordatorios', 'Recordatorios y seguimiento', 'bell']] },
    guia: { q: '¿Qué es lo que más te frena?', o: [['manual', 'Pierdo tiempo en tareas manuales', 'clock'], ['visibilidad', 'No tengo visibilidad de mi negocio', 'layout-dashboard'], ['webDebil', 'Mi web no representa lo que hago', 'globe'], ['empezar', 'No sé por dónde empezar', 'compass']] }
  };
  var REMAP = { manual: ['automatizar', 'datos'], visibilidad: ['sistema', 'todo'], webDebil: ['web', 'otro'], empezar: ['sistema', 'clientes'] };
  var OBJ = { vender: 'vender más', ahorrar: 'ahorrar tiempo', imagen: 'dar mejor imagen', controlar: 'tener todo controlado' };
  var OBJ_ENT = {
    vender: 'Y todo montado alrededor de la acción que te interesa: que te pidan presupuesto o te escriban.',
    ahorrar: 'Y todo montado para quitarte pasos: lo que hoy haces a mano, lo hace el sistema.',
    imagen: 'Y todo montado cuidando cómo se ve: tipografía, fotos y orden, no una plantilla más.',
    controlar: 'Y todo montado para que veas el estado real de cada cosa sin preguntar a nadie.'
  };
  var R = {
    web: {
      reformas: { t: 'Tu web de reformas, lista para vender', nav: ['Reformas', 'Proyectos', 'Contacto'], cta: 'Pedir presupuesto', b: ['s', [['wrench', 'Baños y cocinas'], ['hammer', 'Obra y albañilería'], ['building-2', 'Reforma integral']]], e: ['Una página por tipo de reforma, con fotos de obras tuyas y el detalle de qué incluye cada una.', 'Un formulario de presupuesto que te llega ya ordenado: tipo de obra, superficie y datos de contacto.', 'Fichas de proyecto reutilizables, para publicar una obra nueva sin rehacer la página.'], d: 'un negocio de reformas' },
      servicios: { t: 'Tu web de servicios, que genera confianza', nav: ['Servicios', 'Cómo trabajo', 'Contacto'], cta: 'Pedir cita', b: ['s', [['message-circle', 'Primera consulta'], ['clipboard-list', 'Asesoramiento'], ['file-text', 'Gestión y trámites']]], e: ['Una página por servicio, explicando qué resuelve y para quién, sin jerga.', 'Reserva de primera consulta desde la propia web, con los datos que necesitas antes de la llamada.', 'Una sección de "cómo trabajo" que responde por escrito las dudas que hoy contestas por teléfono.'], d: 'un negocio de servicios profesionales' },
      comercio: { t: 'Tu tienda online, lista para vender', nav: ['Catálogo', 'Ofertas', 'Mi pedido'], cta: 'Hacer pedido', b: ['s', [['layout-grid', 'Catálogo'], ['clipboard-list', 'Pedidos'], ['truck', 'Envío y recogida']]], e: ['Catálogo con categorías, fichas de producto y disponibilidad, editable por ti sin tocar código.', 'Pedido online con envío o recogida en tienda, y confirmación automática al cliente.', 'Una página de ofertas y novedades que puedes cambiar tú cuando quieras.'], d: 'una tienda online' },
      otro: { t: 'Tu web, lista para vender', nav: ['Qué hacemos', 'Cómo trabajamos', 'Contacto'], cta: 'Pedir información', b: ['s', [['layout-grid', 'Qué ofreces'], ['settings', 'Cómo trabajas'], ['message-circle', 'Contacto']]], e: ['Una portada que deja claro en diez segundos qué haces y para quién.', 'Una sección por cada servicio, con el detalle que hoy explicas a mano una y otra vez.', 'Un formulario de contacto que te llega ordenado y con contexto, no un "hola" suelto.'], d: 'tu negocio' }
    },
    sistema: {
      clientes: { t: 'Tus clientes y presupuestos, en un solo sitio', nav: ['Clientes', 'Presupuestos', 'Seguimiento'], cta: 'Nuevo cliente', b: ['m', [['users', 'Clientes', 1], ['file-text', 'Presupuestos', 1], ['clipboard-list', 'Seguimiento'], ['bell', 'Avisos']]], e: ['Ficha de cliente con su historial completo: presupuestos, notas y estado actual.', 'Presupuestos a partir de plantillas, duplicables de un cliente a otro sin reescribir.', 'Un tablero con qué presupuestos están pendientes de respuesta y desde cuándo.'], d: 'centralizaríamos tus clientes y presupuestos' },
      citas: { t: 'Tu agenda, siempre al día', nav: ['Agenda', 'Citas', 'Equipo'], cta: 'Nueva cita', b: ['m', [['calendar-check', 'Agenda', 1], ['clock', 'Huecos', 1], ['bell', 'Recordatorios'], ['users', 'Equipo']]], e: ['Agenda compartida por persona y por recurso, sin dobles reservas posibles.', 'Alta de cita en dos pasos, pidiendo solo los datos que de verdad necesitas.', 'Recordatorio automático al cliente antes de la cita, con tu texto.'], d: 'organizaríamos tu agenda y tus citas' },
      facturacion: { t: 'Tu facturación, sin perseguir a nadie', nav: ['Facturas', 'Cobros', 'Impuestos'], cta: 'Nueva factura', b: ['m', [['receipt', 'Facturas', 1], ['badge-check', 'Cobros', 1], ['clock', 'Vencimientos'], ['calculator', 'Impuestos']]], e: ['Facturas generadas a partir del presupuesto aceptado, sin reescribir nada.', 'Listado de cobros con estado y vencimiento, para ver de un vistazo qué falta por entrar.', 'Exportación de lo que tu asesoría te pida, en el formato que ya esté usando.'], d: 'pondríamos en orden tu facturación' },
      todo: { t: 'Todo tu negocio, en un sitio', nav: ['Resumen', 'Clientes', 'Facturas'], cta: 'Ver resumen', b: ['m', [['users', 'Clientes', 1], ['calendar-check', 'Agenda', 1], ['receipt', 'Facturas', 1], ['clipboard-list', 'Tareas', 1]]], e: ['Un único sitio con clientes, agenda, facturación y tareas, conectados entre sí.', 'Una pantalla de resumen con lo que hay que atender hoy, sin abrir cuatro programas.', 'Permisos por persona, para que cada uno vea y toque solo lo suyo.'], d: 'centralizaríamos tu día a día' }
    },
    automatizar: {
      whatsapp: { t: 'Tu WhatsApp, respondiendo solo', nav: ['Conversaciones', 'Respuestas', 'Agenda'], cta: 'Ver conversaciones', b: ['q', ['message-circle', 'Consulta', 'calendar-check', 'Cita en agenda']], e: ['Respuestas automáticas a las preguntas que se repiten, escritas con tu tono.', 'Paso a persona en cuanto la conversación se sale del guion, sin que el cliente lo note.', 'Las citas que se cierran por chat entran solas en la agenda.'], d: 'dejaríamos que tu WhatsApp se responda solo' },
      presupuestos: { t: 'Tus presupuestos, generados solos', nav: ['Solicitudes', 'Plantillas', 'Enviados'], cta: 'Generar presupuesto', b: ['q', ['messages-square', 'Petición', 'file-check-2', 'Presupuesto enviado']], e: ['Plantillas de presupuesto por tipo de trabajo, con partidas reutilizables.', 'Generación del documento y envío al cliente en un clic, con tu marca.', 'Aviso cuando un presupuesto lleva días sin respuesta, para que no se enfríe.'], d: 'generaríamos tus presupuestos automáticamente' },
      datos: { t: 'Esos datos, metidos solos', nav: ['Entradas', 'Reglas', 'Registro'], cta: 'Ver registro', b: ['q', ['keyboard', 'A mano', 'badge-check', 'Ficha creada']], e: ['Los datos entran una sola vez y viajan solos entre las herramientas que ya usas.', 'Lectura automática de los documentos que hoy tecleas a mano.', 'Un registro de qué se ha creado y cuándo, para poder revisarlo si algo falla.'], d: 'dejaríamos de meter esos datos a mano' },
      recordatorios: { t: 'Tus recordatorios, enviados solos', nav: ['Avisos', 'Plantillas', 'Historial'], cta: 'Ver avisos', b: ['q', ['clock', 'Sin seguimiento', 'bell', 'Aviso enviado']], e: ['Avisos automáticos por email o WhatsApp según el momento de cada cliente.', 'Plantillas de mensaje editables, para no reescribir lo mismo cada vez.', 'Historial de qué se ha enviado a quién, sin tener que buscarlo en el móvil.'], d: 'automatizaríamos tus recordatorios y seguimientos' }
    }
  };
  var receta = function (nec, sub) { if (nec === 'guia') { var m = REMAP[sub]; nec = m[0]; sub = m[1]; } return { nec: nec, r: R[nec][sub] }; };
  var diagnostico = function (x, obj) { return x.nec === 'web' ? 'Para ' + x.r.d + ' que quiere ' + OBJ[obj] + ', esto es lo que construiríamos:' : 'Si lo que buscas es ' + OBJ[obj] + ', así ' + x.r.d + ':'; };
  function mock(r) {
    var nav = '<div class="rm-nav"><b>Tu negocio</b>' + r.nav.map(function (n) { return '<span>' + n + '</span>'; }).join('') + '<span class="rm-cta">' + r.cta + '</span></div>';
    var b = r.b, cuerpo;
    if (b[0] === 'q') cuerpo = '<div class="rm-seq"><span>' + ico(b[1][0]) + b[1][1] + '</span><span class="flecha">' + ico('chevron-right') + '</span><span>' + ico(b[1][2]) + b[1][3] + '</span></div>';
    else cuerpo = '<div class="rm-cuerpo">' + b[1].map(function (it) { return '<span class="rm-it' + (b[0] === 'm' && it[2] ? ' on' : '') + '">' + ico(it[0]) + it[1] + '</span>'; }).join('') + '</div>';
    return nav + cuerpo;
  }

  /* ═══ B · el configurador guía la página: lo elegido ordena problemas, casos y chat (sin quitar nada) ═══ */
  var NEC_LABEL = { web: 'Una web nueva', sistema: 'Un sistema interno', automatizar: 'Automatizar tareas repetitivas', guia: 'No lo sé, que me guíen' };
  var CASO_NOMBRE = { of: 'ObraFácil, una tienda online', cs: 'Córdoba Soluciona, una web que capta reformas pueblo a pueblo', py: 'PresupuesYa, nuestro software de presupuestos de obra' };
  function guiar(nec, sub) {
    var etiqueta = NEC_LABEL[nec];
    if (nec === 'guia') { if (!sub) return; var m = REMAP[sub]; nec = m[0]; sub = m[1]; }
    var r = { etiqueta: etiqueta, caso: null, problema: null, cerca: false };
    if (nec === 'web') { r.caso = sub === 'comercio' ? 'of' : 'cs'; }
    if (nec === 'sistema') { r.caso = 'py'; r.problema = sub === 'facturacion' ? 1 : 0; }
    if (nec === 'automatizar') { r.caso = 'py'; r.problema = 1; r.cerca = true; }
    pagina.ruta = r;
    var ap = $('[data-ruta-aviso="problemas"]'), ac = $('[data-ruta-aviso="casos"]');
    var cambiar = ' <a href="#titular">cambiar</a>';
    if (r.problema !== null && ap) {
      ap.innerHTML = '<span class="ruta-et">Tu ruta</span> Has elegido <b>' + etiqueta + '</b>: empieza por el que más te va a sonar.' + cambiar;
      ap.hidden = false; if (pagina.problema) pagina.problema(r.problema);
    } else if (ap) { ap.hidden = true; $$('.problema.para-ti').forEach(function (x) { x.classList.remove('para-ti'); }); }
    if (r.caso && ac) {
      ac.innerHTML = '<span class="ruta-et">Tu ruta</span> ' + (r.cerca
        ? 'Así automatizamos en nuestro propio producto: en <b>PresupuesYa</b> dictas la partida y la IA la crea, la descompone y, al firmar, monta el plan de obra.'
        : 'Lo más parecido a lo tuyo, ya funcionando: <b>' + CASO_NOMBRE[r.caso] + '</b>.') + cambiar;
      ac.hidden = false; if (pagina.caso) pagina.caso(r.caso);
    }
    var saludo = $('[data-chat-saludo]'), txt = $('[data-chat] input[name="text"]');
    if (saludo) saludo.textContent = 'Hola. Has elegido «' + etiqueta + '» arriba. Cuéntanos qué te frena y te decimos por dónde empezaríamos.';
    if (txt) txt.value = 'Hola OpsPilot, vengo de la web. Busco: ' + etiqueta.toLowerCase() + '.';
    if (txt) txt.dataset.ruta = etiqueta;
  }

  var cfg = $('[data-cfg]');
  if (cfg) (function () {
    var paneles = $$('.cfg-p', cfg), barras = $$('.cfg-progreso i', cfg), paso = $('[data-cfg-paso]', cfg);
    var atras = $('[data-atras]', cfg), enviar = $('[data-enviar]', cfg), garantia = $('[data-garantia]', cfg), texto = $('input[name="text"]', cfg);
    var estado = { n: 1, nec: null, sub: null, obj: null };
    function ir(n) {
      paneles.forEach(function (p) { var k = +p.dataset.p; p.classList.toggle('activo', k === n); p.classList.toggle('sale', k < n); });
      barras.forEach(function (b, i) { b.classList.toggle('on', i < Math.min(n, 3)); });
      paso.textContent = n < 4 ? 'Paso ' + n + ' de 3' : 'Lista';
      atras.hidden = n === 1; enviar.hidden = n !== 4; garantia.hidden = n === 4;
      estado.n = n;
    }
    function paso2() {
      var c = P2[estado.nec];
      $('[data-p2-q]', cfg).textContent = c.q;
      $('[data-p2-ops]', cfg).innerHTML = c.o.map(function (o) {
        return '<label class="op"><input type="radio" name="sub" value="' + o[0] + '">' + ico(o[2]) + '<span>' + o[1] + '</span><svg class="ico op-ir" aria-hidden="true"><use href="#i-chevron-right"/></svg></label>';
      }).join('');
    }
    function resultado() {
      var x = receta(estado.nec, estado.sub);
      $('[data-res-diag]', cfg).textContent = diagnostico(x, estado.obj);
      $('[data-res-mock]', cfg).innerHTML = mock(x.r);
      $('[data-res-titulo]', cfg).textContent = x.r.t;
      $('[data-res-lista]', cfg).innerHTML = x.r.e.map(function (e) { return '<li>' + ico('check') + '<span>' + e + '</span></li>'; }).join('');
      $('[data-res-extra]', cfg).textContent = OBJ_ENT[estado.obj];
      texto.value = 'Hola OpsPilot, he montado mi propuesta en la web: «' + x.r.t + '» (objetivo: ' + OBJ[estado.obj] + '). ¿Hablamos?';
    }
    cfg.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'necesidad') { estado.nec = t.value; estado.sub = null; paso2(); guiar(estado.nec, null); setTimeout(function () { ir(2); }, 180); }
      if (t.name === 'sub') { estado.sub = t.value; guiar(estado.nec, estado.sub); setTimeout(function () { ir(3); }, 180); }
      if (t.name === 'objetivo') { estado.obj = t.value; resultado(); setTimeout(function () { ir(4); }, 180); }
    });
    atras.addEventListener('click', function () { ir(Math.max(1, estado.n - 1)); });
    ir(1);
  })();

  /* Lo que está bajo el pliegue se monta cuando el navegador está libre (evita la tarea larga al cargar) */
  var luego = function (fn) { ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 400); };
  luego(function () {
  /* ═══ 2 · PROBLEMAS: mesa + dos caras por pantalla (+ pestañas y deslizar en móvil) ═══ */
  var mesa = $('[data-mesa]');
  if (mesa) {
    var pares = $$('.par', mesa);
    var activar = function (par) {
      pares.forEach(function (p) {
        var on = p === par; p.classList.toggle('activo', on);
        $('.problema', p).setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    };
    pares.forEach(function (p) {
      var b = $('.problema', p);
      b.addEventListener('click', function () { activar(p); });
      b.addEventListener('mouseenter', function () { if (matchMedia('(hover:hover) and (min-width:768px)').matches) activar(p); });
    });
    /* móvil: tres pestañas arriba y una sola pantalla; también se pasa deslizando */
    var chips = $('[data-chips-problemas]');
    chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Problemas');
    chips.innerHTML = pares.map(function (p, i) { var b = $('.problema', p); return '<button type="button" aria-pressed="' + (i ? 'false' : 'true') + '" aria-controls="' + b.getAttribute('aria-controls') + '"><small>0' + (i + 1) + '</small>' + b.dataset.corto + '</button>'; }).join('');
    chips.hidden = false;
    var botonesChip = $$('button', chips);
    var activarBase = activar;
    activar = function (par) { activarBase(par); var k = pares.indexOf(par); botonesChip.forEach(function (c, i) { c.setAttribute('aria-pressed', i === k ? 'true' : 'false'); }); };
    botonesChip.forEach(function (c, i) { c.addEventListener('click', function () { activar(pares[i]); }); });
    pares.forEach(function (p) { var fig = $('.pv', p), d = document.createElement('p'); d.className = 'desliza'; d.setAttribute('aria-hidden', 'true'); d.textContent = '← desliza para ver otro problema →'; p.appendChild(d); deslizar(fig, function (dir) { var k = pares.indexOf(mesa.querySelector('.par.activo')); activar(pares[(k + dir + pares.length) % pares.length]); }); });
    pagina.problema = function (i) { activar(pares[i]); pares.forEach(function (p, k) { $('.problema', p).classList.toggle('para-ti', k === i); }); };
    if (pagina.ruta && pagina.ruta.problema !== null) pagina.problema(pagina.ruta.problema);
  }
  $$('[data-pv]').forEach(function (pv) {
    var bs = $$('.seg button', pv), t = $('[data-nota-t]', pv), h = $('[data-nota-hoy]', pv), s = $('[data-nota-sis]', pv);
    var poner = function (cara) {
      pv.classList.toggle('sis', cara === 'sis');
      bs.forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.cara === cara ? 'true' : 'false'); });
      t.textContent = cara === 'sis' ? 'Con un sistema' : 'Ejemplo · hoy'; h.hidden = cara === 'sis'; s.hidden = cara !== 'sis';
    };
    bs.forEach(function (x) { x.addEventListener('click', function () { poner(x.dataset.cara); }); });
    /* demo: enseña el problema, y a los pocos segundos, la misma pantalla con un sistema */
    demo(pv, async function (ctx) {
      poner('hoy'); await espera(4200); if (!ctx.vivo()) return;
      poner('sis'); await espera(4200);
    });
  });
  /* las cinco pestañas pasan solas mientras se ven (así se siente el problema) */
  var nav = $('[data-pestanas]');
  if (nav && !quieto) (function () {
    var tabs = $$('.nav-tabs span', nav), ps = $$('.np', nav), n = $('[data-nav-n]', nav), url = $('[data-nav-url]', nav), i = 0, reloj = null;
    var q = ['¿dónde apunté lo del cliente de ayer?', '¿pagó el segundo plazo?', '¿qué día empezaba el alicatado?', '¿qué me dijo por WhatsApp?', '¿eran 12 o 14 placas?'];
    var paso = function () { i = (i + 1) % tabs.length; tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); }); ps.forEach(function (p, k) { p.classList.toggle('on', k === i); }); n.textContent = i + 1; url.textContent = q[i]; };
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { if (!reloj) reloj = setInterval(paso, 1500); } else { clearInterval(reloj); reloj = null; }
    }, { threshold: .4 }).observe(nav);
  })();

  /* ═══ 4 · VISOR DE CASOS ═══ */
  var visor = $('[data-visor]');
  if (visor) {
    var tabs = $$('[role="tab"]', visor);
    var elegir = function (tab, foco) {
      tabs.forEach(function (t) {
        var on = t === tab; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).classList.toggle('activo', on);
      });
      if (foco) tab.focus();
    };
    pagina.caso = function (id) { var t = document.getElementById('tab-' + id); elegir(t); tabs.forEach(function (x) { x.classList.toggle('para-ti', x === t); }); };
    deslizar($('.escenario', visor), function (dir) { var k = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }); elegir(tabs[(k + dir + tabs.length) % tabs.length]); });
    if (pagina.ruta && pagina.ruta.caso) pagina.caso(pagina.ruta.caso);
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { elegir(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); elegir(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
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
    var n = 0, enCarro = 0, tt;
    var num = function (el) { return parseFloat(String(el.value).replace(',', '.')) || 0; };
    var el = function (tag, at) { var x = document.createElementNS(NS, tag); for (var k in at) x.setAttribute(k, at[k]); return x; };
    var dec = function (v) { return String(Math.round(v * 100) / 100).replace('.', ','); };
    function pintar() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var w = num(inA), h = num(inH);
      if (w <= 0 || h <= 0) { n = 0; outN.textContent = '—'; outD.textContent = 'Pon el ancho y el alto'; outT.textContent = '—'; anadir.disabled = true; return; }
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
      if (!n) return; enCarro += n; carroN.textContent = enCarro;
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

  /* ─── Córdoba Soluciona: una página real por pueblo, barrio y reforma (datos/cordobasoluciona.json,
         leídos de su sitemap el 25-sep). Se cargan solo cuando se abre el caso. ─── */
  var cs = $('[data-cs]');
  if (cs) (function () {
    var SV = { 'reforma-bano': 'reforma-bano', 'reforma-cocina': 'reforma-cocina', 'suelos-laminados': 'suelos-laminados', 'puertas-y-armarios': 'puertas-y-armarios', 'reforma-integral': 'reforma-integral' };
    var sel = $('[data-cs-lugar]', cs), bots = $$('[data-cs-rf] button', cs), aviso = $('[data-cs-aviso]', cs);
    var serp = $('[data-cs-serp]', cs), hero = $('[data-cs-hero]', cs), datos = null, cargando = null, lugar = 'puente-genil', sv = 'reforma-bano';
    function cargar() {
      if (!cargando) cargando = fetch('/datos/cordobasoluciona.json').then(function (r) { return r.json(); }).then(function (d) {
        datos = d;
        var col = new Intl.Collator('es');
        var pueblos = d.places.filter(function (p) { return p.k === 'p'; }).sort(function (a, b) { return col.compare(a.n, b.n); });
        var barrios = d.places.filter(function (p) { return p.k === 'b'; }).sort(function (a, b) { return col.compare(a.n, b.n); });
        var op = function (p) { return '<option value="' + p.s + '"' + (p.s === lugar ? ' selected' : '') + '>' + p.n + '</option>'; };
        sel.innerHTML = '<optgroup label="Pueblos (' + pueblos.length + ')">' + pueblos.map(op).join('') + '</optgroup><optgroup label="Barrios de Córdoba capital (' + barrios.length + ')">' + barrios.map(op).join('') + '</optgroup>';
        return d;
      });
      return cargando;
    }
    function lugarDe(s) { return datos.places.filter(function (p) { return p.s === s; })[0]; }
    async function pintar(nuevoLugar, nuevoSv) {
      await cargar();
      lugar = nuevoLugar || lugar; if (nuevoSv !== undefined) sv = nuevoSv;
      var p = lugarDe(lugar);
      if (p.k === 'b') sv = null; else if (!sv || p.sv.indexOf(sv) < 0) sv = p.sv[0] || null;
      bots.forEach(function (b) {
        var ok = p.k === 'p' && p.sv.indexOf(b.dataset.sv) >= 0;
        b.disabled = !ok; b.setAttribute('aria-pressed', b.dataset.sv === sv ? 'true' : 'false');
      });
      aviso.hidden = p.k !== 'b';
      aviso.textContent = p.k === 'b' ? 'En la capital, una página por barrio con lo que más se pide allí.' : '';
      var ruta = '/reformas-en/' + p.s + '/' + (sv ? sv + '/' : ''), pg = datos.pages[ruta];
      serp.classList.add('cambia'); hero.classList.add('cambia');
      await espera(quieto ? 0 : 220);
      $('[data-cs-url]', cs).textContent = 'cordobasoluciona.es' + ruta;
      $('[data-cs-serp-u]', cs).textContent = 'cordobasoluciona.es › ' + ruta.split('/').filter(Boolean).join(' › ');
      $('[data-cs-t]', cs).textContent = pg.t; $('[data-cs-d]', cs).textContent = pg.d; $('[data-cs-h1]', cs).textContent = pg.h1;
      serp.classList.remove('cambia'); hero.classList.remove('cambia');
    }
    sel.addEventListener('change', function () { pintar(sel.value); });
    bots.forEach(function (b) { b.addEventListener('click', function () { if (!b.disabled) pintar(null, b.dataset.sv); }); });
    sel.addEventListener('focus', cargar, { once: true });
    var tabCs = document.getElementById('tab-cs'); if (tabCs) tabCs.addEventListener('click', cargar, { once: true });
    new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { io.disconnect(); cargar(); } }, { rootMargin: '200px' }).observe(cs);
    demo(cs, async function (ctx) {
      await cargar(); await espera(1600); if (!ctx.vivo()) return;
      var p = datos.places[Math.floor(Math.random() * datos.places.length)];
      sel.value = p.s; await pintar(p.s, p.sv.length ? p.sv[Math.floor(Math.random() * p.sv.length)] : null);
      await espera(2200);
    });
  })();

  /* ─── PresupuesYa: partida dictada → descomposición → firma eIDAS → plan de obra.
         Importes de EJEMPLO; los cálculos son reales: medios auxiliares 2 % y beneficio industrial 6 %
         sobre el coste directo, IVA 21 %, plan de obra por horas de mano de obra (8 h = 1 día). ─── */
  var py = $('[data-py]');
  if (py) (function () {
    var MA = .02, BI = .06, IVA = .21;
    var P = [
      { cap: '01 · Demoliciones', n: 'Picado de alicatado y retirada a vertedero', u: 'm²', q: 28, h: 6, d: [['Mano de obra · 6 h', 180], ['Contenedor y vertedero', 70]] },
      { cap: '02 · Fontanería', n: 'Cambio de bañera por plato de ducha', u: 'ud', q: 1, h: 5, d: [['Plato de ducha 120 × 80', 240], ['Mano de obra · 5 h', 300], ['Válvulas y desagüe', 85]] },
      { cap: '03 · Revestimientos', n: 'Alicatado porcelánico', u: 'm²', q: 28, h: 14, d: [['Material cerámico', 812], ['Mano de obra · 14 h', 840], ['Maquinaria y auxiliares', 148], ['Cemento cola + rejuntado', 168]] }
    ];
    var NUEVA = { cap: '04 · Sanitarios', n: 'Sanitarios y grifería', u: 'lote', q: 1, h: 4, d: [['Inodoro, lavabo y mueble', 1180], ['Grifería termostática', 390], ['Mano de obra · 4 h', 240]] };
    var COL = ['#DD9717', '#3B82F6', '#A855F7', '#22C55E', '#EF4444'];
    var sel = 2, estado = 'borrador', firmado = false;
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var directo = function (p) { return p.d.reduce(function (s, x) { return s + x[1]; }, 0); };
    var total = function (p) { var dir = directo(p), ma = r2(dir * MA), bi = r2((dir + ma) * BI); return r2(dir + ma + bi); };
    var tb = $('[data-py-partidas]', py), tot = $('[data-py-tot]', py), toast = $('[data-toast-py]', py), tt;
    function aviso(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('on'); }, 2200); }
    function tabla(nuevaIdx) {
      var cap = null, html = '';
      P.forEach(function (p, i) {
        if (p.cap !== cap) { cap = p.cap; html += '<tr class="cap"><td colspan="4">' + cap + '</td></tr>'; }
        var imp = total(p);
        html += '<tr class="pt' + (i === sel ? ' sel' : '') + (i === nuevaIdx ? ' nueva' : '') + '" data-i="' + i + '" tabindex="0"><td>' + p.n + '</td><td>' + num2(p.q, 0) + ' ' + p.u + '</td><td>' + num2(imp / p.q, 2) + '</td><td>' + num2(imp, 2) + '</td></tr>';
      });
      tb.innerHTML = html;
      var pem = r2(P.reduce(function (s, p) { return s + total(p); }, 0)), iva = r2(pem * IVA);
      tot.innerHTML = '<dt>Base imponible</dt><dd>' + eur(pem) + '</dd><dt>IVA 21 %</dt><dd>' + eur(iva) + '</dd><dt>Total</dt><dd class="total">' + eur(r2(pem + iva)) + '</dd>';
      $$('tr.pt', tb).forEach(function (tr) {
        var ir = function () { sel = +tr.dataset.i; tabla(); panel('desc'); };
        tr.addEventListener('click', ir); tr.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ir(); } });
      });
      desc();
    }
    function desc() {
      var p = P[sel], dir = directo(p), ma = r2(dir * MA), bi = r2((dir + ma) * BI), t = total(p);
      $('[data-py-desc-t]', py).textContent = 'Descomposición · ' + p.n.toLowerCase();
      $('[data-py-desc]', py).innerHTML = p.d.map(function (x, i) { return '<li><i style="--c:' + COL[i % COL.length] + '"></i><span>' + x[0] + '</span><b>' + num2(x[1], 2) + '</b></li>'; }).join('') +
        '<li><i style="--c:#6B7280"></i><span>Medios auxiliares (2 %)</span><b>' + num2(ma, 2) + '</b></li><li><i style="--c:#6B7280"></i><span>Beneficio industrial (6 %)</span><b>' + num2(bi, 2) + '</b></li>';
      $('[data-py-desc-tot]', py).innerHTML = 'Total partida<span><b>' + eur(t) + '</b><small>' + num2(t / p.q, 2) + ' €/' + p.u + '</small></span>';
    }
    var pest = $$('[data-py-p]', py);
    function panel(k) {
      pest.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.pyP === k ? 'true' : 'false'); });
      $$('[data-py-panel]', py).forEach(function (x) { x.classList.toggle('on', x.dataset.pyPanel === k); });
    }
    pest.forEach(function (b) { b.addEventListener('click', function () { panel(b.dataset.pyP); }); });
    /* dictado: la frase aparece como si la escribiera el reconocimiento de voz y la IA crea la partida */
    var mic = $('[data-py-dictar]', py), dicho = $('[data-py-dicho]', py);
    async function dictar() {
      if (P.indexOf(NUEVA) >= 0) return;
      mic.disabled = false; mic.classList.add('escucha'); dicho.classList.add('vivo'); dicho.textContent = '';
      var frase = '«añade sanitarios y grifería, un lote»';
      for (var i = 0; i < frase.length; i++) { dicho.textContent += frase[i]; await espera(quieto ? 0 : 45); }
      mic.classList.remove('escucha'); dicho.textContent = 'IA · creando la partida y su descomposición…'; await espera(quieto ? 0 : 900);
      P.push(NUEVA); sel = P.length - 1; tabla(sel); panel('desc');
      mic.disabled = true; dicho.classList.remove('vivo'); dicho.textContent = 'Partida añadida con su descomposición: revísala y ajusta lo que quieras.';
    }
    mic.addEventListener('click', dictar);
    /* firma en el portal del cliente, con huella SHA-256 real del presupuesto firmado */
    var btnE = $('[data-py-enviar]', py), est = $('[data-py-estado]', py);
    async function enviar() {
      if (estado !== 'borrador') return;
      estado = 'enviado'; est.textContent = 'Enviado'; est.className = 'py-estado env'; btnE.disabled = true; btnE.lastChild.textContent = 'Esperando firma';
      panel('firma'); $('[data-py-f-sub]', py).textContent = 'El cliente recibe un SMS con su código y firma desde el móvil.';
      var cod = $('[data-py-codigo]', py); cod.textContent = '';
      await espera(quieto ? 0 : 700);
      var c = String(Math.floor(100000 + Math.random() * 900000));
      for (var i = 0; i < 6; i++) { cod.textContent += c[i]; await espera(quieto ? 0 : 160); }
      var datos = JSON.stringify(P.map(function (p) { return [p.n, p.q, total(p)]; }));
      var h = '';
      try { var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(datos)); h = Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); } catch (e) { h = 'sin-huella'; }
      $('[data-py-huella]', py).textContent = hora() + ' · huella ' + h.slice(0, 16) + '…';
      $('[data-py-sello]', py).hidden = false; $('[data-py-f-sub]', py).textContent = 'Firmado con verificación por SMS.';
      estado = 'firmado'; est.textContent = 'Firmado'; est.className = 'py-estado ok'; btnE.lastChild.textContent = 'Presupuesto firmado';
      aviso('Presupuesto firmado · se ha generado el plan de obra'); plan(); await espera(quieto ? 0 : 1200); panel('plan');
    }
    function plan() {
      $('[data-py-plan-vacio]', py).hidden = true;
      var dia = 1;
      $('[data-py-plan]', py).innerHTML = P.map(function (p, i) {
        var d = Math.max(1, Math.ceil(p.h / 8)), txt = d === 1 ? 'Día ' + dia : 'Días ' + dia + '–' + (dia + d - 1); dia += d;
        return '<li style="animation-delay:' + (i * .12) + 's"><span>' + p.cap.replace(/^\d+ · /, '') + '</span><b>' + txt + '</b></li>';
      }).join('');
    }
    btnE.addEventListener('click', enviar);
    tabla();
    demo(py, async function (ctx) {
      await espera(1200); if (!ctx.vivo()) return;
      if (P.indexOf(NUEVA) < 0) { await dictar(); await espera(1800); }
      if (!ctx.vivo()) return;
      if (estado === 'borrador') { await enviar(); await espera(3500); }
      if (!ctx.vivo()) return;
      sel = (sel + 1) % P.length; tabla(); panel('desc'); await espera(2500);
    });
  })();

  /* (J.R. y EnergyDeal: casos de clientes, en /casos/) */
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

  /* ─── EnergyDeal: comparativa + snapshot inmutable con huella SHA-256 REAL de lo guardado.
         Datos de ejemplo (la ventana lo dice); el cálculo del coste anual es real: potencia·kW·365 + energía·kWh ─── */
  var ed = $('[data-ed]');
  if (ed) (function () {
    var KW = 10, KWH = 10000;
    var ofertas = [['Oferta A', .0891, .1342, '12 meses'], ['Oferta B', .0763, .1419, 'Sin permanencia'], ['Oferta C', .1027, .1275, '24 meses']];
    var coste = function (o) { return o[1] * KW * 365 + o[2] * KWH; };
    var fmt = num2;
    var tbody = $('[data-ed-tabla] tbody', ed), snap = $('[data-snap]', ed), guardado = null, ronda = 0;
    function tabla(cambio) {
      var min = Math.min.apply(null, ofertas.map(coste));
      tbody.innerHTML = ofertas.map(function (o, i) {
        var c = coste(o), prev = guardado && guardado.o[i], dif = prev ? c - coste(prev) : 0;
        return '<tr' + (c === min ? ' class="mejor"' : '') + '><td>' + o[0] + '</td><td' + (cambio ? ' class="cambio"' : '') + '>' + fmt(o[1], 4) + '</td><td' + (cambio ? ' class="cambio"' : '') + '>' + fmt(o[2], 4) + '</td><td>' + o[3] + '</td><td><b>' + eur(Math.round(c * 100) / 100) + '</b>' +
          (guardado && Math.abs(dif) > .005 ? ' <small class="' + (dif > 0 ? 'sube' : 'baja') + '">' + (dif > 0 ? '+' : '') + fmt(dif, 2) + '</small>' : '') + '</td></tr>';
      }).join('');
    }
    async function huella(txt) {
      try { var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)); return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
      catch (e) { var h = 0; for (var i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) | 0; return (h >>> 0).toString(16); }
    }
    var btnG = $('[data-guardar]', ed);
    btnG.addEventListener('click', async function () {
      if (guardado) return;
      guardado = { o: ofertas.map(function (o) { return o.slice(); }), h: hora() };
      var h = await huella(JSON.stringify(guardado.o));
      $('[data-snap-hora]', ed).textContent = 'hoy a las ' + guardado.h;
      $('[data-snap-hash]', ed).textContent = h.slice(0, 16) + '…';
      $('[data-snap-l]', ed).innerHTML = guardado.o.map(function (o) { return '<li><span>' + o[0] + '</span><b>' + eur(Math.round(coste(o) * 100) / 100) + '</b></li>'; }).join('');
      snap.hidden = false; btnG.disabled = true; btnG.innerHTML = ico('check') + 'Comparativa guardada';
      log('snapshot', 'comparativa congelada · huella ' + h.slice(0, 8));
    });
    $('[data-mover]', ed).addEventListener('click', function () {
      ronda++;
      var f = [[1.06, 1.04], [1.09, 1.07], [.97, 1.05]];
      ofertas = ofertas.map(function (o, i) { var k = f[(i + ronda) % 3]; return [o[0], Math.round(o[1] * k[0] * 10000) / 10000, Math.round(o[2] * k[1] * 10000) / 10000, o[3]]; });
      tabla(true);
      $('[data-snap-d]', ed).textContent = guardado ? 'Las tarifas han cambiado ' + ronda + (ronda === 1 ? ' vez' : ' veces') + ' desde que la guardaste. Lo guardado sigue idéntico: la huella no cambia.' : '';
    });
    var estados = $$('[data-estado]', ed), i = 0, lista = $('[data-log]', ed);
    function log(que, txt) { var li = document.createElement('li'); li.innerHTML = '<b>' + hora() + ' ' + que + '</b> ' + txt; lista.insertBefore(li, lista.firstChild); }
    var btnA = $('[data-avanzar]', ed);
    btnA.addEventListener('click', function () {
      estados[i].classList.remove('on'); i = (i + 1) % estados.length; estados[i].classList.add('on');
      log('estado', '→ ' + estados[i].textContent + (estados[i].classList.contains('rev') ? ' (el cliente se dio de baja)' : ''));
    });
    /* la tabla inicial ya viene escrita en el HTML (sin salto al cargar) */
    demo(ed, async function (ctx) {
      await espera(1500); if (!ctx.vivo()) return;
      if (!guardado) { btnG.click(); await espera(1800); }
      if (!ctx.vivo()) return; $('[data-mover]', ed).click(); await espera(2200);
      if (!ctx.vivo()) return; btnA.click(); await espera(2500);
    });
  })();


  /* ─── ERP Hostelería: mesa → comanda → la receta descuenta stock → cobrar suma a caja.
         Carta, precios y stock de EJEMPLO (la ventana lo dice). ─── */
  var erp = $('[data-erp]');
  if (erp) (function () {
    var CARTA = [
      { n: 'Salmorejo', p: 6.5, r: { tomate: .3, pan: .1, aceite: .05 } },
      { n: 'Flamenquín', p: 9, r: { lomo: .15, pan: .05, aceite: .1 } },
      { n: 'Rabo de toro', p: 14.5, r: { rabo: .4, aceite: .03 } },
      { n: 'Tostada con tomate', p: 3.2, r: { pan: .1, tomate: .08, aceite: .02 } }
    ];
    var STOCK = { tomate: [6, 2, 'kg'], pan: [4, 1.2, 'kg'], aceite: [5, 1, 'l'], lomo: [3, 1, 'kg'], rabo: [4, 1.5, 'kg'] };
    var NOM = { tomate: 'Tomate', pan: 'Pan', aceite: 'Aceite de oliva', lomo: 'Lomo', rabo: 'Rabo de toro' };
    var INI = {}; Object.keys(STOCK).forEach(function (k) { INI[k] = STOCK[k][0]; });
    var mesas = [[], [], [{ n: 'Salmorejo', p: 6.5 }, { n: 'Flamenquín', p: 9 }], [], [{ n: 'Rabo de toro', p: 14.5 }], [], [], []];
    var sel = 2, caja = 0, tickets = 0, tt;
    var toast = $('[data-toast-erp]', erp);
    function aviso(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('on'); }, 2200); }
    var suma = function (m) { return m.reduce(function (s, x) { return s + x.p; }, 0); };
    function pintar() {
      $('[data-erp-mesas]', erp).innerHTML = mesas.map(function (m, i) {
        return '<button type="button" data-m="' + i + '" class="' + (m.length ? 'ocupada' : '') + '" aria-pressed="' + (i === sel) + '">M' + (i + 1) + '<small>' + (m.length ? eur(suma(m)) : 'libre') + '</small></button>';
      }).join('');
      $$('[data-erp-mesas] button', erp).forEach(function (b) { b.addEventListener('click', function () { sel = +b.dataset.m; pintar(); }); });
      var m = mesas[sel];
      $('[data-erp-mesa-t]', erp).textContent = 'Mesa ' + (sel + 1);
      $('[data-erp-estado]', erp).textContent = m.length ? 'Ocupada' : 'Libre';
      $('[data-erp-lineas]', erp).innerHTML = m.length ? m.map(function (x) { return '<li><span>' + x.n + '</span><b>' + eur(x.p) + '</b></li>'; }).join('') : '<li class="vacia">Sin comanda. Añade platos de la carta.</li>';
      $('[data-erp-total]', erp).textContent = eur(suma(m));
      $('[data-erp-cobrar]', erp).disabled = !m.length;
      $('[data-erp-stock]', erp).innerHTML = Object.keys(STOCK).map(function (k) {
        var s = STOCK[k], bajo = s[0] < s[1];
        return '<li class="' + (bajo ? 'bajo' : '') + '"><span>' + NOM[k] + (bajo ? ' · pedir' : '') + '</span><b>' + num2(Math.max(0, s[0]), 2) + ' ' + s[2] + '</b><i style="--p:' + Math.max(0, Math.min(100, s[0] / INI[k] * 100)) + '%"></i></li>';
      }).join('');
      $('[data-erp-caja]', erp).textContent = eur(caja);
      $('[data-erp-tickets]', erp).textContent = tickets + (tickets === 1 ? ' ticket cobrado' : ' tickets cobrados');
    }
    function anadir(i) {
      var c = CARTA[i], bajan = [];
      mesas[sel].push({ n: c.n, p: c.p });
      Object.keys(c.r).forEach(function (k) { var antes = STOCK[k][0] >= STOCK[k][1]; STOCK[k][0] = Math.round((STOCK[k][0] - c.r[k]) * 1000) / 1000; if (antes && STOCK[k][0] < STOCK[k][1]) bajan.push(NOM[k]); });
      pintar();
      if (bajan.length) aviso('Stock bajo: ' + bajan.join(', ') + ' · al pedido del proveedor');
    }
    function cobrar() {
      var m = mesas[sel]; if (!m.length) return;
      caja = Math.round((caja + suma(m)) * 100) / 100; tickets++;
      aviso('Mesa ' + (sel + 1) + ' cobrada · ' + eur(suma(m))); mesas[sel] = []; pintar();
    }
    $('[data-erp-carta]', erp).innerHTML = CARTA.map(function (c, i) { return '<button type="button" data-c="' + i + '"><span>' + c.n + '</span><b>' + eur(c.p) + '</b></button>'; }).join('');
    $$('[data-erp-carta] button', erp).forEach(function (b) { b.addEventListener('click', function () { anadir(+b.dataset.c); }); });
    $('[data-erp-cobrar]', erp).addEventListener('click', cobrar);
    pintar();
    demo(erp, async function (ctx) {
      await espera(1200); if (!ctx.vivo()) return;
      sel = [0, 3, 5, 6][Math.floor(Math.random() * 4)]; pintar(); await espera(800);
      for (var k = 0; k < 3; k++) { if (!ctx.vivo()) return; anadir(Math.floor(Math.random() * CARTA.length)); await espera(900); }
      if (!ctx.vivo()) return; await espera(900); cobrar(); await espera(1500);
      Object.keys(STOCK).forEach(function (k) { if (STOCK[k][0] < STOCK[k][1] * .6) STOCK[k][0] = INI[k]; });
    });
  })();

  /* ═══ 5 · CHAT: lo que te frena → cómo empezaríamos (su propio diagnóstico, GUIA_REMAP) ═══ */
  var chat = $('[data-chat]');
  if (chat) (function () {
    var hilo = $('[data-hilo]', chat), texto = $('input[name="text"]', chat), estadoC = $('[data-chat-estado]', chat), turno = 0;
    var FRENO = { manual: 'Pierdo tiempo en tareas manuales', visibilidad: 'No tengo visibilidad de mi negocio', webDebil: 'Mi web no representa lo que hago', empezar: 'No sé por dónde empezar' };
    var abajo = function () { hilo.scrollTop = hilo.scrollHeight; };
    chat.addEventListener('change', async function (e) {
      if (e.target.name !== 'freno') return;
      var k = e.target.value, yo = ++turno, x = receta('guia', k);
      var m = document.createElement('p'); m.className = 'msg msg-yo'; m.innerHTML = FRENO[k] + '<small>' + hora() + '</small>'; hilo.appendChild(m); abajo();
      texto.value = 'Hola OpsPilot, lo que más me frena ahora mismo: ' + FRENO[k].toLowerCase() + '.' + (texto.dataset.ruta ? ' Busco: ' + texto.dataset.ruta.toLowerCase() + '.' : '') + ' ¿Por dónde empezaríais?';
      var esc = document.createElement('p'); esc.className = 'escribe'; esc.innerHTML = '<i></i><i></i><i></i>'; esc.setAttribute('aria-label', 'Escribiendo');
      estadoC.textContent = 'escribiendo…'; hilo.appendChild(esc); abajo();
      await espera(quieto ? 0 : 1100); if (yo !== turno) { esc.remove(); return; }
      esc.remove(); estadoC.textContent = 'responde en menos de 24 h';
      var r = document.createElement('p'); r.className = 'msg msg-op';
      r.innerHTML = 'Empezaríamos por aquí: ' + x.r.d + '.<ul><li>' + x.r.e[0] + '</li><li>' + x.r.e[1] + '</li></ul>Si te encaja, sigue por WhatsApp y lo vemos en 30 minutos.<small>' + hora() + '</small>';
      hilo.appendChild(r); abajo();
    });
  })();

  });

  /* ═══ La ruta se traza una vez al verla ═══ */
  if ('IntersectionObserver' in window && !quieto) {
    $$('[data-trazar]').forEach(function (n) {
      n.classList.add('espera');
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); n.classList.add('ya'); } }, { rootMargin: '0px 0px -20% 0px' });
      io.observe(n);
    });
  }
})();
