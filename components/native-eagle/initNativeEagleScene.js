import * as THREE from "three";
import {
  BIRD_GLB,
  CAM_GLB,
  CAMERA_SETTINGS,
  DEBUG_HOOK,
  DEV_TIMELINE_GLB,
  ENV_BACKGROUND,
  GLASS_ANIMATION_CLIPS,
  EAGLE2_BIRD_LOCAL_OFFSET,
  EAGLE2_SCREEN_PAN_RIGHT,
  GLASS_COLORS,
  GLASS_SORTER_MESHES,
  HERO_ANIMATION_ID,
  TIMELINE_DURATION,
} from "./constants.js";
import { sampleCameraWorldPose } from "./cameraPose.js";
import {
  applyEnvMapToGlassMeshes,
  createEnvironment,
} from "./createEnvironment.js";
import { createGlassPipeline, summarizeGlassMaterials } from "./createGlassPipeline.js";
import { createPostComposer, DEFAULT_BLOOM } from "./createPostComposer.js";
import { loadGltf } from "./createGltfLoader.js";
import { disposeGlassTextures, loadGlassTextures } from "./loadGlassTextures.js";
import { prepareGlassMesh } from "./prepareGlassMesh.js";
import {
  clipTargetsExist,
  resolveTimelineCamera,
  retargetClip,
  syncPhoenixTransform,
  updateCameraFromRig,
} from "./retargetAnimation.js";
import {
  createGlassTimelineMixers,
  disposeGlassTimelineMixers,
  ensureGlassTimelineNodes,
  scrubGlassTimelineMixers,
} from "./createGlassTimelineFromDev.js";
import { EAGLE2_GLASS_UNIFORM_OVERRIDES } from "./glassConfig.js";
import {
  normalizeGlassColors,
  randomizeGlassColorTriplet,
  randomizeGlassTimelineNodes,
  REFERENCE_GLASS_COLORS,
  resetGlassTimelineToHero,
} from "./glassColorSystem.js";
import { applyGlassColorUniforms, syncGlassTimelineUniforms } from "./syncGlassTimelineUniforms.js";

/** Reference eagle-project-2 bloom — post.bloom.* defaults from reference bundle.
 *  threshold=1, power=1/6≈0.167, radius=2/3≈0.667 */
const EAGLE2_BLOOM = {
  strength: 0.42,
  radius: 0.67,
  threshold: 0.72,
};

/**
 * Phase 7 — post composer (SMAA + bloom) + glass timeline uniforms + background API.
 * Phase 8 — AbortSignal so React Strict Mode / remount cancels before duplicate WebGL.
 * Phase 9 — eagle-project-2 compare options (bg, hide mountains, initial progress).
 */
export async function initNativeEagleScene(
  container,
  {
    signal,
    backgroundHex = ENV_BACKGROUND,
    hideMountains = false,
    hideReflector = false,
    initialProgress = 0,
    /** "eagle-project-2" enables Phase 10 glass overrides + soft shadow */
    variant = "default",
    /** Override asset URLs (eagle-extract test page) */
    assetPaths = null,
    /** Glass RGB triplet { color, peaksColor, fringeColor } */
    glassColors = null,
    /** Use dispersion glass shaders (reference default). Simple if false. */
    glassDispersion = false,
    /** Explicit glass uniform overrides — bypasses eagle2 auto-overrides when set. */
    glassUniformOverrides = null,
  } = {},
) {
  // Let React Strict Mode abort the first effect before allocating a GPU context.
  await Promise.resolve();
  if (signal?.aborted) return null;

  const isEagle2 = variant === "eagle-project-2" || hideMountains;
  /** Loaded from eagle-extract package — use bundle-exact glass path. */
  const isExtractAssets = Boolean(assetPaths);
  /** Extract package uses dev.glb hero timeline — overrides would clobber maxColorValue/envReflection. */
  const eagle2Overrides =
    glassUniformOverrides != null
      ? glassUniformOverrides
      : isEagle2 && !isExtractAssets
        ? EAGLE2_GLASS_UNIFORM_OVERRIDES
        : null;
  const glassColorState = {
    colors: normalizeGlassColors(glassColors ?? GLASS_COLORS),
    fringeColor: normalizeGlassColors(glassColors ?? GLASS_COLORS).fringeColor,
  };
  /** Reflector feeds sceneRT for glass refraction — hidden on eagle2 compare. */
  const hideFloor = Boolean(hideReflector) || isEagle2;

  const state = {
    scrollProgress: 0,
    timelineTime: 0,
    meshCount: 0,
    glassMeshCount: 0,
    tangentFixedCount: 0,
    birdActionName: null,
    camActionName: null,
    birdSyncMode: null,
    wingClipName: null,
    envLoaded: false,
    mountainsPresent: false,
    mountainsVisible: !hideMountains,
    reflectorPresent: false,
    reflectorVisible: !hideFloor,
    glassEnvMapped: 0,
    glassBackShaderCount: 0,
    glassFrontShaderCount: 0,
    glassBackPlaceholderCount: 0,
    glassFrontPlaceholderCount: 0,
    glassPipelineActive: false,
    backRTReady: false,
    glassSorterReady: false,
    glassSortedCount: 0,
    glassSortOrderIndex: 0,
    glassSortNames: [],
    postComposerActive: false,
    smaaEnabled: false,
    bloomEnabled: false,
    glassTimelineBoundCount: 0,
    glassTimelineTotalBindings: 0,
    glassTimelineSource: null,
    glassIorStart: null,
    glassEnvReflection: null,
    glassColorFactor: null,
    glassColorsActive: glassColorState.colors,
    glassOverridesActive: Boolean(eagle2Overrides),
    toneMappingExposure: 1,
    reflectorY: null,
    backgroundHex: null,
    referenceVariant: isEagle2 ? "eagle-project-2" : "eagle-project",
    loaded: false,
    error: null,
  };

  const scene = new THREE.Scene();
  const startBg =
    typeof backgroundHex === "number"
      ? backgroundHex
      : parseInt(String(backgroundHex).replace("#", ""), 16);
  scene.background = new THREE.Color(startBg);

  const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
  const fallbackCamera = new THREE.PerspectiveCamera(
    CAMERA_SETTINGS.fov,
    aspect,
    CAMERA_SETTINGS.near,
    CAMERA_SETTINGS.far,
  );
  fallbackCamera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: isExtractAssets,
    preserveDrawingBuffer: isEagle2 || isExtractAssets,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  if (isExtractAssets) {
    renderer.setClearColor(0x000000, 0);
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = isEagle2 || isExtractAssets ? 1.15 : 1;
  const shaderErrors = [];
  renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
    const entry = {
      vertex: (gl.getShaderInfoLog(vertexShader) || "").trim().slice(0, 800),
      fragment: (gl.getShaderInfoLog(fragmentShader) || "").trim().slice(0, 800),
      program: (gl.getProgramInfoLog(program) || "").trim().slice(0, 400),
    };
    shaderErrors.push(entry);
    if (shaderErrors.length <= 2) {
      console.error("[native-eagle] shader compile error", entry);
    }
  };
  state.shaderErrors = shaderErrors;
  container.appendChild(renderer.domElement);

  const clock = new THREE.Clock();
  let disposed = false;
  let frameId = 0;
  const instanceId = `ne-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  function isAborted() {
    return disposed || Boolean(signal?.aborted);
  }

  function disposeInstance() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    disposeGlassTimelineMixers(glassTimelineMixers);
    glassTimelineMixers = [];
    glassPipeline?.dispose();
    environment?.dispose();
    disposeGlassTextures(glassTextures);
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
    birdRoot?.traverse((obj) => {
      if (obj.isMesh && obj.disposeGlass) obj.disposeGlass();
    });
    if (
      typeof window !== "undefined" &&
      window[DEBUG_HOOK]?.__instanceId === instanceId
    ) {
      delete window[DEBUG_HOOK];
    }
  }

  let birdRoot = null;
  let camRoot = null;
  let camClip = null;
  let timelineCamera = fallbackCamera;
  let birdTimelineAction = null;
  let camTimelineAction = null;
  let birdTimelineMixer = null;
  let camTimelineMixer = null;
  let useCamBoneSync = false;
  let useLookAtRig = false;
  let camLookAtTarget = null;
  let wingPoseMixer = null;
  let wingPoseAction = null;
  let glassTimelineMixers = [];
  let environment = null;
  let floorNode = null;
  let glassTextures = null;
  let glassPipeline = null;
  let postComposer = null;
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const key = new THREE.DirectionalLight(0xffffff, 0.55);
  key.position.set(2, 4, 3);
  scene.add(ambient, key);

  function refreshBirdSkeleton() {
    if (!birdRoot) return;
    birdRoot.traverse((obj) => {
      if (obj.isSkinnedMesh && obj.skeleton) {
        obj.skeleton.update();
        obj.computeBoundingSphere();
      }
    });
    birdRoot.updateWorldMatrix(true, true);
  }

  function applyTimelineTime(time) {
    state.timelineTime = THREE.MathUtils.clamp(time, 0, TIMELINE_DURATION);

    if (birdTimelineAction) {
      birdTimelineAction.time = state.timelineTime;
      birdTimelineMixer?.update(0);
    }

    if (camTimelineAction) {
      camTimelineAction.time = state.timelineTime;
      camTimelineMixer?.update(0);
    }

    scrubGlassTimelineMixers(glassTimelineMixers, state.timelineTime);

    if (useCamBoneSync && camRoot && birdRoot) {
      syncPhoenixTransform(camRoot, birdRoot);
    }

    if (wingPoseAction && wingPoseMixer) {
      wingPoseAction.time = 0;
      wingPoseMixer.update(0);
      refreshBirdSkeleton();
    }

    if (camRoot && timelineCamera) {
      updateCameraFromRig({
        camera: timelineCamera,
        camRoot,
        panScreenRight: isEagle2 ? EAGLE2_SCREEN_PAN_RIGHT : 0,
      });
    }

    if (floorNode && environment?.mountains) {
      environment.mountains.position.y = floorNode.position.y;
    }

    timelineCamera.updateMatrixWorld(true);

    if (glassPipeline?.layerController?.ready) {
      glassPipeline.layerController.tick({
        birdRoot,
        camRoot,
        camera: timelineCamera,
      });
      const sortDebug = glassPipeline.getSortDebug();
      state.glassSortedCount = sortDebug.sortedCount;
      state.glassSortOrderIndex = sortDebug.orderIndex;
      state.glassSortNames = sortDebug.sortedNames;
      state.glassSorterReady = true;
    }

    if (glassPipeline && camRoot && birdRoot) {
      const uni = glassPipeline.getGlassUniformDebug?.();
      if (uni) {
        state.glassTimelineBoundCount = uni.boundCount;
        state.glassTimelineTotalBindings = uni.totalBindings;
        state.glassIorStart = uni.values?.iorStart ?? null;
        state.glassEnvReflection = uni.values?.envReflection ?? null;
        state.glassColorFactor = uni.values?.colorFactor ?? null;
        state.glassOverridesActive = Boolean(uni.overridesApplied);
      }
    }
  }

  function setScrollProgress(progress) {
    state.scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
    applyTimelineTime(state.scrollProgress * TIMELINE_DURATION);
    publishDebug();
  }

  function getCameraPose() {
    return sampleCameraWorldPose(timelineCamera);
  }

  function refreshGlassStats() {
    if (!birdRoot) return;
    const summary = summarizeGlassMaterials(birdRoot);
    state.glassBackShaderCount = summary.shaderBackCount;
    state.glassFrontShaderCount = summary.shaderFrontCount;
    state.glassBackPlaceholderCount = summary.placeholderBackCount;
    state.glassFrontPlaceholderCount = summary.placeholderFrontCount;
    if (glassPipeline?.layerController) {
      const sortDebug = glassPipeline.getSortDebug();
      state.glassSorterReady = glassPipeline.layerController.ready;
      state.glassSortedCount = sortDebug.sortedCount;
      state.glassSortOrderIndex = sortDebug.orderIndex;
      state.glassSortNames = sortDebug.sortedNames;
    }
  }

  function publishDebug() {
    if (disposed || typeof window === "undefined") return;
    const pose = getCameraPose();
    let birdScreen = null;
    if (birdRoot && timelineCamera) {
      birdRoot.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(birdRoot);
      const corners = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.min.x, box.min.y, box.max.z),
        new THREE.Vector3(box.min.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.max.z),
        new THREE.Vector3(box.max.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.min.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z),
      ];
      const projected = corners.map((v) => v.clone().project(timelineCamera));
      const inView = projected.some((p) => p.x >= -1 && p.x <= 1 && p.y >= -1 && p.y <= 1 && p.z >= -1 && p.z <= 1);
      birdScreen = {
        inView,
        ndcX: [
          Number(Math.min(...projected.map((p) => p.x)).toFixed(3)),
          Number(Math.max(...projected.map((p) => p.x)).toFixed(3)),
        ],
        ndcY: [
          Number(Math.min(...projected.map((p) => p.y)).toFixed(3)),
          Number(Math.max(...projected.map((p) => p.y)).toFixed(3)),
        ],
      };
    }
    window[DEBUG_HOOK] = {
      ...state,
      __instanceId: instanceId,
      birdScreen,
      cameraFov: timelineCamera?.fov ?? fallbackCamera.fov,
      toneMapping: renderer.toneMapping,
      outputColorSpace: renderer.outputColorSpace,
      birdActionTime: birdTimelineAction?.time ?? null,
      camActionTime: camTimelineAction?.time ?? null,
      cameraPosition: pose.position.map((v) => Number(v.toFixed(6))),
      cameraQuaternion: pose.quaternion.map((v) => Number(v.toFixed(6))),
      hasSceneEnvironment: Boolean(scene.environment),
      backRTWidth: glassPipeline?.backRT?.width ?? null,
      backRTHeight: glassPipeline?.backRT?.height ?? null,
      sampleAtTime: (t) => {
        applyTimelineTime(t);
        const sampled = getCameraPose();
        publishDebug();
        return sampled;
      },
      setBackground: (hex) => {
        if (!environment) return null;
        const color = environment.setBackground(hex);
        state.backgroundHex = color;
        publishDebug();
        return color;
      },
      setPostEnabled: ({ smaa, bloom } = {}) => {
        if (smaa !== undefined) {
          postComposer?.setSmaaEnabled(smaa);
          state.smaaEnabled = Boolean(smaa);
        }
        if (bloom !== undefined) {
          postComposer?.setBloomEnabled(bloom);
          state.bloomEnabled = Boolean(bloom);
        }
        publishDebug();
      },
      setToneMappingExposure: (value) => {
        renderer.toneMappingExposure = value;
        state.toneMappingExposure = value;
        publishDebug();
      },
      getBodyBoneNdc: () => {
        if (!birdRoot || !timelineCamera) return null;
        let bone = null;
        birdRoot.traverse((obj) => {
          if (!bone && obj.isBone && /body/i.test(obj.name)) bone = obj;
        });
        if (!bone) {
          birdRoot.traverse((obj) => {
            if (!bone && obj.isBone) bone = obj;
          });
        }
        if (!bone) return null;
        const pos = new THREE.Vector3();
        bone.getWorldPosition(pos);
        const ndc = pos.clone().project(timelineCamera);
        return {
          bone: bone.name,
          world: pos.toArray().map((v) => Number(v.toFixed(3))),
          ndc: [Number(ndc.x.toFixed(3)), Number(ndc.y.toFixed(3)), Number(ndc.z.toFixed(3))],
          inView:
            ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1 && ndc.z >= -1 && ndc.z <= 1,
        };
      },
      getWingMeshNdc: () => {
        if (!birdRoot || !timelineCamera) return null;
        let wing = null;
        birdRoot.traverse((obj) => {
          if (!wing && obj.isMesh && /wing-left-top/i.test(obj.name)) wing = obj;
        });
        if (!wing) return null;
        const box = new THREE.Box3().setFromObject(wing);
        const center = box.getCenter(new THREE.Vector3());
        const ndc = center.clone().project(timelineCamera);
        return {
          mesh: wing.name,
          ndc: [Number(ndc.x.toFixed(3)), Number(ndc.y.toFixed(3)), Number(ndc.z.toFixed(3))],
          inView:
            ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1 && ndc.z >= -1 && ndc.z <= 1,
        };
      },
      getSyncStats: () => {
        const phoenix = camRoot?.getObjectByName("Phoenix");
        return {
          phoenixPresent: Boolean(phoenix),
          phoenixPosition: phoenix
            ? phoenix.position.toArray().map((v) => Number(v.toFixed(3)))
            : null,
          camRootVisible: Boolean(camRoot?.visible),
          birdParent: birdRoot?.parent?.name ?? null,
        };
      },
      getGlassMaterialSample: () => {
        if (!birdRoot) return null;
        let mesh = null;
        birdRoot.traverse((obj) => {
          if (!mesh && obj.isMesh && /wing-left-top/i.test(obj.name)) mesh = obj;
        });
        const mat = mesh?.frontMaterial;
        const backMat = mesh?.backMaterial;
        if (!mat?.uniforms) return null;
        const u = mat.uniforms;
        return {
          mesh: mesh.name,
          backUsesDefaultDist: Boolean(backMat?.defines?.USE_DEFAULT_DIST !== undefined),
          baseColor: u.baseColor?.value ? `#${u.baseColor.value.getHexString()}` : null,
          peaksColor: u.peaksColor?.value ? `#${u.peaksColor.value.getHexString()}` : null,
          fringeColor: u.fringeColor?.value ? `#${u.fringeColor.value.getHexString()}` : null,
          colorBoost: u.colorBoost?.value,
          colorFactor: u.colorFactor?.value,
          peaksFactor: u.peaksFactor?.value,
          maxColorValue: u.maxColorValue?.value,
          envReflection: u.envReflection?.value,
          envRefraction: backMat?.uniforms?.envRefraction?.value,
          iorStart: u.iorStart?.value,
          hasMap: Boolean(u.map?.value),
          hasEnvMap: Boolean(u.envMap?.value),
          hasColorsMap: Boolean(u.colorsMap?.value),
        };
      },
      getGlassTimelineNodes: () => {
        if (!camRoot) return null;
        const names = [
          "Glass_convexConcavePeaks",
          "Glass_colorBoostFactorCurve",
          "Glass_colorMaxvalDecayUsetransmittance",
          "Glass_refractionVIri",
          "Glass_fringeCurveMix",
        ];
        const out = {};
        for (const name of names) {
          const node = camRoot.getObjectByName(name);
          if (node) out[name] = node.position.toArray().map((v) => Number(v.toFixed(3)));
        }
        return out;
      },
      getGlassAttributeSample: () => {
        if (!birdRoot) return null;
        let mesh = null;
        birdRoot.traverse((obj) => {
          if (!mesh && obj.isMesh && /wing-left-top/i.test(obj.name)) mesh = obj;
        });
        const g = mesh?.geometry;
        if (!g) return null;
        const readAttr = (name) => {
          const attr =
            g.getAttribute(name) ||
            g.getAttribute(name.toUpperCase()) ||
            g.getAttribute(`_${name}`);
          if (!attr) return null;
          const n = Math.min(attr.count, 200);
          let min = Infinity;
          let max = -Infinity;
          let sum = 0;
          for (let i = 0; i < n; i += 1) {
            const v = attr.itemSize === 1 ? attr.getX(i) : attr.getX(i);
            min = Math.min(min, v);
            max = Math.max(max, v);
            sum += v;
          }
          return { count: attr.count, min, max, avg: sum / n };
        };
        return {
          mesh: mesh.name,
          visible: mesh.visible,
          renderOrder: mesh.renderOrder,
          _thickness: readAttr("_thickness"),
          _peaks: readAttr("_peaks"),
          _dist: readAttr("_dist"),
          _convexity: readAttr("_convexity"),
          _concavity: readAttr("_concavity"),
        };
      },
    };
  }

  function onResize() {
    const w = container.clientWidth;
    const h = Math.max(container.clientHeight, 1);
    const nextAspect = w / h;
    fallbackCamera.aspect = nextAspect;
    fallbackCamera.updateProjectionMatrix();
    if (timelineCamera?.isPerspectiveCamera) {
      timelineCamera.aspect = nextAspect;
      timelineCamera.updateProjectionMatrix();
    }
    renderer.setSize(w, h);
    glassPipeline?.resize(w, h);
    postComposer?.resize(w, h);
  }

  window.addEventListener("resize", onResize);

  function renderLoop() {
    if (disposed) return;
    frameId = requestAnimationFrame(renderLoop);

    if (glassPipeline) {
      const usePost = Boolean(postComposer);
      const prevTone = renderer.toneMapping;
      if (usePost) {
        renderer.toneMapping = THREE.NoToneMapping;
      }
      glassPipeline.render({
        camera: timelineCamera,
        elapsedSeconds: clock.getElapsedTime(),
        equirectEnv: environment?.equirectEnv ?? null,
        outputToFinalRT: usePost,
      });

      if (usePost) {
        renderer.toneMapping = prevTone;
        postComposer.setInputTexture(glassPipeline.finalRT.texture);
        postComposer.render();
      }

      const sortDebug = glassPipeline.getSortDebug();
      state.glassSortedCount = sortDebug.sortedCount;
      state.glassSortOrderIndex = sortDebug.orderIndex;
      state.glassSortNames = sortDebug.sortedNames;
      state.glassSorterReady = glassPipeline.layerController.ready;

      const uni = glassPipeline.getGlassUniformDebug?.();
      if (uni) {
        state.glassTimelineBoundCount = uni.boundCount;
        state.glassTimelineTotalBindings = uni.totalBindings;
        state.glassIorStart = uni.values?.iorStart ?? null;
        state.glassEnvReflection = uni.values?.envReflection ?? null;
        state.glassColorFactor = uni.values?.colorFactor ?? null;
        state.glassOverridesActive = Boolean(uni.overridesApplied);
      }
    } else {
      clock.getDelta();
      renderer.render(scene, timelineCamera);
    }
  }

  const birdGlb = assetPaths?.birdGlb ?? BIRD_GLB;
  const camGlb = assetPaths?.camGlb ?? CAM_GLB;
  const textureUrls = assetPaths?.textures ?? null;

  try {
    glassTextures = await loadGlassTextures(textureUrls ?? undefined);
    if (isAborted()) {
      disposeInstance();
      return null;
    }

    const [birdGltf, camGltf, devGltf] = await Promise.all([
      loadGltf(birdGlb),
      loadGltf(camGlb),
      loadGltf(DEV_TIMELINE_GLB).catch(() => null),
    ]);

    if (isAborted()) {
      disposeInstance();
      return null;
    }

    camRoot = camGltf.scene;
    // Must stay visible when bird is parented under Phoenix — parent.visible=false culls all descendants.
    camRoot.visible = true;
    scene.add(camRoot);

    if (devGltf?.scene) {
      glassTimelineMixers = createGlassTimelineMixers(devGltf, camRoot);
      state.glassTimelineSource = "dev.glb";
    } else {
      ensureGlassTimelineNodes(camRoot);
      state.glassTimelineSource = "defaults";
    }

    birdRoot = birdGltf.scene;
    birdRoot.frustumCulled = false;
    let phoenixNode = camRoot.getObjectByName("Phoenix");
    if (phoenixNode) {
      phoenixNode.add(birdRoot);
      birdRoot.position.set(
        isEagle2 ? EAGLE2_BIRD_LOCAL_OFFSET.x : 0,
        isEagle2 ? EAGLE2_BIRD_LOCAL_OFFSET.y : 0,
        isEagle2 ? EAGLE2_BIRD_LOCAL_OFFSET.z : 0,
      );
      birdRoot.quaternion.set(0, 0, 0, 1);
      birdRoot.scale.set(1, 1, 1);
      state.birdSyncMode = "phoenix-parented";
    } else {
      scene.add(birdRoot);
      state.birdSyncMode = "scene-root";
      useCamBoneSync = true;
    }
    birdRoot.updateWorldMatrix(true, true);

    birdRoot.traverse((child) => {
      if (!child.isMesh) return;
      state.meshCount += 1;
      if (child.name === "trail") return;
      if (!GLASS_SORTER_MESHES.has(child.name)) return;

      const debugSolidColor =
        typeof window !== "undefined" && Boolean(window.__NATIVE_EAGLE_DEBUG_GLASS_COLOR__);

      const result = prepareGlassMesh(child, {
        shouldBeSorted: true,
        glassTextures,
        useDispersion: Boolean(glassDispersion),
        tealLift: isEagle2 && !isExtractAssets,
        debugSolidColor,
      });
      if (result.tangentFixed) state.tangentFixedCount += 1;
      state.glassMeshCount += 1;
    });

    refreshGlassStats();

    const birdClip =
      camGltf.animations.find((c) => c.name === "BirdAction") ??
      camGltf.animations.find((c) => /bird/i.test(c.name));
    camClip =
      camGltf.animations.find((c) => c.name === "New CameraAction") ??
      camGltf.animations.find((c) => /camera/i.test(c.name));

    const resolvedCam = resolveTimelineCamera(camRoot, camClip, aspect);
    timelineCamera = resolvedCam.camera;
    useLookAtRig = Boolean(resolvedCam.useLookAtRig);
    camLookAtTarget = resolvedCam.target ?? null;
    timelineCamera.fov = CAMERA_SETTINGS.fov;
    timelineCamera.updateProjectionMatrix();
    updateCameraFromRig({
      camera: timelineCamera,
      camRoot,
      panScreenRight: isEagle2 ? EAGLE2_SCREEN_PAN_RIGHT : 0,
    });

    const heroWingClipName = GLASS_ANIMATION_CLIPS[HERO_ANIMATION_ID];
    const wingClip =
      birdGltf.animations.find((c) => c.name === heroWingClipName) ??
      birdGltf.animations.find((c) => /wing_closeup/i.test(c.name));
    // Hero wing pose: Wing_CloseUp at t=0 (Phase 0 animationId=2). Disable via env for A/B.
    const enableWingCloseUp = process.env.NATIVE_EAGLE_DISABLE_WING_CLOSEUP !== "1";
    if (wingClip && enableWingCloseUp) {
      wingPoseMixer = new THREE.AnimationMixer(birdRoot);
      wingPoseAction = wingPoseMixer.clipAction(wingClip);
      wingPoseAction.play();
      wingPoseAction.paused = true;
      wingPoseAction.time = 0;
      wingPoseMixer.update(0);
      refreshBirdSkeleton();
      state.wingClipName = wingClip.name;
    }

    if (birdClip) {
      if (clipTargetsExist(birdClip, birdRoot)) {
        birdTimelineMixer = new THREE.AnimationMixer(birdRoot);
        birdTimelineAction = birdTimelineMixer.clipAction(birdClip);
        birdTimelineAction.play();
        birdTimelineAction.paused = true;
        state.birdActionName = birdClip.name;
        state.birdSyncMode = "direct";
      } else if (clipTargetsExist(birdClip, camRoot)) {
        birdTimelineMixer = new THREE.AnimationMixer(camRoot);
        birdTimelineAction = birdTimelineMixer.clipAction(birdClip);
        birdTimelineAction.play();
        birdTimelineAction.paused = true;
        state.birdActionName = birdClip.name;
        if (state.birdSyncMode !== "phoenix-parented") {
          state.birdSyncMode = "phoenix-sync";
          useCamBoneSync = true;
        }
      } else {
        const retargeted = retargetClip(birdClip, camRoot, birdRoot);
        if (retargeted) {
          birdTimelineMixer = new THREE.AnimationMixer(birdRoot);
          birdTimelineAction = birdTimelineMixer.clipAction(retargeted);
          birdTimelineAction.play();
          birdTimelineAction.paused = true;
          state.birdActionName = retargeted.name;
          state.birdSyncMode = "retarget";
        }
      }
    }

    if (camClip) {
      camTimelineMixer = new THREE.AnimationMixer(camRoot);
      camTimelineAction = camTimelineMixer.clipAction(camClip);
      camTimelineAction.play();
      camTimelineAction.paused = true;
      state.camActionName = camClip.name;
    }

    environment = await createEnvironment({
      renderer,
      scene,
      backgroundHex: startBg,
      hideMountains: isEagle2 || hideMountains,
      hideReflector: hideFloor,
      hideWater: isEagle2 || isExtractAssets,
      addRefractionSpots: false,
      textureUrls: textureUrls ?? undefined,
      transparentBackground: false,
    });
    if (isAborted()) {
      disposeInstance();
      return null;
    }

    state.envLoaded = true;
    state.mountainsPresent = Boolean(environment.mountains);
    state.mountainsVisible = Boolean(environment.mountains?.visible);
    state.reflectorPresent = Boolean(environment.reflector);
    state.reflectorVisible = Boolean(environment.reflector?.visible);
    state.reflectorY = environment.reflectorY;
    state.backgroundHex = environment.backgroundHex;
    state.glassEnvMapped = applyEnvMapToGlassMeshes(
      birdRoot,
      environment.envMap,
      1.0,
    );

    floorNode = camRoot.getObjectByName("Floor");
    if (floorNode && environment.mountains) {
      environment.mountains.position.y = floorNode.position.y;
    }

    glassPipeline = createGlassPipeline({
      renderer,
      scene,
      birdRoot,
      camRoot,
      glassUniformOverrides: eagle2Overrides,
      glassColorOpts: isEagle2 || isExtractAssets ? glassColorState : null,
      refractionSpotLayer: environment.refractionSpotLayer ?? null,
      transparentFinal: isExtractAssets,
      refractionBackground: isExtractAssets
        ? (environment.equirectEnv ?? new THREE.Color(startBg))
        : null,
      refractionBackgroundIntensity: isExtractAssets ? 0.28 : 1,
    });
    glassPipeline.resize(container.clientWidth, container.clientHeight);
    applyGlassColorUniforms(
      birdRoot,
      glassColorState.colors,
      glassColorState.fringeColor,
    );
    state.glassPipelineActive = true;
    state.backRTReady = Boolean(glassPipeline.backRT);

    postComposer = createPostComposer({
      renderer,
      width: container.clientWidth,
      height: container.clientHeight,
      bloom: isEagle2 || isExtractAssets ? EAGLE2_BLOOM : DEFAULT_BLOOM,
    });
    state.postComposerActive = true;
    state.smaaEnabled = true;
    state.bloomEnabled = true;
    state.toneMappingExposure = renderer.toneMappingExposure;

    refreshGlassStats();

    state.loaded = true;
    applyTimelineTime(
      THREE.MathUtils.clamp(initialProgress, 0, 1) * TIMELINE_DURATION,
    );
    if ((isEagle2 || isExtractAssets) && camRoot) {
      resetGlassTimelineToHero(camRoot);
      syncGlassTimelineUniforms(camRoot, birdRoot, eagle2Overrides);
    }
    state.scrollProgress = THREE.MathUtils.clamp(initialProgress, 0, 1);
    // Force one uniform sync into debug before first frames
    const prevTone = renderer.toneMapping;
    renderer.toneMapping = THREE.NoToneMapping;
    glassPipeline.render({
      camera: timelineCamera,
      elapsedSeconds: 0,
      equirectEnv: environment?.equirectEnv ?? null,
      outputToFinalRT: true,
    });
    renderer.toneMapping = prevTone;
    const uni0 = glassPipeline.getGlassUniformDebug?.();
    if (uni0) {
      state.glassTimelineBoundCount = uni0.boundCount;
      state.glassTimelineTotalBindings = uni0.totalBindings;
      state.glassIorStart = uni0.values?.iorStart ?? null;
      state.glassEnvReflection = uni0.values?.envReflection ?? null;
      state.glassColorFactor = uni0.values?.colorFactor ?? null;
      state.glassOverridesActive = Boolean(uni0.overridesApplied);
    }
    publishDebug();
    renderLoop();
  } catch (err) {
    state.error = String(err?.message || err);
    publishDebug();
    console.error("[native-eagle] init failed:", err);
    disposeInstance();
    return null;
  }

  if (isAborted()) {
    disposeInstance();
    return null;
  }

  function setGlassColors(next) {
    const normalized = normalizeGlassColors(next);
    glassColorState.colors = normalized;
    glassColorState.fringeColor = normalized.fringeColor;
    state.glassColorsActive = normalized;
    if (birdRoot) {
      applyGlassColorUniforms(birdRoot, normalized, normalized.fringeColor);
    }
    publishDebug();
    return normalized;
  }

  function randomizeGlassParameters(seed) {
    const colors = randomizeGlassColorTriplet();
    setGlassColors(colors);
    const numeric = camRoot ? randomizeGlassTimelineNodes(camRoot, seed) : { seed: null, nodesTouched: 0 };
    if (birdRoot && camRoot) {
      syncGlassTimelineUniforms(camRoot, birdRoot, eagle2Overrides);
    }
    publishDebug();
    return { colors, ...numeric };
  }

  function resetGlassToReference() {
    setGlassColors(REFERENCE_GLASS_COLORS);
    const nodes = camRoot ? resetGlassTimelineToHero(camRoot) : 0;
    if (birdRoot && camRoot) {
      syncGlassTimelineUniforms(camRoot, birdRoot, eagle2Overrides);
    }
    publishDebug();
    return { colors: REFERENCE_GLASS_COLORS, nodesReset: nodes };
  }

  return {
    setScrollProgress,
    getCameraPose,
    getState: () => ({ ...state }),
    setGlassColors,
    randomizeGlassParameters,
    resetGlassToReference,
    setBackground: (hex) => {
      if (!environment) return null;
      const color = environment.setBackground(hex);
      state.backgroundHex = color;
      publishDebug();
      return color;
    },
    setMountainsVisible: (visible) => {
      if (!environment?.setMountainsVisible) return null;
      const v = environment.setMountainsVisible(visible);
      state.mountainsVisible = v;
      publishDebug();
      return v;
    },
    dispose: disposeInstance,
  };
}
