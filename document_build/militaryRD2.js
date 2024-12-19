const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontPath = path.resolve(process.cwd(), 'public/fonts/THSarabunNew/THSarabunNew.ttf');
const fontkit = require('fontkit');
// Read font file
let font;
const tickbyte = fs.readFileSync('public/tick.png');



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

function getThaiYear(date) {
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
  //console.log(data);
  // const mockdata = require('../../test.json');


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

  // Load the tick image
  const tick = await pdfDoc.embedPng(tickbyte);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  let isFemaleTitile = student.title === 'นาย' ? '' : 'หญิง ';

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
  // Full name
  const studentFname = student.fnameTH
  firstPage.drawText((isFemaleTitile + studentFname), {
    x: 220,
    y: height - 155,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Last name
  const studentLname = student.lnameTH
  firstPage.drawText(studentLname, {
    x: 380,
    y: height - 155,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Age
  if (student.birthdate) {
    console.log(student.birthdate);
    const birthDate = new Date(student.birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // Convert the difference to a date
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    const ageString = String(age);

    firstPage.drawText(ageString, {
      x: 551,
      y: height - 155,
      size: 14,
      font: thSarabunFont,
      color: rgb(0, 0, 0), // black
    });
  }



  // Next line


  const militaryID = Military_info.military_id;
  firstPage.drawText(militaryID.toString(), {
    x: 242,
    y: height - 173,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Thai ID
  const thaiID = student.thai_id;
  firstPage.drawText(thaiID, {
    x: 460,
    y: height - 173,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next line

  // **Current address section

  // House number
  const houseNumber = addresses.DOPA_address.house_num;
  firstPage.drawText(houseNumber, {
    x: 262,
    y: height - 190,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Moo
  const moo = addresses.DOPA_address.house_moo;
  firstPage.drawText(moo, {
    x: 350,
    y: height - 190,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Soi
  const soi = addresses.DOPA_address.soi;
  firstPage.drawText(soi, {
    x: 440,
    y: height - 190,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line
  // Street
  const street = addresses.DOPA_address.street;
  firstPage.drawText(street, {
    x: 180,
    y: height - 208,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Subdistrict
  const subdistrict = addresses.DOPA_address.subdistrict;
  firstPage.drawText(subdistrict, {
    x: 350,
    y: height - 208,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // District
  const district = addresses.DOPA_address.district;
  firstPage.drawText(district, {
    x: 480,
    y: height - 208,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line
  // Province
  const province = addresses.DOPA_address.province;
  firstPage.drawText(province, {
    x: 200,
    y: height - 226,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Postal code
  const postalCode = addresses.DOPA_address.postal_code;
  firstPage.drawText(postalCode.toString(), {
    x: 370,
    y: height - 226,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next Section

  // Student information
  firstPage.drawText("อุดมศึกษา", {
    x: 175,
    y: height - 262,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // student class obtained from 2 first digit of student ID - current year
  console.log(student.student_id)
  const studentYear = parseInt(String(student.student_id).substring(0, 2));
  const studentClass = (currentDate.getFullYear() + 543) - (studentYear + 2500);
  const stu_year = "ปี " + studentClass.toString();
  firstPage.drawText(stu_year, {
    x: 240,
    y: height - 262,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // faculty
  const facultyNameTH = student.facultyNameTH;
  firstPage.drawText(facultyNameTH, {
    x: 360,
    y: height - 262,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line

  // Date of entering the university
  const dateOfEntering = new Date(Military_info.date_of_study);

  // Date
  // let thaidatenum2 = '';
  // for (let i = 0; i < dateOfEntering.getDate().toString().length; i++) {
  //   thaidatenum2 += thaiDigits[dateOfEntering.getDate().toString()[i]];
  // }
  const thaidateenrolled = dateOfEntering.getDate().toString();
  firstPage.drawText(thaidateenrolled, {
    x: 210,
    y: height - 280,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Month

  const thaiMonthEnrolled = months[dateOfEntering.getMonth()];
  firstPage.drawText(thaiMonthEnrolled, {
    x: 265,
    y: height - 280,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Year
  const thaiYearEnrolled = getThaiYear(dateOfEntering);
  firstPage.drawText(thaiYearEnrolled, {
    x: 335,
    y: height - 280,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Prev military class
  const prevMilClass = Military_info.prev_military_class;
  firstPage.drawText(prevMilClass, {
    x: 530,
    y: height - 280,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line
  // Previous military year

  const prevMilYear = Military_info.prev_year;
  firstPage.drawText(prevMilYear, {
    x: 183,
    y: height - 298,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Prev school
  const prevSchool = Military_info.prev_school;
  firstPage.drawText(prevSchool, {
    x: 320,
    y: height - 298,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Prev school
  const prevSchoolProvince = Military_info.prev_province;
  firstPage.drawText(prevSchoolProvince, {
    x: 500,
    y: height - 298,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // next section

  // military_class
  const militaryClass = Military_info.military_class || '';
  console.log(militaryClass);
  firstPage.drawText(militaryClass.toString(), {
    x: 320,
    y: height - 315,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military year (current year)
  const militaryYear = getThaiYear(currentDate);
  firstPage.drawText(militaryYear.toString(), {
    x: 440,
    y: height - 315,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line

  // register_type
  const registerType = Military_info.register_type || '';
  console.log(registerType);

  // draw tick box
  if (registerType == 1) {
    firstPage.drawImage(tick, {
      x: 165,
      y: height - 335,
      width: 10,
      height: 10,
    });
  }

  // draw tick box
  if (registerType == 2) {
    firstPage.drawImage(tick, {
      x: 228,
      y: height - 335,
      width: 10,
      height: 10,
    });
  }

  // draw tick box
  if (registerType == 3) {
    firstPage.drawImage(tick, {
      x: 290,
      y: height - 335,
      width: 10,
      height: 10,
    });
  }


  // draw tick box
  if (registerType == 4) {
    firstPage.drawImage(tick, {
      x: 372,
      y: height - 335,
      width: 10,
      height: 10,
    });
  }

  // Next section

  // Name signature
  const nameSignature = 'นศท.' + isFemaleTitile + studentFname + " " + studentLname;
  firstPage.drawText(nameSignature.toString(), {
    x: 360,
    y: height - 425,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next section
  // gaurdian information
  // Gaurdian name
  const gaurdianName = guardian_info.guardian_title + " " + guardian_info.guardian_fname + " " + guardian_info.guardian_lname;
  firstPage.drawText(gaurdianName.toString(), {
    x: 390,
    y: height - 460,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // Gaurdian nationality
  const gaurdianNationality = guardian_info.guardian_nationality;
  firstPage.drawText(gaurdianNationality.toString(), {
    x: 355,
    y: height - 480,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Gaurdian age
  const guardian_age = guardian_info.guardian_age;
  firstPage.drawText(guardian_age.toString(), {
    x: 410,
    y: height - 480,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Gaurdian occupation
  const guardian_occupation = guardian_info.guardian_occupation;
  firstPage.drawText(guardian_occupation.toString(), {
    x: 480,
    y: height - 480,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // guardian relationship
  const guardian_relationship = guardian_info.guardian_relation;
  firstPage.drawText(guardian_relationship.toString(), {
    x: 375,
    y: height - 500,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // student name
  firstPage.drawText(isFemaleTitile + studentFname + " " + studentLname, {
    x: 450,
    y: height - 500,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line 

  // guardian signature
  firstPage.drawText(gaurdianName.toString(), {
    x: 420,
    y: height - 643,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });



  // second page

  const secondPage = pdfDoc.getPages()[1];
  const { width: width2, height: height2 } = secondPage.getSize();
  console.log(width2, height2);

  // Father information
  // Father name
  const fatherName = father_mother_info.father.title + " " + father_mother_info.father.fname + " " + father_mother_info.father.lname;
  secondPage.drawText(fatherName.toString(), {
    x: 110,
    y: height2 - 115,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Father Nationality
  const fatherNationality = father_mother_info.father.nationality;
  secondPage.drawText(fatherNationality.toString(), {
    x: 300,
    y: height2 - 115,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Father occupation

  const fatherOccupation = father_mother_info.father.occupation;
  secondPage.drawText(fatherOccupation.toString(), {
    x: 470,
    y: height2 - 115,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line

  // Father working place
  const fatherWorkPlace = father_mother_info.father.working_place;
  secondPage.drawText(fatherWorkPlace.toString(), {
    x: 180,
    y: height2 - 133,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Father tel_num
  const fatherTelNum = father_mother_info.father.tel_num;
  secondPage.drawText(fatherTelNum.toString(), {
    x: 360,
    y: height2 - 133,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Father phone_num
  const fatherPhoneNum = father_mother_info.father.phone_num;
  secondPage.drawText(fatherPhoneNum.toString(), {
    x: 480,
    y: height2 - 133,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line
  // Father address

  const fatherAddress = addresses.Father_address;

  // House number'
  const fatherHouseNumber = fatherAddress.house_num;

  secondPage.drawText(fatherHouseNumber.toString(), {
    x: 162,
    y: height2 - 151,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // moo
  const fatherMoo = fatherAddress.house_moo.toString();
  secondPage.drawText(fatherMoo, {
    x: 225,
    y: height2 - 151,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // subdistrict
  const fatherSubdistrict = fatherAddress.subdistrict;
  secondPage.drawText(fatherSubdistrict.toString(), {
    x: 314,
    y: height2 - 151,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // district
  const fatherDistrict = fatherAddress.district;
  secondPage.drawText(fatherDistrict.toString(), {
    x: 460,
    y: height2 - 151,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line

  // Province
  const fatherProvince = fatherAddress.province;
  secondPage.drawText(fatherProvince.toString(), {
    x: 130,
    y: height2 - 169,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Postal code
  const fatherPostalCode = fatherAddress.postal_code;
  secondPage.drawText(fatherPostalCode, {
    x: 370,
    y: height2 - 169,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  secondPage.drawText(fatherTelNum.toString(), {
    x: 490,
    y: height2 - 169,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  // Next section

  // Mother information
  // Mother name
  const motherName = father_mother_info.mother.title + " " + father_mother_info.mother.fname + " " + father_mother_info.mother.lname;
  secondPage.drawText(motherName.toString(), {
    x: 110,
    y: height2 - 187,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Mother Nationality
  const motherNationality = father_mother_info.mother.nationality
  secondPage.drawText(motherNationality.toString(), {
    x: 300,
    y: height2 - 187,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Mother occupation
  const motherOccupation = father_mother_info.mother.occupation;
  secondPage.drawText(motherOccupation.toString(), {
    x: 470,
    y: height2 - 187,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line

  // Mother working place
  const motherWorkPlace = father_mother_info.mother.working_place;
  secondPage.drawText(motherWorkPlace.toString(), {
    x: 180,
    y: height2 - 205,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Mother tel_num
  const motherTelNum = father_mother_info.mother.tel_num;
  secondPage.drawText(motherTelNum.toString(), {
    x: 360,
    y: height2 - 205,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Mother phone_num
  const motherPhoneNum = father_mother_info.mother.phone_num;
  secondPage.drawText(motherPhoneNum.toString(), {
    x: 480,
    y: height2 - 205,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next line

  // Mother address
  const motherAddress = addresses.Mother_address;

  // House number'
  const motherHouseNumber = motherAddress.house_num;
  secondPage.drawText(motherHouseNumber.toString(), {
    x: 162,
    y: height2 - 223,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // moo
  const motherMoo = motherAddress.house_moo;
  secondPage.drawText(motherMoo.toString(), {
    x: 230,
    y: height2 - 223,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // subdistrict
  const motherSubdistrict = motherAddress.subdistrict;

  secondPage.drawText(motherSubdistrict.toString(), {
    x: 314,
    y: height2 - 223,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // district

  const motherDistrict = motherAddress.district;
  secondPage.drawText(motherDistrict.toString(), {
    x: 460,
    y: height2 - 223,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next line

  // Province
  const motherProvince = motherAddress.province;
  secondPage.drawText(motherProvince.toString(), {
    x: 130,
    y: height2 - 241,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Postal code
  const motherPostalCode = motherAddress.postal_code;
  secondPage.drawText(motherPostalCode.toString(), {
    x: 370,
    y: height2 - 241,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // mother tel_num
  secondPage.drawText(motherTelNum.toString(), {
    x: 490,
    y: height2 - 241,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  })

  // Next section
  // Education information

  // tab 1

  // academic grade1
  const academicGrade1 = Military_info.academic_grade1;
  secondPage.drawText(academicGrade1.toString(), {
    x: 100,
    y: height2 - 277,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_class1
  const academicClass1 = Military_info.academic_class1;
  secondPage.drawText(academicClass1.toString(), {
    x: 170,
    y: height2 - 277,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_major1
  const academicMajor1 = Military_info.academic_major1;
  secondPage.drawText(academicMajor1.toString(), {
    x: 305,
    y: height2 - 277,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_school1
  const academicSchool1 = Military_info.academic_school1;
  secondPage.drawText(academicSchool1.toString(), {
    x: 450,
    y: height2 - 277,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line

  // tab 2

  // academic grade2
  const academicGrade2 = Military_info.academic_grade2;
  secondPage.drawText(academicGrade2.toString(), {
    x: 100,
    y: height2 - 295,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_class2
  const academicClass2 = Military_info.academic_class2;
  secondPage.drawText(academicClass2.toString(), {
    x: 170,
    y: height2 - 295,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_major2
  const academicMajor2 = Military_info.academic_major2;
  secondPage.drawText(academicMajor2, {
    x: 305,
    y: height2 - 295,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_school2
  const academicSchool2 = Military_info.academic_school2;
  secondPage.drawText(academicSchool2.toString(), {
    x: 450,
    y: height2 - 295,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next line

  // tab 3

  // academic grade3
  const academicGrade3 = Military_info.academic_grade3;
  secondPage.drawText(academicGrade3.toString(), {
    x: 100,
    y: height2 - 313,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_class3
  const academicClass3 = Military_info.academic_class3;
  secondPage.drawText(academicClass3.toString(), {
    x: 170,
    y: height2 - 313,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_major3
  const academicMajor3 = Military_info.academic_major3;
  secondPage.drawText(academicMajor3.toString(), {
    x: 305,
    y: height2 - 313,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_school3
  const academicSchool3 = Military_info.academic_school3;
  secondPage.drawText(academicSchool3.toString(), {
    x: 450,
    y: height2 - 313,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next line

  // tab 4

  // academic grade4
  const academicGrade4 = Military_info.academic_grade4;
  secondPage.drawText(academicGrade4.toString(), {
    x: 100,
    y: height2 - 331,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_class4
  const academicClass4 = Military_info.academic_class4;
  secondPage.drawText(academicClass4.toString(), {
    x: 170,
    y: height2 - 331,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_major4
  const academicMajor4 = Military_info.academic_major4;
  secondPage.drawText(academicMajor4.toString(), {
    x: 305,
    y: height2 - 331,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // academic_school4
  const academicSchool4 = Military_info.academic_school4;
  secondPage.drawText(academicSchool4.toString(), {
    x: 450,
    y: height2 - 331,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // Next section
  // Military training information

  // tab 1

  // military_grade1
  const militaryGrade1 = Military_info.military_grade1;
  secondPage.drawText(militaryGrade1.toString(), {
    x: 130,
    y: height2 - 367,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_year1
  const militaryYear1 = Military_info.military_year1;
  secondPage.drawText(militaryYear1.toString(), {
    x: 180,
    y: height2 - 367,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_school1
  const militarySchool1 = Military_info.military_school1;
  secondPage.drawText(militarySchool1.toString(), {
    x: 295,
    y: height2 - 367,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_province1 = Military_info.military_province1;
  secondPage.drawText(military_province1.toString(), {
    x: 480,
    y: height2 - 367,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // tab 2

  // military_grade2
  const militaryGrade2 = Military_info.military_grade2;
  secondPage.drawText(militaryGrade2.toString(), {
    x: 130,
    y: height2 - 385,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_year2
  const militaryYear2 = Military_info.military_year2;
  secondPage.drawText(militaryYear2.toString(), {
    x: 180,
    y: height2 - 385,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_school2
  const militarySchool2 = Military_info.military_school2;
  secondPage.drawText(militarySchool2.toString(), {
    x: 295,
    y: height2 - 385,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_province2 = Military_info.military_province2;
  secondPage.drawText(military_province2.toString(), {
    x: 480,
    y: height2 - 385,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // tab 3

  // military_grade3
  const militaryGrade3 = Military_info.military_grade3;
  secondPage.drawText(militaryGrade3.toString(), {
    x: 130,
    y: height2 - 403,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_year3
  const militaryYear3 = Military_info.military_year3;
  secondPage.drawText(militaryYear3.toString(), {
    x: 180,
    y: height2 - 403,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_school3
  const militarySchool3 = Military_info.military_school3;
  secondPage.drawText(militarySchool3.toString(), {
    x: 295,
    y: height2 - 403,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_province3 = Military_info.military_province3;
  secondPage.drawText(military_province3.toString(), {
    x: 480,
    y: height2 - 403,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // tab 4

  // military_grade4
  const militaryGrade4 = Military_info.military_grade4;
  secondPage.drawText(militaryGrade4.toString(), {
    x: 130,
    y: height2 - 421,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_year4
  const militaryYear4 = Military_info.military_year4;
  secondPage.drawText(militaryYear4.toString(), {
    x: 180,
    y: height2 - 421,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // military_school4
  const militarySchool4 = Military_info.military_school4;
  secondPage.drawText(militarySchool4.toString(), {
    x: 295,
    y: height2 - 421,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const military_province4 = Military_info.military_province4;
  secondPage.drawText(military_province4.toString(), {
    x: 480,
    y: height2 - 421,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next section
  // military address

  // House number
  const militaryHouseNumber = addresses.Military_address.house_num || '';
  secondPage.drawText(militaryHouseNumber.toString(), {
    x: 175,
    y: height2 - 439,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // moo
  const militaryMoo = addresses.Military_address.house_moo || '';
  secondPage.drawText(militaryMoo.toString(), {
    x: 245,
    y: height2 - 439,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // soi
  const militarySoi = addresses.Military_address.soi;
  secondPage.drawText(militarySoi.toString(), {
    x: 315,
    y: height2 - 439,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // subdistrict
  const militarySubdistrict = addresses.Military_address.subdistrict;
  secondPage.drawText(militarySubdistrict.toString(), {
    x: 450,
    y: height2 - 439,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // district
  const militaryDistrict = addresses.Military_address.district;
  secondPage.drawText(militaryDistrict.toString(), {
    x: 130,
    y: height2 - 457,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // province
  const militaryProvince = addresses.Military_address.province;
  secondPage.drawText(militaryProvince.toString(), {
    x: 270,
    y: height2 - 457,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // next section
  // reg_army

  const reg_army = Military_info.reg_army || '';
  secondPage.drawText(reg_army.toString(), {
    x: 390,
    y: height2 - 493,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // reg_corp
  const reg_corp = Military_info.reg_corp || '';
  secondPage.drawText(reg_corp.toString(), {
    x: 500,
    y: height2 - 493,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


  // next section

  // promo_title1
  const promo_title1 = Military_info.promo_title1 || '';
  secondPage.drawText(promo_title1.toString(), {
    x: 150,
    y: height2 - 531,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const promo_corp1 = Military_info.promo_corp1 || '';
  secondPage.drawText(promo_corp1.toString(), {
    x: 240,
    y: height2 - 531,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // promo_order1
  const promo_order1 = Military_info.promo_order1 || '';
  secondPage.drawText(promo_order1.toString(), {
    x: 320,
    y: height2 - 531,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // promo_date1
  const promo_date1 = new Date(Military_info.promo_date1);
  const promo_date_day1 = promo_date1.getDate();
  const promo_date_month1 = promo_date1.getMonth();
  const promo_date_year1 = promo_date1.getFullYear() + 543;

  secondPage.drawText(promo_date_day1.toString(), {
    x: 410,
    y: height2 - 531,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  secondPage.drawText(months[promo_date_month1], {
    x: 465,
    y: height2 - 531,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  secondPage.drawText(promo_date_year1.toString(), {
    x: 520,
    y: height2 - 531,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // promo_title2
  const promo_title2 = Military_info.promo_title2 || '';
  secondPage.drawText(promo_title2.toString(), {
    x: 150,
    y: height2 - 549,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const promo_corp2 = Military_info.promo_corp2 || '';
  secondPage.drawText(promo_corp2.toString(), {
    x: 240,
    y: height2 - 549,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // promo_order2
  const promo_order2 = Military_info.promo_order2 || '';
  secondPage.drawText(promo_order2.toString(), {
    x: 320,
    y: height2 - 549,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // promo_date2
  const promo_date2 = new Date(Military_info.promo_date2);
  const promo_date_day2 = promo_date2.getDate();
  const promo_date_month2 = promo_date2.getMonth();
  const promo_date_year2 = promo_date2.getFullYear() + 543;

  secondPage.drawText(promo_date_day2.toString(), {
    x: 410,
    y: height2 - 549,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  secondPage.drawText(months[promo_date_month2], {
    x: 465,
    y: height2 - 549,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  secondPage.drawText(promo_date_year2.toString(), {
    x: 520,
    y: height2 - 549,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next section
  // next line

  // contactable address
  const contactableAddress = addresses?.Contactable_address; ///

  console.log(contactableAddress);

  // House number
  const contactableHouseNumber = contactableAddress?.house_num || '';
  secondPage.drawText(contactableHouseNumber.toString(), {
    x: 205,
    y: height2 - 566,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // House moo
  const contactableMoo = contactableAddress?.house_moo || '';
  secondPage.drawText(contactableMoo.toString(), {
    x: 272,
    y: height2 - 566,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Soi
  const contactableSoi = contactableAddress?.soi || '';
  secondPage.drawText(contactableSoi.toString(), {
    x: 355,
    y: height2 - 566,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // subdistrict
  const contactableSubdistrict = contactableAddress?.subdistrict || '';
  secondPage.drawText(contactableSubdistrict.toString(), {
    x: 500,
    y: height2 - 566,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // district
  const contactableDistrict = contactableAddress?.district || '';
  secondPage.drawText(contactableDistrict.toString(), {
    x: 130,
    y: height2 - 584,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // province
  const contactableProvince = contactableAddress?.province || '';
  secondPage.drawText(contactableProvince.toString(), {
    x: 250,
    y: height2 - 584,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // postal code  
  const contactablePostalCode = contactableAddress?.postal_code  || '';
  secondPage.drawText(contactablePostalCode.toString(), {
    x: 400,
    y: height2 - 584,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // tel number
  const tel_num = student.tel_num || '';
  secondPage.drawText(tel_num.toString(), {
    x: 505,
    y: height2 - 584,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // Next line

  // phone number
  const phone_num = student.phone_num || '';
  secondPage.drawText(phone_num.toString(), {
    x: 110,
    y: height2 - 602,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // email
  const personal_email = student.personal_email;
  secondPage.drawText(personal_email.toString(), {
    x: 220,
    y: height2 - 602,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next section

  //follower person

  // tab 1

  // follower_name1
  secondPage.drawText(Military_info.follower_name1.toString(), {
    x: 110,
    y: height2 - 638,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // follower_school1
  secondPage.drawText(Military_info.follower_school1.toString(), {
    x: 285,
    y: height2 - 638,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // follower_address1

  // house_num
  const followerHouseNumber1 = addresses.Follwer_address1.house_num;
  secondPage.drawText(followerHouseNumber1.toString(), {
    x: 480,
    y: height2 - 638,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // moo
  const followerMoo1 = addresses.Follwer_address1.house_moo;
  secondPage.drawText(followerMoo1.toString(), {
    x: 540,
    y: height2 - 638,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // soi
  const followerSoi1 = addresses.Follwer_address1.soi;
  secondPage.drawText(followerSoi1.toString(), {
    x: 150,
    y: height2 - 656,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // subdistrict
  const followerSubdistrict1 = addresses.Follwer_address1.subdistrict;
  secondPage.drawText(followerSubdistrict1.toString(), {
    x: 315,
    y: height2 - 656,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // district
  const followerDistrict1 = addresses.Follwer_address1.district;
  secondPage.drawText(followerDistrict1.toString(), {
    x: 470,
    y: height2 - 656,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // province
  const followerProvince1 = addresses.Follwer_address1.province;
  secondPage.drawText(followerProvince1.toString(), {
    x: 150,
    y: height2 - 674,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // postal code
  const followerPostalCode1 = addresses.Follwer_address1.postal_code;
  secondPage.drawText(followerPostalCode1.toString(), {
    x: 328,
    y: height2 - 674,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // tel_num
  const followerTelNum1 = Military_info.follower_telnum1;
  secondPage.drawText(followerTelNum1.toString(), {
    x: 425,
    y: height2 - 674,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const followerPhoneNum1 = Military_info.follower_phonenum1;
  secondPage.drawText(followerPhoneNum1.toString(), {
    x: 515,
    y: height2 - 674,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // tab 2

  // follower_name2
  secondPage.drawText(Military_info.follower_name2.toString(), {
    x: 110,
    y: height2 - 692,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // follower_school2
  secondPage.drawText(Military_info.follower_school2.toString(), {
    x: 285,
    y: height2 - 692,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // follower_address2

  // house_num
  const followerHouseNumber2 = addresses.Follwer_address2.house_num;
  secondPage.drawText(followerHouseNumber2.toString(), {
    x: 480,
    y: height2 - 692,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // moo
  const followerMoo2 = addresses.Follwer_address2.house_moo;
  secondPage.drawText(followerMoo2.toString(), {
    x: 540,
    y: height2 - 692,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // soi
  const followerSoi2 = addresses.Follwer_address2.soi;
  secondPage.drawText(followerSoi2.toString(), {
    x: 150,
    y: height2 - 710,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // subdistrict
  const followerSubdistrict2 = addresses.Follwer_address2.subdistrict;
  secondPage.drawText(followerSubdistrict2.toString(), {
    x: 315,
    y: height2 - 710,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // district
  const followerDistrict2 = addresses.Follwer_address2.district;
  secondPage.drawText(followerDistrict2.toString(), {
    x: 470,
    y: height2 - 710,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next line

  // province
  const followerProvince2 = addresses.Follwer_address2.province;
  secondPage.drawText(followerProvince2.toString(), {
    x: 150,
    y: height2 - 728,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // postal code
  const followerPostalCode2 = addresses.Follwer_address2.postal_code;
  secondPage.drawText(followerPostalCode2.toString(), {
    x: 328,
    y: height2 - 728,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // tel_num
  const followerTelNum2 = Military_info.follower_telnum2;
  secondPage.drawText(followerTelNum2.toString(), {
    x: 425,
    y: height2 - 728,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  const followerPhoneNum2 = Military_info.follower_phonenum2;
  secondPage.drawText(followerPhoneNum2.toString(), {
    x: 515,
    y: height2 - 728,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });

  // next section

  // student signature
  secondPage.drawText(nameSignature.toString(), {
    x: 360,
    y: height2 - 810,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0), // black
  });


















  // return pdf
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}