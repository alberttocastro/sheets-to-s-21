export default {
  methods: {
    // Check if end of string is .xlsx
    isExcelFile (filename) {
      return filename.match(/\.xlsx$/)
    },
  }
}