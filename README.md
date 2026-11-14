# LDT · Propostas & Contratos

Sistema interno da **LDT Negócios & Soluções** para gerar **propostas comerciais** e **contratos de prestação de serviços** em PDF, com a identidade visual da LDT.

- **Painel**: lista de propostas e contratos salvos, status, busca e atalho para gerar contrato a partir de uma proposta.
- **Proposta**: formulário enxuto (cliente, valor, projeto) com prévia A4 ao vivo e PDF. Você informa quanto quer **receber (líquido)** e o sistema calcula o preço, descontando o **imposto da nota fiscal** (uso interno) e a **taxa da TechFX (0,5% sobre a cobrança)**. O cliente vê só o valor final.
- **Contrato**: cláusulas com liga/desliga, valor por extenso, paginação A4 e campos pendentes destacados. Pode ser criado com um clique a partir da proposta.
- **Idiomas**: interface em português, inglês e espanhol (seletor no menu). Cada proposta e contrato escolhe o idioma do documento (PT/EN/ES) e a moeda (BRL/USD/EUR).
- **Configurações**: dados da empresa, regime/imposto, taxa da TechFX, idioma e moeda padrão, backup (exportar/importar JSON).

Fluxo: prévia do site aprovada → **Nova proposta** (calcula o preço) → cliente aceita → **Gerar contrato**.

## Tipo de projeto e stack

Aplicação web estática (ferramenta interna, não é landing page nem institucional nem e-commerce). HTML, CSS e JavaScript puro, **sem build e sem dependências**. Fonte Poppins hospedada no próprio projeto. O PDF é gerado pela impressão do navegador ("Salvar como PDF").

Os dados ficam no **localStorage do navegador**: não há servidor nem banco de dados. Use **Configurações > Backup** para exportar. Limpar os dados do navegador apaga os documentos.

## Estrutura

```
public/                 pasta publicada (Cloudflare Pages)
  index.html            Painel
  proposta/index.html   Editor de propostas
  contrato/index.html   Editor de contratos
  configuracoes/        Empresa, imposto/Asaas, backup
  404.html  robots.txt  _headers
  assets/css            tokens, base, app, documents
  assets/js/core        format, store, pricing, ui, bridge
  assets/js/modules     shell, dashboard, config, editor, proposta, contrato
  assets/fonts  img     Poppins e logotipos
```

## Rodar localmente

Requer apenas Python 3 (ou qualquer servidor estático):

```bash
python3 -m http.server 8000 -d public
# abra http://localhost:8000
```

Não há `npm install` nem build.

## Publicar

### 1. GitHub (pela interface web)
1. Crie um repositório (privado, de preferência) em github.com/new.
2. **Add file > Upload files** e arraste o **conteúdo** da pasta do projeto (`public/`, `README.md`, `.gitignore`, `.env.example`). Mantenha as pastas.
3. **Commit changes**.
4. Para atualizar depois: abra o arquivo no GitHub, clique no lápis (editar) ou **Add file > Upload files** com o mesmo caminho, e faça o commit.

### 2. Cloudflare Pages (deploy automático)
1. Cloudflare > **Workers & Pages > Create > Pages > Connect to Git** e escolha o repositório.
2. **Framework preset**: None. **Build command**: vazio. **Build output directory**: `public`.
3. Não há variáveis de ambiente. Clique em **Save and Deploy**.
4. A cada commit na branch principal o Cloudflare publica de novo sozinho.

Como o sistema guarda dados privados de clientes **no navegador de quem usa**, considere proteger a URL com **Cloudflare Access** (Zero Trust > Access > Applications) para só você abrir. `robots.txt` e `noindex` já impedem a indexação.

## Segurança
`_headers` aplica CSP restritiva (sem scripts inline), `X-Frame-Options: DENY`, `nosniff` e `no-referrer`. Não há chaves nem segredos no código.

## Limitações e pendências
- Dados só no navegador/dispositivo usado. Faça backups.
- O imposto da nota fiscal e a taxa da TechFX (0,5%) são editáveis em Configurações. Os cálculos são estimativas; confirme com o contador e com seu contrato com a TechFX.
- Os textos em inglês e espanhol, inclusive o modelo de contrato, são traduções de apoio: peça revisão jurídica antes de usar com clientes de outros países.
- O modelo de contrato é um ponto de partida: **peça revisão de um advogado**.
- Pontuações do Lighthouse não foram medidas neste ambiente.
