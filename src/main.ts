import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vc from '@vue/composition-api'
import { registerSharedComponents } from '@/plugins/register'

import '@/plugins/tippy'
import 'quill/dist/quill.snow.css'
import '@/main.scss'
import { loadSprites } from './plugins/loadSvg'

Vue.use(vc)
loadSprites()
registerSharedComponents()

Vue.config.productionTip = false

new Vue({
  setup() {
    return {}
  },
  router,
  render: h => h(App)
}).$mount('#app')
