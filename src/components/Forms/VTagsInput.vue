<template>
<!--:value="value"
    v-on="$listeners"
-->
  <v-text-field
    v-bind="$attrs"
    v-model="textValue"
    @input="input"
    :error-messages="errors"
    :error="isError"
    :error-count="1"
    :value="textValue"
    hide-details="auto"
 />
</template>
<script>
  export default {
    name: 'VTagsInput',
    props: ['value'],
    emits: ['input'],
    inheritAttrs: false,
    data: () => ({
        textValue: '',
        errors: [],
    }),
    computed: {
        isError() {
            return this.errors.length > 0;
        }
    },
    methods: {
        input(v) {
            let o = null
            try {
                o = JSON.parse(v);
                //console.log('input_ok=')
                //console.log(v)
                //console.log(o)
                this.emitResult(o);
                this.errors = [];
            }
            catch (err) {
                //console.log('error=');
                //console.log(err);
                this.errors.push(String(err));
            }
        },
        emitResult(o) {
            //console.log('emitting_input=')
            //console.log(o)
            this.$emit('input', o)
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(value) {
                if (value) {
                    console.log('watcher_value_changed=');
                    console.log(value)
                    this.textValue = JSON.stringify(value);
                }
            },
        },
    },
  }
</script>