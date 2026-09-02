import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { DRACO_DECODER_PATH } from "./constants.js";

let sharedLoader = null;

export function createGltfLoader() {
  if (sharedLoader) return sharedLoader;

  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_DECODER_PATH);

  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  sharedLoader = loader;
  return loader;
}

export function loadGltf(url) {
  const loader = createGltfLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}
