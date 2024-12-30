'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID, getIDbyToken } from "../../../lib/session"


const prisma = new PrismaClient()

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const fileId = parseInt(searchParams.get('id')); // รับค่า id จาก query string

        // ดึงไฟล์จากฐานข้อมูล
        const file = await prisma.pdfFile.findUnique({
            where: { id: fileId }
        });

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // แปลงไฟล์ไบนารีเป็น Base64
        const fileContentBase64 = Buffer.from(file.content).toString('base64');

        // ส่งข้อมูลกลับเป็น JSON
        return NextResponse.json({
            id: file.id,
            name: file.name,
            size: file.size,
            content: fileContentBase64 // base64 สำหรับดาวน์โหลดหรือแสดงผล
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
    try {
        // ดึงข้อมูลจาก FormData
        const formData = await req.formData();
        const file = formData.get('file'); // ดึงไฟล์ที่อัปโหลด

        if (!file) {
            return Response.json({ error: 'No file uploaded.' }, { status: 400 });
        }

        const fileSize = file.size;
        const fileBuffer = await file.arrayBuffer();

        // ตรวจสอบขนาดไฟล์
        if (fileSize > MAX_FILE_SIZE) {
            return Response.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
        }

        // บันทึกไฟล์ลงฐานข้อมูล
        const pdf = await prisma.pdffile.create({
            data: {
                name: file.name,
                content: Buffer.from(fileBuffer), // แปลงไฟล์เป็น Buffer
                size: fileSize,
            },
        });

        return Response.json(pdf, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}