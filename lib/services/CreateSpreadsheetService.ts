import * as XLSX from 'xlsx'
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import { Readable } from 'stream';
import { Publishers, Reports, Snapshots } from '../consts/ReportsBaseFile'

export default class CreateSpreadsheetService {

  constructor () {
    /* load 'stream' for stream support */
    XLSX.stream.set_readable(Readable);

    /* load the codepage support library for extended support with older formats  */
    XLSX.set_cptable(cpexcel);
  }

  //use the XLSX library and create an excel file
  public createFile() {
    const wb = XLSX.utils.book_new();

    const publishers = XLSX.utils.json_to_sheet(Publishers);
    const reports = XLSX.utils.json_to_sheet(Reports);
    const snapshots = XLSX.utils.json_to_sheet(Snapshots);

    XLSX.utils.book_append_sheet(wb, publishers, "Publicadores");
    XLSX.utils.book_append_sheet(wb, reports, "Relatórios");
    XLSX.utils.book_append_sheet(wb, snapshots, "Resumo");

    return wb
  }

  public writeFile(path: string, wb: XLSX.WorkBook) {
    XLSX.writeFile(wb, path)
  }
}
