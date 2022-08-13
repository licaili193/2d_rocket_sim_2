import { Earth, Rocket } from "@/engine/agent_instance";
import { EARTH_RADUIS, PI } from "@/config/config";

import rocketConfig from "@/config/rocket-config.json";
import { ActiveAgentAction } from "@/engine/utils";

import { Vector2 } from "three";

import store from "@/store/index";

function initFromJSON (json: any) {
  const agents = new Map();
  for (const agent of json.activeAgents) {
    if (agent.rocket) {
      agents.set(agent.id, new Rocket(0, 0));
      agents.get(agent.id).loadFromJSON(agent.rocket);
    }
  }

  // Add actions
  for (const agent of json.activeAgents) {
    if (agent?.rocket.actions) {
      for (const action of agent.rocket.actions) {
        const actionInterface: ActiveAgentAction = {
          disableParent: false,
          spawnAgents: [],
          time: 0
        };
        if (action.spawnAgents) {
          actionInterface.spawnAgents = [];
          for (const id of action.spawnAgents) {
            if (agents.has(id)) {
              actionInterface.spawnAgents.push(agents.get(id).uuid);
            }
          }
        }
        actionInterface.disableParent = action.disableParent === true;
        actionInterface.time = action.time ?? 0;

        agents.get(agent.id).actions.push(actionInterface);
      }
    }
  }

  for (const [key, value] of agents) {
    store.commit("addActiveAgent", value);
  }
}

function initDefault2 () {
  const earth = new Earth();

  // Combined stage,first
  const rocket = new Rocket(851800, 56.97);
  rocket.minMass = 280600;
  rocket.massDeclineRate = 4646.1;
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
    [0, 0], [10, 0], [10.5, -3.5 * PI / 180], [11, 0], [200, 0], [201, -0.3 * PI / 180], [202, 0]
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
    [0, 0], [3, 176720], [358, 176720], [900, 176720], [910, 176720], [920, 0]
  ]);
  rocket3.gimbalProfile.addPoints([
    [0, 0], [4, 0], [4.5, -1.6 * PI / 180], [5, 0], [19, 0], [19.5, 1.5 * PI / 180], [20, 0], [500, 0], [501, -0.1 * PI / 180], [502, 0], [700, 0], [701, 0.5 * PI / 180], [702, 0], [737, 0], [738, -0.8 * PI / 180], [739, 0]
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
    time: 270
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

/*
export function initialization () {
  store.state.presets = (rocketConfig as any);

  const earth = new Earth();
  store.commit("addPassiveAgent", earth);

  initFromJSON(store.state.presets[store.state.presetLoadingIndex]);
}
*/

// the problem is to avoid spin of rocket because there is no PID controller in the rocket.
// it can be change in the about 1000s where the rocket is about vertical to the orbit.
// let it turns up and with the speed, it can easily go into the orbit
/*
rocket3.gimbalProfile.addPoints([
    [0, 0], [4, 0], [4.5, -1.6 * PI / 180], [5, 0], [19, 0], [19.5, 1.5 * PI / 180], [20, 0], [500, 0], [501, -0.1 * PI / 180], [502, 0], [700, 0], [701, 0.5 * PI / 180], [702, 0], [725, 0], [726, -0.8 * PI / 180], [727, 0]
  ]);
*/