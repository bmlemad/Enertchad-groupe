#!/usr/bin/env python3
"""
Generate OG cover (1200x630) + PNG favicons (32/192/512) from the master
SVG logo + brand gradient. Runs once at build time.
"""
import io
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import cairosvg
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_SVG = os.path.join(ROOT, "logo-enertchad.svg")

# ----------------------------- favicons (PNG raster) -----------------------------
def svg_to_png_bytes(svg_path, size):
    with open(svg_path, "rb") as f:
        return cairosvg.svg2png(bytestring=f.read(), output_width=size, output_height=size)

def write_png(path, raw_bytes):
    img = Image.open(io.BytesIO(raw_bytes)).convert("RGBA")
    img.save(path, "PNG", optimize=True)
    print(f"  → {os.path.relpath(path, ROOT)} ({img.size[0]}×{img.size[1]}, {len(raw_bytes)} bytes)")

print("Rendering favicons from logo-enertchad.svg")
write_png(os.path.join(ROOT, "favicon-32.png"),      svg_to_png_bytes(LOGO_SVG, 32))
write_png(os.path.join(ROOT, "icon-192.png"),        svg_to_png_bytes(LOGO_SVG, 192))
write_png(os.path.join(ROOT, "icon-512.png"),        svg_to_png_bytes(LOGO_SVG, 512))
write_png(os.path.join(ROOT, "assets/img/favicon-32.png"),        svg_to_png_bytes(LOGO_SVG, 32))
write_png(os.path.join(ROOT, "assets/img/apple-touch-icon.png"),  svg_to_png_bytes(LOGO_SVG, 180))


# ----------------------------- OG cover (1200x630) -----------------------------
print("\nRendering og-cover.png (1200×630)")

W, H = 1200, 630

# Base: navy gradient
bg = Image.new("RGB", (W, H), "#080E1A")
draw = ImageDraw.Draw(bg)
# Vertical gradient navy → slightly lighter
for y in range(H):
    t = y / H
    r = int(8  + (18 - 8)  * t)
    g = int(14 + (28 - 14) * t)
    b = int(26 + (46 - 26) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Gold radial blob (top-left)
blob = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bd = ImageDraw.Draw(blob)
for r in range(500, 0, -8):
    alpha = int(max(0, 40 - (500 - r) * 0.08))
    if alpha <= 0: continue
    bd.ellipse([200 - r, 150 - r, 200 + r, 150 + r], fill=(217, 168, 79, alpha))
bg = Image.alpha_composite(bg.convert("RGBA"), blob)

# Blue blob (bottom-right)
blob2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
b2 = ImageDraw.Draw(blob2)
for r in range(450, 0, -8):
    alpha = int(max(0, 28 - (450 - r) * 0.06))
    if alpha <= 0: continue
    b2.ellipse([1000 - r, 500 - r, 1000 + r, 500 + r], fill=(74, 143, 217, alpha))
bg = Image.alpha_composite(bg, blob2)

# Overlay the logo (right side, 300x300)
logo_bytes = svg_to_png_bytes(LOGO_SVG, 300)
logo = Image.open(io.BytesIO(logo_bytes)).convert("RGBA")
bg.paste(logo, (830, 165), logo)

# Text: brand + tagline
draw = ImageDraw.Draw(bg)

# Try to load Inter / Space Grotesk if available
def load_font(candidates, size):
    for path in candidates:
        if path and os.path.exists(path):
            try: return ImageFont.truetype(path, size)
            except: pass
    return ImageFont.load_default()

font_dirs = ["/usr/share/fonts/truetype/dejavu/", "/usr/share/fonts/"]
inter_paths = [d + "DejaVuSans-Bold.ttf" for d in font_dirs] + \
              [d + "DejaVuSans.ttf" for d in font_dirs]

f_title    = load_font(inter_paths, 82)
f_subtitle = load_font(inter_paths, 38)
f_small    = load_font(inter_paths, 22)

# Brand name
draw.text((80, 200), "EnerTchad", font=f_title, fill=(255, 255, 255, 255))
# Accent (Groupe)
draw.text((80, 290), "Groupe", font=f_title, fill=(217, 168, 79, 255))
# Tagline
draw.text((80, 410), "L'énergie qui bâtit", font=f_subtitle, fill=(255, 255, 255, 220))
draw.text((80, 455), "le Tchad de demain.", font=f_subtitle, fill=(217, 168, 79, 255))
# Meta
draw.text((80, 540), "enertchad-groupe.pages.dev  ·  5 bassins  ·  1 070 km pipeline  ·  125 MW solaire",
          font=f_small, fill=(255, 255, 255, 140))

# Gold bottom border
draw.rectangle([(0, H - 6), (W, H)], fill=(217, 168, 79))

# Save
out_path = os.path.join(ROOT, "assets/img/og-cover.png")
bg.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"  → {os.path.relpath(out_path, ROOT)} ({bg.size[0]}×{bg.size[1]})")

# Also save to root for social crawlers pointing to /og-cover.png
root_og = os.path.join(ROOT, "og-cover.png")
bg.convert("RGB").save(root_og, "PNG", optimize=True)
print(f"  → {os.path.relpath(root_og, ROOT)}")

print("\nDone.")
