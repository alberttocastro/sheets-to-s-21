import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Router from 'vue-router'
import routes from './routes'
import { loadFonts } from './plugins/webfontloader'

let router = new Router({
  routes,
  mode: 'history'
})

loadFonts()

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).mount("#app");

