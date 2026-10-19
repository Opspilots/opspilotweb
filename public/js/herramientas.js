/* Herramientas gratis: todo se calcula en el navegador; nada se envía. Solo la plantilla de presupuesto guarda
   lo escrito en localStorage, para no perderlo al cerrar (y se borra con «Empezar de cero»). */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var num = function (el) { return parseFloat(String(el && el.value || '').replace(',', '.')) || 0; };
  var eur = function (v) { return v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }) + ' €'; };
  var radio = function (f, n) { var r = $('input[name="' + n + '"]:checked', f); return r ? r.value : null; };

  /* ─── 1 · ¿Por qué no sales en Google Maps? ─── */
  var md = $('[data-mapsdiag]');
  if (md) (function () {
    /* [gravedad, arreglo, por qué]: gravedad 3 = te deja fuera; 2 = frena mucho; 1 = frena */
    var A = {
      ficha: { 0: [3, 'Crea tu Perfil de Empresa en Google.', 'Sin ficha no puedes salir en el mapa. Se crea gratis en business.google.com.'] },
      verif: { 0: [3, 'Verifica tu ficha.', 'Sin verificar, la ficha puede no mostrarse y no controlas lo que dice.'] },
      nombre: { 0: [3, 'Revisa si tu ficha está suspendida.', 'Si no sales ni buscando tu nombre exacto, lo más probable es una suspensión o una ficha sin verificar. Entra en business.google.com y mira si hay un aviso.'] },
      cat: { 0: [2, 'Cambia la categoría principal a lo que más vendes.', 'Es de lo que más pesa para que Google te enseñe en la búsqueda correcta (relevancia).'] },
      cerca: { 0: [2, 'Trabaja la relevancia y la reputación.', 'Si no sales ni estando al lado, a tu ficha le falta información o reseñas frente a la competencia.'], 1: [1, 'Sube posiciones con reseñas y fotos.', 'Ya sales, pero por debajo: lo que más mueve ahí son las reseñas recientes y una ficha completa.'] },
      resenas: { 0: [2, 'Consigue tus primeras 20 reseñas.', 'Pídeselas a cada cliente contento con el enlace directo de tu ficha, justo al terminar el trabajo.'], 1: [1, 'Llega a las 20 reseñas.', 'Te falta poco: pide una a cada cliente contento esta semana.'] },
      recientes: { 0: [1, 'Que vuelvan a entrar reseñas.', 'Las reseñas recientes cuentan más que las antiguas para quien te compara.'] },
      completa: { 0: [2, 'Completa la ficha: horario, fotos y descripción.', 'Una ficha vacía pierde frente a otra completa. Sube al menos 10 fotos reales de tu trabajo.'], 1: [1, 'Termina de completar la ficha.', 'Horario, fotos reales y una descripción con lo que haces y dónde.'] },
      nap: { 0: [1, 'Pon el mismo nombre, dirección y teléfono en todas partes.', 'Si tu web, tu ficha y tus redes no coinciden, Google se fía menos y tus clientes se confunden.'] },
    };
    var N = $$('fieldset', md).length, cuenta = $('[data-cuenta]', md), nota = $('[data-nota]', md), ver = $('[data-veredicto]', md), lista = $('[data-arreglos]', md), enviar = $('[data-enviar]', md);
    md.addEventListener('change', function () {
      var resp = 0, total = 0, arr = [], resumen = [];
      $$('fieldset', md).forEach(function (fs) {
        var r = $('input:checked', fs); if (!r) return;
        resp++; total += +r.value;
        resumen.push('- ' + $('legend', fs).firstChild.textContent.trim() + ' ' + r.nextElementSibling.textContent);
        var a = A[r.name] && A[r.name][r.value]; if (a) arr.push(a);
      });
      cuenta.textContent = resp + ' de ' + N;
      var p = Math.round(total / (N * 2) * 10);
      nota.textContent = resp ? p + '/10' : '—';
      arr.sort(function (x, y) { return y[0] - x[0]; });
      var grave = arr.length && arr[0][0] === 3;
      ver.textContent = resp < N ? 'Llevas ' + resp + ' de ' + N + '. Sigue y afinamos.'
        : grave ? 'Hay algo que te deja fuera del mapa. Empieza por el primer punto.'
        : p >= 8 ? 'Tu ficha está bien. Lo que queda es afinar.'
        : 'Sales, pero se te escapan clientes. Esto es lo que más te frena:';
      lista.innerHTML = arr.slice(0, 4).map(function (a) { return '<li class="g' + a[0] + '"><b>' + a[1] + '</b><span>' + a[2] + '</span></li>'; }).join('');
      if (resp === N) {
        enviar.hidden = false;
        enviar.href = enviar.href.split('?text=')[0] + '?text=' + encodeURIComponent('Hola OpsPilot, he hecho el diagnóstico de Google Maps y me sale ' + p + '/10.\n' + resumen.join('\n') + '\n\nMi negocio es… y está en…');
      }
    });
  })();

  /* ─── 2 · IVA e IRPF ─── */
  var iv = $('[data-iva]');
  if (iv) (function () {
    var imp = $('[data-importe]', iv), etq = $('[data-etq-importe]', iv);
    function calc() {
      var modo = radio(iv, 'modo'), t = +radio(iv, 'iva') / 100, r = +radio(iv, 'irpf') / 100, x = Math.max(0, num(imp));
      etq.textContent = modo === 'base' ? 'Base imponible (sin IVA)' : 'Lo que quieres cobrar en total';
      var base = modo === 'base' ? x : x / (1 + t - r);
      var civa = base * t, cirpf = base * r, total = base + civa - cirpf;
      $('[data-base]', iv).textContent = eur(base);
      $('[data-etq-iva]', iv).textContent = t ? 'IVA ' + Math.round(t * 100) + ' %' : 'IVA (exento)';
      $('[data-cuota-iva]', iv).textContent = '+' + eur(civa);
      $('[data-etq-irpf]', iv).textContent = 'Retención IRPF ' + Math.round(r * 100) + ' %';
      $('[data-cuota-irpf]', iv).textContent = (r ? '−' : '') + eur(cirpf);
      $('[data-total]', iv).textContent = eur(total);
      $('[data-explica]', iv).textContent = 'Cobras ' + eur(total) + '. De ahí, ' + eur(civa) + ' de IVA son para Hacienda (los declaras en el trimestral)' + (r ? ', y tu cliente ingresa por ti ' + eur(cirpf) + ' de IRPF a cuenta de tu renta.' : '.');
    }
    iv.addEventListener('input', calc); iv.addEventListener('change', calc); calc();
    $('[data-copiar]', iv).addEventListener('click', function (e) {
      var txt = $$('.hz-factura dl div', iv).map(function (d) { return $('dt', d).textContent + ': ' + $('dd', d).textContent; }).join('\n');
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { e.target.closest('button').lastChild.textContent = 'Copiado'; });
    });
  })();

  /* ─── 3 · Margen y precio por hora ─── */
  var mg = $('[data-margen]');
  if (mg) (function () {
    function calc() {
      var c = Math.max(0, num($('[data-coste]', mg))), m = Math.min(95, Math.max(0, num($('[data-pct]', mg)))) / 100;
      var pv = c / (1 - m), rec = c * (1 + m), mreal = rec ? (rec - c) / rec * 100 : 0;
      $('[data-pv]', mg).textContent = eur(pv);
      $('[data-pv-iva]', mg).textContent = 'Con IVA del 21 %: ' + eur(pv * 1.21);
      $('[data-aviso]', mg).textContent = m ? 'Ojo: si solo le sumas un ' + Math.round(m * 100) + ' % al coste (' + eur(rec) + '), tu margen real es del ' + mreal.toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' %.' : '';
    }
    mg.addEventListener('input', calc); calc();
  })();
  var ho = $('[data-hora]');
  if (ho) (function () {
    function calc() {
      var s = num($('[data-sueldo]', ho)), g = num($('[data-gastos]', ho)), h = Math.max(1, num($('[data-horas]', ho))), im = Math.min(90, num($('[data-improd]', ho))) / 100;
      var hmes = h * 4.33 * (1 - im), ph = hmes ? (s + g) / hmes : 0;
      $('[data-ph]', ho).textContent = eur(ph);
      $('[data-ph-txt]', ho).textContent = 'Facturas unas ' + Math.round(hmes) + ' horas al mes de las ' + Math.round(h * 4.33) + ' que trabajas. A menos de ' + eur(ph) + ' la hora, pierdes dinero.';
    }
    ho.addEventListener('input', calc); calc();
  })();

  /* ─── 4 · Presupuesto de obra ─── */
  var pz = $('[data-presu]');
  if (pz) (function () {
    var KEY = 'opspilot-presupuesto', tb = $('[data-partidas]', pz);
    var EJEMPLO = [['Demolición de alicatado y retirada de escombros', 'm²', 24, 9.5], ['Fontanería: tomas de agua y desagües del baño', 'ud', 1, 420], ['Plato de ducha de resina 120×80, colocado', 'ud', 1, 390], ['Alicatado de paredes con azulejo cerámico', 'm²', 24, 38], ['Mueble de lavabo con espejo, montado', 'ud', 1, 310]];
    var fila = function (p) {
      p = p || ['', 'ud', 1, 0];
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><input data-c="d" aria-label="Descripción de la partida" placeholder="Descripción de la partida"></td>' +
        '<td><select data-c="u" aria-label="Unidad"><option>ud</option><option>m²</option><option>m</option><option>m³</option><option>h</option><option>pa</option></select></td>' +
        '<td><input data-c="q" type="number" inputmode="decimal" step="0.01" min="0" aria-label="Cantidad"></td>' +
        '<td><input data-c="p" type="number" inputmode="decimal" step="0.01" min="0" aria-label="Precio"></td>' +
        '<td class="pz-imp">0,00 €</td><td class="hz-noprint"><button type="button" class="pz-quitar" aria-label="Quitar partida">×</button></td>';
      $('[data-c="d"]', tr).value = p[0]; $('[data-c="u"]', tr).value = p[1]; $('[data-c="q"]', tr).value = p[2]; $('[data-c="p"]', tr).value = p[3];
      tb.appendChild(tr);
    };
    function calc() {
      var base = 0;
      $$('tr', tb).forEach(function (tr) { var i = num($('[data-c="q"]', tr)) * num($('[data-c="p"]', tr)); base += i; $('.pz-imp', tr).textContent = eur(i); });
      var t = +$('[data-k="iva"]', pz).value / 100;
      $('[data-tbase]', pz).textContent = eur(base); $('[data-tiva]', pz).textContent = eur(base * t); $('[data-ttotal]', pz).textContent = eur(base * (1 + t));
      guardar();
    }
    function guardar() {
      try {
        var d = { k: {}, p: $$('tr', tb).map(function (tr) { return ['d', 'u', 'q', 'p'].map(function (c) { return $('[data-c="' + c + '"]', tr).value; }); }) };
        $$('[data-k]', pz).forEach(function (el) { d.k[el.dataset.k] = el.value; });
        localStorage.setItem(KEY, JSON.stringify(d));
      } catch (e) {}
    }
    function cargar(d) {
      tb.innerHTML = '';
      if (d && d.k) $$('[data-k]', pz).forEach(function (el) { if (d.k[el.dataset.k] != null) el.value = d.k[el.dataset.k]; });
      (d && d.p && d.p.length ? d.p : [null, null, null]).forEach(fila);
      calc();
    }
    var guardado = null; try { guardado = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    var f = $('[data-k="fecha"]', pz); if (!f.value) f.value = new Date().toISOString().slice(0, 10);
    cargar(guardado);
    pz.addEventListener('input', calc); pz.addEventListener('change', calc);
    tb.addEventListener('click', function (e) { if (e.target.classList.contains('pz-quitar')) { e.target.closest('tr').remove(); calc(); } });
    $('[data-mas]', pz).addEventListener('click', function () { fila(); calc(); $('tr:last-child [data-c="d"]', tb).focus(); });
    $('[data-ejemplo]', pz).addEventListener('click', function () { $('[data-k="titulo"]', pz).value = 'Reforma de baño'; $('[data-k="iva"]', pz).value = '10'; tb.innerHTML = ''; EJEMPLO.forEach(fila); calc(); });
    $('[data-borrar]', pz).addEventListener('click', function () { try { localStorage.removeItem(KEY); } catch (e) {} $$('[data-k]', pz).forEach(function (el) { if (el.dataset.k !== 'iva' && el.dataset.k !== 'cond' && el.dataset.k !== 'fecha') el.value = ''; }); cargar(null); });
    /* PDF: una copia de la hoja solo con texto (los campos se cortan y dejan huecos al imprimir) */
    $('[data-pdf]', pz).addEventListener('click', function () {
      var hoja = $('.pz-hoja', pz).cloneNode(true), orig = $$('input,select,textarea', $('.pz-hoja', pz));
      $$('input,select,textarea', hoja).forEach(function (el, i) {
        var o = orig[i], v = o.tagName === 'SELECT' ? o.options[o.selectedIndex].text : o.value;
        if (o.type === 'date' && v) v = v.split('-').reverse().join('/');
        if (o.type === 'number' && v !== '') v = (+v).toLocaleString('es-ES', { maximumFractionDigits: 2, minimumFractionDigits: o.dataset.c === 'p' ? 2 : 0 }) + (o.dataset.c === 'p' ? ' €' : '');
        var t = document.createElement(o.tagName === 'TEXTAREA' ? 'div' : 'span');
        t.className = el.className + ' pz-txt'; t.textContent = v; el.replaceWith(t);
      });
      $$('.hz-noprint', hoja).forEach(function (x) { x.remove(); });
      var cont = document.createElement('div'); cont.id = 'pz-print'; cont.className = 'solo-imprimir'; cont.appendChild(hoja);
      document.body.appendChild(cont);
      window.print();
      setTimeout(function () { cont.remove(); }, 500);
    });
  })();

  /* ─── común: QR (generador MIT de Kazuhiko Arase, /js/qrcode.min.js) en un canvas descargable ─── */
  function pintarQR(caja, texto, descargar) {
    if (!window.qrcode) return false;
    var q = window.qrcode(0, 'M'); q.addData(texto); q.make();
    var n = q.getModuleCount(), m = 4, t = 10, c = document.createElement('canvas');
    c.width = c.height = (n + m * 2) * t;
    var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = '#0F1620';
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + m) * t, (r + m) * t, t, t);
    c.setAttribute('role', 'img'); c.setAttribute('aria-label', 'Código QR de ' + texto);
    caja.innerHTML = ''; caja.appendChild(c);
    if (descargar) descargar.href = c.toDataURL('image/png');
    return c;
  }
  var copiar = function (txt, btn) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(txt).then(function () { var o = btn.textContent; btn.textContent = 'Copiado'; setTimeout(function () { btn.textContent = o; }, 1600); });
  };

  /* ─── listas que se van marcando (Google Maps paso a paso, preguntas antes de firmar) ─── */
  $$('[data-checklist]').forEach(function (cl) {
    var KEY = 'opspilot-check-' + cl.dataset.checklist, cajas = $$('input[type=checkbox]', cl);
    var hecho = $('[data-hecho]', cl), barra = $('[data-barra]', cl), fin = $('[data-fin]', cl);
    var marcadas = []; try { marcadas = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
    cajas.forEach(function (c, i) { c.checked = marcadas.indexOf(i) > -1; });
    function pintar() {
      var on = cajas.filter(function (c) { return c.checked; }).length;
      if (hecho) hecho.textContent = on + ' de ' + cajas.length;
      if (barra) barra.style.transform = 'scaleX(' + (on / cajas.length) + ')';
      if (fin) fin.hidden = on < cajas.length;
      try { localStorage.setItem(KEY, JSON.stringify(cajas.map(function (c, i) { return c.checked ? i : -1; }).filter(function (i) { return i > -1; }))); } catch (e) {}
    }
    cl.addEventListener('change', pintar); pintar();
  });

  /* ─── reseñas: enlace + QR + cartel + mensajes ─── */
  var rs = $('[data-resenas]');
  if (rs) (function () {
    var neg = $('[data-negocio]', rs), en = $('[data-enlace]', rs), est = $('[data-estado]', rs), qr = $('[data-qr]', rs), acc = $('[data-qr-acciones]', rs);
    var msgs = $('[data-mensajes]', rs), msg = $('[data-msg]', rs), wa = $('[data-wa]', rs), url = '';
    var MSG = [
      'Hola, te escribimos de {n}. Gracias por confiar en nosotros. Si te ha gustado el trabajo, nos ayudaría mucho que lo contaras en Google, es un minuto: {u}',
      'Hola, te escribimos de {n}. ¿Qué tal todo después de ayer? Si estás contento, una reseña en Google nos ayuda a que nos encuentren otros vecinos: {u}',
      'Hola, te escribimos de {n}. Llevamos tiempo trabajando juntos y nos ayudaría mucho tu opinión en Google. Aquí tienes el enlace directo: {u} ¡Gracias!'
    ];
    var normal = function (v) {
      v = v.trim(); if (!v) return '';
      if (/^ChIJ[\w-]{10,}$/.test(v)) return 'https://search.google.com/local/writereview?placeid=' + v;
      if (!/^https?:\/\//.test(v)) v = 'https://' + v;
      try { var h = new URL(v).hostname; return /(^|\.)(g\.page|google\.[a-z.]+|goo\.gl)$/.test(h) ? v : ''; } catch (e) { return ''; }
    };
    function pintar() {
      url = normal(en.value);
      var nombre = neg.value.trim();
      if (!en.value.trim()) { est.textContent = 'Pega tu enlace y aquí aparece todo lo demás.'; msgs.hidden = true; acc.hidden = true; return; }
      if (!url) { est.textContent = 'Ese enlace no parece de Google. Usa el de «Pedir reseñas» de tu ficha, o tu Place ID (empieza por ChIJ).'; msgs.hidden = true; acc.hidden = true; return; }
      est.textContent = 'Listo: este enlace abre directamente la ventana para escribir la reseña' + (nombre ? ' de ' + nombre : '') + '.';
      if (pintarQR(qr, url, $('[data-descargar]', rs))) acc.hidden = false;
      var t = MSG[+radio(rs, 'tono')].replace('{n}', nombre || 'nuestro negocio').replace('{u}', url);
      msg.textContent = t; wa.href = 'https://wa.me/?text=' + encodeURIComponent(t); msgs.hidden = false;
    }
    rs.addEventListener('input', pintar); rs.addEventListener('change', pintar);
    $('[data-copiar-msg]', rs).addEventListener('click', function (e) { copiar(msg.textContent, e.currentTarget); });
    $('[data-cartel]', rs).addEventListener('click', function () {
      var c = $('canvas', qr); if (!c) return;
      var d = document.createElement('div'); d.className = 'solo-imprimir hz-cartel';
      d.innerHTML = '<p class="hz-cartel-t">¿Te ha gustado?</p><p class="hz-cartel-s">Cuéntalo en Google. Es un minuto y nos ayuda mucho.</p><img alt="" src="' + c.toDataURL('image/png') + '"><p class="hz-cartel-n"></p><p class="hz-cartel-p">Apunta con la cámara del móvil al código</p>';
      $('.hz-cartel-n', d).textContent = neg.value.trim();
      document.body.appendChild(d); window.print(); setTimeout(function () { d.remove(); }, 500);
    });
  })();

  /* ─── respuestas a reseñas ─── */
  var rp = $('[data-respuestas]');
  if (rp) (function () {
    var R = {
      5: [['¡Muchas gracias, {c}! Nos alegra mucho que hayas quedado contento con {t}. Aquí nos tienes para lo que necesites. {f}', 'Gracias a ti, {c}, por confiar en nosotros para {t}. Da gusto trabajar así. Un saludo. {f}'], 'Corta y personal. Nombrar el trabajo ayuda a que otros sepan qué haces.'],
      4: [['Gracias por tu reseña, {c}. Nos alegra que te gustara {t}. Si hay algo que podamos mejorar para la próxima, cuéntanoslo: lo tendremos en cuenta. {f}', 'Muchas gracias, {c}. Nos quedamos con lo bueno de {t} y con las ganas de llegar a las cinco estrellas la próxima vez. {f}'], 'Agradece y deja la puerta abierta a saber qué faltó.'],
      3: [['Gracias por contarlo, {c}. Sentimos que {t} no fuera del todo como esperabas. Nos gustaría saber qué podemos mejorar: escríbenos o llámanos y lo hablamos. {f}', 'Gracias por tu opinión, {c}. Queremos que quedes contento del todo con {t}: cuéntanos qué pasó y vemos cómo solucionarlo. {f}'], 'Una reseña de tres estrellas suele ser recuperable: invita a hablar en privado.'],
      retraso: [['{c}, tienes razón: {t} se alargó más de lo que te dijimos, y lo sentimos. No es como queremos trabajar. Escríbenos y te explicamos qué pasó. {f}', 'Sentimos el retraso con {t}, {c}. Ya hemos cambiado cómo planificamos para que no se repita. Si quieres, lo hablamos por teléfono. {f}'], 'Reconoce el retraso sin excusas largas y explica qué cambias.'],
      precio: [['Gracias por tu opinión, {c}. Entendemos que el precio de {t} te pareció alto. Damos el presupuesto cerrado y por escrito antes de empezar; si quieres, lo repasamos juntos partida a partida. {f}', '{c}, gracias por contarlo. Nuestro precio incluye materiales y garantía, pero entendemos que cada uno lo valora distinto. Si quieres, lo hablamos en privado. {f}'], 'No discutas la cifra en público: explica qué incluye y ofrece repasarlo en privado.'],
      trato: [['{c}, sentimos mucho cómo te sentiste. No es la forma en que queremos tratar a nadie. Nos gustaría saber qué pasó exactamente: llámanos o escríbenos y lo hablamos. {f}', 'Lamentamos lo que cuentas, {c}. Nos importa mucho cómo atendemos y queremos entenderlo bien: escríbenos, por favor. {f}'], 'Pide perdón por cómo se sintió, sin entrar a discutir quién dijo qué.'],
      calidad: [['{c}, sentimos que {t} no quedara como esperabas. Queremos revisarlo contigo: llámanos y pasamos a verlo. {f}', 'Gracias por avisarnos, {c}. Si algo de {t} no está bien, lo revisamos sin compromiso. Escríbenos y quedamos. {f}'], 'Ofrecer ir a verlo convence a quien lee más que cualquier explicación.'],
      falsa: [['Hola, {c}. No encontramos tu nombre entre nuestros clientes ni ningún trabajo que coincida con lo que cuentas. Si has trabajado con nosotros, escríbenos y lo aclaramos. {f}', 'Hola, {c}. No tenemos registrado ningún trabajo que coincida con esta reseña. Si se trata de un error, escríbenos y lo revisamos con gusto. {f}'], 'Responde con calma y denúnciala desde tu Perfil de Empresa como contenido que incumple las normas.']
    };
    var v = 0, out = $('[data-respuesta]', rp), con = $('[data-consejo]', rp), mot = $('[data-motivos]', rp);
    function pintar() {
      var e = radio(rp, 'est'); mot.hidden = e !== '1';
      var x = R[e === '1' ? radio(rp, 'mot') : e];
      var c = $('[data-cliente]', rp).value.trim(), t = $('[data-trabajo]', rp).value.trim() || 'el trabajo', f = $('[data-firma]', rp).value.trim();
      var txt = x[0][v % x[0].length].replace(/\{t\}/g, t).replace(/\{f\}/g, f ? '— ' + f : '');
      txt = c ? txt.replace(/\{c\}/g, c) : txt.replace(/,? ?\{c\}/g, '').replace(/^, ?/, '').replace(/ ,/g, ',');
      txt = txt.replace(/\s+/g, ' ').trim().replace(/^[a-záéíóúñ]/, function (m) { return m.toUpperCase(); });
      out.textContent = txt; con.textContent = x[1];
    }
    rp.addEventListener('input', pintar); rp.addEventListener('change', function () { v = 0; pintar(); });
    $('[data-otra]', rp).addEventListener('click', function () { v++; pintar(); });
    $('[data-copiar-r]', rp).addEventListener('click', function (e) { copiar(out.textContent, e.currentTarget); });
    pintar();
  })();

  /* ─── enlace de WhatsApp ─── */
  var wg = $('[data-wagen]');
  if (wg) (function () {
    var tel = $('[data-tel]', wg), txt = $('[data-txt]', wg), en = $('[data-enlace-wa]', wg), cod = $('[data-codigo]', wg), qr = $('[data-qr]', wg), acc = $('[data-qr-acciones]', wg), url = '';
    function pintar() {
      var n = tel.value.replace(/[^\d]/g, '').replace(/^00/, '');
      if (n.length === 9 && /^[6789]/.test(n)) n = '34' + n;
      if (n.length < 10) { en.textContent = 'Pon tu número.'; cod.textContent = ''; acc.hidden = true; url = ''; return; }
      url = 'https://wa.me/' + n + (txt.value.trim() ? '?text=' + encodeURIComponent(txt.value.trim()) : '');
      en.textContent = url; $('[data-probar]', wg).href = url;
      cod.textContent = '<a href="' + url + '" target="_blank" rel="noopener" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#25D366;color:#fff;font-weight:700;text-decoration:none">Escríbenos por WhatsApp</a>';
      if (pintarQR(qr, url, $('[data-descargar]', wg))) acc.hidden = false;
    }
    wg.addEventListener('input', pintar);
    $('[data-copiar-enlace]', wg).addEventListener('click', function (e) { if (url) copiar(url, e.currentTarget); });
    $('[data-copiar-codigo]', wg).addEventListener('click', function (e) { if (url) copiar(cod.textContent, e.currentTarget); });
    pintar();
  })();

  /* ─── ¿Te afecta Verifactu? (norma vigente: RD-ley 15/2025) ─── */
  var vf = $('[data-verifactu]');
  if (vf) (function () {
    var ver = $('[data-vf-veredicto]', vf), tx = $('[data-vf-texto]', vf);
    function poner(res, a, b) { ver.textContent = a; tx.textContent = b; vf.dataset.res = res; }
    function pintar() {
      var t = radio(vf, 'terr'), c = radio(vf, 'como'), s = radio(vf, 'sii'), f = radio(vf, 'forma');
      $$('[data-hito]', vf).forEach(function (h) { h.classList.remove('tuyo'); });
      if (t === 'foral') return poner('no', 'No con esta norma.', 'En el País Vasco y Navarra rige su propia normativa foral (en el País Vasco, TicketBAI). Consúltalo con tu gestoría.');
      if (c === 'talonario') return poner('no', 'No te afecta.', 'Si haces las facturas a mano, sin ningún programa, el reglamento no se te aplica.');
      if (c === 'excel') return poner('no', 'En principio, no te afecta.', 'Si usas Excel o Word solo para escribir, imprimir y guardar las facturas, la Agencia Tributaria dice que no te afecta. Si tu plantilla numera sola o tiene macros, coméntalo con tu gestoría.');
      if (s === 'si') return poner('no', 'No te afecta.', 'Quien ya cumple con el SII queda fuera de este reglamento.');
      if (!t || !c || !s || !f) return poner('', 'Sigue contestando.', '');
      var soc = f === 'sociedad';
      $('[data-hito="' + (soc ? 'soc' : 'aut') + '"]', vf).classList.add('tuyo');
      poner('si', 'Sí te afecta: antes del ' + (soc ? '1 de enero de 2027' : '1 de julio de 2027') + '.', 'Es la fecha de la norma vigente. Pide a tu proveedor que te confirme que su programa está adaptado (su «declaración responsable») y actualízalo antes. Hacienda ha anunciado que quiere retrasarlo a octubre de 2028, pero aún no está en el BOE.');
    }
    vf.addEventListener('change', pintar);
  })();

  /* ─── comparador de presupuestos de web a 3 años ─── */
  var cp = $('[data-compara]');
  if (cp) (function () {
    function pintar() {
      var ofs = $$('[data-oferta]', cp).map(function (o) { return { o: o, t: Math.max(0, num($('[data-ini]', o))) + Math.max(0, num($('[data-mes]', o))) * 36 }; });
      var max = Math.max.apply(null, ofs.map(function (x) { return x.t; })) || 1;
      var min = Math.min.apply(null, ofs.map(function (x) { return x.t; }));
      ofs.forEach(function (x) {
        $('[data-tot]', x.o).textContent = eur(x.t);
        $('[data-barra-o]', x.o).style.transform = 'scaleX(' + (x.t / max) + ')';
        x.o.classList.toggle('barata', x.t === min);
      });
    }
    cp.addEventListener('input', pintar); pintar();
  })();
})();
