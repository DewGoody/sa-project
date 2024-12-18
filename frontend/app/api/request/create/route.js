import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'


const prisma = new PrismaClient();

export async function POST(req,res){
    let data = await req.json()
    console.log("data",data);
    
    const createRequest = await prisma.request.create({
        data: {
            type: data.type,
            status: "รอจองคิว",
            stu_id: data.stuId,
        }
    })    
    console.log("createRequest",createRequest);
    return NextResponse.json({ data: convertBigIntToString(createRequest) });
}