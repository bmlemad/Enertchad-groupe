/* ═══ EnerTchad — Shared Scripts v1.0 ═══ */

/* ─────────────────────────────────────────────────────────────────
   1. NAVIGATION URL REGISTRY
   ───────────────────────────────────────────────────────────────── */
var ENERTCHAD = window.ENERTCHAD || {
  groupe: '/',
  amont: '/amont',
  midstream: '/intermediaire',
  aval: '/aval',
  tech: '/technologies',
  energies: '/energies',
  petrochimie: '/#petrochimie'
};

/* ─────────────────────────────────────────────────────────────────
   2. READING PROGRESS BAR
   ───────────────────────────────────────────────────────────────── */
(function(){
  var bar = document.getElementById('readingProgress');
  if(!bar) return;
  window.addEventListener('scroll', function(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h * 100) + '%';
  }, {passive: true});
})();

/* ─────────────────────────────────────────────────────────────────
   3. SCROLL-TO-TOP BUTTON
   ───────────────────────────────────────────────────────────────── */
(function(){
  var btn = document.getElementById('scrollTop');
  if(!btn) return;
  window.addEventListener('scroll', function(){
    btn.classList.toggle('visible', window.scrollY > 600);
  }, {passive: true});
  btn.addEventListener('click', function(){
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
})();

/* ─────────────────────────────────────────────────────────────────
   4. THEME TOGGLE (Light/Dark)
   ───────────────────────────────────────────────────────────────── */
(function(){
  var btn = document.getElementById('themeToggle');
  if(!btn) return;
  var icon = btn.querySelector('i');
  try {
    if(localStorage.getItem('theme') === 'light'){
      document.documentElement.classList.add('light');
      if(icon) icon.className = 'fas fa-moon';
    }
  } catch(e) {}
  btn.addEventListener('click', function(){
    var isLight = document.documentElement.classList.toggle('light');
    if(icon) icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    try {
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    } catch(e) {}
  });
})();

/* ─────────────────────────────────────────────────────────────────
   5. LANGUAGE TOGGLE (i18n FR/EN)
   ───────────────────────────────────────────────────────────────── */
(function(){
  var btn = document.getElementById('langToggle');
  if(!btn) return;
  var lang = 'fr';
  var originals = new Map();
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    originals.set(el, el.innerHTML);
  });
  btn.addEventListener('click', function(){
    lang = lang === 'fr' ? 'en' : 'fr';
    btn.textContent = lang === 'fr' ? 'FR / EN' : 'EN / FR';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      if(lang === 'en' && el.dataset.en){
        el.innerHTML = el.dataset.en;
      } else if(lang === 'fr' && originals.has(el)){
        el.innerHTML = originals.get(el);
      }
    });
  });
})();

/* ─────────────────────────────────────────────────────────────────
   6. SCROLL PROGRESS BAR + BREADCRUMBS
   ───────────────────────────────────────────────────────────────── */
(function(){
  var sp = document.getElementById('scrollProgress');
  var bb = document.getElementById('breadcrumbBar');
  var bcCur = document.getElementById('bcCurrent');
  var bcDots = document.getElementById('bcDots');

  if(!sp && !bb) return;

  var sections = [];
  if(bcDots){
    document.querySelectorAll('section[id]').forEach(function(s){
      var title = s.querySelector('h2,.section-title,h1');
      if(title){
        var label = title.textContent.trim().substring(0, 30);
        sections.push({el: s, id: s.id, label: label});
        var dot = document.createElement('span');
        dot.className = 'bc-dot';
        dot.setAttribute('data-label', label);
        dot.setAttribute('data-section', s.id);
        dot.addEventListener('click', function(){
          s.scrollIntoView({behavior: 'smooth', block: 'start'});
        });
        bcDots.appendChild(dot);
      }
    });
  }

  var dots = bcDots ? bcDots.querySelectorAll('.bc-dot') : [];

  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;

    if(sp && docH > 0) sp.style.width = (y / docH * 100) + '%';
    if(bb){
      if(y > 300 || y > 400) bb.classList.add('visible');
      else bb.classList.remove('visible');
    }

    var active = -1;
    for(var i = sections.length - 1; i >= 0; i--){
      if(sections[i].el.getBoundingClientRect().top < 200){
        active = i;
        break;
      }
    }

    if(bcCur && active >= 0) bcCur.textContent = sections[active].label;
    else if(bcCur) bcCur.textContent = '—';

    dots.forEach(function(d, i){
      if(i === active) d.classList.add('active');
      else d.classList.remove('active');
    });
  }, {passive: true});
})();

/* ─────────────────────────────────────────────────────────────────
   7. GLOBAL SEARCH (Ctrl+K)
   ───────────────────────────────────────────────────────────────── */
(function(){
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');

  if(!overlay || !input || !results) return;

  var index = [];
  document.querySelectorAll('section[id]').forEach(function(s){
    var title = s.querySelector('h2,.section-title,h1');
    var desc = s.querySelector('.section-desc,p,.sdesc');
    if(title){
      index.push({
        type: 'section',
        icon: 'fas fa-bookmark',
        title: title.textContent.trim(),
        desc: desc ? desc.textContent.trim().substring(0, 80) : '',
        url: '#' + s.id,
        group: 'Cette page'
      });
    }
  });

  var sites = [
    {title: 'EnerTchad Groupe', desc: 'Hub corporate · 5 filiales', icon: 'fas fa-building', url: ENERTCHAD.groupe, color: 'var(--gold,#C8962E)'},
    {title: 'EnerTchad Amont', desc: 'Exploration & Production', icon: 'fas fa-oil-can', url: ENERTCHAD.amont, color: '#2E86DE'},
    {title: 'EnerTchad Intermédiaire', desc: 'Pipeline 1 070 km · Transport', icon: 'fas fa-pipe-section', url: ENERTCHAD.midstream, color: '#0EA5E9'},
    {title: 'EnerTchad Aval', desc: '45 stations · Distribution', icon: 'fas fa-gas-pump', url: ENERTCHAD.aval, color: '#D97706'},
    {title: 'EnerTchad Technologies', desc: 'Digital Twin · SCADA · IA', icon: 'fas fa-microchip', url: ENERTCHAD.tech, color: '#8B5CF6'},
    {title: 'EnerTchad Énergies', desc: '125 MW · Solaire · Micro-grids', icon: 'fas fa-bolt', url: ENERTCHAD.energies, color: '#10B981'},
    {title: 'EnerTchad Pétrochimie', desc: 'Polymères · Engrais · Chimie de base', icon: 'fas fa-flask-vial', url: ENERTCHAD.petrochimie, color: 'var(--petro,#E11D48)'}
  ];

  sites.forEach(function(s){
    index.push({
      type: 'filiale',
      icon: s.icon,
      title: s.title,
      desc: s.desc,
      url: s.url,
      group: 'Filiales',
      color: s.color
    });
  });

  var focusIdx = -1;

  function open(){
    overlay.classList.add('active');
    input.value = '';
    input.focus();
    render('');
    focusIdx = -1;
  }

  function close(){
    overlay.classList.remove('active');
    input.blur();
  }

  function render(q){
    results.innerHTML = '';
    focusIdx = -1;
    var q2 = q.toLowerCase().trim();
    var filtered = q2 ? index.filter(function(it){
      return it.title.toLowerCase().indexOf(q2) > -1 || it.desc.toLowerCase().indexOf(q2) > -1;
    }) : index;

    var groups = {};
    filtered.forEach(function(it){
      if(!groups[it.group]) groups[it.group] = [];
      groups[it.group].push(it);
    });

    Object.keys(groups).forEach(function(g){
      var gh = document.createElement('div');
      gh.className = 'sr-group-title';
      gh.textContent = g;
      results.appendChild(gh);

      groups[g].forEach(function(it){
        var a = document.createElement('a');
        a.className = 'sr-item';
        a.href = it.url;
        if(it.type === 'filiale') a.target = '_blank';
        a.innerHTML = '<div class="sr-item-icon" style="color:' + (it.color || 'var(--accent)') + '"><i class="' + it.icon + '"></i></div><div class="sr-item-text"><div class="sr-item-title">' + it.title + '</div><div class="sr-item-desc">' + it.desc + '</div></div><i class="fas fa-arrow-right sr-item-arrow"></i>';
        a.addEventListener('click', function(){
          close();
        });
        results.appendChild(a);
      });
    });
  }

  document.addEventListener('keydown', function(e){
    if((e.ctrlKey || e.metaKey) && e.key === 'k'){
      e.preventDefault();
      if(overlay.classList.contains('active')) close();
      else open();
      return;
    }
    if(!overlay.classList.contains('active')) return;
    if(e.key === 'Escape'){
      close();
      return;
    }
    var items = results.querySelectorAll('.sr-item');
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      focusIdx = Math.min(focusIdx + 1, items.length - 1);
      updateFocus(items);
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      focusIdx = Math.max(focusIdx - 1, 0);
      updateFocus(items);
    } else if(e.key === 'Enter' && focusIdx >= 0 && items[focusIdx]){
      e.preventDefault();
      items[focusIdx].click();
    }
  });

  function updateFocus(items){
    items.forEach(function(it, i){
      if(i === focusIdx){
        it.classList.add('focused');
        it.scrollIntoView({block: 'nearest'});
      } else {
        it.classList.remove('focused');
      }
    });
  }

  input.addEventListener('input', function(){
    render(this.value);
  });

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) close();
  });
})();

/* ─────────────────────────────────────────────────────────────────
   8. SCROLL-REVEAL ENGINE (IntersectionObserver)
   ───────────────────────────────────────────────────────────────── */
(function(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,[data-r]');
  if(!els.length) return;
  function forceReveal(el){
    el.classList.add('visible');
    /* Cancel GSAP WAAPI animations that override CSS/inline styles */
    if(el.getAnimations){
      el.getAnimations().forEach(function(a){try{a.cancel()}catch(e){}});
    }
    el.style.opacity='1';
    el.style.transform='translateY(0)';
  }

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        forceReveal(e.target);
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -40px 0px'});

  /* Immediately reveal above-fold elements */
  var wH = window.innerHeight || document.documentElement.clientHeight;
  els.forEach(function(el){
    var r = el.getBoundingClientRect();
    if(r.top < wH + 60){
      forceReveal(el);
    } else {
      obs.observe(el);
    }
  });

  /* Scroll listener as backup (IO can miss elements) */
  var ticking = false;
  function checkScroll(){
    var wH2 = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function(el){
      if(!el.style.opacity || el.style.opacity !== '1'){
        var r = el.getBoundingClientRect();
        if(r.top < wH2 + 80 && r.bottom > -80){
          forceReveal(el);
        }
      }
    });
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ ticking=true; requestAnimationFrame(function(){ checkScroll(); ticking=false; }); }
  }, {passive:true});
  document.addEventListener('scroll', function(){
    if(!ticking){ ticking=true; requestAnimationFrame(function(){ checkScroll(); ticking=false; }); }
  }, {passive:true});

  /* Repeated fallback to catch GSAP WAAPI created by later scripts */
  setTimeout(function(){ els.forEach(forceReveal); }, 300);
  setTimeout(function(){ els.forEach(forceReveal); }, 800);
  setTimeout(function(){ els.forEach(forceReveal); }, 1500);
  setTimeout(function(){ els.forEach(forceReveal); }, 3000);
})();

/* ─────────────────────────────────────────────────────────────────
   9. COOKIE CONSENT BANNER
   ───────────────────────────────────────────────────────────────── */
(function(){
  var banner = document.getElementById('cookieBanner');
  var accept = document.getElementById('cookieAccept');
  var decline = document.getElementById('cookieDecline');

  if(!banner) return;

  try {
    if(!localStorage.getItem('cookie-consent')){
      setTimeout(function(){
        banner.classList.add('visible');
      }, 1500);
    }
  } catch(e){
    setTimeout(function(){
      banner.classList.add('visible');
    }, 1500);
  }

  function dismiss(v){
    banner.classList.remove('visible');
    try {
      localStorage.setItem('cookie-consent', v);
    } catch(e){}
  }

  if(accept){
    accept.addEventListener('click', function(){
      dismiss('accepted');
    });
  }
  if(decline){
    decline.addEventListener('click', function(){
      dismiss('declined');
    });
  }
})();

/* ─────────────────────────────────────────────────────────────────
   10. TOAST NOTIFICATION SYSTEM
   ───────────────────────────────────────────────────────────────── */
window.showToast = function(msg, type, ms){
  type = type || 'success';
  ms = ms || 3500;
  var t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + msg;
  document.body.appendChild(t);
  setTimeout(function(){
    t.classList.add('hide');
    setTimeout(function(){
      t.remove();
    }, 400);
  }, ms);
};

/* ─────────────────────────────────────────────────────────────────
   11. INTERVAL CLEANUP — Prevent memory leaks on navigation
   ───────────────────────────────────────────────────────────────── */
(function(){
  var origSetInterval = window.setInterval;
  var activeIntervals = new Set();
  window.setInterval = function(fn, delay){
    var id = origSetInterval(fn, delay);
    activeIntervals.add(id);
    return id;
  };
  window.addEventListener('pagehide', function(){
    activeIntervals.forEach(function(id){
      clearInterval(id);
    });
    activeIntervals.clear();
    if(window.__p3dCleanup) window.__p3dCleanup();
  });
})();

/* ─────────────────────────────────────────────────────────────────
   12. MEGA-MENU — Handled by inline script in each page
   (removed duplicate handler to avoid event listener conflicts)
   ───────────────────────────────────────────────────────────────── */

/* End of shared.js */
