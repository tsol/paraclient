<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpen"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      eager
    >
      
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="isOpen = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-btn icon dark @click="refresh()">
              <v-icon>mdi-reload</v-icon>  
          </v-btn>

          <v-toolbar-title> {{ tickerId }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>

            <v-btn
              dark
              text
              @click="isOpen = false"
            >
              Close
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <chart 
          :tickerId="tickerId"
          :candles="$store.state.chart.candles"
          :flags="$store.state.chart.flags"
          :enabledSources="enabledSources"
          :moveTo="$store.state.chart.moveTo"
        />
        

        <v-switch v-for="item in allSources" :key="item" 
          v-model="enabledSources"
          color="primary"
          :label="item"
          :value="item"
        ></v-switch>


      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>

import Chart from './Chart.vue';

export default {
    components: { Chart },
    data: () => ({
      allSources: 
        ['extremum','wfractals','mac20','hl_trend','hills','vlevels','cdlpatts',
        'cma3buy','cma3sell','dblbottom','dbltop','macwfma','tpcwfma','ttcwoff','entries'],
      enabledSources: []
    }),
    methods: {
        refresh() {
            this.$socket.emit('get_chart', { tickerId: this.tickerId } )
        }
    },
    computed: {
        tickerId() { return this.$store.state.chart.tickerId; }, 
        isOpen: {
            get: function ()  { return this.$store.state.chart.isOpen; },
            set: function (v) { this.$store.commit('chart/openWindow',v); }
        }        
    },
    watch: {
        isOpen: function (newV) {
          if (! newV ) { return; }
          this.enabledSources = this.$store.state.chart.enabledSources;  
        }
    },


}
</script>

