/* LDT · idioma da interface (pt, en, es). As chaves são os próprios textos em português. */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {});
  var LANGS = ['pt', 'en', 'es'];
  var lang = (L.store && L.store.read('uilang', null)) || null;
  if (LANGS.indexOf(lang) < 0) {
    var nav = String((w.navigator && w.navigator.language) || 'pt').slice(0, 2);
    lang = LANGS.indexOf(nav) >= 0 ? nav : 'pt';
  }
  var DICT = L.dict || {};
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];

  function t(s) {
    if (lang === 'pt' || s == null) return s;
    var m = DICT[lang]; return (m && m[s]) || s;
  }
  /** t com variáveis: tf('{n} documento(s)', {n: 3}) */
  function tf(s, v) { return t(s).replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? v[k] : m; }); }

  function apply(root) {
    if (lang === 'pt') return;
    root = root || d.body;
    var walker = d.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = walker.nextNode())) {
      var p = n.parentNode && n.parentNode.nodeName;
      if (p === 'SCRIPT' || p === 'STYLE' || p === 'NOSCRIPT') continue;
      if (n.parentNode.closest && n.parentNode.closest('.sheet, .measure')) continue;
      list.push(n);
    }
    list.forEach(function (node) {
      var raw = node.nodeValue, key = raw.trim();
      if (!key) return;
      var tr = DICT[lang] && DICT[lang][key];
      if (tr) node.nodeValue = raw.replace(key, tr);
    });
    [].forEach.call(root.querySelectorAll('*'), function (el) {
      if (el.closest('.sheet, .measure')) return;
      ATTRS.forEach(function (a) {
        var v = el.getAttribute(a); if (v && DICT[lang] && DICT[lang][v]) el.setAttribute(a, DICT[lang][v]);
      });
    });
  }
  function title() {
    var v = d.title; if (lang !== 'pt' && DICT[lang] && DICT[lang][v]) d.title = DICT[lang][v];
  }
  /** Troca o idioma da interface e leva junto o idioma dos documentos novos e dos rascunhos (documentos já salvos mantêm o seu idioma). */
  function set(l) {
    if (LANGS.indexOf(l) < 0) return;
    L.store.write('uilang', l);
    try {
      var fin = L.store.fin(); fin.idioma = l; L.store.saveFin(fin);
      ['proposta', 'contrato'].forEach(function (tp) { var dr = L.store.draft.get(tp); if (dr) { dr.idioma = l; L.store.draft.set(tp, dr); } });
    } catch (e) { /* segue com a troca da interface */ }
    w.location.reload();
  }

  d.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  L.i18n = { t: t, tf: tf, apply: apply, title: title, set: set, get: function () { return lang; }, LANGS: LANGS };
})(window, document);
