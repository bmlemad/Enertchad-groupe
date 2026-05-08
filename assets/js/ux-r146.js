/* R146 · Back-to-top button · vanilla JS · 2026-05-03 */
(function () {
  'use strict';
  function init() {
    if (document.querySelector('.btt-r146')) return;
    var btn = document.createElement('button');
    btn.className = 'btt-r146';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Retour en haut de page');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);
    function toggle() {
      if (window.scrollY > 600) btn.classList.add('show');
      else btn.classList.remove('show');
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { toggle(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    toggle();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
