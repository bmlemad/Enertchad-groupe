/* ============================================================================
   EnerTchad Groupe — Navigation Premium v2 (v1.11.0)
   ============================================================================
   - ⌘K command palette (fuzzy search + recent pages + keyboard nav)
   - Breadcrumbs auto-generated depuis URL
   - Back-to-top floating button
   - Premium interactions : magnetic CTAs, ripple on click, cursor glow,
     mobile drawer swipe-to-close
   ============================================================================ */
(function () {
  'use strict';

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isCoarsePointer = () =>
    window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  /* ========================================================================
     INDEX : sitemap searchable (pages + sections clés + actions)
     ======================================================================== */
  const SITEMAP = [
    // Pages principales
    { title: 'Accueil', desc: 'Page d\'accueil EnerTchad Groupe', url: '/', group: 'Pages', icon: 'home' },
    { title: 'Le Groupe', desc: 'Histoire, mission, chiffres-clés', url: '/groupe', group: 'Pages', icon: 'building' },
    { title: 'Gouvernance', desc: 'Conseil, direction, comités', url: '/groupe#gouvernance', group: 'Pages', icon: 'users' },
    { title: 'Stratégie 2026–2030', desc: 'Plan directeur · priorités', url: '/groupe#strategie', group: 'Pages', icon: 'target' },
    { title: 'Carte interactive', desc: 'Implantations · bassins · infrastructures', url: '/maps', group: 'Pages', icon: 'map' },

    // Activités
    { title: 'Amont · E&P', desc: 'Exploration & production · 144 kb/j', url: '/operations/amont', group: 'Activités', icon: 'drop' },
    { title: 'Intermédiaire', desc: 'Pipeline · stockage · SCADA', url: '/operations/intermediaire', group: 'Activités', icon: 'pipe' },
    { title: 'Aval · Distribution', desc: 'Raffinage · lubrifiants · GPL', url: '/operations/aval', group: 'Activités', icon: 'fuel' },
    { title: 'Services', desc: 'Oilfield · ingénierie · digital', url: '/operations/services', group: 'Activités', icon: 'tools' },
    { title: 'Énergies · Transition', desc: 'Solaire · micro-grids · H₂ vert', url: '/energies/', group: 'Activités', icon: 'sun' },
    { title: 'Technologies · EnerTech', desc: 'SCADA · Digital Twins · IA · Cyber', url: '/technologies/', group: 'Activités', icon: 'chip' },

    // Finance & Performance
    { title: 'Espace Investisseurs', desc: 'Rapports, obligations, data room', url: '/investisseurs', group: 'Finance', icon: 'chart' },
    { title: 'Dashboard exécutif', desc: 'KPI temps réel · cockpit direction', url: '/dashboard-executif', group: 'Finance', icon: 'gauge' },
    { title: 'Synthèse publique', desc: 'Chiffres-clés consolidés 2025', url: '/dashboard', group: 'Finance', icon: 'bar' },

    // Engagement & Autres
    { title: 'Durabilité · ESG', desc: 'Climat, eau, communautés, gouvernance', url: '/durabilite', group: 'Engagement', icon: 'leaf' },
    { title: 'Talents & Carrières', desc: 'Postes ouverts, programmes jeunes', url: '/talents', group: 'Engagement', icon: 'user-plus' },
    { title: 'Newsroom', desc: 'Communiqués, annonces, presse', url: '/actualites', group: 'Actualités', icon: 'news' },
    { title: 'Newsletter', desc: 'Briefing mensuel exécutif', url: '/newsletter', group: 'Actualités', icon: 'mail' },
    { title: 'Contact', desc: 'Sièges, directions, réseaux', url: '/contact', group: 'Actualités', icon: 'phone' },

    // Actions rapides
    { title: 'Investir avec nous', desc: 'Formulaire de contact investisseur', url: '/contact#investir', group: 'Actions', icon: 'arrow' },
    { title: 'Mentions légales', desc: 'RCCM, NIF, conditions', url: '/mentions-legales', group: 'Légal', icon: 'doc' },
    { title: 'Confidentialité', desc: 'Politique de confidentialité', url: '/confidentialite', group: 'Légal', icon: 'shield' },
    { title: 'Cookies', desc: 'Gestion des cookies', url: '/cookies', group: 'Légal', icon: 'cookie' }
  ];

  /* ========================================================================
     ICÔNES SVG inline (compactes)
     ======================================================================== */
  const ICONS = {
    home:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>',
    building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M4 21h13M4 21H3m14 0h1m-8-11h2m-2 4h2M9 10h0M9 14h0"/></svg>',
    users:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M14 18c0-2 2-4 5-4s4 2 4 4"/></svg>',
    target:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
    map:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3v15M15 6v15M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/></svg>',
    drop:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/></svg>',
    pipe:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h4a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 1 2-2h3"/></svg>',
    fuel:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M14 8l4 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-9l-4-4M4 21h10"/></svg>',
    tools:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.7 6.3a5 5 0 1 0 3 3L21 5l-3-3-4.3 4.3zM9 12l-7 7 3 3 7-7"/></svg>',
    sun:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>',
    chip:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="5" width="14" height="14" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx=".5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
    chart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3v18h18M7 15l4-5 4 3 5-6"/></svg>',
    gauge:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 14a8 8 0 1 1 16 0M12 14l4-4"/></svg>',
    bar:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 21V10M12 21V3M19 21v-7"/></svg>',
    leaf:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 4C12 4 4 9 4 17c0 2 1 3 3 3 8 0 13-5 13-13V4zM4 20c4-8 12-12 16-12"/></svg>',
    'user-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M18 9v6M15 12h6"/></svg>',
    news:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4zM4 19V6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM8 8h8M8 12h8M8 16h5"/></svg>',
    mail:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>',
    phone:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 3h4l1.5 4.5-2.5 1.5a11 11 0 0 0 5 5l1.5-2.5L19 13v4a2 2 0 0 1-2 2A14 14 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    arrow:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    doc:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 2h9l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M15 2v4a2 2 0 0 0 2 2h4M9 13h7M9 17h5"/></svg>',
    shield:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/></svg>',
    cookie:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2a10 10 0 1 0 10 10c-3 0-4-2-4-4 0-1-1-2-2-2-2 0-3-2-3-3 0-.5.2-1 0-1z"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="14" cy="13" r=".8" fill="currentColor"/><circle cx="11" cy="16" r=".8" fill="currentColor"/></svg>',
    search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'
  };

  const iconHTML = (name) => ICONS[name] || ICONS.arrow;

  /* ========================================================================
     HELPER : fuzzy match simple (score par occurrences / proximité)
     ======================================================================== */
  function fuzzyMatch(query, item) {
    const q = query.trim().toLowerCase();
    if (!q) return 100;
    const hay = (item.title + ' ' + (item.desc || '') + ' ' + (item.group || '')).toLowerCase();
    // Match exact début de titre → score max
    if (item.title.toLowerCase().startsWith(q)) return 1000 - (item.title.length - q.length);
    // Match sous-chaîne
    const idx = hay.indexOf(q);
    if (idx !== -1) return 500 - idx;
    // Match char-par-char (fuzzy)
    let qi = 0, score = 0, last = -1;
    for (let i = 0; i < hay.length && qi < q.length; i++) {
      if (hay[i] === q[qi]) {
        score += last === i - 1 ? 12 : 5;
        last = i;
        qi++;
      }
    }
    if (qi === q.length) return score;
    return 0;
  }

  /* ========================================================================
     CMD-K PALETTE
     ======================================================================== */
  function initCommandPalette() {
    if (document.querySelector('.cmd-palette')) return;

    const palette = document.createElement('div');
    palette.className = 'cmd-palette';
    palette.setAttribute('role', 'dialog');
    palette.setAttribute('aria-modal', 'true');
    palette.setAttribute('aria-label', 'Recherche globale');
    palette.innerHTML = `
      <div class="cmd-palette-dialog">
        <div class="cmd-palette-search">
          ${iconHTML('search')}
          <input type="search" data-cmd-input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Rechercher une page, un pôle, une action…" aria-label="Rechercher dans le site" />
          <kbd>Esc</kbd>
        </div>
        <div class="cmd-palette-results" data-cmd-results role="listbox"></div>
        <div class="cmd-palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span>
          <span><kbd>↵</kbd> ouvrir</span>
          <span><kbd>Esc</kbd> fermer</span>
        </div>
      </div>
    `;
    document.body.appendChild(palette);

    const input = palette.querySelector('[data-cmd-input]');
    const results = palette.querySelector('[data-cmd-results]');
    const dialog = palette.querySelector('.cmd-palette-dialog');
    let activeIndex = 0;
    let currentItems = [];
    let lastFocused = null;

    function render(query) {
      const scored = SITEMAP
        .map(item => ({ item, score: fuzzyMatch(query, item) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score);

      currentItems = scored.map(x => x.item);
      if (!currentItems.length) {
        results.innerHTML = `<div class="cmd-palette-empty">Aucun résultat pour <em>${escapeHTML(query)}</em></div>`;
        return;
      }

      // Group par groupe
      const byGroup = {};
      currentItems.forEach(i => {
        byGroup[i.group] = byGroup[i.group] || [];
        byGroup[i.group].push(i);
      });

      let html = '';
      let flatIdx = 0;
      Object.keys(byGroup).forEach(g => {
        html += `<div class="cmd-palette-group-title">${escapeHTML(g)}</div>`;
        byGroup[g].forEach(i => {
          html += `<a class="cmd-palette-item${flatIdx === activeIndex ? ' is-active' : ''}" href="${escapeHTML(i.url)}" data-idx="${flatIdx}" role="option">
            <span class="cmd-palette-item-icon">${iconHTML(i.icon)}</span>
            <span class="cmd-palette-item-body">
              <span class="cmd-palette-item-title">${escapeHTML(i.title)}</span>
              <span class="cmd-palette-item-desc">${escapeHTML(i.desc)}</span>
            </span>
          </a>`;
          flatIdx++;
        });
      });
      results.innerHTML = html;
      // Flatten active index bound
      if (activeIndex >= currentItems.length) activeIndex = 0;
      updateActive();
    }

    function updateActive() {
      const items = results.querySelectorAll('.cmd-palette-item');
      items.forEach((el, i) => el.classList.toggle('is-active', i === activeIndex));
      const active = items[activeIndex];
      if (active) active.scrollIntoView({ block: 'nearest' });
    }

    function open() {
      lastFocused = document.activeElement;
      palette.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      activeIndex = 0;
      input.value = '';
      render('');
      // Focus après l'animation
      setTimeout(() => input.focus(), 30);
    }

    function close() {
      palette.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Trigger button in nav
    document.querySelectorAll('[data-cmd-k-trigger]').forEach(btn => {
      btn.addEventListener('click', open);
    });

    // ⌘K / Ctrl+K global shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (palette.classList.contains('is-open')) close();
        else open();
      }
      if (e.key === 'Escape' && palette.classList.contains('is-open')) {
        e.preventDefault();
        close();
      }
    });

    // Click outside dialog → close
    palette.addEventListener('click', (e) => {
      if (!dialog.contains(e.target)) close();
    });

    input.addEventListener('input', () => {
      activeIndex = 0;
      render(input.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentItems.length) activeIndex = (activeIndex + 1) % currentItems.length;
        updateActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentItems.length) activeIndex = (activeIndex - 1 + currentItems.length) % currentItems.length;
        updateActive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const items = results.querySelectorAll('.cmd-palette-item');
        const active = items[activeIndex];
        if (active) {
          window.location.href = active.getAttribute('href');
        }
      }
    });

    // Focus trap simple
    palette.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = palette.querySelectorAll('input, a[href], button');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ========================================================================
     BREADCRUMBS — génération auto depuis URL si conteneur présent
     ======================================================================== */
  function initBreadcrumbs() {
    const host = document.querySelector('[data-breadcrumbs]');
    if (!host) return;

    const LABELS = {
      '': 'Accueil',
      'groupe': 'Le Groupe',
      'investisseurs': 'Investisseurs',
      'dashboard': 'Synthèse publique',
      'dashboard-executif': 'Dashboard exécutif',
      'durabilite': 'Durabilité · ESG',
      'talents': 'Talents & Carrières',
      'actualites': 'Actualités',
      'newsletter': 'Newsletter',
      'contact': 'Contact',
      'maps': 'Cartographie',
      'mentions-legales': 'Mentions légales',
      'confidentialite': 'Confidentialité',
      'cookies': 'Cookies',
      'energies': 'Énergies · Transition',
      'technologies': 'Technologies · EnerTech',
      'operations': 'Activités',
      'amont': 'Amont · E&P',
      'intermediaire': 'Intermédiaire',
      'aval': 'Aval · Distribution',
      'services': 'Services'
    };

    const path = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');
    const parts = path.split('/').filter(Boolean);
    if (!parts.length) { host.innerHTML = ''; return; }

    const crumbs = [{ label: 'Accueil', url: '/' }];
    let current = '';
    parts.forEach(p => {
      current += '/' + p;
      crumbs.push({ label: LABELS[p] || p.charAt(0).toUpperCase() + p.slice(1), url: current });
    });

    let html = '<div class="breadcrumbs-inner" aria-label="Fil d\'Ariane"><ol style="display:flex;gap:8px;list-style:none;padding:0;margin:0;flex-wrap:wrap;align-items:center;">';
    crumbs.forEach((c, i) => {
      const isLast = i === crumbs.length - 1;
      html += '<li style="display:inline-flex;align-items:center;gap:8px;">';
      if (isLast) html += `<span class="breadcrumbs-current" aria-current="page">${escapeHTML(c.label)}</span>`;
      else html += `<a href="${escapeHTML(c.url)}">${escapeHTML(c.label)}</a>`;
      if (!isLast) html += '<span class="breadcrumbs-sep" aria-hidden="true">›</span>';
      html += '</li>';
    });
    html += '</ol></div>';
    host.innerHTML = html;

    // JSON-LD BreadcrumbList
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': crumbs.map((c, i) => ({
        '@type': 'ListItem', 'position': i + 1, 'name': c.label,
        'item': 'https://www.enertchad.td' + c.url
      }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(ld);
    host.appendChild(script);
  }

  /* ========================================================================
     BACK-TO-TOP — bouton flottant
     ======================================================================== */
  function initBackToTop() {
    if (document.querySelector('.back-to-top')) return;

    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Retour en haut de page');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);

    const threshold = 400;
    let raf = null;

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        btn.classList.toggle('is-visible', window.scrollY > threshold);
        raf = null;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      const reduce = prefersReducedMotion();
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      // Return focus to skip-link or main content for a11y
      const target = document.querySelector('#main-content') || document.body;
      setTimeout(() => {
        if (target && typeof target.focus === 'function') target.focus({ preventScroll: true });
      }, reduce ? 0 : 500);
    });
  }

  /* ========================================================================
     CURSOR GLOW — desktop only
     ======================================================================== */
  function initCursorGlow() {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    if (document.querySelector('.cursor-glow')) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let raf = null, x = 0, y = 0;
    function render() {
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = null;
    }
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      document.body.classList.add('has-cursor-glow');
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });
    document.addEventListener('pointerleave', () => {
      document.body.classList.remove('has-cursor-glow');
    });
  }

  /* ========================================================================
     MAGNETIC BUTTONS — CTAs premium
     ======================================================================== */
  function initMagnetic() {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    const strength = 0.35;
    const range = 80;
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > range) return;
        el.style.setProperty('--mx', (dx * strength).toFixed(1));
        el.style.setProperty('--my', (dy * strength).toFixed(1));
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mx', '0');
        el.style.setProperty('--my', '0');
      });
    });
  }

  /* ========================================================================
     RIPPLE on click — premium tactile feedback
     ======================================================================== */
  function initRipple() {
    if (prefersReducedMotion()) return;

    // Auto-apply data-ripple to primary CTAs and nav items
    const selectors = '.btn-primary, .btn-ghost, .cmd-k-trigger, .nav-drop-trigger, .nav-sub-link, .mega-pole, .back-to-top';
    document.querySelectorAll(selectors).forEach(el => {
      if (!el.hasAttribute('data-ripple')) el.setAttribute('data-ripple', '');
    });

    document.addEventListener('pointerdown', (e) => {
      const el = e.target.closest('[data-ripple]');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const r = document.createElement('span');
      r.className = 'rpl';
      r.style.width = r.style.height = size + 'px';
      r.style.left = x + 'px';
      r.style.top = y + 'px';
      el.appendChild(r);
      setTimeout(() => r.remove(), 700);
    }, { passive: true });
  }

  /* ========================================================================
     MOBILE DRAWER v2 — swipe-to-close
     ======================================================================== */
  function initDrawerSwipe() {
    const links = document.querySelector('.nav-wrap.is-v2 .nav-links');
    if (!links) return;

    let startY = 0, currY = 0, tracking = false;

    links.addEventListener('touchstart', (e) => {
      if (!links.classList.contains('is-open')) return;
      if (links.scrollTop > 0) return; // Only drag from top
      startY = e.touches[0].clientY;
      currY = startY;
      tracking = true;
      links.style.transition = 'none';
    }, { passive: true });

    links.addEventListener('touchmove', (e) => {
      if (!tracking) return;
      currY = e.touches[0].clientY;
      const dy = Math.max(0, currY - startY);
      links.style.transform = `translateY(${dy}px)`;
    }, { passive: true });

    links.addEventListener('touchend', () => {
      if (!tracking) return;
      tracking = false;
      links.style.transition = '';
      const dy = currY - startY;
      if (dy > 120) {
        // Close the drawer
        const toggle = document.querySelector('.nav-toggle');
        if (toggle) toggle.click();
      } else {
        links.style.transform = '';
      }
    });
  }

  /* ========================================================================
     MARK NAV-WRAP as is-v2 + enable scroll-halo
     ======================================================================== */
  function activateNavV2() {
    const wrap = document.querySelector('.nav-wrap');
    if (!wrap) return;
    wrap.classList.add('is-v2');

    // Scroll halo
    let raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        wrap.classList.toggle('is-scrolled', window.scrollY > 20);
        raf = null;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================================================
     MARK primary CTAs with data-magnetic
     ======================================================================== */
  function markMagnetic() {
    const sels = ['.btn-primary', '.nav-cta-btn', '.back-to-top', '.mf-cta.is-primary'];
    sels.forEach(s => {
      document.querySelectorAll(s).forEach(el => {
        if (!el.hasAttribute('data-magnetic')) el.setAttribute('data-magnetic', '');
      });
    });
  }

  /* ========================================================================
     BOOT
     ======================================================================== */
  function boot() {
    activateNavV2();
    initCommandPalette();
    initBreadcrumbs();
    initBackToTop();
    initCursorGlow();
    markMagnetic();
    initMagnetic();
    initRipple();
    initDrawerSwipe();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
