<template>
  <!--:value="value"
    v-on="$listeners"
    hide-details="false"
-->
  <v-text-field
    v-bind="$attrs"
    v-model="textValue"
    :label="inputLabel"
    @input="input"
    :error-messages="errors"
    :error="isError"
    :error-count="1"
    :value="textValue"
  />
</template>
<script>
export default {
  name: 'VTagsInput',
  props: ['value', 'avail'],
  emits: ['input'],
  inheritAttrs: false,
  data: () => ({
    textValue: '',
    errors: [],
    label: null,
  }),
  computed: {
    isError() {
      return this.errors.length > 0;
    },
    inputLabel() {
      return this.label || this.availToString;
    },
    availToString() {
      return Object.keys(this.avail).join(', ');
    },
  },
  methods: {
    input(v) {
      let o = null;
      try {
        o = this.parseValue(v);
        // console.log('input_ok=')
        // console.log(v)
        // console.log(o)
        this.emitResult(o);
        this.errors = [];
      } catch (err) {
        // console.log('error=');
        // console.log('Error: '+String(err));
        this.errors = [String(err)];
      }
    },
    parseValue(str) {
      const res = {};
      if (!str) {
        return res;
      }

      const parts = str.split(/[\s,]+/);

      // eslint-disable-next-line no-restricted-syntax
      for (const p of parts) {
        const [name, value] = p.split(':');

        if (!name) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (!this.avail[name]) {
          throw new Error(`Tag ${name} is not valid`);
        }

        if (!value) {
          this.label = `${name}: ${this.avail[name].desc}`;

          throw new Error(
            `Tag ${name} needs one of these values: ${this.avail[name].vals.join(', ')}`
          );
        }

        if (!this.avail[name].vals.includes(value)) {
          this.label = `${name}: ${this.avail[name].desc}`;

          throw new Error(
            `Value ${value} for tag ${name} is not valid, need: ${this.avail[name].vals.join(', ')}`
          );
        }
        res[name] = value;
      }

      this.label = null;
      // console.log('parsed string ('+str+') = ');
      // console.log(res);

      return res;
    },
    stringifyValue(o) {
      const res = [];
      Object.entries(o).forEach(([tag, value]) => {
        res.push(`${tag}:${value}`);
      });
      return res.join(', ');
    },
    emitResult(o) {
      // console.log('emitting_input=')
      // console.log(o)
      this.$emit('input', o);
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          // console.log('watcher_value_changed=');
          // console.log(value)
          this.textValue = this.stringifyValue(value);
        }
      },
    },
  },
};
</script>
