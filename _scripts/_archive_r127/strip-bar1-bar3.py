#!/usr/bin/env python3
"""
R94 · Suppression Bar 1 (utility/ticker) + Bar 3 (breadcrumb)
Garde uniquement Bar 2 (main nav · brand + 7 nav + Tour pill + drawer)

Mandat DG : "delete all navigations except the main nav"

Strip targets :
  - <div class="hv11-top">...</div>          (à l'intérieur de <header class="hv11-shell">)
  - <div class="hv11-context">...</div>      (souvent sibling après </header>)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_preview_build", "_scripts", "_workers", "node_modules", "v3"}


def strip_bar1(content: str) -> tuple[str, bool]:
    """Remove <div class="hv11-top">...</div> block (greedy until matching </div>)."""
    # Bar 1 has nested divs (3 levels deep) so we need to count manually.
    # Pattern: starts with <div class="hv11-top"> and ends just before <div class="hv11-main">
    pattern = re.compile(
        r'<div\s+class="hv11-top">.*?(?=<div\s+class="hv11-main">)',
        re.DOTALL | re.IGNORECASE,
    )
    new, n = pattern.subn("", content)
    return new, n > 0


def strip_bar3(content: str) -> tuple[str, bool]:
    """Remove <div class="hv11-context">...</div> block."""
    # Bar 3 has nested divs but ends right before </header> (or right after) depending on structure
    # Pattern: <div class="hv11-context"> ... </div> </div> </header>  or  </header>...<div class="hv11-context">...</div>
    # Simpler: count divs from start tag
    pattern = re.compile(
        r'\s*<div\s+class="hv11-context">.*?</div>\s*</div>\s*(?=</header>)',
        re.DOTALL | re.IGNORECASE,
    )
    new, n = pattern.subn("\n", content)
    if n > 0:
        return new, True

    # Alternative pattern: bar3 is sibling AFTER </header>
    pattern2 = re.compile(
        r'\s*<div\s+class="hv11-context">.*?\n\s*</div>\s*\n',
        re.DOTALL | re.IGNORECASE,
    )
    new, n = pattern2.subn("\n", content)
    return new, n > 0


def process_file(path: Path, dry_run: bool = False) -> tuple[bool, bool, bool]:
    """Returns (modified, bar1_stripped, bar3_stripped)."""
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return False, False, False

    original = content
    bar1_stripped = False
    bar3_stripped = False

    if 'class="hv11-top"' in content:
        content, bar1_stripped = strip_bar1(content)

    if 'class="hv11-context"' in content:
        content, bar3_stripped = strip_bar3(content)

    if content != original:
        if not dry_run:
            path.write_text(content, encoding="utf-8")
        return True, bar1_stripped, bar3_stripped

    return False, False, False


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R94 · Strip Bar 1 + Bar 3 ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print()

    html_files = []
    for p in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        if p.name in {"header-v11-preview.html", "header-v11-comparison.html"}:
            continue
        html_files.append(p)

    print(f"Scanning {len(html_files)} HTML files...")
    print()

    n_mod = 0
    n_bar1 = 0
    n_bar3 = 0
    for path in sorted(html_files):
        mod, bar1, bar3 = process_file(path, dry_run)
        if mod:
            n_mod += 1
            n_bar1 += int(bar1)
            n_bar3 += int(bar3)
            rel = path.relative_to(ROOT)
            tags = []
            if bar1:
                tags.append("bar1")
            if bar3:
                tags.append("bar3")
            print(f"  ✓ {rel}  [{' + '.join(tags)}]")

    print()
    print(f"=== SUMMARY ===")
    print(f"Pages modifiées : {n_mod}/{len(html_files)}")
    print(f"Bar 1 stripped  : {n_bar1}")
    print(f"Bar 3 stripped  : {n_bar3}")


if __name__ == "__main__":
    main()
