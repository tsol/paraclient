<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Chart</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <p>Chart Here</p>
        
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
/*
    components: { TradingVue },
    props: {
      tickerId: String,
      moveTo: null,
      toggleOn: Array,
      overrideFlags: null
  },*/ 
    data: () => ({
        dialog: false
    }),
}
</script>

