import { PrismaClient } from '@prisma/client';
import { prakan } from '../../../document_build/prakan'


const prisma = new PrismaClient();

export async function POST(req,res){
    let data = await req.json()
    await prakan(data)
    console.log("data",data);
    
    
    
    const createPrakan = await prisma.accident_info.create({
        data: {
            stu_id: Number(data.id),
            acc_desc: data.acc_desc,
            acc_date: new Date(data.acc_date),
            accident_place: data.accident_place,
            treatment_place: data.treatment_place,
            hospital_type: data.hospital_type,
            medical_fee: Number(data.medical_fee)
        }
    })
    return createPrakan
}