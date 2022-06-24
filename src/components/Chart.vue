<template>
  <div>    
      
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
 
    <div> Candles: {{ candles.length }}, Flags: {{ flagsList }} </div>
 
 
  </div>
</template>


<script>
import TradingVue from 'trading-vue-js'
import CandleDebug from './overlays/CandleDebug.vue'
import ValueBars from './overlays/ValueBars.vue'
import ATR from './overlays/ATR.vue'
import MACD from './overlays/MACD.vue'
import BBANDS from './overlays/BBANDS.vue'


export default {
  components: { TradingVue },
  props: {
      tickerId: String,
      candles: Array,
      flags: Object,
      enabledSources: Array,
      moveTo: null
  }, 
  data: () => ({
      overlays: [ValueBars, CandleDebug, ATR, MACD, BBANDS ],
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      },
      width: 0,
      height: 0,
      onChart: []
  }),
  computed: {
      windowIsOpen() {
        return this.$store.state.chart.isOpen;
      },
      chartData() {
      return {  
        "chart": {
          "type": "Candles",
          "data": this.ohlcv,
          "settings": { }
        },
        "onchart":  [
          {
            "name": "C",
            "type": "CandleDebug",
            "data": this.candleDebugData,
            "settings": { 
              filterSources: this.enabledSources
            }
          },
          {
            "name": "V",
            "type": "ValueBars",
            "data": [],
            "settings": { bars: this.vlevelsData }
          },
          {
            "name": "V",
            "type": "ValueBars",
            "data": [],
            "settings": { bars: this.vlevelsHighData, color: 'yellow' }
          },
          ... this.onChart
        ],
        "offchart": [
          /*{
            "name": "RSI 14",
            "type": "Range",
            "data": this.filterDebug('rsi14'),
            "settings": { }
          },*/
          /*{
            "name": "ATR 14",
            "type": "ATR",
            "data": this.filterDebug('atr14'),
            "settings": { }
          },
          */
          {
            "name": "MACD",
            "type": "MACD",
            "data": this.filterDebugMACD('macd'),
            "settings": { }
          },
        ]
        };
      },
      ohlcv() {
        return this.candles.map(
          (a) => [ a.openTime, a.open, a.high, a.low, a.close, a.volume ] 
        )
      },
      candleDebugData() {
        let debugData = [];
        this.candles.forEach( (candle) => {
            if (candle.visualDebug.length > 0) {
              debugData.push([candle.openTime, candle]);
            }
        });
        return debugData;
      },
      vlevelsData()
      {
        if (this.flags.vlevels) { return this.flags.vlevels; }
        return [];
      },
      vlevelsHighData() {
        if (this.flags.vlevels_high) { return this.flags.vlevels_high; }
        return [];        
      },
      flagsList()
      {
        return Object.keys(this.flags).join(', ');
      }
  },
  methods: {
    plot(name,color) {
      this.onChart.push({
            "name": name,
            "type": "SMA",
            "data": this.filterDebug(name),
            "settings": { color: color }
      });
    },
    onResize() {
      this.width = document.documentElement.clientWidth-10;
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
    filterDebugMACD(name) {
      let data = [];
      for (var candle of this.candles) {
        candle.visualDebug.forEach( (vd) => {
          if (vd.name === name) {
            data.push([candle.openTime, vd.value.h, vd.value.m, vd.value.s]);
          }
        });
      }
      return data;
    },
    hookOpen() {
        this.onChart = [];

        this.plot('mac5','fuchsia');
        this.plot('emac18','#00FF00')
        this.plot('emac20','#000000')
        this.plot('mac50','blue');
        this.plot('mac89','grey');
        this.plot('emac144','#FF4500');
        this.plot('emac35','grey');
        this.plot('ku','grey');
        this.plot('kl','grey');
      
        console.log('HOOK_OPEN candles count = '+this.candles.length);
        
    },
  },
  mounted() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
  },
  watch: {
        windowIsOpen: function (newV) {
          if (! newV ) { return; }
          this.$refs.tradingVue.resetChart();
          
          this.$nextTick(() => {
            this.hookOpen();  
            if (! this.moveTo ) { return; }
            if (! this.candles || ! this.candles[0] ) { return; }
            if ( this.candles[0].openTime >= this.moveTo )
              { return alert('Target candle already expired, try later date'); }
            
            const [start, finish] = this.$refs.tradingVue.getRange();
            this.$refs.tradingVue.goto( this.moveTo + Math.floor((finish-start)/2)  );
            
            console.log('CHART: moved to target '+this.moveTo);
         });  
        }
    },

}
</script>