/** Public URLs for eagle-extract package (mirrored to public/eagle-extract/). */
export const EAGLE_EXTRACT_PREFIX = "/eagle-extract";

export const EAGLE_EXTRACT_ASSET_PATHS = {
  birdGlb: `${EAGLE_EXTRACT_PREFIX}/assets/models/v20.glb`,
  camGlb: `${EAGLE_EXTRACT_PREFIX}/assets/timelines/cam.glb`,
  textures: {
    hdr: `${EAGLE_EXTRACT_PREFIX}/assets/textures/wooden_studio_19_1k.hdr`,
    iceNormal: `${EAGLE_EXTRACT_PREFIX}/assets/textures/icen.jpg`,
    colorsMap: `${EAGLE_EXTRACT_PREFIX}/assets/textures/LDR_RG01_0.png`,
    noises: `${EAGLE_EXTRACT_PREFIX}/assets/textures/noises.jpg`,
    mountains: `${EAGLE_EXTRACT_PREFIX}/assets/textures/mountains.png`,
    waves: `${EAGLE_EXTRACT_PREFIX}/assets/textures/waves.jpg`,
  },
};

export const EAGLE_EXTRACT_MANIFEST_URL = `${EAGLE_EXTRACT_PREFIX}/MANIFEST.json`;
export const EAGLE_EXTRACT_VALIDATION_URL = `${EAGLE_EXTRACT_PREFIX}/VALIDATION.json`;
export const EAGLE_EXTRACT_COLORS_URL = `${EAGLE_EXTRACT_PREFIX}/glass/colors.json`;
export const EAGLE_EXTRACT_GLASS_CONFIG_URL = `${EAGLE_EXTRACT_PREFIX}/glass/config-from-bundle.json`;
