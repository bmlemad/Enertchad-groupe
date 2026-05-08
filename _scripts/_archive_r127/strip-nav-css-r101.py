#!/usr/bin/env python3
"""
R101 · Final CSS sweep · strip ALL nav/header orphan rules
DG mandate "cleanup header and all navigations level"

Strategy : line-by-line walker tracks brace depth. Skip rules whose
selector chain contains any forbidden token. Keep everything else.
Handles compound selectors (a.foo, b.bar { ... }), media queries.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS = ROOT / "assets" / "css" / "enertchad.css"

# Forbidden tokens · any selector containing one of these is dead
FORBIDDEN = [
    "site-header",
    "utility-nav",
    "nav-v9",
    "nav-v8",
    "nav-v7",
    "persona-bar",
    "topbar-personas",
    ".topbar ",
    "topbar{",
    "mega-panel",
    "mega-menu",
    "mega-bg",
    "mega-col",
    "mega-grid",
    "drawer-",
    ".drawer{",
    ".drawer ",
    "investor-ticker",
    "brand-bar",
    "mobile-nav",
    "bottom-nav",
    "breadcrumb",
    "subnav",
    "header-v10",
    "header-v11",
    "hero-launchpad",
    "hero-lp-",
    "hero-cinematic",
    "hero-photo-layer",
    "hero-particles",
    "hero-beam",
    "positioning-banner",
    "scroll-tracer",
    "scroll-progress",
    "tour-pill",
    "hv11-",
    "v11-nav",
]


def selector_is_forbidden(line: str) -> bool:
    """Check if a CSS selector line contains forbidden tokens."""
    low = line.lower()
    for token in FORBIDDEN:
        if token.lower() in low:
            return True
    return False


def strip_dead_rules(content: str) -> tuple[str, int]:
    """Walk lines, track brace depth, skip top-level forbidden rules."""
    lines = content.split("\n")
    out = []
    i = 0
    n_stripped = 0
    while i < len(lines):
        line = lines[i]
        # Look for selector start: a line opening a rule (contains '{' but
        # not as part of @media etc.)
        # Heuristic: line at depth 0 that ends with '{' and has selector text
        # is a potential rule.
        stripped = line.strip()
        if "{" in line and not stripped.startswith("@") and not stripped.startswith("/*"):
            # Collect full selector (may span multiple lines if comma-broken)
            selector_lines = []
            j = i
            while j < len(lines) and "{" not in lines[j]:
                selector_lines.append(lines[j])
                j += 1
            if j < len(lines):
                selector_lines.append(lines[j])  # line with {
            selector_text = " ".join(selector_lines)

            if selector_is_forbidden(selector_text):
                # Skip whole block · find matching }
                depth = selector_text.count("{") - selector_text.count("}")
                k = j
                while depth > 0 and k + 1 < len(lines):
                    k += 1
                    depth += lines[k].count("{") - lines[k].count("}")
                # Skip lines [i..k]
                n_stripped += 1
                i = k + 1
                continue
        out.append(line)
        i += 1
    return "\n".join(out), n_stripped


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R101 · Final nav/header CSS sweep ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print()

    content = CSS.read_text(encoding="utf-8")
    lines_before = len(content.split("\n"))
    chars_before = len(content)
    opens_before = content.count("{")
    closes_before = content.count("}")

    print(f"Avant : {lines_before} lignes · {chars_before} chars · {opens_before}/{closes_before} braces")
    print()

    new, n = strip_dead_rules(content)
    new_lines = len(new.split("\n"))
    new_chars = len(new)
    new_opens = new.count("{")
    new_closes = new.count("}")

    print(f"Après : {new_lines} lignes · {new_chars} chars · {new_opens}/{new_closes} braces")
    print(f"Stripped : {n} rules / {lines_before - new_lines} lines / {chars_before - new_chars} chars ({(chars_before-new_chars)*100//chars_before}%)")

    if new_opens != new_closes:
        print()
        print(f"⚠ BRACE IMBALANCE · NOT WRITING")
        return

    if not dry_run:
        CSS.write_text(new, encoding="utf-8")
        print(f"✓ {CSS} updated")


if __name__ == "__main__":
    main()
