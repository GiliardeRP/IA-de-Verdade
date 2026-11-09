# Hotmart ou Kiwify — preparação da integração

A página **não depende** de uma plataforma específica. Ela precisa das URLs de checkout da coleção, dos seis volumes e do catálogo; opcionalmente, uma URL do Volume 1 com order bump.

Este documento organiza a decisão e o roteiro de configuração nas duas plataformas. Não há conta criada, produto publicado, preço configurado ou integração ativa neste projeto.

---

## 1. O que a página já entrega

| Recurso | Estado |
|---|---|
| Links de checkout configuráveis | `src/config.js` → `checkout.collection`, `checkout.vol1`…`vol6`, `checkout.catalog` |
| Link opcional com order bump | `checkout.vol1Bump` (se a plataforma tiver URL específica) |
| UTMs/click IDs preservados até o checkout | implementado |
| `InitiateCheckout` no clique | implementado (após consentimento) |
| Purchase na aprovação | **não** no cliente; configurar na plataforma/CAPI |
| Entrega automática | descrita na página; configurar na plataforma |
| Order bump | bloco/FAQ ocultos até `offers.bumpEnabled: true` |
| Upsell | documentado; depende da plataforma |
| Carrinho abandonado | documentado; depende da plataforma |
| Pixel/CAPI | preparados, sem IDs fictícios |

---

## 2. Cadastro como pessoa física

As duas plataformas atendem vendedores pessoa física; confirme no fluxo de cadastro os documentos, a verificação de identidade e os limites da conta.

No projeto:

```js
legal: {
  entityType: 'pf',
  name: 'Giliarde Reis Pereira',
  cpf: '', // preencher quando for publicar
  company: '',
  cnpj: '',
  ...
}
```

- O rodapé passa a mostrar **nome + CPF**, sem razão social/CNPJ.
- O CPF é dado pessoal. Avalie com apoio jurídico se deve ser exibido integralmente no rodapé ou se basta nome + canal de atendimento; a LGPD pede minimização.
- A plataforma pode exigir CPF no cadastro do vendedor, mesmo que a página não exiba.
- Não é necessário abrir CNPJ para começar. Se depois você abrir, mude `entityType: 'pj'` e preencha `company`/`cnpj`.

---

## 3. Estrutura de produtos/ofertas

Crie quatro ofertas, nesta ordem:

| Oferta | Conteúdo | Preço | URL na config |
|---|---|---:|---|
| Coleção completa | 7 PDFs + 1 XLSX | R$ 197 lançamento / R$ 247 regular | `checkout.collection` |
| Volume 1 | 1 PDF | R$ 39,90 | `checkout.vol1` |
| Volume 2 | 1 PDF | definir preço individual | `checkout.vol2` |
| Volume 3 | 1 PDF | definir preço individual | `checkout.vol3` |
| Volume 4 | 1 PDF | definir preço individual | `checkout.vol4` |
| Volume 5 | 1 PDF | definir preço individual | `checkout.vol5` |
| Volume 6 | 1 PDF | definir preço individual | `checkout.vol6` |
| Catálogo de Skills | 1 PDF + 1 XLSX | R$ 69,90 lançamento / R$ 89,90 regular | `checkout.catalog` |
| Volume 1 + complemento | Volume 1 + V6 + catálogo + XLSX | R$ 39,90 + R$ 27 | `checkout.vol1Bump` (opcional) |

Regras:

- O complemento de R$ 27 é **somente** para o Volume 1.
- A coleção completa **não** recebe order bump; ela já contém V6, catálogo e planilha.
- O catálogo avulso é um produto independente; não o ofereça de novo como bump da coleção.
- Se a plataforma não separar o checkout com bump em uma URL própria, use `vol1` e ative o bump no produto Volume 1.

---

## 4. Entrega automática

As duas oferecem recursos de entrega de produto digital; confirme no painel como o acesso é liberado após a confirmação do pagamento (área de membros, arquivos ou link).

1. O produto está marcado como **digital**.
2. Todos os arquivos estão anexados (7 PDFs + 1 XLSX) ou em um `.zip` organizado.
3. A liberação é **automática após aprovação**, não manual.
4. O comprador recebe e-mail com instruções de acesso/download.
5. O prazo de liberação no cartão/Pix está claro.
6. A política de reembolso está publicada.

Se a plataforma limitar a quantidade de arquivos por produto, use um `.zip` com nomes claros:

```
IA-de-Verdade-Volume-1.pdf
IA-de-Verdade-Volume-2.pdf
...
IA-de-Verdade-Volume-6-Referencia.pdf
IA-de-Verdade-Catalogo-de-Skills.pdf
IA-de-Verdade-Catalogo-de-Skills.xlsx
```

A página diz "você recebe os 7 PDFs e a planilha XLSX". Se a entrega for um único ZIP, ajuste `delivery.description` para refletir isso.

---

## 5. Order bump

Verifique no painel da plataforma escolhida:

- O recurso de order bump existe no plano/conta?
- Ele pode ser vinculado **somente** ao produto Volume 1?
- O preço pode ser R$ 27?
- O comprador vê o complemento antes de pagar?
- O acesso ao V6/catálogo/planilha é liberado junto?

Se sim:

1. Configure o bump no produto Volume 1.
2. Teste uma compra do Volume 1 com e sem o bump.
3. Teste a coleção completa e confirme que o bump **não** aparece.
4. Preencha `checkout.vol1Bump` se houver URL própria.
5. Mude `offers.bumpEnabled: true` e rode o build.

Enquanto não estiver configurado, mantenha `false`; o bloco, o FAQ e a nota ficam ocultos.

---

## 6. Upsell

O upsell planejado é oferecer a coleção completa a quem comprou só o Volume 1, aproveitando o valor pago. Isso **só** pode ser prometido se a plataforma tiver upgrade com crédito.

Perguntas para o painel:

- Existe oferta de upgrade/pós-compra?
- O sistema abate o valor do Volume 1?
- O comprador confirma o novo pagamento?
- O acesso é liberado automaticamente?
- Há evento de compra separado para medir?

Se a resposta for "não" em qualquer ponto, mantenha a coleção como compra separada. A página já diz isso no FAQ. Não implemente cobrança de diferença por conta própria.

---

## 7. Pixel, CAPI e UTMs

### Na plataforma

- Procure a integração nativa com Meta Pixel/Conversions API.
- Configure o evento de **compra aprovada** (Purchase), não o clique.
- Informe o Pixel ID **real** (não use o de teste em produção).
- Se houver CAPI nativa, ative e confira a deduplicação.
- Verifique se a plataforma repassa `utm_*`, `fbclid`, `src` e `sck` ao pedido.

### Na página

```js
tracking: {
  metaPixelId: 'SEU_ID_REAL',
  enabled: true,
  debug: false,
  currency: 'BRL',
}
```

A página dispara `PageView`, `ViewContent` e `InitiateCheckout`. O `Purchase` vem da plataforma/CAPI. Se você usar o Pixel da página **e** o da plataforma, evite duplicidade: escolha um caminho para `Purchase` ou deduplique por `event_id`.

### Teste de UTM

```
https://SEU-PROJETO.pages.dev/?utm_source=instagram&utm_medium=paid&utm_campaign=lancamento
```

Clique em comprar e confira a URL do checkout. Depois confira no pedido da plataforma se a origem foi registrada.

---

## 8. Recuperação de carrinho

Verifique:

- E-mail de carrinho abandonado (1 h, 24 h, 72 h).
- WhatsApp, se disponível, com consentimento e template aprovado.
- Link de retomada direto no checkout.
- Origem/UTM preservada no pedido.
- Descadastro e política de privacidade.

A página não captura e-mail nem telefone; a recuperação é responsabilidade da plataforma.

---

## 9. Critérios de decisão

Não escolha só pela taxa. Compare:

| Critério | O que verificar |
|---|---|
| Taxa total | taxa por transação + taxa de saque + antecipação |
| Recebimento | prazo, Pix, cartão, parcelamento, boleto |
| Entrega | arquivos, área de membros, automação, limite de tamanho |
| Order bump | disponível no plano? vinculável a um produto? |
| Upsell | upgrade com crédito? pós-compra? |
| Carrinho | e-mail/WhatsApp, automação, link de retomada |
| Pixel/CAPI | integração nativa, eventos, deduplicação |
| UTM | repasse ao pedido e relatórios |
| Suporte | atendimento ao vendedor e ao comprador |
| Reembolso | fluxo, prazo, chargeback |
| Conta PF | cadastro com CPF, verificação, limites |
| Saque | banco, prazo, mínimo |

Faça uma compra de teste em cada uma, com o mesmo produto, e compare o pós-venda. A decisão pode ser revertida: a página é provider-agnostic.

---

## 10. Roteiro de ativação (qualquer plataforma)

1. Criar conta PF e verificar identidade.
2. Criar os 9 produtos (coleção, 6 volumes, catálogo) e a oferta de bump (se houver).
3. Subir os arquivos e ativar entrega automática.
4. Configurar preços de lançamento e regular.
5. Configurar order bump apenas no Volume 1 (se disponível).
6. Configurar upsell pós-compra (se disponível).
7. Configurar Pixel/CAPI de compra.
8. Copiar as URLs para `src/config.js`.
9. `npm run build` e publicar no Cloudflare Pages.
10. Testar compra, entrega, reembolso e eventos.
11. Só então ativar tráfego pago.

---

## 11. O que não fazer

- Não publique com URL de checkout vazia e anúncio ativo.
- Não configure bump na coleção.
- Não prometa upsell com crédito se a plataforma não fizer.
- Não use Pixel de teste em produção.
- Não dispare Purchase no clique.
- Não publique CPF sem decidir a base legal e a necessidade.
- Não deixe a política de reembolso "em preparação" enquanto vende.
