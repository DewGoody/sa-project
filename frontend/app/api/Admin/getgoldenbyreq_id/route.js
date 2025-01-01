import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Fetch rows where req_id is NOT NULL, and include related Student data
        const queue = await prisma.uHC_request.findMany({
            where: {
                req_id: {
                    not: null, // req_id is not null
                },
            },
            include: {
                Student: true, // Include related Student data (case-sensitive)
            },
        });

        // Handle BigInt serialization by converting BigInt to string
        const serializedQueue = queue.map((row) => ({
            ...row,
            id: row.id.toString(), // Convert BigInt to string
            req_id: row.req_id ? row.req_id.toString() : null, // Handle nullable BigInt
            student_id: row.student_id.toString(), // Convert Decimal to string
            Student: row.Student ? {
                ...row.Student,
                id: row.Student.id.toString(), // Convert Decimal to string
            } : null,
        }));

        // Return the filtered rows
        return NextResponse.json(serializedQueue, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);

        // Handle errors
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}
