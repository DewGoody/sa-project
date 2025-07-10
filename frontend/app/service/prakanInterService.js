import { PrismaClient } from "@prisma/client";
import { prakanFormBuilder } from "../../document_build/prakanFormBuilder";

const prisma = new PrismaClient();

export async function createPrakanInter(data) {
  console.log("data", data);


  const createRequest = await prisma.request.create({
    data: {
      type: "Health insurance",
      status: "รอจองคิว",
      stu_id: data.id,
    }
  })
  const createPrakan = await prisma.prakan_inter_info.create({
    data: {
      stu_id: data.id,
      req_id: createRequest.id,
      phone_num: data.phone_num,
      treatmentType: data.treatmentType,
      hospitalName: data.hospitalName,
      hospitalName2: data.hospitalName2 || null,
      title: data.title,
      email: data.email,
      totalMedicalFees: data.totalMedicalFees,
      illnessDescription: data.illnessDescription,
      IPDAmittedDate: data.IPDAmittedDate
        ? new Date(`${data.IPDAmittedDate}T00:00:00.000Z`)
        : null, // Convert to ISO datetime or set to null
      IPDDischargedDate: data.IPDDischargedDate
        ? new Date(`${data.IPDDischargedDate}T00:00:00.000Z`)
        : null, // Convert to ISO datetime or set to null
      OPDTreatmentDateCount: data.OPDTreatmentDateCount || 0,
      OPDTreatmentDate1: data.OPDTreatmentDate1
        ? new Date(`${data.OPDTreatmentDate1}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate2: data.OPDTreatmentDate2
        ? new Date(`${data.OPDTreatmentDate2}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate3: data.OPDTreatmentDate3
        ? new Date(`${data.OPDTreatmentDate3}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate4: data.OPDTreatmentDate4
        ? new Date(`${data.OPDTreatmentDate4}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate5: data.OPDTreatmentDate5
        ? new Date(`${data.OPDTreatmentDate5}T00:00:00.000Z`)
        : null,
    },
  });

  await prisma.student.update({
    where: { id: Number(data.id) },
    data: {
      phone_num: data.phone_num,
    },
  });
  return createPrakan;
}

export async function createPdfPrakan(formId) {
  const response = await getPrakanDataById(formId);  // Fetch data
  const pdfBuffer = await prakanFormBuilder(response);  // Generate PDF and get the buffer
  return pdfBuffer;  // Return the actual PDF buffer
}

export async function getPrakanDataById(id) {
  const prakan = await prisma.prakan_inter_info.findFirst({
    where: { id: id },
    include: {
      Student: true,
    },
  });
  if (prakan) {
    return prakan;
  } else {
    return "Not found";
  }
}

export async function updatePrakanForm(data) {
  await prakanFormBuilder(data);
  const prakanUpdated = await prisma.prakan_inter_info.update({
    where: { id: data.formId },
    data: {
      phone_num: data.phone_num,
      treatmentType: data.treatmentType,
      hospitalName: data.hospitalName,
      hospitalName2: data.hospitalName2 || null,
      title: data.title,
      email: data.email,
      totalMedicalFees: data.totalMedicalFees,
      illnessDescription: data.illnessDescription,
      IPDAmittedDate: data.IPDAmittedDate
        ? new Date(`${data.IPDAmittedDate}T00:00:00.000Z`)
        : null, // Convert to ISO datetime or set to null
      IPDDischargedDate: data.IPDDischargedDate
        ? new Date(`${data.IPDDischargedDate}T00:00:00.000Z`)
        : null, // Convert to ISO datetime or set to null
      OPDTreatmentDateCount: data.OPDTreatmentDateCount || 0,
      OPDTreatmentDate1: data.OPDTreatmentDate1
        ? new Date(`${data.OPDTreatmentDate1}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate2: data.OPDTreatmentDate2
        ? new Date(`${data.OPDTreatmentDate2}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate3: data.OPDTreatmentDate3
        ? new Date(`${data.OPDTreatmentDate3}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate4: data.OPDTreatmentDate4
        ? new Date(`${data.OPDTreatmentDate4}T00:00:00.000Z`)
        : null,
      OPDTreatmentDate5: data.OPDTreatmentDate5
        ? new Date(`${data.OPDTreatmentDate5}T00:00:00.000Z`)
        : null,
    },
  });
  await prisma.student.update({
    where: { id: data.stu_id },
    data: {
      tel_num: data.phone_num,
    },
  });
  if (prakanUpdated) {
    return prakanUpdated;
  } else {
    return "Not found";
  }
}