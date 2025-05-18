import { PrismaClient } from '@prisma/client';
import { prakan } from '../../document_build/prakan'

const prisma = new PrismaClient();

export async function getPrakanDataById(id) {
    const prakan = await prisma.accident_info.findUnique({
        where: {id: id},
        include: {
            Student: true
        }
    })
    if(prakan){           
        return prakan
    }
    else{
        return "Not found"
    }
}

export async function createPrakan(data) {  
    const timeString = data.time_acc  
    const [hours, minutes] = timeString.split(':').map(Number);

// Create a Date object using today's date (or any dummy date)
    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes)); // fixed UTC

    console.log("Time (UTC):", timeAsDate.toISOString()); // Always consistent
    console.log("time2", timeAsDate); 
    
    const createRequest = await prisma.request.create({
        data: {
            type: "การเบิกจ่ายประกันอุบัติเหตุ",
            status: "รอจองคิว",
            stu_id: data.id,
        }
    })   

    const createPrakan = await prisma.accident_info.create({
        data: {
            stu_id: Number(data.id),
            acc_desc: data.acc_desc,
            des_injury: data.des_injury,
            acc_date: new Date(data.acc_date),
            accident_place: data.accident_place,
            treatment_place: data.treatment_place,
            hospital_type: data.hospital_type == null ? null : Number(data.hospital_type),
            treatment_place2: data.treatment_place2,
            hospital_type2: data.hospital_type2 == null ? null : Number(data.hospital_type2),
            medical_fee: Number(data.medical_fee),
            // medical_fee_text: data.medical_fee_text,
            req_id: createRequest.id,
            time_acc: timeAsDate,
            in_university: Boolean(data.in_university),
        }
    })

    await prisma.student.update({
        where: {id: Number(data.id)},
        data: {
            phone_num: data.phone_num,
            tel_num: data.tel_num,
            personal_email: data.personal_email,
            year: data.year,
            degree: data.degree
        }
    })
    return createPrakan
}

export async function createPdfPrakan(formId) {
    const response = await getPrakanDataById(formId);  // Fetch data
    const pdfBuffer = await prakan(response);  // Generate PDF and get the buffer
    return pdfBuffer;  // Return the actual PDF buffer
}

export async function updatePrakanForm(data) {
    const timeString = data.time_acc  
    const [hours, minutes] = timeString.split(':').map(Number);

// Create a Date object using today's date (or any dummy date)
    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes)); // fixed UTC

    console.log("Time (UTC):", timeAsDate.toISOString()); // Always consistent
    console.log("time1", timeAsDate);
    // if(data.token !== "0"){
    //     await prakan(data)
    // }
    
    const prakanUpdated = await prisma.accident_info.update({
        where: {id: data.formId},
        data:{
             acc_desc: data.acc_desc,
            des_injury: data.des_injury,
            acc_date: new Date(data.acc_date),
            accident_place: data.accident_place,
            treatment_place: data.treatment_place,
            hospital_type: data.hospital_type == null ? null : Number(data.hospital_type),
            treatment_place2: data.treatment_place2,
            hospital_type2: data.hospital_type2 == null ? null : Number(data.hospital_type2),
            medical_fee: Number(data.medical_fee),
            // medical_fee_text: data.medical_fee_text,
            req_id: createRequest.id,
            time_acc: timeAsDate,
            in_university: Boolean(data.in_university),
        }
    })    
     await prisma.student.update({
        where: {id: Number(data.id)},
        data: {
            phone_num: data.phone_num,
            tel_num: data.tel_num,
            personal_email: data.personal_email,
            year: data.year,
            degree: data.degree
        }
    })
    if(prakanUpdated){           
        return prakanUpdated
    }
    else{
        return "Not found"
    }
}