# Publicação no Cloudflare Pages

O projeto foi preparado para o plano gratuito do Cloudflare Pages, com URL inicial `https://<projeto>.pages.dev/`. Não há backend, banco de dados ou build server obrigatório: a pasta `dist/` é estática.

---

## 1. Antes de publicar

```bash
# na raiz do projeto
node scripts/build.js
node scripts/package.js
```

O comando gera:

- `dist/index.html`
- `dist/assets/` (capas, páginas, planilha, amostra, fontes, favicon, OG)
- `dist/_headers` (cache e cabeçalhos de segurança)
- `dist/LEIA-ME.txt` (nota de publicação)

Confira se o build não avisou de checkout vazio. Se avisou, preencha `src/config.js` e rode de novo.

---

## 2. Opção A — Direct Upload (mais simples)

1. Crie uma conta em <https://dash.cloudflare.com/>.
2. Vá em **Workers & Pages → Create → Pages → Upload assets**.
3. Dê um nome ao projeto, por exemplo `ia-de-verdade`.
4. Envie **o conteúdo** da pasta `dist/` (não a pasta pai).
5. Clique em **Deploy**.
6. A URL gratuita será algo como:

   ```
   https://ia-de-verdade.pages.dev/
   ```

7. Guarde essa URL. Ela será usada no canonical e no Open Graph (item 5).

### Alternativa por linha de comando (Wrangler)

```bash
npx wrangler pages deploy dist --project-name=ia-de-verdade
```

Na primeira vez, o Wrangler autentica no navegador. O nome do projeto precisa ser o mesmo criado no painel (ou será criado).

---

## 3. Opção B — Git + build automático

O repositório contém `scripts/build.js`, `scripts/package.js` e `package.json` sem dependências externas.

No Cloudflare Pages:

- **Framework preset:** None
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 20 (ou >=18)
- **Root directory:** `/` (raiz do repositório)

O comando `npm run build` executa `node scripts/build.js && node scripts/package.js`. Não há dependências de runtime; o build usa apenas Node e arquivos locais. Se o painel não rodar `npm install`, use o comando direto:

```
node scripts/build.js && node scripts/package.js
```

O `package-lock.json` é mínimo (sem dependências) e permite `npm ci` se o ambiente exigir.

> Se o painel reclamar de `npm install`, mantenha o `package.json`; ele não tem dependências. O build não precisa de rede.

---

## 4. O que já está configurado para Pages

### `_headers`

O arquivo `dist/_headers` é gerado automaticamente:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000

/index.html
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

- O HTML não fica preso em cache por muito tempo.
- Assets com hash/nome fixo ficam em cache por 1 ano. **Se trocar uma imagem mantendo o mesmo nome, renomeie ou faça purge** para evitar cache antigo.
- Cloudflare Pages respeita `_headers` na raiz do deploy.

### Caminhos relativos

O `index.html` usa `assets/...`, sem barra inicial. Funciona tanto em `https://projeto.pages.dev/` quanto em subdiretório, embora o esperado seja a raiz.

### Sem SPA fallback

Não há rotas de aplicação. O único HTML é `index.html`. Não é necessário `_redirects` para SPA.

---

## 5. Canonical, Open Graph e URL definitiva

O `site.url` está **vazio de propósito**; não inventamos um subdomínio. Depois do primeiro deploy:

1. Copie a URL real, por exemplo `https://ia-de-verdade.pages.dev/`.
2. Edite `src/config.js`:

```js
site: {
  url: 'https://ia-de-verdade.pages.dev/',
  ...
}
```

   Ou use a variável de ambiente no build:

```bash
IADV_SITE_URL='https://ia-de-verdade.pages.dev/' npm run build
```

3. Rode `npm run build` (ou `node scripts/build.js && node scripts/package.js`).
4. Refaça o deploy.
5. Confira no HTML gerado:

```bash
grep -E 'rel="canonical"|og:url|og:image' index.html
```

   Devem aparecer URLs absolutas com `https://...pages.dev/`.

6. Valide o compartilhamento:
   - Facebook Sharing Debugger
   - LinkedIn Post Inspector
   - WhatsApp (envie o link para você mesmo)

### Domínio próprio depois

No Cloudflare Pages:

1. **Custom domains → Set up a domain**.
2. Adicione o domínio (ex.: `iadeverdade.com.br`).
3. Ajuste o DNS conforme instruído (Cloudflare ou externo).
4. Espere o SSL.
5. Atualize `site.url` para o domínio final e rode o build/deploy novamente.
6. Decida se `www` redireciona para o apex ou o contrário (Cloudflare Redirect Rules ou Page Rules).

> Enquanto o domínio próprio não existir, use o `pages.dev` no canonical. Não deixe canonical apontando para um domínio que ainda não responde.

---

## 6. Checkout e entrega no Pages

A página é estática; o checkout é externo (Hotmart ou Kiwify). Ao clicar, o navegador vai para a URL configurada em `src/config.js`.

- **Não** coloque chaves de API, token de CAPI ou dados de cartão no Pages.
- A entrega é feita pela plataforma de checkout, não pelo Pages.
- O Pages só entrega `index.html`, imagens, fontes, amostra e metadados.
- Configure a entrega automática na Hotmart/Kiwify e teste uma compra real.

---

## 7. Teste pós-deploy

- [ ] `https://SEU-PROJETO.pages.dev/` abre.
- [ ] `https://SEU-PROJETO.pages.dev/assets/og-image.jpg` abre.
- [ ] `https://SEU-PROJETO.pages.dev/assets/amostra/IA-de-Verdade-Amostra-Cap1-2.pdf` abre.
- [ ] `https://SEU-PROJETO.pages.dev/assets/guia/Guia-da-Colecao-e-Grade.pdf` abre.
- [ ] A seção "Guia da coleção" carrega as duas prévias e o botão de download.
- [ ] Fontes carregam (sem fallback estranho).
- [ ] Header, menu mobile, FAQ, lightbox e CTA fixo funcionam.
- [ ] Não há erro 404 no console/Network.
- [ ] `_headers` está sendo aplicado (veja `Cache-Control` e `X-Content-Type-Options` na aba Network).
- [ ] Canonical e `og:url` apontam para a URL publicada.
- [ ] Compartilhamento no WhatsApp/Facebook mostra a imagem OG.
- [ ] Meta Pixel só carrega após consentimento (quando o ID real for configurado).
- [ ] Checkout abre a oferta correta.
- [ ] Teste em 4G e em celular real.

---

## 8. Limites e cuidados do plano gratuito

- O plano gratuito do Pages é adequado para uma landing page estática.
- O arquivo de amostra tem ~3,6 MB; o pacote total fica ~5,2 MB. Está dentro dos limites usuais de arquivo do Pages, mas evite subir arquivos gigantes.
- Não há garantia de SLA para o plano gratuito; para campanhas com verba alta, considere um plano pago ou um CDN com SLA.
- Assets em cache imutável: ao trocar imagens, renomeie ou faça purge.
- Política de privacidade, termos e reembolso ainda precisam ser publicados (podem ser rotas estáticas no mesmo projeto, ex.: `/privacidade/`).

---

## 9. Solução de problemas

| Sintoma | Causa provável | Correção |
|---|---|---|
| 404 na raiz | upload da pasta errada | envie o conteúdo de `dist/`, com `index.html` na raiz |
| CSS/imagens quebrados | `assets/` não subiu | confira `dist/assets/` e o caminho relativo |
| Canonical ainda vazio | `site.url` não preenchido ou build não rodado | preencha e rode `npm run build` |
| OG sem imagem | `og:image` relativo ou URL inacessível | preencha `site.url` e confirme `/assets/og-image.jpg` |
| Cache antigo após trocar imagem | `_headers` com 1 ano | renomeie o arquivo ou faça purge |
| Pixel não carrega | ID vazio, `enabled:false` ou consentimento recusado | configure e aceite a medição |
| Checkout não abre | URL vazia | preencha `checkout.*` e rode o build |
| Build falha no Pages | Node antigo | use Node >=18 (recomendado 20) |
