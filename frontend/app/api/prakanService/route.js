import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next'
import { prakan } from '../../../document_build/prakan'


const prisma = new PrismaClient();

export async function POST(req,res){
    let data = await req.json()
    await prakan(data)
    const createPrakan = await prisma.accident_info.create({
        data: {
            id: data.id,
            stu_id: data.stu_id,
            acc_desc: data.acc_desc,
            acc_date: data.acc_date,
            accident_place: data.accident_place,
            treatment_place: data.treatment_place,
            hospital_type: data.hospital_type,
            stu_bank_acc_name: data.stu_bank_acc_name,
            stu_bank_acc_number: data.stu_bank_acc_number,
            medical_fee: data.medical_fee
        }
    })
    return createPrakan
}