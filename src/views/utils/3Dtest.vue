<template>
  <div id="container"></div>
</template>

<script>
import * as Three from "three"; //引入Threejs
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
export default {
  // name: "3Dtest",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    };
  },
  methods: {
    // 初始化场景
    init() {
      const container = document.getElementById('container')
      this.camera = new Three.PerspectiveCamera(90, container.clientWidth / container.clientHeight, 0.1, 10000)
      this.renderer = new Three.WebGLRenderer({ antialias: true })

      this.camera.position.set(200, 300, 300)

      this.scene = new Three.Scene()

      this.renderer.setClearColor(new Three.Color(0xffffff))
      // this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.shadowMap.enabled = true

      container.appendChild(this.renderer.domElement)

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.target = new Three.Vector3(0, 0, 300)

      this.loadLight()
      this.loadGltf()
    },

    // 加载模型
    loadGltf() {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      dracoLoader.preload()
      loader.setDRACOLoader(dracoLoader)

      loader.load('/model/bridge.glb', (gltf) => {
        this.scene.add(gltf.scene)
        this.scene.position.y=200
        this.renderer.render(this.scene, this.camera)
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      }, (error) => {
        console.error(error)
      })


      loader.load('/model/map.glb', (gltf) => {
        this.scene.add(gltf.scene)
        this.renderer.render(this.scene, this.camera)
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      }, (error) => {
        console.error(error)
      })
    },
    loadLight() {
      // 点光源
      // const point = new Three.PointLight(0xffffff)
      // point.position.set(4000, 4000, 4000) // 点光源位置
      // this.scene.add(point) // 点光源添加到场景中
      // 环境光
      const ambient = new Three.AmbientLight(0xFFFFFF)
      this.scene.add(ambient)
    },
    // 动画效果
    animate() {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    }
  },
  mounted() {
    this.init();
    this.animate();
  },
}

</script>


<style scoped>
#container {
  width: 100%;
  margin: 0;
  height: 700px;
  overflow: hidden;
}
</style>