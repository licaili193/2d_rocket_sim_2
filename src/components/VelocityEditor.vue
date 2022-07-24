<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          class="mx-2"
          v-model="content.velocity.x"
          label="vx"
          :disabled="disabled"
          suffix="m/s"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          class="mx-2"
          v-model="content.velocity.y"
          label="vy"
          :disabled="disabled"
          suffix="m/s"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="content.omega !== undefined">
      <v-col class="d-flex align-center">
        <v-text-field
          class="mx-2"
          v-model="content.omega.value"
          label="omega"
          :disabled="disabled"
          suffix="rad/s"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { PI } from "@/config/config";

import { Vector2 } from "three";

@Component
export default class PoseEditor extends Vue {
  @Prop({ type: Object, default: new Vector2(0, 0) })
    content!: {velocity: Vector2; omega: { value: number } | undefined};

  @Prop({ type: Boolean, default: true })
    disabled!: boolean;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
