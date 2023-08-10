import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import routes from './routes'
import { loadFonts } from './plugins/webfontloader'

Vue.use(VueRouter);
let router = new VueRouter({
  routes,
  mode: "history",
});

loadFonts()

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");

