# IA de Verdade — página de vendas

Página estática de vendas da coleção **IA de Verdade** (6 volumes + catálogo), otimizada para leitura, conversão e publicação no Cloudflare Pages.

## Versão atual

- **13 seções**, ~1.770 palavras, **28 imagens no DOM** (27 de conteúdo + lightbox) e **14 caminhos de compra** (coleção + 7 individuais + 3 na escolha guiada).
- **14.469 px** de altura em 390 px (antes da rodada 2: 13.444 px; antes da otimização: 31.892 px).
- Tipografia com piso de 14 px para informação relevante; corpo 17/18 px.
- Um componente de botão; CTAs com 52–56 px; barra mobile de 56 px.
- Movimento com `IntersectionObserver`, contadores, jornada por scroll e redução de movimento.
- **Lighthouse mobile:** 96 performance · 96 acessibilidade · 100 boas práticas · 100 SEO.
- **Lighthouse desktop:** 100 em todas as categorias.
- Anel de 7 capas no hero, com hover, toque e fallback sem JS.
- CSS 644 linhas; JS 801 linhas; sem dependências de runtime.

Relatórios: [rodada 2](docs/CHANGELOG-RODADA-2.md) · [depoimentos](docs/DEPOIMENTOS.md) · [rodapé e individuais](docs/CHANGELOG-RODAPE-INDIVIDUAIS.md) · [changelog da otimização](docs/CHANGELOG-OTIMIZACAO.md) · [antes/depois](docs/ANTES-DEPOIS.md) · [Lighthouse](docs/LIGHTHOUSE.md) · [acessibilidade](docs/ACESSIBILIDADE.md) · [validação](docs/VALIDACAO.md) · [SEO](docs/SEO.md) · [CSS/JS](docs/CSS-JS.md).

## Estrutura

```
src/
  config.js        preços, checkouts, garantia, legal, tracking
  template.html    estrutura da página (11 seções)
  styles.css       design system enxuto
  app.js           comportamento
  guia-print.html  fonte do Guia da coleção
scripts/
  build.js         gera index.html, minifica CSS/JS, JSON-LD e valida produção
  package.js       gera dist/, robots.txt, llms.txt, sitemap.xml (com URL), _headers
assets/
  covers/          capas oficiais em WebP + variantes 360/600
  pages/           páginas reais + variantes
  catalog/         planilha + variantes
  autor/           retrato do autor
  guia/            PDF do guia + prévias
  fonts/           Space Grotesk, JetBrains Mono; Georgia local para o serifado
deliverables/
  capas/           capas oficiais em imagens/PDFs + ZIP
  site/            ZIP do site
docs/              relatórios e guias
tests/             Playwright, axe e validação
```

## Rodar

```bash
npm run build
```

Isso gera `index.html` e `dist/` em modo **preview**. Em preview, os campos pendentes aparecem destacados e os CTAs sem checkout rolam até a oferta e mostram um aviso.

### Publicar em produção

```bash
IADV_MODE=production IADV_SITE_URL="https://seu-dominio.com.br/" npm run build
```

O Cloudflare Pages pode usar `CF_PAGES_URL` automaticamente no build.

Produção **falha** se faltar:

- URL pública;
- checkout da coleção, Volume 1 e catálogo;
- garantia confirmada + processo;
- CPF/CNPJ, e-mail e políticas;
- (opcional) Pixel.

Nada disso é inventado pelo build. O `dist/` entregue neste repositório é preview, sem canonical/sitemap de URL falsa.

## Configuração

Tudo em `src/config.js`:

- `site.url`
- `prices` (coleção, Volume 1, catálogo, bump)
- `checkout` (coleção, Volume 1, catálogo)
- `delivery`
- `guarantee`
- `legal`
- `tracking`
- `flags.testimonials`
- `testimonials` (vazio até haver depoimentos reais)

## Conteúdo

- 6 volumes: 300, 307, 247, 310, 247 e 112 páginas.
- 89 capítulos; 1.689 páginas no conjunto.
- Catálogo: 1.323 skills, 273 repositórios, 11 categorias, 20 colunas.
- Preços: coleção R$ 197 (lançamento) / R$ 247; V1 R$ 39,90; V2 R$ 59,90; V3 R$ 59,90; V4 R$ 59,90; V5 R$ 49,90; V6 R$ 49,90; catálogo individual R$ 69,90. Entrega em PDF, EPUB e XLSX.
- Todos os seis volumes e o catálogo têm compra individual; a coleção completa reúne os sete PDFs e a planilha.
- Garantia e dados legais seguem o `config.js`; em preview, pendências aparecem como alerta.

## Testar

```bash
IADV_TEST_URL=http://127.0.0.1:8093 node tests/validate-otimizado.js
IADV_TEST_URL=http://127.0.0.1:8093 node tests/validate-individual.js
IADV_TEST_URL=http://127.0.0.1:8093 node tests/flows.js
```

O teste de validação cobre 320, 360, 390, 768, 1024 e 1440 px: altura, palavras, imagens, botões, overflow, alt, âncoras, menu, lightbox, checkout vazio, sem JS e axe.

## Publicação

- [Cloudflare Pages](docs/CLOUDFLARE-PAGES.md)
- [Checklist](docs/CHECKLIST-PUBLICACAO.md)
- [Plataformas de checkout](docs/PLATAFORMAS-CHECKOUT.md)

## Pendências para produção

1. `site.url` ou `CF_PAGES_URL`.
2. `checkout.collection`, `checkout.vol1`, `checkout.catalog`.
3. `guarantee.confirmed` + `guarantee.process`.
4. `legal.cpf`, `legal.email`, `legal.privacyUrl`, `legal.termsUrl`, `legal.refundUrl`.
5. Pixel, se for medir.

O build não cria depoimentos, avaliações, escassez, bônus ou garantias.
