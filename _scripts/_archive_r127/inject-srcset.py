#!/usr/bin/env python3
"""
R93 · Pack P1 Images · Inject srcset hints on existing <img> tags
Pour chaque <img src="/assets/images/X.webp">, ajoute srcset 640w + 1024w + 2400w
si variantes disponibles. Idempotent : skip si srcset déjà présent.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "images"

# Discover available variants
def available_widths(stem: str) -> list[int]:
    widths = []
    if (IMG_DIR / f"{stem}-640.webp").exists():
        widths.append(640)
    if (IMG_DIR / f"{stem}-1024.webp").exists():
        widths.append(1024)
    return widths


# Match <img ...> tags with src pointing to /assets/images/*.webp
# Avoid those that already have srcset
IMG_PATTERN = re.compile(
    r'<img\b([^>]*?)\bsrc="(/assets/images/([a-z0-9\-]+)\.webp)"([^>]*?)/?>',
    re.IGNORECASE | re.DOTALL,
)


def has_srcset(attrs: str) -> bool:
    return "srcset=" in attrs.lower()


def has_sizes(attrs: str) -> bool:
    return "sizes=" in attrs.lower()


def inject_srcset(match: re.Match) -> str:
    pre = match.group(1)
    src = match.group(2)
    stem = match.group(3)
    post = match.group(4)

    full_attrs = pre + post

    # Skip if already has srcset
    if has_srcset(full_attrs):
        return match.group(0)

    # Get variants
    widths = available_widths(stem)
    if not widths:
        return match.group(0)

    # Build srcset (variants + original at 2400w by default)
    srcset_parts = []
    for w in widths:
        srcset_parts.append(f"/assets/images/{stem}-{w}.webp {w}w")
    srcset_parts.append(f"{src} 2400w")
    srcset = ", ".join(srcset_parts)

    # Default sizes hint: full width on mobile, half on desktop
    sizes_attr = ""
    if not has_sizes(full_attrs):
        sizes_attr = ' sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px"'

    # Reconstruct tag — preserve all original attrs, append srcset+sizes
    new_tag = f'<img{pre}src="{src}"{post} srcset="{srcset}"{sizes_attr}>'
    # Clean potential double-space
    new_tag = re.sub(r"\s+>", ">", new_tag)
    new_tag = re.sub(r"\s{2,}", " ", new_tag)

    return new_tag


def process_file(path: Path, dry_run: bool = False) -> int:
    """Returns number of <img> tags modified."""
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return 0

    count = [0]

    def counter(m):
        result = inject_srcset(m)
        if result != m.group(0):
            count[0] += 1
        return result

    new_content = IMG_PATTERN.sub(counter, content)

    if count[0] > 0 and not dry_run:
        path.write_text(new_content, encoding="utf-8")

    return count[0]


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R93 · Inject srcset ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print()

    excluded_dirs = {"_preview_build", "_scripts", "v3", "node_modules", "_archive"}
    html_files = []
    for p in ROOT.rglob("*.html"):
        rel = p.relative_to(ROOT)
        if any(part in excluded_dirs for part in rel.parts):
            continue
        html_files.append(p)

    print(f"Scanning {len(html_files)} HTML files...")
    print()

    total_imgs = 0
    pages_modified = 0
    for path in sorted(html_files):
        n = process_file(path, dry_run)
        if n > 0:
            pages_modified += 1
            total_imgs += n
            rel = path.relative_to(ROOT)
            print(f"  ✓ {rel}  ({n} img)")

    print()
    print(f"=== SUMMARY ===")
    print(f"Pages modified : {pages_modified}/{len(html_files)}")
    print(f"<img> updated  : {total_imgs}")


if __name__ == "__main__":
    main()
