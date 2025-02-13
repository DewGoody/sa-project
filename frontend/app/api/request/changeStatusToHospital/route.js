import { PrismaClient } from '@prisma/client';
import { changeStatusToHospital } from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString } from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        // console.log("in api hospital",req);
        let data = await req.json()
        console.log("in api hospital", data.id);

        const showRequest = await changeStatusToHospital(data.id)
        return NextResponse.json({ data: convertBigIntToString(showRequest) });
    }
    catch (error) {
        console.log(error);

        if (!error.code) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}