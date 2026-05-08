#!/usr/bin/env python3
"""R128 · Convert hardcoded J-151 → <span data-jn>J-151</span> + inject jn-counter.js
Idempotent: skip files already updated."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JN_SCRIPT_TAG = '<script defer src="/assets/js/jn-counter.js?v=r128"></script>'

# Matches J-151, J-150, J-149 etc. but NOT inside data-jn attribute or already wrapped span
JN_PATTERN = re.compile(r'(?<!data-jn[">])J-1[0-9]{2}(?![">]|</span>)')

def process(path: Path):
    if not path.is_file(): return None
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return None
    original = content
    # 1) Wrap occurrences (only if not already wrapped)
    if 'data-jn' not in content:
        content = JN_PATTERN.sub(r'<span data-jn>\g<0></span>', content)
    # 2) Inject script tag before </body> if missing
    if 'jn-counter.js' not in content and '</body>' in content:
        content = content.replace('</body>', f'  {JN_SCRIPT_TAG}\n</body>', 1)
    if content != original:
        path.write_text(content, encoding="utf-8")
        return True
    return False

def main():
    print("=== R128 · J-N dynamic counter wiring ===\n")
    SKIP = {"_archive", "_preview_build", "_scripts", "_workers", "v3", "node_modules"}
    n_changed = 0
    n_total = 0
    for html in ROOT.rglob("*.html"):
        if any(part in SKIP for part in html.parts):
            continue
        n_total += 1
        result = process(html)
        if result:
            n_changed += 1
            print(f"  ✓ {html.relative_to(ROOT)}")
    print(f"\n=== SUMMARY ===")
    print(f"Pages scannées : {n_total}")
    print(f"Pages mises à jour : {n_changed}")

if __name__ == "__main__":
    main()
