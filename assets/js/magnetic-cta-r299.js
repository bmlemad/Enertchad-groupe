/* ============================================================
 R299 · Magnetic cursor effect on CTAs
 Wave R299 · 2026-05-06 · DG mandate polish micro-interactions
 Subtle modern feel · respects prefers-reduced-motion
 ============================================================ */

(function(){
 'use strict';

 // Skip if reduced motion preferred
 if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

 // Skip on touch devices
 if ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0) return;

 var SELECTORS = [
  '.hero-r297-cta--primary',
  '.hero-r297-cta--secondary',
  '.btn-primary',
  '.hu-cta',
  '.tier-badge--flagship',
  '.editorial-card-readmore'
 ];

 var STRENGTH = 0.25;        // 0-1 · how much element follows cursor
 var MAX_OFFSET = 8;         // px · max displacement
 var EASE_IN = 320;          // ms transition on enter
 var EASE_OUT = 480;         // ms transition on leave

 function attach(el){
  if (el.dataset.r299Attached) return;
  el.dataset.r299Attached = '1';

  el.style.willChange = 'transform';
  el.style.transition = 'transform ' + EASE_OUT + 'ms cubic-bezier(0.4, 0, 0.2, 1)';

  el.addEventListener('mouseenter', function(){
   el.style.transition = 'transform ' + EASE_IN + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
  });

  el.addEventListener('mousemove', function(e){
   var rect = el.getBoundingClientRect();
   var cx = rect.left + rect.width / 2;
   var cy = rect.top + rect.height / 2;
   var dx = (e.clientX - cx) * STRENGTH;
   var dy = (e.clientY - cy) * STRENGTH;
   // Clamp
   dx = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx));
   dy = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy));
   el.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0)';
  });

  el.addEventListener('mouseleave', function(){
   el.style.transition = 'transform ' + EASE_OUT + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
   el.style.transform = '';
  });
 }

 function init(){
  SELECTORS.forEach(function(sel){
   var els = document.querySelectorAll(sel);
   els.forEach(attach);
  });
 }

 if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
 } else {
  init();
 }

 // MutationObserver for dynamically inserted CTAs
 if (window.MutationObserver){
  new MutationObserver(function(){ init(); }).observe(document.body, { childList: true, subtree: true });
 }
})();
