import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        let data = await req.json()
        console.log("data", data);

        const createTimeslot = await prisma.timeslot.create({
            data: {
                date: data.date,
                period: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                is_full: [false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                max_stu: 5
            }
        })
        return createTimeslot
    }
    catch (error) {
        if (!error.code) {
            return res.status(500).json({ message: "Server error" })
        }
        return res.status(error.code).json({ message: error.error?.message })
    }
}