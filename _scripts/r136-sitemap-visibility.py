#!/usr/bin/env python3
"""R136 · Improve sitemap visibility cross-pages
1) Add sitemap link to EN canon footer (was missing)
2) Add 'Plan du site' link to footer-mini variants
Idempotent."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_archive", "_preview_build", "_scripts", "_workers", "v3", "node_modules"}

n_en_added = 0
n_mini_added = 0

# 1) EN canon footer — add sitemap link before closing </div> of footer-legal-v2
EN_LEGAL_OLD = '''<div class="footer-legal-v2">
        <span>© <span data-year>2026</span> EnerTchad SA</span>
        <span>·</span>
        <span>RCCM N&rsquo;DJ/RC/2026-A-0001</span>
        <span>·</span>
        <span>Capital 10,000,000 FCFA</span>
      </div>'''
EN_LEGAL_NEW = '''<div class="footer-legal-v2">
        <span>© <span data-year>2026</span> EnerTchad SA</span>
        <span>·</span>
        <span>RCCM N&rsquo;DJ/RC/2026-A-0001</span>
        <span>·</span>
        <span>Capital 10,000,000 FCFA</span>
        <span>·</span>
        <a href="/en/sitemap.html"><strong>📐 Sitemap</strong></a>
      </div>'''

# 2) footer-mini — add a small Plan du site link before </footer>
MINI_LINK = '''
    <div style="grid-column:1/-1;text-align:center;padding-top:18px;margin-top:18px;border-top:1px solid rgba(255,255,255,0.04);font-size:12px;color:rgba(246,241,230,0.5)">
      <a href="/sitemap.html" style="color:rgba(201,181,123,0.85);text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600">📐 Plan du site · 6 axes nav canon</a>
    </div>
'''

for html in ROOT.rglob("*.html"):
    if any(p in SKIP_DIRS for p in html.parts): continue
    rel = str(html.relative_to(ROOT))
    try:
        c = html.read_text(encoding="utf-8")
    except: continue
    new_c = c
    # 1) EN canon - check if has EN_LEGAL_OLD pattern and not already enriched
    if EN_LEGAL_OLD in new_c and 'href="/en/sitemap.html"><strong>📐 Sitemap' not in new_c:
        new_c = new_c.replace(EN_LEGAL_OLD, EN_LEGAL_NEW, 1)
        n_en_added += 1
    # 2) footer-mini - if has footer-mini class AND doesn't already have sitemap link in mini-link block
    if 'class="footer-mini"' in new_c and '6 axes nav canon' not in new_c:
        # Inject before </footer>
        # Find the closing </div></footer> pattern at the end of footer-mini
        m = re.search(r'(<footer class="footer-mini"[^>]*>.*?)(</div>\s*</footer>)', new_c, re.S)
        if m:
            new_c = new_c.replace(m.group(0), m.group(1) + MINI_LINK + m.group(2), 1)
            n_mini_added += 1
    if new_c != c:
        html.write_text(new_c, encoding="utf-8")

print(f"=== R136 SUMMARY ===")
print(f"EN canon footers · sitemap link added : {n_en_added}")
print(f"footer-mini · Plan du site added       : {n_mini_added}")
