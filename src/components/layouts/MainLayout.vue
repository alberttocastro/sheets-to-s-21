<template>
  <!-- Use vuetify to create a template with an application navigator, written the application name and place the content within -->
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Baruque</v-toolbar-title>
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