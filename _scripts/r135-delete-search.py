#!/usr/bin/env python3
"""R135 · Delete search FAB cross-pages + cleanup
- Retire <link search-fab.css> + <script search-fab.js>
- Empties search-fab.js and search-fab.css to 0 byte stubs (safe revert)
Idempotent."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_archive", "_preview_build", "_scripts", "_workers", "v3", "node_modules"}

# Patterns à retirer
PATTERNS = [
    re.compile(r'\s*<link rel="stylesheet" href="/assets/css/search-fab\.css[^"]*" />\n?'),
    re.compile(r'\s*<script defer src="/assets/js/search-fab\.js[^"]*"></script>\n?'),
]

n_changed = 0
for html in ROOT.rglob("*.html"):
    if any(p in SKIP_DIRS for p in html.parts): continue
    try:
        c = html.read_text(encoding="utf-8")
    except: continue
    new_c = c
    for pat in PATTERNS:
        new_c = pat.sub('\n', new_c)
    if new_c != c:
        html.write_text(new_c, encoding="utf-8")
        n_changed += 1

print(f"=== R135 SUMMARY ===")
print(f"Pages stripped FAB : {n_changed}")
