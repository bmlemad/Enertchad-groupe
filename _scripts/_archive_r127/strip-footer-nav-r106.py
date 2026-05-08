#!/usr/bin/env python3
"""
R106 · Strip footer nav-like <ul>/<li> lists
DG mandate "delete main nav" → footer cols Catalogue + Engagement = main nav post-R96

Cible : <div class="footer-col-v2"> contenant <ul>...</ul>
Garde : footer-brand-v2 · footer-newsletter · footer-meta-v2
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_preview_build", "_scripts", "_workers", "node_modules", "v3", "_archive"}


# Strip <div class="footer-col-v2"> blocks with <ul>/<li> (nav-like)
# Pattern : <div class="footer-col-v2"><h4>...</h4><ul>...</ul></div>
PATTERN = re.compile(
    r'\s*<div class="footer-col-v2">\s*<h4>(?!Newsletter)[^<]*</h4>\s*<ul>.*?</ul>\s*</div>\s*',
    re.DOTALL | re.IGNORECASE,
)


def process_file(path: Path, dry_run: bool = False) -> int:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return 0

    original = content
    new, n = PATTERN.subn("\n      ", content)

    if new != original and not dry_run:
        path.write_text(new, encoding="utf-8")

    return n


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R106 · Strip footer nav lists ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print()

    html_files = []
    for p in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        html_files.append(p)

    print(f"Scanning {len(html_files)} HTML files...")
    print()

    n_files = 0
    n_total = 0
    for path in sorted(html_files):
        n = process_file(path, dry_run)
        if n > 0:
            n_files += 1
            n_total += n
            rel = path.relative_to(ROOT)
            print(f"  ✓ {rel}  ({n} cols)")

    print()
    print(f"=== SUMMARY ===")
    print(f"Files modifiés : {n_files}/{len(html_files)}")
    print(f"Footer cols nav stripped : {n_total}")


if __name__ == "__main__":
    main()
