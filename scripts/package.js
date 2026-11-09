#!/usr/bin/env node
/** Cria dist/ com index.html, assets, robots, sitemap (se URL), llms e headers. */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cfg = require(path.join(root, 'src/config.js'));
let siteUrl = (process.env.IADV_SITE_URL || cfg.site.url || process.env.CF_PAGES_URL || '').trim();
if (siteUrl) siteUrl = siteUrl.replace(/\/?$/, '/');
const today = new Date().toISOString().slice(0, 10);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, 'index.html'));
fs.writeFileSync(path.join(dist, '.nojekyll'), '', 'utf8');
fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true, filter: (src) => !src.includes('source-serif-4') });

fs.writeFileSync(path.join(dist, 'robots.txt'), [
  'User-agent: *', 'Allow: /',
  ...(siteUrl ? ['', 'Sitemap: ' + siteUrl + 'sitemap.xml'] : []), '',
].join('\n'), 'utf8');

if (siteUrl) {
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    '    <loc>' + siteUrl + '</loc>',
    '    <lastmod>' + today + '</lastmod>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '</urlset>', '',
  ].join('\n'), 'utf8');
} else {
  console.log('aviso: sitemap.xml não gerado — configure site.url ou IADV_SITE_URL.');
}

const price = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
fs.writeFileSync(path.join(dist, 'llms.txt'), [
  '# IA de Verdade',
  '',
  '> Coleção técnica em português sobre IA aplicada: seis volumes, 89 capítulos, catálogo de 1.323 skills e planilha XLSX. Do primeiro prompt ao próprio servidor.',
  '',
  '## O que inclui',
  '- 6 volumes: 1 Entendendo e usando IA; 2 Construindo software com IA; 3 Agentes, automações e IA aplicada; 4 Manuais OpenClaw e DSH; 5 Controle remoto e Home Lab; 6 Volume de Referência.',
  '- Catálogo de Skills em PDF (166 páginas) + planilha XLSX com 1.323 skills e 20 colunas.',
  '- 7 PDFs + 7 EPUBs + 1 planilha; 1.689 páginas no conjunto.',
  '',
  '## Preços',
  '- Coleção completa: ' + price(cfg.prices.collectionLaunch) + ' (lançamento) / ' + price(cfg.prices.collectionRegular) + ' (regular).',
  '- Volume 1: ' + price(cfg.prices.vol1) + '.',
  '- Volume 2: ' + price(cfg.prices.vol2) + '; Volume 3: ' + price(cfg.prices.vol3) + '; Volume 4: ' + price(cfg.prices.vol4) + '; Volume 5: ' + price(cfg.prices.vol5) + '; Volume 6: ' + price(cfg.prices.vol6) + '.',
  '- Catálogo: ' + price(cfg.prices.catalogIndividual) + ' individual; coleção: ' + price(cfg.prices.collectionLaunch) + '.',
  '',
  '## Página',
  siteUrl ? siteUrl : '(URL pública a confirmar)',
  '',
].join('\n'), 'utf8');

fs.writeFileSync(path.join(dist, '_headers'), [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  X-Frame-Options: SAMEORIGIN',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  '  Strict-Transport-Security: max-age=31536000',
  '',
  '/index.html',
  '  Cache-Control: public, max-age=0, must-revalidate',
  '',
  '/assets/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/robots.txt',
  '  Cache-Control: public, max-age=3600',
  '',
  '/sitemap.xml',
  '  Cache-Control: public, max-age=3600',
  '',
].join('\n'), 'utf8');

fs.writeFileSync(path.join(dist, 'LEIA-ME.txt'), [
  'IA de Verdade — pacote de publicação',
  '',
  'Publique o conteúdo desta pasta na raiz do domínio.',
  'Cloudflare Pages: envie esta pasta como Direct Upload ou use',
  '  npx wrangler pages deploy dist --project-name=SEU-PROJETO',
  '',
  'Para gerar com dados completos:',
  '  IADV_MODE=production IADV_SITE_URL=https://seu-dominio/ npm run build',
  '',
  'Produção falha se faltar URL, checkout, garantia, identificação legal ou políticas.',
  'Antes de publicar: docs/CHECKLIST-PUBLICACAO.md',
  '',
].join('\n'), 'utf8');

function size(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((sum, entry) => {
    const p = path.join(dir, entry.name);
    return sum + (entry.isDirectory() ? size(p) : fs.statSync(p).size);
  }, 0);
}
console.log('dist/ pronto: ' + (size(dist) / 1024 / 1024).toFixed(1) + ' MB' + (siteUrl ? ' · sitemap ok' : ' · sem sitemap'));
