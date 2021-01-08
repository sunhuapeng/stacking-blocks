// 返回值为两个对象组成的数组，
// 第一个为可以放置的有效区域，
// 第二个为裁切后无效区域，
// 返回空说明没有有效区域 游戏结束

const THREE = require("three");

require("../utils/threebsp.js");

export function cutLead<T>(lead: T, lastLead: T): T[] | undefined[] {
  let meshList: T[] = []
  if (lead && lastLead) {
    const ThreeBSP = (window as any).ThreeBSP
    //生成ThreeBSP对象
    var leadBsp = new ThreeBSP(lead);
    var lastLeadBsp = new ThreeBSP(lastLead);
    // 得到处理后的结果
    // 有效区域
    const intersectResult = handleBsp(leadBsp, lastLeadBsp, 'intersect')
    meshList.push(intersectResult)

    // 无效区域
    const subtractResult = handleBsp(leadBsp, lastLeadBsp, 'subtract')
    meshList.push(subtractResult)

  } else {
    meshList = []
  }
  return meshList
}

function handleBsp(firstBSP: any, secondBSP: any, type: string) {
  // 进行相减计算  前面的减去与后面进行交叉计算
  var mesh
  if (type === 'intersect') {
    mesh = firstBSP.intersect(secondBSP);
  }
  if (type === 'subtract') {
    mesh = firstBSP.subtract(secondBSP);
  }

  // 将裁剪的模块转为object
  var intersectResult = mesh.toMesh();

  //更新模型的面和顶点的数据
  intersectResult.geometry.computeFaceNormals();
  intersectResult.geometry.computeVertexNormals();

  // 判断是否存在顶点信息
  if (intersectResult.geometry.vertices.length > 0) {
    //重新赋值一个纹理
    var material = new THREE.MeshNormalMaterial();
    intersectResult.material = material;
    intersectResult.updateMatrix()
    return intersectResult
  }
}
