import { PDFDocument, PDFForm } from 'pdf-lib'
import fs from 'fs'

async function main () {
  let file = fs.readFileSync('./S-21_T.pdf')
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