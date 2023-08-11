<template>
  <div>
    <h1>Welcome</h1>
    <v-file-input
      truncate-length="15"
      v-model="file"
      @change="logFile"
    ></v-file-input>
    <v-btn @click="saveFileToLocalStorage">Save</v-btn>
    <v-btn @click="createNewFile">Create a new file</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Electron from "electron";
import CreateSpreadsheetService from "../../lib/services/CreateSpreadsheetService";
import { SaveDialogReturnValue } from "electron/main";
import { utils } from "@/mixins"
export default Vue.extend({
  mixins: [utils],

  data() {
    return {
      file: null,
    };
  },

  methods: {
    logFile() {
      console.log({ file: this.file });
    },
    saveFileToLocalStorage() {
      // If there is no file, do nothing
      if (!this.file) {
        return;
      }

      // If the file is not an excel file, do nothing
      if (this.isExcelFile(this.file["name"])) {
        return;
      }

      localStorage.setItem("file", this.file["path"]);
      this.$router.push({ name: "home" });
    },
    createNewFile() {
      // Create new file with the desired layout
      const createSpreadsheetService = new CreateSpreadsheetService();

      let workbook = createSpreadsheetService.createFile();
      console.log({ workbook });

      const dialog = Electron.remote.dialog;
      const browserWindow = Electron.remote.getCurrentWindow();

      dialog
        .showSaveDialog(browserWindow, {
          title: "Save base file",
          defaultPath: "test.xlsx",
          filters: [
            {
              name: "Excel",
              extensions: ["xlsx"],
            },
          ],
        })
        .then((saveDialogReturnValue: SaveDialogReturnValue) => {
          if (saveDialogReturnValue.filePath) {
            createSpreadsheetService.writeFile(
              saveDialogReturnValue.filePath,
              workbook
            );
            console.log("File saved");
          }
        });
    },
  }
})
</script>
