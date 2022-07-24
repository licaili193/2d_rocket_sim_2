<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          class="mx-2"
          v-model="content.position.x"
          label="x"
          :disabled="disabled"
          suffix="m"
          type="number"
          @change="onChange"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          class="mx-2"
          v-model="content.position.y"
          label="y"
          :disabled="disabled"
          suffix="m"
          type="number"
          @change="onChange"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="content.angle !== undefined">
      <v-col class="d-flex align-center">
        <v-text-field
          class="mx-2"
          v-model="angle"
          label="theta"
          :disabled="disabled"
          suffix="deg"
          type="number"
          min="0"
          max="360"
        ></v-text-field>
        <circle-slider
          v-model="angle"
          :side="40"
          :min="0"
          :max="360"
          :step-size="1"
          :disabled="disabled"
          :knobColor="disabled ? '#808080' : '#334860'"
        ></circle-slider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CircleSlider from "@/components/circle_slider/CircleSlider.vue";

import { PI } from "@/config/config";

import { Vector2 } from "three";

@Component({
  components: {
    CircleSlider
  }
})
export default class PoseEditor extends Vue {
  @Prop({ type: Object, default: new Vector2(0, 0) })
    content!: {position: Vector2; angle: { value: number } | undefined};

  @Prop({ type: Boolean, default: true })
    disabled!: boolean;

  angle = 0;

  mounted () {
    this.onInputAngleChange();
  }

  @Watch("content.angle.value")
  onInputAngleChange () {
    if (this.content.angle) {
      this.angle = this.content.angle.value / PI * 180;
    } else {
      this.angle = 0;
    }
  }

  @Watch("angle")
  onChange () {
    if (!this.disabled) {
      if (this.content.angle) {
        this.content.angle.value = this.angle / 180 * PI;
      }
      this.$emit("change");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
