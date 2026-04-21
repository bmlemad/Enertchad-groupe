#!/usr/bin/env node
/**
 * Build script for dashboard-executif (JSX + Tailwind CSS)
 *
 * Steps:
 *  1. Transpile JSX → minified JS (esbuild). No bundling — React/ReactDOM/Recharts stay UMD globals.
 *  2. Compile Tailwind CSS from input.css with content-scanning against JSX + HTML.
 *  3. Compute content hash for each artifact (cache-bust via filename).
 *  4. Write hashed files to ../assets/{js,css}/ and clean orphan older hashes.
 *  5. Patch ../dashboard-executif.html to reference the new hashed bundle + CSS
 *     and strip the old <script src="https://cdn.tailwindcss.com"> + @babel/standalone.
 *  6. Emit a manifest so CI and humans can see what was built.
 */

import { build as esBuild } from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import cssnano from 'cssnano';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const jsOutDir = join(repoRoot, 'assets', 'js');
const cssOutDir = join(repoRoot, 'assets', 'css');

mkdirSync(jsOutDir, { recursive: true });
mkdirSync(cssOutDir, { recursive: true });

const hash8 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);

const cleanOrphans = (dir, pattern, keep) => {
  for (const f of readdirSync(dir)) {
    if (pattern.test(f) && !keep.has(f)) {
      unlinkSync(join(dir, f));
    }
  }
};

// ---------------------------------------------------------------- 1) JS
console.log('[dashboard] compiling JSX → JS (esbuild)…');
const jsBuild = await esBuild({
  entryPoints: [join(__dirname, 'dashboard-executif.jsx')],
  bundle: false,
  minify: true,
  write: false,
  outdir: jsOutDir,
  loader: { '.jsx': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  target: ['es2018'],
  sourcemap: 'linked',
  legalComments: 'none',
});
const jsFile  = jsBuild.outputFiles.find(f => f.path.endsWith('.js'));
const jsMap   = jsBuild.outputFiles.find(f => f.path.endsWith('.js.map'));
const jsHash  = hash8(jsFile.contents);
const jsName  = `dashboard-executif.${jsHash}.bundle.js`;
const mapName = `${jsName}.map`;
let jsText = new TextDecoder().decode(jsFile.contents).replace(
  /\/\/# sourceMappingURL=.*$/m,
  `//# sourceMappingURL=/assets/js/${mapName}`
);
writeFileSync(join(jsOutDir, jsName), jsText);
writeFileSync(join(jsOutDir, mapName), jsMap.contents);
cleanOrphans(
  jsOutDir,
  /^dashboard-executif\.[0-9a-f]{8}\.bundle\.js(\.map)?$/,
  new Set([jsName, mapName])
);
console.log(`[dashboard] JS  ${jsName} (${jsText.length} bytes, hash=${jsHash})`);

// ---------------------------------------------------------------- 2) CSS
console.log('[dashboard] compiling Tailwind CSS…');
const cssInput = readFileSync(join(__dirname, 'input.css'), 'utf8');
const cssResult = await postcss([
  tailwindcss(join(__dirname, 'tailwind.config.cjs')),
  cssnano({ preset: ['default', { discardComments: { removeAll: true } }] }),
]).process(cssInput, {
  from: join(__dirname, 'input.css'),
  to:   join(cssOutDir, 'dashboard.css'),
});
const cssText = cssResult.css;
const cssHash = hash8(cssText);
const cssName = `dashboard.${cssHash}.css`;
writeFileSync(join(cssOutDir, cssName), cssText);
cleanOrphans(
  cssOutDir,
  /^dashboard\.[0-9a-f]{8}\.css$/,
  new Set([cssName])
);
console.log(`[dashboard] CSS ${cssName} (${cssText.length} bytes, hash=${cssHash})`);

// ---------------------------------------------------------------- 3) Manifest
const manifest = {
  generatedAt: new Date().toISOString(),
  js:  { file: `/assets/js/${jsName}`,  hash: jsHash,  sizeBytes: jsText.length },
  css: { file: `/assets/css/${cssName}`, hash: cssHash, sizeBytes: cssText.length },
};
writeFileSync(
  join(jsOutDir, 'dashboard-executif.manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n'
);

// ---------------------------------------------------------------- 4) HTML patch
const htmlPath = join(repoRoot, 'dashboard-executif.html');
let html = readFileSync(htmlPath, 'utf8');

// Remove @babel/standalone (JSX already pre-compiled)
html = html.replace(
  /\n?\s*<!-- Babel \(for JSX\) -->[\s\S]*?<script[^>]*@babel\/standalone[^>]*><\/script>\s*\n/,
  '\n'
);

// Remove Tailwind CDN script + its inline config
html = html.replace(
  /\n?\s*<!-- Tailwind CDN[^>]*-->\s*\n\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*\n\s*<script>[\s\S]*?tailwind\.config[\s\S]*?<\/script>\s*\n/,
  '\n'
);

// Remove the inline <style>…</style> block (moved to input.css)
html = html.replace(
  /\n?\s*<style>\s*\n\s*\/\* Skip link a11y WCAG[\s\S]*?\.recharts-tooltip-wrapper[^}]*\}\s*\n\s*<\/style>\s*\n/,
  '\n'
);

// Add/update the dashboard CSS <link> right after the font preload block
const cssLinkTag = `<link rel="stylesheet" href="/assets/css/${cssName}" />`;
if (html.includes('/assets/css/dashboard.')) {
  html = html.replace(
    /<link rel="stylesheet" href="\/assets\/css\/dashboard\.[0-9a-f]{8}\.css" ?\/>/,
    cssLinkTag
  );
} else {
  // Insert after the last font preload (SpaceGrotesk-latin.woff2 line)
  html = html.replace(
    /(<link rel="preload" href="\/assets\/fonts\/SpaceGrotesk-latin\.woff2"[^>]*>\s*)/,
    `$1\n${cssLinkTag}\n`
  );
}

// Replace the old inline text/babel block (first-time patch) or update existing bundle ref
const inlineBabelRegex = /<script type="text\/babel"[^>]*>[\s\S]*?<\/script>/;
const bundleTag = `<script defer src="/assets/js/${jsName}"></script>`;
if (inlineBabelRegex.test(html)) {
  html = html.replace(inlineBabelRegex, bundleTag);
} else {
  html = html.replace(
    /<script defer src="\/assets\/js\/dashboard-executif\.[0-9a-f]{8}\.bundle\.js"><\/script>/,
    bundleTag
  );
}

writeFileSync(htmlPath, html);
console.log(`[dashboard] patched ${htmlPath}`);
console.log(`[dashboard] done. manifest: /assets/js/dashboard-executif.manifest.json`);
