<template>
  <v-container class="px-2 py-3">
    <v-tabs fixed-tabs>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
        <v-tab v-bind="attrs" v-on="on">
          <v-icon>mdi-clipboard-list</v-icon>
        </v-tab>
        </template>
        <span>Initial Conditions</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
        <v-tab v-bind="attrs" v-on="on">
          <v-icon>mdi-clipboard-text-multiple</v-icon>
        </v-tab>
        </template>
        <span>Presets</span>
      </v-tooltip>
      <v-tab-item>
        <v-card flat class="scrollable">
          <v-card-text>Initial Conditions</v-card-text>
          <PassiveAgentEditor
            v-for="content of $store.state.passiveAgents"
            :key="content.uuid"
            :content="content"
            :enabled="false">
          </PassiveAgentEditor>
          <ActiveAgentEditor
            v-for="content of $store.state.activeAgents"
            :key="content.uuid"
            :content="content"
            :enabled="!$store.state.simulating">
          </ActiveAgentEditor>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat class="scrollable">
          <v-card-text>Presets</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ActiveAgentEditor from "@/components/ActiveAgentEditor.vue";
import PassiveAgentEditor from "@/components/PassiveAgentEditor.vue";

@Component({
  components: {
    PassiveAgentEditor,
    ActiveAgentEditor
  }
})
export default class SidePanel extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.scrollable {
  height: calc(100vh - 140px);
  overflow-y: auto;
}
</style>
