import * as THREE from "three";
import "./index.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import respond from './data';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#333333', 1);
document.body.appendChild(renderer.domElement);

//创建场景
const scene = new THREE.Scene();

//点光源
const point = new THREE.PointLight(0xffffff);
point.position.set(400, 200, 300);
scene.add(point);
//环境光
const ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);

//相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
camera.position.set(300, 300, 200);
camera.lookAt(scene.position);

/**
 * 画面
 * 拉伸
*/
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(50, 0);
shape.lineTo(50, 50);
shape.lineTo(0, 50);
shape.lineTo(0, 0);

//线 => 路径
const R = 100;
let group = new THREE.Group();

//光线投射Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let INTERSECTED;

/**
 * 光线投射用于进行鼠标拾取
*/
function onPointerMove(event) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

/**
 * 画点 
*/
function arcPoint(startDeg = 0, angle = Math.PI / 2) {
    const arc = new THREE.ArcCurve(0, 0, R, startDeg, angle, false)
    const points = arc.getPoints(50);
    points.forEach(item => {
        item.z = item.x;
        item.x = item.y;
        item.y = 0;
    })
    arcPath(shape, points);
    const len = points.length;
    let point = points[Math.ceil(len / 2)];
    // point.x = point.x<0?point.x+25:point.x-25;
    // point.z = point.z<0?point.z+25:point.z-25;
    //画线
    labelLine(point);
}

//获取路径
function arcPath(shape, points, name) {
    // const bezierPath = new THREE.QuadraticBezierCurve3(...points);
    const curvePath = new THREE.CatmullRomCurve3(points);
    const material = new THREE.MeshLambertMaterial({
        color: colorRandom(),
        opacity: 1,
        transparent: true,
        // wireframe:true,
    })
    const geometry = new THREE.ExtrudeBufferGeometry(shape, {
        bevelEnabled: false,
        steps: 50,
        depth: 120,
        // extrudePath: bezierPath
        extrudePath: curvePath
    })
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    scene.add(mesh);
}
//画3D饼图，环图
function circlePie(res) {
    const data = res.data;
    const num = res.num;
    const total = res.total;
    let startDeg = 0;
    for (let i = 0; i < num; i++) {
        let angle = 2 * Math.PI * (data[i].value / total);
        if (i == 0) {
            arcPoint(0, angle, data[i]);
            startDeg = angle;
        } else {
            arcPoint(startDeg, startDeg + angle);
            startDeg = startDeg + angle;
        }
    }
}


/**
 * 画线 : lanbelLine
 * startPoint:开始点
*/
function labelLine(startPoint) {
    const endPoint = new THREE.Vector3(startPoint.x, startPoint.y + 50, startPoint.z);
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial();
    geometry.setFromPoints([startPoint, endPoint]);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    //
    labelText(endPoint);
}

/**
 * 文字
 * lanbel
*/
const loader = new FontLoader();
function labelText(endPoint) {
    console.log(endPoint);
    let font;
    loader.load("../node_modules/three/examples/fonts/helvetiker_regular.typeface.json", function (response) {
        font = response;
        refreshText();
    });
    const textGeo = new TextGeometry( 'asd', {
        font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelSegments: 5
    });
    const material = new THREE.MeshPhongMaterial({color:'#f00'})
}

function render(animation) {
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children, false);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
                INTERSECTED.material.emissive ? INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex) : false;
            }
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive ? INTERSECTED.material.emissive.getHex() : false;
            INTERSECTED.material.emissive ? INTERSECTED.material.emissive.setHex(0xff0000) : false;
        }
    } else {
        if (INTERSECTED) {
            INTERSECTED.material.emissive ? INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex) : false;
        }
        INTERSECTED = null;
    }
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function colorRandom() {
    const r = (Math.random() * 255).toFixed(0);
    const g = (Math.random() * 255).toFixed(0);
    const b = (Math.random() * 255).toFixed(0);
    const rgb = r + ',' + g + ',' + b;
    return 'rgb(' + rgb + ')';
}

let controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
controls.addEventListener("change", render);

circlePie(respond);
animate();
window.addEventListener("mousemove", onPointerMove);
