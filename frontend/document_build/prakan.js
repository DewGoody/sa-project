const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');

let font

try {
    font = fs.readFileSync(fontPath, 'base64');
} catch (error) {
    console.error(`Error reading font file: ${error.message}`);
    process.exit(1);
}

async function prakan(data){
    const pdfPath = path.resolve(__dirname, '/Users/patcharapolsohheng/sa-frontend/backend/models/prakanform.pdf');
    console.log(pdfPath);
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    pdfDoc.registerFontkit(fontkit);
    
    const fontBytes = fs.readFileSync('/Users/patcharapolsohheng/sa-frontend/backend/font/THSarabunNew.ttf');
    const thSarabunFont = await pdfDoc.embedFont(fontBytes);
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    firstPage.drawText(data.firstNameTH + ' ' + data.lastNameTH, {
        x: 204,
        y: height-223.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.studentId, {
        x: 460,
        y: height-223.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.facultyNameTH + ' / '+ data.facultyNameEN, {
        x: 124,
        y: height-249,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.phone, {
        x: 231,
        y: height-275,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.emailType, {
        x: 360,
        y: height-274.6,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.desAcc, {
        x: 239,
        y: height-346,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.desInj, {
        x: 220,
        y: height-372.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.dateAcc, {
        x: 206,
        y: height-397.3,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.placeAcc, {
        x: 225,
        y: height-422.6,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    firstPage.drawText(data.placeTreat, {
        x: 299,
        y: height-449,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.typeHos, {
        x: 304,
        y: height-475,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.bankAcc, {
        x: 255,
        y: height-500.4,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
    firstPage.drawText(data.medicalFeeNum, {
        x: 143,
        y: height-552.5,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })
   
    firstPage.drawText(data.thaiText, {
        x: 143,
        y: height-578,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()
    const savePath = "/backend/prakanfilled.pdf"
    fs.writeFileSync('/Users/patcharapolsohheng/sa-frontend/backend/prakanformfilled.pdf', pdfBytes);
    return pdfBytes
}

module.exports = { prakan };
