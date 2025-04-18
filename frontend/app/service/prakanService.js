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
    const [hours,minutes] = data.time_acc.split(':');    
    const time = new Date();
    time.setHours(hours+7);
    time.setMinutes(minutes);
    time.setSeconds(0);
    time.setMilliseconds(0);
    console.log("time1", time);
    time.toISOString();   
    console.log("time2", time); 
    
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
            hospital_type: Number(data.hospital_type),
            treatment_place2: data.treatment_place2,
            hospital_type2: Number(data.hospital_type2),
            medical_fee: Number(data.medical_fee),
            // medical_fee_text: data.medical_fee_text,
            req_id: createRequest.id,
            time_acc: time,
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
    const response = await getPrakanDataById(formId)
    await prakan(response)
    return response
}

export async function updatePrakanForm(data) {
    const [hours,minutes] = data.time_acc.split(':');
    const time = new Date();
    time.setHours(hours+7);
    time.setMinutes(minutes);
    time.setSeconds(0);
    time.setMilliseconds(0);
    time.toISOString();
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
            hospital_type: data.hospital_type,
            treatment_place2: data.treatment_place2,
            hospital_type2: Number(data.hospital_type2),
            medical_fee: Number(data.medical_fee),
            // medical_fee_text: data.medical_fee_text,
            time_acc: time,
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