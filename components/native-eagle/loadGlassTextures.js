import * as THREE from "three";
import {
  COLORS_MAP_TEX,
  ICE_NORMAL_TEX,
  NOISES_TEX,
} from "./constants.js";

function loadTexture(url, { colorSpace = THREE.SRGBColorSpace, wrap = THREE.ClampToEdgeWrapping } = {}) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = colorSpace;
        tex.wrapS = tex.wrapT = wrap;
        resolve(tex);
      },
      undefined,
      reject,
    );
  });
}

/** Glass shader textures — iceNormal, colors LUT, blue noise. */
export async function loadGlassTextures(urls = {}) {
  const iceUrl = urls.iceNormal ?? ICE_NORMAL_TEX;
  const colorsUrl = urls.colorsMap ?? COLORS_MAP_TEX;
  const noiseUrl = urls.noises ?? NOISES_TEX;
  const [iceNormal, colorsMap, blueNoise] = await Promise.all([
    loadTexture(iceUrl, { colorSpace: THREE.NoColorSpace }),
    loadTexture(colorsUrl, { colorSpace: THREE.SRGBColorSpace }),
    loadTexture(noiseUrl, { colorSpace: THREE.NoColorSpace, wrap: THREE.RepeatWrapping }),
  ]);

  return { iceNormal, colorsMap, blueNoise };
}

export function disposeGlassTextures(textures) {
  textures?.iceNormal?.dispose();
  textures?.colorsMap?.dispose();
  textures?.blueNoise?.dispose();
}
