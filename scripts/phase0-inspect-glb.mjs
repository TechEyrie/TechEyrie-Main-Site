/**
 * Phase 0 — inspect v20.glb and cam.glb via @gltf-transform/cli (Node-safe, no Draco fetch issues).
 * Run: node scripts/phase0-inspect-glb.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "docs/native-eagle/baseline");

fs.mkdirSync(outDir, { recursive: true });

function inspectGlb(label, relPath) {
  const abs = path.join(root, relPath);
  const quoted = `"${abs.replace(/"/g, '\\"')}"`;
  const result = spawnSync(`npx --yes @gltf-transform/cli inspect ${quoted}`, {
    encoding: "utf8",
    cwd: root,
    shell: true,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";

  const meshNames = [...stdout.matchAll(/│\s*\d+\s*│\s*([\w-]+)\s*│\s*TRIANGLES/g)].map((m) => m[1]);
  const animRows = [...stdout.matchAll(/│\s*\d+\s*│\s*([^│]+?)\s*│\s*\d+\s*│\s*\d+\s*│\s*([\d.]+)\s*│\s*([\d,]+)/g)].map((m) => ({
    name: m[1].trim(),
    duration: Number(m[2]),
    keyframes: Number(m[3].replace(/,/g, "")),
  }));

  const attrsLine = stdout.match(/_CONCAVITY:f32, _CONVEXITY:f32, _DIST:f32/);
  const hasDraco = stdout.includes("KHR_draco_mesh_compression");

  return {
    label,
    file: relPath,
    exitCode: result.status,
    hasDraco,
    meshCount: meshNames.length,
    meshNames: [...new Set(meshNames)].sort(),
    animations: animRows,
    glassAttributes: {
      hasDist: stdout.includes("_DIST:f32"),
      hasConvexity: stdout.includes("_CONVEXITY:f32"),
      hasConcavity: stdout.includes("_CONCAVITY:f32"),
      hasPeaks: stdout.includes("_PEAKS:f32"),
      hasThickness: stdout.includes("_THICKNESS:f32"),
      hasTangent: stdout.includes("TANGENT:f32"),
      hasSkinning: stdout.includes("JOINTS_0:u8"),
    },
    rawExcerpt: stdout.slice(0, 4000),
    stderr: stderr.slice(0, 500) || null,
  };
}

const bird = inspectGlb("v20-bird", "public/eagle-project/models/v20.glb");
const cam = inspectGlb("cam-timeline", "public/eagle-project/timelines/cam.glb");
const camMobPath = "public/eagle-project/timelines/cam-mob.glb";
const camMob = fs.existsSync(path.join(root, camMobPath))
  ? inspectGlb("cam-mob-timeline", camMobPath)
  : { label: "cam-mob-timeline", file: camMobPath, missing: true };

const heroGlassMeshes = bird.meshNames.filter((n) => n !== "trail" && n !== "belly" && n !== "chest" && n !== "legs");
const sorterMeshes = [
  "back", "body", "neck-bottom", "neck-top", "tail-bottom", "tail-center", "tail-top",
  "trail", "wing-left-bottom", "wing-left-center-bottom", "wing-left-center-top",
  "wing-left-pole", "wing-left-top", "wing-right-bottom", "wing-right-center-bottom",
  "wing-right-center-top", "wing-right-pole", "wing-right-top",
];

const combined = {
  generatedAt: new Date().toISOString(),
  method: "@gltf-transform/cli inspect",
  bird,
  camera: cam,
  cameraMobile: camMob,
  validation: {
    birdMeshCount: bird.meshCount,
    sorterMeshCoverage: sorterMeshes.filter((n) => bird.meshNames.includes(n)),
    sorterMeshMissing: sorterMeshes.filter((n) => !bird.meshNames.includes(n)),
    heroGlassMeshCount: heroGlassMeshes.length,
    camAnimationCount: cam.animations.length,
    camDurationSeconds: cam.animations[0]?.duration ?? null,
  },
};

const outFile = path.join(outDir, "glb-inspection.json");
fs.writeFileSync(outFile, JSON.stringify(combined, null, 2));
console.log("Wrote", outFile);
console.log("Bird meshes:", bird.meshCount, "| Cam animations:", cam.animations.map((a) => a.name).join(", "));
console.log("Glass attrs OK:", bird.glassAttributes);
