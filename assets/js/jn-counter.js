/* R128 · J-N Dynamic Counter · 2026-05-03
 * Updates all [data-jn] elements with live days remaining until Tour 2026 closing (2026-09-30).
 * Markup: <span data-jn>J-151</span>  →  auto-recalculated each page load.
 * Closing fixed: September 30, 2026. Format: J-N (uppercase J, no space).
 */
(function () {
  'use strict';
  var CLOSING = new Date(Date.UTC(2026, 8, 30)); // months 0-indexed → 8 = September
  var DAY_MS = 86400000;
  function computeJN() {
    var today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    var diff = Math.round((CLOSING - today) / DAY_MS);
    if (diff < 0) return 'J+' + Math.abs(diff);
    if (diff === 0) return 'Closing';
    return 'J-' + diff;
  }
  function update() {
    var label = computeJN();
    var nodes = document.querySelectorAll('[data-jn]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = label;
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
