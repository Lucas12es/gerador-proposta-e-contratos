/* LDT · estrutura comum: menu lateral e área principal */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {});

  function mount(active) {
    var root = d.body.dataset.root || '';
    L.ui.mountSprite();
    var content = d.getElementById('content');
    var ic = L.ui.icon;
    var links = [
      ['painel', root + 'index.html', 'home', 'Painel'],
      ['proposta', root + 'proposta/index.html', 'file', 'Nova proposta'],
      ['contrato', root + 'contrato/index.html', 'contract', 'Novo contrato'],
      ['config', root + 'configuracoes/index.html', 'settings', 'Configurações']
    ];
    var nav = links.map(function (l, i) {
      return (i === 1 ? '<div class="nav-label">Documentos</div>' : i === 3 ? '<div class="nav-label">Sistema</div>' : '') +
        '<a href="' + l[1] + '"' + (l[0] === active ? ' aria-current="page"' : '') + '>' + ic(l[2]) + '<span>' + l[3] + '</span></a>';
    }).join('');
    var app = d.createElement('div'); app.className = 'app';
    app.innerHTML =
      '<a class="skip" href="#content">Ir para o conteúdo</a>' +
      '<aside class="sidebar"><a class="brand" href="' + root + 'index.html" aria-label="LDT, ir para o painel">' +
      '<span class="brand-mark"><img src="' + root + 'assets/img/logo-mark.webp" alt="" width="36" height="36"></span>' +
      '<span class="brand-text"><b>LDT</b><small>Propostas &amp; Contratos</small></span></a>' +
      '<nav class="nav" aria-label="Menu principal">' + nav + '</nav>' +
      '<div class="sidebar-foot"><label class="lang"><span class="sr-only">Idioma da interface</span><select id="ui-lang"><option value="pt">Português</option><option value="en">English</option><option value="es">Español</option></select></label>' +
      '<p>Seus dados ficam salvos neste navegador. Faça backup em Configurações.</p></div></aside>' +
      '<main class="main" id="main"></main>';
    d.body.insertBefore(app, d.body.firstChild.nextSibling);
    var main = app.querySelector('#main');
    if (content) { main.appendChild(content); }
    var sel = d.getElementById('ui-lang'); sel.value = L.i18n.get();
    sel.addEventListener('change', function () { L.i18n.set(sel.value); });
    L.i18n.title(); L.i18n.apply(app);
  }
  L.shell = { mount: mount };
})(window, document);
