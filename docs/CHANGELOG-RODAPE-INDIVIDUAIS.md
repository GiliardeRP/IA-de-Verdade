# Rodapé, produtos individuais e ajustes de conteúdo

Data: 6 de novembro de 2026. Escopo: rodapé institucional, vitrine individual, remoção do aviso do catálogo/bloco de garantia e atualização do “Sobre”.

## 1. Arquivos modificados

- `src/config.js` — preços individuais dos Volumes 2–6, catálogo individual, e-mail oficial e comentários.
- `src/template.html` — rodapé, carrossel, “Sobre”, remoções e FAQ.
- `src/styles.css` — vitrine/carrossel, rodapé e limpeza de regras antigas.
- `src/app.js` — preços/checkouts individuais, carrossel, toast individual e CTA mobile.
- `scripts/build.js` — tokens dos 7 produtos, coluna legal condicional, gate de produção e FAQ.
- `index.html` / `dist/` — gerados.
- `tests/validate-individual.js` e `tests/validate-otimizado.js` — testes.
- `docs/validation-individual.json`, `docs/validation-otimizado.json` e relatórios Lighthouse.

## 2. O que mudou

### Rodapé

- 4 colunas no desktop quando a coluna **Informações** está ativa; no preview atual são 3, porque os documentos legais ainda não têm URL.
- Identificação: **Giliarde Reis Pereira · Pessoa Física**.
- E-mail clicável: **iadeverdade.oficial@gmail.com** (`mailto:`).
- Texto de atendimento e **Comercialização: Hotmart**.
- Copyright: **© 2026 IA de Verdade. Todos os direitos reservados.**
- Sem CPF, CNPJ, endereço, telefone, “a confirmar” ou “em preparação”.
- A coluna **Informações** só aparece quando Termos, Privacidade e Reembolso tiverem URLs reais. No preview atual ela fica oculta — o rodapé fica com 3 colunas, sem aviso de “em preparação”; a estrutura já está no build (`legalColumn`).
- “Preferências de cookies” preservado na linha inferior.
- No mobile, colunas empilhadas e e-mail com quebra segura.

### Vitrine individual

- Seção **“Adquira também individualmente.”** imediatamente após a oferta da coleção.
- 7 cards com capa original, nome completo, descrição curta, preço e botão.
- Preços: R$ 39,90; R$ 59,90; R$ 59,90; R$ 59,90; R$ 49,90; R$ 49,90; R$ 69,90.
- Desktop: 3 cards visíveis; tablet: 2; mobile: 1 com “peek” do próximo.
- Autoplay de 4,5 s; setas; bolinhas; arrastar; pausa no hover/foco; parada após interação; `prefers-reduced-motion` desliga o autoplay.
- Sem JS: os cards continuam acessíveis por rolagem horizontal; controles do carrossel ficam ocultos.
- Cada botão usa `data-checkout` próprio. Se o link estiver vazio, o clique mostra um aviso específico e **não redireciona para outro produto**.

### Conteúdo

- Removido o bloco **“Leia antes de instalar”** do catálogo.
- Removido o bloco de garantia da oferta e as menções de garantia na hero, microcopy, CTA final e FAQ.
- “Sobre” substituído pelo texto fornecido: formação no IF Baiano, atuação desde 2019, Tech Lead Backend, alta concorrência, PHP/Laravel, servidor próprio, OpenClaw/DSH e origem prática da coleção.
- FAQ: “Posso comprar somente um volume?” agora confirma todos os sete; a pergunta de garantia virou **“Onde a compra é processada?”** (Hotmart).
- Preço da coleção permanece R$ 197 (lançamento) / R$ 247.

## 3. Teste visual

Capturas:

- [`individual-desktop.png`](../tests/screenshots/individual-desktop.png)
- [`individual-mobile.png`](../tests/screenshots/individual-mobile.png)
- [`footer-desktop.png`](../tests/screenshots/footer-desktop.png)
- [`footer-mobile.png`](../tests/screenshots/footer-mobile.png)

Validação em 320, 360, 390, 768, 1024 e 1440 px:

- overflow horizontal: **0**;
- 7 cards e 7 preços corretos;
- imagens: 23 com alt e sem falha de arquivo;
- botões visíveis abaixo de 44 px: **0**;
- e-mail `mailto:iadeverdade.oficial@gmail.com` funcionando;
- Axe: **0 violações**;
- sem JS: 7 cards, rolagem horizontal e controles ocultos.

## 4. Testes do carrossel

Fonte: `docs/validation-individual.json`.

- Autoplay avançou de 0 para 1.
- Seta “próximo” avançou para 2.
- Hover manteve o índice em 2 por 5 s.
- Arrastar no mobile avançou de 0 para 1.
- `prefers-reduced-motion`: índice permaneceu em 0 após 4,8 s.
- CTA mobile fica oculto quando a vitrine está na tela.
- Botão individual vazio: toast específico, sem sair da seção e sem usar outro checkout.

Lighthouse:

| | Mobile | Desktop |
|---|---:|---:|
| Performance | 91 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 2,9 s | 0,7 s |
| CLS | 0 | 0 |

Relatórios: `docs/lighthouse/individual-mobile.report.html` e `docs/lighthouse/individual-desktop.report.html`.

## 5. Links e pendências antes de publicar

O preview **não inventa** links. O build de produção falha enquanto faltar:

- `site.url`;
- `checkout.collection`;
- `checkout.vol1`, `vol2`, `vol3`, `vol4`, `vol5`, `vol6`;
- `checkout.catalog`;
- `legal.termsUrl`;
- `legal.privacyUrl`;
- `legal.refundUrl`.

A coluna **Informações** do rodapé fica oculta no preview porque os três documentos ainda não têm URL. Quando forem configurados, ela aparece automaticamente. Não há links quebrados nem documentos fictícios.

O CPF/CNPJ não é exibido no rodapé. A identificação pública usa nome, Pessoa Física, e-mail e Hotmart. A definição sobre identificação fiscal obrigatória deve ser validada jurídicamente antes da venda.

**A página não está juridicamente pronta só por causa do rodapé.** Termos, privacidade, reembolso, identificação do vendedor e regras da Hotmart precisam ser finalizados antes de iniciar as vendas.
