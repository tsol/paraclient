<template>
<v-app>
  <v-tabs
        fixed-tabs
        background-color="indigo"
        dark
    >
      <v-tab>Tickers</v-tab>
      <v-tab>Kotomon</v-tab>
     
      <v-tab-item>
        <Tickers />
      </v-tab-item>

      <v-tab-item>
        <Kotomon />
      </v-tab-item>

    </v-tabs>

</v-app>
</template>

<script>
// import Chart from './components/Chart.vue'
import Tickers from './components/Tickers.vue'
import Kotomon from './components/Kotomon.vue'

export default {
  name: 'App',
  components: {
    Tickers,
    Kotomon
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
