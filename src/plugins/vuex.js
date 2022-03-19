import Vue from 'vue';
import Vuex from 'vuex'
import chart from './vuex_modules/chartWindow'

Vue.use(Vuex);

let store = new Vuex.Store({
    modules: {
        chart
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
    }
})

export default store;