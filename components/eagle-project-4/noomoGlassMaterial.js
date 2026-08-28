import * as THREE from "three";
import { NOOMO_GLASS } from "./assets";

/**
 * Port of Noomo nk() tangent fix — v20 meshes use vec4 tangents; Three.js expects vec3.
 * @see public/eagle-project/_nuxt/CbdjwYMp.js function nk()
 */
export function fixMeshTangents(geometry) {
  const tangentAttr = geometry.getAttribute("tangent");
  if (!tangentAttr || tangentAttr.itemSize !== 4) return;

  let allOnes = true;
  for (let i = 0; i < tangentAttr.count; i += 1) {
    if (tangentAttr.getW(i) !== 1) {
      allOnes = false;
      break;
    }
  }

  if (!allOnes) return;

  const count = tangentAttr.count;
  const vec3 = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    vec3[i * 3] = tangentAttr.getX(i);
    vec3[i * 3 + 1] = tangentAttr.getY(i);
    vec3[i * 3 + 2] = tangentAttr.getZ(i);
  }

  geometry.setAttribute(
    "tangent",
    new THREE.BufferAttribute(vec3, 3, tangentAttr.normalized === true),
  );
}

/**
 * Simplified GlassFront / GlassBack port.
 * Full Noomo uses dual render-target passes (front + back dispersion shaders).
 * Here: MeshPhysicalMaterial + colorsMap iridescence in onBeforeCompile.
 */
export function createNoomoGlassMaterial({ normalMap, colorsMap, envMap = null }) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(NOOMO_GLASS.color),
    emissive: new THREE.Color(NOOMO_GLASS.fringeColor),
    emissiveIntensity: 0.04,
    metalness: 0.02,
    roughness: 0.06,
    transmission: 0.88,
    thickness: 1.15,
    ior: NOOMO_GLASS.iorStart,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    reflectivity: 0.42,
    specularIntensity: 0.85,
    envMap,
    envMapIntensity: NOOMO_GLASS.envReflection,
    normalMap,
    normalScale: new THREE.Vector2(0.85, 0.85),
    transparent: true,
    opacity: 0.98,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  if (colorsMap) {
    const peaksColor = new THREE.Color(NOOMO_GLASS.peaksColor);
    const fringeColor = new THREE.Color(NOOMO_GLASS.fringeColor);

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uColorsMap = { value: colorsMap };
      shader.uniforms.uPeaksColor = { value: peaksColor };
      shader.uniforms.uFringeColor = { value: fringeColor };
      shader.uniforms.uColorBoost = { value: NOOMO_GLASS.colorBoost };

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <output_fragment>",
        `float facing = abs(dot(normalize(vNormal), normalize(vViewPosition)));
        float thickness = 1.0 - facing;
        vec3 irid = texture2D(uColorsMap, vec2(thickness * 0.3 + 0.08, 1.0)).rgb;
        irid = mix(irid, uPeaksColor, smoothstep(0.35, 0.85, thickness));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, irid * uColorBoost, 0.22 * (1.0 - facing));
        gl_FragColor.rgb += uFringeColor * pow(1.0 - facing, 3.0) * 0.06;
        #include <output_fragment>`,
      );
    };

    mat.customProgramCacheKey = () => "ep4-noomo-glass-v1";
  }

  return mat;
}

/**
 * Walk v20.glb like Noomo GlassSupport constructor.
 */
export function applyNoomoBirdMaterials(root, { normalMap, colorsMap, envMap }) {
  const meshes = [];

  root.traverse((child) => {
    if (!child.isMesh) return;
    if (child.name === "trail") return;

    child.frustumCulled = false;
    fixMeshTangents(child.geometry);
    child.material = createNoomoGlassMaterial({ normalMap, colorsMap, envMap });
    meshes.push(child);
  });

  return meshes;
}
