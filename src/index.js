import { PDFDocument, PDFForm } from 'pdf-lib'
import fs from 'fs'
import * as dotenv from 'dotenv'

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

main()