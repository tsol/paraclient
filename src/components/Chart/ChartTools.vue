<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            dark
            v-bind="attrs"
            v-on="on"
        >
            <v-icon>mdi-cog-outline</v-icon>
        </v-btn>

      </template>

      <v-card>

        <!--
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              >
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>John Leider</v-list-item-title>
              <v-list-item-subtitle>Founder of Vuetify</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                :class="fav ? 'red--text' : ''"
                icon
                @click="fav = !fav"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        -->

<v-container fluid>
    <v-radio-group v-model="cfg.entryMode">
      <template v-slot:label>
        <div>Entries show</div>
      </template>
      <v-radio value="current">
        <template v-slot:label>
          <div>Only current entry</div>
        </template>
      </v-radio>
      <v-radio value="strategy-timeframe">
        <template v-slot:label>
          <div>Only current strategy + timeframe</div>
        </template>
      </v-radio>
      <v-radio value="strategy">
        <template v-slot:label>
          <div>Current strategy/all timeframes</div>
        </template>
      </v-radio>
      <v-radio value="symbol">
        <template v-slot:label>
          <div>All timeframes/strategies</div>
        </template>
      </v-radio>
    </v-radio-group>
  </v-container>

<!--
        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch
                v-model="message"
                color="purple"
              ></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable messages</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch
                v-model="hints"
                color="purple"
              ></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable hints</v-list-item-title>
          </v-list-item>
        </v-list>
-->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="doApply()"
          >
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    config: Object,
  },
  data: () => ({
    menu: false,
    cfg: {
      entryMode: 'current',
    },
  }),
  methods: {
    doApply() {
      this.menu = false;
      this.$emit('apply', this.cfg);
    },
  },
  watch: {
    menu(isOpen) {
      if (!isOpen) { return; }
      this.cfg = { ...this.config };
    },
  },

};
</script>
