const THREE = require("three");
import { createCube, playDown } from '../utils/tools'
import { getSize, getPosition, getArea, getCenter } from '../utils/getBox'
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";
import { instancedMesh } from '../utils/tools'
// 引入封装好的动画
import { Animate, NumberAnimate } from '../utils/animate'
// import { Ammo } from '../utils/ammo.wasm.js'
// import '../utils/ammo.wasm.js'
// require('../utils/ammo.wasm.js')

// 引入物理动画
import { AmmoPhysics } from '../utils/AmmoPhysics.js'

import { cutLead } from './cutLead'
interface Element {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  controls: OrbitControls
}
class CreateGame {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  controls: OrbitControls
  floorCube: THREE.Mesh // 初始底板
  size: number = 30 // 主角宽度和长度
  leadY: number = 5 // 主角高度
  startPoint: number = 60 // 主角起始位置 x或z
  offset: number = 10 // 主角起始位置和终点位置偏移量
  physics: any = null
  fractionDom: HTMLElement = document.querySelector('#fraction')

  floorGroup: THREE.Group // 底板组
  leadCount: number = 0 // 计数器
  leadCube: THREE.Object3D = null // 主角
  tween: any = null // 动画
  T: number = 2000 // 主角运动时间，随着高度增加而衰减
  flag: boolean = false // 奇偶数主角
  isOver: boolean = false // 是否游戏结束
  areaCount: number = 0  // 分数
  invalidGroup:THREE.Group = new THREE.Group() // 无效区域

  constructor(element: Element) {
    this.scene = element.scene
    this.scene.autoUpdate
    this.camera = element.camera
    this.controls = element.controls
    this.floorGroup = new THREE.Group()
    this.scene.add(this.floorGroup)
    this.scene.add(this.invalidGroup)

    this.initAmmo()
    window.addEventListener('keydown', this.leadStop.bind(this))
  }
  async initAmmo() {
    this.physics = await AmmoPhysics();
    this.initFloor()
  }
  initFloor() {
    // 定义物理学插件
    // this.physics = await new AmmoPhysics();
    const w: number = this.size
    const h: number = 50
    const l: number = this.size
    const floorParams = {
      w: w,
      h: h,
      l: l,
      x: w / 2,
      y: h / 2,
      z: l / 2
    }
    this.floorCube = createCube(floorParams);
    // 将第一个底板添加到物理学插件中
    this.floorGroup.add(this.floorCube)
    this.floorGroup.updateMatrix()

    // 创建一个跟底板相同位置信息的实例化网格
    const floor = instancedMesh(this.floorCube)
    this.physics.addMesh(floor)
    console.log(this.physics)
  
  }
  createlead() {
    const size = new THREE.Vector3()
    const mesh = this.floorGroup
    // 获取尺寸
    getSize(mesh, size)
    const position = new THREE.Vector3()
    // 获取底板的位置 默认应该都是0
    getPosition(mesh, position)
    const gy = position.y // 底板的Y值
    const y = size.y + gy + this.leadY / 2 // 主角的Y值
    // 设定第奇数个主角从z轴的负方向来，第偶数个主角从X轴方向来 
    // 需要一个主角计数器，同样可以用来计算分数
    // 起始点距离底板30
    // 主角初始位置
    this.flag = this.leadCount % 2 === 0 // 是否是偶数主角
    // x 起始点
    let sx: number = (this.flag ? -this.startPoint - this.offset : 0) + this.size / 2
    // z 起始点
    let sz: number = (this.flag ? 0 : -this.startPoint - this.offset) + this.size / 2
    // 如果开始游戏没有主角  创建一个主角
    if (!this.leadCube) {
      const leadParam = {
        w: this.size,
        h: this.leadY,
        l: this.size,
        x: sx,
        y,
        z: sz
      }
      this.leadCube = createCube(leadParam)
    } else {
      let nextPosition = this.leadCube.position.clone()
      // 奇数在右侧出现的，修改z值位置，偶数在左侧出现的，修改x值
      if (this.flag) {
        nextPosition.setX(sx)
      } else {
        nextPosition.setZ(sz)
      }
      nextPosition.setY(y)
      this.leadCube.position.copy(nextPosition)
    }
    this.floorGroup.add(this.leadCube)
    // 创建角色后计数器自增1
    this.leadCount++
    // 开始控制主角
    // const startVector3 = new THREE.Vector3(sx,y,sz)
    this.leadHandle()
  }
  // 控制主角
  leadHandle(): void {
    // 控制移动
    const lead = this.leadCube
    // 动画起始点
    const start = lead.position
    let ex = lead.position.x
    let ez = lead.position.z
    ex = ex === this.size / 2 ? this.size / 2 : (Math.abs(ex) + this.offset)
    ez = ez === this.size / 2 ? this.size / 2 : (Math.abs(ez) + this.offset)
    // 动画结束点
    const end = new THREE.Vector3(ex, start.y, ez)

    if (this.flag) {
      end.setZ(start.z)
    } else {
      end.setX(start.x)
    }
    // 开启主角动画
    // 每增加一层减20毫秒 难度增加
    const t = Math.max(this.T - this.leadCount * 20, 500)
    this.tween = new Animate(this.leadCube, end, t)

    if (this.tween) {
      console.log('动画结束调用一次')
      this.tween.tween.onComplete(this.leadOperation.bind(this))
    }
  }
  // 键盘空格控制主角
  leadStop(event): void {
    // 判断是否点击空格
    console.log('点击空格')
    if (event.keyCode === 32) {
      if (this.tween && !this.isOver) {
        // 暂停动画
        this.tween.tween.stop()
        this.tween = null
        console.log('空格调用一次')
        this.leadOperation()
      }
    }
  }

  // 对主角进行处理，包括生成新的主角，裁切主角，重绘底板等
  leadOperation() {
    // 对主角进行裁切
    // 找到上一个主角判定和当前主角直接的重叠关系
    const lastLead = this.floorGroup.children[this.floorGroup.children.length - 2].clone()
    // 抬高底板
    lastLead.position.setY(lastLead.position.y + this.leadY)
    // 获取裁剪后的有效区域和无效区域
    const meshArr = cutLead(this.leadCube, lastLead)
    if (meshArr && meshArr.length !== 0) {
      // 向场景中添加有效区域
      if (meshArr[0]) {
        this.floorGroup.remove(this.leadCube)
        this.floorGroup.add(meshArr[0])
        // 克隆一个有效区域
        const newMesh: any = meshArr[0].clone();

        // 获取主角的中心点作为有效区域底板的位置
        const center = new THREE.Vector3()
        getCenter(newMesh, center)
        // console.log(center)

        const phyMesh = instancedMesh(newMesh, center.clone())

        // 有效区域不动，第二参数默认不传
        this.physics.addMesh(phyMesh, 1)

        // 将本次的有效区域作为下一次的主角
        this.leadCube = newMesh.clone()
        const area = getArea(this.leadCube.clone())
        this.areaCount += area
        this.upDateFraction()
        this.moveCamera()
      } else {
        // 没有有效区域，整个主角都是无效区域 游戏结束
        this.gameOver()
      }
      // 判断无效区域
      if (meshArr[1]) {
        // 创建无效区域实体网格
        const newMesh = meshArr[1]

        // 获取无效区域中心点
        const center = new THREE.Vector3()
        getCenter(newMesh, center)

        // 创建无效区域实体化网格
        const phyMesh = instancedMesh(newMesh, center)

        this.invalidGroup.add(phyMesh)
        // 自由落体
        this.physics.addMesh(phyMesh, 1)

      }
    } else {
      // 返回值为[]，或者无效  游戏结束
      this.gameOver()
    }
    // 生成下一个主角
    if (!this.isOver) {
      this.createlead()
    }
  }
  moveCamera() {
    // 定义控制器target的y值
    const oldty = this.controls.target.y
    const newty = oldty + 1 // 每一次向上移动1
    let tween: any = NumberAnimate(oldty, newty, 100)
    tween.onUpdate(() => {
      this.controls.target.setY(tween._object.p)
    })
  }
  gameOver() {
    this.isOver = true
    // 处理主角
    playDown(this.leadCube)

    window.removeEventListener('keydown', this.leadStop.bind(this))

    const floorSize = new THREE.Vector3()
    getSize(this.floorGroup, floorSize)
    this.undateCameraZoom(3)
    const mark: HTMLElement = document.querySelector('#mark')
    mark.style.display = 'block'

  }
  upDateFraction() {
    this.fractionDom.innerText = this.areaCount + ''
  }
  undateCameraZoom(n: number, callback?: Function) {
    if (n !== this.camera.zoom) {
      let tween: any = NumberAnimate(this.camera.zoom, n, 1000)
      tween.onUpdate(() => {
        this.camera.zoom = tween._object.p
        this.camera.updateProjectionMatrix()
      })
      if (callback) {
        tween.onComplete(callback.bind(this))
      }
    }
  }
  restart() {
    // 判断是否为上一局结束后开始
    if (this.isOver) {
      // 重置变量
      this.floorGroup.remove(...this.floorGroup.children)
      this.invalidGroup.remove(...this.invalidGroup.children)
      this.leadCount = 0
      this.leadCube = null
      this.tween = null
      this.T = 2000
      this.flag = false
      this.isOver = false // 是否游戏结束
      this.areaCount = 0  // 分数
      this.upDateFraction()
      this.scene.updateMatrix()
      this.initFloor()
    }
    this.undateCameraZoom(5.5, () => {
      // 开始创建第一个主角
      this.createlead()
    })
  }
}

export { CreateGame }