const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const fontPath = path.resolve(process.cwd(), 'public/fonts/THSarabunNew/THSarabunNew.ttf');

let font

try {
    font = fs.readFileSync(fontPath, 'base64');
} catch (error) {
    console.error(`Error reading font file: ${error.message}`);
    process.exit(1);
}

async function prakan(data){
    console.log(data);
    

    const pdfPath = path.resolve(process.cwd(), 'public/documents/accident/prakanform.pdf');
    console.log(pdfPath);
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    pdfDoc.registerFontkit(fontkit);
    
    const fontBytes = fs.readFileSync(fontPath);
    const thSarabunFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    const date = new Date(data.acc_date)
    const formatDate = (date) => {
        // const date = new Date(dateSend)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
      };
    const formattedDate = formatDate(date)
    console.log(formattedDate);

    const newMedicalFee = data.medical_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const stuId1 = data.Student.id.toString().slice(0, 1);
    const stuId2 = data.Student.id.toString().slice(1, 2);
    const stuId3 = data.Student.id.toString().slice(2, 3);
    const stuId4 = data.Student.id.toString().slice(3, 4);
    const stuId5 = data.Student.id.toString().slice(4, 5);
    const stuId6 = data.Student.id.toString().slice(5, 6);
    const stuId7 = data.Student.id.toString().slice(6, 7);
    const stuId8 = data.Student.id.toString().slice(7, 8);
    const stuId9 = data.Student.id.toString().slice(8, 9);
    const stuId10 = data.Student.id.toString().slice(9, 10);

    const facNameTH = data.Student.facultyNameTH.split('คณะ')[1]
    console.log("facNameTHJaa", facNameTH);
    console.log("timeKub", data.time_acc);

    const isoTime = data.time_acc; // ได้แบบนี้จาก time input (05:42)
    console.log("isoTime", isoTime); 
    const [hours, minutes] = isoTime.toString().split(':');
    const hours1 = hours.split(' ')[4];
    const myDate = `${hours1}:${minutes}`;
    console.log("myDate", myDate); // "05:42"

      

    firstPage.drawText(data.Student.fnameTH + ' ' + data.Student.lnameTH, {
        x: 120,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId1+'', {
        x: 400,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId2+'', {
        x: 415,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId3+'', {
        x: 430,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId4+'', {
        x: 450,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId5+'', {
        x: 465,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId6+'', {
        x: 480,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId7+'', {
        x: 495,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId8+'', {
        x: 510,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId9+'', {
        x: 530,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(stuId10+'', {
        x: 545,
        y: height-140,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    if (data.Student.degree === "บัณฑิตศึกษา") {
        firstPage.drawText("/", {
            x: 150,
            y: height - 172,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1, // Ensure full opacity for bold effect
        });
    } else {
        firstPage.drawText("/", {
            x: 94,
            y: height - 172,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1, // Ensure full opacity for bold effect
        });
    }
    firstPage.drawText(data.Student.year , {
        x: 487,
        y: height-172,
        size: 14,
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(facNameTH + ' / '+ data.Student.facultyNameEN, {
        x: 232,
        y: height-172,
        size: 10,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.Student.phone_num+'', {
        x: 210,
        y: height-205,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.Student.personal_email, {
        x: 380,
        y: height-205,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.acc_desc, {
        x: 223,
        y: height-245,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.des_injury, {
        x: 180,
        y: height-322,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(`${formattedDate}`, {
        x: 180,
        y: height-305,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    
    firstPage.drawText(myDate + " น.", {
        x: 452,
        y: height-305,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    if (data.in_university === true) {
        firstPage.drawText("/", {
            x: 132,
            y: height - 350,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1, // Ensure full opacity for bold effect
        });
        firstPage.drawText(data.accident_place , {
            x: 357,
            y: height - 347,
            size: 14,
            font: thSarabunFont,
        });
    } else if (data.in_university === false) {
        firstPage.drawText("/", {
            x: 132,
            y: height - 387,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1,
        });
        firstPage.drawText(data.accident_place , {
            x: 282,
            y: height - 387,
            size: 14,
            font: thSarabunFont,
        });
    }


    firstPage.drawText(data.treatment_place, {
        x: 60,
        y: height-451,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    if(data.hospital_type === 0){
        firstPage.drawText("/", {
            x: 265,
            y: height - 453,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1,
        });
    }

    else if(data.hospital_type === 1){
        firstPage.drawText("/", {
            x: 371,
            y: height - 453,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1,
        });
    }
    else if(data.hospital_type === 2){
        firstPage.drawText("/", {
            x: 485,
            y: height - 453,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1,
        });
    }


    firstPage.drawText(data.treatment_place2, {
        x: 60,
        y: height-483,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    if(data.hospital_type2 === 0){
        firstPage.drawText("/", {
            x: 265,
            y: height - 485,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1,
        });
    }
    else if(data.hospital_type2 === 1){
        firstPage.drawText("/", {
            x: 371,
            y: height - 485,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1,
        });
    }
    else if(data.hospital_type2 === 2){
        firstPage.drawText("/", {
            x: 485,
            y: height - 485,
            size: 30,
            font: thSarabunFont,
            color: rgb(0, 0, 0),
            opacity: 1,
        });
    }

    firstPage.drawText(newMedicalFee + ' บาท', {
        x: 251,
        y: height-524,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync('public/documents/accident/'+data.Student.id+'_accident_insurance.pdf', pdfBytes);
    return 'public/documents/accident/prakanformfilled.pdf'
}

module.exports = { prakan };
