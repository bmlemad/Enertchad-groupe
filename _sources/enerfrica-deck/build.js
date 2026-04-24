// Enerfrica — African Energy Holdings · Pitch Deck 17 slides
// Build: node build.js
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";     // 13.33 x 7.5"
pres.title = "Enerfrica — Pitch Deck";
pres.company = "Enerfrica — African Energy Holdings";

// ── Palette (Midnight Executive custom pour Enerfrica) ────────────
const NAVY   = "003366";   // brand primary
const NAVY_2 = "00264D";   // deeper navy (bg dark)
const NAVY_3 = "001A33";   // darkest
const ICE    = "CADCFC";   // ice blue (accent)
const GOLD   = "D4A24C";   // warm accent (hubs, highlights)
const CREAM  = "F7F5EF";   // light bg
const WHITE  = "FFFFFF";
const INK    = "1A2340";
const INK_2  = "45506B";
const MUTED  = "7E8AA3";
const HAIR   = "D9DEEC";
const GREEN  = "2F7D4F";   // GreenTech accent

const FONT_H = "Cambria";
const FONT_B = "Calibri";

// Slide dims (wide layout is 13.33 x 7.5)
const W = 13.33, H = 7.5;

// ── Helpers ───────────────────────────────────────────────────────
const TAG = (s, opts = {}) => s.addText("ENERFRICA", { x: 0.5, y: 0.3, w: 2, h: 0.3, fontFace: FONT_B, fontSize: 10, bold: true, color: opts.color || NAVY, charSpacing: 3 });
const FOOT = (s, page) => s.addText(`${page} / 17  ·  Enerfrica — African Energy Holdings  ·  Strictement confidentiel`, { x: 0.5, y: 7.1, w: 12.33, h: 0.3, fontFace: FONT_B, fontSize: 9, color: MUTED, align: "left" });

function darkBase(s) {
  s.background = { color: NAVY_2 };
  // Subtle accent bar top
  s.addShape("rect", { x: 0, y: 0, w: W, h: 0.08, fill: { color: GOLD } });
}
function lightBase(s, idx) {
  s.background = { color: CREAM };
  // Side accent (navy left strip)
  s.addShape("rect", { x: 0, y: 0, w: 0.14, h: H, fill: { color: NAVY } });
  // Number in corner
  s.addText(String(idx).padStart(2, "0"), { x: 12.2, y: 0.3, w: 0.8, h: 0.4, fontFace: FONT_H, fontSize: 14, color: GOLD, bold: true, align: "right" });
}

// Kicker + Title block (reused on content slides)
function titleBlock(s, kicker, title, subtitle) {
  s.addText(kicker, { x: 0.7, y: 0.8, w: 11, h: 0.3, fontFace: FONT_B, fontSize: 11, bold: true, color: GOLD, charSpacing: 3 });
  s.addText(title, { x: 0.7, y: 1.15, w: 11, h: 0.9, fontFace: FONT_H, fontSize: 32, bold: true, color: NAVY });
  if (subtitle) s.addText(subtitle, { x: 0.7, y: 2.05, w: 11, h: 0.5, fontFace: FONT_B, fontSize: 14, color: INK_2, italic: true });
}

// 3-column block (icon circle + title + text)
function threeCols(s, items, startY = 3.0) {
  const colW = 3.7, gap = 0.3, totalW = items.length * colW + (items.length - 1) * gap;
  const startX = (W - totalW) / 2;
  items.forEach((it, i) => {
    const x = startX + i * (colW + gap);
    // Card
    s.addShape("roundRect", { x, y: startY, w: colW, h: 3.3, fill: { color: WHITE }, line: { color: HAIR, width: 0.5 }, rectRadius: 0.15 });
    // Accent stripe top
    s.addShape("rect", { x, y: startY, w: colW, h: 0.1, fill: { color: it.color || NAVY } });
    // Number/icon circle
    // Lighten fill for icon circle based on accent color
    const lightMap = { "003366": "E6EDF4", "D4A24C": "F7EFD9", "2F7D4F": "E1EDE6", "5A3E85": "ECE6F3" };
    const accentFill = lightMap[it.color] || lightMap[NAVY];
    s.addShape("ellipse", { x: x + 0.3, y: startY + 0.35, w: 0.7, h: 0.7, fill: { color: accentFill }, line: { color: it.color || NAVY, width: 1 } });
    s.addText(it.index || "★", { x: x + 0.3, y: startY + 0.35, w: 0.7, h: 0.7, fontFace: FONT_H, fontSize: 20, bold: true, color: it.color || NAVY, align: "center", valign: "middle" });
    // Title
    s.addText(it.title, { x: x + 0.3, y: startY + 1.2, w: colW - 0.6, h: 0.5, fontFace: FONT_H, fontSize: 18, bold: true, color: NAVY });
    // Subtitle
    if (it.subtitle) s.addText(it.subtitle, { x: x + 0.3, y: startY + 1.7, w: colW - 0.6, h: 0.35, fontFace: FONT_B, fontSize: 11, color: GOLD, bold: true });
    // Description
    if (it.desc) s.addText(it.desc, { x: x + 0.3, y: startY + 2.05, w: colW - 0.6, h: 1.15, fontFace: FONT_B, fontSize: 11.5, color: INK_2, valign: "top" });
  });
}

// Bullet list with gold bullet squares
function bulletList(s, items, x, y, w, h) {
  const rows = items.map((t) => ({ text: t, options: { fontFace: FONT_B, fontSize: 14, color: INK, bullet: { code: "25A0" }, paraSpaceBefore: 4 } }));
  s.addText(rows, { x, y, w, h, valign: "top", color: INK });
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBase(s);
  // Map-inspired decoration : oversized "E" mark + gold corridor line
  s.addShape("ellipse", { x: 9.5, y: 1.0, w: 6, h: 6, fill: { color: NAVY_3 }, line: { type: "none" } });
  // Corridor diagonal line
  s.addShape("line", { x: 0.5, y: 6.2, w: 12.3, h: 0, line: { color: GOLD, width: 2 } });
  s.addShape("ellipse", { x: 0.3, y: 6.05, w: 0.3, h: 0.3, fill: { color: GOLD }, line: { type: "none" } });
  s.addShape("ellipse", { x: 6.5, y: 6.05, w: 0.3, h: 0.3, fill: { color: ICE }, line: { type: "none" } });
  s.addShape("ellipse", { x: 12.7, y: 6.05, w: 0.3, h: 0.3, fill: { color: GOLD }, line: { type: "none" } });
  s.addText("Douala", { x: 0.1, y: 6.45, w: 1.2, h: 0.3, fontFace: FONT_B, fontSize: 10, color: ICE, align: "center" });
  s.addText("Ngaoundéré", { x: 5.9, y: 6.45, w: 1.5, h: 0.3, fontFace: FONT_B, fontSize: 10, color: ICE, align: "center" });
  s.addText("N'Djamena → Bangui", { x: 11.5, y: 6.45, w: 1.8, h: 0.3, fontFace: FONT_B, fontSize: 10, color: ICE, align: "center" });

  // Wordmark
  s.addText("ENERFRICA", { x: 0.7, y: 2.3, w: 9, h: 1.4, fontFace: FONT_H, fontSize: 72, bold: true, color: WHITE, charSpacing: 8 });
  s.addText("African Energy Holdings", { x: 0.7, y: 3.7, w: 9, h: 0.6, fontFace: FONT_B, fontSize: 24, color: GOLD, italic: true });
  s.addText("Groupe énergétique privé, indépendant et panafricain.", { x: 0.7, y: 4.5, w: 9, h: 0.5, fontFace: FONT_B, fontSize: 16, color: ICE });
  // Pitch deck tag
  s.addShape("rect", { x: 0.7, y: 5.3, w: 2.4, h: 0.35, fill: { color: GOLD } });
  s.addText("PITCH DECK  ·  v1.0", { x: 0.7, y: 5.3, w: 2.4, h: 0.35, fontFace: FONT_B, fontSize: 11, bold: true, color: NAVY_2, align: "center", valign: "middle", charSpacing: 3 });

  s.addText("Cameroun  ·  Tchad  ·  Centrafrique", { x: 0.5, y: 7.1, w: 12.33, h: 0.3, fontFace: FONT_B, fontSize: 11, color: MUTED, align: "right", italic: true });
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2 — VISION
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 2);
  titleBlock(s, "NOTRE VISION", "Construire le corridor énergétique de référence en Afrique centrale.", "Énergie · Logistique · Technologie — dans un modèle privé, indépendant et apolitique.");

  const points = [
    { title: "Approche privée & moderne", desc: "Gouvernance d'entreprise, transparence, standards internationaux OHADA." },
    { title: "Infrastructure intégrée", desc: "De l'importation à la distribution, sans rupture de chaîne." },
    { title: "Fiabilité & performance", desc: "SCADA, IoT et IA prédictive au cœur des opérations quotidiennes." },
    { title: "Vision panafricaine", desc: "Scalabilité multi-pays ancrée dans une exécution locale rigoureuse." },
  ];
  points.forEach((p, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.7 + col * 6.1;
    const y = 3.1 + row * 1.85;
    s.addShape("rect", { x, y, w: 0.06, h: 1.6, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(p.title, { x: x + 0.25, y, w: 5.7, h: 0.45, fontFace: FONT_H, fontSize: 18, bold: true, color: NAVY });
    s.addText(p.desc, { x: x + 0.25, y: y + 0.5, w: 5.7, h: 1.1, fontFace: FONT_B, fontSize: 13, color: INK_2 });
  });
  FOOT(s, 2);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 3 — QUI NOUS SOMMES
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 3);
  titleBlock(s, "QUI NOUS SOMMES", "Enerfrica en bref.", "Holding énergétique panafricaine · Cameroun · Tchad · Centrafrique.");

  // Left : lead paragraph
  s.addText("Enerfrica est une holding énergétique panafricaine opérant au Cameroun, au Tchad et en Centrafrique, avec une stratégie claire : moderniser l'accès à l'énergie en Afrique centrale à travers un modèle privé, intégré et résilient.", {
    x: 0.7, y: 2.9, w: 6.5, h: 2.2, fontFace: FONT_B, fontSize: 15, color: INK, valign: "top", paraSpaceAfter: 8,
  });
  s.addText("Trois filiales opérationnelles. Trois marques d'expertise. Une vision partagée.", { x: 0.7, y: 5.1, w: 6.5, h: 0.6, fontFace: FONT_B, fontSize: 14, color: GOLD, italic: true, bold: true });

  // Right : 2x2 stat card
  const cards = [
    { k: "Groupe privé",    v: "100 %", sub: "Capital détenu par fondateurs" },
    { k: "Gouvernance",     v: "OHADA", sub: "Société anonyme · comités spécialisés" },
    { k: "Présence",        v: "3 pays", sub: "Cameroun · Tchad · Centrafrique" },
    { k: "Expertises",      v: "3 marques", sub: "EnerTech™ · GreenTech™ · EnerServ™" },
  ];
  cards.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 7.7 + col * 2.5;
    const y = 2.9 + row * 1.75;
    s.addShape("roundRect", { x, y, w: 2.4, h: 1.6, fill: { color: WHITE }, line: { color: HAIR, width: 0.5 }, rectRadius: 0.1 });
    s.addText(c.k.toUpperCase(), { x: x + 0.15, y: y + 0.15, w: 2.1, h: 0.3, fontFace: FONT_B, fontSize: 9, bold: true, color: MUTED, charSpacing: 2 });
    s.addText(c.v, { x: x + 0.15, y: y + 0.45, w: 2.1, h: 0.6, fontFace: FONT_H, fontSize: 24, bold: true, color: NAVY });
    s.addText(c.sub, { x: x + 0.15, y: y + 1.05, w: 2.1, h: 0.45, fontFace: FONT_B, fontSize: 10, color: INK_2 });
  });
  FOOT(s, 3);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 4 — NOTRE MODÈLE (flow diagram)
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 4);
  titleBlock(s, "NOTRE MODÈLE", "Un modèle intégré, fiable et adapté.", "Conçu pour garantir la continuité d'approvisionnement, la sécurité opérationnelle et la performance multi-pays.");

  // Flow: 6 steps across two rows
  const steps = [
    { n: "01", label: "Importation",        color: NAVY },
    { n: "02", label: "Transit",            color: NAVY },
    { n: "03", label: "Distribution",       color: NAVY },
    { n: "04", label: "Technologie",        color: GOLD },
    { n: "05", label: "Énergie propre",     color: GREEN },
    { n: "06", label: "Services industriels", color: "5A3E85" },
  ];
  const bw = 1.85, bh = 1.2, gap = 0.2, startY = 3.4;
  const totalW = steps.length * bw + (steps.length - 1) * gap;
  const startX = (W - totalW) / 2;
  steps.forEach((st, i) => {
    const x = startX + i * (bw + gap);
    s.addShape("roundRect", { x, y: startY, w: bw, h: bh, fill: { color: WHITE }, line: { color: st.color, width: 1.5 }, rectRadius: 0.1 });
    s.addText(st.n, { x, y: startY + 0.12, w: bw, h: 0.3, fontFace: FONT_H, fontSize: 11, bold: true, color: st.color, align: "center", charSpacing: 2 });
    s.addText(st.label, { x, y: startY + 0.48, w: bw, h: 0.6, fontFace: FONT_H, fontSize: 14, bold: true, color: NAVY, align: "center", valign: "middle" });
    if (i < steps.length - 1) {
      s.addText("→", { x: x + bw - 0.05, y: startY + 0.4, w: 0.3, h: 0.45, fontFace: FONT_H, fontSize: 18, color: GOLD, align: "center", bold: true });
    }
  });

  // Footnote
  s.addText("Chaque étape du modèle est opérée en propre ou via une filiale dédiée. Pas d'externalisation critique.", {
    x: 0.7, y: 5.1, w: 12, h: 0.6, fontFace: FONT_B, fontSize: 13, color: INK_2, italic: true, align: "center",
  });

  // 3 pillars under
  const pillars = [
    { k: "CONTINUITÉ", v: "Chaîne sans rupture" },
    { k: "SÉCURITÉ",   v: "Standards internationaux" },
    { k: "PERFORMANCE",v: "KPI temps réel" },
  ];
  pillars.forEach((p, i) => {
    const x = 1 + i * 3.9;
    s.addShape("rect", { x, y: 5.9, w: 0.06, h: 0.7, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(p.k, { x: x + 0.2, y: 5.9, w: 3.6, h: 0.25, fontFace: FONT_B, fontSize: 10, bold: true, color: GOLD, charSpacing: 2 });
    s.addText(p.v, { x: x + 0.2, y: 6.18, w: 3.6, h: 0.4, fontFace: FONT_H, fontSize: 15, bold: true, color: NAVY });
  });
  FOOT(s, 4);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 5 — CORRIDOR ÉNERGÉTIQUE
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 5);
  titleBlock(s, "LE CORRIDOR ÉNERGÉTIQUE", "Cameroun → Tchad → Centrafrique.", "Le corridor stratégique d'Afrique centrale — 2 000+ km d'infrastructure intégrée.");

  // Horizontal corridor visual
  const cy = 4.0;
  s.addShape("line", { x: 1.0, y: cy, w: 11.3, h: 0, line: { color: GOLD, width: 3, dashType: "solid" } });

  const stops = [
    { x: 1.0,  label: "Douala",      sub: "Importation",          country: "Cameroun",     color: NAVY },
    { x: 4.77, label: "Ngaoundéré",  sub: "Transit Nord",         country: "Cameroun",     color: NAVY },
    { x: 8.54, label: "N'Djamena",   sub: "Réception · Raffinage", country: "Tchad",         color: NAVY },
    { x: 12.3, label: "Bangui",      sub: "Distribution",         country: "Centrafrique", color: NAVY },
  ];
  stops.forEach((st, i) => {
    // Large dot
    s.addShape("ellipse", { x: st.x - 0.2, y: cy - 0.2, w: 0.4, h: 0.4, fill: { color: GOLD }, line: { color: NAVY, width: 2 } });
    // Step number above
    s.addText(String(i + 1), { x: st.x - 0.5, y: cy - 1.1, w: 1, h: 0.4, fontFace: FONT_H, fontSize: 22, bold: true, color: NAVY, align: "center" });
    // Label below
    s.addText(st.country.toUpperCase(), { x: st.x - 1.3, y: cy + 0.4, w: 2.6, h: 0.25, fontFace: FONT_B, fontSize: 9, bold: true, color: MUTED, align: "center", charSpacing: 2 });
    s.addText(st.label, { x: st.x - 1.3, y: cy + 0.65, w: 2.6, h: 0.4, fontFace: FONT_H, fontSize: 16, bold: true, color: NAVY, align: "center" });
    s.addText(st.sub, { x: st.x - 1.3, y: cy + 1.05, w: 2.6, h: 0.3, fontFace: FONT_B, fontSize: 11, color: GOLD, italic: true, align: "center" });
  });

  // Message clé band
  s.addShape("roundRect", { x: 0.7, y: 6.0, w: 12, h: 0.8, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.1 });
  s.addText("Le corridor énergétique le plus stratégique d'Afrique centrale.", {
    x: 0.7, y: 6.0, w: 12, h: 0.8, fontFace: FONT_H, fontSize: 18, bold: true, color: WHITE, align: "center", valign: "middle", italic: true,
  });
  FOOT(s, 5);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 6 — NOS FILIALES
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 6);
  titleBlock(s, "NOS FILIALES", "Une présence stratégique sur trois pays.", "Trois entités opérationnelles — une seule gouvernance Enerfrica.");

  threeCols(s, [
    { index: "TD", title: "EnerTchad", subtitle: "Tchad", color: NAVY,
      desc: "Opérateur énergétique privé du Tchad. Upstream, downstream, distribution nationale — et exportation transfrontalière vers la RCA." },
    { index: "CM", title: "Enercam", subtitle: "Cameroun", color: GOLD,
      desc: "Hub logistique et midstream du groupe. Importation Douala, transit Ngaoundéré, logistique transfrontalière tracée." },
    { index: "CF", title: "Enerca", subtitle: "Centrafrique", color: GREEN,
      desc: "Distribution hydrocarbures en Centrafrique. Stations-service, solutions B2B (mines, BTP, transport)." },
  ], 2.9);

  FOOT(s, 6);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 7 — ENERTCHAD
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 7);
  titleBlock(s, "FILIALE · TCHAD", "EnerTchad — Opérateur énergétique national.", "Upstream · Downstream · Distribution · Exportation RCA.");

  // Left : description
  s.addText("Couverture complète de la chaîne pétrolière tchadienne, avec une ambition d'intégration technologique (SCADA, IA réservoir, jumeaux numériques) qui place EnerTchad au niveau des standards des majors internationales.", {
    x: 0.7, y: 2.9, w: 5.8, h: 1.8, fontFace: FONT_B, fontSize: 14, color: INK, valign: "top",
  });

  // Right : bullet grid
  const items = [
    { t: "Upstream",      d: "E&P · Artificial Lift · EOR" },
    { t: "Downstream",    d: "Raffinerie · GPL · lubrifiants" },
    { t: "Distribution",  d: "45 stations-service · 6 villes" },
    { t: "Export RCA",    d: "Logistique transfrontalière" },
  ];
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 6.8 + col * 2.95;
    const y = 2.9 + row * 1.6;
    s.addShape("roundRect", { x, y, w: 2.85, h: 1.4, fill: { color: WHITE }, line: { color: NAVY, width: 0.75 }, rectRadius: 0.1 });
    s.addShape("rect", { x, y, w: 2.85, h: 0.08, fill: { color: NAVY }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.2, y: y + 0.25, w: 2.65, h: 0.4, fontFace: FONT_H, fontSize: 16, bold: true, color: NAVY });
    s.addText(it.d, { x: x + 0.2, y: y + 0.7, w: 2.65, h: 0.6, fontFace: FONT_B, fontSize: 12, color: INK_2 });
  });

  // Bottom stats band
  const stats = [{ v: "144", u: "kb/j", l: "Capacité Amont" }, { v: "45", u: " ", l: "Stations-service" }, { v: "20", u: "kb/j", l: "Raffinerie Djermaya" }, { v: "5", u: " ", l: "Bassins opérés" }];
  stats.forEach((st, i) => {
    const x = 0.7 + i * 3.05;
    s.addShape("rect", { x, y: 6.1, w: 2.9, h: 0.75, fill: { color: NAVY }, line: { type: "none" } });
    s.addText([{ text: st.v, options: { fontFace: FONT_H, fontSize: 24, bold: true, color: WHITE } }, { text: " " + st.u, options: { fontFace: FONT_B, fontSize: 11, color: ICE } }], { x: x + 0.15, y: 6.15, w: 2.7, h: 0.4 });
    s.addText(st.l, { x: x + 0.15, y: 6.5, w: 2.7, h: 0.3, fontFace: FONT_B, fontSize: 10, color: ICE });
  });
  FOOT(s, 7);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 8 — ENERCAM
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 8);
  titleBlock(s, "FILIALE · CAMEROUN", "Enercam — Le point d'entrée énergétique de la région.", "Importation · Transit · Logistique transfrontalière.");

  s.addText("Enercam opère le point d'entrée unique du corridor Enerfrica. Tout flux hydrocarbures destiné au Tchad, à la RCA et à la zone CEMAC transite par nos plateformes logistiques Douala et Ngaoundéré.", {
    x: 0.7, y: 2.9, w: 5.8, h: 2, fontFace: FONT_B, fontSize: 14, color: INK, valign: "top",
  });

  const items = [
    { t: "Importation",           d: "Hydrocarbures · produits raffinés" },
    { t: "Douala",                d: "Bureau central · port maritime" },
    { t: "Ngaoundéré",            d: "Transit Nord · Sahel" },
    { t: "Traçabilité",           d: "SCADA · IoT tout au long de la chaîne" },
  ];
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 6.8 + col * 2.95;
    const y = 2.9 + row * 1.6;
    s.addShape("roundRect", { x, y, w: 2.85, h: 1.4, fill: { color: WHITE }, line: { color: GOLD, width: 0.75 }, rectRadius: 0.1 });
    s.addShape("rect", { x, y, w: 2.85, h: 0.08, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.2, y: y + 0.25, w: 2.65, h: 0.4, fontFace: FONT_H, fontSize: 16, bold: true, color: NAVY });
    s.addText(it.d, { x: x + 0.2, y: y + 0.7, w: 2.65, h: 0.6, fontFace: FONT_B, fontSize: 12, color: INK_2 });
  });

  s.addShape("roundRect", { x: 0.7, y: 6.1, w: 12, h: 0.7, fill: { color: "F7EFD9" }, line: { color: GOLD, width: 0.5 }, rectRadius: 0.1 });
  s.addText("« Sans maîtrise du Cameroun, pas de corridor. Enercam sécurise le premier maillon. »", {
    x: 0.7, y: 6.1, w: 12, h: 0.7, fontFace: FONT_H, fontSize: 13, italic: true, color: NAVY, align: "center", valign: "middle",
  });
  FOOT(s, 8);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 9 — ENERCA
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 9);
  titleBlock(s, "FILIALE · CENTRAFRIQUE", "Enerca — Distribution hydrocarbures en RCA.", "Stations-service · entreprises · mines · BTP.");

  s.addText("Enerca est l'opérateur de distribution B2C et B2B en Centrafrique. Approvisionné via le corridor Enerfrica (Cameroun → Tchad → RCA), Enerca apporte la fiabilité énergétique à un marché historiquement sous-servi.", {
    x: 0.7, y: 2.9, w: 5.8, h: 2, fontFace: FONT_B, fontSize: 14, color: INK, valign: "top",
  });

  const items = [
    { t: "Réception Tchad",       d: "Pipeline et route · flux certifié" },
    { t: "Stockage",              d: "Dépôts Bangui + régions" },
    { t: "Stations-service",      d: "Réseau B2C en expansion" },
    { t: "Solutions B2B",         d: "Mines · BTP · transport" },
  ];
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 6.8 + col * 2.95;
    const y = 2.9 + row * 1.6;
    s.addShape("roundRect", { x, y, w: 2.85, h: 1.4, fill: { color: WHITE }, line: { color: GREEN, width: 0.75 }, rectRadius: 0.1 });
    s.addShape("rect", { x, y, w: 2.85, h: 0.08, fill: { color: GREEN }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.2, y: y + 0.25, w: 2.65, h: 0.4, fontFace: FONT_H, fontSize: 16, bold: true, color: NAVY });
    s.addText(it.d, { x: x + 0.2, y: y + 0.7, w: 2.65, h: 0.6, fontFace: FONT_B, fontSize: 12, color: INK_2 });
  });
  FOOT(s, 9);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 10 — NOS EXPERTISES
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 10);
  titleBlock(s, "EXPERTISES TRANSVERSALES", "Trois marques, un moteur de différenciation.", "Capacités techniques qui se déploient à travers les trois filiales.");

  threeCols(s, [
    { index: "◈", title: "EnerTech™", subtitle: "Technologie & digital", color: NAVY,
      desc: "SCADA, IoT, IA prédictive, Digital Twin, cybersécurité OT. Le socle d'excellence opérationnelle du groupe." },
    { index: "◆", title: "GreenTech™", subtitle: "Énergies propres & mini-grids", color: GREEN,
      desc: "Solaire industriel, hybridation, mini-grids ruraux, Mobile Station™ Hybrid. Réduction CO₂ et accès énergie." },
    { index: "◉", title: "EnerServ™", subtitle: "Services industriels & pétroliers", color: GOLD,
      desc: "Drilling, Artificial Lift, Pipeline Integrity, HSE. Services partagés au groupe et à des tiers opérateurs." },
  ], 2.9);

  FOOT(s, 10);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 11 — ENERTECH™
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 11);
  titleBlock(s, "EXPERTISE · ENERTECH™", "Digitaliser l'énergie africaine.", "Le hub technologique Enerfrica — R&D, intégration, déploiement.");

  const tiles = [
    { t: "Digital Twin™",    d: "Jumeau numérique pipeline + champs + raffinerie" },
    { t: "SCADA & IoT",      d: "12 840 capteurs · temps réel 24/7" },
    { t: "AI Predictive™",   d: "Prédiction pannes + optimisation débits" },
    { t: "Cyber OT",         d: "IEC 62443 · zero-trust · SOC dédié" },
    { t: "EOR Lab™",         d: "Formulations polymères/surfactants propriétaires" },
  ];
  tiles.forEach((tile, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const tileW = 3.9, tileH = 1.55, gapX = 0.25, gapY = 0.25;
    const startX = 0.7;
    const x = startX + col * (tileW + gapX);
    const y = 2.9 + row * (tileH + gapY);
    s.addShape("roundRect", { x, y, w: tileW, h: tileH, fill: { color: WHITE }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 });
    s.addShape("ellipse", { x: x + 0.3, y: y + 0.3, w: 0.5, h: 0.5, fill: { color: NAVY }, line: { type: "none" } });
    s.addText(String(i + 1), { x: x + 0.3, y: y + 0.3, w: 0.5, h: 0.5, fontFace: FONT_H, fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle" });
    s.addText(tile.t, { x: x + 1.0, y: y + 0.25, w: tileW - 1.2, h: 0.5, fontFace: FONT_H, fontSize: 16, bold: true, color: NAVY });
    s.addText(tile.d, { x: x + 1.0, y: y + 0.75, w: tileW - 1.2, h: 0.7, fontFace: FONT_B, fontSize: 11, color: INK_2 });
  });
  FOOT(s, 11);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 12 — GREENTECH™
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 12);
  titleBlock(s, "EXPERTISE · GREENTECH™", "Clean Energy & Mini-Grids.", "Énergies renouvelables au service des opérations pétrolières et des communautés.");

  const tiles = [
    { t: "SolarField™",         d: "Solaire industriel · stations + sites isolés" },
    { t: "HybridGrid™",         d: "Hybridation diesel-solaire intelligente" },
    { t: "Mini-grids rurales",  d: "Électrification villages enclavés" },
    { t: "Mobile Station™ Hybrid", d: "Station carburant + solaire containerisée" },
  ];
  tiles.forEach((tile, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.7 + col * 6.1;
    const y = 2.9 + row * 1.85;
    s.addShape("roundRect", { x, y, w: 5.95, h: 1.65, fill: { color: WHITE }, line: { color: GREEN, width: 1 }, rectRadius: 0.1 });
    s.addShape("rect", { x, y, w: 5.95, h: 0.08, fill: { color: GREEN }, line: { type: "none" } });
    s.addShape("ellipse", { x: x + 0.3, y: y + 0.45, w: 0.7, h: 0.7, fill: { color: "E1EDE6" }, line: { color: GREEN, width: 1 } });
    s.addText("✦", { x: x + 0.3, y: y + 0.45, w: 0.7, h: 0.7, fontFace: FONT_H, fontSize: 20, color: GREEN, align: "center", valign: "middle", bold: true });
    s.addText(tile.t, { x: x + 1.2, y: y + 0.35, w: 4.7, h: 0.5, fontFace: FONT_H, fontSize: 19, bold: true, color: NAVY });
    s.addText(tile.d, { x: x + 1.2, y: y + 0.85, w: 4.7, h: 0.7, fontFace: FONT_B, fontSize: 13, color: INK_2 });
  });
  s.addText("Objectif 2030 : 125 MW installés · 42 kt CO₂ évité/an · 28 mini-grids villageois.", {
    x: 0.7, y: 6.55, w: 12, h: 0.4, fontFace: FONT_B, fontSize: 12, color: GREEN, italic: true, bold: true, align: "center",
  });
  FOOT(s, 12);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 13 — ENERSERV™
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 13);
  titleBlock(s, "EXPERTISE · ENERSERV™", "Industrial Services.", "Services oilfield intégrés, opérés avec les standards des majors internationales.");

  const tiles = [
    { t: "Drilling",             d: "Forage directionnel · complétions intelligentes" },
    { t: "Artificial Lift",      d: "ESP · gas-lift · optimisation débits matures" },
    { t: "Pipeline Integrity",   d: "ILI, pigging, API 1160 · drones thermiques" },
    { t: "HSE",                  d: "ISO 45001 · ISO 14001 · zero-harm culture" },
  ];
  tiles.forEach((tile, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.7 + col * 6.1;
    const y = 2.9 + row * 1.85;
    s.addShape("roundRect", { x, y, w: 5.95, h: 1.65, fill: { color: WHITE }, line: { color: GOLD, width: 1 }, rectRadius: 0.1 });
    s.addShape("rect", { x, y, w: 0.1, h: 1.65, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(tile.t, { x: x + 0.35, y: y + 0.25, w: 5.45, h: 0.55, fontFace: FONT_H, fontSize: 20, bold: true, color: NAVY });
    s.addText(tile.d, { x: x + 0.35, y: y + 0.85, w: 5.45, h: 0.7, fontFace: FONT_B, fontSize: 13, color: INK_2 });
  });

  s.addText("Disponibles en mode intra-groupe ET en prestation à des opérateurs tiers sous contrat.", {
    x: 0.7, y: 6.55, w: 12, h: 0.4, fontFace: FONT_B, fontSize: 12, color: GOLD, italic: true, bold: true, align: "center",
  });
  FOOT(s, 13);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 14 — ENGAGEMENT
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 14);
  titleBlock(s, "NOTRE ENGAGEMENT", "Fiabilité. Sécurité. Performance.", "Les trois piliers non-négociables de l'approche Enerfrica.");

  const pillars = [
    { k: "STANDARDS OHADA",           v: "Société anonyme à Conseil d'administration, reporting IFRS." },
    { k: "TRAÇABILITÉ COMPLÈTE",      v: "De l'importation à la distribution, chaque litre est tracé (SCADA + IoT)." },
    { k: "SÉCURITÉ OPÉRATIONNELLE",   v: "ISO 45001, API RP 75, IEC 62443. Audits tiers systématiques." },
    { k: "GOUVERNANCE MODERNE",       v: "Conseil d'administration, comités spécialisés, administrateurs indépendants." },
    { k: "APPROCHE APOLITIQUE",       v: "Capital privé, décisions commerciales, relations institutionnelles transparentes." },
  ];
  pillars.forEach((p, i) => {
    const y = 2.9 + i * 0.75;
    s.addShape("rect", { x: 0.7, y: y + 0.08, w: 0.3, h: 0.55, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(p.k, { x: 1.15, y: y + 0.05, w: 3.5, h: 0.4, fontFace: FONT_H, fontSize: 13, bold: true, color: NAVY, charSpacing: 1 });
    s.addText(p.v, { x: 4.8, y: y + 0.05, w: 7.8, h: 0.6, fontFace: FONT_B, fontSize: 13, color: INK_2 });
  });
  FOOT(s, 14);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 15 — OPPORTUNITÉS
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 15);
  titleBlock(s, "OPPORTUNITÉS", "Un marché en croissance structurelle.", "L'Afrique centrale cumule 6 vents porteurs pour un opérateur énergétique privé intégré.");

  const drivers = [
    { n: "+3,5 %", l: "Demande énergétique", s: "Croissance annuelle régionale" },
    { n: "+2,6 %", l: "Démographie",         s: "Population CEMAC, horizon 2030" },
    { n: "+5,0 %", l: "Urbanisation",        s: "Taux annuel moyen" },
    { n: "73 %",   l: "Déficit énergétique", s: "Population sans accès fiable" },
    { n: "25 Md$", l: "Investissements",     s: "Besoins infra Afrique centrale/an" },
    { n: "6",      l: "Marchés ciblés",      s: "Pays voisins à ouvrir" },
  ];
  drivers.forEach((d, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.7 + col * 4.1;
    const y = 2.9 + row * 1.9;
    s.addShape("roundRect", { x, y, w: 3.9, h: 1.7, fill: { color: WHITE }, line: { color: HAIR, width: 0.5 }, rectRadius: 0.1 });
    s.addShape("rect", { x, y, w: 3.9, h: 0.08, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(d.n, { x: x + 0.3, y: y + 0.2, w: 3.3, h: 0.7, fontFace: FONT_H, fontSize: 30, bold: true, color: NAVY });
    s.addText(d.l, { x: x + 0.3, y: y + 0.9, w: 3.3, h: 0.35, fontFace: FONT_H, fontSize: 14, bold: true, color: NAVY });
    s.addText(d.s, { x: x + 0.3, y: y + 1.25, w: 3.3, h: 0.4, fontFace: FONT_B, fontSize: 10.5, color: INK_2 });
  });
  FOOT(s, 15);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 16 — EXPANSION
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  lightBase(s, 16);
  titleBlock(s, "EXPANSION", "Notre ambition panafricaine.", "Le corridor Cameroun-Tchad-RCA est le socle. Voici la trajectoire à 5-7 ans.");

  // Left : anchor markets
  s.addShape("roundRect", { x: 0.7, y: 2.9, w: 5.5, h: 3.8, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.1 });
  s.addText("MARCHÉS ANCRES (2026)", { x: 0.9, y: 3.0, w: 5.1, h: 0.3, fontFace: FONT_B, fontSize: 10, bold: true, color: GOLD, charSpacing: 3 });
  s.addText("Corridor principal", { x: 0.9, y: 3.3, w: 5.1, h: 0.5, fontFace: FONT_H, fontSize: 22, bold: true, color: WHITE });
  [
    { t: "Cameroun",     s: "Enercam · importation & transit" },
    { t: "Tchad",        s: "EnerTchad · opérateur national" },
    { t: "Centrafrique", s: "Enerca · distribution" },
  ].forEach((m, i) => {
    const y = 4.1 + i * 0.8;
    s.addShape("ellipse", { x: 0.9, y: y + 0.05, w: 0.3, h: 0.3, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(m.t, { x: 1.35, y: y, w: 4.4, h: 0.4, fontFace: FONT_H, fontSize: 15, bold: true, color: WHITE });
    s.addText(m.s, { x: 1.35, y: y + 0.4, w: 4.4, h: 0.3, fontFace: FONT_B, fontSize: 11, color: ICE });
  });

  // Right : target markets
  s.addShape("roundRect", { x: 6.5, y: 2.9, w: 6.2, h: 3.8, fill: { color: WHITE }, line: { color: GOLD, width: 1 }, rectRadius: 0.1 });
  s.addText("MARCHÉS CIBLES (2027-2031)", { x: 6.7, y: 3.0, w: 5.8, h: 0.3, fontFace: FONT_B, fontSize: 10, bold: true, color: GOLD, charSpacing: 3 });
  s.addText("Expansion panafricaine", { x: 6.7, y: 3.3, w: 5.8, h: 0.5, fontFace: FONT_H, fontSize: 22, bold: true, color: NAVY });
  const targets = [
    { t: "Congo",          s: "Upstream + distribution" },
    { t: "Niger",          s: "Midstream transit" },
    { t: "Gabon",          s: "Services aux majors" },
    { t: "Soudan du Sud",  s: "Upstream early-stage" },
    { t: "Autres",         s: "Marchés CEMAC opportunistes" },
  ];
  targets.forEach((m, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 6.7 + col * 2.95;
    const y = 4.0 + row * 0.9;
    s.addText("→ " + m.t, { x, y, w: 2.9, h: 0.35, fontFace: FONT_H, fontSize: 14, bold: true, color: NAVY });
    s.addText(m.s, { x, y: y + 0.35, w: 2.9, h: 0.35, fontFace: FONT_B, fontSize: 10.5, color: INK_2 });
  });
  FOOT(s, 16);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 17 — CONTACT
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBase(s);

  s.addText("ENTRER EN RELATION", { x: 0.7, y: 0.8, w: 11, h: 0.3, fontFace: FONT_B, fontSize: 11, bold: true, color: GOLD, charSpacing: 3 });
  s.addText("Discutons d'un partenariat stratégique.", { x: 0.7, y: 1.15, w: 11, h: 1.1, fontFace: FONT_H, fontSize: 34, bold: true, color: WHITE });
  s.addText("Enerfrica — African Energy Holdings", { x: 0.7, y: 2.35, w: 11, h: 0.5, fontFace: FONT_B, fontSize: 16, color: ICE, italic: true });

  // Contact blocks
  const contacts = [
    { label: "CORPORATE",        lines: ["contact@enerfrica.africa", "+237 — à compléter"] },
    { label: "SIÈGE GROUPE",     lines: ["Douala, Cameroun", "N'Djamena (bureau Tchad)"] },
    { label: "FILIALES",         lines: ["EnerTchad · Enercam · Enerca", "Sites dédiés par pays"] },
  ];
  contacts.forEach((c, i) => {
    const x = 0.7 + i * 4.1;
    s.addShape("rect", { x, y: 3.5, w: 0.08, h: 1.3, fill: { color: GOLD }, line: { type: "none" } });
    s.addText(c.label, { x: x + 0.25, y: 3.5, w: 3.8, h: 0.3, fontFace: FONT_B, fontSize: 10, bold: true, color: GOLD, charSpacing: 3 });
    c.lines.forEach((ln, j) => {
      s.addText(ln, { x: x + 0.25, y: 3.85 + j * 0.45, w: 3.8, h: 0.4, fontFace: FONT_H, fontSize: 14, color: WHITE });
    });
  });

  // CTA band
  s.addShape("roundRect", { x: 0.7, y: 5.5, w: 12, h: 1.1, fill: { color: GOLD }, line: { type: "none" }, rectRadius: 0.1 });
  s.addText("« Discutons d'un partenariat stratégique. »", { x: 0.7, y: 5.5, w: 12, h: 0.55, fontFace: FONT_H, fontSize: 22, bold: true, color: NAVY_2, align: "center", valign: "middle", italic: true });
  s.addText("partnerships@enerfrica.africa  ·  Réponse sous 48 h ouvrées", { x: 0.7, y: 6.0, w: 12, h: 0.45, fontFace: FONT_B, fontSize: 13, color: NAVY_2, align: "center" });

  s.addText("© 2026 Enerfrica — African Energy Holdings  ·  Strictement confidentiel  ·  17 / 17", {
    x: 0.5, y: 7.1, w: 12.33, h: 0.3, fontFace: FONT_B, fontSize: 9, color: ICE, align: "center",
  });
}

// Save
pres.writeFile({ fileName: "Enerfrica-PitchDeck-v1.pptx" })
    .then((f) => console.log("Wrote:", f))
    .catch((e) => { console.error(e); process.exit(1); });
