# SEO técnico — versão otimizada

## Estado no preview

- Title: 66 caracteres.
- Description: 136 caracteres.
- 1 H1; H2 descritivos.
- 18 imagens com alt.
- 9 perguntas no FAQPage.
- `robots.txt` e `llms.txt` em `dist/`.
- Canonical/OG/Twitter/sitemap **não emitidos** porque `site.url` está vazio.
- `dist/sitemap.xml` ausente de propósito: não publicar URL inventada.

## Produção

O build aceita:

1. `IADV_SITE_URL`
2. `site.url`
3. `CF_PAGES_URL` (Cloudflare Pages)

Com URL, gera:

- `<link rel="canonical">` absoluto.
- `og:url`, `og:image`, `twitter:url` e `twitter:image` absolutos.
- `sitemap.xml` com a URL.
- `robots.txt` com `Sitemap:`.
- `llms.txt` com resumo, inclusões, preços e URL.

Teste com `IADV_SITE_URL=https://audit-test.pages.dev/` passou: canonical, OG, Twitter, sitemap, llms e JSON-LD com `WebSite` e `offers.url`.

## Build de produção

`IADV_MODE=production node scripts/build.js` falha listando o que falta. Hoje:

- site.url
- checkout.collection, checkout.vol1, checkout.catalog
- garantia (confirmed + process)
- legal.cpf, legal.email
- legal.privacyUrl, legal.termsUrl, legal.refundUrl

O `dist/` entregue é **preview** com selos de pendência. Produção não mostra “A CONFIRMAR” porque não gera HTML até os dados existirem.

## JSON-LD

- `Product`: nome, descrição, brand, price 197, availability, seller; `url`/`image`/`offers.url` quando há URL/checkout.
- `Person`: autor, cargo, LinkedIn e imagem absoluta.
- `WebSite`: só com URL.
- `FAQPage`: 9 perguntas visíveis.
- Sem `aggregateRating`, `review` ou dados inventados.
- `priceValidUntil` só se houver data real em `config.js`.

## Títulos e links

- H1 único.
- H2: diagnóstico, proposta, ordem de leitura, volumes, catálogo, por dentro, para quem, oferta, FAQ, final.
- Links de compra têm rótulos específicos: “Quero a coleção”, “Comprar a coleção”, “Comprar só o Volume 1”, “Comprar o catálogo”.
- Nenhum “Ver uma página do volume” repetido.
- Menu sem CTA de compra para reduzir competição; barra mobile com um CTA.

## Conteúdo para robôs

- Preços, inclusões, entrega e FAQ estão no HTML estático.
- Sem JS, o conteúdo e os preços permanecem legíveis; a classe `.js` não é aplicada e nada fica em `opacity:0`.
- `llms.txt` é bônus e não substitui canonical/sitemap.
