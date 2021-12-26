
<template>
<v-card>
    <v-card-title>
        
        <v-btn @click="reload()">
            <v-icon>mdi-reload</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        
        <div> gain: <b>{{ this.sumSelectedGain }}</b>, win/loose: <b>{{ this.winLooseRatio }}</b> </div>
 
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
      :loading="(orders.length === 0)"
      :headers="headers"
      :items="formatted_orders"
      item-key="id"
      :items-per-page="-1"
      show-group-by
      class="elevation-1"
      :search="search"
      @current-items="gotFiltered"
      show-expand
      :expanded.sync="expanded"
      @item-expanded="rowExpandEvent"

    >
    <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
            <Chart 
              :tickerId="item.symbol+'-'+item.timeframe" 
              :moveTo="item.time"
              :toggleOn="['entries',item.strategy]"
             />
            </td>
    </template>

    <template v-slot:item.gain="{ item }">
        <div class="green--text" v-if="item.gain > 0">
        {{ item.gain }}
        </div>
        <div class="red--text" v-else>
        {{ item.gain }}
        </div>
    </template>

    <template v-slot:item.time="{ item }">
        <div :id="item.id">
        {{ dateFromUnix(item.time) }}
        </div>
    </template>

    </v-data-table> 
</v-card>
</template>

<script>
import Chart from './Chart.vue';


export default {
  components: { Chart },
  data: () => ({
    orders: [],
    search: '',
    selected: [],
    filteredItems: [],
    expanded: [],
    headers: [
        { text: 'EXP', value: 'data-table-expand', groupable: false },
        { text: 'Symbol', value: 'symbol', groupable: true },
        { text: 'TF', value: 'timeframe', groupable: true },
        { text: 'Strategy', value: 'strategy', groupable: true },
        { text: 'Date Time', value: 'time', groupable: true },
        { text: 'BUY/SELL', value: 'type', groupable: false },
        { text: 'Qty', value: 'qty', groupable: false },
        { text: 'Entry Price', value: 'entryPrice', groupable: false },
        { text: 'Take Profit', value: 'takeProfit', groupable: false },
        { text: 'Stop Loss', value: 'stopLoss', groupable: false },
        { text: 'Close Price', value: 'closePrice', groupable: false },
        { text: 'Active', value: 'active', groupable: false },
        { text: 'Gain USD', value: 'gain', groupable: false }
    ],

  }),
  methods: {
    gotFiltered(e){
      this.filteredItems = e;
    },
    reload() {
          this.$socket.emit('list_orders','1');
    },
    rowExpandEvent(event) {
      if (event.value) {
        let item = event.item;
        this.$socket.emit('get_chart',item.id);
        this.$nextTick( () =>
          this.$vuetify.goTo('#'+item.id, { duration: 500, offset: 50 })
          //this.$vuetify.goTo('.v-data-table__expanded__row')
        );
        
      }
    },
    dateFromUnix(unixtime) {
        let od = new Date(unixtime);
        return od.toLocaleDateString('ru-RU')+' '+od.toLocaleTimeString('ru-RU');
    }
  },
  sockets: {
    orders(data) {  
        this.orders = data;
    },
  },
  mounted() {
  },
  computed: {

      winLooseRatio()
      {
        let win = this.filteredItems.reduce( (p,c) => p + ( c.gain > 0 ? 1 : 0) , 0);
        let loose = this.filteredItems.reduce( (p,c) => p + ( c.gain < 0 ? 1 : 0) , 0);
        
        let ratio = 0;
        if (win > 0) { ratio = (win / (win+loose)) * 100; }
        
        return win+' / '+loose+' = '+ratio.toFixed(2)+'%';
      },

      sumSelectedGain() {
         return this.filteredItems.reduce( (p,c) => p + c.gain, 0).toFixed(2);
      },

      formatted_orders() {
          return this.orders.map( i => {
              i.qty = i.qty.toPrecision(5);
              i.takeProfit = i.takeProfit.toPrecision(5);
              i.stopLoss = i.stopLoss.toPrecision(5);
              return i;
          });
      }
  }
}
</script>

<style>
</style>