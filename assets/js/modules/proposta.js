/* LDT · gerador de propostas (PT, EN, ES) */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt, S = L.store, P = L.pricing, D = L.docs18n, esc = F.esc, t = L.i18n.t, tf = L.i18n.tf;
  var TEXT_KEYS = ['titulo', 'obj', 'objs', 'escopo', 'mensalItens', 'crono', 'prazo'];

  var st, emp, doc = null, root, pendingEl, dirty = false, totalNow = 0, pend = 0;
  var SHAPES = '<svg class="shapes" viewBox="0 0 210 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="210,0 210,95 120,0" fill="#C8282A"/><polygon points="210,0 150,0 210,60" fill="#222222"/><polygon points="210,95 210,150 165,110" fill="#6B7280"/><polygon points="120,0 150,0 210,60 210,95" fill="#A71F22"/><polygon points="175,70 210,95 210,120" fill="#222222" opacity=".85"/></svg>';

  function mark(txt) { pend++; return '<span class="ph-mark">' + esc(txt) + '</span>'; }
  function cfg() { return st; }
  function money(n) { return D.cur(n, st.moeda, st.idioma); }

  function header(T) {
    var who = st.cliEmp || st.cliente;
    return '<div class="topbar"></div><div class="ph"><img src="../assets/img/logo.webp" alt="LDT"><span>' + esc(T.doc) + ' ' + esc(st.num) + (who ? ' · ' + esc(who) : '') + '</span></div>';
  }
  function footer(T, n) {
    return '<div class="pf"><span>' + esc(emp.nome) + (emp.cnpj ? ' · CNPJ ' + esc(emp.cnpj) : '') + '</span><span>' + [emp.email, emp.tel].filter(Boolean).map(esc).concat(T.page + ' ' + n).join(' · ') + '</span></div>';
  }

  function render() {
    pend = 0;
    var T = D.P[st.idioma] || D.P.pt, fill = D.fill;
    totalNow = P.total(st);
    var cliName = st.cliEmp || st.cliente;
    var cli = cliName ? '<b>' + esc(cliName) + '</b>' : mark(T.client);
    var h = '';

    h += '<section class="sheet cover">' + SHAPES + '<img class="logo" src="../assets/img/logo.webp" alt="LDT">' +
      '<div class="ttl"><div class="k">' + fill(T.kicker, { num: esc(st.num) }) + '</div><h1>' + esc(st.titulo) + '</h1><div class="bar"></div></div>' +
      '<div class="client"><small>' + T.prepared + '</small><b class="nm">' + (cliName ? esc(cliName) : mark(T.client)) + '</b><div class="meta"><span>' + T.date + ': <b>' + esc(D.dateLong(st.data, st.idioma)) + '</b></span><span>' + T.valid + ': <b>' + esc(st.valid) + ' ' + T.days + '</b></span>' +
      (st.cliente && st.cliEmp ? '<span>' + T.ac + ': <b>' + esc(st.cliente) + '</b></span>' : '') + '</div></div>' +
      '<div class="contact">' + [emp.nome, emp.email, emp.tel, emp.site].filter(Boolean).map(esc).join(' · ') + '</div></section>';

    var rows = F.pairs(st.escopo).map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('');
    var objs = F.lines(st.objs), mensalNow = F.num(st.mensal), mItens = F.lines(st.mensalItens);
    h += '<section class="sheet">' + header(T) + '<div class="pad"><div class="eb">' + T.e1 + '</div><h2>' + T.h1 + '</h2>' +
      '<p>' + fill(T.intro, { nome: esc(st.cliente || T.contactFallback), cli: cli, obj: esc(st.obj) || mark(T.goal) }) + '</p>' +
      (objs.length ? '<h3>' + T.objs + '</h3><ul class="b">' + objs.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      (st.publico.trim() ? '<h3>' + T.audience + '</h3><p>' + esc(st.publico) + '</p>' : '') +
      '<div class="sp"></div><div class="eb">' + T.e2 + '</div><h2>' + T.h2 + '</h2><h3>' + (mensalNow > 0 ? '1 · ' : '') + T.sMain + '</h3><table class="t"><tr><th>' + T.thDeliv + '</th><th>' + T.thDet + '</th></tr>' + rows + '</table>' +
      '<p class="note">' + T.outScope + '</p></div>' + footer(T, 2) + '</section>';

    var ent = Math.min(Math.max(F.num(st.ent), 0), 100), pn = Math.floor(F.num(st.pn)), parc = '';
    if (totalNow > 0 && (pn >= 1 || ent > 0)) {
      var ev = totalNow * ent / 100, saldo = totalNow - ev, rw = [];
      if (ent > 0) rw.push([fill(T.entry, { pct: D.pct(ent, st.idioma) }), money(ev)]);
      if (pn >= 1 && saldo > 0) rw.push([fill(ent > 0 ? T.balance : T.instal, { n: pn }), money(saldo / pn)]);
      parc = '<table class="t" style="margin-top:4mm"><tr><th>' + T.thPay + '</th><th class="r">' + T.thVal + '</th></tr>' + rw.map(function (r) { return '<tr><td style="width:auto;font-weight:500">' + esc(r[0]) + '</td><td class="r"><b>' + esc(r[1]) + '</b></td></tr>'; }).join('') + '</table>';
    }
    var liqAlvo = F.num(st.liqAlvo), opcoesOn = st.opcoes === '1' && liqAlvo > 0, optTable = '';
    if (opcoesOn) {
      var ocfg = {}; for (var kk in st) ocfg[kk] = st[kk]; ocfg.modo = 'liq'; ocfg.v1 = String(liqAlvo);
      var rowsO = [[T.optPix, P.total(ocfg, P.ctx(ocfg, 'asaas', 'pix', 1)), 0]];
      for (var n = 1; n <= 6; n++) rowsO.push([fill(T.optCard, { n: n }), P.total(ocfg, P.ctx(ocfg, 'asaas', 'cartao', n)), n]);
      optTable = '<table class="t"><tr><th>' + T.thPay + '</th><th class="r">' + T.thVal + '</th><th class="r">' + T.thInst + '</th></tr>' + rowsO.map(function (r) {
        return '<tr><td style="width:auto;font-weight:500"><span class="cb"></span> ' + esc(r[0]) + '</td><td class="r" style="white-space:nowrap"><b>' + esc(money(r[1])) + '</b></td><td class="r" style="white-space:nowrap">' + (r[2] > 1 ? r[2] + 'x ' + esc(money(r[1] / r[2])) : '—') + '</td></tr>';
      }).join('') + '</table><p class="note" style="margin-top:2mm">' + T.optNote + '</p>';
      totalNow = rowsO[0][1];
    }
    var totalHtml = totalNow > 0 ? esc(money(totalNow)) : mark(T.amount);
    var steps = F.pairs(st.crono).map(function (r, i) { return '<div class="step"><div class="n">' + (i + 1) + '</div><div class="a">' + esc(r[0]) + '</div><div class="d">' + esc(r[1]) + '</div></div>'; }).join('');
    var cronoBlock = '<div class="eb">' + T.e4 + '</div><h2>' + T.h4 + '</h2>' + steps +
      (st.prazo ? '<p style="margin-top:4mm">' + fill(T.term, { prazo: esc(st.prazo) }) + '</p>' : '');
    h += '<section class="sheet">' + header(T) + '<div class="pad"><div class="eb">' + T.e3 + '</div><h2>' + T.h3 + '</h2>' +
      (opcoesOn ? '<h3 style="margin-top:0">' + (mensalNow > 0 ? T.totalOne : T.total) + '</h3>' + optTable : '<div class="total"><span>' + (mensalNow > 0 ? T.totalOne : T.total) + '</span><b>' + totalHtml + '</b></div>' + parc) +
      (mensalNow > 0 ? '<div class="total" style="margin-top:4mm"><span>' + T.totalMonth + '</span><b>' + esc(money(mensalNow)) + '<small style="font-size:.55em;font-weight:500"> ' + T.perMonth + '</small></b></div><p class="note" style="margin-top:2mm">' + T.monthNote + '</p>' + (mItens.length ? '<h3 style="margin-top:4mm">' + T.sMonth + '</h3><ul class="b" style="columns:2;column-gap:8mm;font-size:.92em">' + mItens.map(function (x) { return '<li style="break-inside:avoid">' + esc(x) + '</li>'; }).join('') + '</ul>' : '') : '') +
      ((st.obsv || '').trim() ? '<p class="note" style="margin-top:3mm">' + esc(st.obsv) + '</p>' : '') +
      (opcoesOn ? '' : '<div class="sp"></div>' + cronoBlock) + '</div>' + footer(T, 3) + '</section>';

    var hasPay = F.lines(st.pag).length > 0 || F.lines(st.termos).length > 0;
    var pagLi = F.lines(st.pag).map(function (l) { var i = l.indexOf(':'); return i > 0 && i < 28 ? '<li><b>' + esc(l.slice(0, i + 1)) + '</b>' + esc(l.slice(i + 1)) + '</li>' : '<li>' + esc(l) + '</li>'; }).join('');
    var payBlock = hasPay ? '<div class="eb">' + T.e5 + '</div><h2>' + T.h5 + '</h2><ul class="b">' + pagLi + '<li><b>' + T.validity + ':</b> ' + esc(st.valid) + ' ' + T.calDays + '</li></ul>' +
      (F.lines(st.termos).length ? '<h3>' + T.terms + '</h3><ul class="b">' + F.lines(st.termos).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') : '';
    var nextBlock = '<div class="eb">' + (hasPay ? '06' : '05') + ' · ' + T.next + '</div><h2>' + T.h6 + '</h2><p>' + T.start + '</p>' +
      '<div class="box"><p><span class="cb"></span> ' + (opcoesOn ? T.acceptOpt : fill(T.accept, { total: totalHtml }).replace(/\.$/, '')) + (mensalNow > 0 ? fill(T.acceptM, { m: esc(money(mensalNow)) }) : '') + '.' + '</p></div>' +
      '<div class="sig" style="margin-top:8mm"><div>' + esc(emp.responsavel) + '<br><small>' + esc(emp.nome) + '</small></div><div>' + (esc(st.cliente) || '&nbsp;') + '<br><small>' + (esc(st.cliEmp) || T.clientWord) + '</small></div></div>' +
      '<p class="note" style="margin-top:6mm">' + T.place + ': ______________________, ____ / ____ / ________</p>' +
      '<div class="thanks"><b>' + T.thanks + '</b><span>' + fill(T.questions, { c: [emp.email, emp.tel, emp.site].filter(Boolean).map(esc).join(' · ') }) + '</span></div></div>';
    if (opcoesOn) {
      if (hasPay) {
        h += '<section class="sheet">' + header(T) + '<div class="pad">' + cronoBlock + '<div class="sp"></div>' + payBlock + '</div>' + footer(T, 4) + '</section>';
        h += '<section class="sheet">' + header(T) + '<div class="pad">' + nextBlock + '</div>' + footer(T, 5) + '</section>';
      } else {
        h += '<section class="sheet">' + header(T) + '<div class="pad">' + cronoBlock + '<div class="sp"></div>' + nextBlock + '</div>' + footer(T, 4) + '</section>';
      }
    } else {
      h += '<section class="sheet">' + header(T) + '<div class="pad">' + payBlock + (hasPay ? '<div class="sp"></div>' : '') + nextBlock + '</div>' + footer(T, 4) + '</section>';
    }

    root.innerHTML = h;
    if (pend) { pendingEl.hidden = false; pendingEl.textContent = tf(pend > 1 ? '{n} campos pendentes' : '{n} campo pendente', { n: pend }); } else pendingEl.hidden = true;
    d.getElementById('bar-title').textContent = t(doc ? 'Proposta' : 'Nova proposta') + ' · ' + (st.num || '') + (cliName ? ' · ' + cliName : '');
  }

  function snapshot() {
    st.totalNum = totalNow;
    var cli = st.cliEmp || st.cliente;
    return { id: doc && doc.id, tipo: 'proposta', titulo: st.titulo + (cli ? ' · ' + cli : ''), cliente: cli, valorNum: totalNow, moeda: st.moeda, status: d.getElementById('status').value, dados: JSON.parse(JSON.stringify(st)), criadoEm: doc && doc.criadoEm };
  }
  function save(silent) {
    var s = S.docs.save(snapshot());
    if (!s) { L.ui.toast('Não foi possível salvar neste navegador.', 'err'); return null; }
    doc = s; dirty = false; S.draft.clear('proposta');
    history.replaceState(null, '', 'index.html?id=' + encodeURIComponent(doc.id));
    d.getElementById('save-state').textContent = t('Salva');
    if (silent !== true) L.ui.toast('Proposta salva no Painel');
    return s;
  }

  /** Troca para o idioma do documento todo texto que ainda é o padrão de QUALQUER idioma (textos editados são preservados). */
  function localize(legacy) {
    TEXT_KEYS.forEach(function (x) { if (D.isDef(x, st[x], legacy)) st[x] = D.DEF[st.idioma][x]; });
  }
  function init() {
    L.shell.mount('proposta'); L.ia.mount('proposta');
    emp = S.empresa();
    var fin = S.fin(), k;
    var id = (w.location.search.match(/[?&]id=([^&]+)/) || [])[1];
    if (id) doc = S.docs.get(decodeURIComponent(id));
    var idi = fin.idioma || 'pt', src = doc ? doc.dados : S.draft.get('proposta');
    st = { idioma: idi, moeda: fin.moeda || 'BRL', cliente: '', cliEmp: '', num: '', data: '', valid: '15', publico: '', v1: '', mensal: '', opcoes: '', liqAlvo: '', modo: 'preco', ent: '', pn: '', obsv: '', pag: '', termos: '',
      imp: fin.imp, regime: fin.regime, techfx: fin.techfx, oc: fin.oc, arr: fin.arr,
      gateway: fin.gateway, meio: fin.meio, parc: fin.parc, antic: fin.antic, fpix: fin.fpix, fbol: fin.fbol, fcar: fin.fcar, c1: fin.c1, c2: fin.c2, c3: fin.c3, fant: fin.fant };
    TEXT_KEYS.forEach(function (x) { st[x] = D.DEF[idi][x]; });
    if (src) for (k in src) st[k] = src[k];
    var hand = !doc ? S.handoff.take('proposta') : null;
    if (hand) for (k in hand) st[k] = hand[k];
    localize(!doc);
    if (!st.data) st.data = F.today();
    if (!st.num) st.num = S.docs.nextNumber('proposta');

    root = d.getElementById('doc'); pendingEl = d.getElementById('pending');
    L.editor.statusSelect(d.getElementById('status'), 'proposta', doc && doc.status);
    L.editor.tabs(d.getElementById('content'));
    var zm = L.editor.zoom(root, d.getElementById('preview-panel'));
    var saveDraft = L.ui.debounce(function () { if (!doc) S.draft.set('proposta', st); d.getElementById('save-state').textContent = t(doc ? (dirty ? 'Alterações não salvas' : 'Salva') : 'Rascunho automático'); }, 400);
    var b = L.ui.bind(d.getElementById('form-panel'), st, function (key, e) {
      if (key === 'idioma') {
        var old = e.target.dataset.prev || idi;
        localize();
        e.target.dataset.prev = st.idioma; b.pull();
      }
      dirty = true; render(); saveDraft();
    });
    d.querySelector('[data-k=idioma]').dataset.prev = st.idioma;
    d.getElementById('btn-salvar').addEventListener('click', function () { save(); });
    d.getElementById('status').addEventListener('change', function () { if (doc) { S.docs.setStatus(doc.id, this.value); L.ui.toast('Status atualizado'); } else save(); });
    d.getElementById('btn-pdf').addEventListener('click', function () { L.editor.print((D.P[st.idioma] || D.P.pt).doc + ' ' + String(st.num).replace('/', '-') + ' - ' + (st.cliEmp || st.cliente || 'Cliente')); });
    d.getElementById('btn-contrato').addEventListener('click', function () {
      if (!save(true)) return;
      S.handoff.set('contrato', L.bridge.propostaToContrato(st));
      w.location.href = '../contrato/index.html';
    });
    d.getElementById('btn-novo').addEventListener('click', function () {
      L.ui.confirm({ title: 'Nova proposta?', text: 'Os campos serão limpos para uma nova proposta. O que já foi salvo continua no Painel.', ok: 'Começar nova' }).then(function (ok) {
        if (!ok) return; S.draft.clear('proposta'); w.location.href = 'index.html';
      });
    });
    w.addEventListener('beforeunload', function (e) { if (doc && dirty) { e.preventDefault(); e.returnValue = ''; } });
    render(); zm.fit(); saveDraft();
  }
  d.addEventListener('DOMContentLoaded', init);
})(window, document);
