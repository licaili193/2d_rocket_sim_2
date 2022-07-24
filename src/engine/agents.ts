import { Vector2, Vector3, Object3D } from "three";
import { G, RENDER_DOWNSCALE, THRUST_THRESHOLD, PI } from "@/config/config";
import { Profile } from "@/engine/utils";

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
  grimbleProfile: Profile = new Profile();

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

  // Update mass based on thrust and return the acceleration vector and the angular
  // acceleration from the thrust
  update (currentTime: number, deltaTime: number): [Vector2, number] {
    const grimbleAngle = this.grimbleProfile.seekForward(currentTime);
    let thrust = this.thrustProfile.seekForward(currentTime);
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
    }

    const thrustAngle = this.simOrientation.value + grimbleAngle;
    const thrustVector = (new Vector2(Math.cos(thrustAngle), Math.sin(thrustAngle))).multiplyScalar(thrust);

    const torque = this.length / 2 * Math.sin(grimbleAngle) * thrustVector.length();

    return [thrustVector.divideScalar(this.mass), torque / this.momentOfInertia];
  }
}

export class PassiveAgent extends Object3D {
  mass = 1;
  radius = 1;

  simPosition: Vector2 = new Vector2(0, 0);

  private massGDiv6: number;

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
    return input.distanceTo(this.simPosition) < this.radius;
  }

  gravitationalAcceleration (localtion: Vector2): Vector2 {
    const translation = localtion.clone().sub(this.simPosition).divideScalar(1e3);
    const direction = translation.clone().normalize().negate();

    return direction.multiplyScalar(this.massGDiv6 / (translation.length() * translation.length()));
  }
}
