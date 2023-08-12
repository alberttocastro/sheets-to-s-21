<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Baruque</v-toolbar-title>
      <!-- Adds the following options the the app bar: publishers, reports -->
      <v-btn text to="/publishers">Publishers</v-btn>
      <v-btn text to="/reports">Reports</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MainLayout",
});
</script>