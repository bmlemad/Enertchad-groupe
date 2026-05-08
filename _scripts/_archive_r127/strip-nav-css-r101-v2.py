#!/usr/bin/env python3
"""
R101 v2 · Aggressive sweep · also handle compound selectors split across lines
"""
import re
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "assets/css/enertchad.css"

FORBIDDEN = [
    "site-header", "utility-nav", "nav-v9", "nav-v8",
    "persona-bar", "mega-panel", "mega-menu", "mega-bg",
    "mega-col", "mega-grid", "drawer-", "investor-ticker",
    "brand-bar", "mobile-nav", "bottom-nav", "breadcrumb",
    "subnav", "header-v10", "header-v11", "hero-launchpad",
    "hero-lp-", "hero-cinematic", "positioning-banner",
    "topbar-personas", "tour-pill", "v11-nav", "hv11-",
]


def strip_v2(content: str) -> tuple[str, int]:
    """Walk char-by-char tracking brace depth · skip rules whose selector
    text (everything before {) contains a forbidden token."""
    out = []
    i = 0
    n = len(content)
    n_stripped = 0

    while i < n:
        # Find next '{' or '}'
        j = i
        while j < n and content[j] != "{":
            j += 1
        if j >= n:
            out.append(content[i:])
            break

        selector_block = content[i:j]
        # Determine if this is at depth 0
        # Count braces in `out` so far minus closers
        # (assume we've maintained balance since last write)

        # Check if selector_block (or its trailing portion before {) contains a forbidden token
        # Take the last "rule chunk" — split by '}' and take last part
        last_chunk = selector_block.rsplit("}", 1)[-1]
        # Strip @ rules — keep them
        last_lower = last_chunk.lower()
        is_at_rule = re.match(r"\s*@", last_chunk)

        if not is_at_rule and any(tok.lower() in last_lower for tok in FORBIDDEN):
            # This rule is dead. Find matching }
            depth = 1
            k = j + 1
            while k < n and depth > 0:
                if content[k] == "{":
                    depth += 1
                elif content[k] == "}":
                    depth -= 1
                k += 1
            # Include the just-finished } in skip
            # Output the prefix BEFORE this rule's selector (preceding } + whitespace before our forbidden selector)
            # Find the start of THIS rule's selector text
            # selector_block starts at i and the last } is the boundary
            last_close = selector_block.rfind("}")
            if last_close >= 0:
                # Output up to and including the previous }
                out.append(content[i : i + last_close + 1])
            # Skip this rule entirely
            i = k
            n_stripped += 1
            continue

        # Keep this rule · output up to and including the {
        out.append(content[i : j + 1])
        # Find matching } and copy
        depth = 1
        k = j + 1
        while k < n and depth > 0:
            if content[k] == "{":
                depth += 1
            elif content[k] == "}":
                depth -= 1
            k += 1
        out.append(content[j + 1 : k])
        i = k

    return "".join(out), n_stripped


def main():
    content = CSS.read_text(encoding="utf-8")
    print(f"Avant : {len(content.split(chr(10)))} lignes · {content.count('{')}/{content.count('}')} braces")

    new, n = strip_v2(content)
    print(f"Stripped : {n} additional rules")
    print(f"Après : {len(new.split(chr(10)))} lignes · {new.count('{')}/{new.count('}')} braces")

    if new.count("{") == new.count("}"):
        CSS.write_text(new, encoding="utf-8")
        print("✓ written")
    else:
        print("⚠ brace imbalance · not writing")


if __name__ == "__main__":
    main()
