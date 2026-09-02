/**
 * Extract eagle-project hero reference into eagle-extract/ with SHA-256 validation.
 * Run: node scripts/extract-eagle-reference.mjs
 * Validate only: node scripts/extract-eagle-reference.mjs --validate
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "eagle-extract");
const publicRoot = path.join(root, "public/eagle-extract");
const bundlePath = path.join(root, "public/eagle-project/_nuxt/CbdjwYMp.js");
const validateOnly = process.argv.includes("--validate");

/** Served by Next.js at /eagle-extract/* for browser validation page */
const PUBLIC_SYNC_PATHS = [
  "MANIFEST.json",
  "VALIDATION.json",
  "glass/colors.json",
  "glass/defaults.json",
  "glass/mesh-names.json",
  "assets/models/v20.glb",
  "assets/models/feather.glb",
  "assets/timelines/cam.glb",
  "assets/timelines/cam-mob.glb",
  "assets/textures/icen.jpg",
  "assets/textures/LDR_RG01_0.png",
  "assets/textures/noises.jpg",
  "assets/textures/mountains.png",
  "assets/textures/waves.jpg",
  "assets/textures/wooden_studio_19_1k.hdr",
];

/** Canonical sources — eagle-project paths only */
const ASSET_MANIFEST = [
  { id: "bird", src: "public/eagle-project/models/v20.glb", dest: "assets/models/v20.glb" },
  { id: "feather", src: "public/eagle-project/models/feather.glb", dest: "assets/models/feather.glb" },
  { id: "cam", src: "public/eagle-project/timelines/cam.glb", dest: "assets/timelines/cam.glb" },
  { id: "camMob", src: "public/eagle-project/timelines/cam-mob.glb", dest: "assets/timelines/cam-mob.glb" },
  { id: "iceNormal", src: "public/eagle-project/textures/icen.jpg", dest: "assets/textures/icen.jpg" },
  { id: "colorsMap", src: "public/eagle-project/textures/LDR_RG01_0.png", dest: "assets/textures/LDR_RG01_0.png" },
  { id: "noises", src: "public/eagle-project/textures/noises.jpg", dest: "assets/textures/noises.jpg" },
  { id: "mountains", src: "public/eagle-project/textures/mountains.png", dest: "assets/textures/mountains.png" },
  { id: "waves", src: "public/eagle-project/textures/waves.jpg", dest: "assets/textures/waves.jpg" },
  { id: "hdrEnv", src: "public/eagle-project/textures/wooden_studio_19_1k.hdr", dest: "assets/textures/wooden_studio_19_1k.hdr" },
];

const PATCH_FILES = [
  { src: "scripts/patch-eagle-teal.mjs", dest: "patches/patch-eagle-teal.mjs" },
  { src: "scripts/patch-eagle-2-isolated.mjs", dest: "patches/patch-eagle-2-isolated.mjs" },
];

const SHADER_VARS = [
  ["y1", "glass-back-vertex.glsl"],
  ["b1", "glass-back-fragment-dispersion.glsl"],
  ["_1", "glass-back-fragment-simple.glsl"],
  ["w1", "glass-front-vertex.glsl"],
  ["x1", "glass-front-fragment-dispersion.glsl"],
  ["qte", "glass-front-fragment-simple.glsl"],
];

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(srcRel, destRel, records) {
  const src = path.join(root, srcRel);
  const dest = path.join(outRoot, destRel);
  if (!fs.existsSync(src)) {
    records.push({ dest: destRel, ok: false, error: `missing source ${srcRel}` });
    return null;
  }
  ensureDir(path.dirname(dest));
  if (!validateOnly) {
    fs.copyFileSync(src, dest);
  }
  const srcHash = sha256File(src);
  const destHash = validateOnly ? (fs.existsSync(dest) ? sha256File(dest) : null) : sha256File(dest);
  const match = destHash === srcHash;
  records.push({
    dest: destRel,
    source: srcRel,
    sha256: srcHash,
    destSha256: destHash,
    bytes: fs.statSync(src).size,
    ok: match,
  });
  return srcHash;
}

function cleanShader(src) {
  return src
    .replace(/@sweet[^;]*;/g, "")
    .replace(/@Glass\.(\w+)/g, "uGlass_$1")
    .replace(/@Post\.(\w+)/g, "uPost_$1")
    .replace(/@Env\.(\w+)/g, "uEnv_$1")
    .replace(/@ColorsMap\.(\w+)/g, "uColorsMap_$1")
    .replace(/@BlueNoise\.(\w+)/g, "uBlueNoise_$1")
    .replace(/@Tick\.(\w+)/g, "uTick_$1");
}

function extractShaderFromBundle(t, varName) {
  const re = new RegExp(
    `(?:var\\s+|,)${varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=\`([\\s\\S]*?)\`;`,
  );
  const m = t.match(re);
  return m ? cleanShader(m[1]) : null;
}

function extractGlassConfig(t) {
  const start = t.indexOf("glassConfig:{");
  if (start < 0) return null;
  let depth = 0;
  let end = start;
  for (let i = start + 12; i < t.length; i++) {
    if (t[i] === "{") depth++;
    if (t[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const raw = `{${t.slice(start + 13, end)}`;
  // eslint-disable-next-line no-eval
  return eval(`(${raw})`);
}

function extractBundleSnippets(t) {
  const colorTriplet = {
    color: t.includes('"Glass.color","Glass_color.position","#12c48a"') ? "#12c48a" : null,
    peaksColor: t.includes('"Glass.peaksColor","Glass_peaksColor.position","#6ee7b7"')
      ? "#6ee7b7"
      : null,
    fringeColor: t.includes('"Glass.fringeColor","Glass_fringeColor.position","#047857"')
      ? "#047857"
      : null,
  };

  const backgrounds = {
    lavender: t.includes("static background=new Re(15064825)"),
    eagle2Dark: t.includes("static background=new Re(1453348)"),
    whiteFallback: t.includes("static background=new Re(16777215)"),
  };

  const eagle2Patches = {
    spotsHidden: t.includes("spots.visible=!1"),
    mountainsHidden: t.includes("mountains.visible=!1"),
    fireHidden: t.includes("t.visible=!1;/*eagle-2*/"),
  };

  const bloom = {
    threshold: 1,
    power: 1 / 6,
    radius: 2 / 3,
    foundInBundle:
      t.includes('Mi("post.bloom.filter.threshold",1') &&
      t.includes('Mi("post.bloom.power",1/6') &&
      t.includes('Mi("post.bloom.radius",2/3'),
  };

  const sampleCounts = {};
  for (const k of ["lowFrontSamplesCount", "frontSamplesCount", "backSamplesCount", "hyperSamplesCount"]) {
    const m = t.match(new RegExp(`${k}[:=](\\d+)`));
    if (m) sampleCounts[k] = Number(m[1]);
  }

  const meshNames = [
    ...new Set(
      [...t.matchAll(/"(wing-[^"]+|neck-[^"]+|tail-[^"]+|body|belly|chest|back|legs|trail)"/g)].map(
        (m) => m[1],
      ),
    ),
  ].sort();

  const glassUniforms = [...new Set([...t.matchAll(/@Glass\.(\w+)/g)].map((m) => m[1]))].sort();
  const postUniforms = [...new Set([...t.matchAll(/@Post\.(\w+)/g)].map((m) => m[1]))].sort();
  const assetsManagerKeys = [
    ...new Set([...t.matchAll(/assetsManager\.get\("([^"]+)"\)/g)].map((m) => m[1])),
  ].sort();

  const settingsMatch = t.match(/camera:\{fov:(\d+),near:([\d.]+),far:(\d+)\}/);
  const clipMatch = t.match(/glassAnimationIdToClipName:(\[[^\]]+\])/);

  return {
    colorTriplet,
    backgrounds,
    eagle2Patches,
    bloom,
    sampleCounts,
    meshNames,
    glassUniforms,
    postUniforms,
    assetsManagerKeys,
    camera: settingsMatch
      ? { fov: Number(settingsMatch[1]), near: Number(settingsMatch[2]), far: Number(settingsMatch[3]) }
      : null,
    glassAnimationClips: clipMatch ? JSON.parse(clipMatch[1]) : null,
    keyClasses: {
      prepareGlassMesh: "nk()",
      glassFront: "tk",
      glassBack: "ek",
      renderPipeline: "nn",
      layerController: "Mn",
      glassSorter: "Jte",
      glassSupport: "as",
      phoenixAnimation: "ene",
      spots: "Ste",
      mountains: "yte",
      reflector: "wA",
      bloom: "Bte",
    },
  };
}

function main() {
  if (!fs.existsSync(bundlePath)) {
    console.error("Missing bundle:", bundlePath);
    process.exit(1);
  }

  const t = fs.readFileSync(bundlePath, "utf8");
  const fileRecords = [];
  const checks = [];

  if (!validateOnly) {
    ensureDir(outRoot);
  }

  // --- Assets ---
  for (const item of ASSET_MANIFEST) {
    copyFile(item.src, item.dest, fileRecords);
  }

  // --- Bundle copy ---
  copyFile("public/eagle-project/_nuxt/CbdjwYMp.js", "bundle/CbdjwYMp.js", fileRecords);

  // --- Patches ---
  for (const p of PATCH_FILES) {
    copyFile(p.src, p.dest, fileRecords);
  }

  // --- Shaders: fresh extract from bundle ---
  const shaderRecords = [];
  for (const [varName, fileName] of SHADER_VARS) {
    const content = extractShaderFromBundle(t, varName);
    const destRel = `shaders/${fileName}`;
    const dest = path.join(outRoot, destRel);
    checks.push({
      id: `shader-${fileName}`,
      ok: Boolean(content && content.length > 100),
      detail: content ? `${content.split("\n").length} lines` : "not found in bundle",
    });
    if (!content) continue;

    const bundleHash = sha256Text(content);
    if (!validateOnly) {
      ensureDir(path.dirname(dest));
      fs.writeFileSync(dest, content);
    }

    const destHash = fs.existsSync(dest) ? sha256Text(fs.readFileSync(dest, "utf8")) : null;
    const docsOriginal = path.join(root, "docs/native-eagle/shaders/original", fileName);
    const docsHash = fs.existsSync(docsOriginal)
      ? sha256Text(fs.readFileSync(docsOriginal, "utf8"))
      : null;

    shaderRecords.push({
      file: destRel,
      bundleVar: varName,
      sha256: bundleHash,
      destSha256: destHash,
      matchesExtract: destHash === bundleHash,
      docsNativeEagleSha256: docsHash,
      matchesDocsNativeEagle: docsHash === bundleHash,
      lines: content.split("\n").length,
    });
  }

  // --- Glass config from bundle ---
  const glassConfig = extractGlassConfig(t);
  const glassDefaults = {};
  if (glassConfig) {
    for (const [key, cfg] of Object.entries(glassConfig)) {
      glassDefaults[key.replace("Glass.", "")] = cfg.default ?? cfg.value;
    }
  }

  const colors = {
    patched: { color: "#12c48a", peaksColor: "#6ee7b7", fringeColor: "#047857" },
    originalNoomo: { color: "#ffffff", peaksColor: "#ffffff", fringeColor: "#b0b0b0" },
    patchScript: "patches/patch-eagle-teal.mjs",
  };

  const snippets = extractBundleSnippets(t);
  checks.push({
    id: "teal-color-triplet-in-bundle",
    ok: snippets.colorTriplet.color === "#12c48a" && snippets.colorTriplet.peaksColor === "#6ee7b7",
    detail: snippets.colorTriplet,
  });

  // --- Timeline bindings from native glassConfig (mirrors bundle) ---
  const bindingsPath = path.join(root, "components/native-eagle/glassConfig.js");
  const bindingsSrc = fs.readFileSync(bindingsPath, "utf8");
  const defaultsMatch = bindingsSrc.match(/export const GLASS_UNIFORM_DEFAULTS = (\{[\s\S]*?\n\});/);
  const bindingsMatch = bindingsSrc.match(/export const GLASS_TIMELINE_BINDINGS = (\[[\s\S]*?\n\]);/);

  const pipeline = {
    dualPass: [
      "Pass 1: scene without glass → sceneRT (Post.map)",
      "Pass 2: GlassBack samples sceneRT → backRT (Post.backMap)",
      "Pass 3: GlassFront samples backRT → screen/finalRT",
    ],
    perMeshRender: "backRT pass with backMaterial, then sceneRT pass with frontMaterial (nk render hook)",
    postStack: ["input texture", "UnrealBloomPass", "SMAAPass", "LinearTosRGB / OutputPass"],
    compositing: {
      webglClearLavender: { hex: "#E5DEF9", int: 15064825 },
      webglClearEagle2: { hex: "#162d24", int: 1453348 },
      cssStage: "#ffffff",
      canvasBlendMode: "darken",
      clearAlphaProduction: 0,
    },
  };

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceProject: "public/eagle-project",
    bundleSource: "public/eagle-project/_nuxt/CbdjwYMp.js",
    bundleSha256: sha256File(bundlePath),
    bundleSizeBytes: fs.statSync(bundlePath).size,
    assets: fileRecords.filter((r) => r.dest.startsWith("assets/")),
    bundle: fileRecords.find((r) => r.dest === "bundle/CbdjwYMp.js"),
    patches: fileRecords.filter((r) => r.dest.startsWith("patches/")),
    shaders: shaderRecords,
    glass: {
      colors,
      defaults: glassDefaults,
      configFromBundle: glassConfig,
      uniformNames: snippets.glassUniforms,
      postUniformNames: snippets.postUniforms,
      sampleCounts: snippets.sampleCounts,
      meshNames: snippets.meshNames,
      animationClips: snippets.glassAnimationClips,
    },
    pipeline,
    bundleSnippets: snippets,
  };

  const validation = {
    generatedAt: new Date().toISOString(),
    mode: validateOnly ? "validate-only" : "extract-and-validate",
    allAssetsMatch: fileRecords.every((r) => r.ok),
    allShadersMatch: shaderRecords.every((r) => r.matchesExtract),
    allShadersMatchDocs: shaderRecords.every((r) => r.matchesDocsNativeEagle),
    checks,
    failures: [
      ...fileRecords.filter((r) => !r.ok).map((r) => `asset: ${r.dest} — ${r.error || "hash mismatch"}`),
      ...shaderRecords.filter((r) => !r.matchesExtract).map((r) => `shader: ${r.file} hash mismatch`),
      ...checks.filter((c) => !c.ok).map((c) => `check: ${c.id}`),
    ],
    pass: false,
  };
  validation.pass =
    validation.allAssetsMatch &&
    validation.allShadersMatch &&
    validation.checks.every((c) => c.ok) &&
    validation.failures.length === 0;

  if (!validateOnly) {
    ensureDir(path.join(outRoot, "glass"));
    ensureDir(path.join(outRoot, "pipeline"));
    ensureDir(path.join(outRoot, "bundle"));
    fs.writeFileSync(path.join(outRoot, "MANIFEST.json"), JSON.stringify(manifest, null, 2));
    fs.writeFileSync(
      path.join(outRoot, "glass/colors.json"),
      JSON.stringify(colors, null, 2),
    );
    fs.writeFileSync(
      path.join(outRoot, "glass/defaults.json"),
      JSON.stringify(glassDefaults, null, 2),
    );
    fs.writeFileSync(
      path.join(outRoot, "glass/config-from-bundle.json"),
      JSON.stringify(glassConfig, null, 2),
    );
    fs.writeFileSync(
      path.join(outRoot, "glass/sample-counts.json"),
      JSON.stringify(snippets.sampleCounts, null, 2),
    );
    fs.writeFileSync(
      path.join(outRoot, "glass/mesh-names.json"),
      JSON.stringify(snippets.meshNames, null, 2),
    );
    fs.writeFileSync(
      path.join(outRoot, "glass/uniform-names.json"),
      JSON.stringify(
        { glass: snippets.glassUniforms, post: snippets.postUniforms },
        null,
        2,
      ),
    );
    fs.writeFileSync(
      path.join(outRoot, "pipeline/render-pipeline.json"),
      JSON.stringify(pipeline, null, 2),
    );
    fs.writeFileSync(
      path.join(outRoot, "bundle/snippets.json"),
      JSON.stringify(snippets, null, 2),
    );
    if (defaultsMatch) {
      fs.writeFileSync(
        path.join(outRoot, "glass/uniform-defaults-native.json"),
        defaultsMatch[1],
      );
    }
    if (bindingsMatch) {
      fs.writeFileSync(
        path.join(outRoot, "glass/timeline-bindings-native.js"),
        `export const GLASS_TIMELINE_BINDINGS = ${bindingsMatch[1]};\n`,
      );
    }

    const readme = `# Eagle Extract — Validated Reference Package

Generated by \`node scripts/extract-eagle-reference.mjs\`

## Contents

| Path | Description |
|------|-------------|
| \`assets/models/\` | Bird (\`v20.glb\`), feather |
| \`assets/timelines/\` | \`cam.glb\`, \`cam-mob.glb\` scroll rigs |
| \`assets/textures/\` | Glass + env textures (icen, colors LUT, HDR, mountains, waves, noises) |
| \`shaders/\` | 6 glass GLSL files **re-extracted fresh from bundle** |
| \`glass/\` | Colors, defaults, full glassConfig, bindings |
| \`bundle/\` | Full \`CbdjwYMp.js\` + parsed snippets |
| \`patches/\` | Teal color + eagle-2 isolation patches |
| \`pipeline/\` | Dual-RT + post + compositing notes |
| \`MANIFEST.json\` | SHA-256 of every file |
| \`VALIDATION.json\` | Pass/fail vs sources |

## Validate

\`\`\`bash
node scripts/extract-eagle-reference.mjs --validate
\`\`\`

## Teal glass colors (patched)

- base: \`#12c48a\`
- peaks: \`#6ee7b7\`
- fringe: \`#047857\`

Original Noomo used white/gray — see \`glass/colors.json\`.
`;
    fs.writeFileSync(path.join(outRoot, "README.md"), readme);

    // Mirror serveable assets → public/eagle-extract/ for Next.js test page
    for (const rel of PUBLIC_SYNC_PATHS) {
      const src = path.join(outRoot, rel);
      const dest = path.join(publicRoot, rel);
      if (!fs.existsSync(src)) continue;
      ensureDir(path.dirname(dest));
      fs.copyFileSync(src, dest);
    }
    manifest.publicSync = {
      root: "public/eagle-extract",
      urlPrefix: "/eagle-extract",
      files: PUBLIC_SYNC_PATHS,
    };
    fs.writeFileSync(path.join(outRoot, "MANIFEST.json"), JSON.stringify(manifest, null, 2));
    fs.copyFileSync(path.join(outRoot, "MANIFEST.json"), path.join(publicRoot, "MANIFEST.json"));

    // Apply bundle-exact shaders to native-eagle renderer
    const sync = spawnSync(process.execPath, [path.join(root, "scripts/sync-eagle-extract-shaders.mjs")], {
      cwd: root,
      stdio: "pipe",
      encoding: "utf8",
    });
    if (sync.status !== 0) {
      console.warn("Shader sync warning:", sync.stderr || sync.stdout);
    } else {
      console.log("Synced eagle-extract shaders → components/native-eagle");
    }
  }

  // Validate public mirror when present
  const publicRecords = [];
  for (const rel of PUBLIC_SYNC_PATHS) {
    const src = path.join(outRoot, rel);
    const dest = path.join(publicRoot, rel);
    if (!fs.existsSync(src)) {
      publicRecords.push({ rel, ok: false, error: "missing in eagle-extract" });
      continue;
    }
    if (!fs.existsSync(dest)) {
      publicRecords.push({ rel, ok: false, error: "missing in public/eagle-extract" });
      continue;
    }
    const match = sha256File(src) === sha256File(dest);
    publicRecords.push({ rel, ok: match, bytes: fs.statSync(dest).size });
  }
  validation.publicSyncMatch = publicRecords.every((r) => r.ok);
  validation.publicSync = publicRecords;
  if (!validation.publicSyncMatch) {
    validation.failures.push(
      ...publicRecords.filter((r) => !r.ok).map((r) => `public-sync: ${r.rel} — ${r.error || "hash mismatch"}`),
    );
    validation.pass = false;
  }

  if (!validateOnly) {
    fs.writeFileSync(path.join(outRoot, "VALIDATION.json"), JSON.stringify(validation, null, 2));
    if (fs.existsSync(path.join(publicRoot, "VALIDATION.json"))) {
      fs.copyFileSync(path.join(outRoot, "VALIDATION.json"), path.join(publicRoot, "VALIDATION.json"));
    }
  }

  console.log(validateOnly ? "=== VALIDATION ===" : "=== EXTRACT + VALIDATE ===");
  console.log("Assets:", fileRecords.filter((r) => r.ok).length, "/", fileRecords.length);
  console.log("Shaders:", shaderRecords.filter((r) => r.matchesExtract).length, "/", shaderRecords.length);
  console.log("Checks:", checks.filter((c) => c.ok).length, "/", checks.length);
  console.log("Public sync:", publicRecords.filter((r) => r.ok).length, "/", publicRecords.length);
  console.log("PASS:", validation.pass);
  if (validation.failures.length) {
    console.error("Failures:");
    for (const f of validation.failures) console.error(" -", f);
  }
  process.exit(validation.pass ? 0 : 1);
}

main();
