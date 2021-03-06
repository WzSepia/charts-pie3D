import * as THREE from "three";
import "./index.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

//后期处理
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

import respond, { data } from "./data";
import helper from "./tool";
let pieDom,
  width,
  height,
  renderer,
  scene,
  group,
  groupLegend,
  point,
  ambient,
  camera,
  composer,
  renderPass,
  glitchPass,
  loader = new FontLoader(),
  font,
  count = 0,
  mouseEvent;
let R = 70;
//光线投射Raycaster
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let INTERSECTED;

async function init(opt) {
  const root = document.body;
  pieDom ? pieDom.remove() : false;
  pieDom = document.createElement("div");
  pieDom.setAttribute("id", opt.id);
  pieDom.style.width = opt.width;
  pieDom.style.height = opt.height;
  root.append(pieDom);
  width = pieDom.clientWidth;
  height = pieDom.clientHeight;
  //渲染
  if (renderer) {
    pieDom.innerHTML = "";
    renderer = null;
    scene = null;
    composer = null;
    renderPass = null;
    glitchPass = null;
    group = null;
    groupLegend = null;
    point = null;
    ambient = null;
    camera = null;
    count = 0;

    // group.children.forEach(item=>{
    //   console.log(item);
    //   item.dispose();
    // });
    // groupLegend.children.forEach((item) => {
    //   item.dispose();
    // });
  }
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.max(window.devicePixelRatio, 4));
  renderer.setClearColor("#111110", 1);
  // document.body.appendChild(renderer.domElement);
  pieDom.appendChild(renderer.domElement);
  //创建场景
  scene = new THREE.Scene();
  //创建组
  group = new THREE.Group();
  groupLegend = new THREE.Group();
  //点光源
  point = new THREE.PointLight(0xffffff);
  point.position.set(-130, 120, 130);
  scene.add(point);
  //环境光
  ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  //相机
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(0, 0, 450);
  camera.lookAt(scene.position);
  //后期处理
  composer = new EffectComposer(renderer);
  renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  glitchPass = new GlitchPass();
  composer.addPass(glitchPass);
  //help-辅助
  helper(opt.help, THREE, scene, camera, point);
}

/**
 * 光线投射用于进行鼠标拾取
 */
function onPointerMove(event) {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.x = (event.clientX / width) * 2 - 1;
  pointer.y = -(event.clientY / height) * 2 + 1;
  mouseEvent = event;
}

/**
 * 画点
 */
function arcPoint(startDeg = 0, angle = Math.PI / 2, data) {
  const arc = new THREE.ArcCurve(0, 0, R, startDeg, angle, false);
  const points = arc.getPoints(50);
  points.forEach((item) => {
    item.z = item.x;
    item.x = item.y;
    item.y = 0;
  });
  arcPath(points, data);
  const len = points.length;
  let point = points[Math.ceil(len / 2)];
  //画线
  labelLine(point, data);
}

/**
 * 获取路径,添加图形
 * */
function arcPath(points, data) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(-200 * data.zb, 0);
  shape.lineTo(-200 * data.zb, 25);
  shape.lineTo(0, 25);
  shape.lineTo(0, 0);
  // const bezierPath = new THREE.QuadraticBezierCurve3(...points);
  const curvePath = new THREE.CatmullRomCurve3(points);
  const material = new THREE.MeshLambertMaterial({
    color: data.color,
    opacity: 1, //0.9
    transparent: true,
    // wireframe:true
  });
  const geometry = new THREE.ExtrudeBufferGeometry(shape, {
    bevelEnabled: false,
    steps: 80,
    // depth: 120,
    // extrudePath: bezierPath
    extrudePath: curvePath,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.data = data;
  mesh.name = "pie" + data.name;
  mesh.matrixAutoUpdate = true;
  // scene.add(mesh);
  group.add(mesh);
}

/**
 * 画线 : lanbelLine
 * startPoint:开始点
 */
function labelLine(point, data) {
  let startPoint, endPoint;
  startPoint = new THREE.Vector3(point.x * 0.8, point.y, point.z * 0.8);
  if ((point.x > 0 && point.z > 0) || (point.x < 0 && point.z > 0)) {
    endPoint = new THREE.Vector3(
      point.x,
      point.y - (150 * data.zb + 25),
      point.z
    );
  } else {
    endPoint = new THREE.Vector3(
      point.x,
      point.y + 200 * data.zb + 25,
      point.z
    );
  }
  // const geometry = new THREE.BufferGeometry();
  // const material = new THREE.LineBasicMaterial({
  //   color: data.color,
  //   linewidth: 30,
  //   linecap: "round",
  //   linejoin: "round",
  // });
  const linePath = new THREE.LineCurve3(startPoint, endPoint);
  const geometry = new THREE.TubeGeometry(
    linePath, //path — Curve - 一个由基类Curve继承而来的3D路径。 Default is a quadratic bezier curve.
    100, //tubularSegments — Integer - 组成这一管道的分段数，默认值为64。
    0.15, //radius — Float - 管道的半径，默认值为1。
    80, //radialSegments — Integer - 管道横截面的分段数目，默认值为8。
    true //closed — Boolean 管道的两端是否闭合，默认值为false。
  );
  const material = new THREE.MeshPhongMaterial({
    color: data.color,
    opacity: 1, //0.9
    transparent: true,
  });
  // geometry.setFromPoints([startPoint, endPoint]);
  const line = new THREE.Line(geometry, material);
  line.name = "line" + data.name;
  line.data = data;
  line.matrixAutoUpdate = true;
  // scene.add(line);
  group.add(line);
  //
  labelText(endPoint, data);
}

/**
 * 文字
 * lanbel
 */
function labelText(endPoint, data) {
  const fontLen = data.name ? data.name.length : 0;
  const fontSize = data.style.fontSize ? data.style.fontSize : 8;
  const textLen = fontSize * fontLen;
  const x = endPoint.x - textLen / 2;
  const y =
    endPoint.y < 0
      ? endPoint.y - (fontSize * 3) / 2
      : endPoint.y + fontSize / 2;
  const textGeo = new TextGeometry(data.name, {
    font: font, //THREE.Font的实例。
    size: fontSize, //Float。字体大小，默认值为100。
    height: 0.1, //挤出文本的厚度。默认值为50。
    curveSegments: 1, //Integer.(表示文本的）曲线上点的数量。默认值为12。
    bevelEnabled: false, //Boolean.是否开启斜角，默认为false。
    bevelThickness: 0, //Float。文本上斜角的深度，默认值为20。
    bevelSize: 0, //Float。斜角与原始文本轮廓之间的延伸距离。默认值为8。
    bevelSegments: 1, //Integer。斜角的分段数。默认值为3。
  });
  const material = new THREE.MeshPhongMaterial({
    color: data.color,
    transparent: true,
  });
  const mesh = new THREE.Mesh(textGeo, material);
  mesh.name = "label" + data.name;
  mesh.data = data;
  mesh.matrixAutoUpdate = true;
  mesh.position.set(x, y, endPoint.z);
  mesh.rotateX(Math.PI / -18);
  // scene.add(mesh);
  group.add(mesh);
  legend(data);
}

/**
 * 画图例
 */
function legend(data) {
  const geometry = new THREE.BoxGeometry(8, 8, 0.01);
  const textGeo = new TextGeometry(data.name, {
    font: font, //THREE.Font的实例。
    size: data.style.fontSize ? data.style.fontSize : 8, //Float。字体大小，默认值为100。
    height: 1, //挤出文本的厚度。默认值为50。
    curveSegments: 20, //Integer.(表示文本的）曲线上点的数量。默认值为12。
    bevelEnabled: false, //Boolean.是否开启斜角，默认为false。
    bevelThickness: 0, //Float。文本上斜角的深度，默认值为20。
    bevelSize: 0, //Float。斜角与原始文本轮廓之间的延伸距离。默认值为8。
    bevelSegments: 1, //Integer。斜角的分段数。默认值为3。
  });
  const material_legend = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
  });
  const material_pic = new THREE.MeshPhongMaterial({
    color: data.color,
    transparent: true,
  });
  const legend = new THREE.Mesh(textGeo, material_legend);
  const mesh = new THREE.Mesh(geometry, material_pic);
  legend.name = "legend" + data.name;
  legend.data = data;
  legend.matrixAutoUpdate = true;
  mesh.name = "legend_pic" + data.name;
  mesh.data = data;
  mesh.matrixAutoUpdate = true;
  legend.position.set(110, 100 + -20 * count, 0);
  mesh.position.set(100, 103.2 + -20 * count, 0);
  groupLegend.add(legend);
  groupLegend.add(mesh);
  count++;
}

//tip
function tip(data) {
  const dom = document.querySelector("#pieTip");
  const root = document.querySelector("#pie");
  if (dom) dom.remove();
  if (!data || !mouseEvent) return;
  const x = mouseEvent.clientX;
  const y = mouseEvent.clientY;
  const box = document.createElement("div");
  box.setAttribute("id", "pieTip");
  box.style.position = "absolute";
  box.style.left = x + 10 + "px";
  box.style.top = y - 20 + "px";
  box.style.zIndex = "999";
  const el = `
            <p>${data.name}</p>
            <p>${data.value}</p>`;
  box.innerHTML = el;
  root.append(box);
}

//图例与图形联动
function legend_pie(data) {
  const name = data.name;
  group.children.forEach((item) => {
    if (item.name.includes(name)) {
      if (!item.currentColor) {
        item.currentColor = data.color;
        item.material.emissive.setHex(0xffffff);
        item.material.opacity = 0.2;
      } else {
        item.material.emissive.setHex(item.currentColor);
        item.material.opacity = 1;
        item.updateMatrix();
        item.currentColor = null;
      }
      item.updateMatrix();
      console.log("item", item);
    }
  });
}

/**
 * 渲染
 */
function render() {
  // 通过摄像机和鼠标位置更新射线
  // group.rotateY(0.01);
  raycaster.setFromCamera(pointer, camera);
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    //去掉了图例部分鼠标样式
    if (intersects[0].object.name.includes("legend")) {
      INTERSECTED = intersects[0].object;
      return;
    }
    if (
      intersects[0].object.name.includes("legend_pic") ||
      intersects[0].object.name.includes("line") ||
      intersects[0].object.name.includes("label")
    ) {
      return;
    }
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) {
        INTERSECTED.material.emissive
          ? INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
          : false;
      }
      INTERSECTED = intersects[0].object;
      tip(INTERSECTED.data);
      INTERSECTED.currentHex = INTERSECTED.material.emissive
        ? INTERSECTED.material.emissive.getHex()
        : false;
      INTERSECTED.material.emissive
        ? INTERSECTED.material.emissive.setHex(0xff0000)
        : false;
    } else {
      tip(INTERSECTED.data);
    }
  } else {
    tip(null);
    if (INTERSECTED) {
      INTERSECTED.material.emissive
        ? INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
        : false;
    }
    INTERSECTED = null;
  }
  renderer.render(scene, camera);
  // composer.render();
}

//画3D饼图，环图
async function circlePie(res) {
  const data = res.data;
  const num = res.num;
  const total = res.total;
  let startDeg = 0;
  for (let i = 0; i < num; i++) {
    data[i].color = data[i].color ? data[i].color : colorRandom();
    const zb = data[i].value / total;
    let angle = 2 * Math.PI * zb;
    data[i].zb = zb;
    if (i == 0) {
      arcPoint(0, angle, data[i]);
      startDeg = angle;
    } else {
      arcPoint(startDeg, startDeg + angle, data[i]);
      startDeg = startDeg + angle;
    }
  }
}

//自适应
function onWindowResize() {
  width = pieDom.clientWidth;
  height = pieDom.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  render();
}

//点击事件
async function click() {
  if (!opts.callback) {
    return;
  }
  if (INTERSECTED) {
    const childrens = group.children;
    if (INTERSECTED.name.includes("pie")) {
      opts.callback(INTERSECTED.data);
    }
    if (INTERSECTED.name.includes("label")) {
      console.log(INTERSECTED.data);
    }
    if (INTERSECTED.name.includes("legend")) {
      legend_pie(INTERSECTED.data);
    }
  }
}

//动画
async function animate() {
  requestAnimationFrame(animate);
  render();
}

//随机色
function colorRandom() {
  const r = (Math.random() * 255).toFixed(0);
  const g = (Math.random() * 255).toFixed(0);
  const b = (Math.random() * 255).toFixed(0);
  const rgb = r + "," + g + "," + b;
  return "rgb(" + rgb + ")";
}

//渲染
function renderPie3D(opt) {
  init(opt).then(() => {
    loader.load("./fonts/Arial Unicode MS_Regular.json", function (resFont) {
      font = resFont;
      //鼠标控制器
      let controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
      controls.addEventListener("change", render);
      //绘制
      circlePie(opt.data).then(() => {
        group.translateX(-100);
        group.translateY(-25);
        group.rotateX(Math.PI / 9);
        scene.add(group);
        scene.add(groupLegend);

        window.scene = scene;
        window.renderer = renderer;
      });
      //动态渲染,监听鼠标(光影)
      animate();
      pieDom.addEventListener("mousemove", onPointerMove);
      pieDom.addEventListener("click", click);
      window.addEventListener("resize", onWindowResize);
    });
  });
}

//检测
window.initPie3D = function (params) {
  if (!params.id) {
    console.warn("检测到无效的图形id");
    return;
  }
  if (!params.data.data || !params.data.data.length) {
    console.warn("检测到无可绘制的数据");
    return;
  }
  renderPie3D(params);
  window.opts3D = params;
};

/**
 * 配置
 * @param id:容器id(保证唯一)
 * @param data:图形数据
 * @param help:辅助线 false:不启用;true:启用
 * */
const opts = {
  id: "pie",
  data: respond,
  width: "100%",
  height: "100%", //window.innerHeight,
  callback: function (params = {}) {
    console.log("绑定点击事件,事件联动", params);
  },
  help: false,
};

//执行
initPie3D(opts);
