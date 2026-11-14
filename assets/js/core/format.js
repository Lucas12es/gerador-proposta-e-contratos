/* LDT · formatação e utilitários de texto */
(function (w) {
  'use strict';
  var L = (w.LDT = w.LDT || {});

  var ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ENT[c]; }); }
  function lines(s) { return String(s || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); }
  function pairs(s) {
    return lines(s).map(function (l) {
      var i = l.indexOf('|');
      return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    });
  }

  /** Converte texto digitado ("R$ 1.234,56", "1234.5") em número. */
  function num(s) {
    s = String(s == null ? '' : s).replace(/[^\d,.\-]/g, '');
    if (!s) return 0;
    if (s.indexOf(',') >= 0 && s.indexOf('.') >= 0) {
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.'); else s = s.replace(/,/g, '');
    } else if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    else if (!/\.\d{1,2}$/.test(s)) s = s.replace(/\./g, '');
    var v = parseFloat(s);
    return isFinite(v) ? v : 0;
  }
  var nf = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function BRL(n) { return nf.format(isFinite(n) ? n : 0).replace(/ /g, ' '); }
  function money(n) { return (isFinite(n) ? n : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function PCT(n) { return (isFinite(n) ? n : 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '%'; }
  function pad(n, w2) { n = String(n); while (n.length < w2) n = '0' + n; return n; }

  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function today() { var t = new Date(); return t.getFullYear() + '-' + pad(t.getMonth() + 1, 2) + '-' + pad(t.getDate(), 2); }
  function dateLong(iso) {
    if (!iso) return '';
    var p = iso.split('-'); if (p.length < 3) return iso;
    return parseInt(p[2], 10) + ' de ' + MESES[parseInt(p[1], 10) - 1] + ' de ' + p[0];
  }
  function dateShort(iso) {
    if (!iso) return '';
    var d = new Date(iso); if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /* ---------- Valor por extenso ---------- */
  var U = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  var D = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  var C = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  var ESC = [['', ''], ['mil', 'mil'], ['milhão', 'milhões'], ['bilhão', 'bilhões']];

  function ate999(n) {
    if (n === 0) return '';
    if (n === 100) return 'cem';
    var c = Math.floor(n / 100), r = n % 100, p = [];
    if (c) p.push(C[c]);
    if (r) {
      if (r < 20) p.push(U[r]);
      else { var d = Math.floor(r / 10), u = r % 10; p.push(D[d] + (u ? ' e ' + U[u] : '')); }
    }
    return p.join(' e ');
  }
  function inteiro(n) {
    if (n === 0) return 'zero';
    var parts = [], i = 0, g, t;
    while (n > 0 && i < ESC.length) {
      g = n % 1000; n = Math.floor(n / 1000);
      if (g) {
        if (i === 1 && g === 1) t = 'mil';
        else { t = ate999(g); if (i > 0) t += ' ' + (g === 1 ? ESC[i][0] : ESC[i][1]); }
        parts.unshift({ t: t, g: g });
      }
      i++;
    }
    var out = parts[0].t;
    for (var k = 1; k < parts.length; k++) {
      var last = k === parts.length - 1, p2 = parts[k];
      out += (last && (p2.g < 100 || p2.g % 100 === 0) ? ' e ' : ' ') + p2.t;
    }
    return out;
  }
  /** 1289.33 → "mil duzentos e oitenta e nove reais e trinta e três centavos" */
  function extenso(v) {
    v = Math.round((Number(v) || 0) * 100) / 100;
    if (v <= 0) return '';
    var r = Math.floor(v), c = Math.round((v - r) * 100), out = [];
    if (r > 0) out.push(inteiro(r) + (r % 1000000 === 0 && r >= 1000000 ? ' de reais' : (r === 1 ? ' real' : ' reais')));
    if (c > 0) out.push(inteiro(c) + (c === 1 ? ' centavo' : ' centavos'));
    return out.join(' e ');
  }
  /** Inteiros: 10 → "dez" (usado em "10 (dez) dias"). */
  function nExt(n) { n = Math.floor(Number(n) || 0); return n > 0 && n < 1e9 ? inteiro(n) : ''; }
  function nParen(n, unit) { var e = nExt(n); return n + (e ? ' (' + e + ')' : '') + (unit ? ' ' + unit : ''); }

  /* ---------- Documentos: máscaras e validação ---------- */
  function onlyDigits(s) { return String(s || '').replace(/\D/g, ''); }
  function maskDoc(s) {
    var d = onlyDigits(s).slice(0, 14);
    if (d.length <= 11) {
      return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  function maskPhone(s) {
    var d = onlyDigits(s).slice(0, 11);
    if (d.length <= 2) return d ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  function validCPF(s) {
    var d = onlyDigits(s); if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
    for (var t = 9; t < 11; t++) {
      var sum = 0; for (var i = 0; i < t; i++) sum += parseInt(d[i], 10) * (t + 1 - i);
      var dv = (sum * 10) % 11 % 10; if (dv !== parseInt(d[t], 10)) return false;
    }
    return true;
  }
  function validCNPJ(s) {
    var d = onlyDigits(s); if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
    function dv(len) {
      var sum = 0, pos = len - 7;
      for (var i = len; i >= 1; i--) { sum += parseInt(d[len - i], 10) * pos--; if (pos < 2) pos = 9; }
      var r = sum % 11; return r < 2 ? 0 : 11 - r;
    }
    return dv(12) === parseInt(d[12], 10) && dv(13) === parseInt(d[13], 10);
  }
  function docStatus(s) {
    var d = onlyDigits(s); if (!d) return 'vazio';
    if (d.length === 11) return validCPF(d) ? 'ok' : 'invalido';
    if (d.length === 14) return validCNPJ(d) ? 'ok' : 'invalido';
    return 'incompleto';
  }

  L.fmt = {
    inteiro: inteiro, esc: esc, lines: lines, pairs: pairs, num: num, BRL: BRL, money: money, PCT: PCT, pad: pad,
    today: today, dateLong: dateLong, dateShort: dateShort, extenso: extenso, nExt: nExt, nParen: nParen,
    onlyDigits: onlyDigits, maskDoc: maskDoc, maskPhone: maskPhone, docStatus: docStatus
  };
})(window);
