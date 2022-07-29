import Vue from "vue";
import Vuex from "vuex";

import { ActiveAgent, PassiveAgent } from "@/engine/agents";
import { initialization } from "@/config/initializer";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    passiveAgents: new Array<PassiveAgent>(),
    activeAgents: new Array<ActiveAgent>(),
    simulating: false,
    simulationPaused: false,
    simulatingMultiplier: 1,
    simulationTime: 0,
    simulationStep: 0
  },
  getters: {
  },
  mutations: {
    addPassiveAgent (state, agent: PassiveAgent) {
      state.passiveAgents.push(agent);
      EventBus.$emit("addObject", agent);
    },
    removePassiveAgent (state, agent: PassiveAgent) {
      agent.removeFromParent();
      state.passiveAgents = state.passiveAgents.filter(item => item.uuid !== agent.uuid);
    },
    addActiveAgent (state, agent: ActiveAgent) {
      state.activeAgents.push(agent);
      EventBus.$emit("addObject", agent);
    },
    removeActiveAgent (state, agent: ActiveAgent) {
      agent.removeFromParent();
      state.activeAgents = state.activeAgents.filter(item => item.uuid !== agent.uuid);
    },
    startSimulation (state) {
      state.simulating = true;
      state.simulationPaused = false;
      state.simulationTime = 0;
      state.simulationStep = 0;
      EventBus.$emit("startSimulation");
    },
    stopSimulation (state) {
      state.simulating = false;
      state.simulationPaused = false;
      state.simulationTime = 0;
      state.simulationStep = 0;
      EventBus.$emit("stopSimulation");

      for (const agent of state.activeAgents) {
        agent.removeFromParent();
      }
      state.activeAgents = [];
      for (const agent of state.passiveAgents) {
        agent.removeFromParent();
      }
      state.passiveAgents = [];

      initialization();
    },
    pauseSimulation (state) {
      state.simulationPaused = true;
    },
    unpauseSimulation (state) {
      state.simulationPaused = false;
    },
    changeSimulationSpeed (state, multiplier: number) {
      state.simulatingMultiplier = multiplier;
      EventBus.$emit("simulationSpeedChange");
    }
  },
  actions: {
  },
  modules: {
  }
});

export const EventBus = new Vue();
