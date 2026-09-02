import * as THREE from "three";
import { bindGlassBackUniforms } from "./createGlassBackMaterial.js";
import { bindGlassFrontUniforms } from "./createGlassFrontMaterial.js";
import { LayerController } from "./createLayerController.js";
import { applyGlassColorUniforms, syncGlassTimelineUniforms } from "./syncGlassTimelineUniforms.js";

/** Match reference Post.rt — HalfFloat HDR buffers (not 8-bit clamp). */
function createPipelineRenderTarget(width, height, renderer) {
  const useHalfFloat =
    renderer?.capabilities?.isWebGL2 ||
    renderer?.extensions?.has("EXT_color_buffer_half_float");
  return new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: false,
    depthBuffer: true,
    stencilBuffer: false,
    type: useHalfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
    format: THREE.RGBAFormat,
  });
}

/**
 * Dual-RT glass pipeline + optional finalRT for Phase 7 composer.
 * Phase 10: optional glassUniformOverrides for eagle-project-2 parity.
 */
export function createGlassPipeline({
  renderer,
  scene,
  birdRoot,
  camRoot = null,
  glassUniformOverrides = null,
  glassColorOpts = null,
  refractionSpotLayer = null,
} = {}) {
  const glassMeshes = [];
  birdRoot.traverse((obj) => {
    if (obj.isMesh && obj.isGlassDispersion) glassMeshes.push(obj);
  });

  const sceneRT = createPipelineRenderTarget(1, 1, renderer);
  const backRT = createPipelineRenderTarget(1, 1, renderer);
  const finalRT = createPipelineRenderTarget(1, 1, renderer);
  for (const rt of [sceneRT, backRT, finalRT]) {
    rt.texture.colorSpace = THREE.SRGBColorSpace;
    rt.texture.wrapS = rt.texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  const layerController = new LayerController();
  layerController.updateGlass(birdRoot);

  let lastGlassUniformSync = null;
  let uniformOverrides = glassUniformOverrides;

  function setGlassUniformOverrides(next) {
    uniformOverrides = next;
  }

  function resize(width, height) {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    sceneRT.setSize(w, h);
    backRT.setSize(w, h);
    finalRT.setSize(w, h);
  }

  function setGlassVisible(visible) {
    for (const mesh of glassMeshes) mesh.visible = visible;
  }

  function applyBackMaterials() {
    for (const mesh of glassMeshes) mesh.material = mesh.backMaterial;
  }

  function applyFrontMaterials() {
    for (const mesh of glassMeshes) mesh.material = mesh.frontMaterial;
  }

  /**
   * @param {{ camera: THREE.Camera, elapsedSeconds: number, equirectEnv?: THREE.Texture, outputToFinalRT?: boolean }} opts
   */
  function render({ camera, elapsedSeconds, equirectEnv, outputToFinalRT = false }) {
    layerController.tick({ birdRoot, camRoot, camera });

    if (camRoot && birdRoot) {
      lastGlassUniformSync = syncGlassTimelineUniforms(
        camRoot,
        birdRoot,
        uniformOverrides,
      );
    }

    if (glassColorOpts?.colors && birdRoot) {
      applyGlassColorUniforms(
        birdRoot,
        glassColorOpts.colors,
        glassColorOpts.fringeColor ?? glassColorOpts.colors.fringeColor,
      );
    }

    bindGlassBackUniforms(birdRoot, {
      map: sceneRT.texture,
      envMap: equirectEnv ?? null,
      seconds: elapsedSeconds,
    });

    bindGlassFrontUniforms(birdRoot, {
      map: backRT.texture,
      envMap: equirectEnv ?? null,
      seconds: elapsedSeconds,
    });

    const spotLayer = refractionSpotLayer;
    const hadSpotLayer =
      spotLayer != null && camera.layers.isEnabled?.(spotLayer) === true;
    if (spotLayer != null) {
      camera.layers.enable(spotLayer);
    }

    // Pass 1 — scene without glass → sceneRT (Post.map)
    setGlassVisible(false);
    renderer.setRenderTarget(sceneRT);
    renderer.clear();
    renderer.render(scene, camera);

    if (spotLayer != null && !hadSpotLayer) {
      camera.layers.disable(spotLayer);
    }

    // Pass 2 — glass backs only (sorted renderOrder) → backRT
    const visibilityScratch = new Map();
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      visibilityScratch.set(obj, obj.visible);
      obj.visible = Boolean(obj.isGlassDispersion);
    });
    applyBackMaterials();
    renderer.setRenderTarget(backRT);
    renderer.clear();
    renderer.render(scene, camera);
    for (const [obj, wasVisible] of visibilityScratch) {
      obj.visible = wasVisible;
    }

    // Pass 3 — full scene + glass fronts → finalRT or screen
    setGlassVisible(true);
    applyFrontMaterials();
    renderer.setRenderTarget(outputToFinalRT ? finalRT : null);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
  }

  function dispose() {
    sceneRT.dispose();
    backRT.dispose();
    finalRT.dispose();
  }

  return {
    glassMeshes,
    sceneRT,
    backRT,
    finalRT,
    layerController,
    resize,
    render,
    setGlassUniformOverrides,
    getSortDebug: () => layerController.getSortDebug(),
    getGlassUniformDebug: () => lastGlassUniformSync,
    dispose,
  };
}

export function collectGlassMeshes(root) {
  const meshes = [];
  root.traverse((obj) => {
    if (obj.isMesh && obj.isGlassDispersion) meshes.push(obj);
  });
  return meshes;
}

export function summarizeGlassMaterials(root) {
  let shaderBackCount = 0;
  let shaderFrontCount = 0;
  let placeholderBackCount = 0;
  let placeholderFrontCount = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.isGlassDispersion) return;
    if (obj.backMaterial?.isGlassBackShader) shaderBackCount += 1;
    else placeholderBackCount += 1;
    if (obj.frontMaterial?.isGlassFrontShader) shaderFrontCount += 1;
    else placeholderFrontCount += 1;
  });
  return { shaderBackCount, shaderFrontCount, placeholderBackCount, placeholderFrontCount };
}

/** @deprecated use summarizeGlassMaterials */
export function summarizeGlassBackMaterials(root) {
  const s = summarizeGlassMaterials(root);
  return {
    shaderBackCount: s.shaderBackCount,
    placeholderBackCount: s.placeholderBackCount,
  };
}
