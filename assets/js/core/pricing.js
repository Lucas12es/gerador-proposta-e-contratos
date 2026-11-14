/* LDT · preço de venda: imposto da nota fiscal (interno) e taxas do gateway (TechFX ou Asaas) */
(function (w) {
  'use strict';
  var L = (w.LDT = w.LDT || {});
  var num = function (x) { return L.fmt.num(x); };

  /** Parâmetros de custo. t = imposto da NF, o = outros custos %, p = taxa % do gateway, f = taxa fixa, a = antecipação %.
   *  Gateway "techfx": % sobre a cobrança. Gateway "asaas": depende do meio (pix, boleto, cartão) e das parcelas. */
  function ctx(cfg, gateway, meio, parc) {
    gateway = gateway || cfg.gateway || 'techfx'; meio = meio || cfg.meio || 'pix'; parc = parc || +cfg.parc || 1;
    var c = { t: num(cfg.imp) / 100, o: num(cfg.oc) / 100, p: 0, f: 0, a: 0, gateway: gateway };
    if (gateway === 'techfx') { c.p = num(cfg.techfx) / 100; return c; }
    if (meio === 'pix') c.f = num(cfg.fpix);
    else if (meio === 'boleto') c.f = num(cfg.fbol) * parc;
    else {
      c.f = num(cfg.fcar);
      c.p = num(parc <= 1 ? cfg.c1 : parc <= 6 ? cfg.c2 : cfg.c3) / 100;
      if (cfg.antic) c.a = num(cfg.fant) / 100 * ((parc + 1) / 2);
    }
    return c;
  }
  function forward(g, c) {
    var imp = g * c.t, fee = g * (c.p + c.a) + c.f, oc = g * c.o;
    return { g: g, imp: imp, fee: fee, oc: oc, liq: g - imp - fee - oc };
  }
  function valid(c) { return c.t + c.p + c.a + c.o < 1; }
  function gross(liq, c) { var den = 1 - c.t - c.p - c.a - c.o; return den > 0 ? (liq + c.f) / den : NaN; }
  function roundUp(x, step) {
    if (!isFinite(x)) return x;
    return step > 0 ? Math.ceil(x / step - 1e-9) * step : Math.ceil(x * 100 - 1e-6) / 100;
  }
  /** Valor cobrado do cliente. modo "liq": calcula a partir do líquido desejado; "preco": o valor digitado é o preço. */
  function total(cfg, c) {
    var v = num(cfg.v1); if (v <= 0) return 0;
    if (cfg.modo === 'preco') return v;
    var g = roundUp(gross(v, c || ctx(cfg)), +cfg.arr || 0);
    return isFinite(g) ? g : 0;
  }
  L.pricing = { ctx: ctx, forward: forward, valid: valid, gross: gross, roundUp: roundUp, total: total };
})(window);
