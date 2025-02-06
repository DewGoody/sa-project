'use server'

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import JSZip from 'jszip';

const prisma = new PrismaClient();

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
            where: { req_id: fileId }
        });

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Initialize JSZip
        const zip = new JSZip();

        // Add files to the zip if they exist
        if (file.binary_file_data) {
            zip.file('บัตรทอง.pdf', file.binary_file_data);
        }
        if (file.file_citizen) {
            zip.file('สำเนาบัตรปะรชาชน.pdf', file.file_citizen);
        }
        if (file.file_house) {
            zip.file('สำเนาทะเบียนบ้าน.pdf', file.file_house);
        }
        if (file.file_student) {
            zip.file('สำเนาบัตรนิสิต.pdf', file.file_student);
        }

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

        // Return the zip file as a response
        return new Response(zipContent, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="files.zip"',
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while fetching the file' }, { status: 500 });
    }
}
