import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { convertBigIntToString } from '../../../../utills/convertBigInt';

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const data = await req.json();
        const year = Number(data.year); // เช่น 2567
        let queue = null;
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // เงื่อนไขสำหรับการกรองข้อมูลหลัก
        const baseCondition = {
            type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
            AND: [
                {
                    OR: [
                        { status: { notIn: ["คำขอถูกยกเลิก"] } },
                        {
                            AND: [
                                { status: "คำขอถูกยกเลิก" },
                                { created_at: { gte: startOfToday } }
                            ]
                        }
                    ]
                },
                {
                    status: {
                        notIn: ["ประวัติการแก้ไข", "ยกเลิก"]
                    }
                }
            ]
        };

        console.log("ปีการศึกษา:", year);

        let dateRangeCondition = {};

        if (year !== 0) {
            const academicYearAD = year - 543;
            const startOfAcademicYear = new Date(academicYearAD, 7, 1); // 1 สิงหาคม
            const endOfAcademicYear = new Date(academicYearAD + 1, 7, 1); // 1 สิงหาคมถัดไป

            dateRangeCondition = {
                created_at: {
                    gte: startOfAcademicYear,
                    lt: endOfAcademicYear,
                }
            };
        }

        queue = await prisma.request.findMany({
            where: {
                ...baseCondition,
                ...dateRangeCondition
            },
            include: {
                UHC_request: true,
                Student: true,
            },
        });


        // console.log("Fetched data:", queue); // Debug log for inspection

        // Handle BigInt serialization safely
        const serializedQueue = queue.map((row) => ({
            ...row,
            id: row.id ? row.id.toString() : null, // Convert BigInt to string
            req_id: row.req_id ? row.req_id.toString() : null, // Convert BigInt to string
            more_info: row.more_info ? row.more_info.toString() : null, // Convert BigInt to string
            student_id: row.student_id ? row.student_id.toString() : null, // Convert Decimal to string
            Student: row.Student ? {
                ...row.Student,
                id: row.Student.id ? row.Student.id.toString() : null, // Convert Decimal to string
            } : null,
            UHC_request: row.UHC_request.map((request) => ({
                ...request,
                province: request.province ? request.province.toString() : null,
                district: request.district ? request.district.toString() : null,
                hospital: request.hospital ? request.hospital.toString() : null,
                id: request.id.toString(), // Convert BigInt to string
                req_id: convertBigIntToString(request.req_id), // Handle nullable BigInt
                student_id: convertBigIntToString(request.student_id.toString()), // Convert Decimal to string
                created_at: request.created_at ? request.created_at.toISOString() : null, // Convert Date to ISO string
            })),

        }));

        // Return the serialized data
        // console.log(serializedQueue);

        return NextResponse.json(serializedQueue, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error); // Error log for debugging
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}

