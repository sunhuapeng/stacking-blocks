// 引用初始化场景类
import "babel-polyfill"

import { CreateScene, THREE } from '../createScene/index'
import { CreateGame } from '../playGame/initGame'

// 初始化场景
const _this = new CreateScene()

import { AmmoPhysics } from '../utils/AmmoPhysics.js';
var physics

/**
init()

async function init() {
  physics = await AmmoPhysics();
  console.log(physics)


  const floor = new THREE.Mesh(
    new THREE.BoxBufferGeometry(100, 5, 100),
    new THREE.MeshNormalMaterial({ color: 0x111111 })
  );
  _this.scene.add(floor);

  physics.addMesh(floor);


  const material = new THREE.MeshNormalMaterial();

  const matrix = new THREE.Matrix4();
  // 创建实例化网格
  const geometryBox = new THREE.BoxBufferGeometry(5, 5, 5);

  var boxes = new THREE.InstancedMesh(geometryBox, material, 2);
  
  for (let i = 0; i < boxes.count; i++) {
    
    matrix.setPosition(Math.random() - 10, (i + 1) * 10, Math.random() - (i * 4));
    boxes.setMatrixAt(i, matrix);
  }
  physics.addMesh(boxes, 1);
  _this.scene.add(boxes);

}
 */


// 开始游戏部分
const createGame = new CreateGame(_this)

const mark: HTMLElement = document.querySelector('#mark')
const startBtn: HTMLElement = document.querySelector('#start-game')
console.log(mark, startBtn)
if (mark && startBtn) {
 console.log(startBtn)
 startBtn.onclick = function () {
   mark.style.display = 'none'
   // 缩放镜头
   createGame.restart()
 }
}
/**
*/
_this.controls.addEventListener("change", () => {
  // console.log(_this.camera.zoom)
})


