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

  private visualizationUnit = EARTH_RADUIS / RENDER_DOWNSCALE;

  constructor (mass: number, length: number) {
    super(mass, length);

    this.name = "Rocket";

    const geometry = new ConeGeometry(
      this.visualizationUnit / 10,
      this.visualizationUnit / 2,
      32
    );
    const material = new MeshPhongMaterial({
      color: 0xAAAAAA
    });
    this.cone = new Mesh(geometry, material);
    this.cone.translateX(this.visualizationUnit / 20);
    this.cone.rotateZ(-PI / 2);

    this.add(this.cone);
  }

  setActive (active: boolean) {
    this.active = active;
    if (this.active) {
      this.cone.visible = true;
    } else {
      this.cone.visible = false;
    }
  }
}
