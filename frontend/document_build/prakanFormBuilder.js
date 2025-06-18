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
  const convertDateFormat = (isoDateString) => {
    if (!isoDateString) return ""; // Return an empty string if the input is null or undefined

    // Parse the ISO date string into a JavaScript Date object
    const date = new Date(isoDateString);

    // Ensure the date is valid
    if (isNaN(date)) {
      console.error(`Invalid date: ${isoDateString}`);
      return "";
    }

    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
    const year = date.getFullYear();


    // Return the formatted date
    return `${day}/${month}/${year}`;
  };
  const stu_id = String(data.Student.id);
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
    data.title + " " + data.Student.fnameEN + " " + data.Student.lnameEN,
    145,
    height - 135,
    thSarabunFont,
    14
  );
  drawTextOnPage(firstPage, stu_id[0], 400, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[1], 415, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[2], 430, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[3], 450.5, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[4], 465.5, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[5], 480.5, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[6], 495.5, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[7], 510.5, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[8], 529, height - 135, thSarabunFont, 14);
  drawTextOnPage(firstPage, stu_id[9], 544, height - 135, thSarabunFont, 14);
  drawTextOnPage(
    firstPage,
    data.Student.facultyNameEN,
    170,
    height - 162,
    thSarabunFont,
    14
  );
  drawTextOnPage(
    firstPage,
    data.phone_num,
    160,
    height - 190,
    thSarabunFont,
    14
  );
  drawTextOnPage(firstPage, data.email, 385, height - 190, thSarabunFont, 14);
  drawTextOnPage(
    firstPage,
    data.hospitalName,
    170,
    height - 218,
    thSarabunFont,
    14
  );
  drawTextOnPage(
    firstPage,
    data.hospitalName2 ? data.hospitalName2 : "",
    382,
    height - 218,
    thSarabunFont,
    14
  );
  drawTextOnPage(
    firstPage,
    data.treatmentType === "inpatient" ? "/" : "",
    55,
    height - 267,
    thSarabunFont,
    24
  );
  drawTextOnPage(
    firstPage,
    data.treatmentType === "outpatient" ? "/" : "",
    55,
    height - 294,
    thSarabunFont,
    24
  );
  if (data.treatmentType === "inpatient") {
    drawTextOnPage(
      firstPage,
      convertDateFormat(data.IPDAmittedDate),
      270,
      height - 267,
      thSarabunFont,
      14
    );
    drawTextOnPage(
      firstPage,
      convertDateFormat(data.IPDDischargedDate),
      475,
      height - 267,
      thSarabunFont,
      14
    );
  }
  if (data.treatmentType === "outpatient") {
    drawTextOnPage(
      firstPage,
      data.OPDTreatmentDate1 ? convertDateFormat(data.OPDTreatmentDate1) : "",
      291,
      height - 295,
      thSarabunFont,
      14
    );
    drawTextOnPage(
      firstPage,
      data.OPDTreatmentDate2 ? convertDateFormat(data.OPDTreatmentDate2) : "",
      460,
      height - 295,
      thSarabunFont,
      14
    );
    drawTextOnPage(
      firstPage,
      data.OPDTreatmentDate3 ? convertDateFormat(data.OPDTreatmentDate3) : "",
      125,
      height - 322,
      thSarabunFont,
      14
    );
    drawTextOnPage(
      firstPage,
      data.OPDTreatmentDate4 ? convertDateFormat(data.OPDTreatmentDate4) : "",
      291,
      height - 322,
      thSarabunFont,
      14
    );
    drawTextOnPage(
      firstPage,
      data.OPDTreatmentDate5 ? convertDateFormat(data.OPDTreatmentDate5) : "",
      460,
      height - 322,
      thSarabunFont,
      14
    );
  }
  drawTextOnPage(
    firstPage,
    data.illnessDescription,
    166,
    height - 349,
    thSarabunFont,
    14
  );
  drawTextOnPage(
    firstPage,
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true, // Adds grouping separators (e.g., commas)
    }).format(data.totalMedicalFees) + " Baht",
    230,
    height - 376,
    thSarabunFont,
    14
  );

  const pdfBytes = await pdfDoc.save();
  /*
  fs.writeFileSync(
    "public/documents/prakan-inter/" + data.Student.id + "_Health_claim.pdf",
    pdfBytes
  );
  return (
    "public/documents/prakan-inter/" + data.Student.id + "_Health_claim.pdf"
  );
  */
  return Buffer.from(pdfBytes);


}
module.exports = { prakanFormBuilder };