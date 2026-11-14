/* LDT · assistente de IA (Groq via Worker /api/ia). Preenche os campos do formulário a partir de um pedido em texto. */
(function (w, d) {
  'use strict';
  var L = (w.LDT = w.LDT || {}), F = L.fmt, S = L.store, esc = F.esc, t = L.i18n.t;
  var SKIP = { num: 1, data: 1, propostaNum: 1 };
  var EXEMPLOS = {
    proposta: ['Proposta de site institucional para a Clínica Sorriso, R$ 4.500, entrega em 20 dias, 50% de entrada', 'Mude o documento para inglês e dólar'],
    contrato: ['Contrato com Maria Souza (pessoa física), site de 5 páginas, prazo 25 dias úteis, pagamento em 3 parcelas', 'Foro em São Paulo, 60 dias de suporte'],
    calculadora: ['Quero receber R$ 3.000 líquidos no Pix pela TechFX', 'Compare com Asaas cartão em 6x']
  };
  var hist = [];

  function fieldOf(k) { return d.querySelector('[data-k="' + k + '"]'); }
  function current(tipo) {
    var o = {}; [].forEach.call(d.querySelectorAll('[data-k]'), function (f) {
      var k = f.dataset.k; if (SKIP[k]) return;
      o[k] = f.type === 'checkbox' ? (f.checked ? '1' : '') : String(f.value || '').slice(0, 400);
    }); return o;
  }
  /** aplica os campos pelo DOM, para reaproveitar toda a lógica do formulário (idioma, render, rascunho) */
  function applyFields(campos) {
    var keys = Object.keys(campos).filter(function (k) { return !SKIP[k] && fieldOf(k); }), n = 0;
    keys.sort(function (a, b) { var r = function (x) { return x === 'idioma' ? 0 : x === 'moeda' ? 1 : 2; }; return r(a) - r(b); });
    keys.forEach(function (k) {
      var f = fieldOf(k), v = String(campos[k]), ev = 'input';
      if (f.type === 'checkbox') { f.checked = v === '1' || v === 'true'; ev = 'change'; }
      else if (f.tagName === 'SELECT') {
        var ok = [].some.call(f.options, function (o) { return o.value === v; });
        if (!ok) return; f.value = v; ev = 'change';
      } else f.value = v;
      f.dispatchEvent(new Event(ev, { bubbles: true })); n++;
    });
    return n;
  }
  function code() { return S.read('iacode', '') || ''; }

  function mount(tipo) {
    var btn = d.createElement('button');
    btn.type = 'button'; btn.className = 'ia-fab';
    btn.innerHTML = L.ui.icon('sparkle') + '<span>Assistente IA</span>';
    var box = d.createElement('section');
    box.className = 'ia-box'; box.hidden = true; box.setAttribute('aria-label', t('Assistente IA'));
    box.innerHTML = '<header><b>' + esc(t('Assistente IA')) + '</b><button type="button" class="ia-x" aria-label="' + esc(t('Fechar')) + '">×</button></header>' +
      '<div class="ia-log" aria-live="polite"></div>' +
      '<div class="ia-ex"></div>' +
      '<form class="ia-form"><textarea rows="2" placeholder="' + esc(t('Peça o que você precisa…')) + '" aria-label="' + esc(t('Peça o que você precisa…')) + '"></textarea>' +
      '<button class="btn primary" type="submit">' + esc(t('Enviar')) + '</button></form>' +
      '<p class="ia-note">' + esc(t('A IA só preenche os campos. Os cálculos são feitos pelo sistema. Revise antes de enviar ao cliente.')) + '</p>';
    d.body.appendChild(btn); d.body.appendChild(box);
    var log = box.querySelector('.ia-log'), ta = box.querySelector('textarea'), form = box.querySelector('form'), ex = box.querySelector('.ia-ex'), busy = false;
    function say(text, who) { var m = d.createElement('div'); m.className = 'ia-msg ' + who; m.textContent = text; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
    say(t('Olá! Descreva o que quer e eu preencho o formulário para você.'), 'bot');
    (EXEMPLOS[tipo] || []).forEach(function (e) {
      var b = d.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = e; b.addEventListener('click', function () { ta.value = e; ta.focus(); }); ex.appendChild(b);
    });
    function toggle(open) { box.hidden = !open; btn.hidden = open; if (open) ta.focus(); }
    btn.addEventListener('click', function () { toggle(true); });
    box.querySelector('.ia-x').addEventListener('click', function () { toggle(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) toggle(false); });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });

    function askCode() {
      return new Promise(function (res) {
        var r = d.createElement('form'); r.className = 'ia-code';
        r.innerHTML = '<input type="password" autocomplete="off" aria-label="' + esc(t('Código de acesso da IA')) + '" placeholder="' + esc(t('Código de acesso da IA')) + '"><button class="btn" type="submit">OK</button>';
        log.appendChild(r); r.querySelector('input').focus();
        r.addEventListener('submit', function (e) { e.preventDefault(); var v = r.querySelector('input').value.trim(); r.remove(); res(v); });
      });
    }
    function send(msg, retry) {
      busy = true; var wait = say(t('Pensando…'), 'bot wait');
      var headers = { 'Content-Type': 'application/json' }; if (code()) headers['x-ldt-code'] = code();
      return fetch('/api/ia', { method: 'POST', headers: headers, body: JSON.stringify({ tipo: tipo, mensagem: msg, atual: current(tipo), historico: hist }) })
        .then(function (r) { return r.json().catch(function () { return { erro: 'Resposta inválida do servidor.' }; }).then(function (j) { return { s: r.status, j: j }; }); })
        .then(function (o) {
          wait.remove();
          if (o.s === 401 && !retry) {
            return askCode().then(function (c) { if (c) { S.write('iacode', c); return send(msg, true); } say(t('Código de acesso inválido.'), 'bot err'); });
          }
          if (o.j.erro) { say(o.j.erro, 'bot err'); return; }
          var n = applyFields(o.j.campos || {});
          hist.push({ role: 'user', content: msg }, { role: 'assistant', content: o.j.resposta });
          say(o.j.resposta + (n ? '  (' + n + ' ' + t('campo(s) atualizado(s)') + ')' : ''), 'bot');
          if (n) L.ui.toast('Campos preenchidos pela IA');
        })
        .catch(function () { wait.remove(); say(t('Não consegui falar com a IA. Verifique a conexão e se o site foi publicado no Cloudflare.'), 'bot err'); })
        .then(function () { busy = false; });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var msg = ta.value.trim(); if (!msg || busy) return;
      say(msg, 'me'); ta.value = ''; send(msg);
    });
  }
  L.ia = { mount: mount, apply: applyFields };
})(window, document);
