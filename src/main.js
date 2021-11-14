import Vue from 'vue'
import App from './App.vue'

//import socketio from 'socket.io';
import VueSocketIO from 'vue-socket.io';

import vuetify from './plugins/vuetify'

//export const SocketInstance = socketio('http://localhost:4113');

//Vue.use(VueSocketIO, SocketInstance)

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3005'
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
