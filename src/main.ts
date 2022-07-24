import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.directive("blur", {
  inserted: function (el) {
    el.onfocus = (ev) => { if (ev.target) { (ev.target as HTMLElement).blur(); } };
  }
});

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
