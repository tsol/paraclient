<template>
  <v-card>
    <ep-form ref="epForm" @submit="reload()" />

    <v-card-title>
      <v-row>
        <v-col cols="12" sm="2" md="2">
          <v-datetime-picker
            v-model="filter.dateFrom"
            label="С даты"
            :text-field-props="{ prependIcon: 'mdi-calendar' }"
            :date-picker-props="{ locale: 'ru-RU' }"
            :time-picker-props="{ format: '24hr' }"
          >
            <template v-slot:dateIcon><v-icon>mdi-calendar</v-icon></template>
            <template v-slot:timeIcon><v-icon>mdi-clock</v-icon></template>
          </v-datetime-picker>
        </v-col>

        <v-col cols="12" sm="2" md="2">
          <v-datetime-picker
            v-model="filter.dateTo"
            label="По дату"
            :text-field-props="{ prependIcon: 'mdi-calendar' }"
            :date-picker-props="{ locale: 'ru-RU' }"
            :time-picker-props="{ format: '24hr' }"
          >
            <template v-slot:dateIcon><v-icon>mdi-calendar</v-icon></template>
            <template v-slot:timeIcon><v-icon>mdi-clock</v-icon></template>
          </v-datetime-picker>
        </v-col>

        <v-col cols="12" sm="1" md="1">
          <v-select :items="intervals" label="Интервал" v-model="filter.interval"></v-select>
        </v-col>

        <v-col cols="12" sm="1" md="1">
          <v-btn @click="reload()">
            <v-icon>mdi-reload</v-icon>
          </v-btn>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="$refs.epForm.open()" color="blue" v-bind="attrs" v-on="on">
                <v-icon>mdi-cog-refresh</v-icon>
              </v-btn>
            </template>
            <span>Change settings / re-run entry plan</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="selected"
      show-select
      :loading="loading"
      :headers="headers"
      :items="report"
      item-key="id"
      :items-per-page="-1"
      class="elevation-1"
    >
      <template v-slot:[`item.gain`]="{ item }">
        <red-green :value="item.gain" :greenAbove="0" />
      </template>

      <template v-slot:[`item.ratio`]="{ item }">
        <red-green :value="item.ratio" :greenAbove="49.99" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import RedGreen from './helpers/RedGreen.vue';
import EpForm from './EpForm.vue';

export default {
  components: { RedGreen, EpForm },
  data: () => ({
    loading: false,
    report: [],
    selected: [],
    intervals: [
      { value: 'd', text: 'DAY' },
      { value: 'm', text: 'MONTH' },
      { value: 'h', text: 'HOUR' },
    ],
    filter: {
      dateFrom: null,
      dateTo: null,
      interval: 'm',
    },
    headers: [
      { text: 'Period', value: 'periodName', groupable: false },
      { text: 'Count orders', value: 'numOrders', groupable: false },
      { text: 'Ratio', value: 'ratio', groupable: false },
      { text: 'Gain', value: 'gain', groupable: false },
      { text: 'Min gain', value: 'minGain', groupable: false },
      { text: 'Max gain', value: 'maxGain', groupable: false },
      { text: 'Max open', value: 'maxOpenOrders', groupable: false },
    ],
  }),
  methods: {
    reload() {
      console.log('sending report request');
      this.$socket.emit('get_orders_report', this.filter);
      this.loading = true;
    },
  },
  sockets: {
    orders_report(data) {
      console.log('report received');
      this.report = data;
      this.loading = false;
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style></style>
