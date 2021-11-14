<template>
  <div>
    
    <v-row>
      <v-col>
        <v-chip v-if="isConnected"
          class="ma-2"
          color="green"
          text-color="white"
        >
        Connected
        </v-chip>      
        <v-chip v-else
          class="ma-2"
          color="red"
          text-color="white"
        >
        disconnected
        </v-chip>      
        
      </v-col>
      <v-col>
        <v-btn @click="pingServer()">REFRESH</v-btn>
      </v-col>
      <v-col v-for="item in debugSources" :key="item">
        <v-switch 
          v-model="chartData.onchart[0].settings.filterSources"
          color="primary"
          :label="item"
          :value="item"
        ></v-switch>
      </v-col>
    </v-row>
    
    <trading-vue
      :width="this.width"
      :height="this.height"
      :titleTxt="fromServer.id" 
      :overlays="overlays"
      :data="chartData"
      :timezone="parseInt(3)"
      :color-back="colors.colorBack"
      :color-grid="colors.colorGrid"
      :color-text="colors.colorText"
      >
      </trading-vue>
 ]
    <div> {{ fromServer.flags }} </div>
  </div>
</template>


<script>
import TradingVue from 'trading-vue-js'
import Flags from './overlays/Flags'
import ValueBars from './overlays/ValueBars.vue'
import ATR from './overlays/ATR.vue'


export default {
  components: { TradingVue },
  data: () => ({
      debugSources: ['extremum','hl_trend','candlepatterns'],
      overlays: [ValueBars, Flags, ATR],
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      },
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
      isConnected: false,
      socketMessage: '',
      fromServer: {
        id: 'N/A',
        candles: [],
        flags: {}
      },
      chartData: {
        "chart": {
          "type": "Candles",
          "data": [],
          "settings": { }
        },
        "onchart": [
          {
            "name": "Flags 10",
            "type": "Flags",
            "data": [],
            "settings": { 
              filterSources: ['extremum']
            }
          },
          {
            "name": "ValueBars 10",
            "type": "ValueBars",
            "data": [],
            "settings": { bars: [] }
          },
          {
            "name": "MAC9",
            "type": "SMA",
            "data": [],
            "settings": { color: 'blue' }
          }
        ],
        "offchart": [
          {
            "name": "ATR 14",
            "type": "ATR",
            "data": [],
            "settings": { }
          },
        ]
      }
  }),
  computed: {
    ohlcv() {
      return this.fromServer.candles.map(
          (a) => [ a.openTime, a.open, a.high, a.low, a.close, a.volume ] 
      )
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    chart(data) {
      console.log("received fromServer")
      console.log(data)
      this.fromServer = data;
      this.chartData.chart.data = this.toOHLCV(data.candles);

      this.chartData.onchart[0].data = data.candles.map( 
        (candle) => {
          if (candle.visualDebug.length > 0) {
            return [candle.openTime, candle];
          }
        }
      );

      /*
      for (var candle of data.candles) {
        if (candle.visualDebug.length === 0)
          { continue; }
        this.chartData.onchart[0].data.push( [ candle.openTime, candle ] );
      }
      */
      this.chartData.onchart[1].settings.bars = this.getBarsDebug(data.candles);
      this.chartData.onchart[2].data = this.getChartDebug(data.candles,'mac9');
      this.chartData.offchart[0].data = this.getChartDebug(data.candles,'atr14');
    }

  },
  methods: {
    onResize() {
      this.width = window.innerWidth * 0.8
      this.height = window.innerHeight * 0.8
    },
    getChartDebug(candles,name) {
      let data = [];
      for (var candle of candles) {
        candle.visualDebug.forEach( (vd) => {
          if (vd.name === name) {
            data.push([candle.openTime, vd.value]);
          }
        });
      }
      return data;
    },
    getBarsDebug(candles) {
      let bars = [];
      for (var candle of candles) {
        candle.visualDebug.forEach( (vd) => {
          if (vd.type === 'hbar') {
            bars.push(vd);
          }
        });
      }
      return bars;
    },
    toOHLCV(serverCandles) {
      return serverCandles.map(
          (a) => [ a.openTime, a.open, a.high, a.low, a.close, a.volume ] 
      )
    },
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('give_data', '')
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