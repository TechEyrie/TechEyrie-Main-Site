import * as THREE from "three";
import { createGlassBackMaterial } from "./createGlassBackMaterial.js";
import { createGlassFrontMaterial } from "./createGlassFrontMaterial.js";

/**
 * GLB uses uppercase custom attrs; Noomo shaders expect lowercase.
 */
export function normalizeGlassAttributes(geometry) {
  const aliases = [
    ["_DIST", "_dist"],
    ["_CONVEXITY", "_convexity"],
    ["_CONCAVITY", "_concavity"],
    ["_THICKNESS", "_thickness"],
    ["_PEAKS", "_peaks"],
  ];
  for (const [from, to] of aliases) {
    const attr = geometry.getAttribute(from);
    if (attr && !geometry.getAttribute(to)) {
      geometry.setAttribute(to, attr);
    }
  }
}

/**
 * Fix vec4 tangents where w === 1 → vec3 (Noomo nk() step 1).
 * Returns true when geometry was modified.
 */
export function fixTangentAttribute(geometry) {
  const tangent = geometry.getAttribute("tangent");
  if (!tangent || tangent.itemSize !== 4) return false;

  let allOnes = true;
  for (let i = 0; i < tangent.count; i++) {
    if (tangent.getW(i) !== 1) {
      allOnes = false;
      break;
    }
  }

  if (!allOnes) return false;

  const count = tangent.count;
  const vec3 = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    vec3[i * 3] = tangent.getX(i);
    vec3[i * 3 + 1] = tangent.getY(i);
    vec3[i * 3 + 2] = tangent.getZ(i);
  }

  geometry.setAttribute("tangent", new THREE.BufferAttribute(vec3, 3, tangent.normalized));
  return true;
}

/**
 * nk() subset: tangent fix + GlassFront + GlassBack materials.
 */
export function prepareGlassMesh(
  mesh,
  {
    shouldBeSorted = true,
    glassTextures = null,
    useDispersion = true,
    tealLift = false,
    debugSolidColor = false,
  } = {},
) {
  const geometry = mesh.geometry;
  // Hero eagle GLB stores micro _dist values (~0.01); reference uses defaultDist=2 via USE_DEFAULT_DIST.
  const useDefaultDist = true;
  normalizeGlassAttributes(geometry);
  const tangentFixed = fixTangentAttribute(geometry);
  const position = geometry.getAttribute("position");
  const skinIndex = geometry.getAttribute("skinIndex");
  const skinWeight = geometry.getAttribute("skinWeight");
  const isSkinned = Boolean(skinIndex && skinWeight && mesh.skeleton);

  const sharedTextures = glassTextures
    ? {
        colorsMap: glassTextures.colorsMap,
        blueNoise: glassTextures.blueNoise,
      }
    : null;

  const frontMaterial =
    glassTextures?.iceNormal != null
      ? createGlassFrontMaterial({
          hasSkinning: isSkinned,
          normalMap: glassTextures.iceNormal,
          dispersion: useDispersion,
          textures: sharedTextures,
          tealLift,
          debugSolidColor,
        })
      : new THREE.MeshBasicMaterial({ color: 0x12c48a, transparent: true, opacity: 0.5 });

  const backMaterial =
    glassTextures?.iceNormal != null
      ? createGlassBackMaterial({
          hasSkinning: isSkinned,
          defaultDist: useDefaultDist,
          normalMap: glassTextures.iceNormal,
          dispersion: useDispersion,
          textures: sharedTextures,
          tealLift,
        })
      : frontMaterial.clone();

  mesh.isGlassDispersion = true;
  mesh.shouldBeSorted = shouldBeSorted;
  // Hero close-up keeps wing bbox mostly off-frustum; disable culling (Noomo uses broad layers).
  mesh.frustumCulled = false;
  mesh.frontMaterial = frontMaterial;
  mesh.backMaterial = backMaterial;
  mesh.material = frontMaterial;

  geometry.computeBoundingBox();
  mesh.geometryCenter = new THREE.Vector3();
  geometry.boundingBox.getCenter(mesh.geometryCenter);

  mesh.geometryWorld = new THREE.Vector3();
  mesh.closestToCenterVertexIndex = -1;

  if (isSkinned && position?.count > 0) {
    let bestIndex = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    const tmp = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      tmp.fromBufferAttribute(position, i);
      const d = tmp.distanceToSquared(mesh.geometryCenter);
      if (d < bestDist) {
        bestDist = d;
        bestIndex = i;
      }
    }
    mesh.closestToCenterVertexIndex = bestIndex;
  }

  mesh.updateGeometryWorldPosition = function updateGeometryWorldPosition() {
    mesh.updateWorldMatrix(true, false);
    if (mesh.closestToCenterVertexIndex >= 0 && mesh.skeleton) {
      mesh.geometryWorld.copy(mesh.geometryCenter);
      mesh.applyBoneTransform(mesh.closestToCenterVertexIndex, mesh.geometryWorld);
      mesh.geometryWorld.applyMatrix4(mesh.matrixWorld);
      return;
    }
    mesh.geometryWorld.copy(mesh.geometryCenter).applyMatrix4(mesh.matrixWorld);
  };

  mesh.disposeGlass = function disposeGlass() {
    mesh.frontMaterial?.dispose();
    mesh.backMaterial?.dispose();
    geometry.dispose();
  };

  return { mesh, tangentFixed, useDefaultDist, isSkinned };
}
