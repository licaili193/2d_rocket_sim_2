<template>
  <div>
    <div ref="viewport" class="canvas"></div>
    <div class="screen-quad">
      <hr style="width: 100px">
      {{ruler}} km
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { AmbientLight, Camera, Clock, Object3D, OrthographicCamera, PointLight, Renderer, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Engine from "@/engine/engine";
import { MAX_SIM_STEP, RENDER_DOWNSCALE, EARTH_RADUIS } from "@/config/config";

import { EventBus } from "@/store/index";

@Component
export default class Canvas extends Vue {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private controls: OrbitControls;

  private viewSize = 100;
  private width = 0;
  private height = 0;
  private aspectRatio = 1;

  private clock: Clock = new Clock(true);
  private time: Date = new Date();

  ruler = 100;

  constructor () {
    super();

    this.scene = new Scene();
    this.camera = new OrthographicCamera(this.viewSize / -2, this.viewSize / 2, this.viewSize / 2, this.viewSize / -2, -100, 100);
    this.camera.position.z = 90;
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.minZoom = 0.1;
    this.controls.maxZoom = 150;
  }

  mounted () {
    EventBus.$on("addObject", this.onAddObject);
    window.addEventListener("resize", this.onResize);

    (this.$refs.viewport as Element).replaceChildren(this.renderer.domElement);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const light = new PointLight(0xffffff, 1, 100);
    light.position.set(-20, -20, 50);
    this.scene.add(light);

    this.onResize();

    this.animate();
  }

  unmounted () {
    window.removeEventListener("resize", this.onResize);
    EventBus.$off("addObject");
  }

  private onAddObject (object: Object3D) {
    this.scene.add(object);
  }

  private onResize () {
    this.width = (this.$refs.viewport as Element).clientWidth;
    this.height = (this.$refs.viewport as Element).clientHeight;
    this.aspectRatio = this.width / this.height;

    this.renderer.setSize(this.width, this.height);

    (this.camera as OrthographicCamera).left = this.aspectRatio * this.viewSize / -2;
    (this.camera as OrthographicCamera).right = this.aspectRatio * this.viewSize / 2;
    (this.camera as OrthographicCamera).top = this.viewSize / 2;
    (this.camera as OrthographicCamera).bottom = this.viewSize / -2;
    (this.camera as OrthographicCamera).updateProjectionMatrix();
  }

  private animate () {
    const timeBegin = this.time.getMilliseconds();

    const delta = this.clock.getDelta();
    this.controls.update();

    const inverseZoomLevel = 1 / (this.camera as OrthographicCamera).zoom;
    this.ruler = Math.ceil(RENDER_DOWNSCALE / 100 * inverseZoomLevel * 1.14285714);

    for (const agent of this.$store.state.activeAgents) {
      agent.scale.x = inverseZoomLevel;
      agent.scale.y = inverseZoomLevel;
      agent.scale.z = inverseZoomLevel;
    }

    const steps = Math.ceil(delta * this.$store.state.simulatingMultiplier / MAX_SIM_STEP);
    if (this.$store.state.simulating && !this.$store.state.simulationPaused) {
      Engine.update(this.$store.state.simulationStep, steps);
      this.$store.state.simulationStep += steps;
      this.$store.state.simulationTime = this.$store.state.simulationStep * MAX_SIM_STEP;
    }

    this.renderer.render(this.scene, this.camera);

    const timeAfter = this.time.getMilliseconds();

    let timeGap = 1000 / 60 - (timeAfter - timeBegin);
    if (timeGap < 1) {
      timeGap = 1;
    }
    setTimeout(() => {
      requestAnimationFrame(this.animate.bind(this));
    }, timeGap);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.canvas {
  height: calc(100vh - 60px);
  width: 100%;
  margin: 0;
}

.screen-quad {
  display: block;
  position: absolute;
  top: 120px;
  left: 40px;
  color: white;
}
</style>
