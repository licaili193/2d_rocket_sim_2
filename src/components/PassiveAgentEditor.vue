<template>
  <v-card class="ma-1 pa-1">
    <v-card-title>{{ content.name }}</v-card-title>
    <v-text-field
      class="mx-2"
      v-model="content.mass"
      label="Mass"
      :disabled="!enabled"
      suffix="kg"
      type="number"
    ></v-text-field>
    <v-text-field
      class="mx-2"
      v-model="content.radius"
      label="Radius"
      :disabled="!enabled"
      suffix="m"
      type="number"
    ></v-text-field>
    <PoseEditor
      :disabled="!enabled"
      :content="{position: content.simPosition, angle: undefined}"
      @change="onChangePosition"
    ></PoseEditor>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PoseEditor from "@/components/PoseEditor.vue";

import { PassiveAgent } from "@/engine/agents";

@Component({
  components: {
    PoseEditor
  }
})
export default class PassiveAgentEditor extends Vue {
  @Prop({ type: Object })
    content!: PassiveAgent;

  @Prop({ type: Boolean, default: true })
    enabled!: boolean;

  onChangePosition () {
    this.content.syncPosition();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
