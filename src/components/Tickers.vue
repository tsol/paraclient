<template>
<v-card>
    <v-card-title>
        <div>
            <v-chip v-if="isConnected"
                class="ma-2" color="green" text-color="white"
            >
                connected
            </v-chip>      
            <v-chip v-else
                class="ma-2" color="red" text-color="white"
            >
                disconnected
            </v-chip> 
        </div>
        <v-btn @click="reloadTickers()">
            <v-icon>mdi-reload</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
    </v-card-title>

    <v-data-table
      v-model="selected"
      show-select
      :loading="(tickers.length === 0)"
      :headers="headers"
      :items="tickers"
      item-key="id"
      :items-per-page="-1"
      class="elevation-1"
      show-group-by
      :search="search"
      show-expand
      :expanded.sync="expanded"
      @item-expanded="rowExpandEvent"
    >

        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
            <Chart :tickerId="item.id" :flags="item.flags" :candles="item.chart.candles" />
            </td>
        </template>

    </v-data-table> 
</v-card>
</template>

<script>
import Chart from './Chart.vue';

export default {
  components: { Chart },
  data: () => ({
    isConnected: false,
    tickers: [],
    search: '',
    selected: [],
    expanded: [],
    headers: [
        { text: 'EXP', value: 'data-table-expand', groupable: false },
        { text: 'id', value: 'id', groupable: false },
        { text: 'Symbol', value: 'symbol', groupable: true },
        { text: 'Time', value: 'timeframe', groupable: false },
        { text: 'Limit', value: 'limit', groupable: false },
        { text: 'Ready', value: 'batchLoaded', groupable: false },
        { text: 'Flags', value: 'flags', groupable: false },
        
    ],
  }),
  methods: {
    reloadTickers() {
        this.$socket.emit('list_tickers', '')
    },
    rowExpandEvent(event) {
      if (event.value) {
        let item = event.item;
        this.$socket.emit('get_chart',item.id);
      }
    },
  },
  sockets: {
    connect() { this.isConnected = true; },
    disconnect() { this.isConnected = false; },
    tickers(data) {
        console.log('TICKERS RECEIVED:');
        console.log(JSON.stringify(data));
        
        data.forEach( (t) => {
            if (! t.chart) {
                let exists = this.tickers.find( e => e.id === t.id );
                if (exists && exists.chart) {
                    t.chart = exists.chart;
                }
                else {
                    t.chart = { candles: [] }
                }
            }       
        });

        this.tickers = data;
 
    },
    chart(data) {
        this.tickers.find( t => t.id === data.id).chart.candles = data.candles;
        console.log('CHART_RECEIVED:')
        console.log(this.tickers);
    }
  },
  mounted() {
    this.reloadTickers();
  },
  computed: {

  }
}
</script>

<style>

</style>