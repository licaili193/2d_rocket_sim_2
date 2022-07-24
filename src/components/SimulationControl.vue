<template>
  <v-container class="ma-2 d-flex flex-row-reverse align-center">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-blur
          color="red"
          fab
          icon
          small
          class="ma-2"
          v-bind="attrs"
          v-on="on"
          :disabled="!$store.state.simulating"
          @click="onStopClicked"
        >
          <v-icon>mdi-stop</v-icon>
        </v-btn>
      </template>
      <span>Stop</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-blur
          color="blue"
          fab
          :outlined="speedToggle === 2"
          icon
          small
          class="ma-2"
          v-bind="attrs"
          v-on="on"
          @click="onSpeedX100Clicked"
        >
          <v-icon>mdi-speedometer</v-icon>
        </v-btn>
      </template>
      <span>Speed X10</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-blur
          color="blue"
          fab
          :outlined="speedToggle === 1"
          icon
          small
          class="ma-2"
          v-bind="attrs"
          v-on="on"
          @click="onSpeedX10Clicked"
        >
          <v-icon>mdi-speedometer-medium</v-icon>
        </v-btn>
      </template>
      <span>Speed X3</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-blur
          color="blue"
          fab
          :outlined="speedToggle === 0"
          icon
          small
          class="ma-2"
          v-bind="attrs"
          v-on="on"
          @click="onSpeedX1Clicked"
        >
          <v-icon>mdi-speedometer-slow</v-icon>
        </v-btn>
      </template>
      <span>Speed X1</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-blur
          color="orange"
          fab
          icon
          small
          class="ma-2"
          v-bind="attrs"
          v-on="on"
          :disabled="!$store.state.simulating || $store.state.simulationPaused"
          @click="onPauseClicked"
        >
          <v-icon>mdi-pause</v-icon>
        </v-btn>
      </template>
      <span>Pause</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-blur
          color="green"
          fab
          icon
          small
          class="ma-2"
          v-bind="attrs"
          v-on="on"
          :disabled="$store.state.simulating && !$store.state.simulationPaused"
          @click="onPlayClicked"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </template>
      <span>Play</span>
    </v-tooltip>
    <v-card-text>Time: {{$store.state.simulationTime}} s</v-card-text>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class SimulationControl extends Vue {
  speedToggle = 0;

  onPlayClicked () {
    if (this.$store.state.simulating) {
      this.$store.commit("unpauseSimulation");
    } else {
      this.$store.commit("startSimulation");
    }
  }

  onPauseClicked () {
    this.$store.commit("pauseSimulation");
  }

  onSpeedX1Clicked () {
    this.$store.commit("changeSimulationSpeed", 1);
    this.speedToggle = 0;
  }

  onSpeedX10Clicked () {
    this.$store.commit("changeSimulationSpeed", 3);
    this.speedToggle = 1;
  }

  onSpeedX100Clicked () {
    this.$store.commit("changeSimulationSpeed", 10);
    this.speedToggle = 2;
  }

  onStopClicked () {
    this.$store.commit("stopSimulation");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
