#!/usr/bin/env python3
"""
R99 · Strip 3 nav-like bars
DG mandate : "delete header" + "delete nav1, nav 2, nav 3"

Cibles :
  1. .positioning-banner (top <main> 14 pages)
  2. .hero-2026-brand-row (logo + Tour chip · index.html)
  3. .hero-2026-dateline (kicker date · index.html)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_preview_build", "_scripts", "_workers", "node_modules", "v3", "_archive"}


# 1. Strip positioning-banner block
POS_BANNER = re.compile(
    r'\s*<div\s+class="positioning-banner"[^>]*>.*?</div>\s*</div>\s*',
    re.DOTALL | re.IGNORECASE,
)
POS_BANNER_ALT = re.compile(
    r'\s*<div\s+class="positioning-banner"[^>]*>.*?</div>\s*',
    re.DOTALL | re.IGNORECASE,
)

# 2. Strip hero-2026-brand-row
BRAND_ROW = re.compile(
    r'\s*<div\s+class="hero-2026-brand-row"[^>]*>.*?</div>\s*</div>\s*',
    re.DOTALL | re.IGNORECASE,
)

# 3. Strip hero-2026-dateline (single span)
DATELINE = re.compile(
    r'\s*<span\s+class="hero-2026-dateline"[^>]*>.*?</span>\s*',
    re.DOTALL | re.IGNORECASE,
)


def process_file(path: Path, dry_run: bool = False) -> dict:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return {"error": True}

    original = content
    counts = {"banner": 0, "brand_row": 0, "dateline": 0}

    new, n = POS_BANNER.subn("", content)
    counts["banner"] = n
    if n == 0:
        new, n = POS_BANNER_ALT.subn("", content)
        counts["banner"] = n
    content = new

    new, n = BRAND_ROW.subn("", content)
    counts["brand_row"] = n
    content = new

    new, n = DATELINE.subn("", content)
    counts["dateline"] = n
    content = new

    if content != original and not dry_run:
        path.write_text(content, encoding="utf-8")

    counts["modified"] = content != original
    return counts


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R99 · Strip 3 nav-like bars ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print()

    html_files = []
    for p in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        html_files.append(p)

    print(f"Scanning {len(html_files)} HTML files...")
    print()

    totals = {"banner": 0, "brand_row": 0, "dateline": 0, "files": 0}
    for path in sorted(html_files):
        c = process_file(path, dry_run)
        if c.get("modified"):
            totals["files"] += 1
            totals["banner"] += c["banner"]
            totals["brand_row"] += c["brand_row"]
            totals["dateline"] += c["dateline"]
            rel = path.relative_to(ROOT)
            tags = []
            for k in ("banner", "brand_row", "dateline"):
                if c[k] > 0:
                    tags.append(f"{k}:{c[k]}")
            print(f"  ✓ {rel}  [{' '.join(tags)}]")

    print()
    print(f"=== TOTAUX ===")
    print(f"Files modifiés       : {totals['files']}/{len(html_files)}")
    print(f"positioning-banner   : {totals['banner']}")
    print(f"hero-2026-brand-row  : {totals['brand_row']}")
    print(f"hero-2026-dateline   : {totals['dateline']}")


if __name__ == "__main__":
    main()
