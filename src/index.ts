import { SpreadsheetService } from "./services/SpreadsheetService.ts";
import { ReportsService } from "./services/ReportsService.ts";
import PdfService from "./services/PdfService.ts";

let spreadsheetService: SpreadsheetService = new SpreadsheetService('tmp/reports.xlsx')

let reports: object[]|null = spreadsheetService.getSheetAsJson('Relatórios')
let publishers: object[]|null = spreadsheetService.getSheetAsJson('Publicadores')

if (reports == null || publishers == null) {
  console.error('Reports or Publishers sheets not found.')
  process.abort()
}

let reportsService: ReportsService = new ReportsService(publishers)
reportsService.addReportsToPublishers(reports)

let pdfService: PdfService = new PdfService(reportsService.getPublishers())

pdfService.generateFiles()
