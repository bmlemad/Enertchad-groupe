/* ═══════════════════════════════════════════════════════════════
   EnertchadGroupe — Modern Corporate JS (2026)
   Mega-menu, GSAP ScrollTrigger, i18n, scroll behaviors
   ═══════════════════════════════════════════════════════════════ */

/* Remove .no-js class when JS loads to enable GSAP animations */
document.documentElement.classList.remove('no-js');

/* ─── CROSS-SITE URL REGISTRY ─── */
var ENERTCHAD = {
  groupe:    'https://www.enertchad.td',
  amont:     'https://amont.enertchad.td',
  midstream: 'https://midstream.enertchad.td',
  aval:      'https://aval.enertchad.td',
  tech:      'https://tech.enertchad.td',
  energies:  'https://energies.enertchad.td'
};

(function () {
  'use strict';

  /* ─── TIMING CONSTANTS ─── */
  var TIMING = {
    LOADER_FADE: 400,        // Loader fadeout duration
    LOADER_REMOVE: 800,      // Loader DOM removal delay
    COOKIE_SHOW: 1500,       // Cookie banner appearance delay
    PAGE_TRANSITION: 350,    // Page transition overlay duration
    GSAP_INIT: 200,          // GSAP initialization delay after load
    GSAP_FALLBACK: 5000,     // Fallback if GSAP CDN fails
    ACCENT_UPDATE: 10,       // Tab accent color update debounce
    TAB_INDICATOR: 60,       // Tab indicator reposition delay
    RESIZE_DEBOUNCE: 150,    // Canvas resize debounce
    FORM_FEEDBACK: 2000,     // Form field validation feedback reset
    FORM_SUBMIT_RESET: 3000  // Form submit button reset delay
  };

  /* ─── READING PROGRESS BAR ─── */
  var progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ─── HEADER SCROLL — Progressive Morphing ─── */
  var header = document.querySelector('.header') || document.getElementById('header');
  var scrollTop = document.getElementById('scrollTop');
  var lastScrollY = 0;
  var headerHidden = false;

  var scrollTicking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 40);
      // Auto-hide header on scroll down (past 300px), show on scroll up
      if (y > 300 && y > lastScrollY && !headerHidden) {
        header.style.transform = 'translateY(-100%)';
        headerHidden = true;
      } else if (y < lastScrollY && headerHidden) {
        header.style.transform = 'translateY(0)';
        headerHidden = false;
      }
      // Always show at top
      if (y <= 40) {
        header.style.transform = 'translateY(0)';
        headerHidden = false;
      }
    }
    if (scrollTop) scrollTop.classList.toggle('visible', y > 400);
    lastScrollY = y;
    scrollTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  }, { passive: true });
  onScroll();

  /* ─── ACTIVE NAV LINK ─── */
  (function () {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-link[href]');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#')) return;
      // Normalize: resolve relative path
      var a = document.createElement('a');
      a.href = href;
      if (a.pathname === currentPath) {
        link.style.color = 'var(--gold)';
        link.style.background = 'rgba(217,168,79,0.08)';
      }
    });
  })();

  if (scrollTop) {
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── MEGA MENU — Multi-panel system ─── */
  var megaOverlay = document.getElementById('megaOverlay');
  var allMegaDrops = document.querySelectorAll('.mega-drop');
  var activeMegaId = null;

  /* Cancel any WAAPI animations that override CSS clip-path */
  function cancelWAAPI(el) {
    if (el && el.getAnimations) {
      el.getAnimations().forEach(function(a) { try { a.cancel(); } catch(e) {} });
    }
  }

  function openMega(id) {
    closeMega(); // close any open
    var trigger = document.querySelector('[data-mega="' + id + '"]');
    var drop = trigger ? trigger.querySelector('.mega-drop') : null;
    if (!drop) return;
    if (trigger) trigger.classList.add('open');
    drop.classList.add('active');
    /* WAAPI transition animations override clip-path — cancel and force */
    cancelWAAPI(drop);
    drop.style.clipPath = 'inset(0)';
    if (megaOverlay) megaOverlay.classList.add('active');
    document.querySelectorAll('[data-mega="' + id + '"]').forEach(function(t) { t.setAttribute('aria-expanded','true'); });
    document.body.style.overflow = 'hidden';
    activeMegaId = id;
  }

  function closeMega() {
    document.querySelectorAll('.nav-item.open').forEach(function(n) { n.classList.remove('open'); });
    allMegaDrops.forEach(function(d) {
      cancelWAAPI(d);
      d.classList.remove('active');
      d.style.clipPath = '';
    });
    if (megaOverlay) megaOverlay.classList.remove('active');
    document.querySelectorAll('[data-mega]').forEach(function(t) { t.setAttribute('aria-expanded','false'); });
    document.body.style.overflow = '';
    activeMegaId = null;
  }

  document.querySelectorAll('[data-mega]').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var id = this.getAttribute('data-mega');
      if (activeMegaId === id) { closeMega(); } else { openMega(id); }
    }, true); /* capture phase: fire before child <a> navigates */
  });

  // Close buttons (all)
  document.querySelectorAll('.mega-close').forEach(function(btn) { btn.addEventListener('click', closeMega); });
  if (megaOverlay) megaOverlay.addEventListener('click', closeMega);

  // Escape key
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMega(); });

  // Mega tabs — per-panel tab system
  allMegaDrops.forEach(function(drop) {
    var tabs = drop.querySelectorAll('.mega-tab');
    var panels = drop.querySelectorAll('.mega-panel');
    var isMobile = window.innerWidth <= 1024;

    function isDataTab(t) {
      return t.hasAttribute('data-tab');
    }

    function activateTab(t) {
      if (!isDataTab(t)) return; // Skip separators
      var target = t.getAttribute('data-tab');
      tabs.forEach(function(mt) {
        if (!isDataTab(mt)) return;
        mt.classList.remove('active');
        mt.setAttribute('aria-selected','false');
        mt.setAttribute('tabindex','-1');
      });
      t.classList.add('active');
      t.setAttribute('aria-selected','true');
      t.setAttribute('tabindex','0');
      if (t) t.focus();
      panels.forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-panel') === target); });
    }

    function activateMobileTab(t) {
      if (!isDataTab(t)) return;
      var target = t.getAttribute('data-tab');

      // Update tab highlight
      tabs.forEach(function(mt) {
        if (!isDataTab(mt)) return;
        mt.classList.toggle('mobile-active', mt.getAttribute('data-tab') === target);
      });

      // Toggle panel
      panels.forEach(function(p) {
        var isTarget = p.getAttribute('data-panel') === target;
        if (isTarget && p.classList.contains('mobile-open')) {
          // Close if already open
          p.classList.remove('mobile-open');
        } else if (isTarget) {
          // Open this one and close others
          panels.forEach(function(op) { op.classList.remove('mobile-open'); });
          p.classList.add('mobile-open');
        }
      });
    }

    tabs.forEach(function(tab, idx) {
      if (!isDataTab(tab)) return;
      tab.setAttribute('tabindex', '0');

      tab.addEventListener('click', function(e) {
        e.preventDefault();
        if (isMobile) {
          activateMobileTab(this);
        } else {
          activateTab(this);
        }
      });

      tab.addEventListener('keydown', function(e) {
        if (!isDataTab(this)) return;
        var dir = 0;
        if (e.key==='ArrowDown'||e.key==='ArrowRight') dir=1;
        if (e.key==='ArrowUp'||e.key==='ArrowLeft') dir=-1;
        if (e.key==='Enter'||e.key===' ') { e.preventDefault();
          if (isMobile) {
            activateMobileTab(this);
          } else {
            activateTab(this);
          }
          return;
        }
        if (dir!==0) { e.preventDefault(); activateTab(tabs[(idx+dir+tabs.length)%tabs.length]); }
      });
    });
  });

  /* ─── MEGA MENU FOCUS TRAP ─── */
  (function initMegaFocusTrap() {
    function getFocusableElements(container) {
      var focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
      return Array.from(container.querySelectorAll(focusableSelectors));
    }

    function trapTabKey(e, focusableElements) {
      if (e.key !== 'Tab') return;
      var firstElement = focusableElements[0];
      var lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          if (lastElement) lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          if (firstElement) firstElement.focus();
        }
      }
    }

    // Store the trigger that opened the mega and previous focus
    var megaTrapData = { trigger: null, focusableElements: [], listener: null };

    var originalOpenMega = openMega;
    openMega = function(id) {
      originalOpenMega.call(this, id);
      var trigger = document.querySelector('[data-mega="' + id + '"]');
      var drop = trigger ? trigger.querySelector('.mega-drop') : null;
      if (!drop) return;

      // Store trigger and focusable elements
      megaTrapData.trigger = document.querySelector('[data-mega="' + id + '"]');
      megaTrapData.focusableElements = getFocusableElements(drop);

      // Activate focus trap
      if (megaTrapData.focusableElements.length > 0) {
        if (megaTrapData.focusableElements[0]) megaTrapData.focusableElements[0].focus();
        megaTrapData.listener = function(e) { trapTabKey(e, megaTrapData.focusableElements); };
        document.addEventListener('keydown', megaTrapData.listener);
      }
    };

    var originalCloseMega = closeMega;
    closeMega = function() {
      originalCloseMega.call(this);
      // Remove focus trap and restore focus to trigger
      if (megaTrapData.listener) {
        document.removeEventListener('keydown', megaTrapData.listener);
        megaTrapData.listener = null;
      }
      if (megaTrapData.trigger && megaTrapData.trigger.focus) {
        megaTrapData.trigger.focus();
      }
      megaTrapData.focusableElements = [];
    };
  })();

  // Handle mobile/desktop transitions on resize
  var resizeDebounceTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = setTimeout(function() {
      var isMobile = window.innerWidth <= 1024;
      allMegaDrops.forEach(function(drop) {
        var tabs = drop.querySelectorAll('.mega-tab[data-tab]');
        var panels = drop.querySelectorAll('.mega-panel');

        if (isMobile) {
          // Reset to mobile state
          panels.forEach(function(p) { p.classList.remove('active'); p.classList.remove('mobile-open'); });
          tabs.forEach(function(t) { t.classList.remove('mobile-active'); });
        } else {
          // Reset to desktop state
          tabs.forEach(function(t) { t.classList.remove('mobile-active'); });
          panels.forEach(function(p) { p.classList.remove('mobile-open'); });
          // Restore first tab as active on desktop
          var firstTab = drop.querySelector('.mega-tab[data-tab]');
          if (firstTab) {
            var target = firstTab.getAttribute('data-tab');
            tabs.forEach(function(mt) {
              mt.classList.remove('active');
              mt.setAttribute('aria-selected','false');
              mt.setAttribute('tabindex','-1');
            });
            firstTab.classList.add('active');
            firstTab.setAttribute('aria-selected','true');
            firstTab.setAttribute('tabindex','0');
            panels.forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-panel') === target); });
          }
        }
      });
    }, TIMING.RESIZE_DEBOUNCE);
  });

  /* ─── MOBILE TOGGLE ─── */
  var mobileToggle = document.getElementById('mobileToggle');
  var nav = document.querySelector('.header-nav') || document.querySelector('.nav');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = this.classList.toggle('active');
      this.setAttribute('aria-expanded', isOpen);
      nav.style.display = isOpen ? 'flex' : '';
      // On mobile, show nav as full-screen overlay
      if (isOpen) {
        nav.style.flexDirection = 'column';
        nav.style.position = 'fixed';
        nav.style.top = 'var(--header-h, 72px)';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.bottom = '0';
        nav.style.background = 'rgba(8,14,26,0.98)';
        nav.style.backdropFilter = 'blur(30px)';
        nav.style.webkitBackdropFilter = 'blur(30px)';
        nav.style.padding = '2rem 1.5rem';
        nav.style.zIndex = '997';
        nav.style.gap = '0.25rem';
        nav.style.alignItems = 'stretch';
        nav.style.border = 'none';
        nav.style.borderRadius = '0';
        document.body.style.overflow = 'hidden';
        // Stagger animate nav links
        var links = nav.querySelectorAll('.nav-link');
        links.forEach(function (link, i) {
          link.style.opacity = '0';
          link.style.transform = 'translateX(-20px)';
          link.style.transition = 'none';
          setTimeout(function () {
            link.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateX(0)';
            link.style.fontSize = '1.1rem';
            link.style.padding = '0.75rem 1rem';
            link.style.borderRadius = '10px';
          }, 50 + i * 60);
        });
      } else {
        nav.removeAttribute('style');
        nav.querySelectorAll('.nav-link').forEach(function (link) {
          link.removeAttribute('style');
        });
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── GSAP SCROLL ANIMATIONS ─── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Signal CSS that GSAP is ready — this hides .reveal elements so GSAP can animate them in
    document.documentElement.classList.add('gsap-ready');

    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray('.reveal-left').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // KPI counter animation
    gsap.utils.toArray('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: function () {
          el.textContent = Math.round(obj.val).toLocaleString('fr-FR');
        }
      });
    });

    // Stagger children in grids
    gsap.utils.toArray('.vc-grid, .kpi-grid, .fil-grid, .fil-core-grid, .fil-solutions-grid, .services-grid, .info-grid, .news-grid').forEach(function (grid) {
      var children = grid.querySelectorAll('.reveal, .vc-card, .kpi-card, .fil-card, .fil-card-v2, .service-card, .info-card, .news-card');
      if (children.length > 1) {
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 85%',
          onEnter: function () {
            gsap.fromTo(children,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
              }
            );
          },
          once: true
        });
      }
    });
  }

  // Wait for GSAP to load (defer scripts may not be ready yet)
  // Fallback: if GSAP fails to load within 5s, force reveals visible
  var gsapFallbackTimer = setTimeout(function () { /* TIMING.GSAP_FALLBACK */
    if (!document.documentElement.classList.contains('gsap-ready')) {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }, TIMING.GSAP_FALLBACK);

  if (typeof gsap !== 'undefined') {
    clearTimeout(gsapFallbackTimer);
    initGSAP();
  } else {
    window.addEventListener('load', function () {
      setTimeout(function () {
        clearTimeout(gsapFallbackTimer);
        initGSAP();
      }, TIMING.GSAP_INIT);
    });
  }

  /* ─── I18N (FR / EN) ─── */
  (function initI18n() {
    var langBtn = document.getElementById('langToggle');
    var langLabel = langBtn ? langBtn.querySelector('.lang-label') : null;
    if (!langBtn || !langLabel) return;

    var currentLang = localStorage.getItem('lang') || 'fr';

    function setLang(lang) {
      currentLang = lang;
      langLabel.textContent = lang.toUpperCase();
      document.documentElement.lang = lang;

      // Translate all [data-i18n] elements
      document.querySelectorAll('[data-i18n]').forEach(function(el) {
        if (lang === 'en') {
          if (!el.dataset.fr) el.dataset.fr = el.textContent;
          if (el.dataset.en) el.textContent = el.dataset.en;
        } else {
          if (el.dataset.fr) el.textContent = el.dataset.fr;
        }
      });

      // Translate placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        if (lang === 'en' && el.dataset.enPlaceholder) {
          if (!el.dataset.frPlaceholder) el.dataset.frPlaceholder = el.placeholder;
          el.placeholder = el.dataset.enPlaceholder;
        } else if (el.dataset.frPlaceholder) {
          el.placeholder = el.dataset.frPlaceholder;
        }
      });

      try { localStorage.setItem('lang', lang); } catch(e) {}
    }

    langBtn.addEventListener('click', function() {
      setLang(currentLang === 'fr' ? 'en' : 'fr');
    });

    // Apply saved language on load
    if (currentLang !== 'fr') setLang(currentLang);
  })();

  /* ─── HERO CANVAS PARTICLE ANIMATION ─── */
  (function initHeroCanvas() {
    // Skip heavy canvas animation if user prefers reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h, dpr;
    var mouse = { x: -1000, y: -1000 };

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, TIMING.RESIZE_DEBOUNCE);
    });

    // Track mouse for interactivity
    canvas.parentElement.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', function() {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Gold & blue particles representing energy/oil
    var colors = [
      'rgba(217,168,79,0.5)',   // gold
      'rgba(217,168,79,0.3)',   // gold dim
      'rgba(46,134,222,0.4)',   // amont blue
      'rgba(14,165,233,0.3)',   // midstream blue
      'rgba(232,195,106,0.3)',  // gold light
      'rgba(255,255,255,0.15)'  // white subtle
    ];

    var count = Math.min(80, Math.floor(w * h / 12000));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        r: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Draw connections between nearby particles
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            var alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = 'rgba(217,168,79,' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.pulse += 0.015;

        // Mouse attraction
        var mdx = mouse.x - p.x;
        var mdy = mouse.y - p.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200 && mdist > 0) {
          var force = (200 - mdist) / 200 * 0.015;
          p.vx += mdx / mdist * force;
          p.vy += mdy / mdist * force;
        }

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        var pulseR = p.r + Math.sin(p.pulse) * 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        ctx.fill();
      }

    }

    // Only run on larger screens, pause when hero is not visible
    if (w > 600) {
      var isVisible = true;
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          isVisible = entries[0].isIntersecting;
        }, { threshold: 0 });
        observer.observe(canvas.parentElement);
      }
      (function animLoop() {
        if (isVisible) draw();
        requestAnimationFrame(animLoop);
      })();
    }
  })();

  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMega();
        // Close mobile nav
        if (mobileToggle && mobileToggle.classList.contains('active') && mobileToggle.click) {
          mobileToggle.click();
        }
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72', 10);
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ─── CONTACT FORM VALIDATION (QW-03) ─── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var fields = [
      { id: 'cf-name',    errId: 'cf-name-err',    validate: function(v){ return v.trim().length >= 2; } },
      { id: 'cf-email',   errId: 'cf-email-err',   validate: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
      { id: 'cf-subject', errId: null,             validate: function(v){ return v && v !== ''; } },
      { id: 'cf-message', errId: 'cf-message-err', validate: function(v){ return v.trim().length >= 10; } }
    ];
    function setFieldError(f, invalid){
      var inp = document.getElementById(f.id);
      if (!inp) return;
      inp.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      if (f.errId) {
        var err = document.getElementById(f.errId);
        if (err) err.setAttribute('data-visible', invalid ? 'true' : 'false');
      }
    }
    fields.forEach(function(f){
      var inp = document.getElementById(f.id);
      if (!inp) return;
      inp.addEventListener('blur', function(){ setFieldError(f, !f.validate(inp.value)); });
      inp.addEventListener('input', function(){ if (inp.getAttribute('aria-invalid')==='true') setFieldError(f, !f.validate(inp.value)); });
    });
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = true, firstBad = null;
      fields.forEach(function(f){
        var inp = document.getElementById(f.id);
        var valid = f.validate(inp.value);
        setFieldError(f, !valid);
        if (!valid) { ok = false; if (!firstBad) firstBad = inp; }
      });
      var status = document.getElementById('cf-status');
      if (!ok) {
        if (status) { status.textContent = 'Merci de corriger les champs en rouge avant d\'envoyer.'; status.setAttribute('data-visible','true'); }
        if (firstBad && firstBad.focus) firstBad.focus();
        return;
      }
      if (status) { status.textContent = 'Message envoyé — nous vous répondrons sous 24h.'; status.setAttribute('data-visible','true'); status.style.color = 'var(--success)'; }
      if (window.plausible) window.plausible('Contact Form Submit');
      contactForm.reset();
    });
  }

  /* ─── NEWSLETTER FORM FEEDBACK ─── */
  document.querySelectorAll('.footer-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input || !input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.style.borderColor = 'var(--danger)';
        input.style.boxShadow = '0 0 0 3px var(--danger-dim)';
        setTimeout(function() { input.style.borderColor = ''; input.style.boxShadow = ''; }, TIMING.FORM_FEEDBACK);
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var origText = btn.innerHTML;
      btn.innerHTML = currentLang === 'en' ? '<i class="fas fa-check"></i> Subscribed!' : '<i class="fas fa-check"></i> Inscrit !';
      btn.style.background = 'var(--success)';
      btn.disabled = true;
      input.value = '';
      if (window.plausible) window.plausible('Newsletter Subscribe');
      setTimeout(function() { btn.innerHTML = origText; btn.style.background = ''; btn.disabled = false; }, TIMING.FORM_SUBMIT_RESET);
    });
  });

  /* ─── PLAUSIBLE EVENT TRACKING (QW-10) ─── */
  function trackClick(selector, eventName){
    document.querySelectorAll(selector).forEach(function(el){
      el.addEventListener('click', function(){
        if (window.plausible) window.plausible(eventName);
      });
    });
  }
  trackClick('[data-event="career-apply"], a[href*="talents"].btn', 'Career Apply Click');
  trackClick('[data-event="devis"], a[href*="devis"]', 'Devis Request');
  trackClick('[data-event="portail"], a[href*="portail"], a[href*="portal"]', 'Portail Access');
  trackClick('[data-event="download"], a[href$=".pdf"], a[download]', 'PDF Download');
  trackClick('a[href^="mailto:"]', 'Email Click');

  /* ─── PAGE LOADER ─── */
  var loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('loaded');
        // Remove from DOM after transition
        setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, TIMING.LOADER_REMOVE);
      }, TIMING.LOADER_FADE);
    });
    // Fallback: hide loader after 3s even if load event doesn't fire
    setTimeout(function () { if (loader) loader.classList.add('loaded'); }, TIMING.GSAP_FALLBACK);
  }

  /* ─── COOKIE CONSENT ─── */
  var cookieBanner = document.getElementById('cookieConsent');
  if (cookieBanner) {
    var consent;
    try { consent = localStorage.getItem('enertchad-cookie-consent'); } catch(e) {}
    if (!consent) {
      setTimeout(function () { cookieBanner.classList.add('visible'); }, TIMING.COOKIE_SHOW);
    }
    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    function dismissCookie(val) {
      try { localStorage.setItem('enertchad-cookie-consent', val); } catch(e) {}
      cookieBanner.classList.remove('visible');
      cookieBanner.classList.add('hidden');
      if (val === 'declined' && window.plausible) {
        // Respect user choice — disable analytics
        window.plausible = function () {};
      }
    }
    if (acceptBtn) acceptBtn.addEventListener('click', function () { dismissCookie('accepted'); });
    if (declineBtn) declineBtn.addEventListener('click', function () { dismissCookie('declined'); });
  }

  /* ─── CUSTOM CURSOR ─── */
  (function initCursor() {
    // Only on non-touch, desktop devices
    if (window.matchMedia('(hover:none)').matches || window.matchMedia('(pointer:coarse)').matches) return;
    if (window.innerWidth < 1024) return;
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // AbortController for cleanup
    var cursorAC = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var sigOpts = cursorAC ? { signal: cursorAC.signal } : {};

    // Hide default cursor
    document.body.style.cursor = 'none';
    var interactiveSelector = 'a,button,[role="tab"],[role="button"],.mega-card,.vc-card,.news-card,.station-marker,.basin';
    document.querySelectorAll(interactiveSelector).forEach(function (el) {
      el.style.cursor = 'none';
    });

    var mx = -100, my = -100, rx = -100, ry = -100;
    var isHover = false;
    var cursorRafId = null;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    }, sigOpts);

    // Smooth follow for ring
    (function followLoop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      cursorRafId = requestAnimationFrame(followLoop);
    })();

    // Hover effects on interactive elements
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest(interactiveSelector);
      if (t && !isHover) {
        ring.classList.add('hover');
        isHover = true;
      }
    }, sigOpts);
    document.addEventListener('mouseout', function (e) {
      var t = e.target.closest(interactiveSelector);
      if (t && isHover) {
        ring.classList.remove('hover');
        isHover = false;
      }
    }, sigOpts);

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    }, sigOpts);
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }, sigOpts);

    // Cleanup function (available for future SPA integration)
    window.__cleanupCursor = function () {
      if (cursorAC) cursorAC.abort();
      if (cursorRafId) cancelAnimationFrame(cursorRafId);
      if (dot.parentNode) dot.parentNode.removeChild(dot);
      if (ring.parentNode) ring.parentNode.removeChild(ring);
      document.body.style.cursor = '';
    };
  })();

  /* ─── PAGE TRANSITION EFFECT ─── */
  (function initPageTransitions() {
    // Create transition element
    var trans = document.createElement('div');
    trans.className = 'page-transition';
    document.body.appendChild(trans);

    // Intercept internal links for smooth transitions
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
          href.startsWith('http') || link.hasAttribute('download') || link.target === '_blank') return;

      e.preventDefault();
      trans.classList.add('entering');
      setTimeout(function () {
        window.location.href = href;
      }, TIMING.PAGE_TRANSITION);
    });
  })();

  /* ─── MEGA MENU — Dynamic Accent Colors (all megas) ─── */
  (function initMegaAccents() {
    var accents = {
      amont: { color:'var(--amont)', glow:'rgba(46,134,222,0.06)' },
      intermediaire: { color:'var(--midstream)', glow:'rgba(14,165,233,0.06)' },
      aval: { color:'var(--aval)', glow:'rgba(217,119,6,0.06)' },
      gouvernance: { color:'var(--gold)', glow:'rgba(217,168,79,0.06)' },
      filiales: { color:'var(--amont)', glow:'rgba(46,134,222,0.06)' },
      performance: { color:'var(--midstream)', glow:'rgba(14,165,233,0.06)' },
      environnement: { color:'var(--energy)', glow:'rgba(16,185,129,0.06)' },
      social: { color:'var(--amont)', glow:'rgba(46,134,222,0.06)' },
      gouv_esg: { color:'var(--gold)', glow:'rgba(217,168,79,0.06)' },
      carrieres: { color:'var(--amont)', glow:'rgba(46,134,222,0.06)' },
      academy: { color:'var(--tech)', glow:'rgba(139,92,246,0.06)' },
      culture: { color:'var(--energy)', glow:'rgba(16,185,129,0.06)' },
      technologies: { color:'var(--tech)', glow:'rgba(139,92,246,0.06)' },
      energies: { color:'var(--energy)', glow:'rgba(16,185,129,0.06)' },
      petrochimie: { color:'var(--petro)', glow:'rgba(225,29,72,0.06)' }
    };

    allMegaDrops.forEach(function(drop) {
      var tabList = drop.querySelector('.mega-tabs');
      var tabs = drop.querySelectorAll('.mega-tab');
      if (!tabList || !tabs.length) return;

      function updateAccent(tabName) {
        var a = accents[tabName]; if (!a) return;
        drop.style.setProperty('--mega-accent', a.color);
        drop.style.setProperty('--mega-glow', a.glow);
      }
      function updateTabIndicator() {
        var at = tabList.querySelector('.mega-tab.active'); if (!at) return;
        var lr = tabList.getBoundingClientRect();
        var tr = at.getBoundingClientRect();
        tabList.style.setProperty('--tab-y', (tr.top - lr.top) + 'px');
        tabList.style.setProperty('--tab-h', tr.height + 'px');
      }

      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          var tn = tab.getAttribute('data-tab');
          setTimeout(function() { updateAccent(tn); updateTabIndicator(); }, TIMING.ACCENT_UPDATE);
        });
      });

      var at = tabList.querySelector('.mega-tab.active');
      if (at) {
        updateAccent(at.getAttribute('data-tab'));
        var obs = new MutationObserver(function() {
          if (drop.classList.contains('active')) setTimeout(updateTabIndicator, TIMING.TAB_INDICATOR);
        });
        obs.observe(drop, { attributes:true, attributeFilter:['class'] });
      }
    });
  })();

  /* ─── KPI LOADER ─── */
  (function initKPILoader() {
    function resolveKPIPath() {
      // Detect if we're in a subdirectory (e.g., /operations/, /services/)
      var path = window.location.pathname;
      var depth = (path.match(/\//g) || []).length;
      // Root pages have 1 slash (/), subdirectory pages have 2+ slashes (/operations/aval)
      return depth > 2 ? '../data/kpis.json' : 'data/kpis.json';
    }

    function loadKPIs(jsonFile) {
      fetch(resolveKPIPath())
        .then(function(response) {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(function(data) {
          // Find all elements with data-kpi attribute and update their content
          document.querySelectorAll('[data-kpi]').forEach(function(el) {
            var kpiKey = el.getAttribute('data-kpi');
            var value = data[kpiKey];
            if (value !== undefined) {
              // Handle nested objects (e.g., data.production.national_2024.value)
              if (typeof value === 'object' && value.value !== undefined) {
                el.textContent = value.value;
              } else if (typeof value === 'object') {
                el.textContent = JSON.stringify(value);
              } else {
                el.textContent = value;
              }
            }
          });
        })
        .catch(function(error) {
          // Fail silently — hardcoded values remain as fallback
          console.debug('KPI loader: could not fetch ' + jsonFile, error);
        });
    }

    loadKPIs('kpis.json');
  })();

})();

/* ═══════════════════════════════════════════════════════════════
   SERVICE WORKER REGISTRATION — Offline Caching & Performance
   ═══════════════════════════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      /* SW registered */
    }).catch(function(error) {
      /* SW registration failed */
    });
  });
}
