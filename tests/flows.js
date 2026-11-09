const { chromium } = require('/home/king/.nvm/versions/node/v24.21.0/lib/node_modules/openclaw/node_modules/playwright-core');
const fs = require('fs');
const BASE = process.env.IADV_TEST_URL || 'http://127.0.0.1:8123';
(async () => {
  const browser = await chromium.launch({ executablePath: '/home/king/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const out = {};

  // 1. Mobile sticky bar disappears at final/footer
  {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
    await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    await p.evaluate(() => document.querySelector('.final').scrollIntoView());
    await p.waitForTimeout(500);
    const atFinal = await p.evaluate(() => document.getElementById('mobile-cta').classList.contains('is-visible'));
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(500);
    const atFooter = await p.evaluate(() => document.getElementById('mobile-cta').classList.contains('is-visible'));
    const footerVisible = await p.evaluate(() => { const r = document.querySelector('.footer').getBoundingClientRect(); return r.top < innerHeight; });
    out.mobileBar = { atFinal, atFooter, footerVisible };
    await p.close();
  }

  // 2. Consent + checkout with a routed test config
  {
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await p.route('**/index.html*', async route => {
      const res = await route.fetch();
      let body = await res.text();
      body = body.replace('"metaPixelId":""', '"metaPixelId":"123456789012345"');
      body = body.replace('"tracking":{"metaPixelId":"123456789012345","enabled":false', '"tracking":{"metaPixelId":"123456789012345","enabled":true');
      body = body.replace('"collection":""', '"collection":"https://example.com/checkout?x=1"');
      await route.fulfill({ response: res, body, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } });
    });
    await p.route('**/example.com/**', route => route.fulfill({ status: 200, body: 'checkout ok', contentType: 'text/html' }));
    await p.route('**/connect.facebook.net/**', route => route.fulfill({ status: 200, body: '', contentType: 'application/javascript' }));
    await p.goto(BASE + '/index.html?utm_source=teste&utm_campaign=fluxo', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1800);
    const bannerShown = await p.evaluate(() => !document.getElementById('consent').hidden);
    await p.click('[data-consent="accept"]');
    await p.waitForTimeout(800);
    const consentStored = await p.evaluate(() => JSON.parse(localStorage.getItem('iadv_consent_v1') || 'null'));
    const fbqExists = await p.evaluate(() => typeof window.fbq);
    const bannerHidden = await p.evaluate(() => document.getElementById('consent').hidden);
    await p.click('.hero__cta a[data-checkout="collection"]');
    await p.waitForTimeout(900);
    const url = p.url();
    out.consent = { bannerShown, bannerHidden, consentStored, fbqExists, checkoutUrl: url };
    await p.close();
  }

  // 3. No-pixel version: no banner, toast on cookie prefs
  {
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1600);
    const banner = await p.evaluate(() => !document.getElementById('consent').hidden);
    await p.click('[data-open-consent]');
    await p.waitForTimeout(200);
    const toast = await p.evaluate(() => document.getElementById('toast').textContent);
    out.noPixel = { banner, toast };
    await p.close();
  }

  await browser.close();
  fs.writeFileSync('tests/flows-output.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})();
