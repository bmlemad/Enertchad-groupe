#!/usr/bin/env python3
"""
R100 · Strip dead CSS rules from enertchad.css
Cibles : .hero-launchpad · .hero-lp-* · .hero-cinematic-bg · .hero-photo-* ·
.hero-particles · .hero-beam · .positioning-banner
(Tous orphans post R98 hero-2026 + R99 strip positioning-banner markup)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS = ROOT / "assets" / "css" / "enertchad.css"


# Patterns to strip · each is a complete rule including selector + braces
DEAD_SELECTORS = [
    r"\.hero-launchpad",
    r"\.hero-lp-[a-zA-Z0-9_-]+",
    r"\.hero-cinematic-bg",
    r"\.hero-photo-layer",
    r"\.hero-particles",
    r"\.hero-beam",
    r"\.positioning-banner",
]


def strip_rule(content: str, selector_pattern: str) -> tuple[str, int]:
    """Strip CSS rules matching selector_pattern · returns (new_content, count)."""
    # Match: selector(s) optionally combined, then { ... } at top level
    # Simple approach: find each occurrence of selector + closing brace
    n = 0
    new_lines = []
    lines = content.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if line contains the selector AND { (block start)
        sel_re = re.compile(rf"^\s*{selector_pattern}[\s,:.\[\]a-zA-Z0-9_-]*\s*\{{")
        sel_re_combined = re.compile(rf"^\s*{selector_pattern}[a-zA-Z0-9_-]*[\s,]")
        if sel_re.match(line) or sel_re_combined.match(line):
            # Found rule start. Find matching } to skip
            depth = line.count("{") - line.count("}")
            j = i
            while depth > 0 and j + 1 < len(lines):
                j += 1
                depth += lines[j].count("{") - lines[j].count("}")
            # Skip lines [i..j]
            n += 1
            i = j + 1
            continue
        new_lines.append(line)
        i += 1
    return "\n".join(new_lines), n


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R100 · Strip dead CSS ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print(f"Target: {CSS}")
    print()

    content = CSS.read_text(encoding="utf-8")
    original_lines = len(content.split("\n"))
    original_chars = len(content)
    print(f"Avant : {original_lines} lignes · {original_chars} chars")
    print()

    total_stripped = 0
    for sel in DEAD_SELECTORS:
        content, n = strip_rule(content, sel)
        print(f"  {sel}  → {n} rules stripped")
        total_stripped += n

    new_lines = len(content.split("\n"))
    new_chars = len(content)

    print()
    print(f"=== SUMMARY ===")
    print(f"Rules stripped : {total_stripped}")
    print(f"Lines saved    : {original_lines - new_lines}")
    print(f"Chars saved    : {original_chars - new_chars} ({(original_chars-new_chars)*100//original_chars}%)")

    if not dry_run:
        CSS.write_text(content, encoding="utf-8")
        print(f"✓ {CSS} updated")


if __name__ == "__main__":
    main()
