import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import { convertBigIntToString } from '../../../../utills/convertBigInt';

const prisma = new PrismaClient();

export async function POST(req,res) {
    try {
        const data = await req.json()
        console.log(data);
        
        const year = data.year
        
        const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
        const endOfYear = new Date(year + 1, 0, 1);
        let queue = null
        console.log("YEARRRRRRRRR",year);
        
        if (year == 0) {
            queue = await prisma.request.findMany({
                
                where: {
                    type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
                    status :{
                        notIn:["ประวัติการแก้ไข"]
                    }
                },

                include: {
                    UHC_request: true, // Fixed case sensitivity
                    Student: true,
                },
            });
        } else {
            queue = await prisma.request.findMany({
                where: {
                    type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
                    created_at: {
                        gte: startOfYear, // Greater than or equal to start of year
                        lt: endOfYear, // Less than start of the next year
                    },
                    status :{
                        notIn:["ประวัติการแก้ไข"]
                    }
                },
                include: {
                    UHC_request: true, // Fixed case sensitivity
                    Student: true,
                },
            });

        }

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
                province:request.province.toString(),
                district:request.district.toString(),
                hospital: request.hospital.toString(),
                id: request.id.toString(), // Convert BigInt to string
                req_id: convertBigIntToString(request.req_id), // Handle nullable BigInt
                student_id: convertBigIntToString(request.student_id.toString()), // Convert Decimal to string

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

