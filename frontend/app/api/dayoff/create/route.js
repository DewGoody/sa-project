import { PrismaClient } from '@prisma/client';
import {createDayoff} from '../../../service/dayoffService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

export async function POST(req,res){
    try{
    console.log("data",req);
    let data = await req.json()
    
    const dayoff = await createDayoff(data)
    return NextResponse.json({ data: convertBigIntToString(dayoff) });
    }
    catch(error){      
        console.log(error);
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}