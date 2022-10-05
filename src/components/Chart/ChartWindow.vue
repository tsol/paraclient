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

          <chart-tools :config="config" @apply="toolsCfgApply"/>

          <v-btn icon dark @click="refresh()">
              <v-icon>mdi-reload</v-icon>
          </v-btn>

          <v-toolbar-title> {{ tickerId }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>

          <v-btn icon dark @click="isOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          </v-toolbar-items>
        </v-toolbar>

        <chart
          :tickerId="tickerId"
          :candles="$store.state.chart.candles"
          :cdebug="$store.state.chart.cdebug"
          :flags="$store.state.chart.flags"
          :enabledSources="enabledSources"
          :moveTo="$store.state.chart.moveTo"
          :entry="$store.state.chart.entry"
          :entries="entries"
          :config="config"
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

import Chart from './MyChart.vue';
import ChartTools from './ChartTools.vue';

export default {
  components: { Chart, ChartTools },
  props: {
    entries: Array,
  },
  data: () => ({
    config: {
      entryMode: 'current',
    },
    allSources:
        ['hoffman1', 'macdf', 'extremum', 'wfractals', 'mac20', 'hl_trend', 'hills', 'vlevels', 'cdlpatts',
          'cma3buy', 'cma3sell', 'dblbottom', 'dbltop', 'macwfma', 'tpcwfma', 'ttcwoff', 'geroflvl',
          'entries'],
    enabledSources: [],
  }),
  methods: {
    toolsCfgApply(cfg) {
      console.log('applied config: ', cfg);
      this.config = cfg;
    },
    refresh() {
      this.$socket.emit('get_chart', { tickerId: this.tickerId });
      // todo: fix when reload is hit in entry mode
    },
  },
  computed: {
    tickerId() { return this.$store.state.chart.tickerId; },
    isOpen: {
      get() { return this.$store.state.chart.isOpen; },
      set(v) { this.$store.commit('chart/openWindow', v); },
    },
  },
  watch: {
    isOpen(newV) {
      if (!newV) { return; }
      this.enabledSources = this.$store.state.chart.enabledSources;
    },
  },

};
</script>
