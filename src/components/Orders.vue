
<template>
<v-card>

<ep-form ref="epForm" @submit="reload()" />

    <v-card-title>
            
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              @click="reload()"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>      
          </template>
          <span>Reload orders list</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="$refs.epForm.open()"
              color="blue"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-cog-refresh</v-icon>
            </v-btn>      
          </template>
          <span>Change settings / re-run entry plan</span>
        </v-tooltip>

<!--
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="restartTickers(true)"
              color="green"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>      
          </template>
          <span>Restart tickers live = true</span>
        </v-tooltip>
-->
        <v-spacer></v-spacer>
        
        <div> symbols: <b> {{ this.countSymbols }} </b>, gain: <b>{{ this.sumSelectedGain }}</b>, win/loose: <b>{{ this.winLooseRatio }}</b> </div>
 
       <v-spacer></v-spacer>
 
    </v-card-title>

 
    <v-data-table
      v-model="selected"
      show-select
      :loading="loading"
      :headers="headers"
      :items="formatted_orders"
      item-key="id"
      :items-per-page="100"
      show-group-by
      class="elevation-1"
      @current-items="gotFiltered"
      ref="ordersTable"
    >

      <template v-slot:top>
        
        <v-row>
          <v-col cols="12" sm="2" md="2">
           
            <v-datetime-picker
                v-model="filter.dateFrom"
                label="С даты"
                :text-field-props="{prependIcon: 'mdi-calendar'}"
                :date-picker-props="{ locale:'ru-RU' }"
                :time-picker-props="{ format: '24hr' }"
            >
              <template v-slot:dateIcon ><v-icon>mdi-calendar</v-icon></template>
              <template v-slot:timeIcon ><v-icon>mdi-clock</v-icon></template>
            </v-datetime-picker>

          </v-col>
          
          <v-col cols="12" sm="2" md="2">
            
            <v-datetime-picker
                v-model="filter.dateTo"
                label="По дату"
                :date-picker-props="{ locale:'ru-RU' }"
                :time-picker-props="{ format: '24hr' }"
            >
              <template v-slot:dateIcon ><v-icon>mdi-calendar</v-icon></template>
              <template v-slot:timeIcon ><v-icon>mdi-clock</v-icon></template>
            </v-datetime-picker>

          </v-col>

          <v-col cols="12" sm="1" md="1"> 
            <v-text-field
              v-model="filter.symbol"
              label="Symbol"
              single-line
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="1" md="1"> 
            <v-text-field
              v-model="filter.timeframe"
              prepend-icon="mdi-clock"
              label="Timeframe"
              single-line
              hide-details
            ></v-text-field>
          </v-col>


          <v-col cols="12" sm="1" md="1"> 
            <v-text-field
              v-model="filter.type"
              prepend-icon="mdi-text-box-check-outline"
              label="Buy/Sell"
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
              v-model="searchInput"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>

          </v-col>

        </v-row>
        
      </template>

        <template v-slot:[`item.real`]="{ item }">
          <v-btn
            @click="makeEntryReal(item)"
          >
            {{ ( item.comment.includes('[BROK]') ? 'Y' : 'N' ) }}
          </v-btn>
        </template>

        <template v-slot:[`item.symbol`]="{ item }">
          <v-btn
            @click="openChartHistory(item)"
          >
            {{ item.symbol }}
          </v-btn>
        </template>

    <template v-slot:[`item.gainPercent`]="{ item }">
        <div class="green--text" v-if="item.gainPercent > 0">
        {{ item.gainPercent }}
        </div>
        <div class="red--text" v-else>
        {{ item.gainPercent }}
        </div>
    </template>

    <template v-slot:[`item.time`]="{ item }">
        <div :id="item.id">
        {{ dateFromUnix(item.time) }}
        </div>
    </template>


    <template v-slot:[`item.closeTime`]="{ item }">
        <div :id="item.id">
        {{ ( item.closeTime > 0 ? dateFromUnix(item.closeTime) : '-' ) }}
        </div>
    </template>

    </v-data-table> 
</v-card>
</template>

<script>

import {debounce} from './helpers/debounce.js'
import EpForm from './EpForm.vue'

function fnum(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

export default {
  components: { EpForm },
  data: () => ({
    orders: [],
    searchInput: '',
    selected: [],
    loading: false,
    pageFilteredItems: [],
    filteredItems: [],
    filter: {
       dateFrom: null,
       dateTo: null,
       strategy: null,
       timeframe: null,
       symbol: null,
       type: null,
       tags: []
    }
  }),
  methods: {
    makeEntryReal(item) {
      this.$socket.emit('make_real_entry',{ entryId: item.id });
      //this.loading = true;
    },
    openChartHistory(item) {

      this.$store.commit('chart/setEnabledSources',['orders',item.strategy]);

      this.$store.dispatch('chart/openEntryChart',{
          tickerId: item.symbol+'-'+item.timeframe,
          entryId: item.id,
          entryTime: item.time
      });

    },
    filterSetValue(id, value) {
      console.log('filterSetValue '+id+' = '+value);
      this.filter[ id ] = value;
      console.log(this.filter);
    },
    gotFiltered(e){
      this.pageFilteredItems = e;
      this.$nextTick( () => {
        this.filteredItems = this.$refs.ordersTable.$children[0].filteredItems;
      });
    },
    reload() {
          this.loading = true;
          this.$socket.emit('list_orders','1');
    },
    restartTickers(runLive) {
          this.$socket.emit('restart_all',{ runLive: runLive });
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
    filterEntryDate(timestamp) {
      if (this.filter.dateFrom && (timestamp < this.filterDateFromTimestamp) ) {
        return false;
      }
      if (this.filter.dateTo && (timestamp > this.filterDateToTimestamp) ) {
        return false;
      }
      return true;
    },
},
  sockets: {
    orders(data) {
        this.loading = false;  
        this.orders = data;
    },
  },
  mounted() {
  },
  computed: {
      headers() {
        return [
        { text: 'RL', value: 'real', groupable: false },      
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
              filter: this.filterEntryDate
        },
        { text: 'BUY/SELL', value: 'type', groupable: false,
              filter: (v) => { 
                  if (!this.filter.type) return true;
                  return (v === this.filter.type);
              }
        },
        { text: 'Entry Price', value: 'entryPrice', groupable: false },
        { text: 'Take Profit', value: 'takeProfit', groupable: false },
        { text: 'Stop Loss', value: 'stopLoss', groupable: false },
        { text: 'Close Price', value: 'closePrice', groupable: false },
        { text: 'Close Time', value: 'closeTime', groupable: false },
        /*
        { text: 'Active', value: 'active', groupable: false },
        */
        { text: 'GAIN%', value: 'gainPercent', groupable: false },

        { text: 'Qty', value: 'quantity', groupable: false },
        { text: 'Gain', value: 'gain', groupable: false },
        { text: 'Wallet', value: 'wallet', groupable: false },
        { text: 'Stake', value: 'stake', groupable: false },
        
        { text: 'Result', value: 'result', groupable: false },
        { text: 'Comment', value: 'comment', groupable: false,
            filter: (value,st,item) => {
                if (!this.filter.tags || this.filter.tags.length == 0) return true;
                
                const searchIn =  item.symbol + item.timeframe + item.type +
                        item.strategy + item.result +
                        item.comment;

                return this.filter.tags.every( (w) => searchIn.includes(w) );
            }
        },

/*              filter: (comment) => { 
                  if (!this.filter.commentWords) return true;
                  return this.filter.commentWords.every( (w) => comment.includes(w) );
              }*/
      
        ];
      },
      filterDateFromTimestamp() {
        return this.dateToUnix(this.filter.dateFrom);
      },
      filterDateToTimestamp() {
        return this.dateToUnix(this.filter.dateTo);
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
 //           return this.orders;
          return this.orders.map( i => {
              i.quantity    = fnum(i.quantity,5);
              i.takeProfit  = fnum(i.takeProfit,5);
              i.stopLoss    = fnum(i.stopLoss, 5);
              i.entryPrice  = fnum(i.entryPrice, 5);
              i.closePrice  = fnum(i.closePrice, 5);
              i.gainPercent = fnum(i.gainPercent, 3);
              i.gain        = fnum(i.gain, 3);
              
              return i;
          });
      }
  },

  watch: {
      searchInput: debounce(
            function (v) { this.filter.tags = v.split(/,\s*/); this.loading = false; }, 700,
            function () { this.loading = true; } )
       
  }
  
}
</script>

<style>
</style> 