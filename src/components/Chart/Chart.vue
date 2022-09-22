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


    <!--
    <div> Candles: {{ candles.length }}, Flags: {{ flagsList }} </div>
    -->
 
  </div>
</template>


<script>
import TradingVue from 'trading-vue-js'
import CandleDebug from './overlays/CandleDebug.vue'
import ValueBars from './overlays/ValueBars.vue'
import ATR from './overlays/ATR.vue'
import MACD from './overlays/MACD.vue'
import BBANDS from './overlays/BBANDS.vue'
import Entries from './overlays/Entries.vue'

export default {
  components: { TradingVue },
  props: {
      tickerId: String,
      candles: Array,
      cdebug: Array,
      flags: Object,
      enabledSources: Array,
      moveTo: Number,
      entry: Object,
      entries: Array,
      config: Object
  }, 
  data: () => ({
      overlays: [ValueBars, CandleDebug, ATR, MACD, BBANDS, Entries ],
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
        // todo: now this is not good. we only can have one chart per project with this
        // why bother passing other params via props then...
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
            "name": "E",
            "type": "Entries",
            "data": this.entriesData,
            "settings": { }
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
          },
          {
            "name": "ATR 14",
            "type": "ATR",
            "data": this.filterDebug('atr14'),
            "settings": { }
          },*/
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
      entriesDataOnlyCurrent() {
        if (! this.entry ) { return [] }
        return [ this.entryFormatForLayout(this.entry) ];
      },
      entriesDataSymbol() {
        if (! this.entry || this.entries.length == 0 ) { return [] }
        return this.entries
          .filter( e => e.symbol === this.entry.symbol)
          .map( e => this.entryFormatForLayout(e) );
      },
      entriesDataStrategy() {
        if (! this.entry || this.entries.length == 0 ) { return [] }
        return this.entries
          .filter( e => 
            (e.symbol === this.entry.symbol) && (e.strategy === this.entry.strategy)
          )
          .map( e => this.entryFormatForLayout(e) );
      },
      entriesData() {
        if (this.config.entryMode === 'current')
          return this.entriesDataOnlyCurrent;
        if (this.config.entryMode === 'symbol')
          return this.entriesDataSymbol;
        if (this.config.entryMode === 'strategy')
          return this.entriesDataStrategy;
        return [];
      },
      candleDebugData() {
        return this.cdebug.map( cdb => {
              let candle = this.candles.find( c => c.openTime === cdb.time );
              if (! candle) {
                console.log('cdb candle not found:', cdb.time, 'cdb entries:', cdb.entries)
              }
              return [cdb.time, candle, cdb.entries];
        });
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
    entryFormatForLayout(entry) {
          return [entry.time, { 
            entryPrice: entry.entryPrice,
            takeProfit: entry.takeProfit,
            stopLoss: entry.stopLoss,        
            openTime: entry.time,
            closeTime: entry.closeTime || Date.now(),
            text: entry.strategy+'-'+entry.timeframe
          }]
    },
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
    filterDebugFillWith(name, fnGetValuesArray) {
      return this.cdebug.reduce( (res, cdb) => {
          return [ ... res, 
          ... cdb.entries
              .filter( e => e.name === name )
              .map( e => [ cdb.time, ... fnGetValuesArray(e) ])
         ];
      },[]);
    },
    filterDebug(name) { 
      return this.filterDebugFillWith(name, e => [e.value]);
    },
    filterDebugMACD(name) {
      return this.filterDebugFillWith(name, e => [e.value.h, e.value.m, e.value.s] );
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