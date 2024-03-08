<template>
    <!-- 3D模型的容器div -->
    <div id="three-dom" ref="screenDom"></div>
    <div class="absolute z-10 top-0 flex flex-col left-0 ">
        <!-- 添加按钮 -->
        <button class="bg-white p-2 m-2 border-indigo-500 border text-left "  @click="changeColor('Obj3d66-1745322-5-631_2', 0)">改变拨片颜色</button>
        <button class="bg-white p-2 m-2 border-indigo-500 border text-left"  @click="changeColor('Obj3d66-1745322-5-631_1', 1)">改变外壳颜色</button>
        <button class="bg-white p-2 m-2 border-indigo-500 border text-left"  @click="changeColor('Obj3d66-1745322-5-631_3', 2)">改变齿轮颜色</button>
        <button class="bg-white p-2 m-2 border-indigo-500 border text-left"  @click="changeColor('Obj3d66-1745322-5-631_4', 3)">改变机器轴颜色</button>
        <button class="bg-white p-2 m-2 border-indigo-500 border text-left"  @click="changeColor('Obj3d66-1745322-5-631_5', 4)">改变线材颜色</button>
        <button class="bg-white p-2 m-2 border-indigo-500 border text-left"   @click="changeColor('Obj3d66-1745322-5-631', 6)">改变电机颜色</button>
    
    </div>

</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { onMounted, onUnmounted, ref } from 'vue';

// 容器div的ref
const screenDom = ref(null)
const scene = new THREE.Scene()

// 声明相机、渲染器、控制器和模型变量
let camera, renderer, controls, model;
// 声明模型子部分的网格对象
let Mesh1, Mesh2, Mesh3, Mesh4, Mesh5, Mesh6, Mesh7;
// 声明一个数组来保存每个网格对象的原始颜色
const originalColors = [];
// 声明一个标志变量数组,记录每个网格对象的颜色状态
const isRed = [false, false, false, false, false, false, false];
// 声明鼠标位置向量
const mouse = new THREE.Vector2();
// 声明射线投射器
const raycaster = new THREE.Raycaster();


// 初始化函数
const init = () => {
    // 创建透视相机
    camera = new THREE.PerspectiveCamera(45, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.25, 20)
    camera.position.set(-1.8, 0.6, 2.7);
    // 打开assets文件的textures
    
    // 加载环境纹理
    new RGBELoader().setPath("/textures/").load("royal_esplanade_1k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
        renderer.render(scene, camera)
        
        // 加载3D模型
        const loader = new GLTFLoader().setPath("/glTF/");
        loader.load("jiqibi.gltf", (gltf) => {
            // 保存模型引用
            model = gltf.scene.children[0];
            scene.add(model)
            renderer.render(scene, camera)
            
            // 获取子部分的网格对象,并保存原始颜色
            Mesh1 = model.getObjectByName('Obj3d66-1745322-5-631_2');
            originalColors.push(Mesh1.material.color.clone());
            Mesh2 = model.getObjectByName('Obj3d66-1745322-5-631_1');
            originalColors.push(Mesh2.material.color.clone());
            Mesh3 = model.getObjectByName('Obj3d66-1745322-5-631_3');
            originalColors.push(Mesh3.material.color.clone());
            Mesh4 = model.getObjectByName('Obj3d66-1745322-5-631_4');
            originalColors.push(Mesh4.material.color.clone());
            Mesh5 = model.getObjectByName('Obj3d66-1745322-5-631_5');
            originalColors.push(Mesh5.material.color.clone());
            Mesh6 = model.getObjectByName('Obj3d66-1745322-5-631_6');
            originalColors.push(Mesh6.material.color.clone());
            Mesh7 = model.getObjectByName('Obj3d66-1745322-5-631');
            originalColors.push(Mesh7.material.color.clone());
        })
    })

    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    screenDom.value.appendChild(renderer.domElement)
    
    // 添加轨道控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => {
        renderer.render(scene, camera)
    })
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -0.2);
    controls.update();
    
    // 添加鼠标移动事件监听
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    // 添加点击事件监听
    renderer.domElement.addEventListener('click', raycast);
}

// 鼠标移动事件处理函数
const onMouseMove = (event) => {
    // 计算鼠标位置在渲染区域的归一化坐标
    mouse.x = (event.clientX / screenDom.value.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / screenDom.value.clientHeight) * 2 + 1;
}

// 射线投射函数
const raycast = () => {
    // 更新射线投射器的投射线
    raycaster.setFromCamera(mouse, camera);
    // 计算射线与场景中物体的相交
    const intersects = raycaster.intersectObjects([Mesh1, Mesh2, Mesh3, Mesh4, Mesh5, Mesh6, Mesh7], true);
    if (intersects.length > 0) {
        // 获取相交的物体
        const object = intersects[0].object;
        // 改变物体材质的颜色
        object.material.color.set(0xff0000); // 红色
    }
}

// 改变颜色的函数
const changeColor = (name, index) => {
    let mesh;
    switch (name) {
        case 'Obj3d66-1745322-5-631_2':
            mesh = Mesh1;
            break;
        case 'Obj3d66-1745322-5-631_1':
            mesh = Mesh2;
            break;
        case 'Obj3d66-1745322-5-631_3':
            mesh = Mesh3;
            break;
        case 'Obj3d66-1745322-5-631_4':
            mesh = Mesh4;
            break;
        case 'Obj3d66-1745322-5-631_5':
            mesh = Mesh5;
            break;
        case 'Obj3d66-1745322-5-631_6':
            mesh = Mesh6;
            break;
        case 'Obj3d66-1745322-5-631':
            mesh = Mesh7;
            break;
        default:
            break;
    }
    if (mesh) {
        // 根据当前颜色状态,切换颜色
        if (isRed[index]) {
            mesh.material.color.copy(originalColors[index]);
            isRed[index] = false;
        } else {
            mesh.material.color.set(0xff0000);
            isRed[index] = true;
        }
        renderer.render(scene, camera);
    }
}

// 窗口尺寸变化时重新初始化
const handleResize = () => {
    camera.aspect = screenDom.value.clientWidth / screenDom.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight);
}

onMounted(() => {
    init();
    // 添加窗口尺寸变化监听器
    window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
    // 移除窗口尺寸变化监听器
    window.removeEventListener('resize', handleResize);
})
</script>

<style>
#three-dom {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
