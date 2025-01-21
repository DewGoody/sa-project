import { PrismaClient } from '@prisma/client';
import {createMoreInfo} from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    const moreInfo = await createMoreInfo(data) //{id: req_Id, more_info: moreInfo}
    return NextResponse.json({ data: convertBigIntToString(moreInfo) });
    }
    catch(error){
        console.log(error);
                
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 }); 
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}