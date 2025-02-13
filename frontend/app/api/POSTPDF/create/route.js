'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID, getIDbyToken } from "../../../../lib/session"
import { convertBigIntToString} from '../../../../utills/convertBigInt'



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
        const id = await getID(req) || getIDbyToken(cookie);
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }
        // ดึงข้อมูลจาก FormData
        // const formData = await req.formData();
        // const file = formData.get('file'); // ดึงไฟล์ที่อัปโหลด

        // if (!file) {
        //     return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        // }

        // const fileSize = file.size;
        // const fileBuffer = await file.arrayBuffer();

        // // ตรวจสอบขนาดไฟล์
        // if (fileSize > MAX_FILE_SIZE) {
        //     return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
        // }

        // บันทึกไฟล์ลงฐานข้อมูล
        const pdf = await prisma.uHC_request.create({
            data: {
                student_id: id,
                // binary_file_data: Buffer.from(fileBuffer), // แปลงไฟล์เป็น Buffer
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
            where: {id: pdf.id},
            data: {req_id: createRequest.id}
        })
        console.log("pdf.id",convertBigIntToString(pdf.id));
        
        return NextResponse.json({id:convertBigIntToString(pdf.id)}, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
