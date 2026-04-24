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
      <span class="kicker">Catalogue complet · 10 services harmonisés</span>
      <h2 id="services-catalogue-title">Nos 10 services · de la roche-mère aux <em class="h2-accent">énergies nouvelles</em>.</h2>
      <p class="lead">Chaque service du Groupe est décliné en sous-prestations, technologies et secteurs d'application. Les CTA pointent directement vers le bon formulaire pré-rempli.</p>
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
      <span class="kicker">ESG · Transparence · Climat</span>
      <h2 id="durabilite-inline-title">La durabilité, <em class="h2-accent">au cœur du mandat opérationnel</em>.</h2>
      <p class="lead">ITIE, HSE, contenu local, trajectoire climat : quatre engagements concrets, mesurables et publiés.</p>
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
      <span class="kicker">Écosystème · Partenaires opérationnels</span>
      <h2 id="partenaires-title">Six partenaires <em class="h2-accent">institutionnels & B2B</em> au cœur de l'écosystème.</h2>
      <p class="lead">Notre chaîne intégrée s'appuie sur les opérateurs de référence du Tchad et du corridor Cameroun. Institutionnels du secteur extractif et clients industriels majeurs.</p>
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
      <span class="kicker">EnerAcademy · Souveraineté des compétences</span>
      <h2 id="talents-academy-title">Former les talents qui construisent <em class="h2-accent">l'énergie tchadienne</em>.</h2>
      <p class="lead">{esc(eff)} apprentis formés par an · {esc(cum)} cumulés. Quatre programmes certifiants déployés depuis N'Djamena, Doba et Moundou — adossés aux standards OHADA et aux référentiels pétroliers internationaux.</p>
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
      <span class="kicker">Prendre contact · 24 h ouvrées</span>
      <h2 id="contact-form-title">Un projet, une question, un partenariat — <em class="h2-accent">parlons-en</em>.</h2>
      <p class="lead">Le formulaire est pré-rempli selon le service qui vous intéresse. Réponse sous 24 h ouvrées par un chargé de relation.</p>
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
# ─────────────────────────────────────────────────────────────────────
def build_nav_links():
    return f'''
        {NAV_BEGIN}
        <a href="#hero" data-scrollspy>Accueil</a>
        <a href="#operations" data-scrollspy>Les 6 pôles</a>
        <a href="#services-catalogue" data-scrollspy>Services</a>
        <a href="#carte" data-scrollspy>Cartographie</a>
        <a href="#durabilite-inline" data-scrollspy>Durabilité</a>
        <a href="#talents-academy" data-scrollspy>EnerAcademy</a>
        <a href="#partenaires" data-scrollspy>Partenaires</a>
        <a href="#actualites-preview" data-scrollspy>Actualités</a>
        <a href="#contact-form" data-scrollspy>Contact</a>
        {NAV_END}
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

    # 5. Add CSS link for monopage styles (if not present)
    css_link = '<link rel="stylesheet" href="assets/css/monopage.css" />'
    if css_link not in html_text:
        html_text = html_text.replace(
            '<link rel="stylesheet" href="assets/css/main.css" />',
            '<link rel="stylesheet" href="assets/css/main.css" />\n' + css_link,
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
