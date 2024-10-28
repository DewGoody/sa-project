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

try {
  font = fs.readFileSync(fontPath, 'base64');
} catch (error) {
  console.error(`Error reading font file: ${error.message}`);
  process.exit(1);
}

async function militaryRD1(data) {
  console.log(data);
  const {
    student,
    addresses,
    father_mother_info,
    guardian_info,
    Military_info
  } = data;



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
  let thaidatenum = '';
  for (let i = 0; i < currentDate.getDate().toString().length; i++) {
    thaidatenum += thaiDigits[currentDate.getDate().toString()[i]];
  }
  console.log(thaidatenum);
  firstPage.drawText(thaidatenum, {
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
  const birthdate = new Date(student?.birthdate).toLocaleDateString('th-TH', { dateStyle: 'long' }) || '';
  firstPage.drawText(birthdate, {
    x: 240,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const race = student?.race || '';
  firstPage.drawText(race, {
    x: 375,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  const nationality = student?.nationality || '';
  firstPage.drawText(nationality, {
    x: 450,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  const religion = student?.religion || '';
  firstPage.drawText(religion, {
    x: 530,
    y: height - 143,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  // next row
  const father_info = father_mother_info?.father;
  if (father_info) {
    const father_name = `${father_info?.fname || ""} ${father_info?.lname || ''}`;
    firstPage.drawText(father_name, {
      x: 200,
      y: height - 166,
      size: 14,
      font: thSarabunFont,
      color: rgb(0, 0, 0), // black
    });
  }
  const mother_info = father_mother_info?.mother;
  if (father_mother_info) {
    const mother_name = `${mother_info.fname || ''} ${mother_info.lname || ''}`;
    firstPage.drawText(mother_name, {
      x: 330,
      y: height - 166,
      size: 14,
      font: thSarabunFont,
      color: rgb(0, 0, 0), // black
    });
  }

  const mf_occupation_text = father_info?.occupation && mother_info?.occupation ? father_info.occupation + '/'+ mother_info.occupation: '';
  firstPage.drawText(mf_occupation_text, {
    x: 500,
    y: height - 166,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  // DOPA address
  const DOPA_address = addresses?.DOPA_address;

  const DOPA_house_num = `${DOPA_address?.house_num || ''} ${DOPA_address?.house_moo ? "ม." : ""}${DOPA_address?.house_moo || ''}`;
  firstPage.drawText(DOPA_house_num, {
    x: 255,
    y: height - 189,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_steet = `${DOPA_address?.street || '-'}`;
  firstPage.drawText(DOPA_steet, {
    x: 350,
    y: height - 189,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_subdistrict = `${DOPA_address?.subdistrict || ''}`;
  firstPage.drawText(DOPA_subdistrict, {
    x: 500,
    y: height - 189,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const DOPA_district = `${DOPA_address?.district || ''}`;
  firstPage.drawText(DOPA_district, {
    x: 220,
    y: height - 210,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_province = `${DOPA_address?.province || ''}`;
  firstPage.drawText(DOPA_province, {
    x: 350,
    y: height - 210,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const DOPA_postal_code = `${DOPA_address?.postal_code || ''}`;
  firstPage.drawText(DOPA_postal_code, {
    x: 500,
    y: height - 210,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  // military address
  const military_address = addresses?.Military_address;
  const military_house_num = `${military_address?.house_num || ''} ${military_address?.house_moo ? "ม." : ""}${military_address?.house_moo || ''}`;
  firstPage.drawText(military_house_num, {
    x: 250,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_subdistrict = `${military_address?.subdistrict || ''}`;
  firstPage.drawText(military_subdistrict, {
    x: 320,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_district = `${military_address?.district || ''}`;
  firstPage.drawText(military_district, {
    x: 410,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_province = `${military_address?.province || ''}`;
  firstPage.drawText(military_province, {
    x: 510,
    y: height - 230,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  let g9_gpax;
  if (!Military_info?.grade9_gpax){
    g9_gpax = '';
  }
  else g9_gpax = Military_info?.grade9_gpax;
  const grade9_gpax = String(g9_gpax) || '';
  firstPage.drawText(grade9_gpax, {
    x: 285,
    y: height - 250,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const grade9_school = Military_info?.grade9_school || '';
  firstPage.drawText(grade9_school, {
    x: 420,
    y: height - 250,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const grade9_province = Military_info?.grade9_province || '';
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
    size: fontsize2,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  //guardian section
  const guardian_name = `${guardian_info?.guardian_title || ''}${guardian_info?.guardian_fname || ''} ${guardian_info?.guardian_lname || ''}`;
  firstPage.drawText(guardian_name, {
    x: 350,
    y: height - 373,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const guardian_age = `${guardian_info?.guardian_age || ''}`;
  firstPage.drawText(guardian_age, {
    x: 335,
    y: height - 392,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const guardian_occupation = `${guardian_info?.guardian_occupation || ''}`;
  firstPage.drawText(guardian_occupation, {
    x: 460,
    y: height - 392,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  const guardian_address = `${guardian_info?.guardian_address || ''}`;
  firstPage.drawText(guardian_address, {
    x: 400,
    y: height - 412,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const guardian_relation = `${guardian_info?.guardian_relation || ''}`;
  firstPage.drawText(guardian_relation, {
    x: 380,
    y: height - 452,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // guardian signature section
  firstPage.drawText(guardian_name, {
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

  //guardian section
  const guardian_name_untitle = `${guardian_info?.guardian_fname || ''} ${guardian_info?.guardian_lname || ''}`;
  secondPage.drawText(guardian_name_untitle, {
    x: 230,
    y: height - 535,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next row
  secondPage.drawText(guardian_relation, {
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

  // guardian signature section
  secondPage.drawText(guardian_name, {
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
