var QRCode = require('qrcode')
// 引用初始化场景类
import "babel-polyfill"

import { CreateScene, THREE } from '../createScene/index'
import { CreateGame } from '../playGame/initGame'

// 初始化场景
const _this = new CreateScene()

// 开始游戏部分
const createGame = new CreateGame(_this)

const mark: HTMLElement = document.querySelector('#mark')
const startBtn: HTMLElement = document.querySelector('#start-game')
console.log(mark, startBtn)
if (mark && startBtn) {
 startBtn.onclick = function () {
   mark.style.display = 'none'
   // 缩放镜头
   createGame.restart()
 }
}

// 生成二维码
var canvas = document.getElementById('qr-code')
console.log(window.location.href)
QRCode.toCanvas(canvas, window.location.href, {
  width: 80,
  height: 80
}, function (error) {
  if (error) console.error(error)
  console.log('success!');
})

// _this.controls.addEventListener("change", () => {
//   console.log(_this.camera.zoom)
// })


