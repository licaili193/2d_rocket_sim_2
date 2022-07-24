import { Earth, Rocket } from "@/engine/agentInstance";
import { EARTH_RADUIS, PI } from "@/config/config";

import { Vector2 } from "three";

import store from "@/store/index";

function initDefault () {
  const earth = new Earth();

  const rocket = new Rocket(500000, 100);
  rocket.minMass = 200000;
  rocket.massDeclineRate = 1000;
  rocket.setPosition(new Vector2(0, EARTH_RADUIS));
  rocket.setOrientation(PI / 2);
  rocket.setActive(true);
  rocket.thrustProfile.addPoints([
    [0.01, 3000000], [3, 7000000], [65, 7500000], [120, 5000000], [121, 0]
  ]);
  rocket.grimbleProfile.addPoints([
    [0, 0], [5, 0], [5.5, 0.1 * PI / 180], [6, 0], [10.0, 0], [10.5, 0.1 * PI / 180], [11, 0]
  ]);

  store.commit("addPassiveAgent", earth);
  store.commit("addActiveAgent", rocket);
}

export function initialization () {
  initDefault();
}
