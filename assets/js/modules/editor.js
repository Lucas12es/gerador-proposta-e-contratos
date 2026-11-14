/* LDT · utilitários comuns dos editores (zoom, abas mobile, impressão) */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {});

  function zoom(viewport, panel) {
    var z = 1, out = d.getElementById('z-val');
    function set(v) {
      z = Math.max(0.4, Math.min(1.6, v));
      viewport.style.zoom = z;
      out.textContent = Math.round(z * 100) + '%';
    }
    function fit() { set(Math.min(1, (panel.clientWidth - 48) / 794)); }
    d.getElementById('z-in').addEventListener('click', function () { set(z + 0.1); });
    d.getElementById('z-out').addEventListener('click', function () { set(z - 0.1); });
    d.getElementById('z-fit').addEventListener('click', fit);
    w.addEventListener('resize', L.ui.debounce(fit, 150));
    fit();
    return { fit: fit, set: set };
  }

  function tabs(editor) {
    var btns = [].slice.call(d.querySelectorAll('.mobile-tabs [data-tab]'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        editor.dataset.tab = b.dataset.tab;
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        w.scrollTo(0, 0);
      });
    });
  }

  function print(title) {
    var old = d.title; d.title = title;
    var back = function () { d.title = old; w.removeEventListener('afterprint', back); };
    w.addEventListener('afterprint', back);
    w.print();
  }

  function statusSelect(sel, tipo, value) {
    sel.innerHTML = L.store.STATUS[tipo].map(function (s) {
      return '<option value="' + s[0] + '">' + L.i18n.t(s[1]) + '</option>';
    }).join('');
    sel.value = value || 'rascunho';
  }

  L.editor = { zoom: zoom, tabs: tabs, print: print, statusSelect: statusSelect };
})(window, document);
