import { Vector2, Vector3, Object3D } from "three";
import { G, RENDER_DOWNSCALE, THRUST_THRESHOLD, PI } from "@/config/config";
import { ActiveAgentAction, Profile } from "@/engine/utils";

import store from "@/store/index";

export class ActiveAgent extends Object3D {
  mass = 1;
  minMass: number | undefined = undefined;
  massDeclineRate: number | undefined = undefined;

  simPosition: Vector2 = new Vector2(0, 0);
  simOrientation: { value: number } = { value: 0 };
  simVelocity: Vector2 = new Vector2(0, 0);
  simOmega: { value: number } = { value: 0 };

  timeOffset = 0;
  protected active = false;

  length = 1;
  momentOfInertia = 1;
  thrusting = false;
  currentThrust = 0;

  thrustProfile: Profile = new Profile();
  gimbalProfile: Profile = new Profile();

  actions: Array<ActiveAgentAction> = [];

  constructor (mass: number, length: number) {
    super();

    this.length = length;
    this.mass = mass;
    this.momentOfInertia = this.mass * this.length * this.length / 12;
  }

  syncPosition (): void {
    this.position.x = this.simPosition.x / RENDER_DOWNSCALE;
    this.position.y = this.simPosition.y / RENDER_DOWNSCALE;

    while (this.simOrientation.value > PI) {
      this.simOrientation.value -= 2 * PI;
    }
    while (this.simOrientation.value < -PI) {
      this.simOrientation.value += 2 * PI;
    }
    this.rotation.z = this.simOrientation.value;
  }

  setPosition (position: Vector2) {
    this.simPosition = position;
    this.syncPosition();
  }

  setOrientation (theta: number) {
    this.simOrientation.value = theta;
    this.syncPosition();
  }

  setActive (active: boolean) {
    this.active = active;
  }

  getActive () {
    return this.active;
  }

  // Update mass based on thrust and return the acceleration vector and the angular
  // acceleration from the thrust
  update (currentTime: number, deltaTime: number): [Vector2, number] {
    const offsetTime = currentTime - this.timeOffset;
    const gimbalAngle = this.gimbalProfile.seekForward(offsetTime);
    let thrust = this.thrustProfile.seekForward(offsetTime);
    this.currentThrust = thrust;
    if (thrust < 0) {
      thrust = 0;
    }

    if (thrust > THRUST_THRESHOLD) {
      this.thrusting = true;

      if (this.minMass !== undefined &&
          this.massDeclineRate !== undefined &&
          this.mass > this.minMass) {
        this.mass -= deltaTime * this.massDeclineRate;
        this.momentOfInertia = this.mass * this.length * this.length / 12;
      }
    } else {
      this.thrusting = false;
    }

    const thrustAngle = this.simOrientation.value + gimbalAngle;
    const thrustVector = (new Vector2(Math.cos(thrustAngle), Math.sin(thrustAngle))).multiplyScalar(thrust);

    const torque = this.length / 2 * Math.sin(gimbalAngle) * thrustVector.length();

    for (const passive of store.state.passiveAgents) {
      if (passive.inside(this.simPosition)) {
        this.setActive(false);
        return [new Vector2(), 0];
      }
    }

    while (this.actions.length > 0) {
      const action = this.actions[0];
      if (offsetTime > action.time) {
        this.actions.shift();

        for (const uuid of action.spawnAgents) {
          const newAgent = store.state.activeAgents.find(item => item.uuid === uuid);
          if (newAgent) {
            newAgent.simPosition = this.simPosition.clone();
            newAgent.simOrientation.value = this.simOrientation.value;
            newAgent.simVelocity = this.simVelocity.clone();
            newAgent.simOmega.value = this.simOmega.value;
            newAgent.syncPosition();
            newAgent.timeOffset = currentTime;
            newAgent.setActive(true);
          }
        }

        if (action.disableParent) {
          this.setActive(false);
        }
      } else {
        break;
      }
    }

    return [thrustVector.divideScalar(this.mass), torque / this.momentOfInertia];
  }

  updateAnimation () {
    // Override in child classes
  }

  cleanUp () {
    // Override in child classes
  }

  // Note: this method cannot load actions
  loadFromJSON (json: any) {
    this.mass = json.mass ?? 1;
    this.minMass = json.minMass;
    this.massDeclineRate = json.massDeclineRate;
    this.length = json.length ?? 1;
    this.momentOfInertia = this.mass * this.length * this.length / 12;
    if (json.initialPosition) {
      this.simPosition = new Vector2(json.initialPosition.x, json.initialPosition.y);
    }
    if (json.initialOrientation) {
      this.simOrientation.value = json.initialOrientation;
    }
    if (json.initialVelocity) {
      this.simVelocity = new Vector2(json.initialVelocity.x, json.initialVelocity.y);
    }
    if (json.initialOmega) {
      this.simOmega.value = json.initialOmega;
    }
    this.syncPosition();
    if (json.thrustProfile) {
      for (const { time, thrust } of json.thrustProfile) {
        this.thrustProfile.addPoint(time, thrust);
      }
    }
    if (json.gimbalProfile) {
      for (const { time, angle } of json.gimbalProfile) {
        this.gimbalProfile.addPoint(time, angle);
      }
    }
    this.active = json.initialActive === true;
    this.name = json.name ?? "";
  }
}

export class PassiveAgent extends Object3D {
  mass = 1;
  radius = 1;

  simPosition: Vector2 = new Vector2(0, 0);

  private massGDiv6: number;
  private collisionShrinkFactor = 10000;

  constructor (mass: number, radius: number) {
    super();

    this.mass = mass;
    this.radius = radius;

    this.massGDiv6 = mass / 1e6 * G;
  }

  syncPosition (): void {
    this.position.x = this.simPosition.x / RENDER_DOWNSCALE;
    this.position.y = this.simPosition.y / RENDER_DOWNSCALE;
  }

  setPosition (position: Vector2) {
    this.simPosition = position;
    this.syncPosition();
  }

  inside (input: Vector2): boolean {
    return input.distanceTo(this.simPosition) < this.radius - this.collisionShrinkFactor;
  }

  gravitationalAcceleration (location: Vector2): Vector2 {
    const translation = location.clone().sub(this.simPosition).divideScalar(1e3);
    const direction = translation.clone().normalize().negate();

    return direction.multiplyScalar(this.massGDiv6 / (translation.length() * translation.length()));
  }

  cleanUp () {
    // Override in child classes
  }
}
