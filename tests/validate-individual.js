'use strict';
const { chromium } = require('/home/king/.nvm/versions/node/v24.21.0/lib/node_modules/openclaw/node_modules/playwright-core');
const fs = require('fs');
const BASE = process.env.IADV_TEST_URL || 'http://127.0.0.1:8093';
const CHROME = '/home/king/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const out = { generatedAt: new Date().toISOString(), base: BASE };
  const errors = [];
  const state = (p) => p.evaluate(() => ({
    index: [...document.querySelectorAll('[data-carousel-dots] button')].findIndex(b => b.getAttribute('aria-current') === 'true'),
    dots: document.querySelectorAll('[data-carousel-dots] button').length,
    transform: getComputedStyle(document.querySelector('[data-carousel-track]')).transform,
    cards: document.querySelectorAll('[data-carousel-item]').length,
    prices: [...document.querySelectorAll('.product-card__price b')].map(x => x.textContent.trim()),
  }));
  // desktop autoplay + arrows + pause on interaction
  {
    const p = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(BASE + '/index.html?v=test-individual', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    out.desktopInitial = await state(p);
    await p.waitForTimeout(4800);
    out.desktopAuto = await state(p);
    await p.locator('[data-carousel-next]').click();
    await p.waitForTimeout(700);
    out.desktopNext = await state(p);
    const beforePause = out.desktopNext.index;
    await p.locator('[data-carousel]').hover();
    await p.waitForTimeout(5000);
    out.desktopHoverPause = { before: beforePause, after: (await state(p)).index };
    await p.close();
  }
  // mobile swipe + bar hidden in section + empty checkout
  {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(BASE + '/index.html?v=test-individual-mobile', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelector('#individual').scrollIntoView({ block: 'start' }); });
    await p.waitForTimeout(400);
    out.mobileSection = await p.evaluate(() => ({
      barVisible: document.getElementById('mobile-cta').classList.contains('is-visible'),
      overflow: document.documentElement.scrollWidth - innerWidth,
      title: document.getElementById('individual-title').textContent,
      cards: document.querySelectorAll('[data-carousel-item]').length,
      dots: document.querySelectorAll('[data-carousel-dots] button').length,
    }));
    const before = await state(p);
    const box = await p.locator('[data-carousel-viewport]').boundingBox();
    if (box) {
      await p.mouse.move(box.x + box.width - 40, box.y + 160);
      await p.mouse.down();
      await p.mouse.move(box.x + 40, box.y + 160, { steps: 8 });
      await p.mouse.up();
      await p.waitForTimeout(700);
    }
    out.mobileSwipe = { before: before.index, after: (await state(p)).index };
    const scrollBefore = await p.evaluate(() => scrollY);
    await p.evaluate(() => document.querySelector('[data-carousel-item] .btn').click());
    await p.waitForTimeout(200);
    out.emptyIndividualCheckout = await p.evaluate((scrollBefore) => ({
      toast: document.getElementById('toast').textContent,
      scrollBefore,
      scrollAfter: Math.round(scrollY),
      offerTop: Math.round(document.getElementById('oferta').getBoundingClientRect().top),
    }), scrollBefore);
    await p.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });
    out.axe = await p.evaluate(async () => (await axe.run(document)).violations.map(v => v.id));
    await p.close();
  }
  // reduced motion
  {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await p.goto(BASE + '/index.html?v=test-reduce', { waitUntil: 'networkidle' });
    await p.waitForTimeout(4800);
    out.reducedMotion = await state(p);
    await p.close();
  }
  // footer, removals, no JS
  {
    const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(BASE + '/index.html?v=test-footer', { waitUntil: 'networkidle' });
    out.page = await p.evaluate(() => ({
      emailHref: document.querySelector('.footer__email')?.getAttribute('href'),
      emailText: document.querySelector('.footer__email')?.textContent.trim(),
      footerCols: document.querySelectorAll('.footer__col').length,
      copyright: document.querySelector('.footer__bottom span')?.textContent.trim(),
      about: document.querySelector('.author__copy > p:not(.eyebrow):not(.author__role)')?.textContent.trim().slice(0, 100),
      removedWarning: !/Leia antes de instalar|inspecionadas estaticamente/i.test(document.body.innerText),
      removedGuaranteeBlock: !/Sete dias para pedir reembolso|CDC, art\. 49/.test(document.body.innerText),
      noCpf: !/CPF|CNPJ|em preparação|a confirmar/i.test(document.body.innerText),
      productPrices: [...document.querySelectorAll('.product-card__price b')].map(x => x.textContent.trim()),
      buyLinks: [...document.querySelectorAll('[data-checkout]')].map(a => a.getAttribute('data-checkout')),
      carouselClass: document.querySelector('[data-carousel]').className,
    }));
    await p.close();
    const nojs = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await nojs.goto(BASE + '/index.html', { waitUntil: 'load' });
    out.noJs = await nojs.evaluate(() => ({
      cards: document.querySelectorAll('[data-carousel-item]').length,
      controlsVisible: getComputedStyle(document.querySelector('.carousel__bar')).display !== 'none',
      viewportOverflow: getComputedStyle(document.querySelector('[data-carousel-viewport]')).overflowX,
    }));
    await nojs.close();
  }
  out.errors = errors;
  fs.writeFileSync('docs/validation-individual.json', JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
