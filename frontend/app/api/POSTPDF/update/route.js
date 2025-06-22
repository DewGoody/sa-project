'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'


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


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
        // ดึงข้อมูลจาก FormData
        const formData = await req.formData();
        const file = formData.get('file'); // ดึงไฟล์ที่อัปโหลด
        const file_citizen = formData.get('file_citizen'); // ดึงไฟล์ที่อัปโหลด
        const file_house = formData.get('file_house'); // ดึงไฟล์ที่อัปโหลด
        const file_student = formData.get('file_student'); // ดึงไฟล์ที่อัปโหลด
        const file_fast = formData.get('file_fast'); // ดึงไฟล์ที่อัปโหลด

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }
        if (!file_citizen) {
            return NextResponse.json({ error: 'No file citizen uploaded.' }, { status: 400 });
        } if (!file_house) {
            return NextResponse.json({ error: 'No file house uploaded.' }, { status: 400 });
        } if (!file_student) {
            return NextResponse.json({ error: 'No file student uploaded.' }, { status: 400 });
        }

        const fileSize = file.size;
        const fileBuffer = await file.arrayBuffer();
        const fileBuffercitizen = await file_citizen.arrayBuffer();
        const fileBufferhouse = await file_house.arrayBuffer();
        const fileBufferstudent = await file_student.arrayBuffer();

        // ตรวจสอบขนาดไฟล์
        if (fileSize > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
        }
        let pdf = ""
        if (file_fast) {
            console.log("มีไฟล์เร่งด่วน");
            const fileBufferfast = await file_fast.arrayBuffer();
            pdf = await prisma.uHC_request.update({
                where: { id: parseInt(formId) },
                
                data: {
                    created_at: new Date(),
                    student_id: id,
                    binary_file_data: Buffer.from(fileBuffer), // แปลงไฟล์เป็น Buffer
                    file_citizen: Buffer.from(fileBuffercitizen),
                    file_house: Buffer.from(fileBufferhouse),
                    file_student: Buffer.from(fileBufferstudent),
                    file_fast: Buffer.from(fileBufferfast)
                },
            });
        } else {
            console.log("ไม่มีไฟล์เร่งด่วน");
            
            pdf = await prisma.uHC_request.update({
                where: { id: parseInt(formId) },
                data: {
                    created_at: new Date(),
                    student_id: id,
                    binary_file_data: Buffer.from(fileBuffer), // แปลงไฟล์เป็น Buffer
                    file_citizen: Buffer.from(fileBuffercitizen),
                    file_house: Buffer.from(fileBufferhouse),
                    file_student: Buffer.from(fileBufferstudent),
                    file_fast: null

                },
            });
        }

        // บันทึกไฟล์ลงฐานข้อมูล


        await prisma.request.updateMany({
            where: {
                stu_id: pdf.student_id,
                type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
            },
            data: {
                type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
                status: "ประวัติการแก้ไข",
                stu_id: id,
            }
        });
        const createRequest = await prisma.request.update({
            where: { id: parseInt(idbefore.req_id) },
            data: {
                type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
                status: "รอเจ้าหน้าที่ดำเนินการ",
                stu_id: id,
            }
        })
        await prisma.uHC_request.update({
            where: { id: pdf.id },
            data: { req_id: createRequest.id }
        })


        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
