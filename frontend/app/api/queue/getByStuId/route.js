import { PrismaClient } from '@prisma/client';
import {getShowQueueByStuId} from '../../../service/queueService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    console.log("data",data);
    const showQueue = await getShowQueueByStuId(data.studentId)
    return NextResponse.json({ data: convertBigIntToString(showQueue) });
    }
    catch(error){
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}