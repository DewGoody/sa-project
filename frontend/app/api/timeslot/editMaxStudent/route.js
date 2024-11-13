import { PrismaClient } from '@prisma/client';
import { updateTimeslotMaxStu} from '../../../service/timeslotService'

const prisma = new PrismaClient();

export async function POST(req,res){
    let data = await req.json()
    console.log("data",data);
    const updatedTimeslot = await updateTimeslotMaxStu(data.id, data.maxStu)
    return updatedTimeslot
}