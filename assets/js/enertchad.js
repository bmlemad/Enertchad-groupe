/**
 * EnerTchad SA · enertchad.js v2.1
 * Single JS — scroll progress, reveal, counters, drawer, ⌘K palette, back-to-top, active nav
 */
(function(){
  'use strict';
  function rafThrottle(fn) {
    let ticking = false;
    return function() {
      if (!ticking) {
        requestAnimationFrame(() => {
          fn.apply(this, arguments);
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. Scroll progress bar ─────────────────────────── */
  function initScrollProgress(){ /* tracer deleted · DG R47 */ }

  /* ─── 2. Reveal on scroll ────────────────────────────── */
  function initReveal(){
    const els = document.querySelectorAll('.reveal, .reveal-on-scroll, .reveal-stagger');
    if (!els.length) return;
    if (reduce) {
      els.forEach(e => {
        e.classList.add('in');
        e.classList.add('is-revealed');
      });
      return;
    }
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((ents) => {
        ents.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            e.target.classList.add('is-revealed');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(e => obs.observe(e));
    } else {
      els.forEach(e => { e.classList.add('in'); e.classList.add('is-revealed'); });
    }
  }

  /* ─── 2b. Card 3D-tilt on hover (V3 motion premium) ─── */
  function initCardTilt(){
    if (reduce) return;
    const cards = document.querySelectorAll('[data-tilt], .card-tilt-dyn');
    if (!cards.length) return;
    cards.forEach(card => {
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const cx = r.width / 2;
          const cy = r.height / 2;
          const x = e.clientX - r.left - cx;
          const y = e.clientY - r.top - cy;
          const rx = (-y / cy) * 4;
          const ry = (x / cx) * 4;
          card.style.transform = `perspective(1000px) translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
          raf = null;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
      });
    });
  }

  /* ─── 14. Theme toggle (V6 dark mode) ─────────────────── */
  function initThemeToggle(){
    const root = document.documentElement;
    const stored = localStorage.getItem('enertchad-theme');
    if (stored === 'light' || stored === 'dark') {
      root.setAttribute('data-theme', stored);
    }
    const langSwitch = document.querySelector('.header-lang-switch');
    if (!langSwitch || document.querySelector('.theme-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Basculer le theme clair/sombre');
    btn.setAttribute('type', 'button');
    btn.innerHTML = '<span class="icon-moon" aria-hidden="true">\u263E</span><span class="icon-sun" aria-hidden="true">\u2600</span>';
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('enertchad-theme', next);
    });
    langSwitch.parentNode.insertBefore(btn, langSwitch);
  }

  /* ─── 15. Skip-to-main (V12 a11y) ─────────────────────── */
  function initSkipToMain(){
    if (document.querySelector('.skip-to-main')) return;
    const skip = document.createElement('a');
    skip.href = '#main';
    skip.className = 'skip-to-main';
    skip.textContent = 'Aller au contenu principal';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* ─── 16. Bottom nav mobile (V10 native feel) ────────── */
  function initBottomNavMobile(){
    if (document.querySelector('.bottom-nav-mobile')) return;
    if (window.innerWidth > 768) return; // desktop · skip injection
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav-mobile';
    nav.setAttribute('aria-label', 'Navigation rapide mobile');
    nav.innerHTML = `
      <div class="bottom-nav-mobile-inner">
        <a href="/" class="bottom-nav-item" data-bn="home">
          <span class="bottom-nav-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 12L12 4l9 8M5 10v10h4v-6h6v6h4V10"/></svg></span>
          <span>Accueil</span>
        </a>
        <a href="/solutions/" class="bottom-nav-item" data-bn="solutions">
          <span class="bottom-nav-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></span>
          <span>Activités</span>
        </a>
        <a href="/data/atlas.html" class="bottom-nav-item" data-bn="atlas">
          <span class="bottom-nav-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></svg></span>
          <span>Atlas</span>
        </a>
        <a href="/engagement/investisseurs.html" class="bottom-nav-item bottom-nav-item-cta" data-bn="tour">
          <span class="bottom-nav-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg></span>
          <span>Tour 2026</span>
        </a>
      </div>
    `;
    document.body.appendChild(nav);
    // Mark active item from current path
    const path = location.pathname;
    nav.querySelectorAll('.bottom-nav-item').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (href !== '/' && path.startsWith(href.replace(/index\.html$/, '')))) {
        a.classList.add('is-active');
      }
    });
    // Haptic feedback on tap (where supported)
    if ('vibrate' in navigator) {
      nav.querySelectorAll('.bottom-nav-item').forEach(a => {
        a.addEventListener('click', () => navigator.vibrate(8));
      });
    }
  }

  /* ─── 17. Story scroll progress bar (V5 storytelling) ── */
  function initStoryProgress(){
    // Only on pages with .story-section (opt-in)
    if (!document.querySelector('.story-section')) return;
    if (document.querySelector('.story-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'story-progress';
    bar.innerHTML = '<div class="story-progress-bar"></div>';
    document.body.appendChild(bar);
    const fill = bar.querySelector('.story-progress-bar');
    function update(){
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
    window.addEventListener('scroll', rafThrottle(update), { passive: true });
    update();
  }

  /* ─── 18. Nav tools enhancement (Doc 111 Round 6) ────── */
  function initNavToolsEnhance(){
    // 1. Mega-menu close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-item-mega .mega-panel.open').forEach(p => {
          p.classList.remove('open');
        });
      }
    });

    // 2. Mega-menu close on outside click
    document.addEventListener('click', (e) => {
      const mega = document.querySelector('.nav-item-mega:hover, .nav-item-mega:focus-within');
      if (!mega && !e.target.closest('.nav-item-mega')) {
        document.querySelectorAll('.mega-panel.open').forEach(p => p.classList.remove('open'));
      }
    });

    // 3. Drawer focus trap when open
    const drawer = document.querySelector('.mobile-drawer');
    if (drawer) {
      drawer.addEventListener('keydown', (e) => {
        if (!drawer.classList.contains('open')) return;
        if (e.key === 'Tab') {
          const focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        if (e.key === 'Escape') {
          drawer.classList.remove('open');
          const toggle = document.querySelector('.drawer-toggle');
          if (toggle) toggle.focus();
        }
      });
    }

    // 4. Cmd+/ to open ⌘K palette as alternative trigger
    document.addEventListener('keydown', (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === '/') {
        e.preventDefault();
        const cmdkModal = document.querySelector('.cmdk-modal');
        if (cmdkModal) {
          cmdkModal.classList.add('open');
          const input = cmdkModal.querySelector('.cmdk-input');
          if (input) setTimeout(() => input.focus(), 50);
        }
      }
    });

    // 5. Improve mobile drawer auto-close on link click
    document.querySelectorAll('.mobile-drawer a').forEach(a => {
      a.addEventListener('click', () => {
        const d = document.querySelector('.mobile-drawer.open');
        if (d) setTimeout(() => d.classList.remove('open'), 150);
      });
    });
  }




  /* ─── 21. ESG Live Counter widget (Doc 123 · Idée 9) ────── */
  function initEsgCounter(){
    if (document.querySelector('.esg-live-counter')) return;
    const utility = document.querySelector('.utility-nav-meta');
    if (!utility) return;
    
    // Compute realistic mock values · daily tick simulation
    const startDate = new Date('2026-04-01');
    const now = new Date();
    const days = Math.max(1, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));
    
    // Approximation : EOR Local actif depuis Q1 2026 · projet roadmap
    const co2_avoided_kt = (days * 0.42).toFixed(1); // tonnes CO2 par jour · réaliste petit Tchad
    const etp_formed = Math.min(50 + Math.floor(days * 0.13), 200); // EnerAcademy
    
    const widget = document.createElement('div');
    widget.className = 'esg-live-counter';
    widget.setAttribute('aria-label', 'Compteur ESG live · CO₂ évité et ETP formés');
    widget.innerHTML = `
      <span title="CO₂ évité depuis Q1 2026">CO₂ ↓ <strong>${co2_avoided_kt}t</strong></span>
      <span title="ETP formés EnerAcademy">ETP ↑ <strong>${etp_formed}</strong></span>
    `;
    utility.insertBefore(widget, utility.firstChild);
  }

  /* ─── 20. A11y AAA Sprint 2 · forms + tables (Doc 113) ──── */
  function initA11ySprint2(){
    // Auto-add aria-required + autocomplete to form inputs based on attributes
    document.querySelectorAll('input[required], textarea[required], select[required]').forEach(el => {
      if (!el.hasAttribute('aria-required')) el.setAttribute('aria-required', 'true');
      // Add autocomplete hints based on common name attrs
      if (!el.hasAttribute('autocomplete')) {
        const name = (el.getAttribute('name') || '').toLowerCase();
        const type = (el.getAttribute('type') || '').toLowerCase();
        if (name.includes('email') || type === 'email') el.setAttribute('autocomplete', 'email');
        else if (name.includes('phone') || type === 'tel') el.setAttribute('autocomplete', 'tel');
        else if (name.includes('first') || name.includes('prenom')) el.setAttribute('autocomplete', 'given-name');
        else if (name.includes('last') || name.includes('nom')) el.setAttribute('autocomplete', 'family-name');
        else if (name.includes('company') || name.includes('societe') || name.includes('organisation')) el.setAttribute('autocomplete', 'organization');
        else if (name.includes('country') || name.includes('pays')) el.setAttribute('autocomplete', 'country-name');
        else if (name.includes('city') || name.includes('ville')) el.setAttribute('autocomplete', 'address-level2');
        else if (name.includes('zip') || name.includes('postal')) el.setAttribute('autocomplete', 'postal-code');
      }
    });

    // Auto-add caption + scope to data tables that lack them
    document.querySelectorAll('table:not([data-no-caption])').forEach(table => {
      // Only enrich if has thead or has data-table class
      const thead = table.querySelector('thead');
      const isData = table.classList.contains('data-table') || table.classList.contains('atlas-table') || table.classList.contains('cadastre-table');
      if (!thead && !isData) return;

      // Add scope to th elements
      table.querySelectorAll('thead th').forEach(th => {
        if (!th.hasAttribute('scope')) th.setAttribute('scope', 'col');
      });
      table.querySelectorAll('tbody th').forEach(th => {
        if (!th.hasAttribute('scope')) th.setAttribute('scope', 'row');
      });

      // Add caption if absent · derive from preceding heading
      if (!table.querySelector('caption')) {
        let prev = table.previousElementSibling;
        let captionText = null;
        while (prev && !captionText) {
          if (/^H[1-6]$/i.test(prev.tagName)) {
            captionText = prev.textContent.trim().slice(0, 80);
            break;
          }
          prev = prev.previousElementSibling;
        }
        if (captionText) {
          const caption = document.createElement('caption');
          caption.textContent = captionText;
          caption.className = 'sr-only-focusable';
          table.insertBefore(caption, table.firstChild);
        }
      }
    });

    // Add lang="en" tag to spans containing English-only terms (mixed-language a11y)
    // Skip · too risky to auto-detect

    // Add aria-live="polite" to ticker for screen reader announcements
    const ticker = null; /* tracer deleted DG R51 */
    if (ticker && !ticker.hasAttribute('aria-live')) {
      ticker.setAttribute('aria-live', 'off'); // off · marquee should not announce
      ticker.setAttribute('aria-atomic', 'false');
    }
  }

  /* ─── 19. Modern 2026 · Navigation API + View Transitions cross-doc ─── */
  function initModernNavigation(){
    // Opt-in cross-document view transitions for same-origin links
    if (!('startViewTransition' in document)) return;
    
    // Intercept clicks on internal links · trigger SPA-feel transition
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      // Only same-origin · no hash · no _blank · no download · no modifier keys
      if (!href || href.startsWith('http') || href.startsWith('//') ||
          href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
          link.target === '_blank' || link.hasAttribute('download') ||
          e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      
      // Cross-doc View Transitions API · let browser handle if same-origin nav
      // (no JS interception needed for cross-doc; meta tag already signals support)
      // This block can later host SPA-style transitions if we ever migrate.
    }, { capture: true });
    
    // Performance · use Speculation Rules API hints (declarative, no JS)
    // Already injected via <script type="speculationrules"> in HTML head.
    
    // Performance · prefetch on hover (older browsers fallback)
    if (!('SpeculationRules' in window || 'speculationrules' in HTMLScriptElement.prototype)) {
      let prefetched = new Set();
      document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.href;
        if (!href || prefetched.has(href) || !href.startsWith(location.origin)) return;
        const linkEl = document.createElement('link');
        linkEl.rel = 'prefetch';
        linkEl.href = href;
        document.head.appendChild(linkEl);
        prefetched.add(href);
      }, { passive: true });
    }
    
    // BFcache friendly · log restored from BFcache
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        // Restored from BFcache · re-init non-persistent state
        document.documentElement.classList.add('bfcache-restored');
        setTimeout(() => document.documentElement.classList.remove('bfcache-restored'), 300);
      }
    });
  }

  /* ─── 3. Number counters ─────────────────────────────── */
  function initCounters(){
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const animate = (el) => {
      const target = parseFloat(el.getAttribute('data-count')) || 0;
      const dur = parseInt(el.getAttribute('data-count-duration')) || 1600;
      const t0 = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 4);
      const tick = (now) => {
        const p = Math.min((now - t0)/dur, 1);
        el.textContent = Math.floor(target * ease(p)).toLocaleString('fr-FR');
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toLocaleString('fr-FR');
      };
      if (reduce) el.textContent = target.toLocaleString('fr-FR');
      else requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((ents) => {
        ents.forEach(e => { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
      }, { threshold: 0.3 });
      els.forEach(e => obs.observe(e));
    } else els.forEach(animate);
  }

  /* ─── 4. Mobile drawer ───────────────────────────────── */
  function initDrawer(){
    const toggle = document.querySelector('.drawer-toggle');
    if (!toggle) return;
    
    // Inject drawer HTML if not present
    let drawer = document.querySelector('.mobile-drawer');
    if (!drawer) {
      drawer = document.createElement('nav');
      drawer.className = 'mobile-drawer';
      drawer.setAttribute('aria-label', 'Menu mobile');
      drawer.innerHTML = `
        <div class="mobile-drawer-panel">
          <button class="drawer-close" aria-label="Fermer le menu">×</button>
          <div class="drawer-corporate-block">
            <div class="drawer-corporate-label">Catégories corporate</div>
            <ul class="drawer-corporate-list">
              <li><a href="${rel('pourquoi/manifeste.html')}">About</a></li>
              <li><a href="${rel('solutions/')}">Activities</a></li>
              <li><a href="${rel('data/atlas.html')}">Markets</a></li>
              <li><a href="${rel('hse/')}">Sustainability</a></li>
              <li><a href="${rel('engagement/investisseurs.html')}">Investors</a></li>
              <li><a href="${rel('engagement/presse.html')}">Newsroom</a></li>
              <li><a href="${rel('engagement/contact.html')}">Contact</a></li>
            </ul>
          </div>
          <h4>Pourquoi</h4>
          <a href="${rel('pourquoi/manifeste.html')}">Manifeste DG</a>
          <a href="${rel('pourquoi/positionnement.html')}">Positionnement</a>
          <a href="${rel('pourquoi/trajectoire.html')}">Trajectoire 2026-2030</a>
          <a href="${rel('pourquoi/equipe.html')}">Équipe & Leadership</a>
          <h4>Solutions</h4>
          <a href="${rel('solutions/')}">10 services</a>
          <a href="${rel('solutions/configurateur.html')}">Configurateur</a>
          <a href="${rel('solutions/calculateur.html')}">Calculateur ROI</a>
          <h4>Opérateurs</h4>
          <a href="${rel('operateurs/')}">6 opérateurs marché</a>
          <a href="${rel('operateurs/cnpcic.html')}">Opérateur Bongor</a>
          <a href="${rel('operateurs/perenco.html')}">Opérateur Doba</a>
          <a href="${rel('operateurs/sht.html')}">opérateur national · État</a>
          <a href="${rel('operateurs/cotco-totco.html')}">opérateurs pipeline · Pipeline</a>
          <a href="${rel('operateurs/srn.html')}">Raffinerie nationale · Raffinerie</a>
          <h4>Data</h4>
          <a href="${rel('data/')}">Hub Data</a>
          <a href="${rel('data/atlas.html')}">Atlas</a>
          <a href="${rel('data/observatoire.html')}">Observatoire</a>
          <a href="${rel('data/dashboard.html')}">Dashboard</a>
          <h4>Engagement</h4>
          <a href="${rel('engagement/investisseurs.html')}">Investisseurs · Tour 2026</a>
          <a href="${rel('engagement/transparence.html')}">Transparence</a>
          <a href="${rel('engagement/presse.html')}">Presse</a>
          <a href="${rel('engagement/contact.html')}">Contact</a>
          <a class="mobile-drawer-cta" href="${rel('engagement/investisseurs.html')}">Tour 2026 · 8-12 M USD ↗</a>
        </div>
      `;
      document.body.appendChild(drawer);
    }
    
    const closeBtn = drawer.querySelector('.drawer-close');
    const open = () => {
      drawer.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    drawer.addEventListener('click', (e) => { if (e.target === drawer) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* Helper: build relative paths from any page depth */
  function rel(path){
    const depth = location.pathname.split('/').filter(p => p && !p.endsWith('.html')).length;
    // If on a /pourquoi/foo.html page → depth = 1 → prefix '../'
    // If on /index.html or / → depth = 0 → prefix './'
    return (depth > 0 ? '../'.repeat(depth) : './') + path;
  }

  /* ─── 5. ⌘K Command palette ──────────────────────────── */
  const PAGES = [
    // ═══ ABOUT ═══
    { cat: 'About', title: '📜 Manifeste DG · expérience immersive', desc: '4 chapitres scroll-driven · parcours · pourquoi Tchad · engagement · Tour 2026', href: 'pourquoi/manifeste-immersif/', icon: '📜' },
    { cat: 'About', title: 'Manifeste DG (texte)', desc: 'Vision fondatrice par Bignéro Le Madang · 17 ans ExxonMobil', href: 'pourquoi/manifeste.html', icon: '📜' },
    { cat: 'About', title: 'Positionnement vs Majors', desc: 'Comparaison Aramco/Shell/Total · différenciation EnerTchad', href: 'pourquoi/positionnement.html', icon: '🎯' },
    { cat: 'About', title: 'Trajectoire 2026-2030', desc: 'Roadmap publique 3 phases · jalons trimestriels', href: 'pourquoi/trajectoire.html', icon: '📈' },
    { cat: 'About', title: 'Équipe & Leadership', desc: 'Profil DG · Advisory Board · 25 fiches Phase 1', href: 'pourquoi/equipe.html', icon: '👥' },
    { cat: 'About', title: 'Talents · LCD diaspora', desc: 'Local Content · 75-90% · EnerAcademy 200 ETP/an', href: 'talents/', icon: '🎓' },
    { cat: 'About', title: '🌍 Diaspora Map · talents tchadiens monde', desc: '500+ ingénieurs Schlumberger · Total · ExxonMobil · Aramco · Petronas · 15 pays', href: 'talents/diaspora-map/', icon: '🌍' },

    // ═══ ACTIVITIES ═══
    { cat: 'Activities', title: 'Catalogue 40+ services', desc: 'Pôles canon + axes transversaux · S/D/C/U/P/T/E/H/W/O', href: 'solutions/', icon: '⚙' },
    { cat: 'Activities', title: '🟢 Amont · Upstream', desc: 'EOR Local OAPI · Brown/Green fields · 11 services', href: 'amont/', icon: '🟢' },
    { cat: 'Activities', title: '🔵 Intermédiaire · Midstream', desc: 'Pipeline Integrity 360° · SCADA · métrologie fiscale', href: 'intermediaire/', icon: '🔵' },
    { cat: 'Activities', title: '🟡 Aval · Distribution', desc: 'D01-D08 + C01-C04 · Mobile Station™ · IRVE 50', href: 'aval/', icon: '🟡' },
    { cat: 'Activities', title: '🟣 Pétrochimie', desc: 'EnerFert™ urée · ammoniac · méthanol · dérivés', href: 'petrochimie/', icon: '🟣' },
    { cat: 'Activities', title: '⚡ Technologies', desc: 'Digital twin · IA · IoT · cybersécurité OT', href: 'technologies/', icon: '⚡' },
    { cat: 'Activities', title: '🌱 Énergies', desc: 'IRVE 50 stations · solaire · transition · CCS', href: 'energies/', icon: '🌱' },
    { cat: 'Activities', title: 'Configurateur services', desc: 'Trouvez votre package en 30 secondes', href: 'solutions/configurateur.html', icon: '🛠' },
    { cat: 'Activities', title: 'Calculateur ROI', desc: 'Simulateur économie services local', href: 'solutions/calculateur.html', icon: '💰' },

    // ═══ MARKETS ═══
    { cat: 'Markets', title: 'Atlas pétrolier Tchad', desc: 'Cadastre exhaustif · 6 opérateurs · cartes interactives', href: 'data/atlas.html', icon: '🗺' },
    { cat: 'Markets', title: '6 opérateurs canon marché', desc: 'CNPCIC · Perenco · SHT · COTCO/TOTCO · SRN · TPC', href: 'data/atlas.html#operateurs', icon: '🏭' },
    { cat: 'Markets', title: 'Sourcing intra-africain', desc: 'Dangote Nigeria · SORAZ Niger · Sonangol · Sonatrach', href: 'sourcing-africain/', icon: '🌍' },
    { cat: 'Markets', title: 'Boutique B2B en ligne', desc: 'D01-D08 catalogue · RFQ 24h · 4 canaux', href: 'boutique/', icon: '🛒' },
    { cat: 'Markets', title: 'Carte stations live', desc: '50 Mobile Station™ CEMAC 2030 · disponibilités RT', href: 'stations/', icon: '📍' },
    { cat: 'Markets', title: 'Pipeline 3D Doba-Kribi', desc: '1 070 km · COTCO/TOTCO · 250 kbpd capacité', href: 'data/oleoduc-3d.html', icon: '🛢' },

    // ═══ SUSTAINABILITY ═══
    { cat: 'Sustainability', title: 'Système Sécurité Intégré', desc: 'PSM + HSE + WMS + OIM · 16 services OIMS-grade', href: 'hse/', icon: '🛡' },
    { cat: 'Sustainability', title: 'Transparence ESG · ITIE', desc: '8 engagements publics ITIE/OHADA/RGPD', href: 'engagement/transparence.html', icon: '📊' },
    { cat: 'Sustainability', title: 'Glossaire & taxonomies', desc: 'Référentiel OFS · OIMS · APIs · ISO · normes', href: 'glossaire.html', icon: '📖' },

    // ═══ INVESTORS ═══
    { cat: 'About', title: '🏷 6 marques™ · portfolio OAPI', desc: 'Mobile Station · EnerClub · NRJ+ · Water-to-Value · EnerAcademy · EnerFert', href: 'marques/', icon: '🏷' },
    { cat: 'About', title: '🏛 À propos · hub identité', desc: 'DG · équipe · trajectoire 2026-2030 · positionnement · talents diaspora · manifeste', href: 'a-propos/', icon: '🏛' },
    { cat: 'Activities', title: '⚡ Activités · 4 pôles + 3 axes', desc: 'Hub canon · 40+ services · 6 marques™ OAPI · architecture complète', href: 'activites/', icon: '⚡' },
    { cat: 'Investors', title: '💼 Investisseurs · hub Tour 2026', desc: 'Live tracker · DG office hours · dataroom · narrative complète', href: 'investisseurs/', icon: '💼' },
    { cat: 'Solutions', title: '🛢 Pipeline 360° · digital twin live demo', desc: 'Doba-Kribi 1070 km · scrubber + 247 capteurs SCADA · IA leak detection km 423 · 8s vs 52min', href: 'intermediaire/pipeline-360-demo/', icon: '🛢' },
    { cat: 'Investors', title: '🤖 AI Concierge DFI · 24/7', desc: 'Premier OFS au monde · assistant IA dataroom complète · 5 langues · citations sources · Powered by Claude', href: 'ai-concierge/', icon: '🤖' },
    { cat: 'Investors', title: '🟢 Tour 2026 · LIVE tracker public', desc: 'Premier OFS au monde · transparence radicale · % closed · MoUs commit live', href: 'tour-live/', icon: '🟢' },
    { cat: 'Investors', title: '📅 DG Office Hours · 30 min direct', desc: 'Réservation directe DG · DFI uniquement · qualification + brief 1-pager auto', href: 'dg-office-hours/', icon: '📅' },
    { cat: 'Investors', title: '★ Tour 2026 · 8-12 M USD', desc: 'Seed/Pre-A · OHADA · closing T3 2026', href: 'engagement/investisseurs.html', icon: '★' },
    { cat: 'Investors', title: 'Dataroom · DD Package', desc: '12 catégories · NDA flow · DFI quick-scan', href: 'dataroom/', icon: '🔐' },
    { cat: 'Investors', title: 'Sitemap visuel corporate', desc: '7 catégories canon · accès rapide investisseur', href: 'sitemap.html', icon: '🗂' },

    // ═══ NEWSROOM ═══
    { cat: 'Newsroom', title: 'Presse · Kit médias', desc: 'Communiqués · photos · contact presse', href: 'engagement/presse.html', icon: '📰' },
    { cat: 'Newsroom', title: 'LinkedIn DG officiel', desc: 'Tribunes hebdo · vision Cap 2030', href: 'https://linkedin.com/company/enertchad-groupe', icon: 'in' },

    // ═══ CONTACT ═══
    { cat: 'Contact', title: 'Réserver 30 min CEO', desc: 'Cal.com · DG direct · 6 emails dédiés', href: 'engagement/contact.html', icon: '📅' },
    { cat: 'Contact', title: 'Mentions légales', desc: 'Éditeur · OHADA · droit applicable', href: 'legal/mentions-legales.html', icon: '⚖' },
    { cat: 'Contact', title: 'Confidentialité · RGPD', desc: 'RGPD + droit tchadien · DPO', href: 'legal/confidentialite.html', icon: '🔒' },

    // ═══ QUICK ACTIONS ═══
    { cat: 'Quick Actions', title: '⚡ Term Sheet OHADA', desc: 'Tour 2026 · structure deal', href: 'engagement/investisseurs.html#term-sheet', icon: '⚡' },
    { cat: 'Quick Actions', title: '⚡ Brief One-Pager DFI', desc: 'PDF investisseur · 1 page synthèse', href: 'dataroom/', icon: '⚡' },
    { cat: 'Quick Actions', title: '⚡ Cas opérateurs', desc: '5 templates · Brown/Green fields canon', href: 'amont/#cas', icon: '⚡' },
  ];

  function initCmdK(){
    // Trigger UI handled by Vague Q2 initVisibleSearch() (.nav-search) — legacy .cmdk-trigger removed (no double button)
    
    // Inject modal
    if (document.querySelector('.cmdk-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'cmdk-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Recherche rapide');
    modal.innerHTML = `
      <div class="cmdk-panel">
        <input class="cmdk-input" type="text" placeholder="Rechercher dans le site… (essayez 'investisseurs', 'opérateur amont 1', 'manifeste')" aria-label="Recherche" />
        <div class="cmdk-results"></div>
        <div class="cmdk-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span>
          <span><kbd>↵</kbd> ouvrir</span>
          <span><kbd>esc</kbd> fermer</span>
          <span style="margin-left:auto">${PAGES.length} pages indexées</span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    const input = modal.querySelector('.cmdk-input');
    const resultsBox = modal.querySelector('.cmdk-results');
    let activeIdx = 0;
    let visible = [];
    
    function render(query) {
      const q = query.trim().toLowerCase();
      visible = q ? PAGES.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) || 
        p.cat.toLowerCase().includes(q)
      ) : PAGES;
      activeIdx = 0;
      
      if (!visible.length) {
        resultsBox.innerHTML = '<div class="cmdk-empty">Aucun résultat pour <strong>' + escapeHTML(q) + '</strong></div>';
        return;
      }
      resultsBox.innerHTML = visible.map((p, i) => `
        <a class="cmdk-result ${i === 0 ? 'active' : ''}" href="${rel(p.href)}" data-idx="${i}">
          <span class="cmdk-result-cat">${p.cat}</span>
          <div class="cmdk-result-text">
            <div class="cmdk-result-title">${p.title}</div>
            <div class="cmdk-result-desc">${p.desc}</div>
          </div>
          <span class="cmdk-result-arrow">→</span>
        </a>
      `).join('');
    }
    
    function setActive(idx) {
      const items = resultsBox.querySelectorAll('.cmdk-result');
      items.forEach(el => el.classList.remove('active'));
      activeIdx = Math.max(0, Math.min(idx, items.length - 1));
      if (items[activeIdx]) {
        items[activeIdx].classList.add('active');
        items[activeIdx].scrollIntoView({block: 'nearest'});
      }
    }
    
    input.addEventListener('input', e => render(e.target.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIdx - 1); }
      else if (e.key === 'Enter') {
        const items = resultsBox.querySelectorAll('.cmdk-result');
        if (items[activeIdx]) location.href = items[activeIdx].href;
      } else if (e.key === 'Escape') closeCmdK();
    });
    modal.addEventListener('click', e => { if (e.target === modal) closeCmdK(); });
    render('');
    
    function openCmdK() {
      modal.classList.add('open');
      setTimeout(() => input.focus(), 100);
    }
    function closeCmdK() {
      modal.classList.remove('open');
    }
    
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (modal.classList.contains('open')) closeCmdK();
        else openCmdK();
      }
    });
  }

  /* ─── 6. Back-to-top floating button ─────────────────── */
  function initBackToTop(){
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Retour en haut');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    
    const toggle = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      btn.classList.toggle('visible', scrollTop > 600);
    };
    window.addEventListener('scroll', rafThrottle(toggle), {passive:true});
    btn.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: reduce ? 'auto' : 'smooth'});
    });
    toggle();
  }

  /* ─── 7. Active nav state ────────────────────────────── */
  function initActiveNav(){
    const path = location.pathname;
    document.querySelectorAll('.nav a, .mobile-drawer a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      // Normalize: trailing slash, .html
      const normalized = href.replace(/\/$/, '/index.html');
      if (path.endsWith(href) || path.endsWith(normalized)) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ─── 8. Year auto-update ───────────────────────────── */
  function initYear(){
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  }


  /* ─── 9. Service Worker registration ─────────────────── */
  function initSW(){
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').catch(err => console.warn('[SW]', err));
    }
  }


  /* ─── 10. Footer accordéons mobile ───────────────────── */
  function initFooterAccordion(){
    if (window.innerWidth > 560) return;
    document.querySelectorAll('.footer-col').forEach(col => {
      const h4 = col.querySelector('h4');
      if (h4) h4.addEventListener('click', () => col.classList.toggle('open'));
    });
  }


  /* ─── 11. Cookie banner RGPD ─────────────────────────── */
  function initCookieBanner(){
    if (localStorage.getItem('et-cookie-choice')) return;
    
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Préférences cookies');
    banner.innerHTML = `
      <div class="cookie-banner-text">
        <strong>Transparence cookies.</strong> Notre site n'utilise <strong>aucun cookie de traçage</strong>. Analytics via analytics RGPD self-hosted (sans cookies, données agrégées). 
        <a href="/legal/cookies.html">En savoir plus</a>
      </div>
      <div class="cookie-banner-actions">
        <button class="cookie-banner-btn cookie-banner-btn-decline" data-choice="decline">Refuser</button>
        <button class="cookie-banner-btn cookie-banner-btn-accept" data-choice="accept">OK, compris</button>
      </div>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 800);
    
    banner.querySelectorAll('[data-choice]').forEach(b => {
      b.addEventListener('click', () => {
        localStorage.setItem('et-cookie-choice', b.dataset.choice);
        localStorage.setItem('et-cookie-choice-at', new Date().toISOString());
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 500);
      });
    });
  }

  /* ─── 12. analytics RGPD custom events on CTAs ────────────── */
  function initAnalytics(){
    if (typeof window.plausible !== 'function') return;
    document.querySelectorAll('[data-track]').forEach(el => {
      el.addEventListener('click', () => {
        try { window.plausible(el.dataset.track); } catch(e){}
      });
    });
    // Track key CTAs implicitly
    document.querySelectorAll('a.cta-btn').forEach(el => {
      const href = el.getAttribute('href') || '';
      let event = null;
      if (href.includes('cal.com')) event = 'CTA-CalCom';
      else if (href.includes('mailto:invest')) event = 'CTA-EmailInvest';
      else if (href.includes('mailto:talents')) event = 'CTA-EmailTalents';
      else if (href.includes('mailto:presse')) event = 'CTA-EmailPresse';
      else if (href.includes('investisseurs')) event = 'CTA-Investisseurs';
      if (event) el.addEventListener('click', () => { try { window.plausible(event); } catch(e){} });
    });
  }

  /* ─── INIT ──────────────────────────────────────────── */

  /* ─── Q-C/B. Scrolled body class + Pôle context (Vague Q) ─ */
  function initStickyShrink(){
    const onScroll = () => {
      if (window.pageYOffset > 80) document.body.classList.add('scrolled');
      else document.body.classList.remove('scrolled');
    };
    window.addEventListener('scroll', rafThrottle(onScroll), {passive:true});
    onScroll();
  }
  function initPoleContext(){
    // Auto-detect pôle from URL path → set body[data-pole] for nav coloring
    const path = location.pathname.toLowerCase();
    let pole = null;
    if (path.match(/cnpcic|perenco|amont|upstream|sht\.html|equipe|positionnement|manifeste|trajectoire|investisseurs/)) pole = null; // ambiguous, leave default
    if (path.match(/cnpcic|perenco|amont/)) pole = 'amont';
    else if (path.match(/cotco|totco|atlas|oleoduc|observatoire|dashboard|pipeline/)) pole = 'intermediaire';
    else if (path.match(/srn|aval|downstream|raffinerie/)) pole = 'aval';
    if (pole) document.body.setAttribute('data-pole', pole);
  }

  /* ─── Q-D. Tour 2026 CTA pulse + status label ──────────── */
  function initTourPulse(){ /* tracer/ticker deleted · DG R51 */ }

  /* ─── Q-G. Sub-nav 3 pôles canon filter ────────────────── */
  function initSubnavPoles(){
    // Auto-inject sub-nav on pages that have data-pole-card cards
    const cards = document.querySelectorAll('[data-pole-card], .card-pole[data-pole]');
    if (cards.length < 3) return; // only if enough cards to filter
    
    // Skip if the page already has the subnav-poles
    if (document.querySelector('.subnav-poles')) return;

    // Tag cards if using card-pole instead of data-pole-card
    cards.forEach(c => {
      if (!c.hasAttribute('data-pole-card')) {
        const p = c.getAttribute('data-pole');
        if (p) c.setAttribute('data-pole-card', p);
      }
    });

    // Build sub-nav DOM
    const nav = document.createElement('nav');
    nav.className = 'subnav-poles';
    nav.setAttribute('aria-label', 'Filtre 3 pôles canon');
    nav.innerHTML = `
      <div class="subnav-poles-list">
        <span class="pole-filter-label">Filtrer par pôle :</span>
        <button data-pole="all" aria-pressed="true"><span class="dot"></span>Tous</button>
        <button data-pole="amont" aria-pressed="false"><span class="dot"></span>Amont</button>
        <button data-pole="intermediaire" aria-pressed="false"><span class="dot"></span>Intermédiaire</button>
        <button data-pole="aval" aria-pressed="false"><span class="dot"></span>Aval</button>
        <button data-pole="petrochimie" aria-pressed="false"><span class="dot"></span>Pétrochimie</button>
        <span class="subnav-poles-count" aria-live="polite"></span>
      </div>
    `;
    
    // Insert after main subnav if exists, else after header
    const existingSubnav = document.querySelector('.subnav');
    const header = document.querySelector('.site-header');
    if (existingSubnav) existingSubnav.insertAdjacentElement('afterend', nav);
    else if (header) header.insertAdjacentElement('afterend', nav);
    else return;

    const buttons = nav.querySelectorAll('button');
    const countEl = nav.querySelector('.subnav-poles-count');
    
    const updateCount = (filter) => {
      const total = cards.length;
      const visible = filter === 'all' ? total : Array.from(cards).filter(c => {
        const p = c.getAttribute('data-pole-card') || c.getAttribute('data-pole');
        return p === filter;
      }).length;
      countEl.textContent = filter === 'all' ? `${total} éléments` : `${visible} sur ${total}`;
    };
    updateCount('all');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-pole');
        buttons.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        cards.forEach(c => {
          const p = c.getAttribute('data-pole-card') || c.getAttribute('data-pole');
          if (target === 'all' || p === target) c.classList.remove('pole-hidden');
          else c.classList.add('pole-hidden');
        });
        updateCount(target);
      });
    });
  }


  /* ─── Q2-E. Persona switcher · merged into investor-ticker (Doc 111 NAV-MERGE) ── */
  function initPersonaBar(){
    return; /* R110 disabled · persona widget retiré */
    if (document.querySelector('.persona-bar')) return;
    
    // Try to inject INTO the investor-ticker (homepage merged bar)
    const ticker = null; // tracer/ticker deleted · DG R51
    const personaInner = `
      <span class="persona-bar-label">Vue adaptée pour</span>
      <div class="persona-bar-list" role="tablist">
        <button data-persona="all" aria-pressed="true"><span class="persona-icon">⊞</span><span class="persona-name">Tous</span></button>
        <button data-persona="investor" aria-pressed="false"><span class="persona-icon">💼</span><span class="persona-name">Investisseur</span></button>
        <button data-persona="operator" aria-pressed="false"><span class="persona-icon">🛢</span><span class="persona-name">Opérateur</span></button>
        <button data-persona="press" aria-pressed="false"><span class="persona-icon">📰</span><span class="persona-name">Presse</span></button>
        <button data-persona="talent" aria-pressed="false"><span class="persona-icon">🎓</span><span class="persona-name">Talent</span></button>
      </div>
    `;
    
    let bar;
    if (ticker) {
      // Merged mode: prepend persona zone INTO the ticker container
      /* ticker deleted · noop · DG R51 */
      bar = document.createElement('div');
      bar.className = 'persona-bar persona-bar-inline';
      bar.innerHTML = `<div class="persona-bar-inner">${personaInner}</div>`;
      ticker.insertBefore(bar, ticker.firstChild);
    } else {
      // Fallback standalone mode
      bar = document.createElement('div');
      bar.className = 'persona-bar';
      bar.innerHTML = `<div class="persona-bar-inner">${personaInner}</div>`;
      document.body.insertBefore(bar, document.body.firstChild);
    }

    const STORAGE_KEY = 'enertchad-persona';
    let saved = null;
    try { saved = sessionStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (saved) document.body.setAttribute('data-persona', saved);
    
    const buttons = bar.querySelectorAll('button');
    if (saved) {
      buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.persona === saved ? 'true' : 'false'));
    }
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.persona;
        buttons.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        if (target === 'all') {
          document.body.removeAttribute('data-persona');
          try { sessionStorage.removeItem(STORAGE_KEY); } catch(e) {}
        } else {
          document.body.setAttribute('data-persona', target);
          try { sessionStorage.setItem(STORAGE_KEY, target); } catch(e) {}
        }
      });
    });
  }

  /* ─── M. Mega-menu ULTRA-ULTRA (Vague M) ─────────────── */
  function initMegaMenu(){
    const navLinks = document.querySelectorAll('.site-header .nav a');
    if (!navLinks.length) return;
    
    // Detect current page for is-current highlighting
    const currentPath = location.pathname.replace(/\/$/, '') || '/';

    const PANELS_FR = {

      // ═══ NAV v9 · Aramco-grade groupées ═══
      'activities': {
        intro: { icon: '⚙', label: 'Activités · 4 pôles + 3 axes', desc: '40+ codes services · 16 OIMS-grade Sécurité · marques™ OAPI', stat: '40+', statLabel: 'services' },
        pole: 'activities',
        sections: [
          {
            title: '4 Pôles canon (services)',
            count: '4',
            links: [
              { href: '/amont/', strong: '🟢 Amont', small: 'Amont · Brown/Green fields · EOR Local · 8 services', icon: '🟢', pole: 'amont' },
              { href: '/intermediaire/', strong: '🔵 Intermédiaire', small: 'Intermédiaire · Pipeline Integrity 360° · SCADA · métrologie', icon: '🔵', pole: 'intermediaire' },
              { href: '/aval/', strong: '🟡 Aval', small: 'Aval D&C · D01-D08 + C01-C04 · Mobile Station™', icon: '🟡', pole: 'aval' },
              { href: '/petrochimie/', strong: '🟣 Pétrochimie', small: 'EnerFert™ urée · ammoniac · méthanol · dérivés', icon: '🟣', pole: 'petrochimie' },
            ]
          },
          {
            title: '3 Axes transversaux',
            count: '3',
            links: [
              { href: '/technologies/', strong: '⚡ Technologies', small: 'Digital twin · IA · IoT · cybersécurité OT · T01-T12', icon: '⚡', pole: 'technologies' },
              { href: '/energies/', strong: '🌱 Énergies', small: 'IRVE 50 stations · solaire · transition · CCS roadmap', icon: '🌱', pole: 'energies' },
              { href: '/hse/', strong: '🛡 Sécurité Intégrée', small: 'PSM + HSE + WMS + OIM · 16 services OIMS-grade', icon: '🛡', pole: 'hse' },
            ]
          },
          {
            title: 'Catalogue & Marques™',
            count: '3',
            links: [
              { href: '/solutions/', strong: '★ Catalogue services', small: '40+ codes unifiés · S/D/C/U/P/T/E/H/W/O', icon: '📋', pole: 'solutions' },
              { href: '/glossaire.html', strong: '6 marques™ OAPI', small: 'Mobile Station™ · EnerClub™ · NRJ+™ · Water-to-Value™ · EnerAcademy™ · EnerFert™', icon: '™', pole: 'solutions' },
              { href: '/glossaire.html', strong: 'Glossaire & taxonomies', small: 'Référentiel OFS · OIMS · APIs · ISO · normes', icon: '📖', pole: 'solutions' },
            ]
          }
        ],
        featured: { title: '★ Tour 2026 · 8-12 M USD', desc: '40+ services · OHADA · closing T3 2026 · 6 KPIs ESG', cta: 'Découvrir →', href: '/engagement/investisseurs.html', thumb: '★', badgeLive: true }
      },
      'atlas-group': {
        intro: { icon: '🗺', label: 'Marchés · Atlas Tchad', desc: 'TAM 1,8 Md USD · 6 opérateurs canon · 4 corridors AfCFTA · 50 stations CEMAC', stat: '1,8 Md', statLabel: 'USD TAM' },
        pole: 'atlas-group',
        sections: [
          {
            title: 'Atlas & Cadastre Tchad',
            count: '4',
            links: [
              { href: '/data/atlas.html', strong: '🗺 Atlas pétrolier', small: 'Cadastre exhaustif · 6 opérateurs · cartes interactives', icon: '🗺', pole: 'atlas' },
              { href: '/data/atlas.html#operateurs', strong: '6 Opérateurs marché', small: 'CNPCIC · Perenco · SHT · COTCO/TOTCO · SRN · TPC', icon: '🏭', pole: 'atlas' },
              { href: '/data/atlas.html#pipeline', strong: 'Pipeline 1 070 km', small: 'Doba → Kribi · COTCO/TOTCO · 250 kbpd capacité', icon: '🛢', pole: 'atlas' },
              { href: '/data/atlas.html#raffinerie', strong: 'Raffinerie Djermaya', small: 'SRN · 20 000 bpd · CNPCIC + État', icon: '⚗', pole: 'atlas' },
            ]
          },
          {
            title: 'Sourcing & Boutique B2B',
            count: '3',
            links: [
              { href: '/sourcing-africain/', strong: '🌍 Sourcing intra-africain', small: 'Dangote Nigeria · SORAZ Niger · Sonangol Angola · Sonatrach Algérie · ZLECAF', icon: '🌍', pole: 'sourcing' },
              { href: '/boutique/', strong: '🛒 Boutique B2B', small: 'D01-D08 catalogue · RFQ 24h · 4 canaux C01-C04', icon: '🛒', pole: 'boutique' },
              { href: '/sourcing-africain/#corridors', strong: '4 Corridors AfCFTA', small: 'Logistique régionale · ZLECAF · douanes optimisées', icon: '🛣', pole: 'sourcing' },
            ]
          },
          {
            title: 'Réseau & Stations',
            count: '3',
            links: [
              { href: '/stations/', strong: '📍 Carte stations live', small: '50 Mobile Station™ CEMAC 2030 · disponibilités produits temps réel', icon: '📍', pole: 'stations' },
              { href: '/energies/#irve', strong: '⚡ 50 IRVE CEMAC 2030', small: 'CCS2/CHAdeMO 50 kW · first-mover', icon: '⚡', pole: 'energies' },
              { href: '/aval/#u06', strong: 'U06 · Mobile Station™', small: 'Brevet OAPI · 50 stations CEMAC 2030', icon: '🚉', pole: 'aval' },
            ]
          }
        ],
        featured: { title: 'Marché 1,8 Md USD TAM', desc: '6 opérateurs canon · TAM/SAM/SOM 2030 · accès cadastre', cta: 'Atlas →', href: '/data/atlas.html', thumb: '🗺', badgeLive: false }
      },
      // ═══ Anciennes clés · conservées (deep-link compat + sub-nav) ═══

      'amont': {
        intro: { icon: '🟢', label: 'Services Amont', desc: 'Services E&P · EOR · HSE pour opérateurs amont', stat: '22M', statLabel: 'USD 2030' },
        pole: 'amont',
        sections: [
          {
            title: '🟤 Brown · Champs matures',
            count: '3+',
            links: [
              { href: '/amont/#brown-services', strong: 'S02 · EOR Local', small: '+6-17% OOIP · 5 ressources tchadiennes · OAPI Q3 2026', icon: '🧪', pole: 'amont' },
              { href: '/amont/#brown-services', strong: 'S03 · HSE industriel', small: 'Process safety · ISO 45001 · API RP 75', icon: '🛡', pole: 'amont' },
              { href: '/amont/#brown-services', strong: 'S16 · Workover (2029)', small: '30+ puits matures · 1 rig acquis ou loué', icon: '⚙', pole: 'amont', badge: 'NEW' },
              { href: '/amont/#brown-services', strong: 'S17 · P&A (2030)', small: 'Plug & Abandonment · gisements épuisés', icon: '🔒', pole: 'amont' },
            ]
          },
          {
            title: '🟢 Green · Champs neufs',
            count: '3+',
            links: [
              { href: '/amont/#green-services', strong: 'S01 · E&P Géosciences', small: 'Sismique 2D/3D · modélisation · FDP', icon: '🛢', pole: 'amont' },
              { href: '/amont/#green-services', strong: 'S11 · Drilling Fluids (2027)', small: 'Mud engineering · MWD/LWD support', icon: '⚗', pole: 'amont', badge: 'NEW' },
              { href: '/amont/#green-services', strong: 'S12 · Wellsite Sup (2027)', small: 'Company man pool · day-rate', icon: '👷', pole: 'amont', badge: 'NEW' },
              { href: '/amont/#green-services', strong: 'S13 · Cementing (2028)', small: '1 cement unit · pas d\'acteur local', icon: '🧱', pole: 'amont' },
            ]
          }
        ],
        featured: { title: 'Programme EOR Local', desc: '5 ressources tchadiennes · brevet OAPI Q3 2026', cta: 'Découvrir →', href: '/solutions/', thumb: '🌿', badgeLive: false }
      },
      'intermediaire': {
        intro: { icon: '🔵', label: 'Services Intermédiaire', desc: 'Services intégrité pipeline · SCADA · métrologie', stat: '12M', statLabel: 'USD 2030' },
        pole: 'intermediaire',
        sections: [
          {
            title: '🟤 Brown · Pipelines matures',
            count: '3+',
            links: [
              { href: '/intermediaire/', strong: 'S04 · Inspection ILI', small: 'Pigging MFL/UT · API 1163', icon: '🔍', pole: 'intermediaire' },
              { href: '/intermediaire/', strong: 'S05 · SCADA modernisation', small: 'Leak detection · API 1130 · 6 stations', icon: '📊', pole: 'intermediaire' },
              { href: '/intermediaire/', strong: 'S06 · Métrologie fiscale', small: 'LACT · audit pertes · API MPMS', icon: '⚖', pole: 'intermediaire' },
              { href: '/intermediaire/', strong: '★ Pipeline Integrity 360°', small: 'Bundle S04+S05+S06 + IA corrosion', icon: '🛡', pole: 'intermediaire', badge: 'TOUR' },
            ]
          },
          {
            title: '🟢 Green · Infrastructures neuves',
            count: '3',
            links: [
              { href: '/intermediaire/', strong: 'FEED · pre-FEED', small: 'Concept selection · CAPEX classe 3-2', icon: '📐', pole: 'intermediaire' },
              { href: '/intermediaire/', strong: 'Construction supervision', small: 'Cathodic protection · welding inspection', icon: '🔧', pole: 'intermediaire' },
              { href: '/intermediaire/', strong: 'SCADA greenfield', small: 'Conception + déploiement + commissioning', icon: '🆕', pole: 'intermediaire' },
            ]
          }
        ],
        featured: { title: 'Pipeline Integrity 360°', desc: 'IA leak detection · MoU opérateur amont 2 en discussion', cta: 'En savoir plus →', href: '/solutions/', thumb: '🔗', badgeLive: false }
      },
      'aval': {
        intro: { icon: '🟡', label: 'Aval · Distribution & Commercialisation', desc: 'Distribution + Commercialisation tous produits pétroliers et dérivés · D01-D08 + C01-C04', stat: 'D+C', statLabel: '12 codes' },
        pole: 'aval',
        sections: [
          {
            title: 'Services Aval',
            count: '2',
            links: [
              { href: '/boutique/', strong: '★ Boutique en ligne', small: 'Catalogue D01-D08 · RFQ 24h · 4 canaux C01-C04', icon: '🛒', pole: 'aval', badge: 'NEW' },
              { href: '/sourcing-africain/', strong: '🌍 Sourcing intra-africain', small: 'Dangote · SORAZ Niger · Sonangol Angola · Sonatrach Algérie · ZLECAF', icon: '🌍', pole: 'aval', badge: 'NEW' },
              { href: '/stations/', strong: '📍 Carte stations · live', small: '50 Mobile Station™ CEMAC 2030 · disponibilités produits temps réel', icon: '📍', pole: 'aval', badge: 'LIVE' },
              { href: '/aval/#dist', strong: 'D01 · Carburants liquides', small: 'Essence · gazole · jet A1 · kérosène', icon: '⛽', pole: 'aval' },
              { href: '/aval/#dist', strong: 'D02 · LPG/GPL', small: 'Butane · propane · bouteilles + vrac', icon: '🔥', pole: 'aval' },
              { href: '/aval/#dist', strong: 'D04 · Lubrifiants', small: '15W-40 · 5W-30 · ISO VG · API SN/SP · 12 000 t/an', icon: '⚗', pole: 'aval' },
              { href: '/aval/#dist', strong: 'D05 · Bitumes & asphaltes', small: 'Routier · modifié polymère · BTP CEMAC', icon: '🛣', pole: 'aval' },
              { href: '/aval/#dist', strong: 'D08 · Dérivés petchem retail', small: 'EnerFert™ · méthanol · ammoniac dilué', icon: '🟣', pole: 'aval' },
              { href: '/aval/#u06', strong: 'U06 · Mobile Station™ + IRVE', small: 'Brevet OAPI · 50 stations CEMAC 2030', icon: '🚉', pole: 'aval' },
              { href: '/aval/#comm', strong: 'C01-C04 · Commercialisation', small: 'B2B Industriels · Transports · B2C Retail · Export CEMAC', icon: '📈', pole: 'aval' },
            ]
          },
          {
            title: 'Opérateurs · Raffinerie & Distribution',
            count: '1',
            links: [
              { href: '/operateurs/srn.html', strong: 'Raffinerie nationale', small: 'Raffinerie · JV opérateurs (~60/40)', icon: '🏭', pole: 'aval' },
            ]
          }
        ],
        featured: { title: 'Premier IRVE CEMAC', desc: 'Mobile Station™ · 50 kW CCS2/CHAdeMO · brevet OAPI', cta: 'Découvrir →', href: '/solutions/', thumb: '⚡', badgeLive: false }
      },
      'petrochimie': {
        intro: { icon: '🟣', label: 'Services Pétrochimie', desc: 'Services HSE · inspection · maintenance unités petchem', stat: 'P01-P08', statLabel: 'services' },
        pole: 'petrochimie',
        sections: [
          {
            title: '🟤 Brown · Optimisation existant',
            count: '3',
            links: [
              { href: '/petrochimie/', strong: 'P04 · HSE Process Safety', small: 'PHA · HAZOP · LOPA · API RP 14C · IEC 61511', icon: '🛡', pole: 'petrochimie' },
              { href: '/petrochimie/', strong: 'P05 · Inspection NDT', small: 'API 510 · 570 · 653 · ASME VIII', icon: '🔍', pole: 'petrochimie' },
              { href: '/petrochimie/', strong: 'P06 · Maintenance turnaround', small: 'TAR · catalyst change · contractor mgmt', icon: '🔧', pole: 'petrochimie' },
            ]
          },
          {
            title: '🟢 Green · Nouvelles unités 2028+',
            count: '5',
            links: [
              { href: '/petrochimie/', strong: 'P01 · Engrais N (urée/ammoniac)', small: 'FEED unité 50 kt/an · agriculture Tchad', icon: '🌾', pole: 'petrochimie', badge: 'NEW' },
              { href: '/petrochimie/', strong: 'P02 · Méthanol GTL', small: 'Anti-flaring routine · marché CEMAC', icon: '⚗', pole: 'petrochimie', badge: 'NEW' },
              { href: '/petrochimie/', strong: 'P03 · Polymères basiques', small: 'PEHD/PP small-scale · substitution import', icon: '🧬', pole: 'petrochimie' },
              { href: '/petrochimie/', strong: 'P07 · EnerFert™ marque', small: 'Marque OAPI 2027 · distribution agriculteurs', icon: '🌱', pole: 'petrochimie', badge: 'NEW' },
            ]
          }
        ],
        featured: { title: 'Anti-flaring + EnerFert™', desc: 'Valoriser 100% gaz associé Tchad · double impact ESG + revenus', cta: 'Découvrir →', href: '/petrochimie/', thumb: '🟣', badgeLive: false }
      },
      'technologies': {
        intro: { icon: '⚙', label: 'Axe Technologies', desc: 'IA · Cyber-OT · IoT · Digital twin', stat: '8', statLabel: 'piliers' },
        pole: 'technologies',
        sections: [
          {
            title: 'Stack technologique transversale',
            count: '6',
            links: [
              { href: '/technologies/', strong: 'IA & Machine Learning', small: 'Maintenance prédictive · digital twin réservoirs · 30% downtime', icon: '🧠', pole: 'intermediaire' },
              { href: '/technologies/', strong: 'IoT industriel', small: 'Capteurs LoRa · télémétrie 24/7 sites isolés', icon: '📡', pole: 'intermediaire' },
              { href: '/technologies/', strong: 'Digital twin', small: 'Jumeau numérique 3D temps-réel · Doba/Bongor/raffinerie nationale', icon: '🔮', pole: 'intermediaire' },
              { href: '/technologies/', strong: 'Drones surveillance', small: 'Inspection ROW pipeline 1 070 km · IA détection corrosion', icon: '🚁', pole: 'intermediaire' },
            ]
          },
          {
            title: 'Services & Solutions umbrella',
            count: '4',
            links: [
              { href: '/solutions/', strong: 'S07 · Cyber-OT MSSP', small: 'SOC 24/7 · IDS OT majors · IEC 62443-3-3 · Purdue', icon: '🛡', pole: 'intermediaire' },
              { href: '/solutions/', strong: 'S08 · Sécurité Physique IA', small: 'Caméras 4K + IA · drones ROW · périmétrie biométrique ATEX', icon: '🎥', pole: 'intermediaire' },
              { href: '/solutions/', strong: 'U03 Cyber-OT MSSP', small: 'Solution umbrella packagée 24/7 OT · cible opérateurs aval/midstream/amont', icon: '🔒', pole: 'intermediaire' },
              { href: '/solutions/', strong: 'U04 Sécurité Périmétrique', small: 'Solution umbrella drones+biométrie+AR/VR formation HSE', icon: '🏛', pole: 'intermediaire' },
            ]
          }
        ],
        featured: { title: 'Voir le pôle Technologies', desc: 'Stack complète · IEC 62443 · ISO 27001 · IDS OT leaders', cta: 'Explorer →', href: '/technologies/', thumb: '⚙', badgeLive: false }
      },
      'energies': {
        intro: { icon: '🌱', label: 'Axe Énergies · 3 horizons', desc: 'IRVE · BESS · H2 vert · 30% renouvelables', stat: '125', statLabel: 'MW 2030' },
        pole: 'energies',
        sections: [
          {
            title: 'Stratégie 3 horizons · transition',
            count: '3',
            links: [
              { href: '/energies/', strong: 'Horizon 1 · 2026-2030', small: 'Conventionnel cash cow · 125 MW Tchad · EOR Local', icon: '🛢', pole: 'amont' },
              { href: '/energies/', strong: 'Horizon 2 · 2030-2035', small: 'Transition gaz/IRVE · 30% renouvelables · BESS · 50 stations CEMAC', icon: '⚡', pole: 'aval' },
              { href: '/energies/', strong: 'Horizon 3 · 2035+', small: 'Hydrogène vert · électrolyse · pilote R&D 2027', icon: '🌱', pole: 'amont' },
            ]
          },
          {
            title: 'Initiatives & U05',
            count: '3',
            links: [
              { href: '/energies/', strong: 'U05 · Renouvelables Hybrides', small: 'Solaire + BESS + Gas-to-power · sites isolés · mini-grids communautés', icon: '☀', pole: 'amont' },
              { href: '/energies/', strong: 'Anti-flaring zéro routine', small: 'Récupération gaz associé · GHG -45% vs majors · 12 kg CO2/baril 2030', icon: '🔥', pole: 'amont' },
              { href: '/energies/', strong: 'REDD+ carbone biodiversité', small: 'Crédits carbone partenaire ONG biodiversité régional · biodiversité Doba', icon: '🌳', pole: 'amont' },
            ]
          }
        ],
        featured: { title: 'Voir le pôle Énergies', desc: 'IRVE first-mover CEMAC · 50 stations 50 kW CCS2/CHAdeMO', cta: 'Explorer →', href: '/energies/', thumb: '🌱', badgeLive: false }
      },
      'atlas': {
        intro: { icon: '🗺', label: 'Atlas marché Tchad', desc: 'Note: pas d assets EnerTchad · OFS Tchad (E&P = projet futur)', stat: 'ℹ', statLabel: 'note' },
        pole: 'atlas',
        sections: [
          {
            title: 'Atlas marché Tchad (assets opérateurs tiers)',
            count: '2',
            links: [
              { href: '/data/atlas.html', strong: 'Atlas O&G Tchad', small: 'Marché : 5 bassins · pipeline 1 070 km · 1 raffinerie · 3 pôles canon', icon: '🗺', pole: 'intermediaire' },
              { href: '/data/oleoduc-3d.html', strong: 'Pipeline 1 070 km', small: 'opérateurs pipeline · Doba-Kribi · 6 stations pompage', icon: '📍', pole: 'intermediaire' },
            ]
          },
          {
            title: 'Indicateurs marché & EnerTchad',
            count: '2',
            links: [
              { href: '/data/dashboard.html', strong: 'Dashboard live', small: 'KPIs marché Tchad · pipeline commercial EnerTchad', icon: '📈', badge: 'LIVE' },
              { href: '/data/observatoire.html', strong: 'Observatoire marché', small: 'Veille O&G Tchad · prix baril · tendances · pas d assets EnerTchad', icon: '🔭', badge: null },
            ]
          }
        ],
        featured: { title: 'Note · EnerTchad · OFS Tchad', desc: 'Ambition progressive OFS Tchad (E&P = projet futur). Atlas présente le marché Tchad, pas un portefeuille EnerTchad.', cta: 'Comprendre →', href: '/pourquoi/trajectoire.html', thumb: 'ℹ', badgeLive: false }
      },
      'engagement': {
        intro: { icon: '💼', label: 'Engagement · Pourquoi · Tour 2026', desc: 'Vision · Investisseurs · ESG/RSE · Services HSE H01-H08 · Presse', stat: '8-12', statLabel: 'M USD Tour' },
        pole: 'engagement',
        sections: [
          {
            title: 'Pourquoi · Vision & Stratégie',
            count: '4',
            links: [
              { href: '/pourquoi/manifeste.html', strong: 'Manifeste DG', small: 'Vision fondatrice par Bignéro Le Madang', icon: '📜', badge: null },
              { href: '/pourquoi/positionnement.html', strong: 'Positionnement', small: 'EnerTchad · positionnement marché Tchad', icon: '🎯', badge: null },
              { href: '/pourquoi/trajectoire.html', strong: 'Trajectoire 2026-2030', small: 'Roadmap OFS · expansion catalogue', icon: '🗺', badge: 'NEW' },
              { href: '/pourquoi/equipe.html', strong: 'Équipe & Leadership', small: 'Profil DG · Advisory Board · 25 ETP Phase 1', icon: '👥', badge: null },
            ]
          },
          {
            title: 'Investissement & Engagements',
            count: '5',
            links: [
              { href: '/engagement/investisseurs.html', strong: 'Tour 2026 · Investisseurs', small: '8-12 M USD · OHADA · DD package · War Room live', icon: '💼', badge: 'TOUR' },
              { href: '/dataroom/', strong: '🔒 Dataroom · DD Package', small: '12 catégories · accès NDA OHADA · 24-48h · DFI · IFC · Proparco', icon: '🔒', badge: 'NEW' },
              { href: '/engagement/transparence.html', strong: 'ESG · RSE · ITIE', small: '3 piliers · 6 KPIs · GRI Standards · TCFD · UN Global Compact · ITIE Tchad', icon: '🌍', badge: 'NEW' },
              { href: '/hse/', strong: '🛡 Système Sécurité Intégré · 16 services', small: 'PSM · HSE · WMS · OIM · OIMS-grade ExxonMobil · H01-H08 + W01-W04 + O01-O04', icon: '🛡', badge: 'NEW' },
              { href: '/talents/', strong: '🤝 Talents · LCD', small: 'Diaspora pétrolière tchadienne · EnerAcademy™ · 4 programmes · 6 KPIs LCD', icon: '🤝', badge: 'NEW' },
              { href: '/engagement/presse.html', strong: 'Presse', small: 'Communiqués · médias · DG quotes', icon: '📰', badge: null },
              { href: '/engagement/contact.html', strong: 'Contact', small: 'N\'Djamena · cal.com · LinkedIn', icon: '✉', badge: null },
            ]
          }
        ],
        featured: { title: 'Closing T3 2026', desc: 'Sièges Tour Seed/Pre-A · DFI lead', cta: 'Term sheet →', href: '/engagement/investisseurs.html', thumb: '🎯', badgeLive: true }
      }
    };

    const PANELS_EN = {

      // ═══ NAV v9 EN · Aramco-grade groupées ═══
      'activities': {
        intro: { icon: '⚙', label: 'Activities · 4 poles + 3 axes', desc: '40+ service codes · 16 OIMS-grade Safety · OAPI marks™', stat: '40+', statLabel: 'services' },
        pole: 'activities',
        sections: [
          {
            title: '4 Canonical Poles',
            count: '4',
            links: [
              { href: '/en/amont/', strong: '🟢 Upstream', small: 'Brown/Green fields · Local EOR · 8 services', icon: '🟢', pole: 'amont' },
              { href: '/en/intermediaire/', strong: '🔵 Midstream', small: 'Pipeline Integrity 360° · SCADA · metering', icon: '🔵', pole: 'intermediaire' },
              { href: '/en/aval/', strong: '🟡 Downstream', small: 'D&C · D01-D08 + C01-C04 · Mobile Station™', icon: '🟡', pole: 'aval' },
              { href: '/en/petrochimie/', strong: '🟣 Petrochemicals', small: 'EnerFert™ urea · ammonia · methanol · derivatives', icon: '🟣', pole: 'petrochimie' },
            ]
          },
          {
            title: '3 Cross-cutting Axes',
            count: '3',
            links: [
              { href: '/en/technologies/', strong: '⚡ Technologies', small: 'Digital twin · AI · IoT · OT cybersecurity · T01-T12', icon: '⚡', pole: 'technologies' },
              { href: '/en/energies/', strong: '🌱 Energies', small: 'EVCS 50 stations · solar · transition · CCS roadmap', icon: '🌱', pole: 'energies' },
              { href: '/en/hse/', strong: '🛡 Integrated Safety', small: 'PSM + HSE + WMS + OIM · 16 services OIMS-grade', icon: '🛡', pole: 'hse' },
            ]
          },
          {
            title: 'Catalog & Marks™',
            count: '3',
            links: [
              { href: '/en/solutions/', strong: '★ Service catalog', small: '40+ unified codes · S/D/C/U/P/T/E/H/W/O', icon: '📋', pole: 'solutions' },
              { href: '/en/glossaire.html', strong: '6 OAPI marks™', small: 'Mobile Station™ · EnerClub™ · NRJ+™ · Water-to-Value™ · EnerAcademy™ · EnerFert™', icon: '™', pole: 'solutions' },
              { href: '/en/glossaire.html', strong: 'Glossary & taxonomies', small: 'OFS reference · OIMS · APIs · ISO · standards', icon: '📖', pole: 'solutions' },
            ]
          }
        ],
        featured: { title: '★ Tour 2026 · 8-12 M USD', desc: '40+ services · OHADA · closing Q3 2026 · 6 ESG KPIs', cta: 'Discover →', href: '/en/engagement/investisseurs.html', thumb: '★', badgeLive: true }
      },
      'atlas-group': {
        intro: { icon: '🗺', label: 'Markets · Chad Atlas', desc: 'TAM 1.8 B USD · 6 canonical operators · 4 AfCFTA corridors · 50 CEMAC stations', stat: '1.8 B', statLabel: 'USD TAM' },
        pole: 'atlas-group',
        sections: [
          {
            title: 'Atlas & Chad Cadastre',
            count: '4',
            links: [
              { href: '/en/data/atlas.html', strong: '🗺 Petroleum Atlas', small: 'Comprehensive cadastre · 6 operators · interactive maps', icon: '🗺', pole: 'atlas' },
              { href: '/en/data/atlas.html#operateurs', strong: '6 Market operators', small: 'CNPCIC · Perenco · SHT · COTCO/TOTCO · SRN · TPC', icon: '🏭', pole: 'atlas' },
              { href: '/en/data/atlas.html#pipeline', strong: 'Pipeline 1,070 km', small: 'Doba → Kribi · COTCO/TOTCO · 250 kbpd capacity', icon: '🛢', pole: 'atlas' },
              { href: '/en/data/atlas.html#raffinerie', strong: 'Djermaya Refinery', small: 'SRN · 20,000 bpd · CNPCIC + State', icon: '⚗', pole: 'atlas' },
            ]
          },
          {
            title: 'Sourcing & B2B Shop',
            count: '3',
            links: [
              { href: '/en/sourcing-africain/', strong: '🌍 Intra-African sourcing', small: 'Dangote Nigeria · SORAZ Niger · Sonangol Angola · Sonatrach Algeria · AfCFTA', icon: '🌍', pole: 'sourcing' },
              { href: '/en/boutique/', strong: '🛒 B2B Shop', small: 'D01-D08 catalog · 24h RFQ · 4 channels C01-C04', icon: '🛒', pole: 'boutique' },
              { href: '/en/sourcing-africain/#corridors', strong: '4 AfCFTA Corridors', small: 'Regional logistics · AfCFTA · optimized customs', icon: '🛣', pole: 'sourcing' },
            ]
          },
          {
            title: 'Network & Stations',
            count: '3',
            links: [
              { href: '/en/stations/', strong: '📍 Live stations map', small: '50 Mobile Station™ CEMAC 2030 · real-time product availability', icon: '📍', pole: 'stations' },
              { href: '/en/energies/#irve', strong: '⚡ 50 EVCS CEMAC 2030', small: 'CCS2/CHAdeMO 50 kW · first-mover', icon: '⚡', pole: 'energies' },
              { href: '/en/aval/#u06', strong: 'U06 · Mobile Station™', small: 'OAPI patent · 50 stations CEMAC 2030', icon: '🚉', pole: 'aval' },
            ]
          }
        ],
        featured: { title: 'Market 1.8 B USD TAM', desc: '6 canonical operators · TAM/SAM/SOM 2030 · cadastre access', cta: 'Atlas →', href: '/en/data/atlas.html', thumb: '🗺', badgeLive: false }
      },

      'amont': {
        intro: { icon: '🟢', label: 'Upstream Services', desc: 'E&P · EOR · HSE services to upstream operators', stat: '22M', statLabel: 'USD 2030' },
        pole: 'amont',
        sections: [
          {
            title: 'Upstream Services',
            count: '3',
            links: [
              { href: '/en/solutions/?pole=amont', strong: 'S01 · E&P Geosciences', small: 'Reservoir characterization · seismic · 2D/3D modeling', icon: '🛢', pole: 'amont' },
              { href: '/en/solutions/?pole=amont', strong: 'S02 · EOR Polymers', small: 'HPAM · anti-scale · demulsifiers · enhanced recovery', icon: '🧪', pole: 'amont' },
              { href: '/en/solutions/?pole=amont', strong: 'S03 · Industrial HSE', small: 'Process safety · ISO 45001 · API RP 75', icon: '🛡', pole: 'amont' },
              { href: '/en/amont/', strong: 'S11-S18 · Roadmap 2027-2030', small: 'Drilling fluids · wireline · workover · P&A · AIM · 8 new services', icon: '🚀', pole: 'amont', badge: 'NEW' },
            ]
          },
          {
            title: 'Target Operators · Upstream',
            count: '3',
            links: [
              { href: '/en/operateurs/cnpcic.html', strong: 'Opérateur Bongor', small: '60% production · Ronier permit', icon: '🇨🇳', pole: 'amont' },
              { href: '/en/operateurs/perenco.html', strong: 'Opérateur Doba', small: 'Historic cluster · Mangara/Badila', icon: '🛢', pole: 'amont' },
              { href: '/en/operateurs/sht.html', strong: 'opérateur national · NOC', small: 'National Oil Company of Chad', icon: '🏛', pole: 'amont' },
            ]
          }
        ],
        featured: { title: 'Local EOR Program', desc: '5 Chadian resources · OAPI patent Q3 2026', cta: 'Discover →', href: '/en/solutions/', thumb: '🌿', badgeLive: false }
      },
      'intermediaire': {
        intro: { icon: '🔵', label: 'Midstream Services', desc: 'Pipeline integrity · SCADA · metering services', stat: '12M', statLabel: 'USD 2030' },
        pole: 'intermediaire',
        sections: [
          {
            title: 'Midstream Services',
            count: '3',
            links: [
              { href: '/en/solutions/?pole=intermediaire', strong: 'S04 · ILI Inspection', small: 'Instrumented pigging MFL/UT · API 1163', icon: '🔍', pole: 'intermediaire' },
              { href: '/en/solutions/?pole=intermediaire', strong: 'S05 · Pipeline SCADA', small: 'SCADA majors-grade · leak detection · API 1130', icon: '📊', pole: 'intermediaire' },
              { href: '/en/solutions/?pole=intermediaire', strong: 'S06 · Fiscal Metering', small: 'LACT units · loss audit · API MPMS', icon: '⚖', pole: 'intermediaire' },
            ]
          },
          {
            title: 'Operators · Pipeline & FSO',
            count: '2',
            links: [
              { href: '/en/operateurs/cnpcic.html', strong: 'opérateurs pipeline', small: 'Doba-Kribi pipeline 1,070 km · 6 stations', icon: '🔗', pole: 'intermediaire' },
              { href: '/en/data/atlas.html', strong: 'Pipeline 3D', small: '6 pumping stations visualization · FSO KK1', icon: '📍', pole: 'intermediaire' },
            ]
          }
        ],
        featured: { title: 'Pipeline Integrity 360°', desc: 'AI leak detection · opérateur amont 2 MoU in discussion', cta: 'Learn more →', href: '/en/solutions/', thumb: '🔗', badgeLive: false }
      },
      'aval': {
        intro: { icon: '🟡', label: 'Downstream Services', desc: 'Distribution · lubricants · EVCS services', stat: '16M', statLabel: 'USD 2030' },
        pole: 'aval',
        sections: [
          {
            title: 'Downstream Services',
            count: '2',
            links: [
              { href: '/en/solutions/?pole=aval', strong: 'S09 · Lubricants Blending', small: '15W-40 · 5W-30 · ISO VG · API SN/SP', icon: '⚗', pole: 'aval' },
              { href: '/en/solutions/?pole=aval', strong: 'U06 · Mobile Distribution', small: 'Mobile Station™ · 50 EVCS stations CEMAC', icon: '⛽', pole: 'aval' },
            ]
          },
          {
            title: 'Operators · Refinery & Distribution',
            count: '1',
            links: [
              { href: '/en/operateurs/sht.html', strong: 'Raffinerie nationale', small: 'Refinery · JV opérateurs (~60/40)', icon: '🏭', pole: 'aval' },
            ]
          }
        ],
        featured: { title: 'CEMAC First EVCS', desc: 'Mobile Station™ · 50 kW CCS2/CHAdeMO · OAPI patent', cta: 'Discover →', href: '/en/solutions/', thumb: '⚡', badgeLive: false }
      },
      'petrochimie': {
        intro: { icon: '🟣', label: 'Petrochemicals Services', desc: 'HSE · inspection · maintenance services to petchem industry', stat: 'P01-P08', statLabel: 'services' },
        pole: 'petrochimie',
        sections: [
          {
            title: '🟤 Brown · Existing units optimization',
            count: '3',
            links: [
              { href: '/en/petrochimie/', strong: 'P04 · HSE Process Safety', small: 'PHA · HAZOP · LOPA · API RP 14C · IEC 61511', icon: '🛡', pole: 'petrochimie' },
              { href: '/en/petrochimie/', strong: 'P05 · Inspection NDT', small: 'API 510 · 570 · 653 · ASME VIII', icon: '🔍', pole: 'petrochimie' },
              { href: '/en/petrochimie/', strong: 'P06 · Turnaround maintenance', small: 'TAR · catalyst change · contractor mgmt', icon: '🔧', pole: 'petrochimie' },
            ]
          },
          {
            title: '🟢 Green · New units 2028+',
            count: '5',
            links: [
              { href: '/en/petrochimie/', strong: 'P01 · N Fertilizers', small: 'FEED 50 kt/yr · Chad agriculture', icon: '🌾', pole: 'petrochimie', badge: 'NEW' },
              { href: '/en/petrochimie/', strong: 'P02 · Methanol GTL', small: 'Anti-flaring routine · CEMAC market', icon: '⚗', pole: 'petrochimie', badge: 'NEW' },
              { href: '/en/petrochimie/', strong: 'P03 · Basic polymers', small: 'HDPE/PP small-scale · import substitution', icon: '🧬', pole: 'petrochimie' },
              { href: '/en/petrochimie/', strong: 'P07 · EnerFert™ brand', small: 'OAPI brand 2027 · farmer distribution', icon: '🌱', pole: 'petrochimie', badge: 'NEW' },
            ]
          }
        ],
        featured: { title: 'Anti-flaring + EnerFert™', desc: '100% associated gas valorization · double ESG + revenue impact', cta: 'Discover →', href: '/en/petrochimie/', thumb: '🟣', badgeLive: false }
      },
      'technologies': {
        intro: { icon: '⚙', label: 'Technologies Axis', desc: 'AI · Cyber-OT · IoT · Digital twin', stat: '8', statLabel: 'pillars' },
        pole: 'technologies',
        sections: [
          {
            title: 'Cross-cutting Tech Stack',
            count: '4',
            links: [
              { href: '/en/technologies/', strong: 'AI & Machine Learning', small: 'Predictive maintenance · reservoir digital twin · 30% downtime reduction', icon: '🧠', pole: 'intermediaire' },
              { href: '/en/technologies/', strong: 'Industrial IoT', small: 'LoRa sensors · 24/7 telemetry remote sites', icon: '📡', pole: 'intermediaire' },
              { href: '/en/technologies/', strong: 'Digital twin', small: '3D real-time digital twin · Doba/Bongor/raffinerie nationale', icon: '🔮', pole: 'intermediaire' },
              { href: '/en/technologies/', strong: 'Surveillance drones', small: 'ROW pipeline 1,070 km inspection · AI corrosion detection', icon: '🚁', pole: 'intermediaire' },
            ]
          },
          {
            title: 'Services & Umbrella Solutions',
            count: '4',
            links: [
              { href: '/en/solutions/', strong: 'S07 · Cyber-OT MSSP', small: 'SOC 24/7 · IDS OT majors · IEC 62443-3-3 · Purdue', icon: '🛡', pole: 'intermediaire' },
              { href: '/en/solutions/', strong: 'S08 · AI Physical Security', small: '4K cameras + AI · ROW drones · ATEX biometric perimeter', icon: '🎥', pole: 'intermediaire' },
              { href: '/en/solutions/', strong: 'U03 Cyber-OT MSSP', small: 'Packaged 24/7 OT umbrella · target opérateurs aval/midstream/amont', icon: '🔒', pole: 'intermediaire' },
              { href: '/en/solutions/', strong: 'U04 Perimeter Security', small: 'Drones+biometrics+AR/VR HSE training umbrella', icon: '🏛', pole: 'intermediaire' },
            ]
          }
        ],
        featured: { title: 'See Technologies Pillar', desc: 'Full stack · IEC 62443 · ISO 27001 · IDS OT leaders', cta: 'Explore →', href: '/en/technologies/', thumb: '⚙', badgeLive: false }
      },
      'energies': {
        intro: { icon: '🌱', label: 'Energies Axis · 3 horizons', desc: 'EVCS · BESS · Green H2 · 30% renewables', stat: '125', statLabel: 'MW 2030' },
        pole: 'energies',
        sections: [
          {
            title: '3-horizon Strategy · Transition',
            count: '3',
            links: [
              { href: '/en/energies/', strong: 'Horizon 1 · 2026-2030', small: 'Conventional cash cow · 125 MW Chad · Local EOR', icon: '🛢', pole: 'amont' },
              { href: '/en/energies/', strong: 'Horizon 2 · 2030-2035', small: 'Gas/EVCS transition · 30% renewables · BESS · 50 CEMAC stations', icon: '⚡', pole: 'aval' },
              { href: '/en/energies/', strong: 'Horizon 3 · 2035+', small: 'Green hydrogen · electrolysis · R&D pilot 2027', icon: '🌱', pole: 'amont' },
            ]
          },
          {
            title: 'Initiatives & U05',
            count: '3',
            links: [
              { href: '/en/energies/', strong: 'U05 · Hybrid Renewables', small: 'Solar + BESS + Gas-to-power · isolated sites · community mini-grids', icon: '☀', pole: 'amont' },
              { href: '/en/energies/', strong: 'Anti-flaring zero routine', small: 'Associated gas recovery · GHG -45% vs majors · 12 kg CO2/barrel 2030', icon: '🔥', pole: 'amont' },
              { href: '/en/energies/', strong: 'REDD+ carbon biodiversity', small: 'ONG biodiversité internationale Cameroon carbon credits · Doba biodiversity', icon: '🌳', pole: 'amont' },
            ]
          }
        ],
        featured: { title: 'See Energies Pillar', desc: 'CEMAC EVCS first-mover · 50 stations 50 kW CCS2/CHAdeMO', cta: 'Explore →', href: '/en/energies/', thumb: '🌱', badgeLive: false }
      },
      'atlas': {
        intro: { icon: '🗺', label: 'Chad Market Atlas', desc: 'Note: no EnerTchad assets · OFS Tchad (E&P = projet futur)', stat: 'ℹ', statLabel: 'note' },
        pole: 'atlas',
        sections: [
          {
            title: 'Chad Market Atlas (third-party operator assets)',
            count: '2',
            links: [
              { href: '/en/data/atlas.html', strong: 'Chad O&G Atlas', small: 'Market: 5 basins · 1,070 km pipeline · 1 refinery · 3 canon pillars', icon: '🗺', pole: 'intermediaire' },
              { href: '/en/data/atlas.html', strong: 'Pipeline 1,070 km', small: 'opérateurs pipeline · Doba-Kribi · 6 pumping stations', icon: '📍', pole: 'intermediaire' },
            ]
          }
        ],
        featured: { title: 'Note · EnerTchad new OFS', desc: 'Progressive OFS · Tchad ambition by 2030+. Atlas presents the Chad market, not an EnerTchad portfolio.', cta: 'Understand →', href: '/en/pourquoi/manifeste.html', thumb: 'ℹ', badgeLive: false }
      },
      'engagement': {
        intro: { icon: '💼', label: 'Engagement · Why · 2026 Round', desc: 'Vision · Investors · ESG/CSR/HSE · Press', stat: '8-12', statLabel: 'M USD Round' },
        pole: 'engagement',
        sections: [
          {
            title: 'Why · Vision & Strategy',
            count: '4',
            links: [
              { href: '/en/pourquoi/manifeste.html', strong: 'CEO Manifesto', small: 'Founding vision by Bignéro Le Madang', icon: '📜', badge: null },
              { href: '/en/pourquoi/manifeste.html', strong: 'Positioning', small: 'EnerTchad · positionnement marché Tchad', icon: '🎯', badge: null },
              { href: '/en/pourquoi/manifeste.html', strong: '2026-2030 Trajectory', small: 'Roadmap OFS · expansion catalogue', icon: '🗺', badge: 'NEW' },
              { href: '/en/pourquoi/manifeste.html', strong: 'Team & Leadership', small: 'CEO profile · Advisory Board · 25 FTE Phase 1', icon: '👥', badge: null },
            ]
          },
          {
            title: 'Investment & Engagements',
            count: '3',
            links: [
              { href: '/en/engagement/investisseurs.html', strong: '2026 Round · Investors', small: 'USD 8-12M · OHADA · DD package · live War Room', icon: '💼', badge: 'ROUND' },
              { href: '/en/engagement/transparence.html', strong: 'ESG · CSR · HSE', small: '3 pillars · 6 KPIs · agence ONU réfugiés/ONG biodiversité internationale · EITI · GRI Standards reporting · TCFD', icon: '🌍', badge: 'NEW' },
              { href: 'mailto:contact@enertchad.td', strong: 'Contact', small: "N'Djamena · cal.com · LinkedIn", icon: '✉', badge: null },
            ]
          }
        ],
        featured: { title: 'Q3 2026 Closing', desc: 'Seed/Pre-A Round seats · DFI lead', cta: 'Term sheet →', href: '/en/engagement/investisseurs.html', thumb: '🎯', badgeLive: true }
      }
    };

    // i18n: detect page language
    const __lang = document.documentElement.lang || 'fr';
    const PANELS = (__lang === 'en' && typeof PANELS_EN !== 'undefined') ? PANELS_EN : PANELS_FR;

    navLinks.forEach(link => {
      const txt = link.textContent.trim().toLowerCase();
      // Match by data-pole or by text content
      const dataPole = link.getAttribute('data-pole');
      let match = null;
      if (dataPole && PANELS[dataPole]) match = dataPole;
      else match = Object.keys(PANELS).find(k => txt.includes(k.replace('é','e').replace('à','a')) || txt.includes(k));
      if (!match) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-item-mega';
      wrapper.setAttribute('data-mega-pole', PANELS[match].pole);
      link.parentNode.insertBefore(wrapper, link);
      wrapper.appendChild(link);
      
      // G1+G2 · ARIA haspopup + initial expanded state
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      
      const panel = document.createElement('div');
      panel.className = 'mega-panel';
      panel.setAttribute('role', 'menu');
      const data = PANELS[match];
      
      // ULTRA-WIDE v4 rendering · 3-column grid (intro · services · featured)
      const sectionsHTML = data.sections.map(sec => {
        const linksHTML = sec.links.map(l => {
          const isCurrent = currentPath === l.href.replace(/\?.*$/, '').replace(/\/$/, '') || currentPath === l.href.split('?')[0];
          const poleAttr = l.pole ? `data-pole="${l.pole}"` : '';
          let badgeHTML = '';
          if (l.badge) {
            const cls = l.badge === 'LIVE' ? 'is-hot' : (l.badge === 'NEW' ? 'is-new' : '');
            badgeHTML = `<span class="badge-v2 ${cls}">${l.badge}</span>`;
          }
          return `<a href="${l.href}" ${poleAttr} ${isCurrent ? 'class="is-current" aria-current="page"' : ''}>
            <span class="item-icon-v2" aria-hidden="true">${l.icon || '→'}</span>
            <span class="item-text-v2"><strong>${l.strong}</strong><small>${l.small}</small></span>
            ${badgeHTML || '<span class="item-arrow-v2">→</span>'}
          </a>`;
        }).join('');
        return `
          <div class="mega-panel-section-v2">
            <h5>${sec.title}${sec.count ? `<span class="count-bubble">${sec.count}</span>` : ''}</h5>
            ${linksHTML}
          </div>`;
      }).join('');
      
      const introHTML = data.intro ? `
        <div class="mega-panel-intro-v2">
          <span class="kicker-v2"><span class="kicker-v2-icon">${data.intro.icon}</span>${data.intro.label}</span>
          <h3>${data.intro.desc.split(' · ')[0] || data.intro.label}<em></em></h3>
          <p>${data.intro.desc}</p>
          <div class="stat-pill"><strong>${data.intro.stat}</strong>${data.intro.statLabel}</div>
        </div>` : '';
      
      const featuredHTML = data.featured ? `
        <div class="mega-panel-featured-v2">
          <span class="feat-kicker">${data.featured.badgeLive ? '<span class="pulse-dot"></span>LIVE · ' : ''}En vedette</span>
          <h4>${data.featured.title}</h4>
          <p>${data.featured.desc}</p>
          <a class="feat-cta-v2" href="${data.featured.href}">${data.featured.cta}</a>
          <div class="feat-stats-v2">
            <div class="feat-stat"><strong>40+</strong><span>codes services</span></div>
            <div class="feat-stat"><strong>6</strong><span>opérateurs</span></div>
          </div>
        </div>` : '';
      
      panel.innerHTML = `<div class="mega-panel-inner-v2">${introHTML}<div class="mega-panel-grid-v2">${sectionsHTML}</div>${featuredHTML || '<div></div>'}</div>`;
      wrapper.appendChild(panel);
      
      // M7 · Keyboard navigation + G2 aria-expanded
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          e.preventDefault();
          panel.classList.add('open');
          link.setAttribute('aria-expanded', 'true');
          const firstLink = panel.querySelector('a');
          if (firstLink) firstLink.focus();
        } else if (e.key === 'Escape') {
          panel.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
        }
      });
      
      // G3 · Focus trap + Escape close + aria-expanded sync
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          panel.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
        if (e.key === 'Tab') {
          const focusables = panel.querySelectorAll('a, button');
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
          }
        }
      });
      
      // G2 · aria-expanded sync with hover/focus
      wrapper.addEventListener('mouseenter', () => link.setAttribute('aria-expanded', 'true'));
      wrapper.addEventListener('mouseleave', () => link.setAttribute('aria-expanded', 'false'));
      link.addEventListener('focus', () => link.setAttribute('aria-expanded', 'true'));
      
      // Click outside closes + reset aria-expanded
      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          panel.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ─── Q2-F. Recherche visible (header) ──────────────── */
  function initVisibleSearch(){
    const header = document.querySelector('.site-header .header-inner');
    if (!header) return;
    if (header.querySelector('.nav-search')) return;
    
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const search = document.createElement('button');
    search.type = 'button';
    search.className = 'nav-search';
    search.setAttribute('aria-label', 'Rechercher (raccourci ⌘K)');
    search.innerHTML = `
      <span class="nav-search-icon">🔍</span>
      <span class="nav-search-placeholder">Rechercher...</span>
      <span class="nav-search-shortcut">${isMac ? '⌘' : 'Ctrl'}K</span>
    `;
    
    // Insert before nav element
    const nav = header.querySelector('.nav');
    if (nav) header.insertBefore(search, nav);
    else header.insertBefore(search, header.firstChild.nextSibling);
    
    // Trigger ⌘K palette
    search.addEventListener('click', () => {
      // Dispatch a Cmd+K keydown to trigger initCmdK
      const e = new KeyboardEvent('keydown', { key: 'k', metaKey: isMac, ctrlKey: !isMac, bubbles: true });
      document.dispatchEvent(e);
    });
  }

  /* ─── Q2-H. Quick actions sidebar floating ─────────── */
  function initQuickActions(){
    return; /* R110 disabled · widget retiré */
    if (document.querySelector('.quick-actions')) return;
    const sidebar = document.createElement('aside');
    sidebar.className = 'quick-actions';
    sidebar.setAttribute('aria-label', 'Actions rapides');
    sidebar.innerHTML = `
      <a href="tel:+23522521900" data-tooltip="Téléphone DG" aria-label="Téléphone">📞</a>
      <a href="mailto:dg@enertchad.td" data-tooltip="Email DG" aria-label="Email">✉</a>
      <a href="https://linkedin.com/in/bignero" target="_blank" rel="noopener" data-tooltip="LinkedIn DG" aria-label="LinkedIn">in</a>
      <a href="https://cal.com/enertchad-groupe/30min" target="_blank" rel="noopener" data-tooltip="Réserver 30 min" aria-label="Calendrier">📅</a>
    `;
    document.body.appendChild(sidebar);
  }


  /* ─── TWR. Tour 2026 War Room (live tracker) ────────── */
  function initWarRoom(){
    const mount = document.getElementById('tour-war-room');
    if (!mount) return;
    
    fetch('/assets/data/tour-2026.json', { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
      .then(data => renderWarRoom(mount, data))
      .catch(err => { mount.innerHTML = '<div class="war-room-error">Tracker temporairement indisponible.</div>'; console.warn('War Room:', err); });
    
    // Auto-refresh every 5 min
    setInterval(() => {
      fetch('/assets/data/tour-2026.json', { cache: 'no-store' })
        .then(r => r.json())
        .then(data => renderWarRoom(mount, data))
        .catch(()=>{});
    }, 300000);
  }
  
  function renderWarRoom(mount, data) {
    const t = data.tour;
    const seats = data.seats;
    const closing = new Date(t.closing_date);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((closing - now) / (1000 * 60 * 60 * 24)));
    const pctRaised = Math.min(100, Math.round((t.raised / t.target_max) * 100));
    const lastUpdated = new Date(t.last_updated);
    const updatedAgo = formatTimeAgo(lastUpdated, now);
    
    const funnelHTML = data.funnel.map((s, i) => `
      <div class="war-room-funnel-stage ${i === data.funnel.length - 1 ? 'active' : ''}" title="${s.label}">
        <div class="war-room-funnel-count">${s.count}</div>
        <div class="war-room-funnel-label">${s.stage}</div>
      </div>
    `).join('');
    
    const eventsHTML = data.events.slice(0, 5).map(e => `
      <div class="war-room-event" data-type="${e.type}">
        <div class="war-room-event-date">${e.date}</div>
        <div class="war-room-event-label">${e.label}</div>
      </div>
    `).join('');
    
    const milestonesHTML = data.milestones.slice(0, 4).map(m => `
      <div class="war-room-milestone">
        <div class="war-room-milestone-date">${m.date}</div>
        <div class="war-room-milestone-label">${m.label}</div>
      </div>
    `).join('');
    
    mount.innerHTML = `
      <div class="war-room">
        <div class="war-room-header">
          <h3>Tour 2026 · War Room <span class="war-room-tag">${t.status === 'open' ? 'OUVERT' : 'FERMÉ'}</span></h3>
          <span class="war-room-live">LIVE · MAJ ${updatedAgo}</span>
        </div>
        <div class="war-room-grid">
          <div class="war-room-kpi">
            <div class="war-room-kpi-label">💰 Raised</div>
            <div class="war-room-kpi-value">${t.raised} <span style="font-size:14px;opacity:0.6">/ ${t.target_max} ${t.currency}</span></div>
            <div class="war-room-progress"><div class="war-room-progress-fill" style="width:${pctRaised}%"></div></div>
            <div class="war-room-kpi-sub">${pctRaised}% vers ${t.target_max} ${t.currency} · cible ${t.target_min}-${t.target_max} ${t.currency}</div>
          </div>
          <div class="war-room-kpi">
            <div class="war-room-kpi-label">🪑 Sièges</div>
            <div class="war-room-kpi-value">${seats.confirmed}<span style="font-size:14px;opacity:0.6"> / ${seats.total}</span></div>
            <div class="war-room-kpi-sub">${seats.confirmed} confirmés · ${seats.in_term_sheet} en TS · ${seats.available} disponibles</div>
          </div>
          <div class="war-room-kpi">
            <div class="war-room-kpi-label">⏱ Closing</div>
            <div class="war-room-kpi-value">${daysLeft}<span style="font-size:14px;opacity:0.6"> jours</span></div>
            <div class="war-room-kpi-sub">${formatDate(closing)}</div>
          </div>
        </div>
        <div class="war-room-section">
          <div class="war-room-section-title">Funnel investisseurs</div>
          <div class="war-room-funnel">${funnelHTML}</div>
        </div>
        <div class="war-room-section">
          <div class="war-room-section-title">Événements récents</div>
          <div class="war-room-events">${eventsHTML}</div>
        </div>
        <div class="war-room-section">
          <div class="war-room-section-title">Prochains jalons</div>
          <div class="war-room-milestones">${milestonesHTML}</div>
        </div>
        <div class="war-room-co-invest">
          <strong>Profil co-investisseurs cibles :</strong> Lead = ${data.co_investor_profile.lead_target} · Co-invest = ${data.co_investor_profile.co_invest_target} · Family Offices = ${data.co_investor_profile.family_offices}
        </div>
        <div class="war-room-cta">
          <a class="war-room-cta-primary" href="https://cal.com/enertchad-groupe/30min" target="_blank" rel="noopener">Demander un siège ↗</a>
          <a class="war-room-cta-secondary" href="mailto:dg@enertchad.td?subject=NDA%20Dataroom%20Tour%202026">NDA + Dataroom →</a>
        </div>
      </div>
    `;
  }
  
  function formatTimeAgo(date, now) {
    const diff = Math.max(0, Math.floor((now - date) / 1000));
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff/3600)}h`;
    return `il y a ${Math.floor(diff/86400)}j`;
  }
  
  function formatDate(d) {
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }


  /* M-Ultra · Recently viewed tracker (sessionStorage) */
  function trackRecentlyViewed(){
    try {
      const path = location.pathname;
      const key = 'enertchad-recently-viewed';
      let recent = JSON.parse(sessionStorage.getItem(key) || '[]');
      if (!recent.includes(path)) {
        recent.unshift(path);
        if (recent.length > 10) recent = recent.slice(0, 10);
        sessionStorage.setItem(key, JSON.stringify(recent));
      }
      // Mark recently-viewed in mega-menu
      setTimeout(() => {
        document.querySelectorAll('.mega-panel-section a').forEach(a => {
          const href = a.getAttribute('href');
          if (recent.includes(href) && href !== path) {
            a.classList.add('recently-viewed');
          }
        });
      }, 200);
    } catch(e) {}
  }


  /* Vague N · Prev/Next page navigation auto-injection */
  function initPageNav(){
    // Canonical journey order (matches narrative AIDA)
    const JOURNEY = [
      { href: '/', name: 'Accueil', section: 'Home' },
      { href: '/amont/', name: 'Pôle Amont', section: 'Cœur métier' },
      { href: '/intermediaire/', name: 'Pôle Intermédiaire', section: 'Cœur métier' },
      { href: '/aval/', name: 'Pôle Aval', section: 'Cœur métier' },
      { href: '/technologies/', name: 'Technologies', section: 'Transversaux' },
      { href: '/energies/', name: 'Énergies', section: 'Transversaux' },
      { href: '/data/atlas.html', name: 'Atlas marché Tchad', section: 'Atlas' },
      { href: '/data/index.html', name: 'Hub Data', section: 'Atlas' },
      { href: '/data/dashboard.html', name: 'Dashboard live', section: 'Atlas' },
      { href: '/data/observatoire.html', name: 'Observatoire', section: 'Atlas' },
      { href: '/data/oleoduc-3d.html', name: 'Pipeline 3D', section: 'Atlas' },
      { href: '/operateurs/', name: '5 Opérateurs cibles', section: 'Opérateurs' },
      { href: '/operateurs/cnpcic.html', name: 'Opérateur Bongor', section: 'Opérateurs' },
      { href: '/operateurs/perenco.html', name: 'Opérateur Doba', section: 'Opérateurs' },
      { href: '/operateurs/sht.html', name: 'opérateur national · NOC', section: 'Opérateurs' },
      { href: '/operateurs/cotco-totco.html', name: 'opérateurs pipeline', section: 'Opérateurs' },
      { href: '/operateurs/srn.html', name: 'Raffinerie nationale', section: 'Opérateurs' },
      { href: '/solutions/', name: '10 services + 6 umbrella', section: 'Solutions' },
      { href: '/solutions/configurateur.html', name: 'Configurateur', section: 'Solutions' },
      { href: '/solutions/calculateur.html', name: 'Calculateur ROI', section: 'Solutions' },
      { href: '/pourquoi/manifeste.html', name: 'Manifeste DG', section: 'Pourquoi' },
      { href: '/pourquoi/positionnement.html', name: 'Positionnement', section: 'Pourquoi' },
      { href: '/pourquoi/trajectoire.html', name: 'Trajectoire 2026-2030', section: 'Pourquoi' },
      { href: '/pourquoi/equipe.html', name: 'Équipe & Leadership', section: 'Pourquoi' },
      { href: '/engagement/investisseurs.html', name: 'Tour 2026 · Investisseurs', section: 'Engagement' },
      { href: '/engagement/transparence.html', name: 'ESG · RSE · HSE', section: 'Engagement' },
      { href: '/engagement/presse.html', name: 'Presse', section: 'Engagement' },
      { href: '/engagement/contact.html', name: 'Contact', section: 'Engagement' },
      { href: '/glossaire.html', name: 'Glossaire taxonomies', section: 'Référentiels' },
      { href: '/sitemap.html', name: 'Plan du site', section: 'Référentiels' }
    ];
    
    // Skip on utility pages (404, 500, offline)
    const path = location.pathname;
    if (path.includes('404') || path.includes('500') || path.includes('offline') || path.includes('/en/') || path.includes('/legal/')) return;
    
    // Find current page in journey
    let currentIdx = JOURNEY.findIndex(p => p.href === path || p.href === path + '/' || (path === '/' && p.href === '/'));
    if (currentIdx === -1) {
      // Try fuzzy match (e.g. /amont/index.html → /amont/)
      currentIdx = JOURNEY.findIndex(p => path.startsWith(p.href) && p.href !== '/');
    }
    if (currentIdx === -1) return;
    
    const prev = currentIdx > 0 ? JOURNEY[currentIdx - 1] : null;
    const next = currentIdx < JOURNEY.length - 1 ? JOURNEY[currentIdx + 1] : null;
    const total = JOURNEY.length;
    const position = currentIdx + 1;
    
    // Build nav HTML
    const nav = document.createElement('nav');
    nav.className = 'page-nav';
    nav.setAttribute('aria-label', 'Pagination · navigation entre pages');
    nav.innerHTML = `
      ${prev ? `<a class="page-nav-link" data-direction="prev" href="${prev.href}">
        <span class="page-nav-arrow" aria-hidden="true">←</span>
        <span class="page-nav-text"><small>${prev.section} · précédent</small><strong>${prev.name}</strong></span>
      </a>` : '<div></div>'}
      <span class="page-nav-pos"><strong>${position}</strong> / ${total} · journey</span>
      ${next ? `<a class="page-nav-link" data-direction="next" href="${next.href}">
        <span class="page-nav-text"><small>${next.section} · suivant</small><strong>${next.name}</strong></span>
        <span class="page-nav-arrow" aria-hidden="true">→</span>
      </a>` : '<div></div>'}
    `;
    
    // Insert before footer
    const footer = document.querySelector('.site-footer');
    if (footer && !document.querySelector('.page-nav')) {
      footer.parentNode.insertBefore(nav, footer);
    }
  }

  

  /* ─── D.5 · Tour 2026 J-XX countdown topbar ─────────── */
  function initTourCountdown(){
    const target = document.querySelector('.tb-countdown, .header-countdown');
    if (!target) return;
    const closingDate = new Date('2026-09-30T23:59:59Z');
    function update() {
      const now = new Date();
      const diffMs = closingDate - now;
      const days = Math.max(0, Math.ceil(diffMs / (1000*60*60*24)));
      const lang = document.documentElement.lang || 'fr';
      const liveLabel = lang === 'en' ? 'LIVE' : 'LIVE';
      const tourLabel = lang === 'en' ? '2026 Round' : 'Tour 2026';
      const dayLabel = lang === 'en' ? 'days' : 'j';
      target.innerHTML = '<span class="tb-cd-pulse">' + liveLabel + '</span> · ' + tourLabel + ' · J-' + days + ' ' + dayLabel;
    }
    update();
    setInterval(update, 60*1000);
  }

  

  /* === ULTRA PREMIUM · View Transitions API (last-gen) === */
  function initViewTransitions() {
    if (!document.startViewTransition) return; // not supported
    document.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (a.target === '_blank') return;
      try {
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return; // external
      } catch(e) { return; }
      a.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        document.startViewTransition(() => {
          location.href = a.href;
        });
      });
    });
  }

  /* === Reading progress (premium fallback) === */
  function initScrollProgressPremium(){ /* tracer deleted · DG R47 */ }

  

  /* ─── R54. NAV-FUSION · "More" dropdown + persona pill wiring ─ */
  function initNavFusion(){
    // 1. "More ▾" dropdown toggle
    document.querySelectorAll('.nav-more').forEach(wrap => {
      const trigger = wrap.querySelector('.nav-more-trigger');
      const panel = wrap.querySelector('.nav-more-panel');
      if (!trigger || !panel) return;
      
      function close(){ 
        panel.classList.remove('is-open'); 
        trigger.setAttribute('aria-expanded', 'false'); 
      }
      function open(){ 
        panel.classList.add('is-open'); 
        trigger.setAttribute('aria-expanded', 'true'); 
      }
      
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = panel.classList.contains('is-open');
        // Close any other open dropdowns first
        document.querySelectorAll('.nav-more-panel.is-open').forEach(p => {
          if (p !== panel) {
            p.classList.remove('is-open');
            p.previousElementSibling?.setAttribute('aria-expanded', 'false');
          }
        });
        isOpen ? close() : open();
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) close();
      });
      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    });
    
    // 2. Persona pill — light-touch dropdown showing 5 personas
    document.querySelectorAll('[data-persona-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Cycle persona for now (cheap UX) · enriched later
        const personas = [
          { name: 'Tous',         emoji: '👁' },
          { name: 'Investisseur', emoji: '💼' },
          { name: 'Opérateur',    emoji: '🛠' },
          { name: 'Presse',       emoji: '📰' },
          { name: 'Talent',       emoji: '🤝' },
        ];
        const current = btn.querySelector('[data-persona-current]')?.textContent.replace('Vue: ', '') || 'Tous';
        const idx = personas.findIndex(p => p.name === current);
        const next = personas[(idx + 1) % personas.length];
        const cur = btn.querySelector('[data-persona-current]');
        const emoji = btn.querySelector('.persona-emoji');
        if (cur) cur.textContent = 'Vue: ' + next.name;
        if (emoji) emoji.textContent = next.emoji;
        document.body.setAttribute('data-persona', next.name.toLowerCase());
      });
    });
  }



  /* ─── R64. HEADER v10 POLISH · aria-current + search ─ */
  function initHeaderV10Polish(){
    // 1. aria-current="page" dynamique sur nav-v10
    const path = window.location.pathname.replace(/\/$/,'') || '/';
    document.querySelectorAll('.nav-v10 > a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const hrefPath = href.replace(/\/$/,'') || '/';
      if (hrefPath === path) {
        a.setAttribute('aria-current', 'page');
      } else if (hrefPath !== '/' && path.startsWith(hrefPath + '/')) {
        a.setAttribute('aria-current', 'page');
      }
    });
    
    // 2. Search trigger ⌘K
    const searchBtn = document.querySelector('[data-search-trigger]');
    if (searchBtn) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Open ⌘K palette via existing initCmdK or fire keyboard event
        const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
        document.dispatchEvent(evt);
      });
    }
  }

  function init(){
    try {
      initHeaderV10Polish();
      initNavFusion();
      initReveal();
      initCounters();
      initDrawer();
      // initCmdK(); // R135 · DG mandate delete · 2026-05-03
      initBackToTop();
      initActiveNav();
      initYear();
      initSW();
      initFooterAccordion();
      initCookieBanner();
      initAnalytics();
    initStickyShrink();
    initPoleContext();
    initTourPulse();
    initSubnavPoles();
    initPersonaBar();
    initMegaMenu();
    initCardTilt();
    initThemeToggle();
    initSkipToMain();
    initBottomNavMobile();
    initStoryProgress();
    initNavToolsEnhance();
    initEsgCounter();
    initA11ySprint2();
    initModernNavigation();
    // initVisibleSearch(); // R135 · DG mandate delete · 2026-05-03
    initQuickActions();
    initWarRoom();
    initViewTransitions();
    initTourCountdown();
    trackRecentlyViewed();
    initPageNav();
      document.body.classList.add('et-loaded');
    } catch(err){ console.warn('[enertchad]', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();



/* === ULTRA MEGA MENU · R42 · cross-pages JS-driven === */
(function () {
  if (document.querySelector('[data-mega-init]')) return;
  document.documentElement.setAttribute('data-mega-init', '1');

  var MEGA_DATA = {
    activities: {
      featured: {
        href: '/activites/',
        tag: '★ Hub Activités',
        h: 'Architecture canon end-to-end',
        d: '4 pôles canon Oil & Gas + 3 axes transversaux · 40+ services · 6 marques™.',
        cta: 'Voir le hub →'
      },
      cols: [
        { h: 'Pôles canon', links: [
          { href: '/amont/', strong: 'Pôle Amont', span: 'EOR Local · S01-S18' },
          { href: '/intermediaire/', strong: 'Pôle Intermédiaire', span: 'Pipeline · SCADA' },
          { href: '/aval/', strong: 'Pôle Aval', span: 'D&C tous produits' },
          { href: '/petrochimie/', strong: 'Pôle Pétrochimie', span: 'Valorisation gaz · P01-P08' }
        ]},
        { h: 'Axes transversaux', links: [
          { href: '/technologies/', strong: 'Axe Technologies', span: 'Cyber-OT · IEC 62443' },
          { href: '/energies/', strong: 'Axe Énergies', span: 'Multi-vecteurs · 125 MW' },
          { href: '/hse/', strong: 'Axe Sécurité Intégrée', span: 'PSM · OIMS-grade' }
        ]},
        { h: 'Catalogue', links: [
          { href: '/solutions/', strong: 'Catalogue 40+ services', span: 'Codes S/D/C/U/P/T/E/H' },
          { href: '/marques/', strong: '6 marques™ OAPI', span: 'Portfolio brand worlds' },
          { href: '/intermediaire/pipeline-360-demo/', strong: 'Pipeline 360° · démo', span: 'Digital twin Doba-Kribi' },
          { href: '/solutions/configurateur.html', strong: 'Configurateur', span: 'Trouver votre solution' }
        ]}
      ]
    },
    'tour': {
      featured: {
        href: '/investisseurs/',
        tag: '★ Tour Seed/Pre-A 2026',
        h: '8-12 M USD · OHADA',
        d: 'Premier OFS au monde transparent. % closed live · DG accessible · NDA OHADA · closing T3 2026 · J-151.',
        cta: 'Hub Tour 2026 →'
      },
      cols: [
        { h: 'Live & accès direct', links: [
          { href: '/tour-live/', strong: '🟢 Live tracker public', span: '47% closed · 4,7 M USD soft' },
          { href: '/dg-office-hours/', strong: '📅 30 min direct DG', span: 'Cal.com · NDA pré-signé' },
          { href: '/ai-concierge/', strong: '🤖 AI Concierge DFI', span: 'Claude API · 24/7 · 5 langues' },
          { href: '/dataroom/', strong: '🔐 Dataroom DD', span: '12 catégories · NDA flow' }
        ]},
        { h: 'Documents canon', links: [
          { href: '/engagement/investisseurs.html', strong: 'Tour 2026 narrative', span: 'Use of proceeds · roadmap' },
          { href: '/engagement/transparence.html', strong: 'ESG · ITIE · OHADA', span: 'Conformité · transparency' },
          { href: '/pourquoi/trajectoire.html', strong: 'Roadmap 2026-2030', span: '3 phases déploiement' },
          { href: '/pourquoi/equipe.html', strong: 'Leadership · DG/PCA', span: '17 ans ExxonMobil · 25 ETP' }
        ]},
        { h: 'Pourquoi maintenant', links: [
          { href: '/pourquoi/positionnement.html', strong: 'Vs Majors mondiaux', span: 'Complémentaire · pas concurrent' },
          { href: '/pourquoi/manifeste-immersif/', strong: '★ Manifeste DG immersif', span: 'Scroll storytelling 4 chap.' },
          { href: '/talents/diaspora-map/', strong: 'Talents diaspora', span: '500+ ingénieurs · 12 majors' },
          { href: '/sourcing-africain/', strong: 'Sourcing intra-africain', span: 'Dangote · Niger · Angola' }
        ]}
      ]
    },
    'hse': {
      featured: {
        href: '/hse/',
        tag: '★ Sécurité Intégrée OIMS',
        h: 'PSM · HSE · WMS · OIM',
        d: 'Système Sécurité Intégré OIMS-grade · transversal aux 4 pôles + stand-alone · 8 codes H01-H08.',
        cta: 'Système Sécurité →'
      },
      cols: [
        { h: 'Composants', links: [
          { href: '/hse/', strong: 'PSM · Process Safety', span: 'OSHA 1910.119 · API RP 750' },
          { href: '/hse/', strong: 'HSE · Health Environment', span: 'ISO 45001 · 14001' },
          { href: '/hse/', strong: 'WMS · Workforce Mgmt', span: 'ISO 45001 fatigue · training' },
          { href: '/hse/', strong: 'OIM · Operational Integrity', span: 'ExxonMobil OIMS-grade' }
        ]},
        { h: 'Standards', links: [
          { href: '/hse/', strong: 'OIMS · 11 elements', span: 'ExxonMobil framework' },
          { href: '/hse/', strong: 'API standards', span: 'API 1130 · 754 · 752' },
          { href: '/hse/', strong: 'IEC 62443 cyber-OT', span: 'Pipeline + SCADA security' },
          { href: '/hse/', strong: 'ISO 14001 environnement', span: 'Empreinte · waste · carbon' }
        ]},
        { h: 'Audits & cert.', links: [
          { href: '/hse/', strong: 'SOC 24/7 · pipelines', span: 'IA leak detection · 8 sec' },
          { href: '/hse/', strong: 'Bow-tie analysis', span: 'Risk · barriers · escalation' },
          { href: '/intermediaire/pipeline-360-demo/', strong: 'Pipeline 360° demo', span: 'Live SCADA + IA monitoring' },
          { href: '/glossaire.html', strong: 'Glossaire HSE', span: 'PSM · OIM · API · ISO refs' }
        ]}
      ]
    },
    'atlas-group': {
      featured: {
        href: '/data/atlas.html',
        tag: '★ Atlas O&G Tchad',
        h: 'Cadastre + opérateurs',
        d: '6 opérateurs canon · 25 permits actifs · 1 070 km pipeline · 50 stations IRVE.',
        cta: 'Explorer l\'atlas →'
      },
      cols: [
        { h: 'Cartes', links: [
          { href: '/data/atlas.html', strong: 'Cadastre pétrolier', span: '4 pôles · 25 permits' },
          { href: '/data/oleoduc-3d.html', strong: 'Pipeline Doba-Kribi 3D', span: '1 070 km visualisation' },
          { href: '/stations/', strong: 'Carte stations · live', span: '50 stations CEMAC 2030' },
          { href: '/talents/diaspora-map/', strong: 'Diaspora map mondiale', span: '500+ ingénieurs · 15 pays' }
        ]},
        { h: '6 opérateurs canon', links: [
          { href: '/operateurs/cnpcic.html', strong: 'CNPCIC', span: 'Bongor · Doba · upstream' },
          { href: '/operateurs/perenco.html', strong: 'Perenco', span: 'Mangara · production' },
          { href: '/operateurs/cotco-totco.html', strong: 'COTCO/TOTCO', span: 'Pipeline midstream' },
          { href: '/operateurs/sht.html', strong: 'SHT national', span: 'Stratégique souverain' }
        ]},
        { h: 'Données live', links: [
          { href: '/data/observatoire.html', strong: 'Observatoire marché', span: 'Indicateurs O&G live' },
          { href: '/data/dashboard.html', strong: 'Dashboard exécutif', span: 'KPIs commerciaux' },
          { href: '/data/', strong: 'Hub data · 4 outils', span: 'Centralisé' },
          { href: '/glossaire.html', strong: 'Glossaire taxonomies', span: 'Référentiel canon' }
        ]}
      ]
    }
  };

  function buildPanel(key) {
    var data = MEGA_DATA[key];
    if (!data) return null;
    var panel = document.createElement('div');
    panel.className = 'mega-panel';
    panel.setAttribute('data-mega-key', key);
    panel.setAttribute('role', 'menu');

    // Featured card
    var feat = data.featured;
    var f = document.createElement('a');
    f.className = 'mega-featured';
    f.href = feat.href;
    var ft = document.createElement('span'); ft.className = 'mega-featured-tag'; ft.textContent = feat.tag;
    var fh = document.createElement('h3'); fh.className = 'mega-featured-h'; fh.textContent = feat.h;
    var fd = document.createElement('p'); fd.className = 'mega-featured-d'; fd.textContent = feat.d;
    var fc = document.createElement('span'); fc.className = 'mega-featured-cta'; fc.textContent = feat.cta;
    f.appendChild(ft); f.appendChild(fh); f.appendChild(fd); f.appendChild(fc);
    panel.appendChild(f);

    // 3 link columns
    data.cols.forEach(function (col) {
      var c = document.createElement('div');
      var ch = document.createElement('p'); ch.className = 'mega-col-h'; ch.textContent = col.h;
      c.appendChild(ch);
      col.links.forEach(function (lk) {
        var a = document.createElement('a'); a.className = 'mega-link'; a.href = lk.href;
        var st = document.createElement('strong'); st.textContent = lk.strong;
        var sp = document.createElement('span'); sp.textContent = lk.span;
        a.appendChild(st); a.appendChild(sp);
        a.setAttribute('role', 'menuitem');
        c.appendChild(a);
      });
      panel.appendChild(c);
    });
    return panel;
  }

  var triggers = document.querySelectorAll('a.has-mega[data-pole]');
  if (!triggers.length) return;

  var activePanel = null;
  var hoverTimer = null;

  function openPanel(key, trigger) {
    if (activePanel && activePanel.dataset.megaKey === key) return;
    closeAll();
    var panel = buildPanel(key);
    if (!panel) return;
    document.body.appendChild(panel);
    var rect = trigger.getBoundingClientRect();
    panel.style.setProperty('--mega-top', (rect.bottom + 8) + 'px');
    requestAnimationFrame(function () { panel.classList.add('is-open'); });
    activePanel = panel;

    panel.addEventListener('mouseleave', function () {
      hoverTimer = setTimeout(closeAll, 200);
    });
    panel.addEventListener('mouseenter', function () {
      if (hoverTimer) clearTimeout(hoverTimer);
    });
  }

  function closeAll() {
    if (activePanel) {
      activePanel.classList.remove('is-open');
      var p = activePanel;
      setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 250);
      activePanel = null;
    }
  }

  triggers.forEach(function (t) {
    var key = t.getAttribute('data-pole');
    t.addEventListener('mouseenter', function () {
      if (hoverTimer) clearTimeout(hoverTimer);
      openPanel(key, t);
    });
    t.addEventListener('mouseleave', function () {
      hoverTimer = setTimeout(closeAll, 250);
    });
    t.addEventListener('focus', function () { openPanel(key, t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeAll(); t.blur(); }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();
