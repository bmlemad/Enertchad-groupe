#!/usr/bin/env python3
"""
EnerTchad — Sync services catalog from DATA_MASTER.yml to front-end assets.

USAGE
    python3 _sources/tools/sync-services.py            # dry-run (diff only)
    python3 _sources/tools/sync-services.py --apply    # write files

WHAT IT DOES
    1. Reads DATA_MASTER.yml (source of truth).
    2. Extracts services_catalog + services_groups + cta_routes.
    3. Regenerates /assets/data/services.json (machine export).
    4. Validates cross-references (group items ↔ service IDs, cta_routes ↔ services).
    5. Reports drift vs. current services.html anchors.

WHY
    Keeps a single source of truth. Any edit to the services catalog should happen
    in DATA_MASTER.yml only; this script rebuilds downstream artefacts.

EXIT CODES
    0  success (or no-op in dry-run)
    1  validation error (broken cross-refs, missing fields)
    2  I/O error (missing source file, permission denied)
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SRC_YAML = ROOT / "DATA_MASTER.yml"
OUT_JSON = ROOT / "assets" / "data" / "services.json"
HTML_PAGE = ROOT / "services.html"

REQUIRED_SERVICE_KEYS = {
    "id", "slug", "numero", "nom", "nom_court", "pole_parent", "group",
    "anchor", "accent_hex", "accent_hex_light", "resume", "description",
    "sous_services", "technologies", "secteurs", "ctas",
}


def load_yaml(path: Path) -> dict[str, Any]:
    try:
        import yaml  # type: ignore
    except ImportError:
        print("error: PyYAML not installed. Run: pip install pyyaml --break-system-packages",
              file=sys.stderr)
        sys.exit(2)
    if not path.exists():
        print(f"error: {path} not found", file=sys.stderr)
        sys.exit(2)
    with path.open(encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def validate(data: dict[str, Any]) -> list[str]:
    errs: list[str] = []
    cat = data.get("services_catalog", [])
    grp = data.get("services_groups", [])
    routes = data.get("cta_routes", [])

    ids = [s["id"] for s in cat if "id" in s]
    if len(set(ids)) != len(ids):
        errs.append(f"duplicate service IDs: {[i for i in ids if ids.count(i) > 1]}")

    # schema
    for s in cat:
        missing = REQUIRED_SERVICE_KEYS - set(s.keys())
        # pole_parent can be null; still must be present
        if missing - {"pole_parent"}:
            errs.append(f"service '{s.get('id','?')}' missing keys: {missing}")
        for li in ("sous_services", "technologies", "secteurs", "ctas"):
            if li in s and not isinstance(s[li], list):
                errs.append(f"service '{s['id']}' field '{li}' is not a list")

    # groups coverage
    grouped = [i for g in grp for i in g.get("items", [])]
    if sorted(grouped) != sorted(ids):
        miss_g = set(ids) - set(grouped)
        extra_g = set(grouped) - set(ids)
        if miss_g: errs.append(f"services not referenced in any group: {sorted(miss_g)}")
        if extra_g: errs.append(f"group items not in services_catalog: {sorted(extra_g)}")

    # cta_routes sanity
    for r in routes:
        if r.get("service_id") not in ids and r.get("service_id") is not None:
            errs.append(f"cta_route '{r.get('slug','?')}' references unknown service_id '{r.get('service_id')}'")

    return errs


def check_html_anchors(html: Path, service_ids: list[str], anchors: list[str]) -> list[str]:
    if not html.exists():
        return [f"{html} not found (cannot verify anchors)"]
    txt = html.read_text(encoding="utf-8")
    html_anchors = re.findall(r'<section[^>]*id="(section-[^"]+)"', txt)
    warnings: list[str] = []
    if sorted(html_anchors) != sorted(anchors):
        missing = set(anchors) - set(html_anchors)
        extra = set(html_anchors) - set(anchors)
        if missing: warnings.append(f"services.html MISSING anchors: {sorted(missing)}")
        if extra: warnings.append(f"services.html EXTRA anchors: {sorted(extra)}")
    # Count checks
    m = re.search(r'"numberOfItems":(\d+)', txt)
    if m and int(m.group(1)) != len(service_ids):
        warnings.append(f"services.html JSON-LD numberOfItems={m.group(1)} ≠ catalog count {len(service_ids)}")
    return warnings


def build_json(data: dict[str, Any]) -> dict[str, Any]:
    meta = data.get("meta", {})
    return {
        "meta": {
            "source": f"DATA_MASTER.yml v{meta.get('version','?')}",
            "updated": meta.get("updated", ""),
            "schema_version": "2",
            "count": len(data.get("services_catalog", [])),
            "license": "Interne Groupe — propriété EnerTchad SA/CA",
            "canonical_url": "https://www.enertchad.td/services.html",
        },
        "groups": data.get("services_groups", []),
        "services": data.get("services_catalog", []),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="Write files (default: dry-run)")
    args = ap.parse_args()

    data = load_yaml(SRC_YAML)
    errs = validate(data)
    if errs:
        print("VALIDATION FAILED:", file=sys.stderr)
        for e in errs:
            print(f"  ✘ {e}", file=sys.stderr)
        return 1

    cat = data["services_catalog"]
    ids = [s["id"] for s in cat]
    anchors = [s["anchor"] for s in cat]

    print(f"✓ DATA_MASTER.yml v{data['meta']['version']}")
    print(f"  · {len(cat)} services · {len(data['services_groups'])} groups · {len(data.get('cta_routes', []))} CTA routes")

    warns = check_html_anchors(HTML_PAGE, ids, anchors)
    if warns:
        print("⚠ services.html drift detected:")
        for w in warns:
            print(f"  · {w}")
    else:
        print(f"✓ services.html aligned ({len(anchors)} anchors)")

    new_json = build_json(data)
    new_text = json.dumps(new_json, ensure_ascii=False, indent=2) + "\n"

    if OUT_JSON.exists():
        old_text = OUT_JSON.read_text(encoding="utf-8")
        if old_text == new_text:
            print(f"✓ {OUT_JSON.relative_to(ROOT)} already in sync — no write needed")
            return 0
        print(f"△ {OUT_JSON.relative_to(ROOT)} differs from catalog (byte diff)")
    else:
        print(f"△ {OUT_JSON.relative_to(ROOT)} does not exist yet")

    if args.apply:
        OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
        OUT_JSON.write_text(new_text, encoding="utf-8")
        print(f"✓ wrote {OUT_JSON.relative_to(ROOT)} ({len(new_text):,} bytes)")
    else:
        print(f"  (dry-run — run with --apply to write)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
