const THREE = require("three");
import { Animate } from './animate'
// 创建方块时候需要的参数
interface cubeParams {
  w: number // 宽度  对应X轴
  h: number // 高度  对应Y轴
  l: number // 长度  对应Z轴
  x: number // x轴位置
  y: number // y轴位置
  z: number // z轴位置
}
// 创建方块
export function createCube(p: cubeParams): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(p.w, p.h, p.l);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(p.x, p.y, p.z)
  return cube
}

interface Vector3 {
  x: Number
  y: Number
  z: Number
}
// 创建实体网格
export function instancedMesh(box: any, position: Vector3) {
  // 材质
  const material = new THREE.MeshNormalMaterial();
  // 从box获取顶点信息
  var boxes = new THREE.InstancedMesh(box.geometry, material, 2);
  // 定义四维矩阵
  const matrix = new THREE.Matrix4();
  matrix.setPosition(position);
  boxes.setMatrixAt(1, matrix);
  return boxes
}

export function playDown(mesh) {
  const end = mesh.position.clone()
  end.setY(-100)
  var tween = new Animate(mesh, end, 1000)
  tween.tween.onComplete(()=>{
    mesh.parent.remove(mesh)
  })
}