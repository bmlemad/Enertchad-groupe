#!/usr/bin/env python3
"""
build-monopage.py — Generates 5 inline sections for index.html from DATA_MASTER.yml

Sections produced (all at once, idempotent) :
  - #services-catalogue   — full 10 services with sous_services + tech + secteurs + CTAs
  - #durabilite-inline    — ESG inline block (engagements, ITIE, HSE, climat)
  - #partenaires          — 6 institutional/B2B partners
  - #talents-academy      — EnerAcademy with 4 programmes
  - #contact-form         — inline contact form pré-rempli

Also rewrites the nav-links list in index.html to include scroll-spy anchors.

Usage:
  python3 _sources/tools/build-monopage.py            # dry-run (prints what would change)
  python3 _sources/tools/build-monopage.py --apply    # writes index.html
"""
import yaml
import sys
import re
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
YAML_PATH = ROOT / "DATA_MASTER.yml"
INDEX_PATH = ROOT / "index.html"

# Sentinel markers for idempotent insertion
MARKER_BEGIN = "<!-- ═══ MONOPAGE v1.2.0 AUTO-GEN BEGIN · build-monopage.py ═══ -->"
MARKER_END = "<!-- ═══ MONOPAGE v1.2.0 AUTO-GEN END ═══ -->"

NAV_BEGIN = "<!-- ═══ MONOPAGE NAV-LINKS AUTO-GEN BEGIN ═══ -->"
NAV_END = "<!-- ═══ MONOPAGE NAV-LINKS AUTO-GEN END ═══ -->"

MM_BEGIN = "<!-- ═══ MEGA-MENU v2 AUTO-GEN BEGIN ═══ -->"
MM_END = "<!-- ═══ MEGA-MENU v2 AUTO-GEN END ═══ -->"


def esc(s):
    """HTML-escape a string value, handling None gracefully."""
    if s is None:
        return ""
    return html.escape(str(s), quote=True)


def load_data():
    with open(YAML_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)


# ─────────────────────────────────────────────────────────────────────
# SECTION 1 — SERVICES CATALOGUE (10 services, full render)
# ─────────────────────────────────────────────────────────────────────
def build_services_section(d):
    services = d.get("services_catalog", [])
    groups = {g["id"]: g for g in d.get("services_groups", [])}

    cards = []
    for s in services:
        sid = s["id"]
        group = groups.get(s.get("group", ""), {})
        accent = s.get("accent_hex", "#D9A84F")
        anchor = s.get("anchor", f"section-{sid}")
        numero = s.get("numero", "")
        nom = s.get("nom", "")
        nom_court = s.get("nom_court", nom)
        resume = s.get("resume", "")
        description = s.get("description", "")

        sous = "".join(
            f'<li class="mps-sub-item">{esc(ss)}</li>'
            for ss in (s.get("sous_services") or [])
        )
        tech = "".join(
            f'<span class="mps-chip mps-chip-tech">{esc(t)}</span>'
            for t in (s.get("technologies") or [])
        )
        sect = "".join(
            f'<span class="mps-chip mps-chip-sect">{esc(sc)}</span>'
            for sc in (s.get("secteurs") or [])
        )
        ctas = "".join(
            f'<a href="{esc(c.get("href", "#"))}" class="btn {"btn-primary" if c.get("variant") == "primary" else "btn-ghost"} mps-cta">'
            f'{esc(c.get("label", ""))} <span class="arrow">→</span></a>'
            for c in (s.get("ctas") or [])
        )

        cards.append(f'''
      <article id="{esc(anchor)}" class="mps-card" data-service="{esc(sid)}" style="--svc-accent: {esc(accent)};">
        <header class="mps-head">
          <div class="mps-num">{esc(numero)}</div>
          <div class="mps-meta">
            <span class="mps-group">{esc(group.get("nom", ""))}</span>
            <h3 class="mps-title">{esc(nom)}</h3>
            <p class="mps-resume">{esc(resume)}</p>
          </div>
        </header>

        <div class="mps-body">
          <p class="mps-desc">{esc(description)}</p>

          <div class="mps-cols">
            <div class="mps-col">
              <h4 class="mps-subhead">Sous-services</h4>
              <ul class="mps-sub-list">{sous}</ul>
            </div>
            <div class="mps-col">
              <h4 class="mps-subhead">Technologies</h4>
              <div class="mps-chips">{tech}</div>
              <h4 class="mps-subhead mps-subhead-mt">Secteurs</h4>
              <div class="mps-chips">{sect}</div>
            </div>
          </div>

          <div class="mps-ctas">{ctas}</div>
        </div>
      </article>''')

    return f'''
<!-- ============================= SERVICES CATALOGUE (10 complets) ============================= -->
<section id="services-catalogue" class="mp-section mp-services" aria-labelledby="services-catalogue-title">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker"><span class="kicker-dot">●</span> OUR EXPERTISE · 10 SERVICES · 4 PÔLES</span>
      <h2 id="services-catalogue-title">De la roche-mère à la station-service, <em class="h2-accent">une chaîne de valeur intégrée</em>.</h2>
      <p class="lead">Dix expertises déclinées en sous-prestations, technologies et secteurs d'application. Chaque service connecté à un formulaire pré-rempli pour une prise de contact en moins de 24 heures.</p>
    </div>

    <div class="mps-grid">{"".join(cards)}
    </div>
  </div>
</section>'''


# ─────────────────────────────────────────────────────────────────────
# SECTION 2 — DURABILITÉ INLINE
# ─────────────────────────────────────────────────────────────────────
def build_durabilite_section(d):
    return '''
<!-- ============================= DURABILITÉ INLINE ============================= -->
<section id="durabilite-inline" class="mp-section mp-durabilite" aria-labelledby="durabilite-inline-title">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker"><span class="kicker-dot">●</span> SUSTAINABILITY · ESG COMMITMENTS</span>
      <h2 id="durabilite-inline-title">Transparence, climat, communautés : <em class="h2-accent">des engagements mesurables</em>.</h2>
      <p class="lead">ITIE, HSE, contenu local, trajectoire climat — quatre piliers opérationnels publiés annuellement aux standards internationaux.</p>
    </div>

    <div class="dur-grid">
      <article class="dur-card reveal" style="--accent: #D9A84F;">
        <div class="dur-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 16l4 4 8-8" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></div>
        <h3>ITIE · Transparence</h3>
        <p>53 contrats publiés. Flux financiers, paiements à l'État et revenus divulgués annuellement.</p>
        <div class="dur-stat"><strong>53</strong> contrats ITIE publiés</div>
      </article>

      <article class="dur-card reveal" style="--accent: #10B981; --delay:.08s;">
        <div class="dur-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="32" height="32"><path d="M16 2v12m-8-4l8 8 8-8M5 23h22" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></div>
        <h3>Trajectoire climat</h3>
        <p>42 000 tonnes de CO₂ évitées/an grâce au mix gaz + solaire. Objectif 2030 : −50 % d'intensité carbone.</p>
        <div class="dur-stat"><strong>42 kt</strong> CO₂ évitées par an</div>
      </article>

      <article class="dur-card reveal" style="--accent: #2C7AE0; --delay:.16s;">
        <div class="dur-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="32" height="32"><rect x="4" y="8" width="24" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 14h24M11 2v6m10-6v6" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>
        <h3>HSE · Sécurité</h3>
        <p>ISO 45001 certifié. Taux de fréquence des accidents déclaratifs &lt; 0,8 — au-dessus du standard sectoriel.</p>
        <div class="dur-stat"><strong>ISO 45001</strong> certifié groupe</div>
      </article>

      <article class="dur-card reveal" style="--accent: #8B5CF6; --delay:.24s;">
        <div class="dur-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8v8l5 3" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></div>
        <h3>Contenu local</h3>
        <p>92 % de collaborateurs tchadiens. 38 % de la chaîne d'approvisionnement sourcée localement.</p>
        <div class="dur-stat"><strong>92 %</strong> de recrutement local</div>
      </article>
    </div>

    <div class="dur-cta reveal">
      <a href="#contact-form" class="btn btn-primary">Demander le rapport RSE <span class="arrow">→</span></a>
      <a href="#contact-form" class="btn btn-ghost">Demander l'engagement ESG <span class="arrow">→</span></a>
    </div>
  </div>
</section>'''


# ─────────────────────────────────────────────────────────────────────
# SECTION 3 — PARTENAIRES
# ─────────────────────────────────────────────────────────────────────
def build_partenaires_section(d):
    partenaires = d.get("partenaires_operationnels", {})
    inst = partenaires.get("institutionnels", [])
    b2b = partenaires.get("clients_b2b", [])

    def card(p, kind):
        # Institutional uses `role`; B2B uses `type` — fallback to description
        desc = p.get("role") or p.get("type") or p.get("description") or ""
        return f'''
      <article class="part-card reveal">
        <span class="part-kind part-kind-{kind}">{kind.upper()}</span>
        <h3>{esc(p.get("nom", ""))}</h3>
        <p>{esc(desc)}</p>
      </article>'''

    cards = "".join(card(p, "institutionnel") for p in inst) + "".join(card(p, "b2b") for p in b2b)

    return f'''
<!-- ============================= PARTENAIRES ============================= -->
<section id="partenaires" class="mp-section mp-partenaires" aria-labelledby="partenaires-title">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker"><span class="kicker-dot">●</span> ECOSYSTEM · OPERATIONAL PARTNERS</span>
      <h2 id="partenaires-title">Six partenaires, <em class="h2-accent">une souveraineté énergétique</em> partagée.</h2>
      <p class="lead">Trois opérateurs institutionnels du secteur extractif · trois clients industriels internationaux. Du bassin de Doba au terminal de Kribi, l'écosystème qui alimente la chaîne intégrée EnerTchad.</p>
    </div>

    <div class="part-grid">{cards}
    </div>
  </div>
</section>'''


# ─────────────────────────────────────────────────────────────────────
# SECTION 4 — TALENTS & ENERACADEMY
# ─────────────────────────────────────────────────────────────────────
def build_talents_section(d):
    formation = d.get("formation", {})
    # Actual YAML uses forme_an / apprentis_a_date / programmes_liste (list of strings)
    eff_raw = formation.get("forme_an") or formation.get("apprentis_formes_par_an") or 500
    cum_raw = formation.get("apprentis_a_date") or formation.get("apprentis_cumules") or 1100
    eff = f"{eff_raw}+" if isinstance(eff_raw, int) else str(eff_raw)
    cum = f"{cum_raw}+" if isinstance(cum_raw, int) else str(cum_raw)
    nb_prog = formation.get("programmes") or 4
    prog_list = formation.get("programmes_liste", [])
    localisation = formation.get("localisation", "N'Djamena")

    # Programs are strings in DATA_MASTER — render as simple cards with the title
    prog_cards = "".join(
        f'''
      <article class="acad-card reveal" style="--delay:{i*0.08:.2f}s;">
        <div class="acad-num">0{i+1}</div>
        <h3>{esc(p)}</h3>
        <p>Programme certifiant EnerAcademy — parcours pratique sur site industriel.</p>
        <span class="acad-duree">Formation diplômante</span>
      </article>''' for i, p in enumerate(prog_list[:4])
    )

    return f'''
<!-- ============================= TALENTS · ENERACADEMY ============================= -->
<section id="talents-academy" class="mp-section mp-talents" aria-labelledby="talents-academy-title">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker"><span class="kicker-dot">●</span> TALENT DEVELOPMENT · ENERACADEMY</span>
      <h2 id="talents-academy-title">{esc(eff)} talents par an. <em class="h2-accent">La souveraineté passe par les compétences</em>.</h2>
      <p class="lead">Quatre programmes certifiants adossés aux standards OHADA et référentiels pétroliers internationaux. {esc(cum)} apprentis cumulés depuis la création du centre — la relève Oil & Gas tchadienne se construit ici.</p>
    </div>

    <div class="acad-stats">
      <div class="acad-stat"><strong>{esc(eff)}</strong><span>Apprentis par an</span></div>
      <div class="acad-stat"><strong>{esc(cum)}</strong><span>Formés cumulés</span></div>
      <div class="acad-stat"><strong>{esc(nb_prog)}</strong><span>Programmes certifiants</span></div>
      <div class="acad-stat"><strong>1</strong><span>Campus principal · {esc(localisation)}</span></div>
    </div>

    <div class="acad-grid">{prog_cards}
    </div>

    <div class="acad-cta reveal">
      <a href="#contact-form" class="btn btn-primary">Candidater à EnerAcademy <span class="arrow">→</span></a>
      <a href="#contact-form" class="btn btn-ghost">Candidature spontanée <span class="arrow">→</span></a>
    </div>
  </div>
</section>'''


# ─────────────────────────────────────────────────────────────────────
# SECTION 5 — CONTACT FORM INLINE
# ─────────────────────────────────────────────────────────────────────
def build_contact_section(d):
    cta_routes = d.get("cta_routes", [])
    options = "\n".join(
        f'            <option value="{esc(r["slug"])}" data-service="{esc(r.get("service_id", ""))}">{esc(r.get("libelle_formulaire", ""))}</option>'
        for r in cta_routes
    )

    # Build the HTML/JS block WITHOUT f-string to avoid brace-escaping mess
    # (JS has literal { and } which would need to be doubled inside an f-string).
    html_block = '''
<!-- ============================= CONTACT FORM INLINE ============================= -->
<section id="contact-form" class="mp-section mp-contact" aria-labelledby="contact-form-title">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker"><span class="kicker-dot">●</span> GET IN TOUCH · 24H RESPONSE GUARANTEE</span>
      <h2 id="contact-form-title">Un projet, une question, un partenariat — <em class="h2-accent">parlons-en</em>.</h2>
      <p class="lead">Formulaire pré-rempli selon votre besoin. Un chargé de relation dédié vous répond sous 24 heures ouvrées. Pour les dossiers urgents : WhatsApp Business · +235 99 29 86 96.</p>
    </div>

    <div class="cf-layout">
      <div class="cf-info reveal">
        <ul class="cf-channels">
          <li class="cf-ch">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 5.18 2 2 0 0 1 4.11 3h4.09a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.81a2 2 0 0 1-.45 2.11L8.91 11.09a16 16 0 0 0 6 6l1.45-1.45a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92z"/></svg>
            <div>
              <strong>Téléphone</strong>
              <a href="tel:+23599298696">+235 99 29 86 96</a>
            </div>
          </li>
          <li class="cf-ch">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <div>
              <strong>WhatsApp Business</strong>
              <a href="https://wa.me/23599298696" target="_blank" rel="noopener">wa.me/23599298696</a>
            </div>
          </li>
          <li class="cf-ch">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
            <div>
              <strong>Email direction</strong>
              <a href="mailto:contact@enertchad.td">contact@enertchad.td</a>
            </div>
          </li>
          <li class="cf-ch">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13z"/><circle cx="12" cy="9" r="3"/></svg>
            <div>
              <strong>Siège social</strong>
              <span>Radisson, Block D, Bureau 23<br/>Sabangali · N'Djamena</span>
            </div>
          </li>
        </ul>
      </div>

      <form class="cf-form reveal" action="/contact" method="post" novalidate style="--delay:.08s;">
        <div class="cf-row">
          <label class="cf-field">
            <span>Nom complet *</span>
            <input type="text" name="name" required autocomplete="name">
          </label>
          <label class="cf-field">
            <span>Entreprise</span>
            <input type="text" name="company" autocomplete="organization">
          </label>
        </div>
        <div class="cf-row">
          <label class="cf-field">
            <span>Email professionnel *</span>
            <input type="email" name="email" required autocomplete="email">
          </label>
          <label class="cf-field">
            <span>Téléphone</span>
            <input type="tel" name="phone" autocomplete="tel">
          </label>
        </div>
        <label class="cf-field">
          <span>Type de demande *</span>
          <select name="type" id="contact-type-select" required>
            <option value="">— Sélectionner —</option>
__OPTIONS_PLACEHOLDER__
            <option value="autre">Autre demande</option>
          </select>
        </label>
        <label class="cf-field">
          <span>Objet / sujet</span>
          <input type="text" name="subject" id="contact-subject-input" placeholder="Sera pré-rempli selon le type sélectionné">
        </label>
        <label class="cf-field">
          <span>Message *</span>
          <textarea name="message" rows="5" required placeholder="Décrivez brièvement votre besoin ou votre projet..."></textarea>
        </label>
        <label class="cf-consent">
          <input type="checkbox" required>
          <span>J'accepte la <a href="/confidentialite">politique de confidentialité</a>. Vos données servent uniquement à répondre à votre demande.</span>
        </label>
        <button type="submit" class="btn btn-primary cf-submit">Envoyer la demande <span class="arrow">→</span></button>
      </form>
    </div>
  </div>
</section>

<script>
/* Contact form pré-fill from hash (#<slug>) */
(function(){
  var sel = document.getElementById('contact-type-select');
  var subj = document.getElementById('contact-subject-input');
  if (!sel || !subj) return;
  function applyHash(){
    var hash = (location.hash || '').replace('#', '');
    if (!hash) return;
    for (var i = 0; i < sel.options.length; i++){
      if (sel.options[i].value === hash){
        sel.value = hash;
        subj.value = sel.options[i].textContent;
        return;
      }
    }
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();
})();
</script>'''
    return html_block.replace("__OPTIONS_PLACEHOLDER__", options)


# ─────────────────────────────────────────────────────────────────────
# NAV LINKS (scroll-spy anchors, injected between markers)
# Note : "Services" n'est pas un scroll-spy ici — il déclenche le mega-menu.
# ─────────────────────────────────────────────────────────────────────
def build_nav_links():
    return f'''
        {NAV_BEGIN}
        <a href="#hero" data-scrollspy>Accueil</a>
        <a href="#operations" data-scrollspy>Les 6 pôles</a>
        <button type="button" class="mm-trigger" data-mm-trigger aria-expanded="false" aria-controls="mega-menu-panel" aria-haspopup="true">
          Services
          <svg class="mm-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <a href="#carte" data-scrollspy>Cartographie</a>
        <a href="#durabilite-inline" data-scrollspy>Durabilité</a>
        <a href="#talents-academy" data-scrollspy>EnerAcademy</a>
        <a href="#partenaires" data-scrollspy>Partenaires</a>
        <a href="#actualites-preview" data-scrollspy>Actualités</a>
        <a href="#contact-form" data-scrollspy>Contact</a>
        {NAV_END}
'''


# ─────────────────────────────────────────────────────────────────────
# MEGA-MENU v2 (premium, data-driven from DATA_MASTER.yml)
# ─────────────────────────────────────────────────────────────────────

# P1 · SVG icons par service — 24×24, stroke currentColor, inline paths
# Map service_id → SVG inner markup (path/g elements, no <svg> wrapper)
SERVICE_ICONS = {
    "ep": (
        # Oil derrick + drop
        '<path d="M12 3v4M8 7h8l-2 14h-4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
        '<circle cx="12" cy="17" r="1.2" fill="currentColor"/>'
    ),
    "eor": (
        # Flask with bubbles (chemistry)
        '<path d="M9 3v5l-4.5 10a2 2 0 0 0 1.8 2.9h11.4a2 2 0 0 0 1.8-2.9L15 8V3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
        '<path d="M8 3h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
        '<circle cx="11" cy="15" r="0.8" fill="currentColor"/><circle cx="14" cy="18" r="0.6" fill="currentColor"/>'
    ),
    "pipeline": (
        # Pipe segments
        '<path d="M2 12h20M6 8v8M18 8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
        '<circle cx="6" cy="12" r="1.2" fill="currentColor"/><circle cx="18" cy="12" r="1.2" fill="currentColor"/>'
    ),
    "distribution": (
        # Fuel pump
        '<rect x="4" y="4" width="9" height="16" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/>'
        '<path d="M4 9h9M13 8l4 3v7a2 2 0 0 0 2 2v-9l-3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
    ),
    "petrochimie": (
        # Molecule (3 atoms)
        '<circle cx="7" cy="7" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'
        '<circle cx="17" cy="9" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/>'
        '<circle cx="12" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/>'
        '<path d="M9 9l4 5M9 8l7 1" stroke="currentColor" stroke-width="1.4"/>'
    ),
    "digital": (
        # CPU chip
        '<rect x="6" y="6" width="12" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'
        '<rect x="9.5" y="9.5" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.4"/>'
        '<path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" stroke-width="1.4"/>'
    ),
    "ics-security": (
        # Shield with lock icon
        '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
        '<rect x="9.5" y="11" width="5" height="4" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.4"/>'
        '<path d="M10 11v-1.5a2 2 0 1 1 4 0V11" fill="none" stroke="currentColor" stroke-width="1.4"/>'
    ),
    "physical-security": (
        # Shield with eye
        '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
        '<ellipse cx="12" cy="12" rx="3.5" ry="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/>'
        '<circle cx="12" cy="12" r="1" fill="currentColor"/>'
    ),
    "renewables": (
        # Sun with rays (solar)
        '<circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'
        '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
    ),
    "esg": (
        # Leaf (sustainability)
        '<path d="M20 4c-5 0-10 2-13 5s-4 7-2 11c4 2 8 1 11-2s5-8 4-14z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
        '<path d="M6 18c2-4 5-7 9-10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
    ),
}


def svc_icon_svg(service_id):
    """Return the SVG markup for a given service id (used in mega-menu items)."""
    inner = SERVICE_ICONS.get(service_id, '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/>')
    return f'<svg class="mm-item-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">{inner}</svg>'


def build_mega_menu(d):
    services = d.get("services_catalog", [])
    groups = d.get("services_groups", [])

    # Premium group-level tag labels (for eyebrow)
    GROUP_TAGS = {
        "amont": "Upstream · 02",
        "chaine-aval": "Midstream + Downstream · 03",
        "technologies": "Tech & Security · 03",
        "avenir-esg": "Sustainability · 02",
    }

    # Group → service cards rendering
    group_columns = []
    global_i = 0  # stagger index across all items
    for g in groups:
        gid = g["id"]
        nom = g.get("nom", "").split(" (")[0]  # strip parenthetical
        desc = g.get("description", "")
        accent = g.get("accent_hex", "#D9A84F")
        tag = GROUP_TAGS.get(gid, nom.upper())
        items = g.get("items", [])
        services_in_group = [s for s in services if s["id"] in items]

        rows = []
        for s in services_in_group:
            sid = s["id"]
            numero = s.get("numero", "")
            nom_svc = s.get("nom", "")
            nom_court = s.get("nom_court", nom_svc)
            resume = s.get("resume", "")
            anchor = s.get("anchor", f"section-{sid}")
            svc_accent = s.get("accent_hex", accent)
            icon_svg = svc_icon_svg(sid)
            keywords = " ".join([sid, nom_court] + [str(x) for x in (s.get("sous_services") or [])]).lower()
            rows.append(f'''
          <a href="#{esc(anchor)}" class="mm-item" data-mm-item data-search="{esc(keywords)}" style="--svc-accent: {esc(svc_accent)}; --mm-i: {global_i};">
            <div class="mm-item-icon-wrap">{icon_svg}</div>
            <div class="mm-item-body">
              <div class="mm-item-head">
                <span class="mm-item-num">{esc(numero)}</span>
                <h4 class="mm-item-title">{esc(nom_court)}</h4>
              </div>
              <p class="mm-item-sub">{esc(resume)}</p>
            </div>
            <svg class="mm-item-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>''')
            global_i += 1

        group_columns.append(f'''
        <div class="mm-group" style="--group-accent: {esc(accent)};">
          <div class="mm-group-header">
            <span class="mm-group-tag">{esc(tag)}</span>
            <h3 class="mm-group-nom">{esc(nom)}</h3>
            <p class="mm-group-desc">{esc(desc)}</p>
          </div>
          <div class="mm-group-items">{"".join(rows)}
          </div>
        </div>''')

    # Feature panel — P2 editorial block + 3 KPI stats + CTAs
    feature = '''
        <aside class="mm-feature" aria-label="Performance Groupe 2026">
          <div class="mm-feature-eyebrow">Actualités · Avril 2026</div>
          <h3 class="mm-feature-title">Pitch deck Enerfrica v1.0 <em>publié</em>.</h3>
          <a href="#actualites-preview" class="mm-editorial" data-mm-close>
            <div class="mm-editorial-tag">Publication récente</div>
            <div class="mm-editorial-title">17 slides · stratégie Enerfrica African Energy Holdings</div>
            <div class="mm-editorial-meta">24 avril 2026 · <span class="mm-editorial-arrow">→</span></div>
          </a>
          <div class="mm-stats">
            <div class="mm-stat"><strong>144<span class="mm-stat-unit">kb/j</span></strong><span>Production Amont</span></div>
            <div class="mm-stat"><strong>125<span class="mm-stat-unit">MW</span></strong><span>Énergies installées</span></div>
            <div class="mm-stat"><strong>500<span class="mm-stat-unit">+/an</span></strong><span>Formés EnerAcademy</span></div>
          </div>
          <div class="mm-feature-ctas">
            <a href="#services-catalogue" class="mm-feature-cta is-primary" data-mm-close>
              Voir les 10 services <span class="arrow" aria-hidden="true">→</span>
            </a>
            <a href="#contact-form" class="mm-feature-cta" data-mm-close>
              Demander un devis <span class="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </aside>'''

    # P4 · Quick actions row (4 pills at top of panel)
    quick_actions = '''
    <nav class="mm-quick" aria-label="Accès rapides">
      <a href="#section-distribution" class="mm-quick-pill" data-mm-close>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
        <span>Nos 45 stations</span>
      </a>
      <a href="#investisseurs-cta" class="mm-quick-pill" data-mm-close>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 7h7v7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Espace investisseurs</span>
      </a>
      <a href="#talents-academy" class="mm-quick-pill" data-mm-close>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 10l9-5 9 5-9 5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 12v5c1.5 1 3 1.5 5 1.5s3.5-.5 5-1.5v-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        <span>Carrières · EnerAcademy</span>
      </a>
      <a href="#contact-form" class="mm-quick-pill" data-mm-close>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        <span>Demande de devis</span>
      </a>
    </nav>'''

    return f'''
{MM_BEGIN}
<!-- Backdrop -->
<div class="mm-backdrop" data-mm-backdrop hidden></div>

<!-- Mega-menu panel -->
<div id="mega-menu-panel" class="mm-panel" role="dialog" aria-modal="false" aria-label="Catalogue des 10 services EnerTchad" data-mm-panel hidden>
  <div class="mm-inner">
    <div class="mm-header">
      <div class="mm-title-block">
        <h2>Nos 10 services intégrés</h2>
        <p>Chaîne de valeur complète, de l'exploration au renouvelable — 4 sections, 10 expertises.</p>
      </div>
      <div class="mm-search">
        <div class="mm-search-wrap">
          <svg class="mm-search-icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>
          <input type="search" class="mm-search-input" data-mm-search placeholder="Rechercher un service, une technologie…" aria-label="Rechercher dans les services" autocomplete="off" />
          <kbd class="mm-search-kbd" aria-hidden="true">⌘ K</kbd>
        </div>
      </div>
    </div>
    {quick_actions}
    <div class="mm-body">
      {"".join(group_columns)}
      {feature}
      <div class="mm-empty" data-mm-empty>
        Aucun service ne correspond. Essayez <em>pipeline</em>, <em>SCADA</em>, <em>solaire</em>…
      </div>
    </div>
  </div>
</div>

<!-- Mega-menu behavior (open/close + search + keyboard) -->
<script>
(function(){{
  var trigger = document.querySelector('[data-mm-trigger]');
  var panel = document.querySelector('[data-mm-panel]');
  var backdrop = document.querySelector('[data-mm-backdrop]');
  var search = document.querySelector('[data-mm-search]');
  var items = document.querySelectorAll('[data-mm-item]');
  var emptyEl = document.querySelector('[data-mm-empty]');
  var closers = document.querySelectorAll('[data-mm-close]');
  if (!trigger || !panel) return;

  function positionPanel(){{
    var header = document.querySelector('.site-header');
    var top = header ? header.getBoundingClientRect().bottom : 70;
    panel.style.top = top + 'px';
    backdrop.style.top = top + 'px';
  }}

  function openMenu(){{
    positionPanel();
    panel.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(function(){{
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
    }});
    trigger.setAttribute('aria-expanded', 'true');
    setTimeout(function(){{ if (search) search.focus(); }}, 150);
    document.body.style.overflow = 'hidden';
  }}
  function closeMenu(){{
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function(){{
      panel.hidden = true;
      backdrop.hidden = true;
      if (search) search.value = '';
      items.forEach(function(it){{ it.classList.remove('mm-dim'); }});
      if (emptyEl) emptyEl.classList.remove('is-on');
    }}, 250);
  }}
  function toggleMenu(){{
    if (panel.classList.contains('is-open')) closeMenu();
    else openMenu();
  }}

  trigger.addEventListener('click', function(e){{ e.preventDefault(); toggleMenu(); }});
  backdrop.addEventListener('click', closeMenu);
  closers.forEach(function(el){{ el.addEventListener('click', function(){{ setTimeout(closeMenu, 50); }}); }});

  // Close on Escape
  document.addEventListener('keydown', function(e){{
    if (e.key === 'Escape' && panel.classList.contains('is-open')){{
      closeMenu();
      trigger.focus();
    }}
    // ⌘K / Ctrl+K to open and focus search
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){{
      e.preventDefault();
      if (!panel.classList.contains('is-open')) openMenu();
      else if (search) search.focus();
    }}
  }});

  // Close when anchor clicked (anchor navigation)
  items.forEach(function(it){{
    it.addEventListener('click', function(){{ setTimeout(closeMenu, 50); }});
  }});

  // Live search filter
  if (search){{
    search.addEventListener('input', function(){{
      var q = search.value.toLowerCase().trim();
      var matches = 0;
      items.forEach(function(it){{
        var keywords = it.getAttribute('data-search') || '';
        var match = !q || keywords.indexOf(q) !== -1;
        it.classList.toggle('mm-dim', !match);
        if (match) matches++;
      }});
      if (emptyEl) emptyEl.classList.toggle('is-on', matches === 0 && q.length > 0);
    }});
  }}

  // Reposition on resize
  window.addEventListener('resize', function(){{
    if (panel.classList.contains('is-open')) positionPanel();
  }}, {{ passive: true }});

  // Close on scroll (avoid panel floating awkwardly)
  var lastY = window.scrollY;
  window.addEventListener('scroll', function(){{
    if (panel.classList.contains('is-open') && Math.abs(window.scrollY - lastY) > 50){{
      closeMenu();
    }}
    lastY = window.scrollY;
  }}, {{ passive: true }});
}})();
</script>
{MM_END}
'''


# ─────────────────────────────────────────────────────────────────────
# INJECTION INTO index.html
# ─────────────────────────────────────────────────────────────────────
def inject(html_text, d):
    # 1. Build sections block
    block = (
        MARKER_BEGIN + "\n"
        + build_services_section(d)
        + build_durabilite_section(d)
        + build_partenaires_section(d)
        + build_talents_section(d)
        + build_contact_section(d)
        + "\n" + MARKER_END
    )

    # 2. Strip any previous block between markers
    pattern = re.compile(
        re.escape(MARKER_BEGIN) + r".*?" + re.escape(MARKER_END),
        re.DOTALL,
    )
    html_text = pattern.sub("", html_text)

    # 3. Insert block BEFORE the CTA band / #contact section
    cta_marker = '<!-- ============================= CTA BAND ============================= -->'
    if cta_marker in html_text:
        html_text = html_text.replace(cta_marker, block + "\n\n" + cta_marker, 1)
    else:
        # Fallback : before </main>
        html_text = html_text.replace("</main>", block + "\n\n</main>", 1)

    # 4. Inject scroll-spy style nav links (replace existing block if any)
    nav_links = build_nav_links()
    nav_pattern = re.compile(
        re.escape(NAV_BEGIN) + r".*?" + re.escape(NAV_END),
        re.DOTALL,
    )
    if nav_pattern.search(html_text):
        html_text = nav_pattern.sub(nav_links.strip(), html_text)
    else:
        # Insert after <a href="/" data-nav-home>Accueil</a>
        ins_marker = '<a href="/" data-nav-home>Accueil</a>'
        if ins_marker in html_text:
            html_text = html_text.replace(
                ins_marker,
                ins_marker + "\n" + nav_links,
                1,
            )

    # 5. Add CSS links for monopage + mega-menu styles (if not present)
    css_link = '<link rel="stylesheet" href="assets/css/monopage.css" />'
    if css_link not in html_text:
        html_text = html_text.replace(
            '<link rel="stylesheet" href="assets/css/main.css" />',
            '<link rel="stylesheet" href="assets/css/main.css" />\n' + css_link,
            1,
        )

    mm_css_link = '<link rel="stylesheet" href="assets/css/mega-menu.css" />'
    if mm_css_link not in html_text:
        html_text = html_text.replace(
            css_link,
            css_link + "\n" + mm_css_link,
            1,
        )

    # 6. Inject mega-menu panel right after </header> (and strip any previous)
    mm_block = build_mega_menu(d)
    mm_pattern = re.compile(
        re.escape(MM_BEGIN) + r".*?" + re.escape(MM_END),
        re.DOTALL,
    )
    html_text = mm_pattern.sub("", html_text)
    html_text = html_text.replace(
        "</header>",
        "</header>\n" + mm_block.strip(),
        1,
    )

    # 6. Ensure hero has id="hero" for nav anchor
    if 'class="hero"' in html_text and 'id="hero"' not in html_text:
        html_text = html_text.replace('class="hero"', 'id="hero" class="hero"', 1)

    # 7. Add scroll-spy + smooth-scroll script at end (before </body>)
    spy_script = '''
<script>
/* ═══ MONOPAGE scroll-spy + smooth-scroll ═══ */
(function(){
  var links = document.querySelectorAll('[data-scrollspy]');
  if (!links.length) return;
  var sections = Array.from(links).map(function(a){
    var id = a.getAttribute('href');
    return document.querySelector(id);
  }).filter(Boolean);
  function onScroll(){
    var y = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function(s){ if (s.offsetTop <= y) current = s; });
    if (!current) return;
    links.forEach(function(a){
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  /* smooth scroll */
  links.forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });
  /* back-to-top */
  var btt = document.createElement('button');
  btt.className = 'btt-btn';
  btt.setAttribute('aria-label', 'Retour en haut');
  btt.innerHTML = '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M8 3l5 6H3z" fill="currentColor"/></svg>';
  btt.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.body.appendChild(btt);
  function toggleBtt(){ btt.classList.toggle('show', window.scrollY > 600); }
  window.addEventListener('scroll', toggleBtt, { passive: true });
  toggleBtt();
})();
</script>'''
    if "MONOPAGE scroll-spy" not in html_text:
        html_text = html_text.replace("</body>", spy_script + "\n</body>", 1)

    return html_text


def main():
    apply = "--apply" in sys.argv
    d = load_data()

    if not INDEX_PATH.exists():
        print(f"✘ {INDEX_PATH} introuvable", file=sys.stderr)
        sys.exit(1)

    before = INDEX_PATH.read_text(encoding="utf-8")
    after = inject(before, d)

    if before == after:
        print("✓ index.html déjà à jour — rien à écrire")
        return

    before_len = len(before)
    after_len = len(after)
    print(f"  Avant : {before_len:>7,} octets")
    print(f"  Après : {after_len:>7,} octets  (Δ {after_len - before_len:+,})")

    if apply:
        INDEX_PATH.write_text(after, encoding="utf-8")
        print(f"✓ index.html écrit ({after_len:,} octets)")
    else:
        print("△ dry-run — utilise --apply pour écrire")


if __name__ == "__main__":
    main()
