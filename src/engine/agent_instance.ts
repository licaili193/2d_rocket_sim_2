import { Mesh, ConeGeometry, SphereGeometry, MeshPhongMaterial } from "three";

import { ActiveAgent, PassiveAgent } from "@/engine/agents";
import { EARTH_COLOR, EARTH_MASS, EARTH_RADUIS, RENDER_DOWNSCALE, PI } from "@/config/config";

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
}

export class Rocket extends ActiveAgent {
  private cone: Mesh;
  private sphere: Mesh;

  private visualizationUnit = EARTH_RADUIS / RENDER_DOWNSCALE;

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
    } else {
      this.cone.visible = false;
      this.sphere.visible = false;
    }
  }
}
