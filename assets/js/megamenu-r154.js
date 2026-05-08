/* R154 · ULTRA WIDE Mega Menu controller · 2026-05-03 */
(function () {
  'use strict';
  function init() {
    var navLinks = document.querySelectorAll('.hu-nav-link[data-mm]');
    var panels = document.querySelectorAll('.mm-r154');
    var backdrop = document.querySelector('.mm-backdrop');
    if (!navLinks.length || !panels.length) return;

    var openTimer = null, closeTimer = null;
    var currentPanel = null;

    function closeAll() {
      panels.forEach(function (p) { p.classList.remove('open'); });
      navLinks.forEach(function (l) { l.classList.remove('mm-active'); l.setAttribute('aria-expanded', 'false'); });
      backdrop && backdrop.classList.remove('open');
      currentPanel = null;
    }

    function openPanel(panelId, link) {
      clearTimeout(closeTimer);
      var panel = document.getElementById(panelId);
      if (!panel) return;
      // Close others
      panels.forEach(function (p) { if (p !== panel) p.classList.remove('open'); });
      navLinks.forEach(function (l) { if (l !== link) l.classList.remove('mm-active'); });
      panel.classList.add('open');
      link.classList.add('mm-active');
      link.setAttribute('aria-expanded', 'true');
      backdrop && backdrop.classList.add('open');
      currentPanel = panel;
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeAll, 220);
    }

    // Hover triggers (desktop)
    navLinks.forEach(function (link) {
      var panelId = 'mm-' + link.dataset.mm;
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('aria-controls', panelId);
      link.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
        openTimer = setTimeout(function () { openPanel(panelId, link); }, 80);
      });
      link.addEventListener('mouseleave', scheduleClose);
      link.addEventListener('focus', function () { openPanel(panelId, link); });
      // Click toggle for keyboard/touch
      link.addEventListener('click', function (e) {
        var panel = document.getElementById(panelId);
        if (panel && panel.classList.contains('open')) {
          // already open · let click navigate
          return;
        }
        e.preventDefault();
        openPanel(panelId, link);
      });
    });

    // Keep open while hovering panel
    panels.forEach(function (panel) {
      panel.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
      panel.addEventListener('mouseleave', scheduleClose);
    });

    // Backdrop click closes
    backdrop && backdrop.addEventListener('click', closeAll);

    // Esc key closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && currentPanel) closeAll();
    });

    // Click outside closes
    document.addEventListener('click', function (e) {
      if (!currentPanel) return;
      var insideNav = e.target.closest('.hu-nav') || e.target.closest('.mm-r154');
      if (!insideNav) closeAll();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
