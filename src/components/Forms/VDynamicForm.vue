<template>
  <v-card>
    <!--
    <v-card-title>
    Hello
    </v-card-title>
 -->

    <validation-observer v-slot="{ invalid }" ref="observer" class="w-full max-w-lg">
      <form @submit.prevent="submit">
        <v-card-text>
          <div class="v-dynamic-form--inputs">
            <div v-for="(fields, i) in lines" :key="`line-${i}`">
              <component :is="fields.length > 1 ? 'v-row' : 'div'">
                <component
                  :is="fields.length > 1 ? 'v-col' : 'div'"
                  v-for="field in fields"
                  :key="`line-${i}--${field.input}`"
                  v-bind="field.col"
                  v-show="!field.hidden"
                >
                  <div
                    v-if="!field.hideName"
                    class="v-dynamic-form--input-subtitle text-subtitle-2 mb-1"
                  >
                    {{ field.name }}
                  </div>
                  <slot :name="`field:validation:${field.input}`" v-bind="field">
                    <validation-provider
                      v-slot="{ errors }"
                      :name="field.name"
                      :rules="field.rules"
                      :vid="field.vid || field.input"
                    >
                      <slot :name="`field:${field.input}`" v-bind="{ ...field, errors, invalid }">
                        <component
                          :is="getComponent(field)"
                          v-model="form[field.input]"
                          v-bind="field.props"
                          :error-messages="errors"
                          :disabled="loading || disabled || field.props.disabled"
                          :readonly="readonly || field.props.readonly"
                        ></component>
                      </slot>
                    </validation-provider>
                  </slot>
                </component>
              </component>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <slot v-if="!hideActions" name="actions" v-bind="{ submit, clear, invalid }">
            <div class="v-dynamic-form--actions">
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading || disabled || invalid"
                @click="submit"
                >Submit</v-btn
              >

              <v-btn @click="cancel" class="ml-2">Cancel</v-btn>

              <!--            <v-btn @click="clear" class="ml-2">Clear</v-btn> -->
            </div>
          </slot>
        </v-card-actions>
      </form>

      <!-- dummy state propergate -->
      <state-buffer :invalid="invalid" v-on="$listeners" />
    </validation-observer>
  </v-card>
</template>

<script>
// import { setInteractionMode } from 'vee-validate';
// setInteractionMode("eager");

/*
import * as rules from 'vee-validate/dist/rules';
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});
*/

import {
  required,
  // eslint-disable-next-line camelcase
  required_if,
  email,
  numeric,
  double,
} from 'vee-validate/dist/rules';

import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';

import {
  VTextField,
  VSelect,
  VCheckbox,
  VSlider,
  VRangeSlider,
  VSwitch,
  VTextarea,
  VAutocomplete,
  VRadio,
  VCol,
  VRow,
} from 'vuetify/lib';

import { get, pick, startCase, max, chain } from 'lodash';

import VTagsInput from './VTagsInput.vue';

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
});

extend('required_if', {
  // eslint-disable-next-line camelcase
  ...required_if,
  message: '{_field_} can not be empty in this mode',
});

extend('email', {
  ...email,
  message: '{_field_} must be an email address',
});

extend('numeric', {
  ...numeric,
  message: '{_field_} must be an integer',
});

extend('double', {
  ...double,
  message: '{_field_} must contain floating point',
});

const StateBuffer = {
  name: 'StateBuffer',
  props: ['invalid'],
  watch: {
    invalid(value) {
      this.$emit('update:valid', !value);
    },
  },
  render() {
    return 'span';
  },
};

export default {
  name: 'VDynamicForm',
  props: {
    value: {},
    hideName: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    hideActions: { type: Boolean, default: false },
    defaults: { type: Object, default: () => ({}) },
    inputFields: { type: Object, default: () => ({}) },
    valid: Boolean,
  },
  components: {
    StateBuffer,
    VTextField,
    VSelect,
    VCheckbox,
    VSlider,
    VRangeSlider,
    VSwitch,
    VTextarea,
    VRadio,
    ValidationProvider,
    ValidationObserver,
    VCol,
    VRow,
    VAutocomplete,
    VTagsInput,
  },
  computed: {
    form: {
      set(value) {
        this.$emit('input', value);
      },
      get() {
        return this.value || this.defaults;
      },
    },
    lines() {
      const items = Object.entries(this.inputFields).map(([field, options]) => ({
        ...options,
        name: options.name || startCase(field),
        input: field,
        rules: options.rules || '',
        mode: options.mode || 'aggressive',
        hideName: this.hideName || options.hideName || options['hide-name'],
        props: options.props || {},
      }));
      const n = max(items.map((item) => item.line || 0));
      return chain(items)
        .map((item, i) => {
          if (item.line === undefined) {
            // eslint-disable-next-line no-param-reassign
            item.line = n + i;
          } else {
            // eslint-disable-next-line no-param-reassign
            item.line += n;
          }

          return item;
        })
        .sortBy('line')
        .groupBy('line')
        .value();
    },
  },
  methods: {
    getComponent({ type, component }) {
      if (component) return component;
      if (type === 'text') return 'v-text-field';
      if (type === 'select') return 'v-select';
      if (type === 'checkbox') return 'v-checkbox';
      if (type === 'slider') return 'v-slider';
      if (type === 'range-slider') return 'v-range-slider';
      if (type === 'switch') return 'v-switch';
      if (type === 'textarea') return 'v-textarea';
      if (type === 'radio') return 'v-radio';
      return 'input';
    },
    loadDataFrom(data) {
      this.form = {
        ...(this.form || {}),
        ...pick(data, Object.keys(this.inputFields)),
      };
    },
    async submit() {
      if (this.$refs.observer) {
        const valid = await this.$refs.observer.validate();
        if (valid) {
          this.$emit('submit', this.form);
        }
      }
    },
    cancel() {
      this.$emit('cancel', this.form);
    },
    clear() {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const field in this.form || {}) {
        this.form[field] = get(this.defaults, field);
      }
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-dynamic-form--input-subtitle + span,
.v-dynamic-form--input-subtitle + div {
  .v-input.v-input--selection-controls {
    margin-top: 0;
  }
}
</style>
