<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="$emit('click', $event)" v-bind="$attrs" v-on="on">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ hint }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    icon: { type: String },
    hint: { type: String },
  },
  emits: ['click'],
};
</script>

<style lang="scss" scoped></style>
