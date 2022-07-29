<template>
<div>

<v-dialog v-model="isOpen">
   <v-dynamic-form
    v-model="formData"
    :input-fields="formInputs"
    @submit="formSubmit"
    @cancel="formCancel"
  />
</v-dialog>

</div>
</template>


<script>

import VDynamicForm from './VDynamicForm.vue'
import {is_numeric} from './helpers/numeric.js'

export default {
  components: { VDynamicForm },
  emits: {
    submit: null,
    cancel: null,
  },
  STRINGIFY_PARAMS: ['TAGS'],
  data: () => ({
    isOpen: false,
    formData: { },
  }),
  methods: {
    open() {
      this.$socket.emit('get_ep_params');
      // todo: only first time?
      this.$store.dispatch('vm/queryAll');

    },
    formSubmit() {
      this.$socket.emit('set_ep_params',this.packFormData());
      // then wait for set_params reply from sockets
    },
    formCancel() {
        this.isOpen = false;
        this.$emit('cancel');
    },
    packFormData() {
      let packed = { ... this.formData };

      console.log('packed before:');
      console.log(packed);

      this.$options.STRINGIFY_PARAMS.map( (k) => {
        if (packed[k]) {
          packed[k] = JSON.parse(packed[k]);
        }
      });

      console.log('packed after STRINGIFY:');
      console.log(packed);
      
      Object.keys(packed).map( (k) => {
        if (is_numeric(packed[k])) {
          packed[k] = Number(packed[k]);
        }
        else if ( ! String(packed[k]).trim() ) {
          packed[k] = null;
        } 
      });

      console.log('packed after NULLMENT:');
      console.log(packed);

      return packed;

    },
    parseFormData(data) {

      this.formData = { ... data };

      this.$options.STRINGIFY_PARAMS.map( (k) => {
        this.formData[k] = JSON.stringify(this.formData[k]);
        if (this.formData[k] == 'null') {
          this.formData[k] = '';
        }
      });

      console.log('stringified formData:');
      console.log(this.formData);

    }

  },
  sockets: {
    ep_params(data) {
      this.parseFormData(data);
      this.isOpen = true;
    },
    ep_params_set() {
      this.isOpen = false;
      this.$emit('submit');
    }
  },
  computed: {
    timeframes() {
        return this.$store.state.vm.timeframes;
    },
    strategies() {
        return this.$store.state.vm.strategies;
    },
    symbols() {
        return this.$store.state.vm.symbols;
    },
    formInputs() { return {
        START_SUM:  { name: 'Start USD', type: 'text', line: 1, rules: 'required|numeric' },
        STAKE_MODE: { name: 'Stake Mode', type: 'select', props: { items: ['fixed','percent'] }, line: 1, rules: 'required' },
        STAKE_PERCENT: { name: 'Stake %', type: 'text', line: 2, rules: 'double|required_if:STAKE_MODE,percent' },
        SIMULT_RISK_PERCENT: { name: 'Simult Risk %', type: 'text', line: 2, rules: 'double' },
        STAKE_FIXED: { name: 'Stake Fixed', type: 'text', line: 3, rules: 'numeric|required_if:STAKE_MODE,fixed' },
        LEVERAGE: { name: 'Leverage', type: 'text', line: 3, rules: 'numeric' },
        COST_BUY_PERCENT: { name: 'Buy Comission %', type: 'text', line: 4, rules: 'double' },
        COST_SELL_PERCENT: { name: 'Sell Comission %', type: 'text', line: 4, rules: 'double' },
        TAGS: { name: 'Tags', type: 'text', line: 5 },        
        SYMBOLS: { name: 'Symbols',  component: "v-autocomplete", line: 6,
            props: {
              items: this.symbols,
              filled: true,
              chips: true,
              clearable: true,
              deletableChips: true,
              multiple: true,
              smallChips: true,
            }
        },
        STRATEGIES: { name: 'Strategies',  component: "v-autocomplete", line: 7,
            props: {
              items: this.strategies,
              filled: true,
              chips: true,
              clearable: true,
              deletableChips: true,
              multiple: true,
              smallChips: true,
            }
        },
        TIMEFRAMES: { name: 'Timeframes', component: "v-autocomplete", line: 8,
            props: {
              items: this.timeframes,
              filled: true,
              chips: true,
              clearable: true,
              deletableChips: true,
              multiple: true,
              smallChips: true,
            }
        },
        JSCODE: { name: 'Javascript code', type: 'textarea', line: 9 }
        };
    },

  },  
}
</script>

<style>
</style> 