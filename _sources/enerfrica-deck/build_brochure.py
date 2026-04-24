#!/usr/bin/env python3
"""
Enerfrica — Brochure corporate · 12 pages · A4 portrait
Build : python3 build_brochure.py
Output : Enerfrica-Brochure-v1.pdf
"""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Palette ─────────────────────────────────────────────────────
NAVY     = HexColor("#003366")
NAVY_2   = HexColor("#00264D")
NAVY_3   = HexColor("#001A33")
ICE      = HexColor("#CADCFC")
GOLD     = HexColor("#D4A24C")
GOLD_2   = HexColor("#B68A3E")
CREAM    = HexColor("#F7F5EF")
WHITE    = HexColor("#FFFFFF")
INK      = HexColor("#1A2340")
INK_2    = HexColor("#45506B")
MUTED    = HexColor("#7E8AA3")
HAIR     = HexColor("#D9DEEC")
GREEN    = HexColor("#2F7D4F")

# ── Geometry (A4 portrait = 595 × 842 pts) ──────────────────────
W, H = A4               # 595.27 × 841.89
MARGIN = 45
CONTENT_W = W - 2 * MARGIN
OUT = "Enerfrica-Brochure-v1.pdf"

# Try register Helvetica Neue-like, fall back to Helvetica
FONT_H = "Helvetica-Bold"
FONT_HN = "Helvetica"       # headings normal weight
FONT_B = "Helvetica"
FONT_BO = "Helvetica-Oblique"
FONT_BB = "Helvetica-Bold"

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("Enerfrica — Brochure corporate")
c.setAuthor("Enerfrica — African Energy Holdings")
c.setSubject("Groupe énergétique privé, indépendant et panafricain")

# ── Helpers ──────────────────────────────────────────────────────
def draw_header(page_num, total=12, variant="light"):
    """Top band + logo + page count."""
    if variant == "light":
        bar_color = NAVY
        text_color = NAVY
        sub_color = MUTED
    else:
        bar_color = GOLD
        text_color = GOLD
        sub_color = ICE
    # thin top accent
    c.setFillColor(bar_color)
    c.rect(0, H - 3, W, 3, fill=1, stroke=0)
    # wordmark
    c.setFillColor(text_color)
    c.setFont(FONT_H, 9)
    c.drawString(MARGIN, H - 22, "ENERFRICA")
    c.setFillColor(sub_color)
    c.setFont(FONT_B, 8)
    c.drawString(MARGIN + 58, H - 22, "African Energy Holdings")
    # Page number top right
    c.setFillColor(text_color)
    c.setFont(FONT_H, 9)
    c.drawRightString(W - MARGIN, H - 22, f"{page_num:02d} / {total:02d}")


def draw_footer(page_num, variant="light"):
    col = MUTED if variant == "light" else ICE
    c.setFillColor(col)
    c.setFont(FONT_B, 7.5)
    c.drawString(MARGIN, 22, "© 2026 Enerfrica — African Energy Holdings  ·  Strictement confidentiel")
    c.drawRightString(W - MARGIN, 22, "Cameroun · Tchad · Centrafrique")


def draw_kicker(text, y, color=GOLD):
    c.setFillColor(color)
    c.setFont(FONT_H, 8.5)
    c.drawString(MARGIN, y, text.upper())


def draw_title(text, y, size=22, color=NAVY, max_w=None):
    c.setFillColor(color)
    c.setFont(FONT_H, size)
    if max_w is None:
        max_w = CONTENT_W
    # simple wrapping
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if c.stringWidth(t, FONT_H, size) > max_w and cur:
            lines.append(cur)
            cur = w
        else:
            cur = t
    if cur: lines.append(cur)
    for i, ln in enumerate(lines):
        c.drawString(MARGIN, y - i * (size * 1.15), ln)
    return y - (len(lines) - 1) * (size * 1.15)


def draw_paragraph(text, x, y, w, font=FONT_B, size=10, leading=13.5, color=INK,
                   justify=False):
    """Wrap text manually. Returns the y of the last baseline drawn."""
    c.setFillColor(color)
    c.setFont(font, size)
    paragraphs = text.split("\n")
    cy = y
    for para in paragraphs:
        if not para.strip():
            cy -= leading * 0.5
            continue
        words = para.split()
        cur = ""
        for wd in words:
            t = (cur + " " + wd).strip()
            if c.stringWidth(t, font, size) > w and cur:
                c.drawString(x, cy, cur)
                cy -= leading
                cur = wd
            else:
                cur = t
        if cur:
            c.drawString(x, cy, cur)
            cy -= leading
    return cy


def draw_bullet_list(items, x, y, w, size=10, leading=14, color=INK,
                     bullet_color=None, bullet="■"):
    bc = bullet_color or GOLD
    cy = y
    for it in items:
        # Draw bullet
        c.setFillColor(bc)
        c.setFont(FONT_H, size)
        c.drawString(x, cy, bullet)
        # Draw text (may wrap)
        last = draw_paragraph(it, x + 14, cy, w - 14, size=size, leading=leading, color=color)
        cy = last - 4
    return cy


def hline(y, color=HAIR, width=0.5, x1=MARGIN, x2=None):
    if x2 is None: x2 = W - MARGIN
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y, x2, y)


def draw_accent_bar(x, y, w=60, color=GOLD):
    c.setFillColor(color)
    c.rect(x, y, w, 2.5, fill=1, stroke=0)


def card(x, y, w, h, accent=NAVY, fill=WHITE, radius=6):
    # Border-topped card
    c.setFillColor(fill)
    c.setStrokeColor(HAIR)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    # Accent stripe top
    c.setFillColor(accent)
    c.rect(x, y + h - 3, w, 3, fill=1, stroke=0)


# ── PAGE 1 — COUVERTURE ─────────────────────────────────────────
# Full dark page
c.setFillColor(NAVY_2)
c.rect(0, 0, W, H, fill=1, stroke=0)

# Gold accent bar top
c.setFillColor(GOLD)
c.rect(0, H - 4, W, 4, fill=1, stroke=0)

# Large circle top right (decorative)
c.setFillColor(NAVY_3)
c.circle(W + 30, H - 150, 220, fill=1, stroke=0)

# Corridor line at bottom
c.setStrokeColor(GOLD)
c.setLineWidth(1.5)
c.line(60, 180, W - 60, 180)
# Waypoints
for wx, label, col in [(60, "Douala", GOLD), (W / 2 - 10, "Ngaoundéré", ICE), (W - 60, "N'Djamena → Bangui", GOLD)]:
    c.setFillColor(col)
    c.circle(wx, 180, 6, fill=1, stroke=0)
    c.setFillColor(ICE)
    c.setFont(FONT_B, 8)
    c.drawCentredString(wx, 165, label)

# Wordmark
c.setFillColor(WHITE)
c.setFont(FONT_H, 54)
c.drawString(MARGIN, H - 330, "ENERFRICA")

c.setFillColor(GOLD)
c.setFont(FONT_BO, 18)
c.drawString(MARGIN, H - 358, "African Energy Holdings")

c.setFillColor(ICE)
c.setFont(FONT_B, 12)
c.drawString(MARGIN, H - 402, "Groupe énergétique privé, indépendant et panafricain.")

# Baseline tag
c.setFillColor(GOLD)
c.rect(MARGIN, H - 470, 160, 26, fill=1, stroke=0)
c.setFillColor(NAVY_2)
c.setFont(FONT_H, 10)
c.drawCentredString(MARGIN + 80, H - 461, "BROCHURE CORPORATE")

# Tag baseline
c.setFillColor(WHITE)
c.setFont(FONT_BO, 14)
c.drawString(MARGIN, H - 510, "Connecting Energy Across Central Africa.")

# Footer line
c.setFillColor(ICE)
c.setFont(FONT_B, 9)
c.drawRightString(W - MARGIN, 60, "Cameroun  ·  Tchad  ·  Centrafrique")
c.setFillColor(MUTED)
c.setFont(FONT_B, 8)
c.drawString(MARGIN, 60, "Édition v1.0  ·  Avril 2026  ·  Strictement confidentiel")
c.showPage()

# ── PAGE 2 — MESSAGE DU GROUPE ──────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
# side accent
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(2)

draw_kicker("Message du groupe", H - 70)
draw_title("L'Afrique centrale mérite une infrastructure énergétique moderne, fiable et durable.", H - 100, size=20)

hline(H - 220, GOLD, 2, MARGIN, MARGIN + 40)

c.setFillColor(INK)
c.setFont(FONT_B, 11.5)
y = H - 250
y = draw_paragraph(
    "Enerfrica est née d'une conviction simple : l'Afrique centrale mérite une "
    "infrastructure énergétique moderne, fiable et durable. Après des décennies "
    "d'initiatives fragmentées, l'heure est à une approche intégrée, industrielle, "
    "et patiemment construite.",
    MARGIN, y, CONTENT_W, size=11.5, leading=16, color=INK,
)
y -= 10
y = draw_paragraph(
    "Nous opérons avec une approche privée, indépendante et apolitique, en construisant "
    "un corridor énergétique stratégique reliant le Cameroun, le Tchad et la Centrafrique. "
    "Notre ambition n'est pas uniquement commerciale : elle est régionale, technologique "
    "et humaine.",
    MARGIN, y, CONTENT_W, size=11.5, leading=16, color=INK,
)
y -= 20

# Mission callout
c.setFillColor(NAVY)
c.roundRect(MARGIN, y - 130, CONTENT_W, 130, 8, fill=1, stroke=0)
c.setFillColor(GOLD)
c.setFont(FONT_H, 9)
c.drawString(MARGIN + 24, y - 30, "NOTRE MISSION")
c.setFillColor(WHITE)
c.setFont(FONT_HN, 16)
draw_paragraph(
    "Fournir une énergie fiable, sécurisée et technologiquement avancée "
    "aux populations, entreprises et institutions d'Afrique centrale.",
    MARGIN + 24, y - 54, CONTENT_W - 48, font=FONT_HN, size=14, leading=19, color=WHITE,
)

# Signature
c.setFillColor(MUTED)
c.setFont(FONT_B, 9)
c.drawString(MARGIN, 90, "— La Direction Générale, N'Djamena, avril 2026.")

draw_footer(2)
c.showPage()

# ── PAGE 3 — QUI NOUS SOMMES ────────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(3)

draw_kicker("Qui nous sommes", H - 70)
draw_title("Holding énergétique panafricaine, structurée autour de quatre piliers.", H - 100, size=20)

y = H - 180
y = draw_paragraph(
    "Enerfrica est une holding énergétique panafricaine, privée et indépendante, opérant "
    "au Cameroun, au Tchad et en Centrafrique. Notre modèle repose sur une gouvernance "
    "moderne, une exécution locale rigoureuse et une vision long terme.",
    MARGIN, y, CONTENT_W, size=11, leading=15, color=INK,
)

# 4 pillars in 2x2
pillars = [
    ("Énergie", "Importation, transit, distribution — toute la chaîne pétrolière."),
    ("Technologie", "EnerTech™ — SCADA, IoT, Digital Twin, IA prédictive."),
    ("Énergie propre", "GreenTech™ — solaire industriel, mini-grids, hybridation."),
    ("Services industriels", "EnerServ™ — drilling, artificial lift, pipeline integrity, HSE."),
]
col_w = (CONTENT_W - 15) / 2
row_h = 90
y0 = H - 360
for i, (t, d) in enumerate(pillars):
    col = i % 2
    row = i // 2
    x = MARGIN + col * (col_w + 15)
    y = y0 - row * (row_h + 15)
    card(x, y - row_h, col_w, row_h, accent=GOLD)
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 14)
    c.drawString(x + 18, y - 30, f"0{i+1}.  {t}")
    draw_paragraph(d, x + 18, y - 52, col_w - 36, size=10, leading=13, color=INK_2)

# 3-country band
y_band = 160
c.setFillColor(NAVY)
c.roundRect(MARGIN, y_band - 70, CONTENT_W, 80, 6, fill=1, stroke=0)
c.setFillColor(GOLD)
c.setFont(FONT_H, 9)
c.drawString(MARGIN + 24, y_band - 20, "TROIS PAYS · UNE GOUVERNANCE")
c.setFillColor(WHITE)
c.setFont(FONT_H, 18)
c.drawString(MARGIN + 24, y_band - 44, "Cameroun  ·  Tchad  ·  Centrafrique")

draw_footer(3)
c.showPage()

# ── PAGE 4 — NOTRE VISION ───────────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(4)

draw_kicker("Notre vision", H - 70)
draw_title("Construire le corridor énergétique de référence en Afrique centrale.", H - 100, size=20)

y = H - 180
y = draw_paragraph(
    "Ce corridor relie trois pays, trois filiales, et trois expertises transversales. "
    "Il est conçu pour livrer en 2026-2030 ce que l'Afrique centrale attend depuis "
    "deux décennies : une chaîne énergétique fiable, tracée et résiliente.",
    MARGIN, y, CONTENT_W, size=11, leading=15, color=INK,
)

# Corridor diagram
cy = H - 330
c.setStrokeColor(GOLD)
c.setLineWidth(2)
c.line(MARGIN + 40, cy, W - MARGIN - 40, cy)
steps = [
    (MARGIN + 40, "1", "Cameroun",   "Importation"),
    ((MARGIN + W - MARGIN) / 2, "2", "Tchad",   "Transit + Réception"),
    (W - MARGIN - 40, "3", "Centrafrique", "Distribution"),
]
for x, num, country, fn in steps:
    c.setFillColor(GOLD)
    c.circle(x, cy, 12, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 12)
    c.drawCentredString(x, cy - 4, num)
    c.setFillColor(MUTED)
    c.setFont(FONT_H, 8)
    c.drawCentredString(x, cy + 30, country.upper())
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 13)
    c.drawCentredString(x, cy - 40, country)
    c.setFillColor(GOLD)
    c.setFont(FONT_BO, 10)
    c.drawCentredString(x, cy - 58, fn)

# Benefits list
y = H - 460
draw_kicker("Ce que permet le corridor", y)
benefits = [
    "L'importation hydrocarbures via le Cameroun (Douala + Ngaoundéré).",
    "Le transit sécurisé et tracé vers le Tchad.",
    "La distribution finale au Tchad et en Centrafrique.",
    "La traçabilité complète via EnerTech™ (SCADA + IoT + Digital Twin).",
    "L'intégration progressive d'énergies propres via GreenTech™.",
]
draw_bullet_list(benefits, MARGIN, y - 20, CONTENT_W, size=10.5, leading=15, bullet_color=GOLD)

draw_footer(4)
c.showPage()

# ── PAGE 5 — NOTRE MODÈLE ───────────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(5)

draw_kicker("Notre modèle", H - 70)
draw_title("Un modèle intégré, fiable et adapté aux réalités du terrain.", H - 100, size=20)

y = H - 180
y = draw_paragraph(
    "Chaque étape du modèle est opérée en propre ou via une filiale dédiée. Pas d'externalisation critique.",
    MARGIN, y, CONTENT_W, size=11, leading=15, color=INK_2, font=FONT_BO,
)
y -= 10

# 6 process steps
steps = [
    ("01", "Importation",     "Enercam · Douala",      "Ports, terminaux, dépôts, contrôle qualité.", NAVY),
    ("02", "Transit",         "Enercam · Ngaoundéré",  "Logistique Nord & Sahel, acheminement sécurisé.", NAVY),
    ("03", "Réception",       "EnerTchad",             "Stockage, contrôle qualité, distribution nationale.", NAVY),
    ("04", "Distribution",    "EnerTchad + Enerca",    "Stations-service, entreprises, institutions.", NAVY),
    ("05", "Technologie",     "EnerTech™",             "SCADA, IoT, Digital Twin™, AI Predictive™.", GOLD),
    ("06", "Énergie propre",  "GreenTech™",            "Mini-grids, HybridGrid™, Mobile Station™.", GREEN),
]
y0 = H - 240
for i, (n, title, subtitle, desc, col) in enumerate(steps):
    y_card = y0 - i * 65
    # circle
    c.setFillColor(col)
    c.circle(MARGIN + 18, y_card - 18, 14, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_H, 10)
    c.drawCentredString(MARGIN + 18, y_card - 21, n)
    # title
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 13)
    c.drawString(MARGIN + 45, y_card - 10, title)
    c.setFillColor(col)
    c.setFont(FONT_BO, 10)
    c.drawString(MARGIN + 45 + c.stringWidth(title, FONT_H, 13) + 10, y_card - 10, f"·  {subtitle}")
    # desc
    c.setFillColor(INK_2)
    c.setFont(FONT_B, 10)
    c.drawString(MARGIN + 45, y_card - 28, desc)
    # separator
    if i < len(steps) - 1:
        hline(y_card - 45, HAIR, 0.5, MARGIN + 45, W - MARGIN)

draw_footer(5)
c.showPage()

# ── PAGE 6 — NOS FILIALES ───────────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(6)

draw_kicker("Nos filiales", H - 70)
draw_title("Trois entités opérationnelles. Une seule gouvernance Enerfrica.", H - 100, size=20)

subs = [
    ("Enercam",   "Cameroun",      "Le point d'entrée énergétique de la région.\nImportation, transit, logistique transfrontalière.\nDouala (siège) · Ngaoundéré (transit).", GOLD,  "CM"),
    ("EnerTchad", "Tchad",         "Opérateur énergétique privé national.\nUpstream · Downstream · Distribution.\nN'Djamena (siège).", NAVY, "TD"),
    ("Enerca",    "Centrafrique",  "Distribution hydrocarbures + solutions entreprises.\nStations-service · mines · BTP · transport.\nBangui (siège).", GREEN, "CF"),
]
y0 = H - 180
for i, (name, country, desc, accent, code) in enumerate(subs):
    y_card = y0 - i * 160
    card(MARGIN, y_card - 140, CONTENT_W, 140, accent=accent)
    # Country code circle
    c.setFillColor(accent)
    c.circle(MARGIN + 40, y_card - 38, 22, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_H, 14)
    c.drawCentredString(MARGIN + 40, y_card - 43, code)
    # Name
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 22)
    c.drawString(MARGIN + 80, y_card - 32, name)
    # Country subtitle
    c.setFillColor(accent)
    c.setFont(FONT_BO, 12)
    c.drawString(MARGIN + 80, y_card - 50, country)
    # Description paragraphs
    draw_paragraph(desc, MARGIN + 80, y_card - 78, CONTENT_W - 120, size=10.5, leading=14, color=INK_2)

draw_footer(6)
c.showPage()

# ── PAGE 7 — ENERCAM (FOCUS) ────────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(GOLD)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(7)

draw_kicker("Focus filiale · Cameroun", H - 70)
draw_title("Enercam — Hub logistique & midstream du groupe.", H - 100, size=22, color=NAVY)

# Key metric callout
card(MARGIN, H - 240, CONTENT_W, 90, accent=GOLD)
c.setFillColor(GOLD)
c.setFont(FONT_H, 9)
c.drawString(MARGIN + 24, H - 175, "RÔLE")
c.setFillColor(NAVY)
c.setFont(FONT_H, 15)
c.drawString(MARGIN + 24, H - 198, "Le point d'entrée énergétique unique du corridor Enerfrica.")
c.setFillColor(INK_2)
c.setFont(FONT_B, 11)
c.drawString(MARGIN + 24, H - 220, "Tout flux hydrocarbures Tchad / RCA / CEMAC transite par Enercam.")

# Functions
y = H - 285
draw_kicker("Fonctions opérationnelles", y)
fns = [
    "Importation hydrocarbures (brut + produits raffinés).",
    "Stockage & contrôle qualité au terminal de Douala.",
    "Transit ferré et routier vers Ngaoundéré et le Nord.",
    "Logistique transfrontalière sécurisée (TCCF).",
    "Monitoring SCADA & IoT tout au long de la chaîne.",
]
draw_bullet_list(fns, MARGIN, y - 20, CONTENT_W, size=11, leading=15)

# Implantations
y = 280
draw_kicker("Implantations", y)
y -= 20
card(MARGIN, y - 90, (CONTENT_W - 15) / 2, 90, accent=GOLD)
c.setFillColor(NAVY)
c.setFont(FONT_H, 14)
c.drawString(MARGIN + 18, y - 28, "Douala")
c.setFillColor(GOLD)
c.setFont(FONT_BO, 9)
c.drawString(MARGIN + 18, y - 44, "BUREAU CENTRAL")
c.setFillColor(INK_2)
c.setFont(FONT_B, 10)
c.drawString(MARGIN + 18, y - 62, "Port maritime · direction générale")
c.drawString(MARGIN + 18, y - 76, "Opérations commerciales · achats")

x2 = MARGIN + (CONTENT_W - 15) / 2 + 15
card(x2, y - 90, (CONTENT_W - 15) / 2, 90, accent=GOLD)
c.setFillColor(NAVY)
c.setFont(FONT_H, 14)
c.drawString(x2 + 18, y - 28, "Ngaoundéré")
c.setFillColor(GOLD)
c.setFont(FONT_BO, 9)
c.drawString(x2 + 18, y - 44, "POSTE D'OPÉRATIONS")
c.setFillColor(INK_2)
c.setFont(FONT_B, 10)
c.drawString(x2 + 18, y - 62, "Transit Nord · hub ferroviaire")
c.drawString(x2 + 18, y - 76, "Plateforme logistique Sahel")

draw_footer(7)
c.showPage()

# ── PAGE 8 — ENERTCHAD (FOCUS) ──────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(8)

draw_kicker("Focus filiale · Tchad", H - 70)
draw_title("EnerTchad — Opérateur énergétique privé du Tchad.", H - 100, size=22, color=NAVY)

card(MARGIN, H - 240, CONTENT_W, 90, accent=NAVY)
c.setFillColor(GOLD)
c.setFont(FONT_H, 9)
c.drawString(MARGIN + 24, H - 175, "RÔLE")
c.setFillColor(NAVY)
c.setFont(FONT_H, 15)
c.drawString(MARGIN + 24, H - 198, "Opérateur énergétique national — chaîne intégrée du forage à la pompe.")
c.setFillColor(INK_2)
c.setFont(FONT_B, 11)
c.drawString(MARGIN + 24, H - 220, "Cinq bassins opérés · raffinerie Djermaya · 45 stations-service.")

y = H - 285
draw_kicker("Fonctions opérationnelles", y)
fns = [
    "Upstream : E&P, Artificial Lift, EOR sur les bassins matures et nouveaux blocs.",
    "Downstream : raffinerie Djermaya (20 kb/j) · GPL · lubrifiants.",
    "Distribution nationale : 45 stations-service dans 6 villes.",
    "Exportation vers la Centrafrique (via Enerca).",
    "Solutions entreprises (mines, BTP, transport).",
    "Mobile Station™ containerisée (48 h, ATEX Zone 1, Starlink-ready).",
]
draw_bullet_list(fns, MARGIN, y - 20, CONTENT_W, size=11, leading=15)

# KPI band
y_band = 150
c.setFillColor(NAVY)
c.rect(MARGIN, y_band - 85, CONTENT_W, 90, fill=1, stroke=0)
c.setFillColor(GOLD)
c.setFont(FONT_H, 8.5)
c.drawString(MARGIN + 24, y_band - 20, "INDICATEURS CLÉS 2026")
stats = [("144", "kb/j", "Amont"), ("45", "", "Stations"), ("20", "kb/j", "Raffinerie"), ("5", "", "Bassins")]
sw = (CONTENT_W - 48) / 4
for i, (v, u, l) in enumerate(stats):
    sx = MARGIN + 24 + i * sw
    c.setFillColor(WHITE)
    c.setFont(FONT_H, 22)
    c.drawString(sx, y_band - 50, v)
    if u:
        c.setFillColor(ICE)
        c.setFont(FONT_B, 10)
        c.drawString(sx + c.stringWidth(v, FONT_H, 22) + 3, y_band - 50, u)
    c.setFillColor(ICE)
    c.setFont(FONT_B, 9)
    c.drawString(sx, y_band - 70, l)

draw_footer(8)
c.showPage()

# ── PAGE 9 — ENERCA (FOCUS) ─────────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(GREEN)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(9)

draw_kicker("Focus filiale · Centrafrique", H - 70)
draw_title("Enerca — Distribution hydrocarbures en Centrafrique.", H - 100, size=22, color=NAVY)

card(MARGIN, H - 240, CONTENT_W, 90, accent=GREEN)
c.setFillColor(GREEN)
c.setFont(FONT_H, 9)
c.drawString(MARGIN + 24, H - 175, "RÔLE")
c.setFillColor(NAVY)
c.setFont(FONT_H, 15)
c.drawString(MARGIN + 24, H - 198, "Opérateur de distribution B2C et B2B en République centrafricaine.")
c.setFillColor(INK_2)
c.setFont(FONT_B, 11)
c.drawString(MARGIN + 24, H - 220, "Approvisionné via le corridor Enerfrica (Cameroun → Tchad → RCA).")

y = H - 285
draw_kicker("Fonctions opérationnelles", y)
fns = [
    "Réception depuis le Tchad (pipeline et route, flux certifié).",
    "Stockage local — dépôts Bangui + dépôts régionaux.",
    "Distribution stations-service (réseau B2C en expansion).",
    "Solutions entreprises : mines, BTP, transport, humanitaire.",
    "Déploiement progressif du réseau Enerca sur les axes stratégiques.",
]
draw_bullet_list(fns, MARGIN, y - 20, CONTENT_W, size=11, leading=15)

# Evolution callout
y = 200
c.setFillColor(GREEN)
c.roundRect(MARGIN, y - 90, CONTENT_W, 90, 6, fill=1, stroke=0)
c.setFillColor(HexColor("#CDE7D7"))
c.setFont(FONT_H, 9)
c.drawString(MARGIN + 24, y - 25, "ÉVOLUTIONS PRÉVUES (2028+)")
c.setFillColor(WHITE)
c.setFont(FONT_H, 14)
c.drawString(MARGIN + 24, y - 50, "Mini-grids ruraux  ·  HybridGrid™  ·  GPL")
c.setFillColor(HexColor("#E8F2EC"))
c.setFont(FONT_BO, 10)
c.drawString(MARGIN + 24, y - 72, "L'énergie va là où les populations en ont le plus besoin.")

draw_footer(9)
c.showPage()

# ── PAGE 10 — EXPERTISES TRANSVERSALES ──────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(10)

draw_kicker("Expertises transversales", H - 70)
draw_title("Trois marques d'expertise, un moteur de différenciation.", H - 100, size=20)

y = H - 180
y = draw_paragraph(
    "Les marques d'expertise Enerfrica se déploient à travers les trois filiales. Elles mutualisent R&D, standards et compétences, et peuvent être prestées à des opérateurs tiers sous contrat.",
    MARGIN, y, CONTENT_W, size=11, leading=15, color=INK_2, font=FONT_BO,
)

expertises = [
    ("EnerTech™",  "Technology & Digital",            NAVY,  ["Digital Twin™", "SCADA & IoT industriel", "AI Predictive™ (réservoir & pipeline)", "Cyber OT (IEC 62443)", "EOR Lab™ (chimie réservoir)"]),
    ("GreenTech™", "Clean Energy & Mini-Grids",       GREEN, ["SolarField™ (solaire industriel)", "HybridGrid™ (hybridation diesel-solaire)", "Mobile Station™ Hybrid", "Mini-grids villageois", "Efficacité énergétique & CO₂"]),
    ("EnerServ™",  "Industrial Services",             GOLD,  ["Drilling (forage directionnel)", "Artificial Lift (ESP, gas-lift)", "Pipeline Integrity (API 1160, ILI, pigging)", "HSE (ISO 45001, zero-harm)"]),
]
y0 = H - 280
ch = 140
for i, (brand, tag, col, pts) in enumerate(expertises):
    y_card = y0 - i * 160
    card(MARGIN, y_card - ch, CONTENT_W, ch, accent=col)
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 18)
    c.drawString(MARGIN + 24, y_card - 30, brand)
    c.setFillColor(col)
    c.setFont(FONT_BO, 11)
    c.drawString(MARGIN + 24, y_card - 48, tag)
    # bullets on right
    bx = MARGIN + 240
    bw = CONTENT_W - 260
    cy = y_card - 28
    for p in pts:
        c.setFillColor(col)
        c.setFont(FONT_H, 10)
        c.drawString(bx, cy, "■")
        c.setFillColor(INK)
        c.setFont(FONT_B, 10)
        c.drawString(bx + 12, cy, p)
        cy -= 16

draw_footer(10)
c.showPage()

# ── PAGE 11 — NOS ENGAGEMENTS ───────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(NAVY)
c.rect(0, 0, 6, H, fill=1, stroke=0)
draw_header(11)

draw_kicker("Nos engagements", H - 70)
draw_title("Fiabilité. Sécurité. Performance.", H - 100, size=22, color=NAVY)
c.setFillColor(INK_2)
c.setFont(FONT_BO, 13)
c.drawString(MARGIN, H - 130, "Les piliers non-négociables de l'approche Enerfrica.")

engagements = [
    ("01", "Fiabilité énergétique",       "Continuité d'approvisionnement · 24/7 · redondance opérationnelle."),
    ("02", "Sécurité opérationnelle",     "ISO 45001 · API RP 75 · IEC 62443 · audits tiers systématiques."),
    ("03", "Traçabilité complète",        "De l'importation à la distribution, chaque litre est tracé (SCADA + IoT)."),
    ("04", "Standards OHADA",             "Société anonyme · conseil d'administration · reporting IFRS."),
    ("05", "Gouvernance moderne",         "Comités spécialisés · administrateurs indépendants · anticorruption ISO 37001."),
    ("06", "Approche privée & apolitique","Capital privé · décisions commerciales · transparence institutionnelle."),
    ("07", "Soutien aux économies locales","85 % d'effectifs nationaux · contenu local · formation EnerAcademy."),
]
y0 = H - 180
for i, (n, title, desc) in enumerate(engagements):
    y = y0 - i * 60
    # Number pill
    c.setFillColor(GOLD)
    c.roundRect(MARGIN, y - 28, 36, 28, 4, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 14)
    c.drawCentredString(MARGIN + 18, y - 20, n)
    # Title + desc
    c.setFillColor(NAVY)
    c.setFont(FONT_H, 13)
    c.drawString(MARGIN + 52, y - 10, title)
    c.setFillColor(INK_2)
    c.setFont(FONT_B, 10.5)
    c.drawString(MARGIN + 52, y - 28, desc)

draw_footer(11)
c.showPage()

# ── PAGE 12 — CONTACT ───────────────────────────────────────────
c.setFillColor(NAVY_2)
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(GOLD)
c.rect(0, H - 4, W, 4, fill=1, stroke=0)

# header top
c.setFillColor(GOLD)
c.setFont(FONT_H, 9)
c.drawString(MARGIN, H - 22, "ENERFRICA")
c.setFillColor(ICE)
c.setFont(FONT_B, 8)
c.drawString(MARGIN + 58, H - 22, "African Energy Holdings")
c.setFillColor(GOLD)
c.drawRightString(W - MARGIN, H - 22, "12 / 12")

# Kicker
c.setFillColor(GOLD)
c.setFont(FONT_H, 9)
c.drawString(MARGIN, H - 80, "ENTRER EN RELATION")

# Title
c.setFillColor(WHITE)
c.setFont(FONT_H, 26)
c.drawString(MARGIN, H - 130, "Discutons d'un partenariat stratégique.")
c.setFillColor(ICE)
c.setFont(FONT_BO, 13)
c.drawString(MARGIN, H - 158, "Enerfrica — African Energy Holdings")

# Contacts grid
y0 = H - 230
contacts = [
    ("Siège groupe", ["N'Djamena, Tchad", "Sabangali · Radisson Block D"]),
    ("Email corporate", ["contact@enerfrica.com"]),
    ("Téléphone", ["+235 99 29 86 96"]),
]
for i, (label, lines) in enumerate(contacts):
    y = y0 - i * 90
    # gold bar
    c.setFillColor(GOLD)
    c.rect(MARGIN, y - 60, 3, 60, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(FONT_H, 8.5)
    c.drawString(MARGIN + 15, y - 14, label.upper())
    c.setFillColor(WHITE)
    c.setFont(FONT_H, 14)
    for j, ln in enumerate(lines):
        c.drawString(MARGIN + 15, y - 36 - j * 18, ln)

# Filiales row
y = 280
c.setFillColor(GOLD)
c.setFont(FONT_H, 8.5)
c.drawString(MARGIN, y, "NOS FILIALES")
filiales = [
    ("Enercam",   "Douala · Ngaoundéré"),
    ("EnerTchad", "N'Djamena"),
    ("Enerca",    "Bangui"),
]
fw = CONTENT_W / 3
for i, (name, city) in enumerate(filiales):
    fx = MARGIN + i * fw
    c.setFillColor(ICE)
    c.rect(fx, y - 50, 3, 40, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_H, 14)
    c.drawString(fx + 10, y - 25, name)
    c.setFillColor(ICE)
    c.setFont(FONT_BO, 10)
    c.drawString(fx + 10, y - 42, city)

# CTA
c.setFillColor(GOLD)
c.roundRect(MARGIN, 120, CONTENT_W, 80, 6, fill=1, stroke=0)
c.setFillColor(NAVY_2)
c.setFont(FONT_H, 15)
c.drawCentredString(W / 2, 170, "« Discutons d'un partenariat stratégique. »")
c.setFillColor(NAVY_2)
c.setFont(FONT_B, 11)
c.drawCentredString(W / 2, 145, "partnerships@enerfrica.com  ·  Réponse sous 48 h ouvrées")

# Footer
c.setFillColor(ICE)
c.setFont(FONT_B, 8)
c.drawCentredString(W / 2, 60, "© 2026 Enerfrica — African Energy Holdings  ·  Cameroun · Tchad · Centrafrique")
c.setFillColor(MUTED)
c.setFont(FONT_B, 7.5)
c.drawCentredString(W / 2, 44, "Édition v1.0  ·  Avril 2026  ·  Strictement confidentiel")

c.showPage()

# Save
c.save()
print(f"Wrote: {OUT} ({os.path.getsize(OUT):,} bytes)")
