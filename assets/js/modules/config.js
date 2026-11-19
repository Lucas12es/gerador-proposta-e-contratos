/* LDT · configurações */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt, S = L.store;

  var PROMO = { fpix: '0,99', fbol: '0,99', fcar: '0,49', c1: '1,99', c2: '2,49', c3: '2,99' };
  var PADRAO = { fpix: '1,99', fbol: '1,99', fcar: '0,49', c1: '2,99', c2: '3,49', c3: '3,99' };

  function init() {
    L.shell.mount('config');
    var emp = S.empresa(), fin = S.fin();
    var saved = L.ui.debounce(function () { S.saveEmpresa(emp); S.saveFin(fin); L.ui.toast('Configurações salvas'); }, 600);

    function cnpjHint() {
      var h = d.getElementById('cnpj-hint'), st = F.docStatus(emp.cnpj);
      h.textContent = L.i18n.t(st === 'invalido' ? 'CNPJ com dígitos verificadores inválidos. Confira o número.' : st === 'incompleto' ? 'CNPJ incompleto.' : '');
      h.className = st === 'invalido' ? 'warn' : '';
    }
    var be = L.ui.bind(d.getElementById('empresa'), emp, function () { cnpjHint(); saved(); });
    var bf = L.ui.bind(d.getElementById('fin'), fin, function (k) {
      if (k === 'regime' && fin.regime !== 'custom') { fin.imp = String(fin.regime).replace('.', ','); bf.pull(); }
      if (k === 'imp') {
        var sel = d.querySelector('#fin [data-k=regime]'), m = [].slice.call(sel.options).filter(function (o) { return o.value !== 'custom' && F.num(o.value) === F.num(fin.imp); })[0];
        fin.regime = m ? m.value : 'custom'; sel.value = fin.regime;
      }
      if (k === 'promo') { var pr = fin.promo === '1' ? PROMO : PADRAO; for (var x in pr) fin[x] = pr[x]; bf.pull(); }
      saved();
    });
    cnpjHint();

    /* Sincronização */
    var sinfo = d.getElementById('sync-info'), scode = d.getElementById('sync-code');
    scode.value = S.read('iacode', '') || '';
    function showSync(r) {
      var st = S.read('sync', null), t = L.i18n.t;
      if (!S.read('iacode', '')) { sinfo.textContent = t('Sincronização desligada neste navegador.'); return; }
      if (r && r.msg) { sinfo.textContent = t('Não sincronizou') + ': ' + r.msg; return; }
      if (st && st.ok) sinfo.textContent = L.i18n.tf('Sincronizado em {d}. {n} documento(s) na nuvem.', { d: new Date(st.last).toLocaleString(), n: st.docs || 0 });
      else if (st && st.msg) sinfo.textContent = t('Não sincronizou') + ': ' + st.msg;
      else sinfo.textContent = '';
    }
    function doSync(btn) {
      sinfo.textContent = L.i18n.t('Sincronizando…'); if (btn) btn.disabled = true;
      L.sync.run().then(function (r) {
        if (btn) btn.disabled = false; showSync(r);
        if (r.ok) { L.ui.toast(r.pulled ? 'Dados da nuvem carregados' : 'Sincronizado'); if (r.pulled) setTimeout(function () { w.location.reload(); }, 900); }
        else if (!r.skipped) L.ui.toast(r.msg || 'Falha na sincronização.', 'err');
      });
    }
    d.getElementById('sync-save').addEventListener('click', function () {
      var v = scode.value.trim(); if (!v) { L.ui.toast('Informe o código de acesso.', 'err'); return; }
      S.write('iacode', v); doSync(this);
    });
    d.getElementById('sync-now').addEventListener('click', function () { if (!S.read('iacode', '')) { L.ui.toast('Informe o código de acesso.', 'err'); return; } doSync(this); });
    showSync();

    /* Backup */
    var info = d.getElementById('bk-info');
    function count() { var n = S.docs.list().length; info.textContent = L.i18n.tf('{n} documento(s) salvo(s) neste navegador.', { n: n }); }
    count();
    d.getElementById('bk-export').addEventListener('click', function () {
      var stamp = new Date().toISOString().slice(0, 10);
      L.ui.download('ldt-backup-' + stamp + '.json', JSON.stringify(S.exportAll(), null, 2));
      L.ui.toast('Backup exportado');
    });
    d.getElementById('bk-import').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var o = JSON.parse(r.result);
          L.ui.confirm({ title: 'Importar backup?', text: 'Os documentos do arquivo serão mesclados aos que já estão aqui e as configurações do arquivo substituirão as atuais.', ok: 'Importar' }).then(function (ok) {
            if (!ok) return;
            var n = S.importAll(o, 'mesclar'); L.ui.toast(L.i18n.tf('{n} documento(s) lidos do backup', { n: n })); setTimeout(function () { w.location.reload(); }, 700);
          });
        } catch (err) { L.ui.toast(err.message || 'Não foi possível ler o arquivo.', 'err'); }
      };
      r.readAsText(f); e.target.value = '';
    });
    d.getElementById('bk-wipe').addEventListener('click', function () {
      L.ui.confirm({ title: 'Apagar todos os dados?', text: 'Propostas, contratos e configurações deste navegador serão removidos. Exporte um backup antes, se precisar.', ok: 'Apagar tudo' }).then(function (ok) {
        if (ok) { S.wipe(); L.ui.toast('Dados apagados'); setTimeout(function () { w.location.reload(); }, 700); }
      });
    });
  }
  d.addEventListener('DOMContentLoaded', init);
})(window, document);
