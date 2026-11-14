/* LDT · painel */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt, S = L.store, ic = L.ui.icon, esc = F.esc;
  var filtro = 'todos', busca = '';

  function statusInfo(tipo, st) {
    var arr = S.STATUS[tipo] || [], i;
    for (i = 0; i < arr.length; i++) if (arr[i][0] === st) return arr[i];
    return arr[0];
  }
  var t = L.i18n.t, tf = L.i18n.tf, D = L.docs18n;
  function sum(list) {
    var by = {};
    list.forEach(function (x) { if (x.valorNum) by[x.moeda || 'BRL'] = (by[x.moeda || 'BRL'] || 0) + x.valorNum; });
    var keys = Object.keys(by);
    return keys.length ? keys.map(function (m) { return D.cur(by[m], m, 'pt'); }).join(' + ') : D.cur(0, 'BRL', 'pt');
  }

  function kpis(all) {
    var pr = all.filter(function (x) { return x.tipo === 'proposta'; });
    var ct = all.filter(function (x) { return x.tipo === 'contrato'; });
    var env = pr.filter(function (x) { return x.status === 'enviada'; });
    var apr = pr.filter(function (x) { return x.status === 'aprovada'; });
    var ag = ct.filter(function (x) { return x.status === 'aguardando'; });
    var items = [
      ['file', 'Propostas', String(pr.length), tf('{n} enviada(s) aguardando resposta', { n: env.length })],
      ['wallet', 'Em negociação', sum(env), 'Soma das propostas enviadas'],
      ['check2', 'Aprovado', sum(apr), tf('{n} proposta(s) aprovada(s)', { n: apr.length })],
      ['contract', 'Contratos', String(ct.length), tf('{n} aguardando assinatura', { n: ag.length })]
    ];
    d.getElementById('kpis').innerHTML = items.map(function (k) {
      return '<div class="card kpi"><div class="k-icon">' + ic(k[0], 'i-lg') + '</div><div class="k-label">' + k[1] + '</div><div class="k-value">' + esc(k[2]) + '</div><div class="k-note">' + esc(k[3]) + '</div></div>';
    }).join('');
  }

  function rows(all) {
    var q = busca.trim().toLowerCase();
    var list = all.filter(function (x) {
      if (filtro !== 'todos' && x.tipo !== filtro) return false;
      if (!q) return true;
      return (x.titulo + ' ' + (x.cliente || '') + ' ' + ((x.dados && x.dados.num) || '')).toLowerCase().indexOf(q) >= 0;
    });
    var box = d.getElementById('list');
    if (!all.length) {
      box.innerHTML = '<div class="empty"><div class="e-ico">' + ic('file', 'i-lg') + '</div><h3>Nenhum documento salvo ainda</h3><p>Crie sua primeira proposta ou contrato. Eles ficam salvos aqui, neste navegador.</p>' +
        '<a class="btn btn-primary" href="proposta/index.html">' + ic('plus') + 'Nova proposta</a></div>';
      return;
    }
    if (!list.length) { box.innerHTML = '<div class="empty"><h3>Nada encontrado</h3><p>Tente outro filtro ou termo de busca.</p></div>'; return; }
    var tr = list.map(function (x) {
      var page = x.tipo === 'proposta' ? 'proposta' : 'contrato';
      var opts = S.STATUS[x.tipo].map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === x.status ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('');
      return '<tr data-id="' + x.id + '">' +
        '<td><div class="doc-title"><span class="doc-ico ' + x.tipo + '">' + ic(x.tipo === 'proposta' ? 'file' : 'contract') + '</span><div><a href="' + page + '/index.html?id=' + x.id + '">' + esc(x.titulo || 'Sem título') + '</a><small>' + t(x.tipo === 'proposta' ? 'Proposta' : 'Contrato') + ' · ' + esc((x.dados && x.dados.num) || '') + '</small></div></div></td>' +
        '<td>' + esc(x.cliente || '—') + '</td>' +
        '<td class="num">' + (x.valorNum ? esc(D.cur(x.valorNum, x.moeda || 'BRL', 'pt')) : '—') + '</td>' +
        '<td><select class="status-select" data-act="status" aria-label="Status de ' + esc(x.titulo || 'documento') + '">' + opts + '</select></td>' +
        '<td class="num">' + esc(F.dateShort(x.atualizadoEm)) + '</td>' +
        '<td><div class="row-actions">' +
        (x.tipo === 'proposta' ? '<button class="icon-btn" data-act="contrato" title="Gerar contrato desta proposta" aria-label="Gerar contrato desta proposta">' + ic('contract') + '</button>' : '') +
        '<button class="icon-btn" data-act="dup" title="Duplicar" aria-label="Duplicar">' + ic('copy') + '</button>' +
        '<button class="icon-btn danger" data-act="del" title="Excluir" aria-label="Excluir">' + ic('trash') + '</button></div></td></tr>';
    }).join('');
    box.innerHTML = '<div class="table-wrap"><table class="list"><thead><tr><th>Documento</th><th>Cliente</th><th>Valor</th><th>Status</th><th>Atualizado</th><th><span class="sr-only">Ações</span></th></tr></thead><tbody>' + tr + '</tbody></table></div>';
  }

  function render() { var all = S.docs.list(); kpis(all); rows(all); L.i18n.apply(d.getElementById('content')); }

  function init() {
    L.shell.mount('painel');
    var emp = S.empresa();
    d.getElementById('hero-name').textContent = emp.nome;
    d.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        filtro = b.dataset.filter;
        d.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        render();
      });
    });
    d.getElementById('q').addEventListener('input', L.ui.debounce(function (e) { busca = e.target.value; rows(S.docs.list()); L.i18n.apply(d.getElementById('list')); }, 120));
    var box = d.getElementById('list');
    box.addEventListener('change', function (e) {
      var sel = e.target.closest('[data-act=status]'); if (!sel) return;
      S.docs.setStatus(sel.closest('tr').dataset.id, sel.value); kpis(S.docs.list()); L.i18n.apply(d.getElementById('kpis'));
      L.ui.toast('Status atualizado');
    });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || b.tagName !== 'BUTTON') return;
      var id = b.closest('tr').dataset.id, doc = S.docs.get(id); if (!doc) return;
      if (b.dataset.act === 'dup') { S.docs.duplicate(id); render(); L.ui.toast('Documento duplicado'); }
      if (b.dataset.act === 'contrato') { S.handoff.set('contrato', L.bridge.propostaToContrato(doc.dados)); w.location.href = 'contrato/index.html'; }
      if (b.dataset.act === 'del') {
        L.ui.confirm({ title: 'Excluir documento?', text: tf('"{t}" será removido deste navegador. Essa ação não pode ser desfeita.', { t: doc.titulo || t('Sem título') }), ok: 'Excluir' }).then(function (ok) {
          if (ok) { S.docs.remove(id); render(); L.ui.toast('Documento excluído'); }
        });
      }
    });
    if (!S.persistent) L.ui.toast('Seu navegador bloqueou o armazenamento local. Os dados não serão salvos.', 'warn');
    render();
  }
  d.addEventListener('DOMContentLoaded', init);
})(window, document);
