/* ═══════════════════════════════════════════════════════════════
   EnerTchad Groupe — Enhancement Layer v2
   Features: Ticker, Scroll Progress, Breadcrumbs, Ctrl+K Search,
   Dot Nav, Theme Toggle, Counter Anim, Hero Canvas, 3D Cards
   ═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── Ecosystem URLs ── */
var ENERTCHAD={
  groupe:'https://enertchad-groupe.vercel.app',
  amont:'https://enertchad-amont-vercel-app.vercel.app',
  midstream:'https://enertchad-midstream-vercel-app.vercel.app',
  aval:'https://enertchad-aval-vercel-app.vercel.app',
  tech:'https://enertchad-technologies.vercel.app',
  energies:'https://enertchad-energies.vercel.app',
  petrochimie:'https://enertchad-petrochimie.vercel.app'
};

/* ═══ SCROLL PROGRESS ═══ */
(function(){
  var bar=document.getElementById('scrollProg');
  if(!bar) return;
  window.addEventListener('scroll',function(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    if(h>0) bar.style.width=(window.scrollY/h*100)+'%';
  },{passive:true});
})();

/* ═══ BREADCRUMB BAR ═══ */
(function(){
  var bb=document.getElementById('breadcrumbBar');
  var bcCur=document.getElementById('bcCurrent');
  var bcDots=document.getElementById('bcDots');
  if(!bb||!bcCur||!bcDots) return;
  var sections=[];
  document.querySelectorAll('section[id]').forEach(function(s){
    var title=s.querySelector('h2,.section-title,h1');
    if(title){
      var label=title.textContent.trim().substring(0,30);
      sections.push({el:s,id:s.id,label:label});
      var dot=document.createElement('span');
      dot.className='bc-dot';
      dot.setAttribute('data-label',label);
      dot.addEventListener('click',function(){s.scrollIntoView({behavior:'smooth',block:'start'})});
      bcDots.appendChild(dot);
    }
  });
  var dots=bcDots.querySelectorAll('.bc-dot');
  window.addEventListener('scroll',function(){
    var y=window.scrollY;
    if(y>400) bb.classList.add('visible'); else bb.classList.remove('visible');
    var active=-1;
    for(var i=sections.length-1;i>=0;i--){
      if(sections[i].el.getBoundingClientRect().top<200){active=i;break;}
    }
    if(active>=0) bcCur.textContent=sections[active].label;
    else bcCur.textContent='—';
    dots.forEach(function(d,i){d.classList.toggle('active',i===active)});
  },{passive:true});
})();

/* ═══ DOT NAV ═══ */
(function(){
  var dn=document.getElementById('dotNav');
  if(!dn) return;
  var links=dn.querySelectorAll('a');
  var ids=[];
  links.forEach(function(a){ids.push(a.getAttribute('href').replace('#',''))});
  window.addEventListener('scroll',function(){
    var sp=window.scrollY+window.innerHeight/3;
    ids.forEach(function(id,i){
      var s=document.getElementById(id);
      if(s&&sp>=s.offsetTop&&sp<s.offsetTop+s.offsetHeight){
        links.forEach(function(d){d.classList.remove('active')});
        if(links[i]) links[i].classList.add('active');
      }
    });
  },{passive:true});
})();

/* ═══ THEME TOGGLE ═══ */
(function(){
  document.querySelectorAll('.theme-toggle').forEach(function(b){
    b.addEventListener('click',function(){
      document.body.classList.toggle('light-theme');
      try{localStorage.setItem('enertchad-theme',document.body.classList.contains('light-theme')?'light':'dark');}catch(e){}
    });
  });
  try{if(localStorage.getItem('enertchad-theme')==='light')document.body.classList.add('light-theme');}catch(e){}
})();

/* ═══ COUNTER ANIMATION ═══ */
(function(){
  function animC(){
    document.querySelectorAll('[data-count]').forEach(function(el){
      if(el.dataset.animated) return;
      var r=el.getBoundingClientRect();
      if(r.top>window.innerHeight||r.bottom<0) return;
      el.dataset.animated='1';
      var t=parseFloat(el.dataset.count);
      var sf=el.dataset.suffix||'';
      var pf=el.dataset.prefix||'';
      var dur=1500;
      var st=performance.now();
      function step(n){
        var p=Math.min((n-st)/dur,1);
        var e=1-Math.pow(1-p,3);
        var c=Math.round(t*e);
        el.textContent=pf+c.toLocaleString('fr-FR')+sf;
        if(p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  window.addEventListener('scroll',animC,{passive:true});
  animC();
})();

/* ═══ HERO CANVAS PARTICLES ═══ */
(function(){
  var cn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  if(cn&&(cn.effectiveType==='2g'||cn.effectiveType==='slow-2g'||cn.saveData)) return;
  var c=document.getElementById('heroCanvas')||document.getElementById('heroParticles');
  if(!c) return;
  var ctx=c.getContext('2d'),ps=[];
  function rz(){c.width=c.offsetWidth;c.height=c.offsetHeight;}
  rz();window.addEventListener('resize',rz);
  var mouse={x:null,y:null};
  c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
  var cnt=Math.min(60,Math.floor(c.width*c.height/16000));
  for(var i=0;i<cnt;i++) ps.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-0.5)*0.35,vy:(Math.random()-0.5)*0.35,r:Math.random()*2+0.8,a:Math.random()*0.35+0.12});
  var raf=null;
  function draw(){
    raf=requestAnimationFrame(draw);
    ctx.clearRect(0,0,c.width,c.height);
    ps.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;
      if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(217,168,79,'+p.a+')';ctx.fill();
    });
    for(var i=0;i<ps.length;i++){
      for(var j=i+1;j<ps.length;j++){
        var dx=ps[i].x-ps[j].x,dy=ps[i].y-ps[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ctx.beginPath();ctx.moveTo(ps[i].x,ps[i].y);ctx.lineTo(ps[j].x,ps[j].y);ctx.strokeStyle='rgba(217,168,79,'+(0.1*(1-d/110))+')';ctx.lineWidth=0.5;ctx.stroke();}
      }
      if(mouse.x!==null){
        var mx=ps[i].x-mouse.x,my=ps[i].y-mouse.y,md=Math.sqrt(mx*mx+my*my);
        if(md<140){ctx.beginPath();ctx.moveTo(ps[i].x,ps[i].y);ctx.lineTo(mouse.x,mouse.y);ctx.strokeStyle='rgba(232,195,106,'+(0.18*(1-md/140))+')';ctx.lineWidth=0.7;ctx.stroke();}
      }
    }
  }
  draw();
  window.addEventListener('pagehide',function(){if(raf){cancelAnimationFrame(raf);raf=null;}});
})();

/* ═══ 3D CARD TILT ═══ */
(function(){
  document.querySelectorAll('.card-3d').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width;
      var y=(e.clientY-r.top)/r.height;
      var rotX=(y-0.5)*8;
      var rotY=(x-0.5)*-8;
      card.style.transform='perspective(800px) rotateX('+rotX+'deg) rotateY('+rotY+'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='';
    });
  });
})();

/* ═══ GLOBAL SEARCH (Ctrl+K) ═══ */
(function(){
  var overlay=document.getElementById('searchOverlay');
  var input=document.getElementById('searchInput');
  var results=document.getElementById('searchResults');
  if(!overlay||!input||!results) return;

  var index=[];
  /* Index page sections */
  document.querySelectorAll('section[id]').forEach(function(s){
    var t=s.querySelector('h2,.section-title,h1');
    var d=s.querySelector('p,.section-sub');
    if(t) index.push({type:'section',icon:'fas fa-bookmark',title:t.textContent.trim(),desc:d?d.textContent.trim().substring(0,80):'',url:'#'+s.id,group:'Cette page'});
  });

  /* Index filiales */
  [{title:'EnerTchad Groupe',desc:'Hub corporate — Gouvernance, ESG',icon:'fas fa-building',url:ENERTCHAD.groupe,color:'var(--gold)'},
   {title:'EnerTchad Amont',desc:'E&P · Doba, Bongor, Doseo, Salamat',icon:'fas fa-oil-well',url:ENERTCHAD.amont,color:'#2E86DE'},
   {title:'EnerTchad Intermédiaire',desc:'Pipeline 1 070 km · Transport',icon:'fas fa-pipe-section',url:ENERTCHAD.midstream,color:'#0EA5E9'},
   {title:'EnerTchad Aval',desc:'24 stations · Distribution pétrolière',icon:'fas fa-gas-pump',url:ENERTCHAD.aval,color:'#D97706'},
   {title:'EnerTchad Technologies',desc:'Digital Twin · SCADA · IA prédictive',icon:'fas fa-microchip',url:ENERTCHAD.tech,color:'#8B5CF6'},
   {title:'EnerTchad Énergies',desc:'Solaire · Micro-grids · 125 MW',icon:'fas fa-bolt',url:ENERTCHAD.energies,color:'#10B981'},
   {title:'EnerTchad Pétrochimie',desc:'Polymères · Engrais · Chimie de base',icon:'fas fa-flask-vial',url:ENERTCHAD.petrochimie,color:'#E11D48'}
  ].forEach(function(s){
    index.push({type:'filiale',icon:s.icon,title:s.title,desc:s.desc,url:s.url,group:'Filiales',color:s.color});
  });

  /* Index internal pages */
  [{title:'Amont — E&P',desc:'Exploration & Production',icon:'fas fa-oil-well',url:'operations/amont.html',color:'#2E86DE'},
   {title:'Intermédiaire — Transport',desc:'Pipeline & Logistique',icon:'fas fa-pipe-section',url:'operations/intermediaire.html',color:'#0EA5E9'},
   {title:'Aval — Distribution',desc:'Stations & Raffinage',icon:'fas fa-gas-pump',url:'operations/aval.html',color:'#D97706'},
   {title:'Technologies',desc:'Services digitaux',icon:'fas fa-microchip',url:'services/technologies.html',color:'#8B5CF6'},
   {title:'Talents & Carrières',desc:'Rejoignez EnerTchad',icon:'fas fa-users',url:'groupe/talents.html',color:'#10B981'},
   {title:'Contact',desc:'Nous contacter',icon:'fas fa-envelope',url:'contact.html',color:'var(--gold)'}
  ].forEach(function(s){
    index.push({type:'page',icon:s.icon,title:s.title,desc:s.desc,url:s.url,group:'Pages',color:s.color});
  });

  var focusIdx=-1;

  function open(){overlay.classList.add('active');input.value='';input.focus();render('');focusIdx=-1;document.body.style.overflow='hidden';}
  function close(){overlay.classList.remove('active');input.blur();document.body.style.overflow='';}

  function render(q){
    results.innerHTML='';focusIdx=-1;
    var q2=q.toLowerCase().trim();
    var filtered=q2?index.filter(function(it){return it.title.toLowerCase().indexOf(q2)>-1||it.desc.toLowerCase().indexOf(q2)>-1}):index;
    var groups={};
    filtered.forEach(function(it){if(!groups[it.group])groups[it.group]=[];groups[it.group].push(it)});
    Object.keys(groups).forEach(function(g){
      var gh=document.createElement('div');gh.className='sr-group-title';gh.textContent=g;results.appendChild(gh);
      groups[g].forEach(function(it){
        var a=document.createElement('a');a.className='sr-item';a.href=it.url;
        if(it.type==='filiale'){a.target='_blank';a.rel='noopener';}
        a.innerHTML='<div class="sr-item-icon" style="color:'+(it.color||'var(--gold)')+'"><i class="'+it.icon+'"></i></div><div class="sr-item-text"><div class="sr-item-title">'+it.title+'</div><div class="sr-item-desc">'+it.desc+'</div></div><i class="fas fa-arrow-right sr-item-arrow"></i>';
        a.addEventListener('click',function(){close()});
        results.appendChild(a);
      });
    });
  }

  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();if(overlay.classList.contains('active'))close();else open();return;}
    if(!overlay.classList.contains('active'))return;
    if(e.key==='Escape'){close();return;}
    var items=results.querySelectorAll('.sr-item');
    if(e.key==='ArrowDown'){e.preventDefault();focusIdx=Math.min(focusIdx+1,items.length-1);upd(items);}
    else if(e.key==='ArrowUp'){e.preventDefault();focusIdx=Math.max(focusIdx-1,0);upd(items);}
    else if(e.key==='Enter'&&focusIdx>=0&&items[focusIdx]){e.preventDefault();items[focusIdx].click();}
  });

  function upd(items){items.forEach(function(it,i){if(i===focusIdx){it.classList.add('focused');it.scrollIntoView({block:'nearest'})}else it.classList.remove('focused')})}

  input.addEventListener('input',function(){render(this.value)});
  overlay.addEventListener('click',function(e){if(e.target===overlay)close()});

  /* Add search button to nav */
  var nav=document.querySelector('.header .nav-actions, .header nav, .header .ctn');
  if(nav){
    var btn=document.createElement('button');
    btn.className='search-trigger';
    btn.setAttribute('aria-label','Recherche (Ctrl+K)');
    btn.innerHTML='<i class="fas fa-search"></i>';
    btn.addEventListener('click',open);
    /* Insert before the last child (CTA) */
    var cta=nav.querySelector('.nav-cta, .btn-primary, [href*="contact"]');
    if(cta&&cta.parentNode===nav) nav.insertBefore(btn,cta);
  }
})();

/* ═══ TICKER ANIMATION ═══ */
(function(){
  var track=document.querySelector('.ticker-track');
  if(!track) return;
  track.addEventListener('mouseenter',function(){track.style.animationPlayState='paused'});
  track.addEventListener('mouseleave',function(){track.style.animationPlayState='running'});
})();

/* ═══ PREMIUM SCROLL REVEAL ═══ */
(function(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var els=document.querySelectorAll('.reveal,.reveal-left,.reveal-scale');
  if(!els.length) return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:0.15,rootMargin:'0px 0px -60px 0px'});
  els.forEach(function(el){obs.observe(el)});
})();

/* ═══ PREMIUM BUTTON SHINE ═══ */
(function(){
  document.querySelectorAll('.btn-premium').forEach(function(btn){
    btn.addEventListener('mouseenter',function(){
      var shine=btn.querySelector('.btn-shine');
      if(!shine){
        shine=document.createElement('span');
        shine.className='btn-shine';
        btn.appendChild(shine);
      }
      shine.style.animation='none';
      void shine.offsetWidth;
      shine.style.animation='btnShine 0.8s ease-out';
    });
  });
})();

})();
