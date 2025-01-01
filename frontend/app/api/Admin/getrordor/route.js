import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Fetch rows where type matches the specified condition, and include related data
        const queue = await prisma.request.findMany({
            where: {
                type: "การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร" // Filter by type
            },
            include: {
                Student: true,       // Include related Student data
                Military_info: true, // Include related Military_info data
            },
        });

        // Handle serialization for BigInt and Decimal fields
        const serializedQueue = queue.map((row) => ({
            ...row,
            id: row.id.toString(), // Convert BigInt to string
            req_id: row.req_id ? row.req_id.toString() : null, // Handle nullable BigInt
            student_id: row.student_id ? row.student_id.toString() : null, // Handle nullable Decimal
            Student: row.Student ? {
                ...row.Student,
                id: row.Student.id.toString(), // Convert Decimal to string
            } : null,
            Military_info: row.Military_info ? {
                ...row.Military_info,
                id: row.Military_info.id.toString() // Handle Military_info BigInt serialization
            } : null,
        }));

        // Return serialized data as a JSON response
        return NextResponse.json(serializedQueue, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);

        // Return error response
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}
