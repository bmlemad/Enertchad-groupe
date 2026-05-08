#!/usr/bin/env python3
"""
R109 · Propagation page-statement brutalist cross-pages
Inject .page-statement section + CSS link on canon pages
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Per-page customization · {path: (kicker, h1_html, lede, aside, links)}
PAGES = {
    # === 4 PÔLES CANON ===
    "amont/index.html": (
        "Pôle 01 · Amont · Upstream",
        'Géologie. <em>Forage.</em><br>Récupération <em>assistée.</em>',
        "Amont O&G · accompagnement opérateurs sur 5 bassins canon (Bongor · Doba · Lac · Doseo · Borkou). 10+ services structurés (S01-S10). Programme EOR Local · 5 polymères ressources sahéliennes · brevet OAPI Q3 2026.",
        "30+ puits matures bassin Doba ciblés · gain +6-17% OOIP · récupération assistée à base d'ingrédients tchadiens.",
        [("/atlas/", "Atlas bassins"), ("/solutions/", "Catalogue services"), ("/marques/", "Brevets OAPI"), ("/investisseurs/", "Tour 2026")],
    ),
    "intermediaire/index.html": (
        "Pôle 02 · Intermédiaire · Midstream",
        '<em>Pipelines.</em><br>Stations.<br>Stockage.',
        "Intermédiaire O&G · pipeline Doba-Kribi 1 070 km · 6 stations pompage · stockage stratégique. Services intégrité 360°, monitoring AI leak detection, maintenance prédictive.",
        "300 km pipeline Ronier-raffinerie · 1 070 km TD-CMR · capacité 225 kbpd export · partenariat opérateurs CNPCIC, Perenco, COTCO.",
        [("/atlas/", "Atlas pipelines"), ("/solutions/", "Catalogue services"), ("/investisseurs/", "Tour 2026"), ("/sustainability/", "Net Zero 2050")],
    ),
    "aval/index.html": (
        "Pôle 03 · Aval · Downstream",
        'Distribution.<br>Commercialisation.<br><em>Tous produits</em> pétroliers.',
        "Aval O&G · distribution & commercialisation tous produits raffinés et dérivés. 8 services D01-D08 + 4 commercialisation C01-C04 + IRVE U06. Marque Mobile Station™ · 200 stations cibles 13 villes.",
        "Cap 50 IRVE CEMAC 2030 · réseau B2C aval premium · raffinerie Djermaya 20 kbpd partenaire SRN.",
        [("/stations/", "Stations live"), ("/marques/", "Marques™ OAPI"), ("/atlas/", "Réseau aval"), ("/solutions/", "Catalogue")],
    ),
    "petrochimie/index.html": (
        "Pôle 04 · Pétrochimie",
        '<em>Pétrochimie.</em><br>Plastiques.<br>Engrais.',
        "Pétrochimie · diversification dérivés Tchad. EnerFert™ engrais · projet OAPI · partenariat agriculture sahélienne. Capacité raffinerie domestique soutenue.",
        "TAM/SAM/SOM dérivés pétrochimiques Tchad · industrie sahélienne · partenariats potentiels Dangote/Maroc.",
        [("/marques/", "EnerFert™"), ("/sustainability/", "Trajectoire"), ("/investisseurs/", "Tour 2026"), ("/atlas/", "Atlas")],
    ),

    # === 2 AXES TRANSVERSAUX ===
    "technologies/index.html": (
        "Axe transversal · Technologies",
        '<em>Digital.</em> AI.<br>Pipeline 360°.<br>Twin numérique.',
        "Technologies O&G · digital twin Doba-Kribi, AI leak detection, monitoring temps réel, maintenance prédictive ML, ERP terrain. 4 services T01-T04.",
        "Pipeline 360° simulation · capteurs ML · LCD diaspora data scientists Tchad · partenariats universitaires.",
        [("/data/oleoduc-3d.html", "Digital twin"), ("/talents/", "Talents tech"), ("/solutions/", "Catalogue T"), ("/investisseurs/", "Tour 2026")],
    ),
    "energies/index.html": (
        "Axe transversal · Énergies",
        '<em>Solaire.</em> Éolien.<br>Hybride.<br>Net Zero <em>2050.</em>',
        "Énergies renouvelables · solaire 32 MW Djermaya · hybride micro-grid stations · trajectoire Net Zero CEMAC 2050. 4 services E01-E04.",
        "Capacité 125 MW Tchad · 50 IRVE CEMAC 2030 · backup hybride solaire/diesel sites isolés · AT décarbonation opérateurs.",
        [("/sustainability/", "Net Zero 2050"), ("/stations/", "IRVE 50"), ("/atlas/", "Réseau"), ("/marques/", "EnerClub™")],
    ),

    # === HUBS ===
    "sustainability/index.html": (
        "Sustainability · Net Zero 2050",
        'Net Zero <em>2050.</em><br>5 phases.<br>3 piliers ESG.',
        "Trajectoire validée DG/PCA · 5 phases (2026 baseline · 2030 -25% · 2040 -50% · 2045 -75% · 2050 net zero). 3 piliers ESG : E (carbon · water · biodiversity), S (LCD · talent · communities), G (OHADA · ITIE · OAPI).",
        "GHG inventory Scope 1/2/3 publié annuellement · GRI · TCFD · UN Global Compact · ITIE Chad · ISO 45001/14001/37001.",
        [("/engagement/transparence.html", "Transparence ESG"), ("/talents/", "Talents LCD"), ("/atlas/", "Sites"), ("/investisseurs/", "Tour 2026")],
    ),
    "marques/index.html": (
        "Portfolio · 6 marques™ OAPI",
        '<em>6 marques.</em><br>Brevets OAPI<br>Afrique 17 États.',
        "Portfolio brand ownership · Mobile Station™ aval, EnerClub™ énergies, NRJ+™ B2C, Water-to-Value™ retraitement, EnerAcademy™ formation, EnerFert™ pétrochimie. Brevets OAPI Yaoundé · 17 États Afrique francophone.",
        "5 brevets EOR en instruction · marques déposées · stratégie protection IP avant scale-up régional CEMAC + ECOWAS.",
        [("/amont/", "Brevet EOR"), ("/aval/", "Mobile Station™"), ("/petrochimie/", "EnerFert™"), ("/talents/", "EnerAcademy™")],
    ),
    "investisseurs/index.html": (
        "Tour Seed/Pre-A 2026",
        'Tour 2026.<br><em>8-12 M USD.</em><br>Closing T3.',
        "Tour Seed/Pre-A ouvert · DFI cibles (IFC · Proparco · BAD · BIDC) · VC larges · Family Offices Afrique · Impact funds. 47 % closed · 4.7 M USD soft commits · 12 NDAs · 3 MoUs · 15 tickets fondateurs restants.",
        "Use of funds : 25 ETP Phase 1, EnerAcademy 50 ingénieurs/an, 3 contrats pilotes, certifications ISO, premiers cash flows. Cadre OHADA · closing 30 sept 2026.",
        [("/dataroom/", "Dataroom NDA"), ("/atlas/", "Marché 1.8 Md USD"), ("/sustainability/", "ESG"), ("/dg-office-hours/", "30 min DG")],
    ),

    # === CORPORATE ===
    "a-propos/index.html": (
        "À propos · Identité corporate",
        'EnerTchad <em>SA.</em><br>Création 2026.<br>OFS 100% Tchad.',
        "Société anonyme OHADA · capital 10 M FCFA · siège N'Djamena · DG Bignéro Moïalbéi Le Madang · PCA Théophile Gag Pinabei. Slogan canon : Unité · Innovation · Durabilité.",
        "Anciens majors (ExxonMobil · Total · Shell) · LCD diaspora tchadienne · ambition souveraineté technique parapétrolière marché national.",
        [("/pourquoi/manifeste.html", "Manifeste DG"), ("/pourquoi/equipe.html", "Équipe"), ("/pourquoi/trajectoire.html", "Trajectoire"), ("/marques/", "Marques™")],
    ),
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/page-statement.css?v=r108" />'

# Page statement template
def build_section(kicker, h1_html, lede, aside, links):
    links_html = "\n        ".join(
        f'<a class="page-statement-link" href="{href}">{text}</a>'
        for href, text in links
    )
    return f'''
  <!-- PAGE STATEMENT · brutalist editorial · R109 propagation -->
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


def process(rel_path: str, kicker: str, h1: str, lede: str, aside: str, links: list) -> bool:
    p = ROOT / rel_path
    if not p.exists():
        print(f"  ✗ {rel_path}  (missing)")
        return False

    content = p.read_text(encoding="utf-8")
    if "page-statement" in content:
        print(f"  ⊙ {rel_path}  (already has page-statement)")
        return False

    # 1. Inject CSS link in <head>
    if "page-statement.css" not in content:
        content = content.replace(
            '<link rel="stylesheet" href="/assets/css/enertchad.css',
            f'{CSS_LINK}\n<link rel="stylesheet" href="/assets/css/enertchad.css',
            1,
        )

    # 2. Inject section after <main ...>
    section = build_section(kicker, h1, lede, aside, links)
    content = re.sub(
        r'(<main\b[^>]*>)',
        r'\1' + section,
        content,
        count=1,
    )

    p.write_text(content, encoding="utf-8")
    print(f"  ✓ {rel_path}")
    return True


def main():
    print(f"=== R109 · Apply page-statement cross-pages ===")
    print()
    n = 0
    for rel, (kicker, h1, lede, aside, links) in PAGES.items():
        if process(rel, kicker, h1, lede, aside, links):
            n += 1
    print()
    print(f"=== SUMMARY ===")
    print(f"Pages traitées : {len(PAGES)}")
    print(f"Page-statement injecté : {n}")


if __name__ == "__main__":
    main()
