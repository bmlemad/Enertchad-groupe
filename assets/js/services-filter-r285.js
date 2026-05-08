/* ============================================================
 R285 · /services/ filter · Alpine.js minimal pattern
 Wave R285 · 2026-05-05 · DG mandate interactivité
 Self-contained · no Alpine dependency · vanilla JS
 ============================================================ */

(function(){
 'use strict';

 var page = document.body.getAttribute('data-page');
 if (page !== 'services') return;

 // Build filter bar at top of #by-outcome section
 var section = document.getElementById('by-outcome');
 if (!section) return;
 var container = section.querySelector('.container');
 if (!container) return;

 // Don't add twice
 if (document.querySelector('.r285-filter-bar')) return;

 var bar = document.createElement('div');
 bar.className = 'r285-filter-bar reveal';
 bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 24px;padding:14px 18px;background:rgba(217,168,79,0.08);border:1px solid rgba(217,168,79,0.20);border-radius:8px;align-items:center';
 bar.innerHTML = '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--gold);margin-right:8px">Filtrer ·</span>' +
                 '<button data-filter="all" class="r285-filter-btn r285-active" type="button">Tous (5)</button>' +
                 '<button data-filter="amont" class="r285-filter-btn" type="button">⚐ Amont (2)</button>' +
                 '<button data-filter="intermediaire" class="r285-filter-btn" type="button">⚐ Intermédiaire (1)</button>' +
                 '<button data-filter="aval" class="r285-filter-btn" type="button">⚐ Aval (1)</button>' +
                 '<button data-filter="petrochimie" class="r285-filter-btn" type="button">⚐ Innovation (1)</button>' +
                 '<button data-filter="tier-1" class="r285-filter-btn" type="button">TIER 1 only</button>';

 // Inject CSS
 var style = document.createElement('style');
 style.textContent =
  '.r285-filter-btn{font-family:"Space Grotesk",sans-serif;font-size:0.74rem;font-weight:600;letter-spacing:0.06em;padding:6px 12px;border-radius:4px;border:1px solid rgba(217,168,79,0.30);background:transparent;color:var(--text-primary,var(--navy));cursor:pointer;transition:all 200ms ease}' +
  '.r285-filter-btn:hover{background:rgba(217,168,79,0.18);border-color:var(--gold)}' +
  '.r285-filter-btn.r285-active{background:var(--gold);color:var(--navy);border-color:var(--gold)}' +
  '.r285-hidden{display:none !important}' +
  '#by-outcome article.card-pole{transition:opacity 200ms ease,transform 200ms ease}';
 document.head.appendChild(style);

 // Insert filter bar after the lede paragraph
 var leadP = container.querySelector('p.lead');
 if (leadP){
  leadP.parentNode.insertBefore(bar, leadP.nextSibling);
 }

 // Filter logic
 var cards = section.querySelectorAll('article.card-pole');
 var btns = bar.querySelectorAll('.r285-filter-btn');

 function applyFilter(filter){
  cards.forEach(function(card){
   var pole = card.getAttribute('data-pole') || '';
   var tier = card.getAttribute('data-tier') || '';
   var match = (filter === 'all') ||
               (filter === pole) ||
               (filter === 'tier-1' && tier === '1');
   card.classList.toggle('r285-hidden', !match);
  });

  // Update active state
  btns.forEach(function(b){ b.classList.toggle('r285-active', b.getAttribute('data-filter') === filter); });
 }

 btns.forEach(function(btn){
  btn.addEventListener('click', function(){
   applyFilter(btn.getAttribute('data-filter'));
  });
 });
})();
