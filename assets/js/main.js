/* ==========================================================================
   EnerTchad Groupe — main.js
   Scroll reveals, number counters, interactive map, nav behaviors
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  /* ---------- Nav scroll state + progress bar ---------- */
  const nav = document.querySelector('.nav');
  const navWrap = document.querySelector('.nav-wrap');
  const navProgress = document.querySelector('.nav-progress span');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) {
      if (y > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    }
    if (navWrap) {
      if (y > 12) navWrap.classList.add('is-scrolled'); else navWrap.classList.remove('is-scrolled');
    }
    if (navProgress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, (y / h) * 100) : 0;
      navProgress.style.width = pct.toFixed(2) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  // v1.9.0 — P2 #9 : focus trap dans #navLinks quand ouvert (mobile drawer a11y)
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    const FOCUSABLE_SEL = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled])';
    const getFocusables = () => Array.from(links.querySelectorAll(FOCUSABLE_SEL))
      .filter((el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null);

    const trapHandler = (e) => {
      if (e.key !== 'Tab' || !links.classList.contains('open')) return;
      const items = getFocusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const setNavOpen = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        // Focus le premier élément tabulable + armer le piège
        const items = getFocusables();
        if (items.length) {
          try { items[0].focus({ preventScroll: true }); } catch (_) { items[0].focus(); }
        }
        document.addEventListener('keydown', trapHandler);
      } else {
        document.removeEventListener('keydown', trapHandler);
      }
    };
    toggle.addEventListener('click', () => setNavOpen(!links.classList.contains('open')));
    // Close on Esc, and close when a nav link is activated (mobile UX)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) { setNavOpen(false); toggle.focus(); }
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 820px)').matches) setNavOpen(false);
      });
    });
  }

  /* ---------- Language switcher ---------- */
  document.querySelectorAll('[data-lang-switch]').forEach((sw) => {
    const btn = sw.querySelector('.lang-btn');
    if (!btn) return;
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = sw.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!sw.contains(e.target)) {
        sw.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Newsletter form (progressive enhancement) ---------- */
  document.querySelectorAll('[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const emailInput = form.querySelector('input[type="email"]');
      const consent = form.querySelector('input[type="checkbox"]');
      if (!emailInput || !emailInput.checkValidity()) return;
      if (consent && !consent.checked) return;
      // Visual feedback; let native submit proceed to newsletter.html
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.setAttribute('disabled', 'true');
        btn.style.opacity = '.7';
        const orig = btn.innerHTML;
        btn.innerHTML = 'Redirection… <span class="arrow">→</span>';
        setTimeout(() => { btn.innerHTML = orig; btn.removeAttribute('disabled'); btn.style.opacity = ''; }, 4000);
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Number counter ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();
        const format = (n) => {
          let s = decimals ? n.toFixed(decimals) : Math.round(n).toString();
          // French-style thousands separator (thin space)
          s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
          return s + suffix;
        };
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(target * eased);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = format(target);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Interactive map (basin hover/click) ---------- */
  const mapWrap = document.querySelector('[data-map]');
  if (mapWrap) {
    const basins = mapWrap.querySelectorAll('.map-basin');
    const panel = mapWrap.querySelector('.map-info-panel');
    const panelName = panel ? panel.querySelector('[data-panel-name]') : null;
    const panelDesc = panel ? panel.querySelector('[data-panel-desc]') : null;
    const panelProd = panel ? panel.querySelector('[data-panel-prod]') : null;
    const panelStat = panel ? panel.querySelector('[data-panel-stat]') : null;

    const activate = (basin) => {
      basins.forEach((b) => b.classList.remove('active'));
      basin.classList.add('active');
      if (!panel) return;
      const name = basin.dataset.name || '';
      const desc = basin.dataset.desc || '';
      const prod = basin.dataset.prod || '';
      const stat = basin.dataset.stat || '';
      if (panelName) panelName.textContent = name;
      if (panelDesc) panelDesc.textContent = desc;
      if (panelProd) panelProd.textContent = prod;
      if (panelStat) panelStat.textContent = stat;
      panel.classList.add('show');
    };

    basins.forEach((basin) => {
      basin.addEventListener('mouseenter', () => activate(basin));
      basin.addEventListener('focus', () => activate(basin));
      basin.addEventListener('click', () => activate(basin));
    });

    // Show first basin by default on desktop
    if (window.innerWidth > 900 && basins[0]) {
      setTimeout(() => activate(basins[0]), 700);
    }
  }

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Smooth anchor ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ==========================================================================
     RUM — Core Web Vitals → Plausible custom events
     Sends CLS, LCP, INP, TTFB using navigator.sendBeacon. No cookies, no PII.
     Whitelisted in CSP via connect-src https://plausible.io.
     ========================================================================== */
  (function initRUM() {
    if (!('PerformanceObserver' in window) || !navigator.sendBeacon) return;

    const PLAUSIBLE_DOMAIN = location.hostname.replace(/^www\./, '');
    const PLAUSIBLE_ENDPOINT = 'https://plausible.io/api/event';

    const sendMetric = (name, value, id) => {
      try {
        const payload = JSON.stringify({
          name: 'web-vitals',
          url: location.href,
          domain: PLAUSIBLE_DOMAIN,
          props: {
            metric: name,
            value: Math.round(name === 'CLS' ? value * 1000 : value),
            rating: rate(name, value),
            id: id || '',
            path: location.pathname
          }
        });
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(PLAUSIBLE_ENDPOINT, blob);
      } catch (_) { /* fail silently — RUM must never break the page */ }
    };

    // Thresholds from https://web.dev/vitals/
    const rate = (name, v) => {
      if (name === 'LCP')  return v <= 2500 ? 'good' : v <= 4000 ? 'ni'   : 'poor';
      if (name === 'CLS')  return v <= 0.1  ? 'good' : v <= 0.25 ? 'ni'   : 'poor';
      if (name === 'INP')  return v <= 200  ? 'good' : v <= 500  ? 'ni'   : 'poor';
      if (name === 'FCP')  return v <= 1800 ? 'good' : v <= 3000 ? 'ni'   : 'poor';
      if (name === 'TTFB') return v <= 800  ? 'good' : v <= 1800 ? 'ni'   : 'poor';
      return 'n/a';
    };

    // --- LCP (final on page hidden/unload) ---
    let lcpValue = 0, lcpId = '';
    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        lcpValue = last.renderTime || last.loadTime || last.startTime;
        lcpId = last.id || (last.element && last.element.tagName) || '';
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_) {}

    // --- CLS (cumulative since page load; reported at pagehide) ---
    let clsValue = 0;
    try {
      const poCls = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) clsValue += entry.value;
        });
      });
      poCls.observe({ type: 'layout-shift', buffered: true });
    } catch (_) {}

    // --- INP (highest-latency event, approx via longest event entry >40ms) ---
    let inpValue = 0;
    try {
      const poEvt = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Interaction = entries with interactionId (Chromium 106+)
          if (entry.interactionId && entry.duration > inpValue) inpValue = entry.duration;
        });
      });
      poEvt.observe({ type: 'event', buffered: true, durationThreshold: 40 });
    } catch (_) {}

    // --- FCP (one-shot) ---
    try {
      const poFcp = new PerformanceObserver((list) => {
        const fcp = list.getEntries().find((e) => e.name === 'first-contentful-paint');
        if (fcp) sendMetric('FCP', fcp.startTime);
      });
      poFcp.observe({ type: 'paint', buffered: true });
    } catch (_) {}

    // --- TTFB (from Navigation Timing) ---
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.responseStart > 0) sendMetric('TTFB', nav.responseStart);
    } catch (_) {}

    // Flush LCP / CLS / INP on page hidden (bfcache-safe)
    const flush = () => {
      if (lcpValue > 0) sendMetric('LCP', lcpValue, lcpId);
      if (clsValue > 0) sendMetric('CLS', clsValue);
      if (inpValue > 0) sendMetric('INP', inpValue);
      lcpValue = clsValue = inpValue = 0;
    };
    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    }, { capture: true });
    // Fallback for older browsers
    addEventListener('pagehide', flush, { capture: true });
  })();

  /* ==========================================================================
     BRAND LOGO — swap the letter-mark "E" for the SVG clover logo + subtle anim
     Runtime swap avoids touching 16 HTML files.
     ========================================================================== */
  (function swapBrandLogo() {
    const mark = document.querySelector('.brand .brand-mark');
    if (!mark) return;
    // Build the animated SVG clover logo inline (imports external file for cacheability)
    mark.innerHTML = '' +
      '<svg class="brand-logo" viewBox="0 0 200 200" width="40" height="40" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<linearGradient id="blGold" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#E8C667"/><stop offset="50%" stop-color="#D4A843"/><stop offset="100%" stop-color="#E8C667"/>' +
          '</linearGradient>' +
          '<radialGradient id="blP1" cx="0.4" cy="0.35" r="0.65"><stop offset="0%" stop-color="#E8D06A"/><stop offset="100%" stop-color="#B8912E"/></radialGradient>' +
          '<radialGradient id="blP2" cx="0.6" cy="0.4" r="0.65"><stop offset="0%" stop-color="#4A8FD9"/><stop offset="100%" stop-color="#1A4F9A"/></radialGradient>' +
          '<radialGradient id="blP3" cx="0.4" cy="0.4" r="0.65"><stop offset="0%" stop-color="#2DAF50"/><stop offset="100%" stop-color="#126B2C"/></radialGradient>' +
          '<radialGradient id="blP4" cx="0.5" cy="0.5" r="0.65"><stop offset="0%" stop-color="#F0E4C4"/><stop offset="100%" stop-color="#CCBB85"/></radialGradient>' +
        '</defs>' +
        '<circle cx="100" cy="100" r="78" fill="rgba(250,250,245,0.06)"/>' +
        '<circle class="bl-ring" cx="100" cy="100" r="80" fill="none" stroke="url(#blGold)" stroke-width="4"/>' +
        '<g class="bl-petals">' +
          '<path class="bl-petal bl-p1" d="M100 42 C108 58, 128 70, 128 85 C128 100, 115 108, 100 108 C85 108, 72 100, 72 85 C72 70, 92 58, 100 42Z" fill="url(#blP1)"/>' +
          '<path class="bl-petal bl-p2" d="M42 100 C58 92, 70 72, 85 72 C100 72, 108 85, 108 100 C108 115, 100 128, 85 128 C70 128, 58 108, 42 100Z" fill="url(#blP2)"/>' +
          '<path class="bl-petal bl-p3" d="M158 100 C142 108, 130 128, 115 128 C100 128, 92 115, 92 100 C92 85, 100 72, 115 72 C130 72, 142 92, 158 100Z" fill="url(#blP3)"/>' +
          '<path class="bl-petal bl-p4" d="M100 158 C92 142, 72 130, 72 115 C72 100, 85 92, 100 92 C115 92, 128 100, 128 115 C128 130, 108 142, 100 158Z" fill="url(#blP4)"/>' +
        '</g>' +
        '<circle class="bl-core" cx="100" cy="100" r="7" fill="rgba(255,255,255,0.55)"/>' +
      '</svg>';
    mark.classList.add('has-logo');
  })();

  /* ==========================================================================
     HERO ANIMATED BACKDROP — WebGL-free mesh + particles, reduced-motion safe
     ========================================================================== */
  (function initHeroBackdrop() {
    if (prefersReducedMotion()) return;
    const hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.hero-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    function resize() {
      const rect = hero.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Energy particles — subtle floating dots in gold/amber
    const N = Math.min(50, Math.round((W * H) / 18000));
    const particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.18,
        a: 0.1 + Math.random() * 0.35,
        hue: Math.random() < 0.7 ? 42 : 200, // mostly gold, some blue
      });
    }

    let t0 = performance.now();
    let running = true;
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { running = e.isIntersecting; });
      });
      io.observe(hero);
    }

    function draw(now) {
      const t = (now - t0) / 1000;

      if (!running) { requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);

      // Moving mesh gradient blobs (radial gradients at animated positions)
      const b1x = W * (0.3 + 0.1 * Math.sin(t * 0.15));
      const b1y = H * (0.4 + 0.08 * Math.cos(t * 0.12));
      const g1 = ctx.createRadialGradient(b1x, b1y, 20, b1x, b1y, W * 0.55);
      g1.addColorStop(0, 'rgba(217, 168, 79, 0.18)');
      g1.addColorStop(1, 'rgba(217, 168, 79, 0)');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

      const b2x = W * (0.75 + 0.1 * Math.cos(t * 0.1));
      const b2y = H * (0.6 + 0.1 * Math.sin(t * 0.17));
      const g2 = ctx.createRadialGradient(b2x, b2y, 20, b2x, b2y, W * 0.5);
      g2.addColorStop(0, 'rgba(74, 143, 217, 0.14)');
      g2.addColorStop(1, 'rgba(74, 143, 217, 0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

      const b3x = W * (0.5 + 0.15 * Math.sin(t * 0.08 + 1));
      const b3y = H * (0.2 + 0.12 * Math.cos(t * 0.11 + 2));
      const g3 = ctx.createRadialGradient(b3x, b3y, 10, b3x, b3y, W * 0.4);
      g3.addColorStop(0, 'rgba(45, 175, 80, 0.1)');
      g3.addColorStop(1, 'rgba(45, 175, 80, 0)');
      ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 42
          ? 'rgba(232, 198, 103, ' + p.a + ')'
          : 'rgba(100, 160, 230, ' + (p.a * 0.7) + ')';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  /* ==========================================================================
     3D MAP ENHANCE — perspective tilt on scroll + pulsing sites + pipeline flow
     Applies to both the schematic Tchad map (maps.html) and .map-basin SVGs.
     ========================================================================== */
  (function enhanceMap3D() {
    const frames = document.querySelectorAll('.map-frame, [data-map-3d]');
    if (!frames.length) return;

    // Add 3D container + tilt on mouse move (desktop only)
    frames.forEach((frame) => {
      frame.classList.add('is-3d');
      if (prefersReducedMotion()) return;
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        frame.addEventListener('pointermove', (e) => {
          const rect = frame.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;   // 0..1
          const py = (e.clientY - rect.top)  / rect.height;  // 0..1
          const rx = (0.5 - py) * 6;  // tilt up/down
          const ry = (px - 0.5) * 8;  // tilt left/right
          frame.style.setProperty('--rx', rx.toFixed(2) + 'deg');
          frame.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        });
        frame.addEventListener('pointerleave', () => {
          frame.style.setProperty('--rx', '0deg');
          frame.style.setProperty('--ry', '0deg');
        });
      }
    });

    // Animated pulses on sites + pipelines
    const sites = document.querySelectorAll('.map-site circle:first-of-type');
    sites.forEach((c, i) => {
      const parent = c.parentNode;
      if (!parent || parent.querySelector('.site-pulse')) return;
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', c.getAttribute('cx'));
      pulse.setAttribute('cy', c.getAttribute('cy'));
      pulse.setAttribute('r', c.getAttribute('r'));
      pulse.setAttribute('fill', 'none');
      pulse.setAttribute('stroke', c.getAttribute('fill'));
      pulse.setAttribute('stroke-width', '1.5');
      pulse.setAttribute('class', 'site-pulse');
      pulse.style.setProperty('--delay', (i * 0.35) + 's');
      parent.insertBefore(pulse, c);
    });

    // Add "flow" dash animation on pipelines (paths with stroke-dasharray)
    const pipelines = document.querySelectorAll('.map-frame svg path[stroke-dasharray]');
    pipelines.forEach((p) => p.classList.add('pipeline-flow'));
  })();

  /* ==========================================================================
     BASIN 3D — add pseudo-depth layer on .map-basin cards
     ========================================================================== */
  (function enhanceBasins() {
    if (prefersReducedMotion()) return;
    const basins = document.querySelectorAll('.map-basin');
    if (!basins.length) return;
    basins.forEach((b) => b.classList.add('is-3d'));
  })();

  /* ==========================================================================
     CADASTRE PÉTROLIER 2025 — fetch official JSON, render blocks + pipelines,
     filter by region, open image lightbox
     ========================================================================== */
  (function cadastreRenderer() {
    const host     = document.querySelector('[data-cadastre-blocks]');
    const pipeHost = document.querySelector('[data-cadastre-pipelines]');
    const lb       = document.querySelector('[data-cadastre-lightbox]');
    if (!host && !lb) return;

    const state = { region: 'all', data: null };
    const REGION_ORDER = ['nord', 'centre', 'sud'];

    function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    function render() {
      if (!state.data || !host) return;
      let blocks  = state.data.blocks || [];
      const legend = (state.data.legend && state.data.legend.status) || {};
      const regionMap = {};
      (state.data.regions || []).forEach(r => { regionMap[r.id] = r; });

      if (state.region !== 'all') {
        blocks = blocks.filter(b => b.region === state.region);
      }

      const grouped = {};
      blocks.forEach(b => { (grouped[b.region] = grouped[b.region] || []).push(b); });

      let html = '';
      REGION_ORDER.forEach(rid => {
        if (!grouped[rid]) return;
        const reg  = regionMap[rid] || { name: rid };
        const list = grouped[rid];
        html += '<div class="cad-region" data-region="' + esc(rid) + '">';
        html +=   '<div class="cad-region-head">';
        html +=     '<h4>' + esc(reg.name) + '</h4>';
        html +=     '<span class="cad-count">' + list.length + ' bloc' + (list.length > 1 ? 's' : '') + (reg.bounds ? ' · ' + esc(reg.bounds) : '') + '</span>';
        html +=   '</div>';
        html +=   '<div class="cad-blocks-grid">';
        list.forEach(b => {
          const st = legend[b.status] || {};
          const lbl = (st.label || b.status || '').replace(/^Bloc\s+/i, '');
          const title = b.note ? (b.name + ' — ' + b.note) : (b.name + ' — ' + (st.label || b.status));
          html += '<div class="cad-block" data-status="' + esc(b.status) + '" title="' + esc(title) + '">';
          html +=   '<span class="cad-block-name">' + esc(b.name) + '</span>';
          html +=   '<span class="cad-block-status">' + esc(lbl) + '</span>';
          html += '</div>';
        });
        html +=   '</div>';
        html += '</div>';
      });
      if (!html) {
        html = '<p style="color:#666; padding: 24px; text-align:center;">Aucun bloc dans cette région.</p>';
      }
      host.innerHTML = html;
    }

    function renderPipes() {
      if (!state.data || !pipeHost) return;
      const pipes = state.data.pipelines || [];
      if (!pipes.length) { pipeHost.innerHTML = ''; return; }
      let html = '<h3>Corridors pipeline · ' + pipes.length + ' tracés</h3>';
      html += '<div class="cad-pipe-list">';
      pipes.forEach(p => {
        html += '<div class="cad-pipe" data-type="' + esc(p.type) + '">';
        html +=   '<h5>' + esc(p.name) + '</h5>';
        if (p.length_km) {
          html += '<div class="cad-pipe-length">' + p.length_km.toLocaleString('fr-FR') + ' km</div>';
        }
        if (p.from || p.to) {
          html += '<div class="cad-pipe-route">' + esc(p.from || '') + ' → ' + esc(p.to || '') + '</div>';
        }
        if (p.operator_note) {
          html += '<div class="cad-pipe-note">' + esc(p.operator_note) + '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
      pipeHost.innerHTML = html;
    }

    // Keep UI stat cards in sync with the JSON (single source of truth)
    function updateStats() {
      if (!state.data) return;
      const blocks = state.data.blocks || [];
      const counts = { total: blocks.length, attribue: 0, libre: 0, changement: 0, concession: 0, hors_bloc: 0 };
      blocks.forEach(b => { if (counts[b.status] !== undefined) counts[b.status] += 1; });
      document.querySelectorAll('[data-cadastre-stats] strong[data-k]').forEach(el => {
        const k = el.getAttribute('data-k');
        if (counts[k] !== undefined) el.textContent = counts[k];
      });
    }

    // Fetch the official JSON
    fetch('/assets/data/cadastre-2025.json', { credentials: 'same-origin' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        state.data = data;
        updateStats();
        render();
        renderPipes();
      })
      .catch(err => {
        console.warn('[cadastre] data unavailable:', err);
        if (host) host.innerHTML = '<p style="color:#666; padding:24px; text-align:center;">Chargement des données cadastre indisponible. Consultez le <a href="/documents/cadastre-petrolier-2025.pdf">PDF officiel</a>.</p>';
      });

    // Region filter chips
    document.querySelectorAll('.cad-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.cad-chip').forEach(c => c.classList.remove('is-on'));
        chip.classList.add('is-on');
        state.region = chip.dataset.region || 'all';
        render();
      });
    });

    // Lightbox open/close
    function openLb()  { if (lb) { lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; } }
    function closeLb() { if (lb) { lb.setAttribute('aria-hidden', 'true');  document.body.style.overflow = ''; } }
    document.querySelectorAll('[data-cadastre-open]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); openLb(); });
    });
    document.querySelectorAll('[data-cadastre-close]').forEach(btn => {
      btn.addEventListener('click', closeLb);
    });
    if (lb) {
      lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lb.getAttribute('aria-hidden') === 'false') closeLb();
      });
    }
  })();

  /* ---------- Contact form prefill (Batch 2 IR) ----------
     Lit ?sujet=<slug> sur /contact.html et pré-remplit
     <select name="type"> + <input name="subject"> avec
     le libellé long correspondant.
  */
  (function prefillContactForm(){
    if (!/\/contact(\.html)?$/i.test(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    const slug = params.get('sujet');
    if (!slug) return;

    const catalog = {
      // Documents IR — type "Relations investisseurs"
      'ir-rapport-annuel-2025':  { type: 'Relations investisseurs', subject: 'Demande — Rapport annuel 2025 (à paraître T2 2026)' },
      'ir-resultats-2025':       { type: 'Relations investisseurs', subject: 'Inscription webcast — Résultats 2025' },
      'ir-ifrs-2025':            { type: 'Relations investisseurs', subject: 'Demande — États financiers IFRS 2025' },
      'ir-communique-q4-2025':   { type: 'Relations investisseurs', subject: 'Alertes IR — Communiqué Q4 2025' },
      'ir-itie-2025':            { type: 'Relations investisseurs', subject: 'Demande — Rapport ITIE 2025' },
      'ir-esg-2025':             { type: 'Relations investisseurs', subject: 'Demande — Rapport ESG / Développement durable 2025' },
      'ir-plan-2030':            { type: 'Relations investisseurs', subject: 'Demande — Plan stratégique « Énergie souveraine 2030 »' },
      'ir-gouvernance':          { type: 'Relations investisseurs', subject: 'Demande — Rapport de gouvernance CA' },
      'ir-fact-sheet':           { type: 'Relations investisseurs', subject: 'Demande — Fact sheet EnerTchad' },
      // Presse
      'presse-kit':              { type: 'Presse & médias',          subject: 'Demande — Kit presse 2026 (logos, photos, bios)' },
      // Autres (templates lead-gen futurs)
      'talents-spontane':        { type: 'Recrutement',              subject: 'Candidature spontanée' },
      'achats-sourcing':         { type: 'Achats / fournisseur',     subject: 'Référencement fournisseur — Sourcing achats' }
    };

    const entry = catalog[slug];
    if (!entry) return;

    const selectEl = document.querySelector('select[name="type"]');
    const subjectEl = document.querySelector('input[name="subject"]');
    if (selectEl) {
      const opts = Array.from(selectEl.options);
      const match = opts.find(o => o.textContent.trim() === entry.type);
      if (match) { selectEl.value = match.value || match.textContent.trim(); }
    }
    if (subjectEl) { subjectEl.value = entry.subject; }
  })();

  /* ---------- Enhanced contact form (Batch 4 lead-gen) ----------
     - Révèle des blocs <.form-cond data-show-if="…"> selon <select name="type">
     - Honeypot anti-spam (input name="website" dans .hp-field)
     - Timing anti-bot : rejette les soumissions en moins de 2s
     - Soumission fetch() vers data-endpoint (Formspree / Getform / Worker)
     - Fallback mailto: si aucun endpoint configuré
  */
  (function enhancedContactForm(){
    const form = document.getElementById('contact-form');
    if (!form) return;

    const typeSelect = form.querySelector('select[name="type"]');
    const condBlocks = form.querySelectorAll('.form-cond');
    const successEl  = form.querySelector('.form-success');
    const failureEl  = form.querySelector('.form-failure');
    const submitBtn  = form.querySelector('button[type="submit"]');
    const loadTime   = Date.now();

    /* 1) Reveal/hide conditional blocks based on <select name="type"> value. */
    function applyCondState() {
      const val = typeSelect ? (typeSelect.value || '').trim() : '';
      condBlocks.forEach(block => {
        const trigger = (block.dataset.showIf || '').trim();
        const shouldShow = trigger && trigger === val;
        block.hidden = !shouldShow;
      });
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', applyCondState);
      applyCondState();
    }

    /* 2) Submission handler with honeypot, timing check, fetch + mailto fallback. */
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Masquer messages antérieurs
      if (successEl) successEl.classList.remove('show');
      if (failureEl) failureEl.classList.remove('show');

      // Anti-spam — honeypot : champ "website" rempli => bot probable
      const hp = form.querySelector('input[name="website"]');
      if (hp && hp.value.trim() !== '') {
        // Silencieux : on feint le succès pour ne pas révéler le piège
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Anti-spam — timing : <2s = soumission trop rapide (bot)
      if (Date.now() - loadTime < 2000) {
        if (failureEl) {
          failureEl.classList.add('show');
          failureEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Validation HTML5 native
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // UI feedback pendant envoi
      let originalLabel = null;
      if (submitBtn) {
        originalLabel = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Envoi en cours…';
      }

      // Collecte des données
      const formData = new FormData(form);
      formData.delete('website'); // Ne jamais transmettre le honeypot
      const endpoint = (form.dataset.endpoint || '').trim();

      try {
        if (endpoint) {
          // Submission via endpoint (Formspree / Getform / Cloudflare Worker)
          const resp = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          if (!resp.ok) throw new Error('endpoint error ' + resp.status);
        } else {
          // Fallback : compose un mailto: avec le contenu en clair.
          const lines = [];
          for (const [k, v] of formData.entries()) {
            if (v && String(v).trim() !== '') {
              lines.push(k + ': ' + v);
            }
          }
          const subject = '[EnerTchad · ' +
            (formData.get('type') || 'Contact') + '] ' +
            (formData.get('subject') || '');
          const mailto = 'mailto:contact@enertchad.td' +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(lines.join('\n'));
          // Laisser 250 ms pour que l'UX soit visible avant le switch de client mail
          setTimeout(() => { window.location.href = mailto; }, 250);
        }

        // Succès
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        applyCondState();
      } catch (err) {
        if (window.console && console.warn) console.warn('[contact-form]', err);
        if (failureEl) {
          failureEl.classList.add('show');
          failureEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (originalLabel !== null) submitBtn.innerHTML = originalLabel;
        }
      }
    });
  })();

  /* ==============================================================
     INTERACTIVE LEAFLET MAP · Batch 6
     Lazy-loads Leaflet 1.9.4 via IntersectionObserver, reads
     /assets/data/infrastructure.geojson + /assets/data/cadastre-2025.json,
     renders pipelines + sites + cadastre blocks with branded popups.
     Progressive enhancement: falls back to SVG if Leaflet unavailable.
     ============================================================== */
  (function initLeafletMap(){
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl) return;
    const frame = mapEl.closest('[data-map-frame]') || mapEl.parentElement;
    const svgFallback = frame ? frame.querySelector('[data-map-svg-fallback]') : null;
    const loader = frame ? frame.querySelector('[data-map-loader]') : null;

    const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

    let loaded = false;
    let loading = false;

    function showLoader(show){
      if (loader) loader.hidden = !show;
    }
    function handleFailure(err){
      if (window.console && console.warn) console.warn('[leaflet-map] fallback SVG', err);
      showLoader(false);
      mapEl.hidden = true;
      if (svgFallback) svgFallback.hidden = false;
    }

    function loadLeaflet(){
      return new Promise((resolve, reject) => {
        if (window.L) return resolve(window.L);
        // CSS
        if (!document.querySelector('link[data-leaflet]')){
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = LEAFLET_CSS;
          link.setAttribute('data-leaflet', '1');
          link.crossOrigin = '';
          document.head.appendChild(link);
        }
        // JS
        const script = document.createElement('script');
        script.src = LEAFLET_JS;
        script.async = true;
        script.defer = true;
        script.crossOrigin = '';
        script.onload = () => window.L ? resolve(window.L) : reject(new Error('Leaflet loaded but window.L undefined'));
        script.onerror = () => reject(new Error('Leaflet script failed to load'));
        document.head.appendChild(script);
      });
    }

    function siteIcon(L, category){
      const palette = {
        siege:     '#080E1A',
        aval:      '#F59E0B',
        amont:     '#2C7AE0',
        inter:     '#10B981',
        export:    '#8B5CF6',
        microgrid: '#D9A84F'
      };
      const color = palette[category] || '#080E1A';
      const html = '<span class="et-marker" style="--c:' + color + '"></span>';
      return L.divIcon({
        className: 'et-marker-wrap',
        html: html,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -10]
      });
    }

    function sitePopup(p){
      const lines = ['<div class="et-popup">'];
      lines.push('<div class="et-popup-head">' + (p.name || 'Site') + '</div>');
      if (p.role) lines.push('<div class="et-popup-role">' + p.role + '</div>');
      if (p.note) lines.push('<div class="et-popup-note">' + p.note + '</div>');
      if (p.address) lines.push('<div class="et-popup-meta">' + p.address + '</div>');
      if (p.url) lines.push('<a class="et-popup-link" href="' + p.url + '">Voir la page →</a>');
      lines.push('</div>');
      return lines.join('');
    }

    function pipelinePopup(p){
      const lines = ['<div class="et-popup">'];
      lines.push('<div class="et-popup-head">' + (p.name || 'Pipeline') + '</div>');
      if (p.from && p.to) lines.push('<div class="et-popup-role">' + p.from + ' → ' + p.to + '</div>');
      const stats = [];
      if (p.length_km) stats.push(p.length_km + ' km');
      if (p.diameter_inches) stats.push(p.diameter_inches + '″');
      if (p.capacity_kbd) stats.push(p.capacity_kbd + ' kb/j');
      if (stats.length) lines.push('<div class="et-popup-note">' + stats.join(' · ') + '</div>');
      if (p.note) lines.push('<div class="et-popup-meta">' + p.note + '</div>');
      lines.push('</div>');
      return lines.join('');
    }

    function blockColor(status){
      const map = {
        'attribué':    '#1F6AE5',
        'attribue':    '#1F6AE5',
        'libre':       '#10B981',
        'changement':  '#F59E0B',
        'concession':  '#8B5CF6',
        'en changement': '#F59E0B'
      };
      return map[(status || '').toLowerCase()] || '#7A7A7A';
    }

    function blockPopup(b){
      const lines = ['<div class="et-popup">'];
      lines.push('<div class="et-popup-head">Bloc ' + (b.id || b.name || '') + '</div>');
      if (b.status) lines.push('<div class="et-popup-role">Statut : ' + b.status + '</div>');
      if (b.basin) lines.push('<div class="et-popup-note">Bassin : ' + b.basin + '</div>');
      if (b.operator || b.licensee) lines.push('<div class="et-popup-meta">' + (b.operator || b.licensee) + '</div>');
      lines.push('</div>');
      return lines.join('');
    }

    async function renderMap(){
      if (loaded || loading) return;
      loading = true;
      showLoader(true);
      try {
        const L = await loadLeaflet();
        mapEl.hidden = false;
        const map = L.map(mapEl, {
          center: [10.5, 15.5],
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          scrollWheelZoom: false,
          attributionControl: true
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
          maxZoom: 10
        }).addTo(map);

        // Layer groups (for later layer-control toggling)
        const sitesLayer     = L.layerGroup().addTo(map);
        const pipelinesLayer = L.layerGroup().addTo(map);
        const microgridLayer = L.layerGroup();
        const blocksLayer    = L.layerGroup();

        // Fetch infrastructure GeoJSON
        const infraUrl = mapEl.getAttribute('data-geojson') || '/assets/data/infrastructure.geojson';
        try {
          const resp = await fetch(infraUrl, { credentials: 'same-origin' });
          if (!resp.ok) throw new Error('infra fetch ' + resp.status);
          const geo = await resp.json();
          (geo.features || []).forEach(f => {
            const p = f.properties || {};
            const g = f.geometry || {};
            if (g.type === 'LineString') {
              const latlngs = (g.coordinates || []).map(c => [c[1], c[0]]);
              const line = L.polyline(latlngs, {
                color: p.color || '#D9A84F',
                weight: 3.5,
                opacity: 0.85,
                dashArray: p.category === 'interne' ? '6 6' : null
              });
              line.bindPopup(pipelinePopup(p));
              line.addTo(pipelinesLayer);
            } else if (g.type === 'Point' && p.type === 'site') {
              const [lon, lat] = g.coordinates;
              const m = L.marker([lat, lon], { icon: siteIcon(L, p.category || 'siege') });
              m.bindPopup(sitePopup(p));
              m.addTo(sitesLayer);
            } else if (g.type === 'MultiPoint') {
              (g.coordinates || []).forEach(coord => {
                const [lon, lat] = coord;
                const m = L.circleMarker([lat, lon], {
                  radius: 6,
                  color: p.color || '#D9A84F',
                  weight: 2,
                  fillColor: p.color || '#D9A84F',
                  fillOpacity: 0.55
                });
                m.bindPopup(sitePopup({
                  name: p.name || 'Micro-grid solaire',
                  role: p.role,
                  note: p.note
                }));
                m.addTo(microgridLayer);
              });
            }
          });
        } catch (err) {
          if (window.console && console.warn) console.warn('[leaflet-map] infra load', err);
        }

        // Fetch cadastre blocks (best-effort)
        const cadastreUrl = mapEl.getAttribute('data-cadastre') || '/assets/data/cadastre-2025.json';
        try {
          const resp = await fetch(cadastreUrl, { credentials: 'same-origin' });
          if (resp.ok) {
            const cad = await resp.json();
            const blocks = cad.blocks || [];
            blocks.forEach(b => {
              const c = b.center_lat_lon || b.center || null;
              if (!c || c.length < 2) return;
              const lat = c[0], lon = c[1];
              const circle = L.circleMarker([lat, lon], {
                radius: 7,
                color: blockColor(b.status),
                weight: 1.5,
                fillColor: blockColor(b.status),
                fillOpacity: 0.45
              });
              circle.bindPopup(blockPopup(b));
              circle.addTo(blocksLayer);
            });
          }
        } catch (err) {
          if (window.console && console.warn) console.warn('[leaflet-map] cadastre load', err);
        }

        // Layer control
        const overlays = {
          'Sites': sitesLayer,
          'Pipelines': pipelinesLayer,
          'Micro-grids solaires': microgridLayer,
          'Cadastre (42 blocs)': blocksLayer
        };
        L.control.layers(null, overlays, { position: 'topright', collapsed: false }).addTo(map);

        // Enable scroll zoom on user click (a11y pattern)
        map.on('click', () => map.scrollWheelZoom.enable());
        map.on('mouseout', () => map.scrollWheelZoom.disable());

        // Fit all visible site markers to get a nice initial frame
        const allLatLngs = [];
        sitesLayer.eachLayer(l => { if (l.getLatLng) allLatLngs.push(l.getLatLng()); });
        pipelinesLayer.eachLayer(l => { if (l.getLatLngs) l.getLatLngs().forEach(ll => allLatLngs.push(ll)); });
        if (allLatLngs.length) {
          map.fitBounds(L.latLngBounds(allLatLngs).pad(0.25));
        }

        if (svgFallback) svgFallback.hidden = true;
        showLoader(false);
        loaded = true;

        // Invalidate size after any late layout shifts
        setTimeout(() => { try { map.invalidateSize(); } catch(e){} }, 200);
      } catch (err) {
        handleFailure(err);
      } finally {
        loading = false;
      }
    }

    // Lazy-load via IntersectionObserver
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            io.disconnect();
            renderMap();
          }
        });
      }, { rootMargin: '200px' });
      io.observe(mapEl);
    } else {
      // Fallback: load on idle
      if ('requestIdleCallback' in window) requestIdleCallback(renderMap);
      else setTimeout(renderMap, 400);
    }
  })();

})();
