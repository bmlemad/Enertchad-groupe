#!/usr/bin/env python3
"""
R93 · Pack P1 Images · Normalisation OG Images canon
Standardise toutes les balises og:image vers https://enertchad.td/assets/images/...
avec mapping sémantique par section pour le bon hero.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://enertchad.td"

# Mapping section → image canon
# Order matters - longest match first
SECTION_MAP = [
    ("/amont/",          "enertchad-amont-hero-01.webp"),
    ("/intermediaire/",  "enertchad-intermediaire-hero-01.webp"),
    ("/aval/",           "enertchad-aval-hero-01.webp"),
    ("/energies/",       "enertchad-energies-eolien-01.webp"),
    ("/sustainability/", "enertchad-durabilite-acacia-01.webp"),
    ("/durabilite/",     "enertchad-durabilite-acacia-01.webp"),
    ("/talents/",        "enertchad-talents-engineer-01.webp"),
    ("/carrieres/",      "enertchad-talents-engineer-01.webp"),
    ("/careers/",        "enertchad-talents-engineer-01.webp"),
    ("/equipe/",         "enertchad-talents-engineer-01.webp"),
    ("/investisseurs/",  "enertchad-investisseurs-hero.webp"),
    ("/investors/",      "enertchad-investisseurs-hero.webp"),
    ("/tech/",           "enertchad-tech-hero.webp"),
    ("/technologies/",   "enertchad-tech-hero.webp"),
    ("/atlas/",          "enertchad-amont-hero-01.webp"),
    ("/eor/",            "enertchad-eor-acacia-01.webp"),
]

# Available images on disk (validated)
AVAILABLE = {
    "enertchad-accueil-hero-01.webp",
    "enertchad-amont-hero-01.webp",
    "enertchad-aval-hero-01.webp",
    "enertchad-durabilite-acacia-01.webp",
    "enertchad-energies-eolien-01.webp",
    "enertchad-eor-acacia-01.webp",
    "enertchad-intermediaire-pipeline-01.webp",
    "enertchad-talents-engineer-01.webp",
}

DEFAULT = "enertchad-accueil-hero-01.webp"


def pick_image(rel_path: str) -> str:
    """Pick semantic OG image based on URL section."""
    for prefix, img in SECTION_MAP:
        if prefix in rel_path:
            if img not in AVAILABLE:
                # Fallback if mapped image doesn't exist on disk
                if "intermediaire" in img:
                    return "enertchad-intermediaire-pipeline-01.webp"
                if "investisseurs" in img or "tech" in img:
                    return "enertchad-accueil-hero-01.webp"
            return img if img in AVAILABLE else DEFAULT
    return DEFAULT


# Patterns: og:image and twitter:image
OG_IMAGE = re.compile(
    r'<meta\s+property="og:image"\s+content="[^"]*"\s*/?>',
    re.IGNORECASE,
)
TW_IMAGE = re.compile(
    r'<meta\s+name="twitter:image"\s+content="[^"]*"\s*/?>',
    re.IGNORECASE,
)


def process_file(path: Path, dry_run: bool = False) -> tuple[bool, str]:
    """Process one HTML file. Returns (modified, image_used)."""
    try:
        content = path.read_text(encoding="utf-8")
    except Exception as e:
        return False, f"ERROR: {e}"

    rel = "/" + str(path.relative_to(ROOT)).replace("\\", "/")
    img = pick_image(rel)
    canonical_url = f"{DOMAIN}/assets/images/{img}"

    new_og = f'<meta property="og:image" content="{canonical_url}" />'
    new_tw = f'<meta name="twitter:image" content="{canonical_url}" />'

    new_content = OG_IMAGE.sub(new_og, content)
    new_content = TW_IMAGE.sub(new_tw, new_content)

    if new_content != content:
        if not dry_run:
            path.write_text(new_content, encoding="utf-8")
        return True, img

    return False, img


def main():
    dry_run = "--dry-run" in sys.argv
    print(f"=== R93 · OG Images Normalize ===")
    print(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'}")
    print(f"Root: {ROOT}")
    print()

    excluded_dirs = {"_preview_build", "_scripts", "v3", "node_modules"}
    html_files = []
    for p in ROOT.rglob("*.html"):
        rel = p.relative_to(ROOT)
        if any(part in excluded_dirs for part in rel.parts):
            continue
        html_files.append(p)

    print(f"Found {len(html_files)} HTML files (excluding {excluded_dirs})")
    print()

    modified = 0
    by_image: dict[str, int] = {}
    for path in sorted(html_files):
        ok, img = process_file(path, dry_run)
        if ok:
            modified += 1
            by_image[img] = by_image.get(img, 0) + 1
            rel = path.relative_to(ROOT)
            print(f"  ✓ {rel}  →  {img}")

    print()
    print(f"=== SUMMARY ===")
    print(f"Modified: {modified}/{len(html_files)} files")
    print()
    print("Distribution by image:")
    for img, count in sorted(by_image.items(), key=lambda x: -x[1]):
        print(f"  {count:3d}  {img}")


if __name__ == "__main__":
    main()
