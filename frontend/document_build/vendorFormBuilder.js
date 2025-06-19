import { bahttext } from "bahttext"
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
  const zapfDingbatsFont = await pdfDoc.embedFont(StandardFonts.ZapfDingbats);
  console.log("data to Vendor form builder", data);
  const drawCheckMark = (page, x, y) => {
    page.drawText("✓", {
      x,
      y,
      size: 14,
      font: zapfDingbatsFont,
      color: rgb(0, 0, 0),
    });
  }

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

  function convertToThaiDate(isoDateString) {
    if (!isoDateString) return '';

    const date = new Date(isoDateString);

    // Thai months
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist Era (พ.ศ.)
    const shortenedyear = String(year).slice(-2); // Get last two digits of the year
    return `${day} ${month} ${shortenedyear}`;
  }

  drawTextOnPage(firstPage, data.titleTH + data.nameTH, 140, height - 265);
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
  //Thai ID
  drawTextOnPage(firstPage, data.citizenId[0], 145, height - 372);
  drawTextOnPage(firstPage, data.citizenId[1], 167, height - 372);
  drawTextOnPage(firstPage, data.citizenId[2], 180, height - 372);
  drawTextOnPage(firstPage, data.citizenId[3], 193, height - 372);
  drawTextOnPage(firstPage, data.citizenId[4], 206, height - 372);
  drawTextOnPage(firstPage, data.citizenId[5], 228, height - 372);
  drawTextOnPage(firstPage, data.citizenId[6], 241, height - 372);
  drawTextOnPage(firstPage, data.citizenId[7], 254, height - 372);
  drawTextOnPage(firstPage, data.citizenId[8], 267, height - 372);
  drawTextOnPage(firstPage, data.citizenId[9], 280, height - 372);
  drawTextOnPage(firstPage, data.citizenId[10], 301, height - 372);
  drawTextOnPage(firstPage, data.citizenId[11], 314, height - 372);
  drawTextOnPage(firstPage, data.citizenId[12], 336, height - 372);

  // Convert and draw Thai dates
  const thaiIssueDate = convertToThaiDate(data.citizenIssueDate);
  const thaiExpireDate = convertToThaiDate(data.citizenExpireDate);

  // Draw issue date 
  drawTextOnPage(firstPage, thaiIssueDate, 410, height - 370);
  // Draw expire date 
  drawTextOnPage(firstPage, thaiExpireDate, 513, height - 370);


  if (data.claimType === "ค่าจ้างนิสิตทำงานพิเศษ") {
    drawCheckMark(firstPage, 445, height - 403);
  }
  else if (data.claimType === "ค่าเล่าเรียน") {
    drawCheckMark(firstPage, 45, height - 422);
  }
  else if (data.claimType === "ค่าธรรมเนียมการศึกษา") {
    drawCheckMark(firstPage, 115, height - 422);
  }
  else if (data.claimType === "เงินสมทบค่ารักษาพยาบาล") {
    drawCheckMark(firstPage, 234, height - 422);
  }
  else if (data.claimType === "เงินช่วยเหลือนิสิตรักษาต่อเนื่อง/ทุพพลภาพ") {
    drawCheckMark(firstPage, 367, height - 422);
  }
  else if (data.claimType === "อื่นๆ (ระบุ)") {
    drawCheckMark(firstPage, 45, height - 446);
  }

  drawTextOnPage(firstPage, data.claimOtherReason, 120, height - 446);
  drawTextOnPage(firstPage, new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // Adds grouping separators (e.g., commas)
  }).format(data.amount), 272, height - 446);
  const amountText = bahttext(data.amount);
  console.log(amountText);
  drawTextOnPage(firstPage, amountText, 405, height - 446);
  drawTextOnPage(firstPage, data.bankCompany, 149, height - 468);
  drawTextOnPage(firstPage, data.bankBranch, 264, height - 468);
  //bankAccountType
  if (data.bankAccountType === "ออมทรัพย์") {
    drawCheckMark(firstPage, 429, height - 464);
  }
  else if (data.bankAccountType === "กระแสรายวัน") {
    drawCheckMark(firstPage, 497, height - 464);
  }
  drawTextOnPage(firstPage, data.bankAccountName, 91, height - 488);
  //accnum
  drawTextOnPage(firstPage, data.bankAccountNumber[0], 358, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[1], 373, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[2], 387, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[3], 419, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[4], 450, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[5], 465, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[6], 479, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[7], 494, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[8], 507, height - 490);
  drawTextOnPage(firstPage, data.bankAccountNumber[9], 540, height - 490);

  drawTextOnPage(firstPage, data.titleTH + data.nameTH, 310, height - 627);
  const pdfBytes = await pdfDoc.save();
  /*
  fs.writeFileSync("public/documents/vendor/" + data.Student.id + "_vendor.pdf", pdfBytes);
  return (
    "public/documents/vendor/" + data.Student.id + "_vendor.pdf"
  );
  */
  return Buffer.from(pdfBytes);
}
module.exports = { vendorFormBuilder };