<template>
  <div>    
    <v-row>
      <v-col>
        <v-btn @click="refresh()">
          <v-icon>mdi-reload</v-icon>  
        </v-btn>
      </v-col>
      <v-col v-for="item in debugSources" :key="item">
        <v-switch 
          v-model="filteredSources"
          color="primary"
          :label="item"
          :value="item"
        ></v-switch>
      </v-col>
    </v-row>

    <trading-vue
      :width="this.width"
      :height="this.height"
      :titleTxt="this.tickerId" 
      :overlays="overlays"
      :data="chartData"
      :timezone="parseInt(3)"
      :color-back="colors.colorBack"
      :color-grid="colors.colorGrid"
      :color-text="colors.colorText"
      >
      </trading-vue>
 ]
    <div> {{ flags }} </div>
  </div>
</template>


<script>
import TradingVue from 'trading-vue-js'
import Flags from './overlays/Flags'
import ValueBars from './overlays/ValueBars.vue'
import ATR from './overlays/ATR.vue'


export default {
  components: { TradingVue },
  props: ['tickerId','candles','flags'],
  data: () => ({
      debugSources: ['extremum','hl_trend','candlepatterns','dblbottom','hills','entries'],
      filteredSources: ['extremum'],
      overlays: [ValueBars, Flags, ATR],
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      },
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
  }),
  computed: {
      chartData() {
        return {  
        "chart": {
          "type": "Candles",
          "data": this.ohlcv,
          "settings": { }
        },
        "onchart": [
          {
            "name": "Flags 10",
            "type": "Flags",
            "data": this.flagsData,
            "settings": { 
              filterSources: this.filteredSources
            }
          },
          {
            "name": "ValueBars CUR",
            "type": "ValueBars",
            "data": [],
            "settings": { bars: this.flags.vlevels }
          },
          {
            "name": "ValueBars HIGH",
            "type": "ValueBars",
            "data": [],
            "settings": { bars: this.flags.vlevels_high, color: 'yellow' }
          },
          {
            "name": "MAC20",
            "type": "SMA",
            "data": this.filterDebug('mac20'),
            "settings": { color: 'blue' }
          }
        ],
        "offchart": [
          /*
          {
            "name": "ATR 14",
            "type": "ATR",
            "data": this.filterDebug('atr14'),
            "settings": { }
          },*/
        ]
        }
      },
      ohlcv() {
        return this.candles.map(
          (a) => [ a.openTime, a.open, a.high, a.low, a.close, a.volume ] 
        )
      },
      flagsData() {
        return this.candles.map(
          (candle) => {
            if (candle.visualDebug.length > 0) {
              return [candle.openTime, candle];
            }
        });        
      }
  },
  methods: {
    onResize() {
      this.width = window.innerWidth * 0.8
      this.height = window.innerHeight * 0.8
    },
    filterDebug(name) {
      let data = [];
      for (var candle of this.candles) {
        candle.visualDebug.forEach( (vd) => {
          if (vd.name === name) {
            data.push([candle.openTime, vd.value]);
          }
        });
      }
      return data;
    },
    refresh() {
      this.$socket.emit('get_chart', this.tickerId)
    }
  },
  mounted() {
        window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
  },
}
</script>