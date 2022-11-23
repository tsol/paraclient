<template>
  <div>
    symbols: <b> {{ this.countSymbols }} </b>, gain: <b>{{ this.sumSelectedGain }}</b
    >, win/loose: <b>{{ this.winLooseRatio }}</b>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    field: {
      type: String,
      default: () => 'gain',
    },
  },
  computed: {
    countSymbols() {
      // todo: remake with reduce
      const uniq = {};
      // eslint-disable-next-line no-return-assign
      this.items.forEach((fi) => (uniq[fi.symbol] = 1));
      return Object.keys(uniq).length;
    },
    sumSelectedGain() {
      return this.items.reduce((p, c) => p + c[this.field], 0).toFixed(2);
    },
    winLooseRatio() {
      const win = this.items.reduce((p, c) => p + (c[this.field] > 0 ? 1 : 0), 0);
      const loose = this.items.reduce((p, c) => p + (c[this.field] < 0 ? 1 : 0), 0);

      let ratio = 0;
      if (win > 0) {
        ratio = (win / (win + loose)) * 100;
      }

      return `${win} / ${loose} = ${ratio.toFixed(2)}`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
