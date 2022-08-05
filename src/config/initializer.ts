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

export function initialization () {
  store.state.presets = (rocketConfig as any);

  const earth = new Earth();
  store.commit("addPassiveAgent", earth);

  initFromJSON(store.state.presets[store.state.presetLoadingIndex]);

  console.log(store.state.activeAgents);
}
