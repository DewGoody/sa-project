import { PrismaClient } from '@prisma/client';
import {getRequestByIdFast} from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    console.log("data",data);
    const showRequest = await getRequestByIdFast(data)    
    return NextResponse.json({ data: convertBigIntToString(showRequest) });
    }
    catch(error){   
        console.log("error",error);
             
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}