/* LDT · números e valores por extenso em português, inglês e espanhol */
(function (w) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt;

  /* ---------- Inglês ---------- */
  var EU = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var ET = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function en999(n) {
    var o = [];
    if (n >= 100) { o.push(EU[Math.floor(n / 100)] + ' hundred'); n %= 100; }
    if (n >= 20) { o.push(ET[Math.floor(n / 10)] + (n % 10 ? '-' + EU[n % 10] : '')); } else if (n > 0) o.push(EU[n]);
    return o.join(' ');
  }
  function en(n) {
    if (n === 0) return 'zero';
    var sc = ['', ' thousand', ' million'], out = [], i = 0, g;
    while (n > 0) { g = n % 1000; n = Math.floor(n / 1000); if (g) out.unshift(en999(g) + sc[i]); i++; }
    return out.join(' ');
  }

  /* ---------- Espanhol ---------- */
  var SU = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  var ST = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  var SC = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  function apo(s) { return s.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un'); }
  function es999(n) {
    if (n === 100) return 'cien';
    var o = [], r = n % 100;
    if (n >= 100) o.push(SC[Math.floor(n / 100)]);
    if (r >= 30) o.push(ST[Math.floor(r / 10)] + (r % 10 ? ' y ' + SU[r % 10] : '')); else if (r > 0) o.push(SU[r]);
    return o.join(' ');
  }
  function es(n, noApo) {
    if (n === 0) return 'cero';
    var out = [], m = Math.floor(n / 1e6), k = Math.floor((n % 1e6) / 1000), r = n % 1000;
    if (m) out.push(m === 1 ? 'un millón' : apo(es999(m)) + ' millones');
    if (k) out.push(k === 1 ? 'mil' : apo(es999(k)) + ' mil');
    if (r) out.push(noApo ? es999(r) : apo(es999(r)));
    return out.join(' ');
  }

  function int(n, lang, noApo) {
    n = Math.floor(Number(n) || 0);
    if (n < 0 || n >= 1e9) return '';
    return lang === 'en' ? en(n) : lang === 'es' ? es(n, noApo) : F.inteiro(n);
  }

  var CUR = {
    pt: { BRL: ['real', 'reais', 'centavo', 'centavos'], USD: ['dólar norte-americano', 'dólares norte-americanos', 'centavo', 'centavos'], EUR: ['euro', 'euros', 'centavo', 'centavos'] },
    en: { BRL: ['Brazilian real', 'Brazilian reais', 'cent', 'cents'], USD: ['US dollar', 'US dollars', 'cent', 'cents'], EUR: ['euro', 'euros', 'cent', 'cents'] },
    es: { BRL: ['real brasileño', 'reales brasileños', 'centavo', 'centavos'], USD: ['dólar estadounidense', 'dólares estadounidenses', 'centavo', 'centavos'], EUR: ['euro', 'euros', 'céntimo', 'céntimos'] }
  };
  var AND = { pt: ' e ', en: ' and ', es: ' con ' }, OF = { pt: ' de ', en: ' ', es: ' de ' };

  /** Valor monetário por extenso. */
  function cur(v, moeda, lang) {
    lang = CUR[lang] ? lang : 'pt'; moeda = CUR[lang][moeda] ? moeda : 'BRL';
    v = Math.round((Number(v) || 0) * 100) / 100;
    if (v <= 0) return '';
    var c = CUR[lang][moeda], r = Math.floor(v), cents = Math.round((v - r) * 100), out = [];
    if (r > 0) {
      var exactM = r >= 1e6 && r % 1e6 === 0 && lang !== 'en';
      out.push(int(r, lang) + (exactM ? OF[lang] : ' ') + (r === 1 ? c[0] : c[1]));
    }
    if (cents > 0) out.push(int(cents, lang) + ' ' + (cents === 1 ? c[2] : c[3]));
    return out.join(AND[lang]);
  }
  /** "10 (ten) days" */
  function nParen(n, unit, lang, fem) {
    var e = int(n, lang); n = Math.floor(Number(n) || 0);
    if (fem && e && lang === 'pt') e = e.replace(/\bum\b/g, 'uma').replace(/\bdois\b/g, 'duas');
    if (fem && e && lang === 'es') e = e.replace(/uno\b/g, 'una');
    return n + (e ? ' (' + e + ')' : '') + (unit ? ' ' + unit : '');
  }
  L.words = { int: int, cur: cur, nParen: nParen };
})(window);
