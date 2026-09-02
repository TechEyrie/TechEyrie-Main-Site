import * as THREE from "three";

function isGlassDispersion(obj) {
  return Boolean(obj && obj.isGlassDispersion === true);
}

function isOrderedNode(obj) {
  return Boolean(obj && obj.isOrderedNode === true);
}

/**
 * Noomo `Ts` — fixed child order, averaged world position.
 */
export class OrderedNode {
  constructor(children, name = "OrderedNode") {
    this.isOrderedNode = true;
    this.name = name;
    this.children = children.filter((c) => c !== undefined && c !== null);
    this.position = new THREE.Vector3();
    this._tmp = new THREE.Vector3();
  }

  updatePosition() {
    this.position.set(0, 0, 0);
    if (this.children.length === 0) return this.position;

    for (const child of this.children) {
      if (isOrderedNode(child)) {
        child.updatePosition();
        this.position.add(child.position);
      } else if (isGlassDispersion(child)) {
        this.position.add(child.geometryWorld);
      } else if (child?.getWorldPosition) {
        child.getWorldPosition(this._tmp);
        this.position.add(this._tmp);
      }
    }
    this.position.divideScalar(this.children.length);
    return this.position;
  }

  get(quaternion, cameraPosition) {
    return this.children.flatMap((child) =>
      isOrderedNode(child) ? child.get(quaternion, cameraPosition) : child,
    );
  }
}

/**
 * Noomo `E1` — sorts children along a world axis relative to camera.
 */
export class SortNode extends OrderedNode {
  constructor(children, axis, name = "SortNode") {
    super(children, name);
    this.axis = axis.clone().normalize();
    this.data = this.children.map((child) => ({ child, dist: 0 }));
    this.worldAxis = new THREE.Vector3();
    this.v3 = new THREE.Vector3();
  }

  get(quaternion, cameraPosition) {
    this.worldAxis.copy(this.axis).applyQuaternion(quaternion);
    this.updatePosition();

    const camPos = cameraPosition;
    this.v3.copy(camPos).sub(this.position);
    const sign = Math.sign(this.v3.dot(this.worldAxis)) || 1;

    for (const entry of this.data) {
      const child = entry.child;
      if (isOrderedNode(child)) {
        this.v3.copy(child.position);
      } else if (isGlassDispersion(child)) {
        this.v3.copy(child.geometryWorld);
      } else {
        child.getWorldPosition(this.v3);
      }
      entry.dist = sign * this.v3.sub(this.position).dot(this.worldAxis);
    }

    this.data.sort((a, b) => a.dist - b.dist);
    return this.data.flatMap(({ child }) =>
      isOrderedNode(child) ? child.get(quaternion, cameraPosition) : child,
    );
  }
}

/**
 * Noomo `Yte` — picks fromBack (0) or fromFront (1) order tree.
 */
export class SelectOrderNode {
  constructor(orders, name = "SelectOrderNode") {
    this.name = name;
    this.orders = orders;
    this._index = 0;
    this.currentOrder = orders[0];
  }

  set index(value) {
    const next = Math.max(0, Math.min(this.orders.length - 1, Math.floor(value)));
    if (next !== this._index) {
      this._index = next;
      this.currentOrder = this.orders[next];
    }
  }

  get index() {
    return this._index;
  }

  get(quaternion, cameraPosition) {
    return this.currentOrder.get(quaternion, cameraPosition);
  }
}

/**
 * Noomo `Jte` — GlassSorter with from-back / from-front trees + wing axis sort.
 */
export class GlassSorter {
  constructor() {
    this.rootNode = null;
    this.meshMap = {};
  }

  buildFromBack(meshes) {
    const wingLeft = new OrderedNode(
      [
        meshes["wing-left-bottom"],
        meshes["wing-left-center-bottom"],
        meshes["wing-left-center-top"],
        meshes["wing-left-pole"],
        meshes["wing-left-top"],
      ],
      "WingLeftOrderedNode",
    );
    const wingRight = new OrderedNode(
      [
        meshes["wing-right-bottom"],
        meshes["wing-right-center-bottom"],
        meshes["wing-right-center-top"],
        meshes["wing-right-pole"],
        meshes["wing-right-top"],
      ],
      "WingRightOrderedNode",
    );
    const wings = new SortNode([wingLeft, wingRight], new THREE.Vector3(1, 0, 0), "WingsSortNode");

    return new OrderedNode(
      [
        meshes["neck-bottom"],
        meshes.chest,
        meshes.belly,
        meshes.body,
        meshes.legs,
        meshes.back,
        meshes["neck-top"],
        wings,
        meshes["tail-bottom"],
        meshes["tail-center"],
        meshes["tail-top"],
      ],
      "FromBackOrderedNode",
    );
  }

  buildFromFront(meshes) {
    const wingLeft = new OrderedNode(
      [
        meshes["wing-left-top"],
        meshes["wing-left-center-top"],
        meshes["wing-left-pole"],
        meshes["wing-left-center-bottom"],
        meshes["wing-left-bottom"],
      ],
      "WingLeftOrderedNode",
    );
    const wingRight = new OrderedNode(
      [
        meshes["wing-right-top"],
        meshes["wing-right-center-top"],
        meshes["wing-right-pole"],
        meshes["wing-right-center-bottom"],
        meshes["wing-right-bottom"],
      ],
      "WingRightOrderedNode",
    );
    const wings = new SortNode([wingLeft, wingRight], new THREE.Vector3(1, 0, 0), "WingsSortNode");

    return new OrderedNode(
      [
        meshes["tail-top"],
        meshes["tail-center"],
        meshes["tail-bottom"],
        wings,
        meshes["neck-top"],
        meshes.back,
        meshes.body,
        meshes.legs,
        meshes.belly,
        meshes.chest,
        meshes["neck-bottom"],
      ],
      "FromFrontOrderedNode",
    );
  }

  setLayers(meshMap) {
    this.meshMap = meshMap;
    const fromBack = this.buildFromBack(meshMap);
    const fromFront = this.buildFromFront(meshMap);
    this.rootNode = new SelectOrderNode([fromBack, fromFront], "RootOrderedNode");
  }

  setOrderIndex(index) {
    if (this.rootNode) this.rootNode.index = index;
  }

  get orderIndex() {
    return this.rootNode?.index ?? 0;
  }

  get ready() {
    return this.rootNode !== null;
  }

  /**
   * @param {THREE.Quaternion} birdQuaternion — Phoenix / bird root world quaternion
   * @param {THREE.Vector3} cameraPosition
   * @returns {THREE.Mesh[]}
   */
  sort(birdQuaternion, cameraPosition) {
    if (!this.rootNode) throw new Error("GlassSorter has no layers set");
    return this.rootNode.get(birdQuaternion, cameraPosition).filter(Boolean);
  }
}

/** Collect glass meshes by name for sorter trees. */
export function buildGlassMeshMap(root) {
  const map = {};
  root.traverse((obj) => {
    if (obj.isMesh && obj.isGlassDispersion) {
      map[obj.name] = obj;
    }
  });
  return map;
}

/** Fixed fromBack name sequence (wings collapsed as a group for unit tests). */
export const FROM_BACK_CORE_ORDER = [
  "neck-bottom",
  "chest",
  "belly",
  "body",
  "legs",
  "back",
  "neck-top",
  // wings (dynamic left/right)
  "tail-bottom",
  "tail-center",
  "tail-top",
];

export const FROM_FRONT_CORE_ORDER = [
  "tail-top",
  "tail-center",
  "tail-bottom",
  // wings
  "neck-top",
  "back",
  "body",
  "legs",
  "belly",
  "chest",
  "neck-bottom",
];

export const WING_LEFT_BACK_ORDER = [
  "wing-left-bottom",
  "wing-left-center-bottom",
  "wing-left-center-top",
  "wing-left-pole",
  "wing-left-top",
];

export const WING_RIGHT_BACK_ORDER = [
  "wing-right-bottom",
  "wing-right-center-bottom",
  "wing-right-center-top",
  "wing-right-pole",
  "wing-right-top",
];
