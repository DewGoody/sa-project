'use server'

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // ดึงค่า `id` จาก query parameters
        const { searchParams } = new URL(req.url);
        const fileId = parseInt(searchParams.get('id'));

        if (isNaN(fileId)) {
            return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
        }

        // ค้นหาไฟล์จากฐานข้อมูล
        const file = await prisma.uHC_request.findFirst({
            where: { req_id: fileId }
        });

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // **สร้างเอกสาร PDF ใหม่** team
        const mergedPdf = await PDFDocument.create();

        // **ฟังก์ชันเพิ่มไฟล์ PDF ลงใน merged PDF**
        async function addPdfToMerged(pdfBuffer) {
            if (!pdfBuffer) return;
            const pdfToMerge = await PDFDocument.load(pdfBuffer);
            const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        // **เพิ่มเอกสารแต่ละไฟล์ตามลำดับ**
        await addPdfToMerged(file.binary_file_data); // บัตรทอง
        await addPdfToMerged(file.file_citizen); // สำเนาบัตรประชาชน
        await addPdfToMerged(file.file_house); // สำเนาทะเบียนบ้าน
        await addPdfToMerged(file.file_student); // สำเนาบัตรนิสิต
        await addPdfToMerged(file.file_fast); // สำเนาย้ายด่วน

        // **บันทึกเป็น Buffer**
        const mergedPdfBytes = await mergedPdf.save();

        // **ส่งไฟล์ PDF กลับไปให้ดาวน์โหลด**
        return new Response(mergedPdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="merged_files.pdf"',
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while merging PDF files' }, { status: 500 });
    }
}


// 'use server'

// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';
// import JSZip from 'jszip';

// const prisma = new PrismaClient();

// export async function GET(req) {
//     try {
//         // Parse the query parameter 'id' from the URL
//         const { searchParams } = new URL(req.url);
//         const fileId = parseInt(searchParams.get('id')); // Parse 'id' as an integer

//         if (isNaN(fileId)) {
//             return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
//         }

//         // Fetch the file from the database
//         const file = await prisma.uHC_request.findFirst({
//             where: { req_id: fileId }
//         });

//         if (!file) {
//             return NextResponse.json({ error: 'File not found' }, { status: 404 });
//         }

//         // Initialize JSZip
//         const zip = new JSZip();

//         // Add files to the zip if they exist
//         if (file.binary_file_data) {
//             zip.file('บัตรทอง.pdf', file.binary_file_data);
//         }
//         if (file.file_citizen) {
//             zip.file('สำเนาบัตรปะรชาชน.pdf', file.file_citizen);
//         }
//         if (file.file_house) {
//             zip.file('สำเนาทะเบียนบ้าน.pdf', file.file_house);
//         }
//         if (file.file_student) {
//             zip.file('สำเนาบัตรนิสิต.pdf', file.file_student);
//         }
//         if (file.file_fast) {
//             zip.file('สำเนาย้ายด่วน.pdf', file.file_fast);
//         }

//         // Generate the zip file
//         const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

//         // Return the zip file as a response
//         return new Response(zipContent, {
//             headers: {
//                 'Content-Type': 'application/zip',
//                 'Content-Disposition': 'attachment; filename="files.zip"',
//             },
//         });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: 'An error occurred while fetching the file' }, { status: 500 });
//     }
// }
