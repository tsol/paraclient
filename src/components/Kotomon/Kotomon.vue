
<template>
<v-card>
    <v-card-title>
        
        <v-btn @click="reload()">
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
      :loading="(assets.length === 0)"
      :headers="headers"
      :items="formatted_assets"
      item-key="asset"
      :items-per-page="-1"
      class="elevation-1"
      :search="search"
      show-expand
      :expanded.sync="expanded"
    >
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                <KotoTradesHistory :trades="item.tradesHistory" />
            </td>
        </template>

    <template v-slot:item.gainPercent="{ item }">
        <div class="green--text" v-if="item.gainPercent > 0">
        {{ item.gainPercent }}
        </div>
        <div class="red--text" v-else>
        {{ item.gainPercent }}
        </div>
    </template>

    </v-data-table> 
</v-card>
</template>

<script>

import KotoTradesHistory from './KotoTradesHistory.vue';

export default {
  components: { KotoTradesHistory },
  data: () => ({
    assets: [],
    search: '',
    selected: [],
    expanded: [],
    headers: [
        { text: 'EXP', value: 'data-table-expand', groupable: false },
        { text: 'Asset', value: 'asset', groupable: false },
        { text: 'Have Total', value: 'total', groupable: false },
        { text: 'Have in USD', value: 'totalUSD', groupable: false },
        { text: 'Current Price', value: 'currentPrice', groupable: false },
        { text: 'My Avg Price', value: 'myAvgPrice', groupable: false },
        { text: 'Gain', value: 'gainPercent', groupable: false },
        
    ],

  }),
  methods: {
      reload() {
          this.$socket.emit('broker_my_trades','1');
    }
  },
  sockets: {
    broker_my_trades(data) {  
        this.assets = data;
    },
  },
  mounted() {
  },
  computed: {

      formatted_assets() {
          return this.assets.map( i => {
              i.free = parseFloat(i.assetInfo.free);
              i.locked = parseFloat(i.assetInfo.locked);
              i.total = i.free + i.locked;
              i.totalUSD = parseFloat(i.total * i.currentPrice).toFixed(2);
              let percent = -100*(1 - i.currentPrice / i.myAvgPrice);
              if (!i.myAvgPrice) { percent = 0; }
              i.myAvgPrice = i.myAvgPrice.toPrecision(5);
              i.gainPercent = percent.toFixed(2);
              return i;
          });
      }

  }
}
</script>

<style>
</style>