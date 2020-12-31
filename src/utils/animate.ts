const TWEEN = require("@tweenjs/tween.js");

export class Animate {
  tween
  constructor(mesh: THREE.Object3D, e: THREE.Vector3, t: number) {
    this.tween = new TWEEN.Tween(mesh.position)
    this.tween.to(e, t)
    this.tween.start()
  }
}
export function NumberAnimate(s: number, e: number, t: number) {
  const tween = new TWEEN.Tween({ p: s })
  .to({ p: e }, t)
  .delay(500)
  .start()
  return tween
}
