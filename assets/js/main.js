/* ==========================================================================
   EnerTchad Groupe — main.js
   Scroll reveals, number counters, interactive map, nav behaviors
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     MEGA MENU INJECTION — config-driven rich dropdowns for secondary nav items
     Single source of truth → injected into every page without markup duplication
     ========================================================================== */
  const MEGA_PANELS = {
    Groupe: {
      href: '/groupe',
      eyebrow: 'Le Groupe',
      search: 'groupe mission histoire gouvernance dirigeants identité conseil administration comités ethique',
      cols: [
        { head: 'Identité · Vision', items: [
          { href: '/groupe#mission',     icon: '01', title: 'Mission & vision',      sub: 'Champion énergétique souverain', meta: '4 piliers · 1 horizon 2030' },
          { href: '/groupe#histoire',    icon: '02', title: 'Notre histoire',        sub: '2003 → 2026',                    meta: '23 ans · 5 étapes clés' },
          { href: '/groupe#gouvernance', icon: '03', title: 'Gouvernance',           sub: 'Conseil · Direction · Comités',  meta: '11 administrateurs · 4 comités' },
        ]},
        { head: 'Engagements', items: [
          { href: '/durabilite',         icon: '04', title: 'Durabilité ESG',        sub: 'Climat · social · éthique',      meta: 'CDP B · MSCI AA' },
          { href: '/talents',            icon: '05', title: 'Nos talents',           sub: '1 240 collaborateurs · 85 % locaux', meta: 'Parité 38 % · 120 apprentis' },
        ]},
      ],
      feature: {
        eyebrow: 'Rapport annuel 2025',
        title: 'Une chaîne <em>intégrée</em>, un champion <em>souverain</em>.',
        stats: [
          { val: '1 240',  unit: '',      label: 'Collaborateurs' },
          { val: '53',     unit: '',      label: 'Contrats ITIE' },
          { val: '2,1',    unit: 'Md$',   label: 'CA consolidé' },
          { val: 'A−',     unit: '',      label: 'Rating S&P' },
        ],
        ctas: [
          { href: '/groupe',                              label: 'Découvrir le Groupe', primary: true },
          { href: '/documents/rapport-annuel-2025.pdf',   label: 'Rapport annuel (PDF)' },
        ],
      },
    },

    Investisseurs: {
      href: '/investisseurs',
      eyebrow: 'Investisseurs',
      search: 'investisseurs actionnaires bourse dividende rapport annuel irs dcf agence rating itie transparence',
      cols: [
        { head: 'Performance', items: [
          { href: '/investisseurs#kpis',     icon: '01', title: 'KPIs financiers',     sub: 'CA · EBITDA · cash-flow',  meta: 'MAJ trimestrielle' },
          { href: '/investisseurs#rating',   icon: '02', title: 'Notation & rating',   sub: 'S&P A− · Moody\u2019s A3', meta: 'Perspective stable' },
          { href: '/dashboard-executif',     icon: '03', title: 'Dashboard exécutif',  sub: 'Temps réel · KPIs live',   meta: 'SCADA connecté · 24/7', live: true },
        ]},
        { head: 'Publications', items: [
          { href: '/documents/rapport-annuel-2025.pdf',   icon: '04', title: 'Rapport annuel 2025',      sub: 'PDF · 152 pages', meta: '18 Mo · FR/EN' },
          { href: '/documents/communique-q4-2025.pdf',    icon: '05', title: 'Communiqués trimestriels', sub: 'Q1 Q2 Q3 Q4',     meta: '4 publications/an' },
          { href: '/investisseurs#agenda',                 icon: '06', title: 'Agenda investisseurs',     sub: 'AGM · earnings · roadshows', meta: '8 rendez-vous 2026' },
        ]},
      ],
      feature: {
        eyebrow: 'Performance 2026',
        title: 'Des fondamentaux <em>solides</em>, une trajectoire <em>claire</em>.',
        stats: [
          { val: '2,1',  unit: 'Md$', label: 'CA 2025' },
          { val: '+14',  unit: '%',   label: 'EBITDA YoY' },
          { val: 'A−',   unit: '',    label: 'Rating S&P' },
          { val: '53',   unit: '',    label: 'Contrats ITIE' },
        ],
        ctas: [
          { href: '/investisseurs',     label: 'Espace investisseurs', primary: true },
          { href: '/dashboard-executif', label: 'Dashboard exécutif' },
        ],
      },
    },

    Durabilité: {
      href: '/durabilite',
      eyebrow: 'Durabilité',
      search: 'durabilite durability esg climat carbone co2 social communautes ethique itie transparence odd sdg',
      cols: [
        { head: 'Climat · Environnement', items: [
          { href: '/durabilite#climat',    icon: '01', title: 'Trajectoire climat',  sub: 'Net zéro 2050 · SBTi',    meta: '−48 % CO₂ vs 2020 · vérifié' },
          { href: '/durabilite#biodiv',    icon: '02', title: 'Biodiversité',         sub: '6 aires protégées · IUCN',meta: '412 km² reforestés' },
          { href: '/energies/',            icon: '03', title: 'Transition énergies', sub: 'Solaire · H₂ vert',       meta: '125 MW · 28 villages' },
        ]},
        { head: 'Social · Éthique', items: [
          { href: '/durabilite#social',    icon: '04', title: 'Communautés',          sub: '28 villages électrifiés', meta: '624 GWh livrés' },
          { href: '/durabilite#ethique',   icon: '05', title: 'Éthique & conformité', sub: 'ITIE · OCDE · UNGC',       meta: '53 contrats publiés' },
        ]},
      ],
      feature: {
        eyebrow: 'ESG · Ratings 2026',
        title: 'Une ambition <em>durable</em>, des résultats <em>vérifiés</em>.',
        stats: [
          { val: '−48',  unit: '%',    label: 'CO₂ vs 2020' },
          { val: '42',   unit: 'kt/an', label: 'CO₂ évité' },
          { val: 'B',    unit: '',     label: 'CDP climat' },
          { val: 'AA',   unit: '',     label: 'MSCI ESG' },
        ],
        ctas: [
          { href: '/durabilite',                      label: 'Rapport durabilité', primary: true },
          { href: '/documents/rapport-esg-2025.pdf',  label: 'Rapport ESG (PDF)' },
        ],
      },
    },

    Talents: {
      href: '/talents',
      eyebrow: 'Talents',
      search: 'talents carriere emploi jobs recrutement apprentis formation ingenieur opérateur technicien',
      cols: [
        { head: 'Rejoindre', items: [
          { href: '/talents#offres',       icon: '01', title: 'Offres ouvertes',     sub: '54 postes · 7 métiers',    meta: 'Updated daily' },
          { href: '/talents#apprentis',    icon: '02', title: 'Programme apprentis', sub: '120 alternants · 2026',    meta: 'Bac+2 à Bac+5' },
          { href: '/talents#formations',   icon: '03', title: 'Formations internes', sub: 'Leadership · HSE · SCADA', meta: '1 800 heures/an' },
        ]},
        { head: 'Culture', items: [
          { href: '/talents#diversite',    icon: '04', title: 'Diversité & inclusion', sub: 'Parité 38 % · 11 nationalités', meta: 'Label Great Place to Work' },
          { href: '/talents#benefits',     icon: '05', title: 'Bénéfices & avantages', sub: 'Santé · retraite · mobilité',   meta: 'Top 10 Afrique' },
        ]},
      ],
      feature: {
        eyebrow: 'People · 2026',
        title: 'L\u2019énergie du Tchad, portée par <em>ses talents</em>.',
        stats: [
          { val: '1 240',  unit: '',  label: 'Collaborateurs' },
          { val: '85',     unit: '%', label: 'Tchadiens' },
          { val: '38',     unit: '%', label: 'Femmes' },
          { val: '120',    unit: '',  label: 'Apprentis' },
        ],
        ctas: [
          { href: '/talents',          label: 'Voir les offres', primary: true },
          { href: '/talents#candidature', label: 'Candidature spontanée' },
        ],
      },
    },

    Actualités: {
      href: '/actualites',
      eyebrow: 'Actualités',
      search: 'actualites news presse communiques events conferences evenements blog updates',
      cols: [
        { head: 'À la une', items: [
          { href: '/actualites#une',       icon: '01', title: 'Dernières actualités',  sub: '12 articles · avril 2026',     meta: 'Mis à jour il y a 3 h' },
          { href: '/actualites#communiques', icon: '02', title: 'Communiqués de presse', sub: 'Officiels · investisseurs',    meta: '28 publications/an' },
          { href: '/actualites#blog',      icon: '03', title: 'Blog Groupe',            sub: 'Analyses · tribunes · retour',  meta: 'Hebdomadaire' },
        ]},
        { head: 'Événements', items: [
          { href: '/actualites#events',    icon: '04', title: 'Événements & salons',   sub: 'Africa Energy Week · ADIPEC',  meta: '8 rendez-vous 2026' },
          { href: '/newsletter',           icon: '05', title: 'Newsletter mensuelle',  sub: 'Chiffres clés · pipeline',     meta: '4 200 abonnés' },
        ]},
      ],
      feature: {
        eyebrow: 'Calendrier 2026',
        title: 'Rester <em>informé</em>, anticiper <em>l\u2019industrie</em>.',
        stats: [
          { val: '28',   unit: '',  label: 'Communiqués/an' },
          { val: '12',   unit: '',  label: 'Articles avril' },
          { val: '4 200', unit: '', label: 'Abonnés' },
          { val: '8',    unit: '',  label: 'Événements' },
        ],
        ctas: [
          { href: '/actualites', label: 'Voir toutes les actualités', primary: true },
          { href: '/newsletter', label: 'S\u2019abonner à la newsletter' },
        ],
      },
    },
  };

  function buildMegaHTML(key, cfg) {
    const cols = cfg.cols.map((col) => {
      const items = col.items.map((it) => {
        const liveHTML = it.live ? '<span class="live-dot" aria-hidden="true" style="margin-right:6px;"></span>' : '';
        return '<a href="' + it.href + '" class="mega-pole" role="menuitem" data-pole="' + (it.pole || key.toLowerCase()) + '" data-search="' + (it.search || (it.title + ' ' + (it.sub||'') + ' ' + (it.meta||'')).toLowerCase()) + '">' +
                 '<span class="mp-icon" aria-hidden="true">' + it.icon + '</span>' +
                 '<div class="mp-body">' +
                   '<strong>' + liveHTML + it.title + '</strong>' +
                   '<span>' + (it.sub || '') + '</span>' +
                   (it.meta ? '<em>' + it.meta + '</em>' : '') +
                 '</div>' +
               '</a>';
      }).join('');
      return '<div class="mega-col"><span class="mega-col-head">' + col.head + '</span>' + items + '</div>';
    }).join('');

    const fs = cfg.feature;
    const stats = fs.stats.map((s) =>
      '<div class="mf-stat"><strong>' + s.val + (s.unit ? '<sup>' + s.unit + '</sup>' : '') + '</strong><span>' + s.label + '</span></div>'
    ).join('');
    const ctas = fs.ctas.map((c) =>
      '<a href="' + c.href + '" class="mf-cta' + (c.primary ? ' is-primary' : '') + '">' +
        '<span>' + c.label + '</span><span class="arrow" aria-hidden="true">→</span>' +
      '</a>'
    ).join('');

    return '' +
      '<div class="nav-mega" role="menu" aria-label="' + cfg.eyebrow + '">' +
        '<div class="nav-mega-inner">' +
          '<div class="nav-mega-body" data-mega-grid>' +
            cols +
            '<aside class="mega-feature" aria-label="' + fs.eyebrow + '">' +
              '<span class="mf-eyebrow">' + fs.eyebrow + '</span>' +
              '<h4 class="mf-title">' + fs.title + '</h4>' +
              '<div class="mf-stats">' + stats + '</div>' +
              '<div class="mf-ctas">' + ctas + '</div>' +
            '</aside>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // Inject mega panels: find each target <a> in .nav-links, wrap into .nav-dropdown.nav-has-mega
  function injectMegaPanels() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;
    Object.keys(MEGA_PANELS).forEach((key) => {
      const cfg = MEGA_PANELS[key];
      // Match by existing anchor href
      const anchor = Array.from(navLinks.querySelectorAll(':scope > a')).find((a) => {
        const h = (a.getAttribute('href') || '').replace(/\/$/, '');
        return h === cfg.href || h === cfg.href + '.html';
      });
      if (!anchor) return;

      const wrap = document.createElement('div');
      wrap.className = 'nav-dropdown nav-has-mega nav-has-mega-sec';
      wrap.setAttribute('data-mega', '');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-drop-trigger';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = key + ' <svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

      // Preserve active/aria-current state from original anchor
      if (anchor.classList.contains('active') || anchor.getAttribute('aria-current') === 'page') {
        btn.setAttribute('aria-current', 'true');
        wrap.classList.add('is-current-section');
      }

      wrap.appendChild(btn);
      wrap.insertAdjacentHTML('beforeend', buildMegaHTML(key, cfg));

      // Replace the <a> with the wrapper
      anchor.parentNode.replaceChild(wrap, anchor);
    });
  }

  // Must run BEFORE the existing mega menu binding logic picks up all .nav-has-mega
  injectMegaPanels();

  /* ---------- Nav scroll state + progress bar ---------- */
  const nav = document.querySelector('.nav');
  const navWrap = document.querySelector('.nav-wrap');
  const navProgress = document.querySelector('.nav-progress span');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) {
      if (y > 20) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    }
    if (navWrap) {
      if (y > 12) navWrap.classList.add('is-scrolled'); else navWrap.classList.remove('is-scrolled');
    }
    if (navProgress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, (y / h) * 100) : 0;
      navProgress.style.width = pct.toFixed(2) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    const setNavOpen = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setNavOpen(!links.classList.contains('open')));
    // Close on Esc, and close when a nav link is activated (mobile UX)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) { setNavOpen(false); toggle.focus(); }
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 820px)').matches) setNavOpen(false);
      });
    });
  }

  /* ---------- Ultra Mega Menu (a11y + search + arrow-key grid nav) ---------- */
  document.querySelectorAll('.nav-has-mega').forEach((wrap) => {
    const trigger   = wrap.querySelector('.nav-drop-trigger');
    const mega      = wrap.querySelector('.nav-mega');
    const searchEl  = wrap.querySelector('[data-mega-search]');
    const emptyEl   = wrap.querySelector('[data-mega-empty]');
    const gridEl    = wrap.querySelector('[data-mega-grid]');
    if (!trigger || !mega) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const cards = Array.from(mega.querySelectorAll('.mega-pole, .mega-map'));
    const isMobile = () => window.matchMedia('(max-width: 820px)').matches;

    let hoverTimer = null;
    const setOpen = (open, opts) => {
      opts = opts || {};
      wrap.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && opts.focusSearch && searchEl && !isMobile()) {
        // Small delay to let the reveal animation settle before focusing
        setTimeout(() => { try { searchEl.focus({ preventScroll: true }); } catch (_) { searchEl.focus(); } }, 60);
      }
    };

    // --- Click toggle (always works on touch / keyboard) ---
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(!wrap.classList.contains('is-open'));
    });

    // --- Hover intent (desktop only) — open on 80ms, close on 280ms ---
    if (!isMobile()) {
      wrap.addEventListener('pointerenter', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => setOpen(true), 80);
      });
      wrap.addEventListener('pointerleave', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => setOpen(false), 280);
      });
    }

    // --- Keyboard on trigger: open + focus first card (or search on desktop) ---
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true, { focusSearch: true });
        if (!searchEl || isMobile()) {
          const first = mega.querySelector('.mega-pole, .mega-map');
          if (first) first.focus();
        }
      }
    });

    // --- Escape closes ---
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrap.classList.contains('is-open')) {
        setOpen(false);
        trigger.focus();
      }
    });

    // --- Click outside closes ---
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) setOpen(false);
    });

    // --- ⌘K / Ctrl+K focuses the search while menu is open (opens if closed) ---
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        if (!searchEl) return;
        e.preventDefault();
        setOpen(true, { focusSearch: true });
      }
    });

    // --- Live search: filter cards by data-search attribute ---
    if (searchEl && gridEl) {
      const normalize = (s) => (s || '').toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const filter = () => {
        const q = normalize(searchEl.value.trim());
        let visible = 0;
        cards.forEach((card) => {
          if (!q) {
            card.removeAttribute('data-hidden');
            visible++;
            return;
          }
          const hay = normalize(
            (card.getAttribute('data-search') || '') + ' ' + card.textContent
          );
          const hit = hay.includes(q);
          card.toggleAttribute('data-hidden', !hit);
          if (hit) visible++;
        });
        if (emptyEl) emptyEl.hidden = visible > 0 || !q;
      };
      searchEl.addEventListener('input', filter);
      searchEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const first = cards.find((c) => !c.hasAttribute('data-hidden'));
          if (first) first.focus();
        } else if (e.key === 'Escape') {
          if (searchEl.value) { searchEl.value = ''; filter(); }
          else { setOpen(false); trigger.focus(); }
        }
      });
    }

    // --- Arrow-key navigation across the mega cards (roving tabindex) ---
    cards.forEach((card, i) => {
      card.addEventListener('keydown', (e) => {
        const visible = cards.filter((c) => !c.hasAttribute('data-hidden'));
        const pos = visible.indexOf(card);
        if (pos < 0) return;
        let next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = Math.min(pos + 1, visible.length - 1);
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = Math.max(pos - 1, 0);
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = visible.length - 1;
        if (next >= 0) { e.preventDefault(); visible[next].focus(); }
      });
    });
  });

  /* ---------- Highlight current page's pôle card inside the mega menu ---------- */
  (function markActivePole() {
    const path = location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-mega .mega-pole').forEach((card) => {
      const href = card.getAttribute('href') || '';
      const cleanHref = href.replace(/\/$/, '') || '/';
      if (cleanHref !== '/' && (path === cleanHref || path.startsWith(cleanHref + '/'))) {
        card.classList.add('is-active');
        // Also mark the Pôles trigger as current on pôle pages (defensive: set only if not already set)
        const trigger = document.querySelector('.nav-has-mega .nav-drop-trigger');
        if (trigger && !trigger.hasAttribute('aria-current')) trigger.setAttribute('aria-current', 'true');
      }
    });
  })();

  /* ---------- Language switcher ---------- */
  document.querySelectorAll('[data-lang-switch]').forEach((sw) => {
    const btn = sw.querySelector('.lang-btn');
    if (!btn) return;
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = sw.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!sw.contains(e.target)) {
        sw.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Newsletter form (progressive enhancement) ---------- */
  document.querySelectorAll('[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const emailInput = form.querySelector('input[type="email"]');
      const consent = form.querySelector('input[type="checkbox"]');
      if (!emailInput || !emailInput.checkValidity()) return;
      if (consent && !consent.checked) return;
      // Visual feedback; let native submit proceed to newsletter.html
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.setAttribute('disabled', 'true');
        btn.style.opacity = '.7';
        const orig = btn.innerHTML;
        btn.innerHTML = 'Redirection… <span class="arrow">→</span>';
        setTimeout(() => { btn.innerHTML = orig; btn.removeAttribute('disabled'); btn.style.opacity = ''; }, 4000);
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Number counter ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();
        const format = (n) => {
          let s = decimals ? n.toFixed(decimals) : Math.round(n).toString();
          // French-style thousands separator (thin space)
          s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
          return s + suffix;
        };
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(target * eased);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = format(target);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Interactive map (basin hover/click) ---------- */
  const mapWrap = document.querySelector('[data-map]');
  if (mapWrap) {
    const basins = mapWrap.querySelectorAll('.map-basin');
    const panel = mapWrap.querySelector('.map-info-panel');
    const panelName = panel ? panel.querySelector('[data-panel-name]') : null;
    const panelDesc = panel ? panel.querySelector('[data-panel-desc]') : null;
    const panelProd = panel ? panel.querySelector('[data-panel-prod]') : null;
    const panelStat = panel ? panel.querySelector('[data-panel-stat]') : null;

    const activate = (basin) => {
      basins.forEach((b) => b.classList.remove('active'));
      basin.classList.add('active');
      if (!panel) return;
      const name = basin.dataset.name || '';
      const desc = basin.dataset.desc || '';
      const prod = basin.dataset.prod || '';
      const stat = basin.dataset.stat || '';
      if (panelName) panelName.textContent = name;
      if (panelDesc) panelDesc.textContent = desc;
      if (panelProd) panelProd.textContent = prod;
      if (panelStat) panelStat.textContent = stat;
      panel.classList.add('show');
    };

    basins.forEach((basin) => {
      basin.addEventListener('mouseenter', () => activate(basin));
      basin.addEventListener('focus', () => activate(basin));
      basin.addEventListener('click', () => activate(basin));
    });

    // Show first basin by default on desktop
    if (window.innerWidth > 900 && basins[0]) {
      setTimeout(() => activate(basins[0]), 700);
    }
  }

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Smooth anchor ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ==========================================================================
     RUM — Core Web Vitals → Plausible custom events
     Sends CLS, LCP, INP, TTFB using navigator.sendBeacon. No cookies, no PII.
     Whitelisted in CSP via connect-src https://plausible.io.
     ========================================================================== */
  (function initRUM() {
    if (!('PerformanceObserver' in window) || !navigator.sendBeacon) return;

    const PLAUSIBLE_DOMAIN = location.hostname.replace(/^www\./, '');
    const PLAUSIBLE_ENDPOINT = 'https://plausible.io/api/event';

    const sendMetric = (name, value, id) => {
      try {
        const payload = JSON.stringify({
          name: 'web-vitals',
          url: location.href,
          domain: PLAUSIBLE_DOMAIN,
          props: {
            metric: name,
            value: Math.round(name === 'CLS' ? value * 1000 : value),
            rating: rate(name, value),
            id: id || '',
            path: location.pathname
          }
        });
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(PLAUSIBLE_ENDPOINT, blob);
      } catch (_) { /* fail silently — RUM must never break the page */ }
    };

    // Thresholds from https://web.dev/vitals/
    const rate = (name, v) => {
      if (name === 'LCP')  return v <= 2500 ? 'good' : v <= 4000 ? 'ni'   : 'poor';
      if (name === 'CLS')  return v <= 0.1  ? 'good' : v <= 0.25 ? 'ni'   : 'poor';
      if (name === 'INP')  return v <= 200  ? 'good' : v <= 500  ? 'ni'   : 'poor';
      if (name === 'FCP')  return v <= 1800 ? 'good' : v <= 3000 ? 'ni'   : 'poor';
      if (name === 'TTFB') return v <= 800  ? 'good' : v <= 1800 ? 'ni'   : 'poor';
      return 'n/a';
    };

    // --- LCP (final on page hidden/unload) ---
    let lcpValue = 0, lcpId = '';
    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        lcpValue = last.renderTime || last.loadTime || last.startTime;
        lcpId = last.id || (last.element && last.element.tagName) || '';
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_) {}

    // --- CLS (cumulative since page load; reported at pagehide) ---
    let clsValue = 0;
    try {
      const poCls = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) clsValue += entry.value;
        });
      });
      poCls.observe({ type: 'layout-shift', buffered: true });
    } catch (_) {}

    // --- INP (highest-latency event, approx via longest event entry >40ms) ---
    let inpValue = 0;
    try {
      const poEvt = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Interaction = entries with interactionId (Chromium 106+)
          if (entry.interactionId && entry.duration > inpValue) inpValue = entry.duration;
        });
      });
      poEvt.observe({ type: 'event', buffered: true, durationThreshold: 40 });
    } catch (_) {}

    // --- FCP (one-shot) ---
    try {
      const poFcp = new PerformanceObserver((list) => {
        const fcp = list.getEntries().find((e) => e.name === 'first-contentful-paint');
        if (fcp) sendMetric('FCP', fcp.startTime);
      });
      poFcp.observe({ type: 'paint', buffered: true });
    } catch (_) {}

    // --- TTFB (from Navigation Timing) ---
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.responseStart > 0) sendMetric('TTFB', nav.responseStart);
    } catch (_) {}

    // Flush LCP / CLS / INP on page hidden (bfcache-safe)
    const flush = () => {
      if (lcpValue > 0) sendMetric('LCP', lcpValue, lcpId);
      if (clsValue > 0) sendMetric('CLS', clsValue);
      if (inpValue > 0) sendMetric('INP', inpValue);
      lcpValue = clsValue = inpValue = 0;
    };
    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    }, { capture: true });
    // Fallback for older browsers
    addEventListener('pagehide', flush, { capture: true });
  })();

  /* ==========================================================================
     BRAND LOGO — swap the letter-mark "E" for the SVG clover logo + subtle anim
     Runtime swap avoids touching 16 HTML files.
     ========================================================================== */
  (function swapBrandLogo() {
    const mark = document.querySelector('.brand .brand-mark');
    if (!mark) return;
    // Build the animated SVG clover logo inline (imports external file for cacheability)
    mark.innerHTML = '' +
      '<svg class="brand-logo" viewBox="0 0 200 200" width="40" height="40" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<linearGradient id="blGold" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#E8C667"/><stop offset="50%" stop-color="#D4A843"/><stop offset="100%" stop-color="#E8C667"/>' +
          '</linearGradient>' +
          '<radialGradient id="blP1" cx="0.4" cy="0.35" r="0.65"><stop offset="0%" stop-color="#E8D06A"/><stop offset="100%" stop-color="#B8912E"/></radialGradient>' +
          '<radialGradient id="blP2" cx="0.6" cy="0.4" r="0.65"><stop offset="0%" stop-color="#4A8FD9"/><stop offset="100%" stop-color="#1A4F9A"/></radialGradient>' +
          '<radialGradient id="blP3" cx="0.4" cy="0.4" r="0.65"><stop offset="0%" stop-color="#2DAF50"/><stop offset="100%" stop-color="#126B2C"/></radialGradient>' +
          '<radialGradient id="blP4" cx="0.5" cy="0.5" r="0.65"><stop offset="0%" stop-color="#F0E4C4"/><stop offset="100%" stop-color="#CCBB85"/></radialGradient>' +
        '</defs>' +
        '<circle cx="100" cy="100" r="78" fill="rgba(250,250,245,0.06)"/>' +
        '<circle class="bl-ring" cx="100" cy="100" r="80" fill="none" stroke="url(#blGold)" stroke-width="4"/>' +
        '<g class="bl-petals">' +
          '<path class="bl-petal bl-p1" d="M100 42 C108 58, 128 70, 128 85 C128 100, 115 108, 100 108 C85 108, 72 100, 72 85 C72 70, 92 58, 100 42Z" fill="url(#blP1)"/>' +
          '<path class="bl-petal bl-p2" d="M42 100 C58 92, 70 72, 85 72 C100 72, 108 85, 108 100 C108 115, 100 128, 85 128 C70 128, 58 108, 42 100Z" fill="url(#blP2)"/>' +
          '<path class="bl-petal bl-p3" d="M158 100 C142 108, 130 128, 115 128 C100 128, 92 115, 92 100 C92 85, 100 72, 115 72 C130 72, 142 92, 158 100Z" fill="url(#blP3)"/>' +
          '<path class="bl-petal bl-p4" d="M100 158 C92 142, 72 130, 72 115 C72 100, 85 92, 100 92 C115 92, 128 100, 128 115 C128 130, 108 142, 100 158Z" fill="url(#blP4)"/>' +
        '</g>' +
        '<circle class="bl-core" cx="100" cy="100" r="7" fill="rgba(255,255,255,0.55)"/>' +
      '</svg>';
    mark.classList.add('has-logo');
  })();

  /* ==========================================================================
     HERO ANIMATED BACKDROP — WebGL-free mesh + particles, reduced-motion safe
     ========================================================================== */
  (function initHeroBackdrop() {
    if (prefersReducedMotion()) return;
    const hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.hero-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    function resize() {
      const rect = hero.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Energy particles — subtle floating dots in gold/amber
    const N = Math.min(50, Math.round((W * H) / 18000));
    const particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.18,
        a: 0.1 + Math.random() * 0.35,
        hue: Math.random() < 0.7 ? 42 : 200, // mostly gold, some blue
      });
    }

    let t0 = performance.now();
    let running = true;
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { running = e.isIntersecting; });
      });
      io.observe(hero);
    }

    function draw(now) {
      const t = (now - t0) / 1000;

      if (!running) { requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);

      // Moving mesh gradient blobs (radial gradients at animated positions)
      const b1x = W * (0.3 + 0.1 * Math.sin(t * 0.15));
      const b1y = H * (0.4 + 0.08 * Math.cos(t * 0.12));
      const g1 = ctx.createRadialGradient(b1x, b1y, 20, b1x, b1y, W * 0.55);
      g1.addColorStop(0, 'rgba(217, 168, 79, 0.18)');
      g1.addColorStop(1, 'rgba(217, 168, 79, 0)');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

      const b2x = W * (0.75 + 0.1 * Math.cos(t * 0.1));
      const b2y = H * (0.6 + 0.1 * Math.sin(t * 0.17));
      const g2 = ctx.createRadialGradient(b2x, b2y, 20, b2x, b2y, W * 0.5);
      g2.addColorStop(0, 'rgba(74, 143, 217, 0.14)');
      g2.addColorStop(1, 'rgba(74, 143, 217, 0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

      const b3x = W * (0.5 + 0.15 * Math.sin(t * 0.08 + 1));
      const b3y = H * (0.2 + 0.12 * Math.cos(t * 0.11 + 2));
      const g3 = ctx.createRadialGradient(b3x, b3y, 10, b3x, b3y, W * 0.4);
      g3.addColorStop(0, 'rgba(45, 175, 80, 0.1)');
      g3.addColorStop(1, 'rgba(45, 175, 80, 0)');
      ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 42
          ? 'rgba(232, 198, 103, ' + p.a + ')'
          : 'rgba(100, 160, 230, ' + (p.a * 0.7) + ')';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  /* ==========================================================================
     3D MAP ENHANCE — perspective tilt on scroll + pulsing sites + pipeline flow
     Applies to both the schematic Tchad map (maps.html) and .map-basin SVGs.
     ========================================================================== */
  (function enhanceMap3D() {
    const frames = document.querySelectorAll('.map-frame, [data-map-3d]');
    if (!frames.length) return;

    // Add 3D container + tilt on mouse move (desktop only)
    frames.forEach((frame) => {
      frame.classList.add('is-3d');
      if (prefersReducedMotion()) return;
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        frame.addEventListener('pointermove', (e) => {
          const rect = frame.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;   // 0..1
          const py = (e.clientY - rect.top)  / rect.height;  // 0..1
          const rx = (0.5 - py) * 6;  // tilt up/down
          const ry = (px - 0.5) * 8;  // tilt left/right
          frame.style.setProperty('--rx', rx.toFixed(2) + 'deg');
          frame.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        });
        frame.addEventListener('pointerleave', () => {
          frame.style.setProperty('--rx', '0deg');
          frame.style.setProperty('--ry', '0deg');
        });
      }
    });

    // Animated pulses on sites + pipelines
    const sites = document.querySelectorAll('.map-site circle:first-of-type');
    sites.forEach((c, i) => {
      const parent = c.parentNode;
      if (!parent || parent.querySelector('.site-pulse')) return;
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', c.getAttribute('cx'));
      pulse.setAttribute('cy', c.getAttribute('cy'));
      pulse.setAttribute('r', c.getAttribute('r'));
      pulse.setAttribute('fill', 'none');
      pulse.setAttribute('stroke', c.getAttribute('fill'));
      pulse.setAttribute('stroke-width', '1.5');
      pulse.setAttribute('class', 'site-pulse');
      pulse.style.setProperty('--delay', (i * 0.35) + 's');
      parent.insertBefore(pulse, c);
    });

    // Add "flow" dash animation on pipelines (paths with stroke-dasharray)
    const pipelines = document.querySelectorAll('.map-frame svg path[stroke-dasharray]');
    pipelines.forEach((p) => p.classList.add('pipeline-flow'));
  })();

  /* ==========================================================================
     BASIN 3D — add pseudo-depth layer on .map-basin cards
     ========================================================================== */
  (function enhanceBasins() {
    if (prefersReducedMotion()) return;
    const basins = document.querySelectorAll('.map-basin');
    if (!basins.length) return;
    basins.forEach((b) => b.classList.add('is-3d'));
  })();

  /* ==========================================================================
     CADASTRE PÉTROLIER 2025 — fetch official JSON, render blocks + pipelines,
     filter by region, open image lightbox
     ========================================================================== */
  (function cadastreRenderer() {
    const host     = document.querySelector('[data-cadastre-blocks]');
    const pipeHost = document.querySelector('[data-cadastre-pipelines]');
    const lb       = document.querySelector('[data-cadastre-lightbox]');
    if (!host && !lb) return;

    const state = { region: 'all', data: null };
    const REGION_ORDER = ['nord', 'centre', 'sud'];

    function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    function render() {
      if (!state.data || !host) return;
      let blocks  = state.data.blocks || [];
      const legend = (state.data.legend && state.data.legend.status) || {};
      const regionMap = {};
      (state.data.regions || []).forEach(r => { regionMap[r.id] = r; });

      if (state.region !== 'all') {
        blocks = blocks.filter(b => b.region === state.region);
      }

      const grouped = {};
      blocks.forEach(b => { (grouped[b.region] = grouped[b.region] || []).push(b); });

      let html = '';
      REGION_ORDER.forEach(rid => {
        if (!grouped[rid]) return;
        const reg  = regionMap[rid] || { name: rid };
        const list = grouped[rid];
        html += '<div class="cad-region" data-region="' + esc(rid) + '">';
        html +=   '<div class="cad-region-head">';
        html +=     '<h4>' + esc(reg.name) + '</h4>';
        html +=     '<span class="cad-count">' + list.length + ' bloc' + (list.length > 1 ? 's' : '') + (reg.bounds ? ' · ' + esc(reg.bounds) : '') + '</span>';
        html +=   '</div>';
        html +=   '<div class="cad-blocks-grid">';
        list.forEach(b => {
          const st = legend[b.status] || {};
          const lbl = (st.label || b.status || '').replace(/^Bloc\s+/i, '');
          const title = b.note ? (b.name + ' — ' + b.note) : (b.name + ' — ' + (st.label || b.status));
          html += '<div class="cad-block" data-status="' + esc(b.status) + '" title="' + esc(title) + '">';
          html +=   '<span class="cad-block-name">' + esc(b.name) + '</span>';
          html +=   '<span class="cad-block-status">' + esc(lbl) + '</span>';
          html += '</div>';
        });
        html +=   '</div>';
        html += '</div>';
      });
      if (!html) {
        html = '<p style="color:#666; padding: 24px; text-align:center;">Aucun bloc dans cette région.</p>';
      }
      host.innerHTML = html;
    }

    function renderPipes() {
      if (!state.data || !pipeHost) return;
      const pipes = state.data.pipelines || [];
      if (!pipes.length) { pipeHost.innerHTML = ''; return; }
      let html = '<h3>Corridors pipeline · ' + pipes.length + ' tracés</h3>';
      html += '<div class="cad-pipe-list">';
      pipes.forEach(p => {
        html += '<div class="cad-pipe" data-type="' + esc(p.type) + '">';
        html +=   '<h5>' + esc(p.name) + '</h5>';
        if (p.length_km) {
          html += '<div class="cad-pipe-length">' + p.length_km.toLocaleString('fr-FR') + ' km</div>';
        }
        if (p.from || p.to) {
          html += '<div class="cad-pipe-route">' + esc(p.from || '') + ' → ' + esc(p.to || '') + '</div>';
        }
        if (p.operator_note) {
          html += '<div class="cad-pipe-note">' + esc(p.operator_note) + '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
      pipeHost.innerHTML = html;
    }

    // Keep UI stat cards in sync with the JSON (single source of truth)
    function updateStats() {
      if (!state.data) return;
      const blocks = state.data.blocks || [];
      const counts = { total: blocks.length, attribue: 0, libre: 0, changement: 0, concession: 0, hors_bloc: 0 };
      blocks.forEach(b => { if (counts[b.status] !== undefined) counts[b.status] += 1; });
      document.querySelectorAll('[data-cadastre-stats] strong[data-k]').forEach(el => {
        const k = el.getAttribute('data-k');
        if (counts[k] !== undefined) el.textContent = counts[k];
      });
    }

    // Fetch the official JSON
    fetch('/assets/data/cadastre-2025.json', { credentials: 'same-origin' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        state.data = data;
        updateStats();
        render();
        renderPipes();
      })
      .catch(err => {
        console.warn('[cadastre] data unavailable:', err);
        if (host) host.innerHTML = '<p style="color:#666; padding:24px; text-align:center;">Chargement des données cadastre indisponible. Consultez le <a href="/documents/cadastre-petrolier-2025.pdf">PDF officiel</a>.</p>';
      });

    // Region filter chips
    document.querySelectorAll('.cad-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.cad-chip').forEach(c => c.classList.remove('is-on'));
        chip.classList.add('is-on');
        state.region = chip.dataset.region || 'all';
        render();
      });
    });

    // Lightbox open/close
    function openLb()  { if (lb) { lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; } }
    function closeLb() { if (lb) { lb.setAttribute('aria-hidden', 'true');  document.body.style.overflow = ''; } }
    document.querySelectorAll('[data-cadastre-open]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); openLb(); });
    });
    document.querySelectorAll('[data-cadastre-close]').forEach(btn => {
      btn.addEventListener('click', closeLb);
    });
    if (lb) {
      lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lb.getAttribute('aria-hidden') === 'false') closeLb();
      });
    }
  })();

})();
