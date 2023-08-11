import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { loadFonts } from './plugins/webfontloader'

import vuetify from './plugins/vuetify'

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: "history",
});

loadFonts()

new Vue({
  router,
  render: (h) => h(App),
  vuetify
}).$mount("#app");

