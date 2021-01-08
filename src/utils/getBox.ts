import { Mesh } from "../../node_modules/three/src/Three";

const THREE = require("three");
function getBox(mesh: THREE.Object3D) {
  let b = new THREE.Box3();
  b.expandByObject(mesh);
  return b

}
// 获取尺寸
// 模型，vector3
export function getSize(mesh: THREE.Object3D, v3: THREE.Vector3) {
  if (v3 instanceof THREE.Vector3) {
    getBox(mesh).getSize(v3);
  }
}
export function getCenter(mesh:THREE.Object3D, v3: THREE.Vector3) {
  if (v3 instanceof THREE.Vector3) {
    getBox(mesh).getCenter(v3);
  }
}

export function getArea(mesh): number {
  const size = new THREE.Vector3()
  getSize(mesh, size)
  const area = Math.floor(size.x * size.z)
  return area
}

// 获取世界坐标
export function getPosition(mesh: THREE.Object3D, v3: THREE.Vector3) {
  if (v3 instanceof THREE.Vector3) {
    mesh.getWorldPosition(v3)
  }
}