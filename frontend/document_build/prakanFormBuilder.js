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
    `${data.fnameEN} ${data.lnameEN}`,
    190,
    height - 135
  );
  drawTextOnPage(firstPage, String(stdAge), 490, height - 135);
  drawTextOnPage(firstPage, data.presentAddress, 123, height - 155);
  drawTextOnPage(firstPage, "-", 140, height - 173);
  drawTextOnPage(firstPage, "Student", 396, height - 173);
  drawTextOnPage(firstPage, data.phone_num, 454, height - 192);
  drawTextOnPage(firstPage, data.hospitalName, 196, height - 303);
  drawTextOnPage(firstPage, data.hospitalProvince, 350, height - 303);
  drawTextOnPage(firstPage, data.hospitalPhoneNumber, 462, height - 303);
  if (data.claimType === "accident") {
    drawTextOnPage(
      firstPage,
      convertDateFormat(data.accidentDate),
      155,
      height - 342
    );
    drawTextOnPage(firstPage, data.accidentTime, 253, height - 342);
    drawTextOnPage(firstPage, data.accidentCause, 165, height - 363);
    drawTextOnPage(
      firstPage,
      convertDateFormat(data.hospitalAmittedDate),
      270,
      height - 386
    );
    drawTextOnPage(
      firstPage,
      convertDateFormat(data.hospitalDischargedDate),
      435,
      height - 386
    );
  } else if (data.claimType === "illness") {
    drawTextOnPage(
      firstPage,
      convertDateFormat(data.hospitalAmittedDate),
      270,
      height - 420
    );
    drawTextOnPage(
      firstPage,
      convertDateFormat(data.hospitalDischargedDate),
      435,
      height - 420
    );
  }
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(
    "public/documents/prakan-inter/Health-claim-form-filled.pdf",
    pdfBytes
  );
}
module.exports = { prakanFormBuilder };
