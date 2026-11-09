> **Histórico:** este relatório descreve a versão anterior. A versão otimizada está em [`CHANGELOG-OTIMIZACAO.md`](CHANGELOG-OTIMIZACAO.md).

# Auditoria de front-end — IA de Verdade

**Data:** 5 de novembro de 2026  
**Escopo:** evolução da página existente, sem reformulação de identidade e sem inventar dados comerciais.

## Status

Implementado e testado localmente. O que depende de dados externos continua explicitamente pendente:

- URL pública → canonical, `og:url`, `og:image` absoluto e `sitemap.xml`.
- URLs de checkout dos 9 produtos.
- Preços individuais dos Volumes 2–6.
- CPF, e-mail/canal de atendimento, políticas e processo de garantia.
- Meta Pixel ID.

Nenhum desses valores foi inventado.

## O que mudou

### 1. Tipografia
- Base de **18 px** no desktop e **17 px** no mobile.
- Parágrafos principais entre **16 e 18 px**; descrições de cards em **16 px**.
- Textos secundários entre **13 e 15 px**; legendas entre **11,5 e 12,5 px**.
- Nenhum texto visível abaixo de **11 px** na validação final (o antigo “07 · EXPECTATIVA” tinha 12,5 px em mono; agora tem 15 px em Space Grotesk, caixa normal).
- `line-height` 1,6–1,7 nos blocos de leitura e largura máxima de 68ch.
- Cabeçalho de **80 px** no desktop e **70 px** no mobile, com redução suave no scroll.

### 2. Botões
- CTA principal: **60–62 px**, texto de 17–18 px.
- CTA principal da oferta: **62 px**, com rótulo, descrição, preço e seta alinhados.
- CTA secundário / Volumes individuais: **44 px**.
- Cabeçalho: **48 px**.
- Barra mobile: **48 px**.
- Área de toque mínima de **44 × 44 px**.
- Estados hover, active, focus-visible, disabled e `aria-disabled`.
- O botão deixou de ser uma barra centralizada com texto solto; agora tem hierarquia de decisão.

### 3. Oferta e compra individual
- Oferta principal com preço, economia de R$ 50, o que está incluído, entrega e garantia pendente.
- **7 cards individuais** (6 volumes + catálogo).
- Volume 1 e catálogo com preço; Volumes 2–6 com “Preço no checkout” até os valores serem configurados.
- CTAs de compra individual com 44 px e links `data-checkout` independentes.
- CTA final com uma ação principal e uma secundária para os volumes individuais, reduzindo competição.

### 4. Animações e interação
- Entrada do hero (o H1 não anima, para não atrasar LCP).
- Revelação escalonada dos volumes e blocos editoriais com `IntersectionObserver`.
- Profundidade/elevação das capas e cards no hover.
- Linha da jornada desenhada na entrada da seção.
- Barras do catálogo animadas na entrada.
- Transições de menu, FAQ e lightbox.
- Barra de progresso de leitura, navegação ativa e cabeçalho compacto.
- Tudo desativado com `prefers-reduced-motion`.

### 5. Garantia
- A configuração real é `guarantee.confirmed: false`.
- Microcopy de marketing passou a dizer **“Garantia a confirmar”**.
- Resumo da oferta: **“Garantia: canal e processo a confirmar.”**
- A seção de garantia mantém apenas a informação legal do CDC (7 dias) e o processo pendente, sem apresentar uma garantia comercial confirmada.
- A frase “7 dias de garantia” não aparece mais como promessa comercial no HTML.

### 6. SEO
- Título com 52 caracteres e description com 149.
- Hierarquia de títulos revisada (um H1; seções em H2; volumes em H3).
- 36 imagens com alt e todas presentes.
- JSON-LD com preço real da coleção e dos produtos individuais conhecidos.
- Canonical/OG absolutos preparados para a URL pública.
- `CF_PAGES_URL` é usado como fallback no build do Cloudflare Pages.
- `robots.txt` gerado.
- `sitemap.xml` é gerado quando há URL pública; localmente não foi emitido para não publicar URL falsa.
- Conteúdo principal disponível sem JavaScript.

### 7. Acessibilidade
- Axe: **0 violações** em 1440, 390 e 320 px.
- Lighthouse Accessibility: **100** mobile e desktop.
- Menu mobile abre/fecha com teclado e Escape.
- FAQ abre por teclado; lightbox abre/fecha e navega com teclado.
- Foco visível; áreas de toque ≥44 px; contraste validado.
- `prefers-reduced-motion` desativa animações.
- Conteúdo principal visível sem JS.

### 8. CSS e JavaScript
- CSS consolidado: as quatro camadas de override foram substituídas por uma camada de auditoria organizada.
- Linhas: **1.373 → 1.206**.
- Removidos estilos de `alt-offers` e `bump` que não tinham mais markup.
- JavaScript sem dependências; 669 linhas; fallback para `IntersectionObserver`; sem frameworks.
- Compatível com hospedagem estática no Cloudflare Pages.

## Antes e depois

| Área | Antes | Depois |
|---|---|---|
| Eyebrow “07 · Expectativa” | mono 12,5 px, caixa alta | Space Grotesk 15 px, caixa normal |
| Descrição dos volumes | ~18,7 px | 16 px |
| CTA da oferta | 72 px, texto centralizado | 62 px, rótulo + preço + seta |
| Compra individual | 2 ofertas (V1 e catálogo) | 7 ofertas |
| Garantia | “7 dias de garantia” fixo | “Garantia a confirmar” quando pendente |
| CSS | 1.373 linhas, 4 camadas | 1.206 linhas, camada consolidada |

Ver [`ANTES-DEPOIS.md`](ANTES-DEPOIS.md) para imagens.

## Testes

| Teste | Resultado |
|---|---|
| Console/page errors | 0 |
| Requisições com erro | 0 |
| Overflow horizontal (1440/390/320) | 0 |
| Imagens | 36/36 presentes; 36/36 com alt |
| IDs duplicados | 0 |
| Âncoras internas quebradas | 0 |
| Botões visíveis <44 px | 0 |
| Textos visíveis <11 px | 0 |
| Axe | 0 violações |
| Menu mobile / Escape | OK |
| FAQ | OK |
| Lightbox / Escape | OK |
| Sem JavaScript | Conteúdo e preços visíveis |
| `prefers-reduced-motion` | Animações desativadas |
| Links de checkout | 9 ofertas, 0 URLs configuradas (não inventadas) |
| Garantia | Pendente, sem confirmação falsa |
| Depoimentos | Seção oculta |

## Lighthouse

Relatórios em [`lighthouse/`](lighthouse/):

- **Mobile:** Performance **84**, Acessibilidade **100**, Boas práticas **100**, SEO **100**. LCP 4,1 s; FCP 2,3 s; CLS 0; TBT 0.
- **Desktop:** Performance **99–100**, Acessibilidade **100**, Boas práticas **100**, SEO **100**. LCP 0,8 s; FCP 0,5 s; CLS 0; TBT 0.

O LCP mobile de laboratório ainda merece atenção: o elemento é o H1, e o HTML/CSS inline + fontes sob throttling elevam a métrica. O H1 não tem animação de opacidade. A recomendação é minificar o CSS inline e revisar o preload de fontes antes de tráfego pago.

## Pendências para publicar

1. Definir a URL pública (ou publicar no Cloudflare Pages para usar `CF_PAGES_URL`).
2. Preencher os 9 checkouts em `src/config.js`.
3. Definir os preços dos Volumes 2–6.
4. Preencher CPF, e-mail/canal de atendimento e políticas.
5. Confirmar o processo de garantia.
6. Configurar Meta Pixel/CAPI, se for medir.

## Arquivos

- [`docs/SEO.md`](SEO.md)
- [`docs/ACESSIBILIDADE.md`](ACESSIBILIDADE.md)
- [`docs/VALIDACAO.md`](VALIDACAO.md)
- [`docs/LIGHTHOUSE.md`](LIGHTHOUSE.md)
- [`docs/ANTES-DEPOIS.md`](ANTES-DEPOIS.md)
- [`docs/CSS-JS.md`](CSS-JS.md)
