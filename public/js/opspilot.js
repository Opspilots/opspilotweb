/* OpsPilot · el configurador de propuesta y el chat de cierre.
   Sin JS todo se lee; con JS el configurador y el chat responden. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var espera = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };
  var hora = function () { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };
  var ico = function (id) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; };
  /* ═══ 1 · CONFIGURADOR: la propuesta que se monta en tres preguntas ═══ */
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

  /* ═══ B · el configurador guía la página: lo elegido marca el problema que más se parece y rellena el chat (sin quitar nada) ═══ */
  var NEC_LABEL = { web: 'Una web nueva', sistema: 'Un sistema interno', automatizar: 'Automatizar tareas repetitivas', guia: 'No lo sé, que me guíen' };
  /* El aviso del problema, bajo el configurador (nada se mueve por encima de lo que se está viendo). Solo si la página tiene los problemas.
     La región aria-live se crea vacía al cargar y se rellena después. El enlace es un ancla real (#p-sitios…): problemas.js lo lleva a su
     apartado, con una entrada nueva en el historial, y ahí manda el foco. */
  var regionAviso = (function () {
    var seccion = $('.propuesta');
    if (!seccion || !$('[data-par]')) return null;
    var cont = document.createElement('div'), p = document.createElement('p');
    cont.className = 'wrap propuesta-aviso';
    p.className = 'ruta-aviso propuesta-ruta'; p.setAttribute('aria-live', 'polite');
    cont.appendChild(p); seccion.appendChild(cont);
    return p;
  })();
  function avisoProblema(r) {
    if (!regionAviso) return;
    var par = r.problema !== null ? $$('[data-par]')[r.problema] : null;
    while (regionAviso.firstChild) regionAviso.removeChild(regionAviso.firstChild);
    if (!par) return;
    var et = document.createElement('span'), b = document.createElement('b'), a = document.createElement('a');
    et.className = 'ruta-et'; et.textContent = 'Tu ruta';
    b.textContent = r.etiqueta;
    a.href = '#' + par.id; a.textContent = $('.problema-t', par).textContent;
    regionAviso.appendChild(et);
    regionAviso.appendChild(document.createTextNode(' Has elegido '));
    regionAviso.appendChild(b);
    regionAviso.appendChild(document.createTextNode('. El problema que más te va a sonar: '));
    regionAviso.appendChild(a);
    /* si queda fuera de la pantalla, se acerca lo justo y con suavidad (de golpe con «reducir movimiento»), pero sin esconder el formulario
       bajo la cabecera: en pantallas bajas manda el paso en el que se está */
    var marco = $('.cfg-marco'), cab = $('.cab'), r = regionAviso.getBoundingClientRect();
    var falta = r.bottom + 24 - window.innerHeight, cabe = marco ? marco.getBoundingClientRect().top - (cab ? cab.getBoundingClientRect().bottom : 0) - 8 : falta;
    if (Math.min(falta, cabe) > 0) window.scrollBy({ top: Math.min(falta, cabe), behavior: quieto ? 'auto' : 'smooth' });
  }
  function guiar(nec, sub) {
    var etiqueta = NEC_LABEL[nec];
    if (nec === 'guia') { if (!sub) return; var m = REMAP[sub]; nec = m[0]; sub = m[1]; }
    var r = { etiqueta: etiqueta, problema: null };
    /* v12: el problema 0 es «te buscan en Google y sale otro»; los de sistema van detrás */
    if (nec === 'web') r.problema = 0;
    if (nec === 'sistema') r.problema = sub === 'facturacion' ? 2 : 1;
    if (nec === 'automatizar') r.problema = 2;
    /* los problemas (problemas.js) marcan el suyo con este evento; aquí, el aviso con el enlace que lleva a su tramo */
    document.dispatchEvent(new CustomEvent('opspilot:ruta', { detail: { problema: r.problema } }));
    avisoProblema(r);
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
  /* ═══ 5 · CHAT: lo que te frena → cómo empezaríamos (su propio diagnóstico, GUIA_REMAP) ═══ */
  var chat = $('[data-chat]');
  if (chat) (function () {
    var hilo = $('[data-hilo]', chat), texto = $('input[name="text"]', chat), estadoC = $('[data-chat-estado]', chat), turno = 0;
    var FRENO = { manual: 'Pierdo tiempo en tareas manuales', visibilidad: 'No tengo visibilidad de mi negocio', webDebil: 'Mi web no representa lo que hago', empezar: 'No sé por dónde empezar' };
    /* el hilo guarda los últimos 8 mensajes: por muchas respuestas que se toquen, no crece sin fin */
    var abajo = function () { var ms = $$('.msg', hilo); for (var i = 0; i < ms.length - 8; i++) ms[i].remove(); hilo.scrollTop = hilo.scrollHeight; };
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

  /* ═══ Menú móvil: Escape lo cierra y devuelve el foco al botón que lo abrió ═══ */
  (function () {
    var menu = $('details.menu-movil');
    if (!menu) return;
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !menu.open) return;
      menu.open = false;
      var boton = $('summary', menu);
      if (boton) boton.focus();
    });
  })();
})();
