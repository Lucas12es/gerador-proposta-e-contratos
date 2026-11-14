/* LDT · calculadora de preço (TechFX e Asaas) */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt, S = L.store, P = L.pricing, D = L.docs18n, esc = F.esc, t = L.i18n.t, tf = L.i18n.tf;

  function init() {
    L.shell.mount('calc'); L.ia.mount('calculadora');
    var st = S.fin(), saved = S.read('calc', null), k;
    st.v1 = ''; st.modo = 'liq';
    if (saved) for (k in saved) st[k] = saved[k];
    var ui = L.i18n.get();
    function money(n) { return D.cur(n, st.moeda, ui); }

    function render() {
      var c = P.ctx(st), asaas = c.gateway === 'asaas', box = d.getElementById('calcOut'), cmp = d.getElementById('cmpOut');
      d.getElementById('asaasBox').style.display = asaas ? '' : 'none';
      d.getElementById('f-parc').style.display = st.meio === 'pix' ? 'none' : '';
      d.getElementById('f-antic').style.display = st.meio === 'cartao' ? '' : 'none';
      var v = F.num(st.v1), total = P.total(st, c), step = +st.arr || 0, liqMode = st.modo !== 'preco';
      cmp.innerHTML = '';
      d.getElementById('use').disabled = !(total > 0);
      if (!P.valid(c)) { box.innerHTML = '<p class="hint warn">' + t('Os percentuais somam 100% ou mais. Revise imposto e taxas.') + '</p>'; return; }
      if (!(total > 0)) { box.innerHTML = '<p class="hint">' + t('Preencha o valor para ver o resultado.') + '</p>'; return; }
      var r = P.forward(total, c), pct = r.liq / r.g * 100;
      var ln = function (a, b, cls, vars) { return '<div class="ln' + (cls ? ' ' + cls : '') + '"><span>' + tf(a, vars) + '</span><span>' + b + '</span></div>'; };
      var feeLbl = asaas ? (c.a > 0 ? '(–) Taxa Asaas + antecipação' : '(–) Taxa Asaas') : '(–) Taxa TechFX ({p})';
      var parc = asaas && st.meio !== 'pix' && +st.parc > 1 ? ln('Parcelas', '<b>' + (+st.parc) + 'x ' + esc(money(total / +st.parc)) + '</b>') : '';
      box.innerHTML = '<div class="calc-card" style="margin-top:0">' +
        ln('Cobrar do cliente', '<b>' + esc(money(total)) + '</b>') + parc +
        ln('(–) Imposto da nota fiscal ({p})', esc(money(r.imp)), '', { p: D.pct(c.t * 100, ui) }) +
        ln(feeLbl, esc(money(r.fee)), '', { p: D.pct(c.p * 100, ui) }) +
        (r.oc > 0 ? ln('(–) Outros custos', esc(money(r.oc))) : '') +
        ln('Você recebe (líquido)', esc(money(r.liq)) + ' · ' + D.pct(pct, ui), 'tot') + '</div>';
      var opts = [['TechFX', 'techfx', 'pix', 1], ['Asaas · Pix', 'asaas', 'pix', 1], ['Asaas · Boleto', 'asaas', 'boleto', 1], ['Asaas · Cartão 1x', 'asaas', 'cartao', 1], ['Asaas · Cartão até 6x', 'asaas', 'cartao', 6], ['Asaas · Cartão até 12x', 'asaas', 'cartao', 12]];
      cmp.innerHTML = '<table class="ct"><tr><th>' + t('Forma') + '</th><th>' + t(liqMode ? 'Cobrar' : 'Preço') + '</th><th>' + t('Líquido') + '</th></tr>' + opts.map(function (o) {
        var cc = P.ctx(st, o[1], o[2], o[3]), g = liqMode ? P.roundUp(P.gross(v, cc), step) : v, rr = P.forward(g, cc);
        return '<tr><td>' + o[0] + '</td><td>' + esc(money(g)) + (o[3] > 1 ? '<br><small>' + o[3] + 'x ' + esc(money(g / o[3])) + '</small>' : '') + '</td><td>' + esc(money(rr.liq)) + '</td></tr>';
      }).join('') + '</table>';
      L.i18n.apply(box); L.i18n.apply(cmp);
    }
    var persist = L.ui.debounce(function () { S.write('calc', st); }, 400);
    L.ui.bind(d.getElementById('calc'), st, function () { render(); persist(); });
    d.getElementById('use').addEventListener('click', function () {
      var total = P.total(st, P.ctx(st));
      if (!(total > 0)) return;
      S.handoff.set('proposta', { v1: F.money(total), modo: 'preco', moeda: st.moeda, gateway: st.gateway, meio: st.meio, parc: st.parc, antic: st.antic, imp: st.imp, techfx: st.techfx, oc: st.oc });
      w.location.href = '../proposta/index.html';
    });
    d.getElementById('use-opts').addEventListener('click', function () {
      var v = F.num(st.v1); if (!(v > 0)) return;
      var liq = st.modo === 'liq' ? v : P.forward(v, P.ctx(st)).liq;
      S.handoff.set('proposta', { opcoes: '1', liqAlvo: F.money(liq), moeda: st.moeda, antic: st.antic, imp: st.imp, oc: st.oc, arr: st.arr });
      w.location.href = '../proposta/index.html';
    });
    render();
  }
  d.addEventListener('DOMContentLoaded', init);
})(window, document);
