<template>
  <v-card>
    <v-card-title>
      <v-btn @click="reload()">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
      <!--
        <v-btn color="blue" @click="restartTickers(false)">
            <v-icon>mdi-reload</v-icon>
        </v-btn>

        <v-btn color="green" @click="restartTickers(true)">
            <v-icon>mdi-play</v-icon>
        </v-btn>
-->
      <v-spacer></v-spacer>

      <div>
        symbols: <b> {{ this.countSymbols }} </b>, gain: <b>{{ this.sumSelectedGain }}</b>
      </div>

      <v-spacer></v-spacer>
    </v-card-title>

    <v-data-table
      v-model="selected"
      show-select
      :loading="orderStats.length === 0"
      :headers="headers"
      :items="orderStats"
      item-key="id"
      :items-per-page="-1"
      class="elevation-1"
      :search="search"
      @current-items="gotFiltered"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="12" sm="2" md="2">
            <InputDate
              defaultValue=""
              id="dateFrom"
              label="С даты"
              @dateSelected="(e) => filterSetValue(e.id, e.value)"
            />
          </v-col>

          <v-col cols="12" sm="2" md="2">
            <InputDate
              defaultValue=""
              id="dateTo"
              label="По дату"
              @dateSelected="(e) => filterSetValue(e.id, e.value)"
            />
          </v-col>

          <v-col cols="12" sm="2" md="2">
            <v-text-field
              v-model="filter.symbol"
              prepend-icon="mdi-currency-usd"
              label="Symbol"
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
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>

      <template v-slot:[`item.gain`]="{ item }">
        <red-green :value="item.gain" :greenAbove="0" />
      </template>

      <template v-slot:[`item.ratio`]="{ item }">
        <red-green :value="item.ratio" :greenAbove="49.99" />
      </template>

      <template v-slot:[`item.entries`]="{ item }">
        <div class="entries">
          {{ item['entries'] }}
        </div>
      </template>

      <template v-for="(tf, index) in timeframes" v-slot:[`item.`+tf+`_gain`]="{ item }">
        <red-green :key="index" :value="item[tf + '_gain']" :greenAbove="0" />
      </template>

      <template v-for="(tf, index) in timeframes" v-slot:[`item.`+tf+`_ratio`]="{ item }">
        <red-green :key="index" :value="item[tf + '_ratio']" :greenAbove="49.99" />
      </template>

      <template v-for="(tf, index) in timeframes" v-slot:[`item.`+tf+`_entries`]="{ item }">
        <div class="entries" :key="index">
          {{ item[tf + '_entries'] }}
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import InputDate from './helpers/InputDate.vue';
import RedGreen from './helpers/RedGreen.vue';

export default {
  components: { InputDate, RedGreen },
  data: () => ({
    orderStats: [],
    filteredItems: [],
    timeframes: [],
    search: '',
    selected: [],
    filter: {
      dateFrom: null,
      dateTo: null,
      strategy: null,
      timeframe: null,
      symbol: null,
    },
  }),
  methods: {
    filterSetValue(id, value) {
      console.log(`filterSetValue ${id} = ${value}`);
      this.filter[id] = value;
      console.log(this.filter);
    },
    gotFiltered(e) {
      this.filteredItems = e;
    },
    reload() {
      this.$socket.emit('get_orders_stats', {
        fromTimestamp: this.filterDateFromTimestamp,
        toTimestamp: this.filterDateToTimestamp,
      });
    },
    restartTickers(runLive) {
      this.$socket.emit('restart_all', { runLive });
    },
    dateFromUnix(unixtime) {
      const od = new Date(unixtime);
      return `${od.toLocaleDateString('ru-RU')} ${od.toLocaleTimeString('ru-RU')}`;
    },
    dateToUnix(dateString) {
      if (!dateString) {
        return null;
      }
      const date = new Date(dateString);
      return date.getTime();
    },
  },
  sockets: {
    orders_stats(data) {
      this.timeframes = data.timeframes;
      this.orderStats = data.stats;
    },
  },
  mounted() {},
  computed: {
    headers() {
      const headers = [
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
          text: 'Strategy',
          value: 'strategy',
          groupable: true,
          filter: (v) => {
            if (!this.filter.strategy) return true;
            return v.includes(this.filter.strategy);
          },
        },
        { text: 'Gain', value: 'gain', groupable: false },
        { text: 'Ratio', value: 'ratio', groupable: false },
        { text: 'Entries', value: 'entries', groupable: false },
      ];

      this.timeframes.forEach((t) => {
        headers.push({ text: `${t}:G`, value: `${t}_gain`, groupable: false });
        headers.push({ text: `${t}:R`, value: `${t}_ratio`, groupable: false });
        headers.push({ text: `${t}:E`, value: `${t}_entries`, groupable: false });
      });

      return headers;
    },
    filterDateFromTimestamp() {
      return this.dateToUnix(`${this.filter.dateFrom} 00:00:00`);
    },
    filterDateToTimestamp() {
      return this.dateToUnix(`${this.filter.dateTo} 23:59:59`);
    },
    countSymbols() {
      const uniq = {};
      // eslint-disable-next-line no-return-assign
      this.filteredItems.forEach((fi) => (uniq[fi.symbol] = 1));
      return Object.keys(uniq).length;
    },
    sumSelectedGain() {
      return this.filteredItems.reduce((p, c) => p + c.gain, 0).toFixed(2);
    },
  },
};
</script>

<style>
.entries {
  color: grey;
  border-right: 1px solid black;
}
</style>
