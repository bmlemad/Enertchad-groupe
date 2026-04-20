/* EnerTchad — Sélecteur de langue FR/EN (QW-06, Audit A10)
   Swap in-place tous les éléments portant l'attribut data-i18n + data-en="..."
   Persistance via localStorage. Met à jour <html lang>.
*/
(function () {
  'use strict';
  var LS_KEY = 'ent_lang';
  var TOGGLE_ID = 'langToggle';
  var LABEL_CLASS = 'lang-label';

  function getLang() {
    try { return localStorage.getItem(LS_KEY) || 'fr'; } catch(e) { return 'fr'; }
  }
  function setLang(lang) {
    try { localStorage.setItem(LS_KEY, lang); } catch(e) {}
  }

  function translateTo(lang) {
    document.documentElement.lang = lang;
    // Swap tous les éléments [data-i18n][data-en]
    var nodes = document.querySelectorAll('[data-i18n][data-en]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      // À la première bascule, on mémorise le texte FR original
      if (!el.hasAttribute('data-fr')) {
        // Texte original = contenu HTML courant (FR par défaut)
        el.setAttribute('data-fr', el.innerHTML.trim());
      }
      var frHTML = el.getAttribute('data-fr') || '';
      var enHTML = el.getAttribute('data-en') || frHTML;
      el.innerHTML = (lang === 'en') ? enHTML : frHTML;
    }
    // Placeholders input/textarea — motif data-i18n-ph + data-en-ph
    var phs = document.querySelectorAll('[data-i18n-ph][data-en-ph]');
    for (var j = 0; j < phs.length; j++) {
      var p = phs[j];
      if (!p.hasAttribute('data-fr-ph')) {
        p.setAttribute('data-fr-ph', p.placeholder || '');
      }
      p.placeholder = (lang === 'en') ? p.getAttribute('data-en-ph') : p.getAttribute('data-fr-ph');
    }
    // Met à jour le libellé du bouton
    var label = document.querySelector('#' + TOGGLE_ID + ' .' + LABEL_CLASS);
    if (label) label.textContent = (lang === 'en') ? 'EN' : 'FR';

    // Met à jour aria-label
    var btn = document.getElementById(TOGGLE_ID);
    if (btn) btn.setAttribute('aria-label', lang === 'en' ? 'Switch to French' : 'Passer en anglais');

    // Ping analytics si Plausible présent
    if (typeof window.plausible === 'function') {
      window.plausible('LangSwitch', { props: { to: lang } });
    }
  }

  function init() {
    var lang = getLang();
    // Applique la langue stockée
    translateTo(lang);

    var btn = document.getElementById(TOGGLE_ID);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = (getLang() === 'fr') ? 'en' : 'fr';
      setLang(next);
      translateTo(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
