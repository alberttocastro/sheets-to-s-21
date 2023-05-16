import { PDFDocument } from 'pdf-lib'
import Excel from 'exceljs'
import fs from 'fs'
import * as dotenv from 'dotenv'

import * as XLSX from 'xlsx/xlsx.mjs';

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);

dotenv.config()

const OUTPUT_PATH = process.env.OUTPUTPATH

async function main () {
  let file = fs.readFileSync(process.env.PDFFORMPATH)
  const pdfDoc = await PDFDocument.load(file)
  
  let pages = pdfDoc.getPages()

  let form = pages[0].doc.getForm()
  let field = form.getFields()[0].setText('Hello world')
  console.log({ form })

  let pdfBytes = await pdfDoc.save()

  let exists = fs.existsSync(`./${OUTPUT_PATH}`)

  if (!exists) {
    fs.mkdirSync(`./${OUTPUT_PATH}`)
  }

  fs.writeFileSync(`${OUTPUT_PATH}/new-file.pdf`, pdfBytes)
}

async function openExcel () {
  let file = XLSX.readFileSync('tmp/reports.xlsx')

  let reports = file.Sheets['Relatórios']

  let cell = reports['A2'].w

  console.log({ cell })
}

// main()
openExcel()