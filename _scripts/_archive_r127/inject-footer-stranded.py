#!/usr/bin/env python3
"""
R97 · Inject canon footer aux pages opérateurs stranded
Post-R96 (no header/nav) ces pages n'ont aucune navigation cross-pages.
Le footer est leur seule surface · 0 <nav> élément (compatible R96).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Source canon : extraire le footer de index.html
INDEX = ROOT / "index.html"
content = INDEX.read_text(encoding="utf-8")
m = re.search(r"(<footer[^>]*>.*?</footer>)", content, re.DOTALL)
if not m:
    print("ERROR: cannot extract canon footer from index.html")
    exit(1)

CANON_FOOTER = m.group(1)
print(f"Canon footer extracted: {len(CANON_FOOTER)} chars")
print()

# Pages cibles (stranded post-R96)
TARGETS = [
    "operateurs/index.html",
    "operateurs/cnpcic.html",
    "operateurs/cotco-totco.html",
    "operateurs/perenco.html",
    "operateurs/sht.html",
    "operateurs/srn.html",
    "en/operateurs/cnpcic.html",
]


def inject(rel_path: str) -> bool:
    p = ROOT / rel_path
    if not p.exists():
        print(f"  ✗ {rel_path}  (file missing)")
        return False
    content = p.read_text(encoding="utf-8")
    if "<footer" in content:
        print(f"  ⊙ {rel_path}  (footer already present, skip)")
        return False
    # Inject just before </body>
    new = content.replace("</body>", f"\n{CANON_FOOTER}\n</body>", 1)
    if new == content:
        print(f"  ✗ {rel_path}  (no </body> tag found)")
        return False
    p.write_text(new, encoding="utf-8")
    print(f"  ✓ {rel_path}  (footer injected)")
    return True


def main():
    print("=== R97 · Inject canon footer to stranded pages ===")
    print()
    n = 0
    for t in TARGETS:
        if inject(t):
            n += 1
    print()
    print(f"=== SUMMARY ===")
    print(f"Pages traitées  : {len(TARGETS)}")
    print(f"Footer injecté  : {n}")


if __name__ == "__main__":
    main()
