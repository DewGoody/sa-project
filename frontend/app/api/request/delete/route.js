import { PrismaClient } from '@prisma/client';
import {cancleRequest} from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import { cancleQueue } from '../../../service/queueService';

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    // if(data.queueId != 0){
    //     await cancleQueue(data.queueId)
    // }
    const cancledRequest = await cancleRequest(data.id)
    return NextResponse.json({ data: convertBigIntToString(cancledRequest) });
    }
    catch(error){        
        if(!error.code){
            
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}