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
async function vendorFormBuilder(data) {
  console.log(data);
  const pdfPath = path.resolve(
    process.cwd(),
    "public/documents/vendor/Vendor.pdf"
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
  drawTextOnPage(firstPage, data.nameTH, 140, height - 265);
  drawTextOnPage(firstPage, "นิสิต", 475, height - 265);
  drawTextOnPage(firstPage, data.faculty, 100, height - 286);
  drawTextOnPage(firstPage, data.houseID, 276, height - 286);
  drawTextOnPage(firstPage, data.moo, 340, height - 286);
  drawTextOnPage(firstPage, data.buildingVillage, 439, height - 286);
  drawTextOnPage(firstPage, data.soi, 98, height - 307);
  drawTextOnPage(firstPage, data.road, 237, height - 307);
  drawTextOnPage(firstPage, data.subDistrict, 410, height - 307);
  drawTextOnPage(firstPage, data.district, 99, height - 329);
  drawTextOnPage(firstPage, data.province, 283, height - 329);
  drawTextOnPage(firstPage, data.postalCode, 475, height - 329);
  drawTextOnPage(firstPage, "-", 160, height - 350);
  drawTextOnPage(firstPage, data.tel, 364, height - 350);
  // Draw Citizen ID
  drawTextOnPage(firstPage, data.citizenId[0], 142, height - 376);
  drawTextOnPage(firstPage, data.citizenId[1], 163.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[2], 176.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[3], 189.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[4], 202.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[5], 224, height - 376);
  drawTextOnPage(firstPage, data.citizenId[6], 237, height - 376);
  drawTextOnPage(firstPage, data.citizenId[7], 249.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[8], 262.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[9], 275, height - 376);
  drawTextOnPage(firstPage, data.citizenId[10], 297.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[11], 310.5, height - 376);
  drawTextOnPage(firstPage, data.citizenId[12], 332.5, height - 376);
  //Todo Handle issue,Expire Date
  //Handle Checkboxes
  switch (data.claimType) {
    case "ค่าจ้างนิสิตทำงานพิเศษ":
      drawTextOnPage(firstPage, "/", 444.5, height - 403.5);
      break;
    case "ค่าเล่าเรียน":
      drawTextOnPage(firstPage, "/", 45.5, height - 425.5);
      break;
    case "ค่าธรรมเนียมการศึกษา":
      drawTextOnPage(firstPage, "/", 115, height - 425.5);
      break;
    case "เงินสมทบค่ารักษาพยาบาล":
      drawTextOnPage(firstPage, "/", 235, height - 425.5);
      break;
    case "เงินช่วยเหลือนิสิตรักษาต่อเนื่อง/ทุพพลภาพ":
      drawTextOnPage(firstPage, "/", 365.5, height - 425.5);
      break;
    case "อื่นๆ (ระบุ)":
      drawTextOnPage(firstPage, "/", 46, height - 446);
      drawTextOnPage(firstPage, data.claimOtherReason, 120, height - 446);
      break;
    default:
      console.warn("Unknown claim type:", data.claimType);
      break;
  }
  const formattedAmount = Number(data.amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  drawTextOnPage(firstPage, formattedAmount, 272, height - 446);
  //todo amout to thai
  drawTextOnPage(firstPage, data.bankCompany, 149, height - 468);
  drawTextOnPage(firstPage, data.bankBranch, 264, height - 468);
  //todo bankacctype
  drawTextOnPage(firstPage, data.bankAccountName, 91, height - 488);
  //todo accnum
  drawTextOnPage(firstPage, data.nameTH, 315, height - 627);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("public/documents/vendor/Vendor-filled.pdf", pdfBytes);
}
module.exports = { vendorFormBuilder };
