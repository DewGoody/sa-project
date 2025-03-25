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
      

    firstPage.drawText(data.Student.fnameTH + ' ' + data.Student.lnameTH, {
        x: 204,
        y: height-223.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.Student.id+'', {
        x: 460,
        y: height-223.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.Student.facultyNameTH + ' / '+ data.Student.facultyNameEN, {
        x: 124,
        y: height-249,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.Student.phone_num+'', {
        x: 231,
        y: height-275,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.Student.personal_email, {
        x: 360,
        y: height-274.6,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.acc_desc, {
        x: 239,
        y: height-346,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.des_injury, {
        x: 220,
        y: height-372.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(`${formattedDate}`, {
        x: 206,
        y: height-397.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.accident_place, {
        x: 225,
        y: height-422.6,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(data.treatment_place, {
        x: 299,
        y: height-449,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.hospital_type, {
        x: 304,
        y: height-475,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(newMedicalFee + ' บาท', {
        x: 143,
        y: height-552.5,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
   
    firstPage.drawText(data.medical_fee_text, {
        x: 143,
        y: height-578,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText("( "+data.Student.fnameTH + ' ' + data.Student.lnameTH+" )", {
        x: 397,
        y: height-710,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync('public/documents/accident/'+data.Student.id+'_accident_insurance.pdf', pdfBytes);
    return 'public/documents/accident/prakanformfilled.pdf'
}

module.exports = { prakan };
