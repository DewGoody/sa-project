const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const fontkit = require('fontkit');

// Define Thai months and digits
const months = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
const thaiDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Convert year to Thai numerals
function getThaiYearSuffixInThaiNumerals(date) {
  const year = date.getFullYear(); // Get year in CE
  const thaiYear = year + 543; // Convert to BE
  const yearSuffix = thaiYear.toString().slice(-2); // Get last two digits
  // Convert digits to Thai numerals
  const thaiYearSuffix = yearSuffix.split('').map(digit => thaiDigits[parseInt(digit)]).join('');
  return thaiYearSuffix;
}

// Function to calculate age from birthdate
function calculateAge(birthdate) {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Convert digit to Thai numeral
function toThaiNumeral(number) {
  return number.toString().split('').map(digit => thaiDigits[parseInt(digit)]).join('');
}

async function militaryRD1(data) {
  const {
    student,
    father_mother_info,
    guardian_info,
    rD_info  // Note: changed from RD_info to match new data structure
  } = data;
  console.log("data", data);

  // Load the existing PDF
  const pdfPath = path.resolve(process.cwd(), 'public/documents/rd/รด.1.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Register fontkit
  pdfDoc.registerFontkit(fontkit);

  // Load the TH Sarabun font
  const fontPath = path.resolve(process.cwd(), 'public/fonts/THSarabunNew/THSarabunNew.ttf');
  const fontBytes = fs.readFileSync(fontPath);
  const thSarabunFont = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Current date section
  const currentDate = new Date();
  const thaiDateNum = toThaiNumeral(currentDate.getDate());
  const tickPath = path.join(process.cwd(), 'public', 'tick.png');
  const tickImage = await pdfDoc.embedPng(fs.readFileSync(tickPath));
  const tickDims = tickImage.scale(0.006); // ปรับขนาดภาพ (เล็กลงพอดีช่อง)
  function drawTick(x, y) {
    firstPage.drawImage(tickImage, {
      x,
      y,
      width: tickDims.width,
      height: tickDims.height,
    });
  }
  // console.log("birthDate",student.birthdate);

  // firstPage.drawText(thaiDateNum, {
  //   x: 220,
  //   y: height - 90,
  //   size: 12,
  //   font: thSarabunFont,
  // });

  // firstPage.drawText(months[currentDate.getMonth()], {
  //   x: 290,
  //   y: height - 90,
  //   size: 12,
  //   font: thSarabunFont,
  // });

  // firstPage.drawText(getThaiYearSuffixInThaiNumerals(currentDate), {
  //   x: 420,
  //   y: height - 90,
  //   size: 12,
  //   font: thSarabunFont,
  // });

  // Student name
  const name = `${student?.title || ''}${student?.fnameTH || ''} ${student?.lnameTH || ''}`;
  const fontsize = name.length > 40 ? 500 / name.length : 12;

  firstPage.drawText(name, {
    x: 135,
    y: height - 143,
    size: fontsize,
    font: thSarabunFont,
  });

  // Thai ID
  const thai_id = student?.thai_id || '';
  firstPage.drawText(thai_id, {
    x: 335,
    y: height - 143,
    size: 12,
    font: thSarabunFont,
  });

  // Handle birthdate
  let birthDate = new Date();
  if (student?.birthdate) {
    birthDate = new Date(student.birthdate);
  }

  // Calculate age
  const age = calculateAge(birthDate);
  const thaiAge = toThaiNumeral(age);

  // Format birthdate in Thai style
  const formattedBirthdate = birthDate.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  firstPage.drawText(formattedBirthdate, {
    x: 123,
    y: height - 158,
    size: 12,
    font: thSarabunFont,
  });

  // Add age
  firstPage.drawText(thaiAge, {
    x: 220,
    y: height - 158,
    size: 12,
    font: thSarabunFont,
  });

  // Race, nationality, religion
  const race = student?.race || '';
  firstPage.drawText(race, {
    x: 105,
    y: height - 172,
    size: 12,
    font: thSarabunFont,
  });

  const nationality = student?.nationality || '';
  firstPage.drawText(nationality, {
    x: 164,
    y: height - 172,
    size: 12,
    font: thSarabunFont,
  });

  const religion = student?.religion || '';
  firstPage.drawText(religion, {
    x: 230,
    y: height - 172,
    size: 12,
    font: thSarabunFont,
  });

  // Phone number (not in the original data structure)
  const phoneNumber = student?.phone_num || '';
  if (phoneNumber) {
    firstPage.drawText(phoneNumber, {
      x: 315,
      y: height - 172,
      size: 12,
      font: thSarabunFont,
    });
  }

  // Education level - From the form, set a default value since not in data
  firstPage.drawText(student?.degree, {
    x: 160,
    y: height - 185,
    size: 12,
    font: thSarabunFont,
  });

  // Class year
  const year = student?.year || '1';
  firstPage.drawText(year, {
    x: 300,
    y: height - 185,
    size: 12,
    font: thSarabunFont,
  });

  // Parent information
  const father_info = father_mother_info?.father;
  if (father_info) {
    const father_name = `${father_info?.title || ''}${father_info?.fname || ''} ${father_info?.lname || ''}`;
    firstPage.drawText(father_name, {
      x: 120,
      y: height - 213,
      size: 12,
      font: thSarabunFont,
    });

    // Father's phone
    if (father_info?.phone_num) {
      firstPage.drawText(father_info.phone_num, {
        x: 430,
        y: height - 213,
        size: 12,
        font: thSarabunFont,
      });
    }
  }

  const mother_info = father_mother_info?.mother;
  if (mother_info) {
    const mother_name = `${mother_info?.title || ''}${mother_info?.fname || ''} ${mother_info?.lname || ''}`;
    firstPage.drawText(mother_name, {
      x: 130,
      y: height - 227,
      size: 12,
      font: thSarabunFont,
    });

    // Mother's phone
    if (mother_info?.phone_num) {
      firstPage.drawText(mother_info.phone_num, {
        x: 430,
        y: height - 227,
        size: 12,
        font: thSarabunFont,
      });
    }
  }

  // Guardian information
  if (guardian_info) {
    const guardian_name = `${guardian_info?.guardian_title || ''}${guardian_info?.guardian_fname || ''} ${guardian_info?.guardian_lname || ''}`;
    firstPage.drawText(guardian_name, {
      x: 140,
      y: height - 240,
      size: 12,
      font: thSarabunFont,
    });

    // Guardian's phone
    if (guardian_info?.phone_num) {
      firstPage.drawText(guardian_info.phone_num.toString(), {
        x: 430,
        y: height - 240,
        size: 12,
        font: thSarabunFont,
      });
    }
  }

  // Mark checkboxes for gender
  // The student's gender isn't explicitly provided in the data, would need to infer from title
  // For demonstration, assuming 'นาย' means male
  if (student?.title === 'นาย') {
    drawTick(142, height - 131)
  } else {
    drawTick(183, height - 131)
    // Mark female checkbox (X at female checkbox coordinates)
  }

  // Student's signature section
  firstPage.drawText(name, {
    x: 335,
    y: height - 341,
    size: 7,
    font: thSarabunFont,
  });

  // Guardian section
  const guardian_name = `${guardian_info?.guardian_title || ''}${guardian_info?.guardian_fname || ''} ${guardian_info?.guardian_lname || ''}`;
  firstPage.drawText(guardian_name, {
    x: 123,
    y: height - 383,
    size: 12,
    font: thSarabunFont,
  });

  // Guardian relation
  const guardian_relation = guardian_info?.guardian_relation || '';
  firstPage.drawText(guardian_relation, {
    x: 128,
    y: height - 396,
    size: 12,
    font: thSarabunFont,
  });

  // Mark consent checkboxes
  if (guardian_info?.consent1){
    drawTick(72, height - 414);
  } 

  if (guardian_info?.consent2){
    drawTick(72, height - 428);
  } 

  // Guardian signature
  firstPage.drawText(guardian_name, {
    x: 110,
    y: height - 480,
    size: 7,
    font: thSarabunFont,
  });

  // Mark student consent checkboxes based on rD_info
  if (rD_info?.registermyself) {
    drawTick(72, height - 273);
  }
  if (rD_info?.notmilitary) {
    drawTick(72, height - 288);
  }

  if (rD_info?.man_right) {
    drawTick(300, height - 273);
  }

  if (rD_info?.women_right) {
    drawTick(300, height - 288);
  }

  if (rD_info?.ready_right) {
    drawTick(300, height - 303);
  }

  // School information section (placeholder since not in data)
  // Save the PDF
  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}

module.exports = { militaryRD1 };
