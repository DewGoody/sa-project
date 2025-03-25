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
    // await prakan(data)
    const createPrakan = await prisma.accident_info.create({
        data: {
            stu_id: Number(data.id),
            acc_desc: data.acc_desc,
            des_injury: data.des_injury,
            acc_date: new Date(data.acc_date),
            accident_place: data.accident_place,
            treatment_place: data.treatment_place,
            hospital_type: data.hospital_type,
            medical_fee: Number(data.medical_fee),
            medical_fee_text: data.medical_fee_text
        }
    })

    await prisma.student.update({
        where: {id: Number(data.id)},
        data: {
            phone_num: data.phone_num,
            tel_num: data.tel_num,
            personal_email: data.personal_email
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
    if(data.token !== "0"){
        await prakan(data)
    }
    console.log("yayyay", data);
    
    const prakanUpdated = await prisma.accident_info.update({
        where: {id: data.formId},
        data:{
            acc_desc: data.acc_desc,
            des_injury: data.des_injury,
            acc_date: new Date(data.acc_date),
            accident_place: data.accident_place,
            treatment_place: data.treatment_place,
            hospital_type: data.hospital_type,
            medical_fee: Number(data.medical_fee),
            medical_fee_text: data.medical_fee_text,
        }
    })    
    await prisma.student.update({
        where: {id: data.stu_id},
        data: {
            phone_num: data.phone_num,
            personal_email: data.personal_email
        }
    })    
    if(prakanUpdated){           
        return prakanUpdated
    }
    else{
        return "Not found"
    }
}