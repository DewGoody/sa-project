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
        const createRequest = await prisma.request.update({
            where:{id:idbefore.req_id},
            data: {
                type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
                status: "รออัปโหลดเอกสาร",
                stu_id: id,
            }
        }) 
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
