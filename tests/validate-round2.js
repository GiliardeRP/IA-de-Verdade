'use strict';
const { chromium } = require('/home/king/.nvm/versions/node/v24.21.0/lib/node_modules/openclaw/node_modules/playwright-core');
const fs = require('fs');
const BASE = process.env.IADV_TEST_URL || 'http://127.0.0.1:8093';
const CHROME = '/home/king/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const widths = [320, 390, 768, 1024, 1440];
const center = (r) => (r.left + r.right) / 2;
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const out = { generatedAt: new Date().toISOString(), widths: {}, ring: {}, alignment: {}, testimonials: {}, errors: [] };

  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width < 600, hasTouch: width < 600, reducedMotion: 'reduce' });
    page.on('pageerror', e => out.errors.push(e.message));
    await page.goto(BASE + '/index.html?v=round2-test', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    out.widths[width] = await page.evaluate(() => {
      const final = document.querySelector('.final__in').getBoundingClientRect();
      const c = (final.left + final.right) / 2;
      const fchildren = [...document.querySelector('.final__in').children]
        .filter(x => getComputedStyle(x).display !== 'none')
        .map(x => { const r = x.getBoundingClientRect(); return { cls: x.className || x.tagName, delta: Math.round(((r.left + r.right) / 2 - c) * 100) / 100 }; });
      const hint = document.querySelector('.carousel__hint').getBoundingClientRect();
      const car = document.querySelector('.carousel').getBoundingClientRect();
      const cta = document.querySelector('.final__cta').getBoundingClientRect();
      return {
        height: document.documentElement.scrollHeight,
        words: document.body.innerText.trim().split(/\s+/).filter(Boolean).length,
        images: document.images.length,
        buy: document.querySelectorAll('[data-checkout]').length,
        overflow: document.documentElement.scrollWidth - innerWidth,
        small: [...document.querySelectorAll('body *')].filter(el => {
          const st = getComputedStyle(el), r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden' && el.childElementCount === 0 && el.textContent.trim() && parseFloat(st.fontSize) < 14;
        }).length,
        finalDeltas: fchildren,
        finalCtaGroupDelta: Math.round(((cta.left + cta.right) / 2 - c) * 100) / 100,
        hintDelta: Math.round(((hint.left + hint.right) / 2 - (car.left + car.right) / 2) * 100) / 100,
        ring: { class: document.querySelector('[data-hero-ring]').className, items: document.querySelectorAll('[data-ring-item]').length },
      };
    });
    out.alignment[width] = {
      maxFinalDelta: Math.max(...out.widths[width].finalDeltas.map(x => Math.abs(x.delta)), Math.abs(out.widths[width].finalCtaGroupDelta)),
      hintDelta: out.widths[width].hintDelta,
      pass: out.widths[width].finalDeltas.every(x => Math.abs(x.delta) <= 2) && Math.abs(out.widths[width].finalCtaGroupDelta) <= 2 && Math.abs(out.widths[width].hintDelta) <= 2,
    };
    await page.close();
  }

  // ring behavior at 1440
  {
    const p = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    await p.goto(BASE + '/index.html?v=round2-ring', { waitUntil: 'networkidle' });
    await p.waitForTimeout(350);
    const before = await p.evaluate(() => getComputedStyle(document.querySelector('[data-ring-item]')).transform);
    await p.waitForTimeout(800);
    const after = await p.evaluate(() => getComputedStyle(document.querySelector('[data-ring-item]')).transform);
    const box = await p.locator('[data-ring-item]').first().boundingBox();
    const w0 = box.width;
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.waitForTimeout(350);
    const hover = await p.evaluate(() => { const r = document.querySelector('[data-ring-item]').getBoundingClientRect(); return { w: r.width, y: r.top }; });
    await p.evaluate(() => window.scrollTo(0, 3000));
    await p.waitForTimeout(500);
    const paused1 = await p.evaluate(() => getComputedStyle(document.querySelector('[data-ring-item]')).transform);
    await p.waitForTimeout(700);
    const paused2 = await p.evaluate(() => getComputedStyle(document.querySelector('[data-ring-item]')).transform);
    out.ring = { animated: before !== after, hoverScale: Math.round((hover.w / w0) * 100) / 100, pausedOutOfView: paused1 === paused2 };
    await p.close();
  }

  // reduced + no JS
  {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await p.goto(BASE + '/index.html?v=round2-reduce', { waitUntil: 'networkidle' });
    out.ring.reduced = await p.evaluate(() => ({ cls: document.querySelector('[data-hero-ring]').className, visible: [...document.querySelectorAll('[data-ring-item]')].filter(x => getComputedStyle(x).display !== 'none').length, transform: getComputedStyle(document.querySelector('[data-ring-item]')).transform }));
    await p.close();
    const n = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await n.goto(BASE + '/index.html');
    out.ring.noJs = await n.evaluate(() => ({ visible: [...document.querySelectorAll('[data-ring-item]')].filter(x => getComputedStyle(x).display !== 'none').length, stage: getComputedStyle(document.querySelector('[data-ring-stage]')).display }));
    await n.close();
  }

  // testimonials fixture (only in test)
  {
    const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.route('**/index.html*', async route => {
      const res = await route.fetch();
      let body = await res.text();
      const items = JSON.parse(fs.readFileSync('tests/fixtures/testimonials.json', 'utf8'));
      body = body.replace('"testimonials":[]', '"testimonials":' + JSON.stringify(items)).replace('"testimonials":false', '"testimonials":true');
      await route.fulfill({ response: res, body, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } });
    });
    await p.goto(BASE + '/index.html?v=round2-quotes', { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    out.testimonials = await p.evaluate(() => ({
      rendered: document.querySelectorAll('.quote').length,
      controls: document.querySelectorAll('[data-quotes-prev],[data-quotes-next],[data-quotes-toggle]').length,
      hasReviewSchema: /Review|aggregateRating/.test(document.getElementById('product-schema').textContent),
    }));
    await p.close();
  }

  fs.writeFileSync('docs/validation-round2.json', JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
