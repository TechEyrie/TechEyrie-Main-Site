import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import {
  EAGLE2_REFRACTION_SPOT_COLORS,
  EAGLE2_REFRACTION_SPOT_COUNT,
  EAGLE2_REFRACTION_SPOT_LAYER,
  EAGLE2_REFRACTION_SPOT_RADIUS,
  ENV_BACKGROUND,
  HDR_ENV,
  MOUNTAINS_GEOMETRY,
  MOUNTAINS_TEX,
  REFLECTOR_RESOLUTION,
  REFLECTOR_SIZE,
  REFLECTOR_Y,
  WAVES_TEX,
} from "./constants.js";

function loadTexture(url, { colorSpace = THREE.SRGBColorSpace, wrap = THREE.RepeatWrapping, repeat = null } = {}) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = colorSpace;
        tex.wrapS = tex.wrapT = wrap;
        if (repeat) tex.repeat.set(repeat[0], repeat[1]);
        resolve(tex);
      },
      undefined,
      reject,
    );
  });
}

function loadHdr(url) {
  return new Promise((resolve, reject) => {
    new RGBELoader().load(url, resolve, undefined, reject);
  });
}

/**
 * Mountains bed — Noomo `yte`: half-cylinder CylinderGeometry(100,100,12.5,64,1,true,0,π).
 */
export function createMountainsMesh(map) {
  const g = MOUNTAINS_GEOMETRY;
  const geometry = new THREE.CylinderGeometry(
    g.radiusTop,
    g.radiusBottom,
    g.height,
    g.radialSegments,
    g.heightSegments,
    g.openEnded,
    g.thetaStart,
    g.thetaLength,
  );
  geometry.translate(0, g.height / 2, 0);

  const material = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "Mountains";
  mesh.frustumCulled = false;
  return mesh;
}

/**
 * Water floor plane with waves normal map (visual layer above Reflector).
 */
export function createWaterSurface(wavesMap, envMap) {
  const geometry = new THREE.PlaneGeometry(REFLECTOR_SIZE[0], REFLECTOR_SIZE[1]);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x1a3a36),
    metalness: 0.05,
    roughness: 0.18,
    transmission: 0.15,
    thickness: 0.5,
    transparent: true,
    opacity: 0.72,
    envMap,
    envMapIntensity: 0.55,
    normalMap: wavesMap,
    normalScale: new THREE.Vector2(0.35, 0.35),
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "WaterSurface";
  mesh.rotation.x = -Math.PI * 0.5;
  mesh.position.y = REFLECTOR_Y + 0.002;
  return mesh;
}

/**
 * Noomo Spots — bright billboards sampled into sceneRT for glass refraction color.
 * Rendered on a dedicated layer (sceneRT pass only).
 */
export function createEagle2RefractionSpots() {
  const group = new THREE.Group();
  group.name = "Eagle2RefractionSpots";
  const geometry = new THREE.PlaneGeometry(14, 14);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < EAGLE2_REFRACTION_SPOT_COUNT; i += 1) {
    const color = EAGLE2_REFRACTION_SPOT_COLORS[i % EAGLE2_REFRACTION_SPOT_COLORS.length];
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.98,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const t = i / Math.max(EAGLE2_REFRACTION_SPOT_COUNT - 1, 1);
    const y = 1 - t * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    mesh.position.set(
      Math.cos(theta) * radiusAtY * EAGLE2_REFRACTION_SPOT_RADIUS,
      y * EAGLE2_REFRACTION_SPOT_RADIUS * 0.45 + 2,
      Math.sin(theta) * radiusAtY * EAGLE2_REFRACTION_SPOT_RADIUS,
    );
    mesh.lookAt(0, mesh.position.y, 0);
    mesh.layers.set(EAGLE2_REFRACTION_SPOT_LAYER);
    mesh.frustumCulled = false;
    group.add(mesh);
  }

  return group;
}

/**
 * SceneRT-style floor reflector (Three.js Reflector ≈ Noomo wA).
 */
export function createFloorReflector() {
  const geometry = new THREE.PlaneGeometry(REFLECTOR_SIZE[0], REFLECTOR_SIZE[1]);
  const reflector = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: REFLECTOR_RESOLUTION,
    textureHeight: REFLECTOR_RESOLUTION,
    color: 0x889a95,
  });
  reflector.name = "Reflector";
  reflector.rotation.x = -Math.PI * 0.5;
  reflector.position.y = REFLECTOR_Y;
  return reflector;
}

/**
 * Apply IBL env map onto glass placeholder materials.
 */
export function applyEnvMapToGlassMeshes(root, envMap, intensity = 1) {
  let count = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.isGlassDispersion) return;
    for (const mat of [obj.frontMaterial, obj.material]) {
      if (!mat || mat.isShaderMaterial || mat.isGlassBackShader || mat.isGlassFrontShader) continue;
      mat.envMap = envMap;
      mat.envMapIntensity = intensity;
      mat.needsUpdate = true;
    }
    count += 1;
  });
  return count;
}

/**
 * Phase 3 environment: HDR IBL + mountains + reflector floor.
 * Phase 9: optional hideMountains + backgroundPreset for eagle-project-2 compare.
 */
export async function createEnvironment({
  renderer,
  scene,
  backgroundHex = ENV_BACKGROUND,
  hideMountains = false,
  hideReflector = false,
  /** Hide water surface mesh (eagle2 wing close-up — avoids lime floor band). */
  hideWater = false,
  addRefractionSpots = false,
  textureUrls = {},
  /** Leave scene.background null so the WebGL canvas stays transparent (clearAlpha=0). */
  transparentBackground = false,
} = {}) {
  const hdrUrl = textureUrls.hdr ?? HDR_ENV;
  const mountainsUrl = textureUrls.mountains ?? MOUNTAINS_TEX;
  const wavesUrl = textureUrls.waves ?? WAVES_TEX;

  const hdr = await loadHdr(hdrUrl);
  hdr.mapping = THREE.EquirectangularReflectionMapping;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(hdr);
  const envMap = envRT.texture;
  const equirectEnv = hdr;
  pmrem.dispose();

  scene.environment = envMap;
  const initialBg =
    typeof backgroundHex === "number"
      ? backgroundHex
      : parseInt(String(backgroundHex).replace("#", ""), 16);
  scene.background = transparentBackground ? null : new THREE.Color(initialBg);

  const [mountainsMap, wavesMap] = await Promise.all([
    loadTexture(mountainsUrl, {
      colorSpace: THREE.SRGBColorSpace,
      wrap: THREE.RepeatWrapping,
      repeat: [Math.PI, 1],
    }),
    loadTexture(wavesUrl, {
      colorSpace: THREE.NoColorSpace,
      wrap: THREE.RepeatWrapping,
      repeat: [8, 8],
    }),
  ]);

  const mountains = createMountainsMesh(mountainsMap);
  mountains.position.y = REFLECTOR_Y;
  mountains.visible = !hideMountains;
  scene.add(mountains);

  const reflector = createFloorReflector();
  reflector.visible = !hideReflector;
  scene.add(reflector);

  const water = createWaterSurface(wavesMap, envMap);
  water.visible = !hideReflector && !hideWater;
  scene.add(water);

  let refractionSpots = null;
  if (addRefractionSpots) {
    refractionSpots = createEagle2RefractionSpots();
    scene.add(refractionSpots);
  }

  return {
    envMap,
    equirectEnv,
    mountains,
    reflector,
    water,
    refractionSpots,
    refractionSpotLayer: addRefractionSpots ? EAGLE2_REFRACTION_SPOT_LAYER : null,
    mountainsMap,
    wavesMap,
    backgroundHex: initialBg,
    reflectorY: REFLECTOR_Y,
    setBackground(hex) {
      if (hex == null) {
        scene.background = null;
        this.backgroundHex = null;
        return null;
      }
      const color = typeof hex === "number" ? hex : parseInt(String(hex).replace("#", ""), 16);
      scene.background = new THREE.Color(color);
      this.backgroundHex = color;
      return color;
    },
    setMountainsVisible(visible) {
      mountains.visible = Boolean(visible);
      return mountains.visible;
    },
    setReflectorVisible(visible) {
      const v = Boolean(visible);
      reflector.visible = v;
      water.visible = v && !hideWater;
      return v;
    },
    dispose: () => {
      scene.remove(mountains, reflector, water);
      if (refractionSpots) {
        scene.remove(refractionSpots);
        refractionSpots.traverse((obj) => {
          if (obj.isMesh) {
            obj.geometry?.dispose();
            obj.material?.dispose();
          }
        });
      }
      mountains.geometry.dispose();
      mountains.material.dispose();
      mountainsMap.dispose();
      wavesMap.dispose();
      water.geometry.dispose();
      water.material.dispose();
      reflector.geometry.dispose();
      if (reflector.material) reflector.material.dispose();
      if (reflector.getRenderTarget) reflector.getRenderTarget()?.dispose();
      envMap.dispose();
      equirectEnv?.dispose();
      if (scene.environment === envMap) scene.environment = null;
    },
  };
}
