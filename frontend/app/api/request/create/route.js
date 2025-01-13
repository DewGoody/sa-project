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
    if(data.type === "Health insurance"){
        await prisma.prakan_inter_info.update({
            where: {id: data.formId},
            data: {
                req_id: createRequest.id
            }
        })
    }    
    else if(data.type === "การเบิกจ่ายประกันอุบัติเหตุ"){
        await prisma.accident_info.update({
            where: {id: data.formId},
            data: {
                req_id: createRequest.id
            }
        })
    }
    console.log("createRequest",createRequest);
    return NextResponse.json({ data: convertBigIntToString(createRequest) });
}