# Archive R127 · One-shot scripts (R93-R120)

Ces 17 scripts Python ont été exécutés une fois (vagues R93→R120 session 2026-05-02)
et conservés ici pour traçabilité/audit. Aucun n'est appelé en build/runtime.

| Vague | Script | Effet |
|---|---|---|
| R93 | normalize-og-images.py · generate-image-variants.py · inject-srcset.py | Pack P1 images |
| R94 | strip-bar1-bar3.py | Bar 1+3 strip |
| R96 | strip-all-headers-navs.py | -492 elements |
| R97 | inject-footer-stranded.py | Footer +7 pages |
| R99 | strip-nav-bars-r99.py | Strip residuals |
| R100 | strip-dead-css-r100.py | -50 KB |
| R101 | strip-nav-css-r101.py · -v2.py | -75 KB cumul |
| R104 | strip-header-residuals-r104.py | -162 commentaires |
| R105 | strip-all-hero-r105.py | -53 hero sections |
| R106 | strip-footer-nav-r106.py | Footer nav strip |
| R109 | apply-page-statement-r109.py | 11 FR canon |
| R117 | apply-page-statement-en-r117.py | 11 EN core |
| R118 | apply-page-statement-r118.py | 12 FR secondaires |
| R120 | apply-page-statement-en-r120.py | 5 EN secondaires |

**Reactivation** : si jamais besoin de rejouer (improbable), restaurer
depuis `_archive/site-v2-pre-R*-*.tar.gz` avant de re-exécuter.

**R127** · 2026-05-03 · Archive cleanup mandate
