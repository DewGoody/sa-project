const axios = require('axios')
const express = require('express')
const cors = require('cors');
const { PDFDocument, rgb, StandardFonts} = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const db = require('./db');
const { createPdfUsingAccForm } = require('./models/accForm')


const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

const createPrakanPdf = async (data) => {

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
   
    firstPage.drawText(data.thaiText + " บาท", {
        x: 143,
        y: height-578,
        size: 14,   
        font: thSarabunFont,
        color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()
    const savePath = "/backend/prakanfilled.pdf"
    fs.writeFileSync('/Users/patcharapolsohheng/sa-frontend/frontend/public/prakanformfilled.pdf', pdfBytes);
}

app.post('/api/create', (req, res, next) => {
    let data = req.body
    console.log(data);
    createPrakanPdf(data)

     db.query("INSERT INTO user VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [data.studentId, data.firstNameTH+' '+data.lastNameTH, data.facultyNameTH, data.phone, data.desAcc, data.emailType, data.desInj, data.dateAcc, data.placeAcc, data.placeTreat, data.typeHos, data.medicalFeeNum, data.bankAcc, data.thaiText],(err, result) => {
        if(err){
            console.log(err);
        }
    })

    res.status(200).send({
        msg: "ok"
    })
});

app.get('/api', (req, res, next) => {
    res.status(200).send({
        msg: "ok from server!"
    })
});

app.get('/api/cunex', (req, res, next) => {
    const headers = {
        'Content-Type': 'application/json',
        'ClientId': 'cuserv',
        'ClientSecret': '25a4b9d2efb6b16cc75ed6786c92526c'
    }
    let params = req.query
    let url = 'https://cunexdev.azurewebsites.net/service.svc/ext/type3/profile'
    axios.get(url, { params: params, headers: headers }).then(response => {
        res.status(200).send({
            data: response.data
        })
    })

});

app.listen(1337, () => console.log("Server is running at port 1337"))

// {
//     "id":"1",
//     "name":"kuy",
//     "faculty":"sus",
//     "phone":"0",
//     "desAcc":"1",
//     "email":"kwqh",
//     "desInj":"qwe",
//     "dateAcc":"asedwqe",
//     "placeAcc":"alwkd",
//     "placeTreat":"sdfqwf",
//     "typeHos":"akdj",
//     "medicalFeeNum":"aefaef",
//     "bankAcc":"awdlk",
//     "medicalFeeText":"aekfj"
// }