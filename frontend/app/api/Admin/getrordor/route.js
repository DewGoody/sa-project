import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

function serializeBigInt(obj) {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'bigint') {
        return obj.toString(); // แปลง BigInt เป็น string
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => serializeBigInt(item));
    }

    if (typeof obj === 'object') {
        // Handle special cases for Prisma nested fields
        if (obj.hasOwnProperty('s') && obj.hasOwnProperty('e') && obj.hasOwnProperty('d')) {
            // กรณีโครงสร้าง Prisma ID ที่เป็น object แบบ nested
            return obj.d.join(""); // นำเลขที่อยู่ใน d มาต่อกัน
        }

        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        );
    }

    return obj;
}


export async function GET(req) {
    try {
        // Fetch data with related RD_info
        const queue = await prisma.request.findMany({
            where: {
                type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร"
            },
            include: {
                RD_info: true, // Include related RD_info
            },
        });

        // Flatten RD_info into the parent object
        const flattenedQueue = queue.map((entry) => {
            // Merge RD_info properties with the main entry
            if (entry.RD_info) {
                entry.yearRD = entry.RD_info[0].RD_type              
                entry.json = entry.RD_info[0].json_history
                return {
                    entry,
                    // ...entry.RD_info, // Flatten RD_info into the parent
                    // ...entry.json = entry.RD_info.json_history,
                };
            }
            return entry; // In case RD_info is null or missing
        });

        // Serialize BigInt values
        const serializedQueue = serializeBigInt(flattenedQueue);

        // Return the flattened and serialized data
        return NextResponse.json(serializedQueue, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}
