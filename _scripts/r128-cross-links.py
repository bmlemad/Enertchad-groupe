#!/usr/bin/env python3
"""R128 · Cross-link automation pôles↔marques↔opérateurs
Inject contextual <aside class="related-canon"> just before </main> on 4 pôles pages (FR+EN).
Idempotent: skip if already injected."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Relations canon (Doc 152 taxonomy)
RELATIONS = {
    # FR
    "amont/index.html": {
        "title": "Liens canon · Amont",
        "lang": "fr",
        "marques": [("Mobile Station&trade;", "/marques/#mobile-station"), ("EnerAcademy&trade;", "/marques/#eneracademy")],
        "operateurs": [("CNPCIC", "/data/atlas.html#cnpcic"), ("Perenco", "/data/atlas.html#perenco"), ("TPC", "/data/atlas.html#tpc")],
        "axes": [("Technologies", "/technologies/"), ("HSE", "/hse/")],
    },
    "intermediaire/index.html": {
        "title": "Liens canon · Intermédiaire",
        "lang": "fr",
        "marques": [("Water-to-Value&trade;", "/marques/#water-to-value")],
        "operateurs": [("COTCO/TOTCO", "/data/atlas.html#cotco"), ("SHT", "/data/atlas.html#sht")],
        "axes": [("Technologies", "/technologies/"), ("HSE", "/hse/")],
    },
    "aval/index.html": {
        "title": "Liens canon · Aval",
        "lang": "fr",
        "marques": [("Mobile Station&trade;", "/marques/#mobile-station"), ("NRJ+&trade;", "/marques/#nrjplus"), ("EnerClub&trade;", "/marques/#enerclub")],
        "operateurs": [("SRN (Djermaya)", "/data/atlas.html#srn"), ("SHT", "/data/atlas.html#sht")],
        "axes": [("Énergies", "/energies/"), ("Stations", "/stations/")],
    },
    "petrochimie/index.html": {
        "title": "Liens canon · Pétrochimie",
        "lang": "fr",
        "marques": [("EnerFert&trade;", "/marques/#enerfert")],
        "operateurs": [("SRN", "/data/atlas.html#srn"), ("CNPCIC", "/data/atlas.html#cnpcic")],
        "axes": [("Technologies", "/technologies/"), ("HSE", "/hse/")],
    },
    # EN
    "en/amont/index.html": {
        "title": "Canon links · Upstream",
        "lang": "en",
        "marques": [("Mobile Station&trade;", "/en/marques/#mobile-station"), ("EnerAcademy&trade;", "/en/marques/#eneracademy")],
        "operateurs": [("CNPCIC", "/en/data/atlas.html#cnpcic"), ("Perenco", "/en/data/atlas.html#perenco"), ("TPC", "/en/data/atlas.html#tpc")],
        "axes": [("Technologies", "/en/technologies/"), ("HSE", "/en/sustainability/")],
    },
    "en/intermediaire/index.html": {
        "title": "Canon links · Midstream",
        "lang": "en",
        "marques": [("Water-to-Value&trade;", "/en/marques/#water-to-value")],
        "operateurs": [("COTCO/TOTCO", "/en/data/atlas.html#cotco"), ("SHT", "/en/data/atlas.html#sht")],
        "axes": [("Technologies", "/en/technologies/"), ("HSE", "/en/sustainability/")],
    },
    "en/aval/index.html": {
        "title": "Canon links · Downstream",
        "lang": "en",
        "marques": [("Mobile Station&trade;", "/en/marques/#mobile-station"), ("NRJ+&trade;", "/en/marques/#nrjplus"), ("EnerClub&trade;", "/en/marques/#enerclub")],
        "operateurs": [("SRN (Djermaya)", "/en/data/atlas.html#srn"), ("SHT", "/en/data/atlas.html#sht")],
        "axes": [("Energies", "/en/energies/"), ("Stations", "/en/stations/")],
    },
    "en/petrochimie/index.html": {
        "title": "Canon links · Petrochemicals",
        "lang": "en",
        "marques": [("EnerFert&trade;", "/en/marques/#enerfert")],
        "operateurs": [("SRN", "/en/data/atlas.html#srn"), ("CNPCIC", "/en/data/atlas.html#cnpcic")],
        "axes": [("Technologies", "/en/technologies/"), ("HSE", "/en/sustainability/")],
    },
}

LABEL = {
    "fr": {"marques": "Marques™", "operateurs": "Opérateurs", "axes": "Axes"},
    "en": {"marques": "Brands™", "operateurs": "Operators", "axes": "Axes"},
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/related-canon.css?v=r128" />'

def build_aside(rel):
    L = LABEL[rel["lang"]]
    parts = []
    for cat in ("marques", "operateurs", "axes"):
        if rel[cat]:
            links = " · ".join(f'<a href="{href}">{text}</a>' for text, href in rel[cat])
            parts.append(f'<div class="rc-row"><span class="rc-label">{L[cat]}</span>{links}</div>')
    return f'''
  <!-- R128 · Cross-links canon -->
  <aside class="related-canon" aria-label="{rel["title"]}">
    <h3 class="rc-title">{rel["title"]}</h3>
    {"".join(parts)}
  </aside>
'''

def process(rel_path, rel):
    p = ROOT / rel_path
    if not p.exists():
        print(f"  ✗ {rel_path}  (missing)")
        return False
    content = p.read_text(encoding="utf-8")
    if "related-canon" in content:
        print(f"  ⊙ {rel_path}  (already)")
        return False
    if "related-canon.css" not in content:
        content = content.replace(
            '<link rel="stylesheet" href="/assets/css/enertchad.css',
            f'{CSS_LINK}\n<link rel="stylesheet" href="/assets/css/enertchad.css',
            1,
        )
    aside = build_aside(rel)
    if "</main>" in content:
        content = content.replace("</main>", aside + "</main>", 1)
    else:
        print(f"  ✗ {rel_path}  (no </main>)")
        return False
    p.write_text(content, encoding="utf-8")
    print(f"  ✓ {rel_path}")
    return True

def main():
    print("=== R128 · Cross-links canon (4 pôles FR + EN) ===\n")
    n = 0
    for rel_path, rel in RELATIONS.items():
        if process(rel_path, rel):
            n += 1
    print(f"\n=== SUMMARY ===\nPages traitées : {len(RELATIONS)}\nInjecté : {n}")

if __name__ == "__main__":
    main()
