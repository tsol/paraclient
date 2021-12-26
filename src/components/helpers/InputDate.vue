<template>
    <v-menu
        v-model="menuOpen"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="inputValue"
                :label="label"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                v-bind="attrs"
                v-on="on"
                @click:clear="emitValue('');"
            ></v-text-field>
        </template>
        
        <v-date-picker
            locale="ru-RU"
            v-model="inputValue"
            @input="emitValue(inputValue)"
        ></v-date-picker>
    </v-menu>
</template>

<script>

export default {
  components: { },
  props: {
    id: String,
    label: String,
    defaultValue: String
  },
  data: () => ({
    menuOpen: false,
    inputValue: null
  }),
  methods: {
    emitValue(valueToEmit) {
      this.$emit('dateSelected', { id: this.id, value: valueToEmit });
      this.menuOpen = false;
    }
  },
  mounted() {
    this.inputValue = this.defaultValue;
  },
  computed: {
  }
}
</script>

<style>
</style>