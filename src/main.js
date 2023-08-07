import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

// import vue-router@4 and use it in vue
import { createRouter } from "vue-router";

import routes from "./routes"
const router = createRouter({
  routes
});

// initialize vue with router
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
