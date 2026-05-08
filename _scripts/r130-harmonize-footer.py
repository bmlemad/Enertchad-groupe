#!/usr/bin/env python3
"""R130 · Harmoniser footer cross-pages
Canon FR (Group 1, 26 pages) + Canon EN (Group 3, 10 pages) propagés sur les 22 singletons.
SKIP : footer-mini (11 pages spéciales) + NO FOOTER (10 pages utility).
Idempotent : skip si déjà canonique."""
import re, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_archive", "_preview_build", "_scripts", "_workers", "v3", "node_modules"}

# Canon templates (extraits de intermediaire/index.html et en/index.html)
FR_CANON = (ROOT / "intermediaire/index.html").read_text(encoding="utf-8")
EN_CANON_SRC = (ROOT / "en/index.html").read_text(encoding="utf-8")

foot_re = re.compile(r'<footer[^>]*>.*?</footer>', re.S)
FR_FOOTER = foot_re.search(FR_CANON).group(0)
EN_FOOTER = foot_re.search(EN_CANON_SRC).group(0)

FR_HASH = hashlib.md5(re.sub(r'\s+', ' ', FR_FOOTER).strip().encode()).hexdigest()
EN_HASH = hashlib.md5(re.sub(r'\s+', ' ', EN_FOOTER).strip().encode()).hexdigest()

print(f"FR canon size: {len(FR_FOOTER)}b · hash={FR_HASH[:8]}")
print(f"EN canon size: {len(EN_FOOTER)}b · hash={EN_HASH[:8]}\n")

# Cible : pages avec footer NON-canonical AND NON-footer-mini AND NON-empty
n_canon_already = 0
n_mini_skip = 0
n_no_footer_skip = 0
n_replaced = 0
replaced_list = []

for html in ROOT.rglob("*.html"):
    if any(p in SKIP_DIRS for p in html.parts): continue
    rel = html.relative_to(ROOT)
    try:
        c = html.read_text(encoding="utf-8")
    except: continue
    foot_match = foot_re.search(c)
    if not foot_match:
        n_no_footer_skip += 1
        continue
    foot_html = foot_match.group(0)
    foot_norm = re.sub(r'\s+', ' ', foot_html).strip()
    foot_h = hashlib.md5(foot_norm.encode()).hexdigest()
    # Footer-mini → skip (intentionnel)
    if 'footer-mini' in foot_html:
        n_mini_skip += 1
        continue
    # Decide canon based on path
    is_en = str(rel).startswith("en/")
    target_footer = EN_FOOTER if is_en else FR_FOOTER
    target_hash = EN_HASH if is_en else FR_HASH
    # Already canon
    if foot_h == target_hash:
        n_canon_already += 1
        continue
    # Replace
    new_content = c[:foot_match.start()] + target_footer + c[foot_match.end():]
    html.write_text(new_content, encoding="utf-8")
    n_replaced += 1
    replaced_list.append((str(rel), len(foot_html), len(target_footer), is_en))

print("=== SUMMARY ===")
print(f"Canon already   : {n_canon_already}")
print(f"Footer-mini skip: {n_mini_skip}")
print(f"NO footer skip  : {n_no_footer_skip}")
print(f"REPLACED        : {n_replaced}")
print()
print("=== REPLACED LIST ===")
for rel, old_size, new_size, is_en in replaced_list:
    lang = "EN" if is_en else "FR"
    print(f"  {lang} · {rel:55s} · {old_size:5d}b → {new_size:5d}b")

