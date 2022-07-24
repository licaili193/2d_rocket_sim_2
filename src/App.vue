<template>
  <v-main>
    <v-app>
      <v-toolbar max-height="60" class="ma-0" elevation="4">
        <v-img max-height="50" contain src="./assets/logo.png"></v-img>
        <SimulationControl></SimulationControl>
      </v-toolbar>
      <v-container class="ma-0 pa-0" fluid>
        <v-row no-gutters>
          <v-col cols="9">
            <Canvas></Canvas>
          </v-col>
          <v-col cols="3">
            <SidePanel  style="height: 300px, overflow-y: auto"></SidePanel>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Canvas from "./components/Canvas.vue";
import SidePanel from "./components/SidePanel.vue";
import SimulationControl from "@/components/SimulationControl.vue";

import { initialization } from "@/config/initializer";

@Component({
  components: {
    Canvas,
    SidePanel,
    SimulationControl
  }
})
export default class App extends Vue {
  mounted () {
    initialization();
  }
}
</script>

<style lang="scss">
html, body {margin: 0; height: 100%; overflow: hidden}
</style>
