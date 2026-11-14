/* LDT · armazenamento local (localStorage com fallback em memória) */
(function (w) {
  'use strict';
  var L = (w.LDT = w.LDT || {});
  var PREFIX = 'ldt:';
  var mem = {};
  var ls = null;
  try { ls = w.localStorage; ls.setItem('__t', '1'); ls.removeItem('__t'); } catch (e) { ls = null; }

  function read(k, def) {
    try {
      var raw = ls ? ls.getItem(PREFIX + k) : mem[k];
      return raw == null ? def : JSON.parse(raw);
    } catch (e) { return def; }
  }
  function write(k, v) {
    var raw = JSON.stringify(v);
    try { if (ls) ls.setItem(PREFIX + k, raw); else mem[k] = raw; return true; } catch (e) { return false; }
  }
  function del(k) { try { if (ls) ls.removeItem(PREFIX + k); else delete mem[k]; } catch (e) { /* noop */ } }

  var DEFAULT_EMPRESA = {
    nome: 'LDT Negócios & Soluções LTDA.', area: 'Design & Desenvolvimento Web',
    cnpj: '', email: '', tel: '', site: '', endereco: '', responsavel: '', cargo: '', foro: ''
  };
  var DEFAULT_FIN = {
    regime: '6', imp: '6', techfx: '0,5', oc: '0', arr: '1', moeda: 'BRL', idioma: 'pt'
  };
  var STATUS = {
    proposta: [['rascunho', 'Rascunho', ''], ['enviada', 'Enviada', 'info'], ['aprovada', 'Aprovada', 'ok'], ['recusada', 'Recusada', 'danger']],
    contrato: [['rascunho', 'Rascunho', ''], ['aguardando', 'Aguardando assinatura', 'warn'], ['assinado', 'Assinado', 'ok'], ['cancelado', 'Cancelado', 'danger']]
  };

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function merge(def, obj) { var o = {}, k; for (k in def) o[k] = def[k]; for (k in (obj || {})) o[k] = obj[k]; return o; }

  var docs = {
    list: function () {
      var a = read('docs', []);
      return a.sort(function (x, y) { return (y.atualizadoEm || '').localeCompare(x.atualizadoEm || ''); });
    },
    get: function (id) { return docs.list().filter(function (d) { return d.id === id; })[0] || null; },
    save: function (doc) {
      var all = read('docs', []), now = new Date().toISOString(), i;
      if (!doc.id) { doc.id = uid(); doc.criadoEm = now; }
      doc.atualizadoEm = now;
      for (i = 0; i < all.length; i++) if (all[i].id === doc.id) { all[i] = doc; break; }
      if (i === all.length) all.push(doc);
      return write('docs', all) ? doc : null;
    },
    remove: function (id) { write('docs', read('docs', []).filter(function (d) { return d.id !== id; })); },
    setStatus: function (id, status) {
      var all = read('docs', []);
      all.forEach(function (d) { if (d.id === id) { d.status = status; d.atualizadoEm = new Date().toISOString(); } });
      write('docs', all);
    },
    duplicate: function (id) {
      var d = docs.get(id); if (!d) return null;
      var c = JSON.parse(JSON.stringify(d));
      c.id = null; c.status = 'rascunho'; c.criadoEm = null;
      c.dados.num = docs.nextNumber(c.tipo);
      c.titulo = (c.titulo || '') + ' (cópia)';
      return docs.save(c);
    },
    /** Próximo número sequencial do ano: 001/2026 (proposta) · CT-2026-001 (contrato). */
    nextNumber: function (tipo) {
      var year = new Date().getFullYear(), max = 0;
      docs.list().filter(function (d) { return d.tipo === tipo; }).forEach(function (d) {
        var n = String((d.dados && d.dados.num) || ''), m = tipo === 'proposta' ? n.match(/^(\d+)\/(\d{4})$/) : n.match(/^CT-(\d{4})-(\d+)$/);
        if (!m) return;
        var y = parseInt(tipo === 'proposta' ? m[2] : m[1], 10), s = parseInt(tipo === 'proposta' ? m[1] : m[2], 10);
        if (y === year && s > max) max = s;
      });
      var seq = L.fmt.pad(max + 1, 3);
      return tipo === 'proposta' ? seq + '/' + year : 'CT-' + year + '-' + seq;
    }
  };

  L.store = {
    read: read, write: write, del: del, uid: uid, docs: docs, STATUS: STATUS, persistent: !!ls,
    empresa: function () { return merge(DEFAULT_EMPRESA, read('empresa', {})); },
    saveEmpresa: function (o) { return write('empresa', o); },
    fin: function () { return merge(DEFAULT_FIN, read('fin', {})); },
    saveFin: function (o) { return write('fin', o); },
    draft: {
      get: function (tipo) { return read('draft:' + tipo, null); },
      set: function (tipo, d) { return write('draft:' + tipo, d); },
      clear: function (tipo) { del('draft:' + tipo); }
    },
    handoff: {
      set: function (tipo, d) { write('handoff:' + tipo, d); },
      take: function (tipo) { var d = read('handoff:' + tipo, null); del('handoff:' + tipo); return d; }
    },
    exportAll: function () {
      return { app: 'ldt-sistema', versao: 1, exportadoEm: new Date().toISOString(), empresa: read('empresa', {}), fin: read('fin', {}), docs: read('docs', []) };
    },
    importAll: function (o, modo) {
      if (!o || o.app !== 'ldt-sistema' || !Array.isArray(o.docs)) throw new Error('Arquivo inválido: não é um backup do sistema LDT.');
      if (o.empresa) write('empresa', o.empresa);
      if (o.fin) write('fin', o.fin);
      var cur = modo === 'mesclar' ? read('docs', []) : [];
      var ids = {}; cur.forEach(function (d) { ids[d.id] = 1; });
      o.docs.forEach(function (d) { if (!ids[d.id]) cur.push(d); });
      write('docs', cur);
      return o.docs.length;
    },
    wipe: function () { ['docs', 'empresa', 'fin', 'draft:proposta', 'draft:contrato', 'handoff:contrato'].forEach(del); }
  };
})(window);
