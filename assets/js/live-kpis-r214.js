/* ============================================================
   R214 · Live KPIs tracker · Tour 2026
   Animation compteurs · J-N dynamique · last updated timestamp
   ============================================================ */
(function () {
  'use strict';

  // KPIs canon (mock-live · à connecter API si dispo plus tard)
  const KPIS = {
    closed_pct: 47,
    soft_commits_musd: 4.7,
    ndas: 12,
    mous: 3,
    investors_targeted: 50,
    closing_date: '2026-09-30'
  };

  function animateCounter(el, target, duration = 1500, suffix = '') {
    if (!el) return;
    const start = 0;
    const startTime = Date.now();
    const fmt = (v) => suffix === '%' ? Math.round(v) : (Math.round(v * 10) / 10).toFixed(1);
    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = start + (target - start) * easedProgress;
      el.textContent = fmt(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (suffix === '%' ? target : target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  function calcDaysUntil(dateStr) {
    const target = new Date(dateStr + 'T00:00:00Z');
    const now = new Date();
    const diffMs = target - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  function updateLastUpdated() {
    const el = document.querySelector('[data-r214-lastupdated]');
    if (!el) return;
    const now = new Date();
    const opts = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    el.textContent = now.toLocaleString('fr-FR', opts) + ' CAT';
  }

  function init() {
    // % closed counter
    const pct = document.querySelector('[data-r214-pct]');
    if (pct) animateCounter(pct, KPIS.closed_pct, 1800, '%');
    // Soft commits
    const commits = document.querySelector('[data-r214-commits]');
    if (commits) animateCounter(commits, KPIS.soft_commits_musd, 1500, '');
    // NDAs
    const ndas = document.querySelector('[data-r214-ndas]');
    if (ndas) animateCounter(ndas, KPIS.ndas, 1200, '');
    // MoUs
    const mous = document.querySelector('[data-r214-mous]');
    if (mous) animateCounter(mous, KPIS.mous, 1000, '');
    // J-N dynamic
    const jn = document.querySelectorAll('[data-r214-jn]');
    jn.forEach(el => { el.textContent = 'J-' + calcDaysUntil(KPIS.closing_date); });
    // Last updated
    updateLastUpdated();
    setInterval(updateLastUpdated, 60000); // refresh every 60s
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
