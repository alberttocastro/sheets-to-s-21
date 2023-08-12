<template>
  <main-layout>
    <!-- Create a page using vuetify with a title saying "this is where you can manage your congregation", and a button saying "add publisher" -->
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>This is where you can manage your congregation</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" @click="addPublisher">Add publisher</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </main-layout>
</template>

<script lang="ts">
import Vue from "vue";
import SpreadsheetService from "../../lib/services/SpreadsheetService";

import { MainLayout } from "@/components/layouts";

export default Vue.extend({
  name: "HomePage",

  components: {
    MainLayout,
  },

  // This is a Vue Router hook
  beforeRouteEnter(to, from, next) {
    const file = localStorage.getItem("file");

    // If there is no file in the local storage, do nothing
    if (!file) {
      next({ name: "welcome" });
      return;
    }

    // If the file is not an excel file, do nothing
    if (!file.match(/\.xlsx$/)) {
      localStorage.removeItem("file");
      next({ name: "welcome" });
      return;
    }

    // If the file is an excel file, create a new SpreadsheetService
    new SpreadsheetService(file);
    // And go to the home page
    next();
  },
});
</script>
