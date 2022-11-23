<template>
  <v-card>
    <ep-form ref="epForm" @submit="reload()" />

    <v-card-title>
      <hint-button @click="reload()" icon="mdi-reload" hint="Reload orders list" />

      <hint-button
        @click="$refs.epForm.open()"
        icon="mdi-cog-refresh"
        hint="Change settings / re-run entry plan"
        color="blue"
      />

      <v-spacer></v-spacer>

      <ratio-widget :items="filteredItems" />

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
            <date-select v-model="filter.dateFrom" label="По дату" />
          </v-col>

          <v-col cols="12" sm="2" md="2">
            <date-select v-model="filter.dateTo" label="По дату" />
          </v-col>

          <v-col cols="12" sm="1" md="1">
            <v-text-field
              v-model="filter.symbol"
              prepend-icon="mdi-currency-usd"
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
              prepend-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>

      <template v-slot:[`item.real`]="{ item }">
        <v-btn @click="makeEntryReal(item)">
          {{ item.comment.includes('[BROK]') ? 'Y' : 'N' }}
        </v-btn>
      </template>

      <template v-slot:[`item.symbol`]="{ item }">
        <v-btn @click="openChartHistory(item)">
          {{ item.symbol }}
        </v-btn>
      </template>

      <template v-slot:[`item.gainPercent`]="{ item }">
        <red-green :value="item.gainPercent" :greenAbove="0" />
      </template>

      <template v-slot:[`item.time`]="{ item }">
        <date-from-unix :timestamp="item.time" />
      </template>

      <template v-slot:[`item.closeTime`]="{ item }">
        <date-from-unix :timestamp="item.closeTime" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { debounce } from '../common/debounce';
import { dateToUnix } from '../common/common';

import EpForm from './EpForm.vue';
import DateFromUnix from './helpers/DateFromUnix.vue';
import RedGreen from './helpers/RedGreen.vue';
import DateSelect from './helpers/DateSelect.vue';
import RatioWidget from './helpers/RatioWidget.vue';
import HintButton from './helpers/HintButton.vue';

function fnum(number, precision) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

export default {
  components: { EpForm, DateFromUnix, RedGreen, DateSelect, RatioWidget, HintButton },
  data: () => ({
    // orders: [],
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
      tags: [],
    },
  }),
  methods: {
    makeEntryReal(item) {
      this.$socket.emit('make_real_order', { orderId: item.id });
      console.log('make_entry_real', item);
      // this.loading = true;
    },
    openChartHistory(item) {
      this.$store.commit('chart/setEnabledSources', ['entries', item.strategy]);

      this.$store.dispatch('chart/openEntryChart', {
        tickerId: `${item.symbol}-${item.timeframe}`,
        entryId: item.id,
        entryTime: item.time,
      });
    },
    filterSetValue(id, value) {
      console.log(`filterSetValue ${id} = ${value}`);
      this.filter[id] = value;
      console.log(this.filter);
    },
    gotFiltered(e) {
      this.pageFilteredItems = e;
      this.$nextTick(() => {
        this.filteredItems = this.$refs.ordersTable.$children[0].filteredItems;
      });
    },
    reload() {
      this.loading = true;
      this.$socket.emit('list_orders', '1');
    },
    restartTickers(runLive) {
      this.$socket.emit('restart_all', { runLive });
    },

    filterEntryDate(timestamp) {
      if (this.filter.dateFrom && timestamp < this.filterDateFromTimestamp) {
        return false;
      }
      if (this.filter.dateTo && timestamp > this.filterDateToTimestamp) {
        return false;
      }
      return true;
    },
  },
  sockets: {
    orders() {
      this.loading = false;
    },
  },
  mounted() {},
  computed: {
    orders() {
      return this.$store.state.vm.orders || [];
    },
    headers() {
      return [
        { text: 'RL', value: 'real', groupable: false },
        {
          text: 'Symbol',
          value: 'symbol',
          groupable: true,
          filter: (v) => {
            if (!this.filter.symbol) return true;
            return v.includes(this.filter.symbol);
          },
        },
        {
          text: 'TF',
          value: 'timeframe',
          groupable: true,
          filter: (v) => {
            if (!this.filter.timeframe) return true;
            return v === this.filter.timeframe;
          },
        },
        {
          text: 'Strategy',
          value: 'strategy',
          groupable: true,
          filter: (v) => {
            if (!this.filter.strategy) return true;
            return v.includes(this.filter.strategy);
          },
        },
        {
          text: 'Date Time',
          value: 'time',
          groupable: false,
          filter: this.filterEntryDate,
        },
        {
          text: 'BUY/SELL',
          value: 'type',
          groupable: false,
          filter: (v) => {
            if (!this.filter.type) return true;
            return v === this.filter.type;
          },
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
        {
          text: 'Comment',
          value: 'comment',
          groupable: false,
          filter: (value, st, item) => {
            if (!this.filter.tags || this.filter.tags.length === 0) return true;

            const searchIn =
              item.symbol + item.timeframe + item.type + item.strategy + item.result + item.comment;

            return this.filter.tags.every((w) => searchIn.includes(w));
          },
        },
      ];
    },
    filterDateFromTimestamp() {
      return dateToUnix(this.filter.dateFrom);
    },
    filterDateToTimestamp() {
      return dateToUnix(this.filter.dateTo);
    },
    formatted_orders() {
      return this.orders.map((i) => ({
        ...i,
        quantity: fnum(i.quantity, 5),
        takeProfit: fnum(i.takeProfit, 5),
        stopLoss: fnum(i.stopLoss, 5),
        entryPrice: fnum(i.entryPrice, 5),
        closePrice: fnum(i.closePrice, 5),
        gainPercent: fnum(i.gainPercent, 3),
        gain: fnum(i.gain, 3),
      }));
    },
  },

  watch: {
    searchInput: debounce(
      function post(v) {
        this.filter.tags = v.split(/,\s*/);
        this.loading = false;
      },
      700,

      function pre() {
        this.loading = true;
      }
    ),
  },
};
</script>

<style></style>
