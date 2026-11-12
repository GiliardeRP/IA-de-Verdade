# Checklist de publicação

## Antes do build de produção

- [ ] `site.url` definido (ou `IADV_SITE_URL`/`CF_PAGES_URL`).
- [x] `checkout.collection`.
- [x] `checkout.vol1`, `vol2`, `vol3`, `vol4`, `vol5`, `vol6`.
- [x] `checkout.catalog`.
- [ ] `legal.name` e `legal.email`.
- [ ] `legal.privacyUrl`, `legal.termsUrl`, `legal.refundUrl`.
- [x] Preços conferidos no checkout em 11/11/2026: coleção R$ 197/R$ 247; V1 R$ 39,90; V2–V4 R$ 59,90; V5/V6 R$ 49,90; catálogo individual R$ 69,90.
- [ ] Identificação pública: Giliarde Reis Pereira · Pessoa Física · Hotmart.
- [ ] CPF/CNPJ não é exibido; validar com apoio jurídico a obrigação de identificação fiscal.
- [ ] Termos, privacidade e reembolso prontos; a coluna “Informações” do rodapé só aparece com as três URLs.

## Build

```bash
IADV_MODE=production IADV_SITE_URL="https://seu-dominio/" npm run build
```

Produção falha hoje apenas por falta das três políticas. Não publica “a confirmar”, “em preparação” nem cria links legais fictícios.

## Depois do build

- [ ] Canonical, OG e Twitter absolutos.
- [ ] `dist/sitemap.xml` e `robots.txt`.
- [ ] `dist/llms.txt` com URL real.
- [ ] 11 caminhos de compra: 4 da coleção + 7 individuais.
- [ ] Testar os 8 checkouts na Hotmart.
- [ ] Testar e-mail `mailto:iadeverdade.oficial@gmail.com`.
- [ ] Testar carrossel no desktop e no celular: autoplay, setas, dots, swipe e pausa.
- [ ] Lighthouse mobile ≥90 e acessibilidade ≥95.
- [ ] Testar 320, 390, 768, 1024 e 1440 px.

## Observação

O rodapé não torna a página juridicamente pronta. Termos, privacidade, reembolso, identificação do vendedor e regras da Hotmart precisam ser finalizados antes de iniciar as vendas.
