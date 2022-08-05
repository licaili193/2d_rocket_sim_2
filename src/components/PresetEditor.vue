<template>
  <v-list two-line>
    <v-list-item
        v-for="preset of $store.state.presets"
        :key="preset.configName"
      >
        <v-list-item-content>
          <v-list-item-title>{{ preset.configName }}</v-list-item-title>
          <v-list-item-subtitle>Number of agents defined: {{ preset.activeAgents.length }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                fab
                small
                v-blur
                :disabled="$store.state.simulating"
                @click="load(preset.configName)"
              >
                <v-icon color="grey lighten-1">mdi-download</v-icon>
              </v-btn>
            </template>
            <span>Load</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PresetEditor extends Vue {
  load (name: string) {
    const index = this.$store.state.presets.findIndex((item) => item.configName === name);
    if (index !== -1) {
      this.$store.state.presetLoadingIndex = index;
      this.$store.commit("stopSimulation");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
