# Links Hotmart no site

Verificado em 11/11/2026. Todos os links abriram HTTP 200 e os preços visíveis bateram com o `config.js`.

| Oferta | Link | Preço no checkout |
|---|---|---:|
| Coleção completa | https://pay.hotmart.com/Y108454666M | R$ 197,00 |
| Volume 1 | https://pay.hotmart.com/K108455234J | R$ 39,90 |
| Volume 2 | https://pay.hotmart.com/S108455306U | R$ 59,90 |
| Volume 3 | https://pay.hotmart.com/G108455378B | R$ 59,90 |
| Volume 4 | https://pay.hotmart.com/X108455419L | R$ 59,90 |
| Volume 5 | https://pay.hotmart.com/A108455456E | R$ 49,90 |
| Volume 6 / Referência | https://pay.hotmart.com/W108455501U | R$ 49,90 |
| Catálogo de Skills | https://pay.hotmart.com/N108455530M | R$ 69,90 |

## Pendências

- **EPUB:** a página promete 7 EPUBs. Os arquivos precisam estar anexados na entrega de cada produto na Hotmart. Não é possível verificar isso em uma página pública de checkout.
- **Políticas:** Termos, Privacidade e Reembolso ainda não têm URL; a coluna legal do rodapé fica oculta e o build de produção falha por isso.
- **Volume 6:** o título do checkout é “Volume de Referência - Catálogo de Skills e Combos”. Confirme se o produto inclui exatamente o que o card do Volume 6 promete.
- **Order bump:** não há link separado no arquivo e não foi identificado na página de checkout.

## Order bump

Order bump é uma oferta extra com checkbox dentro do checkout da Hotmart. É configurado na Hotmart, não na landing page. O visitante só vê depois de clicar em comprar.

Para configurar:

1. Hotmart > Produto > Checkout > Order Bump.
2. Escolha o produto do bump. Exemplo: Volume de Referência + Catálogo + planilha por R$ 27.
3. Ative e teste uma compra de teste.
4. Se a Hotmart gerar uma URL específica para o checkout com bump, preencha `checkout.vol1Bump`.
5. Só marque `offers.bumpEnabled: true` depois de configurar e testar.

O site não consegue adicionar o bump ao carrinho da Hotmart por conta própria. Um “bump” na landing page exigiria um carrinho/integração que a Hotmart não oferece por link simples.
