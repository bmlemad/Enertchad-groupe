#!/usr/bin/env python3
"""R120 · EN parity completion (5 pages secondaires)"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PAGES_EN = {
    "en/talents/index.html": (
        "Talents · LCD diaspora",
        '<em>Chadian</em> talents.<br>Diaspora.<br>Former majors.',
        "EnerTchad recruits the <strong>best Chadian talents</strong> from diaspora · former ExxonMobil, Total, Shell, Chevron · petroleum engineers, geoscientists, data scientists. LCD Programme (Local Content Diaspora) · target 75% Chadian talents Phase 2.",
        "EnerAcademy&trade; · 50 engineers/year trained OFS · partnerships universities N&rsquo;Djamena, Polytech Bongor, IFP School Paris.",
        [("/en/marques/", "EnerAcademy&trade;"), ("/en/sourcing-africain/", "Africa sourcing"), ("/en/engagement/investisseurs.html", "Tour 2026"), ("/en/about/", "About")],
    ),
    "en/sourcing-africain/index.html": (
        "Intra-African sourcing · CEMAC + ECOWAS",
        '<em>Sourcing</em> Africa.<br>Dangote · Niger ·<br>Angola · Algeria.',
        "Intra-African sourcing strategy: equipment, services, consumables. Partnerships Dangote (Nigeria), Niger O&G services, Angola CMR, Algeria Sonatrach. Import substitution 30% Phase 1 · cap 50% 2030.",
        "CEMAC framework · OHADA · forex savings · reduced logistics carbon footprint · supply chain resilience.",
        [("/en/data/atlas.html", "Operator atlas"), ("/en/sustainability/", "Net Zero 2050"), ("/en/aval/", "Mobile Station&trade;"), ("/en/talents/", "LCD diaspora")],
    ),
    "en/stations/index.html": (
        "Stations · Downstream network",
        '<em>200 stations.</em><br>13 Chad cities.<br>50 IRVE 2030.',
        "Mobile Station&trade; downstream network · 200 stations target across 13 Chad cities. First CEMAC IRVE network: 50 stations 50 kW by 2030. Real-time fuel availability interactive map.",
        "Premium B2C downstream framework · Djermaya refinery 20 kbpd partner · solar micro-grid projects on isolated sites.",
        [("/en/aval/", "Downstream pillar"), ("/en/marques/", "Mobile Station&trade;"), ("/en/energies/", "50 IRVE"), ("/en/data/atlas.html", "Network")],
    ),
    "en/solutions/index.html": (
        "Catalog · 40+ structured services",
        '<em>40+ codes</em> services.<br>4 pillars · 3 axes.<br>O&G catalog.',
        "Services structured by codes: <strong>S01-S18 Upstream</strong> · S04-S06 Midstream · <strong>D01-D08 + C01-C04 Downstream</strong> · P01-P08 Petrochemicals · T01-T12 Tech · E01-E08 Energies · 16 Integrated Safety.",
        "Per-service (T) or fixed-price (F) pricing · OHADA framework · template contracts available NDA dataroom for DFI targets.",
        [("/en/amont/", "Upstream"), ("/en/intermediaire/", "Midstream"), ("/en/aval/", "Downstream"), ("/en/petrochimie/", "Petrochemicals")],
    ),
    "en/pourquoi/manifeste.html": (
        "CEO Manifesto · Vision 2026-2030",
        '<em>Chad</em><br>speaks the technical<br>language of majors.',
        "CEO Bignéro Moïalbéi Le Madang tribune. EnerTchad does not reproduce the majors — it translates their technical language into local OHADA execution, with OAPI patents that belong to Chad.",
        "Vision 2026-2030: oilfield services technical sovereignty · OAPI patents made-in-Chad · LCD diaspora · CEMAC Net Zero 2050 trajectory.",
        [("/en/about/", "About"), ("/en/sustainability/", "Trajectory"), ("/en/marques/", "OAPI patents&trade;"), ("/en/engagement/investisseurs.html", "Tour 2026")],
    ),
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/page-statement.css?v=r120" />'

def build_section(kicker, h1_html, lede, aside, links):
    links_html = "\n        ".join(
        f'<a class="page-statement-link" href="{href}">{text}</a>'
        for href, text in links
    )
    return f'''
  <!-- PAGE STATEMENT · R120 EN parity completion -->
  <section class="page-statement" aria-labelledby="ps-h1">
    <div class="page-statement-inner">
      <div class="page-statement-meta">
        <span>{kicker}</span>
        <span>EnerTchad SA <strong>·</strong> 2026</span>
      </div>
      <h1 class="page-statement-h1" id="ps-h1">{h1_html}</h1>
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
    print("=== R120 · EN parity completion ===\n")
    n = 0
    for rel, args in PAGES_EN.items():
        if process(rel, *args):
            n += 1
    print(f"\n=== SUMMARY ===\nPages traitées : {len(PAGES_EN)}\nInjecté : {n}")

if __name__ == "__main__":
    main()
