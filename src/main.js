import '/public/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import router from './router'

// Vuetify

const vuetify = createVuetify({
  components,
  directives
})

createApp(App).use(router).use(vuetify).mount('#app')
