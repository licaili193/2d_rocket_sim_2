import { ActiveAgent, PassiveAgent } from "@/engine/agents";
import store, { EventBus } from "@/store/index";

import { MAX_SIM_STEP } from "@/config/config";

import { Vector2 } from "three";

interface SimulationSpace {
  rx: number;
  ry: number;
  vx: number;
  vy: number;
  theta: number;
  omega: number;
}

class Engine {
  private dt = 0;
  private dtDiv2 = 0;
  private dtDiv6 = 0;
  private dtTimes2 = 0;

  static loadSpace (agent: ActiveAgent): SimulationSpace {
    return {
      rx: agent.simPosition.x,
      ry: agent.simPosition.y,
      vx: agent.simVelocity.x,
      vy: agent.simVelocity.y,
      theta: agent.simOrientation.value,
      omega: agent.simOmega.value
    };
  }

  static setSpace (space: SimulationSpace, agent: ActiveAgent) {
    agent.simPosition.x = space.rx;
    agent.simPosition.y = space.ry;
    agent.simVelocity.x = space.vx;
    agent.simVelocity.y = space.vy;
    agent.simOrientation.value = space.theta;
    agent.simOmega.value = space.omega;
  }

  update (time: number, deltaTime: number) {
    if (store.state.simulating && !store.state.simulationPaused) {
      this.dt = deltaTime;
      this.dtDiv2 = deltaTime / 2;
      this.dtDiv6 = deltaTime / 6;
      this.dtTimes2 = deltaTime * deltaTime;

      for (const agent of store.state.activeAgents) {
        this.step(time, deltaTime, agent);
      }
    }
  }

  private step (time: number, deltaTime: number, agent: ActiveAgent) {
    let steps = 1;
    if (deltaTime > MAX_SIM_STEP) {
      steps = Math.ceil(deltaTime / MAX_SIM_STEP);
      deltaTime /= steps;
    }

    let currentTime = time;
    let space: SimulationSpace = Engine.loadSpace(agent);

    while (steps--) {
      const [thrustAlpha, thrustOmega] = agent.update(currentTime, deltaTime);
      space = this.stepCore(space, thrustAlpha, thrustOmega);
      currentTime += deltaTime;
    }

    Engine.setSpace(space, agent);
    agent.syncPosition();
  }

  private acceleration (position: Vector2, thrustAlpha: Vector2): [number, number] {
    const acceleration: Vector2 = thrustAlpha.clone();
    for (const passive of store.state.passiveAgents) {
      acceleration.add(passive.gravitationalAcceleration(position));
    }
    return [acceleration.x, acceleration.y];
  }

  private stepCore (space: SimulationSpace, thrustAlpha: Vector2, thrustOmega: number): SimulationSpace {
    const k1r = [space.vx, space.vy];
    const k1v = this.acceleration(new Vector2(space.rx, space.ry), thrustAlpha);

    const k2r = [space.vx + k1v[0] * this.dtDiv2, space.vy + k1v[1] * this.dtDiv2];
    const k2v = this.acceleration(new Vector2(space.rx + k1r[0] * this.dtDiv2, space.ry + k1r[1] * this.dtDiv2), thrustAlpha);

    const k3r = [space.vx + k2v[0] * this.dtDiv2, space.vy + k2v[1] * this.dtDiv2];
    const k3v = this.acceleration(new Vector2(space.rx + k2r[0] * this.dtDiv2, space.ry + k2r[1] * this.dtDiv2), thrustAlpha);

    const k4r = [space.vx + k3v[0] * this.dt, space.vy + k3v[1] * this.dt];
    const k4v = this.acceleration(new Vector2(space.rx + k3r[0] * this.dt, space.ry + k3r[1] * this.dt), thrustAlpha);

    const result: SimulationSpace = {
      rx: space.rx + this.dtDiv6 * (k1r[0] + 2 * k2r[0] + 2 * k3r[0] + k4r[0]),
      ry: space.ry + this.dtDiv6 * (k1r[1] + 2 * k2r[1] + 2 * k3r[1] + k4r[1]),
      vx: space.vx + this.dtDiv6 * (k1v[0] + 2 * k2v[0] + 2 * k3v[0] + k4v[0]),
      vy: space.vy + this.dtDiv6 * (k1v[1] + 2 * k2v[1] + 2 * k3v[1] + k4v[1]),

      theta: space.theta + this.dt * space.omega + 0.5 * this.dtTimes2 * thrustOmega,
      omega: space.omega + this.dt * thrustOmega
    };

    return result;
  }
}

export default new Engine();
