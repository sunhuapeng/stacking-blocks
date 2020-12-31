const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";

class CreateScene {
  // 屏幕宽度
  width: number = window.innerWidth;
  // 屏幕高度
  height: number = window.innerHeight;
  // 3d容器
  container: HTMLElement = document.body;
  frustumSize = 2000;
  scene // 场景
  renderer  // 渲染器
  camera // 相机
  controls // 控制器 
  constructor() {
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createControls()
    this.render()
    this.axesHelper(100)
    this.createBackground()
    // 监听屏幕尺寸变化
    window.addEventListener("resize", this.onWindowResized.bind(this), false);
  }
  // 创建场景
  createScene(): void {
    this.scene = new THREE.Scene();
  }
  // 创建渲染器
  createRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio); //设置渲染的比例
    this.renderer.setSize(this.width, this.height);
    document.body.appendChild(this.renderer.domElement);
  }
  // 创建相机
  createCamera(): void {
    this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, this.frustumSize);
    this.camera.zoom = 3
    console.log(this.camera)
    this.camera.position.set(200, 250, 200)
    this.scene.add(this.camera);
    this.camera.updateProjectionMatrix()
  }
  // 创建控制器
  createControls(): void {
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.screenSpacePanning = true
    this.controls.target = new THREE.Vector3(0, 100, 0)

  }
  // 渲染动画
  animate(): void {
    requestAnimationFrame(this.render.bind(this));
  }
  // 渲染
  render(): void {
    this.animate()
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    TWEEN.update();
  }
  // 创建坐标轴辅助线
  axesHelper(len: number): void {
    const axesHelper = new THREE.AxesHelper(len);
    this.scene.add(axesHelper);
  }
  // 监听屏幕改变
  onWindowResized() {
    this.camera.left = this.width / - 2;
    this.camera.right = this.width / 2;
    this.camera.top = this.height / 2;
    this.camera.bottom = this.height / - 2;
    this.camera.updateProjectionMatrix();
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setSize(this.width, this.height);
  }
  // 创建天空背景
  createBackground(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 32;

    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 32);
    gradient.addColorStop(0.0, '#014a84');
    gradient.addColorStop(0.5, '#0561a0');
    gradient.addColorStop(1.0, '#437ab6');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 32);

    const sky = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1000),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.BackSide })
    );
    this.scene.add(sky);
  }

}
export { CreateScene, THREE }