# EnerTchad — Journal de veille DNS & Netlify

Suivi automatique quotidien de la mise en production du site EnerTchad Groupe.

---

## 🟢 NETLIFY QUOTA RESTAURÉ — 2026-04-24

Première détection : les 4 projets Netlify répondent à nouveau en HTTP 200 avec `server: Netlify`.
La pause liée au dépassement de quota (constat 21 avril 2026) est **levée**.

## 2026-04-24T16:18:25Z

### Netlify quota
- MCP Netlify (get-projects team `ENERTCHAD`) : échec API 404 (probable problème d'auth/slug — fallback curl utilisé).
- Fallback curl sur les 4 sites :
  - `enchanting-dragon-ade819.netlify.app`    → HTTP/2 200, server: Netlify ✅
  - `gregarious-kitsune-98d934.netlify.app`   → HTTP/2 200, server: Netlify ✅
  - `transcendent-profiterole-9e8a07.netlify.app` → HTTP/2 200, server: Netlify ✅
  - `coruscating-griffin-91be5b.netlify.app`  → HTTP/2 200, server: Netlify ✅
- **Quota status: ACTIVE** (les 4 sites ne retournent plus 503 — pause levée)

### DNS production
- www.enertchad.com A : `213.186.33.5`
- enertchad.com A : `213.186.33.5`
- Server header : `OVHcloud` (HTTP/1.1 200, `x-iplb-request-id` → OVH IPLB)
- **DNS status: OVH** (pas encore basculé vers Netlify)

