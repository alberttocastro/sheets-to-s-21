<template>
  <div>
    <h1>Now this is your home</h1>
  </div>
</template>

<script lang="ts">

import SpreadsheetService from "../../lib/services/SpreadsheetService";
import Vue from "vue";

export default Vue.extend({
  name: "HomePage",

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
