const {jsPDF} = require('jspdf');
const font = require('../font/THSarabun-normal')

const createPdfUsingAccForm = (data) =>{
    const doc = new jsPDF();
    doc.setFont("THSarabun");
    doc.text("ฝ่ายทุนการศึกษาและบริการนิสิต สำนักบริหารกิจการนิสิต จุฬาลงกรณ์มหาวิทยาลัย", 10, 10);
    doc.text("Department of Scholarship & Students Service, Office of the Student Affairs, Chulalongkorn University", 10, 20)
    doc.text("ชื่อและนามสกุล "+ data.name,10,30)
    doc.text("เลขนิสิต"+ data.id,150,30)
    doc.text("คณะ" + data.faculty,10,40)
    doc.text("email" + data.email,10,50)
    doc.text("การเกิดอุบัติเหตุ" + data.desAcc,10,60)
    doc.text("อาการบาดเจ็บ" + data.desInj,10,70)
    doc.text("วันเกิดอุบัติเหตุ " + data.dateAcc,10,80)
    doc.text("สถานที่เกิดอุบัติเหตุ" + data.placeAcc,10,90)
    doc.text("ชื่อสถานพยาบาลที่เข้ารับการรักษา" + data.placeTreat,10,100)
    doc.text("ประเภทสถานพยาบาล" + data.typeHos,10,110)
    doc.text("เลขบัญชีธนาคารนิสิต" + data.bankAcc,10,120)
    doc.text("ค่ารักษาพยาบาลเป็นตัวเลข" + data.medicalFeeNum,10,130)
    doc.text("ค่ารักษาพยาบาลเป็นตัวอักษร" + data.medicalFeeText,10,140)
    doc.save("a4.pdf");
}

module.exports = {createPdfUsingAccForm}