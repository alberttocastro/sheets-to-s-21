import Vue from "vue"

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/dist/vuetify.min.css"

// Vuetify
import Vuetify from "vuetify"
Vue.use(Vuetify)

const options = {
  theme: {
    dark: false,
  },
  options: {
    customProperties: true,
  },
  icons: {
    iconfont: "mdi",
  },
};

export default new Vuetify(options);
