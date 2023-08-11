<template>
  <div>
    <h1>Welcome to the Vue.js app</h1>
    <v-file-input truncate-length="15" v-model="file" @change="logFile"></v-file-input>
    <v-btn @click="saveFileToLocalStorage">Save</v-btn>
    <v-btn @click="createNewFile">Create a new file</v-btn>
  </div>
</template>


<script lang="ts">
import Electron from "electron";
import CreateSpreadsheetService from "../../lib/services/CreateSpreadsheetService";

import Vue from 'vue';

export default Vue.extend({
  name: "HomePage",

  data() {
    return {
      file: null,
    };
  },

  methods: {
    logFile() {
      console.log({file: this.file});
    },
    saveFileToLocalStorage() {
      if (!this.file) {
        return;
      }
      localStorage.setItem("file", this.file['path']);
    },
    createNewFile() {
      // Create new file with the desired layout
      const createSpreadsheetService = new CreateSpreadsheetService();

      let workbook = createSpreadsheetService.createFile();
      console.log({ workbook })

      const dialog = Electron.remote.dialog;
      const browserWindow = Electron.remote.getCurrentWindow();

      dialog.showSaveDialog(
        browserWindow,
        {
          title: "Save base file",
          defaultPath: "C:\\Users\\User\\Desktop\\test.xlsx",
          filters: [
            {
              name: "Excel",
              extensions: ["xlsx"],
            },
          ],
        }
      );
    }
  }
})
</script>