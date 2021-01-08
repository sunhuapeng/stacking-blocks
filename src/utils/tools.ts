const THREE = require("three");
import { Animate } from './animate'

import { getSize, getPosition, getArea } from '../utils/getBox'

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
export function instancedMesh(box: any, position?:THREE.Vector3) {
  const size = new THREE.Vector3()
  getSize(box, size)
  const material = new THREE.MeshNormalMaterial();
  // 创建实例化网格
  const geometryBox = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
  var boxes = new THREE.InstancedMesh(geometryBox, material, 1);
  // 定义一个四维矩阵，用来存放物体的位置信息
  const matrix = new THREE.Matrix4();
  // 将位置信息传入到四维矩阵中
  if(position && position instanceof THREE.Vector3) {
    matrix.setPosition(position.clone())
  } else {
    matrix.setPosition(box.position.clone())
  }
  // 将四维矩阵设置到新的实体网格模型中
  boxes.setMatrixAt(0, matrix);
  return boxes
}

export function playDown(mesh) {
  const end = mesh.position.clone()
  end.setY(-100)
  var tween = new Animate(mesh, end, 1000)
  tween.tween.onComplete(() => {
    mesh.parent.remove(mesh)
  })
}