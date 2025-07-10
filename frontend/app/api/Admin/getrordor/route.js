import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const data = await req.json();
        const year = Number(data.year); // รับเป็นปีการศึกษา (พ.ศ.)

        // หาเที่ยงคืนของวันนี้ (00:00:00)
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        let queue = null;

        // เงื่อนไขสำหรับการกรองข้อมูลหลัก
        const whereCondition = {
            type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร",
            OR: [
                // คำขอปกติ
                { status: { notIn: ["คำขอถูกยกเลิก", "กำลังดำเนินการจองคิว"] } },

                // คำขอถูกยกเลิกแต่ถูกสร้างวันนี้
                {
                    AND: [
                        { status: "คำขอถูกยกเลิก" },
                        { created_at: { gte: startOfToday } }
                    ]
                }
            ]
        };

        if (year === 0) {
            // ถ้าไม่ได้เลือกปีการศึกษา (เอาทั้งหมด)
            queue = await prisma.request.findMany({
                where: whereCondition,
                include: {
                    RD_info: true,
                    Student: true
                },
            });
        } else {
            // คำนวณช่วงวันที่ของปีการศึกษา
            const academicYearAD = year - 543; // แปลงเป็น ค.ศ.
            const startOfAcademicYear = new Date(academicYearAD, 7, 1); // 1 ส.ค.
            const endOfAcademicYear = new Date(academicYearAD + 1, 7, 1); // 1 ส.ค. ปีถัดไป

            queue = await prisma.request.findMany({
                where: {
                    ...whereCondition,
                    created_at: {
                        gte: startOfAcademicYear,
                        lt: endOfAcademicYear
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
