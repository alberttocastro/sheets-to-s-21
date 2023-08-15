import * as XLSX from "xlsx";

interface Query {
  property: string;
  value: any;
}

export default abstract class DAO {
  private table: string | undefined;
  private workbook: XLSX.WorkBook;
  private queries: Query[] = [];

  constructor(workbook: XLSX.WorkBook, table: string | undefined = undefined) {
    this.workbook = workbook;
    this.table = table;
  }

  public all() {
    // check if table is null
    if (!this.table) {
      throw new Error("Table name is null");
    }

    // check if table exists
    if (!this.workbook.Sheets[this.table]) {
      throw new Error("Table does not exist");
    }

    return XLSX.utils.sheet_to_json(this.workbook.Sheets[this.table]);
  }

  public query(query: Query): typeof self {
    this.queries.push(query);
    return self;
  }

  public executeQuery() {
    // check if table is null
    if (!this.table) {
      throw new Error("Table name is null");
    }

    // check if table exists
    if (!this.workbook.Sheets[this.table]) {
      throw new Error("Table does not exist");
    }

    let data = XLSX.utils.sheet_to_json(this.workbook.Sheets[this.table]);

    // check if there are any queries
    if (this.queries.length == 0) {
      return data;
    }

    // filter data
    data = data.filter((row: any) => {
      let valid = true;

      this.queries.forEach((query) => {
        if (row[query.property] != query.value) {
          valid = false;
        }
      });

      return valid;
    })

    return data;
  }

  public insert(values: any) {
    let data = this.all()

    // get headers
    values = this.sanitizeValues(Object.keys(data[0]), values);

    // add new row to data
    data.push(values);

    if (!this.table) {
      throw new Error("Table name is null");
    }

    // write data to sheet
    this.workbook.Sheets[this.table] = XLSX.utils.json_to_sheet(data);
  }

  private sanitizeValues(headers: string[], values: any): any {
    // check if all headers are present
    Object.keys(values).forEach((key) => {
      if (!headers.includes(key)) {
        throw new Error(`Header ${key} does not exist`);
      }
    });

    return values;
  }
}