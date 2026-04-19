/* ═══ CROSS-SITE URLS — Single source of truth ═══ */
var ENERTCHAD={
  groupe:'/',
  amont:'/amont',
  midstream:'/intermediaire',
  aval:'/aval',
  petrochimie:'/#petrochimie',
  tech:'/technologies',
  energies:'/energies'
};

/* ═══ INTERVAL CLEANUP PROXY ═══ */
(function(){var ids=[];var _si=window.setInterval;window.setInterval=function(){var id=_si.apply(window,arguments);ids.push(id);return id};
window.addEventListener('pagehide',function(){ids.forEach(clearInterval);ids=[]})})();

/* ═══ HEADER SCROLL + SCROLL-TO-TOP + PROGRESS BAR + BREADCRUMBS ═══ */
(function(){
  var h=document.querySelector('.header');
  var st=document.getElementById('scrollTop');
  var sp=document.getElementById('scrollProgress');
  var bb=document.getElementById('breadcrumbBar');
  var bcCur=document.getElementById('bcCurrent');
  var bcDots=document.getElementById('bcDots');

  /* — Build tracked sections for breadcrumbs — */
  var sections=[];
  document.querySelectorAll('section[id]').forEach(function(s){
    var title=s.querySelector('.section-title,h1,h2');
    if(title){
      var label=title.textContent.trim().substring(0,30);
      sections.push({el:s,id:s.id,label:label});
      var dot=document.createElement('span');
      dot.className='bc-dot';
      dot.setAttribute('data-label',label);
      dot.setAttribute('title',label);
      dot.addEventListener('click',function(){s.scrollIntoView({behavior:'smooth',block:'start'})});
      bcDots.appendChild(dot);
    }
  });
  var dots=bcDots?bcDots.querySelectorAll('.bc-dot'):[];

  window.addEventListener('scroll',function(){
    var y=window.scrollY;
    h.classList.toggle('scrolled',y>30);
    st.classList.toggle('show',y>300);
    if(sp){var d=document.documentElement.scrollHeight-window.innerHeight;sp.style.width=(y/d)*100+'%'}
    if(sections.length>0){
      var cSec=null;
      var minDist=Infinity;
      sections.forEach(function(s){
        var r=s.el.getBoundingClientRect();
        var d=Math.abs(r.top);
        if(d<minDist){minDist=d;cSec=s}
      });
      if(cSec){
        bcCur.textContent=cSec.label;
        dots.forEach(function(d,i){d.classList.toggle('active',sections[i]===cSec)});
      }
    }
  });

  st.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
})();

/* ═══ HERO REVEAL + TITLE ANIMATION ═══ */
/* (GSAP disabled — [data-r] CSS reveal handles visibility via shared.js) */
(function(){
  if(typeof gsap==='undefined')return;
  var hero=document.querySelector('.hero');
  if(!hero)return;
  var tlHero=gsap.timeline({paused:true});
  tlHero.to(hero,{opacity:1,duration:0.8,ease:'power2.out'},0);
  tlHero.to(hero.querySelector('.hero-title'),{opacity:1,y:0,duration:1,ease:'back.out'},0.1);
  tlHero.to(hero.querySelector('.hero-text'),{opacity:1,y:0,duration:0.8,ease:'power2.out'},0.2);
  tlHero.to(hero.querySelector('.hero-button'),{opacity:1,y:0,duration:0.6,ease:'power2.out'},0.3);

  var observed=false;
  var observer=new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting&&!observed){observed=true;tlHero.play()}
  },{threshold:0.3});
  observer.observe(hero);
})();

/* ═══ SECTION REVEALS + COUNTERS + FADEIN ON SCROLL ═══ */
(function(){
  if(typeof gsap==='undefined')return;
  var sections=document.querySelectorAll('section');
  var tlArray=[];
  var counts={};

  sections.forEach(function(s){
    if(!s.getAttribute('id'))return;
    var tl=gsap.timeline({paused:true});
    var els=s.querySelectorAll('.reveal-item, .stat-item, .fade-in-item, .card');
    if(els.length>0){
      tl.to(els,{opacity:1,y:0,duration:0.6,stagger:0.1,ease:'power2.out'},0);
      var stat=s.querySelector('.counter-value');
      if(stat){
        var target=parseInt(stat.getAttribute('data-target'))||0;
        if(target>0){
          var ctr={val:0};
          tl.to(ctr,{val:target,duration:1.5,snap:{val:1},onUpdate:function(){stat.textContent=Math.floor(ctr.val).toLocaleString()}},0.2);
        }
      }
    }
    tlArray.push({el:s,tl:tl});
  });

  var sectionObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      var sObj=tlArray.find(function(x){return x.el===e.target});
      if(sObj&&e.isIntersecting){sObj.tl.play();sectionObs.unobserve(e.target)}
    })
  },{threshold:0.2});
  tlArray.forEach(function(s){sectionObs.observe(s.el)});
})();

/* ═══ ACCORDION + MODAL + TABS ═══ */
(function(){
  document.querySelectorAll('[data-accordion="true"]').forEach(function(acc){
    var header=acc.querySelector('.accordion-header');
    if(header){
      header.addEventListener('click',function(){
        var isOpen=acc.classList.contains('open');
        acc.closest('.accordion-group').querySelectorAll('[data-accordion="true"]').forEach(function(a){a.classList.remove('open')});
        if(!isOpen)acc.classList.add('open');
      });
    }
  });

  var modals=document.querySelectorAll('.modal');
  modals.forEach(function(m){
    var closer=m.querySelector('.modal-close');
    if(closer){
      closer.addEventListener('click',function(){m.classList.remove('open')});
    }
    m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('open')});
  });

  document.querySelectorAll('[data-modal]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var id=btn.getAttribute('data-modal');
      var modal=document.getElementById(id);
      if(modal)modal.classList.add('open');
    });
  });

  document.querySelectorAll('[data-tab-group]').forEach(function(group){
    var buttons=group.querySelectorAll('[data-tab]');
    var panels=group.querySelectorAll('[data-panel]');
    buttons.forEach(function(btn){
      btn.addEventListener('click',function(){
        var tabId=btn.getAttribute('data-tab');
        buttons.forEach(function(b){b.classList.remove('active')});
        panels.forEach(function(p){p.classList.remove('active')});
        btn.classList.add('active');
        var panel=group.querySelector('[data-panel="'+tabId+'"]');
        if(panel)panel.classList.add('active');
      });
    });
  });
})();

/* ═══ LANGUAGE SWITCHER ═══ */
(function(){
  var langSwitcher=document.getElementById('langSwitcher');
  if(!langSwitcher)return;

  var currentLang=localStorage.getItem('lang')||'fr';

  function setLang(lang){
    currentLang=lang;
    localStorage.setItem('lang',lang);
    document.documentElement.lang=lang;

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      if(lang==='en'){
        el.textContent=el.getAttribute('data-en')||el.textContent;
      }else{
        el.textContent=el.getAttribute('data-fr')||el.textContent;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      if(lang==='en'){
        el.placeholder=el.getAttribute('data-en-placeholder')||el.placeholder;
      }else{
        el.placeholder=el.getAttribute('data-fr-placeholder')||el.placeholder;
      }
    });
  }

  langSwitcher.addEventListener('click',function(){
    var newLang=currentLang==='fr'?'en':'fr';
    langSwitcher.textContent=newLang.toUpperCase();
    setLang(newLang);
  });

  setLang(currentLang);
  langSwitcher.textContent=currentLang.toUpperCase();
})();

/* ═══ FORM VALIDATION + SUBMISSION ═══ */
(function(){
  document.querySelectorAll('form').forEach(function(form){
    var submitBtn=form.querySelector('button[type="submit"]');
    if(submitBtn){
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var inputs=form.querySelectorAll('input[required], textarea[required]');
        var valid=true;
        inputs.forEach(function(inp){
          if(!inp.value.trim()){
            valid=false;
            inp.classList.add('error');
            inp.setAttribute('aria-invalid','true');
          }else{
            inp.classList.remove('error');
            inp.setAttribute('aria-invalid','false');
          }
        });
        if(valid){
          submitBtn.disabled=true;
          submitBtn.textContent='Envoi en cours...';
          setTimeout(function(){
            submitBtn.disabled=false;
            submitBtn.textContent='Envoyer';
            form.reset();
            var msg=document.createElement('div');
            msg.className='form-success';
            msg.textContent='Message envoyé avec succès!';
            form.parentNode.insertBefore(msg,form);
            setTimeout(function(){msg.remove()},3000);
          },1500);
        }
      });
    }
  });
})();

/* ═══ SMOOTH SCROLL TO ANCHOR ═══ */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click',function(e){
      var href=link.getAttribute('href');
      if(href==='#')return;
      var target=document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
})();

/* ═══ LAZY LOAD IMAGES ═══ */
(function(){
  if('IntersectionObserver' in window){
    var imgObs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var img=e.target;
          if(img.dataset.src){
            img.src=img.dataset.src;
            img.removeAttribute('data-src');
            imgObs.unobserve(img);
          }
        }
      })
    });
    document.querySelectorAll('img[data-src]').forEach(function(img){imgObs.observe(img)});
  }
})();

/* ═══ MOBILE MENU TOGGLE ═══ */
(function(){
  var hamburger=document.querySelector('.hamburger');
  var menu=document.querySelector('.nav-menu');
  if(hamburger&&menu){
    hamburger.addEventListener('click',function(){
      hamburger.classList.toggle('active');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        hamburger.classList.remove('active');
        menu.classList.remove('open');
      });
    });
  }
})();

/* ═══ SEARCH FUNCTIONALITY ═══ */
(function(){
  var searchBtn=document.querySelector('.search-btn');
  var searchBox=document.querySelector('.search-box');
  if(searchBtn&&searchBox){
    searchBtn.addEventListener('click',function(){searchBox.classList.toggle('open')});
    document.addEventListener('click',function(e){
      if(!searchBox.contains(e.target)&&!searchBtn.contains(e.target)){
        searchBox.classList.remove('open');
      }
    });
  }
})();

/* ═══ CUSTOM SELECT DROPDOWNS ═══ */
(function(){
  document.querySelectorAll('.custom-select').forEach(function(sel){
    var trigger=sel.querySelector('.select-trigger');
    var options=sel.querySelector('.select-options');
    if(trigger&&options){
      trigger.addEventListener('click',function(e){
        e.stopPropagation();
        sel.classList.toggle('open');
      });
      options.querySelectorAll('[data-value]').forEach(function(opt){
        opt.addEventListener('click',function(){
          trigger.textContent=opt.textContent;
          sel.setAttribute('data-selected',opt.getAttribute('data-value'));
          sel.classList.remove('open');
        });
      });
    }
  });
  document.addEventListener('click',function(){
    document.querySelectorAll('.custom-select.open').forEach(function(sel){sel.classList.remove('open')});
  });
})();

/* ═══ NOTIFICATION / TOAST SYSTEM ═══ */
(function(){
  window.showNotification=function(message,type,duration){
    type=type||'info';
    duration=duration||3000;
    var toast=document.createElement('div');
    toast.className='toast toast-'+type;
    toast.textContent=message;
    document.body.appendChild(toast);
    setTimeout(function(){toast.classList.add('show')},10);
    setTimeout(function(){
      toast.classList.remove('show');
      setTimeout(function(){toast.remove()},300);
    },duration);
  };
})();

/* ═══ DARK MODE TOGGLE ═══ */
(function(){
  var darkModeToggle=document.getElementById('darkModeToggle');
  if(!darkModeToggle)return;

  var isDark=localStorage.getItem('darkMode')==='true';
  if(isDark)document.documentElement.classList.add('dark-mode');

  darkModeToggle.addEventListener('click',function(){
    var isCurrentlyDark=document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('darkMode',isCurrentlyDark);
  });
})();

/* ═══ PARALLAX EFFECT ═══ */
(function(){
  var parallaxElements=document.querySelectorAll('[data-parallax]');
  if(parallaxElements.length===0)return;

  window.addEventListener('scroll',function(){
    parallaxElements.forEach(function(el){
      var speed=el.getAttribute('data-parallax')||0.5;
      var offset=window.scrollY*speed;
      el.style.transform='translateY('+offset+'px)';
    });
  });
})();

/* ═══ GSAP SCROLL TRIGGER ANIMATIONS ═══ */
(function(){
  if(typeof ScrollTrigger!=='undefined' && typeof gsap!=='undefined'){
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-scroll-trigger]').forEach(function(el){
      var trigger=el.getAttribute('data-scroll-trigger');
      var tl=gsap.timeline({
        scrollTrigger:{
          trigger:el,
          start:'top 75%',
          markers:false
        }
      });

      if(trigger==='fadeInUp'){
        tl.from(el,{opacity:0,y:30,duration:0.8});
      }else if(trigger==='scaleUp'){
        tl.from(el,{opacity:0,scale:0.8,duration:0.8});
      }
    });
  }
})();

/* ═══ CLICK OUTSIDE CLOSE ═══ */
(function(){
  document.addEventListener('click',function(e){
    document.querySelectorAll('[data-click-outside-close]').forEach(function(el){
      if(!el.contains(e.target)){
        el.classList.remove('open');
      }
    });
  });
})();

/* ═══ SCROLL TO TOP BUTTON ═══ */
(function(){
  var btn=document.getElementById('scrollTop');
  if(!btn)return;
  btn.addEventListener('click',function(){
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();

/* ═══ CHATBOT FUNCTIONALITY ═══ */
(function(){
  var chatbot=document.getElementById('chatbot');
  var chatHeader=document.querySelector('.chatbot-header');
  var chatMinimize=document.getElementById('chatMinimize');
  var chatClose=document.getElementById('chatClose');
  var chatMessages=document.getElementById('chatMessages');
  var chatInput=document.getElementById('chatbotInput');
  var chatSend=document.getElementById('chatbotSend');
  var chatQuick=document.querySelectorAll('.chatbot-quick');

  if(!chatbot)return;

  var isMinimized=false;
  chatMinimize.addEventListener('click',function(){
    isMinimized=!isMinimized;
    chatbot.classList.toggle('minimized',isMinimized);
  });

  chatClose.addEventListener('click',function(){
    chatbot.style.display='none';
  });

  function addMessage(text,sender){
    var msg=document.createElement('div');
    msg.className='chatbot-message '+sender;
    msg.innerHTML='<p>'+text+'</p>';
    chatMessages.appendChild(msg);
    chatMessages.scrollTop=chatMessages.scrollHeight;
  }

  function sendMessage(){
    var text=chatInput.value.trim();
    if(!text)return;
    addMessage(text,'user');
    chatInput.value='';
    setTimeout(function(){
      var responses={
        'bonjour':'Bonjour! Comment puis-je vous aider?',
        'contact':'Vous pouvez nous contacter via contact@enertchad.com',
        'investisseurs':'Consultez notre section investisseurs pour plus d\'informations.',
        'technologie':'Découvrez nos solutions technologiques innovantes!'
      };
      var resp=responses[text.toLowerCase()]||'Je suis désolé, je ne comprends pas. Pouvez-vous reformuler?';
      addMessage(resp,'bot');
    },500);
  }

  chatSend.addEventListener('click',sendMessage);
  chatInput.addEventListener('keypress',function(e){
    if(e.key==='Enter')sendMessage();
  });

  chatQuick.forEach(function(btn){
    btn.addEventListener('click',function(){
      var q=btn.getAttribute('data-q');
      chatInput.value=q;
      sendMessage();
    });
  });
})();

/* ═══ INTERSECTION OBSERVER FOR LAZY ANIMATIONS ═══ */
(function(){
  var revealElements=document.querySelectorAll('[data-reveal]');
  if(revealElements.length===0)return;

  var revealObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    })
  },{threshold:0.15});

  revealElements.forEach(function(el){revealObs.observe(el)});
})();

/* ═══ SCROLL REVEAL FOR [data-r] ELEMENTS ═══ */
(function(){
  var els=document.querySelectorAll('[data-r]');
  if(!els.length)return;

  function reveal(el){
    if(el.getAttribute('data-revealed'))return;
    el.setAttribute('data-revealed','1');
    el.classList.add('visible');
    /* Cancel WAAPI animations (GSAP creates paused ones that override everything) */
    if(el.getAnimations){
      el.getAnimations().forEach(function(a){try{a.cancel()}catch(e){}});
    }
    /* Force inline styles to guarantee visibility */
    el.style.opacity='1';
    el.style.transform='translateY(0)';
  }

  function revealVisible(){
    var wH=window.innerHeight||document.documentElement.clientHeight;
    els.forEach(function(el){
      if(!el.getAttribute('data-revealed')){
        var r=el.getBoundingClientRect();
        if(r.top<wH+80 && r.bottom>-80){
          reveal(el);
        }
      }
    });
  }

  /* Reveal on load */
  revealVisible();

  /* Reveal on scroll — listen on both window and document for compatibility */
  var ticking=false;
  function onScroll(){
    if(!ticking){
      ticking=true;
      requestAnimationFrame(function(){
        revealVisible();
        ticking=false;
      });
    }
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  document.addEventListener('scroll',onScroll,{passive:true});

  /* IntersectionObserver backup */
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          reveal(e.target);
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.01,rootMargin:'120px 0px 0px 0px'});
    els.forEach(function(el){
      if(!el.getAttribute('data-revealed')) obs.observe(el);
    });
  }

  /* Safety nets */
  setTimeout(revealVisible,500);
  setTimeout(revealVisible,1500);
  setTimeout(function(){
    /* Nuclear fallback: force everything visible after 3s */
    els.forEach(function(el){ reveal(el); });
  },3000);
})();

/* ═══ KEYBOARD SHORTCUTS ═══ */
(function(){
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey){
      if(e.key==='k'){
        e.preventDefault();
        var searchBox=document.querySelector('.search-box');
        if(searchBox)searchBox.classList.toggle('open');
      }
    }
    if(e.key==='Escape'){
      document.querySelectorAll('.modal.open').forEach(function(m){m.classList.remove('open')});
      document.querySelectorAll('.search-box.open').forEach(function(s){s.classList.remove('open')});
    }
  });
})();

/* ═══ PRINT STYLESHEET INJECTION ═══ */
(function(){
  if(!document.querySelector('style[data-print]')){
    var printCSS=document.createElement('style');
    printCSS.setAttribute('data-print','true');
    printCSS.textContent='@media print{.no-print{display:none!important}.print-only{display:block!important}}';
    document.head.appendChild(printCSS);
  }
})();

/* ═══ NAVIGATION AUTO HIGHLIGHT ═══ */
(function(){
  var currentPath=window.location.pathname;
  document.querySelectorAll('nav a[href]').forEach(function(link){
    var href=link.getAttribute('href');
    if(href===currentPath||href==='/'&&currentPath==='/'){
      link.classList.add('active');
      link.setAttribute('aria-current','page');
    }
  });
})();

/* ═══ BACK TO TOP SMOOTH SCROLL ═══ */
(function(){
  window.scrollToTop=function(){
    window.scrollTo({top:0,behavior:'smooth'});
  };
})();

/* ═══ DYNAMIC PAGE TITLE UPDATE ═══ */
(function(){
  var originalTitle=document.title;
  window.addEventListener('focus',function(){
    document.title=originalTitle;
  });
})();

/* ═══ COPY TO CLIPBOARD ═══ */
(function(){
  window.copyToClipboard=function(text){
    if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(function(){
        showNotification('Copié!','success',2000);
      });
    }else{
      var textarea=document.createElement('textarea');
      textarea.value=text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showNotification('Copié!','success',2000);
    }
  };
})();

/* ═══ EMAIL PROTECTION ═══ */
(function(){
  var email='contact@enertchad.com';
  document.querySelectorAll('[data-email]').forEach(function(el){
    if(el.tagName==='A'){
      el.href='mailto:'+email;
    }else{
      el.textContent=email;
    }
  });
})();

/* ═══ ROUTE NAVIGATION WITH SMOOTH SCROLL ═══ */
(function(){
  document.querySelectorAll('[data-route]').forEach(function(link){
    link.addEventListener('click',function(e){
      e.preventDefault();
      var href=link.getAttribute('data-route')||link.getAttribute('href');
      if(href.startsWith('/')){
        window.location.href=href;
      }else if(href.startsWith('#')){
        var target=document.querySelector(href);
        if(target){
          target.scrollIntoView({behavior:'smooth'});
        }else{
          setTimeout(function(){window.location.href=href},400);
        }
      }
    });
  });
})();

/* ═══ SW REGISTRATION ═══ */
if('serviceWorker' in navigator){
  window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})});
}
