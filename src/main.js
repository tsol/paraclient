import Vue from 'vue'
import App from './App.vue'

import VueSocketIO from 'vue-socket.io';
import vuetify from './plugins/vuetify'

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://192.168.1.10:3005'
  /*,
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  },
  options: { path: "/my-app/" } */
}))

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
