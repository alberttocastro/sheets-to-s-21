// Styles
import '@mdi/font/css/materialdesignicons.css'
import "vuetify/dist/vuetify.min.css"

// Vuetify
import Vuetify from 'vuetify'

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
