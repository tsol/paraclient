<template>
<v-app>
    <Tickers />
</v-app>
</template>

<script>
// import Chart from './components/Chart.vue'
import Tickers from './components/Tickers.vue'

export default {
  name: 'App',
  components: {
    Tickers
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
