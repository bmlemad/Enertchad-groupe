#!/usr/bin/env python3
"""
R96 · Suppression totale headers + navs cross-pages
DG mandate : "delete all headers and navs"

Strips :
  1. <header>...</header>           (toute classe · hv11-shell + inline)
  2. <nav>...</nav>                 (toute classe · breadcrumb + subnav + drawer + main)
  3. <div class="hv11-drawer-overlay">...</div>
  4. <link rel="stylesheet" href=".../header-v11.css...">
  5. <script>... (init JS header v11) ...</script>

Archive : _archive/site-v2-pre-R96-strip-headers-navs.tar.gz
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_preview_build", "_scripts", "_workers", "node_modules", "v3", "_archive"}


# Pattern: <header...>...</header> with greedy matching to last </header>
# Use non-greedy + counter to handle nested <header> (rare)
HEADER_RE = re.compile(
    r'<header\b[^>]*>.*?</header>',
    re.DOTALL | re.IGNORECASE,
)

# Pattern: <nav...>...</nav> non-greedy (no nested navs in this codebase based on audit)
NAV_RE = re.compile(
    r'<nav\b[^>]*>.*?</nav>',
    re.DOTALL | re.IGNORECASE,
)

# Pattern: drawer overlay div
DRAWER_RE = re.compile(
    r'<!--[^>]*DRAWER[^>]*-->\s*<div\s+class="hv11-drawer-overlay"[^>]*>.*?</div>\s*',
    re.DOTALL | re.IGNORECASE,
)
DRAWER_RE2 = re.compile(
    r'<div\s+class="hv11-drawer-overlay"[^>]*>.*?</div>\s*',
    re.DOTALL | re.IGNORECASE,
)

# Pattern: header-v11.css link
CSS_LINK_RE = re.compile(
    r'<link\s+[^>]*header-v11\.css[^>]*>\s*',
    re.IGNORECASE,
)

# Pattern: init JS header v11 (heuristic: contains data-drawer-open/data-tour-cd)
INIT_JS_RE = re.compile(
    r'<script>\s*//\s*Header\s+v11\s+init.*?</script>\s*',
    re.DOTALL | re.IGNORECASE,
)
# Alt pattern: any script containing data-drawer-open
INIT_JS_RE2 = re.compile(
    r'<script>[^<]*data-drawer-open[^<]*</script>\s*',
    re.DOTALL | re.IGNORECASE,
)


def process_file(path: Path, dry_run: bool = False) -> dict:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return {"error": True}

    original = content
    counts = {"header": 0, "nav": 0, "drawer": 0, "css_link": 0, "init_js": 0}

    # 1. Strip <header>
    new, n = HEADER_RE.subn("", content)
    counts["header"] = n
    content = new

    # 2. Strip <nav>
    new, n = NAV_RE.subn("", content)
    counts["nav"] = n
    content = new

    # 3. Strip drawer overlay
    new, n = DRAWER_RE.subn("", content)
    counts["drawer"] = n
    if n == 0:
        new, n = DRAWER_RE2.subn("", content)
        counts["drawer"] = n
    content = new

    # 4. Strip CSS link
    new, n = CSS_LINK_RE.subn("", content)
    counts["css_link"] = n
    content = new

    # 5. Strip init JS
    new, n = INIT_JS_RE.subn("", content)
    counts["init_js"] = n
    if n == 0:
        new, n = INIT_JS_RE2.subn("", content)
        counts["init_js"] = n
    content = new

    if content != original and not dry_run:
        path.write_text(content, encoding="utf-8")

    counts["modified"] = content != original
    return counts


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R96 · Strip All Headers + Navs ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print()

    html_files = []
    for p in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        html_files.append(p)

    print(f"Scanning {len(html_files)} HTML files...")
    print()

    totals = {"header": 0, "nav": 0, "drawer": 0, "css_link": 0, "init_js": 0, "files": 0}
    for path in sorted(html_files):
        c = process_file(path, dry_run)
        if c.get("modified"):
            totals["files"] += 1
            for k in ("header", "nav", "drawer", "css_link", "init_js"):
                totals[k] += c[k]
            rel = path.relative_to(ROOT)
            parts = []
            for k in ("header", "nav", "drawer", "css_link", "init_js"):
                if c[k] > 0:
                    parts.append(f"{k}:{c[k]}")
            print(f"  ✓ {rel}  [{' '.join(parts)}]")

    print()
    print(f"=== TOTAUX ===")
    print(f"Files modifiés    : {totals['files']}/{len(html_files)}")
    print(f"<header> retirés  : {totals['header']}")
    print(f"<nav>    retirés  : {totals['nav']}")
    print(f"Drawer overlay    : {totals['drawer']}")
    print(f"CSS link          : {totals['css_link']}")
    print(f"Init JS           : {totals['init_js']}")


if __name__ == "__main__":
    main()
