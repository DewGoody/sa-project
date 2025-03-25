import { PrismaClient } from '@prisma/client';
import { prakanFormBuilder } from '../../document_build/prakanFormBuilder'

const prisma = new PrismaClient();

export async function createPrakanInter(data) {    
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
            phone_num: data.phone_num
        }
    })
    return createPrakan
}

export async function createPdfPrakan(formId) {
    console.log("formmmm", formId);
    
    const response = await getPrakanDataById(formId)
    console.log(response,"------------------------");
    
    await prakanFormBuilder(response);
    return response
}

export async function getPrakanDataById(id) {
  const prakan = await prisma.prakan_inter_info.findFirst({
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

export async function updatePrakanForm(data) {
  await prakanFormBuilder(data)
  const prakanUpdated = await prisma.prakan_inter_info.update({
      where: {id: data.formId},
      data:{
          phone_num: data.phone_num,
          claimType: data.claimType,
          accidentDate: data.accidentDate,
          accidentTime: data.accidentTime,
          accidentCause: data.accidentCause,
          hospitalName: data.hospitalName,
          hospitalProvince: data.hospitalProvince,
          hospitalPhoneNumber: data.hospitalPhoneNumber,
          hospitalAmittedDate: data.hospitalAmittedDate,
          hospitalDischargedDate: data.hospitalDischargedDate,
          presentAddress: data.presentAddress,
          title: data.title,
      }
  })
  await prisma.student.update({
      where: {id: data.stu_id},
      data: {
          tel_num: data.phone_num,
      }
  })
  if(prakanUpdated){           
      return prakanUpdated
  }
  else{
      return "Not found"
  }
}