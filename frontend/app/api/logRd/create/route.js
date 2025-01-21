'use server';

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getID, getIDbyToken } from "../../../../lib/session";
import { convertBigIntToString} from '../../../../utills/convertBigInt'


const prisma = new PrismaClient();

// Utility function to handle BigInt serialization
function handleBigInt(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(handleBigInt);

    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'bigint' ? value.toString() : handleBigInt(value);
        return acc;
    }, {});
}

export async function POST(req) {
    // console.log("dfsdsfsfdjngfjksdfgn");

    try {
        const cookie = req.headers.get('cookie') || '';
        const id = (await getID(req)) || (await getIDbyToken(cookie));

        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        const body = await req.json();
        // console.log(body);
        

        
        // Create RD info entry
        const pdf = await prisma.rD_info.create({
            data: {
                student_id: id,
                RD_type:1,
                json_history: body,
            },
        });

        // Create a new request
        // const createRequest = await prisma.request.create({
        //     data: {
        //         type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร",
        //         status: "รอจองคิว",
        //         stu_id: id,
        //     },
        // });

        // // Update RD info with request ID
        // await prisma.rD_info.update({
        //     where: { id: pdf.id },
        //     data: { req_id: createRequest.id },
        // });

        // Prepare the response, ensuring no BigInt values
        // const response = handleBigInt({
        //     message: "Request created successfully",
        //     requestId: createRequest.id,
        // });

        // return NextResponse.json(response, { status: 200 });
        return NextResponse.json( {data:convertBigIntToString(pdf) });

    } catch (error) {
        console.error("Error in POST /api/logRd/create:", error);
        return NextResponse.json({ error: "An error occurred while processing the request" }, { status: 500 });
    }
}
