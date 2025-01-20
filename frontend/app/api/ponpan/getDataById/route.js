import { PrismaClient } from '@prisma/client';
import {getPonpanDataById} from '../../../service/ponpanService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    const prakanData = await getPonpanDataById(data.id)
    if(prakanData === "Not found"){
        return NextResponse.json({ data: prakanData });
    }
    return NextResponse.json({ data: convertBigIntToString(prakanData) });
    }
    catch(error){      
        console.log(error);
          
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}