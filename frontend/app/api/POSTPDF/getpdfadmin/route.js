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
            where: { req_id: fileId }
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
