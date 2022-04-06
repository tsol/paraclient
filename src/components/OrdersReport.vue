<template>
<v-card>
    <v-card-title>
         
      <v-row>
          <v-col cols="12" sm="2" md="2">
            <v-datetime-picker
                v-model="filter.dateFrom"
                label="С даты"
                :text-field-props="{prependIcon: 'mdi-calendar'}"
                :date-picker-props="{ locale:'ru-RU' }"
                :time-picker-props="{ format: '24hr' }"
            >
              <template v-slot:dateIcon ><v-icon>mdi-calendar</v-icon></template>
              <template v-slot:timeIcon ><v-icon>mdi-clock</v-icon></template>
            </v-datetime-picker>
          </v-col>

          <v-col cols="12" sm="2" md="2">
            <v-datetime-picker
                v-model="filter.dateTo"
                label="По дату"
                :text-field-props="{prependIcon: 'mdi-calendar'}"
                :date-picker-props="{ locale:'ru-RU' }"
                :time-picker-props="{ format: '24hr' }"
            >
              <template v-slot:dateIcon ><v-icon>mdi-calendar</v-icon></template>
              <template v-slot:timeIcon ><v-icon>mdi-clock</v-icon></template>
            </v-datetime-picker>
          </v-col>

          <v-col cols="12" sm="1" md="1">
              <v-select
                  :items="intervals"
                  label="Интервал"
                  v-model="filter.interval"
              ></v-select>
          </v-col>

          <v-col cols="12" sm="1" md="1"> 
            <v-text-field
              v-model="filter.tag"
              prepend-icon="mdi-variable"
              label="Tag"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="1" md="1"> 
            <v-text-field
              v-model="filter.tagValue"
              prepend-icon="mdi-equal-box"
              label="Value"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" md="4"> 
            <v-text-field
              v-model="filter.eval"
              prepend-icon="mdi-function-variant"
              label="JS code"
              hide-details
            ></v-text-field>
          </v-col>

      <v-col cols="12" sm="1" md="1">
 
        <v-btn @click="reload()">
            <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-col>

      </v-row>

    </v-card-title>

    <v-data-table
      v-model="selected"
      show-select
      :loading="(report.length === 0)"
      :headers="headers"
      :items="report"
      item-key="id"
      :items-per-page="-1"
      class="elevation-1"
      :search="search"
    >

      <template v-slot:top>
        
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
   
      </template>

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
import RedGreen from './helpers/RedGreen.vue'

export default {
  components: { RedGreen },
  data: () => ({
    report: [],
    search: '',
    selected: [],
    intervals: [
      { value: 'd', text: 'DAY' },
      { value: 'm', text: 'MONTH' },
      { value: 'h', text: 'HOUR' }
    ],
    filter: {
       dateFrom: null,
       dateTo: null,
       tag: '',
       tagValue: '',
       interval: 'm',
       eval: null
    },
    headers: [      
        { text: 'Period', value: 'periodName', groupable: false },
        { text: 'Src', value: 'src', groupable: false },
        { text: 'Count orders',   value: 'numOrders', groupable: false },
        { text: 'Ratio',  value: 'ratio', groupable: false },
        { text: 'Gain',  value: 'gain', groupable: false },
        { text: 'Min gain',  value: 'minGain', groupable: false },
        { text: 'Max gain',  value: 'maxGain', groupable: false },
        { text: 'Max open',  value: 'maxOpenOrders', groupable: false }
    ]
  }),
  methods: {
    reload() {
          console.log('sending report request')
          this.$socket.emit('get_orders_report',this.filter);
    }
},
  sockets: {
    orders_report(data) {
      console.log('report received'); 
        this.report = data;
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
