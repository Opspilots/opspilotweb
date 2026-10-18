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
      var cont = document.createElement('div'); cont.id = 'pz-print'; cont.appendChild(hoja);
      document.body.appendChild(cont);
      window.print();
      setTimeout(function () { cont.remove(); }, 500);
    });
  })();
})();
