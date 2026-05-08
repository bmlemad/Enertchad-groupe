#!/usr/bin/env python3
"""R154 · Inject ULTRA WIDE Mega Menu cross-pages
- Add data-mm attribute on .hu-nav-link
- Inject 6 mega menu panels after <header>
- Inject backdrop
- Add CSS link + JS script
- Idempotent"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_archive", "_preview_build", "_scripts", "_workers", "v3"}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/megamenu-r154.css?v=r154" />'
JS_TAG = '<script defer src="/assets/js/megamenu-r154.js?v=r154"></script>'

# ============ FR Mega Menu panels ============
FR_PANELS = '''
<!-- R154 · Mega Menu panels FR -->
<aside id="mm-mission" class="mm-r154" role="region" aria-label="Mission">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">Identité</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/a-propos/">À propos<small>Hub identité corporate</small></a></li>
        <li><a class="mm-link" href="/pourquoi/manifeste.html">Manifeste DG<small>Vision fondatrice</small></a></li>
        <li><a class="mm-link" href="/pourquoi/manifeste-immersif/">→ Manifeste immersif<small>4 chapitres scroll-driven</small></a></li>
        <li><a class="mm-link" href="/pourquoi/positionnement.html">Positionnement<small>vs Aramco · Shell · Total</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Trajectoire</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/pourquoi/trajectoire.html">2026-2030<small>Roadmap publique 3 phases</small></a></li>
        <li><a class="mm-link" href="/pourquoi/equipe.html">Équipe &amp; leadership<small>DG · PCA · 25 fiches Phase 1</small></a></li>
        <li><a class="mm-link" href="/mythos/">Mythos<small>Récit fondateur cinématique</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Contenu local</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/talents/">Talents · LCD diaspora<small>EnerAcademy · 75% Chadiens P2</small></a></li>
        <li><a class="mm-link" href="/talents/diaspora-map/">→ Diaspora Map<small>500+ ingénieurs · 15 pays</small></a></li>
        <li><a class="mm-link" href="/sourcing-africain/">Sourcing intra-africain<small>Dangote · SORAZ · Sonangol</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">Mission · canon</p>
        <p class="mm-featured-h">Souveraineté <em>technique.</em></p>
        <p class="mm-featured-desc">Première société 100% tchadienne OFS · 17 ans ExxonMobil · cadre OHADA · ambition CEMAC + ECOWAS.</p>
      </div>
      <a class="mm-featured-cta" href="/pourquoi/manifeste.html">Lire le manifeste DG <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-activites" class="mm-r154" role="region" aria-label="Activités">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">4 pôles canon</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/amont/">01 Amont<small>S01-S18 · EOR Local · 5 brevets OAPI</small></a></li>
        <li><a class="mm-link" href="/intermediaire/">02 Intermédiaire<small>Pipeline Integrity 360°</small></a></li>
        <li><a class="mm-link" href="/aval/">03 Aval<small>D01-D08 · C01-C04 · Mobile Station&trade;</small></a></li>
        <li><a class="mm-link" href="/petrochimie/">04 Pétrochimie<small>P01-P08 · EnerFert&trade;</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">3 axes transversaux</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/technologies/">Technologies<small>T01-T12 · digital twin · IA</small></a></li>
        <li><a class="mm-link" href="/energies/">Énergies<small>E01-E08 · IRVE · solaire</small></a></li>
        <li><a class="mm-link" href="/hse/">HSE Sécurité Intégrée<small>16 services H/W/O · OIMS</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Solutions</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/solutions/">Catalog 70+ services<small>S/D/C/P/T/E/H/W/O codes</small></a></li>
        <li><a class="mm-link" href="/solutions/configurateur.html">Configurateur<small>30 sec · sur-mesure</small></a></li>
        <li><a class="mm-link" href="/solutions/calculateur.html">Calculateur ROI<small>Économie services local</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">Demo live · Idée 5 Doc 123</p>
        <p class="mm-featured-h">Pipeline <em>360°.</em></p>
        <p class="mm-featured-desc">Digital twin Doba-Kribi 1 070 km · 247 capteurs SCADA · IA leak detection en 8s vs 52min.</p>
      </div>
      <a class="mm-featured-cta" href="/intermediaire/pipeline-360-demo/">Voir la simulation <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-transition" class="mm-r154" role="region" aria-label="Transition">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">Énergies renouvelables</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/energies/">Hub énergies<small>E01-E08 · solaire · éolien · biomasse</small></a></li>
        <li><a class="mm-link" href="/energies/#solaire">Solaire 32 MW Djermaya<small>Partenariat utility-scale</small></a></li>
        <li><a class="mm-link" href="/energies/#irve">IRVE 50 stations 2030<small>1<sup>er</sup> réseau CEMAC · 50 kW</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Stations Mobile Station&trade;</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/stations/">Stations live map<small>Disponibilités RT</small></a></li>
        <li><a class="mm-link" href="/stations/#r141-services-canon">3 cercles services<small>18 services A·B·C</small></a></li>
        <li><a class="mm-link" href="/stations/#r142-next-gen">Next-gen ultra-premium<small>8 piliers · benchmark Aramco</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Net Zero CEMAC 2050</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/sustainability/">Sustainability hub<small>5 phases · 3 piliers ESG</small></a></li>
        <li><a class="mm-link" href="/sustainability/#ghg">GHG inventory<small>Scope 1/2/3 · GRI · TCFD</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">1<sup>er</sup> réseau CEMAC</p>
        <p class="mm-featured-h">50 stations <em>IRVE.</em></p>
        <p class="mm-featured-desc">Premier réseau de bornes de charge rapide CEMAC 2030 · 50 kW · CCS2 + CHAdeMO. Made in Chad.</p>
      </div>
      <a class="mm-featured-cta" href="/stations/">Découvrir les stations <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-technologies" class="mm-r154" role="region" aria-label="Technologies">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">Innovation core</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/technologies/">Technologies hub<small>T01-T12 · digital twin · IA · IoT · OT</small></a></li>
        <li><a class="mm-link" href="/marques/">6 marques&trade; portfolio<small>OAPI brevets pending</small></a></li>
        <li><a class="mm-link" href="/ai-concierge/">AI Concierge<small>Premier OFS au monde · Claude API</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">EOR Local Sahel</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/amont/#eor">5 brevets OAPI<small>Polymères Sahel · +6-17% OOIP Doba</small></a></li>
        <li><a class="mm-link" href="/marques/#water-to-value">Water-to-Value&trade;<small>Recyclage 95% lavage</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">OT &amp; cyber</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/intermediaire/pipeline-360-demo/">Pipeline 360° demo<small>247 capteurs SCADA · IA leak</small></a></li>
        <li><a class="mm-link" href="/data/oleoduc-3d.html">Pipeline 3D<small>Doba-Kribi 1 070 km</small></a></li>
        <li><a class="mm-link" href="/hse/">Cybersécurité OT<small>IEC 62443 · Sécurité Intégrée</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">Premier OFS au monde</p>
        <p class="mm-featured-h">AI <em>Concierge.</em></p>
        <p class="mm-featured-desc">Assistant IA dataroom 24/7 · Claude API · 5 langues · citations sources · DD pre-screen automatique.</p>
      </div>
      <a class="mm-featured-cta" href="/ai-concierge/">Tester l&rsquo;AI Concierge <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-engagements" class="mm-r154" role="region" aria-label="Engagements">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">HSE Sécurité Intégrée</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/hse/">Hub HSE<small>16 services H/W/O · OIMS-grade</small></a></li>
        <li><a class="mm-link" href="/hse/#process">Process Safety<small>PSM · Pipeline Integrity</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Formation EnerAcademy</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/talents/">EnerAcademy&trade;<small>50 ingénieurs/an · IFP · Polytech Bongor</small></a></li>
        <li><a class="mm-link" href="/talents/diaspora-map/">→ Diaspora Map<small>500+ ingénieurs talents Chad</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">RSE &amp; ESG</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/engagement/transparence.html">Transparence ITIE<small>8 engagements OHADA · RGPD</small></a></li>
        <li><a class="mm-link" href="/sustainability/">Sustainability<small>Net Zero CEMAC 2050 · 5 phases</small></a></li>
        <li><a class="mm-link" href="/glossaire.html">Glossaire référentiels<small>OFS · OIMS · APIs · ISO</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">Trajectoire validée DG/PCA</p>
        <p class="mm-featured-h">Net Zero <em>2050.</em></p>
        <p class="mm-featured-desc">5 phases · 3 piliers ESG · GHG Scope 1/2/3 · aligné GRI · TCFD · UN Global Compact · ITIE Chad.</p>
      </div>
      <a class="mm-featured-cta" href="/sustainability/">Voir la trajectoire <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-investisseurs" class="mm-r154" role="region" aria-label="Investisseurs">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">Tour 2026 · 8-12M USD</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/engagement/investisseurs.html">Pourquoi investir<small>Structure deal · 47% closed · J-150</small></a></li>
        <li><a class="mm-link" href="/investisseurs/">Hub investisseurs<small>Live tracker · narrative complète</small></a></li>
        <li><a class="mm-link" href="/tour-live/">Tour Live tracker<small>Premier OFS au monde · transparence radicale</small></a></li>
        <li><a class="mm-link" href="/dg-office-hours/">DG Office Hours<small>30 min direct CEO · DFI uniquement</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Documents</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/dataroom/">Dataroom · NDA flow<small>12 catégories · DocuSign 1-clic</small></a></li>
        <li><a class="mm-link" href="/data/atlas.html">Atlas marché<small>Cadastre 6 opérateurs · 1,8 Md USD TAM</small></a></li>
        <li><a class="mm-link" href="/data/dashboard.html">Dashboard public<small>KPIs marché Tchad live</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Clients · 6 opérateurs</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/operateurs/">6 opérateurs canon<small>CNPCIC · Perenco · SHT · COTCO · SRN · TPC</small></a></li>
        <li><a class="mm-link" href="/marques/">6 marques&trade; portfolio<small>OAPI patents pending</small></a></li>
        <li><a class="mm-link" href="/talents/">Carrières<small>LCD diaspora · 25 ETP P1</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">J-<span data-jn>150</span> closing 30 sept 2026</p>
        <p class="mm-featured-h">Tour <em>2026.</em></p>
        <p class="mm-featured-desc"><strong style="color:#F6F1E6">8-12 M USD · 47% closed</strong> · 12 NDAs · 3 MoUs opérateurs · 50 investisseurs DFI/VC/Family Offices ciblés.</p>
      </div>
      <a class="mm-featured-cta" href="/engagement/investisseurs.html">Accéder au Tour 2026 <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<div class="mm-backdrop" aria-hidden="true"></div>
'''

# ============ EN Mega Menu panels ============
EN_PANELS = '''
<!-- R154 · Mega Menu panels EN -->
<aside id="mm-mission" class="mm-r154" role="region" aria-label="Mission">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">Identity</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/about/">About<small>Corporate identity hub</small></a></li>
        <li><a class="mm-link" href="/en/pourquoi/manifeste.html">CEO Manifesto<small>Founder vision</small></a></li>
        <li><a class="mm-link" href="/en/mythos/">Mythos<small>Founder narrative</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Local content</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/talents/">Talents · LCD diaspora<small>EnerAcademy · 75% Chadians P2</small></a></li>
        <li><a class="mm-link" href="/en/sourcing-africain/">Africa sourcing<small>Dangote · SORAZ · Sonangol</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Why us</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/sustainability/">Sustainability<small>Net Zero CEMAC 2050</small></a></li>
        <li><a class="mm-link" href="/en/marques/">6 brands&trade; OAPI<small>Patents pending</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">Mission · canon</p>
        <p class="mm-featured-h">Technical <em>sovereignty.</em></p>
        <p class="mm-featured-desc">First 100% Chadian OFS company · 17 years ExxonMobil · OHADA framework · CEMAC + ECOWAS ambition.</p>
      </div>
      <a class="mm-featured-cta" href="/en/pourquoi/manifeste.html">Read CEO manifesto <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-activities" class="mm-r154" role="region" aria-label="Activities">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">4 canon pillars</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/amont/">01 Upstream<small>S01-S18 · EOR · 5 OAPI patents</small></a></li>
        <li><a class="mm-link" href="/en/intermediaire/">02 Midstream<small>Pipeline Integrity 360°</small></a></li>
        <li><a class="mm-link" href="/en/aval/">03 Downstream<small>D01-D08 · Mobile Station&trade;</small></a></li>
        <li><a class="mm-link" href="/en/petrochimie/">04 Petrochemicals<small>P01-P08 · EnerFert&trade;</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">3 transverse axes</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/technologies/">Technologies<small>T01-T12 · AI · IoT · OT</small></a></li>
        <li><a class="mm-link" href="/en/energies/">Energies<small>E01-E08 · solar · EV charging</small></a></li>
        <li><a class="mm-link" href="/en/hse/">HSE Integrated Safety<small>16 services H/W/O · OIMS</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Solutions</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/solutions/">Catalog 70+ services<small>S/D/C/P/T/E/H/W/O codes</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">Live demo</p>
        <p class="mm-featured-h">Pipeline <em>360°.</em></p>
        <p class="mm-featured-desc">Digital twin Doba-Kribi 1,070 km · 247 SCADA sensors · AI leak detection in 8s vs 52min.</p>
      </div>
      <a class="mm-featured-cta" href="/en/intermediaire/">View pipeline <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-transition" class="mm-r154" role="region" aria-label="Transition">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">Renewables</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/energies/">Energies hub<small>E01-E08 · solar · wind · biomass</small></a></li>
        <li><a class="mm-link" href="/en/stations/">Stations live map<small>Real-time availability</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Net Zero 2050</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/sustainability/">Sustainability hub<small>5 phases · 3 ESG pillars</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Mobile Station&trade;</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/stations/">3 service circles<small>A·B·C · 18 services</small></a></li>
        <li><a class="mm-link" href="/en/marques/">6 brands&trade; OAPI<small>Mobile Station · NRJ+ · EnerFert</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">1<sup>st</sup> CEMAC network</p>
        <p class="mm-featured-h">50 EV <em>stations.</em></p>
        <p class="mm-featured-desc">First CEMAC fast-charge network 2030 · 50 kW · CCS2 + CHAdeMO. Made in Chad.</p>
      </div>
      <a class="mm-featured-cta" href="/en/stations/">Discover stations <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-technologies" class="mm-r154" role="region" aria-label="Technologies">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">Innovation core</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/technologies/">Technologies hub<small>T01-T12 · digital twin · AI · IoT</small></a></li>
        <li><a class="mm-link" href="/en/marques/">6 brands&trade; portfolio<small>OAPI patents pending</small></a></li>
        <li><a class="mm-link" href="/en/ai-concierge/">AI Concierge<small>World&rsquo;s first OFS · Claude API</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">EOR Local Sahel</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/amont/">5 OAPI patents<small>Sahel polymers · +6-17% OOIP Doba</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">OT &amp; cyber</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/data/atlas.html">Pipeline 3D<small>Doba-Kribi 1,070 km</small></a></li>
        <li><a class="mm-link" href="/en/hse/">OT cybersecurity<small>IEC 62443 · Integrated Safety</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">World&rsquo;s first OFS</p>
        <p class="mm-featured-h">AI <em>Concierge.</em></p>
        <p class="mm-featured-desc">24/7 dataroom AI assistant · Claude API · 5 languages · source citations · automatic DD pre-screen.</p>
      </div>
      <a class="mm-featured-cta" href="/en/ai-concierge/">Test AI Concierge <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-commitments" class="mm-r154" role="region" aria-label="Commitments">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">HSE Integrated Safety</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/hse/">HSE hub<small>16 H/W/O services · OIMS-grade</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Training</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/talents/">EnerAcademy&trade;<small>50 engineers/year · IFP partnership</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">CSR &amp; ESG</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/sustainability/">Sustainability<small>Net Zero CEMAC 2050 · 5 phases</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">CEO/Chairman validated</p>
        <p class="mm-featured-h">Net Zero <em>2050.</em></p>
        <p class="mm-featured-desc">5 phases · 3 ESG pillars · GHG Scope 1/2/3 · aligned GRI · TCFD · UN Global Compact · EITI Chad.</p>
      </div>
      <a class="mm-featured-cta" href="/en/sustainability/">View trajectory <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<aside id="mm-investors" class="mm-r154" role="region" aria-label="Investors">
  <div class="mm-inner">
    <div>
      <p class="mm-col-h">2026 Round · USD 8-12M</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/engagement/investisseurs.html">Why invest<small>Deal structure · 47% closed · J-150</small></a></li>
        <li><a class="mm-link" href="/en/dataroom/">Dataroom · NDA flow<small>12 categories · DocuSign 1-click</small></a></li>
        <li><a class="mm-link" href="/en/ai-concierge/">AI Concierge<small>24/7 DD assistant · Claude API</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Documents</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/data/atlas.html">Market atlas<small>6 operators cadastre · USD 1.8B TAM</small></a></li>
        <li><a class="mm-link" href="/en/marques/">6 brands&trade; portfolio<small>OAPI patents pending</small></a></li>
      </ul>
    </div>
    <div>
      <p class="mm-col-h">Clients · 6 operators</p>
      <ul class="mm-list">
        <li><a class="mm-link" href="/en/operateurs/cnpcic.html">CNPCIC<small>Bongor basin 30 kbpd</small></a></li>
        <li><a class="mm-link" href="/en/talents/">Careers<small>LCD diaspora · 25 FTE P1</small></a></li>
      </ul>
    </div>
    <div class="mm-featured">
      <div>
        <p class="mm-featured-tag">J-<span data-jn>150</span> closing Sept 30, 2026</p>
        <p class="mm-featured-h">2026 <em>Round.</em></p>
        <p class="mm-featured-desc"><strong style="color:#F6F1E6">USD 8-12M · 47% closed</strong> · 12 NDAs · 3 MoUs operators · 50 DFI/VC/Family Offices targeted.</p>
      </div>
      <a class="mm-featured-cta" href="/en/engagement/investisseurs.html">Access 2026 Round <span class="mm-featured-cta-arrow">↗</span></a>
    </div>
  </div>
</aside>

<div class="mm-backdrop" aria-hidden="true"></div>
'''

MARKER = 'class="mm-r154"'

# Mapping FR axis to data-mm attribute
FR_DATA_MM = {
    'sitemap.html#mission': 'data-mm="mission"',
    'sitemap.html#activites': 'data-mm="activites"',
    'sitemap.html#transition': 'data-mm="transition"',
    'sitemap.html#technologies': 'data-mm="technologies"',
    'sitemap.html#engagements': 'data-mm="engagements"',
    'sitemap.html#investisseurs': 'data-mm="investisseurs"',
}
EN_DATA_MM = {
    'sitemap.html#mission': 'data-mm="mission"',
    'sitemap.html#activities': 'data-mm="activities"',
    'sitemap.html#transition': 'data-mm="transition"',
    'sitemap.html#technologies': 'data-mm="technologies"',
    'sitemap.html#commitments': 'data-mm="commitments"',
    'sitemap.html#investors': 'data-mm="investors"',
}

n_done = 0
for html in ROOT.rglob("*.html"):
    if any(p in SKIP_DIRS for p in html.parts): continue
    rel = str(html.relative_to(ROOT))
    try: c = html.read_text(encoding="utf-8")
    except: continue
    if 'class="hu-header"' not in c:
        continue
    if MARKER in c:
        continue  # already injected
    is_en = rel.startswith("en/")
    new_c = c
    # 1) Inject CSS link
    if 'megamenu-r154.css' not in new_c:
        if 'header-ultra.css' in new_c:
            new_c = new_c.replace(
                '<link rel="stylesheet" href="/assets/css/header-ultra.css',
                CSS_LINK + '\n<link rel="stylesheet" href="/assets/css/header-ultra.css',
                1
            )
    # 2) Inject JS
    if 'megamenu-r154.js' not in new_c and '</body>' in new_c:
        new_c = new_c.replace('</body>', '  ' + JS_TAG + '\n</body>', 1)
    # 3) Add data-mm attribute on hu-nav-link
    data_mm_map = EN_DATA_MM if is_en else FR_DATA_MM
    for href_pat, attr in data_mm_map.items():
        old = f'<a class="hu-nav-link" href="/{href_pat}">'
        new = f'<a class="hu-nav-link" {attr} href="/{href_pat}">'
        new_c = new_c.replace(old, new, 1)
    # 4) Inject panels after </header>
    panels = EN_PANELS if is_en else FR_PANELS
    new_c = re.sub(r'(</header>\s*<aside class="hu-drawer)', '</header>\n' + panels + '\n<aside class="hu-drawer', new_c, count=1)
    if new_c != c:
        html.write_text(new_c, encoding="utf-8")
        n_done += 1

print(f"=== R154 SUMMARY ===")
print(f"Pages with mega menu injected: {n_done}")
