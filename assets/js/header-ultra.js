/* R140 · ULTRA PREMIUM Header · drawer + active state · 2026-05-03 */
(function () {
  'use strict';
  function init() {
    var burger = document.querySelector('.hu-burger');
    var drawer = document.querySelector('.hu-drawer');
    var backdrop = document.querySelector('.hu-backdrop');
    var closeBtn = document.querySelector('.hu-drawer-close');
    function open() {
      drawer && drawer.classList.add('open');
      backdrop && backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer && drawer.classList.remove('open');
      backdrop && backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
    burger && burger.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    backdrop && backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) close();
    });
    // Active state · match current path
    var current = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '/');
    document.querySelectorAll('.hu-nav-link, .hu-drawer a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var path = href.replace(/\/index\.html$/, '/').replace(/\/$/, '/');
      if (path && (path === current || (path !== '/' && current.indexOf(path) === 0))) {
        a.setAttribute('aria-current', 'page');
      }
    });
    // Lang switcher active state
    var isEn = location.pathname.startsWith('/en/');
    document.querySelectorAll('.hu-lang a').forEach(function (a) {
      var lang = a.getAttribute('hreflang');
      if ((isEn && lang === 'en') || (!isEn && lang === 'fr')) a.setAttribute('aria-current', 'true');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
