import { PrismaClient } from '@prisma/client';
import { changeStatusToAll } from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString } from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        // console.log("in api hospital",req);
        let { ids, status } = await req.json()
        console.log("in api hospital", ids);
        console.log("in api hospital", status);

        const showRequest = await changeStatusToAll(ids, status)
        return NextResponse.json({});
    }
    catch (error) {
        console.log(error);

        if (!error.code) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}