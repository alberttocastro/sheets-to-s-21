<!-- Create a vue file with a big welcome in the middle of the screen -->
<template>
  <!-- create an input to upload a file -->
  <div>
    <h1>Welcome to the Vue.js app</h1>
    <input type="file" />
  </div>
</template>

<style>

</style>

<script>
// Get the file from the input and save in a temporary folder
export default {
  name: 'App',
  data() {
    return {
      file: null
    }
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
  }
}
</script>