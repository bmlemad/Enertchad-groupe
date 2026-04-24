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

    # v1.1.1 · Cross-contamination detection
    # Canonical signatures (≥1 keyword qui DOIT être présent dans sous_services
    # du bon service). Si absent → probablement corrompu/inversé avec un autre.
    # NB : on évite les mots-clés ambigus (Mobile Station™ apparaît légitimement
    # dans renewables via "Hybridation Mobile Station™"). On cible des tokens
    # uniques au service cible.
    CANONICAL_SIGNATURES = {
        "ep":                "Géosciences & Réservoir",
        "eor":               "Solutions EOR (polymères",
        "pipeline":          "Transport brut & Dispatching",
        "distribution":      "Cartes carburant intelligentes",
        "petrochimie":       "Polymères (PE, PP, PVC)",
        "digital":           "SCADA pipeline / champs / stations",
        "ics-security":      "IEC 62443 & NIST ICS",
        "physical-security": "Caméras 4K/8K & thermiques",
        "renewables":        "Solaire industriel (stations, pipeline, SCADA)",
        "esg":               "Reporting ESG & durabilité",
    }
    # Items "phares" qui sont EXCLUSIFS à leur service (full-match). Si détecté
    # dans un autre service → corruption certaine.
    EXCLUSIVE_MARKERS = {
        "Géosciences & Réservoir": "ep",
        "Forage & Complétions": "ep",
        "Solutions EOR (polymères, surfactants, gels)": "eor",
        "Boues de forage & additifs spécialisés": "eor",
        "Transport brut & Dispatching": "pipeline",
        "Inspection ILI & Pigging": "pipeline",
        "Cartes carburant intelligentes": "distribution",
        "Polymères (PE, PP, PVC)": "petrochimie",
        "Engrais (urée, ammoniac, NPK)": "petrochimie",
        "Digital Twins (pipeline, champs, pétrochimie)": "digital",
        "IEC 62443 & NIST ICS": "ics-security",
        "Monitoring OT & pare-feu industriels": "ics-security",
        "Caméras 4K/8K & thermiques": "physical-security",
        "Caméras IA & PTZ 360°": "physical-security",
        "Solaire industriel (stations, pipeline, SCADA)": "renewables",
        "Mini-grids pour sites isolés": "renewables",
        "Reporting ESG & durabilité": "esg",
        "EnerAcademy (formations Oil & Gas)": "esg",
        "Conformité OHADA & anticorruption": "esg",
    }
    for s in cat:
        sid = s.get("id")
        own_ss = s.get("sous_services", [])
        if sid in CANONICAL_SIGNATURES:
            sig = CANONICAL_SIGNATURES[sid]
            if not any(sig in item for item in own_ss):
                errs.append(
                    f"service '{sid}' missing canonical signature '{sig}' in sous_services "
                    f"— possible cross-contamination (got {own_ss[:2]}...)"
                )
        for item in own_ss:
            owner = EXCLUSIVE_MARKERS.get(item)
            if owner and owner != sid:
                errs.append(
                    f"service '{sid}' contains exclusive marker '{item}' "
                    f"which belongs to '{owner}' — cross-contamination detected"
                )

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
            "canonical_url": "https://www.enertchad.td/#services-catalogue",
        },
        "groups": data.get("services_groups", []),
        "services": data.get("services_catalog", []),
    }


# -- HTML rebuild (partial, data-driven blocks only) --------------------------

def _esc(s: str) -> str:
    """Escape & for HTML. Does NOT touch other special chars (preserves unicode)."""
    return s.replace("&", "&amp;")


def _rebuild_section_block(section_html: str, svc: dict[str, Any]) -> tuple[str, int]:
    """Rebuild the 3 data-driven blocks inside one service section:
       1. <ul class="svc-list">   ← sous_services
       2. <div class="svc-chips"> ← technologies
       3. <div class="svc-ctas">  ← ctas
       Hand-crafted copy (h2 headline, tagline, post-chip paragraph) is preserved.
       Returns (new_html, mutations_count).
    """
    mutations = 0
    accent = svc["accent_hex"]
    accent_light = svc.get("accent_hex_light", accent)

    # 1. svc-list (Services clés)
    lis = []
    for item in svc["sous_services"]:
        lis.append(
            f'          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" '
            f'stroke="{accent}" stroke-width="2.5" aria-hidden="true">'
            f'<path d="M20 6L9 17l-5-5"/></svg>{_esc(item)}</li>'
        )
    new_ul = "\n".join(lis)
    p = re.compile(r'(<ul class="svc-list">\n)([\s\S]*?)(\n\s*</ul>)')
    m = p.search(section_html)
    if m:
        new_section = section_html[:m.start(2)] + new_ul + section_html[m.end(2):]
        if new_section != section_html:
            section_html = new_section; mutations += 1

    # 2. svc-chips (Technologies intégrées)
    chips = [f'          <span class="svc-chip">{_esc(t)}</span>' for t in svc["technologies"]]
    new_chips = "\n".join(chips)
    p = re.compile(r'(<div class="svc-chips">\n)([\s\S]*?)(\n\s*</div>)')
    m = p.search(section_html)
    if m:
        new_section = section_html[:m.start(2)] + new_chips + section_html[m.end(2):]
        if new_section != section_html:
            section_html = new_section; mutations += 1

    # 3. svc-ctas (CTA row)
    cta_lines = []
    for cta in svc["ctas"]:
        variant = cta.get("variant", "primary")
        btn_class = "btn btn-primary" if variant == "primary" else "btn btn-ghost"
        label = _esc(cta["label"])
        href = cta["href"]
        if variant == "primary":
            cta_lines.append(f'      <a href="{href}" class="{btn_class}">{label} <span class="arrow">→</span></a>')
        else:
            cta_lines.append(f'      <a href="{href}" class="{btn_class}">{label}</a>')
    new_ctas = "\n".join(cta_lines)
    # The svc-ctas block has a "reveal" wrapper; match the inner <a>...</a> list
    p = re.compile(r'(<div class="svc-ctas reveal"[^>]*>\n)([\s\S]*?)(\n\s*</div>\s*\n\s*</div>\s*\n</section>)')
    m = p.search(section_html)
    if m:
        new_section = section_html[:m.start(2)] + new_ctas + section_html[m.end(2):]
        if new_section != section_html:
            section_html = new_section; mutations += 1

    return section_html, mutations


def rebuild_html(data: dict[str, Any], html_path: Path) -> tuple[str, int, int]:
    """Regenerate data-driven blocks inside services.html.
       Returns (new_html, sections_touched, total_mutations).
    """
    html = html_path.read_text(encoding="utf-8")
    sections_touched = 0
    total_mut = 0
    services = {s["id"]: s for s in data["services_catalog"]}
    for svc in data["services_catalog"]:
        anchor = svc["anchor"]
        # Match the section block by id, from `<section ... id="section-xyz"` until `</section>`
        pat = re.compile(
            r'(<section class="svc-section"[^>]*id="' + re.escape(anchor) + r'"[\s\S]*?</section>)',
            re.MULTILINE
        )
        m = pat.search(html)
        if not m:
            continue
        old_block = m.group(1)
        new_block, muts = _rebuild_section_block(old_block, svc)
        if muts > 0:
            html = html[:m.start(1)] + new_block + html[m.end(1):]
            sections_touched += 1
            total_mut += muts
    return html, sections_touched, total_mut


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="Write files (default: dry-run)")
    ap.add_argument("--rebuild-html", action="store_true",
                    help="Also rebuild data-driven blocks inside services.html (svc-list, svc-chips, svc-ctas)")
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

    # Optional HTML rebuild
    if args.rebuild_html:
        if not HTML_PAGE.exists():
            print(f"✘ {HTML_PAGE.name} not found — cannot rebuild HTML", file=sys.stderr)
            return 1
        current_html = HTML_PAGE.read_text(encoding="utf-8")
        new_html, touched, muts = rebuild_html(data, HTML_PAGE)
        if new_html == current_html:
            print(f"✓ services.html already in sync (no rebuild needed)")
        else:
            print(f"△ services.html rebuild: {touched} sections, {muts} block mutations")
            if args.apply:
                HTML_PAGE.write_text(new_html, encoding="utf-8")
                print(f"✓ wrote services.html ({len(new_html):,} bytes)")
            else:
                print(f"  (dry-run — run with --apply --rebuild-html to write)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
