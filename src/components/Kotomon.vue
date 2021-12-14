
<template>
<v-card>
    <v-card-title>
        <h2>Kotomon</h2>
    </v-card-title>

    <v-card-text> 
    
        <v-btn @click="reload()">
            <v-icon>mdi-reload</v-icon>
        </v-btn>

        <div>{{ data }}</div>
    
    </v-card-text>
     
</v-card>
</template>

<script>

export default {
  components: { },
  data: () => ({
      data: 'empty'
  }),
  methods: {
      reload() {
          //this.$socket.emit('broker_request','coin_info');
          this.$socket.emit('broker_request','account_info');
          //this.$socket.emit('broker_request','open_orders');
          //this.$socket.emit('broker_request_all_orders','MATICUSDT');
          //this.$socket.emit('broker_request_my_trades','MATICUSDT');
    }
  },
  sockets: {
    broker_account_info(data) {  
        this.data = data;
    },
    broker_coin_info(data) {  
        this.data = data;
    },
    broker_open_orders(data) {  
        this.data = data;
    },
    broker_all_orders(data) {
        this.data = data;
    },
    broker_my_trades(data) {
        this.data = data;
    }
  },
  mounted() {
  },
  computed: {
  }
}
</script>

<style>
</style>