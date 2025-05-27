import { PrismaClient } from '@prisma/client';
import { vendorFormBuilder } from '../../document_build/vendorFormBuilder'

const prisma = new PrismaClient();

export async function getDataById(id) {
    const vendor = await prisma.vendor_info.findUnique({
        where: { id: id },
        include: {
            Student: true
        }
    })
    if (vendor) {
        return vendor
    }
    else {
        return "Not found"
    }
}

export async function createVendor(data) {
    // await vendor(data)
    const createRequest = await prisma.request.create({
        data: {
            type: "แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย",
            status: "รอจองคิว",
            stu_id: data.stu_id,
        }
    })

    console.log("dataCreate :", data);
    const createVendor = await prisma.vendor_info.create({
        data: {
            stu_id: Number(data.id),
            nameTH: data.nameTH,
            faculty: data.faculty,
            houseID: data.houseID,
            req_id: createRequest.id,
            moo: data.moo,
            citizenIssueDate: new Date(data.citizenIssueDate),
            citizenExpireDate: new Date(data.citizenExpireDate),
            buildingVillage: data.buildingVillage,
            soi: data.soi,
            road: data.road,
            subDistrict: data.subDistrict,
            district: data.district,
            province: data.province,
            postalCode: data.postalCode,
            tel: data.tel,
            citizenId: data.citizenId,
            claimType: data.claimType,
            amount: Number(data.amount),
            bankCompany: data.bankCompany,
            bankAccountType: data.bankAccountType,
            bankAccountName: data.bankAccountName,
            bankBranch: data.bankBranch,
            bankAccountNumber: data.bankAccountNumber,
            claimOtherReason: data.claimOtherReason

        }
    })

    // await prisma.student.update({
    //     where: {id: Number(data.id)},
    //     data: {
    //         phone_num: data.phone_num,
    //         tel_num: data.tel_num,
    //         personal_email: data.personal_email
    //     }
    // })
    return createVendor
}

export async function createPdfVendor(formId) {
    const response = await getDataById(formId)
    await vendorFormBuilder(response)
    return response
}

export async function updateVendorForm(data) {
    // if(data.StudentId !== "0"){
    //     await vendor(data)
    // }
    console.log("yayyay", data);

    const vendorUpdated = await prisma.vendor_info.update({
        where: { id: Number(data.id) },
        data: {
            houseID: data.houseID,
            nameTH: data.nameTH,
            faculty: data.faculty,
            moo: data.moo,
            citizenIssueDate: new Date(data.citizenIssueDate),
            citizenExpireDate: new Date(data.citizenExpireDate),
            buildingVillage: data.buildingVillage,
            soi: data.soi,
            road: data.road,
            subDistrict: data.subDistrict,
            district: data.district,
            province: data.province,
            postalCode: data.postalCode,
            tel: data.tel,
            citizenId: data.citizenId,
            claimType: data.claimType,
            amount: Number(data.amount),
            bankCompany: data.bankCompany,
            bankAccountType: data.bankAccountType,
            bankAccountName: data.bankAccountName,
            bankBranch: data.bankBranch,
            bankAccountNumber: data.bankAccountNumber,
            claimOtherReason: data.claimOtherReason
        }
    })

    if (vendorUpdated) {
        return vendorUpdated
    }
    else {
        return "Not found"
    }
}