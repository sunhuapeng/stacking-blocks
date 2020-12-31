// 引用初始化场景类
import { CreateScene, THREE } from '../createScene/index'
import { CreateGame } from '../playGame/initGame'

// 初始化场景
const _this = new CreateScene()

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
_this.controls.addEventListener("change", () => {
  // console.log(_this.camera.zoom)
})


