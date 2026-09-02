/**
 * Regenerate glass back shader sources from Noomo bundle.
 * Run: node scripts/generate-glass-back-shaders.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const t = fs.readFileSync(path.join(root, "public/eagle-project/_nuxt/CbdjwYMp.js"), "utf8");

function extractBetween(marker, nextMarker) {
  const start = t.indexOf(marker);
  if (start < 0) return null;
  const bodyStart = start + marker.length;
  const next = nextMarker ? t.indexOf(nextMarker, bodyStart) : -1;
  const bodyEnd = next >= 0 ? t.lastIndexOf("`", next) : t.indexOf("`", bodyStart);
  return t.slice(bodyStart, bodyEnd);
}

function cleanShader(src) {
  return src
    .replace(/@sweet\s+alpha/g, "1.0")
    .replace(/@sweet[^;]*;/g, "")
    .replace(/@(?:Glass|Post|Env|ColorsMap|BlueNoise|Tick)\.\w+/g, "")
    .replace(/#pragma unroll_loop_start\n/g, "")
    .replace(/#pragma unroll_loop_end\n/g, "")
    // Three.js chunks already define saturate — redefining breaks WebGL compile.
    .replace(/#define saturate\(x\) clamp\(x, 0\., 1\.\)\s*\n?/g, "");
}

const simple = cleanShader(extractBetween("var _1=`", ",b1=`"));
const dispersion = cleanShader(extractBetween(",b1=`", ",y1=`"));
const vertex = cleanShader(extractBetween(",y1=`", "`;class ek"));

const shaderDir = path.join(root, "components/native-eagle/shaders");
fs.mkdirSync(shaderDir, { recursive: true });

fs.writeFileSync(path.join(shaderDir, "glass-back-vertex.glsl"), vertex);
fs.writeFileSync(path.join(shaderDir, "glass-back-fragment-simple.glsl"), simple);
fs.writeFileSync(path.join(shaderDir, "glass-back-fragment-dispersion.glsl"), dispersion);

const outJs = `/** Auto-generated — run scripts/generate-glass-back-shaders.mjs */
export const GLASS_BACK_VERTEX = ${JSON.stringify(vertex)};
export const GLASS_BACK_FRAGMENT_SIMPLE = ${JSON.stringify(simple)};
export const GLASS_BACK_FRAGMENT_DISPERSION = ${JSON.stringify(dispersion)};
`;

fs.writeFileSync(path.join(root, "components/native-eagle/glassBackShaders.js"), outJs);

console.log("Generated glass back shaders:");
console.log("  vertex:", vertex.split("\\n").length, "lines");
console.log("  simple:", simple.split("\\n").length, "lines");
console.log("  dispersion:", dispersion.split("\\n").length, "lines");
