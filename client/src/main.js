import '/public/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import router from './router'
import store from './store/index'
import axios from 'axios'

axios.defaults.timeout = 600_000; // 10 minutes
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Vuetify

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
})

createApp(App).use(router).use(vuetify).use(store).mount('#app')
