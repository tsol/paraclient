
<template>
<v-card>
    <v-card-title>
        
        <v-btn @click="reload()">
            <v-icon>mdi-reload</v-icon>
        </v-btn>


        <v-btn color="blue" @click="restartTickers(false)">
            <v-icon>mdi-reload</v-icon>
        </v-btn>

        <v-btn color="green" @click="restartTickers(true)">
            <v-icon>mdi-play</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        
        <div> symbols: <b> {{ this.countSymbols }} </b>, gain: <b>{{ this.sumSelectedGain }}</b>, win/loose: <b>{{ this.winLooseRatio }}</b> </div>
 
       <v-spacer></v-spacer>
 
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

      <template v-slot:top>
        
        <v-row>
          <v-col cols="12" sm="2" md="2">
            <InputDate
              defaultValue="" 
              id="dateFrom"
              label="С даты"
              @dateSelected="(e) => filterSetValue(e.id, e.value)"
            /> 
          </v-col>

          <v-col cols="12" sm="2" md="2">
            <InputDate
              defaultValue="" 
              id="dateTo"
              label="По дату"
              @dateSelected="(e) => filterSetValue(e.id, e.value)"
            /> 
          </v-col>

          <v-col cols="12" sm="2" md="2"> 
            <v-text-field
              v-model="filter.symbol"
              prepend-icon="mdi-currency-usd"
              label="Symbol"
              single-line
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="2" md="2"> 
            <v-text-field
              v-model="filter.timeframe"
              prepend-icon="mdi-clock"
              label="Timeframe"
              single-line
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="2" md="2"> 
            <v-text-field
              v-model="filter.strategy"
              prepend-icon="mdi-robot"
              label="Strategy"
              single-line
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="2" md="2">
 
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>

          </v-col>

        </v-row>
        
      </template>


    <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
            <Chart 
              :tickerId="item.symbol+'-'+item.timeframe" 
              :moveTo="item.time"
              :toggleOn="['entries',item.strategy]"
              :overrideFlags = item.flags
             />
            </td>
    </template>

    <template v-slot:[`item.gain`]="{ item }">
        <div class="green--text" v-if="item.gain > 0">
        {{ item.gain }}
        </div>
        <div class="red--text" v-else>
        {{ item.gain }}
        </div>
    </template>

    <template v-slot:[`item.time`]="{ item }">
        <div :id="item.id">
        {{ dateFromUnix(item.time) }}
        </div>
    </template>

    </v-data-table> 
</v-card>
</template>

<script>
import Chart from './Chart.vue';
import InputDate from './helpers/InputDate.vue'

export default {
  components: { Chart, InputDate },
  data: () => ({
    orders: [],
    search: '',
    selected: [],
    filteredItems: [],
    expanded: [],
    filter: {
       dateFrom: null,
       dateTo: null,
       strategy: null,
       timeframe: null,
       symbol: null
    }
  }),
  methods: {
    filterSetValue(id, value) {
      console.log('filterSetValue '+id+' = '+value);
      this.filter[ id ] = value;
      console.log(this.filter);
    },
    gotFiltered(e){
      this.filteredItems = e;
    },
    reload() {
          this.$socket.emit('list_orders','1');
    },
    restartTickers(runLive) {
          this.$socket.emit('restart_all',{ runLive: runLive });
    },
    rowExpandEvent(event) {
      if (event.value) {
        let item = event.item;
        this.$socket.emit('get_chart',{ tickerId: item.id, timestamp: item.time });
        this.$nextTick( () =>
          this.$vuetify.goTo('#'+item.id, { duration: 500, offset: 50 })
        );
        
      }
    },
    dateFromUnix(unixtime) {
        let od = new Date(unixtime);
        return od.toLocaleDateString('ru-RU')+' '+od.toLocaleTimeString('ru-RU');
    },
    dateToUnix(dateString) {
        if (! dateString ) { return null; }
        const date = new Date(dateString);
        return date.getTime();
    },
    filterOrderDate(timestamp) {
      if (this.filter.dateFrom && (timestamp < this.filterDateFromTimestamp) ) {
        return false;
      }
      if (this.filter.dateTo && (timestamp > this.filterDateToTimestamp) ) {
        return false;
      }
      return true;
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
      headers() {
        return [      
        { text: 'EXP', value: 'data-table-expand', groupable: false },
        { text: 'Symbol', value: 'symbol', groupable: true,
              filter: (v) => { 
                  if (!this.filter.symbol) return true;
                  return (v.includes(this.filter.symbol));
              }},
        { text: 'TF', value: 'timeframe', groupable: true,
              filter: (v) => { 
                  if (!this.filter.timeframe) return true;
                  return (v === this.filter.timeframe);
              }},
        { text: 'Strategy', value: 'strategy', groupable: true,
              filter: (v) => { 
                  if (!this.filter.strategy) return true;
                  return (v.includes(this.filter.strategy));
              } },
        { text: 'Date Time', value: 'time', groupable: false,
              filter: this.filterOrderDate
        },
        { text: 'BUY/SELL', value: 'type', groupable: false },
        { text: 'Qty', value: 'qty', groupable: false },
        /*
        { text: 'Entry Price', value: 'entryPrice', groupable: false },
        { text: 'Take Profit', value: 'takeProfit', groupable: false },
        { text: 'Stop Loss', value: 'stopLoss', groupable: false },
        { text: 'Close Price', value: 'closePrice', groupable: false },
        { text: 'Active', value: 'active', groupable: false },
        */
        { text: 'Gain USD', value: 'gain', groupable: false },
        { text: 'Reached', value: 'reachedPercent', groupable: false },
        { text: 'Result', value: 'result', groupable: false },
        { text: 'Comment', value: 'comment', groupable: false }
        ];
      },
      filterDateFromTimestamp() {
        return this.dateToUnix(this.filter.dateFrom+' 00:00:00');
      },
      filterDateToTimestamp() {
        return this.dateToUnix(this.filter.dateTo+' 23:59:59');
      },
      countSymbols() {
        let uniq = {};
        this.filteredItems.forEach( fi => uniq[ fi.symbol ] = 1 );
        return Object.keys(uniq).length;
      },
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