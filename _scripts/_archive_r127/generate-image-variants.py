#!/usr/bin/env python3
"""
R93 · Pack P1 Images · Generate responsive image variants
Pour chaque webp dans assets/images/, créer variantes -640 et -1024 pour srcset.
"""
from pathlib import Path
import sys

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "images"

VARIANTS = [
    (640, "-640"),
    (1024, "-1024"),
]

# Quality settings
WEBP_QUALITY = 85


def process(src: Path) -> list[str]:
    """Generate variants for one source image. Returns list of created paths."""
    created = []
    try:
        img = Image.open(src)
    except Exception as e:
        print(f"  ERROR opening {src.name}: {e}")
        return created

    orig_w, orig_h = img.size
    print(f"  {src.name}  ({orig_w}x{orig_h}, {src.stat().st_size//1024} KB)")

    for target_w, suffix in VARIANTS:
        if target_w >= orig_w:
            print(f"    skip {suffix} (orig {orig_w} ≤ target {target_w})")
            continue

        new_h = int(orig_h * target_w / orig_w)
        out_path = src.parent / f"{src.stem}{suffix}{src.suffix}"

        if out_path.exists():
            print(f"    exists {out_path.name}")
            created.append(out_path.name)
            continue

        try:
            resized = img.resize((target_w, new_h), Image.LANCZOS)
            # Save as webp
            resized.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
            sz = out_path.stat().st_size // 1024
            print(f"    + {out_path.name} ({target_w}x{new_h}, {sz} KB)")
            created.append(out_path.name)
        except Exception as e:
            print(f"    ERROR creating {out_path.name}: {e}")

    return created


def main():
    print(f"=== R93 · Generate Image Variants ===")
    print(f"Source: {IMG_DIR}")
    print()

    sources = sorted([
        p for p in IMG_DIR.glob("*.webp")
        if "-640" not in p.name and "-1024" not in p.name
    ])

    print(f"Found {len(sources)} source images")
    print()

    all_created = []
    for src in sources:
        created = process(src)
        all_created.extend(created)
        print()

    print(f"=== SUMMARY ===")
    print(f"Variants created/verified: {len(all_created)}")


if __name__ == "__main__":
    main()
