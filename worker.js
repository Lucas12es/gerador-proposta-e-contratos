/* LDT · Worker: serve o site estático e o endpoint POST /api/ia (proxy para o Groq).
   A chave NUNCA fica no código: use o secret GROQ_API_KEY no Cloudflare. */
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
/* llama-3.3-70b-versatile saiu dos planos gratuito/developer do Groq em 16/08/2026 (erro 404). Tentamos os modelos na ordem. */
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

const SCHEMAS = {
  proposta: {
    nome: 'proposta comercial de criação de site',
    campos: {
      idioma: 'pt | en | es (idioma do documento)', moeda: 'BRL | USD | EUR',
      cliente: 'nome da pessoa de contato', cliEmp: 'empresa do cliente', titulo: 'título da proposta',
      obj: 'objetivo do projeto (texto curto)', objs: 'objetivos, um por linha', publico: 'público-alvo',
      escopo: 'entregáveis, uma linha por item no formato "Entregável | Detalhes"',
      prazo: 'prazo de entrega em texto', valid: 'validade da proposta em dias (número)',
      v1: 'valor da implantação (pagamento único), SOMENTE se o usuário informou (ex: 1500,00)', ent: 'entrada em % (número)', pn: 'número de parcelas (número)',
      crono: 'cronograma, uma linha por etapa "Etapa | Descrição"', pag: 'condições de pagamento, uma por linha',
      termos: 'termos e condições, um por linha', obsv: 'observações finais',
      mensal: 'valor da mensalidade de hospedagem e manutenção, SOMENTE se informado (ex: 99,00)', mensalItens: 'itens da mensalidade, um por linha'
    }
  },
  contrato: {
    nome: 'contrato de prestação de serviços de criação de site',
    campos: {
      idioma: 'pt | en | es', moeda: 'BRL | USD | EUR', cliTipo: 'pj | pf', cliNome: 'nome/razão social do contratante',
      cliDoc: 'CPF/CNPJ SOMENTE se o usuário informou', cliEnd: 'endereço', cliEmail: 'e-mail', cliTel: 'telefone',
      cliRep: 'representante legal', cliRepDoc: 'CPF do representante SOMENTE se informado', titulo: 'título do contrato',
      escopo: 'escopo, uma linha por item', prazoDias: 'prazo em dias úteis (número)', diasConteudo: 'dias úteis para o cliente enviar conteúdo (número)',
      valor: 'valor da implantação (pagamento único) SOMENTE se informado (ex: 1500,00)', mensal: 'valor da mensalidade SOMENTE se informado (ex: 99,00)', cMensal: '1 ou "" (incluir cláusula de mensalidade)', mensalItens: 'itens da mensalidade, um por linha', pagTipo: 'pix | avista | cartao | entrada | outro',
      pagParcelas: 'nº de parcelas (número)', pagEntradaPct: 'entrada em % (número)', pagTexto: 'texto livre de pagamento',
      multaMora: 'multa por atraso % (número)', juros: 'juros ao mês % (número)', revisoes: 'rodadas de revisão (número)',
      avisoPrevio: 'dias de aviso prévio (número)', multaRescisao: 'multa de rescisão % (número)', cessao: 'pago | licenca',
      hosp: 'texto sobre hospedagem', suporteDias: 'dias de suporte pós-entrega (número)', foro: 'foro/comarca', cidade: 'cidade de assinatura',
      incluiTaxas: '1 ou "" (valor inclui tarifas do meio de pagamento)', portfolio: '1 ou ""', cHosp: '1 ou ""', cSuporte: '1 ou ""',
      cConf: '1 ou ""', cLgpd: '1 ou ""', cLimit: '1 ou ""', cExtras: '1 ou ""', extras: 'cláusulas adicionais, uma por linha'
    }
  },
  calculadora: {
    nome: 'calculadora de preço (imposto + taxas TechFX/Asaas)',
    campos: {
      modo: 'liq (quero receber X líquido) | preco (preço fechado)', v1: 'valor em número (ex: 3500,00), SOMENTE se informado',
      moeda: 'BRL | USD | EUR', gateway: 'techfx | asaas', meio: 'pix | boleto | cartao', parc: 'nº de parcelas (1 a 12)',
      antic: '1 se com antecipação, senão ""', imp: 'imposto da nota em % (só se informado)', techfx: 'taxa TechFX % (só se informado)',
      oc: 'outros custos % (só se informado)', arr: 'arredondamento (0 = nenhum, 1, 5, 10...)'
    }
  }
};

const NEGOCIO = 'Contexto do negócio (LDT Negócios & Soluções): a LDT prospecta empresas no Google Maps que não têm site institucional, cadastra no CRM e envia mensagem oferecendo um site de PRÉVIA. Se o cliente autoriza, a LDT cria a prévia; se o cliente aprova, entra a proposta e depois o contrato. O serviço tem duas partes: (1) IMPLANTAÇÃO E DESENVOLVIMENTO do site, cobrada uma única vez (planejamento das páginas, layout personalizado e responsivo, apresentação institucional, organização de conteúdos e imagens, botões e WhatsApp, SEO básico, domínio e publicação, testes); (2) MENSALIDADE de hospedagem e manutenção, recorrente (hospedagem, monitoramento, manutenção preventiva, suporte técnico, pequenos ajustes de conteúdo, atualizações e correções). O valor da implantação vai em v1 (proposta) ou valor (contrato); o valor da mensalidade em mensal. Os textos padrão do formulário já descrevem esses serviços: só altere escopo, mensalItens, prazo ou cronograma se o usuário pedir. Não invente preços: se o usuário não disse o valor, deixe vazio e avise.';

function cors(h) { h = h || {}; h['Content-Type'] = 'application/json; charset=utf-8'; h['Cache-Control'] = 'no-store'; return h; }
function json(o, s) { return new Response(JSON.stringify(o), { status: s || 200, headers: cors() }); }

function prompt(tipo) {
  const s = SCHEMAS[tipo];
  const lista = Object.keys(s.campos).map(k => '- ' + k + ': ' + s.campos[k]).join('\n');
  return NEGOCIO + '\n' + 'Você é o assistente da LDT Negócios & Soluções (agência de sites). O usuário descreve em linguagem natural o que quer e você preenche o formulário de: ' + s.nome + '.\n' +
    'Responda SOMENTE com JSON no formato {"campos":{...},"resposta":"mensagem curta em português"}.\n' +
    'Regras:\n1. Em "campos" inclua apenas as chaves que o pedido exige alterar, usando exatamente estes nomes:\n' + lista + '\n' +
    '2. NUNCA invente valores em dinheiro, CPF, CNPJ, e-mail, telefone ou endereço. Se o usuário não informou, não inclua o campo.\n' +
    '3. Números como texto, com vírgula decimal (ex: "3500,00"). Percentuais sem o símbolo %.\n' +
    '4. Se mudar o idioma do documento, escreva os textos em prosa no novo idioma.\n' +
    '5. Campos de várias linhas usam \\n entre os itens.\n' +
    '6. Você NÃO faz contas de imposto/taxa: isso é calculado pelo sistema. Apenas preencha os parâmetros.\n' +
    '7. "resposta": 1 a 3 frases dizendo o que foi preenchido e o que ainda falta o usuário informar. Se o pedido não tiver relação com o formulário, devolva "campos":{} e explique.';
}

const DUVIDAS = NEGOCIO + '\n' + 'Você é o consultor virtual da LDT Negócios & Soluções, agência brasileira que vende criação de sites (inclusive para clientes no exterior). Tire dúvidas do dono da agência sobre precificação, imposto sobre nota fiscal de serviços (Simples Nacional, MEI, ISS, PIS/COFINS, exportação de serviços), taxas de meios de recebimento (TechFX, Asaas, Pix, boleto, cartão, antecipação), câmbio e contratos.\n' +
  'Regras: responda em português, de forma direta e organizada (poucos parágrafos ou lista curta). Você NÃO tem acesso à internet nem a dados em tempo real: não afirme alíquotas, taxas, cotações ou leis atuais como certeza; diga o que costuma valer, deixe claro o que depende do regime/município/contrato e diga que isso deve ser confirmado com o contador ou na tabela oficial da plataforma. Nunca invente números. Se faltar informação (regime tributário, cidade, valor), pergunte. Use os parâmetros atuais do usuário (JSON abaixo) quando ajudarem. Para calcular o preço final, oriente a usar a Calculadora do sistema.';

async function duvidas(body, env) {
  const msg = String(body.mensagem || '').slice(0, 4000);
  if (!msg.trim()) return json({ erro: 'Pedido inválido.' }, 400);
  const atual = body.atual && typeof body.atual === 'object' ? JSON.stringify(body.atual).slice(0, 3000) : '{}';
  const hist = Array.isArray(body.historico) ? body.historico.slice(-8).map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '').slice(0, 2000) })) : [];
  const messages = [{ role: 'system', content: DUVIDAS + '\nParâmetros atuais do sistema (JSON): ' + atual }].concat(hist, [{ role: 'user', content: msg }]);
  const lista = env.GROQ_MODEL ? [env.GROQ_MODEL] : MODELS;
  let r, ultimo = 0;
  for (const modelo of lista) {
    const payload = { model: modelo, messages, temperature: 0.3, max_tokens: 3000 };
    if (modelo.indexOf('openai/gpt-oss') === 0) payload.reasoning_effort = 'low';
    try { r = await fetch(GROQ_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.GROQ_API_KEY }, body: JSON.stringify(payload) }); }
    catch (e) { return json({ erro: 'Não foi possível falar com o Groq.' }, 502); }
    ultimo = r.status;
    if (r.ok || (r.status !== 404 && r.status !== 400)) break;
  }
  if (!r.ok) return json({ erro: r.status === 429 ? 'Limite do Groq atingido. Tente em instantes.' : r.status === 401 ? 'O Groq recusou a chave (confira se GROQ_API_KEY está correta).' : 'O Groq retornou erro ' + ultimo + ' (modelo indisponível?).' }, 502);
  let txt; try { txt = (await r.json()).choices[0].message.content; } catch (e) { return json({ erro: 'Resposta da IA inválida. Tente reformular.' }, 502); }
  return json({ campos: {}, resposta: String(txt || '').trim().slice(0, 6000) || 'Não consegui responder. Reformule a pergunta.' });
}

async function ia(req, env) {
  if (!env.GROQ_API_KEY) return json({ erro: 'A IA ainda não foi configurada (falta o secret GROQ_API_KEY no Cloudflare).' }, 503);
  if (env.ACCESS_CODE && req.headers.get('x-ldt-code') !== env.ACCESS_CODE) return json({ erro: 'Código de acesso inválido.' }, 401);
  let body; try { body = await req.json(); } catch (e) { return json({ erro: 'Pedido inválido.' }, 400); }
  if (body && body.tipo === 'duvidas') return duvidas(body, env);
  const tipo = body && body.tipo, msg = String((body && body.mensagem) || '').slice(0, 4000);
  if (!SCHEMAS[tipo] || !msg.trim()) return json({ erro: 'Pedido inválido.' }, 400);
  const atual = body.atual && typeof body.atual === 'object' ? JSON.stringify(body.atual).slice(0, 6000) : '{}';
  const hist = Array.isArray(body.historico) ? body.historico.slice(-6).map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '').slice(0, 1500) })) : [];
  const messages = [{ role: 'system', content: prompt(tipo) + '\nValores atuais do formulário (JSON): ' + atual }].concat(hist, [{ role: 'user', content: msg }]);
  const lista = env.GROQ_MODEL ? [env.GROQ_MODEL] : MODELS;
  let r, ultimo = 0;
  for (const modelo of lista) {
    const payload = { model: modelo, messages, temperature: 0.2, max_tokens: 4000, response_format: { type: 'json_object' } };
    if (modelo.indexOf('openai/gpt-oss') === 0) payload.reasoning_effort = 'low';
    try {
      r = await fetch(GROQ_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.GROQ_API_KEY }, body: JSON.stringify(payload) });
    } catch (e) { return json({ erro: 'Não foi possível falar com o Groq.' }, 502); }
    ultimo = r.status;
    if (r.ok || (r.status !== 404 && r.status !== 400)) break; /* modelo indisponível: tenta o próximo */
  }
  if (!r.ok) return json({ erro: r.status === 429 ? 'Limite do Groq atingido. Tente em instantes.' : r.status === 401 ? 'O Groq recusou a chave (confira se GROQ_API_KEY está correta).' : 'O Groq retornou erro ' + ultimo + ' (modelo indisponível?).' }, 502);
  let out; try { const j = await r.json(); out = JSON.parse(j.choices[0].message.content); } catch (e) { return json({ erro: 'Resposta da IA inválida. Tente reformular.' }, 502); }
  const permitidos = SCHEMAS[tipo].campos, campos = {};
  const src = out && typeof out.campos === 'object' && out.campos ? out.campos : {};
  Object.keys(src).forEach(k => { if (Object.prototype.hasOwnProperty.call(permitidos, k) && (typeof src[k] === 'string' || typeof src[k] === 'number')) campos[k] = String(src[k]).slice(0, 4000); });
  return json({ campos, resposta: String((out && out.resposta) || 'Pronto.').slice(0, 800) });
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.pathname === '/api/ia') {
      if (req.method === 'GET') return json({ worker: 'ok', chave_configurada: !!env.GROQ_API_KEY, codigo_de_acesso_configurado: !!env.ACCESS_CODE });
      if (req.method !== 'POST') return json({ erro: 'Método não permitido.' }, 405);
      return ia(req, env);
    }
    return env.ASSETS.fetch(req);
  }
};
