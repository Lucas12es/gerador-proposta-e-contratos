/* LDT · textos dos documentos (proposta e contrato) em português, inglês e espanhol */
(function (w) {
  'use strict';
  var L = (w.LDT = w.LDT || {});

  var MESES = {
    pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  };
  var LOCALE = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

  function dateLong(iso, lang) {
    if (!iso) return '';
    var p = String(iso).split('-'); if (p.length < 3) return iso;
    var d = parseInt(p[2], 10), m = MESES[lang][parseInt(p[1], 10) - 1], y = p[0];
    return lang === 'en' ? m + ' ' + d + ', ' + y : lang === 'es' ? d + ' de ' + m + ' de ' + y : d + ' de ' + m + ' de ' + y;
  }
  function cur(n, moeda, lang) {
    try { return new Intl.NumberFormat(LOCALE[lang] || 'pt-BR', { style: 'currency', currency: moeda || 'BRL' }).format(isFinite(n) ? n : 0).replace(/[  ]/g, ' '); }
    catch (e) { return String(n); }
  }
  function num(n, lang) { return (isFinite(n) ? n : 0).toLocaleString(LOCALE[lang] || 'pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function pct(n, lang) { return (isFinite(n) ? n : 0).toLocaleString(LOCALE[lang] || 'pt-BR', { maximumFractionDigits: 2 }) + '%'; }

  /* ---------- Proposta ---------- */
  var P = {
    pt: {
      sMain: 'Implantação e desenvolvimento do site', sMonth: 'Mensalidade · hospedagem e manutenção', totalOne: 'Implantação do site · pagamento único', totalMonth: 'Mensalidade · hospedagem e manutenção', perMonth: '/mês',
      monthNote: 'A implantação é cobrada uma única vez. A hospedagem e a manutenção são cobradas mensalmente, a partir da publicação do site, garantindo a continuidade dos serviços e a permanência do site no ar.',
      acceptM: ' e a mensalidade de <b>{m}</b>',
      doc: 'Proposta', kicker: 'Proposta comercial · Nº {num}', prepared: 'Preparada para', date: 'Data', valid: 'Validade', days: 'dias', ac: 'A/C',
      client: '[Cliente]', goal: '[objetivo]', amount: '[valor]',
      e1: '01 · Apresentação', h1: 'Entendendo o seu projeto',
      intro: 'Olá, <b>{nome}</b>! Agradecemos a oportunidade de apresentar esta proposta. Pelo que conversamos, {cli} precisa de um site que {obj}.', contactFallback: 'cliente',
      objs: 'Objetivos do projeto', audience: 'Público-alvo', e2: '02 · Escopo', h2: 'O que está incluso', thDeliv: 'Entregável', thDet: 'Detalhes',
      outScope: 'Itens fora do escopo serão orçados à parte, mediante aprovação prévia.',
      e3: '03 · Investimento', h3: 'Valor do projeto', total: 'Investimento total', thPay: 'Forma de pagamento', thVal: 'Valor',
      entry: 'Entrada ({pct}), na aprovação da proposta', balance: 'Saldo em {n}x de', instal: 'Parcelamento em {n}x de',
      e4: '04 · Cronograma', h4: 'Como o projeto acontece',
      term: 'Prazo total estimado: <b>{prazo}</b>, a partir da aprovação da proposta e do envio dos materiais (textos, logo e imagens).',
      e5: '05 · Pagamento', h5: 'Condições comerciais', validity: 'Validade da proposta', calDays: 'dias corridos', terms: 'Termos importantes',
      next: 'Próximos passos', h6: 'Vamos começar?',
      start: 'Para aprovar esta proposta, basta assinar abaixo ou responder confirmando. Após o aceite e o pagamento inicial, iniciamos o briefing em até 2 dias úteis.',
      accept: 'De acordo com o escopo, o valor de <b>{total}</b> e as condições desta proposta.', payChosen: 'Forma de pagamento escolhida:',
      place: 'Local e data', thanks: 'Obrigado pela confiança!', questions: 'Dúvidas? Fale conosco: {c}', page: 'Página', clientWord: 'Cliente'
    },
    en: {
      sMain: 'Website implementation and development', sMonth: 'Monthly fee · hosting and maintenance', totalOne: 'Website implementation · one-time payment', totalMonth: 'Monthly fee · hosting and maintenance', perMonth: '/month',
      monthNote: 'The implementation is charged once. Hosting and maintenance are charged monthly, from the day the website goes live, ensuring continuity of the services and keeping the website online.',
      acceptM: ' and the monthly fee of <b>{m}</b>',
      doc: 'Proposal', kicker: 'Commercial proposal · No. {num}', prepared: 'Prepared for', date: 'Date', valid: 'Valid for', days: 'days', ac: 'Attn',
      client: '[Client]', goal: '[goal]', amount: '[amount]',
      e1: '01 · Introduction', h1: 'Understanding your project',
      intro: 'Hello, <b>{nome}</b>! Thank you for the opportunity to present this proposal. From what we discussed, {cli} needs a website that {obj}.', contactFallback: 'there',
      objs: 'Project goals', audience: 'Target audience', e2: '02 · Scope', h2: 'What is included', thDeliv: 'Deliverable', thDet: 'Details',
      outScope: 'Items outside the scope will be quoted separately and require prior approval.',
      e3: '03 · Investment', h3: 'Project price', total: 'Total investment', thPay: 'Payment terms', thVal: 'Amount',
      entry: 'Down payment ({pct}), upon proposal approval', balance: 'Balance in {n} installments of', instal: 'Payment in {n} installments of',
      e4: '04 · Timeline', h4: 'How the project unfolds',
      term: 'Estimated total timeline: <b>{prazo}</b>, counted from proposal approval and receipt of the materials (texts, logo and images).',
      e5: '05 · Payment', h5: 'Commercial terms', validity: 'Proposal validity', calDays: 'calendar days', terms: 'Important terms',
      next: 'Next steps', h6: 'Shall we start?',
      start: 'To approve this proposal, simply sign below or reply confirming. After acceptance and the initial payment, we start the briefing within 2 business days.',
      accept: 'I agree with the scope, the amount of <b>{total}</b> and the terms of this proposal.', payChosen: 'Chosen payment method:',
      place: 'Place and date', thanks: 'Thank you for your trust!', questions: 'Questions? Contact us: {c}', page: 'Page', clientWord: 'Client'
    },
    es: {
      sMain: 'Implantación y desarrollo del sitio', sMonth: 'Mensualidad · alojamiento y mantenimiento', totalOne: 'Implantación del sitio · pago único', totalMonth: 'Mensualidad · alojamiento y mantenimiento', perMonth: '/mes',
      monthNote: 'La implantación se cobra una sola vez. El alojamiento y el mantenimiento se cobran mensualmente, a partir de la publicación del sitio, garantizando la continuidad de los servicios y la permanencia del sitio en línea.',
      acceptM: ' y la mensualidad de <b>{m}</b>',
      doc: 'Propuesta', kicker: 'Propuesta comercial · N.º {num}', prepared: 'Preparada para', date: 'Fecha', valid: 'Validez', days: 'días', ac: 'Att.',
      client: '[Cliente]', goal: '[objetivo]', amount: '[importe]',
      e1: '01 · Presentación', h1: 'Entendiendo su proyecto',
      intro: '¡Hola, <b>{nome}</b>! Agradecemos la oportunidad de presentar esta propuesta. Por lo que conversamos, {cli} necesita un sitio web que {obj}.', contactFallback: 'cliente',
      objs: 'Objetivos del proyecto', audience: 'Público objetivo', e2: '02 · Alcance', h2: 'Qué está incluido', thDeliv: 'Entregable', thDet: 'Detalles',
      outScope: 'Los elementos fuera del alcance se presupuestarán aparte, previa aprobación.',
      e3: '03 · Inversión', h3: 'Precio del proyecto', total: 'Inversión total', thPay: 'Forma de pago', thVal: 'Importe',
      entry: 'Anticipo ({pct}), al aprobar la propuesta', balance: 'Saldo en {n} cuotas de', instal: 'Pago en {n} cuotas de',
      e4: '04 · Cronograma', h4: 'Cómo se desarrolla el proyecto',
      term: 'Plazo total estimado: <b>{prazo}</b>, a partir de la aprobación de la propuesta y del envío de los materiales (textos, logotipo e imágenes).',
      e5: '05 · Pago', h5: 'Condiciones comerciales', validity: 'Validez de la propuesta', calDays: 'días naturales', terms: 'Términos importantes',
      next: 'Próximos pasos', h6: '¿Empezamos?',
      start: 'Para aprobar esta propuesta, basta con firmar abajo o responder confirmando. Tras la aceptación y el pago inicial, iniciamos el briefing en un máximo de 2 días hábiles.',
      accept: 'Estoy de acuerdo con el alcance, el importe de <b>{total}</b> y las condiciones de esta propuesta.', payChosen: 'Forma de pago elegida:',
      place: 'Lugar y fecha', thanks: '¡Gracias por su confianza!', questions: '¿Dudas? Contáctenos: {c}', page: 'Página', clientWord: 'Cliente'
    }
  };

  /* Textos padrão do projeto, por idioma. Se o campo ainda tem o padrão de um idioma, troca junto com o idioma. */
  var DEF = {
    pt: {
      titulo: 'Criação de Site Institucional',
      obj: 'fortaleça a presença online da empresa, facilite o contato com os clientes e amplie as oportunidades comerciais',
      objs: 'Apresentar a empresa, seus produtos e serviços de forma profissional\nFacilitar o contato dos clientes, inclusive pelo WhatsApp\nFortalecer a presença online e ampliar as oportunidades comerciais',
      escopo: 'Planejamento e estrutura | Planejamento e organização das páginas do site\nLayout personalizado e responsivo | Desenvolvido para computadores, tablets e celulares\nApresentação institucional | Empresa, produtos e serviços apresentados de forma profissional\nConteúdos e imagens | Organização de textos, imagens e informações comerciais\nCanais de contato | Botões de contato e integração com WhatsApp\nSEO básico | Configuração básica para os mecanismos de busca\nDomínio e publicação | Configuração do domínio e publicação no ambiente de hospedagem\nTestes antes da publicação | Funcionamento, navegação e responsividade',
      mensalItens: 'Hospedagem e infraestrutura para manter o site online\nMonitoramento básico de disponibilidade e funcionamento\nManutenção técnica preventiva\nSuporte técnico para necessidades relacionadas ao site\nPequenos ajustes e alterações de conteúdo, conforme o escopo contratado\nAtualizações técnicas e correções necessárias',
      crono: 'Aprovação da prévia | Concluída\nAjustes e conteúdo final | 3 dias\nDomínio e hospedagem | 1 dia\nTestes de funcionamento e responsividade | 1 dia\nSite no ar | 1 dia',
      prazo: '6 dias úteis',
      cEscopo: 'Planejamento e estruturação das páginas do site\nLayout personalizado e responsivo, para computadores, tablets e celulares\nApresentação institucional da empresa, produtos e serviços\nOrganização de conteúdos, imagens e informações comerciais\nBotões e canais de contato, com integração ao WhatsApp\nConfiguração básica de SEO\nConfiguração de domínio e publicação no ambiente de hospedagem\nTestes de funcionamento, navegação e responsividade antes da publicação'
    },
    en: {
      titulo: 'Corporate Website Development',
      obj: 'strengthens the company’s online presence, makes it easier for customers to get in touch and expands its business opportunities',
      objs: 'Present the company, its products and services professionally\nMake it easy for customers to get in touch, including via WhatsApp\nStrengthen the online presence and expand business opportunities',
      escopo: 'Planning and structure | Planning and organization of the website pages\nCustom responsive layout | Built for computers, tablets and phones\nCorporate presentation | Company, products and services presented professionally\nContent and images | Organization of texts, images and commercial information\nContact channels | Contact buttons and WhatsApp integration\nBasic SEO | Basic setup for search engines\nDomain and publishing | Domain setup and publishing to the hosting environment\nPre-launch testing | Functionality, navigation and responsiveness',
      mensalItens: 'Hosting and infrastructure to keep the website online\nBasic availability and performance monitoring\nPreventive technical maintenance\nTechnical support for website-related needs\nMinor adjustments and content changes, within the contracted scope\nTechnical updates and necessary fixes',
      crono: 'Preview approval | Completed\nAdjustments and final content | 3 days\nDomain and hosting | 1 day\nFunctionality and responsiveness testing | 1 day\nGo live | 1 day',
      prazo: '6 business days',
      cEscopo: 'Planning and structuring of the website pages\nCustom responsive layout for computers, tablets and phones\nCorporate presentation of the company, products and services\nOrganization of content, images and commercial information\nContact buttons and channels, with WhatsApp integration\nBasic SEO setup\nDomain setup and publishing to the hosting environment\nFunctionality, navigation and responsiveness testing before launch'
    },
    es: {
      titulo: 'Creación de Sitio Web Institucional',
      obj: 'fortalezca la presencia online de la empresa, facilite el contacto con los clientes y amplíe las oportunidades comerciales',
      objs: 'Presentar la empresa, sus productos y servicios de forma profesional\nFacilitar el contacto de los clientes, también por WhatsApp\nFortalecer la presencia online y ampliar las oportunidades comerciales',
      escopo: 'Planificación y estructura | Planificación y organización de las páginas del sitio\nDiseño personalizado y responsivo | Desarrollado para ordenadores, tabletas y móviles\nPresentación institucional | Empresa, productos y servicios presentados de forma profesional\nContenidos e imágenes | Organización de textos, imágenes e información comercial\nCanales de contacto | Botones de contacto e integración con WhatsApp\nSEO básico | Configuración básica para los motores de búsqueda\nDominio y publicación | Configuración del dominio y publicación en el entorno de alojamiento\nPruebas antes de publicar | Funcionamiento, navegación y adaptabilidad',
      mensalItens: 'Alojamiento e infraestructura para mantener el sitio en línea\nMonitoreo básico de disponibilidad y funcionamiento\nMantenimiento técnico preventivo\nSoporte técnico para necesidades relacionadas con el sitio\nPequeños ajustes y cambios de contenido, según el alcance contratado\nActualizaciones técnicas y correcciones necesarias',
      crono: 'Aprobación de la vista previa | Completada\nAjustes y contenido final | 3 días\nDominio y alojamiento | 1 día\nPruebas de funcionamiento y adaptabilidad | 1 día\nSitio en línea | 1 día',
      prazo: '6 días hábiles',
      cEscopo: 'Planificación y estructuración de las páginas del sitio\nDiseño personalizado y responsivo para ordenadores, tabletas y móviles\nPresentación institucional de la empresa, productos y servicios\nOrganización de contenidos, imágenes e información comercial\nBotones y canales de contacto, con integración con WhatsApp\nConfiguración básica de SEO\nConfiguración del dominio y publicación en el entorno de alojamiento\nPruebas de funcionamiento, navegación y adaptabilidad antes de publicar'
    }
  };

  /* ---------- Contrato ---------- */
  var C = {
    pt: {
      t_mens: 'DA MENSALIDADE (HOSPEDAGEM E MANUTENÇÃO)',
      mens1: 'Após a publicação do site, a CONTRATANTE pagará à CONTRATADA a mensalidade de <b>{v}</b>, cobrada mensalmente, referente à hospedagem e à manutenção do site, que compreende:',
      mens2: 'A mensalidade é recorrente e passa a ser devida a partir da publicação do site. Aplicam-se a ela as mesmas regras de multa e juros por atraso da cláusula do preço e do pagamento. Alterações e serviços além do escopo contratado poderão ser orçados à parte.',
      mens3: 'A CONTRATANTE poderá encerrar a mensalidade mediante aviso prévio de <b>{d}</b>. Encerrada a mensalidade, o site poderá ser retirado do ar ao término do período já pago.',
      A: 'CONTRATADA', B: 'CONTRATANTE', clause: 'CLÁUSULA',
      title: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS', no: 'Nº', proposal: 'Proposta', doc: 'Contrato', page: 'Página', of: 'de',
      ph: { mensal: '[valor da mensalidade]', cliPJ: '[razão social do cliente]', cliPF: '[nome do cliente]', cnpj: '[CNPJ]', cpf: '[CPF]', end: '[endereço completo]', rep: '[representante legal]', repDoc: '[CPF do representante]', scope: '[descreva o escopo]', prazo: '[prazo em dias úteis]', valor: '[valor total]', foro: '[comarca]', cidade: '[cidade]', cli: '[cliente]' },
      p1: 'Pelo presente instrumento particular, de um lado <b>{emp}</b>{cnpj}{sede}{rep}, doravante denominada <b>CONTRATADA</b>;',
      cnpj: ', inscrita no CNPJ sob o nº <b>{v}</b>', sede: ', com sede em {v}', rep: ', neste ato representada por <b>{n}</b>{c}',
      cliPJ: '<b>{nome}</b>, inscrita no CNPJ sob o nº <b>{doc}</b>, com endereço em {end}, neste ato representada por <b>{rep}</b>, CPF nº {repDoc}',
      cliPF: '<b>{nome}</b>, inscrito(a) no CPF sob o nº <b>{doc}</b>, com endereço em {end}',
      p2: 'e, de outro lado, {cli}, doravante denominado(a) <b>CONTRATANTE</b>;',
      p3: 'têm entre si justo e contratado o que segue, mediante as cláusulas e condições abaixo.',
      t_obj: 'DO OBJETO', obj1: 'A CONTRATADA prestará à CONTRATANTE o serviço de <b>{t}</b>, compreendendo as seguintes entregas:',
      obj2: 'Itens não descritos acima são considerados fora do escopo e poderão ser orçados à parte, mediante aprovação prévia da CONTRATANTE.',
      obj3: ' A proposta comercial nº {n} integra este contrato como anexo, prevalecendo este instrumento em caso de divergência.',
      t_ob1: 'DAS OBRIGAÇÕES DA CONTRATADA',
      ob1: ['Executar os serviços com diligência técnica e dentro do prazo ajustado;', 'Manter a CONTRATANTE informada sobre o andamento do projeto;', 'Apresentar o layout para aprovação antes do desenvolvimento;', 'Entregar o projeto publicado e em funcionamento, conforme o escopo.'],
      t_ob2: 'DAS OBRIGAÇÕES DA CONTRATANTE',
      ob2: ['Fornecer textos, imagens, logotipo e demais materiais em até {d} após a assinatura;', 'Responder às solicitações de aprovação e validação em prazo razoável;', 'Garantir que possui os direitos sobre os conteúdos que fornecer, isentando a CONTRATADA de reivindicações de terceiros a eles relativas;', 'Efetuar os pagamentos nas datas acordadas.'],
      bd: 'dias úteis', dd: 'dias', t_prazo: 'DO PRAZO',
      prazo: 'O prazo de entrega é de <b>{p}</b>, contado a partir da assinatura, do pagamento inicial e do recebimento integral dos materiais. Atrasos no envio de materiais ou nas aprovações da CONTRATANTE suspendem o prazo pelo período correspondente.',
      t_pag: 'DO PREÇO E DO PAGAMENTO', pag1: 'Pelos serviços, a CONTRATANTE pagará à CONTRATADA o valor total de <b>{v}</b>, {how}{taxes}',
      taxes: ' O valor já inclui as tarifas da plataforma de pagamento.',
      pEntrada: 'da seguinte forma: {entry}, e o saldo{sv} em <b>{n}</b>{each}.', pEntry: 'entrada de <b>{pct}</b> ({v}) na assinatura deste contrato', pNoEntry: 'sem entrada', pEach: ' de {v}',
      pCartao: 'por cartão de crédito, em <b>{n}</b>{each}, mediante link de pagamento enviado pela CONTRATADA.', pOutro: 'conforme as condições descritas abaixo.',
      pAvista: 'em parcela única, à vista, por transferência, Pix ou boleto, na assinatura deste contrato.', pPix: 'em parcela única, à vista, via Pix, na assinatura deste contrato.',
      parcela: 'parcela', parcelas: 'parcelas',
      late: 'O atraso no pagamento sujeita a CONTRATANTE a multa de <b>{m}%</b> sobre o valor em atraso, mais juros de <b>{j}% ao mês</b>, e autoriza a CONTRATADA a suspender a execução dos serviços até a regularização.',
      t_rev: 'DAS REVISÕES', rev: 'Estão incluídas <b>{n}</b> do layout e do site. Alterações que ultrapassem esse limite ou que mudem o escopo aprovado poderão ser cobradas à parte.', round: 'rodada de revisão', rounds: 'rodadas de revisão',
      t_host: 'DA HOSPEDAGEM E DO DOMÍNIO',
      host_i: 'A hospedagem e o registro do domínio estão inclusos pelo período de 12 (doze) meses, contados da publicação. Após esse prazo, a renovação será de responsabilidade da CONTRATANTE.',
      host_n: 'A hospedagem e o domínio não estão inclusos neste contrato. A CONTRATADA poderá orientar a contratação, sem responsabilidade pelos serviços de terceiros.',
      host_c: 'A hospedagem e o registro do domínio serão contratados pela CONTRATANTE, em seu nome, cabendo à CONTRATADA a configuração técnica necessária.',
      t_ip: 'DA PROPRIEDADE INTELECTUAL',
      ip_c: 'Com o pagamento integral do preço, a CONTRATADA cede à CONTRATANTE os direitos patrimoniais sobre o design e o código desenvolvidos especificamente para o projeto, excluídos bibliotecas, ferramentas e componentes de terceiros ou de uso geral, que seguem suas respectivas licenças. Até o pagamento integral, os direitos permanecem com a CONTRATADA.',
      ip_l: 'A titularidade do código e dos elementos criados permanece com a CONTRATADA, que concede à CONTRATANTE licença de uso do site para a finalidade contratada.',
      port_y: 'A CONTRATADA poderá divulgar o projeto em seu portfólio e materiais institucionais.', port_n: 'A CONTRATADA não divulgará o projeto em seu portfólio sem autorização prévia da CONTRATANTE.',
      t_sup: 'DO SUPORTE PÓS-ENTREGA', sup: 'Após a entrega, a CONTRATADA corrigirá, sem custo, erros de funcionamento decorrentes do desenvolvimento pelo prazo de <b>{d}</b>. Novas funcionalidades e alterações de conteúdo serão orçadas à parte.',
      t_conf: 'DA CONFIDENCIALIDADE', conf: 'As partes manterão sigilo sobre as informações confidenciais a que tiverem acesso em razão deste contrato, utilizando-as apenas para sua execução, durante a vigência e por 2 (dois) anos após seu término.',
      t_lgpd: 'DA PROTEÇÃO DE DADOS', lgpd: 'As partes tratarão os dados pessoais envolvidos neste contrato em conformidade com a Lei nº 13.709/2018 (LGPD), utilizando-os somente para as finalidades contratadas. A CONTRATANTE é responsável pela base legal do tratamento dos dados de seus clientes e visitantes coletados pelo site.',
      t_lim: 'DOS SERVIÇOS DE TERCEIROS', lim: 'A CONTRATADA não responde por indisponibilidade, alterações de preço ou de política de serviços de terceiros utilizados no projeto (hospedagem, domínio, plataformas de pagamento, redes sociais, ferramentas de análise e similares).',
      t_add: 'DISPOSIÇÕES ADICIONAIS',
      t_res: 'DA RESCISÃO', res: 'Qualquer das partes pode rescindir este contrato mediante aviso por escrito com antecedência mínima de <b>{a}</b>. Se a rescisão partir da CONTRATANTE após o início dos trabalhos, serão devidos os serviços já executados e multa de <b>{m}%</b> sobre o valor total, sem prejuízo do pagamento proporcional pelo trabalho realizado, quando superior. O descumprimento de obrigação essencial, não sanado em 5 (cinco) dias após notificação, autoriza a rescisão imediata.',
      t_gen: 'DAS DISPOSIÇÕES GERAIS', gen: 'Este contrato obriga as partes e seus sucessores. Alterações só terão validade se feitas por escrito e assinadas por ambas as partes. A tolerância de uma parte quanto ao descumprimento da outra não implica renúncia ou novação.',
      sig_e: 'As partes reconhecem a validade da assinatura eletrônica deste instrumento, nos termos do art. 10, § 2º, da Medida Provisória nº 2.200-2/2001, e concordam que o documento assinado eletronicamente é prova suficiente de sua celebração.',
      sig_p: 'O contrato é firmado em 2 (duas) vias de igual teor, uma para cada parte.',
      t_law: 'DO FORO', law: 'Fica eleito o foro da comarca de <b>{f}</b> para dirimir quaisquer dúvidas oriundas deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.',
      sA: 'Contratada', sB: 'Contratante', w1: 'Testemunha 1', w2: 'Testemunha 2', name: 'Nome:', tax: 'CPF:', taxPJ: 'CNPJ', taxPF: 'CPF'
    },
    en: {
      t_mens: 'MONTHLY FEE (HOSTING AND MAINTENANCE)',
      mens1: 'After the website goes live, the CLIENT will pay the PROVIDER a monthly fee of <b>{v}</b>, charged monthly, for hosting and maintenance of the website, which comprises:',
      mens2: 'The monthly fee is recurring and becomes due from the day the website goes live. The same late-payment penalty and interest rules of the price and payment clause apply to it. Changes and services beyond the contracted scope may be quoted separately.',
      mens3: 'The CLIENT may end the monthly service upon <b>{d}</b> prior notice. Once ended, the website may be taken offline at the end of the period already paid.',
      A: 'PROVIDER', B: 'CLIENT', clause: 'CLAUSE',
      title: 'SERVICES AGREEMENT', no: 'No.', proposal: 'Proposal', doc: 'Agreement', page: 'Page', of: 'of',
      ph: { mensal: '[monthly fee]', cliPJ: '[client company name]', cliPF: '[client name]', cnpj: '[company tax ID]', cpf: '[ID / tax number]', end: '[full address]', rep: '[legal representative]', repDoc: '[representative’s ID]', scope: '[describe the scope]', prazo: '[deadline in business days]', valor: '[total amount]', foro: '[jurisdiction]', cidade: '[city]', cli: '[client]' },
      p1: 'This private agreement is entered into by and between <b>{emp}</b>{cnpj}{sede}{rep}, hereinafter the <b>PROVIDER</b>;',
      cnpj: ', registered under CNPJ no. <b>{v}</b>', sede: ', with offices at {v}', rep: ', herein represented by <b>{n}</b>{c}',
      cliPJ: '<b>{nome}</b>, tax ID <b>{doc}</b>, located at {end}, herein represented by <b>{rep}</b>, ID no. {repDoc}',
      cliPF: '<b>{nome}</b>, ID / tax no. <b>{doc}</b>, residing at {end}',
      p2: 'and {cli}, hereinafter the <b>CLIENT</b>;',
      p3: 'each a “Party” and together the “Parties”, who agree to the following terms and conditions.',
      t_obj: 'SUBJECT MATTER', obj1: 'The PROVIDER will render to the CLIENT the service of <b>{t}</b>, comprising the following deliverables:',
      obj2: 'Items not described above are outside the scope and may be quoted separately, subject to the CLIENT’s prior approval.',
      obj3: ' Commercial proposal no. {n} is attached to and forms part of this agreement; this agreement prevails in case of conflict.',
      t_ob1: 'OBLIGATIONS OF THE PROVIDER',
      ob1: ['Perform the services with technical diligence and within the agreed timeline;', 'Keep the CLIENT informed of the project’s progress;', 'Present the layout for approval before development;', 'Deliver the project published and working, as per the scope.'],
      t_ob2: 'OBLIGATIONS OF THE CLIENT',
      ob2: ['Provide texts, images, logo and other materials within {d} after signing;', 'Respond to approval and validation requests within a reasonable time;', 'Ensure it holds the rights to the content it provides, holding the PROVIDER harmless from third-party claims related to it;', 'Make payments on the agreed dates.'],
      bd: 'business days', dd: 'days', t_prazo: 'TIMELINE',
      prazo: 'The delivery deadline is <b>{p}</b>, counted from signing, the initial payment and full receipt of the materials. Delays in sending materials or in the CLIENT’s approvals suspend the deadline for the corresponding period.',
      t_pag: 'PRICE AND PAYMENT', pag1: 'For the services, the CLIENT will pay the PROVIDER a total of <b>{v}</b>, {how}{taxes}',
      taxes: ' The amount already includes the payment platform fees.',
      pEntrada: 'as follows: {entry}, and the balance{sv} in <b>{n}</b>{each}.', pEntry: 'a down payment of <b>{pct}</b> ({v}) upon signing this agreement', pNoEntry: 'no down payment', pEach: ' of {v} each',
      pCartao: 'by credit card, in <b>{n}</b>{each}, through a payment link sent by the PROVIDER.', pOutro: 'under the terms described below.',
      pAvista: 'in a single payment, upfront, by bank transfer or payment link, upon signing this agreement.', pPix: 'in a single payment, upfront, upon signing this agreement.',
      parcela: 'installment', parcelas: 'installments',
      late: 'Late payment subjects the CLIENT to a penalty of <b>{m}%</b> on the overdue amount, plus interest of <b>{j}% per month</b>, and entitles the PROVIDER to suspend the services until the payment is regularized.',
      t_rev: 'REVISIONS', rev: '<b>{n}</b> of the layout and the website are included. Changes beyond this limit or that alter the approved scope may be charged separately.', round: 'revision round', rounds: 'revision rounds',
      t_host: 'HOSTING AND DOMAIN',
      host_i: 'Hosting and domain registration are included for 12 (twelve) months from publication. After that period, renewal is the CLIENT’s responsibility.',
      host_n: 'Hosting and domain are not included in this agreement. The PROVIDER may advise on contracting them, without liability for third-party services.',
      host_c: 'Hosting and domain registration will be contracted by the CLIENT, in its own name, with the PROVIDER handling the necessary technical setup.',
      t_ip: 'INTELLECTUAL PROPERTY',
      ip_c: 'Upon full payment of the price, the PROVIDER assigns to the CLIENT the economic rights to the design and code developed specifically for the project, excluding third-party or general-purpose libraries, tools and components, which remain under their respective licenses. Until full payment, the rights remain with the PROVIDER.',
      ip_l: 'Ownership of the code and the elements created remains with the PROVIDER, which grants the CLIENT a license to use the website for the contracted purpose.',
      port_y: 'The PROVIDER may showcase the project in its portfolio and institutional materials.', port_n: 'The PROVIDER will not showcase the project in its portfolio without the CLIENT’s prior authorization.',
      t_sup: 'POST-DELIVERY SUPPORT', sup: 'After delivery, the PROVIDER will fix, at no cost, functional errors arising from the development for <b>{d}</b>. New features and content changes will be quoted separately.',
      t_conf: 'CONFIDENTIALITY', conf: 'The Parties will keep confidential the information they access because of this agreement, using it only to perform it, during its term and for 2 (two) years after it ends.',
      t_lgpd: 'DATA PROTECTION', lgpd: 'The Parties will process the personal data involved in this agreement in compliance with applicable data protection laws, including Brazilian Law No. 13,709/2018 (LGPD), using it only for the contracted purposes. The CLIENT is responsible for the legal basis for processing its customers’ and visitors’ data collected through the website.',
      t_lim: 'THIRD-PARTY SERVICES', lim: 'The PROVIDER is not liable for unavailability, price changes or policy changes of third-party services used in the project (hosting, domain, payment platforms, social networks, analytics tools and the like).',
      t_add: 'ADDITIONAL PROVISIONS',
      t_res: 'TERMINATION', res: 'Either Party may terminate this agreement by written notice at least <b>{a}</b> in advance. If the CLIENT terminates after work has begun, the services already performed are due, plus a fee of <b>{m}%</b> of the total price, without prejudice to proportional payment for the work done when greater. Breach of an essential obligation not cured within 5 (five) days after notice allows immediate termination.',
      t_gen: 'GENERAL PROVISIONS', gen: 'This agreement binds the Parties and their successors. Amendments are valid only if in writing and signed by both Parties. A Party’s tolerance of the other’s breach is not a waiver or novation.',
      sig_e: 'The Parties acknowledge the validity of the electronic signature of this agreement and agree that the electronically signed document is sufficient proof of its execution.',
      sig_p: 'This agreement is signed in 2 (two) counterparts of equal content, one for each Party.',
      t_law: 'GOVERNING LAW AND VENUE', law: 'This agreement is governed by the laws of Brazil. The courts of <b>{f}</b>, Brazil, have jurisdiction to settle any dispute arising from it, to the exclusion of any other.',
      sA: 'Provider', sB: 'Client', w1: 'Witness 1', w2: 'Witness 2', name: 'Name:', tax: 'ID:', taxPJ: 'Tax ID', taxPF: 'ID'
    },
    es: {
      t_mens: 'DE LA MENSUALIDAD (ALOJAMIENTO Y MANTENIMIENTO)',
      mens1: 'Tras la publicación del sitio, el CLIENTE pagará a la CONTRATISTA una mensualidad de <b>{v}</b>, cobrada mensualmente, por el alojamiento y el mantenimiento del sitio, que comprende:',
      mens2: 'La mensualidad es recurrente y es exigible desde la publicación del sitio. Se le aplican las mismas reglas de multa e intereses por demora de la cláusula del precio y del pago. Los cambios y servicios fuera del alcance contratado podrán presupuestarse aparte.',
      mens3: 'El CLIENTE podrá dar por terminada la mensualidad con un preaviso de <b>{d}</b>. Terminada la mensualidad, el sitio podrá ser dado de baja al término del período ya pagado.',
      A: 'CONTRATISTA', B: 'CLIENTE', clause: 'CLÁUSULA',
      title: 'CONTRATO DE PRESTACIÓN DE SERVICIOS', no: 'N.º', proposal: 'Propuesta', doc: 'Contrato', page: 'Página', of: 'de',
      ph: { mensal: '[valor de la mensualidad]', cliPJ: '[razón social del cliente]', cliPF: '[nombre del cliente]', cnpj: '[identificación fiscal]', cpf: '[documento de identidad]', end: '[dirección completa]', rep: '[representante legal]', repDoc: '[documento del representante]', scope: '[describa el alcance]', prazo: '[plazo en días hábiles]', valor: '[importe total]', foro: '[jurisdicción]', cidade: '[ciudad]', cli: '[cliente]' },
      p1: 'Por el presente contrato privado, de una parte <b>{emp}</b>{cnpj}{sede}{rep}, en adelante la <b>CONTRATISTA</b>;',
      cnpj: ', inscrita con CNPJ n.º <b>{v}</b>', sede: ', con domicilio en {v}', rep: ', representada en este acto por <b>{n}</b>{c}',
      cliPJ: '<b>{nome}</b>, identificación fiscal <b>{doc}</b>, con domicilio en {end}, representada en este acto por <b>{rep}</b>, documento n.º {repDoc}',
      cliPF: '<b>{nome}</b>, documento n.º <b>{doc}</b>, con domicilio en {end}',
      p2: 'y de otra parte {cli}, en adelante el <b>CLIENTE</b>;',
      p3: 'ambas denominadas conjuntamente las “Partes”, acuerdan lo siguiente, conforme a las cláusulas y condiciones que siguen.',
      t_obj: 'DEL OBJETO', obj1: 'La CONTRATISTA prestará al CLIENTE el servicio de <b>{t}</b>, que comprende los siguientes entregables:',
      obj2: 'Los elementos no descritos arriba se consideran fuera del alcance y podrán presupuestarse aparte, previa aprobación del CLIENTE.',
      obj3: ' La propuesta comercial n.º {n} se adjunta y forma parte de este contrato, prevaleciendo este instrumento en caso de divergencia.',
      t_ob1: 'DE LAS OBLIGACIONES DE LA CONTRATISTA',
      ob1: ['Ejecutar los servicios con diligencia técnica y dentro del plazo acordado;', 'Mantener informado al CLIENTE sobre el avance del proyecto;', 'Presentar el diseño para su aprobación antes del desarrollo;', 'Entregar el proyecto publicado y en funcionamiento, conforme al alcance.'],
      t_ob2: 'DE LAS OBLIGACIONES DEL CLIENTE',
      ob2: ['Proporcionar textos, imágenes, logotipo y demás materiales en un máximo de {d} tras la firma;', 'Responder a las solicitudes de aprobación y validación en un plazo razonable;', 'Garantizar que posee los derechos sobre los contenidos que proporcione, eximiendo a la CONTRATISTA de reclamaciones de terceros relativas a ellos;', 'Efectuar los pagos en las fechas acordadas.'],
      bd: 'días hábiles', dd: 'días', t_prazo: 'DEL PLAZO',
      prazo: 'El plazo de entrega es de <b>{p}</b>, contado desde la firma, el pago inicial y la recepción completa de los materiales. Los retrasos en el envío de materiales o en las aprobaciones del CLIENTE suspenden el plazo por el período correspondiente.',
      t_pag: 'DEL PRECIO Y DEL PAGO', pag1: 'Por los servicios, el CLIENTE pagará a la CONTRATISTA el importe total de <b>{v}</b>, {how}{taxes}',
      taxes: ' El importe ya incluye las comisiones de la plataforma de pago.',
      pEntrada: 'de la siguiente forma: {entry}, y el saldo{sv} en <b>{n}</b>{each}.', pEntry: 'un anticipo de <b>{pct}</b> ({v}) a la firma de este contrato', pNoEntry: 'sin anticipo', pEach: ' de {v} cada una',
      pCartao: 'con tarjeta de crédito, en <b>{n}</b>{each}, mediante enlace de pago enviado por la CONTRATISTA.', pOutro: 'conforme a las condiciones descritas a continuación.',
      pAvista: 'en un único pago, al contado, por transferencia o enlace de pago, a la firma de este contrato.', pPix: 'en un único pago, al contado, a la firma de este contrato.',
      parcela: 'cuota', parcelas: 'cuotas',
      late: 'El retraso en el pago somete al CLIENTE a una multa del <b>{m}%</b> sobre el importe vencido, más intereses del <b>{j}% mensual</b>, y autoriza a la CONTRATISTA a suspender los servicios hasta su regularización.',
      t_rev: 'DE LAS REVISIONES', rev: 'Se incluyen <b>{n}</b> del diseño y del sitio web. Los cambios que excedan ese límite o modifiquen el alcance aprobado podrán cobrarse aparte.', round: 'ronda de revisión', rounds: 'rondas de revisión',
      t_host: 'DEL ALOJAMIENTO Y DEL DOMINIO',
      host_i: 'El alojamiento y el registro del dominio están incluidos por 12 (doce) meses desde la publicación. Transcurrido ese plazo, la renovación corre por cuenta del CLIENTE.',
      host_n: 'El alojamiento y el dominio no están incluidos en este contrato. La CONTRATISTA podrá orientar su contratación, sin responsabilidad por servicios de terceros.',
      host_c: 'El alojamiento y el registro del dominio serán contratados por el CLIENTE, a su nombre, correspondiendo a la CONTRATISTA la configuración técnica necesaria.',
      t_ip: 'DE LA PROPIEDAD INTELECTUAL',
      ip_c: 'Con el pago íntegro del precio, la CONTRATISTA cede al CLIENTE los derechos patrimoniales sobre el diseño y el código desarrollados específicamente para el proyecto, excluidas las bibliotecas, herramientas y componentes de terceros o de uso general, que siguen sus respectivas licencias. Hasta el pago íntegro, los derechos permanecen con la CONTRATISTA.',
      ip_l: 'La titularidad del código y de los elementos creados permanece con la CONTRATISTA, que concede al CLIENTE una licencia de uso del sitio web para la finalidad contratada.',
      port_y: 'La CONTRATISTA podrá difundir el proyecto en su portafolio y materiales institucionales.', port_n: 'La CONTRATISTA no difundirá el proyecto en su portafolio sin autorización previa del CLIENTE.',
      t_sup: 'DEL SOPORTE POSTERIOR A LA ENTREGA', sup: 'Tras la entrega, la CONTRATISTA corregirá sin costo los errores de funcionamiento derivados del desarrollo durante <b>{d}</b>. Las nuevas funcionalidades y los cambios de contenido se presupuestarán aparte.',
      t_conf: 'DE LA CONFIDENCIALIDAD', conf: 'Las Partes guardarán confidencialidad sobre la información a la que accedan por este contrato, utilizándola solo para su ejecución, durante su vigencia y por 2 (dos) años tras su finalización.',
      t_lgpd: 'DE LA PROTECCIÓN DE DATOS', lgpd: 'Las Partes tratarán los datos personales implicados en este contrato conforme a la normativa de protección de datos aplicable, incluida la Ley brasileña n.º 13.709/2018 (LGPD), utilizándolos solo para las finalidades contratadas. El CLIENTE es responsable de la base legal del tratamiento de los datos de sus clientes y visitantes recogidos por el sitio web.',
      t_lim: 'DE LOS SERVICIOS DE TERCEROS', lim: 'La CONTRATISTA no responde por la indisponibilidad, cambios de precio o de política de servicios de terceros utilizados en el proyecto (alojamiento, dominio, plataformas de pago, redes sociales, herramientas de análisis y similares).',
      t_add: 'DISPOSICIONES ADICIONALES',
      t_res: 'DE LA RESCISIÓN', res: 'Cualquiera de las Partes puede rescindir este contrato mediante aviso por escrito con una antelación mínima de <b>{a}</b>. Si la rescisión parte del CLIENTE una vez iniciados los trabajos, se deberán los servicios ya ejecutados y una multa del <b>{m}%</b> sobre el valor total, sin perjuicio del pago proporcional por el trabajo realizado, cuando sea superior. El incumplimiento de una obligación esencial, no subsanado en 5 (cinco) días tras la notificación, autoriza la rescisión inmediata.',
      t_gen: 'DE LAS DISPOSICIONES GENERALES', gen: 'Este contrato obliga a las Partes y a sus sucesores. Las modificaciones solo serán válidas si se hacen por escrito y firmadas por ambas Partes. La tolerancia de una Parte ante el incumplimiento de la otra no implica renuncia ni novación.',
      sig_e: 'Las Partes reconocen la validez de la firma electrónica de este instrumento y acuerdan que el documento firmado electrónicamente es prueba suficiente de su celebración.',
      sig_p: 'El contrato se firma en 2 (dos) ejemplares de igual contenido, uno para cada Parte.',
      t_law: 'DE LA LEY APLICABLE Y DEL FUERO', law: 'Este contrato se rige por las leyes de Brasil. Se eligen los tribunales de <b>{f}</b>, Brasil, para resolver cualquier controversia derivada del mismo, con renuncia a cualquier otro.',
      sA: 'Contratista', sB: 'Cliente', w1: 'Testigo 1', w2: 'Testigo 2', name: 'Nombre:', tax: 'Documento:', taxPJ: 'ID fiscal', taxPF: 'Documento'
    }
  };

  function fill(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? v[k] : m; }); }

  /* Textos padrão de versões anteriores: rascunhos que ainda os têm recebem os padrões novos (documentos salvos nunca são alterados). */
  var LEGACY = {"titulo":["Criação de Website","Website Development","Creación de Sitio Web"],"obj":["gerar contatos qualificados e fortalecer a presença da marca na internet","generates qualified leads and strengthens the brand’s presence online","genere contactos cualificados y refuerce la presencia de la marca en internet"],"objs":["Transmitir credibilidade e profissionalismo\nFacilitar o contato via WhatsApp e formulário\nAparecer melhor nas buscas do Google","Convey credibility and professionalism\nMake contact easy via WhatsApp and contact form\nRank better in Google searches","Transmitir credibilidad y profesionalismo\nFacilitar el contacto por WhatsApp y formulario\nAparecer mejor en las búsquedas de Google"],"escopo":["Design exclusivo | Layout personalizado alinhado à identidade visual, versões desktop e mobile\nDesenvolvimento | Site responsivo, rápido e otimizado para todos os dispositivos\nPáginas | Home, Sobre, Serviços, Portfólio e Contato\nSEO básico | Títulos, descrições, estrutura e velocidade otimizados para o Google\nIntegrações | WhatsApp, formulário de contato, Google Analytics e redes sociais\nHospedagem e domínio | Incluso por 12 meses\nTreinamento | Orientação para atualizar os conteúdos sozinho\nSuporte pós-entrega | 30 dias de ajustes e correções sem custo","Custom design | Tailored layout aligned with your visual identity, desktop and mobile versions\nDevelopment | Responsive, fast website optimized for all devices\nPages | Home, About, Services, Portfolio and Contact\nBasic SEO | Titles, descriptions, structure and speed optimized for Google\nIntegrations | WhatsApp, contact form, Google Analytics and social media\nHosting and domain | Included for 12 months\nTraining | Guidance to update the content yourself\nPost-delivery support | 30 days of free adjustments and fixes","Diseño exclusivo | Diseño personalizado alineado con la identidad visual, versiones de escritorio y móvil\nDesarrollo | Sitio responsivo, rápido y optimizado para todos los dispositivos\nPáginas | Inicio, Nosotros, Servicios, Portafolio y Contacto\nSEO básico | Títulos, descripciones, estructura y velocidad optimizados para Google\nIntegraciones | WhatsApp, formulario de contacto, Google Analytics y redes sociales\nAlojamiento y dominio | Incluido por 12 meses\nCapacitación | Orientación para actualizar los contenidos usted mismo\nSoporte posterior | 30 días de ajustes y correcciones sin costo"],"crono":["Briefing e planejamento | 2 dias\nDesign / protótipo | 5 dias\nAprovação do layout | 2 dias\nDesenvolvimento | 7 dias\nTestes e ajustes | 3 dias\nPublicação no ar | 1 dia","Briefing and planning | 2 days\nDesign / prototype | 5 days\nLayout approval | 2 days\nDevelopment | 7 days\nTesting and adjustments | 3 days\nGo live | 1 day","Briefing y planificación | 2 días\nDiseño / prototipo | 5 días\nAprobación del diseño | 2 días\nDesarrollo | 7 días\nPruebas y ajustes | 3 días\nPublicación | 1 día"],"prazo":["20 dias úteis","20 business days","20 días hábiles"],"cEscopo":["Design exclusivo da interface, versões desktop e mobile\nDesenvolvimento de site responsivo\nSEO básico\nIntegração com WhatsApp e formulário de contato","Custom interface design, desktop and mobile versions\nDevelopment of a responsive website\nBasic SEO\nWhatsApp and contact form integration","Diseño exclusivo de la interfaz, versiones de escritorio y móvil\nDesarrollo de un sitio web responsivo\nSEO básico\nIntegración con WhatsApp y formulario de contacto"],"mensalItens":["Hospedagem e infraestrutura para manter o site online\nMonitoramento básico de disponibilidade e funcionamento\nManutenção técnica preventiva\nSuporte técnico para necessidades relacionadas ao site\nPequenos ajustes e alterações de conteúdo, conforme o escopo contratado\nAtualizações técnicas e correções necessárias\nRotinas de backup e proteção dos arquivos do site","Hosting and infrastructure to keep the website online\nBasic availability and performance monitoring\nPreventive technical maintenance\nTechnical support for website-related needs\nMinor adjustments and content changes, within the contracted scope\nTechnical updates and necessary fixes\nBackup routines and protection of the website files","Alojamiento e infraestructura para mantener el sitio en línea\nMonitoreo básico de disponibilidad y funcionamiento\nMantenimiento técnico preventivo\nSoporte técnico para necesidades relacionadas con el sitio\nPequeños ajustes y cambios de contenido, según el alcance contratado\nActualizaciones técnicas y correcciones necesarias\nRutinas de copia de seguridad y protección de los archivos del sitio"]};
  /** O valor é o texto padrão (atual ou de versão anterior) de algum idioma? */
  function isDef(key, val, legacy) {
    for (var l in DEF) if (DEF[l][key] === val) return true;
    return !!legacy && (LEGACY[key] || []).indexOf(val) >= 0;
  }
  L.docs18n = { isDef: isDef, P: P, C: C, DEF: DEF, fill: fill, dateLong: dateLong, cur: cur, num: num, pct: pct, MESES: MESES };
})(window);
