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
        // ดึงข้อมูลพร้อม Include relations

        const queue = await prisma.request.findMany({
            where: {
                type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร"
            },
            include: {
                Student: true,
                Military_info: true,
            },
        });

        // แปลง BigInt ในข้อมูลทั้งหมด
        const serializedQueue = serializeBigInt(queue);

        // ส่งข้อมูล JSON กลับ
        // console.log(serializedQueue[0]?.Military_info);

        return NextResponse.json(serializedQueue, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}