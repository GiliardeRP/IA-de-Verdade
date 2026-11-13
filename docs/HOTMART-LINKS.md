# Links Hotmart no site

Verificado em 13/11/2026. Todos os links abertos em navegador real e os preços visíveis bateram com o `config.js`.

Os parâmetros `?checkoutMode=10` e `&bid=...` foram gerados pela Hotmart e fazem parte do link de cada produto — não remova.

| Oferta | Link | Preço no checkout |
|---|---|---:|
| Coleção completa | https://pay.hotmart.com/Y108454666M | R$ 197,00 |
| Volume 1 | https://pay.hotmart.com/K108455234J?checkoutMode=10 | R$ 39,90 |
| Volume 2 | https://pay.hotmart.com/S108455306U?checkoutMode=10&bid=1794534005437 | R$ 59,90 |
| Volume 3 | https://pay.hotmart.com/G108455378B?checkoutMode=10&bid=1794534080878 | R$ 59,90 |
| Volume 4 | https://pay.hotmart.com/X108455419L?checkoutMode=10 | R$ 59,90 |
| Volume 5 | https://pay.hotmart.com/A108455456E?checkoutMode=10&bid=1794534142153 | R$ 49,90 |
| Volume 6 / Referência | https://pay.hotmart.com/W108455501U?checkoutMode=10&bid=1794534218201 | R$ 49,90 |
| Catálogo de Skills | https://pay.hotmart.com/N108455530M?checkoutMode=10&bid=1794534241761 | R$ 69,90 |

## Ponto de partida (seção "Escolha o seu ponto de partida")

Estes dois links levam ao checkout do primeiro volume da dupla, com o segundo já configurado como order bump de -20%.

| Cartão | Link | O que entrega |
|---|---|---|
| Volumes 2 e 3 | https://pay.hotmart.com/S108455306U?off=9ddse0n8&checkoutMode=10 | Vol. 2 (R$ 59,90) + Vol. 3 no bump por R$ 47,90 |
| Volumes 4 e 5 | https://pay.hotmart.com/X108455419L?off=4ervwqvk&checkoutMode=10 | Vol. 4 (R$ 59,90) + Vol. 5 no bump por R$ 39,90 |

O cartão do Volume 1 usa o link normal do Volume 1. O bump é opcional e o comprador pode desmarcar.

## Pendências

- **Políticas:** Termos, Privacidade e Reembolso ainda não têm URL; a coluna legal do rodapé fica oculta e o build de produção falha por isso.
- **Volume 6:** o título do checkout é “Volume de Referência - Catálogo de Skills e Combos”. Confirme se o produto inclui exatamente o que o card do Volume 6 promete.
- **Bump do Volume 1:** a oferta de V6 + catálogo + planilha por R$ 27 não existe na Hotmart ainda. `offers.bumpEnabled` continua `false` e `checkout.vol1Bump` vazio.
- **Taxas:** a Hotmart cobra por transação; o bump entra na mesma compra.

## Order bump

Order bump é uma oferta extra com checkbox dentro do checkout da Hotmart. É configurado na Hotmart, não na landing page. O visitante só vê depois de clicar em comprar.

Estado em 13/11/2026: existem dois bumps ativos (Vol. 2 → Vol. 3 e Vol. 4 → Vol. 5, ambos -20%), acessíveis pelos links com `?off=` acima.

Para o bump do Volume 1:

1. Criar o produto/combo que entrega Volume de Referência + Catálogo + planilha.
2. Hotmart > Produto Volume 1 > Checkout > Order Bump: escolher esse produto e o preço.
3. Testar uma compra do Volume 1 com e sem o bump.
4. Se a Hotmart gerar URL específica, preencher `checkout.vol1Bump`; depois ligar `offers.bumpEnabled`.