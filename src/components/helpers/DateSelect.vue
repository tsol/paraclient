<template>
  <v-datetime-picker
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
    :label="label"
    :text-field-props="{ prependIcon: 'mdi-calendar' }"
    :date-picker-props="{ locale: 'ru-RU' }"
    :time-picker-props="{ format: '24hr' }"
  >
    <template v-slot:dateIcon><v-icon>mdi-calendar</v-icon></template>
    <template v-slot:timeIcon><v-icon>mdi-clock</v-icon></template>
  </v-datetime-picker>
</template>

<script>
export default {
  props: ['value', 'label'],
  emits: ['input'],
};
</script>

<style lang="scss" scoped></style>
