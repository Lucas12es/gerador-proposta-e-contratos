/* LDT · gerador de contratos */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt, S = L.store, esc = F.esc;

  var DEFAULTS = {
    idioma: 'pt', moeda: 'BRL', cliTipo: 'pj', cliNome: '', cliDoc: '', cliEnd: '', cliEmail: '', cliTel: '', cliRep: '', cliRepDoc: '',
    titulo: '', num: '', data: '', propostaNum: '', escopo: '',
    prazoDias: '20', diasConteudo: '5',
    valor: '', mensal: '', cMensal: '1', mensalItens: '', pagTipo: 'avista', pagParcelas: '1', pagEntradaPct: '', pagTexto: '', multaMora: '2', juros: '1', incluiTaxas: '',
    revisoes: '2', avisoPrevio: '7', multaRescisao: '20', cessao: 'pago', portfolio: '',
    cHosp: '', hosp: 'cliente', cSuporte: '1', suporteDias: '30', cConf: '1', cLgpd: '1', cLimit: '1', cExtras: '', extras: '',
    foro: '', cidade: '', assin: 'eletronica', test: ''
  };
  var st, emp, doc = null, dirty = false, pending = 0;
  var D = L.docs18n, W = L.words, t = L.i18n.t, tf = L.i18n.tf;

  function ph(txt) { pending++; return '<span class="ph-mark">' + esc(txt) + '</span>'; }
  function val(v, label) { return (v || '').trim() ? esc(v.trim()) : ph(label); }
  function blk(html, cls) { return { cls: cls || 'blk', html: html }; }

  function build() {
    pending = 0;
    var lang = D.C[st.idioma] ? st.idioma : 'pt', T = D.C[lang], fill = D.fill, PH = T.ph;
    var B = [], n = 0, pj = st.cliTipo === 'pj', moeda = st.moeda;
    var valor = F.num(st.valor), pTipo = st.pagTipo, parc = Math.max(1, Math.floor(F.num(st.pagParcelas)) || 1), entPct = F.num(st.pagEntradaPct);
    var money = function (v) { return esc(D.cur(v, moeda, lang)); };
    function cl(title) { n++; B.push(blk('<h3>' + T.clause + ' ' + n + ' · ' + title + '</h3>', 'blk cl')); }
    function p(html) { B.push(blk('<p>' + html + '</p>')); }
    function ul(items) { B.push(blk('<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>')); }
    var np = function (v, unit) { return W.nParen(v, unit, lang); };

    B.push(blk('<h1>' + T.title + '</h1><small>' + esc(st.titulo) + ' · ' + T.no + ' ' + esc(st.num) + (st.propostaNum ? ' · ' + T.proposal + ' ' + esc(st.propostaNum) : '') + '</small>', 'blk title'));

    p(fill(T.p1, { emp: esc(emp.nome), cnpj: emp.cnpj ? fill(T.cnpj, { v: esc(emp.cnpj) }) : '', sede: emp.endereco ? fill(T.sede, { v: esc(emp.endereco) }) : '',
      rep: emp.responsavel ? fill(T.rep, { n: esc(emp.responsavel), c: emp.cargo ? ', ' + esc(emp.cargo) : '' }) : '' }));
    var cliTxt = pj ? fill(T.cliPJ, { nome: val(st.cliNome, PH.cliPJ), doc: val(st.cliDoc, PH.cnpj), end: val(st.cliEnd, PH.end), rep: val(st.cliRep, PH.rep), repDoc: val(st.cliRepDoc, PH.repDoc) })
      : fill(T.cliPF, { nome: val(st.cliNome, PH.cliPF), doc: val(st.cliDoc, PH.cpf), end: val(st.cliEnd, PH.end) });
    p(fill(T.p2, { cli: cliTxt }));
    p(T.p3);

    cl(T.t_obj);
    p(fill(T.obj1, { t: esc(st.titulo) }));
    var itens = F.lines(st.escopo);
    if (itens.length) ul(itens.map(esc)); else p(ph(PH.scope));
    p(T.obj2 + (st.propostaNum ? fill(T.obj3, { n: esc(st.propostaNum) }) : ''));

    cl(T.t_ob1); ul(T.ob1);
    cl(T.t_ob2); ul(T.ob2.map(function (x) { return fill(x, { d: np(st.diasConteudo || '5', T.bd) }); }));

    cl(T.t_prazo); p(fill(T.prazo, { p: st.prazoDias ? np(st.prazoDias, T.bd) : ph(PH.prazo) }));

    cl(T.t_pag);
    var how, nTxt = np(parc, parc > 1 ? T.parcelas : T.parcela), ev = valor * entPct / 100, saldo = valor - ev;
    if (pTipo === 'entrada') how = fill(T.pEntrada, { entry: entPct > 0 ? fill(T.pEntry, { pct: D.pct(entPct, lang), v: money(ev) }) : T.pNoEntry, sv: valor > 0 ? ' ' + money(saldo) : '', n: nTxt, each: valor > 0 ? fill(T.pEach, { v: money(saldo / parc) }) : '' });
    else if (pTipo === 'cartao') how = fill(T.pCartao, { n: nTxt, each: valor > 0 && parc > 1 ? fill(T.pEach, { v: money(valor / parc) }) : '' });
    else if (pTipo === 'outro') how = T.pOutro;
    else if (pTipo === 'pix') how = T.pPix;
    else how = T.pAvista;
    var ext = W.cur(valor, moeda, lang);
    p(fill(T.pag1, { v: valor > 0 ? money(valor) + ' (' + esc(ext) + ')' : ph(PH.valor), how: how, taxes: st.incluiTaxas === '1' ? T.taxes : '' }));
    if ((st.pagTexto || '').trim()) p(esc(st.pagTexto.trim()));
    p(fill(T.late, { m: esc(st.multaMora || '0'), j: esc(st.juros || '0') }));

    cl(T.t_rev); p(fill(T.rev, { n: np(st.revisoes || '2', Number(st.revisoes) === 1 ? T.round : T.rounds) }));
    if (st.cMensal === '1') {
      var mv = F.num(st.mensal);
      cl(T.t_mens); p(fill(T.mens1, { v: mv > 0 ? money(mv) + ' (' + esc(W.cur(mv, moeda, lang)) + ')' : ph(PH.mensal) }));
      var mi = F.lines(st.mensalItens); if (mi.length) ul(mi.map(esc));
      p(T.mens2); p(fill(T.mens3, { d: np(st.avisoPrevio || '7', T.dd) }));
    } else if (st.cHosp === '1') { cl(T.t_host); p(st.hosp === 'incluso12' ? T.host_i : st.hosp === 'nao' ? T.host_n : T.host_c); }
    cl(T.t_ip); p(st.cessao === 'licenca' ? T.ip_l : T.ip_c); p(st.portfolio === '1' ? T.port_y : T.port_n);
    if (st.cSuporte === '1') { cl(T.t_sup); p(fill(T.sup, { d: np(st.suporteDias || '30', T.dd) })); }
    if (st.cConf === '1') { cl(T.t_conf); p(T.conf); }
    if (st.cLgpd === '1') { cl(T.t_lgpd); p(T.lgpd); }
    if (st.cLimit === '1') { cl(T.t_lim); p(T.lim); }
    if (st.cExtras === '1' && F.lines(st.extras).length) { cl(T.t_add); F.lines(st.extras).forEach(function (x) { p(esc(x)); }); }

    cl(T.t_res); p(fill(T.res, { a: np(st.avisoPrevio || '7', T.dd), m: esc(st.multaRescisao || '0') }));
    cl(T.t_gen); p(T.gen); p(st.assin === 'eletronica' ? T.sig_e : T.sig_p);
    cl(T.t_law); p(fill(T.law, { f: val(st.foro || emp.foro, PH.foro) }));

    p('<br>' + val(st.cidade, PH.cidade) + ', ' + esc(D.dateLong(st.data, lang)) + '.');
    var taxLbl = pj ? T.taxPJ : T.taxPF;
    var sg = '<div class="sign-grid"><div><span class="lbl">' + T.sA + '</span><br>' + esc(emp.nome) + '<small>' + (emp.cnpj ? 'CNPJ ' + esc(emp.cnpj) : '') + (emp.responsavel ? ' · ' + esc(emp.responsavel) : '') + '</small></div>' +
      '<div><span class="lbl">' + T.sB + '</span><br>' + (esc(st.cliNome) || ph(PH.cli)) + '<small>' + (st.cliDoc ? taxLbl + ' ' + esc(st.cliDoc) : '') + (pj && st.cliRep ? ' · ' + esc(st.cliRep) : '') + '</small></div>';
    if (st.test === '1') sg += '<div><span class="lbl">' + T.w1 + '</span><br>' + T.name + '<small>' + T.tax + '</small></div><div><span class="lbl">' + T.w2 + '</span><br>' + T.name + '<small>' + T.tax + '</small></div>';
    B.push(blk(sg + '</div>', 'blk sign'));
    return B;
  }

  /* Paginação em folhas A4 */
  var PAGE_H = 243 / 25.4 * 96 - 6;
  function paginate(blocks) {
    var m = d.getElementById('measure');
    m.innerHTML = '<div class="sheet contract" style="position:static;height:auto;min-height:0;width:170mm;box-shadow:none;overflow:visible;padding:0"><div class="body" id="mbody"></div></div>';
    var body = d.getElementById('mbody');
    body.innerHTML = blocks.map(function (b) { return '<div class="' + b.cls + '">' + b.html + '</div>'; }).join('');
    var hs = [].map.call(body.children, function (el) { return el.getBoundingClientRect().height; });
    var pages = [[]], used = 0;
    blocks.forEach(function (b, i) {
      var h = hs[i], next = blocks[i + 1], need = h;
      if (b.cls.indexOf('cl') > -1 && next) need += hs[i + 1];
      if (used + need > PAGE_H && pages[pages.length - 1].length) { pages.push([]); used = 0; }
      pages[pages.length - 1].push(b); used += h;
    });
    m.innerHTML = '';
    return pages;
  }

  function render() {
    var blocks = build(), pages = paginate(blocks), total = pages.length, T = D.C[D.C[st.idioma] ? st.idioma : 'pt'];
    var h = pages.map(function (pg, i) {
      return '<section class="sheet contract"><div class="topbar"></div><div class="ph"><img src="../assets/img/logo.webp" alt="LDT"><span>' + T.doc + ' ' + T.no + ' ' + esc(st.num) + (st.cliNome ? ' · ' + esc(st.cliNome) : '') + '</span></div>' +
        '<div class="pad"><div class="body">' + pg.map(function (b) { return '<div class="' + b.cls + '">' + b.html + '</div>'; }).join('') + '</div></div>' +
        '<div class="pf"><span>' + esc(emp.nome) + (emp.cnpj ? ' · CNPJ ' + esc(emp.cnpj) : '') + '</span><span>' + T.page + ' ' + (i + 1) + ' ' + T.of + ' ' + total + '</span></div></section>';
    }).join('');
    d.getElementById('doc').innerHTML = h;
    var pe = d.getElementById('pending');
    if (pending) { pe.hidden = false; pe.textContent = pending + (pending > 1 ? ' campos pendentes' : ' campo pendente'); } else pe.hidden = true;
    d.getElementById('bar-title').textContent = t(doc ? 'Contrato' : 'Novo contrato') + ' · ' + (st.num || '') + (st.cliNome ? ' · ' + st.cliNome : '');
    // rótulos e visibilidade conforme o tipo
    var pj = st.cliTipo === 'pj';
    d.getElementById('l-cliNome').textContent = t(pj ? 'Razão social' : 'Nome completo');
    d.getElementById('l-cliDoc').textContent = pj ? 'CNPJ / ' + t('ID fiscal') : 'CPF / ' + t('documento');
    d.getElementById('rep-box').style.display = pj ? '' : 'none';
    d.getElementById('f-parc').style.display = (st.pagTipo === 'cartao' || st.pagTipo === 'entrada') ? '' : 'none';
    d.getElementById('f-ent').style.display = st.pagTipo === 'entrada' ? '' : 'none';
    var v = F.num(st.valor); d.getElementById('valor-ext').textContent = v > 0 ? W.cur(v, st.moeda, st.idioma) : '';
    var s = F.docStatus(st.cliDoc), hint = d.getElementById('cliDoc-hint');
    hint.textContent = (st.idioma === 'pt' && (st.cliTipo === 'pj' || true)) ? t(s === 'invalido' ? 'Documento com dígitos verificadores inválidos. Confira.' : s === 'incompleto' ? 'Documento incompleto.' : '') : '';
  }

  function snapshot() {
    return { id: doc && doc.id, tipo: 'contrato', titulo: st.titulo + (st.cliNome ? ' · ' + st.cliNome : ''), cliente: st.cliNome, valorNum: F.num(st.valor), status: d.getElementById('status').value, dados: JSON.parse(JSON.stringify(st)), criadoEm: doc && doc.criadoEm };
  }
  function save(silent) {
    var s = S.docs.save(snapshot());
    if (!s) { L.ui.toast('Não foi possível salvar neste navegador.', 'err'); return null; }
    doc = s; dirty = false; S.draft.clear('contrato');
    history.replaceState(null, '', 'index.html?id=' + encodeURIComponent(doc.id));
    d.getElementById('save-state').textContent = 'Salvo';
    if (silent !== true) L.ui.toast('Contrato salvo no Painel');
    return s;
  }

  function init() {
    L.shell.mount('contrato'); L.ia.mount('contrato');
    emp = S.empresa();
    var id = (w.location.search.match(/[?&]id=([^&]+)/) || [])[1];
    if (id) doc = S.docs.get(decodeURIComponent(id));
    var fin = S.fin(), k; st = {};
    for (k in DEFAULTS) st[k] = DEFAULTS[k];
    st.idioma = fin.idioma || 'pt'; st.moeda = fin.moeda || 'BRL';
    st.titulo = D.DEF[st.idioma].titulo; st.escopo = D.DEF[st.idioma].cEscopo; st.mensalItens = D.DEF[st.idioma].mensalItens;
    var src = doc ? doc.dados : S.draft.get('contrato'), hand = !doc ? S.handoff.take('contrato') : null;
    if (src) for (k in src) st[k] = src[k];
    if (hand) { for (k in hand) st[k] = hand[k]; d.getElementById('handoff-note').hidden = false; d.getElementById('handoff-num').textContent = hand.propostaNum || ''; }
    if (!st.data) st.data = F.today();
    if (!st.num) st.num = S.docs.nextNumber('contrato');
    if (!st.foro) st.foro = emp.foro || '';

    L.editor.statusSelect(d.getElementById('status'), 'contrato', doc && doc.status);
    L.editor.tabs(d.getElementById('content'));
    var zm = L.editor.zoom(d.getElementById('doc'), d.getElementById('preview-panel'));
    var saveDraft = L.ui.debounce(function () { if (!doc) S.draft.set('contrato', st); d.getElementById('save-state').textContent = t(doc ? (dirty ? 'Alterações não salvas' : 'Salvo') : 'Rascunho automático'); }, 400);
    var bind = L.ui.bind(d.getElementById('form-panel'), st, function (key, e) {
      if (key === 'idioma') {
        var old = e.target.dataset.prev || 'pt';
        if (st.titulo === D.DEF[old].titulo) st.titulo = D.DEF[st.idioma].titulo;
        if (st.escopo === D.DEF[old].cEscopo) st.escopo = D.DEF[st.idioma].cEscopo;
        if (st.mensalItens === D.DEF[old].mensalItens) st.mensalItens = D.DEF[st.idioma].mensalItens;
        e.target.dataset.prev = st.idioma; bind.pull();
      }
      dirty = true; render(); saveDraft();
    });
    d.querySelector('[data-k=idioma]').dataset.prev = st.idioma;
    d.getElementById('btn-salvar').addEventListener('click', function () { save(); });
    d.getElementById('status').addEventListener('change', function () { if (doc) { S.docs.setStatus(doc.id, this.value); L.ui.toast('Status atualizado'); } else save(); });
    d.getElementById('btn-pdf').addEventListener('click', function () { L.editor.print(D.C[st.idioma].doc + ' ' + st.num + ' - ' + (st.cliNome || 'Cliente')); });
    d.getElementById('btn-novo').addEventListener('click', function () {
      L.ui.confirm({ title: 'Novo contrato?', text: 'Os campos serão limpos. O que já foi salvo continua no Painel.', ok: 'Começar novo' }).then(function (ok) { if (ok) { S.draft.clear('contrato'); w.location.href = 'index.html'; } });
    });
    w.addEventListener('beforeunload', function (e) { if (doc && dirty) { e.preventDefault(); e.returnValue = ''; } });
    render(); zm.fit(); saveDraft();
  }
  d.addEventListener('DOMContentLoaded', init);
})(window, document);
