> **Atualização posterior:** rodapé, vitrine individual e ajustes de conteúdo. Métricas e capturas atuais em [`CHANGELOG-RODAPE-INDIVIDUAIS.md`](CHANGELOG-RODAPE-INDIVIDUAIS.md).

# Otimização da página — changelog

Data: 6 de novembro de 2026. Escopo: enxugar a página existente, preservar identidade, config, build e honestidade comercial.

## Resultado

| Métrica | Antes | Depois | Variação |
|---|---:|---:|---:|
| Altura em 390 px | 31.892 px | 12.699 px | **−60,2%** |
| Altura em 1440 px | 20.556 px | 11.612 px | **−43,5%** |
| Palavras | 3.011 | 1.362 | **−54,8%** |
| Imagens no DOM | 37 | 18 | **−51,4%** |
| Imagens na 1ª dobra | — | 3 | ≤ 4 |
| Botões de compra | 16 | 6 | **−62,5%** |
| Seções | 16 | 11 | −5 |
| Textos < 14 px | 193 | 19 (marca, números de seção e legendas 12,5–13 px) | 0 com informação crítica |
| HTML | 175 KB | 98 KB | −44% |
| CSS | 1.206 linhas | 508 linhas | −58% |
| JS | 669 linhas | 455 linhas | −32% |
| Lighthouse mobile | 84 / 100 / 100 / 100 | **93 / 100 / 100 / 100** | perf +9 |
| Lighthouse desktop | 99 / 100 / 100 / 100 | **100 / 100 / 100 / 100** | perf +1 |
| LCP mobile | 4,1 s | 2,8 s | −1,3 s |
| CLS | 0 | 0 | = |
| Transferência inicial (390 px) | — | ~335 KB | HTML 98 + fontes 200 + imagens 34 |

Alvo de altura mobile: ≤ 17.540 px (45% de redução). Atingido com 12.699 px.

## Estrutura final (11 seções)

1. Hero + 4 números.
2. Problema + solução.
3. Jornada de leitura dos seis volumes.
4. Volumes (6 cards compactos, carrossel no mobile).
5. Catálogo (4 números, 2 imagens, gráfico em `<details>`).
6. Por dentro + amostra + guia em uma seção.
7. Para quem é / não é.
8. Autor.
9. Oferta + garantia + duas ofertas secundárias.
10. FAQ (8 visíveis + “Mais perguntas”).
11. CTA final + rodapé.

## Decisões

- **Header sem botão de compra**: o CTA do hero e a barra mobile evitam competição e mantêm 6 botões de compra no total (hero, oferta, V1, catálogo, barra mobile, final).
- **Volumes 2–6 sem compra individual**: só Volume 1 e Catálogo têm checkout avulso confirmado. A seção “Um volume por vez” foi removida.
- **Faixa de capas**: 3 capas no hero; as outras ficam nos volumes. A mesma capa não aparece mais 4 vezes.
- **Depoimentos**: seção vazia removida do DOM. Ficou um `<template>` desligado por `flags.testimonials` e só renderiza com `testimonials[]` real.
- **Gráfico do catálogo**: foi para `<details>` para encurtar a página sem perder informação.
- **“O que você constrói”**: `<details>` aberto no desktop e fechado no mobile.
- **Garantia**: em preview mostra “Garantia a confirmar”; o build de produção falha se `guarantee.confirmed`/`process` não estiverem preenchidos.
- **Checkout vazio**: o link aponta para `#oferta`; o JS rola até a oferta e mostra o aviso. Não leva ao topo.
- **Fonte do LCP**: H1 sem animação de opacidade.

## Tipografia e botões

- Escala em variáveis: `--fs-xs` 13, `--fs-sm` 15, `--fs-base` 17 (18 no desktop), `--fs-lg` 20, `--fs-xl` 24.
- Nenhum texto relevante abaixo de 14 px. Os 19 menores são marca, números de seção e legendas de 12,5–13 px.
- Um único componente `.btn`: 52 px; hero/oferta 56 px; menu 44 px; barra mobile 56 px; raio 10 px; foco de 3 px; hover/active/loading/disabled.
- Preço ao lado do rótulo em texto normal, sem pílula.

## Movimento

- Entrada escalonada do hero; capas com elevação.
- Contagem dos números ao entrar na tela.
- Linha da jornada desenhada conforme a rolagem e passos acesos.
- Barras do catálogo ao abrir o `<details>`.
- Reveal com fallback após 1,5 s.
- FAQ/menu/lightbox com transições discretas.
- `prefers-reduced-motion` desliga tudo.

## SEO

- Title 66 caracteres; description 136.
- Um H1; H2 descritivos.
- JSON-LD: Product, Person, FAQPage e WebSite (WebSite só com URL pública).
- 8 perguntas no FAQPage; sem `aggregateRating` ou `review`.
- Canonical, OG, Twitter e imagem absolutos quando `site.url`/`CF_PAGES_URL` existe.
- `robots.txt` e `llms.txt` no `dist/`.
- `sitemap.xml` gerado no build com URL pública.
- Build de produção falha listando pendências; preview mostra selos.

## Produção x preview

Produção testada com dados temporários completos: **passou**, gerou canonical, OG absoluto, sitemap, WebSite e `offers.url`.

Sem esses dados, `IADV_MODE=production node scripts/build.js` falha com:

- site.url
- checkout.collection, checkout.vol1, checkout.catalog
- garantia (confirmed + process)
- legal.cpf, legal.email
- legal.privacyUrl, legal.termsUrl, legal.refundUrl

O `dist/` entregue é **preview**: não inventa URL, CPF, checkout nem garantia.

## Pendências que dependem de você

1. URL pública.
2. 3 checkouts: coleção, Volume 1, catálogo.
3. Processo/canal de garantia.
4. CPF, e-mail e políticas.
5. Pixel, se for medir.

## Arquivos

- [`ANTES-DEPOIS.md`](ANTES-DEPOIS.md)
- [`LIGHTHOUSE.md`](LIGHTHOUSE.md)
- [`ACESSIBILIDADE.md`](ACESSIBILIDADE.md)
- [`VALIDACAO.md`](VALIDACAO.md)
- [`SEO.md`](SEO.md)
- [`CSS-JS.md`](CSS-JS.md)
- `validation-otimizado.json`
- `lighthouse/otimizado-mobile.report.html` e `.json`
- `lighthouse/otimizado-desktop.report.html` e `.json`
