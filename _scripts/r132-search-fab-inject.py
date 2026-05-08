#!/usr/bin/env python3
"""R132 · Inject search-fab CSS + JS cross-pages
- <link> for search-fab.css before enertchad.css
- <script defer> for search-fab.js before </body>
Idempotent : skip if already injected.
SKIP : pages utility (404 · 500 · sitemap · stubs · canvas) — no FAB."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_archive", "_preview_build", "_scripts", "_workers", "v3", "node_modules"}
# Pages where FAB shouldn't appear (utility/standalone)
SKIP_PAGES = {
    "404.html", "500.html", "preview.html", "offline.html",
    "sitemap.html", "en/sitemap.html",
    "header-v11-comparison.html", "header-v11-preview.html",
    "tour-live/dashboard.html",  # full-screen dashboard, no FAB
    "assets/art/Substrat-Vivant.html",  # canvas art
    "atlas/index.html",  # full-screen map
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/search-fab.css?v=r132" />'
JS_TAG = '<script defer src="/assets/js/search-fab.js?v=r132"></script>'

n_changed = 0
n_skip_already = 0
n_skip_intent = 0
n_skip_no_body = 0

for html in ROOT.rglob("*.html"):
    if any(p in SKIP_DIRS for p in html.parts): continue
    rel = str(html.relative_to(ROOT))
    if rel in SKIP_PAGES:
        n_skip_intent += 1
        continue
    try:
        c = html.read_text(encoding="utf-8")
    except: continue
    if 'search-fab.js' in c:
        n_skip_already += 1
        continue
    new_c = c
    # Inject CSS before enertchad.css link
    if 'search-fab.css' not in new_c:
        if '<link rel="stylesheet" href="/assets/css/enertchad.css' in new_c:
            new_c = new_c.replace(
                '<link rel="stylesheet" href="/assets/css/enertchad.css',
                CSS_LINK + '\n<link rel="stylesheet" href="/assets/css/enertchad.css',
                1
            )
    # Inject JS before </body>
    if '</body>' in new_c:
        new_c = new_c.replace('</body>', '  ' + JS_TAG + '\n</body>', 1)
    else:
        n_skip_no_body += 1
        continue
    if new_c != c:
        html.write_text(new_c, encoding="utf-8")
        n_changed += 1

print(f"=== SUMMARY R132 ===")
print(f"Pages injected     : {n_changed}")
print(f"Pages already FAB  : {n_skip_already}")
print(f"Pages intentionally skipped : {n_skip_intent}")
print(f"Pages without </body>       : {n_skip_no_body}")
