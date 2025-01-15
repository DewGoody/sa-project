import { PrismaClient } from '@prisma/client';
import {changeStatusToLate} from '../../../service/queueService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    const queue = await changeStatusToLate(data.id)
    return NextResponse.json({ data: convertBigIntToString(queue) });
    }
    catch(error){
        console.log(error);
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}