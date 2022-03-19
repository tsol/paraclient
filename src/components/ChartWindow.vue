<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpen"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
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
          <v-toolbar-title>{{ $store.state.chart.tickerId }}</v-toolbar-title>
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
          :tickerId="$store.state.chart.tickerId"
          :candles="$store.state.chart.candles"
          :flags="$store.state.chart.flags"
          :enabledSources="$store.state.chart.displaySources"
          :moveTo="$store.state.chart.moveTo"
        />
        
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>

import Chart from './Chart.vue';

export default {
    components: { Chart },
    data: () => ({

    }),
    computed: {
        isOpen: {
            get: function ()  { return this.$store.state.chart.isOpen; },
            set: function (v) { this.$store.commit('chart/openWindow',v); }
        }
    }
}
</script>

