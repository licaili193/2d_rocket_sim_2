import { Earth, Rocket } from "@/engine/agent_instance";
import { EARTH_RADUIS, PI } from "@/config/config";

import { Vector2 } from "three";

import store from "@/store/index";

function initDefault () {
  const earth = new Earth();

  // Combined stage
  const rocket = new Rocket(851800, 56.97);
  rocket.minMass = 280600;
  rocket.massDeclineRate = 1000;
  rocket.setPosition(new Vector2(0, EARTH_RADUIS));
  rocket.setOrientation(PI / 2);
  rocket.setActive(true);
  rocket.thrustProfile.addPoints([
    [0.01, 3000000], [9, 12124000], [172, 12124000], [173, 0]
  ]);
  rocket.gimbalProfile.addPoints([
    [0, 0], [5, 0], [5.5, 0.5 * PI / 180], [6, 0], [10.0, 0], [10.5, 0.5 * PI / 180], [11, 0]
  ]);
  rocket.name = "First Stage & booster";

  // First stage remain
  const rocket2 = new Rocket(195000, 75);
  rocket2.setActive(false);
  rocket2.name = "Second Stage";

  // Second stage
  const rocket3 = new Rocket(5000, 25);
  rocket3.minMass = 2000;
  rocket3.massDeclineRate = 20;
  rocket3.thrustProfile.addPoints([
    [0.01, 30000], [3, 70000], [35, 75000], [200, 50000], [201, 0], [301, 0], [301, 20000], [535, 50000], [600, 0]
  ]);
  rocket3.setActive(false);
  rocket3.name = "First Stage - remaining";

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

function initDefault2 () {
  const earth = new Earth();

  // Combined stage,first
  const rocket = new Rocket(851800, 56.97);
  rocket.minMass = 280600;
  rocket.massDeclineRate = 3646.1;
  rocket.setPosition(new Vector2(0, EARTH_RADUIS));
  rocket.setOrientation(PI / 2);
  rocket.setActive(true);
  rocket.thrustProfile.addPoints([
    [0.01, 3000000], [9, 12124000], [172, 12124000], [173, 0]
  ]);
  rocket.gimbalProfile.addPoints([
    [0, 0], [100, 0], [100.5, 1.1 * PI / 180], [101, 0], [110.5, 0], [111, -1.099 * PI / 180], [111.5, 0]
  ]);
  rocket.name = "First Stage and booster";

  // rocket without booster
  const rocket5 = new Rocket(631000, 56.97);
  rocket5.minMass = 60100;
  rocket5.massDeclineRate = 344.4;
  rocket5.thrustProfile.addPoints([
    [0, 1400000], [307, 1400000], [308, 0]
  ]);
  rocket5.gimbalProfile.addPoints([
    [0, 0], [10, 0], [10.5, -3.5 * PI / 180], [11, 0], [200, 0], [201, -0.5 * PI / 180], [202, 0]
  ]);
  rocket5.setActive(false);
  rocket5.name = "rocket core";

  // First stage remain
  const rocket2 = new Rocket(195000, 75);
  rocket2.setActive(false);
  rocket2.name = "first stage remaining";

  // Second stage
  const rocket3 = new Rocket(38500, 11.54);
  rocket3.minMass = 9400;
  rocket3.massDeclineRate = 44.01;
  rocket3.thrustProfile.addPoints([
    [0, 0], [3, 176720], [358, 176720], [948, 176720], [1290, 176720], [1294, 0]
  ]);
  rocket3.gimbalProfile.addPoints([
    [0, 0], [4, 0], [5, -0.1 * PI / 180], [6, 0]
  ]);
  rocket3.setActive(false);
  rocket3.name = "second stage and ssatellite";

  // booster remian
  const rocket4 = new Rocket(55200, 27.6);
  rocket4.minMass = 55200;
  rocket.setActive(false);
  rocket4.name = "Booster*4 remaining";

  const rocket6 = new Rocket(1000, 3);
  rocket6.minMass = 1000;
  rocket6.massDeclineRate = 0;
  rocket6.setActive(false);
  rocket6.name = "satellite";

  const rocket7 = new Rocket(5900, 11.54);
  rocket7.minMass = 5900;
  rocket7.massDeclineRate = 0;
  rocket7.setActive(false);
  rocket7.name = "second stage remaining";

  // booster seperation
  rocket.actions.push({
    disableParent: true,
    spawnAgents: [rocket4.uuid, rocket5.uuid],
    time: 173
  });
  // first stage seperation
  rocket5.actions.push({
    disableParent: true,
    spawnAgents: [rocket3.uuid, rocket2.uuid],
    time: 290
  });
  // second stage seperation
  rocket3.actions.push({
    disableParent: true,
    spawnAgents: [rocket7.uuid, rocket6.uuid],
    time: 1303.2
  });

  store.commit("addPassiveAgent", earth);
  store.commit("addActiveAgent", rocket);
  store.commit("addActiveAgent", rocket2);
  store.commit("addActiveAgent", rocket3);
  store.commit("addActiveAgent", rocket4);
  store.commit("addActiveAgent", rocket5);
  store.commit("addActiveAgent", rocket6);
  store.commit("addActiveAgent", rocket7);
}

export function initialization () {
  initDefault2();
}
