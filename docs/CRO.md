# Plano de CRO — hipóteses, testes e leitura de dados

O objetivo da página é uma coisa só: **vender a coleção completa** (e, secundariamente, o Volume 1 e o catálogo). Tudo aqui deve ser medido contra isso, não contra curtidas, tempo na página ou "engajamento".

Nada neste documento foi implementado como teste A/B real. Não há ferramenta de experimentação conectada. A página está preparada com atributos `data-cro` para facilitar a troca de variantes quando você escolher uma ferramenta (Google Optimize não existe mais; use o recurso nativo da sua plataforma, um testador de landing page ou um roteador de experimentos no servidor).

---

## 1. Métricas que importam

| Etapa | Evento | O que responde |
|---|---|---|
| Chegada | `PageView` | volume e origem |
| Interesse | `ViewContent` (seção de oferta) | quantos chegam à oferta |
| Intenção | `InitiateCheckout` | quantos clicam para comprar |
| Compra | `Purchase` (plataforma/CAPI) | quantos pagam |
| Receita | valor do pedido | ticket, bump, upsell |

Derivadas:

- **Conversão da página** = Purchase / PageView.
- **Conversão da oferta** = Purchase / ViewContent.
- **Taxa de clique no checkout** = InitiateCheckout / ViewContent.
- **Abandono de checkout** = 1 − Purchase / InitiateCheckout.
- **Receita por visitante** = receita / PageView.
- **Take rate do bump** = pedidos com bump / pedidos do Volume 1.
- **Take rate do upsell** = upsells aceitos / compradores do Volume 1.

Segmentar sempre por: origem (`utm_source`/`utm_campaign`), dispositivo (mobile/desktop), oferta (coleção/Volume 1/catálogo) e temperatura (frio/remarketing).

---

## 2. Leitura antes de testar

Não comece A/B com menos de ~100 conversões por variante (ou ~1.000 visitas por variante em páginas de ticket baixo). Antes disso:

1. Verifique se o tráfego está qualificado (anúncio prometendo "curso em vídeo" traz público errado).
2. Verifique se o checkout está funcionando e se o preço bate.
3. Verifique se a entrega está acontecendo.
4. Ouça 10 pessoas: 5 que compraram e 5 que não compraram.
5. Só então mexa na headline.

A página atual já tem um funil completo; o gargalo pode estar no anúncio, no preço, na confiança ou na entrega — não necessariamente no layout.

---

## 3. Hipóteses priorizadas (ICE)

ICE = Impacto × Confiança × Facilidade (1–5 cada). Priorize o maior score.

| # | Hipótese | ICE | Como testar | Métrica |
|---|---|---|---|---|
| 1 | Uma headline mais concreta ("Do prompt ao servidor") converte mais que uma headline de transformação ("Aprenda a construir com IA") | 5×4×5 = 100 | Variante A/B da headline + subheadline | conversão da página |
| 2 | Mostrar a capa do Volume 1 maior, com o catálogo ao lado, aumenta o entendimento do produto | 4×3×4 = 48 | Trocar a parede de capas por um herói visual com 2 capas | ViewContent e conversão |
| 3 | Um CTA com preço explícito ("Quero a coleção — R$ 197") converte mais que um CTA sem preço | 4×4×5 = 80 | Variante do botão | InitiateCheckout |
| 4 | Trazer a demonstração de páginas para cima (antes dos volumes) aumenta a confiança | 4×3×3 = 36 | Reordenar seções | ViewContent/conversão |
| 5 | Apresentar o catálogo como produto independente (não como bônus) aumenta a percepção de valor da coleção | 4×3×3 = 36 | Bloco do catálogo com oferta própria vs. menção secundária | conversão da coleção e do catálogo |
| 6 | Um vídeo curto de 60–90 s com o autor mostrando o material aumenta a conversão | 5×3×2 = 30 | Inserir vídeo real; comparar com galeria | conversão |
| 7 | Depoimentos reais (com contexto) aumentam a conversão | 4×2×3 = 24 | Só depois de ter depoimentos autorizados | conversão |
| 8 | O CTA fixo no mobile ajuda, mas pode atrapalhar a leitura | 3×3×4 = 36 | Ligar/desligar a barra | conversão mobile e scroll depth |
| 9 | "R$ 197 à vista" vs. "12x de R$ ..." (se a plataforma permitir) muda a percepção | 4×3×3 = 36 | Só se o parcelamento for real | InitiateCheckout |
| 10 | O order bump a R$ 27 tem elasticidade (testar R$ 37/R$ 47) | 3×3×3 = 27 | Testar preço no checkout, não na página | take rate e receita por pedido |

**Não teste** ao mesmo tempo: headline, preço, ordem das seções e CTA. Um teste por vez, com duração mínima de 7–14 dias e sem espiar o resultado a cada hora.

---

## 4. Onde a página já está preparada

Atributos `data-cro` marcam os elementos que costumam virar variante:

| Elemento | Atributo |
|---|---|
| Headline do hero | `data-cro="hero-headline"` |
| Subheadline | `data-cro="hero-subheadline"` |
| Grupo de CTAs do hero | `data-cro="hero-cta"` |
| Bloco de preço da oferta | `data-cro="offer-price"` |
| Prova do catálogo | `data-cro="catalog-proof"` |
| CTA principal da oferta | `data-cro="offer-cta"` |

Para um teste:

1. Duplique `index.html` (ex.: `index-b.html`) e altere só a variante.
2. Roteie 50/50 no servidor ou na ferramenta, preservando UTMs.
3. Garanta que as duas variantes disparem os mesmos eventos e tenham o mesmo checkout.
4. Não use redirecionamento que perca `utm_*`/`fbclid`.
5. Meça por 14 dias ou até atingir significância prática; pare se a variante perder dinheiro.

Como não há ferramenta conectada, **não implementamos** um "teste A/B" fictício nem um seletor aleatório que grava resultado pela metade.

---

## 5. Mensagem por público (ad → landing)

A mesma página atende quatro públicos; o anúncio deve prometer o que a seção correspondente entrega. Use âncoras para alinhar a primeira dobra ao criativo:

| Público | Gancho do anúncio | Âncora na página |
|---|---|---|
| Usuários de IA | "Você usa ChatGPT todo dia. Falta construir com ele." | `#volumes` (V1) |
| Automação/agentes | "Do prompt ao agente que executa." | `#volumes` (V3) / `#jornada` |
| Programadores | "Programar com IA sem virar refém do autocomplete." | `#volumes` (V2) |
| Home Lab | "Um agente rodando na sua casa, com acesso remoto e backup." | `#volumes` (V4–V5) |

Se o anúncio fala de "curso", "certificado" ou "mentoria", o público chega errado. A página diz explicitamente que não é isso — o que reduz reembolso, mas também conversão desqualificada. Melhor alinhar o anúncio.

---

## 6. Melhorias de conversão sem A/B (faça já)

1. **Prova real acima da dobra no mobile.** Hoje as capas começam logo abaixo do CTA. Se o tráfego mobile for majoritário, teste uma miniatura de 3 capas antes do CTA.
2. **Vídeo curto do autor** mostrando o PDF e a planilha. Não precisa de rosto o tempo todo; uma gravação de tela de 60 s já ajuda.
3. **Depoimentos reais** com contexto ("comprei para X, usei no capítulo Y"). Sem foto de banco de imagens.
4. **Página de obrigado** com instruções de download e um upsell claro, se a plataforma permitir.
5. **E-mail de recuperação** com link direto para o checkout.
6. **Amostra grátis** com captura de e-mail (opcional), para nutrir quem não compra agora. Só faça com consentimento e política.
7. **Cupom real de primeira compra** apenas se a margem permitir; não use escassez falsa.
8. **Checkout com Pix** (se disponível) e parcelamento real; a página não deve prometer o que a plataforma não tem.
9. **Prova de edição**: "edição de novembro/2026, informações conferidas em 1º/11/2026" já está na página; mantenha a data atualizada.
10. **Reduzir atrito**: se a entrega for por área de membros, explique o primeiro acesso; se for download, diga o tamanho aproximado e que são 8 arquivos.

---

## 7. Testes de oferta (não só de página)

- **Preço**: R$ 197 é o planejado. Testar R$ 227/R$ 247 só com base em margem e demanda; não use âncora falsa de R$ 329.
- **Bump**: R$ 27 é agressivo; teste R$ 37 e R$ 47. Meça receita por pedido, não só take rate.
- **Upsell**: se a plataforma permitir crédito, teste oferecer a coleção por diferença no pós-compra. Meça aceite e reembolso.
- **Catálogo avulso**: teste R$ 69,90 vs R$ 89,90; cuidado para não canibalizar a coleção. O catálogo incluído é parte do argumento de valor.
- **Garantia**: 7 dias é o mínimo legal; não estenda sem caixa. Comunique o processo, não só o prazo.

---

## 8. Remarketing e recuperação

- Visitantes da página: anúncio com a demonstração real (página interna), não com a capa.
- ViewContent: anúncio com o catálogo/planilha e a promessa de consulta.
- InitiateCheckout: anúncio com garantia e entrega, para reduzir risco percebido.
- Compradores: excluir da aquisição; oferecer upsell só se existir.
- Carrinho: 3 mensagens (1 h, 24 h, 72 h), sem desconto falso.
- Meça receita incremental, não apenas cliques.

---

## 9. Guardrails

- Nada de depoimento inventado, avaliação falsa, "milhares de alunos" ou resultado financeiro.
- Nada de contagem regressiva reiniciável, vagas limitadas ou "últimas unidades" para produto digital.
- Nada de prometer curso, mentoria, certificado, suporte ou atualização que não existam.
- Nada de dizer que as 1.323 Skills foram testadas: a inspeção foi estática.
- Se o teste piorar a clareza, descarte — mesmo que melhore o clique.
- Se o teste aumentar conversão mas também reembolso, o ganho não é real.

---

## 10. Ordem sugerida de experimentos

1. Instrumentação e checkout 100% funcionando.
2. Headline + subheadline (impacto alto, custo baixo).
3. CTA com preço vs. sem preço (mobile primeiro).
4. Demonstração mais alta vs. na posição atual.
5. Vídeo real (quando existir).
6. Depoimentos reais (quando existirem).
7. Preço/bump (com margem e operação).
8. Upsell/pós-compra.

Sem dados, a página atual é uma base sólida — não um experimento. O próximo passo é tráfego real, checkout real e leitura honesta dos números.
