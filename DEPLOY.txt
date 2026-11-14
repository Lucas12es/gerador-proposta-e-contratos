# Deploy: GitHub + Cloudflare

Sem build e sem variáveis de ambiente. A pasta publicada é `public`.

## 1. GitHub (pelo site, sem terminal)
1. Abra https://github.com/Lucas12es/gerador-proposta-e-contratos
2. **Add file > Upload files**.
3. Abra a pasta do projeto no computador, selecione **tudo** (`public`, `README.md`, `DEPLOY.md`, `wrangler.jsonc`, `.gitignore`, `.env.example`) e arraste para a página. Os arquivos que começam com ponto podem estar ocultos no Windows: ative **Exibir > Itens ocultos** no Explorador de Arquivos.
4. Escreva uma mensagem e clique em **Commit changes**.
5. Para atualizar depois: repita o upload com os arquivos alterados (mesmo caminho) e faça o commit.

## 2. Cloudflare Pages (deploy automático a cada commit)
1. Cloudflare > **Workers & Pages > Create > Pages > Connect to Git** e escolha `gerador-proposta-e-contratos`.
2. Framework preset: **None**. Build command: **(vazio)**. Build output directory: **public**.
3. **Save and Deploy**. Cada commit novo publica sozinho.

Alternativa pelo Workers (o `wrangler.jsonc` já está pronto): Workers & Pages > Create > Import a repository, build command vazio e deploy command `npx wrangler deploy`.

## 3. Depois de publicar
- Teste `/`, `/proposta/`, `/contrato/` e `/configuracoes/`.
- Proteja a URL com Cloudflare Access (Zero Trust), pois os dados dos clientes ficam no navegador de quem usa.
