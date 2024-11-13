import { PrismaClient } from '@prisma/client';
import {createQueue} from '../../../service/queueService'

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    console.log("data",data);
    const createdQueue = await createQueue(data.studentId, data.reqId, data.timeslotId, data.period)
    return createdQueue
    }
    catch(error){
        if(!error.code){
            return res.status(500).json({message: "Server error"})
        }
        return res.status(error.code).json({ message: error.error?.message })
    }
}