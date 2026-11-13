#!/usr/bin/env node
/**
 * IA de Verdade — build estático.
 * Uso preview:  node scripts/build.js
 * Uso produção: IADV_MODE=production IADV_SITE_URL=https://... node scripts/build.js
 * Produção falha se faltar URL, checkout, garantia, identificação legal ou políticas.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const cfg = require(path.join(root, 'src/config.js'));
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const production = process.env.IADV_MODE === 'production' || process.env.NODE_ENV === 'production';

const money = (value) => {
  const n = Number(value) || 0;
  const decimals = Math.abs(n % 1) > 0.001 ? 2 : 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let siteUrl = (process.env.IADV_SITE_URL || cfg.site.url || process.env.CF_PAGES_URL || '').trim();
if (siteUrl) siteUrl = siteUrl.replace(/\/?$/, '/');
if (siteUrl && !/^https?:\/\//i.test(siteUrl)) {
  console.error('ERRO: site.url precisa começar com https:// (ou http:// em preview).');
  process.exit(1);
}
const canonical = siteUrl;
const ogImageRaw = cfg.site.ogImage || 'assets/og-image.jpg';
const ogImage = siteUrl ? new URL(ogImageRaw, siteUrl).toString() : ogImageRaw;

const showPending = !production;
const pending = (text) => showPending ? ` <span class="pending">${esc(text)}</span>` : '';
const promoEnd = cfg.promo && cfg.promo.endsAt ? new Date(cfg.promo.endsAt) : null;
const basePromoActive = !!(cfg.promo && cfg.promo.active) && (!promoEnd || (isFinite(promoEnd.getTime()) && Date.now() < promoEnd.getTime()));
const launch = cfg.launch || {};
const launchLimit = Number(launch.limit) || 100;
const launchSold = (launch.sold === null || launch.sold === undefined || launch.sold === '') ? null : Number(launch.sold);
const launchEnd = launch.endsAt ? new Date(launch.endsAt) : null;
let launchActive = launch.active !== false;
if (launch.mode === 'date') launchActive = launchActive && !!launchEnd && isFinite(launchEnd.getTime()) && Date.now() < launchEnd.getTime();
if (launch.mode === 'quantity' && Number.isFinite(launchSold) && launchSold >= launchLimit) launchActive = false;
const promoActive = basePromoActive && launchActive;
const p = {
  collectionEffective: promoActive ? cfg.prices.collectionLaunch : cfg.prices.collectionRegular,
  collectionRegular: cfg.prices.collectionRegular,
  vol1: cfg.prices.vol1,
  vol2: cfg.prices.vol2,
  vol3: cfg.prices.vol3,
  vol4: cfg.prices.vol4,
  vol5: cfg.prices.vol5,
  vol6: cfg.prices.vol6,
  catalogIndividual: cfg.prices.catalogIndividual,
  catalogEffective: promoActive ? cfg.prices.catalogLaunch : cfg.prices.catalogRegular,
  catalogRegular: cfg.prices.catalogRegular,
};
const collectionBadge = promoActive ? 'Lote de lançamento' : 'Preço regular';
const launchBadge = collectionBadge;
let promoDate = '';
if (launchEnd && isFinite(launchEnd.getTime())) {
  try { promoDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(launchEnd); }
  catch (e) { promoDate = launchEnd.toLocaleDateString('pt-BR'); }
}
let launchLine;
if (!promoActive) launchLine = 'Preço regular: ' + money(p.collectionRegular) + '.';
else if (launch.mode === 'date' && promoDate) launchLine = 'Preço de lançamento até ' + promoDate + '. Depois, ' + money(p.collectionRegular) + '.';
else if (Number.isFinite(launchSold)) launchLine = launchSold + ' de ' + launchLimit + ' compras do lote de lançamento. Depois, ' + money(p.collectionRegular) + '.';
else launchLine = 'Preço de lançamento para as primeiras ' + launchLimit + ' compras. Depois, ' + money(p.collectionRegular) + '.';
const promoDealNote = promoActive ? 'O preço de lançamento vale enquanto esta condição estiver publicada nesta página.' : 'O preço regular está em vigor.';
const individualPrices = [p.vol1, p.vol2, p.vol3, p.vol4, p.vol5, p.vol6, p.catalogIndividual];
const canAnchor = individualPrices.every(function (v) { return Number.isFinite(Number(v)) && Number(v) > 0; });
const separateTotal = canAnchor ? individualPrices.reduce(function (a, b) { return a + Number(b); }, 0) : 0;
const anchorLine = canAnchor ? 'Comprados separadamente: ' + money(separateTotal) + '. Na coleção: ' + money(p.collectionEffective) + '.' : '';
const unitVolume = Math.round(Number(p.collectionEffective) / 6);
const unitChapter = Number((Number(p.collectionEffective) / 89).toFixed(2));
const unitLine = 'Cerca de ' + money(unitVolume) + ' por volume e ' + money(unitChapter) + ' por capítulo.';

/* Produção: falha listando tudo que falta. */
const missing = [];
if (production) {
  if (!siteUrl) missing.push('site.url / IADV_SITE_URL / CF_PAGES_URL');
  ['collection', 'vol1', 'vol2', 'vol3', 'vol4', 'vol5', 'vol6', 'catalog'].forEach(function (k) {
    if (!(cfg.checkout && cfg.checkout[k])) missing.push('checkout.' + k);
  });
  if (!(cfg.legal && cfg.legal.name)) missing.push('legal.name');
  if (!(cfg.legal && cfg.legal.email)) missing.push('legal.email');
  ['privacyUrl', 'termsUrl', 'refundUrl'].forEach(function (k) { if (!(cfg.legal && cfg.legal[k])) missing.push('legal.' + k); });
  if (missing.length) {
    console.error('ERRO: build de produção bloqueado. Faltam:');
    missing.forEach(function (m) { console.error(' - ' + m); });
    console.error('Preencha src/config.js (ou IADV_SITE_URL) ou rode em modo preview sem IADV_MODE=production.');
    process.exit(1);
  }
}

const checkoutUrl = (key) => {
  const raw = (cfg.checkout && cfg.checkout[key]) || '';
  return raw ? esc(raw) : (key === 'collection' || key === 'vol1Bump' ? '#oferta' : '#individual');
};
const deliveryNote = cfg.delivery && cfg.delivery.confirmed && cfg.delivery.description
  ? cfg.delivery.description
  : `Entrega digital pela plataforma de compra.${pending('Formato e prazo de acesso a confirmar')}.`;
const guaranteeConfirmed = !!(cfg.guarantee && cfg.guarantee.confirmed && cfg.guarantee.process);
const guaranteeProcess = guaranteeConfirmed
  ? cfg.guarantee.process
  : `Solicite o reembolso pelo canal de atendimento da plataforma onde a compra foi feita.${pending('Canal e prazo a confirmar')}.`;
const guaranteeShort = guaranteeConfirmed
  ? cfg.guarantee.process
  : `O pedido é feito pelo canal de atendimento da plataforma de compra;${pending('canal e prazo a confirmar')}.`;
const guaranteeMicro = guaranteeConfirmed ? 'Garantia de 7 dias' : 'Garantia a confirmar';

const entityType = String((cfg.legal && cfg.legal.entityType) || 'pf').toLowerCase();
let companyLine;
if (entityType === 'pj' && cfg.legal.company) {
  companyLine = cfg.legal.cnpj ? `${esc(cfg.legal.company)} · CNPJ ${esc(cfg.legal.cnpj)}` : `${esc(cfg.legal.company)}${pending('CNPJ a confirmar')}`;
} else {
  const personName = (cfg.legal && cfg.legal.name) || cfg.author.name || 'Giliarde Reis Pereira';
  const cpf = (cfg.legal && cfg.legal.cpf) ? `CPF ${esc(cfg.legal.cpf)}` : (showPending ? pending('CPF a confirmar').trim() : '');
  companyLine = cpf ? `${esc(personName)} · ${cpf}` : esc(personName);
}
const contactEmail = cfg.legal.email || cfg.author.email || '';
const contactLine = contactEmail
  ? `<a href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a>`
  : showPending ? `Atendimento${pending('canal a confirmar')}` : 'Atendimento pela plataforma de compra.';
const policyLink = (url, label) => url ? `<a href="${esc(url)}">${esc(label)}</a>` : '';
const legalLinks = [
  policyLink(cfg.legal.termsUrl, 'Termos de Uso'),
  policyLink(cfg.legal.privacyUrl, 'Política de Privacidade'),
  policyLink(cfg.legal.refundUrl, 'Política de Reembolso'),
].filter(Boolean);
const legalColumn = legalLinks.length
  ? `<div class="footer__col"><h3>Informações</h3><div class="footer__links">${legalLinks.join('')}</div></div>`
  : '';

const faqItems = [
  ['O que é a coleção IA de Verdade?', 'Uma coleção de livros digitais em português sobre IA aplicada: seis volumes — cinco de percurso e um de referência — e um catálogo de Skills com planilha. Não é curso em vídeo, mentoria ou formação certificada.'],
  ['Para quem o material foi feito?', 'Para quem já usa IA e quer aplicar de verdade, para quem programa e para quem quer um agente próprio ou um Home Lab.'],
  ['Preciso saber programar?', 'Para o Volume 1, não. Do Volume 2 em diante, os exemplos usam terminal, Git, Python/Node/PHP e Docker. Familiaridade com código ajuda.'],
  ['O que recebo na coleção completa?', 'Os seis volumes e o catálogo em PDF e EPUB, mais a planilha XLSX: 7 PDFs + 7 EPUBs + 1 planilha, 1.689 páginas no total. Entrega automática pela plataforma de checkout após a confirmação do pagamento.'],
  ['Como recebo os arquivos?', 'A entrega é automática pela plataforma de checkout. Na coleção, 7 PDFs + 7 EPUBs + 1 planilha. No Volume 1, 1 PDF + 1 EPUB. No catálogo, 1 PDF + 1 EPUB + 1 planilha.'],
  ['Posso comprar somente um volume?', 'Hoje o Volume 1 e o Catálogo têm oferta individual. Os Volumes 2 a 6 são vendidos na coleção completa; não há oferta avulsa deles nesta página.'],
  ['Onde a compra é processada?', 'A compra é processada pela Hotmart. O acesso aos arquivos é liberado após a confirmação do pagamento, no formato definido pela plataforma.'],
  ['Como funciona a garantia?', 'A compra tem garantia de 7 dias pela Hotmart. O pedido de reembolso é feito pelos canais oficiais da plataforma, conforme as regras dela.'],
  ['O conteúdo é atualizado?', 'A edição é de novembro de 2026, com informações conferidas em 1º/11/2026. Esta oferta não inclui promessa de atualização gratuita ou vitalícia.'],
];

const graph = [{
  '@type': 'Product',
  name: 'Coleção IA de Verdade',
  description: 'Seis volumes digitais sobre IA aplicada, 89 capítulos, catálogo de 1.323 skills e planilha XLSX, em PDF e EPUB.',
  brand: { '@type': 'Brand', name: 'IA de Verdade' },
  category: 'Educação',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'BRL',
    price: String(p.collectionEffective),
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Person', name: (cfg.legal && cfg.legal.name) || cfg.author.name || 'Giliarde Reis Pereira' },
  },
}];
if (canonical) { graph[0].url = canonical; graph[0].image = [ogImage]; graph[0]['@id'] = canonical + '#colecao'; }
if (cfg.checkout && cfg.checkout.collection) graph[0].offers.url = cfg.checkout.collection;
if (promoActive && promoEnd && isFinite(promoEnd.getTime())) graph[0].offers.priceValidUntil = promoEnd.toISOString().slice(0, 10);
const personNode = {
  '@type': 'Person',
  name: cfg.author.name || 'Giliarde Reis Pereira',
  jobTitle: cfg.author.role || 'Tech Lead Backend',
  url: cfg.author.linkedin || undefined,
  sameAs: cfg.author.linkedin ? [cfg.author.linkedin] : undefined,
  image: canonical ? new URL('assets/autor/giliarde.webp', canonical).toString() : undefined,
};
if (canonical) personNode['@id'] = canonical + '#autor';
graph.push(personNode);
if (canonical) graph.push({ '@type': 'WebSite', '@id': canonical + '#site', name: 'IA de Verdade', url: canonical, inLanguage: 'pt-BR', description: 'Coleção técnica de IA aplicada em português.' });
graph.push({
  '@type': 'FAQPage',
  mainEntity: faqItems.map(function (item) {
    return { '@type': 'Question', name: item[0], acceptedAnswer: { '@type': 'Answer', text: item[1] } };
  }),
});
const schema = { '@context': 'https://schema.org', '@graph': graph };

// Cabeçalho de verificação e metadados de medição.
// GA4 e Meta Pixel são carregados por src/app.js somente após o consentimento.
const tracking = cfg.tracking || {};
const analyticsHead = [
  /^[A-Za-z0-9_-]{20,60}$/.test(String(tracking.gscVerification || ''))
    ? `<meta name="google-site-verification" content="${esc(String(tracking.gscVerification))}">`
    : '<!-- Search Console pendente: preencha tracking.gscVerification -->',
].join('\n');

function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}
function minifyJs(js) {
  return js.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(function (line) { return line.trim(); }).filter(Boolean).join('\n');
}

const tokens = {
  styles: minifyCss(read('src/styles.css')),
  appJs: minifyJs(read('src/app.js')).replace(/<\/script/gi, '<\\/script'),
  structuredData: JSON.stringify(schema, null, 2),
  configJson: JSON.stringify(cfg).replace(/</g, '\\u003c'),
  canonicalTag: canonical ? `<link rel="canonical" href="${esc(canonical)}">` : '<!-- canonical pendente: configure site.url -->',
  ogUrlTag: canonical ? `<meta property="og:url" content="${esc(canonical)}">` : '<!-- og:url pendente -->',
  twitterUrlTag: canonical ? `<meta name="twitter:url" content="${esc(canonical)}">` : '<!-- twitter:url pendente -->',
  ogImageUrl: esc(ogImage),
  analyticsHead: analyticsHead,
  'price.collectionEffective': money(p.collectionEffective),
  'price.collectionRegular': money(p.collectionRegular),
  'price.vol1': money(p.vol1),
  'price.vol2': money(p.vol2),
  'price.vol3': money(p.vol3),
  'price.vol4': money(p.vol4),
  'price.vol5': money(p.vol5),
  'price.vol6': money(p.vol6),
  'price.catalogIndividual': money(p.catalogIndividual),
  'price.catalogEffective': money(p.catalogEffective),
  'price.catalogRegular': money(p.catalogRegular),
  'promo.collectionBadge': collectionBadge,
  'launch.badge': launchBadge,
  'launch.line': launchLine,
  'anchor.line': anchorLine,
  'unit.line': unitLine,
  'promo.dealNote': promoDealNote,
  'checkout.collection': checkoutUrl('collection'),
  'checkout.vol1': checkoutUrl('vol1'),
  'checkout.vol2': checkoutUrl('vol2'),
  'checkout.vol3': checkoutUrl('vol3'),
  'checkout.vol4': checkoutUrl('vol4'),
  'checkout.vol5': checkoutUrl('vol5'),
  'checkout.vol6': checkoutUrl('vol6'),
  'checkout.vol2to3': checkoutUrl('vol2to3'),
  'checkout.vol4to5': checkoutUrl('vol4to5'),
  'checkout.catalog': checkoutUrl('catalog'),
  'sample.path': esc(cfg.sample && cfg.sample.enabled ? cfg.sample.path : '#'),
  'delivery.note': deliveryNote,
  'guarantee.process': guaranteeProcess,
  'guarantee.short': guaranteeShort,
  'guarantee.micro': guaranteeMicro,
  'legal.name': esc((cfg.legal && cfg.legal.name) || cfg.author.name || 'Giliarde Reis Pereira'),
  'legal.email': esc(contactEmail),
  'legalColumn': legalColumn,
  'legal.companyLine': companyLine,
  'legal.contactLine': contactLine,
  'legal.terms': policyLink(cfg.legal.termsUrl, 'Termos de uso'),
  'legal.privacy': policyLink(cfg.legal.privacyUrl, 'Política de privacidade'),
  'legal.refund': policyLink(cfg.legal.refundUrl, 'Política de reembolso'),
  year: String(new Date().getFullYear()),
};

let html = read('src/template.html');
html = html.replace('{{styles}}', function () { return tokens.styles; });
html = html.replace('{{appJs}}', function () { return tokens.appJs; });
html = html.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, function (match, key) {
  if (!Object.prototype.hasOwnProperty.call(tokens, key)) throw new Error('Token não definido: ' + match);
  return tokens[key];
});
if (!promoActive) html = html.replace(/data-promo-only/g, 'data-promo-only hidden');
const leftover = html.match(/\{\{[^}]+\}\}/g);
if (leftover) throw new Error('Tokens não substituídos: ' + [...new Set(leftover)].join(', '));

fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');
console.log('build ok → index.html (' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB' + (production ? ' · produção' : ' · preview') + ')');
console.log('preços: coleção ' + money(p.collectionEffective) + ' · vol. 1 ' + money(p.vol1) + ' · catálogo ' + money(p.catalogEffective));
if (!canonical) console.log('aviso: canonical/OG/sitemap pendentes — defina site.url ou IADV_SITE_URL.');
if (showPending) console.log('aviso: modo preview — pendências visíveis; produção exige dados completos.');
