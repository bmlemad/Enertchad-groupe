#!/usr/bin/env python3
"""
R117 · Propagation page-statement EN parity (DFI international cibles)
Inject .page-statement section + CSS link on canon EN pages
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# EN per-page customization · {path: (kicker, h1_html, lede, aside, links)}
PAGES_EN = {
    "en/index.html": (
        "EnerTchad SA · N&rsquo;Djamena · 2026",
        'Oilfield <em>services.</em><br>No assets.<br><span class="strike">No promises.</span><br>Just <em>technical execution.</em>',
        "<strong>EnerTchad SA</strong> is a 100% Oilfield Services (OFS) company supporting Chad market operators across <strong>4 canonical pillars</strong> and <strong>3 cross-cutting axes</strong>. <strong>40+ structured service codes</strong> · OHADA · ITIE compliant · OAPI patents.",
        "Tour Seed/Pre-A 2026 open · USD 8-12M · closing Q3 2026 · 47% closed · 12 NDAs · 3 MoUs · 5 OAPI EOR patents pending. Net Zero 2050 trajectory validated by CEO/Chairman.",
        [("/en/engagement/investisseurs.html", "Tour 2026"), ("/en/solutions/", "Service catalog"), ("/en/data/atlas.html", "Operator atlas"), ("/en/sustainability/", "Net Zero 2050")],
    ),
    "en/amont/index.html": (
        "Pillar 01 · Upstream · Amont",
        'Geology. <em>Drilling.</em><br>Enhanced <em>recovery.</em>',
        "Upstream O&G services across 5 canonical basins (Bongor · Doba · Lac · Doseo · Borkou). 10+ structured service codes (S01-S10). EOR Local Programme · 5 polymers from Sahelian resources · OAPI patent Q3 2026.",
        "30+ mature wells targeted in Doba basin · +6-17% OOIP gain · enhanced recovery using local Chadian ingredients.",
        [("/en/data/atlas.html", "Basin atlas"), ("/en/solutions/", "Service catalog"), ("/en/marques/", "OAPI patents"), ("/en/engagement/investisseurs.html", "Tour 2026")],
    ),
    "en/intermediaire/index.html": (
        "Pillar 02 · Midstream · Intermédiaire",
        '<em>Pipelines.</em><br>Stations.<br>Storage.',
        "Midstream O&G · Doba-Kribi pipeline 1,070 km · 6 pumping stations · strategic storage. 360° integrity services, AI leak detection monitoring, predictive maintenance.",
        "300 km Ronier-refinery pipeline · 1,070 km TD-CMR · 225 kbpd export capacity · partnerships CNPCIC, Perenco, COTCO operators.",
        [("/en/data/atlas.html", "Pipeline atlas"), ("/en/solutions/", "Service catalog"), ("/en/engagement/investisseurs.html", "Tour 2026"), ("/en/sustainability/", "Net Zero 2050")],
    ),
    "en/aval/index.html": (
        "Pillar 03 · Downstream · Aval",
        'Distribution.<br>Commercialization.<br><em>All petroleum</em> products.',
        "Downstream O&G · distribution & commercialization of all refined products and derivatives. 8 services D01-D08 + 4 commercialization C01-C04 + IRVE U06. Mobile Station&trade; brand · 200 stations target across 13 cities.",
        "Cap 50 IRVE CEMAC 2030 · premium B2C downstream network · Djermaya refinery 20 kbpd partner SRN.",
        [("/en/stations/", "Live stations"), ("/en/marques/", "OAPI brands"), ("/en/data/atlas.html", "Downstream network"), ("/en/solutions/", "Catalog")],
    ),
    "en/petrochimie/index.html": (
        "Pillar 04 · Petrochemicals",
        '<em>Petrochemicals.</em><br>Plastics.<br>Fertilizers.',
        "Petrochemicals · Chad derivatives diversification. EnerFert&trade; fertilizer · OAPI project · Sahelian agriculture partnership. Domestic refinery capacity supported.",
        "TAM/SAM/SOM Chad petrochemical derivatives · Sahelian industry · potential Dangote/Morocco partnerships.",
        [("/en/marques/", "EnerFert&trade;"), ("/en/sustainability/", "Trajectory"), ("/en/engagement/investisseurs.html", "Tour 2026"), ("/en/data/atlas.html", "Atlas")],
    ),
    "en/technologies/index.html": (
        "Cross-cutting Axis · Technologies",
        '<em>Digital.</em> AI.<br>Pipeline 360°.<br>Digital twin.',
        "O&G Technologies · Doba-Kribi digital twin, AI leak detection, real-time monitoring, ML predictive maintenance, field ERP. 4 services T01-T04.",
        "Pipeline 360° simulation · ML sensors · LCD Chadian data scientists diaspora · university partnerships.",
        [("/en/data/oleoduc-3d.html", "Digital twin"), ("/en/talents/", "Tech talents"), ("/en/solutions/", "T catalog"), ("/en/engagement/investisseurs.html", "Tour 2026")],
    ),
    "en/energies/index.html": (
        "Cross-cutting Axis · Energies",
        '<em>Solar.</em> Wind.<br>Hybrid.<br>Net Zero <em>2050.</em>',
        "Renewable energies · 32 MW Djermaya solar · hybrid micro-grid stations · Net Zero CEMAC 2050 trajectory. 4 services E01-E04.",
        "Chad capacity 125 MW · 50 IRVE CEMAC 2030 · solar/diesel hybrid backup isolated sites · operator decarbonation TA.",
        [("/en/sustainability/", "Net Zero 2050"), ("/en/stations/", "50 IRVE"), ("/en/data/atlas.html", "Network"), ("/en/marques/", "EnerClub&trade;")],
    ),
    "en/sustainability/index.html": (
        "Sustainability · Net Zero 2050",
        'Net Zero <em>2050.</em><br>5 phases.<br>3 ESG pillars.',
        "Trajectory validated by CEO/Chairman · 5 phases (2026 baseline · 2030 -25% · 2040 -50% · 2045 -75% · 2050 net zero). 3 ESG pillars: E (carbon · water · biodiversity), S (LCD · talent · communities), G (OHADA · ITIE · OAPI).",
        "GHG inventory Scope 1/2/3 published annually · GRI · TCFD · UN Global Compact · ITIE Chad · ISO 45001/14001/37001.",
        [("/en/engagement/transparence.html", "ESG transparency"), ("/en/talents/", "LCD talents"), ("/en/data/atlas.html", "Sites"), ("/en/engagement/investisseurs.html", "Tour 2026")],
    ),
    "en/marques/index.html": (
        "Portfolio · 6 OAPI brands&trade;",
        '<em>6 brands.</em><br>OAPI patents<br>Africa 17 States.',
        "Brand portfolio ownership · Mobile Station&trade; downstream, EnerClub&trade; energies, NRJ+&trade; B2C, Water-to-Value&trade; treatment, EnerAcademy&trade; training, EnerFert&trade; petrochemicals. OAPI patents Yaoundé · 17 French-speaking African States.",
        "5 EOR patents pending · registered brands · IP protection strategy before regional CEMAC + ECOWAS scale-up.",
        [("/en/amont/", "EOR patent"), ("/en/aval/", "Mobile Station&trade;"), ("/en/petrochimie/", "EnerFert&trade;"), ("/en/talents/", "EnerAcademy&trade;")],
    ),
    "en/engagement/investisseurs.html": (
        "Tour Seed/Pre-A 2026",
        'Tour 2026.<br><em>USD 8-12M.</em><br>Closing Q3.',
        "Tour Seed/Pre-A open · DFI targets (IFC · Proparco · BAD · BIDC) · large VCs · African Family Offices · Impact funds. 47% closed · USD 4.7M soft commits · 12 NDAs · 3 MoUs · 15 founding tickets remaining.",
        "Use of funds: 25 FTE Phase 1, EnerAcademy 50 engineers/year, 3 pilot contracts, ISO certifications, first cash flows. OHADA framework · closing September 30, 2026.",
        [("/en/dataroom/", "NDA dataroom"), ("/en/data/atlas.html", "USD 1.8B market"), ("/en/sustainability/", "ESG"), ("/en/about/", "30 min CEO")],
    ),
    "en/about/index.html": (
        "About · Corporate identity",
        'EnerTchad <em>SA.</em><br>Founded 2026.<br>OFS 100% Chad.',
        "Limited company OHADA · capital XAF 10M · headquarters N'Djamena · CEO Bignéro Moïalbéi Le Madang · Chairman Théophile Gag Pinabei. Canon slogan: Unity · Innovation · Sustainability.",
        "Former majors (ExxonMobil · Total · Shell) · Chadian diaspora LCD · ambition technical sovereignty oilfield services national market.",
        [("/en/pourquoi/manifeste.html", "CEO Manifesto"), ("/en/about/", "Team"), ("/en/sustainability/", "Trajectory"), ("/en/marques/", "OAPI brands&trade;")],
    ),
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/page-statement.css?v=r117" />'

def build_section(kicker, h1_html, lede, aside, links):
    links_html = "\n        ".join(
        f'<a class="page-statement-link" href="{href}">{text}</a>'
        for href, text in links
    )
    return f'''
  <!-- PAGE STATEMENT · brutalist editorial · R117 EN parity -->
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
    print("=== R117 · EN parity page-statement ===\n")
    n = 0
    for rel, args in PAGES_EN.items():
        if process(rel, *args):
            n += 1
    print(f"\n=== SUMMARY ===\nPages traitées : {len(PAGES_EN)}\nInjecté : {n}")


if __name__ == "__main__":
    main()
