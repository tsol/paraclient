<template>
  <v-data-table
    v-model="selected"
    show-select
    :loading="resultLoading"
    :headers="headers"
    :items="formatedOrders"
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
          <date-select v-model="filter.dateFrom" label="С даты" />
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
</template>

<script>
import { debounce } from '../common/debounce';
import { dateToUnix } from '../common/common';

import DateFromUnix from './helpers/DateFromUnix.vue';
import RedGreen from './helpers/RedGreen.vue';
import DateSelect from './helpers/DateSelect.vue';

function fnum(number, precision) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

export default {
  components: { DateFromUnix, RedGreen, DateSelect },
  props: {
    orders: { type: Array, default: () => [] },
    loading: { type: Boolean, default: () => false },
  },
  emits: ['gotFiltered'],
  data() {
    return {
      searchInput: '',
      selected: [],
      localLoading: false,
      pageFilteredOrders: [],
      filteredOrders: [],
      filter: {
        dateFrom: null,
        dateTo: null,
        strategy: null,
        timeframe: null,
        symbol: null,
        type: null,
        searchWords: [],
      },
    };
  },

  computed: {
    headers() {
      return [
        { text: 'ID', value: 'id', groupable: false },
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

        { text: 'GAIN%', value: 'gainPercent', groupable: false },

        { text: 'Qty', value: 'quantity', groupable: false },

        { text: 'Result', value: 'result', groupable: false },
        {
          text: 'Comment',
          value: 'comment',
          groupable: false,
          filter: (value, st, item) => {
            if (!this.filter.searchWords || this.filter.searchWords.length === 0) return true;

            const searchIn =
              item.id +
              item.symbol +
              item.timeframe +
              item.type +
              item.strategy +
              item.result +
              item.comment;

            return this.filter.searchWords.every((w) => searchIn.includes(w));
          },
        },
      ];
    },
    resultLoading() {
      return this.loading || this.localLoading;
    },
    formatedOrders() {
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
  methods: {
    filterEntryDate(timestamp) {
      if (this.filter.dateFrom && timestamp < dateToUnix(this.filter.dateFrom)) {
        return false;
      }
      if (this.filter.dateTo && timestamp > dateToUnix(this.filter.dateTo)) {
        return false;
      }
      return true;
    },
    makeEntryReal(item) {
      this.$socket.emit('make_real_order', { orderId: item.id });
      console.log('make_entry_real', item);
      // this.loading = true;
    },
    openChartHistory(item) {
      this.$store.commit('chart/setEnabledSources', [
        'entries',
        item.strategy,
        'magnets',
        'impulse',
      ]);

      this.$store.dispatch('chart/openEntryChart', {
        tickerId: `${item.symbol}-${item.timeframe}`,
        entryId: item.id,
        entryTime: item.time,
      });
    },
    gotFiltered(e) {
      this.pageFilteredOrders = e;
      this.$nextTick(() => {
        this.filteredOrders = this.$refs.ordersTable.$children[0].filteredItems;
        this.$emit('gotFiltered', this.filteredOrders);
      });
    },
  },
  watch: {
    searchInput: debounce(
      function post(v) {
        this.filter.searchWords = v.split(/,\s*/);
        this.localLoading = false;
      },
      700,

      function pre() {
        this.localLoading = true;
      }
    ),
  },
};
</script>

<style scoped></style>
