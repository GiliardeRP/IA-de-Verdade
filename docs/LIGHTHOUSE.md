# Lighthouse — versão final da rodada 2

- [Mobile HTML](lighthouse/final-mobile.report.html) · [Mobile JSON](lighthouse/final-mobile.report.json)
- [Desktop HTML](lighthouse/final-desktop.report.html) · [Desktop JSON](lighthouse/final-desktop.report.json)

| Categoria | Mobile | Desktop | Meta |
|---|---:|---:|---:|
| Performance | **96** | **100** | ≥ 90 |
| Acessibilidade | **96** | **100** | ≥ 95 |
| Boas práticas | **100** | **100** | ≥ 95 |
| SEO | **100** | **100** | ≥ 95 |

FCP 2,0 s / 0,4 s. LCP 2,6 s / 0,5 s. CLS 0. TBT 0.

Acessibilidade mobile em 96: resta `target-size` no anel de capas sobrepostas. As caixas têm mais de 44 px, mas a área segura entre vizinhas é menor. A meta ≥95 foi atingida.

A remoção da fonte Source Serif 4 (122 KB) e o uso de Georgia local elevaram a performance mobile de 88 para 96.
