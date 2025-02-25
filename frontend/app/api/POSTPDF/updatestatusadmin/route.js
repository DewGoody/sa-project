'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID, getIDbyToken } from "../../../../lib/session"
import { convertBigIntToString} from '../../../../utills/convertBigInt'



const prisma = new PrismaClient()


export async function POST(req) {
    try {
        const formId = req.nextUrl.searchParams.get('id')
        const idbefore = await prisma.uHC_request.findFirst({
            where: { id: parseInt(formId) }
        })
        const id = idbefore.student_id
        // const cookie = req.headers.get('cookie') || '';
        // const id = await getID(req) || getIDbyToken(cookie);
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
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
        const createRequest = await prisma.request.update({
            where:{id:idbefore.req_id},
            data: {
                type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
                status: "ยังไม่ได้ Upload เอกสาร",
                stu_id: id,
            }
        }) 
        const pdf = await prisma.uHC_request.updateMany({
            where: { student_id: id },
            data: {
                province: data.province,
                district: data.district,
                hospital: data.hospital
            }
        });
        // await prisma.uHC_request.update({
        //     where: {id: pdf.id},
        //     data: {req_id: createRequest.id}
        // })
        // console.log("pdf.id",convertBigIntToString(pdf.id));
        
        return NextResponse.json( { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
