# Créditos e licenças

## Conteúdo do produto

Textos, capas, páginas internas, catálogo e planilha: **© 2026 Giliarde Reis Pereira**. Todos os direitos reservados. As imagens de capa e de páginas internas foram renderizadas diretamente dos PDFs do próprio produto, sem recriação, mockup genérico ou banco de imagens. A página é uma peça de venda autorizada do produto.

O PDF de amostra em `assets/amostra/` é o arquivo real "Amostra-Gratis-Cap1-e-2.pdf" distribuído com a coleção.

O **Guia da coleção e grade de conteúdo** em `assets/guia/Guia-da-Colecao-e-Grade.pdf` foi redesenhado a partir do PDF original fornecido pelo autor, com o conteúdo editorial preservado (pequenos ajustes de clareza, como o total de páginas) e layout próprio do site (fontes, azul da coleção, capa escura e páginas em papel). As imagens `guia-p1.webp` e `guia-p2.webp` são renderizações das duas páginas da nova versão. A seção do site registra a diferença de nomenclatura entre o PDF (cinco volumes + dois bônus) e a página (Volume 6 + catálogo independente).

## Tipografia

As três famílias são distribuídas sob a **SIL Open Font License 1.1** e foram auto-hospedadas em `assets/fonts/` (subsets latin/latin-ext):

- **Space Grotesk** — © The Space Grotesk Project Authors. Licença: [`assets/fonts/OFL.txt`](../assets/fonts/OFL.txt).
- **Source Serif 4** — © Adobe. Licença: [`assets/fonts/OFL-Source-Serif-4.txt`](../assets/fonts/OFL-Source-Serif-4.txt).
- **JetBrains Mono** — © JetBrains s.r.o. Licença: [`assets/fonts/OFL-JetBrains-Mono.txt`](../assets/fonts/OFL-JetBrains-Mono.txt).

Os arquivos `.woff2` foram obtidos do serviço Google Fonts e são redistribuídos sob a mesma licença OFL. Nenhuma fonte é carregada de CDN em tempo de execução.

## Imagens derivadas

- `assets/covers/*.webp` — capas dos seis volumes e do catálogo, renderizadas dos PDFs (Poppler `pdftoppm`, 160 dpi) e convertidas para WebP.
- `assets/pages/*.webp` — páginas internas reais (Vol. 1 p. 34 e 118; Vol. 2 p. 62; Vol. 3 p. 22; Vol. 4 p. 36; Vol. 5 p. 48; Vol. 6 p. 20; Catálogo p. 8 e 15), renderizadas a 150 dpi e convertidas para WebP.
- `assets/catalog/planilha.webp` — **visualização** de 18 linhas reais da planilha `CatalogoSkills.xlsx` (20 colunas), renderizada em HTML e capturada em Chromium. Não é uma captura da interface do Excel; os dados são reais e a página identifica a peça como "amostra dos registros reais".
- `assets/og-image.jpg` — composição com capas reais, criada para a página.
- `assets/favicon.svg` e `assets/favicon-64.png` — marca tipográfica "IA" criada para o projeto.

## Ferramentas de desenvolvimento (não vão para produção)

- Chromium headless via Playwright Core, usado para testes, capturas e geração das imagens da planilha/OG.
- axe-core 4.10.2, usado apenas na auditoria de acessibilidade.
- sharp, usado apenas para conversão/redimensionamento de imagens.
- Poppler (`pdftoppm`, `pdftotext`, `pdfinfo`), usado na auditoria e extração das páginas.

Essas ferramentas não são dependências da página publicada. O `index.html` final não carrega bibliotecas de terceiros.

## Capas

A foto do autor em `assets/autor/` foi fornecida pelo próprio autor (retrato pessoal, sem banco de imagens).

As 7 capas oficiais foram enviadas pelo autor. As versões usadas na página estão em `assets/covers/` como WebP, com o sufixo `-oficial`. O catálogo teve o texto “fichas” corrigido para “skills”. Não há banco de imagens.

## O que não foi usado

- Nenhuma foto de banco de imagens.
- Nenhum depoimento fictício.
- Nenhum logo de terceiro como se fosse parceria.
- Nenhuma avaliação, número de alunos ou resultado inventado.
- Nenhum identificador de Pixel fictício no HTML publicado.

## Marcas citadas

OpenClaw, DeepSeek Harness (DSH), ChatGPT, Claude, Gemini, Cursor, Tailscale, CasaOS, n8n, Excel, Google Sheets, LibreOffice, Meta/Facebook e demais marcas citadas pertencem aos seus respectivos titulares. A menção é descritiva; não há vínculo, patrocínio ou endosso.
