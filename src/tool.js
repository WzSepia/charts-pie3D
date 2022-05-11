export default function help(help, THREE, scene, camera, point) {
  if (!help) return;
  const cameraHelp = new THREE.CameraHelper(camera);
  scene.add(cameraHelp);
  /*
    AxesHelper( size : Number )
    size -- (可选的) 表示代表轴的线段长度. 默认为 1.
  */
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);
  /*
    Box3Helper( box : Box3, color : Color )
    box -- 被模拟的3维包围盒.
    color -- (可选的) 线框盒子的颜色. 默认为 0xffff00.
  */
  const box = new THREE.Box3();
  box.setFromCenterAndSize(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(200, 100, 300)
  );
  const boxHelper = new THREE.Box3Helper(box, 0xffff00);
  scene.add(boxHelper);
  /*
    PointLightHelper( light : PointLight, sphereSize : Float, color : Hex )
    light -- 要模拟的光源.
    sphereSize -- (可选的) 球形辅助对象的尺寸. 默认为 1.
    color -- (可选的) 如果没有赋值辅助对象将使用光源的颜色.
  */
  const sphereSize = 10;
  const pointLightHelper = new THREE.PointLightHelper(point, sphereSize);
  scene.add(pointLightHelper);
  /*
    GridHelper( size : number, divisions : Number, colorCenterLine : Color, colorGrid : Color )
    size -- 坐标格尺寸. 默认为 10.
    divisions -- 坐标格细分次数. 默认为 10.
    colorCenterLine -- 中线颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x444444
    colorGrid -- 坐标格网格线颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x888888
  */
  const gridHelper = new THREE.GridHelper(300, 30);
  scene.add(gridHelper);
  /*
    PolarGridHelper( radius : Number, radials : Number, circles : Number, divisions : Number, color1 : Color, color2 : Color )
    radius -- 极坐标格半径. 可以为任何正数. 默认为 10.
    radials -- 径向辐射线数量. 可以为任何正整数. 默认为 16.
    circles -- 圆圈的数量. 可以为任何正整数. 默认为 8.
    divisions -- 圆圈细分段数. 可以为任何大于或等于3的正整数. 默认为 64.
    color1 -- 极坐标格使用的第一个颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x444444
    color2 -- 极坐标格使用的第二个颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x888888
  */
  const radius = 100;
  const radials = 160;
  const circles = 8;
  const divisions = 64;
  const helper = new THREE.PolarGridHelper(radius, radials, circles, divisions);
  scene.add(helper);
}
