<template>
<div>
        <div class="green--text" v-if="value > greenAbove">
        {{ value }}
        </div>
        <div class="red--text" v-else>
        {{ value }}
        </div>
</div>
</template>

<script>

export default {
  components: { },
  props: {
    greenAbove: Number,
    value: Number,
  },
  data: () => ({
  }),
  methods: {
  },
  mounted() {
  },
  computed: {
  },
};
</script>

<style>
</style>
