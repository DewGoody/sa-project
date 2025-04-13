const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const fontkit = require("fontkit");
var ageCalculator = require("age-calculator");
let { AgeFromDateString } = require("age-calculator");
const fontPath = path.resolve(
  process.cwd(),
  "public/fonts/THSarabunNew/THSarabunNew.ttf"
);
let font;
try {
  font = fs.readFileSync(fontPath, "base64");
} catch (error) {
  console.error(`Error reading font file: ${error.message}`);
  process.exit(1);
}
async function prakanFormBuilder(data) {
  console.log(data);
  const pdfPath = path.resolve(
    process.cwd(),
    "public/documents/prakan-inter/Health-claim-form.pdf"
  );
  console.log(pdfPath);
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = fs.readFileSync(fontPath);
  const thSarabunFont = await pdfDoc.embedFont(fontBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  const convertDateFormat = (dateString) => {
    // Split the input date string by the hyphen (-) to get year, month, and day
    const [year, month, day] = dateString.split("-");
    const buddhistYear = Number(year) + 543;
    // Return the date in the desired format
    return `${day}/${month}/${buddhistYear}`;
  };
  let stdAge = new AgeFromDateString(data.bd).age;
  const drawTextOnPage = (
    page,
    text,
    x,
    y,
    font = thSarabunFont,
    size = 14,
    color = rgb(0, 0, 0)
  ) => {
    if (text !== undefined && text !== null) {
      page.drawText(String(text), {
        x,
        y,
        size,
        font,
        color,
      });
    }
  };
  drawTextOnPage(
    firstPage,
    data.title + " " + data.fnameEN + " " + data.lnameEN,
    145,
    height - 135,
    thSarabunFont,
    14
  );
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(
    "public/documents/prakan-inter/" + data.Student.id + "_Health_claim.pdf",
    pdfBytes
  );
  return (
    "public/documents/prakan-inter/" + data.Student.id + "_Health_claim.pdf"
  );
}
module.exports = { prakanFormBuilder };
