# Rodada 2 — anel de capas, alinhamentos e gatilhos

Data: 7 de novembro de 2026. Escopo: carrossel 3D do hero, correções de centralização, gatilhos de venda, e-mail novo e auditoria da rodada anterior.

## 1. Linha de base

| Métrica | Antes da rodada 2 |
|---|---:|
| Altura em 390 px | 13.444 px |
| Altura em 1440 px | 12.353 px |
| Palavras | 1.573 / 1.635 |
| Imagens no DOM | 24 |
| Botões de compra | 11 |
| HTML | ~115 KB |

## 2. Depois

| Métrica | Depois |
|---|---:|
| Altura em 390 px | **14.469 px** |
| Altura em 1440 px | **13.178 px** |
| Palavras | 1.770 / 1.832 |
| Imagens no DOM | 28 (27 de conteúdo + imagem do lightbox) |
| Botões de compra | 14 |
| HTML | ~135 KB |
| Lighthouse mobile | **96 / 96 / 100 / 100** |
| Lighthouse desktop | **100 / 100 / 100 / 100** |
| LCP mobile | 2,6 s |
| CLS | 0 |

**A altura aumentou ~7,6%** (1.025 px). Não foi possível cumprir “sem aumentar a altura” com todos os componentes novos (escolha guiada, três linhas de garantia, lote, ancoragem, custo unitário e anel). Para compensar, removi a nota longa da oferta e a linha redundante de preço regular; ainda assim o saldo ficou positivo. Para voltar a 13.444 px seria necessário cortar uma seção existente — decisão que não tomei sem sua confirmação.

## 3. Carrossel 3D do hero

- 7 capas em anel elíptico; uma volta em ~52 s.
- Profundidade por `cos θ`: frente maior/mais opaca/mais baixa; trás menor/mais escura/mais alta; `z-index` acompanha.
- Posicionamento por `requestAnimationFrame` com `transform` e `opacity`; sem leitura de layout no loop.
- Hover: `scale` até ~1,2, suba de 8 px e maior z-index; interpolação por frame; o anel continua girando.
- Foco de teclado recebe o mesmo destaque.
- Toque: primeiro toque traz para a frente e não navega; segundo toque segue o link. Arraste horizontal com inércia curta e `touch-action: pan-y`.
- Pausa quando o hero sai da tela e quando a aba fica oculta.
- `prefers-reduced-motion`: leque estático com rolagem horizontal.
- Sem JS: 3 capas estáticas do fallback.
- Capas: `srcset` 240/360/480/600, `width`/`height`, `decoding=async`; 3 primeiras eager, 4 lazy.
- Links: `#volume-1`…`#volume-6` e `#catalogo`; IDs adicionados aos cards.
- Testes: anima, hover 1,19×, pausa fora da tela, retomada, modo reduzido, fallback 3 capas, arraste e toque.
- Vídeo: [`hero-ring.webm`](../tests/videos/hero-ring.webm) (5,6 s).
- O módulo do anel tem ~4,2 KB minificado (sem mangle), acima do orçamento de 3 KB. Para chegar a 3 KB seria preciso remover o arraste/inércia ou aplicar mangle específico; não removi comportamento pedido.

## 4. Alinhamentos

- A linha “12 · Começar” e as linhas de garantia/edição estavam com `max-width` de parágrafo sem `margin-inline:auto`.
- Corrigido com `inline-flex` + `margin:auto` no rótulo e largura total centralizada nas linhas pequenas.
- “Arraste para explorar · pausa ao interagir” agora ocupa 100% e centraliza de fato.
- Teste automático em 320/390/768/1024/1440: maior desvio **0,01 px**; todos passam ±2 px.
- Capturas da seção 12: [`final-antes-1440.png`](../tests/screenshots/final-antes-1440.png), [`final-depois-1440.png`](../tests/screenshots/final-depois-1440.png), [`final-antes-390.png`](../tests/screenshots/final-antes-390.png), [`final-depois-390.png`](../tests/screenshots/final-depois-390.png).

## 5. Gatilhos aplicados

- **Lote:** `config.launch` com `mode:'quantity'`, `limit:100`, `active:true`, `sold:null`. Texto: “Preço de lançamento para as primeiras 100 compras. Depois, R$ 247.” Sem contador de restantes e sem “vagas”.
- **Garantia:** linha “Garantia de 7 dias pela Hotmart” no hero, oferta e CTA final; FAQ com o detalhe da plataforma. Sem bloco grande.
- **Ancoragem:** soma dos 7 preços avulsos = **R$ 389,30**; “Na coleção: R$ 197”. Calculado no build; se faltar preço, a linha some.
- **Custo unitário:** **R$ 33 por volume** e **R$ 2,21 por capítulo** (197 ÷ 6 e 197 ÷ 89, arredondados).
- **Escolha guiada:** 3 cartões após o hero, com link para a seção e botão de compra (V1, V2 e V4). V3 e V5 aparecem na vitrine e na seção.
- **Aversão à perda:** texto na seção do problema.
- **Storytelling:** “Você paga ferramenta atrás de ferramenta…” na proposta.
- **Inimigo comum:** “O problema é o tutorial solto e o hype sem caminho até o ecossistema completo.”
- **Atualidade:** “Edição nov/2026” mantida.
- **Atendimento:** e-mail trocado para `iadeverdade.oficial@gmail.com` no rodapé e no `mailto:`.
- **Fonte:** Source Serif 4 removida do carregamento (122 KB); Georgia local no serifado.

### Lote na Hotmart

1. O texto é comercial, mas **o preço efetivo é o da Hotmart**. Ao atingir 100 compras, troque o preço na Hotmart para R$ 247.
2. Depois da troca, mude `launch.active` para `false` (ou preencha `sold: 100`). O build passa ao preço regular automaticamente.
3. Confirme se a Hotmart permite limitar a oferta por quantidade. Se não permitir, use `mode:'date'` com `endsAt` real ou faça o controle manual. Não há contador regressivo na página.
4. `launch.sold` só deve receber um número real; se não houver número apurado, deixe `null`.

## 6. Depoimentos

- Componente só renderiza se `flags.testimonials:true` e houver itens com `autorizado:true`.
- Formato: `{ nome, perfil, texto, data, autorizado:true }`.
- Sem dados, a seção não é inserida no DOM; o `<template>` não é visível nem indexável como seção.
- Teste com fixture em `tests/fixtures/testimonials.json`: 3 itens renderizados, o não autorizado ficou fora; controles de seta/pausa presentes; sem `Review`/`aggregateRating` no JSON-LD.
- Passo a passo para coletar depoimentos reais: [`DEPOIMENTOS.md`](DEPOIMENTOS.md).

## 7. Precisão do texto

Não há os PDFs completos dos seis volumes neste checkout, então não foi possível confirmar que **todos os 89 capítulos** terminam em projeto. Troquei a prova para **“89 capítulos com projetos práticos ao longo da obra”**. O projeto Assistente Casa, que atravessa a coleção, permanece.

## 8. Auditoria da rodada anterior

- Um único `.btn`; sem overrides novos.
- Texto relevante: nenhum preço, prazo ou garantia abaixo de 14 px. Os 20 nós menores são marca, números de seção e legendas 12,5–13 px.
- Corpo 17 px no mobile.
- Axe: **0 violações** em 390 e 1440.
- Lighthouse mobile: **96 / 96 / 100 / 100**; desktop **100 / 100 / 100 / 100**; CLS 0; sem overflow de 320 a 1440.
- **Acessibilidade 96, não 100:** o único item restante é `target-size` no anel, porque capas se sobrepõem. As caixas têm mais de 44 px, mas a área segura entre vizinhas é menor. É inerente ao anel sobreposto; a meta ≥95 foi atingida.
- A **Source Serif 4** (122 KB) foi removida do carregamento; o serifado usa Georgia. Isso levou a performance mobile de 88 para 96. A identidade editorial foi preservada com serif local.
- Build de produção continua bloqueando sem URL/checkouts/políticas; não exibe “a confirmar” nem “em preparação”.
- Canonical, OG absoluto, sitemap e `WebSite` JSON-LD continuam condicionados à URL real.

## 9. Pendências que dependem de você

1. URL pública.
2. 8 checkouts: coleção, V1–V6 e catálogo.
3. URLs de Termos, Privacidade e Reembolso; enquanto vazias, a coluna “Informações” fica oculta.
4. Confirmar limite por quantidade na Hotmart e trocar o preço ao atingir 100.
5. Autorizações escritas dos depoimentos reais.
6. Revisão jurídica da identificação do vendedor (CPF/CNPJ não é exibido no rodapé).

## 9b. Ajustes após o feedback

- **Catálogo:** chamada “O MAIOR CATÁLOGO DE SKILLS DO BRASIL”, número 1.323 em destaque e recorte legível da planilha (`planilha-amostra.webp`). A imagem anterior tinha letras pequenas e área vazia.
- **“Não é para você se…”** removido. A seção virou “Para quem é.” com apenas a coluna positiva.
- **Carrossel individual:** não para mais de forma permanente. Depois de seta, ponto, swipe ou foco, ele retoma em 3,5 s. Hover pausa só enquanto o mouse está sobre a vitrine.
- **Grade curricular:** o antigo “Baixar o guia” virou um bloco destacado “Veja o que cada ebook ensina” com “Baixar a grade curricular (PDF)”.
- **Anel no mobile:** a largura estava presa a `46vw`; agora ocupa a coluna, centraliza e usa raio menor. As capas não ficam mais deslocadas para o canto.
- **EPUB:** oferta, itens, cards, FAQ, hero, CTA final, `llms.txt` e `delivery` agora informam PDF + EPUB + XLSX; a coleção passa a 15 arquivos (7 PDFs + 7 EPUBs + planilha).
- **Autor:** “setor hoteleiro da América Latina”.
- **E-mail:** `iadeverdade.oficial@gmail.com`.

## 10. Arquivos

- `src/config.js`, `src/template.html`, `src/styles.css`, `src/app.js`.
- `scripts/build.js` e `scripts/package.js` (sem quebra de contrato).
- `tests/validate-round2.js`, `tests/validate-individual.js`, `tests/validate-otimizado.js`.
- `docs/validation-round2.json`, `docs/lighthouse/round2-*.report.html/json`.
- `tests/screenshots/round2-*.png`, `final-antes-*`, `final-depois-*`, `escolha-*`.
- `tests/videos/hero-ring.webm`.
