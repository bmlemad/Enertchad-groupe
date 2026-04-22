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
          { href: '/durabilite',         icon: '04', title: 'Durabilité ESG',        sub: 'Climat · social · éthique',      meta: 'ITIE publié · CDP engagé' },
          { href: '/talents',            icon: '05', title: 'Nos talents',           sub: '1 240 collaborateurs · 85 % locaux', meta: 'Parité 38 % · 120 apprentis' },
        ]},
      ],
      feature: {
        eyebrow: 'Rapport 2025',
        title: 'Une chaîne <em>intégrée</em>, un champion <em>souverain</em>.',
        stats: [
          { val: '1 240', unit: '',    label: 'Collaborateurs', source: '/groupe#rh' },
          { val: '53',    unit: '',    label: 'Contrats ITIE',  source: '/documents/itie-2025.pdf' },
          { val: '2,1',   unit: 'Md$', label: 'CA consolidé',   source: '/documents/rapport-annuel-2025.pdf' },
          { val: '23',    unit: 'ans', label: 'Historique',     source: '/groupe#histoire' },
        ],
        ctas: [
          { href: '/groupe',                              label: 'Découvrir le Groupe', primary: true },
          { href: '/documents/EnerTchad-Rapport-Durabilite-2025.pdf', label: 'Rapport Durabilité (PDF)' },
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
          { href: '/investisseurs#solvabilite', icon: '02', title: 'Solvabilité',     sub: 'Dette nette / EBITDA · 1,2×', meta: 'Cible 2027 · <2,0×' },
          { href: '/dashboard-executif',     icon: '03', title: 'Dashboard exécutif',  sub: 'Temps réel · KPIs live',   meta: 'SCADA connecté · 24/7', live: true },
        ]},
        { head: 'Publications', items: [
          { href: '/documents/EnerTchad-Rapport-Durabilite-2025.pdf', icon: '04', title: 'Rapport Durabilité 2025', sub: 'PDF · disponible', meta: 'FR · GRI Index 2025' },
          { href: '/documents/EnerTchad-Champs-Matures-Synthese-Executive-2026.pdf', icon: '05', title: 'Synthèse Champs Matures', sub: 'PDF · 2026', meta: 'Executive brief' },
          { href: '/investisseurs#agenda',                 icon: '06', title: 'Agenda investisseurs',     sub: 'AGM · earnings · roadshows', meta: '8 rendez-vous 2026' },
        ]},
      ],
      feature: {
        eyebrow: 'Performance 2026',
        title: 'Des fondamentaux <em>solides</em>, une trajectoire <em>claire</em>.',
        stats: [
          { val: '2,1',  unit: 'Md$', label: 'CA 2025',      source: '/documents/rapport-annuel-2025.pdf' },
          { val: '+14',  unit: '%',   label: 'EBITDA YoY',   source: '/documents/rapport-annuel-2025.pdf' },
          { val: '1,2',  unit: '×',   label: 'Dette/EBITDA', source: '/documents/rapport-annuel-2025.pdf' },
          { val: '53',   unit: '',    label: 'Contrats ITIE', source: '/documents/itie-2025.pdf' },
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
          { href: '/durabilite#itie',      icon: '05', title: 'Éthique & conformité', sub: 'ITIE · OCDE · UNGC',       meta: '53 contrats publiés' },
        ]},
      ],
      feature: {
        eyebrow: 'ESG · Ratings 2026',
        title: 'Une ambition <em>durable</em>, des résultats <em>vérifiés</em>.',
        stats: [
          { val: '−48',  unit: '%',     label: 'CO₂ vs 2020',          source: '/documents/EnerTchad-Rapport-Durabilite-2025.pdf' },
          { val: '42',   unit: 'kt/an', label: 'CO₂ évité',            source: '/documents/EnerTchad-Rapport-Durabilite-2025.pdf' },
          { val: '100',  unit: '%',     label: 'Contrats ITIE',        source: '/documents/itie-2025.pdf' },
          { val: '28',   unit: '',      label: 'Villages électrifiés', source: '/durabilite#social' },
        ],
        ctas: [
          { href: '/durabilite',                      label: 'Rapport durabilité', primary: true },
          { href: '/documents/EnerTchad-Rapport-Durabilite-2025.pdf',  label: 'Rapport ESG (PDF)' },
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
          { href: '/talents#diversite',    icon: '04', title: 'Diversité & inclusion', sub: 'Parité 38 % · 11 nationalités', meta: 'Politique D&I publique · charte UNGC' },
          { href: '/talents#benefits',     icon: '05', title: 'Bénéfices & avantages', sub: 'Santé · retraite · mobilité',   meta: 'Couverture 100 % collaborateurs' },
        ]},
      ],
      feature: {
        eyebrow: 'People · 2026',
        title: 'L\u2019énergie du Tchad, portée par <em>ses talents</em>.',
        stats: [
          { val: '1 240', unit: '',  label: 'Collaborateurs', source: '/groupe#rh' },
          { val: '85',    unit: '%', label: 'Tchadiens',      source: '/talents#local-content' },
          { val: '38',    unit: '%', label: 'Femmes',         source: '/talents#diversite' },
          { val: '120',   unit: '',  label: 'Apprentis',      source: '/talents#apprentis' },
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
          { val: '28',    unit: '', label: 'Communiqués/an', source: '/actualites#communiques' },
          { val: '12',    unit: '', label: 'Articles avril', source: '/actualites#blog' },
          { val: '4 200', unit: '', label: 'Abonnés',        source: '/newsletter' },
          { val: '8',     unit: '', label: 'Événements',     source: '/actualites#events' },
        ],
        ctas: [
          { href: '/actualites', label: 'Voir toutes les actualités', primary: true },
          { href: '/newsletter', label: 'S\u2019abonner à la newsletter' },
        ],
      },
    },
  };

  // Panel id slug : "Durabilité" → "durabilite" (pour aria-controls — patch 07)
  function megaPanelId(key) {
    return 'mega-' + key.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function buildMegaHTML(key, cfg) {
    const cols = cfg.cols.map((col) => {
      const items = col.items.map((it) => {
        const liveHTML = it.live ? '<span class="live-dot" aria-hidden="true" style="margin-right:6px;"></span>' : '';
        // Patch 07 : retrait role="menuitem" — Disclosure Navigation Menu (WAI-ARIA APG 1.2)
        return '<a href="' + it.href + '" class="mega-pole" data-pole="' + (it.pole || key.toLowerCase()) + '" data-search="' + (it.search || (it.title + ' ' + (it.sub||'') + ' ' + (it.meta||'')).toLowerCase()) + '">' +
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
    // Patch 05 : support data-source par stat (traçabilité) + clicable via tabindex + role
    const stats = fs.stats.map((s) => {
      const hasSource = !!s.source;
      const attrs = hasSource
        ? ' data-source="' + s.source + '" tabindex="0" role="link" aria-label="' + s.label + ' — voir la source"'
        : '';
      return '<div class="mf-stat"' + attrs + '>' +
        '<strong>' + s.val + (s.unit ? '<sup>' + s.unit + '</sup>' : '') + '</strong>' +
        '<span>' + s.label + '</span>' +
      '</div>';
    }).join('');
    const ctas = fs.ctas.map((c) =>
      '<a href="' + c.href + '" class="mf-cta' + (c.primary ? ' is-primary' : '') + '">' +
        '<span>' + c.label + '</span><span class="arrow" aria-hidden="true">→</span>' +
      '</a>'
    ).join('');

    const panelId = megaPanelId(key);
    // Patch 07 : retrait role="menu", ajout id panneau ; aria-label devient "Navigation …"
    // Patch 04 : ajout data-mega-count (sr-only, aria-live polite) pour annoncer les filtres
    return '' +
      '<div class="nav-mega" id="' + panelId + '" aria-label="Navigation ' + cfg.eyebrow + '">' +
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
          '<div role="status" aria-live="polite" aria-atomic="true" class="sr-only" data-mega-count></div>' +
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
      // Patch 07 : Disclosure pattern — aria-controls vers l'id panneau, pas d'aria-haspopup
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', megaPanelId(key));
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
  // Registre global de tous les panneaux méga (rempli par la boucle).
  // Patches 01 (multi-open) + 02 (Esc idempotence) — Sprint méga-menu v1.5.2
  const MEGA_WRAPS = [];

  document.querySelectorAll('.nav-has-mega').forEach((wrap) => {
    const trigger   = wrap.querySelector('.nav-drop-trigger');
    const mega      = wrap.querySelector('.nav-mega');
    const searchEl  = wrap.querySelector('[data-mega-search]');
    const emptyEl   = wrap.querySelector('[data-mega-empty]');
    const gridEl    = wrap.querySelector('[data-mega-grid]');
    if (!trigger || !mega) return;

    // Patch 07 : Disclosure Navigation Menu — pas d'aria-haspopup, aria-controls assigné par injectMegaPanels()
    // Ensure synchronised state pour le panneau hardcodé (index.html Pôles) qui n'est pas créé par le JS.
    if (!trigger.hasAttribute('aria-controls') && mega.id) {
      trigger.setAttribute('aria-controls', mega.id);
    }
    if (trigger.hasAttribute('aria-haspopup')) {
      trigger.removeAttribute('aria-haspopup');
    }
    trigger.setAttribute('aria-expanded', 'false');

    const cards = Array.from(mega.querySelectorAll('.mega-pole, .mega-map'));
    const isMobile = () => window.matchMedia('(max-width: 820px)').matches;

    let hoverTimer = null;
    const setOpen = (open, opts) => {
      opts = opts || {};
      const isOpen = wrap.classList.contains('is-open');

      // Patch 02 BUG-3 : idempotence. Si l'état demandé est déjà celui actuel,
      // resynchroniser aria-expanded par sécurité et sortir sans refaire
      // les opérations DOM (évite les fenêtres de 40 ms où aria-expanded est désynchronisé).
      if (open === isOpen) {
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (open && opts.focusSearch && searchEl && !isMobile()) {
          try { searchEl.focus({ preventScroll: true }); } catch (_) { searchEl.focus(); }
        }
        return;
      }

      // Exclusion mutuelle : ouvrir ce panneau ferme les autres (patch 01).
      if (open) {
        MEGA_WRAPS.forEach((other) => {
          if (other.wrap !== wrap && other.wrap.classList.contains('is-open')) {
            other.wrap.classList.remove('is-open');
            other.trigger.setAttribute('aria-expanded', 'false');
          }
        });
      }
      wrap.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && opts.focusSearch && searchEl && !isMobile()) {
        // Small delay to let the reveal animation settle before focusing
        setTimeout(() => { try { searchEl.focus({ preventScroll: true }); } catch (_) { searchEl.focus(); } }, 60);
      }
      // Annuler tout timer hover en cours : Esc ne doit pas ré-ouvrir (patch 02).
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
    };

    // Publier ce panneau dans le registre global.
    MEGA_WRAPS.push({ wrap: wrap, trigger: trigger, searchEl: searchEl, setOpen: setOpen });

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

    // Listeners globaux Esc / click-outside / ⌘K sont attachés UNE SEULE FOIS
    // hors de cette boucle — voir bloc "Listeners globaux méga-menu" plus bas.

    // --- Live search: filter cards by data-search attribute ---
    // Patch 04 : debounce 80ms sur le filter + annonce aria-live throttle 400ms
    if (searchEl && gridEl) {
      const normalize = (s) => (s || '').toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const countEl = mega.querySelector('[data-mega-count]');
      let filterTimer = null;
      let announceTimer = null;
      let lastAnnounced = -1;
      const announce = (visible, q) => {
        if (!countEl) return;
        if (visible === lastAnnounced) return;
        lastAnnounced = visible;
        const label = !q
          ? ''
          : (visible === 0
              ? 'Aucun résultat.'
              : (visible === 1 ? '1 résultat.' : visible + ' résultats.'));
        countEl.textContent = label;
      };
      const runFilter = () => {
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
        // Annonce throttle 400ms : on diffère pour éviter le spam aria-live
        clearTimeout(announceTimer);
        announceTimer = setTimeout(() => announce(visible, q), 400);
      };
      const filter = () => {
        clearTimeout(filterTimer);
        filterTimer = setTimeout(runFilter, 80);
      };
      searchEl.addEventListener('input', filter);
      searchEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const first = cards.find((c) => !c.hasAttribute('data-hidden'));
          if (first) first.focus();
        } else if (e.key === 'Escape') {
          if (searchEl.value) { searchEl.value = ''; runFilter(); }
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

  /* ---------- Listeners globaux méga-menu (patches 01 + 02) ----------
   * Un seul listener par événement plutôt qu'un par panneau, pour éviter
   * l'ouverture en cascade de tous les panneaux sur ⌘K (bug BUG-1).
   */
  function getOpenMega() {
    return MEGA_WRAPS.find((m) => m.wrap.classList.contains('is-open')) || null;
  }
  function getTargetMega() {
    const open = getOpenMega();
    if (open) return open;
    const focused = MEGA_WRAPS.find((m) => m.wrap.contains(document.activeElement));
    if (focused) return focused;
    return MEGA_WRAPS[0] || null;
  }

  // Esc : ferme le panneau ouvert et rend le focus à son trigger.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = getOpenMega();
    if (!open) return;
    open.setOpen(false);
    try { open.trigger.focus(); } catch (_) {}
  });

  // ⌘K / Ctrl+K : ouvre le panneau cible et focus la recherche.
  document.addEventListener('keydown', (e) => {
    if ((e.key !== 'k' && e.key !== 'K') || !(e.metaKey || e.ctrlKey)) return;
    const target = getTargetMega();
    if (!target || !target.searchEl) return;
    e.preventDefault();
    target.setOpen(true, { focusSearch: true });
  });

  // Click extérieur : ferme le panneau ouvert.
  document.addEventListener('click', (e) => {
    const open = getOpenMega();
    if (!open) return;
    if (!open.wrap.contains(e.target)) open.setOpen(false);
  });

  // Patch 02 BONUS : onglet perd le focus (alt+tab, switch app) → ferme tous les panneaux.
  // Évite que l'utilisateur revienne sur un méga-menu ouvert "zombie".
  window.addEventListener('blur', () => {
    MEGA_WRAPS.forEach((m) => {
      if (m.wrap.classList.contains('is-open')) m.setOpen(false);
    });
  });

  // Patch 05 : .mf-stat[data-source] — navigation vers la source (clic + Enter/Space).
  // Délégation globale : un seul listener pour tous les panneaux.
  document.addEventListener('click', (e) => {
    const stat = e.target.closest('.mf-stat[data-source]');
    if (!stat) return;
    const href = stat.getAttribute('data-source');
    if (!href) return;
    window.location.href = href;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const stat = document.activeElement && document.activeElement.closest
      ? document.activeElement.closest('.mf-stat[data-source]')
      : null;
    if (!stat) return;
    e.preventDefault();
    const href = stat.getAttribute('data-source');
    if (href) window.location.href = href;
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

  /* ---------- Contact form prefill (Batch 2 IR) ----------
     Lit ?sujet=<slug> sur /contact.html et pré-remplit
     <select name="type"> + <input name="subject"> avec
     le libellé long correspondant.
  */
  (function prefillContactForm(){
    if (!/\/contact(\.html)?$/i.test(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    const slug = params.get('sujet');
    if (!slug) return;

    const catalog = {
      // Documents IR — type "Relations investisseurs"
      'ir-rapport-annuel-2025':  { type: 'Relations investisseurs', subject: 'Demande — Rapport annuel 2025 (à paraître T2 2026)' },
      'ir-resultats-2025':       { type: 'Relations investisseurs', subject: 'Inscription webcast — Résultats 2025' },
      'ir-ifrs-2025':            { type: 'Relations investisseurs', subject: 'Demande — États financiers IFRS 2025' },
      'ir-communique-q4-2025':   { type: 'Relations investisseurs', subject: 'Alertes IR — Communiqué Q4 2025' },
      'ir-itie-2025':            { type: 'Relations investisseurs', subject: 'Demande — Rapport ITIE 2025' },
      'ir-esg-2025':             { type: 'Relations investisseurs', subject: 'Demande — Rapport ESG / Développement durable 2025' },
      'ir-plan-2030':            { type: 'Relations investisseurs', subject: 'Demande — Plan stratégique « Énergie souveraine 2030 »' },
      'ir-gouvernance':          { type: 'Relations investisseurs', subject: 'Demande — Rapport de gouvernance CA' },
      'ir-fact-sheet':           { type: 'Relations investisseurs', subject: 'Demande — Fact sheet EnerTchad' },
      // Presse
      'presse-kit':              { type: 'Presse & médias',          subject: 'Demande — Kit presse 2026 (logos, photos, bios)' },
      // Autres (templates lead-gen futurs)
      'talents-spontane':        { type: 'Recrutement',              subject: 'Candidature spontanée' },
      'achats-sourcing':         { type: 'Achats / fournisseur',     subject: 'Référencement fournisseur — Sourcing achats' }
    };

    const entry = catalog[slug];
    if (!entry) return;

    const selectEl = document.querySelector('select[name="type"]');
    const subjectEl = document.querySelector('input[name="subject"]');
    if (selectEl) {
      const opts = Array.from(selectEl.options);
      const match = opts.find(o => o.textContent.trim() === entry.type);
      if (match) { selectEl.value = match.value || match.textContent.trim(); }
    }
    if (subjectEl) { subjectEl.value = entry.subject; }
  })();

  /* ---------- Enhanced contact form (Batch 4 lead-gen) ----------
     - Révèle des blocs <.form-cond data-show-if="…"> selon <select name="type">
     - Honeypot anti-spam (input name="website" dans .hp-field)
     - Timing anti-bot : rejette les soumissions en moins de 2s
     - Soumission fetch() vers data-endpoint (Formspree / Getform / Worker)
     - Fallback mailto: si aucun endpoint configuré
  */
  (function enhancedContactForm(){
    const form = document.getElementById('contact-form');
    if (!form) return;

    const typeSelect = form.querySelector('select[name="type"]');
    const condBlocks = form.querySelectorAll('.form-cond');
    const successEl  = form.querySelector('.form-success');
    const failureEl  = form.querySelector('.form-failure');
    const submitBtn  = form.querySelector('button[type="submit"]');
    const loadTime   = Date.now();

    /* 1) Reveal/hide conditional blocks based on <select name="type"> value. */
    function applyCondState() {
      const val = typeSelect ? (typeSelect.value || '').trim() : '';
      condBlocks.forEach(block => {
        const trigger = (block.dataset.showIf || '').trim();
        const shouldShow = trigger && trigger === val;
        block.hidden = !shouldShow;
      });
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', applyCondState);
      applyCondState();
    }

    /* 2) Submission handler with honeypot, timing check, fetch + mailto fallback. */
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Masquer messages antérieurs
      if (successEl) successEl.classList.remove('show');
      if (failureEl) failureEl.classList.remove('show');

      // Anti-spam — honeypot : champ "website" rempli => bot probable
      const hp = form.querySelector('input[name="website"]');
      if (hp && hp.value.trim() !== '') {
        // Silencieux : on feint le succès pour ne pas révéler le piège
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Anti-spam — timing : <2s = soumission trop rapide (bot)
      if (Date.now() - loadTime < 2000) {
        if (failureEl) {
          failureEl.classList.add('show');
          failureEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Validation HTML5 native
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // UI feedback pendant envoi
      let originalLabel = null;
      if (submitBtn) {
        originalLabel = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Envoi en cours…';
      }

      // Collecte des données
      const formData = new FormData(form);
      formData.delete('website'); // Ne jamais transmettre le honeypot
      const endpoint = (form.dataset.endpoint || '').trim();

      try {
        if (endpoint) {
          // Submission via endpoint (Formspree / Getform / Cloudflare Worker)
          const resp = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          if (!resp.ok) throw new Error('endpoint error ' + resp.status);
        } else {
          // Fallback : compose un mailto: avec le contenu en clair.
          const lines = [];
          for (const [k, v] of formData.entries()) {
            if (v && String(v).trim() !== '') {
              lines.push(k + ': ' + v);
            }
          }
          const subject = '[EnerTchad · ' +
            (formData.get('type') || 'Contact') + '] ' +
            (formData.get('subject') || '');
          const mailto = 'mailto:contact@enertchad.td' +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(lines.join('\n'));
          // Laisser 250 ms pour que l'UX soit visible avant le switch de client mail
          setTimeout(() => { window.location.href = mailto; }, 250);
        }

        // Succès
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        applyCondState();
      } catch (err) {
        if (window.console && console.warn) console.warn('[contact-form]', err);
        if (failureEl) {
          failureEl.classList.add('show');
          failureEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (originalLabel !== null) submitBtn.innerHTML = originalLabel;
        }
      }
    });
  })();

  /* ==============================================================
     INTERACTIVE LEAFLET MAP · Batch 6
     Lazy-loads Leaflet 1.9.4 via IntersectionObserver, reads
     /assets/data/infrastructure.geojson + /assets/data/cadastre-2025.json,
     renders pipelines + sites + cadastre blocks with branded popups.
     Progressive enhancement: falls back to SVG if Leaflet unavailable.
     ============================================================== */
  (function initLeafletMap(){
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl) return;
    const frame = mapEl.closest('[data-map-frame]') || mapEl.parentElement;
    const svgFallback = frame ? frame.querySelector('[data-map-svg-fallback]') : null;
    const loader = frame ? frame.querySelector('[data-map-loader]') : null;

    const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

    let loaded = false;
    let loading = false;

    function showLoader(show){
      if (loader) loader.hidden = !show;
    }
    function handleFailure(err){
      if (window.console && console.warn) console.warn('[leaflet-map] fallback SVG', err);
      showLoader(false);
      mapEl.hidden = true;
      if (svgFallback) svgFallback.hidden = false;
    }

    function loadLeaflet(){
      return new Promise((resolve, reject) => {
        if (window.L) return resolve(window.L);
        // CSS
        if (!document.querySelector('link[data-leaflet]')){
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = LEAFLET_CSS;
          link.setAttribute('data-leaflet', '1');
          link.crossOrigin = '';
          document.head.appendChild(link);
        }
        // JS
        const script = document.createElement('script');
        script.src = LEAFLET_JS;
        script.async = true;
        script.defer = true;
        script.crossOrigin = '';
        script.onload = () => window.L ? resolve(window.L) : reject(new Error('Leaflet loaded but window.L undefined'));
        script.onerror = () => reject(new Error('Leaflet script failed to load'));
        document.head.appendChild(script);
      });
    }

    function siteIcon(L, category){
      const palette = {
        siege:     '#080E1A',
        aval:      '#F59E0B',
        amont:     '#2C7AE0',
        inter:     '#10B981',
        export:    '#8B5CF6',
        microgrid: '#D9A84F'
      };
      const color = palette[category] || '#080E1A';
      const html = '<span class="et-marker" style="--c:' + color + '"></span>';
      return L.divIcon({
        className: 'et-marker-wrap',
        html: html,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -10]
      });
    }

    function sitePopup(p){
      const lines = ['<div class="et-popup">'];
      lines.push('<div class="et-popup-head">' + (p.name || 'Site') + '</div>');
      if (p.role) lines.push('<div class="et-popup-role">' + p.role + '</div>');
      if (p.note) lines.push('<div class="et-popup-note">' + p.note + '</div>');
      if (p.address) lines.push('<div class="et-popup-meta">' + p.address + '</div>');
      if (p.url) lines.push('<a class="et-popup-link" href="' + p.url + '">Voir la page →</a>');
      lines.push('</div>');
      return lines.join('');
    }

    function pipelinePopup(p){
      const lines = ['<div class="et-popup">'];
      lines.push('<div class="et-popup-head">' + (p.name || 'Pipeline') + '</div>');
      if (p.from && p.to) lines.push('<div class="et-popup-role">' + p.from + ' → ' + p.to + '</div>');
      const stats = [];
      if (p.length_km) stats.push(p.length_km + ' km');
      if (p.diameter_inches) stats.push(p.diameter_inches + '″');
      if (p.capacity_kbd) stats.push(p.capacity_kbd + ' kb/j');
      if (stats.length) lines.push('<div class="et-popup-note">' + stats.join(' · ') + '</div>');
      if (p.note) lines.push('<div class="et-popup-meta">' + p.note + '</div>');
      lines.push('</div>');
      return lines.join('');
    }

    function blockColor(status){
      const map = {
        'attribué':    '#1F6AE5',
        'attribue':    '#1F6AE5',
        'libre':       '#10B981',
        'changement':  '#F59E0B',
        'concession':  '#8B5CF6',
        'en changement': '#F59E0B'
      };
      return map[(status || '').toLowerCase()] || '#7A7A7A';
    }

    function blockPopup(b){
      const lines = ['<div class="et-popup">'];
      lines.push('<div class="et-popup-head">Bloc ' + (b.id || b.name || '') + '</div>');
      if (b.status) lines.push('<div class="et-popup-role">Statut : ' + b.status + '</div>');
      if (b.basin) lines.push('<div class="et-popup-note">Bassin : ' + b.basin + '</div>');
      if (b.operator || b.licensee) lines.push('<div class="et-popup-meta">' + (b.operator || b.licensee) + '</div>');
      lines.push('</div>');
      return lines.join('');
    }

    async function renderMap(){
      if (loaded || loading) return;
      loading = true;
      showLoader(true);
      try {
        const L = await loadLeaflet();
        mapEl.hidden = false;
        const map = L.map(mapEl, {
          center: [10.5, 15.5],
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          scrollWheelZoom: false,
          attributionControl: true
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
          maxZoom: 10
        }).addTo(map);

        // Layer groups (for later layer-control toggling)
        const sitesLayer     = L.layerGroup().addTo(map);
        const pipelinesLayer = L.layerGroup().addTo(map);
        const microgridLayer = L.layerGroup();
        const blocksLayer    = L.layerGroup();

        // Fetch infrastructure GeoJSON
        const infraUrl = mapEl.getAttribute('data-geojson') || '/assets/data/infrastructure.geojson';
        try {
          const resp = await fetch(infraUrl, { credentials: 'same-origin' });
          if (!resp.ok) throw new Error('infra fetch ' + resp.status);
          const geo = await resp.json();
          (geo.features || []).forEach(f => {
            const p = f.properties || {};
            const g = f.geometry || {};
            if (g.type === 'LineString') {
              const latlngs = (g.coordinates || []).map(c => [c[1], c[0]]);
              const line = L.polyline(latlngs, {
                color: p.color || '#D9A84F',
                weight: 3.5,
                opacity: 0.85,
                dashArray: p.category === 'interne' ? '6 6' : null
              });
              line.bindPopup(pipelinePopup(p));
              line.addTo(pipelinesLayer);
            } else if (g.type === 'Point' && p.type === 'site') {
              const [lon, lat] = g.coordinates;
              const m = L.marker([lat, lon], { icon: siteIcon(L, p.category || 'siege') });
              m.bindPopup(sitePopup(p));
              m.addTo(sitesLayer);
            } else if (g.type === 'MultiPoint') {
              (g.coordinates || []).forEach(coord => {
                const [lon, lat] = coord;
                const m = L.circleMarker([lat, lon], {
                  radius: 6,
                  color: p.color || '#D9A84F',
                  weight: 2,
                  fillColor: p.color || '#D9A84F',
                  fillOpacity: 0.55
                });
                m.bindPopup(sitePopup({
                  name: p.name || 'Micro-grid solaire',
                  role: p.role,
                  note: p.note
                }));
                m.addTo(microgridLayer);
              });
            }
          });
        } catch (err) {
          if (window.console && console.warn) console.warn('[leaflet-map] infra load', err);
        }

        // Fetch cadastre blocks (best-effort)
        const cadastreUrl = mapEl.getAttribute('data-cadastre') || '/assets/data/cadastre-2025.json';
        try {
          const resp = await fetch(cadastreUrl, { credentials: 'same-origin' });
          if (resp.ok) {
            const cad = await resp.json();
            const blocks = cad.blocks || [];
            blocks.forEach(b => {
              const c = b.center_lat_lon || b.center || null;
              if (!c || c.length < 2) return;
              const lat = c[0], lon = c[1];
              const circle = L.circleMarker([lat, lon], {
                radius: 7,
                color: blockColor(b.status),
                weight: 1.5,
                fillColor: blockColor(b.status),
                fillOpacity: 0.45
              });
              circle.bindPopup(blockPopup(b));
              circle.addTo(blocksLayer);
            });
          }
        } catch (err) {
          if (window.console && console.warn) console.warn('[leaflet-map] cadastre load', err);
        }

        // Layer control
        const overlays = {
          'Sites': sitesLayer,
          'Pipelines': pipelinesLayer,
          'Micro-grids solaires': microgridLayer,
          'Cadastre (42 blocs)': blocksLayer
        };
        L.control.layers(null, overlays, { position: 'topright', collapsed: false }).addTo(map);

        // Enable scroll zoom on user click (a11y pattern)
        map.on('click', () => map.scrollWheelZoom.enable());
        map.on('mouseout', () => map.scrollWheelZoom.disable());

        // Fit all visible site markers to get a nice initial frame
        const allLatLngs = [];
        sitesLayer.eachLayer(l => { if (l.getLatLng) allLatLngs.push(l.getLatLng()); });
        pipelinesLayer.eachLayer(l => { if (l.getLatLngs) l.getLatLngs().forEach(ll => allLatLngs.push(ll)); });
        if (allLatLngs.length) {
          map.fitBounds(L.latLngBounds(allLatLngs).pad(0.25));
        }

        if (svgFallback) svgFallback.hidden = true;
        showLoader(false);
        loaded = true;

        // Invalidate size after any late layout shifts
        setTimeout(() => { try { map.invalidateSize(); } catch(e){} }, 200);
      } catch (err) {
        handleFailure(err);
      } finally {
        loading = false;
      }
    }

    // Lazy-load via IntersectionObserver
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            io.disconnect();
            renderMap();
          }
        });
      }, { rootMargin: '200px' });
      io.observe(mapEl);
    } else {
      // Fallback: load on idle
      if ('requestIdleCallback' in window) requestIdleCallback(renderMap);
      else setTimeout(renderMap, 400);
    }
  })();

})();
