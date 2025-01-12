import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { convertBigIntToString } from '../../../../utills/convertBigInt';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Fetch rows including related data
        const queue = await prisma.request.findMany({
            where: {
                type: "โครงการหลักประกันสุขภาพถ้วนหน้า"
            },
            include: {
                UHC_request: true, // Fixed case sensitivity
                Student: true,
            },
        });

        // console.log("Fetched data:", queue); // Debug log for inspection

        // Handle BigInt serialization safely
        const serializedQueue = queue.map((row) => ({
            ...row,
            id: row.id ? row.id.toString() : null, // Convert BigInt to string
            req_id: row.req_id ? row.req_id.toString() : null, // Convert BigInt to string
            student_id: row.student_id ? row.student_id.toString() : null, // Convert Decimal to string
            Student: row.Student ? {
                ...row.Student,
                id: row.Student.id ? row.Student.id.toString() : null, // Convert Decimal to string
            } : null,
            UHC_request: row.UHC_request.map((request) => ({
                ...request,
                id: request.id.toString(), // Convert BigInt to string
                req_id: convertBigIntToString(request.req_id) , // Handle nullable BigInt
                student_id: convertBigIntToString(request.student_id.toString()), // Convert Decimal to string
            })),
        }));

        // Return the serialized data
        return NextResponse.json(serializedQueue, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error); // Error log for debugging
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}

