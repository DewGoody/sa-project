const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFontEmbedder, StandardFonts, StandardFontValues } = require('pdf-lib');
const fontPath = path.resolve(process.cwd(), 'public/fonts/THSarabunNew/THSarabunNew.ttf');
const fontkit = require('fontkit');
// Read font file



let font;

const months = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];


async function uhc(data) {
  console.log('data', data);
  const {
    id,
    lnameTH,
    fnameTH,
    facultyNameTH,
    year,
    bd,
    title,
    thai_id,
    phone_num,
    personal_email,
  } = data.Student;
  const {
    last_update,
    smart_card_issured,
    smart_card_expired,
    status_before_reg,
    status_info,
    frequence_uses,
    is_been,
    is_congenital_disease
  } = data.UHC_reg_info;

  // date
  let currentDate = new Date();

  // Load the existing PDF
  const pdfPath = path.resolve(process.cwd(), 'public/documents/uhc/uhc_reg.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);


  // Load the TH Sarabun font
  const fontBytes = fs.readFileSync(fontPath);
  const thSarabunFont = await pdfDoc.embedFont(fontBytes);

  const tickbyte = fs.readFileSync('public/tick.png');
  const tick = await pdfDoc.embedPng(tickbyte);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];


  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  console.log('width', width);
  console.log('height', height);

  // First page

  //date 

  firstPage.drawText(`${currentDate.getDate()}`, {
    x: 385,
    y: height - 180,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });
  // month
  firstPage.drawText(`${months[currentDate.getMonth()]}`, {
    x: 445,
    y: height - 180,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });
  // year
  firstPage.drawText(`${currentDate.getFullYear() + 543}`, {
    x: 525,
    y: height - 180,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });


  //date
  firstPage.drawText(`${currentDate.getDate()}`, {
    x: 142,
    y: height - 210,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${months[currentDate.getMonth()]}`, {
    x: 190,
    y: height - 210,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${currentDate.getFullYear() + 543}`, {
    x: 268,
    y: height - 210,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });
//115 : 138 : 98,
  firstPage.drawCircle({
    x: title !== 'นาย' ? title === 'นาง' ? 220 : 244 : 200,
    y: height -234,
    size: title === 'นางสาว' ? 12 : 7,
    borderWidth: 0.5,
    borderColor: rgb(0, 0, 0),
  });

  firstPage.drawText(`${fnameTH || ''}`, {
    x: 270,
    y: height - 230,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${lnameTH || ''}`, {
    x: 420,
    y: height - 230,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // next line
  // the possible longest name is สถาบันบัณฑิตบริหารธุรกิจศศินทร์แห่งจุฬาลงกรณ์มหาวิทยาลัย which is 40 characters
  //if (facultyNameTH.length > 20)  we need to split the text into 2 lines

  firstPage.drawText(`${facultyNameTH || ''}`, {
    x: 92,
    y: height - 255,
    size: 9,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });


  // student year cut in 1 aug every year
  let stu_year = currentDate.getFullYear() + 543 - (2500 + parseInt(year));
  if (currentDate.getMonth() < 8) {
    stu_year += 1;
  }
  console.log('stu_year', stu_year);
  firstPage.drawText(`${stu_year || ''}`, {
    x: 195,
    y: height - 255,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${id || ''}`, {
    x: 260,
    y: height - 255,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${thai_id || ''}`, {
    x: 440,
    y: height - 255,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // next line
  // date issue smart card
  const smart_card_issured_date = new Date(smart_card_issured).toLocaleDateString('th-TH', { dateStyle: 'long' }) || '';
  firstPage.drawText(`${smart_card_issured_date || ''}`, {
    x: 160,
    y: height - 280,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // date expired smart card
  const smart_card_expired_date = new Date(smart_card_expired).toLocaleDateString('th-TH', { dateStyle: 'long' }) || '';
  firstPage.drawText(`${smart_card_expired_date || ''}`, {
    x: 336,
    y: height - 280,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // birthday
  const bd_date = new Date(bd).toLocaleDateString('th-TH', { dateStyle: 'long' }) || '';
  firstPage.drawText(`${bd_date || ''}`, {
    x: 465,
    y: height - 280,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // next line
  // house num
  const house_num = data.DOPA_address.house_num || '';
  firstPage.drawText(`${house_num || ''}`, {
    x: 180,
    y: height - 305,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // house_moo
  const house_moo = data.DOPA_address.house_moo || '-';
  firstPage.drawText(`${house_moo || ''}`, {
    x: 260,
    y: height - 305,
    size: 12,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // soi
  const soi = data.DOPA_address.soi || '-';
  firstPage.drawText(`${soi || ''}`, {
    x: 340,
    y: height - 305,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // street
  const street = data.DOPA_address.street || '-';
  firstPage.drawText(`${street || ''}`, {
    x: 440,
    y: height - 305,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // next line
  // subdistrict
  const subdistrict = data.DOPA_address.subdistrict || '-';
  firstPage.drawText(`${subdistrict || ''}`, {
    x: 120,
    y: height - 328,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // district
  const district = data.DOPA_address.district || '-';
  firstPage.drawText(`${district || ''}`, {
    x: 250,
    y: height - 328,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // province
  const province = data.DOPA_address.province || '-';
  firstPage.drawText(`${province || ''}`, {
    x: 350,
    y: height - 328,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // postal code
  const postal_code = data.DOPA_address.postal_code || '-';
  firstPage.drawText(`${postal_code || ''}`, {
    x: 475,
    y: height - 328,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // next line
  // phone number
  let tel_num = data.Student.tel_num || '-';
  firstPage.drawText(`${tel_num || ''}`, {
    x: 180,
    y: height - 352,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });


  firstPage.drawText(`${personal_email || ''}`, {
    x: 370,
    y: height - 352,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // signature
  const name_signature = `${title || ''}${fnameTH || ''} ${lnameTH || ''}`;
  const fontsize_Sign = name_signature.length > 40 ? 500 / name_signature.length : 14;
  firstPage.drawText(`${name_signature || ''}`, {
    x: 100,
    y: height - 470,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // sign
  firstPage.drawText(`${name_signature || ''}`, {
    x: 254,
    y: height - 616,
    size: 14,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });


  // next page


  const secondPage = pages[1];

  // Get the width and height of the first page
  const { width: width2, height: height2 } = secondPage.getSize();

  // column 1

  secondPage.drawText(`${currentDate.getDate()}`, {
    x: 100,
    y: height2 - 95,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  secondPage.drawText(`${months[currentDate.getMonth()]}`, {
    x: 140,
    y: height2 - 95,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  secondPage.drawText(`${currentDate.getFullYear() + 543}`, {
    x: 220,
    y: height2 - 95,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // check title then circle

  secondPage.drawCircle({
    x: title !== 'นาย' ? title === 'นาง' ? 115 : 138 : 98,
    y: height2 - 134,
    size: title === 'นางสาว' ? 12 : 7,
    borderWidth: 0.5,
    borderColor: rgb(0, 0, 0),
  });





  // name
  secondPage.drawText(`${fnameTH || ''} ${lnameTH || ''}`, {
    x: 160,
    y: height2 - 135,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // THAI ID  
  console.log('thai_id.length', thai_id.length);
  if (thai_id && thai_id.length === 13) {
    for (let i = 0; i < 13; i++) {
      secondPage.drawText(`${thai_id[i]}`, {
        x: 47 + i * 16.1,
        y: height2 - 165,
        size: 10,
        font: thSarabunFont,
        color: rgb(0, 0, 0),
      });
    }
  }

  // occupation
  secondPage.drawText(`นิสิต`, {
    x: 220,
    y: height2 - 185,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  //birthday
  const bd_date2 = new Date(bd).toLocaleDateString('th-TH', { dateStyle: 'long' }) || '';
  secondPage.drawText(`${bd_date2 || ''}`, {
    x: 100,
    y: height2 - 185,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address house num
  secondPage.drawText(`${house_num || ''}`, {
    x: 195,
    y: height2 - 200,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address moo
  secondPage.drawText(`${house_moo || ''}`, {
    x: 250,
    y: height2 - 200,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address soi
  secondPage.drawText(`${soi || ''}`, {
    x: 80,
    y: height2 - 213,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address street
  secondPage.drawText(`${street || ''}`, {
    x: 155,
    y: height2 - 213,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address subdistrict
  secondPage.drawText(`${subdistrict || ''}`, {
    x: 240,
    y: height2 - 213,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address district
  secondPage.drawText(`${district || ''}`, {
    x: 80,
    y: height2 - 226,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address province
  secondPage.drawText(`${province || ''}`, {
    x: 155,
    y: height2 - 226,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // dopa address postal code
  secondPage.drawText(`${postal_code || ''}`, {
    x: 250,
    y: height2 - 226,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // phone number
  secondPage.drawText(`${tel_num || ''}`, {
    x: 90,
    y: height2 - 240,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });
  secondPage.drawText(`${phone_num || ''}`, {
    x: 220,
    y: height2 - 240,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });
  // draw tick
  switch (status_before_reg) {
    case 'existing':
      secondPage.drawImage(tick, {
        x: 47,
        y: height2 - 273,
        width: 10,
        height: 10,
      });
      secondPage.drawText(`${status_info || ''}`, {
        x: 200,
        y: height2 - 272,
        size: 10,
        font: thSarabunFont,
        color: rgb(0, 0, 0),
      });
      break;
    case 'government':
      secondPage.drawImage(tick, {
        x: 47,
        y: height2 - 288,
        width: 10,
        height: 10,
      });
      break;
    case 'social':
      secondPage.drawImage(tick, {
        x: 159,
        y: height2 - 288,
        width: 10,
        height: 10,
      });
      break;
    case 'other':
      secondPage.drawImage(tick, {
        x: 47,
        y: height2 - 303,
        width: 10,
        height: 10,
      });

      secondPage.drawText(`${status_info || ''}`, {
        x: 110,
        y: height2 - 300,
        size: 10,
        font: thSarabunFont,
        color: rgb(0, 0, 0),
      });
      break;
  }

  // signature
  secondPage.drawText(`${name_signature || ''}`, {
    x: 110,
    y: height2 - 485,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  });

  // next column
  // document
  secondPage.drawImage(tick, {
    x: 298,
    y: height2 - 74,
    width: 10,
    height: 10,
  });

  secondPage.drawImage(tick, {
    x: 298,
    y: height2 - 89,
    width: 10,
    height: 10,
  });

  secondPage.drawImage(tick, {
    x: 298,
    y: height2 - 103,
    width: 10,
    height: 10,
  });

  // survey option
  switch (frequence_uses) {
    case '1':
      secondPage.drawImage(tick, {
        x: 295,
        y: height2 - 158,
        width: 10,
        height: 10,
      });
      break;
    case '2':
      secondPage.drawImage(tick, {
        x: 332,
        y: height2 - 158,
        width: 10,
        height: 10,
      });
      break;
    case '3':
      secondPage.drawImage(tick, {
        x: 376,
        y: height2 - 158,
        width: 10,
        height: 10,
      });
      break;
  }

  // is been
  switch (is_been) {
    case true:
      secondPage.drawImage(tick, {
        x: 295,
        y: height2 - 186,
        width: 10,
        height: 10,
      });
      break;
    case false:
      secondPage.drawImage(tick, {
        x: 332,
        y: height2 - 186,
        width: 10,
        height: 10,
      });
      break;
  }

  switch (is_congenital_disease) {
    case true:
      secondPage.drawImage(tick, {
        x: 295,
        y: height2 - 214,
        width: 10,
        height: 10,
      });
      break;
    case false:
      secondPage.drawImage(tick, {
        x: 332,
        y: height2 - 214,
        width: 10,
        height: 10,
      });
  }

  // name 
  secondPage.drawText(`${title || ''}${fnameTH || ''} ${lnameTH || ''}`, {
    x: 385,
    y: height2 - 270,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // age 
  const age = currentDate.getFullYear() - new Date(bd).getFullYear();
  secondPage.drawText(`${age || ''}`, {
    x: 310,
    y: height2 - 285,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // address
  secondPage.drawText(`${house_num || ''}`, {
    x: 377,
    y: height2 - 285,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  secondPage.drawText(`${house_moo || '-'}`, {
    x: 420,
    y: height2 - 285,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  secondPage.drawText(`${soi || '-'}`, {
    x: 480,
    y: height2 - 285,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // next line
  // street
  secondPage.drawText(`${street || '-'}`, {
    x: 315,
    y: height2 - 300,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // subdistrict
  secondPage.drawText(`${subdistrict || ''}`, {
    x: 440,
    y: height2 - 300,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // next line
  // district

  secondPage.drawText(`${district || ''}`, {
    x: 335,
    y: height2 - 315,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // province
  secondPage.drawText(`${province || ''}`, {
    x: 440,
    y: height2 - 315,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // next line
  secondPage.drawText(`${tel_num || ''}`, {
    x: 330,
    y: height2 - 328,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })
  // phone num 
  secondPage.drawText(`${phone_num || ''}`, {
    x: 450,
    y: height2 - 328,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  //signature

  secondPage.drawText(`${title || ''}${fnameTH || ''} ${lnameTH || ''}`, {
    x: 310,
    y: height2 - 457,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })

  // next column
  // student year
  secondPage.drawText(`${stu_year || ''}`, {
    x: 580,
    y: height2 - 56,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })


  // faculty name
  secondPage.drawText(`${facultyNameTH || ''}`, {
    x: 560,
    y: height2 - 70,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })
  // id
  secondPage.drawText(`${id || ''}`, {
    x:600,
    y: height2 - 84,
    size: 10,
    font: thSarabunFont,
    color: rgb(0, 0, 0),
  })



  // const pdfBytes = await pdfDoc.save('public/documents/uhc/uhc_saved.pdf');
  // // save the pdf to disk
  // fs.writeFileSync('public/documents/uhc/uhc_saved.pdf', pdfBytes);

  return await pdfDoc.save();
}
module.exports = {uhc};

// uhc({
//   "Student": {
//     "id": "6512345678",
//     "lnameTH": "ตังเมเเ",
//     "fnameTH": "ภะวุง",
//     "lnameEN": "Phawan",
//     "fnameEN": "Tumay",
//     "fac_id": "78",
//     "fac_name": "ไสยศาสตร์",
//     "dept": "ไสยศาสตร์ชาติ",
//     "year": "65",
//     "bd": "2000-07-26T00:00:00.000Z",
//     "tel_num": null,
//     "title": "นาย",
//     "major": null,
//     "nationality": "ไทย",
//     "race": "ไทย",
//     "religion": "พุทธ",
//     "thai_id": "14234567890123"
//   },
//   "UHC_reg_info": {
//     "id": "6512345678",
//     "last_update": "2024-08-11T15:27:03.031Z",
//     "smart_card_issured": "2018-01-10T00:00:00.000Z",
//     "smart_card_expired": "2028-08-30T00:00:00.000Z",
//     "status_before_reg": "existing",
//     "status_info": "มัญจาคีรี",
//     "frequence_uses": "1",
//     "is_been": false,
//     "is_congenital_disease": false
//   },
//   "DOPA_address": {
//     "id": "6512345678",
//     "address_type": "DOPA_address",
//     "created_at": "2024-08-02T08:28:53.324Z",
//     "house_num": "254",
//     "house_moo": null,
//     "soi": null,
//     "street": "",
//     "subdistrict": "ห้วยหิน",
//     "district": "ชัยบาดาล",
//     "province": "ลพบุรี",
//     "postal_code": 15130,
//     "address_id": "8fdfcec8-2dbb-4bc6-9323-1fd2b3d4a5d4"
//   }
// });