# Como coletar depoimentos reais

1. Convide leitores beta que realmente compraram ou receberam o material para testar.
2. Peça um relato específico: o que usou, o que mudou e o que não funcionou. Evite elogio genérico.
3. Envie um pedido de autorização por escrito (e-mail ou mensagem) dizendo que o nome, o perfil e o texto poderão aparecer na página.
4. Só cadastre em `config.testimonials` com `autorizado: true` depois da resposta positiva.
5. Formato:

```js
testimonials: [
  { nome: 'Nome', perfil: 'Desenvolvedor(a)', texto: 'Relato real', data: '2026-11-07', autorizado: true }
]
```

6. Ative `flags.testimonials: true`.
7. Revise o texto com a pessoa antes de publicar. Se ela retirar a autorização, remova o item.
8. O componente não gera `Review` nem `aggregateRating`; não invente números de compradores.

Sem itens autorizados, a seção não é criada no DOM. Os dados em `tests/fixtures/testimonials.json` são fictícios e servem apenas ao teste automatizado; nunca são usados no build.
