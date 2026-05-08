#!/usr/bin/env python3
"""R131 · Bump cache busters cross-pages
- enertchad.css?v=r125 → r130
- sitemap.html v=r121 → r130
- page-statement.css?v=r113 → r130 (homogénéise le sweep)
Idempotent."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {"_archive", "_preview_build", "_scripts", "_workers", "v3", "node_modules"}

REPLACEMENTS = [
    (re.compile(r'enertchad\.css\?v=r12[1-5]'), 'enertchad.css?v=r130'),
    (re.compile(r'enertchad\.css\?v=r1[01]\d'), 'enertchad.css?v=r130'),
    (re.compile(r'page-statement\.css\?v=r11[3-9]'), 'page-statement.css?v=r130'),
    (re.compile(r'page-statement\.css\?v=r12\d'), 'page-statement.css?v=r130'),
]

n_changed = 0
for html in ROOT.rglob("*.html"):
    if any(p in SKIP for p in html.parts): continue
    try:
        c = html.read_text(encoding="utf-8")
    except: continue
    new_c = c
    for pat, rep in REPLACEMENTS:
        new_c = pat.sub(rep, new_c)
    if new_c != c:
        html.write_text(new_c, encoding="utf-8")
        n_changed += 1
        print(f"  ✓ {html.relative_to(ROOT)}")

print(f"\n=== SUMMARY ===\nPages bumped : {n_changed}")
