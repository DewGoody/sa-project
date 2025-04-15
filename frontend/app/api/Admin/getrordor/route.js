import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// function serializeBigInt(obj) {
//     if (obj === null || obj === undefined) return obj;

//     if (typeof obj === 'bigint') {
//         return obj.toString(); // แปลง BigInt เป็น string
//     }

//     if (Array.isArray(obj)) {
//         return obj.map((item) => serializeBigInt(item));
//     }

//     if (typeof obj === 'object') {
//         return Object.fromEntries(
//             Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
//         );
//     }

//     return obj;
// }

export async function POST(req, res) {
    try {
        // Fetch data with related RD_info
        const data = await req.json();
        const year = data.year;
        const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
        const endOfYear = new Date(year + 1, 0, 1);
        let queue = null;

        if (year == 0) {
            queue = await prisma.request.findMany({
                where: {
                    type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร"
                },
                include: {
                    RD_info: true, // Include related RD_info
                    Student: true
                },
            });
        } else {
            queue = await prisma.request.findMany({
                where: {
                    type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร",
                    created_at: {
                        gte: startOfYear, // Greater than or equal to start of year
                        lt: endOfYear, // Less than start of the next year
                    },
                },
                include: {
                    RD_info: true, // Include related RD_info
                    Student: true
                },
            });
        }

        // Convert BigInt values to strings before JSON serialization
        const serializedQueue = JSON.parse(JSON.stringify(queue, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json(serializedQueue, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}