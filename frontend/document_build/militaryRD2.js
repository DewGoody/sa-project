const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontPath = path.resolve(process.cwd(), 'public/fonts/THSarabunNew/THSarabunNew.ttf');
const fontkit = require('fontkit');
// Read font file
let font;

const months = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

function getThaiYearSuffixInThaiNumerals(date) {
  const year = date.getFullYear(); // ได้ค่าปี ค.ศ.
  const thaiYear = year + 543; // แปลงเป็น พ.ศ.
  const yearSuffix = thaiYear.toString().slice(-2); // ดึงสองตัวท้าย

  // แปลงตัวเลขเป็นตัวเลขไทย
  const thaiYearSuffix = yearSuffix.split('').map(digit => thaiDigits[parseInt(digit)]).join('');
  return thaiYearSuffix;
}

function getThaiYear(date){
  const year = date.getFullYear(); // ได้ค่าปี ค.ศ.
  let thaiYear = year + 543; // แปลงเป็น พ.ศ.
  thaiYear = thaiYear.toString(); // แปลงเป็น string
  thaiYear = thaiYear.split('').map(digit => thaiDigits[parseInt(digit)]).join('');
  return thaiYear;
}

try {
  font = fs.readFileSync(fontPath, 'base64');
} catch (error) {
  console.error(`Error reading font file: ${error.message}`);
  process.exit(1);
}

export async function militaryRD2(data) {
  console.log(data);
  const {
    student,
    addresses,
    father_mother_info,
    guardian_info,
    Military_info
  } = data;

  // Load the existing PDF
  const pdfPath = path.resolve(process.cwd(), 'public/documents/rd/รด.2.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  // Load the TH Sarabun font
  const fontBytes = fs.readFileSync(fontPath);
  const thSarabunFont = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];


  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();
  console.log(width, height);

  // Draw a string of text on the first page
  // Date setion
  let currentDate = new Date();
  let thaidatenum = '';
  for (let i = 0; i < currentDate.getDate().toString().length; i++) {
    thaidatenum += thaiDigits[currentDate.getDate().toString()[i]];
  }
  console.log(thaidatenum);
  firstPage.drawText(thaidatenum, {
    x: 220,
    y: height - 105,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  firstPage.drawText(months[currentDate.getMonth()], {
    x: 290,
    y: height - 105,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  firstPage.drawText(getThaiYear(currentDate), {
    x: 400,
    y: height - 105,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Student information
  const studentFname = student.fnameTH
  firstPage.drawText(studentFname, {
    x: 220,
    y: height - 155,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const studentLname = student.lnameTH
  firstPage.drawText(studentLname, {
    x: 380,
    y: height - 155,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // return pdf
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}