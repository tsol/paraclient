<template>
  <v-card>
    <v-card-title>
      <div>
        <v-chip v-if="isConnected" class="ma-2" color="green" text-color="white">
          connected
        </v-chip>
        <v-chip v-else class="ma-2" color="red" text-color="white"> disconnected </v-chip>
      </div>
      <v-btn @click="reloadTickers()">
        <v-icon>mdi-reload</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      v-model="selected"
      show-select
      :loading="loading"
      :headers="headers"
      :items="tickers"
      item-key="id"
      :items-per-page="-1"
      class="elevation-1"
      show-group-by
      :search="search"
    >
      <template v-slot:[`item.id`]="{ item }">
        <v-btn @click="$store.dispatch('chart/openRecent', item.id)">
          {{ item.id }}
        </v-btn>
      </template>

      <template v-slot:[`item.firstTimestamp`]="{ item }">
        <date-from-unix :timestamp="item.firstTimestamp" />
      </template>

      <template v-slot:[`item.lastTimestamp`]="{ item }">
        <date-from-unix :timestamp="item.lastTimestamp" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import DateFromUnix from './common/DateFromUnix.vue';

export default {
  components: { DateFromUnix },
  data: () => ({
    loading: false,
    isConnected: false,
    tickers: [],
    search: '',
    selected: [],
    headers: [
      { text: 'id', value: 'id', groupable: false },
      { text: 'Symbol', value: 'symbol', groupable: true },
      { text: 'Time', value: 'timeframe', groupable: false },
      { text: 'Limit', value: 'limit', groupable: false },
      { text: 'Live', value: 'isLive', groupable: false },
      { text: 'From', value: 'firstTimestamp', groupable: false },
      { text: 'To', value: 'lastTimestamp', groupable: false },
    ],
  }),

  methods: {
    reloadTickers() {
      this.$socket.emit('list_tickers', '');
      this.loading = true;
    },
  },
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    tickers(data) {
      this.tickers = data;
      this.loading = false;
    },
  },
  mounted() {
    this.reloadTickers();
  },
  computed: {},
};
</script>

<style></style>
