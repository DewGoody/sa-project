import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req,res){
    let data = await req.json()
    console.log("data",data);
    
    const createTimeslot = await prisma.timeslot.create({
        data: {
            date: data.date,
            period: [],
            is_full: [],
            max_stu: 5
        }
    })
    return createTimeslot
}