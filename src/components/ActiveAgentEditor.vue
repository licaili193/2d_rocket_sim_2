<template>
  <v-card class="ma-1 pa-1">
    <v-card-title>{{ content.name }}</v-card-title>
    <v-container class="my-2 d-flex align-center">
      <v-text-field
        class="mx-2"
        v-model="content.mass"
        label="Total Mass"
        :disabled="!enabled"
        suffix="kg"
      ></v-text-field>
      <v-text-field
        class="mx-2"
        v-model="content.minMass"
        label="Net Mass"
        :disabled="!enabled"
        suffix="kg"
      ></v-text-field>
      <v-text-field
        class="mx-2"
        v-model="content.massDeclineRate"
        label="Mass Decline Rate"
        :disabled="!enabled"
        suffix="kg/s"
      ></v-text-field>
    </v-container>
    <PoseEditor
      :disabled="!enabled"
      :content="{position: content.simPosition, angle: content.simOrientation}"
      @change="onChangePosition"
    ></PoseEditor>
    <VelocityEditor
      :disabled="!enabled"
      :content="{velocity: content.simVelocity, omega: content.simOmega}">
    </VelocityEditor>
    <v-card-text>Thrust {{ content.currentThrust }}N</v-card-text>
    <Plotly :data="thrustProfileData" :layout="thrustProfileLayout" :display-mode-bar="false"></Plotly>
    <Plotly :data="grimbleProfileData" :layout="grimbleProfileLayout" :display-mode-bar="false"></Plotly>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PoseEditor from "@/components/PoseEditor.vue";
import VelocityEditor from "@/components/VelocityEditor.vue";
import { Plotly } from "vue-plotly";

import { ActiveAgent } from "@/engine/agents";

@Component({
  components: {
    PoseEditor,
    VelocityEditor,
    Plotly
  }
})
export default class ActiveAgentEditor extends Vue {
  @Prop({ type: Object })
    content!: ActiveAgent;

  @Prop({ type: Boolean, default: true })
    enabled!: boolean;

  thrustProfileData: any = [];
  thrustProfileLayout: any = {};
  grimbleProfileData: any = [];
  grimbleProfileLayout: any = {};

  mounted () {
    this.thrustProfileData = [{
      x: this.content.thrustProfile.times,
      y: this.content.thrustProfile.values
    }];

    this.thrustProfileLayout = {
      title: {
        text: "Thrust Profile",
        font: {
          size: 12
        }
      },
      margin: {
        autoexpand: false,
        l: 60,
        r: 20,
        t: 20
      },
      yaxis: {
        title: "Thrust [N]",
        showgrid: true,
        zeroline: false,
        showline: false,
        showticklabels: true
      },
      xaxis: {
        title: "Time [s]",
        showgrid: true,
        zeroline: false,
        showline: false,
        showticklabels: true
      },
      height: 200
    };

    this.grimbleProfileData = [{
      x: this.content.grimbleProfile.times,
      y: this.content.grimbleProfile.values
    }];

    this.grimbleProfileLayout = {
      title: {
        text: "Grimble Profile",
        font: {
          size: 12
        }
      },
      margin: {
        autoexpand: false,
        l: 60,
        r: 20,
        t: 20
      },
      yaxis: {
        title: "Grimble [Rad]",
        showgrid: true,
        zeroline: false,
        showline: false,
        showticklabels: true
      },
      xaxis: {
        title: "Time [s]",
        showgrid: true,
        zeroline: false,
        showline: false,
        showticklabels: true
      },
      height: 200
    };
  }

  onChangePosition () {
    this.content.syncPosition();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
