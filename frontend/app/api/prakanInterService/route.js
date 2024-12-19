import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { parseISO, isValid } from "date-fns";
import { prakanFormBuilder } from "../../../document_build/prakanFormBuilder.js";

const prisma = new PrismaClient();

export async function POST(req, res) {
  try {
    let data = await req.json();
    // Validate and format accidentDate
    let accidentDate = data.accidentDate ? parseISO(data.accidentDate) : null;
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
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Error submitting form" },
      { status: 500 }
    );
  }
}
