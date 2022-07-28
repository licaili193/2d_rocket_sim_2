import { Earth, Rocket } from "@/engine/agentInstance";
import { EARTH_RADUIS, PI } from "@/config/config";

import { Vector2 } from "three";

import store from "@/store/index";

function initDefault () {
  const earth = new Earth();

  // Combined stage
  const rocket = new Rocket(500000, 100);
  rocket.minMass = 200000;
  rocket.massDeclineRate = 1000;
  rocket.setPosition(new Vector2(0, EARTH_RADUIS));
  rocket.setOrientation(PI / 2);
  rocket.setActive(true);
  rocket.thrustProfile.addPoints([
    [0.01, 3000000], [3, 7000000], [120, 7500000], [300, 5000000], [301, 0]
  ]);
  rocket.gimbalProfile.addPoints([
    [0, 0], [5, 0], [5.5, 0.5 * PI / 180], [6, 0], [10.0, 0], [10.5, -0.2 * PI / 180], [11, 0]
  ]);
  rocket.name = "First Stage";

  // First stage remain
  const rocket2 = new Rocket(150000, 75);
  rocket2.setActive(false);
  rocket2.name = "Second Stage";

  // Second stage
  const rocket3 = new Rocket(50000, 25);
  rocket3.minMass = 20000;
  rocket3.massDeclineRate = 200;
  rocket3.thrustProfile.addPoints([
    [0.01, 300000], [3, 700000], [35, 750000], [300, 500000], [301, 0]
  ]);
  rocket3.setActive(false);
  rocket3.name = "First Stage - remaining";

  rocket.actions.push({
    disableParent: true,
    spawnAgents: [rocket2.uuid, rocket3.uuid],
    time: 350
  });

  store.commit("addPassiveAgent", earth);
  store.commit("addActiveAgent", rocket);
  store.commit("addActiveAgent", rocket2);
  store.commit("addActiveAgent", rocket3);
}

export function initialization () {
  initDefault();
}
