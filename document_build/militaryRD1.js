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

async function militaryRD1(data) {
  const {
    student,
    military_course,
    DOPA_address,
    military_address,
    parent_info,
    father_info,
    mother_info,
    mf_occupation,
  } = data;

  console.log(student.db);



  // Load the existing PDF
  const pdfPath = path.resolve(process.cwd(), 'public/documents/rd/รด.1.pdf');
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


  // Draw a string of text on the first page
  // Date setion
  let currentDate = new Date();
  firstPage.drawText(thaiDigits[currentDate.getDay().toString()], {
    x: 220,
    y: height - 90,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  firstPage.drawText(months[currentDate.getMonth()], {
    x: 290,
    y: height - 90,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  firstPage.drawText(getThaiYearSuffixInThaiNumerals(currentDate), {
    x: 420,
    y: height - 90,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // name
  const name = `${student?.title || ''}${student?.fnameTH || ''} ${student?.middleNameTH || ''} ${student?.lnameTH || ''}`;
  const fontsize = name.length > 40 ? 500 / name.length : 14;
  firstPage.drawText(name, {
    x: 200,
    y: height - 120,
    size: fontsize,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // thai_id
  let thai_id = student?.thai_id || '';
  firstPage.drawText(thai_id, {
    x: 470,
    y: height - 120,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row 

  // birthdate
  const birthdate = new Date(student.bd).toLocaleDateString('th-TH', { dateStyle: 'long' }) || '';
  firstPage.drawText(birthdate, {
    x: 240,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const race = student.race || '';
  firstPage.drawText(race, {
    x: 375,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  const nationality = student.nationality || '';
  firstPage.drawText(nationality, {
    x: 450,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  const religion = student.religion || '';
  firstPage.drawText(religion, {
    x: 530,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  // next row
  const father_name = `${father_info.fname || ''} ${father_info.fname || ''}`;
  firstPage.drawText(father_name, {
    x: 200,
    y: height - 166,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const mother_name = `${father_info.fname || ''} ${father_info.lname || ''}`;
  firstPage.drawText(mother_name, {
    x: 330,
    y: height - 166,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const mf_occupation_text = mf_occupation || '';
  firstPage.drawText(mf_occupation_text, {
    x: 500,
    y: height - 166,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  // DOPA address
  const DOPA_house_num = `${DOPA_address.house_num || ''} ${DOPA_address.house_moo ? "ม.": ""}${DOPA_address.house_moo || ''}`;
  firstPage.drawText(DOPA_house_num, {
    x: 255,
    y: height - 189,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_steet = `${DOPA_address.street || '-'}`;
  firstPage.drawText(DOPA_steet, {
    x: 350,
    y: height - 189,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_subdistrict = `${DOPA_address.subdistrict || ''}`;
  firstPage.drawText(DOPA_subdistrict, {
    x: 500,
    y: height - 189,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const DOPA_district = `${DOPA_address.district || ''}`;
  firstPage.drawText(DOPA_district, {
    x: 220,
    y: height - 210,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_province = `${DOPA_address.province || ''}`;
  firstPage.drawText(DOPA_province, {
    x: 350,
    y: height - 210,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_postal_code = `${DOPA_address.postal_code || ''}`;
  firstPage.drawText(DOPA_postal_code, {
    x: 500,
    y: height - 210,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  // military address
  const military_house_num = `${military_address.house_num || ''} ${military_address.house_moo ? "ม.": ""}${military_address.house_moo || ''}`;
  firstPage.drawText(military_house_num, {
    x: 250,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_subdistrict = `${military_address.subdistrict || ''}`;
  firstPage.drawText(military_subdistrict, {
    x: 320,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_district = `${military_address.district || ''}`;
  firstPage.drawText(military_district, {
    x: 410,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_province = `${military_address.province || ''}`;
  firstPage.drawText(military_province, {
    x: 510,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const grade9_gpax = military_course.grade9_gpax || '';
  firstPage.drawText(grade9_gpax, {
    x: 285,
    y: height - 250,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const grade9_school = military_course.grade9_school || '';
  firstPage.drawText(grade9_school, {
    x: 420,
    y: height - 250,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const grade9_province = military_course.grade9_province || '';
  firstPage.drawText(grade9_province, {
    x: 185,
    y: height - 270,
    size: 13,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // signiture
  const fontsize2 = name.length > 40 ? 500 / name.length : 14;
  firstPage.drawText(name, {
    x: 370,
    y: height - 315,
    size: fontsize,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  //parent section
  const parent_name = `${parent_info.title || ''}${parent_info.parent_fname || ''} ${parent_info.parent_lname || ''}`;
  firstPage.drawText(parent_name, {
    x: 350,
    y: height - 373,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const parent_age = `${parent_info.age || ''}`;
  firstPage.drawText(parent_age, {
    x: 335,
    y: height - 392,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const parent_occupation = `${parent_info.occupation || ''}`;
  firstPage.drawText(parent_occupation, {
    x: 460,
    y: height - 392,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const parent_address = `${parent_info.parent_address || ''}`;
  firstPage.drawText(parent_address, {
    x: 400,
    y: height - 412,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const parent_relation = `${parent_info.parent_relation || ''}`;
  firstPage.drawText(parent_relation, {
    x: 380,
    y: height - 452,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // parent signature section
  firstPage.drawText(parent_name, {
    x: 390,
    y: height - 548,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // page 2
  // Draw a string of text on the first page  
  const secondPage = pages[1];
  // signiture section
  secondPage.drawText(name, {
    x: 360,
    y: height - 300,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  //parent section
  const parent_name_untitle = `${parent_info.parent_fname || ''} ${parent_info.parent_lname || ''}`;
  secondPage.drawText(parent_name_untitle, {
    x: 230,
    y: height - 535,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  secondPage.drawText(parent_relation, {
    x: 60,
    y: height - 555,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  secondPage.drawText(`${student.fnameTH} ${student.lnameTH}`, {
    x: 230,
    y: height - 555,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  secondPage.drawText(`${student.fnameTH} ${student.lnameTH}`, {
    x: 60,
    y: height - 665,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // parent signature section
  secondPage.drawText(parent_name, {
    x: 335,
    y: height - 770,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });



  // return pdf
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;

}

module.exports = { militaryRD1 };
