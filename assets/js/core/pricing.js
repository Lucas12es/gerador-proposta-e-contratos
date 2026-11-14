/* LDT · preço de venda: imposto da nota fiscal (interno) e taxa da TechFX */
(function (w) {
  'use strict';
  var L = (w.LDT = w.LDT || {});
  var num = function (x) { return L.fmt.num(x); };

  /** t = imposto da NF, p = taxa TechFX (% sobre a cobrança), o = outros custos %. */
  function ctx(cfg) { return { t: num(cfg.imp) / 100, p: num(cfg.techfx) / 100, o: num(cfg.oc) / 100 }; }
  function forward(g, c) {
    var imp = g * c.t, fee = g * c.p, oc = g * c.o;
    return { g: g, imp: imp, fee: fee, oc: oc, liq: g - imp - fee - oc };
  }
  function valid(c) { return c.t + c.p + c.o < 1; }
  function gross(liq, c) { var den = 1 - c.t - c.p - c.o; return den > 0 ? liq / den : NaN; }
  function roundUp(x, step) {
    if (!isFinite(x)) return x;
    return step > 0 ? Math.ceil(x / step - 1e-9) * step : Math.ceil(x * 100 - 1e-6) / 100;
  }
  /** Valor cobrado do cliente. modo "liq": calcula a partir do líquido desejado; "preco": o valor digitado é o preço. */
  function total(cfg) {
    var v = num(cfg.v1); if (v <= 0) return 0;
    if (cfg.modo === 'preco') return v;
    var g = roundUp(gross(v, ctx(cfg)), +cfg.arr || 0);
    return isFinite(g) ? g : 0;
  }
  L.pricing = { ctx: ctx, forward: forward, valid: valid, gross: gross, roundUp: roundUp, total: total };
})(window);
