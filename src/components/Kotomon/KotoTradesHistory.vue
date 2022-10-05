<template>
<v-card class="mt-4 mb-4 elevation-6">
    <v-card-title>

        <h3>TRADES HISTORY</h3>

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
      :loading="(trades.length === 0)"
      :headers="headers"
      :items="trades"
      item-key="id"
      :items-per-page="-1"

      :search="search"
    >

   <template v-slot:[`item.time`]="{ item }">
        {{ (new Date(item.time)).toLocaleDateString("ru-RU") }}
    </template>

    <template v-slot:[`item.isBuyer`]="{ item }">
        <div class="green--text" v-if="item.isBuyer">
        BUY
        </div>
        <div class="red--text" v-else>
        SALE
        </div>
    </template>

    </v-data-table>
</v-card>
</template>

<script>

export default {
  components: { },
  props: ['trades'],
  data: () => ({
    search: '',
    selected: [],
    headers: [
      { text: 'Time', value: 'time', groupable: false },
      { text: 'BUY/SELL', value: 'isBuyer', groupable: false },
      { text: 'QTY', value: 'qty', groupable: false },
      { text: 'Price (USDT)', value: 'price', groupable: false },
      { text: 'Total (USDT)', value: 'quoteQty', groupable: false },
      { text: 'Commission', value: 'commission', groupable: false },
      { text: 'Comm. Asset', value: 'commissionAsset', groupable: false },

    ],
  }),
  methods: {
  },
  sockets: {
  },
  mounted() {
  },
  computed: {
  },
};
</script>

<style>
</style>
