# Validação — rodada 2

Fonte: `docs/validation-round2.json`.

| Largura | Altura | Palavras | Imagens | Compra | Overflow | Alinhamento |
|---:|---:|---:|---:|---:|---:|---|
| 320 | 15.559 | 1.766 | 28 | 14 | 0 | pass |
| 390 | 14.469 | 1.770 | 28 | 14 | 0 | pass |
| 768 | 12.559 | 1.822 | 28 | 14 | 0 | pass |
| 1024 | 12.947 | 1.822 | 28 | 14 | 0 | pass |
| 1440 | 13.178 | 1.832 | 28 | 14 | 0 | pass |

- Alinhamento: maior desvio **0,01 px** no centro dos blocos centralizados; carrossel e CTA final passam ±2 px.
- Anel: anima, hover 1,19×, pausa fora da tela e retoma; modo reduzido mostra 7 em leque; sem JS mostra 3; toque e arraste testados.
- Testemunhos: fixture com 3 autorizados renderiza 3; o não autorizado fica fora; sem Review no schema.
- Axe: **0 violações**.
- Sem overflow de 320 a 1440.
- **Altura:** subiu de 13.444 para 14.469 px no mobile (+7,6%) devido aos novos componentes; a meta de “não aumentar” não foi atingida sem cortar seção existente.
