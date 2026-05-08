/* ============================================================
   R176 · Preload page · counter + fade-out logic
   - Counter animates 0→100 over min duration
   - Fade-out triggered after window 'load' AND min duration
   - Reduced-motion · skip counter, just fade-out fast
   - localStorage skip for repeat visitors (session)
   ============================================================ */
(function () {
  'use strict';

  var preload = document.getElementById('preload-r176');
  if (!preload) return;

  // Session skip · don't show twice in same session
  try {
    if (sessionStorage.getItem('et-preload-shown') === '1') {
      preload.setAttribute('data-state', 'hidden');
      preload.style.display = 'none';
      return;
    }
  } catch (e) { /* sessionStorage may be unavailable */ }

  var counter = preload.querySelector('.pl-counter');
  var fill = preload.querySelector('.pl-progress-fill');
  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MIN_DURATION = reducedMotion ? 200 : 1600;
  var TICK_INTERVAL = reducedMotion ? 50 : 50;
  var startTime = Date.now();
  var loadFired = false;
  var displayValue = 0;
  var ticker = null;

  function setProgress(pct) {
    pct = Math.max(0, Math.min(100, pct));
    if (counter) counter.textContent = String(Math.floor(pct)).padStart(2, '0');
    if (fill) fill.style.right = (100 - pct) + '%';
  }

  function hide() {
    preload.setAttribute('data-state', 'hidden');
    try { sessionStorage.setItem('et-preload-shown', '1'); } catch (e) {}
    setTimeout(function () {
      if (preload.parentNode) preload.parentNode.removeChild(preload);
    }, 700);
  }

  function tick() {
    var elapsed = Date.now() - startTime;
    var minProgress = Math.min(98, (elapsed / MIN_DURATION) * 100);
    var loadBonus = loadFired ? 100 : Math.min(98, minProgress);
    displayValue = displayValue + (loadBonus - displayValue) * 0.18;
    setProgress(displayValue);

    if (loadFired && displayValue > 99 && elapsed >= MIN_DURATION) {
      setProgress(100);
      clearInterval(ticker);
      setTimeout(hide, 280);
    }
  }

  // Mark load event
  function markLoaded() {
    loadFired = true;
  }

  if (document.readyState === 'complete') {
    markLoaded();
  } else {
    window.addEventListener('load', markLoaded, { once: true });
  }

  // Safety timeout · fade-out after 6s max even if load never fires
  setTimeout(function () {
    if (preload.getAttribute('data-state') !== 'hidden') {
      loadFired = true;
      setProgress(100);
      setTimeout(hide, 280);
    }
  }, 6000);

  // Body lock during preload
  document.documentElement.style.overflow = 'hidden';
  preload.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'opacity') {
      document.documentElement.style.overflow = '';
    }
  }, { once: true });

  // Skip on click anywhere (escape hatch)
  preload.addEventListener('click', function () {
    loadFired = true;
    setProgress(100);
    setTimeout(hide, 200);
  });

  // Start ticker
  ticker = setInterval(tick, TICK_INTERVAL);
})();
