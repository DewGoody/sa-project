import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { parseISO, isValid } from "date-fns";
import { vendorFormBuilder } from "../../../document_build/vendorFormBuilder";

const prisma = new PrismaClient();

export async function POST(req, res) {
  try {
    let data = await req.json();
    // generate PDF Document
    await vendorFormBuilder(data);
    console.log("data", data);

    //Push data to database
    const createVendor = await prisma.vendor_info.create({
      data: {
        stu_id: data.id,
        nameTH: data.nameTH,
        faculty: data.faculty,
        houseID: data.houseID,
        moo: data.moo,
        buildingVillage: data.buildingVillage,
        soi: data.soi,
        road: data.road,
        subDistrict: data.subDistrict,
        district: data.district,
        province: data.province,
        postalCode: data.postalCode,
        tel: data.tel,
        citizenId: data.citizenId,
        citizenIssueDate: data.citizenIssueDate,
        citizenExpireDate: data.citizenExpireDate,
        claimType: data.claimType,
        amount: data.amount,
        bankCompany: data.bankCompany,
        bankBranch: data.bankBranch,
        bankAccountType: data.bankAccountType,
        bankAccountName: data.bankAccountName,
        bankAccountNumber: data.bankAccountNumber,
        claimOtherReason: data.claimOtherReason,
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
}
