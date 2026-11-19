/* LDT · sincronização entre navegadores (Cloudflare KV, protegida por código de acesso) */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), S = L.store;
  var busy = false, timer = null, lastRun = 0;

  function code() { return S.read('iacode', '') || ''; }
  function ms(iso) { var t = Date.parse(iso || ''); return isNaN(t) ? 0 : t; }
  function isEmpty(o) { return !o || !Object.keys(o).length; }

  /** Une dois instantâneos: documentos por id (vence o mais recente), exclusões respeitadas, configurações do lado mais recente. */
  function merge(a, b) {
    b = b || { docs: [], tomb: {}, empresa: {}, fin: {} };
    var tomb = {}, k, map = {};
    [a.tomb || {}, b.tomb || {}].forEach(function (t) { for (k in t) tomb[k] = Math.max(tomb[k] || 0, t[k]); });
    [a.docs || [], b.docs || []].forEach(function (list) {
      list.forEach(function (x) {
        if (!x || !x.id) return;
        var cur = map[x.id];
        if (!cur || ms(x.atualizadoEm) > ms(cur.atualizadoEm)) map[x.id] = x;
      });
    });
    var docs = Object.keys(map).map(function (id) { return map[id]; }).filter(function (x) { return !(tomb[x.id] && tomb[x.id] >= ms(x.atualizadoEm)); });
    docs.sort(function (x, y) { return x.id < y.id ? -1 : 1; });
    function pick(name) {
      var la = a[name], lb = b[name], ta = a[name + 'At'] || 0, tb = b[name + 'At'] || 0;
      if (isEmpty(lb)) return [la, ta || (isEmpty(la) ? 0 : 1)];
      if (isEmpty(la)) return [lb, tb];
      return tb > ta ? [lb, tb] : [la, ta];
    }
    var e = pick('empresa'), f = pick('fin');
    return { empresa: e[0], empresaAt: e[1], fin: f[0], finAt: f[1], docs: docs, tomb: tomb };
  }
  function norm(o) {
    var docs = (o.docs || []).slice().sort(function (x, y) { return x.id < y.id ? -1 : 1; });
    return JSON.stringify([o.empresa || {}, o.fin || {}, docs, o.tomb || {}]);
  }

  function req(method, body) {
    var h = { 'x-ldt-code': code() }; if (body) h['Content-Type'] = 'application/json';
    return fetch('/api/sync', { method: method, headers: h, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; });
    });
  }
  function fail(msg) { S.write('sync', { last: Date.now(), ok: false, msg: msg }); return { ok: false, msg: msg }; }

  function run() {
    if (!code()) return Promise.resolve({ ok: false, skipped: true });
    if (busy) return Promise.resolve({ ok: false, skipped: true });
    busy = true;
    function cycle(tries) {
      return req('GET').then(function (g) {
        if (g.status !== 200) throw new Error(g.body.erro || ('Erro ' + g.status));
        var local = S.snapshot(), merged = merge(local, g.body.data), pulled = norm(merged) !== norm(local);
        if (pulled) S.applySnapshot(merged);
        var needPush = !g.body.data || norm(merged) !== norm(g.body.data) || (g.body.data.empresaAt || 0) !== merged.empresaAt || (g.body.data.finAt || 0) !== merged.finAt;
        if (!needPush) return { pulled: pulled, pushed: false };
        return req('PUT', { baseAt: g.body.at, data: merged }).then(function (p) {
          if (p.status === 409 && tries > 0) return cycle(tries - 1);
          if (p.status !== 200) throw new Error(p.body.erro || ('Erro ' + p.status));
          return { pulled: pulled, pushed: true };
        });
      });
    }
    return cycle(2).then(function (r) {
      busy = false; lastRun = Date.now(); S.write('sync', { last: Date.now(), ok: true, docs: S.docs.list().length });
      r.ok = true; return r;
    }, function (e) { busy = false; return fail(e && e.message || 'Falha na sincronização.'); });
  }

  function schedule() {
    if (!code()) return;
    clearTimeout(timer); timer = setTimeout(function () { run(); }, 1500);
  }

  function reloadIfNeeded(r) {
    if (!r || !r.pulled) return;
    var path = w.location.pathname, editor = /\/(proposta|contrato)\//.test(path);
    if (editor && !/[?&]id=/.test(w.location.search)) return;
    try { var t = Number(w.sessionStorage.getItem('ldt-sync-reload') || 0); if (Date.now() - t < 10000) return; w.sessionStorage.setItem('ldt-sync-reload', String(Date.now())); } catch (e) { /* noop */ }
    w.location.reload();
  }

  L.sync = { run: run, schedule: schedule, merge: merge, code: code, status: function () { return S.read('sync', null); } };

  d.addEventListener('DOMContentLoaded', function () { run().then(reloadIfNeeded); });
  d.addEventListener('visibilitychange', function () {
    if (d.visibilityState === 'visible' && Date.now() - lastRun > 30000) run().then(reloadIfNeeded);
  });
})(window, document);
