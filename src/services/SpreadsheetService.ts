import * as fs from 'fs'
import * as XLSX from 'xlsx'
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import { Readable } from 'stream';

export class SpreadsheetService {
  private path: string;
  private workbook: XLSX.WorkBook;

  constructor (path: string) {
    this.path = path

    /* load 'fs' for readFile and writeFile support */
    XLSX.set_fs(fs);

    /* load 'stream' for stream support */
    XLSX.stream.set_readable(Readable);

    /* load the codepage support library for extended support with older formats  */
    XLSX.set_cptable(cpexcel);

    this.workbook = XLSX.readFile(this.path, { cellDates: true })
  }

  public getSheetAsJson(sheetName: string): object[]|null {
    let sheet: XLSX.Sheet = this.workbook.Sheets[sheetName]

    if (sheet == null) return null

    return XLSX.utils.sheet_to_json(sheet)
  }
}