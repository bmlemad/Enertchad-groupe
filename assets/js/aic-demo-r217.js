/* ============================================================
   R217 · AI Concierge chat demo widget
   Static simulation · 5 questions DD pré-compiled answers
   ============================================================ */
(function () {
  'use strict';

  const QA = {
    "Capital social et structure?": {
      answer: '<strong>EnerTchad SA</strong> · Société Anonyme OHADA · capital social initial <strong>10 000 000 FCFA</strong> · RCCM N\'DJ/RC/2026-A-0001. Cible post-Tour 2026 capital cible <strong>~1 Md FCFA</strong> après augmentation Series Seed/Pre-A 8-12M USD.',
      source: 'Source · Pacte d\'actionnaires OHADA · DR-08'
    },
    "Use of funds Tour 2026?": {
      answer: 'Phase 1 use of funds (8-12M USD) : <strong>60% Operations</strong> (25 ETP · 4 stations Mobile Station™ N\'Djamena · 3 contrats opérateurs · ISO certs) · <strong>25% R&D + IP</strong> (5 brevets EOR Local OAPI · marques™) · <strong>10% Capex</strong> (HQ Sabangali · equipment · véhicules) · <strong>5% Reserve</strong> (working capital · contingency).',
      source: 'Source · Pitch deck slide 9 · Modèle financier xlsx'
    },
    "Quels opérateurs cibles?": {
      answer: '<strong>6 opérateurs canon</strong> Atlas Tchad : <strong>Amont</strong> · CNPCIC (Bongor 30 kbpd) · Perenco (Doba 70 kbpd · Mangara/Badila) · SHT (NOC partenaire). <strong>Aval</strong> · TPC ex-Esso (Mobile Station™ partnership) · COTCO (Pipeline 1070 km · Pipeline 360°™) · SRN Djermaya (offtake carburants · Phase II 2,5 Mt/a). <strong>3 MoUs déjà signés</strong> : CNPCIC + Perenco + COTCO.',
      source: 'Source · Atlas O&G Tchad · /data/atlas.html · 6 opérateurs ★ tags'
    },
    "EOR Local OAPI · 5 brevets?": {
      answer: 'Programme <strong>EOR Local Tchadiennes</strong> · 5 ressources Sahel (Borkou Natron · Gomme Arabique · Cellulose · Neem-Karité · Spiruline) · injection ASP/polymères · cible <strong>+6-17% OOIP</strong> sur 30+ puits matures bassin Doba. Brevets OAPI dépôt Q3 2026 (5 dossiers en instruction · 17 États OAPI couverts).',
      source: 'Source · /amont/ · Programme EOR Local · DR-11'
    },
    "Pétrochimie · timeline?": {
      answer: 'Pétrochimie est un <strong>projet à moyen terme · Phase 2-3 (2028+)</strong> · pas un pôle current. Phase 2 active EnerFert™ gas-to-fertilizers (250 kt/a urée + DAP) post-FID SRN Phase II 2027. Phase 3 (2030+) · méthanol GTL + polymères basiques. Roadmap conditionnée par : (1) succès Phase 1 · (2) Series B 2028 · (3) FID structurants opérateurs.',
      source: 'Source · /petrochimie/ + /projets/ roadmap Phase 2-3'
    }
  };

  function init() {
    const demo = document.getElementById('aic-demo-r217');
    if (!demo) return;

    const body = demo.querySelector('.aic-demo-body');
    const suggestions = demo.querySelector('.aic-demo-suggestions');

    function addMsg(text, type, source) {
      const div = document.createElement('div');
      div.className = 'aic-msg aic-msg-' + type;
      div.innerHTML = text;
      if (source && type === 'bot') {
        const span = document.createElement('div');
        span.className = 'aic-source';
        span.textContent = source;
        div.appendChild(span);
      }
      body.appendChild(div);
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function askQuestion(q) {
      addMsg(q, 'user');
      // Simulate typing delay
      setTimeout(() => {
        const data = QA[q];
        if (data) {
          addMsg(data.answer, 'bot', data.source);
        } else {
          addMsg('Question hors-perimètre dataroom indexé · contactez DG dg@enertchad.td pour réponse personnalisée.', 'bot', 'Fallback safe');
        }
      }, 600);
    }

    // Wire suggestion clicks
    suggestions.querySelectorAll('.aic-suggestion').forEach(btn => {
      btn.addEventListener('click', () => askQuestion(btn.textContent));
    });

    // Initial bot greeting
    setTimeout(() => {
      addMsg('Bonjour · je suis l\'<strong>AI Concierge EnerTchad SA</strong> beta · 24/7 multilingue · réponses sourcées dataroom DD. Choisissez une question ci-dessous ou tapez la vôtre.', 'bot');
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
