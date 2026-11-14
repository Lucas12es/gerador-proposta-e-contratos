/* LDT · ponte entre módulos: proposta → contrato */
(function (w) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt;

  /** Converte os dados de uma proposta em campos iniciais do contrato. */
  function propostaToContrato(d) {
    var D = L.docs18n, idi = d.idioma || 'pt', total = L.pricing.total(d);
    var pn = Math.floor(F.num(d.pn)), ent = F.num(d.ent), tipo = 'avista', parcelas = 1;
    if (pn >= 1 || ent > 0) { tipo = 'entrada'; parcelas = Math.max(pn, 1); }
    var prazoNum = (String(d.prazo || '').match(/\d+/) || [''])[0];
    var pj = !!(d.cliEmp && d.cliEmp.trim());
    return {
      idioma: idi, moeda: d.moeda || 'BRL', propostaNum: d.num || '',
      titulo: d.titulo || D.DEF[idi].titulo,
      cliTipo: pj ? 'pj' : 'pf',
      cliNome: (d.cliEmp || d.cliente || '').trim(),
      cliRep: pj ? (d.cliente || '').trim() : '',
      escopo: F.pairs(d.escopo).map(function (r) { return r[1] ? r[0] + ': ' + r[1] : r[0]; }).join('\n'),
      mensal: d.mensal || '', cMensal: F.num(d.mensal) > 0 ? '1' : '', mensalItens: d.mensalItens || D.DEF[idi].mensalItens,
      prazoDias: prazoNum,
      valor: total > 0 ? F.money(total) : '',
      pagTipo: tipo, pagParcelas: String(parcelas), pagEntradaPct: tipo === 'entrada' ? String(d.ent || '') : '', pagTexto: ''
    };
  }
  L.bridge = { propostaToContrato: propostaToContrato };
})(window);
