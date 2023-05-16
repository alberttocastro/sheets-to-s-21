import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

const TOTAL_FIELDS = 95

const MAP_INFO = {
  'name': 0,
  'birth': 7,
  'baptism': 14,
  'male': 21,
  'female': 28,
  'otherSheep': 35,
  'anointed': 42,
  'elder': 49,
  'ministerialServant': 56,
  'pioneer': 63,
  'serviceYear': 70,
  'september': 1,
  'october': 8,
  'november': 15,
  'december': 22,
  'january': 29,
  'february': 36,
  'march': 43,
  'april': 50,
  'may': 57,
  'june': 64,
  'july': 71,
  'august': 77,
  'total': 83,
  'average': 89
}

const MAP_REPORT_ORDER = [
  'literature',
  'videos',
  'hours',
  'returnVisits',
  'bibleStudies',
  'observation'
]

const INDEX_TO_MONTH = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

async function arquivoBaseComInformacoesDoPublicador (publicador) {
  let parsedInfo = parseInfo(publicador)
  let file = fs.readFileSync(process.env.PDFFORMPATH)
  const pdfDoc = await PDFDocument.load(file)

  let page = pdfDoc.getPage(0)
  let form = page.doc.getForm()

  let fields = form.getFields()

  for (let [key, value] of Object.entries(parsedInfo)) {
    let fieldIndex = MAP_INFO[key]
    let field = fields[fieldIndex]
    
    if (typeof value === 'boolean') {
      value ? field.check() : field.uncheck()
      continue
    }

    field.setText(value)
  }

  return pdfDoc
}

function parseInfo (publicador) {
  let dateTimeFormatOptions = {
    dateStyle: 'short'
  }
  return {
    name: publicador['Publicadores'],
    birth: (new Date(publicador['Nascimento'])).toLocaleString('pt-BR', dateTimeFormatOptions),
    baptism: (new Date(publicador['Batismo'])).toLocaleString('pt-BR', dateTimeFormatOptions),
    male: publicador['Homem?'] ?? false,
    female: publicador['Homem?'] ? !publicador['Homem?'] : true,
    otherSheep: publicador['Participa Emplemas?'] ? !publicador['Participa Emplemas?'] : true,
    anointed: publicador['Participa Emplemas?'] ?? false,
    elder: publicador['Ancião?'] ?? false,
    ministerialServant: publicador['Servo Ministerial?'] ?? false,
    pioneer: publicador['Pioneiro Regular?'] ?? false
  }
}

/**
 * @param {PDFDocument} pdfDoc
 */
async function adicionarHorasAoArquivo(pdfDoc, publicador) {
  let years = Object.keys(publicador.reports)
  let docs = [pdfDoc]

  for (let qtdPaginas = 1; qtdPaginas < years.length; qtdPaginas ++) {
    let newDoc = await PDFDocument.load(await pdfDoc.save())
    docs.push(newDoc)
  }
  
  // pdfDoc = await PDFDocument.load(await pdfDoc.save())
  pdfDoc.getForm().updateFieldAppearances()
  // console.log({ pdfDoc, formFields: pdfDoc.getForm().getFields() })
  years.sort()

  // console.log({ })
  for (let id in years) {
    addYearToFile(years[id], publicador.reports[years[id]], docs[id].getForm().getFields(), 0)
  }

  return pdfDoc
}

async function addYearToFile (year, reports, fields, page) {
  page = Number.parseInt(page)
  let initialFormElement = page * TOTAL_FIELDS
  initialFormElement = Number.parseInt(initialFormElement)
  fields[initialFormElement + MAP_INFO['serviceYear']].setText(year)

  for (let report of reports) {
    let orderedReport = [
      report['Publicações'] ?? null,
      report['Vídeos'] ?? null,
      report['Horas'] ?? null,
      report['Revisitas'] ?? null,
      report['Estudos Bíblicos'] ?? null,
      report['Observações'] ?? null
    ]

    let month = (new Date(report['Mês e Ano'])).getMonth()
    let monthStart = MAP_INFO[INDEX_TO_MONTH[month]]

    for (let i in orderedReport) {
      let value = orderedReport[i]

      // console.log({ year, page, month, monthStart, dx: initialFormElement + monthStart + Number.parseInt(i), len: fields.length })
      if (value != null) fields[initialFormElement + monthStart + Number.parseInt(i)].setText(String(value))
    }
  }
}

export default async function criarArquivo(publicador) {
  let pdfDoc = await arquivoBaseComInformacoesDoPublicador(publicador)
  let docs = await adicionarHorasAoArquivo(pdfDoc, publicador)

  let exists = fs.existsSync(`./${process.env.OUTPUTPATH}`)

  if (!exists) {
    fs.mkdirSync(`./${process.env.OUTPUTPATH}`)
  }

  fs.writeFileSync(`${process.env.OUTPUTPATH}/${publicador['Publicadores']}.pdf`, await pdfDoc.save())
}