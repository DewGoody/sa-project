'use server';

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getID, getIDbyToken } from "../../../../lib/session";

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
        // const cookie = req.headers.get('cookie') || ''
        const { searchParams } = new URL(req.url);
        const Id = parseInt(searchParams.get('id'));
        // const id = (await getID(req)) || (await getIDbyToken(cookie));

        if (!Id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        const body = await req.json();
        console.log(body);
        await prisma.rD_info.update({
            where:{id:Id},
            data: {
                json_history: body,
            },
        });


        return NextResponse.json( { status: 200 });
    } catch (error) {
        console.error("Error in POST /api/logRd/create:", error);
        return NextResponse.json({ error: "An error occurred while processing the request" }, { status: 500 });
    }
}
