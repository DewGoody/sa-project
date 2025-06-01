import { PrismaClient } from '@prisma/client';
import { changeStatusVendor } from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString } from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        let data = await req.json()
        console.log("Data received for changeStatusVendor:", data);
        const updatedRequest = await changeStatusVendor(data.id, data.newStatus)
        return NextResponse.json({ data: convertBigIntToString(updatedRequest) });
    }
    catch (error) {
        console.log(error);

        if (!error.code) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}