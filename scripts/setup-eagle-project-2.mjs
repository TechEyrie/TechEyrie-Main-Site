/**
 * eagle-project-2 — isolated crystalline eagle on white (no UI, no story scroll).
 * Re-run: node scripts/setup-eagle-project-2.mjs
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src1 = path.join(root, "public/eagle-project-1");
const dest = path.join(root, "public/eagle-project-2");

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (!fs.existsSync(src1)) {
  console.error("Missing eagle-project-1 — run setup:eagle-project first");
  process.exit(1);
}

console.log("Creating eagle-project-2 from eagle-project-1 …");
rimraf(dest);
fs.mkdirSync(dest, { recursive: true });

// Only need HTML + nuxt bundles locally; models/textures via shared rewrites
copyDir(path.join(src1, "_nuxt"), path.join(dest, "_nuxt"));
fs.copyFileSync(path.join(src1, "index.html"), path.join(dest, "index.html"));
if (fs.existsSync(path.join(src1, "fav.png"))) {
  fs.copyFileSync(path.join(src1, "fav.png"), path.join(dest, "fav.png"));
}

let html = fs.readFileSync(path.join(dest, "index.html"), "utf8");

html = html.replace(/\/eagle-project-1\//g, "/eagle-project-2/");
html = html.replace(
  'baseURL: "/eagle-project-1/"',
  'baseURL: "/eagle-project-2/"',
);

const isolatedCss = `    <style id="eagle-project-2-base-style">
      /* eagle-project-2: eagle only — white page for standalone, transparent for embed */
      html, body {
        background: #ffffff !important;
        margin: 0;
        overflow: hidden;
        overscroll-behavior: none;
      }
      html.eagle-embed-mode,
      html.eagle-embed-mode body {
        background: transparent !important;
      }
      html.eagle-embed-mode .fixed.inset-0,
      html.eagle-embed-mode canvas {
        background: transparent !important;
      }
      body > :not(#__nuxt) { display: none !important; }
      header, footer, .preloader, .parent, .home-hero, .release-spirit,
      .animated-text, .simple-button, nav, [data-v-843b322d], [data-v-866aa93c],
      .cases-back, .logo-link, .logo-wrapper, .logo-wrapper-2,
      [class*="cursor"], [class*="sound"],
      [data-v-0c12ac35], [data-v-f5d2af36] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      html, body, canvas, * {
        cursor: default !important;
      }
      #__nuxt .relative > header { display: none !important; }
      canvas { display: block !important; }
    </style>`;

html = html.replace(
  /<style>\s*\/* eagle-project-1:[\s\S]*?<\/style>/,
  isolatedCss,
);
if (!html.includes("eagle-project-2: eagle only")) {
  html = html.replace("</head>", isolatedCss + "\n</head>");
}

const heroBoot = `
        const HERO_PROGRESS = 0;

        function lockHeroOnly(store) {
          if (!store) return;
          try {
            store.scrollSections = [{ id: "1", scrollLength: 1 }];
            if (typeof store.setScrollProgress === "function") {
              store.setScrollProgress(HERO_PROGRESS);
            } else {
              store.scrollProgress = HERO_PROGRESS;
            }
            const scroller = store.scroll || store.getScroll;
            scroller?.scrollTo?.(0, false);
            scroller?.resize?.();
            window.scrollTo(0, 0);
          } catch (_) {}
        }

        function watchHeroOnly() {
          if (watchHeroOnly._on) return;
          watchHeroOnly._on = true;
          const loop = () => {
            lockHeroOnly(getSceneStore());
            requestAnimationFrame(loop);
          };
          requestAnimationFrame(loop);
        }
`;

html = html.replace(
  /function clampToSection1\(store\)\s*\{[\s\S]*?\n        \}/,
  heroBoot.trim(),
);

html = html.replace(/clampToSection1\(/g, "lockHeroOnly(");

html = html.replace(
  /\[\s*20\s*\]/,
  "[20]",
);

html = html.replace(
  /"1",\s*\n\s*10,/,
  '"1",\n        1,',
);

html = html.replace(
  "<title>Eagle — isolated</title>",
  "<title>Eagle — isolated</title>\n    <script>(function(){if(new URLSearchParams(location.search).get(\"embed\")===\"1\")document.documentElement.classList.add(\"eagle-embed-mode\");})();</script>",
);

// Disable analytics on this isolated copy
html = html.replace('"enabled": true', '"enabled": false');

fs.writeFileSync(path.join(dest, "index.html"), html);

const patch2 = spawnSync(
  process.execPath,
  [path.join(__dirname, "patch-eagle-2-isolated.mjs")],
  { cwd: root, stdio: "inherit" },
);

const patchTeal = spawnSync(
  process.execPath,
  [
    path.join(__dirname, "patch-eagle-teal.mjs"),
    "--target",
    "eagle-project-2",
  ],
  { cwd: root, stdio: "inherit" },
);

if (patch2.status !== 0 || patchTeal.status !== 0) {
  console.warn("Some patches reported issues");
}

console.log("Done:", dest);
console.log("Open: /eagle-project-2/");
