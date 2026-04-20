#!/usr/bin/env python3
"""
EnerTchad Mega Meta Footer — Ultra Premium Upgrade
Replaces existing footer across all 19 pages with SLB/TotalEnergies-grade mega footer.
Features: 6-column grid, KPI bar, certifications, sitemap, enhanced contact, social proof.
"""
import re, glob, os

def build_mega_footer(prefix=""):
    """Build the mega meta footer HTML. prefix="" for root, prefix="../" for subdirs."""
    p = prefix
    return f'''<!-- ═══ MEGA META FOOTER — ULTRA PREMIUM ═══ -->
<footer class="footer mega-footer" style="position:relative">
  <div class="footer-glow" aria-hidden="true"></div>

  <!-- ── KPI Bar ── -->
  <div class="footer-kpi-bar">
    <div class="ctn">
      <div class="footer-kpi-grid">
        <div class="footer-kpi">
          <span class="footer-kpi-value">1 240</span>
          <span class="footer-kpi-label" data-i18n data-en="Employees">Collaborateurs</span>
        </div>
        <div class="footer-kpi">
          <span class="footer-kpi-value">144K</span>
          <span class="footer-kpi-label" data-i18n data-en="barrels/day">barils/jour</span>
        </div>
        <div class="footer-kpi">
          <span class="footer-kpi-value">85+</span>
          <span class="footer-kpi-label" data-i18n data-en="Stations">Stations-service</span>
        </div>
        <div class="footer-kpi">
          <span class="footer-kpi-value">4</span>
          <span class="footer-kpi-label" data-i18n data-en="OFS Poles">P\\u00f4les OFS</span>
        </div>
        <div class="footer-kpi">
          <span class="footer-kpi-value">1 070</span>
          <span class="footer-kpi-label" data-i18n data-en="km pipeline">km pipeline</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Main Footer Grid ── -->
  <div class="ctn footer-main">
    <div class="footer-mega-grid">

      <!-- Brand Column -->
      <div class="footer-brand">
        <div class="logo-wrap">
          <img loading="lazy" src="{p}logo-enertchad.svg" alt="EnerTchad Groupe" width="36" height="36" class="logo-img"/>
          <div class="logo-text">EnerTchad<span>Groupe</span></div>
        </div>
        <p data-i18n data-en="Oilfield services company and petroleum distributor in Chad. 4 OFS service poles, full-range distribution, and integrated E&P operations. Major expertise, local agility.">
          Services p\\u00e9troliers et distribution au Tchad. 4 p\\u00f4les OFS, distribution gamme compl\\u00e8te et op\\u00e9rations E&P int\\u00e9gr\\u00e9es. Expertise des majors, agilit\\u00e9 locale.
        </p>
        <span class="footer-brand-tagline" data-i18n data-en="Major expertise. Local agility.">\\u00abL\\u2019expertise des majors. L\\u2019agilit\\u00e9 locale.\\u00bb</span>
        <!-- Certifications -->
        <div class="footer-certs">
          <span class="footer-cert" title="IWCF"><i class="fas fa-certificate"></i> IWCF</span>
          <span class="footer-cert" title="API"><i class="fas fa-certificate"></i> API</span>
          <span class="footer-cert" title="ISO 14001"><i class="fas fa-leaf"></i> ISO 14001</span>
          <span class="footer-cert" title="ITIE/EITI"><i class="fas fa-globe-africa"></i> ITIE</span>
        </div>
      </div>

      <!-- Services Column -->
      <div class="footer-col">
        <h5 data-i18n data-en="Field Services">Services des Champs</h5>
        <a href="{p}services/well-services.html" data-i18n data-en="Well Services & Workover">Well Services & Workover</a>
        <a href="{p}services/drilling.html" data-i18n data-en="Drilling & Engineering">Drilling & Engineering</a>
        <a href="{p}services/digital.html" data-i18n data-en="Digital & SCADA">Digital & SCADA</a>
        <a href="{p}services/consulting.html" data-i18n data-en="Consulting & Training">Consulting & Formation</a>
        <a href="{p}distribution/" data-i18n data-en="Distribution & Trading">Distribution & N\\u00e9goce</a>
      </div>

      <!-- Operations Column -->
      <div class="footer-col">
        <h5 data-i18n data-en="Petroleum Company">Soci\\u00e9t\\u00e9 P\\u00e9troli\\u00e8re</h5>
        <a href="{p}operations/amont.html" data-i18n data-en="Upstream — E&P">Amont — E&P</a>
        <a href="{p}operations/intermediaire.html" data-i18n data-en="Midstream — Transport">Interm\\u00e9diaire — Transport</a>
        <a href="{p}operations/aval.html" data-i18n data-en="Downstream — Refining">Aval — Raffinage & Distribution</a>
        <a href="{p}operations/technologies.html" data-i18n data-en="Technologies & AI">Technologies & IA</a>
        <a href="{p}operations/energies.html" data-i18n data-en="Renewable Energies">\\u00c9nergies Renouvelables</a>
      </div>

      <!-- Company Column -->
      <div class="footer-col">
        <h5 data-i18n data-en="Company">Entreprise</h5>
        <a href="{p}groupe/index.html" data-i18n data-en="About EnerTchad">\\u00c0 propos du Groupe</a>
        <a href="{p}durabilite.html" data-i18n data-en="Sustainability & ESG">Durabilit\\u00e9 & ESG</a>
        <a href="{p}investisseurs.html" data-i18n data-en="Investor Relations">Relations Investisseurs</a>
        <a href="{p}talents.html" data-i18n data-en="Careers & Academy">Talents & Carri\\u00e8res</a>
        <a href="{p}actualites.html" data-i18n data-en="News & Press">Actualit\\u00e9s & Presse</a>
      </div>

      <!-- Resources Column -->
      <div class="footer-col">
        <h5 data-i18n data-en="Resources">Ressources</h5>
        <a href="{p}contact.html" data-i18n data-en="Contact & Offices">Contact & Bureaux</a>
        <a href="{p}contact.html#devis" data-i18n data-en="Request a Quote">Demander un devis</a>
        <a href="{p}mentions-legales.html" data-i18n data-en="Legal Notice">Mentions l\\u00e9gales</a>
        <a href="{p}confidentialite.html" data-i18n data-en="Privacy Policy">Confidentialit\\u00e9</a>
        <a href="{p}cookies.html" data-i18n data-en="Cookie Policy">Cookies</a>
      </div>
    </div>

    <!-- Contact Info Bar -->
    <div class="footer-contact-bar">
      <div class="footer-contact-item">
        <i class="fas fa-map-marker-alt"></i>
        <span data-i18n data-en="Radisson Blu, Block D, Office 23 — N\\u2019Djamena, Chad">Radisson Blu, Bloc D, Bureau 23 — N\\u2019Djam\\u00e9na, Tchad</span>
      </div>
      <a href="tel:+23599298696" class="footer-contact-item">
        <i class="fas fa-phone"></i>
        <span>+235 99 29 86 96</span>
      </a>
      <a href="mailto:contact@enertchad.td" class="footer-contact-item">
        <i class="fas fa-envelope"></i>
        <span>contact@enertchad.td</span>
      </a>
      <div class="footer-contact-item">
        <i class="fas fa-clock"></i>
        <span data-i18n data-en="Mon-Fri 7:30-17:30 · Emergencies 24/7">Lun-Ven 7h30-17h30 · Urgences 24/7</span>
      </div>
    </div>
  </div>

  <!-- Newsletter & Socials -->
  <div class="footer-secondary">
    <div class="ctn">
      <div class="footer-newsletter">
        <div>
          <h5 data-i18n data-en="Stay updated">Restez inform\\u00e9</h5>
          <p data-i18n data-en="Industry insights and company news, delivered monthly.">Analyses sectorielles et actualit\\u00e9s du groupe, chaque mois.</p>
        </div>
        <form class="newsletter-form">
          <input type="email" placeholder="Votre email professionnel" required aria-label="Email"/>
          <button type="submit" class="btn btn--brand btn--sm" data-i18n data-en="Subscribe">S\\u2019abonner</button>
        </form>
      </div>
      <div class="footer-socials">
        <a href="https://www.linkedin.com/company/enertchad" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        <a href="https://x.com/EnerTchad" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"><i class="fab fa-x-twitter"></i></a>
        <a href="https://www.facebook.com/EnerTchad" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.youtube.com/@EnerTchad" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </div>

  <!-- Copyright -->
  <div class="footer-copyright">
    <div class="ctn">
      <p data-i18n data-en="&copy; 2026 EnerTchad Groupe SA/CA. All rights reserved. Registered in N\\u2019Djamena, Chad.">&copy; 2026 EnerTchad Groupe SA/CA. Tous droits r\\u00e9serv\\u00e9s. Immatricul\\u00e9e \\u00e0 N\\u2019Djam\\u00e9na, Tchad.</p>
      <div class="footer-links">
        <a href="{p}mentions-legales.html" data-i18n data-en="Legal">Mentions l\\u00e9gales</a>
        <span class="footer-sep">·</span>
        <a href="{p}confidentialite.html" data-i18n data-en="Privacy">Confidentialit\\u00e9</a>
        <span class="footer-sep">·</span>
        <a href="{p}cookies.html" data-i18n data-en="Cookies">Cookies</a>
        <span class="footer-sep">·</span>
        <a href="{p}contact.html" data-i18n data-en="Contact">Contact</a>
      </div>
    </div>
  </div>
</footer>'''


# Page definitions: path → prefix
pages = {
    'index.html': '',
    'actualites.html': '',
    'contact.html': '',
    'durabilite.html': '',
    'investisseurs.html': '',
    'talents.html': '',
    'confidentialite.html': '',
    'mentions-legales.html': '',
    'cookies.html': '',
    'services/well-services.html': '../',
    'services/drilling.html': '../',
    'services/digital.html': '../',
    'services/consulting.html': '../',
    'operations/amont.html': '../',
    'operations/intermediaire.html': '../',
    'operations/aval.html': '../',
    'operations/technologies.html': '../',
    'operations/energies.html': '../',
    'distribution/index.html': '../',
    'groupe/index.html': '../',
}

updated = 0
errors = []

for filepath, prefix in pages.items():
    if not os.path.exists(filepath):
        errors.append(f"SKIP: {filepath} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the footer block
    # Pattern: from <footer to </footer>
    footer_pattern = re.compile(
        r'<!--[^>]*FOOTER[^>]*-->.*?</footer>',
        re.DOTALL
    )
    
    # Also try without comment
    if not footer_pattern.search(content):
        footer_pattern = re.compile(r'<footer\s[^>]*>.*?</footer>', re.DOTALL)
    
    new_footer = build_mega_footer(prefix)
    
    if footer_pattern.search(content):
        new_content = footer_pattern.sub(new_footer, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated += 1
        print(f"  ✓ {filepath}")
    else:
        errors.append(f"NO FOOTER FOUND: {filepath}")

print(f"\nUpdated: {updated}/{len(pages)} pages")
if errors:
    print("Errors:")
    for e in errors:
        print(f"  ✗ {e}")

