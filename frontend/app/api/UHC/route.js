'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID } from '../../../lib/session'

const prisma = new PrismaClient()

export async function GET(req) {
    const formId = req.nextUrl.searchParams.get('id');

    const idbefore = await prisma.uHC_request.findFirst({
        where:{id:parseInt(formId)}
    })

    const id = idbefore.student_id

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
        UHC_reg_info: UHC_reg_info ? UHC_reg_info : {
            id: id,
            last_update: null,
            smart_card_issured: null,
            smart_card_expired: null,
            status_before_reg: null,
            status_info: null,
            frequence_uses: null,
            is_been: null,
            is_congenital_disease: null,
        },
        DOPA_address: DOPA_address ? DOPA_address : {
            id: id,
            address_type: "DOPA_address",
            created_at: null,
            house_num: null,
            house_moo: null,
            soi: null,
            street: null,
            subdistrict: null,
            district: null,
            province: null,
            postal_code: null,
            address_id: null
        },
    }


    return NextResponse.json(data)

}

export async function POST(req) {
    const id = await getID(req)
    if (!id) {
        return NextResponse.json({ error: 'Session is expired' }, { status: 401 })
    }
    let data = req.body
    let student = data.Student
    let uhc = data.UHC_reg_info
    let address = data.DOPA_address
    const _newRecord = await prisma.UHC_reg_info.create({
        data: {
            id: id,
            last_update: new Date(),
            smart_card_issured: uhc.smart_card_issured,
            smart_card_expired: uhc.smart_card_expired,
            status_before_reg: uhc.status_before_reg,
            status_info: uhc.status_info,
            frequence_uses: uhc.frequence_uses,
            is_been: uhc.is_been,
            is_congenital_disease: uhc.is_congenital_disease
        }
    });
            
}

export async function PUT(req) {
    console.log("TESETTTT")
    const id = await getID(req); // Get student ID from the session or request context
    if (!id) {
        return NextResponse.json({ error: 'Session is expired' }, { status: 401 });
    }

    // Parse the request body
    let body;
    try {
        const text = await req.text();
        body = JSON.parse(text);
    } catch (err) {
        console.error('Failed to parse request body:', err);
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Extract data from the body
    const student = body?.Student;
    const uhc = body?.UHC_reg_info;
    const address = body?.DOPA_address;

    if (!student || !uhc || !address) {
        return NextResponse.json(
            { error: 'Missing required data (Student, UHC_reg_info, or DOPA_address)' },
            { status: 400 }
        );
    }

    try {
        const studentRecord = await prisma.Student.update({
            where: { id },
            data: { ...student },
        });

        // Upsert UHC_reg_info record

        const uhcRecord = await prisma.UHC_reg_info.upsert({
            where: { id },
            update: {
                last_update: uhc.last_update ? new Date(uhc.last_update) : new Date(),
                smart_card_issured: uhc.smart_card_issured
                    ? new Date(uhc.smart_card_issured)
                    : null,
                smart_card_expired: uhc.smart_card_expired
                    ? new Date(uhc.smart_card_expired)
                    : null,
                status_before_reg: uhc.status_before_reg,
                status_info: uhc.status_info,
                frequence_uses: uhc.frequence_uses,
                is_been: uhc.is_been,
                is_congenital_disease: uhc.is_congenital_disease,
            },
            create: {
                id,
                last_update: new Date(),
                smart_card_issured: uhc.smart_card_issured
                    ? new Date(uhc.smart_card_issured)
                    : null,
                smart_card_expired: uhc.smart_card_expired
                    ? new Date(uhc.smart_card_expired)
                    : null,
                status_before_reg: uhc.status_before_reg,
                status_info: uhc.status_info,
                frequence_uses: uhc.frequence_uses,
                is_been: uhc.is_been,
                is_congenital_disease: uhc.is_congenital_disease,
            },
        });

        if (address) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "DOPA_address" } },
                update: { ...address },
                create: { id: id, address_type: "DOPA_address", ...address }
            });
        }

        return NextResponse.json(
            {
                studentRecord,
                uhcRecord,
                address,
            },
            { status: 200 }
        );
    } catch (err) {
        console.log("test")
        console.error('Error handling PUT request:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
