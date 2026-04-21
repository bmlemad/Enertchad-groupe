/* ==========================================================================
   EnerTchad Groupe — main.js
   Scroll reveals, number counters, interactive map, nav behaviors
   ========================================================================== */
(function () {
  'use strict';

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
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Mega menu a11y (click + keyboard) ---------- */
  document.querySelectorAll('.nav-has-mega').forEach((wrap) => {
    const trigger = wrap.querySelector('.nav-drop-trigger');
    const mega = wrap.querySelector('.nav-mega');
    if (!trigger || !mega) return;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const setOpen = (open) => {
      wrap.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(!wrap.classList.contains('is-open'));
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        const first = mega.querySelector('a');
        if (first) first.focus();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrap.classList.contains('is-open')) {
        setOpen(false);
        trigger.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) setOpen(false);
    });
  });

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

})();
