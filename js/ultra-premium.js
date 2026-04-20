/* ============================================================================
   EnerTchad Groupe — Ultra-Premium JS  (UP-P1 · 2026-04-20)
   ----------------------------------------------------------------------------
   Additions non-destructives :
     1) Curseur blob cognac (désactivé sur touch + prefers-reduced-motion)
     2) Parallax multi-couche (data-up-parallax="0.05" .. "0.25")
     3) Reveal staggered via IntersectionObserver (data-up-reveal + --up-i)
     4) Page transition morph (intercept a[href] same-origin, sauf _blank / PDF)

   Rollback : retirer <script defer src="js/ultra-premium.js"></script> du <head>.
   ============================================================================ */
(function () {
  'use strict';

  // -- Guards -----------------------------------------------------------------
  if (typeof window === 'undefined' || !window.document) return;
  if (window.__UP_P1__) return;            // double-load guard
  window.__UP_P1__ = true;

  var doc = document;
  var root = doc.documentElement;

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches)
              || ('ontouchstart' in window);

  // -- Utils ------------------------------------------------------------------
  function rAF(fn){ return (window.requestAnimationFrame || function(c){return setTimeout(c,16);})(fn); }
  function on(el, ev, fn, opts){ el.addEventListener(ev, fn, opts || { passive: true }); }

  // ============================================================================
  // 1) CURSEUR BLOB COGNAC
  // ============================================================================
  (function initCursor(){
    if (isTouch || prefersReduced) return;

    var cursor = doc.createElement('div');
    cursor.className = 'up-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(cursor);

    var tx = 0, ty = 0, cx = 0, cy = 0;
    var ready = false;

    on(window, 'mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!ready) {
        cx = tx; cy = ty;
        ready = true;
        cursor.classList.add('is-ready');
      }
    });

    // Suivi lissé (lerp .18)
    function loop(){
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = 'translate(' + cx + 'px, ' + cy + 'px) translate(-50%,-50%)';
      rAF(loop);
    }
    rAF(loop);

    // Hover state sur éléments cliquables
    var hoverSel = 'a, button, [role="button"], .card, .vc-card, .kpi-card, .ncard, .rse-card, [data-mega]';
    on(doc, 'mouseover', function (e) {
      if (e.target && e.target.closest && e.target.closest(hoverSel)) cursor.classList.add('is-hovering');
    }, true);
    on(doc, 'mouseout', function (e) {
      if (e.target && e.target.closest && e.target.closest(hoverSel)) cursor.classList.remove('is-hovering');
    }, true);

    on(window, 'blur',  function(){ cursor.classList.remove('is-ready'); });
    on(window, 'focus', function(){ cursor.classList.add('is-ready'); });
  })();

  // ============================================================================
  // 2) PARALLAX MULTI-COUCHE
  // ============================================================================
  (function initParallax(){
    if (prefersReduced) return;

    var layers = Array.prototype.slice.call(doc.querySelectorAll('[data-up-parallax]'));
    if (!layers.length) return;

    var ticking = false;
    function update(){
      var vh = window.innerHeight;
      for (var i = 0; i < layers.length; i++){
        var el = layers[i];
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        var factor = parseFloat(el.getAttribute('data-up-parallax')) || 0.1;
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        var translate = -progress * 100 * factor;
        el.style.transform = 'translate3d(0,' + translate.toFixed(2) + 'px,0)';
      }
      ticking = false;
    }
    function onScroll(){
      if (!ticking){
        rAF(update);
        ticking = true;
      }
    }
    on(window, 'scroll', onScroll);
    on(window, 'resize', onScroll);
    update();
  })();

  // ============================================================================
  // 3) REVEAL STAGGERED
  // ============================================================================
  (function initReveal(){
    var nodes = Array.prototype.slice.call(doc.querySelectorAll('[data-up-reveal]'));

    // Auto-tag : les blocs de contenu (cards, section headings) qui n'ont pas
    // d'attribut explicite sont taggés par petits groupes pour stagger naturel.
    if (!nodes.length) {
      var auto = doc.querySelectorAll('.section .section-title, .section .section-eyebrow, .card, .vc-card, .kpi-card, .ncard, .news-card, .rse-card, .hero-sub, .hero-desc, .lead, .section-header-premium, .ir-card, .career-card, .gov-card, .esg-pillar, .media-card, .st-card');
      for (var j = 0; j < auto.length; j++){
        auto[j].setAttribute('data-up-reveal', '');
        nodes.push(auto[j]);
      }
    }

    if (!nodes.length) return;
    if (prefersReduced){
      nodes.forEach(function(n){ n.classList.add('is-shown'); });
      return;
    }

    // Stagger index per section
    var parents = new Map();
    nodes.forEach(function(n){
      var p = n.closest('section, .section, .hero, main') || doc.body;
      if (!parents.has(p)) parents.set(p, 0);
      var idx = parents.get(p);
      n.style.setProperty('--up-i', String(idx));
      parents.set(p, idx + 1);
    });

    if (!('IntersectionObserver' in window)){
      nodes.forEach(function(n){ n.classList.add('is-shown'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-shown');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    nodes.forEach(function(n){ io.observe(n); });
  })();

  // ============================================================================
  // 4) PAGE TRANSITION MORPH
  // ============================================================================
  (function initPageTransitions(){
    if (prefersReduced) return;

    function isInternal(a){
      if (!a || !a.href) return false;
      if (a.target && a.target !== '' && a.target !== '_self') return false;
      if (a.hasAttribute('download')) return false;
      var href = a.getAttribute('href') || '';
      if (!href || href[0] === '#') return false;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
      if (/\.(pdf|zip|docx?|xlsx?|pptx?|png|jpe?g|webp|svg|mp4|webm|mp3)(\?|$)/i.test(href)) return false;
      try{
        var u = new URL(a.href, window.location.href);
        if (u.origin !== window.location.origin) return false;
        if (u.pathname === window.location.pathname && u.search === window.location.search) return false;
        return true;
      }catch(e){ return false; }
    }

    on(doc, 'click', function (e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || !isInternal(a)) return;

      e.preventDefault();
      doc.body.classList.add('up-transitioning');
      var href = a.href;
      setTimeout(function(){ window.location.href = href; }, 420);
    });

    // Retirer la classe au retour via bfcache (Safari/Firefox)
    on(window, 'pageshow', function(ev){
      if (ev.persisted) doc.body.classList.remove('up-transitioning');
    });
  })();

  // ============================================================================
  // 5) ODOMETER UP-COUNTER  (fallback sans GSAP, cohabite avec [data-count])
  //    Attribut : [data-up-counter="144"] [data-up-counter-suffix="K"]
  //               [data-up-counter-prefix="+"] [data-up-counter-decimals="1"]
  //               [data-up-counter-duration="1800"]
  // ============================================================================
  (function initCounters(){
    var nodes = Array.prototype.slice.call(doc.querySelectorAll('[data-up-counter]'));
    if (!nodes.length) return;

    function locale(){ return (doc.documentElement.lang || 'fr').indexOf('en') === 0 ? 'en-US' : 'fr-FR'; }

    function format(n, decimals){
      return n.toLocaleString(locale(), { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }

    function runCounter(el){
      if (el.dataset.upCounterDone) return;
      el.dataset.upCounterDone = '1';

      var target = parseFloat(el.getAttribute('data-up-counter')) || 0;
      var duration = parseInt(el.getAttribute('data-up-counter-duration'), 10) || 1800;
      var decimals = parseInt(el.getAttribute('data-up-counter-decimals'), 10) || 0;
      var prefix = el.getAttribute('data-up-counter-prefix') || '';
      var suffix = el.getAttribute('data-up-counter-suffix') || '';

      if (prefersReduced){
        el.textContent = prefix + format(target, decimals) + suffix;
        return;
      }

      var start = null;
      function step(ts){
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / duration);
        // ease-out-expo
        var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        var val = target * eased;
        el.textContent = prefix + format(val, decimals) + suffix;
        if (t < 1) rAF(step);
      }
      rAF(step);
    }

    if (!('IntersectionObserver' in window)){
      nodes.forEach(runCounter);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          runCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });

    nodes.forEach(function(n){ io.observe(n); });
  })();

  // ============================================================================
  // 6) SCROLL SCRUBBING — progression liée au viewport, élément par élément
  //    Attribut : [data-up-scrub] — la progression 0→1 se base sur l'entrée
  //               du haut du viewport jusqu'à 40% depuis le bas.
  //    Exposée comme variable CSS --up-p (0..1) + classe .is-enter / .is-exit.
  // ============================================================================
  (function initScrub(){
    if (prefersReduced) return;

    var nodes = Array.prototype.slice.call(doc.querySelectorAll('[data-up-scrub]'));
    if (!nodes.length) return;

    var ticking = false;
    function update(){
      var vh = window.innerHeight;
      for (var i = 0; i < nodes.length; i++){
        var el = nodes[i];
        var rect = el.getBoundingClientRect();
        // 0 quand top du bloc = bas du viewport, 1 quand top du bloc = 40% du viewport depuis le bas
        var p = 1 - (rect.top - vh * 0.4) / (vh * 0.6);
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        el.style.setProperty('--up-p', p.toFixed(3));
        el.classList.toggle('is-enter', p > 0 && p < 1);
        el.classList.toggle('is-exit', p >= 1);
      }
      ticking = false;
    }
    function onScroll(){
      if (!ticking){
        rAF(update);
        ticking = true;
      }
    }
    on(window, 'scroll', onScroll);
    on(window, 'resize', onScroll);
    update();
  })();

  // ============================================================================
  // 7) THEME CONTROLLER — unifie html.light + body.light-theme (legacy)
  //    Persiste dans localStorage sous "up-theme" (dark | light)
  //    Respecte prefers-color-scheme au premier chargement (si rien stocké)
  //    Utilise View Transitions API si dispo, fallback cross-fade CSS
  // ============================================================================
  (function initTheme(){
    var STORAGE_KEY = 'up-theme';
    function getStored(){ try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; } }
    function setStored(v){ try { localStorage.setItem(STORAGE_KEY, v); } catch(e){} }

    function systemPrefersLight(){
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    }

    function currentTheme(){
      return root.classList.contains('light') ? 'light' : 'dark';
    }

    function apply(theme, animate){
      var target = theme === 'light';
      var same = (target && root.classList.contains('light')) || (!target && !root.classList.contains('light'));
      if (same) return;

      function mutate(){
        root.classList.toggle('light', target);
        doc.body.classList.toggle('light-theme', target);   // legacy compat
        var meta = doc.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', target ? '#F5F5F0' : '#080E1A');
        root.setAttribute('data-theme', target ? 'light' : 'dark');
      }

      if (!animate || prefersReduced){ mutate(); return; }

      // View Transitions API (Chrome/Edge 111+)
      if (doc.startViewTransition) {
        doc.startViewTransition(function(){ mutate(); });
        return;
      }
      // Fallback : classe morphing + transitions CSS globales
      root.classList.add('up-theme-morphing');
      mutate();
      setTimeout(function(){ root.classList.remove('up-theme-morphing'); }, 650);
    }

    // Boot initial (synchrone, avant mouse interaction)
    var stored = getStored();
    if (stored === 'light' || stored === 'dark') {
      apply(stored, false);
    } else if (systemPrefersLight()) {
      apply('light', false);
    }

    // Toggle handler (délégué — fonctionne même si le bouton est injecté après)
    on(doc, 'click', function(e){
      var btn = e.target && e.target.closest ? e.target.closest('[data-up-theme-toggle], .theme-toggle, #themeToggle') : null;
      if (!btn) return;
      e.preventDefault();
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      setStored(next);
      apply(next, true);
      btn.setAttribute('aria-pressed', String(next === 'light'));
    });

    // Injection auto d'un bouton si aucun n'existe dans .header-actions
    function injectButton(){
      var ha = doc.querySelector('.header-actions');
      if (!ha) return;
      if (ha.querySelector('[data-up-theme-toggle], .theme-toggle, #themeToggle')) return;
      var btn = doc.createElement('button');
      btn.className = 'up-theme-btn';
      btn.type = 'button';
      btn.setAttribute('data-up-theme-toggle', '');
      btn.setAttribute('aria-label', 'Basculer thème clair / sombre');
      btn.setAttribute('aria-pressed', String(currentTheme() === 'light'));
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="up-sun" d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"/><circle class="up-sun-core" cx="12" cy="12" r="4"/><path class="up-moon" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" style="display:none"/></svg>';
      // Place en premier enfant pour cohérence de rythme visuel
      ha.insertBefore(btn, ha.firstChild);
    }

    if (doc.readyState === 'loading') {
      on(doc, 'DOMContentLoaded', injectButton);
    } else {
      injectButton();
    }

    // Réagit au changement system si l'utilisateur n'a pas encore choisi
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      var handler = function(e){
        if (!getStored()) apply(e.matches ? 'light' : 'dark', true);
      };
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else if (mq.addListener) mq.addListener(handler);
    }
  })();

  // ============================================================================
  // 8) BOOT FLAG (utile pour debug + QA)
  // ============================================================================
  root.setAttribute('data-up', 'ready');
})();
