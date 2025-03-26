import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { parseISO, isValid } from "date-fns";
import { vendorFormBuilder } from "../../../document_build/vendorFormBuilder";

const prisma = new PrismaClient();

export async function POST(req, res) {
  let data = await req.json();
  // generate PDF Document
  await vendorFormBuilder(data);
  console.log("-----------------");
  console.log("data", data);
  return NextResponse.json({ message: "success" }, { status: 200 });
  try {
    let data = await req.json();
    // generate PDF Document
    //await vendorFormBuilder(data);
    console.log("data", data);

    //Push data to database
    /*const createPrakan = await prisma.prakan_inter_info.create({
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
    //error handling
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Error submitting form" },
      { status: 500 }
    );
  }
    
}*/
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}