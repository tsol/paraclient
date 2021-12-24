
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
      :items="orders"
      item-key="id"
      :items-per-page="-1"
      show-group-by
      class="elevation-1"
      :search="search"
      @current-items="gotFiltered"
    >

    <template v-slot:item.gain="{ item }">
        <div class="green--text" v-if="item.gain > 0">
        {{ item.gain }}
        </div>
        <div class="red--text" v-else>
        {{ item.gain }}
        </div>
    </template>

    <template v-slot:item.time="{ item }">
        <div>
        {{ dateFromUnix(item.time) }}
        </div>
    </template>

    </v-data-table> 
</v-card>
</template>

<script>


export default {
  components: { },
  data: () => ({
    orders: [],
    search: '',
    selected: [],
    filteredItems: [],
    /*
    id: orderId,
            time: time,
            symbol: atCandle.symbol,
            type: 'buy'
            timeframe: atCandle.timeframe,
            strategy: strategyName,
            entryPrice: atCandle.close,
            takeProfit: takeProfit,
            stopLoss: stopLoss
            active: true,
            gain: 0
            qty: 11
 */
 headers: [
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
      }

/*
      formatted_assets() {
          return this.assets.map( i => {
              i.free = parseFloat(i.assetInfo.free);
              i.locked = parseFloat(i.assetInfo.locked);
              i.total = i.free + i.locked;
              i.totalUSD = parseFloat(i.total * i.currentPrice).toFixed(2);
              let percent = ( (i.myAvgPrice / i.currentPrice)*100 - 100 )*-1;
              if (!i.myAvgPrice) { percent = 0; }
              i.myAvgPrice = i.myAvgPrice.toPrecision(5);
              i.gainPercent = percent.toFixed(2);
              return i;
          });
      }
*/
  }
}
</script>

<style>
</style>