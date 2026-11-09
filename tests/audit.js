const { chromium } = require('/home/king/.nvm/versions/node/v24.21.0/lib/node_modules/openclaw/node_modules/playwright-core');
const fs = require('fs');
const BASE = process.env.IADV_TEST_URL || 'http://127.0.0.1:8123';

(async () => {
  const browser = await chromium.launch({ executablePath: '/home/king/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const results = {};
  for (const [name, width, height] of [['desktop',1440,1000],['tablet',834,1112],['mobile',390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [], warnings = [], failed = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); if (m.type() === 'warning') warnings.push(m.text()); });
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    page.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure()||{}).errorText));
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      scrollH: document.documentElement.scrollHeight,
      volumes: document.querySelectorAll('.volume').length,
      gallery: document.querySelectorAll('.gallery__item').length,
      faqs: document.querySelectorAll('.faq details').length,
      imgs: [...document.images].map(i => ({ src: i.getAttribute('src'), w: i.naturalWidth, h: i.naturalHeight })).filter(i => !i.w),
      prices: [...document.querySelectorAll('[data-price]')].slice(0,6).map(e => e.textContent),
      h1: document.querySelector('h1')?.textContent.trim(),
      title: document.title,
      stickyInert: document.getElementById('mobile-cta').hasAttribute('inert'),
      schema: !!document.getElementById('product-schema')
    }));
    if (name === 'desktop') {
      for (const id of ['problema','colecao','volumes','catalogo','demonstracao','guia','para-quem','autor','oferta','garantia','faq']) {
        const loc = page.locator('#' + id);
        if (await loc.count()) await loc.screenshot({ path: 'tests/screenshots/sec-' + id + '.png' });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'tests/screenshots/desktop-full.png', fullPage: true });
      await page.screenshot({ path: 'tests/screenshots/desktop-fold.png' });
      // interactions
      await page.click('.faq details:nth-of-type(1) summary');
      const faqOpen = await page.evaluate(() => document.querySelector('.faq details').open);
      await page.click('.gallery__item');
      await page.waitForTimeout(400);
      const dialogOpen = await page.evaluate(() => document.getElementById('lightbox').open);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const dialogClosed = await page.evaluate(() => !document.getElementById('lightbox').open);
      await page.click('a.btn[data-checkout="collection"]');
      await page.waitForTimeout(300);
      const toastVisible = await page.evaluate(() => document.getElementById('toast').classList.contains('is-visible'));
      const toastText = await page.evaluate(() => document.getElementById('toast').textContent);
      results.interactions = { faqOpen, dialogOpen, dialogClosed, toastVisible, toastText };
      await page.locator('#oferta').screenshot({ path: 'tests/screenshots/desktop-oferta.png' });
    }
    if (name === 'mobile') {
      await page.screenshot({ path: 'tests/screenshots/mobile-full.png', fullPage: true });
      await page.screenshot({ path: 'tests/screenshots/mobile-fold.png' });
      await page.evaluate(() => window.scrollTo(0, 1400));
      await page.waitForTimeout(500);
      const stickyVisible = await page.evaluate(() => document.getElementById('mobile-cta').classList.contains('is-visible'));
      await page.screenshot({ path: 'tests/screenshots/mobile-sticky.png' });
      await page.click('.menu-btn');
      const menuOpen = await page.evaluate(() => !document.getElementById('menu-mobile').hidden);
      results.mobile = { stickyVisible, menuOpen };
      await page.screenshot({ path: 'tests/screenshots/mobile-menu.png' });
    }
    if (name === 'tablet') {
      await page.screenshot({ path: 'tests/screenshots/tablet-full.png', fullPage: true });
    }
    results[name] = { metrics, errors, warnings, failed };
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('tests/audit-output.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
