'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID, getIDbyToken } from "../../../../lib/session"
import { convertBigIntToString } from '../../../../utills/convertBigInt'



const prisma = new PrismaClient()


export async function POST(req) {
    try {
        const formId = req.nextUrl.searchParams.get('id');

        if (!formId) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        }

        let data;
        try {
            data = await req.json(); // ✅ ดักจับ JSON.parse() error
            console.log("✅ Received Data:", data);
        } catch (jsonError) {
            console.error("❌ Error parsing JSON:", jsonError);
            return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
        }

        if (!data?.province || !data?.district || !data?.hospital) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const idbefore = await prisma.uHC_request.findFirst({
            where: { id: parseInt(formId) }
        });

        if (!idbefore) {
            return NextResponse.json({ error: "ID not found" }, { status: 404 });
        }

        const id = idbefore.student_id;
        const id_2 = await prisma.uHC_request.findFirst({
            where:{student_id : id},
        });
        const pdf = await prisma.uHC_request.updateMany({
            where: { student_id: id },
            data: {
                province: data.province,
                district: data.district,
                hospital: data.hospital
            }
        });

        console.log("🔹 Updated PDF Data:", pdf);

        if (!id_2?.id) {
            return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }

        return NextResponse.json({ id: convertBigIntToString(id_2.id) }, { status: 201 });

    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
