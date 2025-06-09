import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const data = await req.json();
        const year = data.year;
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);

        // หาเที่ยงคืนของวันนี้ (00:00:00)
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        let queue = null;
        // เงื่อนไขสำหรับการกรองข้อมูล
        const whereCondition = {
            type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร",
            OR: [
                // กรณีที่ไม่ใช่คำขอถูกยกเลิก
                { status: { not: "คำขอถูกยกเลิก" } },

                // กรณีที่เป็นคำขอถูกยกเลิก แต่ถูกสร้างหลังเที่ยงคืนของวันนี้
                {
                    AND: [
                        { status: "คำขอถูกยกเลิก" },
                        { created_at: { gte: startOfToday } }
                    ]
                }
            ]
        };

        if (year == 0) {
            queue = await prisma.request.findMany({
                where: whereCondition,
                include: {
                    RD_info: true,
                    Student: true
                },
            });
        } else {
            queue = await prisma.request.findMany({
                where: {
                    ...whereCondition,
                    created_at: {
                        gte: startOfYear,
                        lt: endOfYear
                    }
                },
                include: {
                    RD_info: true,
                    Student: true
                },
            });
        }

        // Convert BigInt values to strings
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