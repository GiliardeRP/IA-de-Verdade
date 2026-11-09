/* Validação local: links, imagens, semântica, toque, menu, FAQ, lightbox. */
'use strict';
const { chromium } = require('/home/king/.nvm/versions/node/v24.21.0/lib/node_modules/openclaw/node_modules/playwright-core');
const fs = require('fs');
const base = process.env.IADV_TEST_URL || 'http://127.0.0.1:8093';
const path = require('path');
const root = path.resolve(__dirname, '..');
const chrome = '/home/king/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
  const out = { base, generatedAt: new Date().toISOString(), viewports: {} };
  for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600 });
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) failures.push({ status: r.status(), url: r.url() }); });
    await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, document.body.scrollHeight); });
    await page.waitForTimeout(500);
    const data = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
      const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
      const anchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href'));
      const missingAnchors = [...new Set(anchors.filter(h => h.length > 1 && !document.getElementById(h.slice(1))))];
      const imgs = [...document.images].map(i => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt') })).filter(i => i.src);
      const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 70) }));
      const buttons = [...document.querySelectorAll('.btn,.menu-btn,.lightbox__nav button')].map(b => ({ text: b.textContent.trim().slice(0, 40), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) })).filter(b => b.w > 0 && b.h > 0);
      const small = [...document.querySelectorAll('body *')].filter(el => {
        const c = getComputedStyle(el); const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && c.display !== 'none' && c.visibility !== 'hidden' && el.childElementCount === 0 && el.textContent.trim() && parseFloat(c.fontSize) < 11;
      }).slice(0, 30).map(el => ({ text: el.textContent.trim().slice(0, 40), size: getComputedStyle(el).fontSize, cls: el.className }));
      const checkouts = [...document.querySelectorAll('[data-checkout]')].map(a => ({ offer: a.getAttribute('data-checkout'), href: a.getAttribute('href') }));
      const guarantee = document.body.innerText.includes('7 dias de garantia');
      const hiddenTestimonials = document.getElementById('depoimentos')?.hidden;
      return { dup, missingAnchors, imgs, headings, buttons, small, checkouts, guarantee, hiddenTestimonials, overflow: document.documentElement.scrollWidth - innerWidth };
    });
    // Mobile menu keyboard
    let menu = null;
    if (width < 600) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.click('.menu-btn');
      menu = await page.evaluate(() => ({ open: !document.getElementById('menu-mobile').hidden, expanded: document.querySelector('.menu-btn').getAttribute('aria-expanded') }));
      await page.keyboard.press('Escape');
      menu.closedWithEscape = await page.evaluate(() => document.getElementById('menu-mobile').hidden);
    }
    // FAQ and lightbox
    await page.evaluate(() => { document.querySelector('#faq details').open = true; window.scrollTo(0, 0); });
    const faq = await page.evaluate(() => document.querySelector('#faq details').open);
    const gallery = await page.$('.gallery__item');
    let lightbox = null;
    if (gallery) {
      await gallery.click();
      await page.waitForTimeout(200);
      lightbox = await page.evaluate(() => ({ open: document.getElementById('lightbox')?.open, img: document.getElementById('lightbox-img')?.naturalWidth || 0 }));
      await page.keyboard.press('Escape');
      lightbox.closed = await page.evaluate(() => !document.getElementById('lightbox')?.open);
    }
    out.viewports[label] = { errors, failures, ...data, menu, faq, lightbox };
    await page.close();
  }
  await browser.close();
  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/validation.json', JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify(out, null, 2));
})();
