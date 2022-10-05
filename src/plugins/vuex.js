import Vue from 'vue';
import Vuex from 'vuex';

import chart from './vuex_modules/chartWindow';
import vm from './vuex_modules/vm';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    chart, vm,
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    /*
        storesActive: state => (state.tables.cb_stores
                ? state.tables.cb_stores.filter(shop => shop.active === 'Y') : []),
        orders: state => state.orders,

*/
  },
});

export default store;
