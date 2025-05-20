import { PrismaClient } from '@prisma/client';
import {getAllQueueInAdmin} from '../../../service/queueService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    const year = await getAllQueueInAdmin(Number(data.year))
    return NextResponse.json({ data: convertBigIntToString(year) });
    }
    catch(error){
        console.log(error);
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}