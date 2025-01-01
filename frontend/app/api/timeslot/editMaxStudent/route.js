import { PrismaClient } from '@prisma/client';
import { updateTimeslotMaxStu } from '../../../service/timeslotService'

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        let data = await req.json()
        console.log("data", data);
        const updatedTimeslot = await updateTimeslotMaxStu(data.id, data.maxStu)
        return updatedTimeslot
    }
    catch (error) {
        if (!error.code) {
            return res.status(500).json({ message: "Server error" })
        }
        return res.status(error.code).json({ message: error.error?.message })
    }
}