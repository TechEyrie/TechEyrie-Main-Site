import * as THREE from "three";

export const V20_DRAGON_MESH = "/models/v20.glb";
export const V20_HDR_ENV = "/models/wooden_studio_19_1k.hdr";
export const V20_FEATHER_NORMAL = "/images/icen.jpg";
export const V20_DRACO_DECODER_PATH = "/draco/gltf/";

export const WING_PALETTE = [
  {
    hue: 0.38,
    color: "#0c6a44",
    shadow: "#031a10",
    deepForest: "#021008",
    highlight: "#2a9a68",
    mint: "#5a9878",
    emissive: "#0f6848",
    tip: "#6aaa88",
    iriPink: "#d8a0b8",
    iriPurple: "#a890c8",
    iriGold: "#d8cc88",
  },
  {
    hue: 0.46,
    color: "#0a6258",
    shadow: "#022824",
    deepForest: "#011816",
    highlight: "#2a9890",
    mint: "#549088",
    emissive: "#0f5a54",
    tip: "#68a098",
    iriPink: "#d0a0b8",
    iriPurple: "#9888c0",
    iriGold: "#d4c880",
  },
  {
    hue: 0.34,
    color: "#126832",
    shadow: "#052818",
    deepForest: "#02140c",
    highlight: "#38a058",
    mint: "#5ca070",
    emissive: "#1a6838",
    tip: "#72a880",
    iriPink: "#d8a0b0",
    iriPurple: "#a890b8",
    iriGold: "#d8c878",
  },
  {
    hue: 0.4,
    color: "#1e6230",
    shadow: "#0a2818",
    deepForest: "#06180e",
    highlight: "#4a9858",
    mint: "#689868",
    emissive: "#285830",
    tip: "#7aa878",
    iriPink: "#d098a8",
    iriPurple: "#a080a8",
    iriGold: "#ccc070",
  },
];

const FEATHER_PAINT_STRENGTH = 0.97;
const FEATHER_IRI_STRENGTH = 0.34;
const WING_TIP_ZONE_START = 0.56;
const WING_TIP_BLEND_STRENGTH = 0.82;

function isWingFeatherMesh(mesh) {
  const name = (mesh.name || "").toLowerCase();
  if (/^b_body|^b_head|^b_neck|^bone/i.test(name)) return false;
  if (/wing|feather/.test(name)) return true;

  if (!mesh.geometry) return false;
  mesh.geometry.computeBoundingBox();
  const bbox = mesh.geometry.boundingBox;
  if (!bbox) return false;

  const size = bbox.getSize(new THREE.Vector3());
  const minDim = Math.min(size.x, size.y, size.z);
  const maxDim = Math.max(size.x, size.y, size.z);
  return maxDim / (minDim + 1e-5) > 2.2;
}

function computeFeatherTipAxis(mesh, birdOrigin) {
  mesh.geometry.computeBoundingBox();
  const bbox = mesh.geometry.boundingBox;
  if (!bbox) return null;

  const size = bbox.getSize(new THREE.Vector3());
  const dims = [size.x, size.y, size.z];
  const axisIdx = dims.indexOf(Math.max(...dims));
  const span = dims[axisIdx];
  if (span < 0.012) return null;

  const minVal = [bbox.min.x, bbox.min.y, bbox.min.z][axisIdx];
  const maxVal = [bbox.max.x, bbox.max.y, bbox.max.z][axisIdx];
  const center = new THREE.Vector3();
  bbox.getCenter(center);

  const worldDistAt = (val) => {
    const local = center.clone();
    if (axisIdx === 0) local.x = val;
    else if (axisIdx === 1) local.y = val;
    else local.z = val;
    return local.applyMatrix4(mesh.matrixWorld).distanceToSquared(birdOrigin);
  };

  const tipIsMin = worldDistAt(minVal) > worldDistAt(maxVal);
  const name = (mesh.name || "").toLowerCase();
  const isDedicatedTip = /_end_|tip_end|feathers_tip/.test(name);
  const softStart = isDedicatedTip ? 0.42 : WING_TIP_ZONE_START;

  return {
    axisIdx,
    rootVal: tipIsMin ? maxVal : minVal,
    tipVal: tipIsMin ? minVal : maxVal,
    softStart,
  };
}

function applyFeatherSurfaceShader(
  material,
  mesh,
  birdOrigin,
  swatch,
  lightweight,
  isWing,
  meshSeed = 0,
) {
  const axis = isWing ? computeFeatherTipAxis(mesh, birdOrigin) : null;

  const uniforms = {
    uBaseColor: { value: new THREE.Color(swatch.color) },
    uShadowColor: { value: new THREE.Color(swatch.shadow) },
    uDeepForest: { value: new THREE.Color(swatch.deepForest) },
    uHighlightColor: { value: new THREE.Color(swatch.highlight) },
    uMintColor: { value: new THREE.Color(swatch.mint) },
    uTipColor: { value: new THREE.Color(swatch.tip) },
    uIriPink: { value: new THREE.Color(swatch.iriPink) },
    uIriPurple: { value: new THREE.Color(swatch.iriPurple) },
    uIriGold: { value: new THREE.Color(swatch.iriGold) },
    uBirdOrigin: { value: birdOrigin.clone() },
    uMeshSeed: { value: meshSeed },
    uPaintStrength: { value: FEATHER_PAINT_STRENGTH },
    uIriStrength: { value: lightweight ? 0.28 : FEATHER_IRI_STRENGTH },
    uTipBlendStrength: { value: axis ? (lightweight ? 0.72 : WING_TIP_BLEND_STRENGTH) : 0 },
    uWingRoot: { value: axis?.rootVal ?? 0 },
    uWingTip: { value: axis?.tipVal ?? 1 },
    uWingAxis: { value: axis?.axisIdx ?? 0 },
    uTipSoftStart: { value: axis?.softStart ?? 1 },
  };

  material.userData.featherUniforms = uniforms;
  material.customProgramCacheKey = () =>
    `feather-paint-v3-${isWing ? 1 : 0}-${axis?.axisIdx ?? "b"}`;

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uWingRoot;
uniform float uWingTip;
uniform float uWingAxis;
uniform float uTipSoftStart;
varying vec3 vFeatherWorldPos;
varying vec3 vFeatherNormal;
varying float vWingTipBlend;`,
      )
      .replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
vFeatherNormal = normalize(normalMatrix * objectNormal);`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
float wingPos = uWingAxis < 0.5 ? transformed.x : (uWingAxis < 1.5 ? transformed.y : transformed.z);
float wingSpan = uWingTip - uWingRoot;
float wingT = wingSpan == 0.0 ? 0.0 : clamp((wingPos - uWingRoot) / wingSpan, 0.0, 1.0);
vWingTipBlend = smoothstep(uTipSoftStart, 1.0, wingT);`,
      )
      .replace(
        "#include <worldpos_vertex>",
        `#include <worldpos_vertex>
vFeatherWorldPos = worldPosition.xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 uBaseColor;
uniform vec3 uShadowColor;
uniform vec3 uDeepForest;
uniform vec3 uHighlightColor;
uniform vec3 uMintColor;
uniform vec3 uTipColor;
uniform vec3 uIriPink;
uniform vec3 uIriPurple;
uniform vec3 uIriGold;
uniform vec3 uBirdOrigin;
uniform float uMeshSeed;
uniform float uPaintStrength;
uniform float uIriStrength;
uniform float uTipBlendStrength;
varying vec3 vFeatherWorldPos;
varying vec3 vFeatherNormal;
varying float vWingTipBlend;`,
      )
      .replace(
        "#include <tonemapping_fragment>",
        `{
  vec3 viewDir = normalize(cameraPosition - vFeatherWorldPos);
  vec3 n = normalize(vFeatherNormal);
  float facing = clamp(dot(n, viewDir), 0.0, 1.0);
  float cavity = pow(1.0 - facing, 2.4);

  vec3 lightDir = normalize(vec3(0.32, 1.0, 0.22));
  float ndl = clamp(dot(n, lightDir) * 0.5 + 0.5, 0.0, 1.0);
  float flatShade = floor(ndl * 5.0) / 5.0;

  float relHeight = clamp((vFeatherWorldPos.y - uBirdOrigin.y + 0.12) / 1.65, 0.0, 1.0);
  vec3 heightTint = mix(uDeepForest, uBaseColor, smoothstep(0.0, 0.38, relHeight));
  heightTint = mix(heightTint, mix(uBaseColor, uMintColor, 0.55), smoothstep(0.35, 0.78, relHeight));
  heightTint = mix(heightTint, uMintColor, smoothstep(0.72, 1.0, relHeight) * 0.32);

  vec3 feather = mix(heightTint, uShadowColor, cavity * 0.78);
  feather = mix(feather, uHighlightColor, flatShade * 0.3);
  feather = mix(feather, uMintColor, pow(max(relHeight, 0.0), 1.8) * 0.06);

  float barbA = sin(dot(vFeatherWorldPos, vec3(42.0 + uMeshSeed, 56.0, 31.0))) * 0.5 + 0.5;
  float barbB = sin(dot(vFeatherWorldPos, vec3(24.0, 19.0 + uMeshSeed, 67.0))) * 0.5 + 0.5;
  float barb = mix(barbA, barbB, 0.45);
  feather *= 0.91 + 0.09 * barb;

  float grain = fract(sin(dot(vFeatherWorldPos.xz, vec2(12.9898, 78.233) + uMeshSeed)) * 43758.5453);
  feather *= 0.96 + 0.04 * grain;

  float edgePaint = pow(1.0 - facing, 3.2);
  feather = mix(feather, uMintColor * 0.82, edgePaint * 0.05);

  float iriT = facing + sin(vFeatherWorldPos.y * 6.8 + vFeatherWorldPos.x * 4.2 + uMeshSeed) * 0.1;
  float iriW = smoothstep(0.42, 0.92, iriT);
  vec3 iri = mix(uIriPurple, uIriPink, smoothstep(0.2, 0.75, sin(vFeatherWorldPos.x * 4.8 + uMeshSeed)));
  iri = mix(iri, uIriGold, smoothstep(0.55, 1.0, iriT) * 0.55);
  feather = mix(feather, iri, iriW * uIriStrength);

  float tip = clamp(vWingTipBlend, 0.0, 1.0);
  feather = mix(feather, uTipColor, tip * uTipBlendStrength);

  gl_FragColor.rgb = mix(gl_FragColor.rgb, feather, uPaintStrength);
}
#include <tonemapping_fragment>`,
      );
  };

  material.needsUpdate = true;
}

export function setupDragonAnimations(mixer, clips) {
  const wingClip =
    clips.find((clip) => /Float_WingPulse|WingPulse/i.test(clip.name)) ||
    clips.find((clip) => /wing|float/i.test(clip.name)) ||
    null;

  const scrollActions = [];
  let maxDuration = 0;

  clips.forEach((clip) => {
    if (clip === wingClip) return;

    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;

    const duration = clip.duration || 20;
    scrollActions.push({ action, duration });
    maxDuration = Math.max(maxDuration, duration);
  });

  let wingAction = null;
  if (wingClip) {
    wingAction = mixer.clipAction(wingClip);
    wingAction.setLoop(THREE.LoopRepeat, Infinity);
    wingAction.timeScale = 0.45;
    wingAction.play();
  }

  return {
    scrollActions,
    wingAction,
    birdDuration: maxDuration || clips[0]?.duration || 20,
  };
}

export function applyDragonMaterial(bird, textures, lightweight = false) {
  const { featherNormal } = textures;
  const materials = [];
  let meshIndex = 0;

  bird.updateWorldMatrix(true, true);
  const birdOrigin = new THREE.Vector3();
  bird.getWorldPosition(birdOrigin);

  bird.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = lightweight;

    const swatch = WING_PALETTE[meshIndex % WING_PALETTE.length];
    const isWing = isWingFeatherMesh(child);
    meshIndex += 1;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(swatch.color),
      emissive: new THREE.Color(swatch.emissive),
      emissiveIntensity: lightweight ? 0.06 : 0.08,
      normalMap: featherNormal,
      normalScale: new THREE.Vector2(0.028, 0.028),
      roughness: lightweight ? 0.94 : 0.92,
      metalness: 0.0,
      flatShading: true,
      envMapIntensity: lightweight ? 0.1 : 0.14,
      side: lightweight ? THREE.FrontSide : THREE.DoubleSide,
      depthWrite: true,
    });

    material.userData.baseHue = swatch.hue;
    material.userData.swatch = swatch;
    child.material = material;
    materials.push(material);

    applyFeatherSurfaceShader(
      material,
      child,
      birdOrigin,
      swatch,
      lightweight,
      isWing,
      meshIndex * 0.173,
    );
  });

  return materials;
}

export function updateDragonFeatherUniforms(birdObject, materials) {
  if (!birdObject) return;
  const origin = new THREE.Vector3();
  birdObject.getWorldPosition(origin);
  materials.forEach((mat) => {
    const uniforms = mat.userData.featherUniforms;
    if (uniforms?.uBirdOrigin) {
      uniforms.uBirdOrigin.value.copy(origin);
    }
  });
}
