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

// Convert digits to Thai numerals
function toThaiNumeral(number) {
  if (number === null || number === undefined) return '';
  return number.toString().split('').map(digit => thaiDigits[parseInt(digit)] || digit).join('');
}

// Get Thai year suffix in Thai numerals
function getThaiYearSuffixInThaiNumerals(date) {
  const year = date.getFullYear();
  const thaiYear = year + 543; // Convert to Buddhist Era
  const yearSuffix = thaiYear.toString().slice(-2);
  return yearSuffix.split('').map(digit => thaiDigits[parseInt(digit)]).join('');
}

// Calculate age from birthdate
function calculateAge(birthdate) {
  if (!birthdate) return '';

  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Format date to Thai format
function formatThaiDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear() + 543; // Convert to Buddhist Era

  return `${day} ${months[month]} ${year}`;
}

async function militaryRD2(data) {
  // Load checkmark image


  const {
    student,
    father_mother_info,
    guardian_info,
    rD_info
  } = data;
  console.log("data", data);

  // Load the existing PDF
  const pdfPath = path.resolve(process.cwd(), 'public/documents/rd/รด.2.pdf');
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

  // School name (placeholder - would need to come from a school config)
  // const schoolName = "โรงเรียนตัวอย่าง";
  // firstPage.drawText(schoolName, {
  //   x: 350,
  //   y: height - 60,
  //   size: 12,
  //   font: thSarabunFont,
  // });

  // Mark gender checkbox
  if (student?.title === 'นาย') {
    drawTick(148, height - 132); 
  } else {
    drawTick(148, height - 132); //
    // Mark female checkbox (X at female checkbox coordinates)
  }

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

  // Student ID (RD ID)
  const citizenRD = rD_info?.citizenRD?.toString() || '';
  firstPage.drawText(citizenRD, {
    x: 138,
    y: height - 158,
    size: 12,
    font: thSarabunFont,
  });

  // Birthdate
  const birthdate = student?.birthdate ? formatThaiDate(student.birthdate) : '';
  firstPage.drawText(birthdate, {
    x: 290,
    y: height - 158,
    size: 12,
    font: thSarabunFont,
  });

  // Age
  const age = calculateAge(student?.birthdate);
  firstPage.drawText(toThaiNumeral(age), {
    x: 400,
    y: height - 158,
    size: 12,
    font: thSarabunFont,
  });

  // Phone number
  const phoneNumber = student?.phone_num || '';
  firstPage.drawText(phoneNumber, {
    x: 119,
    y: height - 172,
    size: 12,
    font: thSarabunFont,
  });

  // Current education level
  const educationLevel = student?.degree || '';
  firstPage.drawText(educationLevel, {
    x: 303,
    y: height - 172,
    size: 12,
    font: thSarabunFont,
  });

  // Year/Grade
  const year = student?.year || '';
  firstPage.drawText(year, {
    x: 405,
    y: height - 172,
    size: 12,
    font: thSarabunFont,
  });

  // Mark the appropriate RD year level checkbox based on YearGradeRD
  const yearGradeRD = rD_info?.YearGradeRD || 0;
  const checkboxPositions = [169, 220, 270, 321, 371]; // X positions for checkboxes

  if (yearGradeRD >= 1 && yearGradeRD <= 5) {
    drawTick(checkboxPositions[yearGradeRD - 1], height - 188);
  }

  // Mark registration type checkbox
  const registerType = rD_info?.register_type || 5;
  const registerTypePositions = [111, 153, 197, 246, 326]; // X positions for register type checkboxes

  if (registerType >= 1 && registerType <= 5) {
    drawTick(registerTypePositions[registerType - 1], height - 203);
  }

  // If year level is 4 or 5, add branches and corps information
  if (yearGradeRD === 4 || yearGradeRD === 5) {
    const branches = rD_info?.Branches || '';
    firstPage.drawText(branches, {
      x: 444,
      y: height - 215,
      size: 12,
      font: thSarabunFont,
    });

    const corps = rD_info?.corps || '';
    firstPage.drawText(corps, {
      x: 500,
      y: height - 215,
      size: 12,
      font: thSarabunFont,
    });
  }

  // Parent information
  const father_info = father_mother_info?.father;
  if (father_info) {
    const father_name = `${father_info?.title || ''}${father_info?.fname || ''} ${father_info?.lname || ''}`;
    firstPage.drawText(father_name, {
      x: 120,
      y: height - 244,
      size: 12,
      font: thSarabunFont,
    });

    // Father's phone
    if (father_info?.phone_num) {
      firstPage.drawText(father_info.phone_num, {
        x: 430,
        y: height - 244,
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
      y: height - 258,
      size: 12,
      font: thSarabunFont,
    });

    // Mother's phone
    if (mother_info?.phone_num) {
      firstPage.drawText(mother_info.phone_num, {
        x: 430,
        y: height - 258,
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
      y: height - 271,
      size: 12,
      font: thSarabunFont,
    });

    // Guardian's phone
    if (guardian_info?.phone_num) {
      firstPage.drawText(guardian_info.phone_num.toString(), {
        x: 430,
        y: height - 271,
        size: 12,
        font: thSarabunFont,
      });
    }
  }

  // Mark student consent checkboxes
  if (rD_info?.man_right) {
    drawTick(308, height - 302);
  }
  if (rD_info?.women_right) {
    drawTick(308, height - 347);
  }
  if (rD_info?.registermyself) {
    drawTick(72, height - 302);
  }
  if (rD_info?.notmilitary) {
    drawTick(72, height - 317);
  }
  if (rD_info?.readymilitary) {
    drawTick(72, height - 347);
  }

  // Student's signature
  firstPage.drawText(name, {
    x: 335,
    y: height - 400,
    size: 7,
    font: thSarabunFont,
  });

  // Guardian section
  if (guardian_info) {
    const guardian_name = `${guardian_info?.guardian_title || ''}${guardian_info?.guardian_fname || ''} ${guardian_info?.guardian_lname || ''}`;
    firstPage.drawText(guardian_name, {
      x: 125,
      y: height - 442,
      size: 12,
      font: thSarabunFont,
    });

    // Guardian relation
    const guardian_relation = guardian_info?.guardian_relation || '';
    firstPage.drawText(guardian_relation, {
      x: 124,
      y: height - 457,
      size: 12,
      font: thSarabunFont,
    });

    // Mark consent checkbox
    if (guardian_info?.consent21){
      drawTick(72, height - 472);
    } 

    // Guardian signature
    firstPage.drawText(guardian_name, {
      x: 110,
      y: height - 525,
      size: 7,
      font: thSarabunFont,
    });
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

module.exports = { militaryRD2 };