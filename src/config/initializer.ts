import { Earth, Rocket } from "@/engine/agent_instance";
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
    [0.01, 3000000], [20, 7000000], [60, 7500000], [120, 5000000], [121, 0]
  ]);
  rocket.gimbalProfile.addPoints([
    [0, 0], [5, 0], [5.5, 0.5 * PI / 180], [6, 0], [10.0, 0], [10.5, 0.5 * PI / 180], [11, 0]
  ]);
  rocket.name = "First Stage";

  // First stage remain
  const rocket2 = new Rocket(195000, 75);
  rocket2.setActive(false);
  rocket2.name = "First Stage - remaining";

  // Second stage
  const rocket3 = new Rocket(5000, 25);
  rocket3.minMass = 2000;
  rocket3.massDeclineRate = 20;
  rocket3.thrustProfile.addPoints([
    [0.01, 30000], [3, 70000], [35, 75000], [200, 50000], [201, 0], [300, 0], [301, 20000], [535, 50000], [600, 0]
  ]);
  rocket3.setActive(false);
  rocket3.name = "Second Stage";

  rocket.actions.push({
    disableParent: true,
    spawnAgents: [rocket2.uuid, rocket3.uuid],
    time: 130
  });

  store.commit("addPassiveAgent", earth);
  store.commit("addActiveAgent", rocket);
  store.commit("addActiveAgent", rocket2);
  store.commit("addActiveAgent", rocket3);
}

export function initialization () {
  initDefault();
}
