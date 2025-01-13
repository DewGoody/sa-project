import { PrismaClient } from '@prisma/client';
import { prakanFormBuilder } from '../../document_build/prakanFormBuilder'

const prisma = new PrismaClient();

export async function createPrakanInter(data) {    
    await prakanFormBuilder(data);
    console.log("data", data);

    const createPrakan = await prisma.prakan_inter_info.create({
      data: {
        stu_id: data.id,
        phone_num: data.phone_num,
        claimType: data.claimType,
        accidentDate: data.accidentDate || null,
        accidentTime: data.accidentTime || null,
        accidentCause: data.accidentCause || null,
        hospitalName: data.hospitalName,
        hospitalProvince: data.hospitalProvince,
        hospitalPhoneNumber: data.hospitalPhoneNumber,
        hospitalAmittedDate: data.hospitalAmittedDate,
        hospitalDischargedDate: data.hospitalDischargedDate,
        presentAddress: data.presentAddress,
        title: data.title,
      },
    });

    await prisma.student.update({
        where: {id: Number(data.id)},
        data: {
            tel_num: data.phone_num,
        }
    })
    return createPrakan
}