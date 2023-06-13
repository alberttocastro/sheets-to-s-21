import { PDFDocument, PDFTextField, PDFCheckBox } from "pdf-lib"
import Publisher from "../models/Publisher.ts"
import * as fs from 'fs'
import ServiceYear from "../models/ServiceYear.ts"
import MAP_INFO from '../consts/fieldMapInfo.ts'
import INDEX_TO_MONTH from '../consts/indexToMonth.ts'
import * as dotenv from 'dotenv'
dotenv.config()


export default class PdfService {
  private publishers: Map<string, Publisher>

  constructor (publishers: Map<string, Publisher>) {
    this.publishers = publishers
  }

  public async generateFiles(publisherName: string): Promise<void> {
    if (publisherName === null) {
      return this.generateFilesForAll()
    }

    return this.generateFileForPublisher(this.publishers.get(publisherName))
  }

  public generateFilesForAll(): void {
    this.publishers.forEach((publisher: Publisher) => {
      this.generateFileForPublisher(publisher)
    })
  }

  private async generateFileForPublisher(publisher: Publisher): Promise<void> {
    let basicDocument: PDFDocument = await this.generateBasicFile(publisher)
    let documents: Map<string, PDFDocument> = await this.addHoursToFile(basicDocument, publisher)

    for (let year of Array.from(documents.keys())) {
      const document = documents.get(year)

      this.saveFile(document, `${publisher.name} - ${year}`)
    }
  }

  private async generateBasicFile(publisher: Publisher): Promise<PDFDocument> {
    let file = fs.readFileSync(process.env.PDFFORMPATH)
    const pdfDoc = await PDFDocument.load(file)

    let page = pdfDoc.getPage(0)
    let form = page.doc.getForm()

    let fields = form.getFields()

    for (let [key, value] of Object.entries(publisher)) {
      let fieldIndex = MAP_INFO[key]
      /** @type {PDFCheckBox|PDFTextField} */
      let field = fields[fieldIndex]
      
      if (field instanceof PDFCheckBox) {
        value ? field.check() : field.uncheck()
        continue
      }

      if (field instanceof PDFTextField && typeof value === 'number') {
        field.setText(String(value))
      }
    }

    return pdfDoc
  }

  private async addHoursToFile(pdfDocument: PDFDocument, publisher: Publisher): Promise<Map<string, PDFDocument>> {
    if (publisher.years.size === 0) {
      console.error('Publicador sem relatórios', { publisher })
      return
    }

    let docs: Map<string, PDFDocument> = new Map()
    let keys = publisher.years.keys()

    for(const key of keys) {
      docs.set(key, await PDFDocument.load(await pdfDocument.save()))
    }
    
    // pdfDocument = await PDFDocument.load(await pdfDocument.save())
  
    // let addedFields = []
    for (let [year, reports] of Array.from(publisher.years)) {
      let fields = docs.get(year).getForm().getFields()
      // let newFields = await this.addYearToFile(year, reports, fields)
      await this.addYearToFile(year, reports, fields)
  
      // if (id == 0) continue
      // addedFields = [...addedFields, ...newFields]
      // addedFields.concat(newFields)
    }
  
    // for (let id in docs.entries()) {
    //   if (Number.parseInt(id) == 0) continue
    //   let doc = docs[id]
  
    //   doc = await PDFDocument.load(await docs[id].save())
    //   let docFields = doc.getForm().getFields()
  
    //   let [page] = await docs[0].copyPages(doc, [0])
    //   docs[0].addPage(page)
    // }
  
    return docs
  }

  private async addYearToFile (year: string, serviceYear: ServiceYear, fields: any[]) {
    fields[MAP_INFO['serviceYear']].setText(year ?? '')
    let addedFields = []

    for (let index in serviceYear.reports) {
      let report = serviceYear.reports[index]
  
      let orderedReport = [
        report.literatures ?? null,
        report.videos ?? null,
        report.hours ?? null,
        report.visits ?? null,
        report.studies ?? null,
        report.notes ?? null
      ]

      let month = (new Date(report.month)).getMonth()
      let monthStart = MAP_INFO[INDEX_TO_MONTH[month]]
  
      for (let i in orderedReport) {
        let value = orderedReport[i]
        if (value == null) continue
  
        let field = fields[monthStart + Number.parseInt(i)]
  
        field.acroField.setPartialName(`${field.getName()}${Math.random() * 100}`)
        field.setText(String(value) ?? '')
  
        addedFields.push(field)
      }
    }

    let sumAvgFields = this.addSumAndAverage(serviceYear.getAverage(), serviceYear.getTotals(), fields)
    addedFields = [...addedFields, ...sumAvgFields]
  
    return addedFields
  }

  private addSumAndAverage (average: object, totals: object, fields: any[]): any[] {
    let addedFields = []
  
    let orderedAverage = [
      average['literatures'] ?? null,
      average['videos'] ?? null,
      average['hours'] ?? null,
      average['visits'] ?? null,
      average['studies'] ?? null
    ]

    let orderedTotals = [
      totals['literatures'] ?? null,
      totals['videos'] ?? null,
      totals['hours'] ?? null,
      totals['visits'] ?? null,
      totals['studies'] ?? null
    ]

    let sumIndex = MAP_INFO['total']
    let avgIndex = MAP_INFO['average']
    for (let i = 0; i < 5; i++) {
      let sumField = fields[sumIndex + i]
      let avgField = fields[avgIndex + i]
  
      sumField.acroField.setPartialName(`${sumField.getName()}${Math.random() * 100}`)
      let sumValue = orderedTotals[i]
      if (sumValue > 0)
        sumField.setText(String(sumValue))
  
      avgField.acroField.setPartialName(`${avgField.getName()}${Math.random() * 100}`)
      let avgValue = orderedAverage[i]
      if (avgValue > 0)
        avgField.setText(String(avgValue))

      addedFields.push(sumField, avgField)
    }
  
    return addedFields
  }

  async saveFile (pdfDocument: PDFDocument, name: string) {
    let fullpath = `${process.env.OUTPUTPATH}/${name}.pdf`
    let exists = fs.existsSync(`./${process.env.OUTPUTPATH}`)
  
    if (!exists) {
      fs.mkdirSync(`./${process.env.OUTPUTPATH}`)
    }
  
    fs.writeFileSync(fullpath, await pdfDocument.save({ updateFieldAppearances: true }))
  
    return fullpath
  }
}