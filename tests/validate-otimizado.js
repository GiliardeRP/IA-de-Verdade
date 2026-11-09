'use strict';
const { chromium } = require('/home/king/.nvm/versions/node/v24.21.0/lib/node_modules/openclaw/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');
const base = process.env.IADV_TEST_URL || 'http://127.0.0.1:8093';
const chrome = '/home/king/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
  const result = { base, generatedAt: new Date().toISOString(), viewports: {} };
  for (const [w, h] of [[320, 740], [360, 800], [390, 844], [768, 1024], [1024, 900], [1440, 1000]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600, reducedMotion: 'reduce' });
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) failures.push({ status: r.status(), url: r.url() }); });
    await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const firstFold = await page.evaluate(() => [...document.images].filter(i => { const r = i.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }).length);
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, document.body.scrollHeight); });
    await page.waitForTimeout(400);
    const data = await page.evaluate((firstFoldArg) => {
      const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
      const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
      const anchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href'));
      const missingAnchors = [...new Set(anchors.filter(a => a.length > 1 && !document.getElementById(a.slice(1))))];
      const imgs = [...document.images].filter(i => i.getAttribute('src')).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, loaded: i.complete && i.naturalWidth > 0 }));
      const small = [...document.querySelectorAll('body *')].filter(el => {
        const c = getComputedStyle(el), r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && c.display !== 'none' && c.visibility !== 'hidden' && el.childElementCount === 0 && el.textContent.trim() && parseFloat(c.fontSize) < 14;
      }).map(el => ({ text: el.textContent.trim().slice(0, 50), size: getComputedStyle(el).fontSize, cls: typeof el.className === 'string' ? el.className : '' }));
      const buttons = [...document.querySelectorAll('.btn,button')].filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map(b => ({ text: b.textContent.trim().slice(0, 40), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) }));
      const schema = JSON.parse(document.getElementById('product-schema').textContent);
      return {
        height: document.documentElement.scrollHeight,
        words: document.body.innerText.trim().split(/\s+/).filter(Boolean).length,
        sections: document.querySelectorAll('main>section').length,
        images: imgs.length, firstFold: firstFoldArg, imageList: imgs,
        buyButtons: document.querySelectorAll('[data-checkout]').length,
        buttonsSmall: buttons.filter(b => b.h < 44),
        small, overflow: document.documentElement.scrollWidth - innerWidth,
        dup, missingAnchors, h1: document.querySelectorAll('h1').length,
        schemaTypes: schema['@graph'].map(x => x['@type']),
        faqCount: (schema['@graph'].find(x => x['@type'] === 'FAQPage') || { mainEntity: [] }).mainEntity.length,
        testimonials: !!document.getElementById('depoimentos'),
      };
    }, firstFold);
    data.imagesBad = data.imageList.filter(i => !i.alt || !fs.existsSync(path.join(process.cwd(), new URL(i.src).pathname))).length;
    delete data.imageList;
    result.viewports[w] = { errors, failures, ...data };
    await page.close();
  }
  // axe + interações em 390
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await m.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });
  result.axe = await m.evaluate(async () => { const r = await axe.run(document); return r.violations.map(v => v.id); });
  await m.click('.menu-btn');
  result.menu = { open: await m.evaluate(() => !document.getElementById('menu-mobile').hidden) };
  await m.keyboard.press('Escape');
  result.menu.closed = await m.evaluate(() => document.getElementById('menu-mobile').hidden);
  const firstGallery = await m.$('.gallery__item');
  if (firstGallery) { await firstGallery.click(); result.lightbox = await m.evaluate(() => ({ open: document.getElementById('lightbox').open, img: document.getElementById('lightbox-img').naturalWidth })); await m.keyboard.press('Escape'); result.lightbox.closed = await m.evaluate(() => !document.getElementById('lightbox').open); }
  await m.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
  await m.click('.hero__cta a[data-checkout]');
  await m.waitForTimeout(250);
  result.checkoutEmpty = { scrolled: await m.evaluate(() => scrollY > 400), toast: await m.evaluate(() => document.getElementById('toast').textContent.slice(0, 60)) };
  await m.close();
  // sem JS
  const nojs = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  await nojs.goto(base + '/index.html', { waitUntil: 'load' });
  result.noJs = await nojs.evaluate(() => ({ h1: !!document.querySelector('h1'), price: document.querySelector('.deal__price b')?.textContent.trim(), cards: document.querySelectorAll('.volume-card').length, opacity: getComputedStyle(document.querySelector('.volume-card')).opacity }));
  await nojs.close();
  await browser.close();
  fs.writeFileSync('docs/validation-otimizado.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
})();
