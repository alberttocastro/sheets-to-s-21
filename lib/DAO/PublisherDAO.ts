import DAO from "./DAOContract";
import * as XLSX from "xlsx";

export default class PublisherDAO extends DAO {
  constructor(workbook: XLSX.WorkBook) {
    super(workbook, "publisher");
  }
}
