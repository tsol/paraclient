import Vue from 'vue'
import App from './App.vue'

import VueSocketIO from 'vue-socket.io';
import vuetify from './plugins/vuetify'

import store from './plugins/vuex';

import DatetimePicker from 'vuetify-datetime-picker' 
Vue.use(DatetimePicker)

Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.VUE_APP_WSS_PARASERVER,
  vuex: {
      store, actionPrefix: 'SOCKET_',
  },
}))

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')


/*

import Vue from 'vue'
import App from './App.vue'
//import ComponentSelector from "./components/ComponentSelector";
import axios from 'axios';
import vuetify from './plugins/vuetify';
import store from './plugins/vuex';
import {API_URL} from './settings.js';

Vue.config.productionTip = false
Vue.prototype.$apiUrl = API_URL;
Vue.prototype.$http = axios;

// eslint-disable-next-line no-unused-vars
window.my_vm = new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

*/


