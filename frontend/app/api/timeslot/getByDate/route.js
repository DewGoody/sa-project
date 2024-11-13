import { PrismaClient } from '@prisma/client';
import { getTimeslotByDate } from '../../../service/timeslotService'

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        let data = await req.json()
        console.log("data", data);
        const timeslot = await getTimeslotByDate(data.date)
        return timeslot
    }
    catch (error) {
        if (!error.code) {
            return res.status(500).json({ message: "Server error" })
        }
        return res.status(error.code).json({ message: error.error?.message })
    }
}