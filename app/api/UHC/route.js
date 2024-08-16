'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req) {
    // Get token from request headers

    // Assume token is valid and get user ID from token

    // Assume user ID is 6512345678
    const id = 6512345678

    const UHC_reg_info = await prisma.UHC_reg_info.findFirst({
        where: {
            id: id
        }
    })
    const DOPA_address = await prisma.address.findFirst({
        where: {
            id: id,
            address_type: "DOPA_address"
        }
    })
    const Student = await prisma.student.findFirst({
        where: {
            id: id
        }
    })
    const data = {
        Student: Student,
        UHC_reg_info: UHC_reg_info,
        DOPA_address: DOPA_address,
    }


    return NextResponse.json(data)


}