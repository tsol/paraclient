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

      <ratio-widget :items="filteredItems" field="gainPercent" />

      <v-spacer></v-spacer>
    </v-card-title>

    <orders-table
      :orders="$store.state.vm.orders || []"
      :loading="loading"
      @gotFiltered="filteredItems = $event"
    />
  </v-card>
</template>

<script>
import OrdersTable from './OrdersTable.vue';
import EpForm from './EpForm.vue';
import RatioWidget from './helpers/RatioWidget.vue';
import HintButton from './helpers/HintButton.vue';

// { text: 'Gain', value: 'gain', groupable: false },
// { text: 'Wallet', value: 'wallet', groupable: false },
// { text: 'Stake', value: 'stake', groupable: false },

export default {
  components: { OrdersTable, EpForm, RatioWidget, HintButton },
  data: () => ({
    filteredItems: [],
    loading: false,
  }),
  methods: {
    reload() {
      this.loading = true;
      this.$socket.emit('list_orders', '1');
    },
  },
  sockets: {
    orders() {
      this.loading = false;
    },
  },
  mounted() {},
};
</script>

<style></style>
