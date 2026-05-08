#!/usr/bin/env python3
"""
R105 · Strip all hero sections cross-pages
DG mandate "delete all hero"

Cibles : <section class="...hero..."> + section-banner + wr-hero + sustain-hero + mythos-hero + mq-hero
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_preview_build", "_scripts", "_workers", "node_modules", "v3", "_archive"}


# Strip <section class="...HERO/section-banner..."> ... </section>
HERO_PATTERNS = [
    # hero-2026 (index.html · main hero)
    re.compile(r'<section\s+class="hero-2026"[^>]*>.*?</section>\s*', re.DOTALL | re.IGNORECASE),
    # section-banner generic (poles + hero-pole-modern)
    re.compile(r'<section\s+class="section\s+section-banner[^"]*"[^>]*>.*?</section>\s*', re.DOTALL | re.IGNORECASE),
    # wr-hero (war room dashboard)
    re.compile(r'<header\s+class="wr-hero"[^>]*>.*?</header>\s*', re.DOTALL | re.IGNORECASE),
    # sustain-hero
    re.compile(r'<section\s+class="sustain-hero"[^>]*>.*?</section>\s*', re.DOTALL | re.IGNORECASE),
    # mythos-hero
    re.compile(r'<section\s+class="mythos-hero"[^>]*>.*?</section>\s*', re.DOTALL | re.IGNORECASE),
    # mq-hero (manifeste-immersif)
    re.compile(r'<section\s+class="mq-hero"[^>]*>.*?</section>\s*', re.DOTALL | re.IGNORECASE),
    # generic class="...hero..." sections
    re.compile(r'<section\s+class="[^"]*\bhero\b[^"]*"[^>]*>.*?</section>\s*', re.DOTALL | re.IGNORECASE),
]


def process_file(path: Path, dry_run: bool = False) -> int:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return 0

    original = content
    n = 0
    for pat in HERO_PATTERNS:
        new, k = pat.subn("", content)
        n += k
        content = new

    if content != original and not dry_run:
        path.write_text(content, encoding="utf-8")

    return n


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R105 · Strip all hero sections ===")
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
            print(f"  ✓ {rel}  ({n} hero sections)")

    print()
    print(f"=== SUMMARY ===")
    print(f"Files modifiés : {n_files}/{len(html_files)}")
    print(f"Hero stripped : {n_total}")


if __name__ == "__main__":
    main()
