/* ═══════════════════════════════════════════════════════════════════════
   EnerTchad Ultra-Premium JS — Corporate Excellence
   Custom cursor · Particles · Search · Counters · Parallax · Tilt · Magnetic
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. CUSTOM CURSOR ─── */
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = 0, my = 0, dx = 0, dy = 0;
    var ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      dot.classList.add('visible');
      ring.classList.add('visible');
    });

    function animateRing() {
      ringX += (mx - ringX) * 0.12;
      ringY += (my - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    var hovers = document.querySelectorAll('a, button, .mega-card, .glass-card, .tilt-card, [role="tab"], input, textarea');
    hovers.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });

    document.addEventListener('mouseleave', function () {
      dot.classList.remove('visible');
      ring.classList.remove('visible');
    });
  }

  /* ─── 2. HERO PARTICLES ─── */
  function initParticles() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var count = Math.min(80, Math.floor(window.innerWidth / 20));

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217,168,79,' + p.o + ')';
        ctx.fill();

        // Connect nearby particles
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(217,168,79,' + (0.06 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─── 3. GLOBAL SEARCH ─── */
  function initSearch() {
    var PAGES = [
      { title: 'Accueil', titleEn: 'Home', url: 'index.html', icon: 'fa-home', cat: 'Page', desc: 'Page d\'accueil EnerTchad Groupe' },
      { title: 'Well Services & Workover', url: 'services/well-services.html', icon: 'fa-wrench', cat: 'Services des Champs', desc: 'Interventions, EOR actif, optimisation puits' },
      { title: 'Drilling & Engineering', url: 'services/drilling.html', icon: 'fa-oil-well', cat: 'Services des Champs', desc: 'Forage directionnel, ingénierie puits' },
      { title: 'Digital & SCADA', url: 'services/digital.html', icon: 'fa-microchip', cat: 'Services des Champs', desc: 'IoT, IA, jumeaux numériques, cybersécurité' },
      { title: 'Consulting & Formation', url: 'services/consulting.html', icon: 'fa-graduation-cap', cat: 'Services des Champs', desc: 'EnerAcademy, expertise technique' },
      { title: 'Amont — Exploration & Production', url: 'operations/amont.html', icon: 'fa-mountain', cat: 'Société Pétrolière', desc: 'Exploration, production, bassins sédimentaires' },
      { title: 'Intermédiaire — Pipeline & Raffinage', url: 'operations/intermediaire.html', icon: 'fa-industry', cat: 'Société Pétrolière', desc: 'Transport, raffinage, logistique' },
      { title: 'Aval — Distribution & Retail', url: 'operations/aval.html', icon: 'fa-gas-pump', cat: 'Société Pétrolière', desc: 'Stations-service, distribution, négoce' },
      { title: 'Technologies', url: 'operations/technologies.html', icon: 'fa-flask', cat: 'Innovation', desc: 'R&D, brevets, technologies propriétaires' },
      { title: 'EnerTchad GreenTech', url: 'operations/greentech.html', icon: 'fa-bolt', cat: 'Innovation', desc: 'Transition énergétique, solaire, biogaz, hybride' },
      { title: 'Groupe', url: 'groupe/index.html', icon: 'fa-building', cat: 'Corporate', desc: 'Gouvernance, histoire, leadership' },
      { title: 'Durabilité & ESG', url: 'durabilite.html', icon: 'fa-leaf', cat: 'Corporate', desc: 'RSE, environnement, communautés' },
      { title: 'Talents & Carrières', url: 'talents.html', icon: 'fa-users', cat: 'Corporate', desc: 'Recrutement, EnerAcademy, culture' },
      { title: 'Actualités', url: 'actualites.html', icon: 'fa-newspaper', cat: 'Corporate', desc: 'Communiqués, presse, événements' },
      { title: 'Investisseurs', url: 'investisseurs.html', icon: 'fa-chart-pie', cat: 'Corporate', desc: 'Relations investisseurs, données financières' },
      { title: 'Contact', url: 'contact.html', icon: 'fa-envelope', cat: 'Corporate', desc: 'Formulaire de contact, coordonnées' },
      { title: 'Distribution', url: 'distribution/index.html', icon: 'fa-truck', cat: 'Société Pétrolière', desc: 'Réseau stations-service ultra-premium' },
    ];

    // Determine base path
    var depth = 0;
    var path = window.location.pathname;
    if (path.match(/\/(services|operations|groupe|distribution)\//)) depth = 1;
    var prefix = depth ? '../' : '';

    // Build overlay HTML
    var overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'searchOverlay';
    overlay.innerHTML =
      '<div class="search-container">' +
        '<div class="search-input-wrap">' +
          '<i class="fas fa-search"></i>' +
          '<input type="text" class="search-input" id="searchInput" placeholder="Rechercher sur EnerTchad..." autocomplete="off"/>' +
        '</div>' +
        '<div class="search-results" id="searchResults"></div>' +
        '<div class="search-kbd"><kbd>Esc</kbd> pour fermer &middot; <kbd>&uarr;</kbd><kbd>&darr;</kbd> naviguer &middot; <kbd>Enter</kbd> ouvrir</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var activeIdx = -1;

    function openSearch() {
      overlay.classList.add('active');
      input.value = '';
      results.innerHTML = '';
      activeIdx = -1;
      setTimeout(function () { input.focus(); }, 100);
    }
    function closeSearch() {
      overlay.classList.remove('active');
      input.blur();
    }

    function fuzzy(query, text) {
      query = query.toLowerCase();
      text = text.toLowerCase();
      if (text.indexOf(query) >= 0) return true;
      var qi = 0;
      for (var ti = 0; ti < text.length && qi < query.length; ti++) {
        if (text[ti] === query[qi]) qi++;
      }
      return qi === query.length;
    }

    function renderResults(q) {
      if (!q) { results.innerHTML = ''; activeIdx = -1; return; }
      var matches = PAGES.filter(function (p) {
        return fuzzy(q, p.title) || fuzzy(q, p.desc) || fuzzy(q, p.cat) || (p.titleEn && fuzzy(q, p.titleEn));
      }).slice(0, 8);

      results.innerHTML = matches.map(function (m, i) {
        return '<a class="search-result-item' + (i === 0 ? ' active' : '') + '" href="' + prefix + m.url + '">' +
          '<div class="sr-icon"><i class="fas ' + m.icon + '"></i></div>' +
          '<div class="sr-text"><h4>' + m.title + '</h4><p>' + m.cat + ' — ' + m.desc + '</p></div>' +
        '</a>';
      }).join('');
      activeIdx = matches.length > 0 ? 0 : -1;
    }

    input.addEventListener('input', function () {
      renderResults(this.value.trim());
    });

    // Keyboard navigation
    overlay.addEventListener('keydown', function (e) {
      var items = results.querySelectorAll('.search-result-item');
      if (e.key === 'Escape') { closeSearch(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeIdx < items.length - 1) activeIdx++;
        items.forEach(function (el, i) { el.classList.toggle('active', i === activeIdx); });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeIdx > 0) activeIdx--;
        items.forEach(function (el, i) { el.classList.toggle('active', i === activeIdx); });
      }
      if (e.key === 'Enter' && activeIdx >= 0 && items[activeIdx]) {
        window.location.href = items[activeIdx].href;
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });

    // Ctrl/Cmd+K shortcut
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('active')) closeSearch();
        else openSearch();
      }
    });

    // Expose for header button
    window.openSearch = openSearch;
    window.closeSearch = closeSearch;
  }

  /* ─── 4. ANIMATED COUNTERS & COUNTER-ANIMATED ─── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observed = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed.has(entry.target)) {
          observed.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) { observer.observe(el); });

    function animateCounter(el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var prefix = el.dataset.prefix || '';
      var duration = 2000;
      var start = performance.now();

      function step(now) {
        var t = Math.min((now - start) / duration, 1);
        var ease = 1 - Math.pow(1 - t, 4); // easeOutQuart
        var val = Math.round(target * ease);
        el.textContent = prefix + val.toLocaleString('fr-FR') + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  /* ─── 4B. COUNTER-ANIMATED (GSAP-POWERED) ─── */
  function initGsapCounters() {
    if (typeof gsap === 'undefined') return;
    var counterElements = document.querySelectorAll('.counter-animated');
    if (!counterElements.length) return;

    counterElements.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      var obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onUpdate: function () {
          var rounded = Math.round(obj.value);
          el.textContent = rounded.toLocaleString('fr-FR') + suffix;
        },
        onComplete: function () {
          el.textContent = target.toLocaleString('fr-FR') + suffix;
        }
      });
    });
  }

  /* ─── 5. ENHANCED REVEAL ON SCROLL ─── */
  function initReveals() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ─── 5B. STAGGERED CHILDREN REVEALS (GSAP) ─── */
  function initStaggeredChildren() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var containers = document.querySelectorAll('.stagger-children');
    if (!containers.length) return;

    containers.forEach(function (container) {
      var children = container.querySelectorAll('.reveal');
      if (children.length <= 1) return;

      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        onEnter: function () {
          gsap.fromTo(
            children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out'
            }
          );
        },
        once: true
      });
    });
  }

  /* ─── 6. PARALLAX EFFECT ─── */
  function initParallax() {
    var items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;

    function update() {
      var scrollY = window.scrollY;
      items.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0.1;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - window.innerHeight / 2) * speed;
        el.style.transform = 'translateY(' + offset + 'px)';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─── 7. 3D TILT CARDS ─── */
  function initTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    var cards = document.querySelectorAll('.tilt-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      });
    });
  }

  /* ─── 8. MAGNETIC BUTTONS ─── */
  function initMagnetic() {
    if (window.matchMedia('(hover: none)').matches) return;
    var items = document.querySelectorAll('.magnetic');
    items.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ─── 9. SMOOTH PAGE TRANSITIONS ─── */
  function initPageTransitions() {
    var links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"]):not(.no-transition)');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('javascript')) return;
        e.preventDefault();
        document.body.classList.add('page-transitioning');
        setTimeout(function () {
          window.location.href = href;
        }, 300);
      });
    });
    // Fade in on load
    window.addEventListener('pageshow', function () {
      document.body.classList.remove('page-transitioning');
    });
  }

  /* ─── 9B. KPI COUNTERS (HOMEPAGE) ─── */
  function initKpiCounters() {
    if (typeof gsap === 'undefined') return;
    var kpiElements = document.querySelectorAll('.kpi-num');
    if (!kpiElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.getAttribute('data-animated')) {
          entry.target.setAttribute('data-animated', 'true');
          animateKpi(entry.target);
        }
      });
    }, { threshold: 0.3 });

    kpiElements.forEach(function (el) { observer.observe(el); });

    function animateKpi(el) {
      var text = el.textContent.trim();
      var numberMatch = text.match(/[\d,]+/);
      if (!numberMatch) return;

      var cleanNumber = parseInt(numberMatch[0].replace(/,/g, ''), 10);
      if (isNaN(cleanNumber)) return;

      var suffix = text.replace(/[\d,]/g, '').trim();
      var obj = { value: 0 };

      gsap.to(obj, {
        value: cleanNumber,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          var rounded = Math.round(obj.value);
          el.textContent = rounded.toLocaleString('fr-FR') + (suffix ? ' ' + suffix : '');
        },
        onComplete: function () {
          el.textContent = cleanNumber.toLocaleString('fr-FR') + (suffix ? ' ' + suffix : '');
        }
      });
    }
  }

  /* ─── 10. PREMIUM SCROLL-TO-TOP ─── */
  function initScrollTop() {
    var existing = document.getElementById('scrollTop');
    if (existing) existing.style.display = 'none'; // hide old one

    var btn = document.createElement('button');
    btn.className = 'scroll-top-premium';
    btn.setAttribute('aria-label', 'Retour en haut');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 11. HEADER SEARCH BUTTON ─── */
  function initHeaderSearch() {
    var actions = document.querySelector('.header-actions');
    if (!actions) return;
    var searchBtn = document.createElement('button');
    searchBtn.className = 'search-trigger';
    searchBtn.setAttribute('aria-label', 'Rechercher');
    searchBtn.innerHTML = '<i class="fas fa-search"></i>';
    actions.insertBefore(searchBtn, actions.firstChild);

    searchBtn.addEventListener('click', function () {
      if (window.openSearch) window.openSearch();
    });
  }

  /* ─── 12. STRUCTURED DATA INJECTION ─── */
  function injectStructuredData() {
    // Only on service/operation pages
    var path = window.location.pathname;
    var services = [
      { path: '/services/well-services', name: 'Well Services & Workover', desc: 'Completion, intervention, workover et EOR actif sur les champs tchadiens.' },
      { path: '/services/drilling', name: 'Drilling & Engineering', desc: 'Forage directionnel, slim-hole, gestion rig et ingénierie puits.' },
      { path: '/services/digital', name: 'Digital & SCADA', desc: 'SCADA terrain, IoT, IA prédictive, jumeaux numériques, cybersécurité OT.' },
      { path: '/services/consulting', name: 'Consulting & Formation', desc: 'EnerAcademy, conseil technique, stratégies brownfield & EOR.' },
    ];

    services.forEach(function (s) {
      if (path.indexOf(s.path) >= 0) {
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.name,
          description: s.desc,
          provider: {
            '@type': 'Organization',
            name: 'EnerTchad Groupe',
            url: 'https://enertchad-groupe.vercel.app'
          },
          areaServed: { '@type': 'Country', name: 'Chad' }
        });
        document.head.appendChild(script);
      }
    });
  }

  /* ─── INIT ALL ─── */
  function init() {
    initCursor();
    initParticles();
    initSearch();
    initCounters();
    initGsapCounters(); // Enhanced counter animation
    initReveals();
    initStaggeredChildren(); // Staggered card reveals
    initParallax();
    initTilt();
    initMagnetic();
    initKpiCounters(); // KPI homepage counters
    initPageTransitions();
    initScrollTop();
    // initHeaderSearch();  // HEADER_CLEANUP 2026-04-20 — bouton search retiré du header (site 7 pages, Ctrl+K suffit)
    injectStructuredData();
    initNewsletterRedirect();
  }

  /* ─── Newsletter footer redirect to /newsletter.html with email prefill ─── */
  function initNewsletterRedirect(){
    var forms = document.querySelectorAll('form.newsletter-modern[data-redirect]');
    forms.forEach(function(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var target = f.getAttribute('data-redirect') || 'newsletter.html';
        var input = f.querySelector('input[type="email"]');
        var email = input && input.value ? encodeURIComponent(input.value.trim()) : '';
        var prefix = /\/(operations|services|distribution|groupe)\//.test(location.pathname) ? '../' : '';
        var url = prefix + target + (email ? ('?email=' + email + '#nl-form') : '#nl-form');
        window.location.href = url;
      });
    });
    if(/newsletter\.html/.test(location.pathname)){
      try{
        var params = new URLSearchParams(location.search);
        var e = params.get('email');
        if(e){
          var em = document.querySelector('#nlForm input[name="email"]');
          if(em){ em.value = e; em.focus(); }
        }
      }catch(_){}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
