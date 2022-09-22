<template>
<div>

<v-dialog v-model="isOpen">
   <v-dynamic-form
    v-model="formData"
    :loading="needOpen || needSubmit"
    :input-fields="formInputs"
    @submit="formSubmit"
    @cancel="formCancel"
  />
</v-dialog>

</div>
</template>


<script>

import VDynamicForm from './Forms/VDynamicForm.vue'
import {is_numeric} from './helpers/numeric.js'

export default {
  components: { VDynamicForm },
  emits: {
    submit: null,
    cancel: null,
  },
  data: () => ({
    isOpen: false,
    needOpen: false,
    needSubmit: false,
    formData: { },
  }),
  methods: {
    open() {
      this.$socket.emit('get_ep_params');
      this.$store.dispatch('vm/queryParams');
      this.needOpen = true;
    },
    formSubmit() {
      this.$socket.emit('set_ep_params',this.packFormData());
      this.needSubmit = true;
    },
    formCancel() {
        this.isOpen = false;
        this.$emit('cancel');
    },
    packFormData() {
      let packed = { ... this.formData };

      Object.keys(packed).map( (k) => {
        if (is_numeric(packed[k])) {
          packed[k] = Number(packed[k]);
        }
        else if ( ! String(packed[k]).trim() ) {
          packed[k] = null;
        } 
      });

      return packed;

    },
    parseFormData(data) {
      this.formData = { ... data };
    }

  },
  sockets: {
    ep_params(data) {
      if (this.needOpen) {
        this.parseFormData(data);
        this.isOpen = true;
        this.needOpen = false;
      }
    },
    ep_params_set() {
      if (this.needSubmit) {
        this.isOpen = false;
        this.needSubmit = false;
        this.$emit('submit');
      }
    }
  },
  computed: {
    tags() {
      let tags = {};
      this.$store.state.vm.tags.forEach( t => tags[ t.name ] = t );
      return tags;
    },
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
        STAKE_PERCENT: { name: 'Stake %', type: 'text', line: 1, rules: 'double|required_if:STAKE_MODE,percent' },
        STAKE_FIXED: { name: 'Stake Fixed', type: 'text', line: 1, rules: 'numeric|required_if:STAKE_MODE,fixed' },
        LEVERAGE: { name: 'Leverage', type: 'text', line: 2, rules: 'numeric' },
        SIMULT_RISK_PERCENT: { name: 'Simult Risk %', type: 'text', line: 2, rules: 'double' },
        COST_BUY_PERCENT: { name: 'Buy Comission %', type: 'text', line: 2, rules: 'double' },
        COST_SELL_PERCENT: { name: 'Sell Comission %', type: 'text', line: 2, rules: 'double' },        
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
        TIMEFRAMES: { name: 'Timeframes', component: "v-autocomplete", line: 6,
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
        STRATEGIES: { name: 'Strategies',  component: "v-autocomplete", line: 6,
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
        TAGS: { name: 'Tags', component: "v-tags-input", line: 7, 
            props: {
              avail: this.tags,
              filled: true,
              clearable: true
            } 
        },        
        JSCODE: { name: 'Javascript code', type: 'textarea', line: 9,
            props: {
              filled: true,
              clearable: true
            } 
        }
        };
    },

  },  
}
</script>

<style>
</style> 