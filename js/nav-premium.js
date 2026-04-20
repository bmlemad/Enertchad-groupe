/* ================================================================
   EnerTchad — NAV PREMIUM  (QW-NAV · 2026-04-20)
   Logique de navigation ultra-premium :
     - Magnetic indicator sur .nav (track .nav-link hover/focus)
     - Active-link auto-detect (aria-current="page")
     - Mega-menu data-driven (amont/midstream/aval/energies + groupe/durabilite/talents/actualites)
     - Scroll progress dans le header (.header-progress)
     - Command palette Ctrl/⌘-K
     - Mobile drawer full-screen avec stagger
     - Keyboard navigation complète, focus trap, aria-live
   ================================================================ */
(function(){
  'use strict';

  // ---- Helpers -----------------------------------------------------
  var qs  = function(s,c){ return (c||document).querySelector(s); };
  var qsa = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
  var on  = function(el,ev,fn,opt){ el && el.addEventListener(ev,fn,opt||false); };

  function ping(event, props){
    if (typeof window.plausible === 'function') {
      try { window.plausible(event, props ? {props: props} : undefined); } catch(e){}
    }
  }

  function prefersReducedMotion(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // =================================================================
  // 1. HEADER PROGRESS BAR
  // =================================================================
  function initHeaderProgress(){
    var header = qs('#header, .header');
    if (!header) return;
    var bar = qs('.header-progress', header);
    if (!bar){
      bar = document.createElement('div');
      bar.className = 'header-progress';
      bar.setAttribute('aria-hidden','true');
      header.appendChild(bar);
    }
    var rafId = null;
    function update(){
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var max = (h.scrollHeight - h.clientHeight);
      var pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
      bar.style.width = pct.toFixed(2) + '%';
      rafId = null;
    }
    on(window, 'scroll', function(){
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    }, {passive:true});
    update();
  }

  // =================================================================
  // 2. ACTIVE LINK + MAGNETIC INDICATOR
  // =================================================================
  function initActiveLink(){
    var path = location.pathname.replace(/\/+$/,'') || '/';
    var file = path.split('/').pop() || 'index.html';
    // Normalise (clean URLs : /operations/amont  =>  operations/amont.html)
    var candidates = [file, file + '.html', path.replace(/^\//,''), path.replace(/^\//,'') + '.html'];
    qsa('.nav a.nav-link, .nav-link[href]').forEach(function(a){
      var href = (a.getAttribute('href')||'').replace(/^\//,'').replace(/^\.\//,'');
      if (!href) return;
      if (candidates.indexOf(href) !== -1 || candidates.indexOf(href.replace('.html','')) !== -1){
        a.setAttribute('aria-current','page');
        a.classList.add('is-active');
      }
    });
    // --- Extension QW-NAV-ACTIVE : top-nav <button data-mega="…"> sans href ---
    var MEGA_URL_MAP = [
      { mega: 'oilfield',   test: function(p,f){ return /\/(operations|services|distribution)\//.test(p) || /(amont|aval|intermediaire|energies|greentech|well-services|drilling|consulting|digital|technologies)\.html/.test(f); } },
      { mega: 'groupe',     test: function(p,f){ return /\/groupe\//.test(p); } },
      { mega: 'durabilite', test: function(p,f){ return /durabilite\.html/.test(f); } },
      { mega: 'talents',    test: function(p,f){ return /talents\.html/.test(f); } },
      { mega: 'actualites', test: function(p,f){ return /(actualites|newsletter|investisseurs)\.html/.test(f); } }
    ];
    for (var i = 0; i < MEGA_URL_MAP.length; i++){
      if (MEGA_URL_MAP[i].test(path, file)){
        var btn = qs('.nav-link[data-mega="' + MEGA_URL_MAP[i].mega + '"]');
        if (btn){ btn.classList.add('is-active'); btn.setAttribute('aria-current','page'); }
        break;
      }
    }
  }

  function initMagneticIndicator(){
    var nav = qs('.nav');
    if (!nav) return;
    var ind = qs('.nav-indicator', nav);
    if (!ind){
      ind = document.createElement('div');
      ind.className = 'nav-indicator';
      ind.setAttribute('aria-hidden','true');
      nav.insertBefore(ind, nav.firstChild);
    }
    var current = null;
    function place(el){
      if (!el) { ind.style.opacity = 0; current = null; return; }
      var navRect = nav.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      var left = r.left - navRect.left;
      ind.style.width = r.width + 'px';
      ind.style.transform = 'translateX(' + left + 'px)';
      ind.style.opacity = 1;
      current = el;
    }
    qsa('.nav-link', nav).forEach(function(el){
      on(el,'mouseenter', function(){ place(el); });
      on(el,'focus',      function(){ place(el); });
    });
    on(nav,'mouseleave', function(){
      var active = qs('.nav-link.is-active', nav) || qs('.nav-link[aria-current="page"]', nav);
      place(active);
    });
    // Init on load
    requestAnimationFrame(function(){
      var active = qs('.nav-link.is-active', nav) || qs('.nav-link[aria-current="page"]', nav);
      if (active) place(active);
    });
    on(window,'resize', function(){
      place(current || qs('.nav-link.is-active', nav));
    });
  }

  // =================================================================
  // 3. MEGA-MENU (data-driven)
  // =================================================================
  var MEGA_DATA = {
    oilfield: {
      tone: 'amont',
      feature: {
        headerImage: 'images/oilfield-hero.svg',
        eyebrow: 'Filière pétrolière',
        title: 'Des 5 bassins jusqu\'à la pompe',
        desc: 'Une chaîne de valeur intégrée, de l\'exploration à la distribution, opérée aux standards majors.',
        metrics: [
          ['144K', 'b/j production'],
          ['1 070', 'km pipeline'],
          ['24', 'stations · 14 villes']
        ],
        cta: { label: 'Explorer les opérations', href: 'operations/amont.html' }
      },
      cols: [
        { title:'Amont', items:[
          { i:'fa-oil-well',   t:'Exploration & Production', s:'5 bassins · 7 opérateurs',    href:'operations/amont.html' },
          { i:'fa-magnifying-glass-chart', t:'Géosciences',  s:'144K b/j · 250K b/j 2030',    href:'operations/amont.html#geosciences' },
          { i:'fa-hard-hat',   t:'Forage & Well Services',   s:'Ingénierie puits',            href:'operations/amont.html#forage' }
        ]},
        { title:'Intermédiaire', items:[
          { i:'fa-pipe-section',t:'Pipeline Doba-Kribi',      s:'1 070 km · stockage',         href:'operations/intermediaire.html' },
          { i:'fa-warehouse',  t:'Stockage & Logistique',    s:'Midstream intégré',           href:'operations/intermediaire.html#operations' },
          { i:'fa-satellite-dish', t:'SCADA & Télémétrie',    s:'Dashboard temps réel',        href:'operations/intermediaire.html#dashboard' }
        ]},
        { title:'Aval & Énergies', items:[
          { i:'fa-industry',   t:'Raffinerie Djarmaya',      s:'20 kb/j · HSE ISO',           href:'operations/aval.html' },
          { i:'fa-gas-pump',   t:'Stations-service',         s:'24 stations · 14 villes',     href:'operations/aval.html#stations' },
          { i:'fa-solar-panel',t:'EnerTchad GreenTech',      s:'500 MW · solaire, éolien, hybride', href:'operations/greentech.html' }
        ]}
      ]
    },
    groupe: {
      tone: 'energies',
      feature: {
        headerImage: 'images/groupe-hero.svg',
        eyebrow: 'À propos',
        title: 'EnerTchad Groupe — Major Énergie d\'Afrique centrale',
        desc: '1 240 collaborateurs, un ancrage national, des standards internationaux. Un groupe intégré au service de la souveraineté énergétique du Tchad.',
        metrics: [
          ['1 240', 'collaborateurs'],
          ['7',     'filiales'],
          ['20+',   'ans d\'expérience']
        ],
        cta: { label: 'Découvrir le groupe', href: 'groupe/index.html' }
      },
      cols: [
        { title:'Qui nous sommes', items:[
          { i:'fa-building', t:'Présentation',   s:'Vision, missions, ambition', href:'groupe/index.html#identite' },
          { i:'fa-users',    t:'Gouvernance',    s:'Conseil, comités, éthique',  href:'groupe/index.html#gouvernance' },
          { i:'fa-timeline', t:'Histoire',       s:'Étapes clés · 2026',         href:'groupe/index.html#histoire' }
        ]},
        { title:'Organisation', items:[
          { i:'fa-sitemap',  t:'Filiales',       s:'Amont · Mid · Aval · GreenTech', href:'groupe/index.html#subsidiaries' },
          { i:'fa-globe-africa', t:'Implantations',s:'14 villes · 5 bassins',    href:'groupe/index.html#poles' },
          { i:'fa-handshake', t:'Partenariats',  s:'Majors, États, multilatéraux', href:'groupe/index.html#partenariats' }
        ]},
        { title:'Reconnaissance', items:[
          { i:'fa-certificate', t:'Certifications',s:'ISO 37001/26000/27001',   href:'durabilite.html#certifications' },
          { i:'fa-newspaper',   t:'Presse',       s:'Dossier et ressources',    href:'actualites.html#communiques' },
          { i:'fa-medal',       t:'Prix & distinctions',s:'EITI · Afrique',     href:'groupe/index.html#publications' }
        ]}
      ]
    },
    durabilite: {
      tone: 'energies',
      feature: {
        headerImage: 'images/durabilite-hero.svg',
        eyebrow: 'Engagement',
        title: 'Zéro-compromis HSE · Trajectoire bas-carbone',
        desc: 'ISO 37001, 26000 et 27001. Rapport durabilité annuel conforme GRI et alignement ITIE. 500 MW renouvelables visés.',
        metrics: [
          ['500', 'MW renouv. visés'],
          ['GRI', 'reporting'],
          ['ITIE', 'compliance']
        ],
        cta: { label: 'Rapport Durabilité 2025', href: 'durabilite.html#rapport-rse' }
      },
      cols: [
        { title:'Planète', items:[
          { i:'fa-leaf',      t:'Trajectoire carbone',   s:'Scope 1-2-3',          href:'durabilite.html#climat' },
          { i:'fa-wind',      t:'Transition énergétique',s:'Solaire · éolien · hybride', href:'operations/greentech.html' },
          { i:'fa-droplet',   t:'Eau & biodiversité',   s:'Gestion intégrée',     href:'durabilite.html#biodiversite' }
        ]},
        { title:'Communautés', items:[
          { i:'fa-people-roof', t:'Impact local',        s:'Contenu local, emploi', href:'durabilite.html#local-content' },
          { i:'fa-graduation-cap', t:'Éducation',        s:'EnerTchad Academy',    href:'talents.html#academy' },
          { i:'fa-heart-pulse', t:'Santé & sécurité',    s:'ISO 45001',            href:'durabilite.html#hse' }
        ]},
        { title:'Gouvernance', items:[
          { i:'fa-scale-balanced', t:'Éthique & compliance', s:'ISO 37001',       href:'durabilite.html#ethique' },
          { i:'fa-file-shield',    t:'Cybersécurité',        s:'ISO 27001 · OT',  href:'durabilite.html#cyber' },
          { i:'fa-file-contract',  t:'Reporting',            s:'GRI · ITIE · TCFD', href:'durabilite.html#reporting' }
        ]}
      ]
    },
    talents: {
      tone: 'amont',
      feature: {
        headerImage: 'images/talents-hero.svg',
        eyebrow: 'Rejoignez-nous',
        title: 'Construire l\'avenir énergétique du Tchad',
        desc: '1 240 collaborateurs, 200h/an de formation. Programme Graduate Trainee, alternance et mobilité internationale.',
        metrics: [
          ['200h', 'formation / an'],
          ['80%',  'recrutement local'],
          ['6',    'métiers-phares']
        ],
        cta: { label: 'Voir les offres', href: 'talents.html#offres' }
      },
      cols: [
        { title:'Candidats', items:[
          { i:'fa-briefcase',   t:'Offres d\'emploi', s:'Forage, HSE, IT, énergies', href:'talents.html#offres' },
          { i:'fa-user-graduate', t:'Graduate Trainee',s:'Jeunes diplômés',         href:'talents.html#graduate' },
          { i:'fa-paper-plane', t:'Candidature spontanée',s:'Postulez',             href:'talents.html#candidature' }
        ]},
        { title:'Formation', items:[
          { i:'fa-school',      t:'EnerTchad Academy',s:'200h/an',                  href:'talents.html#academy' },
          { i:'fa-certificate', t:'Certifications métier',s:'IWCF, NEBOSH, API',    href:'talents.html#competences' },
          { i:'fa-rotate',      t:'Mobilité interne',  s:'7 filiales',              href:'talents.html#parcours' }
        ]},
        { title:'Culture', items:[
          { i:'fa-bullseye',    t:'Nos valeurs',       s:'Rigueur · impact · éthique', href:'talents.html#valeurs' },
          { i:'fa-users-gear',  t:'Diversité & inclusion',s:'Charte + KPI',         href:'talents.html#diversite' },
          { i:'fa-handshake-angle', t:'Onboarding',    s:'Parcours 90 jours',       href:'talents.html#avantages' }
        ]}
      ]
    },
    actualites: {
      tone: 'midstream',
      feature: {
        headerImage: 'images/actualites-hero.svg',
        eyebrow: 'Salle de presse',
        title: 'Actualités, communiqués et ressources',
        desc: 'Communiqués officiels, rapports annuels, photothèque et contacts presse — pour journalistes, analystes et parties prenantes.',
        metrics: [
          ['2026', 'Rapport annuel'],
          ['12',   'communiqués / an'],
          ['HD',   'photothèque']
        ],
        cta: { label: 'Voir toutes les actus', href: 'actualites.html' }
      },
      cols: [
        { title:'Publications', items:[
          { i:'fa-envelope-open-text', t:'Newsletter Insights', s:'Veille éditoriale · mensuelle', href:'newsletter.html' },
          { i:'fa-bullhorn',   t:'Communiqués de presse',s:'Flux officiel',          href:'actualites.html#communiques' },
          { i:'fa-podcast',    t:'Interviews & médias', s:'Dirigeants',             href:'actualites.html#media' }
        ]},
        { title:'Ressources', items:[
          { i:'fa-file-lines', t:'Rapports annuels',    s:'Intégrés · audités',     href:'investisseurs.html#documents' },
          { i:'fa-images',     t:'Photothèque',         s:'Assets HD',               href:'actualites.html#media' },
          { i:'fa-folder-open',t:'Kit presse',          s:'Logo, charte, bios',      href:'actualites.html#media' }
        ]},
        { title:'Contact', items:[
          { i:'fa-envelope',   t:'Presse',              s:'presse@enertchad-groupe', href:'contact.html#formulaire' },
          { i:'fa-users',      t:'Relations investisseurs',s:'Analystes',           href:'investisseurs.html#corporate-info' },
          { i:'fa-comments',   t:'Parties prenantes',   s:'ONG, multilatéraux',     href:'contact.html#formulaire' }
        ]}
      ]
    }
  };

  // ---- i18n (R9) : fallback FR si lang inconnue --------------------
  var MEGA_DATA_I18N = { fr: MEGA_DATA /*, en: {...} à remplir plus tard */ };
  function currentLang(){
    var l = (document.documentElement.getAttribute('lang')||'fr').toLowerCase();
    return MEGA_DATA_I18N[l] ? l : 'fr';
  }
  function getMega(key){
    var lang = currentLang();
    return (MEGA_DATA_I18N[lang] && MEGA_DATA_I18N[lang][key]) || MEGA_DATA[key];
  }

  function escapeHTML(s){
    return String(s||'').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function renderMegaHTML(key){
    var d = getMega(key); if (!d) return '';
    var f = d.feature;
    var metrics = (f.metrics||[]).map(function(m){
      return '<span>'+escapeHTML(m[0])+'<small>'+escapeHTML(m[1])+'</small></span>';
    }).join('');
    // R6 : headerImage optionnel (gradient data-tone fallback sinon)
    var hero = f.headerImage
      ? '<div class="mega-feature-hero" style="background-image:url(\''+escapeHTML(f.headerImage)+'\')" aria-hidden="true"></div>'
      : '';
    var cols = (d.cols||[]).map(function(c){
      var lis = c.items.map(function(it){
        return '<li><a href="'+escapeHTML(it.href)+'" data-cmdk-indexable data-cmdk-group="'+escapeHTML(c.title)+'">'+
          '<i class="fas '+escapeHTML(it.i)+'"></i>'+
          '<span class="cmdk-title">'+escapeHTML(it.t)+'<small>'+escapeHTML(it.s||'')+'</small></span>'+
          '</a></li>';
      }).join('');
      return '<div class="mega-col"><h4>'+escapeHTML(c.title)+'</h4><ul>'+lis+'</ul></div>';
    }).join('');
    // R10 : barre de recherche inline (filtre client-side)
    var search =
      '<div class="mega-search" role="search">' +
        '<i class="fas fa-search" aria-hidden="true"></i>' +
        '<input type="search" class="mega-search-input" placeholder="Rechercher dans '+escapeHTML(key)+'…" aria-label="Rechercher dans le menu"/>' +
        '<span class="mega-search-empty" hidden>Aucun résultat</span>' +
      '</div>';
    return (
      '<div class="mega-grid">' +
        '<div class="mega-feature">' +
          hero +
          '<div>' +
            '<div class="mega-eyebrow">'+escapeHTML(f.eyebrow)+'</div>' +
            '<h3>'+escapeHTML(f.title)+'</h3>' +
            '<p>'+escapeHTML(f.desc)+'</p>' +
          '</div>' +
          '<div class="mega-metric">'+metrics+'</div>' +
          '<a class="mega-cta" href="'+escapeHTML(f.cta.href)+'"><i class="fas fa-arrow-right"></i> '+escapeHTML(f.cta.label)+'</a>' +
        '</div>' +
        '<div class="mega-cols-wrap">' +
          search +
          '<div class="mega-cols">'+cols+'</div>' +
        '</div>' +
      '</div>'
    );
  }

  // ---- Decorate panel : R5 aria-current + R10 search + R11 telemetry
  function decoratePanel(panel, key){
    if (!panel || panel.__decorated) return;
    panel.__decorated = true;

    // ---- R5 : state "page courante" sur chaque item ----
    var path = (location.pathname || '').replace(/\/+$/,'') || '/';
    var file = path.split('/').pop() || 'index.html';
    var candidates = {};
    [file, file.replace('.html',''), path.replace(/^\//,''), path.replace(/^\//,'').replace('.html','')]
      .forEach(function(c){ if (c) candidates[c.toLowerCase()] = true; });
    qsa('a[href]', panel).forEach(function(a){
      var h = (a.getAttribute('href')||'').toLowerCase().split('#')[0].split('?')[0].replace(/^\.?\/+/,'');
      if (!h) return;
      if (candidates[h] || candidates[h.replace('.html','')]){
        a.setAttribute('aria-current','page');
        a.classList.add('is-current');
      }
    });

    // ---- R11 : telemetry sur clic item ----
    qsa('a[data-cmdk-indexable]', panel).forEach(function(a){
      on(a,'click', function(){
        var group = a.getAttribute('data-cmdk-group') || '';
        var title = (qs('.cmdk-title', a)||{}).firstChild;
        var label = title ? (title.textContent||'').trim() : a.textContent.trim();
        ping('MegaItemClick', { section: key, group: group, item: label });
      });
    });
    var cta = qs('.mega-cta', panel);
    if (cta){
      on(cta,'click', function(){
        ping('MegaCTAClick', { section: key, href: cta.getAttribute('href') });
      });
    }

    // ---- R10 : filtre client-side + telemetry requête ----
    var input = qs('.mega-search-input', panel);
    var emptyMsg = qs('.mega-search-empty', panel);
    if (!input) return;
    var lastQuery = '';
    var pingTimer = null;
    function applyFilter(){
      var q = (input.value||'').trim().toLowerCase();
      var any = false;
      qsa('.mega-col', panel).forEach(function(col){
        var colAny = false;
        qsa('li', col).forEach(function(li){
          var txt = (li.textContent||'').toLowerCase();
          var match = !q || txt.indexOf(q) !== -1;
          li.style.display = match ? '' : 'none';
          if (match) colAny = true;
        });
        col.style.display = colAny ? '' : 'none';
        if (colAny) any = true;
      });
      if (emptyMsg) emptyMsg.hidden = (!q || any);
      if (q !== lastQuery){
        lastQuery = q;
        clearTimeout(pingTimer);
        // Debounce 600 ms pour ne pas spammer l'analytique
        pingTimer = setTimeout(function(){
          if (q) ping('MegaSearchQuery', { section: key, query: q, results: any ? 'hit' : 'miss' });
        }, 600);
      }
    }
    on(input,'input', applyFilter);
    on(input,'keydown', function(e){
      if (e.key === 'Escape'){ input.value = ''; applyFilter(); }
    });
  }

  function initMegaMenu(){
    var triggers = qsa('.nav-link[data-mega]');
    if (!triggers.length) return;
    var overlay = qs('.mega-overlay') || (function(){
      var o = document.createElement('div');
      o.className = 'mega-overlay'; o.id = 'megaOverlay';
      document.body.appendChild(o); return o;
    })();
    var panels = {};
    var current = null;
    var closeTimer = null;

    function getPanel(key){
      if (panels[key]) return panels[key];
      var data = getMega(key);
      if (!data) return null;
      var p = document.createElement('div');
      p.className = 'mega-panel';
      p.setAttribute('data-tone', data.tone || '');
      p.setAttribute('data-mega-panel', key);
      p.setAttribute('role','dialog');
      p.setAttribute('aria-label', key);
      p.innerHTML = renderMegaHTML(key);
      document.body.appendChild(p);
      on(p,'mouseenter', function(){ clearTimeout(closeTimer); });
      on(p,'mouseleave', scheduleClose);
      decoratePanel(p, key); // R5 + R10 + R11
      panels[key] = p; return p;
    }

    function open(key, trigger){
      clearTimeout(closeTimer);
      Object.keys(panels).forEach(function(k){
        if (k!==key) panels[k].classList.remove('active');
      });
      qsa('.nav-link[data-mega]').forEach(function(t){ t.setAttribute('aria-expanded','false'); });
      var p = getPanel(key); if (!p) return;
      p.classList.add('active');
      overlay.classList.add('active');
      trigger && trigger.setAttribute('aria-expanded','true');
      current = key;
      ping('MegaOpen', { section: key });
    }
    function close(){
      Object.keys(panels).forEach(function(k){ panels[k].classList.remove('active'); });
      overlay.classList.remove('active');
      qsa('.nav-link[data-mega]').forEach(function(t){ t.setAttribute('aria-expanded','false'); });
      current = null;
    }
    function scheduleClose(){
      clearTimeout(closeTimer);
      // HEADER_POLISH_V2 2026-04-20 — 380→450 ms, combiné avec le bridge CSS ::after
      // pour éliminer la dead-zone entre trigger et panel. Shell=420, TotalEnergies=380.
      closeTimer = setTimeout(close, 450);
    }

    triggers.forEach(function(t){
      var key = t.getAttribute('data-mega');
      if (!getMega(key)) return;
      on(t,'mouseenter', function(){ open(key, t); });
      on(t,'focus',      function(){ open(key, t); });
      on(t,'click',      function(e){ e.preventDefault(); current===key ? close() : open(key, t); });
      on(t,'mouseleave', scheduleClose);
      on(t,'keydown',    function(e){
        if (e.key==='Escape'){ close(); t.focus(); }
        if (e.key==='ArrowDown'){
          e.preventDefault(); var p = getPanel(key); if (p){ open(key,t); var first = qs('a,button', p); first && first.focus(); }
        }
      });
    });

    on(overlay,'click', close);
    on(document,'keydown', function(e){
      if (e.key==='Escape' && current){ close(); }
    });
    on(document,'click', function(e){
      if (!current) return;
      var p = panels[current];
      if (p && !p.contains(e.target) &&
          !e.target.closest('.nav-link[data-mega]')){
        close();
      }
    });
  }

  // =================================================================
  // 4. COMMAND PALETTE (Ctrl/⌘-K)
  // =================================================================
  var CMDK_DEFAULTS = [
    { group:'Accueil',    t:'Accueil',           s:'Page d\'accueil',          i:'fa-home',        href:'index.html' },
    { group:'Opérations', t:'EnerTchad Amont',   s:'Exploration & Production', i:'fa-oil-well',    href:'operations/amont.html' },
    { group:'Opérations', t:'EnerTchad Intermédiaire', s:'Pipeline & midstream', i:'fa-pipe-section', href:'operations/intermediaire.html' },
    { group:'Opérations', t:'EnerTchad Aval',    s:'Raffinerie & stations',    i:'fa-industry',    href:'operations/aval.html' },
    { group:'Opérations', t:'EnerTchad GreenTech',s:'500 MW renouvelables',    i:'fa-solar-panel', href:'operations/greentech.html' },
    { group:'Groupe',     t:'Présentation',      s:'Vision & missions',        i:'fa-building',    href:'groupe/index.html#identite' },
    { group:'Groupe',     t:'Gouvernance',       s:'Conseil & comités',        i:'fa-users',       href:'groupe/index.html#gouvernance' },
    { group:'Groupe',     t:'Filiales',          s:'7 filiales',               i:'fa-sitemap',     href:'groupe/index.html#subsidiaries' },
    { group:'Engagement', t:'Durabilité',        s:'ESG · RSE · GRI',          i:'fa-leaf',        href:'durabilite.html' },
    { group:'Engagement', t:'Rapport 2025',      s:'PDF · 2,4 Mo',             i:'fa-file-pdf',    href:'durabilite.html#rapport-rse' },
    { group:'Talents',    t:'Offres d\'emploi',  s:'Forage · HSE · IT',        i:'fa-briefcase',   href:'talents.html#offres' },
    { group:'Talents',    t:'EnerTchad Academy', s:'Formation 200h/an',        i:'fa-school',      href:'talents.html#academy' },
    { group:'Médias',     t:'Actualités',        s:'Communiqués & presse',     i:'fa-newspaper',   href:'actualites.html' },
    { group:'Médias',     t:'Newsletter',        s:'Veille éditoriale',        i:'fa-envelope-open-text', href:'newsletter.html' },
    { group:'Médias',     t:'Investisseurs',     s:'Rapports & IR',            i:'fa-chart-pie',   href:'investisseurs.html' },
    { group:'Contact',    t:'Contact',           s:'Nous écrire',              i:'fa-envelope',    href:'contact.html' },
    { group:'Action',     t:'Demander un devis', s:'Formulaire contact',       i:'fa-file-signature', href:'contact.html#devis' },
    { group:'Action',     t:'Changer de langue', s:'FR ↔ EN',                  i:'fa-language',    action:'lang' },
    { group:'Action',     t:'Télécharger le logo', s:'SVG',                    i:'fa-image',       href:'logo-enertchad.svg' }
  ];

  function initCommandPalette(){
    if (qs('#cmdk-overlay')) return;

    // Inject trigger into header if space permits
    var actions = qs('.header-actions');
    if (actions){
      var trig = document.createElement('button');
      trig.type = 'button';
      trig.className = 'cmdk-trigger';
      trig.setAttribute('aria-label','Ouvrir la recherche rapide');
      trig.innerHTML = '<i class="fas fa-magnifying-glass"></i>' +
                       '<span>Rechercher</span>' +
                       '<kbd>⌘ K</kbd>';
      // Place it first (left of theme/cta)
      actions.insertBefore(trig, actions.firstChild);
      on(trig,'click', function(){ openModal(); });
    }

    // Overlay
    var o = document.createElement('div');
    o.className = 'cmdk-overlay';
    o.id = 'cmdk-overlay';
    o.setAttribute('aria-hidden','true');
    o.innerHTML =
      '<div class="cmdk-modal" role="dialog" aria-modal="true" aria-label="Recherche rapide">' +
        '<div class="cmdk-search">' +
          '<i class="fas fa-magnifying-glass" aria-hidden="true"></i>' +
          '<input id="cmdk-input" type="search" autocomplete="off" spellcheck="false" placeholder="Rechercher une page, un document, une action…" aria-label="Recherche rapide" />' +
          '<kbd>ESC</kbd>' +
        '</div>' +
        '<div class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Résultats"></div>' +
        '<div class="cmdk-footer">' +
          '<span><kbd>↑</kbd><kbd>↓</kbd> Naviguer</span>' +
          '<span><kbd>↵</kbd> Ouvrir</span>' +
          '<span><kbd>ESC</kbd> Fermer</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(o);

    var input = qs('#cmdk-input', o);
    var list  = qs('#cmdk-list',  o);
    var items = CMDK_DEFAULTS.slice();
    // Enrich with mega-menu link pool (rendered lazily -> use static list for now)
    Object.keys(MEGA_DATA).forEach(function(k){
      (MEGA_DATA[k].cols||[]).forEach(function(c){
        c.items.forEach(function(it){
          items.push({ group: 'Navigation', t: it.t, s: it.s, i: it.i, href: it.href });
        });
      });
    });

    var filtered = items;
    var selected = 0;

    function fuzzy(q, str){
      if (!q) return true;
      q = q.toLowerCase(); str = (str||'').toLowerCase();
      var qi=0;
      for (var i=0;i<str.length && qi<q.length;i++){
        if (str[i]===q[qi]) qi++;
      }
      return qi===q.length;
    }

    function render(){
      if (!filtered.length){
        list.innerHTML = '<div class="cmdk-empty">Aucun résultat — essayez « forage », « durabilité », « contact ».</div>';
        return;
      }
      var out = '', group = '';
      filtered.forEach(function(it, idx){
        if (it.group !== group){
          group = it.group;
          out += '<div class="cmdk-group-label">'+group+'</div>';
        }
        out += '<div class="cmdk-item '+(idx===selected?'is-selected':'')+'" role="option" data-idx="'+idx+'" tabindex="-1">' +
                 '<i class="fas '+it.i+'" aria-hidden="true"></i>' +
                 '<div><div class="cmdk-title">'+it.t+'</div>' +
                 (it.s ? '<span class="cmdk-sub">'+it.s+'</span>' : '') +
                 '</div></div>';
      });
      list.innerHTML = out;
    }
    function update(){
      var q = input.value.trim();
      filtered = items.filter(function(it){
        return fuzzy(q, it.t) || fuzzy(q, it.s) || fuzzy(q, it.group);
      });
      selected = 0; render();
    }
    function move(delta){
      if (!filtered.length) return;
      selected = (selected + delta + filtered.length) % filtered.length;
      render();
      var el = qs('.cmdk-item.is-selected', list);
      el && el.scrollIntoView({block:'nearest'});
    }
    function commit(){
      var it = filtered[selected]; if (!it) return;
      ping('CmdK', { target: it.t });
      closeModal();
      if (it.action === 'lang'){
        var lb = qs('#langToggle'); lb && lb.click();
      } else if (it.href){
        location.href = it.href;
      }
    }
    function openModal(){
      render();
      o.classList.add('active');
      o.setAttribute('aria-hidden','false');
      setTimeout(function(){ input.focus(); input.select(); }, 50);
      ping('CmdKOpen');
    }
    function closeModal(){
      o.classList.remove('active');
      o.setAttribute('aria-hidden','true');
    }

    on(input,'input', update);
    on(input,'keydown', function(e){
      if (e.key==='ArrowDown'){ e.preventDefault(); move(1); }
      else if (e.key==='ArrowUp'){ e.preventDefault(); move(-1); }
      else if (e.key==='Enter'){ e.preventDefault(); commit(); }
      else if (e.key==='Escape'){ e.preventDefault(); closeModal(); }
    });
    on(list,'click', function(e){
      var it = e.target.closest('.cmdk-item'); if (!it) return;
      selected = parseInt(it.getAttribute('data-idx'),10) || 0;
      commit();
    });
    on(o,'click', function(e){ if (e.target===o) closeModal(); });

    on(document,'keydown', function(e){
      // Ctrl/⌘ + K
      if ((e.ctrlKey || e.metaKey) && (e.key==='k' || e.key==='K')){
        e.preventDefault();
        if (o.classList.contains('active')) closeModal(); else openModal();
      }
      // "/" quand pas dans un input
      if (e.key === '/' && !/(input|textarea|select)/i.test((e.target.tagName||''))
          && !o.classList.contains('active')){
        e.preventDefault(); openModal();
      }
    });
  }

  // =================================================================
  // 5. MOBILE DRAWER (full-screen with stagger)
  // =================================================================
  function initMobileDrawer(){
    if (qs('.mobile-drawer')) return;

    // Build from existing desktop nav
    var items = [];
    qsa('.nav > .nav-link, .nav > a.nav-link').forEach(function(el){
      var key = el.getAttribute('data-mega');
      var label = el.textContent.trim();
      var href = el.getAttribute('href');
      if (key && MEGA_DATA[key]){
        // Build section with children
        var sub = [];
        (MEGA_DATA[key].cols||[]).forEach(function(c){
          c.items.forEach(function(it){
            sub.push({t: it.t, href: it.href});
          });
        });
        items.push({label: label, href: href, sub: sub});
      } else if (href){
        items.push({label: label, href: href});
      }
    });

    var itemsHTML = items.map(function(it){
      if (it.sub && it.sub.length){
        var subs = it.sub.map(function(s){
          return '<li><a href="'+s.href+'">'+s.t+'</a></li>';
        }).join('');
        return '<details><summary>'+it.label+
               '<i class="fas fa-chevron-down" aria-hidden="true"></i></summary>'+
               '<ul>'+subs+'</ul></details>';
      }
      return '<a href="'+(it.href||'#')+'">'+it.label+
             '<i class="fas fa-arrow-right" aria-hidden="true"></i></a>';
    }).join('');

    var d = document.createElement('div');
    d.className = 'mobile-drawer';
    d.id = 'mobileDrawer';
    d.setAttribute('aria-hidden','true');
    d.innerHTML =
      '<button class="mobile-drawer-close" aria-label="Fermer le menu"><i class="fas fa-xmark"></i></button>' +
      '<nav role="navigation" aria-label="Navigation mobile">'+itemsHTML+'</nav>' +
      '<div class="mobile-drawer-cta">' +
        '<a class="btn btn-primary" href="contact.html">Demander un devis</a>' +
        '<a class="btn btn-ghost" href="talents.html">Rejoindre EnerTchad</a>' +
      '</div>';
    document.body.appendChild(d);

    var toggle = qs('#mobileToggle');
    function open(){
      d.classList.add('active');
      d.setAttribute('aria-hidden','false');
      toggle && toggle.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      d.classList.remove('active');
      d.setAttribute('aria-hidden','true');
      toggle && toggle.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    }
    if (toggle){ on(toggle,'click', function(){ d.classList.contains('active')?close():open(); }); }
    on(qs('.mobile-drawer-close', d), 'click', close);
    on(d,'click', function(e){ if (e.target===d) close(); });
    on(document,'keydown', function(e){
      if (e.key==='Escape' && d.classList.contains('active')) close();
    });
  }

  // =================================================================
  // 6. HEADER SCROLL STATE  (renforce la classe .scrolled existante)
  // =================================================================
  function initHeaderScroll(){
    var header = qs('#header, .header'); if (!header) return;
    function update(){
      if ((window.scrollY||0) > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    on(window,'scroll', update, {passive:true});
    update();
  }

  // =================================================================
  // 7. BOOT
  // =================================================================
  function boot(){
    initHeaderScroll();
    initHeaderProgress();
    initActiveLink();
    initMagneticIndicator();
    initMegaMenu();
    initCommandPalette();
    initMobileDrawer();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
