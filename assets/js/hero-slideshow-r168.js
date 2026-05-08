/* R168 · Hero slideshow · auto-advance + keyboard + dots · 2026-05-03 */
(function(){
  'use strict';
  function init(){
    var slideshow = document.querySelector('.hs-r168');
    if (!slideshow) return;
    var slides = slideshow.querySelectorAll('.hs-slide');
    var dots = slideshow.querySelectorAll('.hs-dot');
    var prev = slideshow.querySelector('.hs-prev');
    var next = slideshow.querySelector('.hs-next');
    var fill = slideshow.querySelector('.hs-progress-fill');
    if (!slides.length) return;

    var current = 0;
    var auto = null;
    var progress = null;
    var SLIDE_DURATION = 7000;

    function show(idx){
      slides.forEach(function(s, i){ s.classList.toggle('active', i === idx); });
      dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
      current = idx;
      restartProgress();
    }
    function nextSlide(){ show((current + 1) % slides.length); }
    function prevSlide(){ show((current - 1 + slides.length) % slides.length); }

    function startAuto(){
      stopAuto();
      auto = setInterval(nextSlide, SLIDE_DURATION);
    }
    function stopAuto(){
      if (auto) clearInterval(auto);
      auto = null;
    }
    function restartProgress(){
      if (!fill) return;
      fill.style.transition = 'none';
      fill.style.width = '0%';
      // force reflow
      void fill.offsetWidth;
      fill.style.transition = 'width ' + SLIDE_DURATION + 'ms linear';
      fill.style.width = '100%';
    }

    // Dots click
    dots.forEach(function(d, i){
      d.addEventListener('click', function(){ show(i); startAuto(); });
    });
    // Arrows click
    if (prev) prev.addEventListener('click', function(){ prevSlide(); startAuto(); });
    if (next) next.addEventListener('click', function(){ nextSlide(); startAuto(); });
    // Keyboard nav
    slideshow.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight'){ e.preventDefault(); nextSlide(); startAuto(); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); prevSlide(); startAuto(); }
    });
    // Pause on hover
    slideshow.addEventListener('mouseenter', stopAuto);
    slideshow.addEventListener('mouseleave', startAuto);
    // Pause on visibility change
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) stopAuto();
      else startAuto();
    });
    // Reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){
      SLIDE_DURATION = 99999999;
      stopAuto();
      return;
    }

    show(0);
    startAuto();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
