/**
 * EnerTchad Groupe SA/CA · enertchad.js v2.1
 * Single JS — scroll progress, reveal, counters, drawer, ⌘K palette, back-to-top, active nav
 */
(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. Scroll progress bar ─────────────────────────── */
  function initScrollProgress(){
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden','true');
    document.body.appendChild(bar);
    const update = () => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (top/h)*100 : 0) + '%';
    };
    window.addEventListener('scroll', update, {passive:true});
    update();
  }

  /* ─── 2. Reveal on scroll ────────────────────────────── */
  function initReveal(){
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduce) { els.forEach(e => e.classList.add('in')); return; }
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((ents) => {
        ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
      els.forEach(e => obs.observe(e));
    } else { els.forEach(e => e.classList.add('in')); }
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
          <a href="${rel('operateurs/')}">5 opérateurs cibles</a>
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
    { cat: 'Pourquoi', title: 'Manifeste DG', desc: 'Vision fondatrice par Bignéro Le Madang', href: 'pourquoi/manifeste.html' },
    { cat: 'Pourquoi', title: 'Positionnement vs Majors', desc: 'Comparaison major O&G, major O&G, Shell', href: 'pourquoi/positionnement.html' },
    { cat: 'Pourquoi', title: 'Trajectoire 2026-2030', desc: 'Roadmap publique 3 phases · jalons trimestriels', href: 'pourquoi/trajectoire.html' },
    { cat: 'Pourquoi', title: 'Équipe & Leadership', desc: 'Profil DG · Advisory Board · 25 fiches Phase 1', href: 'pourquoi/equipe.html' },
    { cat: 'Solutions', title: '10 services techniques', desc: 'Catalogue par 6 pôles métier', href: 'solutions/' },
    { cat: 'Solutions', title: 'Configurateur 3 questions', desc: 'Trouvez votre package en 30 secondes', href: 'solutions/configurateur.html' },
    { cat: 'Solutions', title: 'Calculateur ROI', desc: 'Simulateur économie services local', href: 'solutions/calculateur.html' },
    { cat: 'Opérateurs', title: 'Opérateur Bongor', desc: '~30 kb/j · E&P + EOR + SCADA + HSE', href: 'operateurs/cnpcic.html' },
    { cat: 'Opérateurs', title: 'Opérateur Doba', desc: '~70 kb/j · E&P + EOR + ILI + Maintenance', href: 'operateurs/perenco.html' },
    { cat: 'Opérateurs', title: 'opérateur national · NOC souveraine', desc: 'ESG/ITIE + DDT + PSC + EnerAcademy', href: 'operateurs/sht.html' },
    { cat: 'Opérateurs', title: 'opérateurs pipeline · Pipeline', desc: '1067 km · ILI + SCADA + Cyber + Sécurité IA', href: 'operateurs/cotco-totco.html' },
    { cat: 'Opérateurs', title: 'Raffinerie nationale · Raffinerie Djermaya', desc: 'ICS/OT + Sécurité IA + Blending + Maintenance', href: 'operateurs/srn.html' },
    { cat: 'Data', title: 'Atlas opérationnel', desc: '12 actifs O&G du Tchad', href: 'data/atlas.html' },
    { cat: 'Data', title: 'Observatoire live', desc: 'Indicateurs marché · refresh quotidien', href: 'data/observatoire.html' },
    { cat: 'Data', title: 'Pipeline 3D', desc: 'Doba-Kribi · 1067 km en 3D', href: 'data/oleoduc-3d.html' },
    { cat: 'Data', title: 'Dashboard exécutif', desc: 'Suivi commercial · KPIs phase déploiement', href: 'data/dashboard.html' },
    { cat: 'Engagement', title: 'Investisseurs · Tour 2026', desc: '8-12 M USD · OHADA · closing Q2', href: 'engagement/investisseurs.html' },
    { cat: 'Engagement', title: 'Transparence', desc: '8 engagements publics ITIE/OHADA/RGPD', href: 'engagement/transparence.html' },
    { cat: 'Engagement', title: 'Presse', desc: 'Kit médias · communiqués · contact', href: 'engagement/presse.html' },
    { cat: 'Engagement', title: 'Contact', desc: 'Réserver 30 min · 6 emails dédiés', href: 'engagement/contact.html' },
    { cat: 'Légal', title: 'Mentions légales', desc: 'Éditeur · OHADA · droit applicable', href: 'legal/mentions-legales.html' },
    { cat: 'Légal', title: 'Confidentialité', desc: 'RGPD + droit tchadien · DPO', href: 'legal/confidentialite.html' },
  ];

  function initCmdK(){
    // Trigger UI handled by Vague Q2 initVisibleSearch() (.nav-search) — legacy .cmdk-trigger removed (no double button)
    
    // Inject modal
    if (document.querySelector('.cmdk-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'cmdk-modal';
    modal.setAttribute('role', 'dialog');
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
        resultsBox.innerHTML = '<div class="cmdk-empty">Aucun résultat pour <strong>' + q + '</strong></div>';
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
    window.addEventListener('scroll', toggle, {passive:true});
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
    window.addEventListener('scroll', onScroll, {passive:true});
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
  function initTourPulse(){
    document.querySelectorAll('.cta-btn').forEach(btn => {
      const txt = (btn.textContent || '').trim();
      if (/Tour 2026/i.test(txt) || /8-12 M USD/i.test(txt)) {
        btn.classList.add('cta-tour-2026');
      }
    });
  }

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


  /* ─── Q2-E. Persona switcher utility bar ────────────── */
  function initPersonaBar(){
    if (document.querySelector('.persona-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'persona-bar';
    bar.innerHTML = `
      <div class="persona-bar-inner">
        <span class="persona-bar-label">Vue adaptée pour</span>
        <div class="persona-bar-list" role="tablist">
          <button data-persona="all" aria-pressed="true"><span class="persona-icon">⊞</span><span class="persona-name">Tous</span></button>
          <button data-persona="investor" aria-pressed="false"><span class="persona-icon">💼</span><span class="persona-name">Investisseur</span></button>
          <button data-persona="operator" aria-pressed="false"><span class="persona-icon">🛢</span><span class="persona-name">Opérateur</span></button>
          <button data-persona="press" aria-pressed="false"><span class="persona-icon">📰</span><span class="persona-name">Presse</span></button>
          <button data-persona="talent" aria-pressed="false"><span class="persona-icon">🎓</span><span class="persona-name">Talent</span></button>
        </div>
      </div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);

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

      'amont': {
        intro: { icon: '🟢', label: 'Pôle Amont · Upstream', desc: 'Exploration · Production · EOR · 5 bassins', stat: '22M', statLabel: 'USD 2030' },
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
        intro: { icon: '🔵', label: 'Pôle Intermédiaire · Midstream', desc: 'Pipeline · Stockage · Métrologie', stat: '12M', statLabel: 'USD 2030' },
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
        intro: { icon: '🟡', label: 'Pôle Aval · Downstream', desc: 'Raffinage · Distribution · IRVE 50', stat: '16M', statLabel: 'USD 2030' },
        pole: 'aval',
        sections: [
          {
            title: 'Services Aval (Downstream)',
            count: '2',
            links: [
              { href: '/solutions/?pole=aval', strong: 'S09 · Blending Lubrifiants', small: '15W-40 · 5W-30 · ISO VG · API SN/SP', icon: '⚗', pole: 'aval' },
              { href: '/solutions/?pole=aval', strong: 'U06 · Distribution Mobile', small: 'Mobile Station™ · IRVE 50 stations CEMAC', icon: '⛽', pole: 'aval' },
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
        intro: { icon: '💼', label: 'Engagement · Pourquoi · Tour 2026', desc: 'Vision · Investisseurs · ESG/RSE/HSE · Presse', stat: '8-12', statLabel: 'M USD Tour' },
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
            count: '4',
            links: [
              { href: '/engagement/investisseurs.html', strong: 'Tour 2026 · Investisseurs', small: '8-12 M USD · OHADA · DD package · War Room live', icon: '💼', badge: 'TOUR' },
              { href: '/engagement/transparence.html', strong: 'ESG · RSE · HSE', small: '3 piliers · 6 KPIs · agence ONU réfugiés/ONG biodiversité internationale · ITIE · GRI Standards reporting · TCFD', icon: '🌍', badge: 'NEW' },
              { href: '/engagement/presse.html', strong: 'Presse', small: 'Communiqués · médias · DG quotes', icon: '📰', badge: null },
              { href: '/engagement/contact.html', strong: 'Contact', small: 'N\'Djamena · cal.com · LinkedIn', icon: '✉', badge: null },
            ]
          }
        ],
        featured: { title: 'Closing T3 2026', desc: 'Sièges Tour Seed/Pre-A · DFI lead', cta: 'Term sheet →', href: '/engagement/investisseurs.html', thumb: '🎯', badgeLive: true }
      }
    };

    const PANELS_EN = {

      'amont': {
        intro: { icon: '🟢', label: 'Upstream Division', desc: 'Exploration · Production · EOR · 5 basins', stat: '22M', statLabel: 'USD 2030' },
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
        intro: { icon: '🔵', label: 'Midstream Division', desc: 'Pipeline · Storage · Metering', stat: '12M', statLabel: 'USD 2030' },
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
        intro: { icon: '🟡', label: 'Downstream Division', desc: 'Refining · Distribution · 50 EVCS', stat: '16M', statLabel: 'USD 2030' },
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
      
      const sectionsHTML = data.sections.map(sec => {
        const linksHTML = sec.links.map(l => {
          const isCurrent = currentPath === l.href.replace(/\?.*$/, '').replace(/\/$/, '') || currentPath === l.href.split('?')[0];
          const poleAttr = l.pole ? `data-pole="${l.pole}"` : '';
          const badgeHTML = l.badge ? `<span class="mega-panel-badge ${l.badge === 'LIVE' ? 'live' : (l.badge === 'NEW' ? 'new' : '')}">${l.badge}</span>` : '';
          return `<a href="${l.href}" ${poleAttr} ${isCurrent ? 'class="is-current" aria-current="page"' : ''}>
            <span class="mega-panel-icon" aria-hidden="true">${l.icon || '→'}</span>
            <span class="mega-panel-link-text"><strong>${l.strong}${badgeHTML}</strong><small>${l.small}</small></span>
          </a>`;
        }).join('');
        return `
          <div class="mega-panel-section">
            <h5>${sec.title}${sec.count ? `<span class="mega-section-count">${sec.count}</span>` : ''}</h5>
            ${linksHTML}
          </div>`;
      }).join('');
      
      const featuredHTML = data.featured ? `
        <div class="mega-panel-featured">
          ${data.featured.thumb ? `<div class="mega-panel-featured-thumb" aria-hidden="true">${data.featured.thumb}</div>` : ''}
          <div class="mega-panel-featured-text">
            <strong>${data.featured.title}${data.featured.badgeLive ? `<span class="mega-panel-badge live" style="margin-left:8px">LIVE</span>` : ''}</strong>
            <p>${data.featured.desc}</p>
          </div>
          <a class="mega-panel-featured-cta" href="${data.featured.href}">${data.featured.cta}</a>
        </div>` : '';
      
      const introHTML = data.intro ? `
        <div class="mega-panel-intro">
          <div class="mega-panel-intro-icon" aria-hidden="true">${data.intro.icon}</div>
          <div class="mega-panel-intro-text">
            <strong>${data.intro.label}</strong>
            <small>${data.intro.desc}</small>
          </div>
          <div class="mega-panel-intro-stat">${data.intro.stat}<small>${data.intro.statLabel}</small></div>
        </div>` : '';
      panel.innerHTML = `${introHTML}<div class="mega-panel-grid">${sectionsHTML}</div>${featuredHTML}`;
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

  function init(){
    try {
      initScrollProgress();
      initReveal();
      initCounters();
      initDrawer();
      initCmdK();
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
    initVisibleSearch();
    initQuickActions();
    initWarRoom();
    initTourCountdown();
    trackRecentlyViewed();
    initPageNav();
      document.body.classList.add('et-loaded');
    } catch(err){ console.warn('[enertchad]', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
