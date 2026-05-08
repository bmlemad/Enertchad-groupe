#!/usr/bin/env python3
"""R146 · Apply 3 UX quick wins
1) Inject breadcrumb under header for sub-canon pages (47 pages)
2) Inject JSON-LD BreadcrumbList for SEO (47 pages)
3) Inject back-to-top JS + CSS (all 77 nav-equipped pages)
Idempotent."""
import re, json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_archive", "_preview_build", "_scripts", "_workers", "v3"}
SKIP_PAGES = {
    "preview.html", "offline.html", "header-v11-comparison.html", "header-v11-preview.html",
    "404.html", "500.html", "tour-live/dashboard.html",
    "assets/art/Substrat-Vivant.html", "atlas/index.html",
    # No breadcrumb needed on top-level home + sitemap (they ARE the entry points)
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/ux-r146.css?v=r146" />'
JS_TAG = '<script defer src="/assets/js/ux-r146.js?v=r146"></script>'
SITE = "https://www.enertchad.td"

# Breadcrumb canon mapping
# Format: page_path -> [(label, href), ...]  (Accueil + chemins jusqu'à la page)
CRUMBS_FR = {
    # Pôles (pas de breadcrumb · ils sont entry points P1)
    # Sub-canon pages
    "amont/index.html":              [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Amont","#")],
    "intermediaire/index.html":      [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Intermédiaire","#")],
    "aval/index.html":               [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Aval","#")],
    "petrochimie/index.html":        [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Pétrochimie","#")],
    "technologies/index.html":       [("Accueil","/"), ("Activités","/sitemap.html#technologies"), ("Technologies","#")],
    "energies/index.html":           [("Accueil","/"), ("Activités","/sitemap.html#transition"), ("Énergies","#")],
    "hse/index.html":                [("Accueil","/"), ("Engagements","/sitemap.html#engagements"), ("HSE","#")],
    "stations/index.html":           [("Accueil","/"), ("Transition","/sitemap.html#transition"), ("Stations","#")],
    "marques/index.html":            [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("6 marques™","#")],
    "talents/index.html":            [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Talents · LCD diaspora","#")],
    "talents/diaspora-map/index.html":[("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Talents","/talents/"), ("Diaspora Map","#")],
    "sourcing-africain/index.html":  [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Sourcing intra-africain","#")],
    "sustainability/index.html":     [("Accueil","/"), ("Engagements","/sitemap.html#engagements"), ("Sustainability","#")],
    "mythos/index.html":             [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Mythos","#")],
    "ai-concierge/index.html":       [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("AI Concierge","#")],
    "dataroom/index.html":           [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("Dataroom NDA","#")],
    "dg-office-hours/index.html":    [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("DG Office Hours","#")],
    "investisseurs/index.html":      [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("Hub Tour 2026","#")],
    "tour-live/index.html":          [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("Tour Live","#")],
    "a-propos/index.html":           [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("À propos","#")],
    "activites/index.html":          [("Accueil","/"), ("Activités","#")],
    "boutique/index.html":           [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("Boutique B2B","#")],
    "glossaire.html":                [("Accueil","/"), ("Engagements","/sitemap.html#engagements"), ("Glossaire","#")],
    # Solutions hub
    "solutions/index.html":          [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Solutions","#")],
    "solutions/configurateur.html":  [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Solutions","/solutions/"), ("Configurateur","#")],
    "solutions/calculateur.html":    [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Solutions","/solutions/"), ("Calculateur ROI","#")],
    # Operateurs
    "operateurs/index.html":         [("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Atlas","/data/atlas.html"), ("Opérateurs","#")],
    "operateurs/cnpcic.html":        [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Opérateurs","/operateurs/"), ("CNPCIC","#")],
    "operateurs/perenco.html":       [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Opérateurs","/operateurs/"), ("Perenco","#")],
    "operateurs/sht.html":           [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Opérateurs","/operateurs/"), ("SHT","#")],
    "operateurs/cotco-totco.html":   [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Opérateurs","/operateurs/"), ("COTCO/TOTCO","#")],
    "operateurs/srn.html":           [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Opérateurs","/operateurs/"), ("SRN","#")],
    # Pourquoi
    "pourquoi/manifeste.html":       [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Manifeste DG","#")],
    "pourquoi/manifeste-immersif/index.html":[("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Manifeste DG","/pourquoi/manifeste.html"), ("Vision immersive","#")],
    "pourquoi/positionnement.html":  [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Positionnement","#")],
    "pourquoi/trajectoire.html":     [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Trajectoire 2026-2030","#")],
    "pourquoi/equipe.html":          [("Accueil","/"), ("Mission","/sitemap.html#mission"), ("Équipe & leadership","#")],
    # Data
    "data/atlas.html":               [("Accueil","/"), ("Atlas","#")],
    "data/oleoduc-3d.html":          [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Pipeline 3D Doba-Kribi","#")],
    "data/observatoire.html":        [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Observatoire marché","#")],
    "data/dashboard.html":           [("Accueil","/"), ("Atlas","/data/atlas.html"), ("Dashboard public","#")],
    "data/index.html":               [("Accueil","/"), ("Atlas","#")],
    "intermediaire/pipeline-360-demo/index.html":[("Accueil","/"), ("Activités","/sitemap.html#activites"), ("Intermédiaire","/intermediaire/"), ("Pipeline 360°","#")],
    # Engagement
    "engagement/transparence.html":  [("Accueil","/"), ("Engagements","/sitemap.html#engagements"), ("Transparence ESG · ITIE","#")],
    "engagement/contact.html":       [("Accueil","/"), ("Engagements","/sitemap.html#engagements"), ("Contact","#")],
    "engagement/presse.html":        [("Accueil","/"), ("Engagements","/sitemap.html#engagements"), ("Presse · Médias","#")],
    "engagement/investisseurs.html": [("Accueil","/"), ("Investisseurs","/sitemap.html#investisseurs"), ("Tour 2026","#")],
    # Legal
    "legal/mentions-legales.html":   [("Accueil","/"), ("Légal","#"), ("Mentions légales","#")],
    "legal/confidentialite.html":    [("Accueil","/"), ("Légal","#"), ("Confidentialité","#")],
    "legal/cookies.html":            [("Accueil","/"), ("Légal","#"), ("Cookies","#")],
}

# EN equivalents
CRUMBS_EN = {
    "en/amont/index.html":           [("Home","/en/"), ("Activities","/en/sitemap.html#activities"), ("Upstream","#")],
    "en/intermediaire/index.html":   [("Home","/en/"), ("Activities","/en/sitemap.html#activities"), ("Midstream","#")],
    "en/aval/index.html":            [("Home","/en/"), ("Activities","/en/sitemap.html#activities"), ("Downstream","#")],
    "en/petrochimie/index.html":     [("Home","/en/"), ("Activities","/en/sitemap.html#activities"), ("Petrochemicals","#")],
    "en/technologies/index.html":    [("Home","/en/"), ("Technologies","/en/sitemap.html#technologies"), ("Tech hub","#")],
    "en/energies/index.html":        [("Home","/en/"), ("Transition","/en/sitemap.html#transition"), ("Energies","#")],
    "en/hse/index.html":             [("Home","/en/"), ("Commitments","/en/sitemap.html#commitments"), ("HSE","#")],
    "en/stations/index.html":        [("Home","/en/"), ("Transition","/en/sitemap.html#transition"), ("Stations","#")],
    "en/marques/index.html":         [("Home","/en/"), ("Investors","/en/sitemap.html#investors"), ("6 brands™","#")],
    "en/talents/index.html":         [("Home","/en/"), ("Mission","/en/sitemap.html#mission"), ("Talents · LCD","#")],
    "en/sourcing-africain/index.html":[("Home","/en/"), ("Mission","/en/sitemap.html#mission"), ("Africa sourcing","#")],
    "en/sustainability/index.html":  [("Home","/en/"), ("Commitments","/en/sitemap.html#commitments"), ("Sustainability","#")],
    "en/mythos/index.html":          [("Home","/en/"), ("Mission","/en/sitemap.html#mission"), ("Mythos","#")],
    "en/ai-concierge/index.html":    [("Home","/en/"), ("Investors","/en/sitemap.html#investors"), ("AI Concierge","#")],
    "en/dataroom/index.html":        [("Home","/en/"), ("Investors","/en/sitemap.html#investors"), ("Dataroom NDA","#")],
    "en/about/index.html":           [("Home","/en/"), ("Mission","/en/sitemap.html#mission"), ("About","#")],
    "en/solutions/index.html":       [("Home","/en/"), ("Activities","/en/sitemap.html#activities"), ("Solutions","#")],
    "en/operateurs/cnpcic.html":     [("Home","/en/"), ("Atlas","/en/data/atlas.html"), ("Operators"," #"), ("CNPCIC","#")],
    "en/data/atlas.html":            [("Home","/en/"), ("Atlas","#")],
    "en/pourquoi/manifeste.html":    [("Home","/en/"), ("Mission","/en/sitemap.html#mission"), ("CEO Manifesto","#")],
    "en/boutique/index.html":        [("Home","/en/"), ("Investors","/en/sitemap.html#investors"), ("B2B Shop","#")],
    "en/engagement/investisseurs.html":[("Home","/en/"), ("Investors","/en/sitemap.html#investors"), ("Tour 2026","#")],
    "en/engagement/transparence.html":[("Home","/en/"), ("Commitments","/en/sitemap.html#commitments"), ("Transparency · EITI","#")],
}

CRUMBS = {**CRUMBS_FR, **CRUMBS_EN}

def build_breadcrumb_html(crumbs):
    items = []
    for i, (label, href) in enumerate(crumbs):
        if i == len(crumbs) - 1:
            items.append(f'<li aria-current="page">{label}</li>')
        else:
            items.append(f'<li><a href="{href}">{label}</a></li>')
    return f'''
  <!-- R146 · Breadcrumb -->
  <nav class="bc-r146" aria-label="Fil d'ariane">
    <ol>
      {chr(10).join("      " + i for i in items)}
    </ol>
  </nav>
'''

def build_jsonld(crumbs, page_url):
    items = []
    for i, (label, href) in enumerate(crumbs):
        url = SITE + href if href != "#" else page_url
        items.append({
            "@type": "ListItem",
            "position": i + 1,
            "name": label.replace("&trade;", "™").replace("&amp;", "&"),
            "item": url
        })
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    }

n_bc = 0
n_jsonld = 0
n_btt = 0

for html in ROOT.rglob("*.html"):
    if any(p in SKIP_DIRS for p in html.parts): continue
    rel = str(html.relative_to(ROOT))
    if rel in SKIP_PAGES: continue
    try:
        c = html.read_text(encoding="utf-8")
    except: continue
    new_c = c
    has_header = 'class="hu-header"' in new_c

    # 1) Inject CSS link if missing (UX R146)
    if 'ux-r146.css' not in new_c:
        if 'header-ultra.css' in new_c:
            new_c = new_c.replace(
                '<link rel="stylesheet" href="/assets/css/header-ultra.css',
                CSS_LINK + '\n<link rel="stylesheet" href="/assets/css/header-ultra.css',
                1
            )

    # 2) Inject Back-to-top JS if header is present
    if has_header and 'ux-r146.js' not in new_c and '</body>' in new_c:
        new_c = new_c.replace('</body>', '  ' + JS_TAG + '\n</body>', 1)
        n_btt += 1

    # 3) Inject Breadcrumb HTML + JSON-LD if mapped + has header
    if rel in CRUMBS and has_header:
        crumbs = CRUMBS[rel]
        # 3a) HTML breadcrumb after </header>
        if 'class="bc-r146"' not in new_c:
            bc_html = build_breadcrumb_html(crumbs)
            # Insert after the closing </header> of hu-header
            new_c = re.sub(r'(</header>\s*<aside class="hu-drawer)', f'</header>\n{bc_html}\n<aside class="hu-drawer', new_c, count=1)
            n_bc += 1
        # 3b) JSON-LD BreadcrumbList in head
        if 'BreadcrumbList' not in new_c[:6000]:
            page_url = SITE + "/" + rel.replace("index.html", "").rstrip("/")
            ld = build_jsonld(crumbs, page_url)
            ld_tag = f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False, separators=(",", ":"))}</script>'
            if '</head>' in new_c:
                new_c = new_c.replace('</head>', f'  {ld_tag}\n</head>', 1)
                n_jsonld += 1

    if new_c != c:
        html.write_text(new_c, encoding="utf-8")

print(f"=== R146 SUMMARY ===")
print(f"Breadcrumbs HTML injected     : {n_bc} pages")
print(f"JSON-LD BreadcrumbList        : {n_jsonld} pages")
print(f"Back-to-top JS                : {n_btt} pages")
