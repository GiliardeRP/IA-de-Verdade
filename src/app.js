/* ============================================================
   IA de Verdade — comportamento enxuto
   Depende de window.IADV_CONFIG (gerado a partir de src/config.js)
   ============================================================ */
(function () {
  'use strict';

  var cfg = window.IADV_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }

  function money(value) {
    var n = Number(value) || 0;
    var decimals = Math.abs(n % 1) > 0.001 ? 2 : 0;
    try {
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    } catch (e) {
      return 'R$ ' + n.toFixed(decimals).replace('.', ',');
    }
  }

  function promoIsActive() {
    if (!cfg.promo || !cfg.promo.active) return false;
    if (cfg.promo.endsAt) {
      var end = new Date(cfg.promo.endsAt).getTime();
      if (!isFinite(end) || Date.now() >= end) return false;
    }
    var launch = cfg.launch || {};
    if (launch.active === false) return false;
    if (launch.mode === 'date') {
      var lEnd = launch.endsAt ? new Date(launch.endsAt).getTime() : NaN;
      if (!isFinite(lEnd) || Date.now() >= lEnd) return false;
    }
    if (launch.mode === 'quantity' && launch.sold !== null && launch.sold !== undefined && launch.sold !== '') {
      var sold = Number(launch.sold), limit = Number(launch.limit) || 100;
      if (isFinite(sold) && sold >= limit) return false;
    }
    return true;
  }

  function prices() {
    var active = promoIsActive();
    return {
      active: active,
      collectionEffective: active ? cfg.prices.collectionLaunch : cfg.prices.collectionRegular,
      collectionRegular: cfg.prices.collectionRegular,
      vol1: cfg.prices.vol1,
      vol2: cfg.prices.vol2,
      vol3: cfg.prices.vol3,
      vol4: cfg.prices.vol4,
      vol5: cfg.prices.vol5,
      vol6: cfg.prices.vol6,
      catalogIndividual: cfg.prices.catalogIndividual,
      catalogEffective: active ? cfg.prices.catalogLaunch : cfg.prices.catalogRegular,
      catalogRegular: cfg.prices.catalogRegular,
      bump: cfg.prices.bump
    };
  }

  function applyPrices() {
    var p = prices();
    var map = {
      collectionEffective: p.collectionEffective,
      collectionRegular: p.collectionRegular,
      vol1: p.vol1,
      vol2: p.vol2,
      vol3: p.vol3,
      vol4: p.vol4,
      vol5: p.vol5,
      vol6: p.vol6,
      catalogIndividual: p.catalogIndividual,
      catalogEffective: p.catalogEffective,
      catalogRegular: p.catalogRegular,
      bump: p.bump
    };
    $$('[data-price]').forEach(function (el) {
      var key = el.getAttribute('data-price');
      if (Object.prototype.hasOwnProperty.call(map, key)) el.textContent = money(map[key]);
    });
    $$('[data-promo-only]').forEach(function (el) { el.hidden = !p.active; });
    var badge = $('.deal__badge');
    if (badge) badge.textContent = p.active ? 'Condição de lançamento' : 'Preço regular';
    var savings = $('[data-savings]');
    if (savings) {
      var diff = p.collectionRegular - p.collectionEffective;
      savings.textContent = money(diff);
      var wrap = savings.closest('.deal__save');
      if (wrap) wrap.hidden = !p.active || diff <= 0;
    }
    var note = $('[data-promo-deal-note]');
    if (note) note.textContent = p.active ? 'O preço de lançamento vale enquanto esta condição estiver publicada nesta página.' : 'O preço regular está em vigor.';
    updateSchema(p);
  }

  function updateSchema(p) {
    var script = document.getElementById('product-schema');
    if (!script) return;
    try {
      var data = JSON.parse(script.textContent);
      function walk(node) {
        if (!node || typeof node !== 'object') return;
        if (node.offers) {
          var offers = Array.isArray(node.offers) ? node.offers : [node.offers];
          offers.forEach(function (o) { if (o && o.price) o.price = String(p.collectionEffective); });
        }
        if (Array.isArray(node['@graph'])) node['@graph'].forEach(walk);
      }
      walk(data);
      script.textContent = JSON.stringify(data);
    } catch (e) { /* schema inválido: não quebra a página */ }
  }

  /* ---------------- UTMs ---------------- */
  var TRACK_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'src', 'sck', 'ref'];
  var ATTR_KEY = 'iadv_attr_v1';
  function readParams() {
    var out = {};
    try {
      var sp = new URLSearchParams(window.location.search);
      TRACK_KEYS.forEach(function (k) { if (sp.get(k)) out[k] = sp.get(k); });
    } catch (e) { /* navegador antigo */ }
    return out;
  }
  function trackStore() {
    try { var raw = sessionStorage.getItem(ATTR_KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  }
  function saveStore(data) { try { sessionStorage.setItem(ATTR_KEY, JSON.stringify(data)); } catch (e) { /* privado */ } }
  function captureAttribution() {
    var current = readParams();
    if (!Object.keys(current).length) return;
    var store = trackStore();
    var first = store.first || {}, last = store.last || {};
    Object.keys(current).forEach(function (k) { if (!first[k]) first[k] = current[k]; last[k] = current[k]; });
    saveStore({ first: first, last: last, ts: Date.now() });
  }
  function checkoutUrl(offer) {
    var raw = '';
    if (offer === 'collection') raw = cfg.checkout.collection;
    else if (offer === 'vol1') raw = cfg.checkout.vol1;
    else if (offer === 'vol1Bump') raw = cfg.checkout.vol1Bump || cfg.checkout.vol1;
    else if (offer === 'catalog') raw = cfg.checkout.catalog;
    else if (offer === 'vol2to3') raw = cfg.checkout.vol2to3;
    else if (offer === 'vol4to5') raw = cfg.checkout.vol4to5;
    else if (/^vol[2-6]$/.test(offer)) raw = cfg.checkout[offer];
    if (!raw || raw === '#') return '';
    var url;
    try { url = new URL(raw, location.href); } catch (e) { return ''; }
    if (!/^https?:$/.test(url.protocol)) return '';
    var store = trackStore(), first = store.first || {}, last = store.last || {}, current = readParams();
    var merged = {};
    Object.keys(first).forEach(function (k) { merged[k] = first[k]; });
    Object.keys(last).forEach(function (k) { merged[k] = last[k]; });
    Object.keys(current).forEach(function (k) { merged[k] = current[k]; });
    Object.keys(merged).forEach(function (k) { url.searchParams.set(k, merged[k]); });
    return url.toString();
  }

  /* ---------------- Consentimento / Pixel ---------------- */
  var CONSENT_KEY = 'iadv_consent_v1';
  var consentEl = document.getElementById('consent');
  var pixelReady = false, gaReady = false, offerViewed = false;
  function trackingCfg() { return cfg.tracking || {}; }
  function pixelConfigured() {
    return !!(trackingCfg().enabled && /^\d{6,20}$/.test(String(trackingCfg().metaPixelId || '')));
  }
  function gaConfigured() {
    return !!(trackingCfg().enabled && /^G-[A-Z0-9]{6,20}$/i.test(String(trackingCfg().ga4Id || '')));
  }
  function trackingConfigured() { return pixelConfigured() || gaConfigured(); }
  function getConsent() {
    try { var raw = localStorage.getItem(CONSENT_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function setConsent(marketing) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ marketing: !!marketing, ts: Date.now() })); } catch (e) { /* privado */ }
  }
  function marketingConsent() { var c = getConsent(); return !!(c && c.marketing); }
  function showConsent() {
    if (!consentEl) return;
    if (!trackingConfigured()) {
      toast('Medição desativada', 'Esta versão não carrega Meta Pixel nem Analytics. Apenas o armazenamento essencial é usado.');
      return;
    }
    consentEl.hidden = false;
    var first = consentEl.querySelector('[data-consent="accept"]');
    if (first) first.focus();
  }
  function hideConsent() { if (consentEl) consentEl.hidden = true; }
  function initPixel() {
    if (pixelReady || !pixelConfigured() || !marketingConsent()) return;
    var id = String(cfg.tracking.metaPixelId);
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', id);
    window.fbq('track', 'PageView');
    pixelReady = true;
    if (offerViewed) trackEvent('ViewContent', viewContentParams());
  }
  function initAnalytics() {
    if (gaReady || !gaConfigured() || !marketingConsent()) return;
    var id = String(trackingCfg().ga4Id).trim();
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
    gaReady = true;
  }
  function initTracking() { initPixel(); initAnalytics(); }
  function trackEvent(name, params, eventId) {
    var payload = params || {};
    payload.currency = cfg.tracking.currency || 'BRL';
    if (gaReady && window.gtag) window.gtag('event', name, payload);
    if (!pixelReady || !window.fbq || !marketingConsent()) return;
    if (eventId) window.fbq('track', name, payload, { eventID: eventId });
    else window.fbq('track', name, payload);
  }
  function viewContentParams() {
    return { content_name: 'Coleção IA de Verdade', content_type: 'product', content_ids: ['colecao-completa'], value: prices().collectionEffective, currency: 'BRL' };
  }
  if (consentEl) {
    consentEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var accept = btn.getAttribute('data-consent') === 'accept';
      setConsent(accept);
      hideConsent();
      if (accept) initTracking();
    });
  }
  $$('[data-open-consent]').forEach(function (b) { b.addEventListener('click', showConsent); });

  /* ---------------- Oferta / checkout ---------------- */
  var offerSection = document.getElementById('oferta');
  var OFFER_INFO = {
    collection: { name: 'Coleção completa', ids: ['colecao-completa'] },
    vol1: { name: 'Volume 1 — Entendendo e usando IA', ids: ['volume-1'] },
    vol2: { name: 'Volume 2 — Construindo software com IA', ids: ['volume-2'] },
    vol3: { name: 'Volume 3 — Agentes, automações e IA aplicada', ids: ['volume-3'] },
    vol4: { name: 'Volume 4 — Manuais do OpenClaw e do DSH', ids: ['volume-4'] },
    vol5: { name: 'Volume 5 — Controle remoto e Home Lab', ids: ['volume-5'] },
    vol6: { name: 'Volume 6 — Referência', ids: ['volume-6'] },
    vol2to3: { name: 'Volumes 2 e 3', ids: ['volume-2', 'volume-3'] },
    vol4to5: { name: 'Volumes 4 e 5', ids: ['volume-4', 'volume-5'] },
    catalog: { name: 'Catálogo digital de Skills', ids: ['catalogo-skills'] }
  };
  function offerValue(offer) {
    var p = prices();
    if (offer === 'collection') return p.collectionEffective;
    if (offer === 'catalog') return p.catalogIndividual;
    if (offer === 'vol2to3') return Number(p.vol2) + Number(p.vol3);
    if (offer === 'vol4to5') return Number(p.vol4) + Number(p.vol5);
    if (/^vol[2-6]$/.test(offer)) return p[offer];
    return p.vol1;
  }
  function handleCheckout(e) {
    var link = e.target.closest('a[data-checkout]');
    if (!link) return;
    var offer = link.getAttribute('data-checkout');
    var url = checkoutUrl(offer);
    if (!url) {
      e.preventDefault();
      var individual = !!link.closest('#individual');
      var rect = offerSection ? offerSection.getBoundingClientRect() : null;
      var atOffer = rect && rect.top < innerHeight * .7 && rect.bottom > innerHeight * .25;
      if (!individual && !atOffer && offerSection) offerSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      var itemName = (OFFER_INFO[offer] || {}).name || 'este produto';
      toast('Checkout em configuração', individual ? 'O link individual de ' + itemName + ' ainda não foi configurado. Nenhum produto foi direcionado para outro checkout.' : 'O link de compra ainda não foi publicado. A página está em modo de prévia.');
      return;
    }
    e.preventDefault();
    var info = OFFER_INFO[offer] || OFFER_INFO.collection;
    trackEvent('InitiateCheckout', { content_name: info.name, content_type: 'product', content_ids: info.ids, value: offerValue(offer), num_items: 1 }, 'ic_' + Date.now());
    link.classList.add('is-loading');
    link.setAttribute('aria-busy', 'true');
    setTimeout(function () { location.href = url; }, 150);
  }
  document.addEventListener('click', handleCheckout);
  if (offerSection) {
    var offerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !offerViewed) { offerViewed = true; trackEvent('ViewContent', viewContentParams()); }
        syncMobileCta();
      });
    }, { threshold: .15 });
    offerObserver.observe(offerSection);
  }

  /* ---------------- Header / menu ---------------- */
  var header = $('.header');
  var progress = $('.scroll-progress i');
  var journey = $('[data-journey]');
  var menuBtn = $('.menu-btn'), mobileMenu = document.getElementById('menu-mobile');
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = mobileMenu.hidden;
      mobileMenu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    mobileMenu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    addEventListener('resize', function () { if (innerWidth > 1024) closeMenu(); });
  }

  /* ---------------- CTA mobile ---------------- */
  var mobileCta = document.getElementById('mobile-cta');
  var finalSection = $('.final'), footerSection = $('.footer'), individualSection = document.getElementById('individual');
  function syncMobileCta() {
    if (!mobileCta) return;
    var show = innerWidth <= 760 && scrollY > Math.max(560, (innerHeight * .7)) && !menuOpen() && !consentOpen() && !inView(offerSection) && !inView(individualSection) && !inView(finalSection) && !inView(footerSection);
    mobileCta.classList.toggle('is-visible', show);
    mobileCta.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) mobileCta.removeAttribute('inert'); else mobileCta.setAttribute('inert', '');
  }
  function menuOpen() { return !!(mobileMenu && !mobileMenu.hidden); }
  function consentOpen() { return !!(consentEl && !consentEl.hidden); }
  function inView(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    return r.top < innerHeight * .85 && r.bottom > innerHeight * .1;
  }

  /* ---------------- Progresso, jornada e scroll ---------------- */
  function setJourneyProgress() {
    if (!journey) return;
    var r = journey.getBoundingClientRect();
    var total = r.height + innerHeight * .35;
    var raw = (innerHeight * .65 - r.top) / total;
    var pct = Math.max(0, Math.min(1, raw));
    journey.style.setProperty('--journey-progress', pct.toFixed(4));
    $$('.journey__step', journey).forEach(function (step, i) {
      step.classList.toggle('is-lit', pct >= (i + 0.2) / 6);
    });
  }
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', scrollY > 10);
    if (progress) {
      var max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0) + ')';
    }
    setJourneyProgress();
    syncMobileCta();
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', syncMobileCta);

  /* ---------------- Reveal + contadores ---------------- */
  var revealEls = $$('[data-reveal]');
  var countEls = $$('[data-count]');
  function formatCount(n) { return Number(n).toLocaleString('pt-BR'); }
  function animateCount(el) {
    var target = Number(el.getAttribute('data-count')) || 0;
    if (reduceMotion) { el.textContent = formatCount(target); return; }
    var start = performance.now(), dur = 700;
    function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatCount(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (revealEls.length) {
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          ro.unobserve(entry.target);
        });
      }, { threshold: .1, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(function (el) { ro.observe(el); });
    }
    setTimeout(function () { revealEls.forEach(function (el) { el.classList.add('is-in'); }); }, 1500);
  }
  if (countEls.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      countEls.forEach(function (el) { el.textContent = formatCount(el.getAttribute('data-count')); });
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          co.unobserve(entry.target);
        });
      }, { threshold: .6 });
      countEls.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---------------- Navegação ativa ---------------- */
  var navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) map[sec.id] = a;
    });
    var no = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var active = map[entry.target.id];
        if (active) { active.classList.add('is-active'); active.setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { no.observe(document.getElementById(id)); });
  }

  /* ---------------- Volumes: detalhes abertos no desktop ---------------- */
  var volumeDetails = $$('.volume-build');
  var desktopMq = window.matchMedia('(min-width: 761px)');
  function syncVolumeDetails() {
    volumeDetails.forEach(function (d) { d.open = desktopMq.matches; });
  }
  syncVolumeDetails();
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', syncVolumeDetails);
  else if (desktopMq.addListener) desktopMq.addListener(syncVolumeDetails);



  /* ---------------- Anel 3D de capas no hero ---------------- */
  function initHeroRing() {
    var ring = document.querySelector('[data-hero-ring]');
    if (!ring) return;
    var stage = ring.querySelector('[data-ring-stage]');
    var items = $$('[data-ring-item]', ring);
    if (!stage || items.length < 2) return;
    var reduce = false;
    try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }
    if (reduce) { ring.classList.add('is-static'); return; }
    ring.classList.add('is-ring');
    var W = 0, H = 0, Rx = 260, Ry = 52, raf = 0, last = 0, rotation = 0, dragOffset = 0, inertia = 0;
    var dragging = false, startX = 0, startOffset = 0, moved = 0, suppress = false, pressedIndex = -1, captured = false;
    var hover = items.map(function () { return 0; });
    var lift = items.map(function () { return 0; });
    var touchTimer = 0, touchIndex = -1;
    var visible = true, paused = false;
    var speed = (Math.PI * 2) / 52; // uma volta em ~52 s

    function measure() {
      W = stage.clientWidth || 420;
      H = stage.clientHeight || 420;
      Rx = innerWidth < 760 ? Math.min(125, W * 0.34) : Math.min(310, W * 0.60);
      Ry = innerWidth < 760 ? 52 : 100;
    }
    function paint(now) {
      if (!raf) return;
      if (paused || !visible || document.hidden) { raf = requestAnimationFrame(paint); return; }
      var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      if (!dragging) {
        rotation += dt * speed;
        if (inertia) {
          rotation += inertia;
          inertia *= 0.92;
          if (Math.abs(inertia) < 0.00005) inertia = 0;
        }
      }
      for (var i = 0; i < items.length; i++) {
        var target = hover[i];
        lift[i] += (target - lift[i]) * 0.16;
        var theta = (i * (Math.PI * 2 / items.length)) + rotation + dragOffset;
        var depth = (Math.cos(theta) + 1) / 2;
        var x = Rx * Math.sin(theta);
        var y = -Ry * (1 - depth) - lift[i] * 8;
        var scale = 0.62 + 0.38 * depth + lift[i] * 0.2;
        var alpha = Math.min(1, 0.45 + 0.55 * depth + lift[i] * 0.3);
        var z = Math.round(depth * 100) + Math.round(lift[i] * 60);
        var el = items[i];
        el.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')';
        el.style.opacity = alpha.toFixed(3);
        el.style.zIndex = String(z);
        el.style.filter = 'brightness(' + (0.7 + 0.3 * depth).toFixed(2) + ')';
      }
      raf = requestAnimationFrame(paint);
    }
    function start() {
      if (raf || ring.classList.contains('is-static')) return;
      last = performance.now();
      raf = requestAnimationFrame(paint);
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
    function setFront(i, on) {
      hover[i] = on ? 1 : 0;
      if (on) {
        clearTimeout(touchTimer);
        touchTimer = setTimeout(function () { hover[i] = 0; touchIndex = -1; }, 3200);
      }
    }
    items.forEach(function (el, i) {
      el.addEventListener('mouseenter', function () { hover[i] = 1; });
      el.addEventListener('mouseleave', function () { if (touchIndex !== i) hover[i] = 0; });
      el.addEventListener('focus', function () { hover[i] = 1; });
      el.addEventListener('blur', function () { if (touchIndex !== i) hover[i] = 0; });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { hover[i] = 1; }
      });
    });
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = 0; suppress = false;
      startX = e.clientX; startOffset = dragOffset;
      stage.classList.add('is-dragging');
      pressedIndex = items.indexOf(e.target.closest('[data-ring-item]'));
      captured = false;
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = 1;
      if (moved) {
        dragOffset = startOffset + dx * 0.008;
        inertia = 0;
        if (!captured) {
          try { stage.setPointerCapture(e.pointerId); captured = true; } catch (err) { /* sem captura */ }
        }
      }
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 8) suppress = true;
      if (moved) inertia = dx * 0.00045;
      setTimeout(function () { suppress = false; }, 80);
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', function () { dragging = false; stage.classList.remove('is-dragging'); });
    stage.addEventListener('click', function (e) {
      if (suppress) { e.preventDefault(); e.stopPropagation(); return; }
      var link = e.target.closest('[data-ring-item]');
      if (!link) return;
      var i = items.indexOf(link);
      if (i < 0) return;
      if (matchMedia('(hover:none)').matches && touchIndex !== i) {
        e.preventDefault();
        touchIndex = i;
        setFront(i, true);
      }
    });
    addEventListener('resize', measure);
    if (window.ResizeObserver) { new ResizeObserver(measure).observe(stage); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.01 }).observe(ring);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    measure();
    start();
  }
  initHeroRing();

  /* ---------------- Carrossel de produtos individuais ---------------- */
  function initCarousel(root) {
    var viewport = root.querySelector('[data-carousel-viewport]');
    var track = root.querySelector('[data-carousel-track]');
    var cards = $$('[data-carousel-item]', root);
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var dots = root.querySelector('[data-carousel-dots]');
    var status = root.querySelector('[data-carousel-status]');
    if (!viewport || !track || !cards.length) return;
    var index = 0, timer = null, resumeTimer = null, hovering = false, focusInside = false;
    var startX = 0, startY = 0, dragging = false, captured = false, suppressClick = false;
    var reduce = false;
    try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }

    function gap() {
      var g = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap);
      return isFinite(g) ? g : 16;
    }
    function visibleCount() {
      var cw = cards[0].getBoundingClientRect().width;
      if (!cw) return 1;
      return Math.max(1, Math.round((viewport.clientWidth + gap()) / (cw + gap())));
    }
    function maxIndex() { return Math.max(0, cards.length - visibleCount()); }
    function titleOf(i) { var h = cards[i].querySelector('h3'); return h ? h.textContent.trim() : 'Produto ' + (i + 1); }
    function buildDots() {
      if (!dots) return;
      dots.innerHTML = '';
      var max = maxIndex();
      for (var i = 0; i <= max; i++) {
        (function (step) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Ir para ' + titleOf(step));
          b.addEventListener('click', function () { go(step, true); });
          dots.appendChild(b);
        })(i);
      }
    }
    function syncDots() {
      if (!dots) return;
      var max = maxIndex();
      if (dots.children.length !== max + 1) buildDots();
      Array.prototype.forEach.call(dots.children, function (b, i) {
        if (i === index) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }
    function go(target, user) {
      var max = maxIndex();
      if (max < 1) { index = 0; track.style.transform = 'translate3d(0,0,0)'; syncDots(); return; }
      if (target < 0) target = max;
      if (target > max) target = 0;
      index = target;
      track.style.transform = 'translate3d(-' + cards[index].offsetLeft + 'px,0,0)';
      syncDots();
      if (user) {
        stop();
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () { focusInside = false; start(); if (!reduce) go(index + 1, false); }, 3500);
        if (status) status.textContent = 'Produto ' + (index + 1) + ' de ' + cards.length + ': ' + titleOf(index);
      }
    }
    function start() {
      stop();
      if (reduce || document.hidden || maxIndex() < 1) return;
      timer = setInterval(function () {
        if (!hovering && !document.hidden) go(index + 1, false);
      }, 4500);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function rebuild() {
      var max = maxIndex();
      if (index > max) index = max;
      buildDots();
      go(index, false);
      start();
    }

    if (prev) prev.addEventListener('click', function () { go(index - 1, true); });
    if (next) next.addEventListener('click', function () { go(index + 1, true); });
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, true); }
      if (e.key === 'Home') { e.preventDefault(); go(0, true); }
      if (e.key === 'End') { e.preventDefault(); go(maxIndex(), true); }
    });
    root.addEventListener('mouseenter', function () { hovering = true; stop(); });
    root.addEventListener('mouseleave', function () { hovering = false; start(); });
    root.addEventListener('focusin', function () {
      focusInside = true; stop();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () { focusInside = false; start(); if (!reduce) go(index + 1, false); }, 3500);
    });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { focusInside = false; start(); } });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { rebuild(); });
      ro.observe(viewport);
    } else {
      addEventListener('resize', function () { rebuild(); });
    }

    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startX = e.clientX; startY = e.clientY; dragging = true; suppressClick = false;
      // Sem captura aqui: capturar no pointerdown redireciona o click para o
      // viewport e o link do produto nunca recebe o clique. A captura só entra
      // quando o arrasto passa do limiar.
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!dragging || captured) return;
      if (Math.abs(e.clientX - startX) > 10) {
        captured = true;
        try { viewport.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ }
      }
    });
    viewport.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      if (captured) {
        captured = false;
        try { viewport.releasePointerCapture(e.pointerId); } catch (err) { /* sem captura */ }
      }
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 10) suppressClick = true;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), true);
      setTimeout(function () { suppressClick = false; }, 60);
    });
    viewport.addEventListener('pointercancel', function () { dragging = false; captured = false; });
    viewport.addEventListener('click', function (e) {
      if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    $$('img', viewport).forEach(function (img) { img.draggable = false; });

    root.classList.add('is-carousel');
    buildDots();
    go(0, false);
    start();
  }
  $$('[data-carousel]').forEach(initCarousel);

  /* ---------------- Lightbox ---------------- */
  var gallery = $$('.gallery__item');
  var dialog = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbTitle = document.getElementById('lightbox-title');
  var lbDesc = document.getElementById('lightbox-desc');
  var lbVol = document.getElementById('lightbox-vol');
  var lbIndex = 0, lastFocus = null;
  function openShot(index) {
    if (!dialog || !gallery.length) return;
    lbIndex = (index + gallery.length) % gallery.length;
    var btn = gallery[lbIndex], img = btn.querySelector('img');
    if (!dialog.open) lastFocus = document.activeElement;
    lbImg.src = btn.getAttribute('data-full');
    lbImg.alt = img ? img.alt : 'Página do material';
    lbTitle.textContent = btn.getAttribute('data-title') || 'Página do material';
    lbDesc.textContent = btn.getAttribute('data-desc') || '';
    lbVol.textContent = btn.getAttribute('data-vol') || '';
    if (!dialog.open) { dialog.showModal(); document.documentElement.style.overflow = 'hidden'; }
    var close = document.getElementById('lightbox-close');
    if (close) close.focus();
  }
  function closeShot() { if (dialog && dialog.open) dialog.close(); }
  gallery.forEach(function (btn, i) { btn.addEventListener('click', function () { openShot(i); }); });
  if (dialog) {
    dialog.addEventListener('close', function () { document.documentElement.style.overflow = ''; if (lastFocus) lastFocus.focus(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) closeShot(); });
    var close = document.getElementById('lightbox-close');
    var prev = document.getElementById('lightbox-prev');
    var next = document.getElementById('lightbox-next');
    if (close) close.addEventListener('click', closeShot);
    if (prev) prev.addEventListener('click', function () { openShot(lbIndex - 1); });
    if (next) next.addEventListener('click', function () { openShot(lbIndex + 1); });
    document.addEventListener('keydown', function (e) {
      if (!dialog.open) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); openShot(lbIndex - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); openShot(lbIndex + 1); }
    });
  }


  /* ---------------- Depoimentos opcionais (somente dados reais e autorizados) ---------------- */
  var testimonialsTemplate = document.getElementById('testimonials-template');
  var testimonialItems = (Array.isArray(cfg.testimonials) ? cfg.testimonials : []).filter(function (item) {
    return item && item.autorizado === true && item.nome && item.texto;
  });
  if (testimonialsTemplate && cfg.flags && cfg.flags.testimonials && testimonialItems.length) {
    var tSection = testimonialsTemplate.content.firstElementChild.cloneNode(true);
    var chooser = document.getElementById('escolha');
    var anchorSection = document.getElementById('colecao');
    if (anchorSection && anchorSection.parentNode) anchorSection.parentNode.insertBefore(tSection, anchorSection);
    else if (chooser && chooser.parentNode) chooser.parentNode.insertBefore(tSection, chooser.nextSibling);
    var track = tSection.querySelector('#quotes');
    testimonialItems.forEach(function (item) {
      var fig = document.createElement('figure'); fig.className = 'quote';
      var bq = document.createElement('blockquote'); bq.textContent = item.texto;
      var cap = document.createElement('figcaption');
      var b = document.createElement('b'); b.textContent = item.nome;
      var role = document.createElement('span'); role.textContent = item.perfil || 'Leitor';
      cap.appendChild(b); cap.appendChild(role);
      if (item.data) { var time = document.createElement('time'); time.dateTime = item.data; time.textContent = item.data; cap.appendChild(time); }
      fig.appendChild(bq); fig.appendChild(cap); track.appendChild(fig);
    });
    var qPrev = tSection.querySelector('[data-quotes-prev]');
    var qNext = tSection.querySelector('[data-quotes-next]');
    var qToggle = tSection.querySelector('[data-quotes-toggle]');
    var qIndex = 0, qTimer = null, qPaused = false, qReduce = false;
    try { qReduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* sem matchMedia */ }
    function quoteCards() { return $$('.quote', track); }
    function quoteGo(i) {
      var cards = quoteCards(); if (!cards.length) return;
      qIndex = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: cards[qIndex].offsetLeft - track.offsetLeft, behavior: qReduce ? 'auto' : 'smooth' });
    }
    function quoteNext() { var c = quoteCards(); quoteGo(qIndex + 1 >= c.length ? 0 : qIndex + 1); }
    function quotePrev() { var c = quoteCards(); quoteGo(qIndex - 1 < 0 ? c.length - 1 : qIndex - 1); }
    function quoteStop() { if (qTimer) { clearInterval(qTimer); qTimer = null; } }
    function quoteStart() {
      quoteStop();
      if (qPaused || qReduce || quoteCards().length < 2) return;
      qTimer = setInterval(function () { if (!document.hidden) quoteNext(); }, 6500);
    }
    if (qPrev) qPrev.addEventListener('click', function () { qPaused = true; quoteStop(); quotePrev(); });
    if (qNext) qNext.addEventListener('click', function () { qPaused = true; quoteStop(); quoteNext(); });
    if (qToggle) qToggle.addEventListener('click', function () {
      qPaused = !qPaused;
      qToggle.textContent = qPaused ? 'Retomar' : 'Pausar';
      qToggle.setAttribute('aria-pressed', qPaused ? 'true' : 'false');
      if (qPaused) quoteStop(); else quoteStart();
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); qPaused = true; quoteStop(); quotePrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); qPaused = true; quoteStop(); quoteNext(); }
    });
    tSection.addEventListener('mouseenter', quoteStop);
    tSection.addEventListener('focusin', quoteStop);
    tSection.addEventListener('mouseleave', function () { if (!qPaused) quoteStart(); });
    tSection.addEventListener('focusout', function (e) { if (!tSection.contains(e.relatedTarget) && !qPaused) quoteStart(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) quoteStop(); else if (!qPaused) quoteStart(); });
    quoteStart();
  }

  /* ---------------- Toast ---------------- */
  var toastEl = document.getElementById('toast'), toastTimer = null;
  function toast(title, message, ms) {
    if (!toastEl) return;
    toastEl.textContent = '';
    var b = document.createElement('b'); b.textContent = title;
    var s = document.createElement('span'); s.textContent = message;
    toastEl.appendChild(b); toastEl.appendChild(s);
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, ms || 5600);
  }

  /* ---------------- Inicialização ---------------- */
  captureAttribution();
  applyPrices();
  onScroll();
  if (trackingConfigured()) {
    if (getConsent() === null) setTimeout(showConsent, 1200);
    else if (marketingConsent()) initTracking();
  }

  window.IADV = { config: cfg, prices: prices, refresh: applyPrices, getAttribution: trackStore, consent: getConsent, openConsent: showConsent, track: trackEvent };
})();
