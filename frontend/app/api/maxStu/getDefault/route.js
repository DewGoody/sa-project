import { PrismaClient } from '@prisma/client';
import {getDefaultMaxStu} from '../../../service/maxStudentService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

export async function POST(req,res){
    try{    
    const maxStu = await getDefaultMaxStu()
    return NextResponse.json({ data: convertBigIntToString(maxStu) });
    }
    catch(error){      
        console.log(error);
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}