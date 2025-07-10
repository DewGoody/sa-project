import { PrismaClient } from '@prisma/client';
import { getUniqueYearRD } from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    const years = await getUniqueYearRD()
    return NextResponse.json({ data: convertBigIntToString(years) });
    }
    catch(error){      
        console.log(error);
          
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}