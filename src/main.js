import Vue from 'vue';

import VueSocketIO from 'vue-socket.io';
import Vuetify from 'vuetify/lib/framework';
import DatetimePicker from 'vuetify-datetime-picker';
// import VeeValidate from 'vee-validate';

import store from './plugins/vuex';

import App from './App.vue';

Vue.use(Vuetify);
Vue.use(DatetimePicker);
// Vue.use(VeeValidate);

Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.VUE_APP_WSS_PARASERVER,
  vuex: {
    store, actionPrefix: 'SOCKET_',
  },
}));

Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify(),
  store,
  render: (h) => h(App),
}).$mount('#app');
