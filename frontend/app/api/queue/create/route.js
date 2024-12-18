import { PrismaClient } from '@prisma/client';
import {createQueue} from '../../../service/queueService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    console.log("data",data);
    const createdQueue = await createQueue(data.studentId, data.reqId, data.timeslotId, data.period)
    return NextResponse.json({ data: convertBigIntToString(createdQueue) });
}
    catch(error){
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}