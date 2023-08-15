import DAO from "./DAOContract";
import * as XLSX from "xlsx";

export default class ReportDAO extends DAO {
  constructor(workbook: XLSX.WorkBook) {
    super(workbook, 'report')
  }
}
