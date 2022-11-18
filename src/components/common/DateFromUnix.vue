<template>
  <div>{{ dateFromUnix }}</div>
</template>

<script>
import { dateFromUnix } from '../../common/common';

export default {
  props: {
    timestamp: {
      type: Number,
      default: null,
    },
  },
  computed: {
    dateFromUnix() {
      const { timestamp } = this;
      return timestamp > 0 ? dateFromUnix(timestamp) : '-';
    },
  },
};
</script>

<style scoped></style>
