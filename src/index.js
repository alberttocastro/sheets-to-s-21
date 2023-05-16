import { PDFDocument, PDFForm } from 'pdf-lib'
import fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

async function main () {
  let file = fs.readFileSync(process.env.PDFFORMPATH)
  const pdfDoc = await PDFDocument.load(file)
  
  let pages = pdfDoc.getPages()
  // console.log({ page: pages[0].doc })

  let form = pages[0].doc.getForm()
  let field = form.getFields()[0].setText('Hello world')
  console.log({ form })

  let pdfBytes = await pdfDoc.save()

  fs.writeFileSync('./new-file.pdf', pdfBytes)
}

main()