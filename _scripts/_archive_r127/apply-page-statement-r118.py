#!/usr/bin/env python3
"""
R118 · Page-statement propagation pages secondaires (FR + EN restantes)
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PAGES = {
    # === FR pages secondaires ===
    "talents/index.html": (
        "Talents · LCD diaspora",
        '<em>Talents</em> tchadiens.<br>Diaspora.<br>Anciens majors.',
        "EnerTchad recrute les <strong>meilleurs talents tchadiens</strong> de la diaspora · anciens ExxonMobil, Total, Shell, Chevron · ingénieurs pétroliers, géoscientifiques, data scientists. Programme LCD (Local Content Diaspora) · cible 75% talents tchadiens Phase 2.",
        "EnerAcademy&trade; · 50 ingénieurs/an formés OFS · partenariats universités N'Djamena, Polytech Bongor, IFP School Paris.",
        [("/marques/", "EnerAcademy&trade;"), ("/talents/diaspora-map/", "Carte diaspora"), ("/sourcing-africain/", "Sourcing Afrique"), ("/investisseurs/", "Tour 2026")],
    ),
    "sourcing-africain/index.html": (
        "Sourcing intra-africain · CEMAC + ECOWAS",
        '<em>Sourcing</em> Afrique.<br>Dangote · Niger ·<br>Angola · Algérie.',
        "Stratégie sourcing intra-africain : équipements, services, consommables. Partenariats Dangote (Nigeria), Niger services O&G, Angola CMR, Algérie Sonatrach. Substitution import 30% Phase 1 · cap 50% 2030.",
        "Cadre CEMAC · OHADA · économies devises · réduction empreinte carbone logistique · résilience supply chain.",
        [("/atlas/", "Atlas opérateurs"), ("/sustainability/", "Net Zero 2050"), ("/aval/", "Mobile Station&trade;"), ("/talents/", "LCD diaspora")],
    ),
    "stations/index.html": (
        "Stations-service · Réseau aval",
        '<em>200 stations.</em><br>13 villes Tchad.<br>50 IRVE 2030.',
        "Réseau aval Mobile Station&trade; · 200 stations cibles dans 13 villes du Tchad. Premier réseau IRVE CEMAC : 50 stations 50 kW d'ici 2030. Carte interactive disponibilités carburant en temps réel.",
        "Cadre B2C aval premium · partenariat raffinerie Djermaya 20 kbpd · projets micro-grids solaires sur sites isolés.",
        [("/aval/", "Pôle Aval"), ("/marques/", "Mobile Station&trade;"), ("/energies/", "IRVE 50"), ("/atlas/", "Réseau")],
    ),
    "solutions/index.html": (
        "Catalogue · 40+ services structurés",
        '<em>40+ codes</em> services.<br>4 pôles · 3 axes.<br>Catalogue O&G.',
        "Catalogue services structurés par codes : <strong>S01-S18 Amont</strong> · S04-S06 Intermédiaire · <strong>D01-D08 + C01-C04 Aval</strong> · P01-P08 Pétrochimie · T01-T12 Tech · E01-E08 Énergies · 16 Sécurité Intégrée.",
        "Tarification à la prestation (T) ou au forfait (F) · cadre OHADA · contrats-types disponibles dataroom NDA pour DFI cibles.",
        [("/amont/", "Pôle Amont"), ("/intermediaire/", "Intermédiaire"), ("/aval/", "Pôle Aval"), ("/petrochimie/", "Pétrochimie")],
    ),
    "pourquoi/manifeste.html": (
        "Manifeste DG · Vision 2026-2030",
        '<em>Le Tchad</em><br>parle le langage<br>technique des majors.',
        "Tribune DG Bignéro Moïalbéi Le Madang. EnerTchad ne reproduit pas les majors — elle traduit leur langage technique en exécution locale OHADA, avec des brevets OAPI qui appartiennent au Tchad.",
        "Vision 2026-2030 : souveraineté technique parapétrolière · brevets OAPI made-in-Chad · LCD diaspora · trajectoire Net Zero CEMAC 2050.",
        [("/a-propos/", "À propos"), ("/pourquoi/equipe.html", "Équipe"), ("/pourquoi/trajectoire.html", "Trajectoire"), ("/investisseurs/", "Tour 2026")],
    ),
    "engagement/transparence.html": (
        "Transparence · ESG · ITIE",
        '<em>Transparence.</em><br>ITIE Chad.<br>GHG inventory.',
        "Cadre ESG cibles : ITIE Tchad publication annuelle · GHG inventory Scope 1/2/3 · GRI · TCFD · UN Global Compact · ISO 45001/14001/37001 · API RP 75/754. Rapport annuel public.",
        "Standards fiduciaires DFI alignés sur la trajectoire Net Zero CEMAC 2050. Audit interne annuel + auditeur externe Mazars / EY.",
        [("/sustainability/", "Net Zero 2050"), ("/dataroom/", "Dataroom NDA"), ("/a-propos/", "Gouvernance"), ("/investisseurs/", "Tour 2026")],
    ),
    "engagement/contact.html": (
        "Contact · N'Djamena offices",
        '<em>30 min</em> Cal.com.<br>N&rsquo;Djamena.<br>Réponse 24-48h.',
        "Réservez un slot 30 minutes directement avec le DG ou un membre de l&rsquo;équipe selon votre profil (investisseur · opérateur · presse · talent · partenaire). Délais réponse : 24-48h jours ouvrés.",
        "Siège : N&rsquo;Djamena · Tchad · adresse complète sur demande NDA. Email : contact@enertchad.td · Téléphone : +235 XX XX XX XX.",
        [("/dataroom/", "Dataroom NDA"), ("/engagement/presse.html", "Presse"), ("/talents/", "Carrières"), ("/investisseurs/", "Tour 2026")],
    ),
    "engagement/presse.html": (
        "Presse · Médias",
        '<em>Médias</em> O&G.<br>Press Kit DFI.<br>Communiqués 2026.',
        "Press kit téléchargeable sur demande · communiqués officiels 2026-2030 · interviews DG / PCA disponibles. Couverture médiatique Tour 2026 OHADA en cours.",
        "Contact presse : presse@enertchad.td · Embargo respecté · communiqués multilingues FR/EN · photos HD opérations Tchad.",
        [("/pourquoi/manifeste.html", "Manifeste DG"), ("/dataroom/", "Press kit"), ("/marques/", "Brevets OAPI"), ("/investisseurs/", "Tour 2026")],
    ),
    "ai-concierge/index.html": (
        "AI Concierge · DFI 24/7",
        '<em>AI Concierge.</em><br>Claude API.<br>DFI questions.',
        "Assistant AI Concierge propulsé Claude API · réponses 24/7 aux questions DFI · IFC · Proparco · BAD · BIDC · investisseurs Family Office · journalistes. Multilingue FR/EN.",
        "Bypass calendrier · réponses techniques détaillées · brief Tour 2026 instantané · qualified leads routing vers DG.",
        [("/dataroom/", "Dataroom NDA"), ("/investisseurs/", "Tour 2026"), ("/engagement/contact.html", "30 min DG"), ("/sustainability/", "Net Zero 2050")],
    ),
    "mythos/index.html": (
        "Mythos · Récit fondateur",
        '<em>Mythos</em>.<br>7 chapitres.<br>Récit fondateur.',
        "Récit fondateur EnerTchad SA · 7 chapitres cinématographiques. De la genèse souveraineté technique tchadienne à la trajectoire Net Zero CEMAC 2050. Lecture éditoriale DFI-grade.",
        "Style World Oil / Bloomberg / NYT · scroll-driven storytelling · adapté presse internationale et investisseurs DFI.",
        [("/pourquoi/manifeste.html", "Manifeste DG"), ("/marques/", "6 marques&trade;"), ("/sustainability/", "Trajectoire"), ("/investisseurs/", "Tour 2026")],
    ),
    "hse/index.html": (
        "Sécurité Intégrée · OIMS-grade",
        '<em>HSE</em> intégré.<br>16 services.<br>OIMS-grade ExxonMobil.',
        "Système Sécurité Intégré · cadre non-négociable · 16 services H01-H08 + W01-W04 + OO1-OO4 · OIMS-grade ExxonMobil 11 éléments · API RP 75/754 · IEC 61511 · ISO 45001/14001/37001.",
        "PSM (Process Safety Management) + HSE (Health Safety Environment) + WMS (Waste Management) + OIM (Operations Integrity Management). Audit annuel · zero major incidents target.",
        [("/solutions/", "Catalogue services"), ("/sustainability/", "ESG"), ("/atlas/", "Sites"), ("/investisseurs/", "Tour 2026")],
    ),
    "dataroom/index.html": (
        "Dataroom · NDA · DFI Package",
        '<em>Dataroom</em> NDA.<br>DFI package.<br>DD ready.',
        "Dataroom sécurisée DocuSign NDA 1-clic · DD package complet : business plan · modèle financier 5 ans · term sheet OHADA · pacte d'actionnaires · code conduite anti-corruption · 12 livrables Tour 2026.",
        "Cadre OHADA · cibles DFI (IFC · Proparco · BAD · BIDC) · VC larges · Family Offices Afrique · Impact funds. Closing 30 sept 2026.",
        [("/investisseurs/", "Tour 2026"), ("/engagement/transparence.html", "Transparence"), ("/sustainability/", "ESG"), ("/engagement/contact.html", "30 min DG")],
    ),
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/page-statement.css?v=r118" />'

def build_section(kicker, h1_html, lede, aside, links):
    links_html = "\n        ".join(
        f'<a class="page-statement-link" href="{href}">{text}</a>'
        for href, text in links
    )
    return f'''
  <!-- PAGE STATEMENT · brutalist editorial · R118 propagation -->
  <section class="page-statement" aria-labelledby="ps-h1">
    <div class="page-statement-inner">
      <div class="page-statement-meta">
        <span>{kicker}</span>
        <span>EnerTchad SA <strong>·</strong> 2026</span>
      </div>
      <h1 class="page-statement-h1" id="ps-h1">
        {h1_html}
      </h1>
      <div class="page-statement-body">
        <p class="page-statement-lede">{lede}</p>
        <p class="page-statement-aside">{aside}</p>
      </div>
      <div class="page-statement-links">
        {links_html}
      </div>
    </div>
  </section>
'''

def process(rel_path, kicker, h1, lede, aside, links):
    p = ROOT / rel_path
    if not p.exists():
        print(f"  ✗ {rel_path}  (missing)")
        return False
    content = p.read_text(encoding="utf-8")
    if "page-statement" in content:
        print(f"  ⊙ {rel_path}  (already)")
        return False
    if "page-statement.css" not in content:
        content = content.replace(
            '<link rel="stylesheet" href="/assets/css/enertchad.css',
            f'{CSS_LINK}\n<link rel="stylesheet" href="/assets/css/enertchad.css',
            1,
        )
    section = build_section(kicker, h1, lede, aside, links)
    content = re.sub(r'(<main\b[^>]*>)', r'\1' + section, content, count=1)
    p.write_text(content, encoding="utf-8")
    print(f"  ✓ {rel_path}")
    return True

def main():
    print("=== R118 · Page-statement propagation pages secondaires ===\n")
    n = 0
    for rel, args in PAGES.items():
        if process(rel, *args):
            n += 1
    print(f"\n=== SUMMARY ===\nPages traitées : {len(PAGES)}\nInjecté : {n}")

if __name__ == "__main__":
    main()
