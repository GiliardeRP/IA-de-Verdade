> **Histórico:** relatório da versão anterior. A versão otimizada está em [`CHANGELOG-OTIMIZACAO.md`](CHANGELOG-OTIMIZACAO.md).

# Relatório de testes — IA de Verdade

Data: 03/11/2026.
Ambiente: Linux, Node.js 24.21.0, Chromium headless 1248 via Playwright Core 1.63, servidor local `python3 -m http.server 8123`.
Página testada: `index.html` gerado por `node scripts/build.js` (142 KB).
Escopo: interface, responsividade, acessibilidade, preços, consentimento, UTMs, checkout, Pixel (com ID de teste e rede simulada), order bump (variante), depoimentos/vídeo (variantes) e integridade de assets.

> **O que não foi testado:** pagamento real, painel da plataforma de checkout, Events Manager real, CAPI, Safari, Firefox, dispositivos físicos, leitores de tela reais e Lighthouse. Esses pontos dependem de ambiente externo e estão listados ao final.

---

## 1. Resultado em uma linha

A página carrega sem erros de console, sem imagens quebradas e sem rolagem horizontal de 320 a 1920 px. Os fluxos de FAQ, menu, lightbox, consentimento, checkout e UTMs funcionam. O axe não encontrou violações nas versões desktop e mobile. O que falta é configuração externa (checkout, Pixel real, CAPI, entrega, garantia, dados legais e políticas), não implementação de interface.

---

## 2. Matriz de viewports

Testadas as larguras 320, 360, 390, 414, 768, 834, 1024, 1280, 1440 e 1920 px.

| Verificação | Resultado |
|---|---|
| Rolagem horizontal | 0 em todas as larguras |
| Header / menu | Correto; nav vira hambúrguer abaixo de 1080 px |
| Hero | Headline, subheadline, CTA principal e preço visíveis na primeira dobra em 320/390 |
| Capas | Wall de 4 colunas no desktop, 3 no mobile; 8 células (7 capas + bloco 1.323) |
| Volumes | 6 cards, capas reais, sem corte de texto |
| Catálogo | Barras de categoria, imagens e planilha legíveis; labels sem truncamento por ellipsis |
| Galeria | 4 colunas no desktop; 2 colunas iguais no mobile; planilha em largura dupla |
| Oferta | Cards empilhados no mobile; lista de 8 arquivos legível |
| FAQ | 16 itens visíveis por padrão (17 com bump ativo), abertura por toque/teclado |
| Rodapé | Links, pendências legais e preferências de cookies acessíveis |
| CTA fixo mobile | Aparece após ~620 px; esconde na oferta, no CTA final e no rodapé |

Evidências: `tests/screenshots/desktop-fold.png`, `desktop-full.png`, `mobile-fold.png`, `mobile-full.png`, `tablet-full.png`, `fold-320.png`, `fold-768.png`, `fold-1024.png`, `fold-1920.png`.

---

## 3. Testes funcionais

| Teste | Resultado | Observação |
|---|---|---|
| Todos os links internos (`#...`) | OK | Nenhum âncora sem destino |
| IDs duplicados | 0 | — |
| Imagens de conteúdo | 29 carregadas | A única `img` sem `naturalWidth` é o placeholder do lightbox, sem `src` até abrir |
| Assets locais (capas, páginas, planilha, amostra) | HTTP 200 | Teste por `request.get` |
| FAQ abre/fecha | OK | `<details>` nativo |
| Lightbox abre | OK | `dialog.showModal()` |
| Lightbox fecha com Esc | OK | Evento `close` devolve foco |
| Lightbox navega com setas | OK | Anterior/próximo |
| Lightbox clicando no backdrop | OK | Fecha |
| Menu mobile abre/fecha | OK | `aria-expanded` sincronizado |
| Menu mobile fecha ao clicar em link | OK | — |
| CTA fixo mobile | OK | `inert` quando oculto |
| CTA fixo esconde no CTA final | OK | `atFinal: false` |
| CTA fixo esconde no rodapé | OK | `atFooter: false` |
| CTA fixo esconde na oferta | OK | Teste dedicado: `bar: false` |
| Toast de checkout não configurado | OK | Texto e bloqueio de navegação |
| Preço de lançamento | OK | R$ 197 na coleção, R$ 39,90 no Vol. 1, R$ 69,90 no catálogo |
| Virada para preço regular | OK | Simulação `promo.active:false`: R$ 247 / R$ 89,90, selos escondidos, JSON-LD atualizado |
| Order bump desligado | OK | Bloco, FAQ e nota ocultos |
| Order bump ligado (variante) | OK | Bloco, FAQ e nota visíveis; rótulo em uma linha |
| Depoimentos vazios | OK | Seção oculta |
| Depoimentos preenchidos (variante) | OK | Cards renderizados, quebra nome/cargo/resultado correta |
| Vídeo desligado | OK | Galeria no lugar |
| Vídeo ligado (variante) | OK | iframe `lazy` inserido, sem autoplay |
| JS desabilitado | OK | Preços estáticos, conteúdo principal e FAQ nativos; lightbox/menu não funcionam (degradação esperada) |
| Rodapé como pessoa física | OK | Nome + CPF (pendente), sem CNPJ/razão social |
| Seção "Guia da coleção" | OK | PDF redesenhado (2 páginas A4, fontes embutidas, ~417 KB, HTTP 200), prévias atualizadas, download e abertura em nova aba; CTA fixo escondido na seção |
| Link do guia no menu/rodapé | OK | Âncora `#guia` com destino existente |
| Capas novas no site | OK | 7 WebP em `assets/covers`, hero/volumes/oferta sem 404; OG regenerado |
| Capas para PDF | OK | 7 PNG 2400×3450 e 7 PDFs de 1 página em 16×23 cm; ZIP com mapa |
| Legibilidade e tipografia | OK | Base 18 px (17 px no mobile), rótulos principais entre 10,5 e 13 px; testado em 1440, 390 e 320 px sem overflow |
| Cabeçalho e oferta | OK | Header de 80 px (70 px no scroll), CTA e preço da oferta ampliados; economia de R$ 50 calculada pelo config |
| Seção de volumes | OK | Cards com capa de 300 px (230 px no mobile), índice colorido, IDs e âncoras por volume |
| Animações e interação | OK | Reveal no scroll, progresso de leitura, nav ativa, hover e header compacto; `prefers-reduced-motion` desativa |
| CTA mobile | OK | Barra esconde na oferta, guia, final e rodapé; testada em 390 e 320 px |
| Foto do autor | OK | `assets/autor/giliarde.webp`, 400×400, carregada na seção do autor |
| Compra individual | OK | 7 cards (6 volumes + catálogo), links `vol1`–`vol6` e `catalog`; Vol. 1 e catálogo com preço, Vol. 2–6 com “Preço no checkout” até configuração |
| Entrega automática no card | OK | Texto de entrega automática; FAQ detalha 7 PDFs + XLSX (coleção), 1 PDF (Vol. 1) e 1 PDF + XLSX (catálogo) |
| Canonical/OG com URL de teste | OK | `IADV_SITE_URL=https://ia-de-verdade.pages.dev/` gerou canonical, og:url e og:image absolutos |
| Pacote `dist/` | OK | `index.html`, `assets/`, `_headers` e `LEIA-ME.txt`; sem 404 no teste local |

---

## 4. Consentimento e Meta Pixel

Teste com ID de teste (`123456789012345`) e rede do Facebook interceptada. O ID **não** ficou no projeto publicado.

| Teste | Resultado |
|---|---|
| Sem Pixel configurado | Nenhum banner, nenhuma requisição ao Facebook |
| Pixel configurado, sem escolha | Banner aparece após ~1,2 s |
| "Aceitar medição" | Banner fecha, `localStorage.iadv_consent_v1 = {marketing:true}`, `fbq` carrega |
| "Só o essencial" | Banner fecha, `{marketing:false}`, sem `fbq` |
| Rodapé "Preferências de cookies" com Pixel | Reabre o banner |
| Rodapé sem Pixel | Toast explicando que não há medição |
| PageView | Disparado após o aceite |
| ViewContent | Disparado ao entrar na oferta; não duplica |
| InitiateCheckout | Disparado no clique com URL válida; `eventID` gerado |
| Purchase no clique | **Não existe** no código, por design |
| Evento no Meta real | Não testado (sem ID de produção) |

---

## 5. Checkout e UTMs

Teste com URL de checkout de exemplo e parâmetros:

```
?utm_source=teste&utm_campaign=fluxo
```

Resultado da URL de destino:

```
https://example.com/checkout?x=1&utm_source=teste&utm_campaign=fluxo
```

| Teste | Resultado |
|---|---|
| URL de checkout vazia | Clique bloqueado + toast; nenhum redirecionamento |
| URL de checkout válida | Navega para a URL correta |
| UTM source/campaign | Preservados |
| Primeiro toque | Armazenado em `sessionStorage` (`iadv_attr_v1`) |
| `fbclid`, `gclid`, `src`, `sck`, `ref` | Suportados |
| Protocolos não HTTP(S) | Bloqueados |
| `data-checkout` por oferta | Mapeado para coleção, Vol. 1, catálogo e bump |

---

## 6. Acessibilidade

Ferramenta: axe-core 4.10.2 injetado no Chromium, com FAQ aberto, em 1440×1000 e 390×844.

| Verificação | Resultado |
|---|---|
| Violações axe | **0** no desktop e **0** no mobile |
| Contraste | AA; 46 falhas iniciais corrigidas |
| Hierarquia de headings | OK (h1 único; footer h3) |
| Landmarks | 1 `main`, 2 `nav` rotulados |
| Imagens | Alt descritivo em todas as imagens de conteúdo |
| Foco | `:focus-visible` global; skip link |
| Teclado | Menu, FAQ, lightbox, consentimento e CTAs operáveis |
| Movimento reduzido | CSS respeita `prefers-reduced-motion` |
| Diálogo | `aria-labelledby`, foco inicial, retorno de foco |
| CTA mobile oculto | `inert` + `aria-hidden` |

---

## 7. Performance (medição local)

Com cache limpo, viewport 390×844, sem Pixel:

| Métrica | Valor |
|---|---|
| Requisições iniciais | 14 |
| Transferência inicial | ~495 KB (HTML 142 KB + capas 137 KB + fontes 215 KB) |
| DOMContentLoaded | ~178 ms |
| Load | ~182 ms |
| Bibliotecas externas | 0 |
| Imagens abaixo da dobra | `loading="lazy"` |
| Dimensões de imagem | Definidas (evita CLS) |
| Fontes | Self-hosted, `font-display:swap`, subsets latin |
| JS | ~16 KB inline |

Esses números são de servidor local e não substituem Lighthouse/WebPageTest no domínio real.

---

## 8. Problemas encontrados e corrigidos

| # | Problema | Correção |
|---|---|---|
| 1 | Build substituía `$$` por `$` no JS inline, quebrando o script | `String.replace` com função de substituição |
| 2 | FAQ escura com texto escuro (ilegível) | Seção passou a `section--paper` |
| 3 | Galeria mobile com colunas desiguais (66 px / 271 px) | `minmax(0,1fr)` e remoção de `span 2` em grid de 1 coluna |
| 4 | CTA fixo cobria o CTA final e o rodapé | Observers de `final`/`footer` escondem a barra |
| 5 | CTA fixo sobrepunha o banner de consentimento | Barra escondida enquanto o banner está aberto |
| 6 | Número "07" da garantia com sobreposição | `letter-spacing` corrigido |
| 7 | 46 falhas de contraste | Paleta de texto e azul dos botões ajustados |
| 8 | Header semitransparente perdia contraste sobre papel | Header opaco + cor do subtítulo |
| 9 | Placa de capas mobile com uma capa órfã | Bloco 1.323 mantido; grade 3×3 equilibrada |
| 10 | Nome/cargo/resultado de depoimento colados | `span` de cargo + parágrafo de resultado |
| 11 | Copy prometia order bump não configurado | `offers.bumpEnabled` oculta bloco/FAQ/nota até configurar |
| 12 | Copy dizia "A4"; PDFs reais têm 16×23 cm | "A4" removido |
| 13 | Copy dizia "no lançamento" mesmo com promoção encerrada | Sufixo removido; preço/condição vêm do config |
| 14 | JSON-LD duplicado no template | Placeholder único |
| 15 | Nome do PDF de amostra com typo | Arquivo renomeado e caminho conferido |
| 16 | Lightbox com `src=""` gerando requisição vazia | `src` removido até a abertura |
| 17 | Banner de consentimento não aparecia no teste com query string | Ajuste do teste (rota `index.html*`), não do produto |
| 18 | FAQ com "O que é o IA" | "O que é a coleção IA de Verdade?" |
| 19 | Rodapé com h4 após h2 | h3 (hierarquia) |

---

## 8.1 Cloudflare Pages e entrega

- `dist/` foi gerado e testado localmente; `_headers` está presente.
- A URL real do `pages.dev` ainda não existe; canonical/OG foram validados com uma URL de teste.
- Deploy real no Cloudflare Pages não foi executado (sem conta/projeto).
- A entrega automática depende de configuração na Hotmart/Kiwify; o texto da página já a descreve.
- O CPF ainda não foi preenchido; o rodapé mostra o selo pendente.

---

## 9. Dependências externas / pendências

Não é possível concluir estes itens sem decisão ou acesso externo:

- [ ] URL real de cada checkout.
- [ ] Escolha entre Hotmart e Kiwify; formato exato de entrega (download, área de membros ou `.zip`).
- [ ] Canal e prazo de reembolso.
- [ ] CPF (venda PF), e-mail e políticas.
- [ ] Publicação real no Cloudflare Pages e teste no `pages.dev`.
- [ ] Teste do evento de compra nativo da plataforma (Hotmart/Kiwify) ou CAPI.
- [ ] ID real do Meta Pixel e teste no Events Manager.
- [ ] CAPI/Purchase via webhook.
- [ ] Configuração do order bump na plataforma.
- [ ] Configuração do upsell com crédito (se suportado).
- [ ] Recuperação de carrinho (e-mail/WhatsApp).
- [ ] Depoimentos reais e vídeo.
- [ ] `site.url`/`IADV_SITE_URL` com a URL do `pages.dev` para canonical/OG absoluto.
- [ ] Teste em Safari/Firefox e dispositivo físico.
- [ ] Lighthouse/WebPageTest no domínio final.
- [ ] Revisão jurídica da garantia, privacidade e cookies.

---

## 10. Como reproduzir os testes

```bash
cd "Curos IA"
python3 -m http.server 8123
# em outro terminal:
node tests/audit.js
node tests/flows.js
```

Os scripts usam o Chromium do Playwright já instalado no ambiente. Saídas:

- `tests/audit-output.json`
- `tests/flows-output.json`
- `tests/screenshots/*.png`

Para auditar acessibilidade manualmente, o script de auditoria pode ser adaptado para injetar o axe; foi o procedimento usado neste relatório.

---

## Auditoria de front-end (nov/2026)

A versão atual passou por uma auditoria completa. O relatório consolidado, com antes/depois, Lighthouse, acessibilidade, SEO e validação, está em [`RELATORIO-AUDITORIA.md`](RELATORIO-AUDITORIA.md). O relatório antigo acima permanece como histórico da primeira versão.
