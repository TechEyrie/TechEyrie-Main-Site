import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";

/** Hero-tuned bloom — subtle wing-tip glow, not full Noomo stack. */
export const DEFAULT_BLOOM = {
  strength: 0.18,
  radius: 0.35,
  threshold: 0.85,
};

/**
 * Injects an external texture as the composer input (glass pipeline finalRT).
 */
class TextureInputPass extends Pass {
  constructor(texture = null) {
    super();
    this.texture = texture;
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(CopyShader.uniforms),
      vertexShader: CopyShader.vertexShader,
      fragmentShader: CopyShader.fragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    this.fsQuad = new FullScreenQuad(this.material);
  }

  setTexture(texture) {
    this.texture = texture;
  }

  render(renderer, writeBuffer) {
    this.material.uniforms.tDiffuse.value = this.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }
}

/**
 * Phase 7 post stack: input(finalRT) → bloom → OutputPass → SMAA.
 * Case/Contacts frost FX (Jr/Ms) are out of hero scope.
 */
export function createPostComposer({ renderer, width, height, bloom = DEFAULT_BLOOM }) {
  const pixelRatio = renderer.getPixelRatio();
  const bloomStrength = bloom?.strength ?? DEFAULT_BLOOM.strength;
  const bloomRadius = bloom?.radius ?? DEFAULT_BLOOM.radius;
  const bloomThreshold = bloom?.threshold ?? DEFAULT_BLOOM.threshold;

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(pixelRatio);
  composer.setSize(width, height);

  const inputPass = new TextureInputPass(null);
  composer.addPass(inputPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    bloomStrength,
    bloomRadius,
    bloomThreshold,
  );
  bloomPass.enabled = true;
  composer.addPass(bloomPass);

  // SMAA must run before OutputPass (linear-srgb)
  const smaaPass = new SMAAPass();
  smaaPass.enabled = true;
  composer.addPass(smaaPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  function setInputTexture(texture) {
    inputPass.setTexture(texture);
  }

  function resize(w, h) {
    const pr = renderer.getPixelRatio();
    composer.setPixelRatio(pr);
    composer.setSize(w, h);
    bloomPass.resolution.set(w, h);
  }

  function setBloomEnabled(enabled) {
    bloomPass.enabled = Boolean(enabled);
  }

  function setSmaaEnabled(enabled) {
    smaaPass.enabled = Boolean(enabled);
  }

  function setBloomParams({ strength, radius, threshold } = {}) {
    if (strength !== undefined) bloomPass.strength = strength;
    if (radius !== undefined) bloomPass.radius = radius;
    if (threshold !== undefined) bloomPass.threshold = threshold;
  }

  function render() {
    composer.render();
  }

  function dispose() {
    inputPass.dispose();
    composer.dispose();
    bloomPass.dispose?.();
  }

  return {
    composer,
    inputPass,
    bloomPass,
    smaaPass,
    outputPass,
    setInputTexture,
    resize,
    render,
    setBloomEnabled,
    setSmaaEnabled,
    setBloomParams,
    dispose,
    getDebug: () => ({
      postComposerActive: true,
      smaaEnabled: smaaPass.enabled,
      bloomEnabled: bloomPass.enabled,
      bloomStrength: bloomPass.strength,
      bloomRadius: bloomPass.radius,
      bloomThreshold: bloomPass.threshold,
      passCount: composer.passes.length,
    }),
  };
}
