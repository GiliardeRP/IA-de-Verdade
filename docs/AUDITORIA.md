# Auditoria dos materiais — IA de Verdade

Data da auditoria: 03/11/2026.
Fontes examinadas:

- `/home/king/ebook-fix/out/Volume1-corrigido.pdf`
- `/home/king/ebook-fix/out/Volume2-corrigido.pdf`
- `/home/king/ebook-fix/out/Volume3-corrigido.pdf`
- `/home/king/ebook-fix/out/Volume4-corrigido.pdf`
- `/home/king/ebook-fix/out/Volume5-corrigido.pdf`
- `/home/king/ebook-fix/out/VolumeReferencia-corrigido.pdf`
- `/home/king/ebook-fix/out/CatalogoSkills-corrigido.pdf`
- `/home/king/ebook-fix/out/Amostra-Gratis-Cap1-e-2.pdf`
- `/home/king/ebook-fix/out/Guia-da-Colecao-e-Grade.pdf`
- `/home/king/.openclaw/media/inbound/CatalogoSkills---68d46613-b58d-4087-8684-4a8deebdeb3f.xlsx`
- `/home/king/ebook-fix/out/Prompt-Landing-Page.md`
- `/home/king/ebook-fix/out/Plano-Instagram-TikTok.md`

---

## 1. Dimensão real da coleção

| Item | Capítulos | Páginas (editorial) | Páginas no PDF (inclui capa) |
|---|---:|---:|---:|
| Volume 1 — Entendendo e usando IA | 17 | 300 | 301 |
| Volume 2 — Construindo software com IA | 17 | 307 | 308 |
| Volume 3 — Agentes, automações e IA aplicada | 15 | 247 | 248 |
| Volume 4 — Manuais OpenClaw e DSH | 25 | 310 | 311 |
| Volume 5 — Controle remoto e Home Lab | 15 | 247 | 248 |
| Volume 6 — Referência | 0 (R1–R6 + apêndices) | 112 | 113 |
| Catálogo de Skills | 0 | 166 | 167 |
| **Cinco volumes de percurso** | **89** | **1.411** | — |
| **Seis volumes + catálogo** | — | **1.689** | — |

**Decisão editorial:** a página usa as contagens do Guia da coleção (300/307/247/310/247/112/166), que excluem a capa de cada PDF. A soma 1.411 + 112 + 166 = 1.689 aparece explicitamente no bloco "Como contamos". Nunca somamos 1.411 com o catálogo sem dizer o que está sendo contado.

**Capítulos:** 1–17 (Vol. 1), 18–34 (Vol. 2), 35–49 (Vol. 3), 50–74 (Vol. 4), 75–89 (Vol. 5) = 89 capítulos.

**Projetos ★:** o Guia afirma que cada capítulo fecha com um projeto prático marcado com ★. A página repete essa afirmação sem dizer que os projetos foram executados por nós.

---

## 2. Catálogo de Skills — números conferidos na planilha

A planilha `CatalogoSkills.xlsx` tem 1.324 linhas incluindo o cabeçalho: **1.323 registros**, **20 colunas (A–T)**, 4 abas (`Catalogo`, `Categorias`, `Combos`, `Licencas`).

| Métrica | Valor |
|---|---:|
| Skills | 1.323 |
| Repositórios distintos | 273 |
| Categorias principais | 11 |
| Subcategorias | 85 |
| Páginas do PDF | 166 |
| Combos | 13 |
| Colunas da planilha | 20 |

Distribuição por categoria (contagem real dos registros):

| Categoria | Skills |
|---|---:|
| Engenharia de software | 368 |
| Agentes e IA | 197 |
| Negócios e finanças | 174 |
| Mídia e criação | 155 |
| Dados e pesquisa | 124 |
| Produtividade e escritório | 85 |
| Segurança | 74 |
| Marketing e e-commerce | 65 |
| DevOps e nuvem | 56 |
| Outros (educação e saúde) | 14 |
| Homelab, redes e hardware | 11 |
| **Total** | **1.323** |

**Método de inspeção:** coleta e inspeção estática em 29/10/2026. A coluna de validação registra "inspeção estática do SKILL.md; link direto verificado (HTTP 200) na coleta" para os 1.323 registros. Isso **não** significa execução, teste funcional ou garantia de compatibilidade. A página diz isso de forma explícita e repete "leia o SKILL.md e a licença atuais".

**Planilha:** não há AutoFilter nativo no arquivo. A página não afirma que exista. O texto orienta filtrar/ordenar no Excel, Google Sheets ou LibreOffice Calc.

---

## 3. Conteúdo dos volumes

### Volume 1 — Entendendo e usando IA (300 p.)
Partes I–II. Fundamentos (o que é IA, LLM, tokens, contexto, temperatura, alucinação), prompt/context engineering, custos, ferramentas, aplicações no cotidiano (documentos, finanças, redes sociais, impressão 3D), automações sem código, primeiro bot, segurança e privacidade/LGPD. Projetos citados: Diário de bordo, Assistente pessoal, biblioteca de prompts, orçamento auditado, resumo de e-mails, primeiro bot.

### Volume 2 — Construindo software com IA (307 p.)
Partes III–V. Ambiente do dev com IA, Cursor e ferramentas, contexto de repositório (`AGENTS.md`), fluxo do pedido ao merge, delegação a agentes, Skills, APIs de modelos, confiabilidade, function/tool calling, IA como núcleo de sistemas, embeddings, RAG, MCP, projeto integrador, testes/evals, observabilidade, segurança. Projetos: slugify com spec e PR, extrator de recibos, busca semântica, servidor MCP, Central de Atendimento.

### Volume 3 — Agentes, automações e IA aplicada (247 p.)
Partes VI–VIII. Anatomia de agente, agente sem framework, frameworks/SDKs, agentes especializados, multiagentes, memória, agentes locais, n8n, integrações, 12 bots, processos empresariais, casos de uso. Projetos: mini-agente de pesquisa com citações, equipe pesquisador–redator–revisor, 12 bots, agente financeiro, pipeline descreva→imprima.

### Volume 4 — Manuais OpenClaw e DSH (310 p.)
Partes IX–XII. Mapa comum dos agentes pessoais; manual OpenClaw (arquitetura, instalação, modelos/agentes/sessões, canais, Skills, tarefas, acesso remoto/Tailscale, segurança, atualização/backup, exemplos); manual DSH (mesma estrutura + Creator mode/plugins); comparação e arquitetura combinada; projetos de integração. Projetos: código pelo Telegram, relatório semanal, social media com aprovação, oficina 3D remota.

### Volume 5 — Controle remoto e Home Lab (247 p.)
Partes XIII–XIV. Redes para humanos, mapa de controle remoto, Tailscale do zero e tutoriais, controle de computadores/celulares/agentes, projetos integrados; Home Lab, PCs antigos e celulares Android como servidores, CasaOS, apps, combinações, IA local, segurança, backup, manutenção, projetos finais. Projetos: painel da casa no celular, celular velho como servidor, 6 stacks, Assistente Casa completo.

### Volume 6 — Referência (112 p.)
R1 como ler o catálogo; R2 seleção comentada (cerca de 150 Skills); R3 13 combos; R4 licenças/riscos; R5 instalação por agente; R6 referências; A1 guia de estilo; A2 materiais complementares; G glossário e índice remissivo.

### Catálogo de Skills (166 p. + XLSX)
PDF de consulta com skills por categoria, combos, categorias/subcategorias, licenças e sinais de risco; planilha com os 1.323 registros e 20 colunas.

---

## 4. Assistente Casa

O Guia descreve um projeto único que atravessa a obra: nasce como conjunto de instruções no Volume 1 e termina hospedado na casa no Volume 5. A página usa a citação do Guia e cinco etapas:

1. Contexto mestre — Vol. 1, cap. 6.
2. Software (APIs, RAG, MCP) — Vol. 2, caps. 24–30.
3. Agentes — Vol. 3, caps. 35–49.
4. Operação (OpenClaw + DSH) — Vol. 4, caps. 50–74.
5. Casa (servidor, acesso remoto) — Vol. 5, caps. 75–89.

---

## 5. Autor

Texto-base extraído da seção "Sobre o autor" dos próprios PDFs:

> Giliarde Reis Pereira tem 25 anos e atua na área de programação desde 2019, quando iniciou a faculdade. Formou-se em 2022 já contratado por uma empresa de tecnologia do setor hoteleiro, onde começou como estagiário e passou a júnior, pleno e sênior. Tornou-se Tech Lead no início de 2026 e permanece no cargo. Trabalha com PHP e Laravel, com domínio de filas, jobs, processos assíncronos, balanceamento, Docker e deploy de aplicações. É Tech Lead Backend em uma das maiores empresas de software do ramo hoteleiro do Brasil. No último ano dedicou-se intensamente a IA aplicada: montou um servidor próprio com um computador parado em casa, hospedou agentes, automações e serviços, e passou a usar OpenClaw e DSH no dia a dia.

Perfil informado na obra: `linkedin.com/in/giliarde-reis-pereira`.
Não foram adicionados clientes, resultados, certificações, prêmios, número de alunos ou histórias pessoais. Não há foto; a página usa um monograma tipográfico.

---

## 6. Identidade visual observada nos PDFs

- Fundo quase preto (`#16191c`/`#191c20`) com faixa vertical azul (`#2f6bff`) nas capas.
- Azul de destaque, verde de código, tipografia sem serifa geométrica.
- Páginas internas em papel claro, texto escuro, títulos grandes, filetes finos, blocos de código escuros, selos coloridos de nível e callouts âmbar/vermelho.
- Fontes declaradas nos PDFs: **Space Grotesk**, **Source Serif 4** e **JetBrains Mono** (SIL OFL).
- Cores de apoio por volume: V1 azul, V2 roxo, V3 laranja, V4 verde-azulado, V5 verde, V6 azul claro.

A página replica essa linguagem: fundo escuro + papel quente, azul da coleção, monoespaçada para metadados, capas e páginas reais, sem mockups genéricos.

---

## 7. Inconsistências e decisões

| Achado | Decisão |
|---|---|
| `Prompt-Landing-Page.md` fala em "5 volumes + 2 bônus"; o briefing fala em 6 volumes + catálogo independente. | Adotamos o briefing: cinco volumes de percurso + Volume 6 de Referência + catálogo independente. A página explica a divisão. |
| `Prompt-Landing-Page.md` sugere âncora de R$ 329. | Não usada. Não há histórico real de R$ 329; o regular planejado é R$ 247. |
| `Prompt-Landing-Page.md` diz "mais de 1.300 páginas"; o briefing detalha 1.411 + 112 + 166. | Usamos 1.689 com a decomposição explícita. |
| PDFs têm uma página a mais que a contagem editorial (capa). | A página usa as contagens editoriais do Guia e explica a soma. |
| O Guia chama o PDF de "A4"; o arquivo real tem 453,5 × 652 pt (16 × 23 cm). | Removemos "A4" da copy. Ficou "PDF com sumário navegável", que é verdadeiro. |
| O catálogo tem 167 páginas no arquivo, 166 de conteúdo. | Usamos 166, como o Guia. |
| A planilha não tem AutoFilter nativo. | A página orienta filtrar/ordenar no software de planilhas, sem prometer filtro embutido. |
| A inspeção das Skills foi estática. | A página repete "inspeção estática", "catalogadas", "links verificados na coleta" e nega execução/teste. |
| O Guia em PDF usa "cinco volumes + dois bônus" e chamava os volumes de A4. | O PDF foi redesenhado no padrão visual do site, mantendo o conteúdo e a nomenclatura editorial; a seção do guia explica a diferença para Volume 6 + catálogo e separa "guia A4" de "volumes em PDF digital". |
| Não há depoimentos, compradores, avaliações ou vídeo. | Nada foi inventado. Depoimentos e vídeo existem como áreas desligadas. |
| Venda inicial como pessoa física (CPF), sem CNPJ/razão social; não há política nem canal de garantia definidos. | Rodapé passa a usar nome + CPF (CPF pendente), sem CNPJ. Entrega descrita como automática pela plataforma; formato exato e garantia ainda marcados no checklist. |
| O preço de lançamento não tem data definida. | Não há cronômetro. A página mostra a condição e o regular; `promo.endsAt` pode ser preenchido quando houver data real. |

---

## 8. O que não foi possível confirmar

- Formato exato de entrega (download, área de membros, `.zip`) e prazo; a página já afirma entrega automática pela plataforma.
- Canal e prazo de solicitação de reembolso.
- CPF (pessoa física) e canais de atendimento; CNPJ/razão social só se houver PJ no futuro.
- Política de privacidade, termos de uso e política de reembolso.
- Se haverá atualizações gratuitas/vitalícias, suporte, comunidade ou certificado.
- Se a plataforma de checkout suporta order bump e upsell com aproveitamento do valor pago.
- Depoimentos reais e vídeo de vendas.
- Se os volumes 2–6 serão vendidos individualmente no futuro.

Todos esses pontos estão no checklist e aparecem como pendentes apenas onde a informação é necessária para a compra.
