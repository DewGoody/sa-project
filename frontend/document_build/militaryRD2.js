const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontPath  = path.resolve(process.cwd(), 'public/fonts/THSarabunNew/THSarabunNew.ttf');
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

try {
  font = fs.readFileSync(fontPath, 'base64');
} catch (error) {
  console.error(`Error reading font file: ${error.message}`);
  process.exit(1);
}

export async function militaryRD2(data) {
    return 'not implemented';
}