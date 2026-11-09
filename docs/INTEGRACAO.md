# Integração comercial — checkout, Pixel, UTMs e funil

Este documento separa o que **já está implementado na página** do que **depende de configuração externa**. Nenhuma integração externa é simulada: com os campos vazios, a página avisa e não navega para um checkout inexistente.

Arquitetura: página estática (`index.html`) + configuração central (`src/config.js`) + build (`node scripts/build.js`). Não há backend, banco de dados nem armazenamento de dados de pagamento.

---

## 1. O que está implementado

| Recurso | Estado | Onde |
|---|---|---|
| Links de checkout por oferta | Implementado, aguardando URLs | `config.checkout` + `data-checkout` |
| Preservação de UTMs e click IDs | Implementado | `src/app.js` (`checkoutUrl`, `captureAttribution`) |
| Fallback sem checkout | Implementado | toast "Checkout em configuração" |
| Preço de lançamento → regular | Implementado | `config.promo` + `applyPrices` |
| Consentimento de cookies | Implementado | banner + `localStorage` |
| Meta Pixel condicionado ao consentimento | Implementado | `initPixel` |
| PageView, ViewContent, InitiateCheckout | Implementado | `trackEvent` |
| Purchase | **Não disparado no cliente** | deve vir da plataforma/CAPI |
| Carrinho abandonado | **Externo** | plataforma de checkout |
| Order bump | **Externo + bloco pronto** | `offers.bumpEnabled` |
| Upsell com crédito | **Externo** | plataforma de checkout |
| Depoimentos | **Área pronta, vazia** | `config.testimonials` |
| Vídeo | **Área pronta, desligada** | `config.video` |
| Políticas e dados legais | **Pendentes** | `config.legal` |

---

## 2. Checkout

### 2.1 Criar as ofertas na plataforma

Crie, na plataforma escolhida (Hotmart, Kiwify, Eduzz, LastLink ou outra), os produtos/ofertas abaixo. Os nomes e IDs internos da plataforma não importam para a página; importam as URLs finais.

| Oferta | Conteúdo | Preço planejado | Chave na config |
|---|---|---:|---|
| Coleção completa | 6 PDFs + catálogo PDF + planilha XLSX | R$ 197 lançamento / R$ 247 regular | `checkout.collection` |
| Volume 1 | PDF do Volume 1 | R$ 39,90 | `checkout.vol1` |
| Volume 2 | PDF do Volume 2 | definir preço individual | `checkout.vol2` |
| Volume 3 | PDF do Volume 3 | definir preço individual | `checkout.vol3` |
| Volume 4 | PDF do Volume 4 | definir preço individual | `checkout.vol4` |
| Volume 5 | PDF do Volume 5 | definir preço individual | `checkout.vol5` |
| Volume 6 | PDF do Volume 6 | definir preço individual | `checkout.vol6` |
| Catálogo independente | PDF do catálogo + XLSX | R$ 69,90 lançamento / R$ 89,90 regular | `checkout.catalog` |
| Volume 1 com bump | Volume 1 + V6 + catálogo + planilha | R$ 39,90 + R$ 27 | `checkout.vol1Bump` (opcional) |

> O preço regular precisa estar configurado **na plataforma** também. A página apenas comunica; ela não altera preço de checkout.

### 2.2 Preencher as URLs

```js
// src/config.js
checkout: {
  collection: 'https://pay.suaplataforma.com/colecao-ia-de-verdade',
  vol1: 'https://pay.suaplataforma.com/volume-1',
  vol1Bump: '', // se existir um checkout específico com o bump habilitado
  catalog: 'https://pay.suaplataforma.com/catalogo-skills',
},
```

Depois:

```bash
node scripts/build.js
```

Se `vol1Bump` estiver vazio, os botões do Volume 1 usam `vol1`; o bump continua sendo configurado dentro do checkout.

### 2.3 Como os botões funcionam

Cada botão tem `data-checkout="collection|vol1|vol1Bump|catalog"`. Ao clicar:

1. O JS monta a URL a partir de `config.checkout`.
2. Acrescenta os parâmetros de campanha capturados.
3. Dispara `InitiateCheckout` (se o Pixel estiver consentido e ativo).
4. Aguarda 150 ms e navega na mesma aba.

Se a URL estiver vazia, o clique é bloqueado e aparece um toast. **Não há link quebrado nem redirecionamento para lugar nenhum.**

### 2.4 Teste obrigatório

- [ ] Cada um dos 4 botões leva à oferta correta.
- [ ] A coleção não oferece bump nem pede para comprar o catálogo de novo.
- [ ] O Volume 1 leva ao checkout com bump, se configurado.
- [ ] O catálogo leva ao checkout do catálogo, não ao da coleção.
- [ ] O preço exibido na página bate com o preço do checkout.
- [ ] A entrega mostrada no checkout bate com a descrição da página.

### 2.5 Entrega

A configuração atual descreve **entrega automática pela plataforma de checkout após a confirmação do pagamento**:

```js
delivery: {
  confirmed: true,
  description: 'Entrega automática pela plataforma de checkout após a confirmação do pagamento. Você recebe os 7 PDFs e a planilha XLSX.',
},
```

Isso vale para Hotmart e Kiwify, desde que a entrega automática esteja realmente ativada no produto. Ajuste a descrição se o formato for um único `.zip`, área de membros ou download direto.

O roteiro de configuração nas duas plataformas está em [`PLATAFORMAS-CHECKOUT.md`](PLATAFORMAS-CHECKOUT.md).

---

## 3. UTMs e parâmetros de campanha

### 3.1 Parâmetros capturados

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, `src`, `sck`, `ref`.

### 3.2 Comportamento

- Na chegada, os parâmetros são lidos da URL.
- O primeiro toque e o último toque ficam em `sessionStorage` na chave `iadv_attr_v1`.
- Ao clicar em qualquer botão de checkout, todos os parâmetros são acrescentados à URL de destino.
- Se o mesmo parâmetro vier em momentos diferentes, o valor mais recente vence no último toque; o primeiro toque é preservado para os que não vierem depois.
- Nada é enviado a servidor próprio.

### 3.3 Teste

Abra:

```
http://127.0.0.1:8123/index.html?utm_source=instagram&utm_medium=paid&utm_campaign=lancamento&fbclid=teste123
```

Clique em "Quero a coleção". A URL de checkout deve conter os quatro parâmetros. O `InitiateCheckout` deve aparecer no Meta Events Manager (após consentimento).

### 3.4 Limitação

`sessionStorage` dura a sessão/aba. Se você precisa de atribuição de 30/90 dias, configure a captura no domínio/plataforma ou troque para `localStorage` com expiração (e atualize a política de privacidade). Para recuperação de carrinho, a plataforma normalmente já preserva a origem.

---

## 4. Meta Pixel

### 4.1 Configuração

```js
tracking: {
  metaPixelId: 'SEU_ID_NUMERICO', // não use ID fictício
  enabled: true,
  debug: false,
  currency: 'BRL',
},
```

Enquanto `enabled: false` ou o ID estiver vazio:

- nenhum script do Facebook é carregado;
- nenhum banner de consentimento é exibido (não há cookie de marketing);
- o rodapé, em "Preferências de cookies", explica que a medição está desativada.

### 4.2 Consentimento

- O banner aparece se houver Pixel configurado e nenhuma escolha salva.
- "Aceitar medição" grava `{ marketing: true }` em `localStorage` (`iadv_consent_v1`) e carrega o Pixel.
- "Só o essencial" grava `{ marketing: false }` e não carrega.
- A escolha pode ser revista no rodapé.
- O Pixel **nunca** é carregado antes do aceite.

### 4.3 Eventos disparados pela página

| Evento | Quando | Parâmetros |
|---|---|---|
| `PageView` | Imediatamente após o consentimento e o carregamento do Pixel | padrão |
| `ViewContent` | Quando a seção `#oferta` entra em 20% da viewport, uma vez | `content_name`, `content_type: product`, `content_ids`, `value`, `currency` |
| `InitiateCheckout` | No clique de um botão com URL de checkout válida | `content_name`, `content_type`, `content_ids`, `value`, `num_items`, `currency`, `eventID` |

O `eventID` do `InitiateCheckout` é gerado no cliente (`ic_<timestamp>_<random>`). Guarde-o se for enviar o mesmo evento via CAPI para deduplicação.

### 4.4 Purchase — leia antes de configurar

**A página não dispara `Purchase` no clique.** Isso evita contar clique como venda e evita duplicidade.

Configure a compra em um destes caminhos:

1. **Integração nativa da plataforma** com o Pixel (recomendado): a plataforma envia `Purchase` quando o pagamento é aprovado.
2. **Conversions API (CAPI)** a partir do webhook de venda: seu backend recebe a confirmação e envia o evento com `event_id` único, `value`, `currency`, `content_ids`, `order_id`.
3. **Página de obrigado**: só dispara se a URL tiver um token validado no servidor. Nunca confie apenas em `?status=aprovado`.

Regras:

- `Purchase` só depois de pagamento aprovado.
- Um `event_id` por pedido; o mesmo ID no navegador e no servidor para deduplicar.
- Não dispare `Purchase` no `InitiateCheckout`.
- Não use o valor do bump se a plataforma já inclui o bump no total; use o valor final do pedido.

### 4.5 CAPI (server-side)

Checklist:

- [ ] Token de acesso da CAPI guardado no servidor (nunca no HTML).
- [ ] `event_name: Purchase`, `event_time`, `event_id`, `action_source: website`.
- [ ] `user_data` com e-mail/telefone hasheados (SHA-256) quando disponíveis, além de `fbp`/`fbc`.
- [ ] `custom_data`: `value`, `currency`, `content_ids`, `content_type`, `order_id`.
- [ ] Test Events no Events Manager antes de ativar.
- [ ] Monitorar correspondência e deduplicação por 7 dias.

### 4.6 Eventos de teste

No Events Manager, use **Test Events** e navegue pela página com o Pixel de teste. Verifique `PageView`, `ViewContent` e `InitiateCheckout`. Não use o Pixel de produção para testes de clique.

---

## 5. Recuperação de carrinho

A página **não** coleta e-mail nem telefone e **não** simula recuperação. A recuperação deve ser configurada na plataforma de checkout:

1. Ative o carrinho abandonado/e-mail de recuperação na plataforma.
2. Se houver WhatsApp, conecte um número comercial e templates aprovados.
3. Configure 2 a 3 mensagens: lembrete (1 h), dúvida/oferta (24 h), último aviso (72 h) — sem falsa escassez.
4. Preserve a origem: a plataforma deve registrar UTM/`src` do checkout; a página já envia os parâmetros.
5. Inclua link direto para retomar o pagamento, não para a página inicial.
6. Respeite consentimento e ofereça descadastro.
7. Meça recuperação por origem e por mensagem.

Sugestão de primeira mensagem:

> "Você começou a compra da coleção IA de Verdade e não terminou. O link está aqui — se ficou alguma dúvida sobre formato, entrega ou garantia, responda este e-mail."

Não prometa desconto que não existe. Se houver cupom real, ele precisa estar configurado na plataforma.

---

## 6. Remarketing

Públicos sugeridos (crie no Events Manager/Gerenciador de Anúncios):

| Público | Regra | Janela | Uso |
|---|---|---|---|
| Visitantes da página | PageView | 30/90/180 dias | topo |
| Visualizou a oferta | ViewContent | 14/30 dias | meio |
| Iniciou checkout | InitiateCheckout | 7/14 dias | conversão |
| Compradores | Purchase (via plataforma/CAPI) | 180 dias | **exclusão** das campanhas de aquisição |
| Sem compra | Visitou, não comprou | 30 dias | remarketing |
| Vídeo | evento de player (não implementado) | 30 dias | só se você integrar o player e disparar um evento próprio |

Cuidados:

- Exclua compradores das campanhas de aquisição para não pagar duas vezes.
- Não crie público de "quase comprou" sem um evento real.
- Respeite a LGPD e a política de cookies.
- Se usar CAPI, mantenha o `event_id` consistente.

---

## 7. Order bump

### 7.1 Regra comercial

O bump é **Volume 6 (Referência) + Catálogo + planilha XLSX por R$ 27**, **somente** no checkout do **Volume 1**.

**Nunca** ofereça esse bump na compra da coleção completa: os três itens já estão incluídos.

### 7.2 Configuração

1. Crie a oferta complementar na plataforma, vinculada ao produto Volume 1.
2. Ative o order bump apenas nesse produto.
3. Teste uma compra de teste: o bump deve aparecer no Volume 1 e **não** aparecer na coleção.
4. Se a plataforma gerar uma URL específica para o checkout com bump, preencha `checkout.vol1Bump`.
5. Só então mude no config:

```js
offers: { bumpEnabled: true },
```

6. Rode `node scripts/build.js`.

Enquanto `bumpEnabled: false`, o bloco de bump, o FAQ do complemento e a nota de rodapé ficam **ocultos** na página. Isso evita prometer uma oferta que ainda não existe no checkout.

### 7.3 Preço

O preço planejado é R$ 27. Se a plataforma cobrar diferente, ajuste `prices.bump` e o preço da oferta na plataforma. A página não cobra nada.

---

## 8. Upsell

O upsell planejado é: quem comprou **somente o Volume 1** pode completar a coleção, aproveitando o valor já pago e pagando a diferença — **se a plataforma suportar essa operação**.

### 8.1 O que verificar na plataforma

- Existe oferta de upgrade/pós-compra?
- O upgrade aceita crédito do produto anterior?
- O checkout evita cobrar duas vezes?
- O acesso aos novos arquivos é liberado automaticamente?
- Há webhook/evento de compra para medir o upsell?

### 8.2 Regras

- O upsell é **pós-compra**, não nesta página.
- Não redirecione automaticamente para uma cobrança sem o comprador confirmar.
- Não prometa "pague só a diferença" se a plataforma não fizer isso.
- Se não houver suporte a crédito, a coleção continua sendo uma compra separada; a página já diz isso no FAQ.
- Meça a taxa de aceite do upsell separadamente.

### 8.3 Copy sugerida (para a página pós-compra)

> "Você já tem o Volume 1. Se quiser a sequência completa, a coleção inclui os Volumes 2 a 6, o catálogo e a planilha. A plataforma calcula o valor com o crédito da sua compra anterior. Você confirma o upgrade antes de pagar."

Só use se for verdade na sua plataforma.

---

## 9. Consentimento, cookies e LGPD

### 9.1 O que a página armazena

| Chave | Onde | Finalidade | Base |
|---|---|---|---|
| `iadv_consent_v1` | `localStorage` | lembrar aceite/recusa | consentimento |
| `iadv_attr_v1` | `sessionStorage` | UTMs/click IDs da sessão | legítimo interesse/atribuição |
| cookies do Pixel (`_fbp`, `_fbc`) | domínio | medição Meta | consentimento |

Não há formulário, login, banco ou dado de pagamento na página.

### 9.2 Como revogar

- Rodapé → "Preferências de cookies" → "Só o essencial".
- A escolha fica salva e o Pixel não é carregado nas próximas visitas.
- Se o Pixel já foi carregado na sessão, recarregue a página após revogar para encerrar os scripts já injetados.
- Para remoção completa de cookies, limpe os cookies do site no navegador.

### 9.3 Política de privacidade

Preencha `legal.privacyUrl` e publique uma política que cubra:

- dados coletados (UTMs, IP, cookies de medição);
- finalidade (medição de anúncios e melhoria da página);
- base legal e consentimento;
- compartilhamento com a Meta;
- prazo de retenção;
- direitos do titular e canal de contato;
- cookies utilizados e como revogar.

Enquanto o link estiver vazio, o rodapé mostra "Política de privacidade (em preparação)". **Não publique assim.**

### 9.4 CAPI e LGPD

Se enviar eventos server-side, inclua apenas os dados necessários, tenha base legal, informe na política e permita oposição. Não envie dados sensíveis.

---

## 10. Vídeo

```js
video: {
  enabled: true,
  embedUrl: 'https://www.youtube-nocookie.com/embed/SEU_ID',
  title: 'Apresentação da coleção',
},
```

- O iframe é inserido antes da galeria, com `loading="lazy"`, sem autoplay.
- Prefira `youtube-nocookie.com` e um aviso de cookies de terceiros.
- Se o vídeo for do Vimeo/outro, use a URL de embed (não a URL da página).
- Sem vídeo, a galeria de páginas reais continua sendo a demonstração.

---

## 11. Depoimentos

```js
testimonials: [
  {
    quote: 'Trecho real, com autorização.',
    name: 'Nome da pessoa',
    role: 'Contexto profissional',
    result: 'Resultado verificável, se houver e se puder ser comprovado.',
  },
],
```

- A seção fica oculta enquanto o array estiver vazio.
- Só publique com autorização e sem promessa de resultado.
- Não use foto de banco de imagens, cargo inventado ou número de alunos fictício.
- Se o depoimento citar resultado financeiro, guarde a comprovação e inclua contexto.

---

## 12. Publicação

1. Rode o checklist: [`CHECKLIST-PUBLICACAO.md`](CHECKLIST-PUBLICACAO.md).
2. Rode os testes: `node tests/audit.js` e `node tests/flows.js`.
3. Gere o pacote com `node scripts/package.js` e publique o conteúdo de **`dist/`** (Cloudflare Pages: [`CLOUDFLARE-PAGES.md`](CLOUDFLARE-PAGES.md)).
4. Não publique `src/`, `scripts/`, `docs/`, `tests/` no web root (ou bloqueie por servidor).
5. Configure a URL final em `site.url` (ou `IADV_SITE_URL`) e rode o build de novo para canonical/OG absoluto.
6. Teste a página no domínio real, em 4G e no celular.

---

## 13. Solução de problemas

| Sintoma | Causa provável | Correção |
|---|---|---|
| Clique mostra "Checkout em configuração" | URL vazia | Preencha `config.checkout` e rode o build |
| Pixel não dispara | `enabled:false`, ID vazio ou consentimento recusado | Configure e aceite a medição |
| InitiateCheckout não aparece | Sem consentimento ou URL inválida | Teste com Pixel de teste e URL real |
| Purchase não aparece | Não é disparado pela página | Configure na plataforma/CAPI |
| Bump não aparece | `offers.bumpEnabled:false` | Configure no checkout e mude para `true` |
| Preço não muda | Build não rodado | `node scripts/build.js` |
| OG sem imagem | `site.url` vazio | Preencha e rode o build |
| Deploy no Pages sem canonical | URL do pages.dev não configurada | Veja `CLOUDFLARE-PAGES.md` |
| Fonte estranha | Bloqueio de assets | Verifique `assets/fonts` no servidor |
