#!/usr/bin/env python3
"""R140 · ULTRA PREMIUM Header + Footer · inject cross-pages
- New <header class="hu-header"> right after <body>
- New <footer class="fu-footer"> replacing existing footer
- <link> + <script> for header-ultra.css/js
- FR canon + EN canon variants
Idempotent : skip if already injected (data-marker)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_archive", "_preview_build", "_scripts", "_workers", "v3", "node_modules"}
SKIP_PAGES = {
    "preview.html", "offline.html",
    "header-v11-comparison.html", "header-v11-preview.html",
    "404.html", "500.html",
    "tour-live/dashboard.html",
    "assets/art/Substrat-Vivant.html",
    "atlas/index.html",
}

CSS_LINK = '<link rel="stylesheet" href="/assets/css/header-ultra.css?v=r140" />'
JS_TAG = '<script defer src="/assets/js/header-ultra.js?v=r140"></script>'
MARKER = 'class="hu-header"'

# ============ FR HEADER ============
FR_HEADER = '''<!-- R140 · ULTRA PREMIUM Header · FR -->
<header class="hu-header" role="banner" data-r140="ultra">
  <div class="hu-inner">
    <a class="hu-brand" href="/" aria-label="EnerTchad SA · accueil">
      <svg class="hu-logo" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" fill="#C9B57B" opacity="0.18"/>
        <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" stroke="#C9B57B" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="3" fill="#C9B57B"/>
      </svg>
      <span class="hu-brand-text">EnerTchad <em>SA</em><span class="hu-brand-tag">Société parapétrolière · OFS</span></span>
    </a>
    <nav class="hu-nav" aria-label="Navigation principale">
      <a class="hu-nav-link" href="/sitemap.html#mission">Mission</a>
      <a class="hu-nav-link" href="/sitemap.html#activites">Activités</a>
      <a class="hu-nav-link" href="/sitemap.html#transition">Transition</a>
      <a class="hu-nav-link" href="/sitemap.html#technologies">Technologies</a>
      <a class="hu-nav-link" href="/sitemap.html#engagements">Engagements</a>
      <a class="hu-nav-link" href="/sitemap.html#investisseurs">Investisseurs</a>
    </nav>
    <div class="hu-right">
      <span class="hu-lang" aria-label="Langue">
        <a href="/" hreflang="fr" aria-current="true">FR</a>
        <span aria-hidden="true">·</span>
        <a href="/en/" hreflang="en">EN</a>
      </span>
      <a class="hu-cta" href="/engagement/investisseurs.html">Tour 2026 <span class="hu-cta-arrow">↗</span></a>
      <button class="hu-burger" type="button" aria-label="Menu" aria-expanded="false">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</header>
<aside class="hu-drawer" aria-hidden="true">
  <button class="hu-drawer-close" aria-label="Fermer">×</button>
  <a href="/sitemap.html#mission">01 Mission</a>
  <a href="/sitemap.html#activites">02 Activités</a>
  <a href="/sitemap.html#transition">03 Transition énergétique</a>
  <a href="/sitemap.html#technologies">04 Technologies</a>
  <a href="/sitemap.html#engagements">05 Engagements</a>
  <a href="/sitemap.html#investisseurs">06 Investisseurs</a>
  <a href="/sitemap.html">📐 Plan du site</a>
  <a href="/en/" hreflang="en" style="color:#C9B57B">EN · English ↗</a>
</aside>
<div class="hu-backdrop" aria-hidden="true"></div>
'''

# ============ EN HEADER ============
EN_HEADER = '''<!-- R140 · ULTRA PREMIUM Header · EN -->
<header class="hu-header" role="banner" data-r140="ultra">
  <div class="hu-inner">
    <a class="hu-brand" href="/en/" aria-label="EnerTchad SA · home">
      <svg class="hu-logo" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" fill="#C9B57B" opacity="0.18"/>
        <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" stroke="#C9B57B" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="3" fill="#C9B57B"/>
      </svg>
      <span class="hu-brand-text">EnerTchad <em>SA</em><span class="hu-brand-tag">Oil Field Services · OFS</span></span>
    </a>
    <nav class="hu-nav" aria-label="Main navigation">
      <a class="hu-nav-link" href="/en/sitemap.html#mission">Mission</a>
      <a class="hu-nav-link" href="/en/sitemap.html#activities">Activities</a>
      <a class="hu-nav-link" href="/en/sitemap.html#transition">Transition</a>
      <a class="hu-nav-link" href="/en/sitemap.html#technologies">Technologies</a>
      <a class="hu-nav-link" href="/en/sitemap.html#commitments">Commitments</a>
      <a class="hu-nav-link" href="/en/sitemap.html#investors">Investors</a>
    </nav>
    <div class="hu-right">
      <span class="hu-lang" aria-label="Language">
        <a href="/" hreflang="fr">FR</a>
        <span aria-hidden="true">·</span>
        <a href="/en/" hreflang="en" aria-current="true">EN</a>
      </span>
      <a class="hu-cta" href="/en/engagement/investisseurs.html">2026 Round <span class="hu-cta-arrow">↗</span></a>
      <button class="hu-burger" type="button" aria-label="Menu" aria-expanded="false">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</header>
<aside class="hu-drawer" aria-hidden="true">
  <button class="hu-drawer-close" aria-label="Close">×</button>
  <a href="/en/sitemap.html#mission">01 Mission</a>
  <a href="/en/sitemap.html#activities">02 Activities</a>
  <a href="/en/sitemap.html#transition">03 Energy Transition</a>
  <a href="/en/sitemap.html#technologies">04 Technologies</a>
  <a href="/en/sitemap.html#commitments">05 Commitments</a>
  <a href="/en/sitemap.html#investors">06 Investors</a>
  <a href="/en/sitemap.html">📐 Sitemap</a>
  <a href="/" hreflang="fr" style="color:#C9B57B">FR · Français ↗</a>
</aside>
<div class="hu-backdrop" aria-hidden="true"></div>
'''

# ============ FR FOOTER ============
FR_FOOTER = '''<footer class="fu-footer" role="contentinfo" data-r140="ultra">
  <div class="fu-inner">
    <div class="fu-grid">
      <div>
        <p class="fu-brand-name">EnerTchad SA</p>
        <p class="fu-slogan">Unité · Innovation · Durabilité</p>
        <p class="fu-positioning">Société <em>parapétrolière</em> (OFS) <strong>100% services techniques</strong> · marché tchadien · OHADA. Aucun asset.</p>
        <p class="fu-leadership"><strong>DG</strong> Bignéro Moïalbéi Le Madang<br><strong>PCA</strong> Théophile Gag Pinabei</p>
      </div>
      <div>
        <p class="fu-col-h">Navigation · 6 axes</p>
        <ul class="fu-list">
          <li><a href="/sitemap.html#mission">01 Mission</a></li>
          <li><a href="/sitemap.html#activites">02 Activités</a></li>
          <li><a href="/sitemap.html#transition">03 Transition énergétique</a></li>
          <li><a href="/sitemap.html#technologies">04 Technologies</a></li>
          <li><a href="/sitemap.html#engagements">05 Engagements</a></li>
          <li><a href="/sitemap.html#investisseurs">06 Investisseurs</a></li>
        </ul>
      </div>
      <div>
        <p class="fu-col-h">Tour 2026 · Pages clés</p>
        <ul class="fu-list">
          <li><a href="/engagement/investisseurs.html">Tour Seed/Pre-A</a></li>
          <li><a href="/dataroom/">Dataroom · NDA</a></li>
          <li><a href="/dg-office-hours/">DG Office Hours</a></li>
          <li><a href="/ai-concierge/">AI Concierge</a></li>
          <li><a href="/marques/">6 marques™ OAPI</a></li>
          <li><a href="/data/atlas.html">Atlas marché</a></li>
        </ul>
      </div>
      <div>
        <p class="fu-col-h">Newsletter Tour 2026</p>
        <p class="fu-newsletter-desc">Actualités investisseurs · avancées catalogue OFS · J-<span data-jn>150</span> closing.</p>
        <form class="fu-newsletter-form" action="https://formspree.io/f/enertchad-newsletter" method="POST" novalidate>
          <input type="email" name="email" placeholder="email@exemple.com" required aria-label="Adresse email">
          <button type="submit">S&rsquo;inscrire ↗</button>
        </form>
        <p class="fu-newsletter-fineprint">RGPD · désinscription 1-clic · données EU-West chiffrées</p>
      </div>
    </div>
    <div class="fu-meta">
      <div class="fu-badges">
        <span class="fu-badge">ITIE</span>
        <span class="fu-badge">OHADA</span>
        <span class="fu-badge">ISO 9001 · 14001 · 45001</span>
        <span class="fu-badge">OAPI 2026</span>
      </div>
      <div class="fu-legal">
        <span>© 2026 <strong>EnerTchad SA</strong></span>
        <span class="fu-sep">·</span>
        <span>RCCM N&rsquo;DJ/RC/2026-A-0001</span>
        <span class="fu-sep">·</span>
        <span>Capital 10 000 000 FCFA</span>
        <span class="fu-sep">·</span>
        <a href="/sitemap.html">Plan du site</a>
        <span class="fu-sep">·</span>
        <a href="/legal/mentions-legales.html">Mentions légales</a>
        <span class="fu-sep">·</span>
        <a href="/legal/confidentialite.html">Confidentialité</a>
        <span class="fu-sep">·</span>
        <a href="/legal/cookies.html">Cookies</a>
      </div>
    </div>
  </div>
</footer>'''

# ============ EN FOOTER ============
EN_FOOTER = '''<footer class="fu-footer" role="contentinfo" data-r140="ultra">
  <div class="fu-inner">
    <div class="fu-grid">
      <div>
        <p class="fu-brand-name">EnerTchad SA</p>
        <p class="fu-slogan">Unity · Innovation · Sustainability</p>
        <p class="fu-positioning"><em>Oil Field Services</em> (OFS) company · <strong>100% technical services</strong> · Chad market · OHADA. We do not own any assets.</p>
        <p class="fu-leadership"><strong>CEO</strong> Bignéro Moïalbéi Le Madang<br><strong>Chairman</strong> Théophile Gag Pinabei</p>
      </div>
      <div>
        <p class="fu-col-h">Navigation · 6 axes</p>
        <ul class="fu-list">
          <li><a href="/en/sitemap.html#mission">01 Mission</a></li>
          <li><a href="/en/sitemap.html#activities">02 Activities</a></li>
          <li><a href="/en/sitemap.html#transition">03 Energy Transition</a></li>
          <li><a href="/en/sitemap.html#technologies">04 Technologies</a></li>
          <li><a href="/en/sitemap.html#commitments">05 Commitments</a></li>
          <li><a href="/en/sitemap.html#investors">06 Investors</a></li>
        </ul>
      </div>
      <div>
        <p class="fu-col-h">2026 Round · Key pages</p>
        <ul class="fu-list">
          <li><a href="/en/engagement/investisseurs.html">Seed/Pre-A Round</a></li>
          <li><a href="/en/dataroom/">Dataroom · NDA</a></li>
          <li><a href="/en/ai-concierge/">AI Concierge</a></li>
          <li><a href="/en/marques/">6 brands™ OAPI</a></li>
          <li><a href="/en/data/atlas.html">Market atlas</a></li>
          <li><a href="/en/about/">About us</a></li>
        </ul>
      </div>
      <div>
        <p class="fu-col-h">2026 Round Newsletter</p>
        <p class="fu-newsletter-desc">Investor updates · OFS catalog progress · J-<span data-jn>150</span> closing.</p>
        <form class="fu-newsletter-form" action="https://formspree.io/f/enertchad-newsletter" method="POST" novalidate>
          <input type="email" name="email" placeholder="email@example.com" required aria-label="Email">
          <button type="submit">Subscribe ↗</button>
        </form>
        <p class="fu-newsletter-fineprint">GDPR · 1-click unsubscribe · EU-West encrypted data</p>
      </div>
    </div>
    <div class="fu-meta">
      <div class="fu-badges">
        <span class="fu-badge">EITI</span>
        <span class="fu-badge">OHADA</span>
        <span class="fu-badge">ISO 9001 · 14001 · 45001</span>
        <span class="fu-badge">OAPI 2026</span>
      </div>
      <div class="fu-legal">
        <span>© 2026 <strong>EnerTchad SA</strong></span>
        <span class="fu-sep">·</span>
        <span>RCCM N&rsquo;DJ/RC/2026-A-0001</span>
        <span class="fu-sep">·</span>
        <span>Capital 10,000,000 FCFA</span>
        <span class="fu-sep">·</span>
        <a href="/en/sitemap.html">Sitemap</a>
      </div>
    </div>
  </div>
</footer>'''

# Pattern existing footer to replace (any footer.site-footer-v2 OR footer.footer-mini)
FOOTER_RE = re.compile(r'<footer\b[^>]*>.*?</footer>', re.S)

n_done = 0
n_skip_already = 0
n_skip_intent = 0
n_no_body = 0

for html in ROOT.rglob("*.html"):
    if any(p in SKIP_DIRS for p in html.parts): continue
    rel = str(html.relative_to(ROOT))
    if rel in SKIP_PAGES:
        n_skip_intent += 1
        continue
    try:
        c = html.read_text(encoding="utf-8")
    except: continue
    if MARKER in c:
        n_skip_already += 1
        continue
    is_en = rel.startswith("en/")
    HEADER_HTML = EN_HEADER if is_en else FR_HEADER
    FOOTER_HTML = EN_FOOTER if is_en else FR_FOOTER
    new_c = c

    # 1) Inject CSS link if missing
    if 'header-ultra.css' not in new_c:
        if '<link rel="stylesheet" href="/assets/css/enertchad.css' in new_c:
            new_c = new_c.replace(
                '<link rel="stylesheet" href="/assets/css/enertchad.css',
                CSS_LINK + '\n<link rel="stylesheet" href="/assets/css/enertchad.css',
                1
            )
    # 2) Inject JS tag if missing
    if 'header-ultra.js' not in new_c and '</body>' in new_c:
        new_c = new_c.replace('</body>', '  ' + JS_TAG + '\n</body>', 1)
    # 3) Inject header right after <body...>
    body_match = re.search(r'(<body\b[^>]*>)', new_c)
    if not body_match:
        n_no_body += 1
        continue
    new_c = new_c[:body_match.end()] + '\n' + HEADER_HTML + new_c[body_match.end():]
    # 4) Replace existing footer with ultra footer
    foot_match = FOOTER_RE.search(new_c)
    if foot_match:
        new_c = new_c[:foot_match.start()] + FOOTER_HTML + new_c[foot_match.end():]
    else:
        # No existing footer, append before </body>
        if '</body>' in new_c:
            new_c = new_c.replace('</body>', FOOTER_HTML + '\n</body>', 1)
    if new_c != c:
        html.write_text(new_c, encoding="utf-8")
        n_done += 1

print(f"=== R140 SUMMARY ===")
print(f"Pages injected with ULTRA header+footer : {n_done}")
print(f"Pages already have R140 marker          : {n_skip_already}")
print(f"Pages intentionally skipped             : {n_skip_intent}")
print(f"Pages without <body>                    : {n_no_body}")
