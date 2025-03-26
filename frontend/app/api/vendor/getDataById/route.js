import { PrismaClient } from '@prisma/client';
import {getDataById} from '../../../service/vendorService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    const vendorData = await getDataById(data.id)
    if(vendorData === "Not found"){
        return NextResponse.json({ data: vendorData });
    }
    return NextResponse.json({ data: convertBigIntToString(vendorData) });
    }
    catch(error){      
        console.log(error);
          
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}