/* LDT · interface: ícones, toasts, modais, formulários e download */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {});
  var esc = L.fmt.esc;

  /* Ícones inline (traço 24x24, estilo Lucide). Uma única biblioteca, tamanhos consistentes. */
  var ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    contract: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8.5 17c1.2-2.4 2.2-2.4 3 0s1.8 1.6 3.5-.8"/><path d="M9 12h6"/>',
    settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5M5 21h14"/>',
    printer: '<path d="M6 9V3h12v6M6 18H4v-7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7h-2"/><rect x="6" y="14" width="12" height="7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16v4M17 18h4"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h7V3M8 21v-7h8v7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check2: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    building: '<path d="M4 21V5l8-2v18M12 9h8v12M7 9h2M7 13h2M7 17h2M15 13h2M15 17h2"/>'
  };
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">' +
    Object.keys(ICONS).map(function (k) { return '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; }).join('') + '</svg>';
  function icon(name, cls) { return '<svg class="i ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function mountSprite() { if (!d.getElementById('ldt-sprite')) { var s = d.createElement('div'); s.id = 'ldt-sprite'; s.innerHTML = sprite; d.body.insertBefore(s, d.body.firstChild); } }

  /* Toasts (região aria-live) */
  function toast(msg, type) {
    var box = d.getElementById('toasts');
    if (!box) { box = d.createElement('div'); box.id = 'toasts'; box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); d.body.appendChild(box); }
    var t = d.createElement('div'); t.className = 'toast ' + (type || 'ok');
    t.innerHTML = icon(type === 'err' ? 'alert' : type === 'warn' ? 'alert' : 'check2') + '<span>' + esc(L.i18n ? L.i18n.t(msg) : msg) + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function () { t.remove(); }, 320); }, 3600);
  }

  /* Modal de confirmação acessível (sem alert/confirm nativos) */
  function confirmBox(o) {
    var tr = L.i18n ? L.i18n.t : function (x) { return x; };
    o = { title: tr(o.title), text: tr(o.text || ''), ok: tr(o.ok || 'Confirmar'), cancel: tr(o.cancel || 'Cancelar'), danger: o.danger };
    return new Promise(function (resolve) {
      var prev = d.activeElement;
      var back = d.createElement('div'); back.className = 'modal-back';
      back.innerHTML = '<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="m-t" aria-describedby="m-d"><h2 id="m-t">' + esc(o.title) + '</h2><p id="m-d">' + esc(o.text || '') + '</p>' +
        '<div class="modal-actions"><button class="btn btn-secondary" data-r="0">' + esc(o.cancel || 'Cancelar') + '</button><button class="btn ' + (o.danger ? 'btn-primary' : 'btn-primary') + '" data-r="1">' + esc(o.ok || 'Confirmar') + '</button></div></div>';
      function close(v) { d.removeEventListener('keydown', key); back.remove(); if (prev && prev.focus) prev.focus(); resolve(v); }
      function key(e) {
        if (e.key === 'Escape') close(false);
        if (e.key === 'Tab') { var f = back.querySelectorAll('button'); if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
      }
      back.addEventListener('click', function (e) { var b = e.target.closest('[data-r]'); if (b) close(b.dataset.r === '1'); else if (e.target === back) close(false); });
      d.addEventListener('keydown', key);
      d.body.appendChild(back);
      back.querySelector('[data-r="1"]').focus();
    });
  }

  function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; }

  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime || 'application/json' });
    var a = d.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    d.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  /**
   * Liga os campos [data-k] de um container a um objeto de estado.
   * Checkbox guarda '1' ou ''. Radios por nome. data-mask: doc | phone.
   */
  function bind(root, state, onChange) {
    var fields = [].slice.call(root.querySelectorAll('[data-k]'));
    function apply(f, v) {
      if (f.type === 'checkbox') f.checked = v === '1' || v === true;
      else if (f.type === 'radio') f.checked = f.value === v;
      else f.value = v == null ? '' : v;
    }
    function pull() { fields.forEach(function (f) { if (state[f.dataset.k] !== undefined) apply(f, state[f.dataset.k]); }); }
    function handler(e) {
      var f = e.target, k = f.dataset && f.dataset.k; if (!k) return;
      if (f.dataset.mask === 'doc') { var p = L.fmt.maskDoc(f.value); if (p !== f.value) f.value = p; }
      if (f.dataset.mask === 'phone') { var q = L.fmt.maskPhone(f.value); if (q !== f.value) f.value = q; }
      if (f.type === 'checkbox') state[k] = f.checked ? '1' : '';
      else if (f.type === 'radio') { if (f.checked) state[k] = f.value; }
      else state[k] = f.value;
      if (onChange) onChange(k, e);
    }
    root.addEventListener('input', handler);
    root.addEventListener('change', handler);
    pull();
    return { pull: pull, fields: fields };
  }

  L.ui = { icon: icon, mountSprite: mountSprite, toast: toast, confirm: confirmBox, debounce: debounce, download: download, bind: bind };
})(window, document);
