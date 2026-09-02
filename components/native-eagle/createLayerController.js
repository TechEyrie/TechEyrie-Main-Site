import * as THREE from "three";
import { GlassSorter, buildGlassMeshMap } from "./createGlassSorter.js";

/**
 * Noomo `Mn` — LayerController subset for hero glass sorting.
 * Maintains sorted glass list and applies renderOrder each tick.
 */
export class LayerController {
  constructor() {
    this.glassSorter = new GlassSorter();
    this.sortedGlassLayers = [];
    this.meshMap = {};
    this.lastOrderIndex = 0;
    this.sortCallCount = 0;
  }

  /**
   * Register glass meshes from bird root and build sorter trees.
   */
  updateGlass(birdRoot) {
    this.meshMap = buildGlassMeshMap(birdRoot);
    this.glassSorter.setLayers(this.meshMap);
    this.sortedGlassLayers = Object.values(this.meshMap).filter((m) => m.shouldBeSorted);
  }

  get ready() {
    return this.glassSorter.ready;
  }

  get sortedCount() {
    return this.sortedGlassLayers.length;
  }

  get orderIndex() {
    return this.glassSorter.orderIndex;
  }

  /**
   * Resolve fromBack(0) / fromFront(1) from cam.glb GlassSorter node when present.
   */
  resolveOrderIndex(camRoot) {
    const node = camRoot?.getObjectByName?.("GlassSorter");
    if (node) {
      return Math.floor(node.position.x);
    }
    return this.lastOrderIndex;
  }

  /**
   * Sort glass layers and stamp renderOrder / glassSortIndex.
   * @returns {THREE.Mesh[]}
   */
  tick({ birdRoot, camRoot, camera }) {
    if (!this.glassSorter.ready) return this.sortedGlassLayers;

    for (const mesh of Object.values(this.meshMap)) {
      mesh.updateGeometryWorldPosition?.();
    }

    const orderIndex = this.resolveOrderIndex(camRoot);
    this.glassSorter.setOrderIndex(orderIndex);
    this.lastOrderIndex = this.glassSorter.orderIndex;

    birdRoot.updateWorldMatrix(true, true);
    const birdQuaternion = birdRoot.quaternion;

    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);

    this.sortedGlassLayers = this.glassSorter.sort(birdQuaternion, cameraPosition);
    this.sortCallCount += 1;

    for (let i = 0; i < this.sortedGlassLayers.length; i++) {
      const mesh = this.sortedGlassLayers[i];
      mesh.glassSortIndex = i;
      mesh.renderOrder = 1000 + i;
    }

    return this.sortedGlassLayers;
  }

  getSortDebug() {
    return {
      orderIndex: this.orderIndex,
      sortedNames: this.sortedGlassLayers.map((m) => m.name),
      sortedCount: this.sortedGlassLayers.length,
      sortCallCount: this.sortCallCount,
    };
  }
}
