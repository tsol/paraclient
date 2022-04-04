<template>
<v-app>
  <div>

    <chart-window />

    <v-tabs v-model="tab"
        background-color="indigo"
        dark
    >
      <v-tab>Tickers</v-tab>
      <v-tab>Orders</v-tab>
      <v-tab>Stats</v-tab>
      <v-tab>Report</v-tab>
      <v-tab>Kotomon</v-tab>
    </v-tabs>

     <v-tabs-items v-model="tab" touchless>
      <v-tab-item>
        <tickers />
      </v-tab-item>
      <v-tab-item>
        <orders />
      </v-tab-item>
      <v-tab-item>
        <order-stats />
      </v-tab-item>
      <v-tab-item>
        <orders-report />
      </v-tab-item>
      <v-tab-item>
        <kotomon />
      </v-tab-item>
     </v-tabs-items>

  </div>
</v-app>
</template>

<script>

import Tickers from './components/Tickers.vue'
import Kotomon from './components/Kotomon/Kotomon.vue'
import Orders from './components/Orders.vue';
import OrderStats from './components/OrderStats.vue';
import ChartWindow from './components/ChartWindow.vue';
import OrdersReport from './components/OrdersReport.vue';

export default {
  name: 'App',
  data: () => ({
    tab: null
  }),
  components: {
    Tickers,
    Kotomon,
    Orders,
    OrderStats,
    ChartWindow,
    OrdersReport
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
