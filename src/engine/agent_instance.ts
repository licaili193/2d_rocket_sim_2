import { Mesh, BufferGeometry, ConeGeometry, SphereGeometry, MeshPhongMaterial, Line, Vector3, LineBasicMaterial } from "three";
import { ActiveAgent, PassiveAgent } from "@/engine/agents";
import { EARTH_COLOR, EARTH_MASS, EARTH_RADUIS, RENDER_DOWNSCALE, PI, MAX_TRACE_NUM, TRACE_SEPARATE_THRESHOLD } from "@/config/config";

export class Earth extends PassiveAgent {
  private sphere: Mesh;

  constructor () {
    super(EARTH_MASS, EARTH_RADUIS);

    this.name = "Earth";

    const geometry = new SphereGeometry(EARTH_RADUIS / RENDER_DOWNSCALE, 32, 32);
    const material = new MeshPhongMaterial({
      color: EARTH_COLOR
    });
    this.sphere = new Mesh(geometry, material);

    this.add(this.sphere);
  }

  cleanUp () {
    this.removeFromParent();
  }
}

export class Rocket extends ActiveAgent {
  private cone: Mesh;
  private sphere: Mesh;

  private visualizationUnit = EARTH_RADUIS / RENDER_DOWNSCALE;

  private tracePoints: Array<Vector3> = [];
  private trace: Line = new Line(
    new BufferGeometry(),
    new LineBasicMaterial({ color: 0xFFFFFF, linewidth: 20 })
  );

  constructor (mass: number, length: number) {
    super(mass, length);

    this.name = "Rocket";

    const geometry = new ConeGeometry(
      this.visualizationUnit / 10,
      this.visualizationUnit / 2,
      6
    );
    const material = new MeshPhongMaterial({
      color: 0xAAAAAA
    });
    this.cone = new Mesh(geometry, material);
    this.cone.translateX(this.visualizationUnit / 4);
    this.cone.rotateZ(-PI / 2);

    const geometry2 = new SphereGeometry(
      this.visualizationUnit / 15,
      6,
      6
    );
    const material2 = new MeshPhongMaterial({
      color: 0xFF0055
    });
    this.sphere = new Mesh(geometry2, material2);
    this.sphere.visible = true;

    this.trace.visible = false;

    this.add(this.cone);
    this.add(this.sphere);
  }

  setActive (active: boolean) {
    this.active = active;
    this.updateAnimation();
  }

  updateAnimation () {
    if (this.active) {
      this.cone.visible = true;
      if (this.thrusting) {
        this.sphere.visible = true;
      } else {
        this.sphere.visible = false;
      }

      if (!this.tracePoints.length) {
        this.tracePoints.push(this.position.clone());
      } else {
        if (
          this.tracePoints[this.tracePoints.length - 1].distanceTo(this.position) >
          TRACE_SEPARATE_THRESHOLD / RENDER_DOWNSCALE
        ) {
          if (this.tracePoints.length > MAX_TRACE_NUM) {
            this.tracePoints.shift();
          }
          this.tracePoints.push(this.position.clone());
        }
      }
    } else {
      this.cone.visible = false;
      this.sphere.visible = false;
    }

    if (this.tracePoints.length > 0) {
      if (!this.trace.parent) {
        this.parent?.add(this.trace);
      }
      this.trace.geometry = new BufferGeometry().setFromPoints(this.tracePoints);
      this.trace.visible = true;
    }
  }

  cleanUp () {
    this.removeFromParent();
    this.trace.removeFromParent();
  }
}
