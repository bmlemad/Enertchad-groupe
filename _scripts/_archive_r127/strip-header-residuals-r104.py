#!/usr/bin/env python3
"""
R104 · Strip header residuals
- HTML comments `<!-- HEADER... -->` cross-pages
- "Lightweight header for immersive mode"
- "Reading progress bar (major O&G style)"
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_preview_build", "_scripts", "_workers", "node_modules", "v3", "_archive"}


PATTERNS = [
    re.compile(r"<!--\s*HEADER\s+v(10|11)[^>]*-->\s*", re.IGNORECASE),
    re.compile(r"<!--\s*Lightweight header for immersive mode\s*-->\s*", re.IGNORECASE),
    re.compile(r"<!--\s*Reading progress bar \(major O&G style\)\s*-->\s*", re.IGNORECASE),
]


def process_file(path: Path, dry_run: bool = False) -> int:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return 0

    original = content
    n = 0
    for pat in PATTERNS:
        new, k = pat.subn("", content)
        n += k
        content = new

    if content != original and not dry_run:
        path.write_text(content, encoding="utf-8")

    return n


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R104 · Strip header residuals ===")
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
            print(f"  ✓ {rel}  ({n} comments)")

    print()
    print(f"=== SUMMARY ===")
    print(f"Files modifiés : {n_files}/{len(html_files)}")
    print(f"Comments retirés : {n_total}")


if __name__ == "__main__":
    main()
