import { PrismaClient } from "@prisma/client";
//TODO Edit this import to match the document_build function
import { prakanFormBuilder } from "../../../document_build/prakanFormBuilder.js";

const prisma = new PrismaClient();

export async function POST(req, res) {
  let data = await req.json();
  //TODO Edit this function
  await prakanFormBuilder(data);
  console.log("data", data);

  //TODO Edit this function
  /*const createPrakan = await prisma.accident_info.create({
    data: {
      stu_id: Number(data.id),
      acc_desc: data.acc_desc,
      acc_date: new Date(data.acc_date),
      accident_place: data.accident_place,
      treatment_place: data.treatment_place,
      hospital_type: data.hospital_type,
      medical_fee: Number(data.medical_fee),
    },
  });
  return createPrakan;*/
}
