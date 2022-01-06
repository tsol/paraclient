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
      ref="tradingVue"
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
    <div> Candles: {{ candles.length }}, Flags: {{ flagsList }} </div>
  </div>
</template>


<script>
import TradingVue from 'trading-vue-js'
import CandleDebug from './overlays/CandleDebug.vue'
import ValueBars from './overlays/ValueBars.vue'
import ATR from './overlays/ATR.vue'

export default {
  components: { TradingVue },
  props: {
      tickerId: String,
      moveTo: null,
      toggleOn: Array,
      overrideFlags: null
  }, 
  data: () => ({
      candles: [],
      flags: {},
      debugSources: ['extremum','vlevels','touchma','hl_trend','candlepatterns','dblbottom','hills','entries'],
      filteredSources: [],
      overlays: [ValueBars, CandleDebug, ATR],
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      },
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.6,
  }),
  computed: {
    resultFlags() {
      if (this.overrideFlags) { 
        console.log('OVERRIDE FLAGS');
        console.log(this.overrideFlags);
        return this.overrideFlags;
      }
      return this.flags;
    },
      chartData() {
        return {  
        "chart": {
          "type": "Candles",
          "data": this.ohlcv,
          "settings": { }
        },
        "onchart": [
          {
            "name": "CandleDebug 10",
            "type": "CandleDebug",
            "data": this.candleDebugData,
            "settings": { 
              filterSources: this.filteredSources
            }
          },
          {
            "name": "ValueBars CUR",
            "type": "ValueBars",
            "data": [],
            "settings": { bars: this.vlevelsData }
          },
          {
            "name": "ValueBars HIGH",
            "type": "ValueBars",
            "data": [],
            "settings": { bars: this.vlevelsHighData, color: 'yellow' }
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
      candleDebugData() {
        return this.candles.map(
          (candle) => {
            if (candle.visualDebug.length > 0) {
              return [candle.openTime, candle];
            }
        });        
      },
      vlevelsData()
      {
        if (this.resultFlags.vlevels) { return this.resultFlags.vlevels; }
        return [];
      },
      vlevelsHighData() {
        if (this.resultFlags.vlevels_high) { return this.resultFlags.vlevels_high; }
        return [];        
      },
      flagsList()
      {
        return Object.keys(this.resultFlags).join(', ');
      }
  },
  methods: {
    onResize() {
      this.width = window.innerWidth * 0.8
      this.height = window.innerHeight * 0.6
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
      this.$socket.emit('get_chart', { tickerId: this.tickerId } )
    }
  },
  sockets: {
    chart(data) {
      if (data.id !== this.tickerId) {
        return;
      }
      this.candles = data.candles;
      this.flags = data.flags;

      if (! this.flags.vlevels_high ) {
        this.flags.vlevels_high = [];
      }

      console.log('CHART RECEIVED');

      this.$nextTick(() => {
        //this.$refs.tradingVue.resetChart()
        if (this.moveTo) {
            if (this.candles && this.candles[0] && this.candles[0].openTime <= this.moveTo) {
              console.log('chart moved to target '+this.moveTo);
              const [start, finish] = this.$refs.tradingVue.getRange();
              this.$refs.tradingVue.goto( this.moveTo + Math.floor((finish-start)/2)  );
            }
            else {
              alert('Target candle already expired, try later date');
            }

        }
        
      });


    }
  },
  mounted() {
        window.addEventListener('resize', this.onResize)

        if (this.toggleOn && this.toggleOn.length > 0) {
          this.filteredSources = this.toggleOn;
        }

  },
  beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
  },
}
</script>