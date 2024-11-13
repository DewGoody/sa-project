import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req,res){
    let data = await req.json()
    console.log("data",data);
    
    const createRequest = await prisma.request.create({
        data: {
            type: data.type,
            status: "รอจองคิว",
        }
    })
    return createRequest
}