'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID, getIDbyToken } from "../../../../lib/session"
import { convertBigIntToString } from '../../../../utills/convertBigInt'



const prisma = new PrismaClient()

export async function GET(req) {
    try {
        // Parse the query parameter 'id' from the URL
        const { searchParams } = new URL(req.url);
        const fileId = parseInt(searchParams.get('id')); // Parse 'id' as an integer

        if (isNaN(fileId)) {
            return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
        }

        // Fetch the file from the database
        const file = await prisma.uHC_request.findFirst({
            where: { student_id: fileId }
        });

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const fileContentBase64 = file.binary_file_data
            ? Buffer.from(file.binary_file_data).toString('base64')
            : null;

        return NextResponse.json({
            binary_file_data: fileContentBase64
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while fetching the file' }, { status: 500 });
    }
}


// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
    try {
        const cookie = req.headers.get('cookie') || '';
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

        const id = await getID(req) || getIDbyToken(cookie);
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }
        const pdf = await prisma.uHC_request.create({
            data: {
                student_id: id,

            },
        });
        const createRequest = await prisma.request.create({
            data: {
                type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
                status: "ยังไม่ได้ Upload เอกสาร",
                stu_id: id,
            }
        })
        await prisma.uHC_request.update({
            where: { id: pdf.id },
            data: { 
                req_id: createRequest.id ,
                province : data.province,
                district :data.district,
                hospital : data.hospital
            }
        })
        console.log("pdf.id", convertBigIntToString(pdf.id));

        return NextResponse.json({ id: convertBigIntToString(pdf.id) }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
