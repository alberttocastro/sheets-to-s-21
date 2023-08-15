import SpreadsheetService from "./SpreadsheetService";
import { PublisherDAO, ReportDAO } from '../DAO';
import * as XLSX from "xlsx";

export class DatabaseService {
  private static instance: DatabaseService;
  private path: string;
  private workbook: XLSX.WorkBook;

  private constructor(path: string) {
    this.path = path;
    let service = new SpreadsheetService(this.path);

    this.workbook = service.getWorkbook();
  }

  public static getInstance(path: string): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(path);
    }

    return DatabaseService.instance;
  }

  public getTable(table: string) {
    switch (table) {
      case "Publisher":
        return new PublisherDAO(this.workbook);
      case "Report":
        return new ReportDAO(this.workbook);
      default:
        throw new Error("Invalid table name");
    }
  }
}